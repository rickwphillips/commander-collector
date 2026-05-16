<?php
require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/auth/middleware.php';

$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $body = getJSONInput();
    $conversationId = (int)($body['conversation_id'] ?? 0);
    $rating = isset($body['rating']) ? (int)$body['rating'] : 0;

    if (!$conversationId || $rating < 1 || $rating > 5) {
        sendError('conversation_id and rating (1-5) are required', 400);
    }

    $helpfulIndices = isset($body['helpful_indices']) && is_array($body['helpful_indices'])
        ? json_encode(array_map('intval', $body['helpful_indices']))
        : null;

    $id = $db->query("SELECT UUID()")->fetchColumn();
    $stmt = $db->prepare("
        INSERT INTO rules_guru_session_feedback
          (id, conversation_id, rating, helpful_indices, notes, user_id)
        VALUES (?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $id,
        $conversationId,
        $rating,
        $helpfulIndices,
        isset($body['notes']) ? (string)$body['notes'] : null,
        $currentUserId ?? null,
    ]);

    sendJSON(['id' => $id, 'success' => true]);

} else {
    sendError('Method not allowed', 405);
}
