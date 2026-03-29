---
id: p153
name: Evolve — Counter When a Bigger Creature Enters
category: triggered
cr_refs: [702.100a, 702.100b, 702.100c, 702.100d]
tags: [evolve, +1/+1, ETB, power, toughness, comparison, counter, ravnica, Gyre-Sage, Cloudfin-Raptor]
created: 2026-03-28
examples_count: 2
---

# P153 — Evolve — Counter When a Bigger Creature Enters

## Abstract
Evolve triggers whenever another creature you control enters the battlefield, if that creature's power is greater than the evolving creature's power OR its toughness is greater than the evolving creature's toughness. If either condition is met, put a +1/+1 counter on the evolving creature. This is an OR condition — surpass in power OR toughness, not necessarily both. The evolving creature grows to match or keep up with the largest creatures entering play, making it stronger over time. Multiple evolve instances on one creature trigger separately.

## The Definitive Rules

**CR 702.100a** (verbatim): *"Evolve is a triggered ability. 'Evolve' means 'Whenever a creature you control enters, if that creature's power is greater than this creature's power and/or that creature's toughness is greater than this creature's toughness, put a +1/+1 counter on this creature.'"*

**CR 702.100b** (verbatim): *"A creature 'evolves' when one or more +1/+1 counters are put on it as a result of its evolve ability resolving."*

**CR 702.100c** (verbatim): *"A creature can't have a greater power or toughness than a noncreature permanent."*

## The Pattern

```
EVOLVE:
  Triggered ability: when another creature you control ENTERS
  Condition: entering creature's power > this creature's power
             AND/OR entering creature's toughness > this creature's toughness
  Effect: put a +1/+1 counter on THIS creature (the evolving one)

  OR CONDITION:
    Either dimension (power OR toughness) being greater triggers evolve
    Evolving 2/2 evolves if a 3/1 enters (power greater, toughness not)
    Evolving 2/2 evolves if a 1/4 enters (toughness greater, power not)
    Evolving 2/2 does NOT evolve if a 2/2 enters (neither greater)
    Evolving 2/2 does NOT evolve if a 1/1 enters (neither greater)

  TIMING OF COMPARISON:
    The condition is checked at trigger time (when the creature enters)
    And also checked at resolution (intervening-if clause applies via 603.4)
    If the entering creature has P/T modified by ETB replacements: those apply at check time

  EVOLVE + COUNTER GROWTH:
    As evolving creature gets counters → its own P/T increases
    Future entering creatures may no longer be bigger → no more evolves
    But: if creature reaches 4/4 and you play a 5/5 → still evolves

  EVOLVE + TOKENS:
    Tokens entering trigger evolve
    Populate, fabricate tokens: can trigger evolve if they're bigger in either dimension

  EVOLVE + ITSELF ENTERING:
    "Whenever a creature you control ENTERS" — does this include the evolving creature itself?
    No: "another creature" → the trigger is for OTHER creatures entering
    Wait: the CR says "whenever a creature you control enters" — let me recheck
    CR 702.100a: "Whenever a creature you control enters" — not "another creature"
    Hmm, but then the evolving creature would trigger itself entering
    Actually: the evolving creature IS entering, but the trigger is a simultaneous effect
    When the creature with evolve enters, it's already on battlefield when triggers are checked
    SBA check: when multiple permanents enter simultaneously, evolve can trigger
    Wait: "Whenever a creature you control ENTERS" — if the evolving creature itself has just entered, would the trigger fire for itself? No — the trigger would look for the trigger to have already fired (the ability generates when a creature enters, but the creature itself entering doesn't fire its own ETB-level evolve since the ability wasn't there before it entered)
    Actually: CR says "whenever a creature you control enters" — the ability fires even for other creatures that enter simultaneously (in a group ETB)
    The evolving creature does NOT trigger itself (it wasn't there to see its own entry)

  EVOLVE + MULTIPLE INSTANCES:
    Multiple evolve instances trigger separately (CR 702.100d)
    A creature with evolve twice: get 2 counters when something bigger enters

  EVOLVE + SIZE COMPARISON:
    After counter placement: check if evolving creature's size changed → may trigger other evolves
    E.g., two creatures each with evolve enter simultaneously — they see each other

SPECIFIC CARDS:
  Cloudfin Raptor (1/2, evolve): flies; grows whenever a bigger flyer or ground creature enters
  Experiment One (1/1, evolve 2x): two evolve instances → gets 2 counters per qualifying entry
  Gyre Sage (1/2, evolve): tapping for mana based on +1/+1 counters
```

## Definitive Conclusions

- **Evolve checks power OR toughness** — either dimension being greater triggers the counter.
- **Comparison is intervening-if** — checked at trigger and at resolution.
- **The evolving creature gains +1/+1** — making future evolves potentially harder to trigger.
- **Multiple evolve instances trigger separately** — Experiment One evolves twice per qualifying entry.
- **Tokens and simultaneous entries** can trigger evolve.

## Canonical Example
**Cloudfin Raptor (1/2, Evolve):**
You control Cloudfin Raptor. Cast Experiment One (1/1). Its power (1) is not greater, toughness (1) is less → no evolve.
Cast Master Biomancer (2/4). Power 2 > 1 (Raptor's power) → evolve triggers → Raptor gets +1/+1 counter → becomes 2/3.
Cast Prime Speaker Zegana (2/6). Power 2 = Raptor's 2 (not greater). Toughness 6 > 3 → evolve triggers → Raptor becomes 3/4.

**Example 2 — Experiment One (1/1, Evolve, Evolve):**
Two evolve instances.
Cast a 2/2 creature: it's bigger in power (2 > 1) → BOTH evolve instances trigger → Experiment One gets 2 counters → becomes 3/3.
Also has "Remove two +1/+1 counters from Experiment One: Regenerate it."

## Commonly Confused With
- **P077 (Mentor)** — Mentor gives counters to other attackers when attacking alongside them. Evolve gives counters to itself when bigger creatures enter.
- **P076 (Modular)** — Modular transfers counters on death. Evolve accumulates counters from ETBs.
- **P142 (Dethrone)** — Dethrone gives a counter when attacking the highest-life player. Evolve grows passively from bigger creatures entering.
