---
id: p318
name: Landfall and Land Plays — Special Action, Multiple Triggers, Fetch Lands
category: triggered
cr_refs: [305.1, 305.2, 305.2b, 305.4, 207.2c]
tags: [landfall, land-play, special-action, fetch-land, extra-land-drop, Asuza, Exploration, Tireless-Tracker, Ob-Nixilis-Unshackled, Omnath-Locus-of-Creation, Scute-Swarm, Wrenn-and-Six, fetchland-landfall, put-vs-play]
created: 2026-03-29
examples_count: 2
---

# P318 — Landfall and Land Plays — Special Action, Multiple Triggers, Fetch Lands

## Abstract
Playing a land is a **special action** — it doesn't use the stack and can't be responded to with instants or abilities (CR 305.1). Players normally get one land play per turn; some effects grant extra land plays. **Landfall** is an ability word (no inherent rules meaning) labeling triggered abilities that fire whenever a land enters the battlefield under a player's control. Critically: **"playing" vs. "putting" a land are different** (CR 305.4) — some Landfall synergies care about this distinction. Fetch lands trigger Landfall twice (once when the fetch enters, once when the basic enters). Multiple Landfall triggers from the same land entering create one trigger per Landfall ability, not one trigger per land.

## The Definitive Rules

**CR 305.1** (verbatim): *"A player who has priority may play a land card from their hand during a main phase of their turn when the stack is empty. Playing a land is a special action; it doesn't use the stack (see rule 116). Rather, the player simply puts the land onto the battlefield. Since the land doesn't go on the stack, it is never a spell, and players can't respond to it with instants or activated abilities."*

**CR 305.2** (verbatim): *"A player can normally play one land during their turn; however, continuous effects may increase this number."*

**CR 305.2b** (verbatim): *"A player can't play a land, for any reason, if the number of lands the player can play this turn is equal to or less than the number of lands they have already played this turn."*

**CR 305.4** (verbatim): *"Effects may also allow players to 'put' lands onto the battlefield. This isn't the same as 'playing a land' and doesn't count as a land played during the current turn."*

**CR 207.2c** (Landfall is an ability word): *"An ability word appears in italics at the beginning of some abilities. Ability words are similar to keywords in that they tie together cards that have similar functionality, but they have no special rules meaning..."* (Landfall is listed as an ability word.)

## The Pattern

```
PLAYING A LAND (special action):
  Requirements: your turn, main phase, stack is empty, you have priority.
  Once these conditions are met: play the land.
  Land goes directly to the battlefield — NOT the stack.
  Opponents: can't "respond" to a land play.
  However: Landfall TRIGGERS when the land enters. Triggered abilities go on the stack.
    Players CAN respond to a Landfall trigger.
  Common mistake: "I'll respond to your land play." → Can't. Land doesn't use the stack.
  Correct: "I'll respond to your Landfall trigger." → Can. The trigger is on the stack.

LAND PLAY COUNTS:
  Normal: 1 land per turn.
  "Play an additional land" effects: Asuza, Lost But Seeking; Exploration; Oracle of Mul Daya.
  These grant EXTRA land PLAYS (from hand, main phase only).
  "Put a land onto the battlefield": this does NOT count as a land play.
    Rampant Growth: "Search for a basic land, put it onto the battlefield tapped."
    → Doesn't consume your land play for the turn.
    → Landfall triggers from it (land entered the battlefield).
  "You may play an additional land": granted by effects. Stacks with each other.
    Two Explorations: play 3 lands per turn (1 normal + 1 + 1).

LANDFALL (ability word, no rules meaning):
  "Landfall — Whenever a land enters the battlefield under your control, [effect]."
  Triggers: any time a land enters under your control.
    From hand (normal play): yes.
    From library (via Rampant Growth, Cultivate, fetch lands): yes.
    From GY (via Crucible of Worlds): yes.
    Opponent's land: no (must be YOUR control).
    Your land during opponent's turn: yes (if possible — rarely but it can happen via flash/triggered effects).

  IMPORTANT: SEPARATE triggers per ability per land entering.
    Omnath, Locus of Creation has Landfall twice (once for 4 life, once for 4 damage).
    ONE land enters → TWO separate Landfall triggers from Omnath.
    You control Omnath AND Tireless Tracker: ONE land enters → three separate triggers:
      Omnath trigger 1 (life), Omnath trigger 2 (damage/Ramp), Tracker trigger (Clue).
    Each trigger goes on the stack separately. APNAP order. You control them all → you stack them.

FETCH LANDS AND LANDFALL:
  Fetch land (Polluted Delta, Windswept Heath, etc.):
    Turn 1: play Polluted Delta → LANDFALL triggers from Delta entering.
    Activate Delta ({1}, Pay 1 life): search for Island, put it onto battlefield.
    Island enters → SECOND LANDFALL trigger.
    Two Landfall triggers from one fetch land activation.
  This is often the key: one fetch = two Landfall triggers.
  Scute Swarm ({2}{G}): "Landfall — whenever a land enters, create a 1/1 insect token.
    If you have 6+ lands, create a copy of Scute Swarm instead."
  Turn 5 with 5 lands: play fetch → 1 token. Crack fetch for land → 1 token. You now have 7 lands.
  Turn 6: each Landfall trigger from Scute Swarm (you may have multiple) creates Scute Swarm copies.
  Those copies each have Landfall. More lands → exponential Scute creation.
  This is why "Landfall + fetch" combos are powerful: double the triggers per fetch.

OMNATH LANDFALL CHAINS:
  Omnath, Locus of Creation ({R}{G}{W}{U}): Landfall abilities stack across land drops:
    1st land each turn: gain 4 life.
    2nd land: add {R}{G}{W}{U} (mana).
    3rd land: deal 4 damage to any target.
  Also: "When Omnath enters, draw a card."
  With extra land drops + fetch lands: 3rd land drop happens quickly.
  Crack a fetch for the 3rd land of the turn → Omnath deals 4 damage to opponent or creature.
  Combine with Asuza (two extra land drops): potentially 4 land drops turn 4 → multiple damage triggers.

OB NIXILIS, UNSHACKLED (punishment for fetching):
  Ob Nixilis, Unshackled ({4}{B}{B}): "When an opponent searches their library, that player
    sacrifices a creature and loses 10 life."
  If opponent fetches a land: they search their library → Ob Nixilis trigger fires.
  Opponent: sacrifices a creature, loses 10 life. Very punishing.
  Note: Ob Nixilis cares about the SEARCH, not the land entering. The land trigger and the
    Ob Nixilis trigger both go on the stack when the opponent activates the fetch.

WRENN AND SIX (fetch + Landfall enabler):
  Wrenn and Six ({R}{G}): "+1: Return target land from your GY to your hand."
  Activation: return a fetch land from GY.
  Recast the fetch land: Landfall trigger.
  Crack the fetch: second Landfall trigger.
  Each loop: 2 Landfall triggers per turn, using the same physical land.
  With Tireless Tracker: 2 Clue tokens per Wrenn activation.
  With Omnath: recurring life, mana, damage from one land.

PUTTING LANDS ONTO BATTLEFIELD (305.4):
  Some effects "put" lands onto the battlefield without playing them.
  These DON'T consume land play quota.
  They DO trigger Landfall.
  Examples:
    Natural Affinity: puts land cards onto battlefield.
    Rampant Growth: "search, put onto battlefield tapped."
    Fetch land activation: "put onto battlefield" after searching.
    Oracle of Mul Daya: "you may play an additional land" — uses land play quota.
    A card that says "put target land from your hand onto the battlefield" uses a different rule.

  Playing a land from GY via Crucible of Worlds:
    Crucible: "You may play lands from your graveyard."
    You may play land from GY using your normal land play.
    This DOES consume land play quota.
    This DOES trigger Landfall.
    This IS "playing" a land (from GY, but still uses the 305 rules).
```

## Definitive Conclusions

- **Playing a land is a special action** — it doesn't use the stack; opponents can't respond to the land play itself.
- **Landfall triggers go on the stack** — opponents CAN respond to Landfall triggers after the land enters.
- **"Playing" vs. "putting" a land are different** — putting doesn't use the land play quota; playing does.
- **Fetch lands trigger Landfall twice** — once when the fetch enters, once when the found land enters.
- **Multiple Landfall abilities on separate permanents each trigger independently** — one land entering fires one trigger per Landfall ability (not one trigger per land).
- **Extra land drop effects stack** — two Explorations = three land plays per turn.

## Canonical Example
**Scute Swarm + Fetch Land Exponential:**
Turn 5: you control Scute Swarm (1/1 insect) and have 5 lands.
Play Windswept Heath (fetch land): Landfall trigger from Scute Swarm → create 1/1 Insect token.
You now have 6 lands. Activate Windswept Heath (search for Forest, put onto battlefield):
  Forest enters: Landfall trigger from Scute Swarm → since 6+ lands: create a COPY of Scute Swarm.
You now control Scute Swarm + 1 Scute Swarm copy + 1 plain Insect token.
Turn 6: play another land. BOTH Scute Swarms trigger (2 separate Landfall triggers).
Two copies of Scute Swarm = two "create a Scute Swarm copy" effects = 4 total Scute Swarms.
Turn 7: play a land: 4 Scute Swarms × 1 trigger each = 4 new Scute Swarm copies = 8 total.
Turn 8: 8 Swarms: each triggers = 8 new copies = 16 total.
This is exponential: if you control N Scute Swarms and play a land: N new Scute Swarms created.
After enough land plays: hundreds of 1/1 insects.
Key mechanic: Landfall fires ONCE per Scute Swarm per land entering. More Swarms = more triggers.
Fetch interaction: one fetch = two Landfall triggers, potentially creating 2 Scute Swarm copies per Swarm.
This combo has won games in Standard, Historic, and Commander.

**Example 2 — Omnath Line:**
Turn 4, Commander: you control Omnath, Locus of Creation (just entered → drew 1 card).
You have: 3 lands in play. Hand: Misty Rainforest, basic Forest.
Play Misty Rainforest from hand: 1st land drop.
  Omnath 1st Landfall ability: gain 4 life. You're at 44 (started at 40).
Activate Misty Rainforest: search for Breeding Pool (fetchable), put onto battlefield.
  Breeding Pool enters: 2nd land this turn.
  Omnath 2nd Landfall ability: add {R}{G}{W}{U}. Mana pool now has {R}{G}{W}{U}.
You play Forest from hand using that mana: 3rd land drop.
  Omnath 3rd Landfall ability: deal 4 damage to target (player, creature, or planeswalker).
  Deal 4 to opponent's face. You're ahead in life (44 vs. 36 now if opponent was at 40).
Net from one turn: drew a card, gained 4 life, got {R}{G}{W}{U}, dealt 4 damage.
Fetch lands + Omnath creates massive value per extra land drop.
If Asuza is in play too: play 3 lands from hand in a single turn → hit the 3rd Landfall twice.
5th land drop: if another land hits, Omnath's 3rd ability triggers AGAIN (another 4 damage).
Omnath in Pioneer/Historic: very powerful engine. Often banned in competitive.

## Commonly Confused With
- **P007 (Priority Windows)** — Land plays don't use the stack, so there's no "in response to playing a land" window. But Landfall triggers DO use the stack — the window opens after the land enters and triggers go on the stack.
- **P315 (Token Rules)** — Scute Swarm creates copies (tokens that are copies of Scute Swarm). These tokens have Landfall themselves — each adds to the exponential growth.
- **P002 (Replacement vs. Triggered)** — Landfall abilities are triggered abilities ("whenever a land enters"), NOT replacement effects. The land entering is not replaced; the trigger fires after entry.
- **P297 (Cascade)** — Cascade interacts with land plays indirectly; lands exiled during cascade don't enter the battlefield via cascade, so they don't trigger Landfall. The cascade target (a nonland spell cast for free) wouldn't trigger Landfall either.
