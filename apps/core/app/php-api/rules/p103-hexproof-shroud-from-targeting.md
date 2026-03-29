---
id: p103
name: Hexproof and Shroud — Targeting Prevention
category: continuous
cr_refs: [702.11a, 702.11b, 702.11c, 702.11d, 702.18a, 702.18b]
tags: [hexproof, shroud, targeting, opponent, yourself, hexproof-from, protection-comparison]
created: 2026-03-28
examples_count: 2
---

# P103 — Hexproof and Shroud — Targeting Prevention

## Abstract
Hexproof prevents opponents from targeting the permanent/player with their spells or abilities. Shroud prevents ALL players (including yourself) from targeting it. Both only protect from TARGETING — not from non-targeting effects (Wrath of God, overloaded Cyclonic Rift, etc.). "Hexproof from [quality]" is a specific variant protecting only from that quality's spells/abilities. A key difference: you CAN target your own hexproof permanent, but you CANNOT target your own shroud permanent.

## The Definitive Rule

**CR 702.11b** (verbatim): *"'Hexproof' on a permanent means 'This permanent can't be the target of spells or abilities your opponents control.'"*

**CR 702.11d** (verbatim): *"'Hexproof from [quality]' on a permanent means 'This permanent can't be the target of [quality] spells your opponents control or abilities your opponents control from [quality] sources.'"*

**CR 702.18a**: Shroud is a static ability.

**CR 702.18b** (verbatim): *"A permanent or player with shroud can't be the target of spells or abilities."*

## The Pattern

```
HEXPROOF:
  Opponents can't target this permanent with their spells or abilities
  YOU can still target your own hexproof permanent (with your spells/abilities)
  Opponents: can't cast Doom Blade, Lightning Bolt, equip abilities → targeting fails
  Non-targeting effects still work:
    Wrath of God: doesn't target → hexproof irrelevant
    Cyclonic Rift overloaded: no targets → hexproof irrelevant
    "All creatures get -1/-1": no targeting → hexproof irrelevant

SHROUD:
  NO PLAYER can target this permanent (including its controller)
  You can't equip it (equip requires targeting)
  You can't cast Auras on it targeting it
  You can't use abilities that target it
  Shroud makes the permanent truly untargetable by anyone

HEXPROOF FROM [QUALITY]:
  Only blocks targeting by [quality] spells/sources
  "Hexproof from red" — can't be targeted by red spells from opponents
  CAN still be targeted by non-red spells (blue, white, etc.) from opponents
  "Hexproof from each color" — can't be targeted by any colored spell from opponents
    But colorless spells from opponents can still target it

WHAT GETS BLOCKED:
  Targeting by spells (instants, sorceries, spells with "target")
  Targeting by activated abilities ("T: target creature gets +1/+1")
  Targeting by triggered abilities ("when X enters, put +1/+1 counter on target creature")

WHAT DOESN'T GET BLOCKED:
  Non-targeting effects
  "Each creature" effects
  Damage from combat (damage from combat doesn't target)
  State-based actions (SBAs)
  Your own spells (for hexproof — you can target your own hexproof permanent)

EQUIPPING HEXPROOF:
  Equip ability has "target creature you control" → you're targeting your own creature
  Hexproof: blocks opponent targeting → you CAN equip your hexproof creature
  Shroud: blocks ALL targeting → you CANNOT equip your shroud creature
```

## Definitive Conclusions

- **Hexproof blocks opponent targeting only.** You can still target your own hexproof permanent.
- **Shroud blocks all targeting**, including yours.
- **Both are irrelevant against non-targeting effects** (Wrath, sweepers, "each creature" effects).
- **Hexproof from [quality] only blocks that specific quality's targeting.** Other qualities still target.
- **You can equip a hexproof creature** but not a shroud creature.

## Canonical Example
**Slippery Bogle (Hexproof, 1/1):**
Opponent can't Doom Blade it, Path it, or target it with any ability. You can cast Ethereal Armor (Aura) on it (you're targeting it, not the opponent). Result: Bogle with Auras is very hard to interact with.

**Example 2 — Shroud:**
Creature has shroud. Opponent can't target it (same as hexproof). But YOU also can't target it: can't equip it, can't cast Auras on it, can't use abilities that say "target [this creature]." If you want to improve a shroud creature, use non-targeting effects.

## Commonly Confused With
- **P027 (Protection — DEBT)** — Protection includes targeting prevention (T in DEBT) plus blocking, damage prevention, and enchantment prevention. Hexproof only blocks targeting; protection is broader.
- **P065 (Ward)** — Ward doesn't prevent targeting; it punishes targeting. Hexproof prevents targeting outright.
