<?php
// Public health check for the commander-mcp HTTP transport.
//
// Returns 200 with {ok: true, ...} when the MCP completes a tools/call round
// trip; returns 503 with {ok: false, reason: '...'} otherwise.
//
// Designed for the daily-watch uptime monitor to hit alongside the existing
// portfolio/commander/grandkid/php_api URLs. Intentionally NOT authenticated:
// no sensitive data is exposed, and the cloud watcher cannot mint JWTs.

require_once __DIR__ . '/../config.php';
require_once __DIR__ . '/../lib/mcp-client.php';

header('Content-Type: application/json');

$start = microtime(true);
$result = mcpCallTool('learning_status', []);
$elapsed_ms = (int) round((microtime(true) - $start) * 1000);

if ($result === null) {
    http_response_code(503);
    echo json_encode([
        'ok'         => false,
        'reason'     => 'MCP unreachable or did not return structured content',
        'elapsed_ms' => $elapsed_ms,
        'base'       => MCP_BASE,
    ]);
    exit;
}

http_response_code(200);
echo json_encode([
    'ok'         => true,
    'elapsed_ms' => $elapsed_ms,
    'base'       => MCP_BASE,
    'tool'       => 'learning_status',
    'sample'     => isset($result['data']) ? array_slice((array) $result['data'], 0, 3, true) : null,
]);
