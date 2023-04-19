import { createRequire } from "https://deno.land/std/node/module.ts";
const require = createRequire(import.meta.url);
const Genius = require("genius-lyrics");
const lyricsClient = new Genius.Client();;

export default async (req, context) => {
    const url = new URL(req.url);
    const artist = url.searchParams.get('artist');
    const title = url.searchParams.get('title');

    const searches = await lyricsClient.songs.search(artist + " " + title);
    // Pick first one
    const firstSong = searches[0];
    const songLyrics = await firstSong.lyrics();

    return new Response(JSON.stringify(songLyrics), {
        headers: {
            'content-type': 'application/json;charset=UTF-8',
        },
    });




 }

