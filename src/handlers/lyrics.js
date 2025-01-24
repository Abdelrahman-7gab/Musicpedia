// src/handlers/lyrics.js
import { parseHTML } from 'linkedom';

// From genius-lyrics source (simplified)
const LYRICS_SELECTORS = [
  '[class*="Lyrics__Root"]',
  'div[class*="LyricsContainer"]',
  '.lyrics',
  '[class^="Lyrics-"]'
];

// In src/handlers/lyrics.js
const cleanLyrics = (text) => {
  return text
    .replace(/\[.*?\]/g, '') // Remove [Verse] annotations
    .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
    .trim();
};

export async function handleLyrics(request, env) {
  try {
    const url = new URL(request.url);
    const artist = url.searchParams.get("artist");
    const title = url.searchParams.get("title");

    if (!artist || !title) {
      return new Response('Missing parameters', {
        status: 400,
        headers: { 'Access-Control-Allow-Origin': '*' }
      });
    }

    // 1. Search via Genius API
    const searchUrl = `https://api.genius.com/search?q=${encodeURIComponent(artist)}+${encodeURIComponent(title)}`;
    const searchRes = await fetch(searchUrl, {
      headers: { Authorization: `Bearer ${env.GENIUS_ACCESS_TOKEN}` }
    });

    if (!searchRes.ok) throw new Error('Genius API search failed');

    const { response: { hits } } = await searchRes.json();
    if (!hits?.length) return new Response('Not found', { status: 404 });

    // 2. Get lyrics page URL
    const songUrl = hits[0].result.url;

    // 3. Scrape using hybrid approach
    const lyricsRes = await fetch(songUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; Cloudflare Worker)' }
    });
    const html = await lyricsRes.text();
    const { document } = parseHTML(html);

    // 4. Extract lyrics using library-inspired logic
    let lyricsContainer;
    for (const selector of LYRICS_SELECTORS) {
      lyricsContainer = document.querySelector(selector);
      if (lyricsContainer) break;
    }

    if (!lyricsContainer) {
      console.error('Lyrics containers tried:', LYRICS_SELECTORS);
      return new Response('Lyrics format changed', { status: 500 });
    }

    // 5. Clean and format lyrics

    for(const br of lyricsContainer.querySelectorAll('br')){
      br.replaceWith('\n');
    }

    const rawLyrics = lyricsContainer.textContent;
    const cleanedLyrics = cleanLyrics(rawLyrics);

    return Response.json(
      cleanedLyrics, {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
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
      headers: { 'Access-Control-Allow-Origin': '*' }
    });
  }
}
