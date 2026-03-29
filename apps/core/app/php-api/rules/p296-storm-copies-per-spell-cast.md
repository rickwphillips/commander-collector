---
id: p296
name: Storm — Triggered Copies for Each Spell Cast Before It This Turn
category: stack
cr_refs: [702.40a, 702.40b]
tags: [storm, triggered, copies, spell-count, stack, combo, Tendrils-of-Agony, Empty-the-Warrens, Grapeshot, Minds-Desire, storm-count, EDH-banned]
created: 2026-03-29
examples_count: 2
---

# P296 — Storm — Triggered Copies for Each Spell Cast Before It This Turn

## Abstract
Storm is a triggered ability that fires when you cast a spell with storm. It copies that spell for each other spell that was cast before it this turn — so if you've cast 8 spells before a storm spell, you get 8 copies. The storm count tracks ALL spells cast this turn (by any player), not just the storm player's spells. The copies go on the stack and can be targeted independently if the spell has targets. Storm was dominant enough to spawn its own archetype ("Storm combo") and most storm cards are banned in Legacy and Commander.

## The Definitive Rules

**CR 702.40a** (verbatim): *"Storm is a triggered ability that functions on the stack. 'Storm' means 'When you cast this spell, copy it for each other spell that was cast before it this turn. If the spell has any targets, you may choose new targets for any of the copies.'"*

**CR 702.40b** (verbatim): *"If a spell has multiple instances of storm, each triggers separately."*

## The Pattern

```
STORM TRIGGER:
  Fires when: you cast the storm spell
  Effect: "copy it for each OTHER spell cast before it this turn"
  The spell itself doesn't count — only spells before it in the same turn
  Storm count = total spells cast this turn before this spell (by any player)

  STORM COUNT:
    Counts ALL spells cast this turn by ANY player
    Opponent cantrips this turn also count toward YOUR storm count
    Cantrips, Rituals, each spell cast "this turn" before the storm spell
    A common pre-storm turn: cast 10 rituals + cantrips → storm count 10
    Then cast Tendrils of Agony: 10 copies + original = 11 Tendrils

  COPIES ON THE STACK:
    Storm trigger creates copies that go onto the stack (on top of the original)
    Copies resolve before the original: LIFO stack
    First copy resolves, then next copy, ... then original resolves last
    But all copies go onto stack simultaneously (storm trigger creates all at once)

  TARGETS FOR COPIES:
    "If the spell has any targets, you may choose new targets for any of the copies"
    You don't HAVE to choose new targets — can keep original targets for copies
    Each copy can have different targets
    Tendrils of Agony targets: "target player loses 2 life and you gain 2 life"
    10 copies all targeting opponent = opponent loses 20 life (+ original = 22 life loss)
    Or split: some copies to opponent, some to you (gain life)

  COPIES ARE NOT "CAST":
    Storm copies are NOT cast — they are created by the trigger
    Storm copies don't trigger other storm abilities (no chain storm)
    Storm copies DON'T count for spells-cast-this-turn in future storm counts
    This is important: casting the storm spell doesn't extend the count

NOTABLE STORM CARDS (all banned in Commander):
  Tendrils of Agony ({2}{B}{B}): Sorcery — Storm. "Target player loses 2 life and you gain 2 life."
    Classic combo win: Storm 10 copies all targeting opponent = 20+2=22 life loss.
    Popular "kill" in EDH Storm decks before ban.

  Empty the Warrens ({3}{R}): Sorcery — Storm. "Create two 2/1 red Goblin tokens."
    Storm 10 = 10 copies × 2 tokens + original 2 = 22 tokens.
    Goblin storm: generate massive board presence in one turn.
    Used in Legacy Storm where Tendrils would take life to 0.

  Grapeshot ({1}{R}): Instant — Storm. "Grapeshot deals 1 damage to any target."
    Storm 7 = 7 copies + original = 8 damage from one spell.
    Easier in "storm light" decks — can accumulate moderate storm count.

  Mind's Desire ({4}{U}{U}): Sorcery — Storm. "Exile the top card of your library. Until end of turn,
    you may play that card without paying its mana cost."
    Storm 5 = 5 copies, each exiling and potentially casting more spells.
    Can be self-fueling: each Mind's Desire copy might let you cast more spells.
    But: copies aren't cast, so they don't count for storm... but the free spells they enable DO.
    Mind's Desire storm count doesn't include the copies, but includes everything cast via them.

  Brain Freeze ({1}{U}): Instant — Storm. "Target player mills 3."
    Storm 10 = 10 copies + original = 33 cards milled.
    Alternate win condition for storm combo: mill opponent to death.

STORM COMBO SETUP (typical turn):
  Win condition: reach storm count 8-10 before casting Tendrils or Empty the Warrens
  Mana generation:
    Dark Ritual: {B} → {B}{B}{B} (net +2 mana). Cast it: storm count 1
    Cabal Ritual: {1}{B} → {B}{B}{B} or with threshold: {B}{B}{B}{B}{B}. Storm count 2.
    Lion's Eye Diamond: sacrifice, cast 0-mana: storm count 3. Generate {R}{R}{R}{R}{R}{R} or similar.
  Card draw to find more rituals:
    Brainstorm ({U}): draw 3, put 2 back. Storm count +1.
    Ponder ({U}): look at 3, reorder. Storm count +1.
  By storm count 9: cast Tendrils of Agony.
    Tendrils goes on stack. Storm trigger fires: 9 copies.
    All 10 Tendrils resolve hitting opponent: 20 life loss. Win.

STORM + EXTRA TURNS:
  Storm counts spells "this turn" — if you take an extra turn, the storm count RESETS
  Starting a new turn: storm count = 0 again
  Even within an extra turn, only spells cast in THAT turn count
  Yawgmoth's Will + storm: casting from GY counts (each GY spell increments storm)

STORM + COPIES AND THE STACK:
  Storm trigger fires → copies are put on the stack
  Players can respond BETWEEN the trigger going on the stack and the copies resolving
  Response to the storm trigger itself: stack is: storm trigger, storm spell
    Countering storm trigger: all copies gone (the trigger was countered)
    Countering the trigger is usually too late — trigger already fired when spell was cast
    Actually: stifle can counter the storm trigger itself → 0 copies
  SPELL PIERCE targeting the storm SPELL itself (before trigger): countered, storm trigger never fires
  Flusterstorm: instant — storm — "counter target instant or sorcery unless opponent pays {1} per copy"
    Flusterstorm itself is a storm spell — it triggers storm, creating copies
    Opponent must pay {1} per Flusterstorm copy to prevent their spell from being countered

EMPTY THE WARRENS MATH:
  Storm 5: 5 copies + original = 6 castings × 2 = 12 tokens
  Storm 10: 22 tokens
  Storm 15: 32 tokens
  Even storm 4 produces 10 tokens — reasonable aggro board
```

## Definitive Conclusions

- **Storm counts all spells cast this turn by any player** — not just yours, and not just the storm player's.
- **Storm copies are NOT cast** — they don't trigger storm again or count as "spells cast."
- **Stifle can counter the storm trigger** — stops all copies without countering the spell itself.
- **Tendrils of Agony at storm 9 hits opponent for 20 life** — plus the original = 22 total.
- **Storm count resets each turn** — extra turns don't extend the same turn's storm count.

## Canonical Example
**Legacy Ad Nauseam Tendrils Turn:**
Hand: 7 cards including: Dark Ritual × 2, Cabal Ritual, Brainstorm, Ponder, Lion's Eye Diamond, Tendrils of Agony.
Turn 3: opponent taps out. Your turn.
Cast Dark Ritual: storm count = 1. Float {B}{B}{B}.
Cast Dark Ritual: storm count = 2. Float {B}{B}{B}{B}{B}.
Cast Cabal Ritual: storm count = 3. Float +3 mana.
Activate Lion's Eye Diamond (discard hand): storm count = 4. Float lots of mana.
Actually LED is a mana ability (activates mid-cast): it doesn't count for storm.
Continue without LED for clarity:
Cast Ponder: storm count = 4. Find Brainstorm.
Cast Brainstorm: storm count = 5. Draw 3 including another ritual.
Cast Ritual: storm count = 6.
Cast Dark Ritual: storm count = 7.
Cast Cabal Ritual (threshold active): storm count = 8.
Cast Tendrils of Agony: storm trigger fires.
8 copies created. Stack: copy × 8 then original.
All 9 Tendrils target opponent: 18 life loss. Opponent at 2 life.
Wait — need 10 copies. Adjust: storm count 9 before Tendrils → 10 total → 20 life loss → win.

**Example 2 — Empty the Warrens in Modern:**
Deck: Goblin Storm. Turn 2 (opponent on draw): your hand has multiple cantrips + rituals.
Cast Seething Song: +3 red mana. Storm 1.
Cast Seething Song: storm 2.
Cast Rite of Flame: storm 3. More mana.
Cast Desperate Ritual: storm 4.
Cast Pyretic Ritual: storm 5.
Cast Manamorphose (draw 2): storm 6.
Cast Manamorphose again: storm 7.
Cast Empty the Warrens: storm trigger.
7 copies: 7 Empty the Warrens copies + original.
Each produces 2 tokens: 8 × 2 = 16 2/1 Goblins.
Turn 3: attack with 16 Goblins. Opponent at 20 life. They need 10+ blockers.
Empty the Warrens alternate win: goblin flood instead of life drain.

## Commonly Confused With
- **P297 (Cascade)** — Cascade exiles cards looking for a free cast; storm creates copies of the spell itself. Both are triggered by casting spells, but the effect is completely different.
- **P005 (APNAP Trigger Ordering)** — Storm creates multiple copies at once; they go on stack in the order the storm player chooses (since all from same player), then resolve LIFO.
- **P281 (Spell Copies via Tokens)** — Storm copies are distinct from Fork/Twincast-style copies; storm copies are created by the storm trigger, Fork is a separate spell that copies a target spell.
