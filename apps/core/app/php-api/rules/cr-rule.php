<?php
// Comprehensive Rules lookup, proxied through the commander-mcp HTTP transport.
//
// GET /rules/cr-rule.php?n=117.3c
//
// Forwards to the MCP tool `lookup_comprehensive_rule` and returns its
// Confidence envelope verbatim. If the MCP is unreachable, returns a
// Confidence-unknown envelope so the frontend tooltip can fall back to plain
// text without spinning.

require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/auth/middleware.php';
require_once dirname(__DIR__) . '/lib/mcp-client.php';
requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

$rawN = trim($_GET['n'] ?? '');
if ($rawN === '') {
    sendError('Missing required query param: n');
}

// Normalize: strip optional "CR " prefix, lowercase the letter suffix.
$ruleNumber = strtolower(preg_replace('/^CR\s+/i', '', $rawN));
if (!preg_match('/^\d{1,3}(\.\d+[a-z]?)?$/', $ruleNumber)) {
    sendError('Invalid rule number');
}

$envelope = mcpCallToolOrUnknown(
    'lookup_comprehensive_rule',
    ['rule_number' => $ruleNumber],
    'commander-mcp HTTP transport unreachable'
);

sendJSON($envelope);
