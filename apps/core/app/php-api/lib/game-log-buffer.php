<?php
// Game log buffer — a lightweight, file-backed SQLite working store for the
// game manager's live event log. Events are appended here cheaply while a game
// is in progress, then promoted into the durable MySQL game_logs table on
// successful completion (see games.php). On cancel or new-game the buffer is
// cleared. It holds only in-flight games, keyed by the live session code; it is
// not a second history database.
//
// SQLite (PDO_SQLITE) is used, not MySQL, so the working buffer stays local to
// the server and fast. The file lives outside the web root (system temp dir by
// default, overridable via the GAME_LOG_BUFFER_DB constant) so it is never
// served over HTTP.

function glbBufferPath() {
    if (defined('GAME_LOG_BUFFER_DB')) {
        return GAME_LOG_BUFFER_DB;
    }
    $env = getenv('GAME_LOG_BUFFER_DB');
    if ($env !== false && $env !== '') {
        return $env;
    }
    return rtrim(sys_get_temp_dir(), '/') . '/commander_game_log_buffer.sqlite';
}

// Open (creating if needed) the SQLite buffer and ensure the schema exists.
// Returns a PDO handle, or null if SQLite is unavailable so callers can treat
// logging as best-effort and never fail a real game operation.
function glbGetDB() {
    static $db = null;
    if ($db !== null) {
        return $db;
    }
    if (!in_array('sqlite', PDO::getAvailableDrivers(), true)) {
        return null;
    }
    try {
        $db = new PDO('sqlite:' . glbBufferPath());
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $db->exec('PRAGMA journal_mode = WAL');
        $db->exec('PRAGMA busy_timeout = 3000');
        $db->exec('
            CREATE TABLE IF NOT EXISTS game_log_buffer (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                ts         TEXT NOT NULL,
                event_type TEXT NOT NULL,
                payload    TEXT NOT NULL DEFAULT \'{}\'
            )
        ');
        $db->exec('CREATE INDEX IF NOT EXISTS idx_glb_session ON game_log_buffer(session_id)');
        return $db;
    } catch (Exception $e) {
        $db = null;
        return null;
    }
}

// Normalize one incoming event into [ts, type, payload-json].
function glbNormalizeEvent($event) {
    $type = isset($event['type']) ? (string)$event['type'] : 'event';
    $ts = isset($event['ts']) && $event['ts'] !== ''
        ? (string)$event['ts']
        : gmdate('Y-m-d\TH:i:s\Z');
    $payload = isset($event['payload']) ? $event['payload'] : new stdClass();
    return [$ts, $type, json_encode($payload)];
}

// Append events for a session. Silent no-op if SQLite is unavailable.
function glbAppend($sessionId, $events) {
    $db = glbGetDB();
    if (!$db || !is_array($events)) {
        return;
    }
    $stmt = $db->prepare(
        'INSERT INTO game_log_buffer (session_id, ts, event_type, payload) VALUES (?, ?, ?, ?)'
    );
    foreach ($events as $event) {
        if (!is_array($event)) {
            continue;
        }
        [$ts, $type, $payload] = glbNormalizeEvent($event);
        $stmt->execute([(string)$sessionId, $ts, $type, $payload]);
    }
}

// Start a fresh buffer for a session: clear anything left over for this session,
// prune stale buffers from crashed games, then seed the initial events.
function glbStart($sessionId, $events) {
    $db = glbGetDB();
    if (!$db) {
        return;
    }
    glbClear($sessionId);
    glbPruneOld();
    glbAppend($sessionId, $events);
}

// Read all buffered events for a session, oldest first, as an array of
// ['ts' => ..., 'type' => ..., 'payload' => ...].
function glbRead($sessionId) {
    $db = glbGetDB();
    if (!$db) {
        return [];
    }
    $stmt = $db->prepare(
        'SELECT ts, event_type, payload FROM game_log_buffer WHERE session_id = ? ORDER BY id ASC'
    );
    $stmt->execute([(string)$sessionId]);
    $out = [];
    foreach ($stmt->fetchAll(PDO::FETCH_ASSOC) as $row) {
        $out[] = [
            'ts'      => $row['ts'],
            'type'    => $row['event_type'],
            'payload' => json_decode($row['payload'] ?? '{}', true),
        ];
    }
    return $out;
}

// Discard a session's buffered events.
function glbClear($sessionId) {
    $db = glbGetDB();
    if (!$db) {
        return;
    }
    $stmt = $db->prepare('DELETE FROM game_log_buffer WHERE session_id = ?');
    $stmt->execute([(string)$sessionId]);
}

// Housekeeping: drop rows from buffers older than 24 hours so orphaned events
// from abandoned games do not accumulate. Live sessions themselves expire in
// 24h (see live-game.php), so this matches their lifetime.
function glbPruneOld() {
    $db = glbGetDB();
    if (!$db) {
        return;
    }
    $cutoff = gmdate('Y-m-d\TH:i:s\Z', time() - 86400);
    $stmt = $db->prepare('DELETE FROM game_log_buffer WHERE ts < ?');
    $stmt->execute([$cutoff]);
}
