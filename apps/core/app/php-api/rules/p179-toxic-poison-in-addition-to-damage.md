---
id: p179
name: Toxic — Poison Counters in Addition to Normal Damage
category: combat
cr_refs: [702.164a, 702.164b, 702.164c]
tags: [toxic, poison-counter, damage, combat, total-toxic-value, Phyrexia-All-Will-Be-One, Venerated-Rotpriest]
created: 2026-03-28
examples_count: 2
---

# P179 — Toxic — Poison Counters in Addition to Normal Damage

## Abstract
Toxic N is a static ability: whenever a creature with toxic deals combat damage to a player, that creature's controller gives that player a number of poison counters equal to the creature's total toxic value — IN ADDITION to the normal damage (life loss). This is different from infect: infect REPLACES damage with poison counters; toxic adds poison counters on top of normal damage. So a 3/3 with Toxic 2 deals 3 damage (loses 3 life) AND gives 2 poison counters. The total toxic value is the sum of all toxic N values on the creature.

## The Definitive Rules

**CR 702.164a** (verbatim): *"Toxic is a static ability. It is written 'toxic N,' where N is a number."*

**CR 702.164b** (verbatim): *"Some rules and effects refer to a creature's 'total toxic value.' A creature's total toxic value is the sum of all N values of toxic abilities that creature has. Example: If a creature with toxic 2 gains toxic 1 due to another effect, its total toxic value is 3."*

**CR 702.164c** (verbatim): *"Combat damage dealt to a player by a creature with toxic causes that creature's controller to give the player a number of poison counters equal to that creature's total toxic value, in addition to the damage's other results. See rule 120.3."*

## The Pattern

```
TOXIC:
  Static ability: when creature deals combat damage to a player
  Effect: controller gives player N poison counters (total toxic value)
  "In addition" to normal damage: the player also loses life from the damage!
  Both effects happen simultaneously

  TOXIC VS INFECT:
    Infect: damage to player → ONLY poison counters (no life loss)
    Toxic: damage to player → normal life loss + poison counters
    Toxic creature deals BOTH damage and poison
    You need 10 poison counters to lose from toxic; also might die from life loss

  TOTAL TOXIC VALUE:
    Toxic 2 + Toxic 1 (from a buff) = total toxic value 3
    One source: "Combat damage from this creature causes 3 poison counters"
    Multiple instances ADD together

  TOXIC + DAMAGE REDUCTION:
    If damage is prevented: is poison still given?
    The poison counters are a result of "combat damage dealt to a player"
    If damage is prevented → no damage dealt → no poison (toxic requires the damage to be dealt)
    Fog: prevents all combat damage → no toxic triggers

  TOXIC + PROLIFERATE:
    After dealing 1+ poison via toxic: proliferate adds more poison counters
    Even 1 toxic hit enables the proliferate win condition

  TOXIC + UNBLOCKABLE:
    Every unblocked hit deals poison + life loss
    Strategies: make toxic creatures hard to block for double pressure
    Archpraetor (commander with toxic in Phyrexia: AWBO): hits for damage AND poison

  TOXIC + LIFELINK:
    Toxic creature with lifelink: deals damage → controller gains life + player gets poison
    Both effects from the combat damage

  TOXIC + FIRST STRIKE / DOUBLE STRIKE:
    First strike: deals damage in first strike step → gives poison in first strike step
    Double strike: deals damage twice → gives poison in each damage step?
    Wait: "Combat damage dealt to a player" — first strike step is still combat damage
    First strike step: 3 damage, 2 poison given
    Second strike step: 3 more damage, 2 more poison
    Total: 6 damage, 4 poison from one double-strike toxic attack

  TOXIC POISON KILL:
    10 poison counters = game loss (same threshold as infect)
    Toxic is generally harder to reach 10 since you have to attack many times
    But: fast toxic + proliferate = realistic poison win

TOXIC CARDS (Phyrexia: All Will Be One):
  Venerated Rotpriest (1/2, Toxic 1): opponent casts spell targeting your creatures → they get 1 poison
  Skrelv, Defector Mite (1/1, Toxic 1): hexproof from a chosen color
  Many 1/1 and 2/2 creatures with Toxic 1 or 2
  Jor Kadeen, First Goldwarden: commander with Toxic 2
```

## Definitive Conclusions

- **Toxic adds poison counters IN ADDITION to normal damage** — unlike infect which replaces damage.
- **Total toxic value** = sum of all toxic N values on the creature.
- **Damage must be dealt** for poison to be given — preventing damage prevents poison.
- **Proliferate extends toxic** — one poison counter enables proliferate chains.
- **Double strike** gives poison in both damage steps.

## Canonical Example
**Venerated Rotpriest (1/2, Toxic 1):**
"Whenever a player casts a spell that targets one or more creatures you control, that player gets a poison counter."
Also has Toxic 1: when it deals combat damage to a player, give that player 1 poison counter.
Attack unblocked: deal 1 damage (opponent at 39 life) AND 1 poison counter.
Opponent casts Doom Blade targeting one of your creatures → they get 1 poison from Rotpriest's triggered ability.
If Rotpriest themselves is targeted: 1 more poison.
Proliferate builds from those poison counters.

**Example 2 — Skrelv's Hive (Enchantment that creates 1/1 Phyrexian Mite tokens with Toxic 1):**
Each Mite token: 1/1, Toxic 1. Can't block.
Attack with 5 Mites: each deals 1 damage + 1 poison if unblocked.
After one attack wave: opponent at 35 life AND has 5 poison counters.
3 more attacks (if unblocked): 5 poison per attack → 15 more poison → 20 total → opponent has been poisoned to death multiple turns before losing life.

## Commonly Confused With
- **P159 (Infect)** — Infect replaces damage with poison. Toxic adds poison on top of damage. Mutually exclusive mechanics: a creature can have toxic OR infect, and they work differently.
- **P160 (Poisonous)** — Poisonous N gives N poison counters when dealing combat damage (similar to toxic but older keyword with fixed N per instance). Toxic uses total toxic value.
- **P159 (Proliferate)** — Proliferate adds more poison counters. Works with both toxic and infect strategies.
