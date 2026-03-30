---
id: p544
name: Tiered Modal Cost and Prowess Trigger Count — Single Spell, Single Trigger
category: triggered
cr_refs: [116.4, 601.2, 603.2, 702.33]
tags: [tiered, prowess, modal, spell-cast, cost, noncreature, triggered-ability, additional-cost, fire-magic]
created: 2026-03-30
examples_count: 2
---

# P544 — Tiered Modal Cost and Prowess Trigger Count — Single Spell, Single Trigger

## Abstract

**Tiered spells are cast as a single spell regardless of which tier (mode) is chosen.** When a creature with Prowess casts a Tiered spell, Prowess triggers **once per spell cast**, not once per tier chosen or once per additional cost paid. The tier selection is part of the spell's total cost calculation, not a separate spell-casting event. This pattern clarifies that modal cost spells with Prowess follow standard spell-count mechanics, not cost-based triggering.

## The Definitive Rules

**CR 601.2 (Casting a Spell):** *"To cast a spell, a player puts that spell on the stack. The spell remains on the stack until it resolves, is countered, or otherwise leaves the stack."*

**CR 601.2b (Announcing):** *"The player announces the spell or ability. This is part of the casting announcement. If the spell has a mode, the player chooses the mode... If the spell has an optional additional cost, the player decides whether to pay it."*

**CR 702.33 (Tiered):** *"Tiered represents an optional additional cost that grants the spell an alternative cost structure. The player chooses one tier and pays its additional cost as part of the spell's total cost. The spell is cast as a single spell with that tier's effects."*

**CR 603.2 (Triggered Abilities):** *"Triggered abilities trigger automatically when the game state or event matches their trigger condition."*

**CR 702.123a (Prowess):** *"Prowess is a triggered ability that fires whenever a noncreature spell is cast. The ability triggers once per spell cast, regardless of how that spell's cost was modified."*

## The Pattern

```
TIERED SPELL DEFINITION:

  Fire Magic (Tiered): {2}{R}
    Fire Mode ({R}): "Deal 2 damage to target creature or player."
    Fira Mode ({R}{R}): "Deal 4 damage to target creature or player."
    Firaga Mode ({R}{R}{R}): "Deal 6 damage to target creature or player."

  To cast Fire Magic:
    1. Choose one tier: Fire, Fira, or Firaga
    2. Pay the base cost: {2}
    3. Pay the tier's additional cost: {R}, {R}{R}, or {R}{R}{R}
    4. Total cost: {3}, {4}, or {5} depending on tier
    5. Spell is cast as a SINGLE SPELL (Fire Magic with chosen tier)

PROWESS ON TIERED SPELL:

  Creature with Prowess: {1}{R} (Prowess)
    "Whenever you cast a noncreature spell, this creature gets +1/+1 until end of turn."

  You cast Fire Magic (tiered) in Fira mode ({2}{R}{R}).

  Prowess trigger count:
    - Spell cast: 1 (Fire Magic is one spell, regardless of tier)
    - Additional cost payment: not a separate event
    - Mode selection: not a separate spell-cast

  Result: Prowess triggers ONCE. The creature gets +1/+1.

TIERED IS NOT STORM/CASCADE:

  Storm (P036): Each spell cast during a turn triggers Storm again.
    - Casting a spell triggers Storm
    - Each spell copy created by Storm is a new spell-cast event

  Tiered (P516): Choosing a tier is part of the spell's total cost.
    - Selecting Fira vs. Firaga does not create separate spell-cast events
    - The spell is cast once; tier selection is cost-related

  Prowess counts spell-cast events, not cost-payment events.
  Therefore: Tiered spell + Prowess = 1 trigger (not per tier).

TIERED + COST REDUCTION:

  If a cost-reduction effect applies (e.g., Atraxa, Praetor's Voice reduces costs by {1}),
    the reduction applies to the total cost after tier selection.

  Fire Magic in Fira mode ({2}{R}{R}):
    - Reduced by {1} to {4} total
    - Still cast as a single spell
    - Prowess still triggers once

TIERED + MULTIPLE PROWESS TRIGGERS:

  If you control TWO creatures with Prowess, and cast Fire Magic:
    - First Prowess creature gets +1/+1
    - Second Prowess creature gets +1/+1
    - Total: +1/+1 on each creature

  This is not Prowess stacking; it's multiple independent triggers of Prowess.

NONCREATURE SPELL CHECK:

  Prowess triggers on "noncreature spells." Tiered spells are always noncreature
    (they are instants/sorceries or other spells, not creature spells).

  Exception: If a creature spell has Tiered (novel mechanic, not yet printed),
    Prowess would trigger because the spell was cast, regardless of Tiered.

```

## Definitive Conclusions

- **Tiered spells are cast once** — regardless of which tier is chosen, the spell is a single spell-cast event.
- **Prowess triggers once per spell** — tier selection does not create additional spell-cast events.
- **Cost modification doesn't affect trigger count** — reducing the cost or choosing a different tier still results in one spell-cast.
- **Multiple Prowess creatures trigger independently** — if you control multiple creatures with Prowess, each triggers once per noncreature spell cast.

## Canonical Example

**Tiered + Prowess Trigger:**

You control a creature with Prowess (gets +1/+1 for each noncreature spell cast).

You cast Fire Magic in Fira mode, paying {2}{R}{R}.

Prowess triggers once: your creature gets +1/+1 until end of turn.

If you later cast Fire Magic again in Firaga mode, paying {2}{R}{R}{R}:
→ Prowess triggers again
→ Your creature gets another +1/+1

Total: your creature has +2/+2 from Prowess (from two separate spell casts).

**Example 2 — Multiple Prowess Creatures:**

You control TWO creatures with Prowess. You cast Fire Magic in Fire mode, paying {3}.

Prowess on the first creature triggers: +1/+1.
Prowess on the second creature triggers: +1/+1.

Both creatures get +1/+1 until end of turn.

If you cast another noncreature spell (Shock), both Prowess abilities trigger again:
→ Both creatures get another +1/+1
→ Total: +2/+2 on each creature from Prowess

## Commonly Confused With

- **P516 (Tiered)** — P516 covers Tiered cost mechanics; P544 applies to triggered ability counting with modal costs.
- **P071 (Prowess)** — P071 covers Prowess mechanics; P544 clarifies Tiered interaction with Prowess triggers.
- **P036 (Storm)** — P036 covers Storm copy mechanics; P544 distinguishes Tiered from copy-based mechanics.
