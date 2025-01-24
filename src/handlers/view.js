export async function handleView(request, env) {
  try {
    const url = new URL(request.url);
    const type = url.searchParams.get('type');
    const id = url.searchParams.get('id');

    if (!type || !id) {
      return new Response('Missing type or id parameters', { status: 400 });
    }

    const apiUrl = `${env.DEEZER_API}/${type}/${id}`;
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
