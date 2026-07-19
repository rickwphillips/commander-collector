<?php
require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/auth/middleware.php';

$db = getDB();

// Admin-only: this endpoint returns every user's free-text feedback notes and
// message snippets. It included middleware.php but never enforced auth.
requireAdmin();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

$flagOnly  = !empty($_GET['flagged']);
$rating    = $_GET['rating'] ?? '';   // 'up' | 'down' | ''
$limit     = min((int)($_GET['limit'] ?? 50), 200);
$offset    = max((int)($_GET['offset'] ?? 0), 0);

$where  = [];
$params = [];

if ($flagOnly) {
    $where[]  = 'mf.flag_pattern = 1';
}
if (in_array($rating, ['up', 'down'], true)) {
    $where[]  = 'mf.rating = ?';
    $params[] = $rating;
}

$whereClause = $where ? 'WHERE ' . implode(' AND ', $where) : '';

$stmt = $db->prepare("
    SELECT mf.id, mf.conversation_id, mf.message_id, mf.message_snippet,
           mf.rating, mf.wrong_conclusion, mf.wrong_cr_cite, mf.missing_cr_rules,
           mf.off_topic, mf.hard_to_apply, mf.cards_not_relevant,
           mf.notes, mf.flag_pattern, mf.created_at
    FROM rules_guru_message_feedback mf
    $whereClause
    ORDER BY mf.created_at DESC
    LIMIT ? OFFSET ?
");
$params[] = $limit;
$params[] = $offset;
$stmt->execute($params);
$items = $stmt->fetchAll(PDO::FETCH_ASSOC);

$countStmt = $db->prepare("
    SELECT COUNT(*) FROM rules_guru_message_feedback mf $whereClause
");
$countStmt->execute(array_slice($params, 0, -2));
$total = (int)$countStmt->fetchColumn();

sendJSON(['items' => $items, 'total' => $total, 'limit' => $limit, 'offset' => $offset]);
