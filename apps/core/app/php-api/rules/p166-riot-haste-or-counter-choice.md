---
id: p166
name: Riot — Enter with +1/+1 Counter or Gain Haste
category: replacement
cr_refs: [702.136a, 702.136b]
tags: [riot, +1/+1, haste, ETB-replacement, choice, Gruul, Ravnica-Allegiance, Rhythm-of-Wild]
created: 2026-03-28
examples_count: 2
---

# P166 — Riot — Enter with +1/+1 Counter or Gain Haste

## Abstract
Riot is a static ability that presents a choice as a permanent enters: you may have it enter with an additional +1/+1 counter on it, OR it gains haste. If you don't choose the counter, it gains haste. This is a pure either/or: you can't have both (unless multiple riot instances or other effects). The counter is permanent growth; haste enables an immediate attack. Multiple instances of riot each trigger separately, allowing both — one instance can give a counter, another gives haste (so a creature with riot twice can get a counter AND haste).

## The Definitive Rules

**CR 702.136a** (verbatim): *"Riot is a static ability. 'Riot' means 'You may have this permanent enter with an additional +1/+1 counter on it. If you don't, it gains haste.'"*

**CR 702.136b** (verbatim): *"If a permanent has multiple instances of riot, each works separately."*

## The Pattern

```
RIOT:
  ETB replacement effect (or ETB-adjacent static):
    "You may" have it enter with +1/+1 counter
    "If you don't" → it gains haste
  One or the other: not both (with a single riot instance)

  RIOT CHOICE:
    Made as the creature enters the battlefield (ETB replacement window)
    Choose BEFORE the creature is on the battlefield
    Think: do I need to attack this turn? Take haste.
           Do I want long-term growth? Take counter.

  RIOT + HASTE USE CASES:
    Take haste: attack immediately → especially if opponent is at low life
    Take haste: use {T} abilities immediately (useful for creatures with tap abilities)
    Take haste: block-threatening scenarios where you need the creature this turn

  RIOT + COUNTER USE CASES:
    Take counter: permanent +1/+1 growth (stays forever)
    Take counter: synergy with Hardened Scales, Doubling Season → more counters
    Take counter: synergy with +1/+1 counter payoffs (evolve, Vorinclex, etc.)

  RIOT + MULTIPLE INSTANCES:
    Two riot instances on the same creature:
    First riot: may enter with counter (choose YES)
    Second riot: may enter with counter (choose YES for ANOTHER counter? or NO → haste)
    Result: take counter from first, take haste from second → gets BOTH a counter AND haste!
    Rhythm of the Wild gives creatures riot: now Gruul haste creatures have riot
    Combine with creatures that already have riot: double riot → counter AND haste

  RIOT + DOUBLING SEASON:
    If Doubling Season is in play: when a counter would be placed → twice as many
    Riot giving +1/+1 counter → Doubling Season → +2/+2 counter placement
    Wait: riot says "enters with an additional +1/+1 counter" — this is a replacement effect
    Doubling Season's replacement: "if one or more counters would be placed, place twice as many"
    "Enters with" → it's a replacement effect for entering → Doubling Season applies?
    Yes: Doubling Season applies to counters placed on permanents as they enter the battlefield
    Riot + Doubling Season = +2/+2 counter

RIOT + RHYTHM OF THE WILD:
  Rhythm of the Wild: "Creature spells you control can't be countered. Each creature you control has riot."
  All your creatures get riot for free: attack with haste OR grow with a counter
  Flexible strategy: every creature has both attack-now or grow-later option
```

## Definitive Conclusions

- **Riot gives +1/+1 counter OR haste** — you choose as the creature enters.
- **If you don't choose the counter, it gets haste** — not "if you choose the counter, it loses haste."
- **Multiple riot instances** each work separately — possible to get both with two instances.
- **Doubling Season doubles the riot counter** — permanent +2/+2 from a single riot.
- **Rhythm of the Wild** grants riot to all your creatures for flexible, powerful play.

## Canonical Example
**Gruul Spellbreaker (Riot, 3/3, Trample):**
Situation: opponent at 5 life, you have 3 unblockable damage from other creatures.
Choice: take haste → Gruul Spellbreaker attacks for 3 trample → opponent takes 3 → total 6 = dead.
OR: take counter → becomes 4/4 with trample → attack next turn for 4 trample.
Correct choice: haste for the win.

**Example 2 — Rhythm of the Wild + Riot:**
You control Rhythm of the Wild: all creatures have riot.
Cast Kraul Harpooner (already has riot). Now has TWO riot instances.
First riot: choose +1/+1 counter → enters with counter.
Second riot: choose not counter → gains haste.
Result: Kraul Harpooner enters as 3/2 (1/1 base + +1/+1 counter extra) with haste.
Attacks immediately AND grows permanently.

## Commonly Confused With
- **P111 (Haste)** — Haste is a static keyword. Riot is a choice mechanic that CAN give haste (or a counter).
- **P153 (Evolve)** — Evolve gets counters from other creatures entering. Riot gets a counter as the creature enters.
- **P142 (Outlast)** — Outlast adds counters at sorcery speed. Riot adds a counter at ETB time.
