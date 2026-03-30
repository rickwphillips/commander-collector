---
id: p565
name: First Strike and Double Strike — Two Combat Damage Steps and Timing
category: combat
cr_refs: [702.7, 702.7a, 702.7b, 702.7c, 702.4, 702.4a, 702.4b, 702.4c, 702.4d, 510.4]
tags: [first-strike, double-strike, combat-damage, two-steps, timing, trample, priority, kill-before-damage, lifelink]
created: 2026-03-31
examples_count: 3
---

# P565 — First Strike and Double Strike — Two Combat Damage Steps and Timing

## Abstract

**First strike and double strike create a second combat damage step.** If ANY attacker or blocker has first strike or double strike, combat damage happens in two steps: first-strike damage (only first strike and double strike creatures), then regular damage (creatures without first/double strike PLUS double strike creatures again). This means first strikers can kill blockers before they deal damage, and double strikers deal damage TWICE (once in each step). Players receive priority between the two combat damage steps — spells and abilities can be cast/activated. A creature given first strike AFTER the first damage step still deals damage in the second step. A creature that LOSES double strike after the first step stops dealing damage in the second. First strike + double strike on the same creature = just double strike (redundant first strike).

## The Definitive Rules

**CR 702.7b (First Strike Creates Second Step):** *"If at least one attacking or blocking creature has first strike or double strike as the combat damage step begins, the only creatures that assign combat damage in that step are those with first strike or double strike. After that step, instead of proceeding to the end of combat step, the phase gets a second combat damage step."*

**CR 702.4b (Double Strike Both Steps):** *"If at least one attacking or blocking creature has first strike or double strike as the combat damage step begins, the only creatures that assign combat damage in that step are those with first strike or double strike. After that step, instead of proceeding to the end of combat step, the phase gets a second combat damage step. The only creatures that assign combat damage in that step are the remaining attackers and blockers that had neither first strike nor double strike as the first combat damage step began, as well as the remaining attackers and blockers that currently have double strike."*

**CR 702.4c (Removing Double Strike):** *"Removing double strike from a creature during the first combat damage step will stop it from assigning combat damage in the second combat damage step."*

**CR 702.4d (Gaining Double Strike):** *"Giving double strike to a creature with first strike after it has already dealt combat damage in the first combat damage step will allow the creature to assign combat damage in the second combat damage step."*

**CR 702.7c (Gaining/Losing First Strike Mid-Combat):** *"Giving first strike to a creature without it after combat damage has already been dealt in the first combat damage step won't preclude that creature from assigning combat damage in the second combat damage step. Removing first strike from a creature after it has already dealt combat damage in the first combat damage step won't allow it to also assign combat damage in the second combat damage step (unless the creature has double strike)."*

## The Pattern

```
WHEN TWO DAMAGE STEPS OCCUR:

  The combat damage step SPLITS into two steps if and only if
  at least one attacking or blocking creature has first strike
  or double strike when the combat damage step begins.

  If NO creature has first/double strike: one normal damage step.

FIRST COMBAT DAMAGE STEP:
  Who deals damage:
    - Creatures with FIRST STRIKE
    - Creatures with DOUBLE STRIKE
  Who does NOT deal damage:
    - Creatures with neither ability

  After this step:
    - SBAs are checked (creatures with lethal damage die)
    - Triggered abilities go on the stack
    - Players receive PRIORITY (can cast instants, activate abilities)
    - Dead creatures can't deal damage in the second step

SECOND COMBAT DAMAGE STEP:
  Who deals damage:
    - Creatures that had NEITHER first strike nor double strike
      when the first step BEGAN
    - Creatures that CURRENTLY have DOUBLE STRIKE
  Who does NOT deal damage:
    - Creatures that had first strike (only) at the start of step 1
      (they already dealt their damage)

FIRST STRIKE — KEY BEHAVIORS:

  First strike creatures deal damage BEFORE normal creatures:
    → If a first striker kills its blocker in step 1, the blocker
      is dead and deals no damage in step 2
    → This is the core tactical advantage of first strike

  Example: 3/3 first strike vs 2/2 normal
    Step 1: 3/3 deals 3 damage → 2/2 is destroyed (SBA)
    Step 2: 2/2 is dead → can't deal damage → 3/3 survives unharmed

  Without first strike: mutual trade (3 damage kills 2/2, 2 damage
  to 3/3, both survive if toughness allows)

DOUBLE STRIKE — KEY BEHAVIORS:

  Double strike creatures deal damage in BOTH steps:
    → Full power in step 1, full power again in step 2
    → Effectively deals double combat damage

  Example: 3/3 double strike vs 4/4 normal
    Step 1: 3/3 deals 3 to 4/4 (4/4 has 3 damage marked, survives)
    Step 2: 3/3 deals 3 more to 4/4 (6 total, 4/4 dies)
            4/4 deals 4 to 3/3 (3/3 dies)

  Double strike + trample:
    Step 1: Assign lethal to blocker, excess to player
    Step 2: If blocker is dead, ALL damage to player
    → Can deal massive trample damage across two steps

PRIORITY BETWEEN STEPS:

  Players get priority between the first and second damage steps.
  This allows:
    - Casting instants (Giant Growth, removal spells)
    - Activating abilities
    - Responding to triggers from the first step

  Tactical uses:
    - Pump a creature that survived step 1 to kill in step 2
    - Remove a first striker after it dealt damage (before step 2)
    - Give a creature first strike AFTER step 1 (doesn't help, see below)

GAINING/LOSING ABILITIES MID-COMBAT:

  Giving first strike AFTER step 1:
    → Does NOT prevent it from dealing damage in step 2 (702.7c)
    → It already missed step 1 and will still deal in step 2

  Removing first strike AFTER step 1:
    → Does NOT let it deal again in step 2 (702.7c)
    → Unless it also has double strike

  Giving double strike to a first striker AFTER step 1:
    → DOES let it deal damage in step 2 too (702.4d)
    → Effectively: dealt in step 1 (first strike), deals again in step 2 (double strike)

  Removing double strike DURING step 1:
    → Prevents dealing in step 2 (702.4c)
    → Only dealt once (in step 1)

FIRST STRIKE + DOUBLE STRIKE:

  If a creature has both first strike AND double strike:
    → Double strike subsumes first strike
    → It deals damage in both steps (same as double strike alone)
    → First strike is redundant

LIFELINK + DOUBLE STRIKE:

  Double strike + lifelink = gain life TWICE (once per damage step)
  Example: 4/4 double strike lifelink unblocked
    → Step 1: 4 damage to player, gain 4 life
    → Step 2: 4 damage to player, gain 4 life
    → Total: 8 damage dealt, 8 life gained

DOUBLE STRIKE + COMBAT DAMAGE TRIGGERS:

  Triggers that fire on combat damage fire TWICE for double strike:
    → "Whenever this creature deals combat damage" → triggers in step 1 AND step 2
    → "Whenever this creature deals combat damage to a player" → same
    → Each trigger is a separate event
```

## Definitive Conclusions

- **First strike kills before normal damage** — blockers die before dealing their damage.
- **Double strike deals damage twice** — once in each combat damage step.
- **Priority exists between steps** — players can cast spells and activate abilities.
- **Gaining first strike after step 1 doesn't help** — the creature still deals in step 2.
- **Removing double strike after step 1 prevents step 2 damage** — only dealt once.
- **Double strike + trample = devastating** — excess from step 1 goes through, then full damage in step 2 if blocker is dead.
- **Lifelink triggers twice with double strike** — life gained in each damage step.

## Canonical Example

**First Strike Kills Blocker:**

Your 3/3 with first strike attacks. Opponent blocks with a 2/3.

First combat damage step: Your 3/3 deals 3 damage to the 2/3. The 2/3 has toughness 3, so 3 damage is lethal. SBA: 2/3 is destroyed.

Second combat damage step: The 2/3 is dead. It can't deal damage. Your 3/3 takes 0 damage and survives unharmed.

Without first strike: both would deal damage simultaneously. Your 3/3 takes 2 damage (survives), their 2/3 takes 3 damage (dies).

**Example 2 — Double Strike + Trample:**

Your 4/4 with double strike and trample attacks. Opponent blocks with a 3/3.

Step 1: Assign 3 to blocker (lethal), 1 to player (trample excess). Blocker has 3 damage marked → destroyed by SBA. Player takes 1.

Step 2: Blocker is dead. No blockers remain. Your 4/4 deals 4 damage to defending player (702.19d — blocked but no blockers). Player takes 4.

Total: Player takes 5 damage (1 + 4). Blocker is dead.

**Example 3 — Giving Double Strike After First Strike Damage:**

Your 2/2 with first strike attacks. Opponent blocks with a 4/4.

Step 1: Your 2/2 deals 2 damage to the 4/4 (4/4 survives with 2 damage marked).

Between steps: You cast a spell giving your 2/2 double strike (702.4d applies).

Step 2: Your 2/2 NOW has double strike → deals 2 more damage to the 4/4 (total 4 damage = lethal). The 4/4 also deals 4 damage to your 2/2 (your 2/2 dies). But both creatures traded, rather than your 2/2 being unable to kill the 4/4.

## Commonly Confused With

- **P564 (Trample)** — P564 covers trample excess damage; P565 covers how first/double strike creates two damage steps, enabling trample across both.
- **P001 (Excess Damage Routing)** — P001 covers general damage assignment; P565 covers the two-step split specific to first/double strike.
- **P007 (Response Window)** — P007 covers when players can respond; P565 notes the priority window between combat damage steps.
