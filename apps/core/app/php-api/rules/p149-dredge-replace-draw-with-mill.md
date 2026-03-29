---
id: p149
name: Dredge — Replace Draw with Mill and Return
category: replacement
cr_refs: [702.52a]
tags: [dredge, draw-replacement, mill, graveyard, graveyard-synergy, ravnica, loam, self-mill]
created: 2026-03-28
examples_count: 2
---

# P149 — Dredge — Replace Draw with Mill and Return

## Abstract
Dredge is a static ability that functions in the graveyard. When you would draw a card, you may instead mill N cards and return the dredge card to your hand. This is a draw replacement — you skip the draw entirely and get the dredge card back plus N more cards in your graveyard. It only works if you have at least N cards in your library. The mechanic is a graveyard engine: the dredge card never truly goes away, and milling fills the graveyard for other synergies (flashback, delve, reanimation, etc.).

## The Definitive Rules

**CR 702.52a** (verbatim): *"Dredge is a static ability that functions only while the card with dredge is in a player's graveyard. 'Dredge N' means 'As long as you have at least N cards in your library, if you would draw a card, you may instead mill N cards and return this card from your graveyard to your hand.'"*

## The Pattern

```
DREDGE:
  Replacement effect: "if you would draw a card" → "instead mill N + return this from graveyard to hand"
  Trigger condition: you would draw a card AND dredge card is in your graveyard AND you have ≥ N cards in library
  Optional: "you may" — you can still draw normally instead

  DREDGE REPLACES EXACTLY ONE DRAW:
    You choose: "draw a card" → either normal draw OR dredge
    Each dredge replacement covers one draw event
    If you draw multiple cards (e.g., Brainstorm): each draw is a separate event
    You can dredge for some and draw normally for others

  DREDGE + MULTIPLE DREDGE CARDS:
    If you have multiple dredge cards in graveyard:
    Each draw → choose which dredge to use (or draw normally)
    Life from the Loam (Dredge 3) + Darkblast (Dredge 1) in graveyard:
      On a Magmatic Insight draw: "dredge Loam? dredge Darkblast? draw normally?"
    Only one dredge replacement per draw event

  DREDGE AS GRAVEYARD ENGINE:
    Dredge cards return to hand → cast → go to graveyard → dredge again → infinite loop
    Life from the Loam: 3-mana sorcery, returns 3 lands → Dredge 3 on next draw → returns 3 lands again...
    The dredge card functions as a repeating loop (as long as you have cards to mill)

  DREDGE + DISCARD:
    Discarding a dredge card into graveyard: now it's ready to dredge
    Common combo: discard with Faithless Looting/Cathartic Reunion → dredge next turn
    The discard is intentional to SET UP dredging

  DREDGE + FETCHLANDS:
    Fetchlands cause a draw? No — sacrifice for land is not a draw.
    But "Cycling" causes a draw → can be dredged
    Looting spells (draw then discard): the draw from looting CAN be replaced with dredge

  DREDGE + LIBRARY MINIMUM:
    If you have fewer cards than the dredge N: can't use dredge
    Dredge 6 (Golgari Grave-Troll): needs 6+ cards in library
    Late-game: dredge becomes unavailable if library is too small

  DREDGE SPEED:
    Deck of 60 cards → Golgari Grave-Troll (Dredge 6) → mills 6 per draw
    10 dredges → mill 60 cards = entire deck
    Competitive "dredge" decks fill graveyard with Narcomoeba, Bloodghast, Prized Amalgam, etc.
    Vengevine trigger: return from graveyard when 2 creatures cast
    Prized Amalgam: return from graveyard at end of turn if a creature entered from graveyard

DREDGE IMPORTANT RESTRICTION:
  Dredge does NOT let you draw during opponent's turn (you're not drawing unless forced or allowed)
  Dredge only triggers when YOU would draw
  Surveil, scry: not draws, not dredgeable
  Impulse (look at top N, put one in hand): not a draw → can't dredge
```

## Definitive Conclusions

- **Dredge replaces ONE draw per activation** — you mill N and return the dredge card to hand.
- **Optional** — you can choose to draw normally instead.
- **Requires ≥ N cards in library** — can't use dredge when library is small enough.
- **The dredge card cycles between hand, graveyard, and hand** — enables a self-mill engine.
- **Each draw is a separate replacement event** — multiple dredges in graveyard can cover separate draws.

## Canonical Example
**Golgari Grave-Troll (Dredge 6):**
Cast Cathartic Reunion (discard 2 to draw 3). Discard Golgari Grave-Troll.
Next turn's draw: replace draw → mill 6 cards, return Grave-Troll to hand.
Cast Grave-Troll from hand → enters with 4 +1/+1 counters (from creatures in graveyard).
Sac or let it die → Dredge 6 again next draw. The engine repeats.

**Example 2 — Life from the Loam (Dredge 3):**
Cast Life from the Loam (3-mana sorcery): return 3 lands from graveyard to hand.
Put Life from the Loam in graveyard → next draw: dredge 3, return Loam to hand.
Re-cast Loam, return 3 more lands, mill 3 more. Repeat every turn.
Combine with cycling lands (Forgotten Cave, etc.): cycle lands to graveyard, get them back, dredge more.

## Commonly Confused With
- **P048 (Emerge)** — Emerge sacrifices creatures to cast a spell. Dredge replaces drawing.
- **P082 (Unearth)** — Unearth brings creatures from graveyard to battlefield temporarily. Dredge returns the dredge card itself to HAND.
- **P146 (Suspend)** — Suspend exiles and delays a cast. Dredge cycles cards through the graveyard.
