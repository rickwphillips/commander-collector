---
id: p054
name: Proliferate — Choosing Targets and Counter Types
category: stack
cr_refs: [701.34a, 701.34b]
tags: [proliferate, counters, poison, planeswalker, loyalty, choice, all-counter-types, 2HG]
created: 2026-03-28
examples_count: 2
---

# P054 — Proliferate — Choosing Targets and Counter Types

## Abstract
Proliferate lets you choose any number of permanents and/or players that already have a counter, then give each chosen one an additional counter of EACH kind that permanent/player already has. The key restriction: you can only proliferate an object that already has at least one counter — you can't use proliferate to add a new counter type. When you choose a permanent with multiple counter types, it gets one additional counter of each kind. The choice of which objects to proliferate is made at resolution (you may choose none).

## The Definitive Rule

**CR 701.34a** (verbatim): *"To proliferate means to choose any number of permanents and/or players that have a counter, then give each one additional counter of each kind that permanent or player already has."*

**CR 701.34b** (verbatim): *"In a Two-Headed Giant game, poison counters are shared by the team. If more than one player on a team is chosen this way, only one of those players can be given an additional poison counter. The player who proliferates chooses which player that is."*

## The Pattern

```
PROLIFERATE SEQUENCE:
  1. Identify all permanents and players that have at least one counter
  2. Choose any number of those permanents/players (may choose zero)
  3. Each chosen permanent/player gets one additional counter of EACH kind they already have

WHAT CAN BE PROLIFERATED?
  Any permanent with any counter: +1/+1, -1/-1, loyalty, charge, poison, etc.
  Players with counters: poison counters, energy counters, experience counters
  Planeswalkers: loyalty counters (proliferate adds one more loyalty counter)
  CANNOT: add a new counter type to something that doesn't already have that type

MULTIPLE COUNTER TYPES:
  A creature with both +1/+1 and -1/-1 counters: gets one of each
    (Note: SBA will immediately remove matching pairs: CR 704.5q)
  A planeswalker with 3 loyalty counters: gets one more → 4 loyalty
  A player with 3 poison counters: gets one more → 4 poison

YOU CHOOSE (YOU, NOT OPPONENTS):
  The player who proliferates makes all choices
  You may choose to proliferate opponents' permanents (their planeswalkers, creatures)
  You may choose to proliferate yourself, opponents, or nothing
  You're not required to choose anything

PROLIFERATE + INFECT/WITHER INTERACTION:
  Proliferate doesn't deal damage — it adds counters directly
  Therefore: protection, shroud, hexproof don't stop proliferate
    (Those prevent targeting; proliferate doesn't target)
  Regeneration doesn't apply (no destruction)
  The counter is just added — can proliferate an untargetable permanent

PROLIFERATE + DOUBLE COUNTERS:
  Doubling Season (counters placed on permanents you control are doubled):
    Proliferate adds counters to permanents YOU control → Doubling Season doubles it
    So proliferating your creature with 1 counter → adds 2 counters (Doubling Season applies)
    Proliferating opponent's permanent → Doubling Season doesn't apply (not yours)

2HG POISON NOTE:
  Poison counters are shared in 2HG
  Both players on a team are separate "players" for proliferate choices
  If you choose both: only ONE gets the additional poison counter (CR 701.34b)
```

## Definitive Conclusions

- **Proliferate only adds counters to things that already have that counter type.** Can't add a new counter type.
- **You choose which permanents/players to proliferate at resolution.** No requirement to choose any.
- **A permanent with multiple counter types gets one additional counter of EACH type.**
- **Proliferate doesn't target.** Hexproof, shroud, and protection don't stop it.
- **Doubling Season doubles counters added to YOUR permanents** via proliferate.
- **In 2HG, shared poison counters can only be added once** even if both team members are chosen.

## Canonical Example
**Flux Channeler (whenever you cast a noncreature spell, proliferate):**
You cast a noncreature spell. Proliferate triggers. On the board: your planeswalker with 2 loyalty, an opponent's creature with 3 +1/+1 counters, and you have 2 poison counters. You choose to proliferate your planeswalker (gains 1 loyalty → 3) and yourself (gain 1 poison → 3 poison). You may also proliferate opponent's creature if desired.

**Example 2 — Proliferate + Doubling Season:**
Doubling Season is on the battlefield. You proliferate a creature you control with one +1/+1 counter. Doubling Season sees "counter being placed on a permanent you control" → doubles it. The creature gets 2 additional +1/+1 counters (not 1). Total: 3 +1/+1 counters.

## Commonly Confused With
- **P025 (Counter Placement — Cost vs. Effect)** — Proliferate is an effect (not a cost), so Doubling Season applies to counters placed on your permanents.
- **P037 (Infect/Wither)** — Proliferate can add poison counters to players; the counters it adds are not damage, so protection and infect interactions don't apply during proliferate.
