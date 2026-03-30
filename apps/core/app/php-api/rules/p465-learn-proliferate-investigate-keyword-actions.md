---
id: p465
name: Learn, Proliferate, and Investigate — Lesson-Fetch/Discard-Draw, Counter-Doubling Action, and Clue-Token Creation
category: zones
cr_refs: [701.48, 701.34, 701.52, 400.7, 111.10, 605.1, 714.2, 704.5]
tags: learn, proliferate, investigate, keyword-action, lesson-fetch, counter-spreading, clue-token, strixhaven, scars-mirrodin, innistrad-midnight-hunt
created: 2026-03-29
examples_count: 8
---

# P465 — Learn, Proliferate, and Investigate — Lesson-Fetch/Discard-Draw, Counter-Doubling Action, and Clue-Token Creation

## Abstract

Three keyword actions with distinct zone-manipulation and counter-spreading effects: **Learn** (Strixhaven: School of Mages, CR 701.48) allows you to reveal a Lesson card from outside the game and put it into your hand OR discard a card to draw a card — two distinct choices; **Proliferate** (Scars of Mirrodin, CR 701.27) lets you add one counter of each existing type to any number of permanents or players that already have that counter type; and **Investigate** (Shadows over Innistrad, CR 701.52) creates a Clue artifact token that can be sacrificed for {2} to draw a card. All three interact with graveyard hate, counter-doubling effects, and limited-card environments in non-obvious ways.

> **Updated 20260329:** Corrected error: Proliferate CANNOT target suspended cards in exile (time counters on exile cards). CR 701.34a specifies "permanents and/or players" only. Old claim that "proliferate delays suspend" was wrong. Vanishing permanents (on battlefield) CAN be proliferated; suspended cards in exile cannot.

## The Definitive Rules

### Learn (CR 701.48)
**CR 701.48a verbatim:** *"To learn, you may reveal a Lesson card you own from outside the game and put it into your hand and/or discard a card to draw a card."*

Key: "and/or" means you can do both, either, or neither. The choices are:
1. Reveal a Lesson card you own from outside the game → put it into your hand
2. Discard a card → draw a card
3. Both options 1 and 2
4. Neither (do nothing)

In tournament play, "outside the game" means your sideboard. In casual play, it means your collection (by local rules). Learn does NOT require a sideboard; you can choose to only use the discard-draw option.

### Proliferate (CR 701.27)
**CR 701.34a verbatim:** *"To proliferate means to choose any number of permanents and/or players that have a counter, then give each one additional counter of each kind that permanent or player already has."*

Key: "each kind already there" — you can only proliferate counters that already exist on the chosen object. You can't add a new type of counter via proliferate. For a permanent with a +1/+1 counter, you add one more +1/+1 counter. For a player with 3 poison counters, you add one more poison counter. You choose which objects to proliferate — it's not mandatory to choose all.

Proliferate only applies to permanents (on the battlefield) and players. Cards in exile, graveyard, hand, or library cannot be chosen even if they have counters on them.

### Investigate (CR 701.52)
**CR 701.52a verbatim:** *"To investigate, create a colorless Clue artifact token with '{2}, Sacrifice this token: Draw a card.'"*

A Clue is an artifact token. The sacrifice-for-draw ability is the activated ability of the token. Multiple Clues can be sacrificed at any time (each activation places the sacrifice ability on the stack).

## The Pattern

```
LEARN pattern:
Two optional, independent actions (choose any combination):
  Option A: Reveal a Lesson card you own from outside the game → add it to hand
    → "Lesson" is a supertype on some spell cards (CR 300.4: supertypes)
    → Lesson spells were printed in Strixhaven specifically for learn
    → In limited (draft/sealed): your sideboard has lessons; in constructed, your sideboard
    → In casual: your collection (informal rule, not tournament-legal)
    → "You own" — not just a card of that name; must be your copy of the card
    → You can't learn a Lesson that's currently in play or in your GY — must be "outside the game"
  Option B: Discard a card → draw a card
    → Standard loot (discard first, then draw)
    → Can be used with no sideboard — just cycle a bad card
    → Can trigger madness (discarding for learn is a discard trigger)
  AND/OR: Can do both, or neither

PROLIFERATE pattern:
"Choose any number of permanents and/or players that have counters.
 Add one counter of each kind already on each chosen permanent/player."
  → "Any number" = can be zero (you can choose to proliferate nothing)
  → You choose WHICH permanents/players to proliferate
  → You add ONE counter of each type already present
    → +1/+1 counter → add one +1/+1 counter (not double, just +1)
    → Charge counter → add one charge counter
    → Loyalty counter → add one loyalty counter (proliferate a planeswalker!)
    → Time counter on a PERMANENT with time counters → add one time counter
    → Poison counter on opponent → add one poison counter
    → Age counter, verse counter, storage counter, etc.
  → Counters NOT proliferated: counters that don't exist yet can't be added
  → CRITICAL: Proliferate only affects PERMANENTS (on battlefield) and PLAYERS.
    Cards in exile, graveyard, hand, or library CAN'T be chosen — even if they have counters.
    → Suspended cards in exile have time counters but are NOT permanents → can't proliferate them
    → This is one of the most common misconceptions about proliferate
    Scryfall ruling (2023-02-04): "You can't choose cards in any zone other than the battlefield,
    even if they have counters on them."
  → Doubling Season in play: Doubling Season's replacement effect doubles counters
    placed via proliferate → instead of 1, adds 2 of each type
  → Proliferate + infect: adding more poison counters via proliferate is a win condition
  → Proliferate + planeswalkers: adding loyalty to PWs is powerful and non-obvious

INVESTIGATE pattern:
"Create a colorless Clue artifact token with '{2}, Sacrifice this token: Draw a card.'"
  → Clue is an artifact token: counts for metalcraft, improvise, artifact death triggers
  → The draw ability is an activated ability of the token
  → Sacrifice as part of the cost → draw as the effect
  → Triggering on artifact sacrifice: other cards watching for artifacts being sacrificed
    will trigger when you sacrifice the Clue
  → Grafdigger's Cage does NOT stop Clue draw (the draw comes from an activated ability
    of the Clue token; Cage stops casting from GY/sideboard, not activated draw abilities)
  → Saheeli, the Gifted + Clues: reducing artifact activation costs makes Clue cheaper
  → You can investigate multiple times → multiple Clue tokens → delayed card draw
  → Clues can't be sacrificed for other "sacrifice an artifact" costs unless the card
    specifically allows ANY artifact (not just tokens)
```

## Definitive Conclusions

**Learn:**
- Learn's "and/or" is unusual — most effects are strictly "one or the other." Learn lets you grab a Lesson AND discard-draw, meaning if you have a Lesson in your sideboard you want AND a card you want to cycle, you can do both in one Learn.
- In Limited, Lesson cards are a significant part of deck construction — players sideboard multiple Lessons to support their learn cards. A draft with many learn effects rewards a diverse lesson suite.
- Learn's discard triggers madness! If you have a card with madness in hand, discarding it to the learn loot option fires the madness trigger (CR 702.36: madness triggers when you discard).
- In multiplayer: only the learning player can access their own outside-the-game Lessons. Opponents' sideboards are not accessible.
- Key card: *Introduction to Prophecy* (STX Lesson): Common Lesson card that tutors any basic land onto the battlefield when learned. Learning with access to this lesson is powerful in mana-hungry decks.
- Key card: *Expel* (STX): Exile a tapped creature. Learn. Simple but efficient — removal + learn is excellent in limited.

**Proliferate:**
- **COMMON MISCONCEPTION — Proliferate does NOT affect suspended cards.** Suspended cards are in exile, not on the battlefield, so they are not permanents. Proliferate (CR 701.34a) says "choose any number of permanents and/or players" — exile cards are neither. You cannot add time counters to a suspended card via proliferate. (Scryfall ruling 2023-02-04: "You can't choose cards in any zone other than the battlefield, even if they have counters on them.")
- Proliferate on loyalty counters: planeswalkers are common proliferate targets. Adding 1 loyalty to each of your planeswalkers in one proliferate action is extremely powerful. Doubling Season already doubles planeswalker entry loyalty, but proliferate lets you keep ticking them up.
- Proliferate + infect (poison counters): adding poison counters to opponents who already have any poison is a win condition. With proliferate, reaching 10 poison happens quickly once an opponent has 5–6.
- Proliferate cannot add a counter type that isn't already present. You can't proliferate a creature from zero +1/+1 counters to one.
- Key card: *Thrummingbird* (SOM): "Flying. Whenever Thrummingbird deals combat damage to a player, proliferate." Evasive + repeatable proliferate on each hit.
- Key card: *Inexorable Tide* (SOM): "Whenever you cast a spell, proliferate." Every spell = proliferate. In a counter-heavy deck, this is a massive snowball.

**Investigate:**
- Clue tokens are artifacts — they fuel metalcraft (Mox Opal and other metalcraft cards), improvise costs, and trigger "whenever an artifact enters/dies" effects.
- Sacrificing a Clue for draw is instant-speed — you can investigate at sorcery speed, then sacrifice the Clue at any time for a draw (e.g., in response to a removal spell to draw into an answer).
- Multiple Clue sacrifices on the same turn can chain draws — but each costs {2}.
- Clue tokens work with *Erdwal Illuminator* (SOI): "Whenever you investigate for the first time each turn, investigate an additional time." One extra investigation per turn — the first investigate each turn gets doubled, but subsequent investigations that turn do not.
- Key card: *Tireless Tracker* (SOI): "Landfall — Whenever a land enters the battlefield under your control, investigate." Fetch lands give two investigate triggers. A single Tireless Tracker with fetch lands and Clue tokens becomes a massive card-advantage engine.
- Key card: *Tamiyo's Journal* (SOI): "At the beginning of your upkeep, investigate. Tap, Sacrifice three Clues: Search your library for any card..." The Journal creates a Clue per turn and lets you convert 3 Clues into a tutor.

## Canonical Examples

**Learn:**
- *Expel* (STX): Learn at the end of a removal spell. Standard Strixhaven Draft play.
- Discarding to learn with madness cards in hand → madness trigger fires → effectively cast the madness card from the discard.

**Proliferate:**
- *Contentious Plan* (WAR): "Proliferate. Draw a card." For {1}{U}. Instant-speed proliferate + draw.
- Infect decks: opponent at 8 poison + Thrummingbird hit = proliferate to 9 poison = one more proliferate/hit wins.
- Planeswalker decks: Inexorable Tide + 3 planeswalkers = every spell ticks up every planeswalker by 1.

**Investigate:**
- *Tireless Tracker*: The most powerful investigate engine printed.
- *Erdwal Illuminator* (SOI): "Whenever you investigate for the first time each turn, investigate an additional time." The first investigation each turn becomes two Clues.

## Commonly Confused With

- **P459** (Discover/Mill/Collect Evidence) — Collect Evidence exiles cards from GY as a cost; Learn fetches from outside the game; both involve supplemental card access but from different sources
- **P418** (Graft/Modular/Sunburst) — These put counters on permanents as ETB effects; Proliferate spreads existing counters via keyword action
- **P417** (Suspend/Vanishing) — Proliferate CANNOT add time counters to suspended cards (they're in exile, not permanents); Vanishing has time counters on permanents that CAN be proliferated (causing earlier sacrifice); key distinction: Vanishing cards ARE on the battlefield while Suspend cards are NOT
- **P281** (Food/Treasure/Clue tokens) — Clue tokens are the artifact tokens from Investigate; sacrificing them for {2} draws a card; these tokens fuel artifact synergies
