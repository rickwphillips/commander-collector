<?php
// Live game session API — no auth required (seat code IS the credential)
require_once 'config.php';

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$code = isset($_GET['code']) ? trim($_GET['code']) : null;

// Resolve session + seat from a seat code.
// Pass $forUpdate = true inside an open transaction to lock the row.
function resolveSession($pdo, $code, $forUpdate = false) {
    $lock = $forUpdate ? 'FOR UPDATE' : '';
    $stmt = $pdo->prepare("
        SELECT s.id as session_id, s.state, s.remote_events, s.updated_at, s.is_active,
               seat.seat
        FROM live_game_seats seat
        JOIN live_game_sessions s ON seat.session_id = s.id
        WHERE seat.code = ?
          AND s.expires_at > NOW()
        {$lock}
    ");
    $stmt->execute([$code]);
    return $stmt->fetch();
}

// Generate a unique 8-char hex seat code
function generateSeatCode($pdo) {
    for ($i = 0; $i < 10; $i++) {
        $candidate = strtolower(bin2hex(random_bytes(4)));
        $check = $pdo->prepare('SELECT 1 FROM live_game_seats WHERE code = ?');
        $check->execute([$candidate]);
        if (!$check->fetch()) {
            return $candidate;
        }
    }
    sendError('Failed to generate unique code', 500);
}

switch ($method) {

    // -----------------------------------------------------------------------
    // POST — two actions:
    //   (default) create a new session with per-seat codes
    //   ?action=event — append a remote event to the queue (atomic)
    // -----------------------------------------------------------------------
    case 'POST':
        $action = isset($_GET['action']) ? $_GET['action'] : null;

        // ── Append remote event ───────────────────────────────────────────
        if ($action === 'event') {
            if (!$code) {
                sendError('code is required');
            }

            $data = getJSONInput();
            if (empty($data['event']) || !is_array($data['event'])) {
                sendError('event is required');
            }

            // Lock the row so concurrent appends don't overwrite each other
            $pdo->beginTransaction();
            try {
                $row = resolveSession($pdo, $code, true);
                if (!$row) {
                    $pdo->rollBack();
                    sendError('Session not found or expired', 404);
                }
                if (!$row['is_active']) {
                    $pdo->rollBack();
                    sendError('Session is no longer active', 410);
                }

                $events = json_decode($row['remote_events'] ?? '[]', true);
                if (!is_array($events)) $events = [];
                $events[] = $data['event'];

                $stmt = $pdo->prepare(
                    'UPDATE live_game_sessions SET remote_events = ? WHERE id = ?'
                );
                $stmt->execute([json_encode($events), $row['session_id']]);
                $pdo->commit();

                sendJSON(['ok' => true], 201);
            } catch (Exception $e) {
                $pdo->rollBack();
                sendError('Failed to append event', 500);
            }
        }

        // ── Create session ────────────────────────────────────────────────
        $data = getJSONInput();

        if (empty($data['state']) || !is_array($data['state'])) {
            sendError('state is required');
        }
        if (empty($data['seats']) || !is_array($data['seats'])) {
            sendError('seats array is required');
        }

        $validPositions = ['bottom', 'top', 'left', 'right'];
        foreach ($data['seats'] as $seat) {
            if (!in_array($seat, $validPositions, true)) {
                sendError("Invalid seat: $seat");
            }
        }

        // Extract optional user_id (passed by authenticated client) — keep as string UUID
        $userId = isset($data['user_id']) ? (string)$data['user_id'] : null;

        try {
            $pdo->beginTransaction();

            // Deactivate any previously active sessions for this user — prevents stale sessions
            if ($userId) {
                $pdo->prepare('UPDATE live_game_sessions SET is_active = 0 WHERE user_id = ? AND is_active = 1')
                    ->execute([$userId]);
            }

            // Create session
            $sessionId = $pdo->query("SELECT UUID()")->fetchColumn();
            $stmt = $pdo->prepare('
                INSERT INTO live_game_sessions (id, user_id, state, expires_at)
                VALUES (?, ?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))
            ');
            $stmt->execute([$sessionId, $userId, json_encode($data['state'])]);

            // Create one code per seat
            $seatCodes = [];
            $seatStmt = $pdo->prepare('
                INSERT INTO live_game_seats (id, session_id, seat, code) VALUES (?, ?, ?, ?)
            ');
            foreach ($data['seats'] as $seat) {
                $seatId = $pdo->query("SELECT UUID()")->fetchColumn();
                $seatCode = generateSeatCode($pdo);
                $seatStmt->execute([$seatId, $sessionId, $seat, $seatCode]);
                $seatCodes[$seat] = $seatCode;
            }

            // Fetch expires_at
            $exStmt = $pdo->prepare('SELECT expires_at FROM live_game_sessions WHERE id = ?');
            $exStmt->execute([$sessionId]);
            $expires = $exStmt->fetchColumn();

            $pdo->commit();

            sendJSON([
                'session_id' => $sessionId,
                'seats'      => $seatCodes,
                'expires_at' => $expires,
            ], 201);

        } catch (Exception $e) {
            $pdo->rollBack();
            sendError('Failed to create session', 500);
        }
        break;

    // -----------------------------------------------------------------------
    // GET — fetch session state by seat code
    // ?code=a3f9c12b
    // ?code=a3f9c12b&consume=1  (host only — atomically returns and clears remote_events)
    // Returns: { seat, state, remote_events, updated_at, is_active }
    // -----------------------------------------------------------------------
    case 'GET':
        if (!$code) {
            sendError('code is required');
        }

        $consume = !empty($_GET['consume']);

        if ($consume) {
            // Atomically read the event queue and clear it so no events are
            // processed twice. Uses FOR UPDATE to prevent a concurrent append
            // from being lost between our read and our clear.
            $pdo->beginTransaction();
            try {
                $row = resolveSession($pdo, $code, true);
                if (!$row) {
                    $pdo->rollBack();
                    sendError('Session not found or expired', 404);
                }

                $events = json_decode($row['remote_events'] ?? '[]', true);
                if (!is_array($events)) $events = [];

                $clearStmt = $pdo->prepare(
                    'UPDATE live_game_sessions SET remote_events = NULL WHERE id = ?'
                );
                $clearStmt->execute([$row['session_id']]);
                $pdo->commit();
            } catch (Exception $e) {
                $pdo->rollBack();
                sendError('Failed to consume events: ' . $e->getMessage(), 500);
            }
        } else {
            $row = resolveSession($pdo, $code);
            if (!$row) {
                sendError('Session not found or expired', 404);
            }
            $events = json_decode($row['remote_events'] ?? '[]', true);
            if (!is_array($events)) $events = [];
        }

        $state = is_string($row['state']) ? json_decode($row['state'], true) : $row['state'];

        sendJSON([
            'seat'          => $row['seat'],
            'state'         => $state,
            'remote_events' => $events,
            'updated_at'    => $row['updated_at'],
            'is_active'     => (bool)$row['is_active'],
        ]);
        break;

    // -----------------------------------------------------------------------
    // PUT — update session state (host only)
    // ?code=a3f9c12b
    // Body: { state: GameManagerState }
    // Returns: { updated_at }
    // -----------------------------------------------------------------------
    case 'PUT':
        if (!$code) {
            sendError('code is required');
        }

        $data = getJSONInput();
        if (empty($data['state']) || !is_array($data['state'])) {
            sendError('state is required');
        }

        $row = resolveSession($pdo, $code);
        if (!$row) {
            sendError('Session not found or expired', 404);
        }
        if (!$row['is_active']) {
            sendError('Session is no longer active', 410);
        }

        $stmt = $pdo->prepare('
            UPDATE live_game_sessions SET state = ? WHERE id = ?
        ');
        $stmt->execute([json_encode($data['state']), $row['session_id']]);

        // Fetch the new updated_at
        $tsStmt = $pdo->prepare('SELECT updated_at FROM live_game_sessions WHERE id = ?');
        $tsStmt->execute([$row['session_id']]);
        $updatedAt = $tsStmt->fetchColumn();

        sendJSON(['updated_at' => $updatedAt]);
        break;

    // -----------------------------------------------------------------------
    // DELETE — deactivate session (game ended)
    // ?code=a3f9c12b  (any seat code for this session)
    // Returns: { success: true }
    // -----------------------------------------------------------------------
    case 'DELETE':
        if (!$code) {
            sendError('code is required');
        }

        $row = resolveSession($pdo, $code);
        if (!$row) {
            sendError('Session not found', 404);
        }

        $stmt = $pdo->prepare('
            UPDATE live_game_sessions SET is_active = 0 WHERE id = ?
        ');
        $stmt->execute([$row['session_id']]);

        sendJSON(['success' => true]);
        break;

    default:
        sendError('Method not allowed', 405);
}
