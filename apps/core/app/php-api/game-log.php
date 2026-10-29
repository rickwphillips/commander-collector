<?php
// Game log buffer API — no auth required (the live session code IS the
// credential, matching live-game.php). Buffers a running game's events in a
// fast local SQLite store; the durable MySQL write happens later in games.php
// when the game completes successfully.
//
// POST ?action=start   body { code, events } — clear this session's buffer and seed initial events
// POST ?action=append  body { code, events } — append events to this session's buffer
// POST ?action=cancel  body { code }         — discard this session's buffer (no MySQL write)
//
// One action is different: `upload` writes a finished game's whole log straight
// into the durable game_logs table, for clients that played offline (the native
// app) and have no live session. There is no session code to act as the
// credential, so it requires a signed-in user who played in the game, or admin.
//
// POST ?action=upload  body { game_id, events } — replace the game's durable log (auth required)
require_once 'config.php';
require_once __DIR__ . '/auth/middleware.php';
require_once __DIR__ . '/lib/game-log-buffer.php';

$method = $_SERVER['REQUEST_METHOD'];

// GET — return the current buffered events for a session, for the in-game log
// viewer. Read-only, best-effort (empty list if the buffer is unavailable).
if ($method === 'GET') {
    $code = isset($_GET['code']) ? trim((string)$_GET['code']) : '';
    if ($code === '') {
        sendError('code is required');
    }
    try {
        sendJSON(['events' => glbRead($code)]);
    } catch (Exception $e) {
        sendJSON(['events' => []]);
    }
}

if ($method !== 'POST') {
    sendError('Method not allowed', 405);
}

$action = isset($_GET['action']) ? $_GET['action'] : null;
$data = getJSONInput();

if ($action === 'upload') {
    $currentUser = requireAuth();
    $gameId = isset($data['game_id']) ? trim((string)$data['game_id']) : '';
    if ($gameId === '') {
        sendError('game_id is required');
    }
    $events = isset($data['events']) ? glbNormalizeEvents($data['events']) : [];
    if (!$events) {
        sendError('events must be a non-empty array of {type, payload?, ts?}');
    }
    $pdo = getDB();
    requireGameAccess($pdo, $gameId, $currentUser, 'You can only upload logs for games you played in');
    $pdo->prepare('INSERT INTO game_logs (game_id, events) VALUES (?, ?) ON DUPLICATE KEY UPDATE events = VALUES(events)')
        ->execute([$gameId, json_encode($events)]);
    sendJSON(['ok' => true, 'count' => count($events)]);
}

$code = isset($data['code']) ? trim((string)$data['code']) : '';

if ($code === '') {
    sendError('code is required');
}

$events = isset($data['events']) && is_array($data['events']) ? $data['events'] : [];

try {
    switch ($action) {
        case 'start':
            glbStart($code, $events);
            sendJSON(['ok' => true], 201);
            break;

        case 'append':
            glbAppend($code, $events);
            sendJSON(['ok' => true], 201);
            break;

        case 'cancel':
            glbClear($code);
            sendJSON(['ok' => true]);
            break;

        default:
            sendError('Unknown action', 400);
    }
} catch (Exception $e) {
    // Logging is best-effort: never surface a buffer failure as a hard error to
    // the running game.
    sendJSON(['ok' => false]);
}
