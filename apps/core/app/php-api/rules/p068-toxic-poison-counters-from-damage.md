---
id: p068
name: Toxic — Poison Counters as Additional Combat Damage Result
category: combat
cr_refs: [702.164a, 702.164b, 702.164c, 120.3]
tags: [toxic, poison, counters, combat-damage, total-toxic-value, infect-comparison, proliferate]
created: 2026-03-28
examples_count: 2
---

# P068 — Toxic — Poison Counters as Additional Combat Damage Result

## Abstract
Toxic gives poison counters when the creature deals combat damage to a player — PLUS the normal damage still happens. Unlike Infect (which replaces normal damage with poison counters for creatures and poison counters instead of life loss for players), Toxic adds poison counters IN ADDITION to the normal damage. A player with 10 or more poison counters loses the game (SBA 704.5c). Multiple Toxic instances stack additively.

## The Definitive Rule

**CR 702.164a** (verbatim): *"Toxic is a static ability. It is written 'toxic N,' where N is a number."*

**CR 702.164b** (verbatim): *"Some rules and effects refer to a creature's 'total toxic value.' A creature's total toxic value is the sum of all N values of toxic abilities that creature has."*

**CR 702.164c** (verbatim): *"Combat damage dealt to a player by a creature with toxic causes that creature's controller to give the player a number of poison counters equal to that creature's total toxic value, in addition to the damage's other results."*

## The Pattern

```
TOXIC DAMAGE SEQUENCE:
  Creature with Toxic N deals combat damage to a player:
  1. Normal damage happens (life loss as normal)
  2. ADDITIONALLY: that player gets N poison counters
  3. If player has 10+ poison counters: SBA fires, player loses the game

TOXIC VS. INFECT:
  Infect (P037): REPLACES damage to creatures (→ -1/-1 counters)
                 REPLACES damage to players (→ poison counters, NO life loss)
  Toxic: damage to PLAYERS is normal life loss PLUS poison counters
         damage to CREATURES is still normal damage (no -1/-1 counters)
  → Infect is a full replacement; Toxic is an addition

TOTAL TOXIC VALUE:
  Multiple instances of toxic ADD together
  Toxic 1 + Toxic 2 = total toxic value 3
  → Dealing damage to a player gives 3 poison counters per hit

PREVENTION AND TOXIC:
  Prevention effects: "prevent all damage" → stops the damage
    → No poison counters (since counters are from damage result)
    If the damage is prevented (0 damage dealt): no poison counters
    Actually CR 702.164c says "combat damage dealt" — prevented damage isn't "dealt"
  Protection from the source: prevents damage (D in DEBT) → no damage → no poison
  Hexproof: only prevents targeting, not being damaged → toxic still applies
  Trample: excess damage assigned to player → that player gets poison counters

PROLIFERATE + TOXIC:
  Once poison counters are on a player: proliferate can add more (P054)
  Toxic puts them there; proliferate accelerates the count

COMMANDER DAMAGE AND TOXIC:
  Poison counters are separate from commander damage
  A commander with toxic: opponents take both commander damage AND poison counters
  21 commander damage OR 10 poison counters = lose

BLOCKING AND TOXIC:
  Toxic only applies to COMBAT damage dealt to PLAYERS
  If a creature with toxic damages another creature: no poison counters
    (Toxic is specifically "combat damage to a player")
  A creature with toxic dealing damage to a planeswalker: planeswalker takes damage,
    but planeswalkers aren't "players" — no poison counters to the controlling player
```

## Definitive Conclusions

- **Toxic adds poison counters IN ADDITION to normal damage.** Unlike infect, life loss still occurs.
- **Multiple toxic instances stack (total toxic value).**
- **Prevented damage doesn't cause toxic counters.** The counters come from "combat damage dealt."
- **Toxic only applies when combat damage hits a player directly,** not creatures or planeswalkers.
- **10 poison counters = lose the game** (SBA 704.5c), regardless of life total.

## Canonical Example
**Phyrexian creature with Toxic 2:**
Creature deals 3 combat damage to a player. Result: that player loses 3 life AND gets 2 poison counters. If player has 8 poison counters already, they now have 10 → lose the game via SBA.

**Example 2 — Toxic vs. Prevention:**
Creature with Toxic 3 attacks. Opponent casts "prevent all combat damage that would be dealt this turn." Creature's damage is prevented → 0 damage dealt to player → no poison counters (toxic only applies when damage IS dealt, not when prevented).

## Commonly Confused With
- **P037 (Infect/Wither)** — Infect replaces damage to players with poison counters (no life loss). Toxic adds poison counters in addition to normal life loss. Both result in poison counters but differ fundamentally in how damage works.
- **P054 (Proliferate)** — Proliferate can accelerate poison counter accumulation after toxic places the initial counters.
