---
id: p277
name: Dungeons and Rooms — Venturing Through Dungeon Rooms for Cumulative Rewards
category: zones
cr_refs: [309.1, 309.2, 309.3, 309.4, 309.5, 309.6, 309.7, 309.8, 309.9]
tags: [dungeon, venture-into-dungeon, room, dungeon-room, Dungeon-of-the-Mad-Mage, Lost-Mine-of-Phandelver, Tomb-of-Annihilation, Dungeon-Master, Forgotten-Realms, Dnd, Planar-Atlas, Acererak]
created: 2026-03-29
examples_count: 2
---

# P277 — Dungeons and Rooms — Venturing Through Dungeon Rooms for Cumulative Rewards

## Abstract
Dungeons are a card type introduced in Adventures in the Forgotten Realms (2021). They exist in a special out-of-game zone (like emblems) and are traversed via the "venture into the dungeon" mechanic. When you venture, you move to the next room of the dungeon you're currently in, triggering that room's effect. When you reach the final room and complete it, the dungeon is completed and removed. Three dungeons exist: Dungeon of the Mad Mage (16 rooms, long game), Lost Mine of Phandelver (8 rooms, choice-based), and Tomb of Annihilation (5 rooms, sacrifice-heavy). Completing a dungeon often triggers powerful rewards, especially Tomb of Annihilation (poison counters for opponents) or Dungeon of the Mad Mage (explore effects + card advantage).

## The Definitive Rules

**CR 309.1** (verbatim): *"Dungeon is a card type. See rule 309, 'Dungeons.'"*

**CR 309.3** (verbatim): *"Dungeons are kept in a special holding space and are not considered to be in any zone unless they are in the command zone (see rule 408, 'The Command Zone'). Before the game begins, each player shuffles their dungeon cards and places them face down in a pile."*

**CR 309.4** (verbatim): *"A player can only have one dungeon in the command zone at a time. If they complete a dungeon (see rule 309.6), the completed dungeon is put in the dungeon's owner's graveyard."*

**CR 309.5** (verbatim): *"To venture into the dungeon, a player goes to the next room of a dungeon. If that player doesn't currently have a dungeon in the command zone, they choose one of their dungeons and put it into the command zone. They then put a venture marker on the first room of that dungeon. If that player already has a dungeon in the command zone, they move the venture marker to the next connected room in that dungeon."*

**CR 309.6** (verbatim): *"A dungeon is complete when the venture marker is on its last room and that room's ability has resolved (see rule 309.5)."*

## The Pattern

```
DUNGEON SETUP:
  Before the game: each player has their dungeon cards in a special holding zone
  Not in your library, hand, or exile: in a special holding pile
  The three available dungeons: Dungeon of the Mad Mage, Lost Mine of Phandelver, Tomb of Annihilation

VENTURE INTO THE DUNGEON:
  Mechanic: "venture into the dungeon" appears on card effects
  If you have NO dungeon in progress: choose one, put it in the command zone, place a marker on Room 1
  If you have a dungeon in progress: move the marker to the NEXT connected room
  Each time you reach a room: that room's effect/ability triggers and resolves

DUNGEON ROOM STRUCTURE:
  Each dungeon is a series of connected rooms (like a flowchart)
  Some rooms have BRANCHES: you choose which path to take
  Each room has a specific triggered effect
  Final room: completing it = dungeon is done → send to graveyard

THE THREE DUNGEONS:

  LOST MINE OF PHANDELVER (8 rooms):
    First room: "Put a +1/+1 counter on target creature"
    Branching paths lead to various rooms:
      Goblin Lair path: tokens and damage
      Triboar Trail path: card draw and counters
    Final room: "Reveal the top card of your library. If it's a land, put it on the battlefield.
      Otherwise, put it in your hand."
    Best for: moderate rewards, choice-based progression, flexible dungeon completion
    Fastest to complete with the right venturing cards.

  DUNGEON OF THE MAD MAGE (16 rooms):
    16 rooms — takes many ventures to complete
    Rooms include: "Explore" (look at top card, put land on battlefield or put top card in hand),
      "Draw two cards and reveal...", token creation, creature buffs, etc.
    Final room: "Each opponent loses 10 life."
    Best for: long-game value accumulation; the final room payoff is massive
    Challenge: 16 rooms requires sustained venturing over many turns

  TOMB OF ANNIHILATION (5 rooms):
    FIVE rooms — fastest to complete
    All rooms have HARSH self-sacrifice effects:
      "Each player sacrifices a creature" (Room 2)
      "You lose 3 life" (some rooms)
      Rooms that hurt both players
    Final room: "Each opponent gets a poison counter." (Small but immediate)
    Wait: Acererak-based combo uses Tomb of Annihilation for repeated completion.
    Best for: fast completion, graveyard recursion combo decks (complete it fast, start over)

COMPLETING A DUNGEON:
  When the venture marker is on the last room AND that room's ability resolves: dungeon is complete
  Put the dungeon in its owner's graveyard
  You can immediately start a new dungeon (next venture picks a new one)

DUNGEON COMBO — ACERERAK THE ARCHLICH:
  Acererak the Archlich ({5}{B}, Legendary Creature 5/5): "If you haven't completed Dungeon of the
    Mad Mage, return Acererak to its owner's hand and venture into the dungeon."
  Translation: each time Acererak ETBs and Mad Mage isn't complete → return to hand + venture.
  This loops: Acererak ETBs → venture Tomb of Annihilation (5 rooms, complete fast) →
    complete Tomb → venture Tomb again → repeat, giving poison counters each completion.
  But wait: Acererak returns to hand if Mad Mage isn't complete. Each time he ETBs:
  - if Tomb of Annihilation is the active dungeon: advance it and/or complete it
  - Acererak returns to hand: cast him again (if you have infinite mana)
  With infinite mana: Acererak enters, ventures, returns to hand, enters again, ventures again.
  Each complete Tomb of Annihilation: opponents get a poison counter.
  10 completions: all opponents at 10 poison → win the game.

VENTURE INTO THE DUNGEON + DUNGEON SYNERGIES:
  Cards that say "whenever you venture into the dungeon" or "for each dungeon you completed"
  Dungeon: Dungeon Master ({3}{B}) — when a creature ventures, put a +1/+1 counter on each of your
    creatures.
  Dungeon: Hama Pashar, Ruin Seeker ({2}{U}) — room effects trigger twice.
  Dungeon synergy cards reward sustained dungeon progress.

ROOMS CARD TYPE (recent design — separate from Dungeons):
  Rooms are a different permanent type (from late 2024)
  Not the same as Dungeon rooms — Rooms are actual cards on the battlefield
  A Room card has two "rooms" on it (like a split card with two halves)
  One room can be unlocked (the other later) by paying unlock costs
  Rooms create a physical location on the battlefield with persistent abilities
  Not related to Venture — Rooms are a separate card type
```

## Definitive Conclusions

- **Dungeon cards are in a special holding zone** — not in your deck, hand, or exile.
- **Venture into the dungeon moves the marker one room** — if no dungeon active, choose one and start it.
- **Each dungeon room triggers its ability** when the marker enters it.
- **Completing a dungeon sends it to the graveyard** — you can start a fresh dungeon on the next venture.
- **Acererak's dungeon loop** repeatedly completes Tomb of Annihilation for poison counters with infinite mana.

## Canonical Example
**Lost Mine of Phandelver Moderate Value:**
Turn 3: cast Hive of the Eye Tyrant (Dungeon-synergy land). Tap land to venture.
No dungeon active: choose Lost Mine of Phandelver. Marker on Room 1: "Put a +1/+1 counter on target creature."
Choose your best attacker. It gets a +1/+1 counter.
Turn 4: another venture trigger (from a dungeon creature). Move marker to Room 2 (branch choice).
Choose the Goblin Lair path (for tokens) or Triboar Trail (for draw). Pick Triboar Trail.
Room 2: "Draw a card."
Turn 5: venture again. Room 3 (Triboar Trail path): "Create a 1/1 colorless Treasure token."
Turns 5-7: venture through remaining rooms toward the final room.
Final room: "Reveal top card of library; if land, enter; otherwise put in hand."
Dungeon completed → to graveyard. Next venture: start a new Lost Mine.

**Example 2 — Acererak Infinite Poison Loop:**
Setup: infinite mana available (e.g., Basalt Monolith + Rings of Brighthearth).
Cast Acererak the Archlich ({5}{B}) from hand.
ETB: Dungeon of the Mad Mage is NOT complete → return Acererak to hand AND venture.
First venture: start Tomb of Annihilation (5 rooms). First room: you lose 1 life.
Cast Acererak again with infinite mana. ETB: still not finished Mad Mage → return to hand, venture.
Second venture: Tomb room 2. Each player sacrifices a creature.
Cast again. Third venture. Etc. Fifth venture: Final room of Tomb → each opponent gets a poison counter.
Tomb complete → graveyard. Sixth venture: start ANOTHER Tomb (or another dungeon).
Continue cycling: each Tomb completion = 1 poison counter per opponent.
With infinite mana: complete 10 Tombs → 10 poison counters → opponents lose.

## Commonly Confused With
- **P276 (Battles)** — Battles are permanents that take damage to flip; Dungeons are special out-of-game cards traversed by venturing. Both have "progress" mechanics but completely different structures.
- **P183 (Sagas/Lore Counters)** — Sagas advance every turn automatically; Dungeons advance each time you "venture" (from specific effects). Sagas are permanents on the battlefield; Dungeons are in the command zone.
- **P255 (Suspend)** — Suspend counts down time counters in exile; Dungeons use a separate game-zone (command zone) with a venture marker progressing through rooms.
