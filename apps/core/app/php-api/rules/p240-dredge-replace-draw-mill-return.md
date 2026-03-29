---
id: p240
name: Dredge — Replace Drawing With Milling to Return From Graveyard
category: zones
cr_refs: [702.52a, 702.52b]
tags: [dredge, graveyard, mill, draw-replacement, Ravnica, Golgari, Stinkweed-Imp, Golgari-Grave-Troll, Life-from-the-Loam, dredge-combo]
created: 2026-03-28
examples_count: 2
---

# P240 — Dredge — Replace Drawing With Milling to Return From Graveyard

## Abstract
Dredge is a static ability that functions in the graveyard: whenever you would draw a card, you may instead mill N cards and return the Dredge card to your hand. This trades drawing a card for milling N cards while recovering the Dredge card for repeated use. The power is recursive: dredge cards can be used again and again each draw step (or any time you'd draw), as long as you have enough cards in library to mill. Dredge enables powerful graveyard synergies — Dredge decks fill their graveyards with creatures, enablers, and combo pieces while repeatedly cycling dredge cards back to hand. It's one of the most powerful graveyard mechanics ever printed and spawned dedicated "Dredge" archetypes in Legacy, Vintage, and Modern.

## The Definitive Rules

**CR 702.52a** (verbatim): *"Dredge is a static ability that functions only while the card with dredge is in a player's graveyard. 'Dredge N' means 'As long as you have at least N cards in your library, if you would draw a card, you may instead mill N cards and return this card from your graveyard to your hand.'"*

**CR 702.52b** (verbatim): *"A player with fewer cards in their library than the number required by a dredge ability can't mill any of them this way."*

## The Pattern

```
DREDGE:
  Static ability: functions only while the card is in your GRAVEYARD
  Any time you would draw a card: may choose to dredge instead
  Cost: mill N cards (mill = put top N cards of library into GY)
  Benefit: return the dredge card from GY to hand (instead of drawing)
  Net: +1 card to hand (the dredge card) + N cards into GY instead of drawing 1 card

DREDGE + DRAW REPLACEMENT:
  Draw step: you would draw 1 card → choose to dredge → mill N, return dredge card to hand
  Net: drew 0 cards but have dredge card in hand AND milled N cards into GY
  The dredge card is already in hand — can be dredged AGAIN next draw step
  (if it's in the GY, which requires it to be discarded or self-milled)

DREDGE + REPEATED USE:
  To use dredge again: the dredge card must be IN THE GRAVEYARD
  If you keep it in hand: it's not in GY → can't dredge
  Strategy: discard the dredge card (via looting/cycling) to get it back in GY
  Then next draw step: dredge again
  Or: use multiple dredge cards in hand, alternating discards + dredges

DREDGE + LIBRARY SIZE:
  Must have at least N cards in library to dredge
  Dredge 6 (Golgari Grave-Troll): need 6+ cards in library
  As library thins: dredge becomes unavailable when too few cards remain
  If you have 5 cards left and need to Dredge 6: can't use dredge this draw

DREDGE + MILLING SYNERGIES:
  Each dredge fills the GY with creatures, spells, enablers:
  Prized Amalgam: creature that returns from GY when another creature enters from GY
  Narcomoeba: creature that enters battlefield from GY when milled
  Bloodghast: creature that returns from GY when you play a land
  Creeping Chill: deals 3 damage and gains 3 life when milled with dredge
  Conflagrate: sorcery that deals N damage, discardable for X/X split damage
  ALL these trigger off being milled or entering GY: dredge feeds them

DREDGE CARDS (most powerful):
  Golgari Grave-Troll ({4}{G}): 0/N troll (N = number of creature cards in GY), Dredge 6
    Dredge 6: mill 6, return Troll. In a dredge deck, mills 6 into GY every draw step.
    The Troll's power scales with GY size: after dredging, often a 10/10+ regenerating troll.

  Stinkweed Imp ({2}{B}): 1/2 flying, Dredge 5, "Whenever Stinkweed Imp deals combat damage to a creature, destroy that creature."
    Dredge 5: the most mana-efficient dredge card (mana value 3, dredge 5).
    Milled Stinkweed imps: 5 cards per draw step, extremely efficient GY filling.

  Life from the Loam ({1}{G}): Sorcery, "Return up to three target land cards from your GY to your hand," Dredge 3.
    Dredge 3 + returns lands: fuel hand and GY simultaneously.
    Combines with cycling lands (Forgotten Cave, etc.) to draw AND dredge each turn.
    Loam + cycling lands = card advantage engine independent of normal draws.

  Golgari Thug ({1}{B}): 1/1, Dredge 4, "when goes to GY from battlefield, put target creature from your GY on top of library."
    Put Grave-Troll on top → next draw → dredge Troll → mill 6 → more GY creatures.

DREDGE DECK ARCHITECTURE:
  Primary dredgers: Stinkweed Imp, Grave-Troll, Life from the Loam
  GY payoffs: Prized Amalgam, Narcomoeba, Bloodghast, Creeping Chill
  Enablers: Faithless Looting (draw 2, discard 2 — puts dredgers into GY), Cathartic Reunion
  Win condition: build a board from GY (Amalgams, Bloodghasts) + direct damage (Creeping Chill)
  Modern Dredge deck: often kills turn 3-4 through GY synergies

DREDGE + ANTI-GRAVEYARD:
  Dredge is highly vulnerable to GY hate: Rest in Peace, Leyline of the Void, Grafdigger's Cage
  Rest in Peace: all cards that go to GY are exiled instead → dredge never mills anything into GY
  Leyline of the Void: same effect during your upkeep setup
  However: dredge cards still in hand → Loam can still return lands
  Life from the Loam + Leyline: Loam can't return lands from exile (they're not in GY)
  GY hate is the primary answer to Dredge decks
```

## Definitive Conclusions

- **Dredge replaces drawing**: mill N, return the dredge card to hand instead of drawing.
- **Can only dredge if you have N+ cards** in library (can't dredge below that threshold).
- **Repeated use**: discard the dredge card after returning it to hand, then dredge again next draw step.
- **Feeds GY synergies**: Narcomoeba, Prized Amalgam, Creeping Chill all trigger when milled.
- **GY hate is the answer**: Rest in Peace and Leyline of the Void shut dredge down completely.

## Canonical Example
**Modern Dredge Turn 1-3 Sequence:**
Hand: Faithless Looting, Stinkweed Imp, Creeping Chill.
Turn 1: Cast Faithless Looting — draw 2, discard 2 (discard Stinkweed Imp and another card).
Stinkweed Imp is now in GY.
Turn 2: Draw step — Stinkweed Imp is in GY: choose to Dredge 5 instead of drawing.
Mill 5 cards: put Prized Amalgam, Narcomoeba, Creeping Chill, Bloodghast, another card into GY.
Narcomoeba triggers: enters battlefield when milled.
Creeping Chill triggers: when milled, deals 3 damage to opponent, gain 3 life (for free!).
Prized Amalgam: returns from GY to battlefield (tapped) at end of turn because Narcomoeba entered.
Now have: Narcomoeba (1/1), Prized Amalgam (3/3 later), 3 damage done to opponent, Stinkweed Imp in hand.
Turn 3: Dredge Stinkweed Imp AGAIN (discard it during looting). Mill 5 more. Find Bloodghast.
Bloodghast: play a land → Bloodghast returns from GY.
Board: Narcomoeba, Prized Amalgam, Bloodghast, multiple free damage triggers.
Classic Dredge: massive board by turn 3, all from GY synergies.

**Example 2 — Life from the Loam + Cycling Lands:**
Life from the Loam ({1}{G}): Dredge 3 Sorcery.
Hand: Life from the Loam. GY: 3 lands including 2 cycling lands.
Cast Life from the Loam: return 3 lands to hand (including Forgotten Cave and Tranquil Thicket, both cyclers).
Next draw step: put Loam in GY (e.g., discard to Sorcerer's Strongbox), then Dredge 3.
Mill 3 cards, return Loam to hand. Use the cycling lands: cycle them for {1} each, draw 2 cards, cycling lands in GY again.
Next turn: Loam returns those cycling lands from GY to hand, cycle again.
This loop draws 2 cards per turn for minimal mana — Loam + cycling lands = raw card advantage engine.

## Commonly Confused With
- **P213 (Cycling)** — Cycling discards to draw a card; Dredge replaces drawing with milling + returning. Loam uses both: dredge to return, cycle to draw.
- **P211 (Flashback)** — Flashback casts from GY; Dredge returns the card to HAND (not to the stack for casting).
- **P228 (Unearth)** — Unearth is an activated ability to return a creature from GY to battlefield; Dredge replaces drawing and returns to hand.
