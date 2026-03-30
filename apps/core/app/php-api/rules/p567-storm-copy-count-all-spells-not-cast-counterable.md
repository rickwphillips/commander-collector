---
id: p567
name: Storm — Copy for Each Prior Spell, Copies Not Cast, Counterable Individually
category: stack
cr_refs: [702.40, 702.40a, 702.40b, 707.10]
tags: [storm, copies, storm-count, spell-count, not-cast, triggered-ability, counter, stack, tendrils-of-agony, grapeshot]
created: 2026-03-31
examples_count: 3
---

# P567 — Storm — Copy for Each Prior Spell, Copies Not Cast, Counterable Individually

## Abstract

**Storm creates copies of a spell equal to the number of other spells cast before it this turn.** Storm is a triggered ability that fires when the spell with storm is cast. The trigger creates copies directly on the stack — these copies are NOT cast (they don't count for other storm triggers, prowess, etc.). Each copy can have new targets chosen independently. The storm count includes ALL spells cast this turn by ALL players, from ANY zone, including spells that were countered. Copies must be countered individually — countering the original doesn't stop the copies, and countering one copy doesn't affect others. The storm TRIGGER itself can be countered (by Stifle, etc.), which prevents all copies from being created.

## The Definitive Rules

**CR 702.40a (Storm):** *"Storm is a triggered ability that functions on the stack. 'Storm' means 'When you cast this spell, copy it for each other spell that was cast before it this turn. If the spell has any targets, you may choose new targets for any of the copies.'"*

**CR 702.40b (Multiple Storm):** *"If a spell has multiple instances of storm, each triggers separately."*

**Official Ruling (2022-12-08):** *"The copies are put directly onto the stack. They aren't cast and won't be counted by other spells with storm cast later in the turn."*

**Official Ruling (2022-12-08):** *"Spells cast from zones other than a player's hand and spells that were countered are counted by the storm ability."*

**Official Ruling (2022-12-08):** *"A copy of a spell can be countered like any other spell, but it must be countered individually. Countering a spell with storm won't affect the copies."*

**Official Ruling (2022-12-08):** *"The triggered ability that creates the copies can itself be countered by anything that can counter a triggered ability. If it is countered, no copies will be put onto the stack."*

## The Pattern

```
STORM COUNT:

  Storm count = number of OTHER spells cast before this one THIS TURN.

  What counts:
    - Spells cast by ANY player (not just you)
    - Spells cast from ANY zone (hand, graveyard, exile, command zone)
    - Spells that were COUNTERED (still were cast)
    - Spells cast via alternative costs (madness, flashback, etc.)
    - Copies that were CAST (e.g., via "cast a copy of" effects)

  What does NOT count:
    - Copies put directly on the stack (storm copies, Twincast-style copies)
    - Activated abilities
    - Triggered abilities
    - Special actions
    - The storm spell itself (it counts "spells cast BEFORE it")

STORM TRIGGER AND COPIES:

  When you cast a spell with storm:
    1. Storm triggers (triggered ability on the stack above the spell)
    2. Storm trigger resolves:
       → Creates N copies of the spell (N = storm count)
       → Each copy is put directly on the stack
       → For each copy with targets: you MAY choose new targets
    3. Copies resolve one by one (top to bottom)
    4. Original spell resolves last (it's below the copies)

  Stack order (bottom to top):
    [Original storm spell]
    [Storm trigger resolves → creates copies]
    [Copy N] ← resolves first
    [Copy N-1]
    ...
    [Copy 1] ← resolves last before original

COPIES ARE NOT CAST:

  Storm copies are put on the stack, NOT cast:
    - "Whenever you cast" triggers don't fire
    - Prowess doesn't trigger
    - Other storm spells cast later don't count these copies
    - "Whenever a spell is cast" abilities don't see them
    - They ARE spells on the stack (can be countered, targeted)

COUNTERING STORM:

  Three levels of interaction:

  1. Counter the STORM TRIGGER (Stifle, Trickbind):
     → No copies are created at all
     → Original spell is still on the stack (resolves normally)
     → Most efficient way to stop storm

  2. Counter the ORIGINAL SPELL:
     → Copies are ALREADY on the stack (storm triggered on cast)
     → Copies still resolve normally
     → Only the original is stopped

  3. Counter individual COPIES:
     → Each copy is a spell and can be countered
     → Must counter each one separately
     → Impractical for high storm counts

STORM + NEW TARGETS:

  For each copy, you MAY choose new targets:
    - Each copy can target differently
    - You can split storm copies across multiple targets
    - You can keep the same target for all copies

  Example: Grapeshot (1 damage to any target) with storm count 5
    → Original + 5 copies = 6 total instances
    → Can target: 3 at creature A, 2 at player B, 1 at creature C

EDGE CASES:

  Storm count is LOCKED at the moment storm triggers:
    → Spells cast in response (after storm is on stack) don't increase count
    → The count is "spells cast before this one" at time of cast

  Copies of storm spells:
    → If you copy a storm spell (e.g., Fork), the copy also has storm
    → The copy's storm triggers when... wait, copies aren't cast!
    → A Fork copy of a storm spell doesn't trigger storm (not cast)
    → But if an effect lets you CAST a copy of a storm spell, storm triggers

  Multiple storm instances:
    → Each triggers separately (702.40b)
    → Double storm = double the copies

STORM AND "EACH OPPONENT":

  Tendrils of Agony: "Target player loses 2 life and you gain 2 life."
    → Each copy can target a different player
    → In multiplayer, spread copies across opponents
    → You gain 2 life per copy that resolves (regardless of target)
```

## Definitive Conclusions

- **Storm counts ALL spells by ALL players** — including countered ones, from any zone.
- **Copies are NOT cast** — don't trigger prowess, other storm, or "whenever you cast."
- **Counter the trigger, not the spell** — Stifle on the storm trigger prevents all copies.
- **Countering the original doesn't stop copies** — they're already on the stack.
- **Each copy can have different targets** — choose independently for each.
- **Storm count is locked at cast time** — responses don't change it.

## Canonical Example

**Tendrils of Agony with Storm Count 9:**

This turn, 9 spells were cast before Tendrils. You cast Tendrils of Agony targeting an opponent. Storm triggers.

Storm trigger resolves: 9 copies of Tendrils are put on the stack. Each targets the same opponent (or you choose new targets for any). The stack has: [Original Tendrils] → [9 copies on top].

Copies resolve one by one: opponent loses 2 life and you gain 2 life, nine times. Then the original resolves: opponent loses 2 more life, you gain 2 more. Total: opponent loses 20 life, you gain 20 life.

**Example 2 — Stifle vs Storm:**

You cast Grapeshot after 5 prior spells. Storm triggers. Opponent casts Stifle targeting the storm triggered ability. Stifle resolves: storm trigger is countered. No copies are created.

Grapeshot is still on the stack. It resolves normally: 1 damage to its target. Only 1 damage total instead of 6.

**Example 3 — Countered Spells Count:**

You cast Dark Ritual. Opponent counters it. You cast another Dark Ritual. It resolves. You cast Grapeshot.

Storm count: Dark Ritual (countered) + Dark Ritual (resolved) = 2 spells before Grapeshot. Storm creates 2 copies. Total: 3 Grapeshot instances (original + 2 copies). Countered spells count for storm.

## Commonly Confused With

- **P559 (Cascade)** — P559 covers cascade (one free cast, not copies); P567 covers storm (multiple copies, not cast). Both create spells from triggered abilities.
- **P546 (Cost Reduction Spell Copies)** — P546 covers why copies don't inherit cost reductions; P567 covers storm copies specifically (not cast, directly on stack).
- **P544 (Tiered Modal and Prowess Count)** — P544 covers single-cast events and prowess; P567 confirms storm copies don't trigger prowess (not cast).
