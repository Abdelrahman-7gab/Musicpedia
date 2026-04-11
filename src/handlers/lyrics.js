import { parseHTML } from 'linkedom';

const GENIUS_PAGE_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (compatible; Cloudflare Worker)'
};

const MODERN_LYRICS_SELECTOR = '[data-lyrics-container="true"]';
const LEGACY_LYRICS_SELECTOR = '.lyrics';

const cleanLyrics = (text) => {
  return text
    .replace(/\u00A0/g, ' ')
    .replace(/\u2005/g, ' ')
    .replace(/\r/g, '')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

const normalizeText = (value = '') =>
  value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/&/g, ' and ')
    .replace(/[’‘]/g, "'")
    .replace(/"/g, '')
    .replace(/\b(feat|ft)\.? [^()[\]-]+/gi, ' ')
    .replace(/[()[\]{}]/g, ' ')
    .replace(/[^a-zA-Z0-9]+/g, ' ')
    .trim()
    .toLowerCase();

const normalizeSongTitle = (value = '') =>
  normalizeText(value)
    .replace(/\b(remix|edit|version|live|acoustic|instrumental|radio|mix|remaster(?:ed)?)\b/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();

const scoreHit = (hit, artist, title) => {
  const result = hit?.result ?? {};
  const requestedArtist = normalizeText(artist);
  const requestedTitle = normalizeSongTitle(title);
  const hitArtist = normalizeText(result.primary_artist?.name ?? '');
  const hitTitle = normalizeSongTitle(result.title ?? '');
  const hitFullTitle = normalizeSongTitle(result.full_title ?? '');
  const rawHitTitle = normalizeText(result.title ?? '');
  const rawRequestedTitle = normalizeText(title);
  const hasRequestedRemix = /\b(remix|edit|mix)\b/i.test(title);
  const hitLooksLikeRemix = /\b(remix|edit|mix)\b/i.test(result.title ?? '');

  let score = 0;

  if (hit.type === 'song') score += 120;
  if (result.lyrics_state === 'complete') score += 40;
  if (result.url?.includes('-lyrics')) score += 20;
  if (hitArtist === requestedArtist) score += 120;
  else if (hitArtist.includes(requestedArtist) || requestedArtist.includes(hitArtist)) score += 60;
  if (hitTitle === requestedTitle) score += 180;
  else if (hitFullTitle.includes(requestedTitle)) score += 90;
  else if (rawHitTitle === rawRequestedTitle) score += 120;
  else if (rawHitTitle.includes(rawRequestedTitle) || rawRequestedTitle.includes(rawHitTitle)) score += 50;
  if (hitLooksLikeRemix && !hasRequestedRemix) score -= 40;
  if (!hitArtist) score -= 20;

  return score;
};

const pickBestHit = (hits, artist, title) => {
  const rankedHits = [...hits].sort((left, right) => {
    return scoreHit(right, artist, title) - scoreHit(left, artist, title);
  });

  return rankedHits[0]?.result ?? null;
};

const absolutizeGeniusUrl = (path) => {
  if (!path) return null;
  return path.startsWith('http') ? path : `https://genius.com${path}`;
};

const resolveSongUrl = async (songUrl) => {
  if (!songUrl?.includes('/albums/')) {
    return songUrl;
  }

  const albumRes = await fetch(songUrl, { headers: GENIUS_PAGE_HEADERS });
  if (!albumRes.ok) {
    return songUrl;
  }

  const albumHtml = await albumRes.text();
  const { document } = parseHTML(albumHtml);
  const firstSongLink = document.querySelector('a[href*="-lyrics"]')?.getAttribute('href');

  return absolutizeGeniusUrl(firstSongLink) ?? songUrl;
};

const extractLyricsFromHtml = (html) => {
  const { document } = parseHTML(html);
  const lyricsContainers = [...document.querySelectorAll(MODERN_LYRICS_SELECTOR)];

  if (lyricsContainers.length > 0) {
    const segments = lyricsContainers
      .map((container) => {
        const clone = container.cloneNode(true);

        clone
          .querySelectorAll('[data-exclude-from-selection="true"], script, style')
          .forEach((node) => node.remove());
        clone
          .querySelectorAll('span[style*="opacity:0"], span[style*="pointer-events:none"]')
          .forEach((node) => node.remove());
        clone.querySelectorAll('br').forEach((br) => br.replaceWith('\n'));

        return cleanLyrics(clone.textContent ?? '');
      })
      .filter(Boolean);

    if (segments.length > 0) {
      return segments.join('\n\n');
    }
  }

  const legacyContainer = document.querySelector(LEGACY_LYRICS_SELECTOR);
  if (!legacyContainer) {
    return null;
  }

  const clone = legacyContainer.cloneNode(true);
  clone.querySelectorAll('br').forEach((br) => br.replaceWith('\n'));
  return cleanLyrics(clone.textContent ?? '');
};

export async function handleLyrics(request, env, corsHeaders = {}) {
  const url = new URL(request.url);
  const artist = url.searchParams.get('artist');
  const title = url.searchParams.get('title');

  try {
    if (!artist || !title) {
      return new Response('Missing parameters', {
        status: 400,
        headers: corsHeaders
      });
    }

    const searchUrl = `https://api.genius.com/search?q=${encodeURIComponent(artist)}+${encodeURIComponent(title)}`;
    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${env.GENIUS_ACCESS_TOKEN}` }
    });

    if (!searchRes.ok) {
      throw new Error('Genius API search failed');
    }

    const { response: { hits = [] } = {} } = await searchRes.json();
    if (!hits.length) {
      return new Response('Not found', { status: 404, headers: corsHeaders });
    }

    const songHits = hits.filter((hit) => hit?.type === 'song' || hit?.result?.lyrics_state);
    const bestHit = pickBestHit(songHits.length ? songHits : hits, artist, title);

    if (!bestHit?.url) {
      return new Response('Not found', { status: 404, headers: corsHeaders });
    }

    const songUrl = await resolveSongUrl(bestHit.url);
    const lyricsRes = await fetch(songUrl, {
      headers: GENIUS_PAGE_HEADERS
    });

    if (!lyricsRes.ok) {
      throw new Error('Genius lyrics page fetch failed');
    }

    const html = await lyricsRes.text();
    const cleanedLyrics = extractLyricsFromHtml(html);

    if (!cleanedLyrics) {
      return new Response('Lyrics format changed', {
        status: 500,
        headers: corsHeaders
      });
    }

    return Response.json(cleanedLyrics, {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        ...corsHeaders
      }
    });
  } catch (error) {
    console.error(`Lyrics error: ${error.message}`, {
      url: request.url,
      artist,
      title
    });

    return new Response(error.message, {
      status: 500,
      headers: corsHeaders
    });
  }
}
