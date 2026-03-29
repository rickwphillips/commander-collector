<?php
require_once 'config.php';
require_once __DIR__ . '/auth/middleware.php';
requireAuth();

$user   = $GLOBALS['currentUser'];
$userId = (int) $user['sub'];
$pdo    = getDB();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->prepare('SELECT state FROM scan_drafts WHERE user_id = ?');
        $stmt->execute([$userId]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        sendJSON(['state' => $row ? json_decode($row['state'], true) : null]);

    case 'PUT':
        $data  = getJSONInput();
        $state = $data['state'] ?? null;
        if ($state === null) sendError('Missing state', 400);
        $json = json_encode($state);
        $stmt = $pdo->prepare(
            'INSERT INTO scan_drafts (user_id, state) VALUES (?, ?)
             ON DUPLICATE KEY UPDATE state = VALUES(state), updated_at = CURRENT_TIMESTAMP'
        );
        $stmt->execute([$userId, $json]);
        sendJSON(['success' => true]);

    case 'DELETE':
        $stmt = $pdo->prepare('DELETE FROM scan_drafts WHERE user_id = ?');
        $stmt->execute([$userId]);
        sendJSON(['success' => true]);

    default:
        sendError('Method not allowed', 405);
}
