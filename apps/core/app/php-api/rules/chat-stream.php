<?php
// SSE endpoint: streams a single 'complete' event when the assistant response
// is ready, replacing the client-side polling loop.
//
// GET /rules/chat-stream.php?id={user_message_id}
//
// Events:
//   : keepalive          — comment every ~5s to keep proxy connections alive
//   event: complete      — assistant response ready; data is the full payload
//   event: error         — timeout or internal error; data has an 'error' key

require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/auth/middleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    exit;
}

$userMsgId = (string)($_GET['id'] ?? '');
if (!$userMsgId) {
    http_response_code(400);
    exit;
}

header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('X-Accel-Buffering: no');  // prevent nginx/proxy from buffering the stream
header('Connection: keep-alive');

if (ob_get_level()) ob_end_clean();
ini_set('output_buffering', 'off');
ini_set('zlib.output_compression', 0);
ob_implicit_flush(true);

set_time_limit(120);
ignore_user_abort(false);

$db        = getDB();
$start     = time();
$maxWait   = 115;       // slightly under set_time_limit so we send the error event cleanly
$sleepUs   = 1_500_000; // 1.5s between DB checks
$iteration = 0;

while (true) {
    if (connection_aborted()) break;

    if ((time() - $start) >= $maxWait) {
        echo "event: error\n";
        echo 'data: ' . json_encode(['error' => 'timeout']) . "\n\n";
        flush();
        break;
    }

    // Send a keepalive comment every ~5 iterations (7.5s) to prevent proxy timeouts
    if ($iteration % 5 === 0) {
        echo ": keepalive\n\n";
        flush();
    }
    $iteration++;

    $stmt = $db->prepare("
        SELECT m.id, m.content, m.pending_pattern, m.conversation_id
        FROM   rules_messages m
        WHERE  m.conversation_id = (SELECT conversation_id FROM rules_messages WHERE id = ?)
          AND  m.id   > ?
          AND  m.role = 'assistant'
        ORDER  BY m.id ASC
        LIMIT  1
    ");
    $stmt->execute([$userMsgId, $userMsgId]);
    $row = $stmt->fetch();

    if ($row) {
        $qaStmt = $db->prepare("SELECT id FROM rules_qa_log WHERE assistant_message_id = ? LIMIT 1");
        $qaStmt->execute([$row['id']]);
        $qaLogId = $qaStmt->fetchColumn();

        echo "event: complete\n";
        echo 'data: ' . json_encode([
            'status'          => 'complete',
            'conversation_id' => (string)$row['conversation_id'],
            'message_id'      => (string)$row['id'],
            'qa_log_id'       => $qaLogId ? (string)$qaLogId : null,
            'response'        => $row['content'],
            'pending_pattern' => $row['pending_pattern']
                                    ? json_decode($row['pending_pattern'], true)
                                    : null,
        ]) . "\n\n";
        flush();
        break;
    }

    usleep($sleepUs);
}
