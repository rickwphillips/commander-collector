---
id: p036
name: Storm Count — What Gets Counted and When
category: stack
cr_refs: [702.40a, 707.10, 603.2c]
tags: [storm, count, spell-count, copies, cast, this-turn, extra-turn, grapeshot, mind-storm-surge]
created: 2026-03-28
examples_count: 3
---

# P036 — Storm Count — What Gets Counted and When

## Abstract
Storm counts "each other spell that was cast before it this turn." The count is fixed at the time the storm trigger resolves — spells cast after the storm spell don't count, and spells countered still count (being cast and being countered are separate events). Copies of spells are NOT cast and don't increment the storm count. Spells from each player's turn count in the current turn, and extra turns extend the turn, resetting the count for the new turn but not carrying forward the previous turn's count.

## The Definitive Rule

**CR 702.40a** (verbatim): *"Storm means 'When you cast this spell, copy it for each other spell that was cast before it this turn. If the spell has any targets, you may choose new targets for any of the copies.'"*

**CR 707.10**: A copy of a spell isn't cast — it's put directly onto the stack.

**CR 603.2c**: A trigger fires once per occurrence in an event.

## The Pattern

```
WHAT COUNTS FOR STORM:
  ✓ Any spell cast this turn by any player (before the storm spell)
  ✓ Spells that were subsequently countered (cast ≠ resolve)
  ✓ Copies of OTHER storm triggers that already resolved (the copies they create
    are not cast, but the storm spells themselves were cast)
  ✓ Spells cast from any zone (hand, graveyard via flashback, etc.)
  ✓ Adventure spells (the adventure was cast)
  ✓ Your own storm spell itself goes on the count for subsequent spells
    (but the storm trigger counts "before it" — so it doesn't count itself)

  ✗ Copies of spells (storm copies, reverberate copies, etc.)
  ✗ Tokens created that aren't spells
  ✗ Effects that put spells on the stack without casting them

COUNT IS FIXED WHEN?
  Storm trigger fires "when you cast this spell" → goes on stack above storm spell
  Count is determined when the trigger RESOLVES (not when it's put on stack)
  → Spells cast BETWEEN the trigger going on stack and resolving DO count?
    Actually: the count is evaluated at resolution time
    If opponent casts a spell in response to the storm trigger, that spell
    resolves first, then storm trigger resolves with N+1 copies
  Wait — let me be precise: "was cast before it this turn" — "it" = the storm spell
  All spells cast BEFORE the storm spell count. Spells cast AFTER don't.
  The trigger itself doesn't change what counts — it counts spells before the storm spell.

  CORRECTION: The trigger counts spells cast before the storm spell in the same turn.
  Spells cast after the storm spell (while the trigger is on the stack) do NOT count.
  The count is based on "before it" = before the storm spell was cast.

COPIES DON'T STORM:
  5 storm copies of Grapeshot are put on the stack
  Each copy is NOT cast — no storm trigger for the copies
  The original storm spell's trigger already resolved, creating the copies

TURN SCOPE:
  "This turn" = the current turn only
  Storm count resets each turn
  Extra turns: new turn starts, count resets to 0 for that turn
  Both active player's spells AND opponents' spells count (any player)

MULTIPLE STORM INSTANCES (CR 702.40b):
  Each instance triggers separately → you get more copies
  Two copies of "cast 3 spells + storm spell" = 2 triggers × 3 copies = 6 copies
```

## Definitive Conclusions

- **Countered spells still count.** Being cast and being resolved are separate. A spell that was countered was still cast and counts.
- **Copies don't count.** Reverberate, Fork, storm copies — none of these increment the storm count.
- **The count is spells cast BEFORE the storm spell.** Not spells cast while the trigger is resolving.
- **Both players' spells count.** If opponent cast 3 spells and you cast 2 before your storm spell, storm count = 5 copies.
- **Storm trigger resolves in APNAP order with other simultaneous triggers** (P005), but the count is already determined.
- **Each storm trigger independently counts all pre-storm spells.** Two Storm instances on the same spell → two triggers → each independently creates N copies.

## Canonical Example
**Grapeshot after 5 spells:**
Turn: You cast Lotus Petal (1), Mox Opal (2), Desperate Ritual (3), Pyretic Ritual (4), Seething Song (5). Then cast Grapeshot (6th spell). Storm trigger fires. Count: 5 spells before Grapeshot. 5 copies created. Original + 5 copies = 6 instances of Grapeshot, each dealing 1 damage. Total: 6 damage to any combination of targets.

**Example 2 — Opponent's spells count:**
Opponent's turn: they cast Swords to Plowshares (1), Path to Exile (2). You cast a cantrip in response (3). Opponent casts a storm spell (storm count = 3 — three spells before it). You have no way to "lower" the count (countering spells won't help — they were already cast).

**Example 3 — Copies don't count:**
You cast Mind's Desire (storm count = 4 → 4 copies). Mind's Desire is on the stack + 4 copies. Each copy resolves, exiling 1 card. The original resolves, exiling 1 card. If any exiled card is a storm spell: casting it from exile would start a new storm count (0 spells cast yet this turn? No — Mind's Desire itself counts). The NEW storm spell's count includes Mind's Desire + anything before it, but NOT the Mind's Desire copies.

## Commonly Confused With
- **P029 (Spell Copy Targeting)** — Copies don't increment the storm count (not cast). P029 covers copy independence; P036 covers what counts for storm.
- **P005 (Simultaneous Event Ordering)** — Multiple storm triggers go on the stack in APNAP order. P036 covers the count; P005 covers the ordering.
