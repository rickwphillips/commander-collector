---
id: p499
name: Power-Diversity Threshold Evaluation — Unique Values and Counting
category: continuous
cr_refs: [109.2, 613.5, 117.5]
tags: [power, diversity, unique-values, count, threshold, evaluation]
created: 2026-03-30
examples_count: 2
---

# P499 — Power-Diversity Threshold Evaluation — Unique Values and Counting

## Abstract

When an ability requires **"different powers"** or **"powers of X different values"** (e.g., "creatures with different power"), the count is determined by evaluating the **unique power values** of the specified creatures **at the time the condition is checked**. A creature with 4 power and another with 4 power do **not** count as "different powers" (same value). A creature with 4 power, 3 power, and 1 power count as **three different powers** (three unique values). The check happens at **resolution time** (or trigger time, depending on the ability), and P/T changes mid-evaluation affect the count immediately.

## The Definitive Rules

**CR 109.2 (Characteristics):** *"An object's characteristics are its current values, including power and toughness, determined by printed values and continuous effects."*

**CR 613.5 (Continuous Effects Application):** *"Continuous effects are calculated immediately as game state changes."*

**CR 117.5 (Priority and SBA):** *"Before a player gets priority, all state-based actions are performed, then triggered abilities placed on the stack, then that player receives priority."*

**Official Ruling (Diversity Checks — 2020):** *"'Different powers' means unique power values. Creatures with the same power (like two 2/2s) don't count as having different powers."*

## The Pattern

```
POWER DIVERSITY COUNTING:

  Creatures on battlefield: 4/4, 3/3, 1/1
  Powers: 4, 3, 1 (three different values)
  Count: 3 creatures with different powers

  Creatures on battlefield: 4/4, 4/5, 3/2
  Powers: 4, 4, 3 (two unique values: 4 and 3)
  Count: NOT 3 different powers (two 4s are not different from each other)

RESOLUTION-TIME EVALUATION:

  Ability: "This spell deals damage equal to the number of creatures with different
    powers you control."

  At resolution:
    Creatures: 2/2, 3/3, 2/4 (powers: 2, 3, 2)
    Unique values: 2 and 3 (two different powers)
    Damage: 2

  If a continuous effect changes a creature's P/T at resolution:
    Creatures: 2/2, 3/3, 4/4 (was 2/4, now 4/4 due to pump spell)
    Unique values: 2, 3, 4 (three different powers)
    Damage: 3 (recalculated after the effect applies)

TRIGGER-TIME EVALUATION:

  Ability: "Whenever you cast a spell, if you control creatures with different powers,
    [effect]."

  When the spell is cast:
    Check creatures' powers at that moment
    If powers are diverse: trigger condition is true
    If powers are not diverse: trigger condition is false
    Trigger goes on stack (or doesn't) based on the check

MULTIPLE CHECKS:

  Some abilities check the condition multiple times:
    1. At trigger time (intervening 'if' clause)
    2. At resolution time (second check for intervening 'if')

  If powers change between checks:
    First check: condition true → ability goes on stack
    Second check: condition false → ability is removed from stack (no effect)

ZERO AS A POWER VALUE:

  Creature with 0 power is a distinct value (different from 1, 2, etc.)
  Creatures: 0/2, 1/3, 2/2
  Powers: 0, 1, 2 (three different values)

NEGATIVE POWER:

  Creature with -1 power (from continuous effect) is a distinct value
  Creatures: -1/2, 0/3, 1/4
  Powers: -1, 0, 1 (three different values)

```

## Definitive Conclusions

- **"Different powers" counts unique values** — creatures with 4 power and 4 power are not different.
- **Count is evaluated at check time** — resolution time for most abilities; trigger time for triggered abilities with intervening 'if' clauses.
- **Changes mid-evaluation affect the count immediately** — if P/T changes during ability resolution, the power count is recalculated.
- **Zero and negative powers count as distinct values** — a creature with 0 power and another with 1 power have different powers.

## Canonical Example

**Spell Dealing Damage Based on Power Diversity:**

You control creatures: 3/3, 3/4, 4/2. Powers: 3, 3, 4. Unique values: 3, 4.

You cast a spell: "This spell deals damage equal to the number of creatures with different powers you control."

Count at resolution: 3, 3, 4 → unique values are 3 and 4 → 2 different powers. Damage dealt: 2.

**Example 2 — Continuous Effect Changing the Count:**

You control creatures: 2/2, 4/4. Powers: 2, 4 (two different values).

You cast a pump spell: "Target creature gets +2/+2 until end of turn." Targeting the 2/2.

At resolution: 2/2 becomes 4/4. Creatures are now 4/4, 4/4. Powers: 4, 4 (one unique value).

If an ability triggers based on "different powers," the count changes from 2 to 1 (only one unique power value).

## Commonly Confused With

- **P005 (Simultaneous Events)** — P005 covers simultaneous events; P499 clarifies unique-value counting for specific thresholds.
- **P006 (Triggered Ability Double-Trigger)** — P006 covers ability firing; P499 clarifies how the condition itself is determined (unique values).
