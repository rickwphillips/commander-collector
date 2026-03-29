---
id: p297
name: Cascade — Exile Cards Until Finding a Cheaper Spell to Cast for Free
category: stack
cr_refs: [702.85a, 702.85b, 702.85c]
tags: [cascade, triggered, exile, mana-value, free-cast, Bloodbraid-Elf, Shardless-Agent, Violent-Outburst, Living-End, Glimpse-of-Tomorrow, cascade-combo, Jhoira-of-the-Ghitu]
created: 2026-03-29
examples_count: 2
---

# P297 — Cascade — Exile Cards Until Finding a Cheaper Spell to Cast for Free

## Abstract
Cascade is a triggered ability that fires when you cast a cascade spell. It exiles cards from the top of your library one by one until it finds a nonland card with mana value strictly less than the cascade spell's mana value. That card can then be cast without paying its mana cost. All other exiled cards go to the bottom of the library in a random order. Cascade does not care about color or card type — any nonland card with a lower MV can be cast. This enables "cascade combo" strategies where deliberately low-MV or zero-MV spells are the only valid cascade hits (Living End, Crashing Footfalls, Glimpse of Tomorrow).

## The Definitive Rules

**CR 702.85a** (verbatim): *"Cascade is a triggered ability that functions only while the spell with cascade is on the stack. 'Cascade' means 'When you cast this spell, exile cards from the top of your library until you exile a nonland card whose mana value is less than this spell's mana value. You may cast that card without paying its mana cost if the resulting spell's mana value is less than this spell's mana value. Then put all cards exiled this way that weren't cast on the bottom of your library in a random order.'"*

**CR 702.85b** (verbatim): *"If an effect allows a player to take an action with one or more of the exiled cards 'as you cascade,' the player may take that action after they have finished exiling cards due to the cascade ability."*

**CR 702.85c** (verbatim): *"If a spell has multiple instances of cascade, each triggers separately."*

## The Pattern

```
CASCADE TRIGGER:
  Fires when: you cast a spell with cascade
  Process:
    1. Exile cards from the top of your library one at a time
    2. Stop when you exile a nonland card whose MV < cascade spell's MV
    3. Optionally cast that card for free (without paying its mana cost)
    4. Put all other exiled cards (those NOT cast) on the bottom of library in RANDOM order
    5. If no card found (library empty): just stop exiling

  MANA VALUE CHECK:
    Cascade spell's MV = its total converted mana cost
    Target card must have MV STRICTLY LESS THAN the cascade spell's MV
    Example: Bloodbraid Elf has MV 4 ({1}{R}{G}{G} — wait, {2}{R}{G})
      Bloodbraid Elf MV: {2}{R}{G} = 4
      Cascade can find any nonland card with MV 3 or less
    Example: Violent Outburst MV 3 ({1}{R}{G})
      Can find any nonland card with MV 2 or less
      BUT: if you build your deck to ONLY have suspend cards (MV 0) — you always hit those

  CASCADE COMBO (key interaction):
    Suspend cards like Living End and Crashing Footfalls have NO mana cost → MV = 0
    They CANNOT be cast normally (no mana cost)
    But cascade can find MV 0 cards: 0 < any cascade spell's MV
    So: build a deck with only cascade spells + zero-MV suspend spells (+ lands)
    Cascade fires → exiles down until it hits the zero-MV spell → casts it for free!

  NOTABLE CASCADE CARDS:
    Bloodbraid Elf ({2}{R}{G}, MV 4): 3/2 Haste. Cascade.
      Standard cascade: find any MV ≤ 3 spell. Could hit any 3-drop in your deck.
      Was banned in Modern for years — too many powerful 3-drops could be free.

    Shardless Agent ({1}{G}{U}, MV 3): 2/2. Cascade.
      Cascade hits MV ≤ 2. In Legacy, common hits: Ancestral Vision (MV 0 suspend), Hymn to Tourach.
      Ancestral Vision: "Suspend 4 — {U}. Draw 3 cards." MV 0.
      Cascade + Shardless Agent → free Ancestral Vision → draw 3. Incredible value.

    Violent Outburst ({1}{R}{G}, MV 3): Instant — Cascade. "Creatures you control get +1/+0 until EOT."
      Instant speed cascade! Cascade triggers on the STACK during opponent's turn.
      Used in Living End combo: Violent Outburst during opponent's turn → cascade hits Living End.
      Living End resolves immediately (no suspend; just cascade into it). Entire GY returns as creatures.

    Ardent Plea ({1}{W}{U}, MV 3): Enchantment — Cascade. "Exalted."
      Another MV 3 cascade. Can be searched with enchantment tutors if needed.

  LIVING END COMBO (MODERN):
    Deck composition: only cascade spells, Living End × 3 (MV 0), lands.
    No other spells below cascade MV (to ensure cascade always hits Living End).
    Setup:
      Cycle creatures to GY (Architects of Will, Monstrous Carabid, Street Wraith).
      Each has cycling — pay to put in GY without casting.
      Fill GY with 5-10 large creatures.
    Combo turn:
      Cast Violent Outburst or Demonic Dread (instant cascade 3) → cascade fires.
      Exile library until Living End is hit (it's the only nonland below MV 3).
      Cast Living End for free.
      Living End: each player sacrifices all creatures, each player returns all creatures from their GY.
      You return 10 giant creatures. Opponent loses their board.
      Attack for lethal.
    Key: instant-speed Violent Outburst means you can do this on OPPONENT'S END STEP.
      Opponent has no response window between cascade and Living End resolving.

  GLIMPSE OF TOMORROW COMBO:
    Glimpse of Tomorrow: Suspend 3 — {R}. Shuffle all permanents you control into library.
      Reveal new top permanent count × permanents you had. Put them into play.
      MV 0 (suspend card, no mana cost).
    Used with cascade spells in Modern to build massive boards from library.
    Cascade finds Glimpse → puts all permanents back in and reveals massive new board.

CASCADE + CHOICES:
  Cascade is optional: "You MAY cast that card"
  If you choose not to cast: the card goes to the bottom with the other exiled cards
  Choosing not to cast is rare but can come up (e.g., cascade would hit a spell that would hurt you)

CASCADE + TARGETS:
  The cascaded spell is cast without paying its mana cost
  All normal casting rules apply: if it needs a target, you choose targets when it's cast
  If no legal targets: you may choose not to cast the cascaded spell

CASCADE + MULTIPLE INSTANCES (CR 702.85c):
  If a spell has Cascade twice (from a grant or printing): each triggers separately
  Two cascade triggers = two separate exile-until-MV-less processes
  Very powerful: essentially two free spells off one cast

CASCADE + MANA VALUE EDGE CASES:
  X spells: X = 0 when cascade counts the cascaded spell's MV
    Example: cascade finds Grapeshot (MV 2) from cascade spell with MV 4.
    You CAN cast Grapeshot via cascade. Grapeshot's storm count: just 1 (the cascade resolved).
  Companions: companion is outside the game; cascade only hits library cards
  Split cards: MV of a split card = combined MV of both halves
    Adventure cards: MV = the total spell's MV
```

## Definitive Conclusions

- **Cascade finds the first nonland card with MV strictly less than the cascade spell** — then you cast it for free.
- **Cascade combo works by stacking only MV 0 suspend cards** — cascade always hits them since 0 < any positive MV.
- **Cascade is optional** — you can choose not to cast the found card.
- **Multiple instances of cascade trigger separately** — two cascade = two free spells.
- **Instant-speed cascade (Violent Outburst) enables end-step combo** — opponent has no response window.

## Canonical Example
**Bloodbraid Elf in Modern Jund:**
Game state: Turn 4. Your mana: {R}{R}{G}{G}. Hand includes Bloodbraid Elf.
Cast Bloodbraid Elf ({2}{R}{G}). She enters the stack. Cascade trigger fires.
Cascade: exile cards from top until you find a nonland with MV ≤ 3.
Library top: Forest (land — keep exiling), Terminate (MV 2 = {B}{R}, nonland — stop!).
"You may cast Terminate without paying its mana cost."
Terminate targets opponent's Tarmogoyf. Goyf is destroyed.
Bloodbraid Elf resolves: enters as 3/2 Haste. Attack immediately.
Result: one card cast gave you a 3/2 haste attacker AND killed their best creature.
Forest goes to bottom of library (random). Terminate was cast, not returned.

**Example 2 — Living End Combo Turn:**
Deck: 4 Violent Outburst, 4 Demonic Dread, 3 Living End, lands, cycling creatures.
Setup turns:
  Turn 1: cycle Street Wraith (pay 2 life): Wraith in GY.
  Turn 2: cycle Architects of Will ({2}{U}): in GY.
  Turn 3: cycle Desert Cerodon ({5}{R}{G}, but cycling {R}): huge creature in GY.
GY has 3 large creatures. Opponent has a full board developing.
Combo turn (turn 3 — opponent's end step):
  Cast Violent Outburst at instant speed. Cascade trigger fires.
  Deck: only Living End as non-cascade nonland. Exile until Living End found.
  Cast Living End for free.
  Living End resolves:
    Each player sacrifices all creatures they control.
    Each player returns all creature cards from their GY to the battlefield.
    Opponent had 3 creatures: all sacrificed. Their GY had no creatures (early game).
    You had 0 creatures on board (nothing to sacrifice). Your GY: Street Wraith (3/4), Architects (3/3),
    Desert Cerodon (5/6). All three enter attacking.
  Start of your turn: attack with 11 power of creatures. Opponent at 20 life with no board.
  Likely win next turn.

## Commonly Confused With
- **P296 (Storm)** — Storm creates copies of the storm spell; cascade finds and casts a different spell. Both are triggered by casting, but cascade fetches from library while storm copies itself.
- **P282 (Escape/Delve)** — Escape also lets you cast from non-hand zones; cascade casts from library (a temporary exile), escape from GY with an exile cost.
- **P294 (Companion)** — Companion also grants a free cast (after {3}); cascade free cast is triggered automatically and finds cards from your library not the sideboard.
- **P269 (Plot)** — Plot exiles a card for a sorcery-speed future cast; cascade exiles and immediately offers the cast during its own resolution.
