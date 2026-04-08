<?php
require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/auth/middleware.php';
requireAuth();

$method = $_SERVER['REQUEST_METHOD'];
$db     = getDB();

// GET /rules/conversations.php           → list all conversations
// GET /rules/conversations.php?id=123    → single conversation + messages
if ($method === 'GET') {
    $id = isset($_GET['id']) ? (string)$_GET['id'] : null;

    if ($id) {
        $conv = $db->prepare("SELECT * FROM rules_conversations WHERE id = ?");
        $conv->execute([$id]);
        $conversation = $conv->fetch();
        if (!$conversation) sendError('Conversation not found', 404);

        $msgs = $db->prepare("SELECT id, role, content, pending_pattern, created_at FROM rules_messages WHERE conversation_id = ? ORDER BY id");
        $msgs->execute([$id]);
        $messages = $msgs->fetchAll();

        // Parse pending_pattern JSON field
        foreach ($messages as &$msg) {
            if ($msg['pending_pattern']) {
                $msg['pending_pattern'] = json_decode($msg['pending_pattern'], true);
            }
        }

        sendJSON(['conversation' => $conversation, 'messages' => $messages]);
    }

    $stmt = $db->query("SELECT id, title, created_at, updated_at FROM rules_conversations ORDER BY updated_at DESC");
    sendJSON(['conversations' => $stmt->fetchAll()]);
}

// POST → create new conversation
if ($method === 'POST') {
    $input = getJSONInput();
    $title = trim($input['title'] ?? '');

    $newId = $db->query("SELECT UUID()")->fetchColumn();
    $stmt = $db->prepare("INSERT INTO rules_conversations (id, title) VALUES (?, ?)");
    $stmt->execute([$newId, $title ?: null]);

    $fetchStmt = $db->prepare("SELECT * FROM rules_conversations WHERE id = ?");
    $fetchStmt->execute([$newId]);
    sendJSON(['conversation' => $fetchStmt->fetch()], 201);
}

// DELETE /rules/conversations.php?id=123
if ($method === 'DELETE') {
    $id = (string)($_GET['id'] ?? '');
    if (!$id) sendError('id is required');

    $stmt = $db->prepare("DELETE FROM rules_conversations WHERE id = ?");
    $stmt->execute([$id]);
    sendJSON(['deleted' => $id]);
}

sendError('Method not allowed', 405);
