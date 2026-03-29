---
id: p077
name: Evolve — ETB Power/Toughness Check for Counter
category: triggered
cr_refs: [702.100a, 702.100b, 702.100c, 702.100d]
tags: [evolve, ETB, power, toughness, counter, comparison, triggered, noncreature-permanent]
created: 2026-03-28
examples_count: 2
---

# P077 — Evolve — ETB Power/Toughness Check for Counter

## Abstract
Evolve triggers whenever ANY creature you control enters the battlefield, if that creature's power is greater than the evolve creature's power AND/OR that creature's toughness is greater than the evolve creature's toughness. The "and/or" means either power OR toughness being greater is sufficient — both being greater still only places one counter. Noncreature permanents can't have greater power or toughness (they have none). The evolve trigger checks the condition at trigger time AND at resolution (intervening-if-like behavior implied by the trigger condition).

## The Definitive Rule

**CR 702.100a** (verbatim): *"Evolve is a triggered ability. 'Evolve' means 'Whenever a creature you control enters, if that creature's power is greater than this creature's power and/or that creature's toughness is greater than this creature's toughness, put a +1/+1 counter on this creature.'"*

**CR 702.100b** (verbatim): *"A creature 'evolves' when one or more +1/+1 counters are put on it as a result of its evolve ability resolving."*

**CR 702.100c** (verbatim): *"A creature can't have a greater power or toughness than a noncreature permanent."*

**CR 702.100d** (verbatim): *"If a creature has multiple instances of evolve, each triggers separately."*

## The Pattern

```
EVOLVE TRIGGER:
  Fires when: a creature you control enters the battlefield
  Condition: that creature's power > this creature's power
              AND/OR that creature's toughness > this creature's toughness

AND/OR MEANS:
  If entering creature has power 3/3 and evolve creature is 2/4:
    Power check: 3 > 2 → YES
    Toughness check: 3 > 4 → NO
  Result: condition met (power is greater) → trigger fires, place 1 counter
  One counter total (not one per "and" / one per "or")

NONCREATURE PERMANENTS:
  CR 702.100c: noncreature permanents don't have power/toughness
  Therefore: a noncreature permanent can never have greater power or toughness
  If a noncreature becomes a creature (animated land) after triggering:
    The comparison is still made when the trigger fires (when it entered as noncreature → no trigger)

SELF-EVOLVE:
  The evolve creature itself is entering → does it trigger own evolve?
  When the evolve creature enters: "whenever a creature enters" — that includes itself
  But the condition checks "if THAT creature's power > THIS creature's power"
  → "that creature" = entering creature = evolve creature itself
  → A creature's own power is NOT greater than its own power
  → Evolve doesn't trigger when the evolve creature itself enters

EVOLVE AFTER GETTING A COUNTER:
  When evolve puts a counter on the evolve creature: power/toughness increases
  Now the evolve creature is bigger → need a bigger creature to trigger again
  Evolve can chain: creature A enters (3/3), evolve triggers on 2/2 → 3/3
    Next creature B enters (4/4): 4/4 > 3/3 → evolve triggers again → 4/4

SIMULTANEOUS ETB:
  If multiple creatures enter at once (populate, mass ETB):
  Each is checked as a separate "whenever a creature enters" instance
  Multiple evolve triggers may fire (APNAP order)
```

## Definitive Conclusions

- **Evolve requires the entering creature to beat power OR toughness (or both).** One counter total.
- **Noncreature permanents can never trigger evolve.** They have no power or toughness.
- **The evolve creature itself entering does NOT trigger its own evolve.**
- **Multiple evolve instances trigger separately.**
- **Evolve chains:** after gaining a counter, need an even larger creature to trigger again.

## Canonical Example
**Cloudfin Raptor (Evolve, 0/1):**
You cast a 2/1 creature. Evolve triggers: entering creature's power (2) > Raptor's power (0) → condition met. Counter placed on Raptor: now 1/2. You cast a 2/2. Evolve triggers: power (2) > Raptor's power (1) → trigger fires. Counter: Raptor is 2/3. Cast another 2/2: power (2) is NOT greater than Raptor's power (2) → toughness? (2 > 3? No) → condition not met → no trigger.

**Example 2 — And/Or logic:**
Evolve creature is 3/3. A 2/5 creature enters. Power check: 2 > 3? No. Toughness check: 5 > 3? Yes → condition met → evolve triggers → place counter. The "and/or" means either dimension being larger is enough.

## Commonly Confused With
- **P076 (Mentor)** — Both involve power comparisons. Mentor triggers on attack and places counters on others; Evolve triggers on ETB and places counters on itself.
- **P006 (Intervening If Clause)** — Evolve has a condition baked into the trigger text. The condition is checked at trigger time (standard for "if" clause patterns).
