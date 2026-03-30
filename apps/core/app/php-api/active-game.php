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
        SELECT s.id, s.state, s.is_active, s.expires_at,
               (SELECT code FROM live_game_seats WHERE session_id = s.id AND seat = 'bottom' LIMIT 1) as session_code
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
        sendJSON(['is_active' => false, 'state' => null, 'session_code' => null]);
        return;
    }

    sendJSON([
        'is_active' => true,
        'state' => json_decode($row['state'], true),
        'session_code' => $row['session_code'],
    ]);
} else {
    sendError('Method not allowed', 405);
}
