<?php
/**
 * Coach Notes — persistent AI coaching observations per player.
 *
 * GET:  Fetch all notes for the current user's linked player.
 * DELETE ?id=N: Delete a specific note.
 */
require_once 'config.php';
require_once __DIR__ . '/auth/middleware.php';
$user = requireAuth();

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();
$userId = $user['sub'];

// Resolve player
$stmt = $db->prepare("SELECT id FROM players WHERE user_id = ? LIMIT 1");
$stmt->execute([$userId]);
$player = $stmt->fetch();

if (!$player) {
    if ($method === 'GET') sendJSON([]);
    sendError('No player linked to account');
}

$playerId = (int)$player['id'];

if ($method === 'GET') {
    $stmt = $db->prepare("
        SELECT id, topic, observation, reasoning, created_at, updated_at
        FROM coach_notes
        WHERE player_id = ?
        ORDER BY updated_at DESC
    ");
    $stmt->execute([$playerId]);
    sendJSON($stmt->fetchAll());
}

if ($method === 'DELETE') {
    $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
    if (!$id) sendError('id parameter required');
    $stmt = $db->prepare("DELETE FROM coach_notes WHERE id = ? AND player_id = ?");
    $stmt->execute([$id, $playerId]);
    sendJSON(['success' => true]);
}

sendError('Method not allowed', 405);
