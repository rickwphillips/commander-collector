---
id: p129
name: Spree — Modal Spell with Per-Mode Additional Costs
category: costs
cr_refs: [702.172a, 700.2, 601.2b]
tags: [spree, modal, additional-cost, per-mode, choose-modes, stack, copy]
created: 2026-03-28
examples_count: 2
---

# P129 — Spree — Modal Spell with Per-Mode Additional Costs

## Abstract
Spree is a variant of modal spells where each mode has its own additional mana cost (+{1}, +{2}, etc.). You must choose at least one mode, and you pay the base mana cost PLUS the cost of each chosen mode. Unlike Escalate (which adds a flat cost per extra mode), Spree's costs vary per mode. You can choose any combination of modes as long as you can pay the associated costs. This makes spree spells flexible — choose the combination that suits your mana available and situation.

## The Definitive Rule

**CR 702.172a** (verbatim): *"Spree means 'Choose one or more modes. As an additional cost to cast this spell, pay the costs associated with those modes.'"*

## The Pattern

```
SPREE — COST STRUCTURE:
  Base mana cost: the cost on the spell's mana cost line
  Each mode has an additional cost (+{X})
  Total cost = base cost + sum of costs for all chosen modes
  Must choose at least one mode

CHOOSING MODES:
  Can choose one mode (minimum)
  Can choose all modes (maximum)
  Each chosen mode: pay its additional cost AND get its effect
  Modes not chosen: not paid, effects don't happen

SPREE vs ESCALATE (P099):
  Escalate: all modes chosen at the same base cost, pay escalate cost for each extra mode
  Spree: each mode has its own cost; you pay only for what you choose
  Spree: can choose any subset (even just one expensive mode)
  Escalate: always starts with a base number of modes

SPREE + COPY:
  Copying a spree spell: copy includes the chosen modes (and their effects)
  A copy can choose different modes (like any modal spell copy — "may choose new targets" extends to modes for copies)
  Wait: for copies of spree spells, the copy has the same modes chosen as the original unless specified otherwise

SPREE + X MODES:
  If a mode has "X" in its cost: you choose X when you choose that mode
  Each "X" in a mode is set independently

SPREE + STORM:
  Storm creates copies of the spell with the chosen modes
  Storm copies: same modes as the original

SPREE + ADDITIONAL COSTS (bargain, kicker):
  These are independent from spree mode costs
  You can bargain AND choose multiple spree modes simultaneously
  All costs are paid together (601.2f ordering)

MODE ORDERING:
  Effects of chosen modes resolve in the order they're listed on the card (written order)
```

## Definitive Conclusions

- **Spree requires choosing at least one mode and paying base cost + each chosen mode's cost.**
- **Can choose any combination of modes.** Not required to choose all.
- **Total cost = base + sum of chosen mode costs.** Different from escalate (which adds flat cost per extra mode).
- **Copies of spree spells have the same modes chosen** as the original.

## Canonical Example
**Shoot the Sheriff (Spree):**
Base: {1}{W} + modes:
+{W}: Destroy target creature
+{1}: Create a 2/2 Outlaw
+{2}{W}: Destroy a planeswalker
Choose "destroy creature" (+{W}) and "create Outlaw" (+{1}):
Total cost: {1}{W} + {W} + {1} = {2}{W}{W}
Get both effects.

**Example 2 — Single mode:**
Shoot the Sheriff, just choose "create a 2/2 Outlaw" (+{1}):
Total cost: {1}{W} + {1} = {2}{W}
Cheaper! Less effect.

## Commonly Confused With
- **P099 (Modal Spells / Escalate)** — Escalate: pay flat cost per extra mode. Spree: each mode has its own unique cost.
- **P049 (Kicker)** — Kicker is a single optional additional cost. Spree has multiple per-mode costs.
- **P049 and Spree are both "pay more for more" spells** — but the mechanism differs significantly.
