import { DOMParser } from 'https://deno.land/x/deno_dom/deno-dom-wasm.ts';
export default async (req, context) => {
  const url = new URL(req.url);
  const artist = url.searchParams.get("artist");
  const title = url.searchParams.get("title");

  // get Artist object from Genius API

  const request_artist_info = async (artist_name, song_title) => {
    const base_url = "https://api.genius.com";
    const search_url = base_url + `/search?q=${artist_name} ${song_title}&per_page=10`;
    // access environment variable GENIUS_ACCESS_TOKEN from netlify
    const headers = {
      Authorization:
        "Bearer " + Deno.env.get("GENIUS_ACCESS_TOKEN"),
    };
    const response = await fetch(search_url, {
      method: "GET",
      headers: headers,
    });
    return response;
  };

  // Get Genius.com song url's from artist object

  const request_song_url = async (artist_name,song_title) => {
    while (true) {
      const reponse = await request_artist_info(artist_name, song_title);
    const json = await reponse.json();
    return json.response.hits[0].result.url;

    }

  };

    // Get lyrics from Genius.com song url

    const scrape_song_lyrics = async (song_url) => {
        if(song_url == null){
            return "";
        }
        const response = await fetch(song_url);
        const text = await response.text();
        const dom = new DOMParser().parseFromString(text, "text/html");
        let lyrics = dom.getElementsByClassName("lyrics")[0];

        if(lyrics == null){

        // find a div with a class that starts with Lyrics__Container
        lyrics = dom.querySelector("div[class^='Lyrics__Container']");
        }


        // get the inner text of the lyrics div and seperate each child of the div by a new line
        let lyricsText = lyrics.innerHTML.replace(/<br>/g, "\n")
        // remove any remaining html tags
        lyricsText = lyricsText.replace(/<.*?>/g, "")


        return lyricsText;

    };

    let lyrics = await scrape_song_lyrics(await request_song_url(artist, title));


            

  // return the lyrics

  return new Response(JSON.stringify(lyrics), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
  });
};
