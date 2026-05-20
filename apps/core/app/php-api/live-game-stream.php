<?php
// SSE endpoint — streams live game state/events to remote panels and the host.
// No auth required: the seat code IS the credential, same as live-game.php.
// Apache Timeout is 300s on this host; we close ourselves at 270s and send
// retry:100 so the browser reconnects in 100ms (invisible to the user).
// 16KB padding per event forces Apache mod_proxy_fcgi to flush each chunk
// immediately rather than buffering (confirmed via load test 2026-05-20).
//
// ?role=host  — host mode: watches remote_events, atomically consumes + pushes
//               them as {"type":"events","events":[...]}. No state pushed.
// (default)   — remote mode: watches state column, pushes full state on change.

set_time_limit(0); // prod has max_execution_time=0; CLI server defaults to 30s
ini_set('zlib.output_compression', '0');

// config.php sets Content-Type: application/json globally — include it first
// so our SSE-specific headers overwrite it afterwards.
require_once 'config.php';

header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('X-Accel-Buffering: no');
header('Content-Encoding: none');
header('Access-Control-Allow-Origin: *');

$code   = isset($_GET['code'])  ? trim($_GET['code'])  : null;
$isHost = isset($_GET['role'])  && $_GET['role'] === 'host';

if (!$code) {
    echo "data: " . json_encode(['type' => 'error', 'message' => 'code required']) . "\n\n";
    flush();
    exit;
}

while (ob_get_level()) ob_end_clean();

function sseEmit(array $payload): void {
    $json = json_encode($payload);
    $pad  = str_repeat(' ', max(0, 16384 - strlen($json)));
    echo 'data: ' . $json . $pad . "\n\n";
    if (ob_get_level() > 0) ob_flush();
    flush();
}

$pdo = getDB();

// Resolve seat + initial session row
$stmt = $pdo->prepare("
    SELECT s.id AS session_id, s.state, s.remote_events, s.updated_at, s.is_active, seat.seat
    FROM live_game_seats seat
    JOIN live_game_sessions s ON seat.session_id = s.id
    WHERE seat.code = ?
      AND s.expires_at > NOW()
");
$stmt->execute([$code]);
$row = $stmt->fetch();

// Send retry directive first so even an inactive response uses fast reconnect
echo "retry: 100\n";

if (!$row || !$row['is_active']) {
    sseEmit(['type' => 'inactive']);
    exit;
}

if ($isHost) {
    // ── HOST MODE ────────────────────────────────────────────────────────────
    // Watches remote_events. On connect, flush any already-queued events so
    // nothing is lost if the host reconnects mid-game.
    $sessionId     = $row['session_id'];
    $initialEvents = json_decode($row['remote_events'] ?? '[]', true);
    if (!is_array($initialEvents)) $initialEvents = [];

    if (!empty($initialEvents)) {
        // Atomically clear the queue before pushing so events aren't double-applied
        $pdo->beginTransaction();
        try {
            $pdo->prepare('UPDATE live_game_sessions SET remote_events = NULL WHERE id = ?')
                ->execute([$sessionId]);
            $pdo->commit();
        } catch (Exception $e) {
            $pdo->rollBack();
            $initialEvents = []; // safe fallback — don't push if we couldn't clear
        }
        if (!empty($initialEvents)) {
            sseEmit(['type' => 'events', 'events' => $initialEvents]);
        }
    }

    $start = time();

    while (true) {
        if (connection_aborted()) break;

        if (time() - $start >= 270) {
            sseEmit(['type' => 'close']);
            break;
        }

        usleep(500000); // check DB every 500ms

        if (connection_aborted()) break;

        // Atomically read + clear remote_events if any exist
        $pdo->beginTransaction();
        try {
            $check = $pdo->prepare("
                SELECT s.remote_events, s.is_active
                FROM live_game_seats seat
                JOIN live_game_sessions s ON seat.session_id = s.id
                WHERE seat.code = ? AND s.expires_at > NOW()
                FOR UPDATE
            ");
            $check->execute([$code]);
            $current = $check->fetch();

            if (!$current || !$current['is_active']) {
                $pdo->rollBack();
                sseEmit(['type' => 'inactive']);
                break;
            }

            $events = json_decode($current['remote_events'] ?? '[]', true);
            if (!is_array($events)) $events = [];

            if (!empty($events)) {
                $pdo->prepare('UPDATE live_game_sessions SET remote_events = NULL WHERE id = ?')
                    ->execute([$sessionId]);
                $pdo->commit();
                sseEmit(['type' => 'events', 'events' => $events]);
            } else {
                $pdo->rollBack();
            }
        } catch (Exception $e) {
            $pdo->rollBack();
        }
    }

} else {
    // ── REMOTE MODE ──────────────────────────────────────────────────────────
    // Watches state column, pushes full state on change.
    $lastUpdatedAt = $row['updated_at'];
    sseEmit([
        'type'       => 'state',
        'state'      => json_decode($row['state'], true),
        'updated_at' => $lastUpdatedAt,
    ]);

    $start = time();

    while (true) {
        if (connection_aborted()) break;

        if (time() - $start >= 270) {
            sseEmit(['type' => 'close']);
            break;
        }

        usleep(500000); // poll DB every 500ms

        if (connection_aborted()) break;

        $check = $pdo->prepare("
            SELECT s.state, s.updated_at, s.is_active
            FROM live_game_seats seat
            JOIN live_game_sessions s ON seat.session_id = s.id
            WHERE seat.code = ?
              AND s.expires_at > NOW()
        ");
        $check->execute([$code]);
        $current = $check->fetch();

        if (!$current || !$current['is_active']) {
            sseEmit(['type' => 'inactive']);
            break;
        }

        if ($current['updated_at'] !== $lastUpdatedAt) {
            $lastUpdatedAt = $current['updated_at'];
            sseEmit([
                'type'       => 'state',
                'state'      => json_decode($current['state'], true),
                'updated_at' => $lastUpdatedAt,
            ]);
        }
    }
}
