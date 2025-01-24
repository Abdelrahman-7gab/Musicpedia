export async function handleSearch(request, env) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const query = url.searchParams.get('query');

    if (!type || !query) {
      return new Response('Missing type or query parameters', { status: 400 });
    }

    const apiUrl = `${env.DEEZER_API}/search/${type}?q=${encodeURIComponent(query)}`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    return Response.json(data, {
      headers: {
        'content-type': 'application/json;charset=UTF-8',
        'Access-Control-Allow-Origin': '*'
      }
    });
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
