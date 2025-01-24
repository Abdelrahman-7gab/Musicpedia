import { handleGetAlbums } from './handlers/getAlbums.js';
import { handleSearch } from './handlers/search.js';
import { handleView } from './handlers/view.js';
import { handleLyrics } from './handlers/lyrics.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Route requests
    switch(url.pathname) {
      case '/api/search':
        return handleSearch(request, env);
      case '/api/view':
        return handleView(request, env);
      case '/api/albums':
        return handleGetAlbums(request, env);
      case '/api/lyrics':
        return handleLyrics(request, env);
      default:
        return new Response('Not Found', { status: 404 });
    }
  }
}
