<?php
require_once 'config.php';
require_once 'auth/middleware.php';
requireAuth();

$method = $_SERVER['REQUEST_METHOD'];

// ── Helper: fetch one card from Scryfall by fuzzy name via cURL ──────────────
function scryfallFetch(string $name): ?array {
    $url = 'https://api.scryfall.com/cards/named?fuzzy=' . urlencode($name);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_HTTPHEADER     => ['User-Agent: CommanderCollector/1.31.0'],
    ]);
    $raw  = curl_exec($ch);
    $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    // curl_close deprecated & no-op in PHP 8+

    if (!$raw || $code !== 200) {
        return null;
    }

    $card = json_decode($raw, true);
    return isset($card['id']) ? $card : null;
}

// ── Helper: normalise a Scryfall card array into our cache row ────────────────
function normaliseCard(array $card): array {
    $imageUri = $card['image_uris']['normal']
        ?? $card['card_faces'][0]['image_uris']['normal']
        ?? null;

    // Double-faced cards: grab the back face image
    $backImageUri = null;
    if (isset($card['card_faces'][1]['image_uris']['normal'])) {
        $backImageUri = $card['card_faces'][1]['image_uris']['normal'];
    }

    return [
        'scryfall_id'    => $card['id'],
        'name'           => $card['name'],
        'image_uri'      => $imageUri,
        'back_image_uri' => $backImageUri,
        'colors'         => implode('', $card['colors'] ?? []),
        'color_identity' => implode('', $card['color_identity'] ?? []),
        'type_line'      => $card['type_line'] ?? null,
        'mana_cost'      => $card['mana_cost'] ?? null,
    ];
}

// ── Helper: insert/update one row in the cache ────────────────────────────────
function cacheCard(PDO $db, array $row): void {
    $stmt = $db->prepare(
        'INSERT INTO scryfall_card_cache
            (scryfall_id, name, image_uri, back_image_uri, colors, color_identity, type_line, mana_cost)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            image_uri = VALUES(image_uri),
            back_image_uri = VALUES(back_image_uri),
            colors = VALUES(colors),
            color_identity = VALUES(color_identity),
            type_line = VALUES(type_line),
            mana_cost = VALUES(mana_cost),
            cached_at = CURRENT_TIMESTAMP'
    );
    $stmt->execute([
        $row['scryfall_id'],
        $row['name'],
        $row['image_uri'],
        $row['back_image_uri'] ?? null,
        $row['colors'],
        $row['color_identity'],
        $row['type_line'],
        $row['mana_cost'],
    ]);
}

// ── GET ?name=<card name> ─────────────────────────────────────────────────────
if ($method === 'GET') {
    $name = trim($_GET['name'] ?? '');
    if (!$name) sendError('name parameter is required');

    $db   = getDB();
    $stmt = $db->prepare('SELECT * FROM scryfall_card_cache WHERE LOWER(name) = LOWER(?) LIMIT 1');
    $stmt->execute([$name]);
    $cached = $stmt->fetch();

    if ($cached) {
        // Re-fetch DFCs missing back_image_uri (cached before DFC support)
        $isDfc = str_contains($cached['name'], '//');
        if (!$isDfc || $cached['back_image_uri']) {
            sendJSON($cached);
        }
        // Fall through to re-fetch from Scryfall
    }

    $card = scryfallFetch($name);
    if (!$card) sendJSON(null);

    $row = normaliseCard($card);
    cacheCard($db, $row);

    $row['id']         = (int) $db->lastInsertId() ?: null;
    $row['cached_at']  = date('Y-m-d H:i:s');
    sendJSON($row);
}

// ── POST { "names": [...] } — bulk lookup via Scryfall collection endpoint ────
elseif ($method === 'POST') {
    $input = getJSONInput();
    $names = $input['names'] ?? [];
    if (!is_array($names) || empty($names)) sendError('names array is required');

    $db      = getDB();
    $results = [];

    // Separate cached from uncached
    $uncached = [];
    foreach ($names as $name) {
        $name = trim($name);
        if (!$name) continue;

        $stmt = $db->prepare('SELECT * FROM scryfall_card_cache WHERE LOWER(name) = LOWER(?) LIMIT 1');
        $stmt->execute([$name]);
        $cached = $stmt->fetch();

        if ($cached) {
            // Re-fetch DFCs missing back_image_uri (cached before DFC support)
            $isDfc = str_contains($cached['name'], '//');
            if ($isDfc && !$cached['back_image_uri']) {
                $uncached[] = $name;
            } else {
                $results[$name] = $cached;
            }
        } else {
            $uncached[] = $name;
        }
    }

    // Batch uncached names using Scryfall /cards/collection (max 75 per request)
    $chunks = array_chunk($uncached, 75);
    foreach ($chunks as $chunk) {
        $identifiers = array_map(fn($n) => ['name' => $n], $chunk);
        $payload     = json_encode(['identifiers' => $identifiers]);

        $ch = curl_init('https://api.scryfall.com/cards/collection');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $payload,
            CURLOPT_TIMEOUT        => 30,
            CURLOPT_HTTPHEADER     => [
                'Content-Type: application/json',
                'User-Agent: CommanderCollector/1.31.0',
            ],
        ]);
        $raw  = curl_exec($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if (!$raw || $code !== 200) {
            // Fall back to marking all in this chunk as not found
            foreach ($chunk as $name) {
                $results[$name] = ['name' => $name, 'error' => 'lookup failed'];
            }
            continue;
        }

        $data = json_decode($raw, true);
        foreach ($data['data'] ?? [] as $card) {
            $row = normaliseCard($card);
            cacheCard($db, $row);
            $results[$card['name']] = $row;
            // Also map the original requested name (fuzzy match may return different canonical name)
        }

        // Mark anything Scryfall said it couldn't find
        foreach ($data['not_found'] ?? [] as $nf) {
            $reqName = $nf['name'] ?? '';
            if ($reqName && !isset($results[$reqName])) {
                $results[$reqName] = ['name' => $reqName, 'error' => 'not found'];
            }
        }

        // Respect Scryfall rate limit between batch requests
        if (count($chunks) > 1) usleep(100000);
    }

    // Return results in the same order as the input names
    $ordered = [];
    foreach ($names as $name) {
        $name = trim($name);
        if (!$name) continue;
        // Match by canonical name or original name
        $ordered[] = $results[$name] ?? ['name' => $name, 'error' => 'not found'];
    }

    sendJSON(['results' => $ordered]);
}

else {
    sendError('Method not allowed', 405);
}
