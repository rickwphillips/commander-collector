<?php
// Game log buffer API — no auth required (the live session code IS the
// credential, matching live-game.php). Buffers a running game's events in a
// fast local SQLite store; the durable MySQL write happens later in games.php
// when the game completes successfully.
//
// POST ?action=start   body { code, events } — clear this session's buffer and seed initial events
// POST ?action=append  body { code, events } — append events to this session's buffer
// POST ?action=cancel  body { code }         — discard this session's buffer (no MySQL write)
require_once 'config.php';
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
