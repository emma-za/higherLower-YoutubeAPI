<?php
header("Content-Type: application/json");

// Incluye la key desde fuera de public_html
$API_KEY = getenv('YOUTUBE_API_KEY');

if (!$API_KEY) {
    http_response_code(500);
    echo json_encode([
        'error' => 'YouTube API key is not configured'
    ]);
    exit;
}

// Llamada a la API de YouTube
$videoUrl = "https://www.googleapis.com/youtube/v3/videos?id={$videoId}&key={$API_KEY}&part=snippet,statistics";
$videoData = file_get_contents($videoUrl);
$videoJson = json_decode($videoData, true);

if (empty($videoJson['items'])) {
    echo json_encode(["error" => "Video not found"]);
    exit;
}

$v = $videoJson['items'][0];

// Llamada a la API de YouTube para el canal
$channelId = $v['snippet']['channelId'];
$channelUrl = "https://www.googleapis.com/youtube/v3/channels?id={$channelId}&key={$API_KEY}&part=snippet";
$channelData = file_get_contents($channelUrl);
$channelJson = json_decode($channelData, true);

$response = [
    "videoId" => $videoId,
    "title" => $v['snippet']['title'],
    "thumb" => $v['snippet']['thumbnails']['high']['url'],
    "views" => intval($v['statistics']['viewCount']),
    "icon" => $channelJson['items'][0]['snippet']['thumbnails']['default']['url']
];

echo json_encode($response);

?>
