<?php
require_once 'config.php';
require_once 'auth/middleware.php';
requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$input = getJSONInput();
$imageData = $input['image'] ?? null;   // base64-encoded image data (no data URI prefix)
$mimeType  = $input['mime_type'] ?? 'image/jpeg';

if (!$imageData) {
    sendError('image is required');
}

$allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
if (!in_array($mimeType, $allowedMimes)) {
    sendError('Unsupported image type. Use JPEG, PNG, WebP, or GIF.');
}

$apiKey = defined('ANTHROPIC_API_KEY') ? ANTHROPIC_API_KEY : null;
if (!$apiKey) {
    sendError('Anthropic API key not configured', 500);
}

$prompt = <<<PROMPT
You are performing OCR on a photo of Magic: The Gathering cards spread out on a table.

The cards may be oriented in any direction — rotated 90°, upside down, or at an angle. Card names are printed along the top edge of each card, so in a spread they will often appear sideways or vertically in the photo. You must read the name text regardless of its orientation — mentally rotate each card to read it.

Your task is to READ the printed name text on each visible card. Do not guess, infer, or use card artwork to identify cards. Do not use your knowledge of deck archetypes or themes. Only return a card if you can actually read its name text in the image.

Important rules:
- Read the NAME LINE printed on each card — that is the only source of truth
- Cards may be rotated — tilt your reading of the text to match each card's orientation
- If a card's name is obscured, cut off, or unreadable, skip it entirely
- Do NOT infer names from artwork, colors, or card type
- Do NOT generate a deck list based on the theme or archetype you recognize
- It is better to return fewer correct names than many hallucinated ones

For each card whose name you can read, also assess whether it appears to be a photocopy/proxy:
- Noticeably lower print quality, pixelation, or blurriness compared to real cards
- Matte/flat appearance where a real card would have gloss or texture
- Slight color shifts, washed-out colors, or inkjet-style banding
- Card borders that look thin, uneven, or slightly off
- Text or art that looks like it was printed on a home printer

Return ONLY a JSON array of objects with no additional text, explanation, or markdown.

Example output:
[{"name":"Smothering Tithe","proxy":false},{"name":"Cultivate","proxy":true},{"name":"Command Tower","proxy":false}]
PROMPT;

$payload = [
    'model'      => 'claude-opus-4-6',
    'max_tokens' => 1024,
    'messages'   => [
        [
            'role'    => 'user',
            'content' => [
                [
                    'type'   => 'image',
                    'source' => [
                        'type'       => 'base64',
                        'media_type' => $mimeType,
                        'data'       => $imageData,
                    ],
                ],
                [
                    'type' => 'text',
                    'text' => $prompt,
                ],
            ],
        ],
    ],
];

$ch = curl_init('https://api.anthropic.com/v1/messages');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => json_encode($payload),
    CURLOPT_HTTPHEADER     => [
        'Content-Type: application/json',
        'x-api-key: ' . $apiKey,
        'anthropic-version: 2023-06-01',
    ],
    CURLOPT_TIMEOUT        => 60,
]);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$curlError = curl_error($ch);
// curl_close() deprecated & no-op since PHP 8.0 — omitted intentionally

if ($curlError) {
    sendError('Failed to reach Anthropic API: ' . $curlError, 502);
}

$data = json_decode($response, true);

if ($httpCode !== 200) {
    $errMsg = $data['error']['message'] ?? 'Anthropic API error';
    sendError('Vision API error: ' . $errMsg, 502);
}

$text = $data['content'][0]['text'] ?? '';

// Extract the JSON array from the response text
$decoded = null;
if (preg_match('/\[.*\]/s', $text, $matches)) {
    $decoded = json_decode($matches[0], true);
}

if (!is_array($decoded)) {
    sendError('Could not parse card names from vision response', 502);
}

// Normalize: accept both [{name, proxy}] and ["name"] formats
$cards = [];
$seen  = [];
foreach ($decoded as $item) {
    if (is_string($item)) {
        $name  = trim($item);
        $proxy = false;
    } elseif (is_array($item) && !empty($item['name'])) {
        $name  = trim($item['name']);
        $proxy = !empty($item['proxy']);
    } else {
        continue;
    }
    if (!$name || isset($seen[$name])) continue;
    $seen[$name] = true;
    $cards[] = ['name' => $name, 'proxy' => $proxy];
}

sendJSON(['cards' => $cards]);
