<?php
// Capture any stray output (notices, warnings) so they don't corrupt the JSON response
ob_start();
ini_set('display_errors', '0');

/**
 * TTS Export — generates a Tabletop Simulator saved-object JSON for a deck or list.
 *
 * Cards are split across multiple 10x7 sprite sheets (max 69 cards each) to stay
 * within the TTS 4096x4096 texture limit. Each sheet is stitched with ImageMagick
 * montage and saved to PUBLIC_HTML/tts-sheets/.
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
const TTS_COLS          = 10;   // TTS max columns
const TTS_MAX_ROWS      = 4;    // Rows per sheet — 4 rows keeps height ~2340px (proven to render)
const TTS_MAX_PER_SHEET = 40;   // 10*4 — all slots usable when BackIsHidden=true
const TTS_CARD_W        = 409;  // 4096 / 10 = 409px — fits within 4096 width
const TTS_CARD_H        = 585;  // Card height per slot
const TTS_MTG_BACK      = 'https://i.imgur.com/Hg8CwwU.jpeg';

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
        SELECT dc.card_name, dc.quantity, dc.is_commander,
               sc.image_uri, sc.image_b64,
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
        SELECT lc.card_name, lc.quantity, lc.is_commander,
               sc.image_uri, sc.image_b64,
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
// Commanders are separated out and placed as standalone objects
$cards = [];
$commanders = [];
foreach ($stmt->fetchAll() as $card) {
    if (empty($card['image_uri']) && empty($card['image_b64'])) continue;
    $entry = [
        'name'      => $card['card_name'],
        'front'     => $card['image_uri'],
        'front_b64' => $card['image_b64'] ?? null,
        'back'      => $card['back_image_uri'] ?? null,
    ];
    if (!empty($card['is_commander'])) {
        $commanders[] = $entry;
    } else {
        $qty = max(1, (int)($card['quantity'] ?? 1));
        for ($i = 0; $i < $qty; $i++) {
            $cards[] = $entry;
        }
    }
}
if (empty($cards)) {
    ttsError('No cards with cached images. Open the Decklist view first to sync Scryfall data.', 422);
}

// ── Sheet storage directory ───────────────────────────────────────────────────
$sheetsDir = dirname(__DIR__) . '/tts-sheets/';
if (!is_dir($sheetsDir) && !mkdir($sheetsDir, 0755, true)) {
    ttsError('Cannot create sheets directory', 500);
}

// ── Split cards into chunks of TTS_MAX_PER_SHEET ─────────────────────────────
$chunks = array_chunk($cards, TTS_MAX_PER_SHEET);
$hasDfc = (bool)array_filter($cards, fn($c) => !empty($c['back']));

// ── Write card images to temp files (cached b64 first, download fallback) ────
function ttsWriteCardImages(array $cards, string $side = 'front'): array {
    $tmpFiles = [];
    $needDownload = [];

    foreach ($cards as $i => $card) {
        $b64 = ($side === 'front') ? ($card['front_b64'] ?? null) : null;
        if ($b64) {
            $tmp = tempnam(sys_get_temp_dir(), 'tts_');
            file_put_contents($tmp, base64_decode($b64));
            $tmpFiles[$i] = $tmp;
        } else {
            $url = ($side === 'front') ? $card['front'] : ($card['back'] ?? TTS_MTG_BACK);
            $tmpFiles[$i] = null;
            if ($url) $needDownload[$i] = $url;
        }
    }

    if (!empty($needDownload)) {
        $mh = curl_multi_init();
        $handles = [];
        foreach ($needDownload as $i => $url) {
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

        foreach ($handles as $i => $ch) {
            $data = curl_multi_getcontent($ch);
            $code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            if ($data && $code === 200) {
                $tmp = tempnam(sys_get_temp_dir(), 'tts_');
                file_put_contents($tmp, $data);
                $tmpFiles[$i] = $tmp;
            }
            curl_multi_remove_handle($mh, $ch);
        }
        curl_multi_close($mh);
    }

    return $tmpFiles;
}

// ── Stitch sheet with ImageMagick montage ─────────────────────────────────────
function ttsBuildMontage(array $tmpFiles, string $outputPath): bool {
    if (empty(array_filter($tmpFiles))) return false;

    $placeholder = null;
    foreach ($tmpFiles as $i => $f) {
        if ($f === null) {
            if (!$placeholder) {
                $placeholder = tempnam(sys_get_temp_dir(), 'tts_ph_');
                $dim = TTS_CARD_W . 'x' . TTS_CARD_H;
                exec("convert -size {$dim} xc:black " . escapeshellarg('jpg:' . $placeholder));
            }
            $tmpFiles[$i] = $placeholder;
        }
    }

    $geo  = TTS_CARD_W . 'x' . TTS_CARD_H . '+0+0';
    $args = implode(' ', array_map(fn($f) => escapeshellarg('jpg:' . $f), $tmpFiles));
    $out  = escapeshellarg($outputPath);
    $cmd  = "montage {$args} -geometry {$geo} -tile " . TTS_COLS . "x -background '#000000' -quality 75 {$out} 2>&1";
    exec($cmd, $result, $code);
    if ($placeholder) @unlink($placeholder);
    return $code === 0 && file_exists($outputPath);
}

// ── Generate sheets for each chunk ───────────────────────────────────────────
$proto      = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$appBase    = rtrim(dirname(dirname($_SERVER['SCRIPT_NAME'])), '/');
$sheetsBase = $proto . '://' . $_SERVER['HTTP_HOST'] . $appBase . '/tts-sheets/';
$cacheBust  = '?v=' . time();

$customDeck = [];  // TTS CustomDeck map: "1" => sheet1, "2" => sheet2, ...
$deckIDs    = [];
$objects    = [];

foreach ($chunks as $chunkIdx => $chunk) {
    $sheetKey = (string)($chunkIdx + 1);  // TTS keys are 1-based strings
    $cardBase = ($chunkIdx + 1) * 100;     // Sheet 1 → 100+, Sheet 2 → 200+, ...
    $numRows  = (int)ceil(count($chunk) / TTS_COLS);

    // ── Cache key for this chunk ─────────────────────────────────────────────
    $frontSigs = array_map(fn($c) => $c['front_b64'] ? md5($c['front_b64']) : $c['front'], $chunk);
    $frontKey  = md5(implode('|', $frontSigs) . '|chunk' . $chunkIdx);
    $frontPath = $sheetsDir . $frontKey . '-front.jpg';

    $backKey  = null;
    $backPath = null;
    if ($hasDfc) {
        $backKey  = md5(implode('|', array_map(fn($c) => $c['back'] ?? TTS_MTG_BACK, $chunk)) . '|chunk' . $chunkIdx);
        $backPath = $sheetsDir . $backKey . '-back.jpg';
    }

    // ── Generate front sheet ─────────────────────────────────────────────────
    if (!file_exists($frontPath)) {
        $tmps = ttsWriteCardImages($chunk, 'front');
        if (!ttsBuildMontage($tmps, $frontPath)) {
            foreach ($tmps as $t) if ($t) @unlink($t);
            ttsError("ImageMagick montage failed for front sheet {$sheetKey}", 500);
        }
        foreach ($tmps as $t) if ($t) @unlink($t);
    }

    // ── Generate back sheet for DFC ──────────────────────────────────────────
    if ($hasDfc && $backPath && !file_exists($backPath)) {
        $tmps = ttsWriteCardImages($chunk, 'back');
        ttsBuildMontage($tmps, $backPath);
        foreach ($tmps as $t) if ($t) @unlink($t);
    }

    // ── Build URLs ───────────────────────────────────────────────────────────
    $frontUrl = $sheetsBase . basename($frontPath) . $cacheBust;
    $backUrl  = ($hasDfc && $backPath && file_exists($backPath))
              ? $sheetsBase . basename($backPath) . $cacheBust
              : TTS_MTG_BACK;

    // ── Sheet entry ──────────────────────────────────────────────────────────
    $sheetEntry = [
        'FaceURL'      => $frontUrl,
        'BackURL'      => $backUrl,
        'NumWidth'     => TTS_COLS,
        'NumHeight'    => $numRows,
        'BackIsHidden' => true,
        'UniqueBack'   => $hasDfc,
    ];
    $customDeck[$sheetKey] = $sheetEntry;

    // ── Card entries for this chunk ──────────────────────────────────────────
    foreach ($chunk as $i => $card) {
        $cardID    = $cardBase + $i;
        $deckIDs[] = $cardID;
        $objects[] = [
            'Name'        => 'Card',
            'Nickname'    => $card['name'],
            'CardID'      => $cardID,
            'CustomDeck'  => [$sheetKey => $sheetEntry],
            'Transform'   => [
                'posX' => 0.0, 'posY' => 0.0, 'posZ' => 0.0,
                'rotX' => 0.0, 'rotY' => 270.0, 'rotZ' => 180.0,
                'scaleX' => 1.75, 'scaleY' => 1.0, 'scaleZ' => 1.75,
            ],
        ];
    }
}

// ── Build commander standalone objects ────────────────────────────────────────
$commanderObjects = [];
foreach ($commanders as $ci => $cmdr) {
    // Use the card image URL directly — no montage needed for a single card
    $cmdrFrontUrl = $cmdr['front'];
    $cmdrBackUrl  = !empty($cmdr['back']) ? $cmdr['back'] : TTS_MTG_BACK;

    $cmdrSheet = [
        'FaceURL'      => $cmdrFrontUrl,
        'BackURL'      => $cmdrBackUrl,
        'NumWidth'     => 1,
        'NumHeight'    => 1,
        'BackIsHidden' => true,
        'UniqueBack'   => !empty($cmdr['back']),
    ];

    $commanderObjects[] = [
        'Name'        => 'CardCustom',
        'Nickname'    => $cmdr['name'],
        'Description' => 'Commander',
        'Tags'        => ['Commander'],
        'CardID'      => ($ci + 90) * 100,
        'CustomDeck'  => [(string)($ci + 90) => $cmdrSheet],
        'Transform'   => [
            'posX' => 0.0, 'posY' => 1.0, 'posZ' => -4.0 - ($ci * 4.0),
            'rotX' => 0.0, 'rotY' => 270.0, 'rotZ' => 0.0,
            'scaleX' => 1.75, 'scaleY' => 1.0, 'scaleZ' => 1.75,
        ],
    ];
}

ob_end_clean();

$objectStates = [[
    'Name'             => 'DeckCustom',
    'Nickname'         => $exportName,
    'DeckIDs'          => $deckIDs,
    'CustomDeck'       => $customDeck,
    'ContainedObjects' => $objects,
    'Transform'        => [
        'posX' => 0.0, 'posY' => 1.0, 'posZ' => 0.0,
        'rotX' => 0.0, 'rotY' => 270.0, 'rotZ' => 180.0,
        'scaleX' => 1.75, 'scaleY' => 1.0, 'scaleZ' => 1.75,
    ],
]];

// Add commanders as separate objects next to the deck
foreach ($commanderObjects as $cmdrObj) {
    $objectStates[] = $cmdrObj;
}

sendJSON(['ObjectStates' => $objectStates]);
