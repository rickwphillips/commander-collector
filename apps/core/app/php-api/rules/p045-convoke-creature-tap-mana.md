---
id: p045
name: Convoke — Tapping Creatures as Mana, Color Matching, and Sickness
category: costs
cr_refs: [702.51a, 702.51b, 702.51c]
tags: [convoke, tap, mana-substitute, colored-mana, generic-mana, summoning-sickness, colorless, total-cost]
created: 2026-03-28
examples_count: 2
---

# P045 — Convoke — Tapping Creatures as Mana, Color Matching, and Sickness

## Abstract
Convoke allows tapping creatures to pay for a spell's total cost — specifically, a colored creature pays for one colored mana of that color, and any creature pays for one generic mana. Crucially, summoning sickness doesn't prevent a creature from being tapped for convoke — summoning sickness prevents tapping TO ATTACK or using {T} abilities, but convoke is paying a cost during casting, not activating a {T} ability. Also: convoke applies to the total cost, which means cost reductions apply first, potentially leaving less to convoke for.

## The Definitive Rule

**CR 702.51a** (verbatim): *"Convoke means 'For each colored mana in this spell's total cost, you may tap an untapped creature of that color you control rather than pay that mana. For each generic mana in this spell's total cost, you may tap an untapped creature you control rather than pay that mana.'"*

**CR 702.51b**: Convoke isn't an additional or alternative cost — it applies after the total cost is determined.

**CR 702.51b example**: Heartless Summoning (-{2} cost) + Siege Wurm ({5}{G}{G}) → total cost {3}{G}{G}. Can tap up to 2 green creatures + 3 other creatures to cover {3}{G}{G}.

## The Pattern

```
COLORED MANA:
  Each colored mana in the total cost → tap a creature of THAT color
  {G} in cost → tap a green creature (or green/X multicolor creature)
  {U} in cost → tap a blue creature
  Multicolor creatures: can tap for any ONE of their colors per tap

GENERIC MANA:
  Any untapped creature you control → pays for 1 generic mana

SUMMONING SICKNESS:
  Does NOT prevent being tapped for convoke
  Summoning sickness only prevents: declaring as attacker, activating {T} abilities
  Tapping for convoke is part of paying a casting cost, not activating an ability
  → A creature that entered this turn CAN convoke

APPLIES TO TOTAL COST:
  Convoke applies after total cost is determined (after all cost reductions)
  Cost reduction of {2} on a {5}{G}{G} spell → total cost is {3}{G}{G}
  You can tap creatures to cover part or all of {3}{G}{G}
  Not: first determine convoke, then apply reductions

WHAT CONVOKE CAN'T DO:
  Can't tap a tapped creature (must be untapped)
  Can't use a creature to pay for more than 1 mana
  Can't tap creatures controlled by another player
  Can't use tokens that are tapped (must be untapped)
  Colorless creatures: can only pay for generic mana, not colored

HOW MUCH CAN CONVOKE COVER?
  Up to the entire mana cost (can cast a spell for 0 mana if enough creatures)
  You choose how many creatures to tap after seeing the total cost
```

## Definitive Conclusions

- **Summoning sickness doesn't block convoke tapping.** New creatures can convoke the turn they enter.
- **Colored mana requires a creature of that specific color.** Generic mana accepts any creature.
- **Cost reductions apply BEFORE convoke is used.** Convoke covers whatever total cost remains after reductions.
- **Multicolor creatures pay for any one of their colors per tap.**
- **Colorless creatures can only pay for generic mana.**

## Canonical Example
**Chord of Calling (Convoke, {X}{G}{G}{G}):**
You want to find a 3-CMC creature (X=3). Total cost: {3}{G}{G}{G}. You have 6 creatures (all green). Tap 3 green creatures for the {G}{G}{G} colored mana. Tap 3 more creatures for {3} generic. Total: 0 mana paid from pool, 6 creatures tapped. Chord resolves, searches for creature with CMC ≤ 3.

**Example 2 — Creature just entered:**
Your Elvish Mystic entered this turn. You have summoning sickness. You still can't attack with it. But when you cast Venerated Loxodon (convoke), you CAN tap the Mystic to convoke — summoning sickness doesn't block this.

## Commonly Confused With
- **P025 (Counter Placement — Cost vs. Effect)** — Convoke is a cost mechanism. Creatures tapped for convoke are paying a cost.
- **P037 (Infect/Wither)** — Unrelated; convoke tapping doesn't deal damage or affect counters.
