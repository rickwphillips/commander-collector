---
id: p087
name: Retrace — Land Discard Graveyard Cast
category: costs
cr_refs: [702.81a]
tags: [retrace, graveyard, discard, land, additional-cost, repeatable, late-game]
created: 2026-03-28
examples_count: 2
---

# P087 — Retrace — Land Discard Graveyard Cast

## Abstract
Retrace lets you cast an instant or sorcery from your graveyard by discarding a land as an additional cost. Unlike jump-start (which exiles the card after), retrace does NOT automatically exile the card — after resolving, the spell goes back to the graveyard, where it can be retraced again. The only cost is discarding a land each time. This makes retrace cards infinitely repeatable as long as you have lands in hand, making them excellent in land-flooding scenarios.

## The Definitive Rule

**CR 702.81a** (verbatim): *"Retrace is a static ability that functions while the card with retrace is in a player's graveyard. 'Retrace' means 'You may cast this card from your graveyard by discarding a land card as an additional cost to cast it.' Casting a spell using its retrace ability follows the rules for paying additional costs in rules 601.2b and 601.2f–h."*

## The Pattern

```
RETRACE:
  Functions only in the graveyard
  Additional cost: discard a land (from hand)
  Timing: same as the original spell's type (instant = instant speed; sorcery = sorcery timing)

REPEATABLE NATURE:
  Retrace doesn't exile the spell after resolution
  After resolving: spell goes back to the graveyard
  Can be retraced again next time you have priority (and a land in hand)
  Truly repeatable — as long as lands are available

WHAT COUNTS AS "A LAND CARD"?
  Any card with the land type in your hand
  Basic lands, nonbasic lands, dual lands — all qualify
  NOT: cards that are currently lands via effects but aren't land cards
    (e.g., a Mishra's Bauble that became a land due to an effect — doesn't work)
  Land cards that are also other types (fetchlands, etc.) still count

COST IS ADDITIONAL:
  Pay normal mana cost + discard one land
  No interaction with "without paying its mana cost" effects eliminating the land discard
    (The land discard is ADDITIONAL to the mana cost — if mana is waived, land still required)
  Actually: cascade casts "without paying its mana cost" = alternative cost
    Additional costs on top of alternative costs are separate
    So retrace from cascade: free cast + discard a land (still discard land)

COUNTERED RETRACE:
  If countered: goes to graveyard (not exiled like flashback/jump-start)
  Can retrace again after being countered

LAND FLOOD STRATEGY:
  Late game: you've drawn many lands (excess mana)
  Retrace: discard excess lands for repeated spell effects
  Ideal for draw spells, disruption, removal — each cast costs one excess land
```

## Definitive Conclusions

- **Retrace is infinitely repeatable.** No exile after resolution — goes back to graveyard.
- **Additional cost: discard a land.** Must have a land in hand each time.
- **Even if countered, the spell returns to graveyard** and can be retraced again.
- **Timing follows the original spell type.**
- **Land flood becomes a resource** with retrace.

## Canonical Example
**Flame Jab (Retrace, {R} — deals 1 damage to target creature or player):**
Flame Jab in graveyard. You have 4 excess lands in hand. Pay {R}, discard a land: deal 1 damage. Flame Jab goes back to graveyard. Pay {R}, discard another land: deal 1 more damage. Repeat 4 times for 4 damage total (costs {4}{R} and 4 land cards). Each turn you play new lands can fuel more Flame Jab activations.

**Example 2 — Retrace vs. Jump-Start:**
Jump-start: discard any card (not just lands), but spell is exiled after use — one-time.
Retrace: discard specifically a land, but spell returns to graveyard — reusable.
The restriction (must be a land) is compensated by the repeatability.

## Commonly Confused With
- **P073 (Jump-Start)** — Jump-start discards any card (additional cost) and exiles the spell on leave-stack. Retrace discards only lands and doesn't exile — key differences.
- **P046 (Flashback)** — Flashback is alternative cost (replaces mana cost), exiles after. Retrace is additional cost, doesn't exile. Both are graveyard cast mechanics.
