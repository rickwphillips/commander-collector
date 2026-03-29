---
id: p048
name: Emerge — Sacrifice Cost and Mana Reduction
category: costs
cr_refs: [702.119a, 702.119b, 702.119c, 601.2b, 601.2h]
tags: [emerge, sacrifice, cost-reduction, CMC, alternative-cost, eldrazi, sorcery-speed, sacrifice-timing]
created: 2026-03-28
examples_count: 2
---

# P048 — Emerge — Sacrifice Cost and Mana Reduction

## Abstract
Emerge provides an alternative way to cast a creature spell: pay the emerge cost and sacrifice a creature, with the total cost reduced by the sacrificed creature's mana value. The sacrifice happens as part of paying the total cost (not before, not after). You choose which creature to sacrifice when you announce emerge, and you sacrifice it as you pay. Importantly, you can sacrifice a creature that has summoning sickness — the sacrifice is a cost, not an activated ability.

## The Definitive Rule

**CR 702.119a** (verbatim): *"Emerge [cost] means 'You may cast this spell by paying [cost] and sacrificing a creature rather than paying its mana cost' and 'If you chose to pay this spell's emerge cost, its total cost is reduced by an amount of generic mana equal to the sacrificed creature's mana value.' Casting a spell using its emerge ability follows the rules for paying alternative costs."*

**CR 702.119c**: You choose which permanent to sacrifice as you choose to pay emerge (at announcement), and you sacrifice it as you pay the total cost.

## The Pattern

```
EMERGE SEQUENCE:
  1. Announce emerge spell (alternative cost declared)
  2. Choose which creature to sacrifice (at step 601.2b — choosing costs)
  3. Determine total cost: emerge cost - sacrificed creature's mana value (generic reduction)
  4. Activate mana abilities if needed
  5. Pay total cost: pay mana + sacrifice the chosen creature
  6. Spell is on the stack

COST REDUCTION:
  Emerge cost (printed): {6}{U} for Elder Deep-Fiend
  Sacrificed creature's mana value reduces the GENERIC mana portion
  Sacrifice a 4-mana creature → {4} reduction → total: {2}{U}
  Sacrifice a 1-mana creature → {1} reduction → total: {5}{U}
  Sacrifice a 0-mana creature (token) → {0} reduction → total: {6}{U} (no benefit)
  Cost can't go below 0 total

WHICH COSTS ARE REDUCED?
  Only the GENERIC portion of emerge cost
  Colored mana in emerge cost is NOT reduced
  Example: emerge cost {5}{U}{U} with 3-CMC sacrifice → {2}{U}{U} total

SACRIFICE TIMING:
  Chosen at announcement, paid when total cost is paid (601.2h)
  The creature is still on the battlefield when targets are chosen (601.2c)
  → You can target the sacrificed creature with the emerge spell's abilities
    if it has ETB abilities that would interact with what it targets
  Actually: the creature exists until payment is made — so you can still
    announce emerge targeting something your sacrifice enables

SACRIFICE TARGET LEGALITY:
  Any creature you control can be sacrificed
  Even creatures with summoning sickness
  Even tokens
  Even creatures that are tapped

EMERGE FROM [QUALITY] VARIANT:
  "Emerge from [quality]" restricts what you can sacrifice
  Only creatures (or permanents) with that quality can be the sacrifice cost
```

## Definitive Conclusions

- **Emerge reduces generic mana only.** Colored mana in emerge cost is not reduced.
- **The sacrifice is made when you pay the total cost** — not before the spell is announced.
- **You choose the sacrifice creature at announcement.** The choice is locked in before targets.
- **Tokens have CMC 0 and provide no discount.** Only sacrifice creatures with a printed mana cost.
- **The sacrificed creature is still on the battlefield when targets are chosen.** You could technically target it with the emerge spell's text (if relevant).

## Canonical Example
**Elder Deep-Fiend emerge ({6}{U}, sacrifice a creature):**
You sacrifice a 4/4 Eldrazi Scion token... wait, token CMC = 0 (unless the token's mana cost is defined). Sacrifice a Thought-Knot Seer (CMC 4) instead. Emerge cost {6}{U} minus {4} generic = {2}{U} total. You pay {2}{U} and sacrifice Thought-Knot Seer. Elder Deep-Fiend enters, flashes out (sorry — it has flash in its printed text? No, emerge doesn't grant flash). Cast at sorcery speed from hand.

**Example 2 — Emerge on opponent's turn:**
Emerge is an alternative cost, not a keyword granting flash. You still cast at sorcery speed unless the emerge creature itself has flash or you have a flash-granting effect.

## Commonly Confused With
- **P048 complements P045 (Convoke)** — Both are cost-reduction mechanisms using permanents you control. Convoke taps creatures for mana; emerge sacrifices a creature.
- **P034 (Cascade)** — Cascade also lets you cast spells for free or reduced cost. Emerge is a deliberate alternative cost, not a triggered exile-and-cast.
