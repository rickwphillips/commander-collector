---
id: p163
name: Retrace — Cast from Graveyard by Discarding a Land
category: zones
cr_refs: [702.81a]
tags: [retrace, graveyard, discard-land, additional-cost, recurring, Shadowmoor, Oona-Land, Flame-Jab]
created: 2026-03-28
examples_count: 2
---

# P163 — Retrace — Cast from Graveyard by Discarding a Land

## Abstract
Retrace is a static graveyard ability: you may cast the card from your graveyard by discarding a land card as an additional cost. The spell goes to the graveyard after resolving (normal for spells unless something else intervenes), so you can retrace again next turn if you discard another land. This creates a recurring engine in land-heavy or loam-based strategies: you keep paying with excess lands to cast the same spell repeatedly. Unlike flashback (which exiles), retrace goes to graveyard → ready to retrace again.

## The Definitive Rules

**CR 702.81a** (verbatim): *"Retrace is a static ability that functions while the card with retrace is in a player's graveyard. 'Retrace' means 'You may cast this card from your graveyard by discarding a land card as an additional cost to cast it.' Casting a spell using its retrace ability follows the rules for paying additional costs in rules 601.2b and 601.2f–h."*

## The Pattern

```
RETRACE:
  Static graveyard ability: while in graveyard, can cast by paying normal cost + discard a land
  After resolving: goes to graveyard again (not exiled like flashback)
  Result: can retrace again next turn (if you have another land to discard)

  RETRACE + LAND DISCARD:
    Must discard a LAND CARD (not just any card, not a land on the battlefield)
    The land goes from your hand to the graveyard
    Landfall decks often have excess lands to discard
    Life from the Loam (Dredge 3) recovers lands → feeding retrace repeatedly

  RETRACE + TIMING:
    Still follows normal casting rules: sorcery at sorcery speed, instant at instant speed
    Additional cost is just the land discard (on top of regular mana cost)

  RETRACE + LAND DROP SYNERGY:
    Retrace rewards having more lands than you need
    Fetchlands in hand: discard to retrace (they're land cards, even if not played)
    Note: lands on battlefield can't be discarded — only land CARDS from hand

  RETRACE VS FLASHBACK:
    Flashback: exiles instead of going to graveyard → one use
    Retrace: goes to graveyard → can use again next turn (with another land)
    Retrace is repeatedly castable; flashback is once-per-card

  RETRACE + CYCLING LANDS:
    Cycling lands (Forgotten Cave etc.) can be cycled to fill graveyard
    Then Life from the Loam gets them back → discard to retrace again
    Loam + retrace = powerful recursive engine

  RETRACE + DREDGE:
    Retrace spell in graveyard: dredge Loam to return lands
    Cast retrace spell (discard a land)
    Next turn: dredge Loam again to return more lands
    Repeating cycle

RETRACE CARDS:
  Flame Jab (retrace): deal 1 damage to target creature or player, retrace discard land
    → deal 1 damage per land discarded, every turn
    In Commander: slow but recurring burn
  Oona's Grace (retrace, draw): draw a card, retrace discard land
    → draw a card per land, every turn (expensive but flexible)
  Worm Harvest (retrace): create Worm tokens equal to lands in graveyard
    → grows over time as lands fill graveyard
```

## Definitive Conclusions

- **Retrace requires discarding a land card** as an additional cost — not free.
- **Goes to graveyard after resolving** — can be retraced again next turn with another land.
- **Different from flashback** — flashback exiles after use; retrace stays in graveyard.
- **Pairs with Life from the Loam** — Loam recovers lands to feed retrace engines.
- **Only land cards from hand** can be discarded — not lands on the battlefield.

## Canonical Example
**Flame Jab (Retrace — {R}):**
Cast normally for {R}: deal 1 damage to target creature or player.
It goes to graveyard. Next turn: discard a land + pay {R} → cast Flame Jab from graveyard → deal 1 more damage → back to graveyard.
With Life from the Loam recovering lands each turn: endless 1-damage pings.
Classic Commander control tool: slowly ping down opponents or kill small creatures each turn.

**Example 2 — Worm Harvest (Retrace — {3}{B/G}{B/G}):**
Create X 1/1 Worm tokens where X = number of lands in your graveyard.
Play fetchlands, sacrifice them (lands in graveyard grow). Use Loam to put them back AND trigger retrace.
After 8 fetchland sacrifices: Worm Harvest for 8 Worms. Retrace next turn for another 8 (assuming more lands added).
Worm army grows each iteration.

## Commonly Confused With
- **P163 vs Flashback** — Flashback also lets you cast from graveyard, but exiles after use. Retrace stays in graveyard for repeated use.
- **P149 (Dredge)** — Dredge replaces drawing. Retrace casts from the graveyard. Both work in graveyard-based strategies.
- **P128 (Plot)** — Plot exiles to cast for free later. Retrace stays in graveyard and costs mana + a land each use.
