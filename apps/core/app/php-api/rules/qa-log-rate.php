<?php
require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/auth/middleware.php';
requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') sendError('Method not allowed', 405);

$input      = getJSONInput();
$id         = trim((string)($input['qa_log_id'] ?? ''));
$correctness = (int)($input['correctness']  ?? 1);
$notes      = trim($input['rating_notes'] ?? '');

if (!$id)                                 sendError('qa_log_id required');
if ($correctness < 1 || $correctness > 5) sendError('correctness must be 1–5');

$db = getDB();
$stmt = $db->prepare("
    UPDATE rules_qa_log
    SET correctness = ?, rating_notes = ?, rated_at = CURRENT_TIMESTAMP
    WHERE id = ?
");
$stmt->execute([$correctness, $notes ?: null, $id]);

if ($stmt->rowCount() === 0) sendError('Entry not found', 404);

sendJSON(['success' => true]);
