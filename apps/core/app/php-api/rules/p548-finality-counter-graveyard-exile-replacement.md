---
id: p548
name: Finality Counter — Graveyard-Exile Replacement Effect
category: replacement
cr_refs: [614.1, 614.2, 704.5f]
tags: [finality, counter, replacement-effect, graveyard, exile, zone-change, duskmourn-tmnt]
created: 2026-03-30
examples_count: 2
---

# P548 — Finality Counter — Graveyard-Exile Replacement Effect

## Abstract

**Finality is a counter-based replacement effect that exiles permanents heading to the graveyard instead.** When a permanent you control with a Finality counter would be put into a graveyard, that permanent is exiled instead. Finality only prevents graveyard-destination zone changes; it does NOT prevent other zone changes (hand, library, exile via other effects, etc.). If a permanent with a Finality counter loses all its abilities (via a global ability-removal effect), the Finality counter persists, but the counter does not function (since the ability granting it is gone). Multiple Finality counters on the same permanent are redundant — only one Finality counter is needed to prevent graveyard destination once. This pattern clarifies the scope and limitation of Finality as a replacement effect.

## The Definitive Rules

**CR 614.1 (Replacement Effects):** *"Replacement effects watch for a particular event and completely or partially replace it with a different event."*

**CR 614.2 (Must Exist Before Event):** *"A replacement effect must exist before the event to be replaced, or else it can't replace the event."*

**CR 704.5f (Destruction Zone Change):** *"If a creature has toughness 0 or less, it's put into its owner's graveyard. Regeneration can't replace this event."*

**Official Ruling (Finality Counter — TDM/TMNT):** *"A Finality counter causes a permanent to be exiled instead of being put into a graveyard. This only applies to permanents heading to the graveyard; other zone changes are unaffected."*

**Official Ruling (Finality + Ability Loss):** *"If a permanent with a Finality counter loses all its abilities, the counter remains but can no longer function (the ability granting its effect is gone)."*

## The Pattern

```
FINALITY COUNTER DEFINITION:

  Finality: A counter-based replacement effect.
  "When a permanent you control gets a Finality counter: If that permanent
   would be put into a graveyard from the battlefield, it's exiled instead."

  Mechanics:
    - Counter: physical indicator on the permanent
    - Replacement: prevents graveyard destination
    - Alternative destination: exile zone
    - Applies once per zone change event (multiple Finality counters are redundant)

FINALITY SCOPE — GRAVEYARD ONLY:

  Finality prevents zone changes to GRAVEYARD ONLY.

  Examples of prevented events:
    - Creature dies (toughness ≤ 0) → would go to graveyard; exiled instead
    - Creature is destroyed (SBA) → exiled instead
    - Permanent is sacrificed → if it would go to graveyard, exiled instead
    - Spell is countered → if a permanent spell, exiled instead

  Examples NOT prevented by Finality:
    - Hand: a permanent returned to hand still goes to hand (not graveyard)
    - Library: a permanent put into library is not affected by Finality
    - Exile: a permanent exiled by other effects is exiled (Finality doesn't apply)
    - Stack: a spell on the stack isn't affected (permanents are on battlefield)

FINALITY + MULTIPLE COUNTERS:

  If a permanent has TWO Finality counters:
    - Both counters are present
    - Only one Finality effect activates (replacement prevents event)
    - The other counter is redundant
    - Result: permanent is exiled instead of going to graveyard (once)

  Multiple Finality counters do NOT:
    - Stack (exile multiple times)
    - Create multiple triggers
    - Have cumulative effect

FINALITY + ABILITY LOSS:

  If a permanent with a Finality counter loses all abilities:
    - Counter remains on the permanent
    - The ability granting Finality is gone
    - Finality effect can no longer function (no ability to provide it)
    - Next zone change to graveyard happens normally (not exiled)

  Example: "All creatures lose all abilities."
    - Creature with Finality counter has its Finality-granting ability removed
    - Counter still there, but no effect
    - Creature dying now goes to graveyard (not exiled)

  Note: Removing the counter directly (via effect like "remove all counters")
    also disables Finality in the same way.

FINALITY + STATE-BASED ACTIONS:

  State-based actions (SBA) that would put a permanent into a graveyard:
    - Creature with toughness ≤ 0 (destroyed by SBA)
    - Token in non-battlefield zone
    - Other SBA zone changes

  Finality applies to SBA zone changes as well as spell effects.

FINALITY + REPLACEMENT EFFECTS:

  If multiple replacements apply to the same zone change:
    - Finality is one replacement
    - Other zone-change replacements might apply
    - Player controlling the permanent chooses order

  Example: Finality + "permanents you control can't be destroyed"
    - Destruction is prevented (can't-destroy effect)
    - Finality never applies (permanent isn't destroyed)
    - Permanent remains on battlefield

```

## Definitive Conclusions

- **Finality prevents graveyard destination only** — other zone changes are unaffected.
- **Multiple Finality counters are redundant** — only one is needed to exile instead of going to graveyard.
- **Ability loss removes Finality function** — the counter persists but can no longer function without its ability.
- **Replacement applies to all graveyard-bound events** — SBA destruction, sacrifices, spell countering, etc.

## Canonical Example

**Finality Counter on Creature:**

A creature you control gets a Finality counter. The creature has 5 power and 5 toughness.

An opponent casts Wrath of God: "Destroy all creatures."

The creature is destroyed (SBA). Finality replaces the graveyard destination: the creature is exiled instead.

**Example 2 — Finality + Ability Loss:**

Same creature with a Finality counter. An opponent casts Humility: "All creatures lose all abilities."

The creature loses its Finality-granting ability. The Finality counter remains, but can no longer function.

Later, the creature takes lethal damage. The creature is destroyed and goes to the graveyard (Finality no longer applies, since the ability is gone).

## Commonly Confused With

- **P025 (Counter Placement)** — P025 covers counter mechanics; P548 applies to Finality's specific replacement effect.
- **P002 (Replacement vs. Trigger)** — P002 covers replacement identification; P548 clarifies Finality's scope.
- **P704.5f (Destruction)** — P704.5f covers destruction SBA; P548 applies Finality replacement to those events.
