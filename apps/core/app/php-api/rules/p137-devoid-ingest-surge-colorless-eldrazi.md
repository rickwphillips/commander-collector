---
id: p137
name: Devoid, Ingest, and Surge — Eldrazi/Battle for Zendikar Keywords
category: continuous
cr_refs: [702.114a, 702.115a, 702.115b, 702.117a]
tags: [devoid, ingest, surge, colorless, exile, library, cost-reduction, battle-for-zendikar, eldrazi]
created: 2026-03-28
examples_count: 2
---

# P137 — Devoid, Ingest, and Surge — Eldrazi/Battle for Zendikar Keywords

## Abstract
Three mechanics from Battle for Zendikar block that work together. **Devoid** makes a card colorless despite its colored mana symbols (characteristic-defining ability, applies everywhere). **Ingest** exiles the top card of an opponent's library when the creature deals combat damage — fueling the "processors" mechanic. **Surge** is an alternative cost available if you or a teammate cast another spell this turn. Together, these create a mechanic ecosystem where dealing ingest damage → exiled cards → process those cards with Processors.

## The Definitive Rules

**CR 702.114a** (verbatim): *"Devoid is a characteristic-defining ability. 'Devoid' means 'This object is colorless.' This ability functions everywhere, even outside the game."*

**CR 702.115a** (verbatim): *"'Ingest' means 'Whenever this creature deals combat damage to a player, that player exiles the top card of their library.'"*

**CR 702.117a** (verbatim): *"'Surge [cost]' means 'You may pay [cost] rather than pay this spell's mana cost as you cast this spell if you or one of your teammates has cast another spell this turn.'"*

## The Pattern

```
DEVOID — COLORLESS DESPITE COLORED MANA COST:
  Characteristic-defining ability (CDA) → applies in layer 4
  The card has {U}{B} in its mana cost but is COLORLESS because devoid says so
  Color identity in Commander: devoid cards still have the mana symbol's color in their identity
    (Color identity uses mana symbols, not color — devoid doesn't change color identity)
  Protection from blue: works vs devoid cards? Devoid card is colorless → protection from blue doesn't apply
  Protection from colorless: protects against devoid cards

  DEVOID + PROTECTION FROM COLORLESS:
    Devoid creature tries to deal damage to creature with protection from colorless:
    Protection prevents the damage, blocks, targeting → devoid creature can't get through

INGEST — TOP CARD EXILE ON DAMAGE:
  Each combat damage to a player → exile top card of their library
  This fuels "Processor" cards which require "exile a card an opponent owns from exile"
  Ingest deals no combat damage to the library cards themselves
  Important: "from your opponent's exile" → only cards that got there (from ingest or other effects)

  INGEST + MULTIPLE INGEST:
    Two ingest creatures each deal damage → two separate triggers → exile two cards
  INGEST DAMAGE TO PLANESWALKERS:
    Ingest says "deals combat damage to a player" → planeswalkers don't count
    Only player combat damage triggers ingest

SURGE — TEAM SPELL REDUCTION:
  Alternative cost: pay surge cost if YOU or a teammate cast another spell this turn
  You cast a spell first → the second spell can use surge cost
  Teammate (2HG or other team formats) cast a spell → your spell can use surge
  In 1v1: you need to cast a spell yourself first

  SURGE + INSTANT SPEED:
    Cast any cheap spell at instant speed → opponent's turn → your surge cost unlocks for another spell
    (During opponent's turn if you have priority)
  SURGE + CYCLING:
    Cycling activates a special cycling ability, but the CARD doesn't go on the stack as a spell
    Cycling is a spell ability activation? Actually cycling is an activated ability, not casting a spell
    → Cycling does NOT count as casting a spell for surge

  SURGE + FREE CASTS:
    A spell cast from a copy or for free: still "cast" → enables surge

DESIGN SYNERGY:
  Ingest → exile top library cards → Processors use those exiles for effects
  Surge → reward for playing multiple spells per turn (value/aggro payoff)
  Devoid → these cards appear in colored sets but interact with colorless-matters mechanics
```

## Definitive Conclusions

- **Devoid makes the card colorless** despite colored mana symbols. Color IDENTITY (Commander) still includes those symbols.
- **Ingest exiles top library card** when dealing combat damage to a player (not planeswalkers).
- **Surge unlocks a cheaper cost** if you or a teammate cast another spell this turn.
- **Cycling does NOT count as casting a spell** for surge purposes.
- **Protection from colorless stops devoid creatures.**

## Canonical Example
**Sludge Crawler (Ingest, {B}, Devoid):**
Sludge Crawler is colorless (devoid). Deals combat damage to opponent → exile the top card of their library.
That card is now in opponent's exile zone, controlled by opponent, but owned by opponent → Processors can "exile a card an opponent owns from exile" to get effects.
Processor example: Wasteland Strangler — exile a card an opponent owns from exile → put 3 -1/-1 counters on a creature.

**Example 2 — Surge:**
You cast a cantrip (Ponder) during your main phase. Now on the same turn: cast Crush of Tentacles (Surge {6}{U}).
Surge check: you cast a spell this turn (Ponder) → qualify → pay {6}{U} instead of {7}{U}.
Makes a 8/8 Octopus token and bounces all nonland permanents to hands.

## Commonly Confused With
- **P027 (Protection — DEBT)** — Protection from colorless specifically applies to devoid creatures.
- **P068 (Toxic)** — Ingest also triggers on combat damage to a player, similar to toxic (which gives poison counters). Both are "on combat damage to player" triggers.
- **P036 (Storm)** — Storm counts spells cast this turn; surge checks "another spell this turn." Similar conditions.
