<?php
require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/auth/middleware.php';
// Rules Guru tool calls hit commander-mcp (prod: 127.0.0.1:8001). Allow extra time per call.
if (!defined('MCP_TIMEOUT_SECONDS')) {
    define('MCP_TIMEOUT_SECONDS', 12);
}
require_once dirname(__DIR__) . '/lib/mcp-client.php';
requireAuth();

$method = $_SERVER['REQUEST_METHOD'];

// ── GET: poll for assistant response by user_message_id ──────────────────
if ($method === 'GET') {
    $userMsgId = (string)($_GET['poll'] ?? '');
    if (!$userMsgId) sendError('poll parameter required');

    $db = getDB();
    // Find the assistant message that follows this user message in the same conversation
    $stmt = $db->prepare("
        SELECT m.id, m.content, m.pending_pattern, m.conversation_id
        FROM rules_messages m
        WHERE m.conversation_id = (SELECT conversation_id FROM rules_messages WHERE id = ?)
          AND m.id > ?
          AND m.role = 'assistant'
        ORDER BY m.id ASC
        LIMIT 1
    ");
    $stmt->execute([$userMsgId, $userMsgId]);
    $row = $stmt->fetch();

    if (!$row) {
        sendJSON(['status' => 'processing']);
    }

    // Also fetch the qa_log_id
    $qaStmt = $db->prepare("SELECT id FROM rules_qa_log WHERE assistant_message_id = ? LIMIT 1");
    $qaStmt->execute([$row['id']]);
    $qaLogId = $qaStmt->fetchColumn();

    sendJSON([
        'status'           => 'complete',
        'conversation_id'  => (string)$row['conversation_id'],
        'message_id'       => (string)$row['id'],
        'qa_log_id'        => $qaLogId ? (string)$qaLogId : null,
        'response'         => $row['content'],
        'pending_pattern'  => $row['pending_pattern'] ? json_decode($row['pending_pattern'], true) : null,
    ]);
}

if ($method !== 'POST') {
    sendError('Method not allowed', 405);
}

set_time_limit(300);
ignore_user_abort(true);

// In dev mode, use local Claude CLI with MCP; in prod, use Anthropic API
$useLocalClaude = $isLocalDev;
$apiKey = defined('ANTHROPIC_API_KEY') ? ANTHROPIC_API_KEY : null;

if (!$useLocalClaude && !$apiKey) {
    sendError('Anthropic API key not configured', 500);
}

$input          = getJSONInput();
$userMessage    = trim($input['message'] ?? '');
$conversationId = isset($input['conversation_id']) ? (string)$input['conversation_id'] : null;
$newTitle       = trim($input['new_conversation_title'] ?? '');
$gameContext    = $input['game_context'] ?? null;
$focusPlayer    = isset($gameContext['focusPlayerName']) ? trim($gameContext['focusPlayerName']) : null;

if (!$userMessage) sendError('message is required');

$db = getDB();

// ── Conversation management ────────────────────────────────────────────────
if (!$conversationId) {
    $title = $newTitle ?: null;
    $conversationId = $db->query("SELECT UUID()")->fetchColumn();
    $stmt  = $db->prepare("INSERT INTO rules_conversations (id, title) VALUES (?, ?)");
    $stmt->execute([$conversationId, $title]);
}

// Save user message
$userMessageId = $db->query("SELECT UUID()")->fetchColumn();
$stmt = $db->prepare("INSERT INTO rules_messages (id, conversation_id, role, content) VALUES (?, ?, 'user', ?)");
$stmt->execute([$userMessageId, $conversationId, $userMessage]);

// ── Return immediately — client will poll for result ─────────────────────
$earlyResponse = json_encode([
    'status'          => 'processing',
    'conversation_id' => $conversationId,
    'user_message_id' => $userMessageId,
]);
header('Content-Type: application/json');
header('Content-Length: ' . strlen($earlyResponse));
header('Connection: close');
http_response_code(202);
echo $earlyResponse;
if (function_exists('fastcgi_finish_request')) {
    fastcgi_finish_request();
} else {
    ob_end_flush();
    flush();
}

// ── Continue processing in background ────────────────────────────────────

// Load recent conversation history (last 11 messages — odd so window always starts with user turn)
$stmt = $db->prepare("
    SELECT role, content FROM rules_messages
    WHERE conversation_id = ?
    ORDER BY created_at DESC
    LIMIT 11
");
$stmt->execute([$conversationId]);
// Filter empty or CARDS-only messages — they poison subsequent turns
$history = array_filter(array_reverse($stmt->fetchAll()), function($m) {
    $c = trim($m['content']);
    return $c !== '' && !preg_match('/^\s*CARDS:\s*\[\[/i', $c);
});
$history = array_values($history);
// Anthropic requires messages to start with role=user; drop any leading assistant turns
while (!empty($history) && $history[0]['role'] === 'assistant') {
    array_shift($history);
}

// ── Pre-match patterns server-side, inject top 3 distilled (no index dump) ─
$allPatterns = $db->query("SELECT pattern_id, name, category, tags, content FROM rules_patterns ORDER BY pattern_id")->fetchAll();

$msgTokens = array_unique(array_filter(
    preg_split('/\W+/', strtolower($userMessage)),
    fn($t) => strlen($t) >= 3
));

$scored = [];
foreach ($allPatterns as $i => $p) {
    $haystack = strtolower("{$p['name']} {$p['category']} {$p['tags']}");
    $score = 0;
    foreach ($msgTokens as $t) {
        if (str_contains($haystack, $t)) $score++;
    }
    if ($score > 0) $scored[$i] = $score;
}
arsort($scored);

$patternsContext = "\n\n---\n\n## Interaction Pattern Library (pre-matched)\n\n";
$patternsContext .= "Use `get_pattern`, `search_verified_patterns`, or `lookup_interaction` via commander-mcp for more.\n\n";
$rank = 0;
foreach ($scored as $i => $_) {
    if ($rank >= 3) break;
    $patternsContext .= distillPattern($allPatterns[$i]) . "---\n\n";
    $rank++;
}

// ── System prompt (MCP-backed — no inlined CR; lookups via commander-mcp) ─
$systemPrompt = <<<PROMPT
You are an expert Magic: The Gathering rules advisor. Answer with precision, cite CR section numbers, and always reach a **definitive conclusion** — the rules are precise enough to always give a concrete answer.

Knowledge tools route through commander-mcp (Comprehensive Rules DB, verified pattern library, Scryfall). **Never describe a card, CR rule, pattern, or glossary mechanic from memory** — look it up first.

## Lookup Required Before Citing

1. **Cards** — call `lookup_card` for exact Oracle text and rulings before describing any card.
2. **Comprehensive Rules** — call `lookup_comprehensive_rule` for every CR number you cite. Use `search_comprehensive_rules` when you know the topic but not the rule number.
3. **Patterns** — call `get_pattern` for any P### you reference. Use `search_verified_patterns` or `lookup_interaction` when matching by cards or topic.
4. **Mechanics / keywords** — call `lookup_glossary_term` before explaining how a keyword works.

If a lookup returns `band: "unknown"` or an error, say you could not verify it — do not guess from training data.

## Answer Structure

1. Lead with the ruling ("Yes" / "No" / "The result is X").
2. Cite verified CR numbers and patterns.
3. Flag common misconceptions when relevant.
4. When applying a pre-loaded pattern below, say: *"This looks like [Pattern Name] (P###) — applying that logic..."*

If the user corrects a pattern application: ask for reasoning, then verify against CR before accepting.

## Self-Correct and Propose

- Wrong earlier answer? Call `log_correction` immediately with severity, what was wrong, and unchecked assumptions.
- Novel interaction not covered? Call `propose_pattern` after answering.

## Card Reference Manifest

At the very end of EVERY response, after all other content, append exactly one line:

CARDS: [[Full Card Name]], [[Another Card Name]]

List every card referenced by exact Oracle name. Omit the line if no cards were mentioned.

**Card name formatting:** Always bold card names: **Lightning Bolt**. Use exact full Oracle names.
PROMPT;

$systemPrompt .= $patternsContext;

// ── formatPlayerStateLine: live board state for one seat ───────────────────
function formatPlayerStateLine(array $player): string {
    $parts = [];
    if (isset($player['life'])) {
        $parts[] = "{$player['life']} life";
    }
    if (!empty($player['poison'])) {
        $parts[] = "{$player['poison']} poison";
    }
    if (!empty($player['energy'])) {
        $parts[] = "{$player['energy']} energy";
    }
    if (!empty($player['experience'])) {
        $parts[] = "{$player['experience']} experience";
    }
    if (!empty($player['commanderTax'])) {
        $tax = (int)$player['commanderTax'] * 2;
        $parts[] = "commander tax +{$tax}";
    }
    $badges = [];
    if (!empty($player['isMonarch'])) $badges[] = 'Monarch';
    if (!empty($player['hasInitiative'])) $badges[] = 'Initiative';
    if (!empty($player['hasCitysBlessing'])) $badges[] = "City's Blessing";
    if ($badges) $parts[] = implode(', ', $badges);
    if (!empty($player['isEliminated'])) $parts[] = 'eliminated';
    if (!empty($player['isConceded'])) $parts[] = 'conceded';

    $line = $parts ? implode(', ', $parts) : 'in game';

    if (!empty($player['commanderDamage']) && is_array($player['commanderDamage'])) {
        $dmgParts = [];
        foreach ($player['commanderDamage'] as $src => $vals) {
            if (!is_array($vals)) continue;
            $regular = (int)($vals[0] ?? 0);
            $partner = (int)($vals[1] ?? 0);
            if ($partner > 0) {
                $dmgParts[] = "{$regular}+{$partner} from {$src}";
            } elseif ($regular > 0) {
                $dmgParts[] = "{$regular} from {$src}";
            }
        }
        if ($dmgParts) {
            $line .= ' (cmdr dmg received: ' . implode(', ', $dmgParts) . ')';
        }
    }

    return $line;
}

/** Per-head line for 2HG — life/poison shown at team level, not repeated per head. */
function formatHeadStateLine(array $player): string {
    $parts = [];
    if (!empty($player['energy'])) {
        $parts[] = "{$player['energy']} energy";
    }
    if (!empty($player['experience'])) {
        $parts[] = "{$player['experience']} experience";
    }
    if (!empty($player['commanderTax'])) {
        $tax = (int)$player['commanderTax'] * 2;
        $parts[] = "commander tax +{$tax}";
    }
    $badges = [];
    if (!empty($player['isMonarch'])) $badges[] = 'Monarch';
    if (!empty($player['hasInitiative'])) $badges[] = 'Initiative';
    if (!empty($player['hasCitysBlessing'])) $badges[] = "City's Blessing";
    if ($badges) $parts[] = implode(', ', $badges);
    if (!empty($player['isEliminated'])) $parts[] = 'eliminated';
    if (!empty($player['isConceded'])) $parts[] = 'conceded';

    if (!empty($player['commanderDamage']) && is_array($player['commanderDamage'])) {
        $dmgParts = [];
        foreach ($player['commanderDamage'] as $src => $vals) {
            if (!is_array($vals)) continue;
            $regular = (int)($vals[0] ?? 0);
            $partner = (int)($vals[1] ?? 0);
            if ($partner > 0) {
                $dmgParts[] = "{$regular}+{$partner} cmdr dmg from {$src}";
            } elseif ($regular > 0) {
                $dmgParts[] = "{$regular} cmdr dmg from {$src}";
            }
        }
        if ($dmgParts) {
            $parts[] = implode(', ', $dmgParts);
        }
    }

    return $parts ? implode('; ', $parts) : 'no notable status';
}

function appendFormatModeBlock(string &$systemPrompt, string $gameType): void {
    if ($gameType === '2hg') {
        $systemPrompt .= <<<MODE

---

## FORMAT MODE: Two-Headed Giant + Commander (ACTIVE — overrides free-for-all)

**This is NOT a free-for-all Commander game.** The table is 2HG: two teams of two, each head running a Commander deck. Commander rules and 2HG rules both apply.

**Apply these 2HG overrides (verify via `lookup_comprehensive_rule` before citing):**
- **Shared team life** — one life total per team (starts at 30, not 40 per player). CR 810 / 704.6a.
- **Shared team poison** — poison counters pool on the team; **15** ends the game (NOT 10 per player). CR 810.8 / 704.6b.
- **Per-player losses drag the team** — empty library, "you lose the game", etc. on one head eliminates the whole team.
- **Commander damage stays per head** — 21 combat damage from one commander source to one player still loses that player (and thus the team). Not pooled across teammates.
- **Shared team turn** — teammates share a turn and priority; each controls only their own permanents/spells.
- **Little head / big head** — on the starting team's first turn only, big head skips draw, little head draws.
- **"You" vs "your team"** — "you" = one head; team-wide effects say "your team" or "each player on a team".

**Do NOT apply free-for-all assumptions:** independent life totals, 10-poison-per-player, individual turns, or "each opponent" counting teammates as opponents.

MODE;
        return;
    }

    $systemPrompt .= <<<MODE

---

## FORMAT MODE: Commander Free-For-All (ACTIVE — not Two-Headed Giant)

**This is a standard multiplayer Commander game** — each player is an independent competitor, not on a shared team.

**Apply these Commander FFA defaults (verify via `lookup_comprehensive_rule` before citing):**
- **40 life per player** — each player tracks their own life (CR 903.7 / 704.5a).
- **10 poison per player** — a player with 10+ poison counters loses independently (704.5c).
- **Commander damage per source** — 21+ combat damage from the same commander to one player → that player loses (704.6c).
- **Individual turns** — one active player at a time; no shared team turn.
- **"Each opponent" / "each player"** — includes every other player; no teammates exist.

**Do NOT apply 2HG assumptions:** no shared team life, no team poison at 15, no shared turns, no little/big head draw.

MODE;
}

// ── Active game context (personalization) ──────────────────────────────────
if (!empty($gameContext['players'])) {
    $ctxGameType = $gameContext['gameType'] ?? 'commander';
    // Infer 2HG if team numbers are present but gameType was omitted
    if ($ctxGameType !== '2hg') {
        foreach ($gameContext['players'] as $p) {
            if (isset($p['teamNumber'])) {
                $ctxGameType = '2hg';
                break;
            }
        }
    }
    $is2hgCtx = $ctxGameType === '2hg';

    $systemPrompt .= "\n\n---\n\n## Active Game Context\n\n";
    appendFormatModeBlock($systemPrompt, $ctxGameType);

    if ($is2hgCtx) {
        $systemPrompt .= "\nUse **team names** from the roster below when discussing teams. ";
        $systemPrompt .= "When the asker is a specific head, personalize with \"you/your\"; for team-wide effects use \"your team\".\n\n";
        if (!empty($gameContext['currentTeam'])) {
            $teamEsc = htmlspecialchars((string)$gameContext['currentTeam'], ENT_QUOTES);
            $systemPrompt .= "**Active team this turn:** {$teamEsc}\n\n";
        }
    } else {
        $systemPrompt .= "\nEach player competes independently — reference individuals by name and their own life/poison totals.\n\n";
    }
    $systemPrompt .= "Reference specific cards from these decks when relevant and address rules in context of what players are running.\n\n";
    $systemPrompt .= "Use the **current board state** below for life totals, poison, commander damage, and status effects. ";
    $systemPrompt .= "This updates with each message while the in-game chat is open.\n\n";

    $turnNum   = $gameContext['turnNumber'] ?? null;
    $curPlayer = $gameContext['currentPlayer'] ?? null;
    if ($turnNum || $curPlayer) {
        if ($is2hgCtx && !empty($gameContext['currentTeam'])) {
            $teamEsc = htmlspecialchars((string)$gameContext['currentTeam'], ENT_QUOTES);
            $turnHead = $turnNum ? "**Turn {$turnNum}, {$teamEsc}'s turn**" : "**{$teamEsc}'s turn**";
        } elseif ($curPlayer) {
            $curEsc = htmlspecialchars((string)$curPlayer, ENT_QUOTES);
            $turnHead = $turnNum ? "**Turn {$turnNum}, {$curEsc}'s turn**" : "**{$curEsc}'s turn**";
        } else {
            $turnHead = "**Turn {$turnNum}**";
        }
        $systemPrompt .= "{$turnHead}\n\n**Current board state:**\n";

        if ($is2hgCtx) {
            // Group by team so shared life/poison is not mistaken for four independent players
            $teams = [];
            foreach ($gameContext['players'] as $player) {
                $tNum  = (int)($player['teamNumber'] ?? 0);
                $tName = htmlspecialchars($player['teamName'] ?? "Team {$tNum}", ENT_QUOTES);
                if (!isset($teams[$tNum])) {
                    $teams[$tNum] = [
                        'name'   => $tName,
                        'life'   => $player['life'] ?? null,
                        'poison' => (int)($player['poison'] ?? 0),
                        'heads'  => [],
                    ];
                }
                $headName = htmlspecialchars($player['playerName'] ?? 'Unknown', ENT_QUOTES);
                $headState = htmlspecialchars(formatHeadStateLine($player), ENT_QUOTES);
                $teams[$tNum]['heads'][] = "**{$headName}**: {$headState}";
            }
            foreach ($teams as $team) {
                $shared = [];
                if ($team['life'] !== null) {
                    $shared[] = "{$team['life']} shared life";
                }
                if ($team['poison'] > 0) {
                    $shared[] = "{$team['poison']} shared poison";
                }
                $sharedStr = $shared ? implode(', ', $shared) : 'shared totals unknown';
                $systemPrompt .= "- **{$team['name']}** — {$sharedStr}\n";
                foreach ($team['heads'] as $headLine) {
                    $systemPrompt .= "  - {$headLine}\n";
                }
            }
        } else {
            foreach ($gameContext['players'] as $player) {
                $name = htmlspecialchars($player['playerName'] ?? 'Unknown', ENT_QUOTES);
                $stateLine = htmlspecialchars(formatPlayerStateLine($player), ENT_QUOTES);
                $systemPrompt .= "- **{$name}**: {$stateLine}\n";
            }
        }
        $systemPrompt .= "\n";
    }

    $systemPrompt .= "**Decks in play:**\n\n";
    $systemPrompt .= "Each player below may have a deck_id. Use `lookup_decklist` when the question benefits ";
    $systemPrompt .= "from knowing one player's full list — e.g. \"can my deck do X?\", combo identification, ";
    $systemPrompt .= "threat assessment. Use `compare_decklists` when the question spans multiple players — ";
    $systemPrompt .= "e.g. how commanders interact with each other's threats, shared mechanic overlaps, ";
    $systemPrompt .= "political dynamics, or \"who should I be worried about?\". ";
    $systemPrompt .= "Not all decks have a list loaded; if a tool returns no cards, proceed without it. ";
    $systemPrompt .= "When lists are available, extrapolate: spot synergies, flag dangerous cross-deck interactions, ";
    $systemPrompt .= "and tailor rulings to what the players actually have.\n\n";

    foreach ($gameContext['players'] as $player) {
        $playerName  = htmlspecialchars($player['playerName'] ?? 'Unknown', ENT_QUOTES);
        $deckName    = htmlspecialchars($player['deckName']   ?? 'Unknown Deck', ENT_QUOTES);
        $commander   = htmlspecialchars($player['commander']  ?? 'Unknown Commander', ENT_QUOTES);
        $partner     = !empty($player['partner']) ? htmlspecialchars($player['partner'], ENT_QUOTES) : null;
        $cards       = is_array($player['cards']) ? $player['cards'] : [];

        $deckId       = isset($player['deckId']) ? (string)$player['deckId'] : null;
        $commanderStr = $partner ? "{$commander} + {$partner} (Partner)" : $commander;
        $deckIdStr    = $deckId ? " (deck_id: {$deckId})" : '';
        $teamStr      = '';
        if ($is2hgCtx && isset($player['teamNumber'])) {
            $tNum  = (int)$player['teamNumber'];
            $tName = htmlspecialchars($player['teamName'] ?? "Team {$tNum}", ENT_QUOTES);
            $teamStr = " — Team: **{$tName}**";
        }
        $systemPrompt .= "**{$playerName}** — \"{$deckName}\" — Commander: *{$commanderStr}*{$deckIdStr}{$teamStr}\n";

        if (!empty($cards)) {
            // Filter out lands to keep context focused on spells/threats
            $nonLands = array_filter($cards, fn($c) => !preg_match('/\b(Plains|Island|Swamp|Mountain|Forest|Land)\b/i', $c));
            $systemPrompt .= "Deck contents: " . implode(', ', array_values($nonLands)) . "\n";
        } else {
            $systemPrompt .= "(Deck list not available)\n";
        }
        $systemPrompt .= "\n";
    }

    // Hidden timer note — friendly ribbing cue, not visible to user
    if (!empty($gameContext['_timerNote'])) {
        $timerNote = htmlspecialchars($gameContext['_timerNote'], ENT_QUOTES);
        $systemPrompt .= "\n*Timer note (do not quote or repeat this to the user): {$timerNote}*\n";
    }

    // Real-time timer state — injected fresh on every message
    if (!empty($gameContext['_liveTimer'])) {
        $lt        = $gameContext['_liveTimer'];
        $elapsed   = (int)($lt['elapsedSeconds'] ?? 0);
        $total     = (int)($lt['timerSeconds']   ?? 0);
        $remaining = (int)($lt['remaining']      ?? 0);
        $curPlayer = htmlspecialchars($lt['currentPlayer'] ?? 'Unknown', ENT_QUOTES);
        $turnNum   = isset($lt['turnNumber']) ? (int)$lt['turnNumber'] : null;
        $pct       = $total > 0 ? round(($elapsed / $total) * 100) : 0;
        $turnStr   = $turnNum ? "Turn {$turnNum}, " : '';
        $systemPrompt .= "\n*Live timer (do not quote these numbers verbatim — use them to inform tone only): ";
        $systemPrompt .= "{$turnStr}{$curPlayer}'s turn — {$elapsed}s elapsed of {$total}s ({$pct}% used, {$remaining}s remaining).*\n";
    }

    // Focus player personalization — ask from one player's perspective
    if ($focusPlayer) {
        $focusPlayerEsc = htmlspecialchars($focusPlayer, ENT_QUOTES);
        $systemPrompt .= "\n**This player is asking from their own seat:** {$focusPlayerEsc}. ";
        $systemPrompt .= "Personalize your greeting and answers with 'you' and 'your' — focus on their deck, ";
        $systemPrompt .= "their interactions, and how the question relates to their position in the game. ";
        $systemPrompt .= "When answering, imagine you're a friend across the table giving advice to *them specifically*.\n";
    }

}

// ── distillPattern: extract high-signal sections only (token-efficient) ───
function distillPattern(array $p): string {
    $content = $p['content'] ?? '';
    $out = "**{$p['pattern_id']} — {$p['name']}** ({$p['category']})\n";

    foreach (['Abstract', 'The Pattern', 'Definitive Conclusions'] as $section) {
        if (preg_match('/##\s+' . preg_quote($section, '/') . '\s*\n+(.*?)(?=\n##\s|\z)/s', $content, $m)) {
            $text = trim($m[1]);
            // Trim "Additional Examples" sub-sections which can be verbose
            $text = preg_replace('/###.*$/s', '', $text);
            $out .= "\n**{$section}:**\n" . trim($text) . "\n";
        }
    }

    return $out . "\n";
}

// ── Tool definitions ───────────────────────────────────────────────────────
$tools = [
    [
        'name'        => 'lookup_card',
        'description' => 'Look up a card via commander-mcp (Scryfall). Returns Oracle text, type line, mana cost, keywords, and official rulings.',
        'input_schema' => [
            'type'       => 'object',
            'properties' => [
                'name' => ['type' => 'string', 'description' => 'Card name (fuzzy match supported)'],
            ],
            'required' => ['name'],
        ],
    ],
    [
        'name'        => 'lookup_comprehensive_rule',
        'description' => 'Look up an exact CR rule or section via commander-mcp. Required before citing any rule number.',
        'input_schema' => [
            'type'       => 'object',
            'properties' => [
                'rule_number' => ['type' => 'string', 'description' => 'e.g. "117.3c", "613", "903.10a"'],
            ],
            'required' => ['rule_number'],
        ],
    ],
    [
        'name'        => 'search_comprehensive_rules',
        'description' => 'Full-text search across the Comprehensive Rules when you know the topic but not the rule number.',
        'input_schema' => [
            'type'       => 'object',
            'properties' => [
                'query'       => ['type' => 'string', 'description' => 'Search terms, e.g. "state-based action", "layer 7"'],
                'max_results' => ['type' => 'integer', 'description' => 'Max results (default 10)'],
            ],
            'required' => ['query'],
        ],
    ],
    [
        'name'        => 'lookup_glossary_term',
        'description' => 'Look up a mechanic or keyword in the CR glossary before describing how it works.',
        'input_schema' => [
            'type'       => 'object',
            'properties' => [
                'term' => ['type' => 'string', 'description' => 'e.g. "trample", "deathtouch", "prowess"'],
            ],
            'required' => ['term'],
        ],
    ],
    [
        'name'        => 'get_pattern',
        'description' => 'Fetch a verified interaction pattern by ID from commander-mcp. Set full_content=true only if you need the complete markdown.',
        'input_schema' => [
            'type'       => 'object',
            'properties' => [
                'pattern_id'   => ['type' => 'string', 'description' => 'e.g. "p001" or "P001"'],
                'full_content' => ['type' => 'boolean', 'description' => 'Return full body instead of distilled summary'],
            ],
            'required' => ['pattern_id'],
        ],
    ],
    [
        'name'        => 'search_verified_patterns',
        'description' => 'Full-text search the verified pattern library by mechanic or interaction topic.',
        'input_schema' => [
            'type'       => 'object',
            'properties' => [
                'query'       => ['type' => 'string', 'description' => 'e.g. "deathtouch trample", "landfall clue"'],
                'max_results' => ['type' => 'integer', 'description' => 'Max results (default 10)'],
            ],
            'required' => ['query'],
        ],
    ],
    [
        'name'        => 'lookup_interaction',
        'description' => 'Look up verified patterns naming both cards — use for "does X work with Y?" questions.',
        'input_schema' => [
            'type'       => 'object',
            'properties' => [
                'card_a' => ['type' => 'string', 'description' => 'First card name'],
                'card_b' => ['type' => 'string', 'description' => 'Second card name'],
            ],
            'required' => ['card_a', 'card_b'],
        ],
    ],
    [
        'name'        => 'compare_decklists',
        'description' => 'Fetch card lists for multiple decks at once to analyze cross-deck interactions — e.g. how one commander\'s abilities interact with another player\'s threats, shared mechanic overlaps, combo enablers across decks, or political threat assessment. Pass all relevant deck IDs in a single call.',
        'input_schema' => [
            'type'       => 'object',
            'properties' => [
                'deck_ids' => [
                    'type'        => 'array',
                    'items'       => ['type' => 'string'],
                    'description' => 'Array of deck IDs to compare (UUIDs from the active game context)',
                ],
            ],
            'required' => ['deck_ids'],
        ],
    ],
    [
        'name'        => 'lookup_decklist',
        'description' => 'Fetch the full card list for a player\'s deck in the active game. Use this when the question involves specific cards a player might be running, to give more accurate and personalized answers. Returns card names grouped by type.',
        'input_schema' => [
            'type'       => 'object',
            'properties' => [
                'deck_id' => [
                    'type'        => 'string',
                    'description' => 'The deck ID (UUID) from the active game context',
                ],
                'player_name' => [
                    'type'        => 'string',
                    'description' => 'Player name (for display purposes)',
                ],
            ],
            'required' => ['deck_id'],
        ],
    ],
    [
        'name'        => 'propose_pattern',
        'description' => 'Propose a new interaction pattern abstraction to the user for review. Use only when the question reveals a genuinely novel mechanic not covered by existing patterns. The user will review and decide whether to save it.',
        'input_schema' => [
            'type'       => 'object',
            'properties' => [
                'pattern_id'     => ['type' => 'string', 'description' => 'Next available ID, e.g. "p015"'],
                'name'           => ['type' => 'string', 'description' => 'Short descriptive name'],
                'category'       => ['type' => 'string', 'enum' => ['combat', 'stack', 'zones', 'continuous', 'triggered', 'replacement', 'costs', 'multiplayer']],
                'cr_refs'        => ['type' => 'string', 'description' => 'Relevant CR section numbers'],
                'tags'           => ['type' => 'string', 'description' => 'Comma-separated tags'],
                'content'        => ['type' => 'string', 'description' => 'Full markdown content following the standard pattern format (Abstract, Definitive Rule, Pattern, Definitive Conclusions, Canonical Example, Commonly Confused With)'],
                'examples_count' => ['type' => 'integer', 'description' => 'Number of examples in the pattern'],
            ],
            'required' => ['pattern_id', 'name', 'category', 'content'],
        ],
    ],
    [
        'name'        => 'log_correction',
        'description' => 'Log a self-correction when you realize a previous answer in this conversation was wrong or misleading. Use this proactively whenever you catch an error in your own earlier reasoning — incorrect CR citation, wrong ruling, misapplied pattern, etc. This helps track accuracy and improve future answers.',
        'input_schema' => [
            'type'       => 'object',
            'properties' => [
                'correction' => [
                    'type'        => 'string',
                    'description' => 'What was wrong and what the correct answer is. Be specific: cite the incorrect claim, then the correct ruling with CR refs.',
                ],
                'severity' => [
                    'type'        => 'integer',
                    'description' => 'How wrong the original answer was: 1=completely wrong ruling, 2=mostly wrong, 3=partially correct but misleading, 4=minor inaccuracy',
                    'enum'        => [1, 2, 3, 4],
                ],
                'assumptions' => [
                    'type'        => 'string',
                    'description' => 'What assumptions you made without verifying first that led to the error — e.g. assumed a card had a keyword it doesn\'t, assumed a CR rule worked a certain way without looking it up, assumed an interaction based on similar cards.',
                ],
            ],
            'required' => ['correction', 'severity', 'assumptions'],
        ],
    ],
];

// ── Build messages array ───────────────────────────────────────────────────
$messages = [];
foreach ($history as $msg) {
    $messages[] = ['role' => $msg['role'], 'content' => $msg['content']];
}

// ── Tool execution helper (MCP for knowledge; PHP for game DB + writes) ───
function rulesMcpEnvelope(string $tool, array $args, string $unreachableMsg): ?array {
    $result = mcpCallTool($tool, $args);
    if ($result === null) {
        return ['band' => 'unknown', 'error' => $unreachableMsg];
    }
    return $result;
}

function distillMcpPattern(array $pattern): string {
    $content = $pattern['body'] ?? $pattern['content'] ?? '';
    $pid     = $pattern['pattern_id'] ?? 'p???';
    $name    = $pattern['name'] ?? 'Unknown';
    $cat     = $pattern['category'] ?? '';
    $out     = "**{$pid} — {$name}** ({$cat})\n";
    if (!empty($pattern['abstract'])) {
        $out .= "\n**Abstract:**\n" . trim($pattern['abstract']) . "\n";
    }
    foreach (['The Pattern', 'Definitive Conclusions'] as $section) {
        if (preg_match('/##\s+' . preg_quote($section, '/') . '\s*\n+(.*?)(?=\n##\s|\z)/s', $content, $m)) {
            $text = trim(preg_replace('/###.*$/s', '', trim($m[1])));
            $out .= "\n**{$section}:**\n{$text}\n";
        }
    }
    return $out . "\n";
}

function executeTool(string $name, array $input): string {
    if ($name === 'lookup_card') {
        $cardName = trim($input['name'] ?? '');
        if ($cardName === '') return json_encode(['error' => 'name is required']);

        $cardEnv = rulesMcpEnvelope('get_card', ['name' => $cardName], 'commander-mcp unreachable');
        if (($cardEnv['band'] ?? '') === 'unknown') {
            $msg = $cardEnv['error'] ?? ($cardEnv['caveats'][0] ?? "Card not found: {$cardName}");
            return json_encode(['error' => $msg]);
        }
        $card = $cardEnv['data'] ?? [];

        $rulings = [];
        $rulingEnv = rulesMcpEnvelope('get_card_rulings', ['name' => $cardName], 'commander-mcp unreachable');
        if (($rulingEnv['band'] ?? '') !== 'unknown' && !empty($rulingEnv['data']['rulings'])) {
            foreach ($rulingEnv['data']['rulings'] as $r) {
                if (is_array($r) && !empty($r['comment'])) {
                    $rulings[] = $r['comment'];
                }
            }
        }

        return json_encode([
            'name'        => $card['name']        ?? $cardName,
            'mana_cost'   => $card['mana_cost']   ?? '',
            'type_line'   => $card['type_line']   ?? '',
            'oracle_text' => $card['oracle_text'] ?? '',
            'power'       => $card['power']       ?? null,
            'toughness'   => $card['toughness']   ?? null,
            'keywords'    => $card['keywords']    ?? [],
            'rulings'     => $rulings,
        ]);
    }

    if ($name === 'lookup_comprehensive_rule') {
        $ruleNumber = strtolower(trim($input['rule_number'] ?? ''));
        if ($ruleNumber === '') return json_encode(['error' => 'rule_number is required']);
        return json_encode(rulesMcpEnvelope(
            'lookup_comprehensive_rule',
            ['rule_number' => $ruleNumber],
            'commander-mcp unreachable; do not cite this rule'
        ));
    }

    if ($name === 'search_comprehensive_rules') {
        $query = trim($input['query'] ?? '');
        if ($query === '') return json_encode(['error' => 'query is required']);
        $args = ['query' => $query];
        if (isset($input['max_results'])) $args['max_results'] = (int)$input['max_results'];
        return json_encode(rulesMcpEnvelope(
            'search_comprehensive_rules',
            $args,
            'commander-mcp unreachable'
        ));
    }

    if ($name === 'lookup_glossary_term') {
        $term = trim($input['term'] ?? '');
        if ($term === '') return json_encode(['error' => 'term is required']);
        return json_encode(rulesMcpEnvelope(
            'lookup_glossary_term',
            ['term' => $term],
            'commander-mcp unreachable; do not describe this mechanic'
        ));
    }

    if ($name === 'get_pattern') {
        $pid = strtolower(trim($input['pattern_id'] ?? ''));
        if ($pid === '') return json_encode(['error' => 'pattern_id is required']);

        $env = rulesMcpEnvelope('get_verified_pattern', ['pattern_id' => $pid], 'commander-mcp unreachable');
        if (($env['band'] ?? '') === 'unknown') {
            $msg = $env['error'] ?? ($env['caveats'][0] ?? "Pattern not found: {$input['pattern_id']}");
            return json_encode(['error' => $msg]);
        }
        $row = $env['data'] ?? [];
        $full = !empty($input['full_content']);
        return json_encode([
            'pattern_id' => $row['pattern_id'] ?? $pid,
            'name'       => $row['name'] ?? '',
            'category'   => $row['category'] ?? null,
            'cr_refs'    => $row['cr_refs'] ?? [],
            'tags'       => $row['tags'] ?? [],
            'content'    => $full ? ($row['body'] ?? '') : distillMcpPattern($row),
        ]);
    }

    if ($name === 'search_verified_patterns') {
        $query = trim($input['query'] ?? '');
        if ($query === '') return json_encode(['error' => 'query is required']);
        $args = ['query' => $query];
        if (isset($input['max_results'])) $args['max_results'] = (int)$input['max_results'];
        return json_encode(rulesMcpEnvelope('search_verified_patterns', $args, 'commander-mcp unreachable'));
    }

    if ($name === 'lookup_interaction') {
        $cardA = trim($input['card_a'] ?? '');
        $cardB = trim($input['card_b'] ?? '');
        if ($cardA === '' || $cardB === '') return json_encode(['error' => 'card_a and card_b are required']);
        return json_encode(rulesMcpEnvelope(
            'lookup_interaction',
            ['card_a' => $cardA, 'card_b' => $cardB],
            'commander-mcp unreachable'
        ));
    }

    if ($name === 'compare_decklists') {
        global $db, $gameContext;
        $deckIds = array_filter(array_map('strval', $input['deck_ids'] ?? []), fn($id) => $id !== '');
        if (empty($deckIds)) return json_encode(['error' => 'No valid deck_ids provided']);

        // Build player name index from game context
        $playerByDeck = [];
        foreach (($gameContext['players'] ?? []) as $p) {
            if (!empty($p['deckId'])) $playerByDeck[(string)$p['deckId']] = $p['playerName'] ?? 'Unknown';
        }

        $placeholders = implode(',', array_fill(0, count($deckIds), '?'));
        $stmt = $db->prepare("
            SELECT l.deck_id, lc.card_name, lc.quantity,
                   (lc.role = 'commander') AS is_commander,
                   lc.role, sc.type_line
            FROM list_cards lc
            JOIN lists l ON l.id = lc.list_id
            LEFT JOIN scryfall_card_cache sc ON sc.scryfall_id = lc.scryfall_id
            WHERE l.deck_id IN ($placeholders) AND l.role = 'main' AND l.deleted_at IS NULL
            ORDER BY l.deck_id, (lc.role = 'commander') DESC, lc.card_name ASC
        ");
        $stmt->execute(array_values($deckIds));
        $rows = $stmt->fetchAll();

        if (empty($rows)) return json_encode(['error' => 'No cards found for the given deck IDs']);

        // Group by deck → type
        $decks = [];
        foreach ($rows as $row) {
            $did   = (string)$row['deck_id'];
            $entry = $row['quantity'] > 1 ? "{$row['quantity']}x {$row['card_name']}" : $row['card_name'];
            if (!isset($decks[$did])) $decks[$did] = ['player' => $playerByDeck[$did] ?? "Deck {$did}", 'cards' => []];
            $type = $row['type_line'] ?? '';
            if ($row['is_commander'])               $group = 'Commander';
            elseif (str_contains($type, 'Land'))        $group = 'Land';
            elseif (str_contains($type, 'Creature'))    $group = 'Creature';
            elseif (str_contains($type, 'Instant'))     $group = 'Instant';
            elseif (str_contains($type, 'Sorcery'))     $group = 'Sorcery';
            elseif (str_contains($type, 'Enchantment')) $group = 'Enchantment';
            elseif (str_contains($type, 'Artifact'))    $group = 'Artifact';
            elseif (str_contains($type, 'Planeswalker'))$group = 'Planeswalker';
            else                                        $group = 'Other';
            $decks[$did]['cards'][$group][] = $entry;
        }

        return json_encode(['decks' => array_values($decks)]);
    }

    if ($name === 'lookup_decklist') {
        global $db;
        $deckId = trim((string)($input['deck_id'] ?? ''));
        if ($deckId === '') return json_encode(['error' => 'deck_id is required']);

        $stmt = $db->prepare("
            SELECT lc.card_name, lc.quantity,
                   (lc.role = 'commander') AS is_commander,
                   lc.role, sc.type_line
            FROM list_cards lc
            JOIN lists l ON l.id = lc.list_id
            LEFT JOIN scryfall_card_cache sc ON sc.scryfall_id = lc.scryfall_id
            WHERE l.deck_id = ? AND l.role = 'main' AND l.deleted_at IS NULL
            ORDER BY (lc.role = 'commander') DESC, lc.card_name ASC
        ");
        $stmt->execute([$deckId]);
        $rows = $stmt->fetchAll();

        if (empty($rows)) {
            return json_encode(['error' => "No cards found for deck {$deckId}"]);
        }

        // Group by broad type
        $groups = ['Commander' => [], 'Creature' => [], 'Instant' => [], 'Sorcery' => [],
                   'Enchantment' => [], 'Artifact' => [], 'Planeswalker' => [], 'Land' => [], 'Other' => []];
        foreach ($rows as $row) {
            $entry = $row['quantity'] > 1 ? "{$row['quantity']}x {$row['card_name']}" : $row['card_name'];
            if ($row['is_commander']) { $groups['Commander'][] = $entry; continue; }
            $type = $row['type_line'] ?? '';
            if (str_contains($type, 'Land'))        { $groups['Land'][]        = $entry; }
            elseif (str_contains($type, 'Creature'))     { $groups['Creature'][]     = $entry; }
            elseif (str_contains($type, 'Instant'))      { $groups['Instant'][]      = $entry; }
            elseif (str_contains($type, 'Sorcery'))      { $groups['Sorcery'][]      = $entry; }
            elseif (str_contains($type, 'Enchantment'))  { $groups['Enchantment'][]  = $entry; }
            elseif (str_contains($type, 'Artifact'))     { $groups['Artifact'][]     = $entry; }
            elseif (str_contains($type, 'Planeswalker')) { $groups['Planeswalker'][] = $entry; }
            else                                          { $groups['Other'][]        = $entry; }
        }

        $out = [];
        foreach ($groups as $label => $cards) {
            if (!empty($cards)) {
                $out[$label] = $cards;
            }
        }
        return json_encode(['deck_id' => $deckId, 'player' => $input['player_name'] ?? null, 'cards' => $out]);
    }

    // propose_pattern — just echo back the input; frontend handles it
    if ($name === 'propose_pattern') {
        return json_encode(['proposed' => true, 'pattern' => $input]);
    }

    if ($name === 'log_correction') {
        global $db, $conversationId;
        $correctionNote = trim($input['correction'] ?? '');
        $assumptions    = trim($input['assumptions'] ?? '');
        $severity = (int)($input['severity'] ?? 2);
        if ($severity < 1 || $severity > 4) $severity = 2;
        if (!$correctionNote) return json_encode(['error' => 'correction text is required']);

        // Link to the most recent QA log entry in this conversation if one exists
        $stmt = $db->prepare("
            SELECT id FROM rules_qa_log
            WHERE conversation_id = ?
            ORDER BY id DESC LIMIT 1
        ");
        $stmt->execute([$conversationId]);
        $qaId = $stmt->fetchColumn() ?: null;

        $correctionId = $db->query("SELECT UUID()")->fetchColumn();
        $stmt = $db->prepare("
            INSERT INTO rules_ai_corrections (id, conversation_id, qa_log_id, severity, correction, assumptions, model)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$correctionId, $conversationId, $qaId, $severity, $correctionNote, $assumptions, 'claude-haiku-4-5-20251001']);

        return json_encode(['logged' => true, 'correction_id' => $correctionId, 'qa_log_id' => $qaId]);
    }

    return json_encode(['error' => "Unknown tool: $name"]);
}

// ── Local Claude CLI path (dev mode) ──────────────────────────────────────
$iter = 0;
$pendingPattern = null;
$assistantContent = '';

if ($useLocalClaude) {
    // claude CLI with --bare mode uses ANTHROPIC_API_KEY env var
    if (!$apiKey) {
        sendError('Local dev mode requires ANTHROPIC_API_KEY. Get free $5 credits at https://console.anthropic.com/ and add to ~/auth_secrets_dev.php: define(\'ANTHROPIC_API_KEY\', \'sk-ant-...\');', 500);
    }
    
    // Build a single consolidated prompt with history
    $consolidatedPrompt = "=== SYSTEM ===\n\n" . $systemPrompt . "\n\n=== CONVERSATION ===\n\n";
    
    foreach ($history as $msg) {
        $role = strtoupper($msg['role']);
        $consolidatedPrompt .= "[$role]:\n" . $msg['content'] . "\n\n";
    }
    
    $consolidatedPrompt .= "[USER]:\n" . $userMessage . "\n\n[ASSISTANT]:";
    
    // Write prompt to temp file (claude CLI reads from stdin or file)
    $tmpPrompt = tempnam(sys_get_temp_dir(), 'rules_prompt_');
    file_put_contents($tmpPrompt, $consolidatedPrompt);
    
    // MCP config path
    $mcpConfig = dirname(__DIR__, 3) . '/rules-guru/mcp-config.json';
    
    // Set ANTHROPIC_API_KEY in environment for claude CLI
    putenv('ANTHROPIC_API_KEY=' . $apiKey);
    
    // Call claude CLI with --bare (uses ANTHROPIC_API_KEY) and MCP config
    $cmd = sprintf(
        'claude --print --bare --mcp-config %s --model claude-haiku-4-5-20251001 < %s 2>&1',
        escapeshellarg($mcpConfig),
        escapeshellarg($tmpPrompt)
    );
    
    exec($cmd, $output, $exitCode);
    unlink($tmpPrompt);
    
    if ($exitCode !== 0) {
        error_log("[rules/chat.php] Claude CLI error: " . implode("\n", $output));
        $assistantContent = "I hit an error trying to answer that (Claude CLI exit $exitCode). Please try again.";
    } else {
        $assistantContent = implode("\n", $output);
    }
    
    // No tool loop needed - claude CLI handles MCP tool calling internally
} else {
    // ── Anthropic API tool-use loop (production) ──────────────────────────────
    $maxIter = 6;
    while ($iter < $maxIter) {
        $iter++;

        $payload = [
            'model'      => 'claude-haiku-4-5-20251001',
            'max_tokens' => 4096,
            'system'     => $systemPrompt,
            'tools'      => $tools,
            'messages'   => $messages,
        ];

        $ch = curl_init('https://api.anthropic.com/v1/messages');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode($payload),
        CURLOPT_TIMEOUT        => 120,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'x-api-key: ' . $apiKey,
            'anthropic-version: 2023-06-01',
        ],
    ]);

    $body   = curl_exec($ch);
    $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

    if ($status !== 200) {
        $err = json_decode($body, true);
        $errMsg = $err['error']['message'] ?? "HTTP $status";
        error_log("[rules/chat.php] Anthropic API error on iter $iter: $errMsg");
        // Early response already sent — save a fallback message so the poll completes
        $fallbackId = $db->query("SELECT UUID()")->fetchColumn();
        $db->prepare("INSERT INTO rules_messages (id, conversation_id, role, content) VALUES (?, ?, 'assistant', ?)")
           ->execute([$fallbackId, $conversationId, "I hit an error trying to answer that ($errMsg). Please try again."]);
        exit;
    }

    $response    = json_decode($body, true);
    $stopReason  = $response['stop_reason'] ?? 'end_turn';
    $content     = $response['content']     ?? [];

    // Collect text from this turn
    foreach ($content as $block) {
        if ($block['type'] === 'text') {
            $assistantContent .= $block['text'];
        }
    }

    // If no tool use, we're done
    if ($stopReason !== 'tool_use') {
        break;
    }

    // Append assistant message with all content blocks
    $messages[] = ['role' => 'assistant', 'content' => $content];

    // Execute each tool call
    $toolResults = [];
    foreach ($content as $block) {
        if ($block['type'] !== 'tool_use') continue;

        $toolName   = $block['name'];
        $toolInput  = $block['input']  ?? [];
        $toolUseId  = $block['id'];

        $toolOutput = executeTool($toolName, $toolInput);

        // Capture propose_pattern result
        if ($toolName === 'propose_pattern') {
            $decoded = json_decode($toolOutput, true);
            if (!empty($decoded['pattern'])) {
                $pendingPattern = $decoded['pattern'];
            }
        }

        $toolResults[] = [
            'type'        => 'tool_result',
            'tool_use_id' => $toolUseId,
            'content'     => $toolOutput,
        ];
    }

    $messages[] = ['role' => 'user', 'content' => $toolResults];
    }
} // end anthropic API path

// ── Save assistant message to DB ───────────────────────────────────────────
// Guard: if the loop produced no text (all tool_use, maxIter exhausted, etc.), log and substitute a fallback
if (!trim($assistantContent)) {
    error_log("[rules/chat.php] Empty assistant content after $iter iter(s) for conversation $conversationId — question: " . substr($userMessage, 0, 100));
    $assistantContent = "I wasn't able to generate a response for that question. Please try rephrasing or ask again.";
}

$pendingJson = $pendingPattern ? json_encode($pendingPattern) : null;

$messageId = $db->query("SELECT UUID()")->fetchColumn();
$stmt = $db->prepare("
    INSERT INTO rules_messages (id, conversation_id, role, content, pending_pattern)
    VALUES (?, ?, 'assistant', ?, ?)
");
$stmt->execute([$messageId, $conversationId, $assistantContent, $pendingJson]);

// ── Log Q&A pair for validity review ──────────────────────────────────────
if ($assistantContent) {
    // Extract pattern IDs cited (e.g. #P027, P104)
    preg_match_all('/#?(P\d+)/i', $assistantContent, $pMatches);
    $patternIds = !empty($pMatches[1])
        ? implode(',', array_unique(array_map('strtoupper', $pMatches[1])))
        : null;

    // Extract CR section numbers cited (e.g. 603.3b, 117.5, 704.5g)
    preg_match_all('/\b(\d{3}\.\d+[a-z]?)\b/', $assistantContent, $crMatches);
    $crRefs = !empty($crMatches[1])
        ? implode(',', array_unique($crMatches[1]))
        : null;

    // Extract CARDS: manifest (last line of response)
    $cardsJson = null;
    if (preg_match('/\nCARDS:\s*(.+)$/m', $assistantContent, $cardMatch)) {
        $cards = array_filter(array_map(function($s) {
            return trim(preg_replace('/^\[\[|\]\]$/', '', trim($s)));
        }, explode(',', $cardMatch[1])));
        $cardsJson = json_encode(array_values($cards));
    }

    $qaLogId = $db->query("SELECT UUID()")->fetchColumn();
    $qaStmt = $db->prepare("
        INSERT INTO rules_qa_log
            (id, conversation_id, user_message_id, assistant_message_id, question, answer,
             pattern_ids, cr_refs, cards_referenced, pending_pattern_id, model, had_game_context)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $qaStmt->execute([
        $qaLogId,
        $conversationId,
        $userMessageId,
        $messageId,
        $userMessage,
        $assistantContent,
        $patternIds,
        $crRefs,
        $cardsJson,
        $pendingPattern ? ($pendingPattern['pattern_id'] ?? null) : null,
        'claude-haiku-4-5-20251001',
        !empty($gameContext['players']) ? 1 : 0,
    ]);
}

// Update conversation timestamp and auto-title if still untitled
$db->prepare("UPDATE rules_conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?")->execute([$conversationId]);

if ($newTitle) {
    $db->prepare("UPDATE rules_conversations SET title = ? WHERE id = ? AND title IS NULL")->execute([$newTitle, $conversationId]);
}

// Response already sent to client via early return — processing complete.
