<?php
/**
 * Shared Scryfall access helpers: HTTP fetch, card normalisation,
 * /cards/collection batching, and /cards/search passthrough.
 *
 * Nothing here touches the database. These are pure HTTP and shaping helpers,
 * so both the HTTP endpoint (scryfall-cache.php) and the CLI cache scripts can
 * require this file regardless of how they bootstrap their DB connection.
 */

// One User-Agent for every Scryfall call. Keep the version in sync with
// apps/core/package.json on release.
if (!defined('SCRYFALL_USER_AGENT')) {
    define('SCRYFALL_USER_AGENT', 'CommanderCollector/5.18.0');
}
if (!defined('SCRYFALL_API_BASE')) {
    define('SCRYFALL_API_BASE', 'https://api.scryfall.com');
}

/**
 * Low-level GET. Returns [httpCode, decodedBodyOrNull, curlError].
 * decodedBody is the associative array on a 200 with valid JSON, else null.
 */
function scryfallGet(string $url, int $timeout = 15): array {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => $timeout,
        CURLOPT_HTTPHEADER     => ['User-Agent: ' . SCRYFALL_USER_AGENT],
    ]);
    $raw       = curl_exec($ch);
    $code      = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);

    if ($curlError || $code !== 200 || $raw === false) {
        return [$code, null, $curlError];
    }

    $decoded = json_decode($raw, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        return [$code, null, 'JSON parse error: ' . json_last_error_msg()];
    }
    return [$code, $decoded, ''];
}

/**
 * GET /cards/named?fuzzy=<name>. Returns the card array, or null if not found.
 */
function scryfallFetchNamed(string $name): ?array {
    $url = SCRYFALL_API_BASE . '/cards/named?fuzzy=' . urlencode($name);
    [, $card] = scryfallGet($url);
    return isset($card['id']) ? $card : null;
}

/**
 * GET /cards/<id>. Returns the card array, or null on any non-200 / bad body.
 */
function scryfallFetchById(string $scryfallId): ?array {
    $url = SCRYFALL_API_BASE . '/cards/' . urlencode($scryfallId);
    [, $card] = scryfallGet($url);
    return isset($card['id']) ? $card : null;
}

/**
 * POST /cards/collection — batch lookup, max 75 identifiers per Scryfall call.
 * Pages internally. Returns [foundCards[], notFoundIdentifiers[]].
 *
 * @param array $identifiers e.g. [['name' => 'Sol Ring'], ['id' => '<uuid>']]
 */
function scryfallCollection(array $identifiers): array {
    $found   = [];
    $missing = [];
    $chunks  = array_chunk($identifiers, 75);

    foreach ($chunks as $i => $chunk) {
        $payload = json_encode(['identifiers' => array_values($chunk)]);

        $ch = curl_init(SCRYFALL_API_BASE . '/cards/collection');
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => $payload,
            CURLOPT_TIMEOUT        => 30,
            CURLOPT_HTTPHEADER     => [
                'Content-Type: application/json',
                'User-Agent: ' . SCRYFALL_USER_AGENT,
            ],
        ]);
        $raw  = curl_exec($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if ($raw === false || $code !== 200) {
            // Signal a failed chunk so callers can decide how to degrade.
            $missing[] = ['_chunk_error' => $code, '_chunk' => $chunk];
            if (count($chunks) > 1) usleep(100000);
            continue;
        }

        $data = json_decode($raw, true);
        foreach ($data['data'] ?? [] as $card) {
            $found[] = $card;
        }
        foreach ($data['not_found'] ?? [] as $nf) {
            $missing[] = $nf;
        }

        // Respect Scryfall's rate limit between batches.
        if (count($chunks) > 1) usleep(100000);
    }

    return [$found, $missing];
}

/**
 * GET /cards/search. Returns the decoded response (['data' => [...]] etc.) or
 * null on any non-200 (Scryfall returns 404 for a search with zero matches).
 *
 * @param array $opts unique|order|dir|page overrides.
 */
function scryfallSearch(string $q, array $opts = []): ?array {
    $params = [
        'q'      => $q,
        'unique' => $opts['unique'] ?? 'cards',
        'order'  => $opts['order']  ?? 'name',
        'page'   => $opts['page']   ?? 1,
    ];
    if (isset($opts['dir'])) $params['dir'] = $opts['dir'];

    $url = SCRYFALL_API_BASE . '/cards/search?' . http_build_query($params);
    [, $data] = scryfallGet($url);
    return $data;
}

/**
 * GET /cards/autocomplete. Returns Scryfall's raw prefix-match name list.
 */
function scryfallAutocompleteNames(string $q): array {
    $url = SCRYFALL_API_BASE . '/cards/autocomplete?' . http_build_query([
        'q'              => $q,
        'include_extras' => 'false',
    ]);
    [, $data] = scryfallGet($url);
    return $data['data'] ?? [];
}

/**
 * Normalise a raw Scryfall card into our scryfall_card_cache row shape.
 * This is the superset every caller reads from (CLI scripts that do not persist
 * every column simply ignore the ones they do not need).
 */
function normaliseScryfallCard(array $card): array {
    $imageUri = $card['image_uris']['normal']
        ?? $card['card_faces'][0]['image_uris']['normal']
        ?? null;

    // Double-faced cards: grab the back-face image if present.
    $backImageUri = $card['card_faces'][1]['image_uris']['normal'] ?? null;

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
