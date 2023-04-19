export default async (req, context) => {
    const url = new URL(req.url);
    const artistID = url.searchParams.get('artistID');

    // get response from  `https://api.deezer.com/artist/${artistID}/albums`

    const response = await fetch(`https://api.deezer.com/artist/${artistID}/albums`);
    const data = await response.json();

    return new Response(JSON.stringify(data), {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    });

 }

