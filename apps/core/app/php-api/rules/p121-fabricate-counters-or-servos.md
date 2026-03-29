---
id: p121
name: Fabricate — ETB Counter or Servo Token Choice
category: triggered
cr_refs: [702.123a, 702.123b]
tags: [fabricate, +1/+1, servo, token, ETB, choice, artifact-creature, triggered]
created: 2026-03-28
examples_count: 2
---

# P121 — Fabricate — ETB Counter or Servo Token Choice

## Abstract
Fabricate is a triggered ETB ability that gives you a choice: put N +1/+1 counters on the fabricate creature itself, OR create N 1/1 colorless Servo artifact creature tokens. It's an either/or choice — you can't split between counters and tokens. Multiple instances of fabricate each trigger separately, giving you independent choices for each instance. The choice between a larger single body (counters) or multiple smaller bodies (tokens) is the core decision of fabricate.

## The Definitive Rule

**CR 702.123a** (verbatim): *"'Fabricate N' means 'When this permanent enters, you may put N +1/+1 counters on it. If you don't, create N 1/1 colorless Servo artifact creature tokens.'"*

**CR 702.123b** (verbatim): *"If a permanent has multiple instances of fabricate, each triggers separately."*

## The Pattern

```
FABRICATE CHOICE:
  When the permanent enters:
  Option A: Put N +1/+1 counters on the fabricate permanent itself
  Option B: Create N 1/1 colorless Servo artifact creature tokens
  Must choose one or the other — no splitting
  "You may" for the counters → if you "don't": you create tokens

FABRICATE + REPLACEMENT EFFECTS:
  If you choose counters:
    Doubling Season doubles the N counters → 2N counters on the creature
    Hardened Scales adds 1 → N+1 counters
  If you choose tokens:
    Doubling Season doubles the N tokens → 2N Servos
    Token doublers apply to the servo creation

MULTIPLE FABRICATE INSTANCES (702.123b):
  Two instances of fabricate 2:
    Each triggers separately
    Each trigger: independent choice (counters vs servos)
    Can choose counters for one, servos for the other
    Total possibilities: 4 counters, 4 servos, or 2 each (one from each trigger)

TORPOR ORB:
  Fabricate is a triggered ETB ability (not "as enters" static)
  Torpor Orb suppresses triggered abilities that trigger on ETB
  → Torpor Orb would suppress fabricate → no counters and no tokens

FABRICATE ON ARTIFACTS:
  Servos are artifact creatures → can fuel affinity, improvise, crew
  Counters make the fabricate creature a bigger threat
  Context determines which is better

FABRICATE vs RIOT:
  Riot: choose +1/+1 counter OR haste
  Fabricate: choose +1/+1 counters OR servo tokens
  Both are ETB choices — different options
```

## Definitive Conclusions

- **Fabricate is an either/or choice: N counters on itself OR N Servo tokens.**
- **No splitting between counters and tokens.**
- **Multiple fabricate instances trigger independently** — each is a separate choice.
- **Torpor Orb suppresses fabricate** (it's a triggered ETB ability).
- **Replacement effects apply** to either the counter placement or token creation.

## Canonical Example
**Weaponcraft Enthusiast (Fabricate 2, enters as 1/1):**
Option A: Put 2 +1/+1 counters on it → 3/3.
Option B: Create two 1/1 Servo tokens (Enthusiast stays 1/1).
With Doubling Season + Option B: create four 1/1 Servos.

**Example 2 — Fabricate 1 with multiple instances:**
A permanent has Fabricate 1 twice (from the card and a copy effect).
Each triggers → two independent choices:
  First trigger: 1 counter on it.
  Second trigger: 1 Servo token.
Result: +1/+1 counter on the permanent AND one Servo.

## Commonly Confused With
- **P075 (Riot)** — Riot: counter or haste. Fabricate: counter(s) or token(s). Both are ETB triggered choices.
- **P121 is sometimes confused with P118 (Bloodthirst)** — Bloodthirst is conditional (damage this turn). Fabricate always fires on ETB.
- **P023 (Torpor Orb / Trigger Suppression)** — Fabricate is triggered (suppressed by Torpor Orb); riot is a replacement effect (not suppressed by Torpor Orb).
