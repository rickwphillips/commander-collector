---
id: p094
name: Melee — Multi-Opponent Attack Pump
category: combat
cr_refs: [702.121a, 702.121b]
tags: [melee, attack, pump, opponents, multiple-opponents, multiplayer, triggered, counting]
created: 2026-03-28
examples_count: 2
---

# P094 — Melee — Multi-Opponent Attack Pump

## Abstract
Melee triggers whenever the creature with melee attacks. The creature gets +1/+1 until end of turn for each OPPONENT YOU ATTACKED WITH A CREATURE in the current combat. This means attacking multiple opponents (possible in multiplayer) with multiple creatures gives a larger bonus. In a 1v1 game, melee provides at most +1/+1 (you attacked one opponent). In multiplayer, you can attack different opponents with different creatures and the melee creature gets +1/+1 for each opponent you attacked.

## The Definitive Rule

**CR 702.121a** (verbatim): *"Melee is a triggered ability. 'Melee' means 'Whenever this creature attacks, it gets +1/+1 until end of turn for each opponent you attacked with a creature this combat.'"*

**CR 702.121b** (verbatim): *"If a creature has multiple instances of melee, each triggers separately."*

## The Pattern

```
MELEE TRIGGER:
  Fires when: this creature attacks
  Bonus: +1/+1 for each opponent you attacked with a creature this combat

COUNTING ATTACKED OPPONENTS:
  Count opponents (not creatures) attacked
  Attack opponent A with 3 creatures: 1 opponent attacked = +1/+1 to melee creature
  Attack opponent A with 1 creature AND opponent B with 1 creature:
    2 opponents attacked = +2/+2 to melee creature

TIMING:
  Trigger fires "whenever this creature attacks" — during declare attackers
  The trigger COUNTS opponents attacked THIS combat
  The trigger goes on stack after declaring attackers
  The count includes the defending player(s) being attacked

MELEE IN DUELS:
  Only one opponent → at most +1/+1 per melee trigger
  Multiple melee instances: two triggers → +2/+2 total (one per trigger, each gives +1)

MELEE IN COMMANDER (4 players):
  You can attack all 3 other opponents with different creatures
  Melee creature attacks opponent A, two other creatures attack B and C:
    3 opponents attacked → melee gives +3/+3

MULTIPLE MELEE INSTANCES:
  Each triggers separately
  Two melee on same creature attacking + 3 opponents attacked:
    Trigger 1: +3/+3 (3 opponents)
    Trigger 2: +3/+3
    Total: +6/+6
```

## Definitive Conclusions

- **Melee counts OPPONENTS attacked, not creatures attacking.** One opponent = +1/+1 regardless of how many creatures hit them.
- **Maximum +1 per opponent in multiplayer.** Attacking all opponents simultaneously gives maximum bonus.
- **In duels, melee is at most +1/+1** per instance.
- **Multiple melee instances stack.** Each trigger fires independently.

## Canonical Example
**Melee creature in Commander (3 opponents):**
Declare attackers: melee creature attacks opponent A, creature 2 attacks opponent B, creature 3 attacks opponent C. Melee triggers: counts 3 opponents attacked → melee creature gets +3/+3 until end of turn.

**Example 2 — Melee in duel:**
You attack with melee creature against your only opponent. Trigger: 1 opponent attacked → +1/+1. Attack twice per turn is impossible (combat happens once per turn). Max melee bonus in duel: +1/+1 per melee instance per turn.

## Commonly Confused With
- **P085 (Exalted)** — Exalted requires attacking alone; Melee benefits from attacking multiple opponents. They reward opposite combat strategies.
- **P084 (Myriad)** — Myriad creates tokens attacking different opponents; those tokens might be attacking the other opponents, enabling melee on the original creature.
