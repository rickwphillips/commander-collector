<?php
// Per-card note lookup (banned, trap, staple, etc.) via commander-mcp.
//
// GET /rules/card-note.php?name=Mana+Crypt&format=commander[&archetype=jund-toxic]
//
// Implementation note: there is no dedicated "get card notes" MCP tool today,
// so this calls score_card_in_deck_tool with an empty decklist. The layer-1
// (card_note) trace entry is the one we care about; everything else falls
// through to the no-signal fallback and is ignored here.
//
// Response shape (always 200 unless MCP is unreachable):
//   {
//     name: "mana crypt",
//     kind: "banned" | "trap" | "staple" | "situational" | "requirement" | null,
//     weight: -1.0 | ...,
//     reason: "Banned in Commander...",
//     short_circuit: true,
//     source: "seed:v1" | "pattern:Pxxx" | "feedback:N" | null
//   }

require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/auth/middleware.php';
require_once dirname(__DIR__) . '/lib/mcp-client.php';
requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    sendError('Method not allowed', 405);
}

$name = trim($_GET['name'] ?? '');
if ($name === '') {
    sendError('Missing required query param: name');
}
$format = trim($_GET['format'] ?? 'commander');

$args = ['card_name' => $name, 'decklist' => [], 'format' => $format];
if (!empty($_GET['archetype'])) {
    $args['archetype'] = (string) $_GET['archetype'];
}

$envelope = mcpCallTool('score_card_in_deck_tool', $args);
if ($envelope === null) {
    sendJSON([
        'band'    => 'unknown',
        'data'    => null,
        'sources' => [],
        'caveats' => ['commander-mcp HTTP transport unreachable'],
    ]);
}

$data = $envelope['data'] ?? null;
$trace = is_array($data) && isset($data['trace']) ? $data['trace'] : [];

// Find the card_note layer entry (first one wins; the scorer dedupes per kind).
$note = null;
foreach ($trace as $entry) {
    if (($entry['layer'] ?? null) === 'card_note') {
        $note = $entry;
        break;
    }
}

$out = [
    'name'          => strtolower($name),
    'format'        => $format,
    'kind'          => $note['kind'] ?? null,
    'weight'        => $note['contribution'] ?? null,
    'reason'        => $note['reason'] ?? null,
    'short_circuit' => (bool) ($data['short_circuit'] ?? false),
    'source'        => $note['data']['source'] ?? null,
];

sendJSON([
    'band'    => $note ? 'certain' : 'unknown',
    'data'    => $out,
    'sources' => $envelope['sources'] ?? ['local:card_note'],
    'caveats' => $note ? [] : ['No card note matches this (name, format) — card is neither banned nor flagged'],
]);
