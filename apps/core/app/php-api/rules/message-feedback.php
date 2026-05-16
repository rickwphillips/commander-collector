<?php
require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/auth/middleware.php';

$db = getDB();
$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $body = getJSONInput();
    $conversationId = (int)($body['conversation_id'] ?? 0);
    $rating = $body['rating'] ?? '';

    if (!$conversationId || !in_array($rating, ['up', 'down'], true)) {
        sendError('conversation_id and rating (up|down) are required', 400);
    }

    $cardFeedback = null;
    if (!empty($body['card_feedback']) && is_array($body['card_feedback'])) {
        $cardFeedback = json_encode($body['card_feedback']);
    }

    $id = $db->query("SELECT UUID()")->fetchColumn();
    $stmt = $db->prepare("
        INSERT INTO rules_guru_message_feedback
          (id, conversation_id, message_id, message_snippet, rating,
           wrong_conclusion, wrong_cr_cite, missing_cr_rules, off_topic,
           hard_to_apply, cards_not_relevant, card_feedback, notes, flag_pattern, user_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $stmt->execute([
        $id,
        $conversationId,
        isset($body['message_id']) ? (int)$body['message_id'] : null,
        isset($body['message_snippet']) ? mb_substr((string)$body['message_snippet'], 0, 500) : null,
        $rating,
        empty($body['wrong_conclusion'])   ? 0 : 1,
        empty($body['wrong_cr_cite'])      ? 0 : 1,
        empty($body['missing_cr_rules'])   ? 0 : 1,
        empty($body['off_topic'])          ? 0 : 1,
        empty($body['hard_to_apply'])      ? 0 : 1,
        empty($body['cards_not_relevant']) ? 0 : 1,
        $cardFeedback,
        isset($body['notes']) ? (string)$body['notes'] : null,
        empty($body['flag_pattern'])       ? 0 : 1,
        $currentUserId ?? null,
    ]);

    sendJSON(['id' => $id, 'success' => true]);

} elseif ($method === 'GET') {
    $conversationId = isset($_GET['conversation_id']) ? (int)$_GET['conversation_id'] : 0;
    if (!$conversationId) sendError('conversation_id required', 400);

    $stmt = $db->prepare("
        SELECT id, conversation_id, message_id, rating,
               wrong_conclusion, wrong_cr_cite, missing_cr_rules, off_topic,
               hard_to_apply, cards_not_relevant, card_feedback, flag_pattern, created_at
        FROM rules_guru_message_feedback
        WHERE conversation_id = ?
        ORDER BY created_at ASC
    ");
    $stmt->execute([$conversationId]);
    sendJSON(['feedback' => $stmt->fetchAll(PDO::FETCH_ASSOC)]);

} else {
    sendError('Method not allowed', 405);
}
