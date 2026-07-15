<?php
require_once 'config.php';
require_once 'auth/middleware.php';
require_once 'lib/scryfall-helpers.php';
// JWT (host board) or a valid live-game session code (unauthenticated remote).
requireAuthOrSessionCode();

$method = $_SERVER['REQUEST_METHOD'];

// ── Helper: insert/update one row in the cache ────────────────────────────────
function cacheCard(PDO $db, array $row): void {
    $newId = $db->query("SELECT UUID()")->fetchColumn();
    $stmt = $db->prepare(
        'INSERT INTO scryfall_card_cache
            (id, scryfall_id, name, image_uri, back_image_uri, colors, color_identity, type_line, mana_cost)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        $newId,
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

// ── Helper: build the commander/partner typeahead query ───────────────────────
// The query syntax lives here on the server, so the browser never constructs
// Scryfall search strings directly.
function buildSearchQuery(string $mode, string $q, bool $backgroundEligible): ?string {
    switch ($mode) {
        case 'commander':
            return "name:{$q} (t:legendary pow>=0 OR o:\"can be your commander\")";
        case 'partner':
            $bgClause = $backgroundEligible ? ' OR t:background' : '';
            return "name:{$q} (t:legendary (kw:partner OR kw:friends-forever OR kw:doctor's-companion) OR o:\"can be your commander\"{$bgClause})";
        default:
            return null;
    }
}

// ── GET ?action=search — Scryfall passthrough (autocomplete/commander/partner/query)
if ($method === 'GET' && ($_GET['action'] ?? '') === 'search') {
    $mode = trim($_GET['mode'] ?? 'autocomplete');
    $q    = trim($_GET['q'] ?? '');

    if (strlen($q) < 2) {
        if ($mode === 'query') sendJSON(['names' => [], 'hasMore' => false]);
        sendJSON($mode === 'autocomplete' ? ['names' => []] : ['results' => []]);
    }

    // Prefix autocomplete via Scryfall's /cards/autocomplete. Drops "X // X"
    // merged-face aliases and case-insensitive duplicates.
    if ($mode === 'autocomplete') {
        $seen = [];
        $out  = [];
        foreach (scryfallAutocompleteNames($q) as $name) {
            $halves = explode(' // ', $name);
            if (count($halves) === 2 && strtolower(trim($halves[0])) === strtolower(trim($halves[1]))) {
                continue;
            }
            $key = strtolower($name);
            if (isset($seen[$key])) continue;
            $seen[$key] = true;
            $out[] = $name;
        }
        sendJSON(['names' => $out]);
    }

    // Full Scryfall-syntax search with pagination. Optional result filters are
    // appended here so the browser never assembles Scryfall filter terms.
    if ($mode === 'query') {
        $page  = max(1, (int) ($_GET['page'] ?? 1));
        $query = $q;
        if (($_GET['commander'] ?? '') === '1' && strpos($query, 'is:commander') === false) {
            $query .= ' is:commander';
        }
        if (($_GET['partner'] ?? '') === '1' && strpos($query, 'kw:partner') === false) {
            $query .= ' kw:partner';
        }
        $identity = trim($_GET['identity'] ?? '');
        if ($identity !== '' && strpos($query, 'id:') === false && strpos($query, 'id<=') === false) {
            $query .= ' id<=' . $identity;
        }

        $data = scryfallSearch($query, ['unique' => 'names', 'order' => 'name', 'page' => $page]);
        sendJSON([
            'names'   => array_map(fn($c) => $c['name'], $data['data'] ?? []),
            'hasMore' => $data['has_more'] ?? false,
        ]);
    }

    // Commander / partner typeahead: returns [{name, mana_cost}].
    $bg    = ($_GET['bg'] ?? '') === '1';
    $query = buildSearchQuery($mode, $q, $bg);
    if ($query === null) {
        sendError("Unknown search mode: {$mode}");
    }

    $data  = scryfallSearch($query, ['unique' => 'names', 'order' => 'name']);
    $results = array_map(
        fn($c) => ['name' => $c['name'], 'mana_cost' => $c['mana_cost'] ?? null],
        $data['data'] ?? []
    );
    sendJSON(['results' => $results]);
}

// ── GET ?action=card&name= — live card detail (oracle_text + art_crop) ────────
// Returns fields the cache row does not store. Not persisted.
if ($method === 'GET' && ($_GET['action'] ?? '') === 'card') {
    $name = trim($_GET['name'] ?? '');
    if (!$name) sendError('name parameter is required');

    $card = scryfallFetchNamed($name);
    if (!$card) sendJSON(null);

    sendJSON([
        'name'           => $card['name'],
        'oracle_text'    => $card['oracle_text'] ?? $card['card_faces'][0]['oracle_text'] ?? '',
        'color_identity' => $card['color_identity'] ?? [],
        'art_crop'       => $card['image_uris']['art_crop']
                            ?? $card['card_faces'][0]['image_uris']['art_crop']
                            ?? null,
        'image_uri'      => $card['image_uris']['normal']
                            ?? $card['card_faces'][0]['image_uris']['normal']
                            ?? null,
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

    $card = scryfallFetchNamed($name);
    if (!$card) sendJSON(null);

    $row = normaliseScryfallCard($card);
    cacheCard($db, $row);

    $fetched = $db->prepare('SELECT id, cached_at FROM scryfall_card_cache WHERE scryfall_id = ? LIMIT 1');
    $fetched->execute([$row['scryfall_id']]);
    $cached = $fetched->fetch(PDO::FETCH_ASSOC);
    $row['id']         = $cached['id'] ?? null;
    $row['cached_at']  = $cached['cached_at'] ?? date('Y-m-d H:i:s');
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

    // Batch uncached names through the shared /cards/collection helper.
    $identifiers = array_map(fn($n) => ['name' => $n], $uncached);
    [$found, $notFound] = scryfallCollection($identifiers);

    foreach ($found as $card) {
        $row = normaliseScryfallCard($card);
        cacheCard($db, $row);
        $results[$card['name']] = $row;
    }

    // Mark anything Scryfall could not find (skip internal chunk-error markers).
    foreach ($notFound as $nf) {
        if (isset($nf['_chunk_error'])) {
            foreach ($nf['_chunk'] as $ident) {
                $reqName = $ident['name'] ?? '';
                if ($reqName && !isset($results[$reqName])) {
                    $results[$reqName] = ['name' => $reqName, 'error' => 'lookup failed'];
                }
            }
            continue;
        }
        $reqName = $nf['name'] ?? '';
        if ($reqName && !isset($results[$reqName])) {
            $results[$reqName] = ['name' => $reqName, 'error' => 'not found'];
        }
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
