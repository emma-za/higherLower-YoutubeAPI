const JSON_HEADERS = {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store"
};

function jsonResponse(payload, status = 200) {
    return new Response(JSON.stringify(payload), {
        status,
        headers: JSON_HEADERS
    });
}

async function requestYouTube(resource, params) {
    const apiUrl = new URL(`https://www.googleapis.com/youtube/v3/${resource}`);
    Object.entries(params).forEach(([key, value]) => {
        apiUrl.searchParams.set(key, value);
    });

    const response = await fetch(apiUrl);
    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const message = data?.error?.message || `YouTube API returned HTTP ${response.status}`;
        throw new Error(message);
    }

    if (!data) {
        throw new Error("YouTube API returned an invalid response");
    }

    return data;
}

export default {
    async fetch(request) {
        if (request.method !== "GET") {
            return jsonResponse({ error: "Method not allowed" }, 405);
        }

        const apiKey = process.env.YOUTUBE_API_KEY;

        if (!apiKey) {
            return jsonResponse({ error: "YouTube API key is not configured" }, 500);
        }

        const requestUrl = new URL(request.url);
        const videoId = requestUrl.searchParams.get("id")?.trim() || "";

        if (!/^[A-Za-z0-9_-]{11}$/.test(videoId)) {
            return jsonResponse({ error: "Invalid YouTube video ID" }, 400);
        }

        try {
            const videoData = await requestYouTube("videos", {
                id: videoId,
                key: apiKey,
                part: "snippet,statistics"
            });

            const video = videoData.items?.[0];

            if (!video) {
                return jsonResponse({ error: "Video not found" }, 404);
            }

            const channelData = await requestYouTube("channels", {
                id: video.snippet.channelId,
                key: apiKey,
                part: "snippet"
            });

            const channel = channelData.items?.[0];

            return jsonResponse({
                videoId,
                title: video.snippet.title,
                thumb:
                    video.snippet.thumbnails.high?.url ||
                    video.snippet.thumbnails.medium?.url ||
                    video.snippet.thumbnails.default?.url ||
                    "",
                views: Number(video.statistics.viewCount || 0),
                icon: channel?.snippet?.thumbnails?.default?.url || ""
            });
        } catch (error) {
            console.error("YouTube proxy error:", error.message);
            return jsonResponse({ error: error.message }, 502);
        }
    }
};
