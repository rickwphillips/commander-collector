<?php
// Capture any stray output (notices, warnings) so they don't corrupt the JSON response
ob_start();
ini_set('display_errors', '0');

/**
 * TTS Export — generates a Tabletop Simulator saved-object JSON for a deck or list.
 *
 * All card images are stitched into a 10-column sprite sheet using ImageMagick montage,
 * then saved to PUBLIC_HTML/tts-sheets/ (sibling of php-api/).
 *
 * Custom card images: when dc.custom_image_uri is added to deck_cards / lc.custom_image_uri
 * to list_cards, replace sc.image_uri in the SELECT with:
 *   COALESCE(dc.custom_image_uri, sc.image_uri) AS image_uri
 */

require_once 'config.php';
require_once 'auth/middleware.php';
requireAuth();
set_time_limit(180);

// Ensure Homebrew binaries (montage) are on the PATH for exec()
putenv('PATH=/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:' . getenv('PATH'));

// Local wrapper: flush the output buffer before any error/JSON response
function ttsError(string $msg, int $status = 400): never {
    ob_end_clean();
    sendError($msg, $status);
}

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    ttsError('Method not allowed', 405);
}

// ── Constants ────────────────────────────────────────────────────────────────
const TTS_COLS     = 10;
const TTS_CARD_W   = 488;
const TTS_CARD_H   = 680;
const TTS_MTG_BACK = 'https://i.imgur.com/P7itTqT.jpg';
const TTS_MAX_AGE  = 604800; // 7 days

// ── Input ────────────────────────────────────────────────────────────────────
$deckId = isset($_GET['deck_id']) ? (int)$_GET['deck_id'] : 0;
$listId = isset($_GET['list_id']) ? (int)$_GET['list_id'] : 0;
if (!$deckId && !$listId) ttsError('deck_id or list_id required');

$db = getDB();

// ── Fetch metadata + cards ───────────────────────────────────────────────────
if ($deckId) {
    $r = $db->prepare('SELECT name FROM decks WHERE id = ?');
    $r->execute([$deckId]);
    $meta = $r->fetch();
    if (!$meta) ttsError('Deck not found', 404);
    $exportName = $meta['name'];

    $stmt = $db->prepare('
        SELECT dc.card_name, dc.quantity,
               sc.image_uri,       -- Future: COALESCE(dc.custom_image_uri, sc.image_uri) AS image_uri
               sc.back_image_uri,
               sc.type_line
        FROM deck_cards dc
        LEFT JOIN scryfall_card_cache sc ON dc.scryfall_id = sc.scryfall_id
        WHERE dc.deck_id = ?
        ORDER BY dc.is_commander DESC, dc.card_name ASC
    ');
    $stmt->execute([$deckId]);
} else {
    $r = $db->prepare('SELECT name FROM lists WHERE id = ?');
    $r->execute([$listId]);
    $meta = $r->fetch();
    if (!$meta) ttsError('List not found', 404);
    $exportName = $meta['name'];

    $stmt = $db->prepare('
        SELECT lc.card_name, lc.quantity,
               sc.image_uri,       -- Future: COALESCE(lc.custom_image_uri, sc.image_uri) AS image_uri
               sc.back_image_uri,
               sc.type_line
        FROM list_cards lc
        LEFT JOIN scryfall_card_cache sc ON lc.scryfall_id = sc.scryfall_id
        WHERE lc.list_id = ?
        ORDER BY lc.is_commander DESC, lc.card_name ASC
    ');
    $stmt->execute([$listId]);
}

// Expand by quantity; skip cards without a cached image
$cards = [];
foreach ($stmt->fetchAll() as $card) {
    if (empty($card['image_uri'])) continue;
    $qty = max(1, (int)($card['quantity'] ?? 1));
    for ($i = 0; $i < $qty; $i++) {
        $cards[] = [
            'name'  => $card['card_name'],
            'type'  => $card['type_line'] ?? '',
            'front' => $card['image_uri'],
            'back'  => $card['back_image_uri'] ?? null,
        ];
    }
}
if (empty($cards)) {
    ttsError('No cards with cached images. Open the Decklist view first to sync Scryfall data.', 422);
}

// ── Sheet storage directory ───────────────────────────────────────────────────
// tts-sheets/ lives at PUBLIC_HTML/tts-sheets/ — one level up from php-api/
$sheetsDir = dirname(__DIR__) . '/tts-sheets/';
if (!is_dir($sheetsDir) && !mkdir($sheetsDir, 0755, true)) {
    ttsError('Cannot create sheets directory', 500);
}

// Prune sheets older than 7 days
foreach (glob($sheetsDir . '*.jpg') ?: [] as $f) {
    if (filemtime($f) < time() - TTS_MAX_AGE) @unlink($f);
}

// ── Cache keys ────────────────────────────────────────────────────────────────
$hasDfc    = (bool)array_filter($cards, fn($c) => !empty($c['back']));
$frontKey  = md5(implode('|', array_column($cards, 'front')));
$backKey   = $hasDfc ? md5(implode('|', array_map(fn($c) => $c['back'] ?? TTS_MTG_BACK, $cards))) : null;
$frontPath = $sheetsDir . $frontKey . '-front.jpg';
$backPath  = $backKey   ? $sheetsDir . $backKey  . '-back.jpg'  : null;

// ── Download images in parallel ───────────────────────────────────────────────
function ttsDownloadAll(array $urls): array {
    $mh = curl_multi_init();
    $handles = [];
    foreach ($urls as $i => $url) {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_TIMEOUT        => 20,
            CURLOPT_USERAGENT      => 'MTGCommander-TTS/1.0',
        ]);
        curl_multi_add_handle($mh, $ch);
        $handles[$i] = $ch;
    }
    do { curl_multi_exec($mh, $active); curl_multi_select($mh); } while ($active);

    $tmpFiles = [];
    foreach ($handles as $i => $ch) {
        $data = curl_multi_getcontent($ch);
        $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        if ($data && $code === 200) {
            $tmp = tempnam(sys_get_temp_dir(), 'tts_');
            file_put_contents($tmp, $data);
            $tmpFiles[$i] = $tmp;
        } else {
            $tmpFiles[$i] = null;
        }
        curl_multi_remove_handle($mh, $ch);
    }
    curl_multi_close($mh);
    return $tmpFiles;
}

// ── Stitch sheet with ImageMagick montage ─────────────────────────────────────
function ttsBuildMontage(array $tmpFiles, string $outputPath): bool {
    $files = array_values(array_filter($tmpFiles));
    if (empty($files)) return false;

    $geo  = TTS_CARD_W . 'x' . TTS_CARD_H . '+0+0';
    // Prefix each input with 'jpg:' so ImageMagick can detect the format
    // regardless of the temp file having no extension.
    $args = implode(' ', array_map(fn($f) => escapeshellarg('jpg:' . $f), $files));
    $out  = escapeshellarg($outputPath);
    $cmd  = "montage {$args} -geometry {$geo} -tile " . TTS_COLS . "x -background '#000000' {$out} 2>&1";
    exec($cmd, $result, $code);
    return $code === 0 && file_exists($outputPath);
}

// ── Generate front sheet (cached by content hash) ─────────────────────────────
if (!file_exists($frontPath)) {
    $tmps = ttsDownloadAll(array_column($cards, 'front'));
    if (!ttsBuildMontage($tmps, $frontPath)) {
        foreach ($tmps as $t) if ($t) @unlink($t);
        ttsError('ImageMagick montage failed for front sheet', 500);
    }
    foreach ($tmps as $t) if ($t) @unlink($t);
}

// ── Generate back sheet for DFC decks ────────────────────────────────────────
// Each position uses the card's back face, or the standard MTG back for non-DFCs.
if ($hasDfc && $backPath && !file_exists($backPath)) {
    $backUrls = array_map(fn($c) => $c['back'] ?? TTS_MTG_BACK, $cards);
    $tmps     = ttsDownloadAll($backUrls);
    ttsBuildMontage($tmps, $backPath); // best-effort; falls back to MTG back URL if it fails
    foreach ($tmps as $t) if ($t) @unlink($t);
}

// ── Build public URLs for sheets ──────────────────────────────────────────────
// SCRIPT_NAME e.g. /app/php-api/tts-export.php → dirname twice → /app
// On local dev SCRIPT_NAME is /php-api/tts-export.php → dirname twice → '/' → strip trailing slash
$proto      = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$appBase    = rtrim(dirname(dirname($_SERVER['SCRIPT_NAME'])), '/');
$sheetsBase = $proto . '://' . $_SERVER['HTTP_HOST'] . $appBase . '/tts-sheets/';

$frontUrl = $sheetsBase . basename($frontPath);
$backUrl  = ($hasDfc && $backPath && file_exists($backPath))
          ? $sheetsBase . basename($backPath)
          : TTS_MTG_BACK;

// ── Assemble TTS saved-object JSON ────────────────────────────────────────────
// CardID formula: int(DeckKey) * 100 + position_in_sheet
// Sheet key "1" → base 100; card at position i → CardID 100 + i
$numCards  = count($cards);
$numRows   = (int)ceil($numCards / TTS_COLS);

$deckEntry = [
    'FaceURL'      => $frontUrl,
    'BackURL'      => $backUrl,
    'NumWidth'     => TTS_COLS,
    'NumHeight'    => $numRows,
    'BackIsHidden' => true,
    'UniqueBack'   => $hasDfc,
];

$deckIDs = [];
$objects = [];
foreach ($cards as $i => $card) {
    $cardID    = 100 + $i;
    $deckIDs[] = $cardID;
    $objects[] = [
        'Name'        => 'Card',
        'Nickname'    => $card['name'],
        'Description' => $card['type'],
        'CardID'      => $cardID,
        'CustomDeck'  => ['1' => $deckEntry],
        'Transform'   => [
            'posX' => 0.0, 'posY' => 0.0, 'posZ' => 0.0,
            'rotX' => 0.0, 'rotY' => 180.0, 'rotZ' => 180.0,
            'scaleX' => 1.0, 'scaleY' => 1.0, 'scaleZ' => 1.0,
        ],
    ];
}

ob_end_clean(); // discard any stray output (notices/warnings) before sending JSON

sendJSON([
    'ObjectStates' => [[
        'Name'             => 'Deck',
        'Nickname'         => $exportName,
        'DeckIDs'          => $deckIDs,
        'CustomDeck'       => ['1' => $deckEntry],
        'ContainedObjects' => $objects,
        'Transform'        => [
            'posX' => 0.0, 'posY' => 1.0, 'posZ' => 0.0,
            'rotX' => 0.0, 'rotY' => 0.0, 'rotZ' => 0.0,
            'scaleX' => 1.0, 'scaleY' => 1.0, 'scaleZ' => 1.0,
        ],
    ]],
]);
