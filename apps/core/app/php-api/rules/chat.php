<?php
require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/auth/middleware.php';
requireAuth();

$method = $_SERVER['REQUEST_METHOD'];

// ── GET: poll for assistant response by user_message_id ──────────────────
if ($method === 'GET') {
    $userMsgId = isset($_GET['poll']) ? (int)$_GET['poll'] : 0;
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
        'conversation_id'  => (int)$row['conversation_id'],
        'message_id'       => (int)$row['id'],
        'qa_log_id'        => $qaLogId ? (int)$qaLogId : null,
        'response'         => $row['content'],
        'pending_pattern'  => $row['pending_pattern'] ? json_decode($row['pending_pattern'], true) : null,
    ]);
}

if ($method !== 'POST') {
    sendError('Method not allowed', 405);
}

set_time_limit(300);
ignore_user_abort(true);

$apiKey = defined('ANTHROPIC_API_KEY') ? ANTHROPIC_API_KEY : null;
if (!$apiKey) sendError('Anthropic API key not configured', 500);

$input          = getJSONInput();
$userMessage    = trim($input['message'] ?? '');
$conversationId = isset($input['conversation_id']) ? (int)$input['conversation_id'] : null;
$newTitle       = trim($input['new_conversation_title'] ?? '');
$gameContext    = $input['game_context'] ?? null;
$focusPlayer    = isset($gameContext['focusPlayerName']) ? trim($gameContext['focusPlayerName']) : null;

if (!$userMessage) sendError('message is required');

$db = getDB();

// ── Conversation management ────────────────────────────────────────────────
if (!$conversationId) {
    $title = $newTitle ?: null;
    $stmt  = $db->prepare("INSERT INTO rules_conversations (title) VALUES (?)");
    $stmt->execute([$title]);
    $conversationId = (int)$db->lastInsertId();
}

// Save user message
$stmt = $db->prepare("INSERT INTO rules_messages (conversation_id, role, content) VALUES (?, 'user', ?)");
$stmt->execute([$conversationId, $userMessage]);
$userMessageId = (int)$db->lastInsertId();

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

// Load recent conversation history (last 8 messages to stay within token budget)
$stmt = $db->prepare("
    SELECT role, content FROM rules_messages
    WHERE conversation_id = ?
    ORDER BY id DESC
    LIMIT 6
");
$stmt->execute([$conversationId]);
$history = array_reverse($stmt->fetchAll());

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

$patternsContext = "\n\n---\n\n## Interaction Pattern Library\n\nUse `get_pattern` to look up any pattern by ID.\n\n";
$rank = 0;
foreach ($scored as $i => $_) {
    if ($rank >= 3) break;
    $patternsContext .= distillPattern($allPatterns[$i]) . "---\n\n";
    $rank++;
}

// ── System prompt ──────────────────────────────────────────────────────────
$systemPrompt = <<<PROMPT
You are an expert Magic: The Gathering rules advisor. All CR excerpts below were extracted verbatim from the official Comprehensive Rules (CR 20260227). Answer with precision, cite CR section numbers, and always reach a **definitive conclusion** — the rules are precise enough to always give a concrete answer.

## Step 1: Card Lookup

When card names are mentioned, use the `lookup_card` tool to fetch current Oracle text and official rulings. Always use Oracle text — cards get errata. If a ruling directly addresses the question, cite it.

## Step 2: Pattern Match

The top matching patterns are pre-loaded below. If none match, use `get_pattern` with a known ID. When applying a pattern, say: *"This looks like it falls under [Pattern Name] (P###) — applying that logic here..."* then state the definitive ruling.

If the user corrects a pattern application:
1. Do NOT immediately accept the correction.
2. Ask for their reasoning.
3. Verify against the CR before accepting.

## Step 3: Answer with a Definitive Conclusion

Lead with the ruling ("Yes, this works" / "No, this is illegal" / "The result is X"), cite CR numbers, explain the mechanic, reference the matched pattern, and flag common misconceptions.

## Step 4: Self-Correct When Wrong

If you realize during this conversation that a previous answer was incorrect — wrong CR citation, misapplied rule, bad ruling — use the `log_correction` tool immediately. Don't wait for the user to catch it. Be specific about what was wrong and what the correct answer is. You MUST also state what assumptions you made without looking them up first — e.g. assumed a card had an ability it doesn't, assumed a CR rule worked a certain way without checking, assumed an interaction based on similar cards. Your correction is saved to the `rules_ai_corrections` table with: `severity` (1–4), `correction` (what was wrong and the correct answer), `assumptions` (your unchecked assumptions), and a link back to the `rules_qa_log` entry. This data is used to track accuracy patterns and improve future answers.

## Step 5: Propose New Patterns

After answering — if the question reveals a novel interaction not covered by any existing pattern — use the `propose_pattern` tool with a fully formed pattern definition. This flags the pattern for the user to review and optionally save. Do not propose patterns that are already covered.

## Step 6: Card Reference Manifest

At the very end of EVERY response, after all other content, append exactly one line in this format:

CARDS: [[Full Card Name]], [[Another Card Name]]

List every Magic: The Gathering card you referenced anywhere in your answer by its exact, full Oracle name (e.g. "Lightning Bolt", not "bolt"; "Teysa Karlov", not "Teysa"). If a card has a DFC name, use the front face only. If no cards were mentioned, omit the CARDS line entirely. Do not include mechanics, keywords, rules concepts, or game terms — only named cards.

---

## CR 117: Timing and Priority

**117.1** The player with priority may cast spells, activate abilities, and take special actions.
- **117.1a** Instant: any time you have priority. Noninstant: during your main phase, stack empty.
- **117.1b** Activated ability: any time you have priority.
- **117.1d** Mana ability: any time you have priority, OR any time a mana payment is required.

**117.2a** Triggered abilities can trigger at any time. Nothing happens at trigger time — they go on the stack the next time a player would receive priority.
**117.2b** Static abilities continuously affect the game.
**117.2d** State-based actions happen automatically before a player would receive priority.
**117.2e** No player has priority while a spell or ability is resolving.

**117.3a** Active player gets priority at the beginning of most steps/phases.
**117.3b** Active player gets priority after a spell/ability resolves.
**117.4** Stack resolves when ALL players pass in succession without acting.

**117.5** Before any player receives priority:
1. Perform all applicable state-based actions simultaneously
2. Repeat until no SBAs remain
3. Put all triggered abilities onto the stack (APNAP order)
4. Repeat 1–3 until clean
5. Then player receives priority

**117.7** Casting "in response" = new spell/ability resolves first (LIFO stack).

---

## CR 613: Interaction of Continuous Effects — The Layer System

| Layer | What it modifies |
|-------|-----------------|
| 1 | Copy effects |
| 2 | Control-changing effects |
| 3 | Text-changing effects |
| 4 | Type, subtype, supertype changes |
| 5 | Color-changing effects |
| 6 | Ability-adding/removing effects |
| 7 | Power/toughness changes |

**Layer 7 Sub-layers:**
- **7a**: Characteristic-defining abilities (CDAs) that define P/T
- **7b**: Effects that **set** P/T to a specific value
- **7c**: Effects and counters that **modify** P/T (pump spells, +1/+1 counters, -1/-1 counters)
- **7d**: Effects that **switch** power and toughness

**613.7 Timestamp Rule**: Within a layer, effects apply in timestamp order (earlier first).
**613.8 Dependency Rule**: If Effect A depends on Effect B (applying B would change A's targets or existence), B applies first regardless of timestamp.

---

## CR 614: Replacement Effects

**614.1** Watch for a particular event and completely or partially replace it with a different event.
Types: "instead" (614.1a), "skip" (614.1b), "enters with…" (614.1c–d), "as…is turned face up" (614.1e).

**614.4** Must exist before the event.
**614.5** Applies only once to any given event.
**614.8 Regeneration** = destruction-replacement effect. Damage-dealt triggers still fire.
**614.17** "Can't" effects: can't happen events can only be modified by self-replacement effects.

---

## CR 603: Handling Triggered Abilities

**603.2** Trigger automatically; nothing happens at trigger time.
**603.3** Put on stack next time a player would receive priority.
**603.3b** Multiple simultaneous triggers: APNAP order.
**603.4 Intervening "if" clause**: Condition checked at trigger time AND at resolution. If false at resolution, ability does nothing.
**603.6c** Leaves-the-battlefield abilities use last known information.
**603.6d** "Enters with…" text is a static ability — not triggered.

---

## CR 704: State-Based Actions

Checked whenever a player would get priority. All applicable SBAs performed simultaneously.

Key SBAs:
- 704.5a: 0 or less life → lose
- 704.5c: 10+ poison → lose
- 704.5f: toughness ≤ 0 → graveyard
- 704.5g: lethal damage → destroyed
- 704.5h: deathtouch damage → destroyed
- 704.5i: planeswalker at 0 loyalty → graveyard
- 704.5j: legend rule (same legendary permanent name, same controller)
- 704.5q: +1/+1 and -1/-1 counters cancel each other
- **704.6c** Commander: 21+ combat damage from same commander → lose
- **704.6d** Commander in graveyard/exile → owner may return to command zone

---

## CR 903: Commander

**903.3** Commander = legendary creature, legendary Vehicle, or legendary Spacecraft.
**903.4** Color identity = mana symbols in cost + rules text + color indicators + back face.
**903.5a** Exactly 100 cards including commander (singleton).
**903.7** Starting life: **40**.
**903.8** Commander Tax: {2} per previous cast from command zone.
**903.9a** Graveyard/exile → SBA, owner may return to command zone.
**903.9b** Hand/library → replacement effect, owner may put in command zone instead.
**903.10a** 21+ combat damage by same commander over game → lose (SBA 704.6c).

---

## Turn Structure

**Beginning Phase:** Untap (no priority) → Upkeep → Draw
**Main Phase:** Cast any spell, play a land (stack empty)
**Combat:** Beginning of combat → Declare attackers → Declare blockers → Combat damage → End of combat
**Ending Phase:** End step → Cleanup (damage removed, "until end of turn" effects end)

**Combat notes:**
- A creature is "blocked" even if all blockers leave before damage (CR 509.1h)
- Trample (702.19b): assign lethal to each blocker in order; excess to player
- With deathtouch: 1 damage = lethal per blocker

---

## Key Keywords

| Keyword | Key Notes |
|---------|-----------|
| Deathtouch | Any nonzero damage from this source is lethal (SBA 704.5h). With trample: 1 damage satisfies lethal per blocker |
| Double Strike | Deals damage in both first-strike and regular steps |
| First Strike | Deals damage only in the first combat damage step |
| Flash | Can be cast any time you could cast an instant |
| Flying | Can only be blocked by flyers or reach creatures |
| Haste | Can attack and use {T} abilities the turn it enters |
| Hexproof | Can't be targeted by opponents'. You CAN target your own hexproof permanents |
| Indestructible | Can't be destroyed. -X/-X, exile, toughness-0 SBA still apply |
| Lifelink | Static ability; life gain is simultaneous with damage — NOT triggered |
| Menace | Must be blocked by 2 or more |
| Protection | DEBT: can't be Damaged/Enchanted/Blocked/Targeted by stated quality |
| Reach | Can block flying |
| Shroud | Can't be targeted by ANY spells or abilities (contrast: hexproof) |
| Trample | Assign lethal to blockers, excess to player/planeswalker |
| Vigilance | Doesn't tap when attacking |
| Ward | When targeted by opponent, counter it unless they pay the ward cost |

---

## Common Misconceptions

| Claim | Reality | CR |
|-------|---------|-----|
| Deathtouch requires exactly 1 damage | Any nonzero damage from deathtouch source is lethal | 704.5h |
| Lifelink is triggered | Static; life gain is simultaneous with damage | 702.15 |
| Hexproof protects from your own spells | Only opponents'; shroud blocks all | 702.11 |
| "Destroy" kills indestructible | Indestructible not destroyed by "destroy" or lethal damage; use exile or -X/-X | 702.12 |
| Tokens go to graveyard permanently | Token enters graveyard (triggers "dies"), then ceases to exist (SBA 704.5d) | 704.5d |
| Mana abilities can be responded to | Mana abilities don't use the stack (CR 605.1) | 605.1 |
| Commander damage includes non-combat | Only combat damage counts | 903.10a |
| Layer 7 has 5 sub-layers | Only 4: 7a/7b/7c/7d | 613.4 |
| Counters apply in their own layer | Counters and pump are both in layer 7c | 613.4c |
| Summoning sickness prevents all abilities | Only attacking and {T}/{Q} abilities | 302.6 |
| Commander returns to command zone instantly | Graveyard/exile: SBA (after the fact); hand/library: replacement (instead) | 903.9 |
| Commander starts at 20 life | Commander starts at 40 life | 903.7 |
PROMPT;

$systemPrompt .= $patternsContext;

// ── Active game context (personalization) ──────────────────────────────────
if (!empty($gameContext['players'])) {
    $systemPrompt .= "\n\n---\n\n## Active Game Context\n\n";
    $systemPrompt .= "A Commander game is currently in progress. Use this to personalize your answers: ";
    $systemPrompt .= "reference specific cards from these decks when relevant, point out tricky interactions ";
    $systemPrompt .= "that may come up given these commanders and card combinations, and address rules questions ";
    $systemPrompt .= "in the context of what the players are actually running.\n\n";
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

        $deckId       = isset($player['deckId']) ? (int)$player['deckId'] : null;
        $commanderStr = $partner ? "{$commander} + {$partner} (Partner)" : $commander;
        $deckIdStr    = $deckId ? " (deck_id: {$deckId})" : '';
        $systemPrompt .= "**{$playerName}** — \"{$deckName}\" — Commander: *{$commanderStr}*{$deckIdStr}\n";

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
        'description' => 'Look up a Magic: The Gathering card by name using the Scryfall API. Returns Oracle text, type line, mana cost, and official Gatherer rulings.',
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
        'description' => 'Fetch a pattern by ID. Returns a distilled summary (Abstract, Pattern pseudocode, Definitive Conclusions) by default. Set full_content=true only if you need the complete examples and CR text.',
        'input_schema' => [
            'type'       => 'object',
            'properties' => [
                'pattern_id' => [
                    'type'        => 'string',
                    'description' => 'The pattern ID to fetch, e.g. "p001" or "P001"',
                ],
                'full_content' => [
                    'type'        => 'boolean',
                    'description' => 'Set true to receive the full markdown content instead of the distilled summary',
                ],
            ],
            'required' => ['pattern_id'],
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
                    'items'       => ['type' => 'integer'],
                    'description' => 'Array of deck IDs to compare (from the active game context)',
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
                    'type'        => 'integer',
                    'description' => 'The deck ID from the active game context',
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

// ── Tool execution helper ──────────────────────────────────────────────────
function executeTool(string $name, array $input): string {
    if ($name === 'get_pattern') {
        global $db;
        $pid  = strtolower(trim($input['pattern_id'] ?? ''));
        $stmt = $db->prepare("SELECT pattern_id, name, category, cr_refs, tags, content, examples_count FROM rules_patterns WHERE LOWER(pattern_id) = ?");
        $stmt->execute([$pid]);
        $row = $stmt->fetch();
        if (!$row) {
            return json_encode(['error' => "Pattern not found: {$input['pattern_id']}"]);
        }
        // Return distilled view by default; full content only if explicitly requested
        $full = !empty($input['full_content']);
        return json_encode([
            'pattern_id'     => $row['pattern_id'],
            'name'           => $row['name'],
            'category'       => $row['category'],
            'cr_refs'        => $row['cr_refs'],
            'tags'           => $row['tags'],
            'examples_count' => $row['examples_count'],
            'content'        => $full ? $row['content'] : distillPattern($row),
        ]);
    }

    if ($name === 'lookup_card') {
        $cardName = urlencode($input['name'] ?? '');
        $cardUrl  = "https://api.scryfall.com/cards/named?fuzzy=$cardName";

        $ch = curl_init($cardUrl);
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 10,
            CURLOPT_USERAGENT      => 'CommanderCollector/2.4 (rules-guru)',
        ]);
        $body   = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if ($status !== 200 || !$body) {
            return json_encode(['error' => "Card not found: {$input['name']}"]);
        }

        $card = json_decode($body, true);

        // Fetch rulings
        $rulings = [];
        if (!empty($card['rulings_uri'])) {
            $rch = curl_init($card['rulings_uri']);
            curl_setopt_array($rch, [
                CURLOPT_RETURNTRANSFER => true,
                CURLOPT_TIMEOUT        => 10,
                CURLOPT_USERAGENT      => 'CommanderCollector/2.4 (rules-guru)',
            ]);
            $rbody = curl_exec($rch);
            if ($rbody) {
                $rdata   = json_decode($rbody, true);
                $rulings = array_map(fn($r) => $r['comment'], $rdata['data'] ?? []);
            }
        }

        return json_encode([
            'name'        => $card['name']        ?? '',
            'mana_cost'   => $card['mana_cost']   ?? '',
            'type_line'   => $card['type_line']   ?? '',
            'oracle_text' => $card['oracle_text'] ?? '',
            'power'       => $card['power']       ?? null,
            'toughness'   => $card['toughness']   ?? null,
            'keywords'    => $card['keywords']    ?? [],
            'rulings'     => $rulings,
        ]);
    }

    if ($name === 'compare_decklists') {
        global $db, $gameContext;
        $deckIds = array_filter(array_map('intval', $input['deck_ids'] ?? []), fn($id) => $id > 0);
        if (empty($deckIds)) return json_encode(['error' => 'No valid deck_ids provided']);

        // Build player name index from game context
        $playerByDeck = [];
        foreach (($gameContext['players'] ?? []) as $p) {
            if (!empty($p['deckId'])) $playerByDeck[(int)$p['deckId']] = $p['playerName'] ?? 'Unknown';
        }

        $placeholders = implode(',', array_fill(0, count($deckIds), '?'));
        $stmt = $db->prepare("
            SELECT dc.deck_id, dc.card_name, dc.quantity, dc.is_commander, sc.type_line
            FROM deck_cards dc
            LEFT JOIN scryfall_card_cache sc ON sc.scryfall_id = dc.scryfall_id
            WHERE dc.deck_id IN ($placeholders)
            ORDER BY dc.deck_id, dc.is_commander DESC, dc.card_name ASC
        ");
        $stmt->execute(array_values($deckIds));
        $rows = $stmt->fetchAll();

        if (empty($rows)) return json_encode(['error' => 'No cards found for the given deck IDs']);

        // Group by deck → type
        $decks = [];
        foreach ($rows as $row) {
            $did   = (int)$row['deck_id'];
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
        $deckId = (int)($input['deck_id'] ?? 0);
        if (!$deckId) return json_encode(['error' => 'deck_id is required']);

        $stmt = $db->prepare("
            SELECT dc.card_name, dc.quantity, dc.is_commander,
                   sc.type_line
            FROM deck_cards dc
            LEFT JOIN scryfall_card_cache sc ON sc.scryfall_id = dc.scryfall_id
            WHERE dc.deck_id = ?
            ORDER BY dc.is_commander DESC, dc.card_name ASC
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

        $stmt = $db->prepare("
            INSERT INTO rules_ai_corrections (conversation_id, qa_log_id, severity, correction, assumptions, model)
            VALUES (?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([$conversationId, $qaId, $severity, $correctionNote, $assumptions, 'claude-haiku-4-5-20251001']);

        return json_encode(['logged' => true, 'correction_id' => (int)$db->lastInsertId(), 'qa_log_id' => $qaId]);
    }

    return json_encode(['error' => "Unknown tool: $name"]);
}

// ── Claude API tool-use loop ───────────────────────────────────────────────
$maxIter         = 8;
$iter            = 0;
$pendingPattern  = null;
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
        $err = json_decode($body, true);
        sendError('Claude API error: ' . ($err['error']['message'] ?? $body), 502);
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

// ── Save assistant message to DB ───────────────────────────────────────────
$pendingJson = $pendingPattern ? json_encode($pendingPattern) : null;

$stmt = $db->prepare("
    INSERT INTO rules_messages (conversation_id, role, content, pending_pattern)
    VALUES (?, 'assistant', ?, ?)
");
$stmt->execute([$conversationId, $assistantContent, $pendingJson]);
$messageId = (int)$db->lastInsertId();

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

    $qaStmt = $db->prepare("
        INSERT INTO rules_qa_log
            (conversation_id, user_message_id, assistant_message_id, question, answer,
             pattern_ids, cr_refs, cards_referenced, pending_pattern_id, model, had_game_context)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ");
    $qaStmt->execute([
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
