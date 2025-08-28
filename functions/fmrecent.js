import 'dotenv/config';

let cache = {};

export async function handler(event, context) {
    const API_KEY = process.env.LASTFM_API_KEY;
    const USER = "julesfr__";
    const MAXFM = 5;
    const CACHE_DURATION = 1200000;

    if (cache && (Date.now() - cache.timestamp < CACHE_DURATION)) {
        const remainingTime = CACHE_DURATION - (Date.now() - cache.timestamp);
        return {
            statusCode: 200,
            body: JSON.stringify({
                ...cache.data,
                cache_remaining_ms: remainingTime,
            }),
        };
    }

    const url = `http://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${USER}&api_key=${API_KEY}&format=json&limit=${MAXFM}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
        });

        const data = await response.json();

        cache = {
            data,
            timestamp: Date.now(),
        };

        return {
            statusCode: 200,
            body: JSON.stringify({
                ...data,
                cache_remaining_ms: CACHE_DURATION,
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to fetch data" }),
        };
    }
}
