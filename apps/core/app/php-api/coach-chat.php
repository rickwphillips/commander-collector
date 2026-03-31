<?php
/**
 * Coach Chat — AI coaching endpoint for My Collection page.
 *
 * POST: Submit a message with conversation history. Returns { status: 'processing', request_id }.
 * GET:  Poll with ?poll=REQUEST_ID. Returns { status: 'processing' } or { status: 'complete', response }.
 *
 * The system prompt is built server-side from the user's data and is never exposed to the client.
 * Includes Rules Guru tools (lookup_card, get_pattern) for MTG rules knowledge.
 */
require_once 'config.php';
require_once __DIR__ . '/auth/middleware.php';
$user = requireAuth();

$method = $_SERVER['REQUEST_METHOD'];

// ── GET: poll for response ────────────────────────────────────────────────
if ($method === 'GET') {
    $requestId = $_GET['poll'] ?? '';
    if (!$requestId) sendError('poll parameter required');

    $cacheFile = sys_get_temp_dir() . '/coach_chat_' . preg_replace('/[^a-zA-Z0-9_-]/', '', $requestId) . '.json';

    if (!file_exists($cacheFile)) {
        sendJSON(['status' => 'processing']);
    }

    $data = json_decode(file_get_contents($cacheFile), true);
    if (!$data || empty($data['complete'])) {
        sendJSON(['status' => 'processing']);
    }

    // Clean up temp file
    @unlink($cacheFile);

    sendJSON([
        'status'   => 'complete',
        'response' => $data['response'] ?? '',
    ]);
}

if ($method !== 'POST') sendError('Method not allowed', 405);

set_time_limit(300);
ignore_user_abort(true);

$apiKey = defined('ANTHROPIC_API_KEY') ? ANTHROPIC_API_KEY : null;
if (!$apiKey) sendError('Anthropic API key not configured', 500);

$input       = getJSONInput();
$userMessage = trim($input['message'] ?? '');
$history     = $input['history'] ?? [];
$context     = $input['context'] ?? null; // Pre-fetched collection data from frontend

if (!$userMessage) sendError('message is required');

// Generate a unique request ID for polling
$requestId = bin2hex(random_bytes(16));
$cacheFile = sys_get_temp_dir() . '/coach_chat_' . $requestId . '.json';

// Write placeholder so poll knows it's in progress
file_put_contents($cacheFile, json_encode(['complete' => false]));

// ── Return immediately — client will poll ─────────────────────────────────
$earlyResponse = json_encode([
    'status'     => 'processing',
    'request_id' => $requestId,
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

// ── Background: build system prompt from user data ────────────────────────
$db = getDB();
$userId = $user['sub'];

// Resolve player
$stmt = $db->prepare("SELECT id, name FROM players WHERE user_id = ? LIMIT 1");
$stmt->execute([$userId]);
$player = $stmt->fetch();

$playerDataPrompt = '';
$playerId = $player ? (int)$player['id'] : 0;

if ($player) {
    $playerName = $player['name'];

    // Decks with stats
    $stmt = $db->prepare("
        SELECT d.id, d.name, d.commander, d.colors,
            COUNT(gr.id) AS total_games,
            COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) AS wins,
            ROUND(COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) * 100.0 / NULLIF(COUNT(gr.id), 0), 1) AS win_rate,
            ROUND(AVG(gr.finish_position), 2) AS avg_finish
        FROM decks d
        LEFT JOIN game_results gr ON gr.deck_id = d.id
        WHERE d.player_id = ?
        GROUP BY d.id ORDER BY total_games DESC
    ");
    $stmt->execute([$playerId]);
    $decks = $stmt->fetchAll();

    // Overall stats
    $stmt = $db->prepare("
        SELECT COUNT(DISTINCT gr.game_id) AS total_games,
            COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) AS wins,
            ROUND(COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) * 100.0 / NULLIF(COUNT(DISTINCT gr.game_id), 0), 1) AS win_rate,
            ROUND(AVG(gr.finish_position), 2) AS avg_finish
        FROM game_results gr WHERE gr.player_id = ?
    ");
    $stmt->execute([$playerId]);
    $overall = $stmt->fetch();

    // Nemeses (players)
    $stmt = $db->prepare("
        SELECT p2.name AS opponent,
            COUNT(DISTINCT g.id) AS games,
            SUM(CASE WHEN opp.finish_position = 1 THEN 1 ELSE 0 END) AS their_wins,
            SUM(CASE WHEN my.finish_position = 1 THEN 1 ELSE 0 END) AS my_wins
        FROM game_results my
        JOIN games g ON g.id = my.game_id
        JOIN game_results opp ON opp.game_id = g.id AND opp.player_id != ?
        JOIN players p2 ON p2.id = opp.player_id
        WHERE my.player_id = ?
        GROUP BY p2.id HAVING games >= 2
        ORDER BY their_wins DESC LIMIT 10
    ");
    $stmt->execute([$playerId, $playerId]);
    $nemeses = $stmt->fetchAll();

    // Nemesis commanders
    $stmt = $db->prepare("
        SELECT d2.commander,
            COUNT(DISTINCT g.id) AS games,
            SUM(CASE WHEN opp.finish_position = 1 THEN 1 ELSE 0 END) AS their_wins,
            SUM(CASE WHEN my.finish_position = 1 THEN 1 ELSE 0 END) AS my_wins
        FROM game_results my
        JOIN games g ON g.id = my.game_id
        JOIN game_results opp ON opp.game_id = g.id AND opp.player_id != ?
        JOIN decks d2 ON d2.id = opp.deck_id
        WHERE my.player_id = ?
        GROUP BY d2.commander HAVING games >= 2
        ORDER BY their_wins DESC LIMIT 10
    ");
    $stmt->execute([$playerId, $playerId]);
    $nemesisCommanders = $stmt->fetchAll();

    // Color performance
    $stmt = $db->prepare("
        SELECT d.colors,
            COUNT(gr.id) AS total_games,
            COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) AS wins,
            ROUND(COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) * 100.0 / NULLIF(COUNT(gr.id), 0), 1) AS win_rate
        FROM game_results gr JOIN decks d ON d.id = gr.deck_id
        WHERE gr.player_id = ? GROUP BY d.colors ORDER BY total_games DESC
    ");
    $stmt->execute([$playerId]);
    $colorStats = $stmt->fetchAll();

    // Pod size performance
    $stmt = $db->prepare("
        SELECT pod.pod_size,
            COUNT(*) AS total_games,
            SUM(CASE WHEN gr.finish_position = 1 THEN 1 ELSE 0 END) AS wins,
            ROUND(SUM(CASE WHEN gr.finish_position = 1 THEN 1 ELSE 0 END) * 100.0 / NULLIF(COUNT(*), 0), 1) AS win_rate
        FROM game_results gr
        JOIN (SELECT game_id, COUNT(*) AS pod_size FROM game_results GROUP BY game_id) pod ON pod.game_id = gr.game_id
        WHERE gr.player_id = ? GROUP BY pod.pod_size ORDER BY pod.pod_size
    ");
    $stmt->execute([$playerId]);
    $podStats = $stmt->fetchAll();

    // Recent streaks
    $stmt = $db->prepare("
        SELECT gr.finish_position FROM game_results gr
        JOIN games g ON g.id = gr.game_id
        WHERE gr.player_id = ? ORDER BY g.played_at DESC, g.id DESC LIMIT 20
    ");
    $stmt->execute([$playerId]);
    $recentResults = $stmt->fetchAll();

    $currentStreak = 0;
    $currentStreakType = null;
    foreach ($recentResults as $r) {
        $type = ((int)$r['finish_position'] === 1) ? 'win' : 'loss';
        if ($currentStreakType === null) { $currentStreakType = $type; $currentStreak = 1; }
        elseif ($currentStreakType === $type) { $currentStreak++; }
        else { break; }
    }

    // Load existing coach notes for context
    $stmt = $db->prepare("SELECT topic, observation, reasoning, updated_at FROM coach_notes WHERE player_id = ? ORDER BY updated_at DESC LIMIT 20");
    $stmt->execute([$playerId]);
    $existingNotes = $stmt->fetchAll();

    // Build data prompt
    $playerDataPrompt = "\n\n---\n\n## Player Profile: {$playerName}\n\n";
    $playerDataPrompt .= "**Overall:** {$overall['total_games']} games, {$overall['wins']} wins, {$overall['win_rate']}% win rate, avg finish: {$overall['avg_finish']}\n";
    $playerDataPrompt .= "**Current streak:** {$currentStreak} {$currentStreakType}" . ($currentStreak > 1 ? 's' : '') . "\n\n";

    // Get card counts for each deck
    $cardCountStmt = $db->prepare("SELECT deck_id, COUNT(*) AS cnt FROM deck_cards WHERE deck_id IN (" . implode(',', array_map(fn($d) => (int)$d['id'], $decks)) . ") GROUP BY deck_id");
    $cardCountStmt->execute();
    $cardCounts = [];
    while ($row = $cardCountStmt->fetch()) {
        $cardCounts[(int)$row['deck_id']] = (int)$row['cnt'];
    }

    $playerDataPrompt .= "### Decks\n\n";
    $playerDataPrompt .= "**Important:** You can see deck names and stats, but you CANNOT see the actual cards in a deck until the user expands the deck on the page. The `card_count` column shows how many cards are loaded. If you want to analyze a specific deck's cards or suggest improvements, ask the player to expand that deck in the list — once they do, the card list will be included in your context automatically.\n\n";
    $playerDataPrompt .= "When a `[ACTIVE_DECK_PROFILE: ...]` block appears in the user's message, that is the full deck profile they've made visible to you — including cards, win/loss record, average finish, matchup records vs opposing commanders, and recent game results. Analyze it thoroughly, take notes about the deck's strategy and composition using `save_coach_note`, and remember what you've seen for the rest of the conversation.\n\n";
    $playerDataPrompt .= "| deck_id | Deck | Commander | Colors | Cards | Games | Wins | Win Rate | Avg Finish |\n";
    $playerDataPrompt .= "|---------|------|-----------|--------|-------|-------|------|----------|------------|\n";
    foreach ($decks as $d) {
        $cc = $cardCounts[(int)$d['id']] ?? 0;
        $playerDataPrompt .= "| {$d['id']} | {$d['name']} | {$d['commander']} | {$d['colors']} | {$cc} | {$d['total_games']} | {$d['wins']} | {$d['win_rate']}% | {$d['avg_finish']} |\n";
    }

    $playerDataPrompt .= "\n### Player Matchups (Nemeses)\n\n";
    $playerDataPrompt .= "| Opponent | Games Together | Their Wins | Your Wins |\n";
    $playerDataPrompt .= "|----------|---------------|------------|----------|\n";
    foreach ($nemeses as $n) {
        $playerDataPrompt .= "| {$n['opponent']} | {$n['games']} | {$n['their_wins']} | {$n['my_wins']} |\n";
    }

    $playerDataPrompt .= "\n### Commander Nemeses (commanders that beat you)\n\n";
    $playerDataPrompt .= "| Commander | Games Against | Their Wins | Your Wins |\n";
    $playerDataPrompt .= "|-----------|--------------|------------|----------|\n";
    foreach ($nemesisCommanders as $nc) {
        $playerDataPrompt .= "| {$nc['commander']} | {$nc['games']} | {$nc['their_wins']} | {$nc['my_wins']} |\n";
    }

    $playerDataPrompt .= "\n### Color Identity Performance\n\n";
    $playerDataPrompt .= "| Colors | Games | Wins | Win Rate |\n";
    $playerDataPrompt .= "|--------|-------|------|----------|\n";
    foreach ($colorStats as $cs) {
        $playerDataPrompt .= "| {$cs['colors']} | {$cs['total_games']} | {$cs['wins']} | {$cs['win_rate']}% |\n";
    }

    $playerDataPrompt .= "\n### Pod Size Performance\n\n";
    $playerDataPrompt .= "| Pod Size | Games | Wins | Win Rate |\n";
    $playerDataPrompt .= "|----------|-------|------|----------|\n";
    foreach ($podStats as $ps) {
        $playerDataPrompt .= "| {$ps['pod_size']}-player | {$ps['total_games']} | {$ps['wins']} | {$ps['win_rate']}% |\n";
    }

    if (!empty($existingNotes)) {
        $playerDataPrompt .= "\n### Your Previous Observations About This Player\n\n";
        $playerDataPrompt .= "These are notes you saved from previous coaching conversations. Use them to maintain continuity — reference past advice, check if they've improved in areas you flagged, and build on previous observations rather than repeating yourself.\n\n";
        foreach ($existingNotes as $note) {
            $playerDataPrompt .= "- **{$note['topic']}** ({$note['updated_at']}): {$note['observation']}\n";
            if ($note['reasoning']) {
                $playerDataPrompt .= "  _Reasoning: {$note['reasoning']}_\n";
            }
        }
    }
}

// ── System prompt ─────────────────────────────────────────────────────────
$systemPrompt = <<<PROMPT
You are the Commander Coach — a friendly, knowledgeable Magic: The Gathering Commander strategy advisor. You have deep expertise in MTG rules (including the full Comprehensive Rules), deckbuilding theory, metagame analysis, and competitive/casual Commander strategy.

## Your Role

You are reviewing the player's personal data from The Commander Collector app. Your job is to:

1. **Analyze patterns** in their gameplay data — identify strengths, weaknesses, and opportunities
2. **Offer actionable advice** — specific, practical suggestions they can implement
3. **Be encouraging but honest** — celebrate wins, but don't sugarcoat consistent underperformance
4. **Reference specific data** — cite their actual deck names, win rates, matchup records
5. **Think strategically** — consider meta factors like color identity gaps, pod size performance, commander matchups

## Conversation Style

- Be conversational and warm, like a friend across the table who happens to be really good at Commander
- Use MTG terminology naturally — don't over-explain basic concepts
- Keep responses focused and actionable, not wall-of-text lectures
- Use card names in bold: **Lightning Bolt**, **Teysa Karlov** (they render as interactive previews)
- When discussing strategy, relate it back to their specific decks and data
- If they ask about rules, answer with the same precision as a judge — cite CR sections

## Your Memory (Coach Notes)

You have persistent notes from previous conversations with this player (listed under "Your Previous Observations" in the player data below). Treat these like your own memory:

- **Reference them conversationally**, not formally — say things like "Last time we talked about your Teysa deck, I noticed..." or "I remember flagging that your blue matchup was rough..." rather than "According to my notes..."
- **Build on past advice** — if you previously suggested changes, ask if they tried them. If data has changed since a note was written, comment on the improvement or regression.
- **Save new observations** using `save_coach_note` after meaningful insights. Don't save trivial things — save patterns, strategic advice, and key observations you'd want to remember next time.
- **Update existing notes** when your understanding evolves — use the same topic to overwrite stale observations.
- **Always take notes after reviewing a deck's cards** — save the deck's archetype, key synergies, notable inclusions or omissions, and any advice you gave. You can only hold one deck's cards in memory at a time, so notes are how you remember what you've seen across the conversation.

## Topics You Should Proactively Explore

When the player asks general questions like "what should I improve?" or "any suggestions?", consider:

- **Underperforming decks**: Decks with high game counts but low win rates — are they poorly built, poorly piloted, or facing bad matchups?
- **Nemesis commanders**: Commanders that consistently beat them — what strategies counter those commanders?
- **Color identity blind spots**: Colors they avoid or underperform with — are they missing strong strategies?
- **Pod size patterns**: Do they perform differently in 3-player vs 4-player games? This can indicate whether their decks are built for 1v1 racing or multiplayer politics
- **Streak analysis**: Are they on a cold streak? What changed?
- **Deck diversity**: Are they playing the same commander repeatedly, or exploring?
- **Win rate vs fun**: A low win rate isn't always bad — some decks are built for fun. But if a competitive deck is losing, that's worth analyzing
- **Metagame adaptation**: If one opponent dominates, what tech choices could help?
- **Deckbuilding advice**: Card suggestions for specific decks based on their commander and color identity

## Deckbuilding Strategy Advice

When discussing a player's deck, try to determine what the deck is "trying to do" at a high level — its archetype and win condition. Think in terms like: combo, aggro, voltron, aristocrats, stax, control, group hug, tokens, spellslinger, reanimator, etc. Use `lookup_card` to research the commander and suggest cards that fit the strategy.

When suggesting cards:
- Explain WHY the card fits the deck's strategy, not just that it's "good"
- Suggest alternatives to cards that may be underperforming for the archetype
- Consider budget — don't only suggest expensive staples
- Think about synergy over raw power

## Card Advantage in Multiplayer

This is a critical concept in Commander that many players underestimate. When advising:

- **1-for-1 removal is often a trap in 4-player games**: You spend one card to remove one threat, but you still have 2 other opponents with their threats intact. You've traded a card to solve one player's problem while falling behind the table. The net result is card *disadvantage* relative to the table.
- **Prefer answers that generate advantage**: Board wipes, removal that draws cards (e.g. **Ravenous Chupacabra**), or removal stapled onto bodies. Effects that answer multiple problems (e.g. **Vandalblast** overloaded vs individual artifact destruction).
- **When 1-for-1 IS correct**: Removing a game-winning threat, disrupting a combo piece, or when the threat directly targets you. Targeted removal isn't bad — it's about knowing when to deploy it.
- **Card draw is king**: Emphasize engines and repeatable draw over one-shot draw spells. The player who sees the most cards in a game wins most often.
- **Board presence matters**: Every card played should contribute to your board state or answer a threat. Cards that do neither (e.g. pure lifegain without synergy) are traps.

## Player Elimination & Board State Ramifications

Help players think about the political and strategic implications of eliminating a player:

- **When a player leaves, their board state vanishes** — creatures, enchantments, artifacts, all gone. This can dramatically shift the balance of power. Auras and equipment attached to other players' permanents fall off. Effects like "each opponent" suddenly affect fewer players.
- **Eliminating the wrong player first can lose you the game**: If Player A is keeping Player B in check with board presence, and you eliminate Player A, Player B may now be unstoppable.
- **Consider who benefits most from a player leaving**: Sometimes keeping a struggling player alive is strategically correct — they still draw removal, cast blockers, and dilute the threat pool.
- **Timing of elimination matters**: Early eliminations make remaining players stronger (fewer threats to go around). Late eliminations often decide the game.
- **Concession impact**: A player conceding at instant speed can "fizzle" spells targeting them, remove blockers mid-combat, or eliminate triggered abilities — this is a real strategic concern in some groups.

## Rules Knowledge

You have full access to MTG rules via the `lookup_card` tool (Scryfall) and `get_pattern` tool (pattern library with {PATTERN_COUNT} interaction patterns). When a question touches rules, look things up — don't guess.

## Card Name Formatting

Always bold card names: **Lightning Bolt**, **Teysa Karlov**. This renders them as interactive card previews in the UI.

## CARDS: Manifest

At the end of EVERY response that mentions specific Magic cards, append exactly one line:

CARDS: [[Full Card Name]], [[Another Card Name]]

List every MTG card you referenced by exact Oracle name. If no cards were mentioned, omit the CARDS line.

PROMPT;

// Inject pattern count
$patternCount = $db->query("SELECT COUNT(*) FROM rules_patterns")->fetchColumn();
$systemPrompt = str_replace('{PATTERN_COUNT}', $patternCount, $systemPrompt);

// Inject player data
$systemPrompt .= $playerDataPrompt;

// ── Tool definitions (shared with Rules Guru) ─────────────────────────────
$tools = [
    [
        'name'        => 'lookup_card',
        'description' => 'Look up a Magic: The Gathering card by name using the Scryfall API. Returns Oracle text, type line, mana cost, and official rulings.',
        'input_schema' => [
            'type'       => 'object',
            'properties' => [
                'name' => [
                    'type'        => 'string',
                    'description' => 'The card name to look up (fuzzy matching supported)',
                ],
            ],
            'required' => ['name'],
        ],
    ],
    [
        'name'        => 'get_pattern',
        'description' => 'Fetch a rules interaction pattern by ID from the pattern library. Returns a distilled summary by default.',
        'input_schema' => [
            'type'       => 'object',
            'properties' => [
                'pattern_id' => [
                    'type'        => 'string',
                    'description' => 'The pattern ID, e.g. "P001"',
                ],
                'full_content' => [
                    'type'        => 'boolean',
                    'description' => 'Set true for full markdown content',
                ],
            ],
            'required' => ['pattern_id'],
        ],
    ],
    [
        'name'        => 'save_coach_note',
        'description' => 'Save an observation about this player for future coaching sessions. Use this to record insights, patterns, or advice you want to remember. Notes persist across conversations — use them to track progress and maintain continuity. If a note with the same topic already exists, it will be updated.',
        'input_schema' => [
            'type'       => 'object',
            'properties' => [
                'topic' => [
                    'type'        => 'string',
                    'description' => 'Short topic label (e.g. "Deck: Teysa Aristocrats", "Color gap: Blue", "Nemesis: Bob")',
                ],
                'observation' => [
                    'type'        => 'string',
                    'description' => 'What you observed or advised — be specific and actionable',
                ],
                'reasoning' => [
                    'type'        => 'string',
                    'description' => 'Why this matters — your strategic reasoning behind this observation',
                ],
            ],
            'required' => ['topic', 'observation', 'reasoning'],
        ],
    ],
    [
        'name'        => 'lookup_decklist',
        'description' => 'Fetch the full card list for one of the player\'s decks. Use this to analyze deckbuilding, suggest improvements, and understand what the deck is trying to do. Returns card names grouped by type.',
        'input_schema' => [
            'type'       => 'object',
            'properties' => [
                'deck_id' => [
                    'type'        => 'integer',
                    'description' => 'The deck ID from the player\'s deck list',
                ],
            ],
            'required' => ['deck_id'],
        ],
    ],
];

// ── Tool execution ────────────────────────────────────────────────────────
function executeTool(string $name, array $input): string {
    if ($name === 'lookup_card') {
        $cardName = urlencode($input['name'] ?? '');
        $ch = curl_init("https://api.scryfall.com/cards/named?fuzzy=$cardName");
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 10,
            CURLOPT_USERAGENT      => 'CommanderCollector/3.11 (coach-chat)',
        ]);
        $body   = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        if ($status !== 200 || !$body) return json_encode(['error' => "Card not found: {$input['name']}"]);
        $card = json_decode($body, true);

        $rulings = [];
        if (!empty($card['rulings_uri'])) {
            $rch = curl_init($card['rulings_uri']);
            curl_setopt_array($rch, [CURLOPT_RETURNTRANSFER => true, CURLOPT_TIMEOUT => 10, CURLOPT_USERAGENT => 'CommanderCollector/3.11']);
            $rbody = curl_exec($rch);
            if ($rbody) {
                $rdata = json_decode($rbody, true);
                $rulings = array_map(fn($r) => $r['comment'], $rdata['data'] ?? []);
            }
        }

        return json_encode([
            'name'        => $card['name'] ?? '',
            'mana_cost'   => $card['mana_cost'] ?? '',
            'type_line'   => $card['type_line'] ?? '',
            'oracle_text' => $card['oracle_text'] ?? '',
            'power'       => $card['power'] ?? null,
            'toughness'   => $card['toughness'] ?? null,
            'keywords'    => $card['keywords'] ?? [],
            'rulings'     => $rulings,
        ]);
    }

    if ($name === 'get_pattern') {
        global $db;
        $pid = strtolower(trim($input['pattern_id'] ?? ''));
        $stmt = $db->prepare("SELECT pattern_id, name, category, cr_refs, tags, content, examples_count FROM rules_patterns WHERE LOWER(pattern_id) = ?");
        $stmt->execute([$pid]);
        $row = $stmt->fetch();
        if (!$row) return json_encode(['error' => "Pattern not found: {$input['pattern_id']}"]);

        $full = !empty($input['full_content']);
        if ($full) {
            return json_encode($row);
        }
        // Distilled view
        $content = $row['content'] ?? '';
        $out = "**{$row['pattern_id']} — {$row['name']}** ({$row['category']})\n";
        foreach (['Abstract', 'The Pattern', 'Definitive Conclusions'] as $section) {
            if (preg_match('/##\s+' . preg_quote($section, '/') . '\s*\n+(.*?)(?=\n##\s|\z)/s', $content, $m)) {
                $text = trim(preg_replace('/###.*$/s', '', trim($m[1])));
                $out .= "\n**{$section}:**\n{$text}\n";
            }
        }
        return json_encode(['pattern_id' => $row['pattern_id'], 'name' => $row['name'], 'summary' => $out]);
    }

    if ($name === 'save_coach_note') {
        global $db, $playerId;
        $topic       = trim($input['topic'] ?? '');
        $observation = trim($input['observation'] ?? '');
        $reasoning   = trim($input['reasoning'] ?? '');
        if (!$topic || !$observation) return json_encode(['error' => 'topic and observation are required']);

        // Upsert: update if same topic exists for this player
        $stmt = $db->prepare("SELECT id FROM coach_notes WHERE player_id = ? AND topic = ? LIMIT 1");
        $stmt->execute([$playerId, $topic]);
        $existing = $stmt->fetchColumn();

        if ($existing) {
            $stmt = $db->prepare("UPDATE coach_notes SET observation = ?, reasoning = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?");
            $stmt->execute([$observation, $reasoning, $existing]);
            return json_encode(['saved' => true, 'note_id' => (int)$existing, 'action' => 'updated']);
        } else {
            $stmt = $db->prepare("INSERT INTO coach_notes (player_id, topic, observation, reasoning) VALUES (?, ?, ?, ?)");
            $stmt->execute([$playerId, $topic, $observation, $reasoning]);
            return json_encode(['saved' => true, 'note_id' => (int)$db->lastInsertId(), 'action' => 'created']);
        }
    }

    if ($name === 'lookup_decklist') {
        global $db;
        $deckId = (int)($input['deck_id'] ?? 0);
        if (!$deckId) return json_encode(['error' => 'deck_id is required']);

        $stmt = $db->prepare("
            SELECT dc.card_name, dc.quantity, dc.is_commander, sc.type_line
            FROM deck_cards dc
            LEFT JOIN scryfall_card_cache sc ON sc.scryfall_id = dc.scryfall_id
            WHERE dc.deck_id = ?
            ORDER BY dc.is_commander DESC, dc.card_name ASC
        ");
        $stmt->execute([$deckId]);
        $rows = $stmt->fetchAll();

        if (empty($rows)) return json_encode(['error' => "No cards found for deck {$deckId}"]);

        $groups = ['Commander' => [], 'Creature' => [], 'Instant' => [], 'Sorcery' => [],
                   'Enchantment' => [], 'Artifact' => [], 'Planeswalker' => [], 'Land' => [], 'Other' => []];
        foreach ($rows as $row) {
            $entry = $row['quantity'] > 1 ? "{$row['quantity']}x {$row['card_name']}" : $row['card_name'];
            if ($row['is_commander']) { $groups['Commander'][] = $entry; continue; }
            $type = $row['type_line'] ?? '';
            if (str_contains($type, 'Land'))             $groups['Land'][]        = $entry;
            elseif (str_contains($type, 'Creature'))     $groups['Creature'][]    = $entry;
            elseif (str_contains($type, 'Instant'))      $groups['Instant'][]     = $entry;
            elseif (str_contains($type, 'Sorcery'))      $groups['Sorcery'][]     = $entry;
            elseif (str_contains($type, 'Enchantment'))  $groups['Enchantment'][] = $entry;
            elseif (str_contains($type, 'Artifact'))     $groups['Artifact'][]    = $entry;
            elseif (str_contains($type, 'Planeswalker')) $groups['Planeswalker'][]= $entry;
            else                                         $groups['Other'][]       = $entry;
        }

        $out = [];
        foreach ($groups as $label => $cards) {
            if (!empty($cards)) $out[$label] = $cards;
        }
        return json_encode(['deck_id' => $deckId, 'cards' => $out, 'total_cards' => count($rows)]);
    }

    return json_encode(['error' => "Unknown tool: $name"]);
}

// ── Build messages array ──────────────────────────────────────────────────
$messages = [];
// Include conversation history from client (last 10 messages max)
$historySlice = array_slice($history, -10);
foreach ($historySlice as $msg) {
    if (!empty($msg['role']) && !empty($msg['content'])) {
        $messages[] = ['role' => $msg['role'], 'content' => $msg['content']];
    }
}
// Add current user message
$messages[] = ['role' => 'user', 'content' => $userMessage];

// ── Claude API tool-use loop ──────────────────────────────────────────────
$maxIter          = 6;
$iter             = 0;
$assistantContent = '';

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
        $assistantContent = 'I encountered an error processing your request. Please try again.';
        break;
    }

    $response   = json_decode($body, true);
    $stopReason = $response['stop_reason'] ?? 'end_turn';
    $content    = $response['content'] ?? [];

    foreach ($content as $block) {
        if ($block['type'] === 'text') {
            $assistantContent .= $block['text'];
        }
    }

    if ($stopReason !== 'tool_use') break;

    $messages[] = ['role' => 'assistant', 'content' => $content];

    $toolResults = [];
    foreach ($content as $block) {
        if ($block['type'] !== 'tool_use') continue;
        $toolResults[] = [
            'type'        => 'tool_result',
            'tool_use_id' => $block['id'],
            'content'     => executeTool($block['name'], $block['input'] ?? []),
        ];
    }
    $messages[] = ['role' => 'user', 'content' => $toolResults];
}

// ── Write result to temp file for polling ─────────────────────────────────
file_put_contents($cacheFile, json_encode([
    'complete' => true,
    'response' => $assistantContent,
]));
