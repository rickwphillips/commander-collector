---
id: p117
name: Affinity — Cost Reduction by Permanent Type Count
category: costs
cr_refs: [702.41a, 601.2f, 118.7]
tags: [affinity, cost-reduction, artifacts, land, colorless, generic-mana, total-cost, mirrodin]
created: 2026-03-28
examples_count: 2
---

# P117 — Affinity — Cost Reduction by Permanent Type Count

## Abstract
Affinity reduces a spell's total cost by 1 for each permanent of the specified type you control (usually "for artifacts" or "for basic lands of a type"). This is a cost reduction effect applied to the total cost — it can reduce the cost to zero but not below zero. Critical: affinity reduces GENERIC mana only, not colored mana requirements. A spell with affinity still requires its colored mana components even if affinity reduces the generic cost to zero.

## The Definitive Rule

**CR 702.41a** (verbatim): *"Affinity for [text] is a static ability. 'Affinity for [text]' means 'This spell costs you {1} less to cast for each [text] you control.'"*

## The Pattern

```
AFFINITY — CORE RULE:
  Cost reduction: {1} less for each [qualifying permanent] you control
  Maximum reduction: total generic mana in the cost
    → Cannot reduce below the colored mana requirements
  Zero floor: can make a spell cost {0} but not negative

WHAT "FOR ARTIFACTS" MEANS:
  Count all artifacts you control at the time of casting
  Includes artifact creatures, Equipment, Vehicles, etc.
  Count is checked at time of casting (not at resolution)

AFFINITY + COLORED MANA:
  "Affinity for artifacts" on a spell that costs {3}{U}{U}:
    If you control 3 artifacts: cost becomes {0}{U}{U} = {U}{U}
    If you control 5 artifacts: cost is still {U}{U} (can't reduce colored)

TOTAL COST CALCULATION (CR 601.2f order):
  Start: printed mana cost
  Apply: cost increase effects (Thalia, Tax spells)
  Apply: cost reduction effects (Affinity, Convoke, etc.)
  Floor: never below the colored mana requirements

AFFINITY VARIANTS:
  "Affinity for artifacts": reduce by number of artifacts you control
  "Affinity for basic lands": reduce by basic lands you control
  "Affinity for [land type]": reduce by that land type you control
  "Affinity for [creature type]": reduce by that creature type count
  All work the same way — just different permanent types counted

AFFINITY + FREE SPELLS:
  A spell with affinity can become "free" if you control enough qualifying permanents
  Even free spells can be countered, have their targets chosen, etc.
  Being free doesn't bypass any other rules

AFFINITY FOR ARTIFACTS IN MIRRODIN BLOCK:
  Many artifact spells with "affinity for artifacts"
  In an all-artifact deck: many spells cast for {0} or very cheap
  The synergy: artifacts generate more affinity reduction for other artifacts

AFFINITY AT CAST TIME:
  Count at the time you cast the spell (announcement time)
  If an opponent destroys artifacts in response: doesn't affect cost already paid
  Because cost is set during announcement (601.2b), not at resolution
```

## Definitive Conclusions

- **Affinity reduces generic mana costs by 1 per qualifying permanent.** Cannot reduce below colored requirements.
- **Count qualifying permanents at cast time** (when you announce the spell).
- **Cost floors at the colored mana components.** Can't go negative.
- **Affinity can make spells free (cost {0}) but not negative-cost.**

## Canonical Example
**Myr Enforcer (Affinity for artifacts, {7}):**
You control 7 artifacts → cost reduced by 7 → {0} → cast for free.
You control 5 artifacts → cost is {2}.

**Example 2 — Affinity + colored mana:**
Thoughtcast (Affinity for artifacts, {4}{U}).
Control 4 artifacts → reduced by 4 → {0}{U} → pay {U} to cast.
Control 5 artifacts → still just {U} (can't reduce below the {U}).

## Commonly Confused With
- **P057 (Delve)** — Delve also reduces generic mana costs but by exiling graveyard cards. Both use total cost calculation.
- **P045 (Convoke)** — Convoke uses tapped creatures to pay any mana (including colored); affinity only reduces generic.
- **P048 (Emerge)** — Emerge also reduces generic cost by sacrificing a creature.
