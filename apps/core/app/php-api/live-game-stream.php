<?php
// SSE endpoint — streams live game state/events to remote panels and the host.
// No auth required: the seat code IS the credential, same as live-game.php.
//
// Self-close at SSE_MAX_SECONDS and send retry:100 so the browser reconnects
// in 100ms (invisible to the user). The cap is set well below the smallest
// upstream proxy timeout we have to live under:
//   prod (Apache):        Timeout 300s   → close at 270s
//   dev (Next.js rewrite): proxyTimeout 120s → close at 90s
// We pick the dev-safe value everywhere so the same script works on both.
//
// 16KB padding per event forces Apache mod_proxy_fcgi to flush each chunk
// immediately rather than buffering (confirmed via load test 2026-05-20).
//
// ?role=host  — host mode: watches remote_events, atomically consumes + pushes
//               them as {"type":"events","events":[...]}. No state pushed.
// (default)   — remote mode: watches state column, pushes full state on change.

set_time_limit(0); // prod has max_execution_time=0; CLI server defaults to 30s
ini_set('zlib.output_compression', '0');

// Self-close before any reasonable upstream proxy drops us. See header notes.
const SSE_MAX_SECONDS = 90;

// config.php sets Content-Type: application/json globally — include it first
// so our SSE-specific headers overwrite it afterwards.
require_once 'config.php';

header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('X-Accel-Buffering: no');
header('Content-Encoding: none');
// CORS is inherited from config.php's origin allowlist (above). Same-origin in
// prod, so this is moot there; in dev config.php already falls back to a
// permissive origin. No per-endpoint override needed.

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

// Emit a batch of queued events, then clear ONLY those events from the queue —
// and only if the client actually received them. Remote events are deltas the
// host applies without dedup, so:
//   - Clearing BEFORE emitting (the old behavior) lost the whole batch whenever
//     the emit landed on a dying/superseded connection.
//   - Blindly redelivering would double-apply.
// So we emit first; if the connection dropped we leave the events queued for
// redelivery on reconnect (the client never applied them, so no double-apply);
// if it was delivered we remove exactly those events, matched by seat+ts, which
// preserves any events a phone appended while we were emitting (NULLing the
// column or slicing by count would drop them). The read lock is released before
// the network write so a slow/dead host connection can't stall phone appends.
// Returns false if the connection dropped (caller should stop).
function emitAndClearEvents(PDO $pdo, string $sessionId, array $events): bool {
    if (empty($events)) return true;
    sseEmit(['type' => 'events', 'events' => $events]);
    if (connection_aborted()) return false; // not delivered — leave queued

    $deliveredKeys = [];
    foreach ($events as $e) {
        $deliveredKeys[($e['seat'] ?? '') . '|' . ($e['ts'] ?? '')] = true;
    }
    $pdo->beginTransaction();
    try {
        $stmt = $pdo->prepare('SELECT remote_events FROM live_game_sessions WHERE id = ? FOR UPDATE');
        $stmt->execute([$sessionId]);
        $rowNow = $stmt->fetch();
        $queue = json_decode($rowNow['remote_events'] ?? '[]', true);
        if (!is_array($queue)) $queue = [];
        $remaining = array_values(array_filter($queue, function ($e) use ($deliveredKeys) {
            return !isset($deliveredKeys[($e['seat'] ?? '') . '|' . ($e['ts'] ?? '')]);
        }));
        $pdo->prepare('UPDATE live_game_sessions SET remote_events = ? WHERE id = ?')
            ->execute([empty($remaining) ? null : json_encode($remaining), $sessionId]);
        $pdo->commit();
    } catch (Exception $e) {
        $pdo->rollBack();
    }
    return true;
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

// Host mode drains (consumes) the remote_events queue, so it must be the host's
// own seat — not any remote seat that appends role=host to the URL. The host is
// the 'bottom' seat (see game-manager createLiveGame). A remote seat requesting
// host mode would otherwise steal events the real host never sees.
if ($isHost && $row['seat'] !== 'bottom') {
    sseEmit(['type' => 'error', 'message' => 'host stream requires the host seat']);
    exit;
}

if ($isHost) {
    // ── HOST MODE ────────────────────────────────────────────────────────────
    // Watches remote_events. On connect, flush any already-queued events so
    // nothing is lost if the host reconnects mid-game.
    $sessionId     = $row['session_id'];
    $initialEvents = json_decode($row['remote_events'] ?? '[]', true);
    if (!is_array($initialEvents)) $initialEvents = [];

    // Flush anything already queued (host reconnected mid-game). emitAndClearEvents
    // clears only on confirmed delivery, so a drop here just leaves them for the
    // next reconnect instead of losing them.
    if (!empty($initialEvents)) {
        if (!emitAndClearEvents($pdo, $sessionId, $initialEvents)) {
            exit; // connection dropped; events stay queued for redelivery
        }
    }

    $start = time();

    while (true) {
        if (connection_aborted()) break;

        if (time() - $start >= SSE_MAX_SECONDS) {
            sseEmit(['type' => 'close']);
            break;
        }

        usleep(500000); // check DB every 500ms

        if (connection_aborted()) break;

        // Read the queue under a short lock, then release it BEFORE emitting so
        // the network write never blocks concurrent phone appends.
        $events = [];
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
            $pdo->commit();
        } catch (Exception $e) {
            $pdo->rollBack();
            continue;
        }

        // Emit + clear-on-delivery outside the read lock.
        if (!empty($events)) {
            if (!emitAndClearEvents($pdo, $sessionId, $events)) break;
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

        if (time() - $start >= SSE_MAX_SECONDS) {
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
