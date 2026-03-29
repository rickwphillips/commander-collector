---
id: p227
name: Wither — Damage Dealt as -1/-1 Counters
category: combat
cr_refs: [702.77a, 702.77b]
tags: [wither, negative-counters, damage-as-counters, Shadowmoor, Stigma-Lasher, Kulrath-Knight, persist-interaction]
created: 2026-03-28
examples_count: 2
---

# P227 — Wither — Damage Dealt as -1/-1 Counters

## Abstract
Wither is a static ability: damage dealt by a source with Wither is dealt as -1/-1 counters instead of marking damage. This has several consequences: the counters don't go away at end of turn (unlike normal damage), the counters remain after combat (weakening the creature permanently), and Wither interacts powerfully with Persist (a creature that dies with -1/-1 counters can still return via Persist, but with a -1/-1 counter, reducing its size). Wither is also strong against indestructible creatures — placing -1/-1 counters can eventually zero out a creature's toughness.

## The Definitive Rules

**CR 702.77a** (verbatim): *"Wither is a static ability. Damage dealt to a creature by a source with wither isn't marked on that creature. Instead, put a number of -1/-1 counters on that creature equal to the damage dealt."*

**CR 702.77b** (verbatim): *"If a permanent leaves the battlefield before an effect causes it to deal damage, its last known information is used to determine whether it had wither."*

## The Pattern

```
WITHER:
  Static ability on the damage source
  When a creature with wither damages another creature:
  Instead of marking damage: place -1/-1 counters equal to damage dealt
  This applies to: combat damage, abilities that deal damage from wither sources

WITHER + DAMAGE VS COUNTERS:
  Normal damage: removed at end of turn (cleanup step), doesn't persist
  Wither damage: -1/-1 counters remain PERMANENTLY (until removed)
  A 4/4 taking 2 wither damage: becomes a 2/2 with -1/-1 counters → still 2/2 next turn
  Same 4/4 taking 2 normal damage: healed at end of turn → back to 4/4
  Wither permanently reduces the creature's stats

WITHER + KILLING CREATURES:
  A creature takes enough wither damage: its toughness drops to 0 → dies (SBA)
  OR: the counters reduce toughness below current damage (but wither replaces damage with counters)
  A 2/2 hit by 2 wither damage: gets two -1/-1 counters → 0/0 → dies (SBA)
  No damage marked; the counters do the killing

WITHER + INDESTRUCTIBLE:
  Indestructible: can't be destroyed by damage or "destroy" effects
  But: toughness ≤ 0 → dies via SBA (even indestructible creatures)
  Wither on an indestructible creature: places -1/-1 counters → can zero out toughness
  Kill an "indestructible" creature by reducing its toughness to 0 via wither!
  This is one of the only ways to kill indestructible creatures without exile or "sacrifice" effects

WITHER + PERSIST:
  Persist (P157): "When this creature dies, if it had no -1/-1 counters, return it with a -1/-1 counter."
  Wither damage places -1/-1 counters BEFORE the creature dies
  If a persist creature is killed by wither damage:
  - It died WITH a -1/-1 counter (from wither damage)
  - Persist condition: "if it had no -1/-1 counters" — FAILS because it DID have -1/-1 counters
  - Persist does NOT trigger!
  Strategic: use wither damage to NEGATE persist on opponent's creatures
  Instead of killing the persist creature normally: deal wither damage first → persist won't trigger

WITHER + UNDYING (P157):
  Undying: "When this creature dies, if it had no +1/+1 counters, return it with a +1/+1 counter."
  Wither places -1/-1 counters — doesn't directly negate Undying (which cares about +1/+1 counters)
  If a creature has BOTH a +1/+1 counter (from before) and wither puts -1/-1:
  The +1/+1 and -1/-1 counters annihilate (one of each cancels) → net: no +1/+1 counter remains
  Undying: creature died with no +1/+1 counters → Undying TRIGGERS

WITHER + +1/+1 COUNTER ANNIHILATION:
  Rule: +1/+1 and -1/-1 counters cancel each other (one of each = net 0)
  A creature with two +1/+1 counters takes 3 wither damage:
  Gets three -1/-1 counters. Two +1/+1 + three -1/-1 → 0+0 + 0+0 = wait:
  Two +1/+1 and three -1/-1: two pairs cancel → 1 remaining -1/-1 counter
  Creature that was +2/+2 is now -1/-1 from the interaction (3 net negative)

WITHER + PROLIFERATE:
  Proliferate can add -1/-1 counters placed by wither
  Wither damage places counters, then proliferate adds more → creature's stats drop further
  Kulrath Knight ({3}{B/R}{B/R}) in Shadowmoor: "Creatures your opponents control with counters can't attack or block."
  Combine with wither: all your wither sources place -1/-1 counters on opponent's creatures
  Those creatures now have counters → Kulrath Knight's static ability prevents them from attacking/blocking!
  Lock: attack/block denied for any creature that has ever taken wither damage.

STIGMA LASHER ({R/W}{R/W}):
  2/2 with Wither and First Strike
  "Whenever Stigma Lasher deals damage to a player, that player can't gain life for the rest of the game."
  Wither + First Strike: hits in first strike combat damage step, weakens blocker with -1/-1 counters
  The "no life gain" rider: permanent effect on a player (exile or lose the game to end it)

WITHER + INFECT INTERACTION:
  Infect: deals damage to PLAYERS as poison counters; deals damage to CREATURES as -1/-1 counters
  Wither: deals damage to CREATURES as -1/-1 counters; deals damage to PLAYERS normally (not poison)
  Key difference: infect replaces both player and creature damage; wither only replaces creature damage
  A creature with BOTH infect and wither: infect overrides for player damage, wither handles creature damage
  (Both provide -1/-1 to creatures, so either keyword works the same on creatures)
```

## Definitive Conclusions

- **Wither deals damage as -1/-1 counters** to creatures (not marked damage that heals away).
- **Counters are permanent** — unlike regular damage, they don't go away at end of turn.
- **Indestructible + Wither**: repeatedly dealing wither can zero out toughness (kills indestructible).
- **Persist negation**: wither damage gives the persist creature -1/-1 counters → persist doesn't trigger.
- **Kulrath Knight + Wither**: place -1/-1 counters via wither → opponent's creatures can't attack or block.

## Canonical Example
**Kulrath Knight Lock in Shadowmoor draft:**
You control Kulrath Knight ({3}{B/R}{B/R}): "Creatures your opponents control with counters can't attack or block."
You also control a creature with Wither (e.g., Cerulean Wisps gives wither to a creature).
Attack with your wither creature: opponent blocks with their 3/3.
Wither damage: deal 2 damage → 3/3 gets two -1/-1 counters → becomes a 1/1.
The 1/1 now has counters → Kulrath Knight: the 1/1 "can't attack or block."
Next turn: attack freely. Opponent's creature can't block.
Repeat: more wither damage → more counters → eventually opponent has no valid blockers.

**Example 2 — Wither vs. Persist:**
Opponent controls Kitchen Finks (P157 example): Persist creature, 3/2.
You control a 2/2 with Wither. Attack with Kitchen Finks to trigger Persist interaction.
Your wither 2/2 blocks Kitchen Finks (3/2 vs 2/2).
Combat damage: Kitchen Finks deals 3 damage to your 2/2 (normal damage, 2/2 has lethal damage).
Your 2/2 deals 2 wither damage to Kitchen Finks: 2 -1/-1 counters placed on it → becomes 1/0.
SBA: Kitchen Finks at 0 toughness → dies.
Persist trigger: "if no -1/-1 counters" — Kitchen Finks has 2 -1/-1 counters when it died!
Persist FAILS: Kitchen Finks does NOT return.
One combat: killed Kitchen Finks AND negated its Persist permanently (for this instance).

## Commonly Confused With
- **P159 (Infect)** — Infect deals damage as -1/-1 to creatures AND as poison to players. Wither only replaces damage to creatures (-1/-1 counters); damage to players is normal.
- **P179 (Toxic)** — Toxic adds poison counters in addition to normal damage. Wither replaces creature damage with -1/-1 counters.
- **P157 (Persist)** — Persist's condition ("no -1/-1 counters") is directly defeated by wither-placed counters.
