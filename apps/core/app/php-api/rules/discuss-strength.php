<?php
// Deck strength discussion (prose narrative) proxied through commander-mcp.
//
// POST /rules/discuss-strength.php
//   { decklist: ['Sol Ring', ...], commander: 'Atraxa, Praetors\' Voice' }
//
// Forwards to MCP tool `discuss_strength` and returns its Confidence envelope.
// Same input as score-deck.php; output adds a `narrative` field with prose.

require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/auth/middleware.php';
require_once dirname(__DIR__) . '/lib/mcp-client.php';
requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

$body = json_decode(file_get_contents('php://input') ?: '', true);
if (!is_array($body)) {
    sendError('Invalid JSON body');
}

$decklist = $body['decklist'] ?? null;
if (!is_array($decklist) || count($decklist) === 0) {
    sendError('Missing required field: decklist (non-empty array of strings)');
}

$args = ['decklist' => array_values(array_filter(array_map('strval', $decklist), 'strlen'))];
if (!empty($body['commander'])) {
    $args['commander'] = (string) $body['commander'];
}

$envelope = mcpCallToolOrUnknown(
    'discuss_strength',
    $args,
    'commander-mcp HTTP transport unreachable'
);

sendJSON($envelope);
