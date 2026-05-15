<?php
// One-shot probe to verify the MCP HTTP transport is reachable from inside the
// PHP/Apache process. Delete this file once the prod path is confirmed.
//
// GET /rules/_mcp_ping.php
//
// Returns:
//   {
//     "mcp_base": "...",
//     "tools_attempted": ["lookup_comprehensive_rule", "get_verified_pattern"],
//     "cr_117_3c": <Confidence envelope or null>,
//     "p001":      <Confidence envelope or null>,
//     "reachable": true|false
//   }

require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/auth/middleware.php';
require_once dirname(__DIR__) . '/lib/mcp-client.php';
requireAuth();

$crRule  = mcpCallTool('lookup_comprehensive_rule', ['rule_number' => '117.3c']);
$pattern = mcpCallTool('get_verified_pattern',      ['pattern_id'  => 'p001']);

sendJSON([
    'mcp_base'        => MCP_BASE,
    'tools_attempted' => ['lookup_comprehensive_rule', 'get_verified_pattern'],
    'cr_117_3c'       => $crRule,
    'p001'            => $pattern,
    'reachable'       => $crRule !== null && $pattern !== null,
]);
