---
id: p052
name: Scry and Surveil — Library Manipulation Mechanics
category: stack
cr_refs: [701.22a, 701.22b, 701.22c, 701.22d, 701.25a, 701.25b, 701.25c, 701.25d]
tags: [scry, surveil, library, graveyard, top-deck, order, trigger, zero-scry, zero-surveil]
created: 2026-03-28
examples_count: 2
---

# P052 — Scry and Surveil — Library Manipulation Mechanics

## Abstract
Scry and Surveil are keyword actions that let a player look at the top N cards of their library and rearrange them. Scry puts unwanted cards on the bottom (in any order) and keeps the rest on top (in any order). Surveil puts unwanted cards into the graveyard instead of the bottom. Both mechanics trigger "whenever you scry/surveil" abilities AFTER the process completes. Instructing a player to scry 0 or surveil 0 is a non-event — no ability fires. Both are one-at-a-time player actions in APNAP order when multiple players scry simultaneously.

## The Definitive Rule

**CR 701.22a** (verbatim): *"To 'scry N' means to look at the top N cards of your library, then put any number of them on the bottom of your library in any order and the rest on top of your library in any order."*

**CR 701.22b** (verbatim): *"If a player is instructed to scry 0, no scry event occurs. Abilities that trigger whenever a player scries won't trigger."*

**CR 701.22c** (verbatim): *"If multiple players scry at once, each of those players looks at the top cards of their library at the same time. Those players decide in APNAP order (see rule 101.4) where to put those cards, then those cards move at the same time."*

**CR 701.25a** (verbatim): *"To 'surveil N' means to look at the top N cards of your library, then put any number of them into your graveyard and the rest on top of your library in any order."*

**CR 701.25c** (verbatim): *"If a player is instructed to surveil 0, no surveil event occurs. Abilities that trigger whenever a player surveils won't trigger."*

## The Pattern

```
SCRY N:
  1. Look at top N cards of your library (private — you don't reveal)
  2. Put any number on the BOTTOM in any order
  3. Put the rest on TOP in any order
  → Result: unwanted cards on bottom, desired cards on top in chosen order

SURVEIL N:
  1. Look at top N cards of your library (private — you don't reveal)
  2. Put any number into your GRAVEYARD
  3. Put the rest on TOP in any order
  → Result: unwanted cards milled, desired cards on top in chosen order

KEY DIFFERENCES:
  Scry: bad cards go to BOTTOM (still in library, comes back after shuffle)
  Surveil: bad cards go to GRAVEYARD (enables graveyard synergies, never loops back)
  Both: top cards in any order of your choice

ZERO-SCRY / ZERO-SURVEIL:
  Scry 0: no event occurs, no triggers fire (CR 701.22b)
  Surveil 0: no event occurs, no triggers fire (CR 701.25c)
  Important: "Scry 1 then draw" effects — if somehow scry becomes 0 via replacement, no trigger

TRIGGER TIMING:
  Triggered abilities fire AFTER the process is complete (CR 701.22d, 701.25d)
  Example: "Whenever you scry, draw a card" — draw resolves after scry is fully done
  This prevents looking at the card drawn while deciding where to put scried cards

SIMULTANEOUS SCRY (multiple players):
  All players look at their own top cards SIMULTANEOUSLY (CR 701.22c)
  Decisions made in APNAP order (active player first)
  Cards move simultaneously after all players decide
  → Active player's decision first, but no one can see opponent's choices while deciding

LIBRARY SMALLER THAN N:
  Scry N when library has < N cards: look at all remaining cards, order among top/bottom as applicable
  Surveil N when library has < N cards: same — look at all remaining cards
  Not an illegal action — just affects fewer cards

INFORMATION:
  Scrying is private — you don't reveal the cards to opponents unless effect says so
  Surveiling is also private — opponents don't see what you mill (unless effect says so)
  However, opponents see how many cards went to top vs. bottom/graveyard
```

## Definitive Conclusions

- **Scry puts cards on top or bottom; surveil puts them on top or into the graveyard.** Key distinction: graveyard vs. library bottom.
- **Scry 0 and surveil 0 are non-events.** No triggers fire.
- **Triggers fire AFTER the full scry/surveil is complete,** not mid-process.
- **Multiple simultaneous scryers look at the same time** but decide in APNAP order.
- **Both are private.** Opponents see the count of moved cards, not their identities.

## Canonical Example
**Opt (scry 1, then draw):**
Cast Opt. Scry 1: look at top card. It's a land — put it on the bottom. Or it's a counterspell — put it on top. Then draw a card. If you put the land on top, you draw the land. If you put it on bottom, you draw the next card (unknown). Triggers for "whenever you scry" fire after the scry, before the draw (since the draw is a separate instruction following scry).

**Example 2 — Surveil synergy:**
Cast Chart a Course (surveil 2 variant). Surveil 2: look at top 2 cards. One is Creeping Chill (reveals itself, deals 3 damage, gains 3 life when it's milled). Put Creeping Chill in the graveyard — its triggered ability fires. Put the other card on top. Surveil trigger fires: "whenever you surveil" → draw a card.

## Commonly Confused With
- **P051 (Dredge)** — Dredge also mills from the library but is a replacement for drawing, not a keyword action. Surveil deliberately mills; dredge mills as a side effect of returning a card.
- **P005 (Simultaneous Event Ordering)** — When multiple players scry simultaneously, decisions are made in APNAP order but cards move simultaneously.
