<?php
// DEPRECATED — replaced by buffer-draft.php (v4.8.0 unified card workflow refactor).
// All callers have been updated. This shim returns 410 Gone so stale clients
// surface a clear error rather than a silent 404.
http_response_code(410);
header('Content-Type: application/json');
header('X-Deprecated-By: buffer-draft.php');
echo json_encode([
    'error'      => 'This endpoint has been removed. Use /buffer-draft instead.',
    'moved_to'   => '/buffer-draft',
    'deprecated' => 'v4.8.0',
]);
exit;
