<?php
// Live game session API — no auth required (seat code IS the credential)
require_once 'config.php';

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];
$code = isset($_GET['code']) ? trim($_GET['code']) : null;

// Resolve session + seat from a seat code
function resolveSession($pdo, $code) {
    $stmt = $pdo->prepare('
        SELECT s.id as session_id, s.state, s.updated_at, s.is_active,
               seat.seat
        FROM live_game_seats seat
        JOIN live_game_sessions s ON seat.session_id = s.id
        WHERE seat.code = ?
          AND s.expires_at > NOW()
    ');
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
    // POST — create a new session with per-seat codes
    // Body: { state: GameManagerState, seats: string[] }
    // seats = array of position strings that are active, e.g. ['bottom','top','left','right']
    // Returns: { session_id, seats: { bottom: 'a3f9c12b', top: '...' }, expires_at }
    // -----------------------------------------------------------------------
    case 'POST':
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

        try {
            $pdo->beginTransaction();

            // Create session
            $stmt = $pdo->prepare('
                INSERT INTO live_game_sessions (state, expires_at)
                VALUES (?, DATE_ADD(NOW(), INTERVAL 24 HOUR))
            ');
            $stmt->execute([json_encode($data['state'])]);
            $sessionId = (int)$pdo->lastInsertId();

            // Create one code per seat
            $seatCodes = [];
            $seatStmt = $pdo->prepare('
                INSERT INTO live_game_seats (session_id, seat, code) VALUES (?, ?, ?)
            ');
            foreach ($data['seats'] as $seat) {
                $seatCode = generateSeatCode($pdo);
                $seatStmt->execute([$sessionId, $seat, $seatCode]);
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
            sendError('Failed to create session: ' . $e->getMessage(), 500);
        }
        break;

    // -----------------------------------------------------------------------
    // GET — fetch session state by seat code
    // ?code=a3f9c12b
    // Returns: { seat, state, updated_at, is_active }
    // -----------------------------------------------------------------------
    case 'GET':
        if (!$code) {
            sendError('code is required');
        }

        $row = resolveSession($pdo, $code);
        if (!$row) {
            sendError('Session not found or expired', 404);
        }

        $state = is_string($row['state']) ? json_decode($row['state'], true) : $row['state'];

        sendJSON([
            'seat'       => $row['seat'],
            'state'      => $state,
            'updated_at' => $row['updated_at'],
            'is_active'  => (bool)$row['is_active'],
        ]);
        break;

    // -----------------------------------------------------------------------
    // PUT — update session state
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
