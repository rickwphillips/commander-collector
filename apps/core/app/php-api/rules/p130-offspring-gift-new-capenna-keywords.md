---
id: p130
name: Offspring and Gift — Bloomburrow Bonus Mechanics
category: triggered
cr_refs: [702.175a, 702.175b, 702.174a, 702.174b, 702.174c, 702.174d, 702.174e]
tags: [offspring, gift, token, copy, 1/1, opponent-bonus, additional-cost, linked, ETB]
created: 2026-03-28
examples_count: 2
---

# P130 — Offspring and Gift — Bloomburrow Bonus Mechanics

## Abstract
Two mechanics from Bloomburrow that involve giving opponents bonuses as part of a deal. **Offspring** is an optional additional cost that creates a 1/1 copy of the creature when it enters. **Gift** is an optional additional cost that requires choosing an opponent — that opponent receives the gift (a token, card, extra turn, etc.) as a bonus, but the caster gets a larger or better effect for "gifting." Both are voluntary tradeoffs: pay more / give opponent something, get a better effect.

## The Definitive Rules

**CR 702.175a** (verbatim): *"'Offspring [cost]' means 'You may pay an additional [cost] as you cast this spell' and 'When this permanent enters, if its offspring cost was paid, create a token that's a copy of it, except it's 1/1.'"*

**CR 702.174a** (verbatim): *"Gift is a keyword that represents two abilities. The first ability is always 'As an additional cost to cast this spell, you may choose an opponent.'"*

**CR 702.174b** (verbatim): *"On a permanent, the second ability represented by gift is 'When this permanent enters, if its gift cost was paid, [effect].' On an instant or sorcery, the second ability is 'If this spell's gift cost was paid, [effect].'"*

## The Pattern

```
OFFSPRING:
  Optional additional cost: pay the offspring cost
  ETB trigger: if offspring was paid, create a 1/1 token copy of the permanent
  The token is a copy of the original EXCEPT it's 1/1 (P/T overridden to 1/1)
  Otherwise: the token has all the same abilities, colors, types, keywords

  Token is 1/1: power/toughness is 1/1 regardless of the original
  Token inherits all other characteristics: useful for abilities but fragile for combat

OFFSPRING + TOKEN DOUBLERS:
  Doubling Season doubles the number of tokens created (2 tokens instead of 1)
  Anointed Procession also doubles
  Each token is a 1/1 copy

OFFSPRING + MULTIPLE INSTANCES (702.175b):
  Each instance is paid separately → each triggers separately
  Each can create a separate 1/1 token copy

GIFT:
  Optional additional cost: choose an opponent (the "gift was promised")
  The spell/permanent has a linked bonus effect that fires if gift was paid
  That effect often benefits the opponent slightly: "they draw a card" / "they create a Food"
  But in exchange, YOUR effect becomes much better

GIFT VARIANTS:
  "Gift a Food": chosen opponent creates a Food token
  "Gift a card": chosen opponent draws a card
  "Gift a Treasure": chosen opponent creates a Treasure token
  "Gift an extra turn": chosen opponent takes an extra turn (powerful opponent bonus)
  Each is a linked effect defined in 702.174d-k

GIFT + "IF GIFT WAS PROMISED" TARGETING (702.174m):
  If the gift-contingent part of the effect includes targets:
  Those targets are only chosen if the gift WAS promised
  Can't target for a bonus you're not paying for

GIFT TIMING:
  On permanents: ETB trigger fires "if its gift cost was paid"
  On instants/sorceries: "if this spell's gift cost was paid" — checked at resolution
  Gift effect happens before other spell effects (702.174j for instants/sorceries)
```

## Definitive Conclusions

- **Offspring: pay more → ETB creates a 1/1 copy of the creature.** Token has all abilities but is 1/1.
- **Gift: choose an opponent (additional cost) → opponent gets a gift → you get a better effect.**
- **Gift is an opponent-reward tradeoff design** — sometimes worth giving the opponent a Food to get your bonus.
- **Gift effect resolves before the rest of the spell** for instants/sorceries.
- **Token doublers apply to offspring tokens** — Doubling Season creates two 1/1 tokens.

## Canonical Example
**Ral, Crackling Wit (Offspring {2}):**
Pay {2} extra offspring cost. Ral enters. ETB: create a 1/1 token copy of Ral.
The 1/1 token has Ral's planeswalker abilities but is a 1/1 (so if it's a planeswalker, it has 1 loyalty? Actually — offspring overwrites P/T but planeswalkers have loyalty, not P/T. The token would have the default entry loyalty from copying).
For creature offspring: clearly a 1/1 creature token copy.

**Example 2 — Gift a Food:**
You cast a "Gift a Food" spell, choosing an opponent. The opponent creates a Food token.
In exchange, your spell's effect is improved (e.g., draw 3 instead of 2, or create 3 tokens instead of 2).
The opponent might spend 2 mana to sacrifice the Food and gain 3 life — a minor benefit — but you got the larger effect.

## Commonly Confused With
- **P061 (Encore)** — Encore creates per-opponent token copies that attack; offspring creates a single 1/1 copy.
- **P086 (Devour)** — Devour sacrifices your own creatures for counters; offspring creates tokens in exchange for mana.
- **P125 (Bargain)** — Bargain sacrifices your own permanent for a bonus. Gift gives the opponent something for your bonus. Both are "pay something extra to improve the spell."
