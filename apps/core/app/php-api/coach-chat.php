<?php
// Suppress deprecated/notice output that would corrupt JSON responses.
// Capture any unexpected output and report it in the response instead.
ini_set('display_errors', '0');
error_reporting(E_ALL & ~E_DEPRECATED & ~E_NOTICE);
ob_start();

define('COACH_LOG', sys_get_temp_dir() . '/coach_chat_debug.log');
function coachLog(string $msg): void {
    file_put_contents(COACH_LOG, date('[Y-m-d H:i:s] ') . $msg . "\n", FILE_APPEND | LOCK_EX);
}

/**
 * Like sendJSON() but drains the output buffer first.
 * Any unexpected PHP output is logged and included as '_php_output' in the response.
 */
function coachJSON(array $payload, int $status = 200): never {
    $leaked = trim((string) ob_get_clean());
    if ($leaked !== '') {
        coachLog('Unexpected PHP output: ' . $leaked);
        $payload['_php_output'] = $leaked;
    }
    http_response_code($status);
    header('Content-Type: application/json');
    echo json_encode($payload);
    exit();
}

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
    if (!$requestId) coachJSON(['error' => 'poll parameter required'], 400);

    $cacheFile = sys_get_temp_dir() . '/coach_chat_' . preg_replace('/[^a-zA-Z0-9_-]/', '', $requestId) . '.json';

    if (!file_exists($cacheFile)) {
        coachJSON(['status' => 'processing', 'partial' => '']);
    }

    $data = json_decode(file_get_contents($cacheFile), true);
    if (!$data || empty($data['complete'])) {
        coachJSON(['status' => 'processing', 'partial' => $data['partial'] ?? '']);
    }

    // Clean up temp file
    @unlink($cacheFile);

    $payload = [
        'status'      => 'complete',
        'response'    => $data['response'] ?? '',
        'tools_used'  => $data['tools_used'] ?? [],
    ];
    if (!empty($data['_debug'])) {
        $payload['_debug'] = $data['_debug'];
        coachLog('Complete — ' . json_encode($data['_debug']));
    }
    coachJSON($payload);
}

if ($method !== 'POST') coachJSON(['error' => 'Method not allowed'], 405);

set_time_limit(300);
ignore_user_abort(true);

$apiKey = defined('ANTHROPIC_API_KEY') ? ANTHROPIC_API_KEY : null;
if (!$apiKey) coachJSON(['error' => 'Anthropic API key not configured'], 500);

$input              = getJSONInput();
$userMessage        = trim($input['message'] ?? '');
$history            = $input['history'] ?? [];
$activeDeck         = $input['active_deck'] ?? null; // { id, name, commander, card_count, colors }
$activeList         = $input['active_list'] ?? null; // { id, name, card_count }
$isNewConversation  = empty($history);

if (!$userMessage) coachJSON(['error' => 'message is required'], 400);

// Generate a unique request ID for polling
$requestId = bin2hex(random_bytes(16));
$cacheFile = sys_get_temp_dir() . '/coach_chat_' . $requestId . '.json';

// Write placeholder so poll knows it's in progress
file_put_contents($cacheFile, json_encode(['complete' => false]));

// ── Return immediately — client will poll ─────────────────────────────────
// Drain output buffer — log any leaked PHP warnings before sending response
$leaked = trim((string) ob_get_clean());
if ($leaked !== '') {
    coachLog('PHP output before early response: ' . $leaked);
}

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
$playerId = $player ? (string)$player['id'] : '';

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

    // Load player's lists (names + card counts)
    $stmt = $db->prepare("
        SELECT l.id, l.name, l.description, l.updated_at, COALESCE(SUM(lc.quantity), 0) AS card_count
        FROM lists l
        LEFT JOIN list_cards lc ON lc.list_id = l.id
        WHERE l.user_id = ?
        GROUP BY l.id
        ORDER BY l.updated_at DESC
    ");
    $stmt->execute([$userId]);
    $playerLists = $stmt->fetchAll();

    // Build data prompt
    $playerDataPrompt = "\n\n---\n\n## Player Profile: {$playerName}\n\n";
    $playerDataPrompt .= "**Overall:** {$overall['total_games']} games, {$overall['wins']} wins, {$overall['win_rate']}% win rate, avg finish: {$overall['avg_finish']}\n";
    $playerDataPrompt .= "**Current streak:** {$currentStreak} {$currentStreakType}" . ($currentStreak > 1 ? 's' : '') . "\n\n";

    // Get card counts for each deck via the main list
    $cardCountStmt = $db->prepare(
        "SELECT l.deck_id, COALESCE(SUM(lc.quantity), 0) AS cnt
         FROM lists l
         LEFT JOIN list_cards lc ON lc.list_id = l.id
         WHERE l.deck_id IN (" . implode(',', array_map(fn($d) => $db->quote($d['id']), $decks)) . ")
           AND l.role = 'main' AND l.deleted_at IS NULL
         GROUP BY l.deck_id"
    );
    $cardCountStmt->execute();
    $cardCounts = [];
    while ($row = $cardCountStmt->fetch()) {
        $cardCounts[$row['deck_id']] = (int)$row['cnt'];
    }

    $playerDataPrompt .= "### Decks\n\n";
    $playerDataPrompt .= "You can see deck names and stats below. Use `check_card_in_deck`, `search_deck_cards`, `get_deck_stats`, or `lookup_decklist` to query a deck's cards and history on demand — do not guess at contents.\n\n";
    $playerDataPrompt .= "| deck_id | Deck | Commander | Colors | Cards | Games | Wins | Win Rate | Avg Finish |\n";
    $playerDataPrompt .= "|---------|------|-----------|--------|-------|-------|------|----------|------------|\n";
    foreach ($decks as $d) {
        $cc = $cardCounts[(string)$d['id']] ?? 0;
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

    if (!empty($playerLists)) {
        $playerDataPrompt .= "\n### Card Lists\n\n";
        $playerDataPrompt .= "Standalone card collections (separate from decks). The player can ask you to create new lists — use `create_list` only when explicitly requested.\n\n";
        $playerDataPrompt .= "| list_id | Name | Cards | Description | Updated |\n";
        $playerDataPrompt .= "|---------|------|-------|-------------|--------|\n";
        foreach ($playerLists as $l) {
            $desc = $l['description'] ? substr($l['description'], 0, 50) : '—';
            $playerDataPrompt .= "| {$l['id']} | {$l['name']} | {$l['card_count']} | {$desc} | {$l['updated_at']} |\n";
        }
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

        if ($isNewConversation) {
            $playerDataPrompt .= "\n**This is the start of a new conversation.** Open your first response with a brief, natural callback to the single most relevant or recent observation — e.g. \"Last time I noticed your Teysa deck was struggling against fast aggro — has that improved?\" or \"We talked about your blue matchup last session, curious if you've made any changes.\" Keep it to one observation, conversational, not a list. Then answer whatever they asked.";
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

## CRITICAL: Always Look Up Cards First — No Exceptions, Ever

**This is the single most important rule. You must call `lookup_card` before saying ANYTHING about ANY card, every single time, no exceptions.**

Your training data about MTG cards is unreliable. Cards get errata. Oracle text changes. You misremember costs, types, and effects. Every time you speak about a card without looking it up, you risk giving wrong information to a player who is going to act on it. This is unacceptable.

**The rule is absolute:**
- Never mention a card's mana cost without having looked it up this conversation
- Never describe what a card does without having looked it up this conversation
- Never say a card is "good" or "bad" for a deck without having looked it up this conversation
- Never suggest adding, cutting, or keeping a card without having looked it up this conversation
- Never discuss a synergy between cards without having looked up every card involved this conversation
- Never answer a rules question about a specific card without having looked it up this conversation

**There is no exception for "well-known" cards.** Sol Ring, Command Tower, Cyclonic Rift — look them all up. You have been wrong about famous staples before. The lookup is instant. There is no cost to doing it. There is a real cost to not doing it.

**Batching is mandatory for multiple cards:**
- Before recommending cards: put ALL names in one `lookup_card` call with a `names` array
- Before suggesting cuts: batch-look up all candidates at once
- Before discussing synergies: look up every card involved in one call
- Never call `lookup_card` N times for N cards — one call with all N names

**If you realize mid-response that you mentioned a card without looking it up: stop immediately, call `lookup_card`, and correct yourself.** Do not continue until you have verified the Oracle text.

The player is trusting your advice. Guessing is a betrayal of that trust.

## CRITICAL: Never Fabricate Deck Data

**NEVER make claims about what is or isn't in a deck without calling a deck tool first.** Do not infer contents from the commander, color identity, or strategy archetype. This includes:

- "You probably run **Sol Ring**" — call `check_card_in_deck` to verify
- "Most Atraxa decks include..." — stop. Check this specific deck
- Listing cards the deck "likely" has — call `lookup_decklist` or `search_deck_cards`

If a deck tool returns no data, an empty list, or an error:

1. **State the gap clearly** — "I don't have a card list for this deck."
2. **Tell the player what would help** — be specific: "If you add a decklist, I could verify whether you're running enough interaction" or "Knowing your mana base would let me evaluate your curve."
3. **Ask targeted questions instead of guessing** — if you need to know whether a specific card is in the deck and no list is available, ask the player directly: "Do you have **Rhystic Study** in this build?" or "Are you running any board wipes?" Work with what they tell you, and label it as player-reported rather than verified.
4. **Ask the player to fill in the gaps** — if tools don't provide what you need to give confident advice, ask the player directly. Examples: "What's your win condition with this deck?", "Do you have a consistent way to draw cards?", "What does your removal package look like?" Use their answers to inform your analysis, and note that it's player-reported.
5. **Never fill in the blanks** — do not assume the deck contains anything based on the commander, colors, or archetype. Every unverified assumption must be labeled as speculative or confirmed by the player.

The same rules apply when requesting data about **opponent decks** via deeper analysis tools. If an opponent's decklist is unavailable, respond in this style:

> "I can't see any cards associated with that deck — a decklist would definitely help me give you better advice here. Do you know if they run **[specific card]**?"

Then ask about the specific information most relevant to your analysis — this could be a single card, or a broader category if that's what you need:

- **Specific card**: "Do you know if they run **Cyclonic Rift**?"
- **Removal package**: "Do you have a sense of how much removal they're running — spot removal, board wipes, both?"
- **Mana base**: "How consistent is their mana? Do they run a lot of ramp or are they often color-screwed?"
- **Creatures**: "Are they creature-heavy or more of a spell-based strategy?"
- **Win condition**: "Do you know what they're trying to do to win — combo, beatdown, control?"

Ask only what you actually need to complete your analysis. Player knowledge of their opponents' decks is valid coaching input; treat it as player-reported and reason from it accordingly.

## Certainty Grading

Always be explicit about the basis for your claims. Use these labels naturally in conversation — don't use the exact words as headers, but make the distinction clear:

- **Verified** — from a tool result this conversation. "Your decklist shows 12 creatures."
- **Inferred** — from match statistics or game data. "Based on your 30% win rate with this deck..."
- **Speculative** — your strategic theory, not backed by data. "A deck like this would typically want more card draw, though I haven't checked yours yet."

Lead with verified facts. Flag when you're speculating. If you're about to make a speculative claim about a specific deck, offer to check it with a tool instead.

## Self-Correction

If you made a claim that turns out to be wrong — whether the player corrects you or a tool returns contradicting data — **acknowledge it directly**. Don't quietly pivot or reframe. Say "I was wrong about that" and correct the record. Players trust data-backed coaching; unexplained inconsistencies undermine that trust.

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

## CRITICAL: Lists — Explicit Permission Only

The player has standalone card lists — named collections separate from decks (e.g. "trade binder", "upgrade targets", "wishlist"). You can see their existing lists in the player data below.

**NEVER call `create_list` unless the player explicitly asks you to save or create a list.** Do not create lists:
- Proactively, as a suggestion, or as a "helpful" next step
- As part of deckbuilding advice ("I'll save these suggestions as a list for you")
- Just because you recommended a set of cards

The only time you may call `create_list` is when the player uses clear intent language like: "save that as a list", "create a list called...", "make a list of those cards", "add those to a new list", "can you save this for me?"

When creating or updating a list, confirm what you're about to save before calling the tool if there's any ambiguity about the name or contents.

If the list appears to be deck-based and you can conclusively identify the commander (from a deck's commander slot, the player naming one, or a prior `lookup_decklist` result showing `is_commander`), mark it in the cards array. If it's unclear whether the list has a commander at all, or which card it is, ask the player before saving — e.g. "Is there a commander for this list, or is it just a collection?"

To **modify** an existing list: call `get_list_cards` first to retrieve the current contents, make the requested changes to the array, then call `update_list` with the full modified array. `update_list` replaces the entire card list — never call it without sending the complete intended contents. Apply the same "explicit request only" rule as create_list.

## Card Name Formatting

Wrap card names in double brackets: [[Lightning Bolt]], [[Teysa Karlov]]. This renders them as interactive card preview chips in the UI — the player can hover to see the card image.

Use `[[Card Name]]` for every Magic card you mention. Use **bold** only for non-card emphasis (e.g. **important concept**, **deck archetype**). Never bold a card name — use brackets instead.

## CRITICAL: Tool Call Discipline

**Never announce what you are about to do before calling a tool.** Do not write "Let me check that", "I'll build this now", "Here's the list:", or any similar anticipatory text before a tool call. The player sees your text immediately and will be left waiting if you announce something but then call a tool instead of delivering it.

**The rule:** Call tools silently. Only write text AFTER you have the results and are ready to deliver the complete answer. Your final text response should contain the full answer — not a promise to deliver one.

**Correct pattern:**
1. Receive request
2. Call tools (no text before)
3. Use tool results
4. Write your complete response

**Wrong pattern:**
1. Write "Let me build a 100-card decklist for you:"
2. Call create_list
3. Write "Wait, that's only 89 cards, let me fix that:"
4. Call update_list
5. (loop ends — player never gets the list)

If you need multiple tool calls, do them all silently first. Only write text when you are fully done and ready to present the complete response.

PROMPT;

// Inject pattern count
$patternCount = $db->query("SELECT COUNT(*) FROM rules_patterns")->fetchColumn();
$systemPrompt = str_replace('{PATTERN_COUNT}', $patternCount, $systemPrompt);

// Inject player data
$systemPrompt .= $playerDataPrompt;

// Inject active deck hint if provided
if ($activeDeck) {
    $systemPrompt .= "\n\n## Currently Viewed Deck\n\n";
    $systemPrompt .= "The player currently has **{$activeDeck['name']}** (deck_id: {$activeDeck['id']}) open on the page. ";
    $systemPrompt .= "Commander: {$activeDeck['commander']} | Colors: {$activeDeck['colors']} | Cards: {$activeDeck['card_count']}\n\n";
    $systemPrompt .= "Deck data tools available for this deck: `check_card_in_deck`, `search_deck_cards`, `get_deck_stats` (includes match history, matchups, recent games), `lookup_decklist` (full card list — use only when you need everything). Prefer the targeted tools over the full list to minimize token usage.\n\n";
    if (!empty($activeDeck['commander'])) {
        $systemPrompt .= "## STOP STATE: Commander Card Lookup Required\n\n";
        $systemPrompt .= "**Before doing anything else with this deck — before reading stats, before answering any question, before any analysis — you must call `lookup_card` for the commander: {$activeDeck['commander']}.**\n\n";
        $systemPrompt .= "If `lookup_card` returns an error or cannot find **{$activeDeck['commander']}**, you must STOP immediately and tell the player:\n";
        $systemPrompt .= "- That the commander card could not be found\n";
        $systemPrompt .= "- That you cannot reliably analyze this deck without verified Oracle text for the commander\n";
        $systemPrompt .= "- Ask them to confirm the correct card name before you proceed\n\n";
        $systemPrompt .= "Do NOT proceed with any deck analysis until either:\n";
        $systemPrompt .= "- The commander lookup succeeds, OR\n";
        $systemPrompt .= "- The player explicitly defers (e.g. \"skip it\", \"don't worry about it\", \"just continue\", \"proceed anyway\") — in which case you may proceed but must note that commander analysis will be based on unverified data.\n\n";
        $systemPrompt .= "This is a hard stop — do not work around it, do not guess the commander's abilities, do not analyze the deck using your training data about the commander until one of those two conditions is met.";
    }
}

// Inject active list hint if provided
if ($activeList) {
    $systemPrompt .= "\n\n## Currently Viewed List\n\n";
    $systemPrompt .= "The player currently has the card list **{$activeList['name']}** (list_id: {$activeList['id']}, {$activeList['card_count']} cards) open. ";
    $systemPrompt .= "This is a standalone card list — not a Commander deck. Use `lookup_card` or the Scryfall search tools to discuss individual cards from it.";
}

// ── Tool definitions (shared with Rules Guru) ─────────────────────────────
$tools = [
    [
        'name'        => 'lookup_card',
        'description' => 'Look up one or more Magic: The Gathering cards by name using the Scryfall API. Batch up to 75 names per call. If you need more than 75, make two calls. Returns Oracle text, type line, mana cost, and keywords for each card.',
        'input_schema' => [
            'type'       => 'object',
            'properties' => [
                'names' => [
                    'type'        => 'array',
                    'items'       => ['type' => 'string'],
                    'maxItems'    => 75,
                    'description' => 'Card names to look up (fuzzy matching supported). Max 75 per call — make a second call if you have more.',
                ],
            ],
            'required' => ['names'],
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
        'description' => 'Fetch the FULL card list for a deck, grouped by type. Use only when you need to see every card. For targeted queries prefer check_card_in_deck or search_deck_cards. If the result is empty or an error, the deck has no recorded list — do not fabricate contents.',
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
    [
        'name'        => 'lookup_opponent_deck',
        'description' => 'Find decks belonging to other players by commander name. Returns deck ID, player name, card count, and basic stats so you can then use check_card_in_deck, search_deck_cards, or lookup_decklist on the opponent\'s deck. If no decklist is found, follow the gap-filling protocol — ask the player what they know about the deck.',
        'input_schema' => [
            'type'       => 'object',
            'properties' => [
                'commander_name' => [
                    'type'        => 'string',
                    'description' => 'Commander name to search for (partial match supported)',
                ],
            ],
            'required' => ['commander_name'],
        ],
    ],
    [
        'name'        => 'check_card_in_deck',
        'description' => 'Check whether a specific card is in a deck. Returns presence and quantity. Much cheaper than fetching the full list when you only need to know about one card.',
        'input_schema' => [
            'type'       => 'object',
            'properties' => [
                'deck_id'   => ['type' => 'integer', 'description' => 'The deck ID'],
                'card_name' => ['type' => 'string',  'description' => 'Card name to search for (partial match supported)'],
            ],
            'required' => ['deck_id', 'card_name'],
        ],
    ],
    [
        'name'        => 'search_deck_cards',
        'description' => 'Search a deck\'s card list by name fragment and/or card type. Returns only matching cards. Use when you need a subset (e.g. "all creatures" or "cards with Rhystic in the name").',
        'input_schema' => [
            'type'       => 'object',
            'properties' => [
                'deck_id'       => ['type' => 'string',  'description' => 'The deck ID'],
                'query'         => ['type' => 'string',  'description' => 'Name fragment to search (case-insensitive, optional)'],
                'type_category' => ['type' => 'string',  'description' => 'Filter by type: Creature, Instant, Sorcery, Enchantment, Artifact, Planeswalker, Land, Other (optional)'],
            ],
            'required' => ['deck_id'],
        ],
    ],
    [
        'name'        => 'get_deck_stats',
        'description' => 'Get win/loss record, average finish, finish position distribution, matchup records vs opposing commanders, and recent game results for a deck.',
        'input_schema' => [
            'type'       => 'object',
            'properties' => [
                'deck_id' => ['type' => 'integer', 'description' => 'The deck ID'],
            ],
            'required' => ['deck_id'],
        ],
    ],
    [
        'name'        => 'create_list',
        'description' => 'Create a new standalone card list for the player. ONLY call this when the player explicitly asks you to save or create a list — never create lists proactively, as suggestions, or as part of deckbuilding advice. If the list has a commander (e.g. it was sourced from a deck, the player named a commander, or one card is unambiguously the commander), set is_commander: true on that card. Only set is_commander when you can determine it conclusively — do not guess.',
        'input_schema' => [
            'type'       => 'object',
            'properties' => [
                'name' => [
                    'type'        => 'string',
                    'description' => 'Name for the list',
                ],
                'description' => [
                    'type'        => 'string',
                    'description' => 'Optional description for the list',
                ],
                'cards' => [
                    'type'        => 'array',
                    'description' => 'Cards to include in the list',
                    'items'       => [
                        'type'       => 'object',
                        'properties' => [
                            'card_name'    => ['type' => 'string',  'description' => 'Exact card name'],
                            'quantity'     => ['type' => 'integer', 'description' => 'Quantity (default 1)'],
                            'is_commander' => ['type' => 'boolean', 'description' => 'Set true only when you can conclusively identify this card as the commander — sourced from a deck\'s commander slot, explicitly stated by the player, or otherwise unambiguous. Do not guess.'],
                        ],
                        'required' => ['card_name'],
                    ],
                ],
            ],
            'required' => ['name', 'cards'],
        ],
    ],
    [
        'name'        => 'get_list_cards',
        'description' => 'Fetch the full card list for a player list by list_id. Use this before calling update_list to see current contents.',
        'input_schema' => [
            'type'       => 'object',
            'properties' => [
                'list_id' => ['type' => 'integer', 'description' => 'The list ID from the player\'s lists'],
            ],
            'required' => ['list_id'],
        ],
    ],
    [
        'name'        => 'update_list',
        'description' => 'Update an existing player list — rename it, change its description, or replace its card contents. ONLY call this when the player explicitly asks you to modify a list. This replaces the ENTIRE card array, so always call get_list_cards first and include all cards you want to keep. Do not call this proactively.',
        'input_schema' => [
            'type'       => 'object',
            'properties' => [
                'list_id' => [
                    'type'        => 'integer',
                    'description' => 'The list ID to update',
                ],
                'name' => [
                    'type'        => 'string',
                    'description' => 'New name (optional — omit to keep current)',
                ],
                'description' => [
                    'type'        => 'string',
                    'description' => 'New description (optional — omit to keep current)',
                ],
                'cards' => [
                    'type'        => 'array',
                    'description' => 'Complete replacement card list. Must include ALL cards you want to keep — anything omitted is deleted.',
                    'items'       => [
                        'type'       => 'object',
                        'properties' => [
                            'card_name'    => ['type' => 'string',  'description' => 'Exact card name'],
                            'quantity'     => ['type' => 'integer', 'description' => 'Quantity (default 1)'],
                            'is_commander' => ['type' => 'boolean', 'description' => 'Set true only when conclusively known'],
                        ],
                        'required' => ['card_name'],
                    ],
                ],
            ],
            'required' => ['list_id'],
        ],
    ],
    [
        'name'        => 'search_scryfall',
        'description' => 'Search Scryfall for cards using Scryfall query syntax. Use this to find cards by name fragment, type, oracle text, color, mana cost, format legality, etc. Returns up to 20 matching cards with name, type, mana cost, oracle text, and color identity. Examples: "t:creature o:\"draw a card\" c:blue", "is:commander id<=WU", "o:\"whenever you cast\" t:enchantment", "year<=2020 t:saga". Use this to research card suggestions, find synergies, or explore what exists in a color/strategy space.',
        'input_schema' => [
            'type'       => 'object',
            'properties' => [
                'query' => [
                    'type'        => 'string',
                    'description' => 'Scryfall search query using Scryfall syntax (e.g. "t:creature o:\"proliferate\" c:green", "is:commander id:grixis", "o:\"sacrifice\" t:enchantment")',
                ],
                'order' => [
                    'type'        => 'string',
                    'description' => 'Sort order: edhrec (popularity in EDH, default), name, released, cmc, power, toughness, usd',
                ],
            ],
            'required' => ['query'],
        ],
    ],
    [
        'name'        => 'search_oracle',
        'description' => 'Search for cards containing specific oracle text. A convenience wrapper around search_scryfall for pure oracle text searches. Use when you want to find cards that do a specific thing (e.g. "whenever a creature dies", "put a +1/+1 counter", "search your library for a land"). Returns up to 20 matching cards.',
        'input_schema' => [
            'type'       => 'object',
            'properties' => [
                'text' => [
                    'type'        => 'string',
                    'description' => 'Oracle text to search for (e.g. "whenever a creature you control dies", "draw a card for each")',
                ],
                'colors' => [
                    'type'        => 'string',
                    'description' => 'Optional color identity filter using Scryfall color notation (e.g. "WU", "grixis", "<=BRG"). Omit for colorless/any.',
                ],
                'type_filter' => [
                    'type'        => 'string',
                    'description' => 'Optional type filter (e.g. "creature", "instant", "enchantment")',
                ],
            ],
            'required' => ['text'],
        ],
    ],
    [
        'name'        => 'web_search',
        'description' => 'Search the web for Magic: The Gathering strategy content. Use this to look up EDHREC recommendations (commander staples, card suggestions by color/strategy), Scryfall card pages (rulings, legality, versions), or Gatherer Oracle rulings. Specify the site you want to search: "edhrec" for commander recommendations and rankings, "scryfall" for card database pages, "gatherer" for official Oracle rulings, or "any" for a general MTG search across all sites.',
        'input_schema' => [
            'type'       => 'object',
            'properties' => [
                'query' => [
                    'type'        => 'string',
                    'description' => 'Search query (e.g. "Atraxa proliferate staples", "Rhystic Study rulings", "Ward interaction")',
                ],
                'site' => [
                    'type'        => 'string',
                    'enum'        => ['edhrec', 'scryfall', 'gatherer', 'any'],
                    'description' => 'Which site to search: "edhrec" (commander strategy/rankings), "scryfall" (card database), "gatherer" (official rulings), "any" (general MTG search)',
                ],
            ],
            'required' => ['query', 'site'],
        ],
    ],
    [
        'name'        => 'get_game_notes',
        'description' => 'Fetch the notes field from saved games involving this player. Returns games that have non-empty notes, with the deck used and finish position. Use this to recall what happened in specific games or sessions.',
        'input_schema' => [
            'type'       => 'object',
            'properties' => [
                'limit'   => ['type' => 'integer', 'description' => 'Max number of games to return (default 10, max 30)'],
                'deck_id' => ['type' => 'integer', 'description' => 'Filter to a specific deck (optional)'],
            ],
            'required' => [],
        ],
    ],
    [
        'name'        => 'get_game_history',
        'description' => 'Query the player\'s full game history beyond the 20-game summary window. Returns game date, deck used, finish position, pod size, winning turn, and notes. Use to analyze longer-term trends or specific date ranges.',
        'input_schema' => [
            'type'       => 'object',
            'properties' => [
                'limit'     => ['type' => 'integer', 'description' => 'Number of games to return (default 30, max 100)'],
                'deck_id'   => ['type' => 'integer', 'description' => 'Filter to a specific deck (optional)'],
                'date_from' => ['type' => 'string',  'description' => 'Start date filter YYYY-MM-DD (optional)'],
                'date_to'   => ['type' => 'string',  'description' => 'End date filter YYYY-MM-DD (optional)'],
            ],
            'required' => [],
        ],
    ],
];

// ── Tool execution ────────────────────────────────────────────────────────
function executeTool(string $name, array $input): string {
    if ($name === 'lookup_card') {
        // Support both legacy single-name and new batch names array
        $names = $input['names'] ?? (isset($input['name']) ? [$input['name']] : []);
        $names = array_values(array_filter(array_map('trim', $names)));
        if (empty($names)) return json_encode(['error' => 'No card names provided']);

        $extractCard = function(array $card): array {
            return [
                'name'        => $card['name'] ?? '',
                'mana_cost'   => $card['mana_cost'] ?? '',
                'type_line'   => $card['type_line'] ?? '',
                'oracle_text' => $card['oracle_text'] ?? '',
                'power'       => $card['power'] ?? null,
                'toughness'   => $card['toughness'] ?? null,
                'keywords'    => $card['keywords'] ?? [],
            ];
        };

        // Single card — use /cards/named?fuzzy= for typo tolerance
        if (count($names) === 1) {
            $ch = curl_init('https://api.scryfall.com/cards/named?fuzzy=' . urlencode($names[0]));
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT        => 15,
                CURLOPT_USERAGENT      => 'CommanderCollector/3.11 (coach-chat)',
            ]);
            $body   = curl_exec($ch);
            $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            $data   = json_decode($body, true);
            if ($status === 200 && $data) return json_encode($extractCard($data));
            // Pass Scryfall's error (ambiguous name, not found, etc.) back to the model
            return json_encode(['error' => $data['details'] ?? "Card not found: {$names[0]}"]);
        }

        $results = [];

        // Multiple cards — batch via /cards/collection (max 75 per request)
        $total     = count($names);
        $numChunks = (int) ceil($total / 75);
        $chunkSize = (int) ceil($total / $numChunks);
        foreach (array_chunk($names, $chunkSize) as $chunk) {
            $identifiers = array_map(fn($n) => ['name' => $n], $chunk);
            $ch = curl_init('https://api.scryfall.com/cards/collection');
            curl_setopt_array($ch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_POST           => true,
                CURLOPT_POSTFIELDS     => json_encode(['identifiers' => $identifiers]),
                CURLOPT_TIMEOUT        => 15,
                CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
                CURLOPT_USERAGENT      => 'CommanderCollector/3.11 (coach-chat)',
            ]);
            $body   = curl_exec($ch);
            $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            if ($status !== 200 || !$body) {
                foreach ($chunk as $n) $results[] = ['error' => "Lookup failed for: $n"];
                continue;
            }
            $data = json_decode($body, true);
            foreach ($data['data'] ?? [] as $card) {
                $results[] = $extractCard($card);
            }
            foreach ($data['not_found'] ?? [] as $nf) {
                $results[] = ['error' => 'Not found: ' . ($nf['name'] ?? json_encode($nf))];
            }
        }

        return json_encode($results);
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
            return json_encode(['saved' => true, 'note_id' => (string)$existing, 'action' => 'updated']);
        } else {
            $newNoteId = $db->query("SELECT UUID()")->fetchColumn();
            $stmt = $db->prepare("INSERT INTO coach_notes (id, player_id, topic, observation, reasoning) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$newNoteId, $playerId, $topic, $observation, $reasoning]);
            return json_encode(['saved' => true, 'note_id' => $newNoteId, 'action' => 'created']);
        }
    }

    if ($name === 'lookup_decklist') {
        global $db;
        $deckId = (string)($input['deck_id'] ?? '');
        if (!$deckId) return json_encode(['error' => 'deck_id is required']);

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

    if ($name === 'lookup_opponent_deck') {
        global $db, $playerId;
        $commanderName = trim($input['commander_name'] ?? '');
        if (!$commanderName) return json_encode(['error' => 'commander_name is required']);

        $stmt = $db->prepare("
            SELECT d.id, d.name, d.commander, d.colors, p.name AS player_name,
                (SELECT COALESCE(SUM(lc2.quantity), 0)
                   FROM list_cards lc2
                   JOIN lists l2 ON l2.id = lc2.list_id
                   WHERE l2.deck_id = d.id AND l2.role = 'main' AND l2.deleted_at IS NULL) AS card_count,
                COUNT(DISTINCT gr.id) AS total_games,
                COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) AS wins,
                ROUND(COUNT(CASE WHEN gr.finish_position = 1 THEN 1 END) * 100.0 / NULLIF(COUNT(DISTINCT gr.id), 0), 1) AS win_rate
            FROM decks d
            JOIN players p ON p.id = d.player_id
            LEFT JOIN game_results gr ON gr.deck_id = d.id
            WHERE d.commander LIKE ? AND d.player_id != ?
            GROUP BY d.id
            ORDER BY total_games DESC
            LIMIT 5
        ");
        $stmt->execute(['%' . $commanderName . '%', $playerId]);
        $decks = $stmt->fetchAll();

        if (empty($decks)) {
            return json_encode([
                'found' => false,
                'message' => "No opponent decks found with a commander matching \"$commanderName\". No decklist is available — use the gap-filling protocol to ask the player what they know about this deck.",
            ]);
        }

        return json_encode(['found' => true, 'decks' => $decks]);
    }

    if ($name === 'check_card_in_deck') {
        global $db;
        $deckId   = (string)($input['deck_id'] ?? '');
        $cardName = trim($input['card_name'] ?? '');
        if (!$deckId || !$cardName) return json_encode(['error' => 'deck_id and card_name are required']);

        $stmt = $db->prepare("
            SELECT lc.card_name, lc.quantity,
                   (lc.role = 'commander') AS is_commander,
                   lc.role
            FROM list_cards lc
            JOIN lists l ON l.id = lc.list_id
            WHERE l.deck_id = ? AND l.role = 'main' AND l.deleted_at IS NULL
              AND lc.card_name LIKE ?
            LIMIT 5
        ");
        $stmt->execute([$deckId, '%' . $cardName . '%']);
        $rows = $stmt->fetchAll();

        if (empty($rows)) return json_encode(['found' => false, 'message' => "\"$cardName\" is not in this deck."]);

        $results = array_map(fn($r) => "{$r['quantity']}x {$r['card_name']}" . ($r['is_commander'] ? ' (commander)' : ''), $rows);
        return json_encode(['found' => true, 'matches' => $results]);
    }

    if ($name === 'search_deck_cards') {
        global $db;
        $deckId       = (string)($input['deck_id'] ?? '');
        $query        = trim($input['query'] ?? '');
        $typeCategory = trim($input['type_category'] ?? '');
        if (!$deckId) return json_encode(['error' => 'deck_id is required']);

        $sql    = "SELECT lc.card_name, lc.quantity,
                          (lc.role = 'commander') AS is_commander,
                          lc.role, sc.type_line
                   FROM list_cards lc
                   JOIN lists l ON l.id = lc.list_id
                   LEFT JOIN scryfall_card_cache sc ON sc.scryfall_id = lc.scryfall_id
                   WHERE l.deck_id = ? AND l.role = 'main' AND l.deleted_at IS NULL";
        $params = [$deckId];

        if ($query) {
            $sql     .= " AND lc.card_name LIKE ?";
            $params[] = '%' . $query . '%';
        }
        $sql .= " ORDER BY (lc.role = 'commander') DESC, lc.card_name";
        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        // Filter by type category if specified
        if ($typeCategory && !empty($rows)) {
            $rows = array_values(array_filter($rows, function ($r) use ($typeCategory) {
                if ($r['is_commander'] && strtolower($typeCategory) === 'commander') return true;
                $type = $r['type_line'] ?? '';
                return match ($typeCategory) {
                    'Creature'     => str_contains($type, 'Creature'),
                    'Instant'      => str_contains($type, 'Instant'),
                    'Sorcery'      => str_contains($type, 'Sorcery'),
                    'Enchantment'  => str_contains($type, 'Enchantment'),
                    'Artifact'     => str_contains($type, 'Artifact'),
                    'Planeswalker' => str_contains($type, 'Planeswalker'),
                    'Land'         => str_contains($type, 'Land'),
                    default        => !str_contains($type, 'Creature') && !str_contains($type, 'Instant') &&
                                     !str_contains($type, 'Sorcery')   && !str_contains($type, 'Enchantment') &&
                                     !str_contains($type, 'Artifact')  && !str_contains($type, 'Planeswalker') &&
                                     !str_contains($type, 'Land'),
                };
            }));
        }

        if (empty($rows)) return json_encode(['cards' => [], 'count' => 0]);

        $cards = array_map(fn($r) => "{$r['quantity']}x {$r['card_name']}" . ($r['is_commander'] ? ' (commander)' : ''), $rows);
        return json_encode(['cards' => $cards, 'count' => count($cards)]);
    }

    if ($name === 'get_deck_stats') {
        global $db;
        $deckId = (string)($input['deck_id'] ?? '');
        if (!$deckId) return json_encode(['error' => 'deck_id is required']);

        $stmt = $db->prepare("
            SELECT COUNT(*) AS total_games,
                COUNT(CASE WHEN finish_position = 1 THEN 1 END) AS wins,
                ROUND(COUNT(CASE WHEN finish_position = 1 THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0), 1) AS win_rate,
                ROUND(AVG(finish_position), 2) AS avg_finish,
                MIN(g.played_at) AS first_played,
                MAX(g.played_at) AS last_played
            FROM game_results gr JOIN games g ON g.id = gr.game_id WHERE gr.deck_id = ?
        ");
        $stmt->execute([$deckId]);
        $stats = $stmt->fetch();

        $stmt = $db->prepare("SELECT finish_position, COUNT(*) AS count FROM game_results WHERE deck_id = ? GROUP BY finish_position ORDER BY finish_position");
        $stmt->execute([$deckId]);
        $finishDist = $stmt->fetchAll();

        $stmt = $db->prepare("
            SELECT d2.commander AS opponent_commander,
                COUNT(DISTINCT g.id) AS games,
                SUM(CASE WHEN my.finish_position = 1 THEN 1 ELSE 0 END) AS my_wins,
                SUM(CASE WHEN opp.finish_position = 1 THEN 1 ELSE 0 END) AS their_wins
            FROM game_results my
            JOIN games g ON g.id = my.game_id
            JOIN game_results opp ON opp.game_id = g.id AND opp.player_id != my.player_id
            JOIN decks d2 ON d2.id = opp.deck_id
            WHERE my.deck_id = ?
            GROUP BY d2.commander HAVING games >= 1
            ORDER BY games DESC, their_wins DESC LIMIT 15
        ");
        $stmt->execute([$deckId]);
        $matchups = $stmt->fetchAll();

        $stmt = $db->prepare("
            SELECT g.played_at, gr.finish_position,
                (SELECT COUNT(*) FROM game_results gr2 WHERE gr2.game_id = g.id) AS pod_size,
                g.winning_turn
            FROM game_results gr JOIN games g ON g.id = gr.game_id
            WHERE gr.deck_id = ? ORDER BY g.played_at DESC, g.id DESC LIMIT 10
        ");
        $stmt->execute([$deckId]);
        $recentGames = $stmt->fetchAll();

        return json_encode([
            'stats'               => $stats,
            'finish_distribution' => $finishDist,
            'matchups'            => $matchups,
            'recent_games'        => $recentGames,
        ]);
    }

    if ($name === 'get_list_cards') {
        global $db;
        $listId = (int)($input['list_id'] ?? 0);
        if (!$listId) return json_encode(['error' => 'list_id is required']);

        $stmt = $db->prepare("
            SELECT lc.id, lc.card_name, lc.quantity,
                   (lc.role = 'commander') AS is_commander,
                   lc.is_proxy, lc.role,
                   sc.type_line, sc.mana_cost, sc.colors, sc.color_identity
            FROM list_cards lc
            LEFT JOIN scryfall_card_cache sc ON sc.scryfall_id = lc.scryfall_id
            WHERE lc.list_id = ?
            ORDER BY (lc.role = 'commander') DESC, lc.card_name ASC
        ");
        $stmt->execute([$listId]);
        $rows = $stmt->fetchAll();

        if (empty($rows)) return json_encode(['error' => "No cards found for list {$listId}"]);

        // Group by type for readability
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

        // Also return raw for easy update_list construction
        $raw = array_map(fn($r) => [
            'card_name'    => $r['card_name'],
            'quantity'     => (int)$r['quantity'],
            'is_commander' => (bool)$r['is_commander'],
        ], $rows);

        return json_encode(['list_id' => $listId, 'cards_by_type' => $out, 'raw' => $raw, 'total' => count($rows)]);
    }

    if ($name === 'update_list') {
        global $db, $userId;
        $listId      = (int)($input['list_id'] ?? 0);
        if (!$listId) return json_encode(['error' => 'list_id is required']);

        // Verify ownership
        $stmt = $db->prepare("SELECT id, name, description FROM lists WHERE id = ? AND user_id = ?");
        $stmt->execute([$listId, $userId]);
        $existing = $stmt->fetch();
        if (!$existing) return json_encode(['error' => "List {$listId} not found or not owned by this player."]);

        $newName        = trim($input['name']        ?? '') ?: $existing['name'];
        $newDescription = array_key_exists('description', $input) ? trim($input['description']) : $existing['description'];
        $cards          = $input['cards'] ?? null;

        $db->beginTransaction();
        try {
            $db->prepare("UPDATE lists SET name = ?, description = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?")
               ->execute([$newName, $newDescription ?: null, $listId]);

            $cardsUpdated = 0;
            if ($cards !== null) {
                $db->prepare("DELETE FROM list_cards WHERE list_id = ?")->execute([$listId]);
                $ins = $db->prepare("INSERT INTO list_cards (id, list_id, card_name, quantity, role) VALUES (UUID(), ?, ?, ?, ?)");
                foreach ($cards as $card) {
                    $cardName    = trim($card['card_name'] ?? '');
                    $quantity    = max(1, (int)($card['quantity'] ?? 1));
                    $isCommander = empty($card['is_commander']) ? 0 : 1;
                    $role        = $isCommander ? 'commander' : null;
                    if (!$cardName) continue;
                    $ins->execute([$listId, $cardName, $quantity, $role]);
                    $cardsUpdated++;
                }
            }

            $db->commit();
            $msg = "List \"{$newName}\" updated.";
            if ($cards !== null) $msg .= " {$cardsUpdated} card" . ($cardsUpdated !== 1 ? 's' : '') . " saved.";
            return json_encode(['success' => true, 'list_id' => $listId, 'message' => $msg]);
        } catch (Exception $e) {
            $db->rollBack();
            return json_encode(['error' => 'Failed to update list: ' . $e->getMessage()]);
        }
    }

    if ($name === 'create_list') {
        global $db, $userId;
        $listName    = trim($input['name'] ?? '');
        $description = trim($input['description'] ?? '');
        $cards       = $input['cards'] ?? [];

        if (!$listName) return json_encode(['error' => 'name is required']);
        if (empty($cards)) return json_encode(['error' => 'cards array cannot be empty']);

        $db->beginTransaction();
        try {
            $listId = $db->query("SELECT UUID()")->fetchColumn();
            $stmt = $db->prepare("INSERT INTO lists (id, name, description, user_id) VALUES (?, ?, ?, ?)");
            $stmt->execute([$listId, $listName, $description ?: null, $userId]);

            $cardIns = $db->prepare(
                "INSERT INTO list_cards (id, list_id, card_name, quantity, role) VALUES (UUID(), ?, ?, ?, ?)"
            );
            $inserted = 0;
            foreach ($cards as $card) {
                $cardName    = trim($card['card_name'] ?? '');
                $quantity    = max(1, (int)($card['quantity'] ?? 1));
                $isCommander = empty($card['is_commander']) ? 0 : 1;
                $role        = $isCommander ? 'commander' : null;
                if (!$cardName) continue;
                $cardIns->execute([$listId, $cardName, $quantity, $role]);
                $inserted++;
            }

            $db->commit();
            return json_encode([
                'success'       => true,
                'list_id'       => $listId,
                'list_name'     => $listName,
                'cards_saved'   => $inserted,
                'message'       => "List \"{$listName}\" created with {$inserted} card" . ($inserted !== 1 ? 's' : '') . ".",
            ]);
        } catch (Exception $e) {
            $db->rollBack();
            return json_encode(['error' => 'Failed to create list: ' . $e->getMessage()]);
        }
    }

    if ($name === 'get_game_notes') {
        global $db, $playerId;
        $limit  = min((int)($input['limit'] ?? 10), 30);
        $deckId = isset($input['deck_id']) ? (string)$input['deck_id'] : null;

        $sql    = "
            SELECT g.id AS game_id, g.played_at, g.notes, d.name AS deck_name, d.commander,
                gr.finish_position,
                (SELECT COUNT(*) FROM game_results gr2 WHERE gr2.game_id = g.id) AS pod_size
            FROM game_results gr
            JOIN games g ON g.id = gr.game_id
            JOIN decks d ON d.id = gr.deck_id
            WHERE gr.player_id = ? AND g.notes IS NOT NULL AND g.notes != ''
        ";
        $params = [$playerId];
        if ($deckId) {
            $sql     .= " AND gr.deck_id = ?";
            $params[] = $deckId;
        }
        $sql .= " ORDER BY g.played_at DESC, g.id DESC LIMIT ?";
        $params[] = $limit;

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        if (empty($rows)) return json_encode(['notes' => [], 'message' => 'No game notes found for this player.']);

        return json_encode(['notes' => $rows, 'count' => count($rows)]);
    }

    if ($name === 'get_game_history') {
        global $db, $playerId;
        $limit    = min((int)($input['limit'] ?? 30), 100);
        $deckId   = isset($input['deck_id'])   ? (string)$input['deck_id']      : null;
        $dateFrom = isset($input['date_from'])  ? trim($input['date_from'])   : null;
        $dateTo   = isset($input['date_to'])    ? trim($input['date_to'])     : null;

        $sql    = "
            SELECT g.id AS game_id, g.played_at, g.winning_turn, g.notes,
                d.name AS deck_name, d.commander, gr.finish_position,
                (SELECT COUNT(*) FROM game_results gr2 WHERE gr2.game_id = g.id) AS pod_size,
                (SELECT p.name FROM game_results wr JOIN decks wd ON wd.id = wr.deck_id JOIN players p ON p.id = wr.player_id WHERE wr.game_id = g.id AND wr.finish_position = 1 LIMIT 1) AS winner_name,
                (SELECT wd.commander FROM game_results wr JOIN decks wd ON wd.id = wr.deck_id WHERE wr.game_id = g.id AND wr.finish_position = 1 LIMIT 1) AS winning_commander
            FROM game_results gr
            JOIN games g ON g.id = gr.game_id
            JOIN decks d ON d.id = gr.deck_id
            WHERE gr.player_id = ?
        ";
        $params = [$playerId];
        if ($deckId) {
            $sql     .= " AND gr.deck_id = ?";
            $params[] = $deckId;
        }
        if ($dateFrom) {
            $sql     .= " AND g.played_at >= ?";
            $params[] = $dateFrom;
        }
        if ($dateTo) {
            $sql     .= " AND g.played_at <= ?";
            $params[] = $dateTo;
        }
        $sql .= " ORDER BY g.played_at DESC, g.id DESC LIMIT ?";
        $params[] = $limit;

        $stmt = $db->prepare($sql);
        $stmt->execute($params);
        $rows = $stmt->fetchAll();

        if (empty($rows)) return json_encode(['games' => [], 'message' => 'No games found for the given filters.']);

        return json_encode(['games' => $rows, 'total_returned' => count($rows)]);
    }

    if ($name === 'search_scryfall' || $name === 'search_oracle') {
        if ($name === 'search_oracle') {
            $text   = trim($input['text'] ?? '');
            if (!$text) return json_encode(['error' => 'text is required']);
            $q = 'o:"' . addslashes($text) . '"';
            if (!empty($input['type_filter'])) $q .= ' t:' . trim($input['type_filter']);
            if (!empty($input['colors']))      $q .= ' id<=' . trim($input['colors']);
            $order = 'edhrec';
        } else {
            $q = trim($input['query'] ?? '');
            if (!$q) return json_encode(['error' => 'query is required']);
            $order = trim($input['order'] ?? 'edhrec');
        }

        $url = 'https://api.scryfall.com/cards/search?order=' . urlencode($order)
             . '&q=' . urlencode($q);

        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 15,
            CURLOPT_HTTPHEADER     => [
                'User-Agent: CommanderCollector/3.11 (coach-chat)',
                'Accept: application/json',
            ],
        ]);
        $body   = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if ($status === 404 || !$body) {
            return json_encode(['results' => [], 'count' => 0, 'message' => 'No cards matched the search.']);
        }
        if ($status !== 200) {
            $err = json_decode($body, true);
            return json_encode(['error' => $err['details'] ?? "Scryfall error (HTTP $status)"]);
        }

        $data  = json_decode($body, true);
        $cards = array_slice($data['data'] ?? [], 0, 20);

        $results = array_map(function ($card) {
            $oracle = $card['oracle_text'] ?? ($card['card_faces'][0]['oracle_text'] ?? '');
            return [
                'name'           => $card['name'],
                'mana_cost'      => $card['mana_cost'] ?? ($card['card_faces'][0]['mana_cost'] ?? ''),
                'type_line'      => $card['type_line'] ?? '',
                'oracle_text'    => $oracle,
                'color_identity' => implode('', $card['color_identity'] ?? []),
                'edhrec_rank'    => $card['edhrec_rank'] ?? null,
            ];
        }, $cards);

        return json_encode([
            'query'       => $q,
            'count'       => count($results),
            'total_found' => $data['total_cards'] ?? count($results),
            'results'     => $results,
        ]);
    }

    if ($name === 'web_search') {
        $query = trim($input['query'] ?? '');
        $site  = trim($input['site']  ?? 'any');
        if (!$query) return json_encode(['error' => 'query is required']);

        $siteMap = [
            'edhrec'   => 'site:edhrec.com',
            'scryfall'  => 'site:scryfall.com',
            'gatherer' => 'site:gatherer.wizards.com',
            'any'      => 'site:edhrec.com OR site:scryfall.com OR site:gatherer.wizards.com',
        ];
        $siteFilter = $siteMap[$site] ?? $siteMap['any'];
        $fullQuery  = $siteFilter . ' ' . $query;

        // DuckDuckGo HTML search (no API key required)
        $url = 'https://html.duckduckgo.com/html/?q=' . urlencode($fullQuery);
        $ch  = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 12,
            CURLOPT_FOLLOWLOCATION => true,
            CURLOPT_USERAGENT      => 'Mozilla/5.0 (compatible; CommanderCollector/1.0; coach-research)',
            CURLOPT_HTTPHEADER     => ['Accept: text/html'],
        ]);
        $html   = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if (!$html || $status !== 200) {
            return json_encode(['error' => "Web search failed (HTTP $status)", 'query' => $fullQuery]);
        }

        // Extract result titles, URLs, and snippets from DDG HTML
        $results = [];
        // Match result blocks: <a class="result__a" href="...">title</a> and <a class="result__snippet">snippet</a>
        preg_match_all(
            '/<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>(.*?)<\/a>.*?<a[^>]+class="result__snippet"[^>]*>(.*?)<\/a>/si',
            $html,
            $matches,
            PREG_SET_ORDER
        );

        foreach (array_slice($matches, 0, 8) as $m) {
            $href    = html_entity_decode(strip_tags($m[1]), ENT_QUOTES, 'UTF-8');
            $title   = html_entity_decode(strip_tags($m[2]), ENT_QUOTES, 'UTF-8');
            $snippet = html_entity_decode(strip_tags($m[3]), ENT_QUOTES, 'UTF-8');
            // DDG may redirect via /l/?... — try to extract the real URL
            if (preg_match('/uddg=([^&]+)/', $href, $uddg)) {
                $href = urldecode($uddg[1]);
            }
            if ($title && $snippet) {
                $results[] = [
                    'title'   => trim($title),
                    'url'     => trim($href),
                    'snippet' => trim(preg_replace('/\s+/', ' ', $snippet)),
                ];
            }
        }

        if (empty($results)) {
            return json_encode([
                'query'   => $fullQuery,
                'results' => [],
                'message' => 'No results found. Try a different query or site.',
            ]);
        }

        return json_encode([
            'query'   => $fullQuery,
            'count'   => count($results),
            'results' => $results,
        ]);
    }

    return json_encode(['error' => "Unknown tool: $name"]);
}

// ── Build messages array ──────────────────────────────────────────────────
$messages = [];
// Include conversation history from client (last 60 messages = 30 exchanges)
$historySlice = array_slice($history, -60);
foreach ($historySlice as $msg) {
    $role    = $msg['role'] ?? '';
    $content = $msg['content'] ?? '';
    if (!in_array($role, ['user', 'assistant'], true)) continue;
    // Never drop a message — empty content breaks alternating role pairs
    $messages[] = ['role' => $role, 'content' => $content ?: '...'];
}
// Add current user message with a mandatory card-lookup reminder appended
$CARD_LOOKUP_REMINDER = "\n\n[SYSTEM REMINDER: Before mentioning ANY card by name in your response, you MUST call lookup_card first. No exceptions — not for staples, not for obvious cards, not for cards you are certain about. Look it up or do not mention it.]";
$messages[] = ['role' => 'user', 'content' => $userMessage . $CARD_LOOKUP_REMINDER];

// ── Claude API tool-use loop ──────────────────────────────────────────────
$maxIter           = 12;
$iter              = 0;
$assistantContent  = '';  // Final text only (last non-tool-use turn)
$partialContent    = '';  // Accumulated intermediate text (for polling display)
$toolsUsed         = []; // Collect tool calls for UI indicators
$hitIterCap        = false;

while ($iter < $maxIter) {
    $iter++;

    $payload = [
        'model'      => 'claude-haiku-4-5-20251001',
        'max_tokens' => 8192,
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
        $apiError = json_decode($body, true);
        $errorMsg = $apiError['error']['message'] ?? $body;
        coachLog('Anthropic API error (iter ' . $iter . '): HTTP ' . $status . ' — ' . $errorMsg);
        $assistantContent = 'I encountered an API error: ' . ($apiError['error']['message'] ?? 'HTTP ' . $status . '. Check server logs for details.');
        break;
    }

    $response   = json_decode($body, true);
    $stopReason = $response['stop_reason'] ?? 'end_turn';
    $content    = $response['content'] ?? [];

    $iterText = '';
    $toolCount = 0;
    foreach ($content as $block) {
        if ($block['type'] === 'text') $iterText .= $block['text'];
        if ($block['type'] === 'tool_use') $toolCount++;
    }

    coachLog("iter=$iter stop=$stopReason tools=$toolCount textLen=" . strlen($iterText));

    if ($stopReason === 'max_tokens') {
        coachLog("iter=$iter → max_tokens hit, breaking");
        $assistantContent = $iterText . "\n\n_(Response cut off — I ran out of output tokens. Try asking me to continue, or narrow the request.)_";
        break;
    }

    if ($stopReason !== 'tool_use') {
        coachLog("iter=$iter → final response (stop=$stopReason), textLen=" . strlen($iterText));
        // Clean final response — this is what the player sees
        $assistantContent = $iterText;
        break;
    }

    // Still in tool-use — accumulate intermediate text for partial display only
    if ($iterText) {
        $partialContent .= $iterText;
        file_put_contents($cacheFile, json_encode(['complete' => false, 'partial' => $partialContent]));
    }

    // If this is the last allowed iteration and Claude still wants tools,
    // process the tools but then force a final text-only reply.
    $isLastIter = ($iter >= $maxIter);

    $messages[] = ['role' => 'assistant', 'content' => $content];

    $toolResults = [];
    foreach ($content as $block) {
        if ($block['type'] !== 'tool_use') continue;
        $toolsUsed[] = ['name' => $block['name'], 'input' => $block['input'] ?? []];
        $toolResults[] = [
            'type'        => 'tool_result',
            'tool_use_id' => $block['id'],
            'content'     => executeTool($block['name'], $block['input'] ?? []),
        ];
    }
    $messages[] = ['role' => 'user', 'content' => $toolResults];

    if ($isLastIter) {
        $hitIterCap = true;
        break;
    }
}

// If we hit the iteration cap, make one final call without tools to force a summary.
if ($hitIterCap) {
    $finalPayload = [
        'model'      => 'claude-haiku-4-5-20251001',
        'max_tokens' => 8192,
        'system'     => $systemPrompt,
        'messages'   => $messages,
        // No 'tools' key — forces a text-only response
    ];
    $ch = curl_init('https://api.anthropic.com/v1/messages');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST           => true,
        CURLOPT_POSTFIELDS     => json_encode($finalPayload),
        CURLOPT_TIMEOUT        => 120,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'x-api-key: ' . $apiKey,
            'anthropic-version: 2023-06-01',
        ],
    ]);
    $finalBody   = curl_exec($ch);
    $finalStatus = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    if ($finalStatus === 200) {
        $finalResponse = json_decode($finalBody, true);
        foreach ($finalResponse['content'] ?? [] as $block) {
            if ($block['type'] === 'text') $assistantContent .= $block['text'];
        }
        if (($finalResponse['stop_reason'] ?? '') === 'max_tokens') {
            $assistantContent .= "\n\n_(Response cut off — I ran out of output tokens. Try asking me to continue, or narrow the request.)_";
        }
    } else {
        $assistantContent .= "\n\n_(Couldn't generate a final summary — please ask me to continue.)_";
    }
}

// Last-resort fallback if nothing was generated at all.
if (!$assistantContent) {
    $assistantContent = $partialContent ?: "I ran into a limit while working through that — it required more analysis steps than I'm allowed in one go. Try asking me to continue or to focus on one specific aspect.";
}

// ── Write result to temp file for polling ─────────────────────────────────
file_put_contents($cacheFile, json_encode([
    'complete'    => true,
    'response'    => $assistantContent,
    'tools_used'  => $toolsUsed,
    '_debug'      => [
        'iter'          => $iter,
        'hit_iter_cap'  => $hitIterCap ?? false,
        'stop_reason'   => $stopReason ?? 'unknown',
        'had_partial'   => !empty($partialContent),
    ],
]));
