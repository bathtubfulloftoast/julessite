import 'dotenv/config';

let cache = {};

export async function handler(event, context) {
    const API_KEY = process.env.DISCORD_API_KEY;
    const userid = process.env.PRESENCE_USERID;
    const CACHE_DURATION = 60000;

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

    const url = `https://discord.com/api/v10/users/${userid}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bot ${API_KEY}`,
                'Content-Type': 'application/json; charset=utf-8',
            },
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
