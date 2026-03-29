---
id: p073
name: Jump-Start — Discard-as-Cost Graveyard Cast
category: costs
cr_refs: [702.133a]
tags: [jump-start, graveyard, discard, additional-cost, instant, sorcery, exile-on-leave, flashback-comparison]
created: 2026-03-28
examples_count: 2
---

# P073 — Jump-Start — Discard-as-Cost Graveyard Cast

## Abstract
Jump-start lets you cast an instant or sorcery from your graveyard by discarding a card as an additional cost. Unlike flashback (which uses an alternative cost), jump-start is an additional cost on top of the normal mana cost. Like flashback, the spell is exiled when it leaves the stack — whether it resolves or is countered. The discarded card goes to the graveyard (triggering madness, if applicable). Jump-start can only be used once (exile on leave-stack).

## The Definitive Rule

**CR 702.133a** (verbatim): *"Jump-start appears on some instants and sorceries. It represents two static abilities: one that functions while the card is in a player's graveyard and another that functions while the card is on the stack. 'Jump-start' means 'You may cast this card from your graveyard if the resulting spell is an instant or sorcery spell by discarding a card as an additional cost to cast it' and 'If this spell was cast using its jump-start ability, exile this card instead of putting it anywhere else any time it would leave the stack.' Casting a spell using its jump-start ability follows the rules for paying additional costs in rules 601.2b and 601.2f–h."*

## The Pattern

```
JUMP-START STRUCTURE:
  Two abilities:
  1. Graveyard ability: may cast from graveyard if you discard a card (additional cost)
  2. Stack ability: exile this instead of putting it anywhere when it leaves the stack

JUMP-START VS. FLASHBACK:
  Flashback: alternative cost (REPLACES mana cost), exile on leave-stack
  Jump-start: additional cost (ADDS to mana cost), exile on leave-stack
  Flashback: pay [flashback cost] OR normal cost (usually different costs)
  Jump-start: pay [normal mana cost] PLUS discard a card
  → Jump-start costs are additive; flashback replaces

DISCARD AS COST:
  The discard is paid WHEN casting (as part of total cost declaration)
  The discarded card goes to graveyard (normal discard destination)
  → Can trigger madness on the discarded card (P033)
  → Can trigger cycling-like synergies if the discarded card has those abilities

EXILE ON LEAVE-STACK:
  Jump-start spells are exiled when leaving the stack (regardless of reason)
  Countered: exiled (same as flashback)
  Resolved: exiled
  Stifle on the exile replacement? No — the exile-on-leave-stack is a static ability
    (It's part of how the spell resolves/leaves, not a triggered ability)
  Actually: "exile instead of putting it anywhere else any time it would leave the stack"
    This is a replacement effect for leaving the stack
    → The card goes to exile, not graveyard, when it would leave the stack
  Can only jump-start once (exiled after)

DISCARD A CARD:
  "A card" — any card from hand
  Can discard a land, a spell, another jump-start card
  The discarded card's properties matter (madness, cycling, etc.)
  Discarding the same card repeatedly: if it's in graveyard and hand, discard the hand copy
    (Must discard from HAND as part of the cost)

TIMING:
  Jump-start respects the spell's original timing:
  Instant: can be cast any time you have priority
  Sorcery: main phase, stack empty (normal sorcery timing)
```

## Definitive Conclusions

- **Jump-start is an additional cost:** pay normal mana cost PLUS discard a card from hand.
- **The jump-start spell is exiled when it leaves the stack.** Can't be jump-started again.
- **The discarded card goes to graveyard.** Triggers madness, looting synergies, etc.
- **Countered jump-start spells are still exiled** (same as flashback).
- **Timing follows the original spell type** (instant vs. sorcery).

## Canonical Example
**Risk Factor (jump-start):**
Risk Factor is in your graveyard. During your turn: pay {2}{R} + discard a card from hand. Risk Factor is cast from graveyard. If countered: exiled (can't use again). If it resolves: opponent chooses between taking 4 damage or you drawing 3 cards. Either way, Risk Factor is exiled. You discarded one card to get to cast it again.

**Example 2 — Jump-start + Madness:**
You have a card with madness in hand. You jump-start Risk Factor, discarding the madness card as the cost. Madness triggers: the discarded card is exiled instead of going to graveyard. Madness trigger fires — you may cast the madness card for its madness cost. Both happen simultaneously: Risk Factor resolves normally, and you get to cast the madness card.

## Commonly Confused With
- **P046 (Flashback)** — Flashback is alternative cost; jump-start is additional cost. Both exile on leave-stack. Flashback cost is printed separately; jump-start always adds the discard.
- **P033 (Madness)** — Discarding to pay jump-start cost triggers madness on the discarded card. The discard is a real discard.
