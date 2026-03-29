---
id: p132
name: Boast — Attack-Triggered Once-Per-Turn Activated Ability
category: triggered
cr_refs: [702.142a, 702.142b]
tags: [boast, attack, once-per-turn, activated-ability, kaldheim, berserker, nordic]
created: 2026-03-28
examples_count: 2
---

# P132 — Boast — Once-Per-Turn Activated Ability After Attacking

## Abstract
Boast is a special kind of activated ability that can only be activated if the creature attacked this turn, and only once per turn. It's formatted as an activated ability (cost: effect) with the restriction "Activate only if this creature attacked this turn and only once each turn." It can be activated at any time you have priority after the creature attacks — not just in combat. The restriction tracks whether the creature attacked this turn (regardless of whether it dealt damage or was blocked).

## The Definitive Rule

**CR 702.142a** (verbatim): *"A boast ability is a special kind of activated ability. 'Boast — [Cost]: [Effect]' means '[Cost]: [Effect]. Activate only if this creature attacked this turn and only once each turn.'"*

**CR 702.142b** (verbatim): *"Effects may refer to boast abilities. If an effect refers to a creature boasting, it means its boast ability being activated."*

## The Pattern

```
BOAST RESTRICTION:
  1. "This creature attacked this turn" — the creature must have been declared as an attacker
  2. "Only once each turn" — can only activate the boast ability once per turn

TIMING:
  After the creature attacks: you can activate the boast ability at any time
  Including: during the declare attackers step, during blockers, end of combat, postcombat main phase
  Can't activate BEFORE the creature attacks in the same turn
  Blocked creature that attacked: still attacked → can boast

BOAST AS AN ACTIVATED ABILITY:
  Normal activated ability rules apply (cost → effect)
  Goes on the stack
  Can be countered (Stifle, Trickbind)
  Can be activated multiple times in one activation priority window? NO — "only once each turn"
  The "once" limit is per turn, not per phase or per game

ATTACKED BUT NOT DEALT DAMAGE:
  Blocked → no damage → still "attacked" → can boast
  This is the key: attacking is the trigger condition, not dealing damage

STOLEN CREATURE:
  If a creature attacks, then you steal it (Act of Treason):
    It has already attacked → the new controller CAN activate the boast ability (if they have priority)
    The "attacked this turn" condition is met regardless of who controlled it when it attacked

BOAST + COPY:
  "Effects that refer to a creature boasting" = the boast ability being activated
  Some cards trigger when a creature boasts — these fire when the boast ability is activated

BOAST ONCE PER TURN LIMIT:
  This turn reset: each new turn, the boast can be activated again
  If the creature somehow attacks multiple times this turn (extra combat): one boast per turn regardless
```

## Definitive Conclusions

- **Boast requires the creature to have attacked this turn** — declared as an attacker.
- **Activated only once per turn.** Not once per combat or once per phase.
- **Can be activated at any time after attacking** — not just during combat.
- **Blocked (no damage dealt) still counts as "attacked."**
- **Extra combats don't grant additional boast activations** — still only once per turn.

## Canonical Example
**Tibalt's Trickery — wait, that's not boast. Kaldheim's Berserker of the Eternal Rest (Boast {R}: gains double strike until end of turn):**
Declare attacker (not blocked). During declare blockers step (or any time with priority after declaring attackers): activate boast → pay {R} → gets double strike until end of turn.
Or: activate in postcombat main phase for a future trick... wait, double strike would be useless after combat. Best activated before or during combat.

**Specific Example — Halvar, God of Battle / Sword of the Realms:**
Svella, Ice Shaper (Boast {2}: creates a tapped Icy Manalith token):
Attack with Svella. After declaring attack (any time with priority): pay {2}, boast → create Icy Manalith.
The Manalith is created regardless of combat outcome. Even if Svella is killed in combat, if boast was activated first, the effect resolves.

## Commonly Confused With
- **P085 (Exalted)** — Exalted triggers automatically when attacking alone. Boast requires activation.
- **P111 (Haste)** — Haste lets you attack the same turn you enter; boast requires actually attacking.
- **P094 (Melee)** — Melee triggers when attacking; boast is activated AFTER attacking. Both require attacking.
