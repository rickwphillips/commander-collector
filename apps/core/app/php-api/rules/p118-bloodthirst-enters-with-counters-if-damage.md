---
id: p118
name: Bloodthirst — Conditional Entry Counters
category: continuous
cr_refs: [702.54a, 702.54b, 702.54c]
tags: [bloodthirst, +1/+1, enters-with, damage, opponent-damaged, conditional, static-ability]
created: 2026-03-28
examples_count: 2
---

# P118 — Bloodthirst — Conditional Entry Counters

## Abstract
Bloodthirst is a static ability that makes a permanent enter with +1/+1 counters IF an opponent was dealt damage this turn. The N version gives exactly N counters if any opponent was damaged; the X version gives one counter per total damage dealt to opponents. The condition is checked as the permanent enters — not later. Importantly, "damaged this turn" means combat damage OR spell/ability damage dealt to opponents before this permanent entered — a single point of damage activates bloodthirst.

## The Definitive Rule

**CR 702.54a** (verbatim): *"'Bloodthirst N' means 'If an opponent was dealt damage this turn, this permanent enters with N +1/+1 counters on it.'"*

**CR 702.54b** (verbatim): *"'Bloodthirst X' means 'This permanent enters with X +1/+1 counters on it, where X is the total damage your opponents have been dealt this turn.'"*

**CR 702.54c** (verbatim): *"If an object has multiple instances of bloodthirst, each applies separately."*

## The Pattern

```
BLOODTHIRST N:
  Condition: if ANY opponent was dealt damage this turn (even 1 damage)
  Effect: enters with exactly N +1/+1 counters
  Binary: either enters with N counters or 0 counters (no scaling)

BLOODTHIRST X:
  No condition required (always applies)
  X = total damage dealt to all opponents this turn
  Scales with total damage done to opponents

"DAMAGED THIS TURN":
  Any damage source qualifies: combat, spells, abilities, burns, etc.
  Damage to ANY opponent (multiplayer: any opponent losing life from damage)
  Redirected damage counts (if originally aimed at a player)
  Preventing damage: if damage is prevented, that damage wasn't "dealt"

REPLACEMENT EFFECTS:
  Hardened Scales: bloodthirst puts N counters → scales applies (N+1 or doubled etc.)
  Doubling Season: bloodthirst puts N counters → doubled entry → 2N counters
  These apply as replacement effects when the counters are placed

MULTIPLE BLOODTHIRST:
  Two bloodthirst N instances: each applies separately → 2N counters total (702.54c)

BLOODTHIRST CHECK TIMING:
  Checked as the permanent enters — it's a static "as enters" ability
  If condition is true when entering: counters are added
  Can't lose the counters retroactively (condition was already checked)

BLOODTHIRST vs BATTLECRY-STYLE:
  Bloodthirst checks a past event (was damage dealt this turn?)
  Unlike evolve (checks current board state) or tribute (opponent chooses at entry)
```

## Definitive Conclusions

- **Bloodthirst N enters with exactly N counters if any opponent was dealt any damage this turn.**
- **Bloodthirst X scales with total damage dealt to all opponents this turn.**
- **Any damage source activates bloodthirst N** — even 1 damage from any ability.
- **Multiple bloodthirst instances are cumulative** — each adds its counters separately.
- **Replacement effects (Doubling Season, Hardened Scales) apply to counter placement.**

## Canonical Example
**Gorehorn Minotaurs (Bloodthirst 2, {2}{R}{R}):**
Earlier this turn, a 1/1 dealt 1 combat damage to opponent.
Gorehorn enters with 2 +1/+1 counters → 5/5.
If no damage dealt yet: Gorehorn enters as 3/3.

**Example 2 — Bloodthirst X:**
Hellhole Flailer (Bloodthirst X).
You dealt 7 damage to opponents this turn.
Hellhole enters with 7 +1/+1 counters.

## Commonly Confused With
- **P077 (Evolve)** — Evolve checks board state (current power/toughness comparison). Bloodthirst checks history (damage this turn).
- **P118 vs P075 (Riot)** — Riot gives a choice (counter OR haste) at entry. Bloodthirst gives counters only if a condition is met.
- **P100 (Enters-With-Counters Replacement)** — Multiple counter-addition effects interact with bloodthirst entry.
