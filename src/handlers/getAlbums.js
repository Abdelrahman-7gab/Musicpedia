export async function handleGetAlbums(request, env) {
  try {
    const url = new URL(request.url);
    const artistID = url.searchParams.get('artistID');

    if (!artistID) {
      return new Response('Missing artistID parameter', { status: 400 });
    }

    const apiUrl = `${env.DEEZER_API}/artist/${artistID}/albums`;
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
