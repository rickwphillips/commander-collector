<?php
require_once 'config.php';
require_once 'auth/middleware.php';
requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

// Disable PHP's execution time limit — Anthropic API calls can take 30–60s
set_time_limit(0);

$input = getJSONInput();
$imageData = $input['image'] ?? null;   // base64-encoded image data (no data URI prefix)
$mimeType  = $input['mime_type'] ?? 'image/jpeg';
$findCard  = $input['find_card'] ?? null; // if set, locate this card name and return its bounding box

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

// ── find_card mode: locate a specific card and return its bounding box ─────────
// Skip grayscale preprocessing — color image helps with visual location.
if ($findCard) {
    $cardName = trim((string) $findCard);
    $findPrompt = "You are looking at a photo of Magic: The Gathering cards spread out on a surface.\n"
        . "Find the card named \"" . str_replace('"', '\\"', $cardName) . "\" in this image.\n"
        . "Return ONLY a JSON object with the card's bounding box as fractions of the full image dimensions (values 0.0–1.0):\n"
        . "{\"x\":0.1,\"y\":0.2,\"w\":0.15,\"h\":0.25}\n"
        . "where x,y is the top-left corner and w,h is the width/height of the card.\n"
        . "Add a small amount of padding around the card so the name bar is clearly visible.\n"
        . "If you cannot find the card in the image, return {\"x\":null}";

    $payload = [
        'model'      => 'claude-sonnet-4-6',
        'max_tokens' => 256,
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
                        'text' => $findPrompt,
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

    $response  = curl_exec($ch);
    $httpCode  = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);

    if ($curlError) {
        sendJSON(['crop' => null]);
    }

    $data = json_decode($response, true);
    if ($httpCode !== 200) {
        sendJSON(['crop' => null]);
    }

    $text = $data['content'][0]['text'] ?? '';
    $crop = null;
    if (preg_match('/\{[^}]+\}/s', $text, $matches)) {
        $parsed = json_decode($matches[0], true);
        if (is_array($parsed) && isset($parsed['x']) && $parsed['x'] !== null) {
            $crop = [
                'x' => (float) ($parsed['x'] ?? 0),
                'y' => (float) ($parsed['y'] ?? 0),
                'w' => (float) ($parsed['w'] ?? 0),
                'h' => (float) ($parsed['h'] ?? 0),
            ];
        }
    }

    sendJSON(['crop' => $crop]);
}

// ── Standard card-list scan mode ──────────────────────────────────────────────

// Imagick preprocessing — sharpen text, convert to grayscale
// Grayscale removes colorful card artwork that triggers Claude's recognition
// mode; sharpening makes the name text more legible at small tile sizes.
if (class_exists('Imagick')) {
    try {
        $img = new Imagick();
        $img->readImageBlob(base64_decode($imageData));
        $img->transformImageColorspace(Imagick::COLORSPACE_GRAY);
        $img->unsharpMaskImage(0, 1, 2, 0.05);  // radius, sigma, amount, threshold
        $img->setImageFormat('jpeg');
        $img->setImageCompressionQuality(88);
        $imageData = base64_encode($img->getImageBlob());
        $mimeType  = 'image/jpeg';
        $img->destroy();
    } catch (Exception $e) {
        // If Imagick fails, continue with original image
    }
}

$prompt = <<<PROMPT
You are an OCR system. Your only job is to read the name text printed on Magic: The Gathering cards visible in this photo.

CRITICAL: These cards were gathered at random — they are NOT a curated deck. You cannot use deck themes, color combinations, or archetypes to guess what cards are present. Every single card name you return must come directly from reading the text characters visible in the image. If you cannot see the text, do not include the card.

How card names appear in the image:
- The name is printed in a text bar along the top edge of the card
- Cards may be oriented in any direction (upright, sideways, upside down)
- For sideways cards, the name text runs along one of the long edges — you must tilt your reading to match
- Sleeves, glare, or partial overlap may obscure some names — skip those

Your process for each card:
1. Locate the name text bar (top edge of the card)
2. Read the characters in that bar letter by letter
3. Output exactly what you read — do not autocorrect to a card name you know
4. If you cannot make out the characters clearly, skip the card entirely

Also note whether each card looks like a photocopy or proxy: low print quality, pixelation, matte/flat finish, inkjet banding, or thin/uneven borders.

Return ONLY a raw JSON array — no explanation, no markdown, no other text.
If you cannot read any names, return an empty array.

Format: [{"name":"exact text you read","proxy":false},{"name":"another card","proxy":true}]
PROMPT;

$payload = [
    'model'      => 'claude-sonnet-4-6',
    'max_tokens' => 2048,
    'system'     => 'You are a pure OCR (optical character recognition) system. Your entire function is to read printed text from images exactly as the characters appear. You do not recognize objects, artwork, brands, or game content. You have no knowledge of Magic: The Gathering or any other game. You only see and output literal text characters. You never infer, guess, or fill in text you cannot directly see in the image.',
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
    CURLOPT_TIMEOUT        => 90,
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
    $preview = substr($text, 0, 300);
    sendError('Could not parse card names from vision response. Raw: ' . $preview, 502);
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
