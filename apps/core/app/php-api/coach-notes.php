<?php
/**
 * Coach Notes — persistent AI coaching observations per player.
 *
 * GET:               Fetch all notes for the current user's linked player.
 * GET ?all=1:        Admin only — fetch all notes for all players.
 * PUT ?id=N:         Update a note's topic, observation, and/or reasoning.
 * DELETE ?id=N:      Delete a specific note.
 */
require_once 'config.php';
require_once __DIR__ . '/auth/middleware.php';
$user = requireAuth();

$method = $_SERVER['REQUEST_METHOD'];
$db = getDB();
$userId = $user['sub'];
$isAdmin = ($user['role'] ?? '') === 'admin';

// Admin: GET all notes across all players
if ($method === 'GET' && isset($_GET['all'])) {
    if (!$isAdmin) sendError('Forbidden', 403);
    $stmt = $db->query("
        SELECT cn.id, cn.player_id, p.name AS player_name,
               cn.topic, cn.observation, cn.reasoning, cn.created_at, cn.updated_at
        FROM coach_notes cn
        JOIN players p ON p.id = cn.player_id
        ORDER BY p.name, cn.updated_at DESC
    ");
    sendJSON($stmt->fetchAll());
}

// PUT: update a note (admin or note owner)
if ($method === 'PUT') {
    $id = (string)($_GET['id'] ?? '');
    if (!$id) sendError('id parameter required');

    $data = getJSONInput();

    // Verify ownership or admin
    $stmt = $db->prepare("SELECT cn.id, p.user_id FROM coach_notes cn JOIN players p ON p.id = cn.player_id WHERE cn.id = ?");
    $stmt->execute([$id]);
    $note = $stmt->fetch();
    if (!$note) sendError('Note not found', 404);
    if (!$isAdmin && $note['user_id'] !== $userId) sendError('Forbidden', 403);

    $fields = [];
    $params = [];
    if (isset($data['topic']))       { $fields[] = 'topic = ?';       $params[] = trim($data['topic']); }
    if (isset($data['observation'])) { $fields[] = 'observation = ?'; $params[] = trim($data['observation']); }
    if (isset($data['reasoning']))   { $fields[] = 'reasoning = ?';   $params[] = trim($data['reasoning']); }
    if (empty($fields)) sendError('No fields to update');

    $fields[] = 'updated_at = CURRENT_TIMESTAMP';
    $params[] = $id;
    $stmt = $db->prepare("UPDATE coach_notes SET " . implode(', ', $fields) . " WHERE id = ?");
    $stmt->execute($params);
    sendJSON(['success' => true]);
}

// Resolve player for user-scoped operations
$stmt = $db->prepare("SELECT id FROM players WHERE user_id = ? LIMIT 1");
$stmt->execute([$userId]);
$player = $stmt->fetch();

if (!$player) {
    if ($method === 'GET') sendJSON([]);
    sendError('No player linked to account');
}

$playerId = (string)$player['id'];

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
    $id = (string)($_GET['id'] ?? '');
    if (!$id) sendError('id parameter required');

    // Admin can delete any note; users only their own
    if ($isAdmin) {
        $stmt = $db->prepare("DELETE FROM coach_notes WHERE id = ?");
        $stmt->execute([$id]);
    } else {
        $stmt = $db->prepare("DELETE FROM coach_notes WHERE id = ? AND player_id = ?");
        $stmt->execute([$id, $playerId]);
    }
    sendJSON(['success' => true]);
}

sendError('Method not allowed', 405);
