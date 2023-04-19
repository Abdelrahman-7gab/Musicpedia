export default async (req, context) => {
    const url = new URL(req.url);
    const type = url.searchParams.get('type');
    const id = url.searchParams.get('id');

    const response = await fetch(`https://api.deezer.com/${type}/${id}`);
    const data = await response.json();

    return new Response(JSON.stringify(data), {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    });


 }

