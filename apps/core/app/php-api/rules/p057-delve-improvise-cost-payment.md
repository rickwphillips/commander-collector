---
id: p057
name: Delve and Improvise — Graveyard/Artifact Cost Payment
category: costs
cr_refs: [702.66a, 702.66b, 702.66c, 702.126a, 702.126b, 702.126c]
tags: [delve, improvise, cost-payment, generic-mana, graveyard, artifact, tap, total-cost, convoke-parallel]
created: 2026-03-28
examples_count: 2
---

# P057 — Delve and Improvise — Graveyard/Artifact Cost Payment

## Abstract
Delve and Improvise are both static abilities that allow a player to pay for generic mana in a spell's total cost using alternative resources — Delve uses cards exiled from the graveyard, Improvise uses tapped artifacts. Both are NOT additional or alternative costs; they are payment-reduction mechanisms that apply AFTER the total cost is determined. This means they work alongside other cost modifications (reductions, additions) and interact with "without paying its mana cost" casts in a specific way.

## The Definitive Rule

**CR 702.66a** (verbatim): *"Delve is a static ability that functions while the spell with delve is on the stack. 'Delve' means 'For each generic mana in this spell's total cost, you may exile a card from your graveyard rather than pay that mana.'"*

**CR 702.66b** (verbatim): *"The delve ability isn't an additional or alternative cost and applies only after the total cost of the spell with delve is determined."*

**CR 702.126a** (verbatim): *"Improvise is a static ability that functions while the spell with improvise is on the stack. 'Improvise' means 'For each generic mana in this spell's total cost, you may tap an untapped artifact you control rather than pay that mana.'"*

**CR 702.126b** (verbatim): *"The improvise ability isn't an additional or alternative cost and applies only after the total cost of the spell with improvise is determined."*

## The Pattern

```
DELVE PAYMENT:
  After total cost is determined (including all reductions/additions):
  For each {1} (generic mana) in the total cost:
    → You MAY exile one card from your graveyard instead of paying that {1}
  Can exile up to [number of generic mana in total cost] cards
  Cannot use delve on colored mana requirements (only generic)

IMPROVISE PAYMENT:
  After total cost is determined:
  For each {1} (generic mana) in the total cost:
    → You MAY tap one untapped artifact you control instead of paying that {1}
  Can tap up to [number of generic mana in total cost] artifacts
  Cannot use improvise on colored mana requirements (only generic)
  Artifacts with summoning sickness CAN be tapped for improvise
    (Improvise is YOUR ability, not the artifact's)

BOTH ARE NOT ALTERNATIVE COSTS:
  "Without paying its mana cost" → alternative cost replaces mana cost
  If cast without paying mana cost (cascade, etc.):
    Delve: applies only after total cost is determined
    If no generic mana in total cost (because mana cost was bypassed):
    → Delve applies to whatever remains — if nothing, nothing to delve
    → Practically: delve/improvise still function on remaining cost components
  Delve and improvise apply AFTER cost determination, not as part of it

MULTIPLE DELVE/IMPROVISE:
  Multiple instances of delve on the same spell are redundant (CR 702.66c)
  Multiple instances of improvise on the same spell are redundant (CR 702.126c)
  Having both on the same spell: each applies independently
    → Can pay with graveyard cards AND tapped artifacts for same generic costs
    → But each generic mana cost can only be paid once

LIMITS:
  Delve: limited by number of cards in graveyard
  Improvise: limited by number of untapped artifacts you control
  Both: limited by number of generic mana in total cost
  Cannot pay "extra" — only up to the generic mana amount

INTERACTION WITH OTHER COST REDUCTIONS:
  Cost reduction (Goblin Electromancer) reduces total cost first
  Delve/improvise apply after: fewer generic mana left to pay with graveyard/artifacts
  Example: {5} spell, reduce by {2} = {3} total generic → can exile up to 3 cards
```

## Definitive Conclusions

- **Delve exiles cards from your graveyard; Improvise taps artifacts you control.** Each replaces one generic mana per resource used.
- **Both apply only to generic mana.** Colored mana requirements can't be paid with delve or improvise.
- **Neither is an alternative cost.** They layer on top of normal cost payment after total cost is determined.
- **Artifacts with summoning sickness can improvise.** The tap is YOUR ability, not theirs.
- **Multiple copies of delve/improvise on the same spell are redundant.** One instance covers all generic mana.

## Canonical Example
**Become Immense (delve, {5}{G} → effectively {G} with 6 graveyard cards):**
Total cost is {5}{G}. For each of the five generic mana, you may exile one card from your graveyard. With 5 cards in graveyard, pay {G} and exile 5 cards → Become Immense costs effectively {G} this turn.

**Example 2 — Improvise:**
Sai, Master Thopterist (improvise on all your artifacts). Cast an artifact spell with {4} total cost. You have 3 untapped artifacts. Tap all 3 for improvise → pay remaining {1}. Total mana spent: {1} + 3 artifact taps.

## Commonly Confused With
- **P045 (Convoke)** — Convoke taps creatures to pay for mana; Improvise taps artifacts. Same structure, different resource.
- **P048 (Emerge)** — Emerge sacrifices a creature for cost reduction; delve exiles from graveyard. Both reduce costs but delve is not alternative (no sacrifice).
- **P049 (Kicker)** — Kicker is an additional cost; delve/improvise are not additional costs. Different categories entirely.
