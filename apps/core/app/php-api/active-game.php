<?php
require_once 'config.php';
require_once 'auth/middleware.php';
$user = requireAuth();
// JWT payload uses 'sub' (subject) as user ID, not 'user_id'
$userId = $user['sub'] ?? null;

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Fetch the user's active game session (should be only one)
    $db = getDB();
    $stmt = $db->prepare("
        SELECT s.id, s.state, s.is_active, s.expires_at
        FROM live_game_sessions s
        WHERE s.user_id = ?
          AND s.is_active = 1
          AND s.expires_at > NOW()
        LIMIT 1
    ");
    $stmt->execute([$userId]);
    $row = $stmt->fetch();

    if (!$row) {
        // No active session
        sendJSON(['is_active' => false, 'state' => null, 'session_code' => null, 'session_seats' => null]);
        return;
    }

    // Fetch all seat codes for this session
    $seatStmt = $db->prepare("SELECT seat, code FROM live_game_seats WHERE session_id = ?");
    $seatStmt->execute([$row['id']]);
    $seats = [];
    while ($seatRow = $seatStmt->fetch()) {
        $seats[$seatRow['seat']] = $seatRow['code'];
    }

    sendJSON([
        'is_active' => true,
        'state' => json_decode($row['state'], true),
        'session_code' => $seats['bottom'] ?? null,
        'session_seats' => $seats,
    ]);
} else {
    sendError('Method not allowed', 405);
}
