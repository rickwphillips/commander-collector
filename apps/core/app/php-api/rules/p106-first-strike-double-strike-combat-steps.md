---
id: p106
name: First Strike and Double Strike — Two Combat Damage Steps
category: combat
cr_refs: [702.4a, 702.4b, 702.4c, 702.4d, 702.7a, 702.7b, 702.7c, 510.1, 510.2]
tags: [first-strike, double-strike, combat-damage, two-steps, SBA, mid-combat, deathtouch]
created: 2026-03-28
examples_count: 2
---

# P106 — First Strike and Double Strike — Two Combat Damage Steps

## Abstract
When any creature in combat has first strike or double strike, the combat damage step splits into TWO steps. In step 1, only creatures with first strike or double strike assign damage. In step 2, creatures with neither assign damage — plus creatures with double strike assign again. SBAs run between steps, so creatures destroyed in step 1 deal no damage in step 2. This timing creates the key power of first-strike deathtouch: destroy the blocker before it retaliates.

## The Definitive Rule

**CR 702.4b** (verbatim): *"If at least one attacking or blocking creature has first strike or double strike as the combat damage step begins, the only creatures that assign combat damage in that step are those with first strike or double strike. After that step, instead of proceeding to the end of combat step, the phase gets a second combat damage step. The only creatures that assign combat damage in that step are the remaining attackers and blockers that had neither first strike nor double strike as the first combat damage step began, as well as the remaining attackers and blockers that currently have double strike."*

**CR 702.4c** (verbatim): *"Removing double strike from a creature during the first combat damage step will stop it from assigning combat damage in the second combat damage step."*

**CR 702.7c** (verbatim): *"Giving first strike to a creature without it after combat damage has already been dealt in the first combat damage step won't preclude that creature from assigning combat damage in the second combat damage step."*

## The Pattern

```
TRIGGER CONDITION:
  At least one attacker or blocker has first strike or double strike?
    YES → two combat damage steps
    NO  → one combat damage step (normal)

STEP 1 (first combat damage step):
  Only creatures with first strike OR double strike deal damage
  Normal creatures (neither): deal NO damage in step 1

BETWEEN STEPS:
  SBAs are checked (704.5g, 704.5f, etc.)
  Creatures destroyed in step 1 are removed from combat
  Triggered abilities (e.g., lifelink) go on stack and resolve
  Players can take actions (respond, cast instants)

STEP 2 (second combat damage step):
  Creatures that currently have double strike deal damage AGAIN
  Creatures with neither first strike nor double strike deal damage
  Creatures with first strike ONLY: already dealt damage → DON'T deal damage again
  Creatures destroyed in step 1: no longer exist → deal no damage

DOUBLE STRIKE vs FIRST STRIKE:
  First strike: deals damage in step 1 only
  Double strike: deals damage in BOTH step 1 and step 2
  → A 2/2 double strike deals 2+2 = 4 total damage in a fight
  → A 2/2 first strike deals 2 total damage (step 1 only)

GAINING/LOSING ABILITIES MID-COMBAT:
  Gaining double strike AFTER step 1 was dealt: doesn't affect step 2 (702.4d says giving double strike after step 1 ALLOWS dealing in step 2 — but 702.7c covers first strike cases)
  Actually per 702.4d: giving double strike to a creature with first strike after it dealt in step 1 → it CAN deal again in step 2
  Removing double strike during step 1 → won't deal in step 2 (702.4c)
  Giving first strike AFTER step 1 was dealt → creature still deals damage in step 2 (702.7c)

FIRST STRIKE + DEATHTOUCH (powerful interaction):
  Step 1: deathtouch source deals damage to blocker
  SBA check: blocker is destroyed (704.5g) before step 2
  Step 2: blocker is gone → no damage dealt to the attacker
  Result: the deathtouch first-strike creature kills without being damaged

NO FIRST/DOUBLE STRIKE CREATURES:
  If no creature has first strike or double strike:
    → Only one combat damage step
    → All creatures deal damage simultaneously
```

## Definitive Conclusions

- **Two combat damage steps only happen when at least one combat creature has first strike or double strike.**
- **First strike only deals damage in step 1.** Double strike deals damage in step 1 AND step 2.
- **SBAs fire between the two steps.** Creatures dying in step 1 don't deal damage in step 2.
- **Gaining double strike after step 1 deals → CAN deal in step 2.** Giving first strike after step 1 deals → still deals in step 2.
- **Removing double strike during step 1 → won't deal in step 2.**

## Canonical Example
**2/2 First Strike vs 4/2:**
Step 1: First-strike 2/2 deals 2 to the 4/2. SBA: 4/2 has toughness 2, took 2 damage → destroyed.
Step 2: 4/2 is gone → deals no damage. 2/2 survives.

**Example 2 — Double Strike vs two blockers:**
4/4 double strike blocked by 2/2 and 3/3. Player assigns 2 to the 2/2 and 2 to the 3/3 in step 1.
SBA: 2/2 destroyed (took 2, toughness 2). 3/3 survives (took 2, toughness 3).
Step 2: double strike deals 4 again. Now only 3/3 is still blocking. Player assigns 4 to the 3/3 (has 2 damage marked + 4 more = 6 ≥ 3 toughness). 3/3 destroyed.

## Commonly Confused With
- **P105 (Deathtouch)** — Deathtouch + first strike is a signature combo: step 1 destroys, step 2 never retaliates.
- **P030 (Blocked Status)** — The creature remains blocked even if blockers are destroyed in step 1; trample still applies.
- **P001 (Threshold Damage Assignment)** — Covers how damage must be assigned among multiple blockers in either damage step.
