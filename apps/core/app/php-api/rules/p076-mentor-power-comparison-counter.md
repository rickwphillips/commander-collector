---
id: p076
name: Mentor — Attack-Triggered Power-Check Counter
category: triggered
cr_refs: [702.134a, 702.134b, 702.134c]
tags: [mentor, triggered, attack, power, counter, less-than, intervening-if, P006]
created: 2026-03-28
examples_count: 2
---

# P076 — Mentor — Attack-Triggered Power-Check Counter

## Abstract
Mentor triggers whenever the creature with mentor attacks. It puts a +1/+1 counter on a target attacking creature with power STRICTLY LESS THAN the mentor creature's power. The power comparison is checked at targeting (when the trigger resolves), not at trigger time. If the target's power equals or exceeds the mentor's power at resolution (due to pump effects), the counter is not placed (target is no longer legal). Multiple mentor instances each trigger separately.

## The Definitive Rule

**CR 702.134a** (verbatim): *"Mentor is a triggered ability. 'Mentor' means 'Whenever this creature attacks, put a +1/+1 counter on target attacking creature with power less than this creature's power.'"*

**CR 702.134b** (verbatim): *"If a creature has multiple instances of mentor, each triggers separately."*

**CR 702.134c** (verbatim): *"An ability that triggers whenever a creature mentors another creature triggers whenever a mentor ability whose source is the first creature and whose target is the second creature resolves."*

## The Pattern

```
MENTOR TRIGGER:
  Fires when: this creature attacks
  Effect: put +1/+1 counter on target attacking creature with power < this creature's power

TARGET LEGALITY CHECK:
  The target must have power LESS THAN the mentor creature's power
  This is checked at both TARGETING time AND at RESOLUTION
  If the target is no longer "attacking" or no longer has power < mentor's power at resolution:
    The ability fizzles (illegal target → counter is not placed)

POWER COMPARISON TIMING:
  The power comparison happens when you CHOOSE the target (on resolution, or announcement)
  Actually: the power comparison is part of target legality
  When does target legality get checked?
    1. At announcement (choosing targets): target must meet all legal target requirements
    2. At resolution: target is checked again; if illegal → spell fizzles
  For mentor: "target attacking creature with power less than this creature's power"
  → At announcement: target must be attacking and have power < mentor's power
  → At resolution: target must still be attacking and have power < mentor's power
  → If target was pumped (e.g., by Giant Growth) to equal or exceed mentor's power:
     At resolution: target no longer has "power less than" → target is illegal → fizzle

MENTOR CAN TARGET ITSELF?
  "Target attacking creature" — the mentor creature IS attacking
  Can it target itself? The trigger says "target attacking creature with power less than this creature's power"
  A creature's power is not less than itself → can't target itself
  (A creature's power is equal to its own power, not less)

MULTIPLE MENTORS ATTACKING:
  If you attack with a 4/4 mentor and a 3/3 mentor:
  4/4 mentor triggers: target attacking creature with power < 4
    Can target the 3/3 mentor (power 3 < 4) — places counter on 3/3 → now 4/4
  3/3 mentor triggers: target attacking creature with power < 3
    After 4/4 mentor's trigger resolves and 3/3 became 4/4:
    At resolution of 3/3's mentor trigger: need a target with power < 3 (or still < 3/3)
    If 3/3 is now 4/4 (from other mentor): its own power comparison is 4 now
    This can get complex with timing — check power at resolution

MENTOR TRIGGER ON ALREADY-MENTORED CREATURE:
  A creature can be mentored multiple times
  Each +1/+1 counter adds to its power
  But after receiving a counter, its power might equal or exceed the mentor's power
  → Subsequent mentor triggers targeting it might fail
```

## Definitive Conclusions

- **Mentor checks power at BOTH targeting time and resolution.** If the target's power changes to equal or exceed mentor's power, the trigger fizzles.
- **Cannot target itself.** A creature's power is not less than its own power.
- **Multiple mentor instances trigger separately.** Two mentors on same creature = two triggers.
- **Only attacking creatures can be targeted.** If the target is removed from combat before resolution, the trigger fizzles.

## Canonical Example
**Boros Challenger (Mentor, 2/3):**
Boros Challenger attacks alongside a 1/1 Soldier token. Mentor triggers: target the 1/1 Soldier (power 1 < Challenger's power 2). Trigger resolves: Soldier now has power 2. Next turn: Challenger and Soldier both attack. Mentor triggers: need a target with power < 2. Soldier is now 2/2 — power NOT less than 2. No legal mentor target unless there's another creature with power < 2.

**Example 2 — Giant Growth in response:**
Mentor triggers targeting a 1/1. In response, opponent (or you) casts Giant Growth on that 1/1 (now 4/4). At resolution: target is 4/4, Challenger is 2/3 → target's power (4) is not less than Challenger's power (2) → illegal target → trigger fizzles.

## Commonly Confused With
- **P006 (Intervening If Clause)** — Mentor doesn't have an explicit "if" clause, but power-less-than is a target restriction that's checked twice (at announcement and resolution). Similar behavior to P006 double-check.
- **P076 and P070 (Backup)** — Both grant counters to other creatures, but Backup is a triggered ETB; Mentor triggers on attack and requires a power check.
