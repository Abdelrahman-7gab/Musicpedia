import { handleGetAlbums } from './handlers/getAlbums.js';
import { handleSearch } from './handlers/search.js';
import { handleView } from './handlers/view.js';
import { handleLyrics } from './handlers/lyrics.js';

const LYRICS_ROUTE = '/api/lyrics';
const LYRICS_SESSION_ROUTE = '/api/lyrics/session';
const SESSION_COOKIE_NAME = 'mp_lyrics_session';
const SESSION_TTL_SECONDS = 60 * 10;
const ALLOWED_LYRICS_ORIGINS = new Set([
  'https://musicpedia.abdelrahman-hegab.com',
  'http://localhost:4200'
]);
const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

const getLyricsOrigin = (request) => {
  const origin = request.headers.get('Origin');
  return origin && ALLOWED_LYRICS_ORIGINS.has(origin) ? origin : null;
};

const createLyricsCorsHeaders = (origin) => {
  if (!origin) {
    return { Vary: 'Origin' };
  }

  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
    Vary: 'Origin'
  };
};

const toBase64Url = (bytes) => {
  let binary = '';

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '');
};

const fromBase64Url = (value) => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/');
  const padding = normalized.length % 4 === 0 ? '' : '='.repeat(4 - (normalized.length % 4));
  const binary = atob(`${normalized}${padding}`);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
};

const parseCookies = (request) => {
  const cookieHeader = request.headers.get('Cookie') ?? '';
  const pairs = cookieHeader
    .split(';')
    .map((value) => value.trim())
    .filter(Boolean);
  const cookies = {};

  for (const pair of pairs) {
    const separatorIndex = pair.indexOf('=');
    if (separatorIndex === -1) continue;

    const name = pair.slice(0, separatorIndex).trim();
    const value = pair.slice(separatorIndex + 1).trim();
    cookies[name] = value;
  }

  return cookies;
};

const getClientIp = (request) => request.headers.get('CF-Connecting-IP') ?? '';

const getClientUserAgent = (request) => request.headers.get('User-Agent') ?? '';

const isTrustedBrowserRequest = (request, origin) => {
  const referer = request.headers.get('Referer');
  const fetchSite = request.headers.get('Sec-Fetch-Site');

  if (!origin || !referer?.startsWith(origin)) {
    return false;
  }

  if (fetchSite && fetchSite !== 'same-origin' && fetchSite !== 'same-site') {
    return false;
  }

  return true;
};

const importSessionKey = async (secret) =>
  crypto.subtle.importKey(
    'raw',
    textEncoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );

const sha256Base64Url = async (value) => {
  const digest = await crypto.subtle.digest('SHA-256', textEncoder.encode(value));
  return toBase64Url(new Uint8Array(digest));
};

const signPayload = async (payload, secret) => {
  const key = await importSessionKey(secret);
  const signature = await crypto.subtle.sign('HMAC', key, textEncoder.encode(payload));
  return toBase64Url(new Uint8Array(signature));
};

const createSessionToken = async (request, env, origin) => {
  const issuedAt = Math.floor(Date.now() / 1000);
  const payload = {
    exp: issuedAt + SESSION_TTL_SECONDS,
    origin,
    ip: await sha256Base64Url(getClientIp(request)),
    ua: await sha256Base64Url(getClientUserAgent(request))
  };
  const encodedPayload = toBase64Url(textEncoder.encode(JSON.stringify(payload)));
  const signature = await signPayload(encodedPayload, env.LYRICS_SESSION_SECRET);

  return `${encodedPayload}.${signature}`;
};

const verifySessionToken = async (token, request, env, origin) => {
  if (!token || !env.LYRICS_SESSION_SECRET) {
    return false;
  }

  try {
    const [encodedPayload, signature] = token.split('.');
    if (!encodedPayload || !signature) {
      return false;
    }

    const key = await importSessionKey(env.LYRICS_SESSION_SECRET);
    const isValidSignature = await crypto.subtle.verify(
      'HMAC',
      key,
      fromBase64Url(signature),
      textEncoder.encode(encodedPayload)
    );

    if (!isValidSignature) {
      return false;
    }

    const payload = JSON.parse(textDecoder.decode(fromBase64Url(encodedPayload)));
    const now = Math.floor(Date.now() / 1000);
    const expectedIpHash = await sha256Base64Url(getClientIp(request));
    const expectedUserAgentHash = await sha256Base64Url(getClientUserAgent(request));

    return (
      payload.exp > now &&
      payload.origin === origin &&
      payload.ip === expectedIpHash &&
      payload.ua === expectedUserAgentHash
    );
  } catch {
    return false;
  }
};

const createSessionCookie = (token) =>
  `${SESSION_COOKIE_NAME}=${token}; HttpOnly; Secure; SameSite=None; Path=${LYRICS_ROUTE}; Max-Age=${SESSION_TTL_SECONDS}`;

const createExpiredSessionCookie = () =>
  `${SESSION_COOKIE_NAME}=; HttpOnly; Secure; SameSite=None; Path=${LYRICS_ROUTE}; Max-Age=0`;

const handleLyricsSession = async (request, env, origin) => {
  if (!env.LYRICS_SESSION_SECRET) {
    return new Response('Missing session secret', {
      status: 500,
      headers: createLyricsCorsHeaders(origin)
    });
  }

  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', {
      status: 405,
      headers: createLyricsCorsHeaders(origin)
    });
  }

  if (!isTrustedBrowserRequest(request, origin)) {
    return new Response('Forbidden', {
      status: 403,
      headers: createLyricsCorsHeaders(origin)
    });
  }

  const token = await createSessionToken(request, env, origin);

  return new Response(null, {
    status: 204,
    headers: {
      ...createLyricsCorsHeaders(origin),
      'Cache-Control': 'private, no-store',
      'Set-Cookie': createSessionCookie(token)
    }
  });
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const lyricsOrigin = getLyricsOrigin(request);

    if (
      request.method === 'OPTIONS' &&
      (url.pathname === LYRICS_ROUTE || url.pathname === LYRICS_SESSION_ROUTE)
    ) {
      if (!lyricsOrigin) {
        return new Response('Forbidden', { status: 403 });
      }

      return new Response(null, {
        status: 204,
        headers: createLyricsCorsHeaders(lyricsOrigin)
      });
    }

    // Route requests
    switch(url.pathname) {
      case '/api/search':
        return handleSearch(request, env);
      case '/api/view':
        return handleView(request, env);
      case '/api/albums':
        return handleGetAlbums(request, env);
      case '/api/lyrics/session':
        if (!lyricsOrigin) {
          return new Response('Forbidden', { status: 403 });
        }

        return handleLyricsSession(request, env, lyricsOrigin);
      case '/api/lyrics':
        if (!lyricsOrigin || request.method !== 'GET') {
          return new Response('Forbidden', {
            status: 403,
            headers: createLyricsCorsHeaders(lyricsOrigin)
          });
        }

        if (!isTrustedBrowserRequest(request, lyricsOrigin)) {
          return new Response('Forbidden', {
            status: 403,
            headers: {
              ...createLyricsCorsHeaders(lyricsOrigin),
              'Set-Cookie': createExpiredSessionCookie()
            }
          });
        }

        if (
          !(await verifySessionToken(
            parseCookies(request)[SESSION_COOKIE_NAME],
            request,
            env,
            lyricsOrigin
          ))
        ) {
          return new Response('Forbidden', {
            status: 403,
            headers: {
              ...createLyricsCorsHeaders(lyricsOrigin),
              'Set-Cookie': createExpiredSessionCookie()
            }
          });
        }

        return handleLyrics(request, env, {
          ...createLyricsCorsHeaders(lyricsOrigin),
          'Cache-Control': 'private, no-store'
        });
      default:
        return new Response('Not Found', { status: 404 });
    }
  }
}
