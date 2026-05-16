<?php
// Card-pair interaction lookup, proxied through commander-mcp.
//
// GET /rules/interaction.php?a=Tireless+Tracker&b=Corpsejack+Menace
//
// Forwards to MCP tool `lookup_interaction` and returns its Confidence
// envelope verbatim.

require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/auth/middleware.php';
require_once dirname(__DIR__) . '/lib/mcp-client.php';
requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

$a = trim($_GET['a'] ?? '');
$b = trim($_GET['b'] ?? '');
if ($a === '' || $b === '') {
    sendError('Missing required query params: a, b');
}

$args = ['card_a' => $a, 'card_b' => $b];
$ctx = trim($_GET['context'] ?? '');
if ($ctx !== '') {
    $args['context'] = $ctx;
}

$envelope = mcpCallToolOrUnknown(
    'lookup_interaction',
    $args,
    'commander-mcp HTTP transport unreachable'
);

sendJSON($envelope);
