<?php
// Chat feedback proxy. The browser POSTs one settled chip-toggle event here;
// we authenticate, stamp the user id, and forward to the commander-mcp
// `submit_chat_feedback` tool. MCP owns the table; this file is JWT + thin
// transport only.
//
// POST /chat-feedback.php
// Body: {
//   surface:       'rules_guru' | 'coach',
//   message_uuid:  string,
//   kind:          'card' | 'cr_rule' | 'pattern' | 'claim',
//   target_id:     string,
//   rating:        'good' | 'not_relevant' | 'bad',
//   content_text?: string,
//   notes?:        string,
//   deck_id?:      string,
//   list_id?:      string,
//   format?:       string
// }

require_once __DIR__ . '/config.php';
require_once __DIR__ . '/auth/middleware.php';
require_once __DIR__ . '/lib/mcp-client.php';

$user = requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) {
    sendError('Invalid JSON body');
}

$required = ['surface', 'message_uuid', 'kind', 'target_id', 'rating'];
foreach ($required as $field) {
    if (empty($input[$field]) || !is_string($input[$field])) {
        sendError("Missing or invalid field: {$field}");
    }
}

$validSurfaces = ['rules_guru', 'coach'];
$validKinds    = ['card', 'cr_rule', 'pattern', 'claim'];
$validRatings  = ['good', 'not_relevant', 'bad'];

if (!in_array($input['surface'], $validSurfaces, true)) sendError('Invalid surface');
if (!in_array($input['kind'],    $validKinds,    true)) sendError('Invalid kind');
if (!in_array($input['rating'],  $validRatings,  true)) sendError('Invalid rating');

$userId = $user['sub'] ?? null;
if (!$userId) {
    sendError('Token missing sub claim', 401);
}

$args = [
    'user_id'      => $userId,
    'surface'      => $input['surface'],
    'message_uuid' => $input['message_uuid'],
    'kind'         => $input['kind'],
    'target_id'    => $input['target_id'],
    'rating'       => $input['rating'],
];
foreach (['content_text', 'notes', 'deck_id', 'list_id', 'format'] as $opt) {
    if (isset($input[$opt]) && is_string($input[$opt]) && $input[$opt] !== '') {
        $args[$opt] = $input[$opt];
    }
}

$envelope = mcpCallToolOrUnknown(
    'submit_chat_feedback',
    $args,
    'commander-mcp HTTP transport unreachable; feedback not recorded'
);

sendJSON($envelope);
