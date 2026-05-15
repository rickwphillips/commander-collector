<?php
// Verified-pattern lookup, proxied through the commander-mcp HTTP transport.
//
// GET /rules/pattern.php?id=P523
//
// Forwards to the MCP tool `get_verified_pattern` and returns its Confidence
// envelope verbatim. If the MCP is unreachable, returns a Confidence-unknown
// envelope so the frontend tooltip can fall back to plain text without spinning.

require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/auth/middleware.php';
require_once dirname(__DIR__) . '/lib/mcp-client.php';
requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

$rawId = trim($_GET['id'] ?? '');
if ($rawId === '') {
    sendError('Missing required query param: id');
}

// Normalize: strip leading '#', lowercase to match MCP storage convention.
$patternId = strtolower(ltrim($rawId, '#'));
if (!preg_match('/^p\d{1,4}$/', $patternId)) {
    sendError('Invalid pattern id');
}

$envelope = mcpCallToolOrUnknown(
    'get_verified_pattern',
    ['pattern_id' => $patternId],
    'commander-mcp HTTP transport unreachable'
);

sendJSON($envelope);
