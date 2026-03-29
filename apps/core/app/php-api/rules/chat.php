<?php
require_once dirname(__DIR__) . '/config.php';
require_once dirname(__DIR__) . '/auth/middleware.php';
requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendError('Method not allowed', 405);
}

set_time_limit(120);

$apiKey = defined('ANTHROPIC_API_KEY') ? ANTHROPIC_API_KEY : null;
if (!$apiKey) sendError('Anthropic API key not configured', 500);

$input          = getJSONInput();
$userMessage    = trim($input['message'] ?? '');
$conversationId = isset($input['conversation_id']) ? (int)$input['conversation_id'] : null;
$newTitle       = trim($input['new_conversation_title'] ?? '');
$gameContext    = $input['game_context'] ?? null;

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

// Load full conversation history for context
$stmt = $db->prepare("SELECT role, content FROM rules_messages WHERE conversation_id = ? ORDER BY id");
$stmt->execute([$conversationId]);
$history = $stmt->fetchAll();

// ── Load patterns from DB for system prompt context ────────────────────────
$patternRows = $db->query("SELECT pattern_id, name, category, cr_refs, tags, content, examples_count FROM rules_patterns ORDER BY pattern_id")->fetchAll();

$patternsContext = '';
if ($patternRows) {
    $patternsContext = "\n\n---\n\n## Interaction Pattern Library\n\nThe following patterns are your trained abstractions. Match incoming questions to these before answering.\n\n";
    foreach ($patternRows as $p) {
        $patternsContext .= "### {$p['pattern_id']} — {$p['name']} (category: {$p['category']})\n";
        $patternsContext .= $p['content'] . "\n\n---\n\n";
    }
}

// ── System prompt ──────────────────────────────────────────────────────────
$systemPrompt = <<<PROMPT
You are an expert Magic: The Gathering rules advisor. All CR excerpts below were extracted verbatim from the official Comprehensive Rules (CR 20260227). Answer with precision, cite CR section numbers, and always reach a **definitive conclusion** — the rules are precise enough to always give a concrete answer.

## Step 1: Card Lookup

When card names are mentioned, use the `lookup_card` tool to fetch current Oracle text and official rulings. Always use Oracle text — cards get errata. If a ruling directly addresses the question, cite it.

## Step 2: Pattern Match

Before answering, review the Interaction Pattern Library below. Identify the underlying mechanic type of the question — not the card names. When a pattern matches, say: *"This looks like it falls under [Pattern Name] (P###) — applying that logic here..."* then state the definitive ruling.

If the user corrects a pattern application:
1. Do NOT immediately accept the correction.
2. Ask for their reasoning.
3. Verify against the CR before accepting.

## Step 3: Answer with a Definitive Conclusion

Lead with the ruling ("Yes, this works" / "No, this is illegal" / "The result is X"), cite CR numbers, explain the mechanic, reference the matched pattern, and flag common misconceptions.

## Step 4: Propose New Patterns

After answering — if the question reveals a novel interaction not covered by any existing pattern — use the `propose_pattern` tool with a fully formed pattern definition. This flags the pattern for the user to review and optionally save. Do not propose patterns that are already covered.

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

    foreach ($gameContext['players'] as $player) {
        $playerName  = htmlspecialchars($player['playerName'] ?? 'Unknown', ENT_QUOTES);
        $deckName    = htmlspecialchars($player['deckName']   ?? 'Unknown Deck', ENT_QUOTES);
        $commander   = htmlspecialchars($player['commander']  ?? 'Unknown Commander', ENT_QUOTES);
        $partner     = !empty($player['partner']) ? htmlspecialchars($player['partner'], ENT_QUOTES) : null;
        $cards       = is_array($player['cards']) ? $player['cards'] : [];

        $commanderStr = $partner ? "{$commander} + {$partner} (Partner)" : $commander;
        $systemPrompt .= "**{$playerName}** — \"{$deckName}\" — Commander: *{$commanderStr}*\n";

        if (!empty($cards)) {
            // Filter out lands to keep context focused on spells/threats
            $nonLands = array_filter($cards, fn($c) => !preg_match('/\b(Plains|Island|Swamp|Mountain|Forest|Land)\b/i', $c));
            $systemPrompt .= "Deck contents: " . implode(', ', array_values($nonLands)) . "\n";
        } else {
            $systemPrompt .= "(Deck list not available)\n";
        }
        $systemPrompt .= "\n";
    }

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
];

// ── Build messages array ───────────────────────────────────────────────────
$messages = [];
foreach ($history as $msg) {
    $messages[] = ['role' => $msg['role'], 'content' => $msg['content']];
}

// ── Tool execution helper ──────────────────────────────────────────────────
function executeTool(string $name, array $input): string {
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

    // propose_pattern — just echo back the input; frontend handles it
    if ($name === 'propose_pattern') {
        return json_encode(['proposed' => true, 'pattern' => $input]);
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
        'model'      => 'claude-sonnet-4-6',
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

// Update conversation timestamp and auto-title if still untitled
$db->prepare("UPDATE rules_conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?")->execute([$conversationId]);

if ($newTitle) {
    $db->prepare("UPDATE rules_conversations SET title = ? WHERE id = ? AND title IS NULL")->execute([$newTitle, $conversationId]);
}

sendJSON([
    'conversation_id' => $conversationId,
    'message_id'      => $messageId,
    'response'        => $assistantContent,
    'pending_pattern' => $pendingPattern,
]);
