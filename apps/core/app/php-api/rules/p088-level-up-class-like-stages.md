---
id: p088
name: Level Up — Class-Like Stage Progression
category: zones
cr_refs: [702.87a, 702.87b, 702.87c, 702.87d, 702.87e]
tags: [level-up, level, counter, stages, P/T, abilities, sorcery-speed, static-ability]
created: 2026-03-28
examples_count: 2
---

# P088 — Level Up — Class-Like Stage Progression

## Abstract
Level up is an activated ability that adds a level counter to the creature (sorcery-speed). The creature has different characteristics (P/T and abilities) at different level ranges, defined by "LEVEL X-Y" and "LEVEL X+" text blocks. These are static abilities that modify the creature's characteristics while it has the appropriate number of level counters. The entire level system works through continuous effects in the layer system.

## The Definitive Rule

**CR 702.87a**: Level up is an activated ability. "Level up [cost]" means "[Cost]: Put a level counter on this permanent. Activate only as a sorcery."

**CR 702.87b**: Level-up abilities and rules text with level symbols apply while the permanent is on the battlefield.

**CR 702.87c**: The abilities granted at each level range apply as static abilities while the permanent has that many level counters.

**CR 702.87d**: Each LEVEL X-Y / LEVEL X+ line defines a range. If the counter count falls in that range, the abilities and P/T in that block apply.

**CR 702.87e**: Multiple instances: each functions separately.

## The Pattern

```
LEVEL SYSTEM STRUCTURE:
  Card has three sections:
  1. Base: default P/T and abilities (when level counters < first threshold)
  2. LEVEL X-Y: P/T and abilities when level counter count is in range X to Y
  3. LEVEL X+: P/T and abilities when level counters ≥ X

  These are mutually exclusive ranges — only one applies at a time

LEVEL UP ACTIVATION:
  [Cost]: Put a level counter on this permanent. Activate only as a sorcery.
  Sorcery-speed: main phase, stack empty, your turn
  Can level up multiple times per turn (if you have the mana)

CHARACTERISTICS APPLY AS STATIC ABILITIES:
  The LEVEL X-Y line creates a continuous effect (layer system)
  P/T from the level range is in layer 7b (sets P/T to specific value)
  Abilities from level ranges are in layer 6 (ability-adding effects)
  These apply as long as the level counter count matches

COUNTERS ON LEVEL-UP CREATURES:
  Level counters are a specific type of counter
  Proliferate: "choose permanents with a counter" → can proliferate level counters
    → Adds one more level counter → may advance to next stage faster
  Doubling Season: placed "on" the creature from the activated ability
    → Actually: level up places the counter as a cost? No — placing the counter IS the effect
    The level up ability resolves → puts the counter (effect, not cost)
    Doubling Season would double it → two level counters added instead of one

COMPARISON TO CLASS ENCHANTMENTS:
  Class enchantments (Tasha's Cauldron, etc.) also have level/stage progression
  They level up via paying a cost (level ability)
  Similar concept but implemented via enchantment rules, not creature keyword ability
```

## Definitive Conclusions

- **Level up is sorcery-speed.** Must be your main phase with empty stack.
- **Characteristics at each level are continuous effects** in the layer system.
- **Proliferate can accelerate level progression** by adding level counters.
- **Multiple level-ups per turn are allowed** (just limited by mana).
- **The ranges are mutually exclusive.** Only the currently applicable range modifies the creature.

## Canonical Example
**Student of Warfare (Level up {W}):**
Starts as 1/1 (base). Pay {W}: level up → 1 counter. Still 1/1 (level 1-6 range doesn't have one). Pay {W} again: 2 counters. At level 1: P/T changes to... [varies by card — Student of Warfare is 3/3 first strike at levels 1-6 and 5/5 double strike at level 7+]. At 7 counters: becomes 5/5 double striker.

**Example 2 — Proliferate + Level Up:**
You activate Flux Channeler (whenever you cast noncreature, proliferate). Your Student of Warfare has 5 level counters (one away from level 7+). You cast a noncreature spell → proliferate. Choose Student of Warfare → it gets one more level counter → now has 6 counters → check if 6 is in any range [1-6 might apply] or approaching next threshold.

## Commonly Confused With
- **P004 (Layer Dependency)** — Level ranges are continuous effects that modify P/T and abilities. They interact with the layer system when combined with other effects.
- **P025 (Counter Placement)** — Level counters are placed by the level-up ability resolving (an effect). Doubling Season would double the counters placed.
