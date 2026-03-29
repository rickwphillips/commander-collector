---
id: p171
name: Encore — Create Haste Tokens Attacking Each Opponent
category: zones
cr_refs: [702.141a]
tags: [encore, graveyard, token, haste, opponent, exile, sorcery-speed, Commander-Legends, combat]
created: 2026-03-28
examples_count: 2
---

# P171 — Encore — Create Haste Tokens Attacking Each Opponent

## Abstract
Encore is a graveyard activated ability: pay the encore cost plus exile the card from your graveyard. For each opponent, create a tapped-and-attacking token copy of the card. Tokens gain haste and are sacrificed at the beginning of the next end step. In a 4-player Commander game, encore creates 3 tokens (one per opponent), each attacking a different opponent. The original card is exiled — encore is a one-time use. This is similar to myriad (each opponent gets a copy attacking them) but is an activated ability from the graveyard rather than a triggered combat ability.

## The Definitive Rules

**CR 702.141a** (verbatim): *"Encore is an activated ability that functions while the card with encore is in a graveyard. 'Encore [cost]' means '[Cost], Exile this card from your graveyard: For each opponent, create a token that's a copy of this card that attacks that opponent this turn if able. The tokens gain haste. Sacrifice them at the beginning of the next end step. Activate only as a sorcery.'"*

## The Pattern

```
ENCORE:
  Activated graveyard ability: [cost] + exile this card from graveyard
  Effect: for each opponent, create a tapped-and-attacking copy token
  Tokens gain haste
  Sacrifice tokens at beginning of next end step
  Sorcery speed only

  ENCORE + OPPONENT COUNT:
    1v1: one token (attacking that opponent)
    3-player game: two tokens (one per opponent)
    4-player Commander: three tokens (one per opponent)
    Encore scales with number of opponents

  ENCORE + ETB:
    Tokens are copies of the card → they enter the battlefield
    ETB triggers fire for each token!
    A creature with "when this enters, draw a card" encore'd in Commander: draws 3 cards (3 tokens ETB)
    Very powerful with ETB-heavy creatures

  ENCORE + COMBAT DAMAGE:
    Tokens attack → deal damage to each opponent
    "Whenever this deals combat damage to a player" triggers fire for each token
    Multiple opponents each take damage and trigger abilities

  ENCORE VS MYRIAD:
    Myriad: creates tokens for OTHER opponents (not the one you're attacking normally)
    Encore: creates tokens for EACH opponent (including where you'd normally attack)
    Myriad is a combat trigger; encore is a graveyard activation
    Both create multiple tokens attacking different opponents and exile at end of combat

  ENCORE + SELF-EXILE:
    The card itself is exiled from graveyard — one-time use (unlike retrace)
    After encore: card is permanently gone (unless someone retrieves it from exile)

  ENCORE + TAPPED TOKENS:
    Tokens enter "tapped and attacking" — they're already in attack position
    "If able" to attack — if some effect prevents attacking (e.g., can't attack this turn), they don't attack but are still created
    Tokens don't need to be declared as attackers (like myriad tokens)

  ENCORE CARDS (Commander Legends):
    Torment of Hailfire encore: for each opponent, they discard a card, sacrifice a nonland, or lose 3 life
    But wait: Torment is a sorcery, not a creature — can you encore non-creatures?
    Encore is on some non-creature cards too? Let me check.
    CR says "create a token that's a copy of this card" — for non-creatures, you'd create a non-creature token
    Actually: encore was designed for creatures in Commander Legends
    Cards with encore: Triplicate Titan, Jeweled Lotus (no, that's different)
    Exemplar of Strength, Mana Drain encore: these are creature-focused
```

## Definitive Conclusions

- **Encore creates one token per opponent**, each attacking that opponent, all with haste.
- **ETB triggers fire** for each created token.
- **The card is exiled after encore** — one-time use.
- **Sorcery speed only** — must be main phase with empty stack.
- **Scales powerfully with number of opponents** — strongest in multiplayer.

## Canonical Example
**Triplicate Titan (Encore {6}) — 9/9, Vigilance, Flying, Trample:**
Cast normally: 9/9 with three evasion keywords.
Triplicate Titan dies. Encore: pay {6} + exile from graveyard.
In 4-player Commander: create 3 tokens, each a copy of Triplicate Titan (9/9, vigilance, flying, trample), each attacking a different opponent, with haste.
Three 9/9 flying tramplers attack simultaneously: each opponent takes 9 damage from flying, trampleing damage.
Sacrifice at end step — but the damage is already done.

**Example 2 — Torment of Hailfire (Sorcery, Encore?) and a hypothetical ETB creature:**
Imagine a 4/4 creature with "when this enters, deal 2 damage to any target" and encore {4}.
Encore in 3-player game: create 2 tokens, each enters → 2 ETB triggers → deal 2 damage to any target twice.
Also: each token attacks an opponent → 4 combat damage to each.
Total: 2 × 2 ETB damage + 4 × 2 combat damage = 4 + 8 = 12 damage across the board for one activation.

## Commonly Confused With
- **P162 (Myriad)** — Myriad creates tokens attacking OTHER opponents during combat. Encore creates tokens for ALL opponents from the graveyard.
- **P163 (Retrace)** — Retrace can be used repeatedly. Encore exiles the card — one use only.
- **P082 (Unearth)** — Unearth returns one creature temporarily. Encore creates multiple tokens per opponent.
