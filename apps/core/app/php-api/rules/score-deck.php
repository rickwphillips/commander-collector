<?php
// Deck-level bracket scoring proxied through commander-mcp.
//
// POST /rules/score-deck.php
//   { decklist: ['Sol Ring', '1 Atraxa, Praetors\' Voice', ...],
//     commander: 'Atraxa, Praetors\' Voice' }
//
// Forwards to MCP tool `score_deck` and returns its Confidence envelope.

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

$commander = !empty($body['commander']) ? (string) $body['commander'] : null;
sendJSON(mcpScoreDeck($decklist, $commander));
