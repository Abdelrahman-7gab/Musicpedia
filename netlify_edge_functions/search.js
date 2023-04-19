export default async (req, context) => {
    const url = new URL(req.url);
    const type = url.searchParams.get('type');
    const query = url.searchParams.get('query');

    // get response from `https://api.deezer.com/search/${searchType}?q=${qsearchQuery}`
    const response = await fetch(`https://api.deezer.com/search/${type}?q=${query}`);
    const data = await response.json();

    return new Response(JSON.stringify(data), {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    });
    

 }

