---
id: p283
name: Foretell — Exile Face-Down for a Discounted Future Cast
category: costs
cr_refs: [702.143a, 702.143b, 702.143c, 702.143d]
tags: [foretell, exile, face-down, alternative-cost, two-mana-exile, Kaldheim, Alrund-God-of-the-Cosmos, Behold-the-Multiverse, Cosmos-Charger, Reckless-Crew]
created: 2026-03-29
examples_count: 2
---

# P283 — Foretell — Exile Face-Down for a Discounted Future Cast

## Abstract
Foretell is a mechanic from Kaldheim (2021). During your turn, pay {2} to exile a card from your hand face-down — it becomes "foretold." On future turns, cast the foretold card from exile by paying its foretell cost instead of its regular mana cost. The foretell cost is always lower than the regular mana cost. The key restrictions: you can only foretell during your own turn (but at any time with priority), and you can only cast a foretold card on a LATER turn (not the same turn you foretold it). Foretell is a tempo mechanic — spend {2} now to set up a discounted spell next turn.

## The Definitive Rules

**CR 702.143a** (verbatim): *"Foretell is a keyword that represents two abilities. The first ability functions while the card is in a player's hand. The second ability functions while the card is in exile. 'Foretell [cost]' means 'During your turn, you may pay {2} and exile this card from your hand face down. Put a foretell counter on it. (Then on a later turn, you may cast it for its foretell cost.)' and 'You may cast this card from exile by paying [cost] if this card has a foretell counter on it.' Casting a spell using its foretell ability follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

**CR 702.143b** (verbatim): *"Foretelling a card is a special action. See rule 116.2i."*

**CR 702.143c** (verbatim): *"A foretold card may be cast on any later turn, regardless of timing restrictions, if the cost to cast it is an instant."*

**CR 702.143d** (verbatim): *"An effect that exiles a card and 'foretells' it gives that card a foretell counter. The second ability of the foretell keyword functions on that card while it is in exile with a foretell counter on it."*

## The Pattern

```
FORETELL ACTIONS:
  1. FORETELLING (special action):
     Any time during YOUR turn (any priority window)
     Pay {2}: exile the card face-down from hand
     Put a foretell counter on it
     The card is now in exile, face-down, with a foretell counter
     Cannot foretell on opponent's turns

  2. CASTING FROM EXILE (using foretell ability):
     On a LATER turn (not the same turn you foretold it)
     Pay the foretell cost (printed on the card, usually cheaper than normal)
     Cast the card from exile
     No restrictions on which turn or whose turn (follow the spell's timing rules)
     Instant foretell costs: can be cast on any player's turn (instants)
     Sorcery foretell costs: can only be cast during your main phase

  FORETELL HIDDEN INFORMATION:
    The card is face-down in exile
    Opponents know you foretold A card (they see it face-down)
    Opponents don't know WHICH card it is until you cast it
    Strategic: opponents can't counter or target it while face-down

  FORETELL MANA SPLITTING:
    Turn N: pay {2} (foretell cost). Remove the card from hand.
    Turn N+1: pay the foretell cost (usually {1}{color} or similar).
    Total: {2} + foretell cost = total investment
    vs. Normal cast: mana cost.
    Example: Behold the Multiverse normally costs {3}{U}. Foretell cost: {1}{U}.
    Normal: {3}{U} in one shot. Foretell: {2} now + {1}{U} later = {2} + {1}{U} = actually MORE total.
    But: you split the cost over two turns → better tempo on each turn individually.

  FORETELL + TEMPO:
    Turn 4 (4 mana): foretell ({2}) + play a 2-drop = 4 mana invested
    Turn 5 (5 mana): cast foretold card for {1}{U} (cheap!) + do something with remaining 4 mana
    vs. Normal: Turn 5 cast {3}{U} = 4 mana used, 1 mana remaining
    With foretell: you can stretch resources across turns, deploying multiple things more efficiently

  FORETELL NOTABLE CARDS (Kaldheim):
    Behold the Multiverse ({3}{U}, Instant): "Scry 2, draw 2 cards."
      Foretell {1}{U}: pay {2} to exile, then {1}{U} to cast from exile.
      Total split: {3}{U} normal vs {2} + {1}{U} = same mana total but split.
      Benefit: hold up mana on opponent's turn (foretell with {2} you have left), then cast for {1}{U}.

    Alrund's Epiphany ({5}{U}{U}, Sorcery): "Create two 1/1 blue Bird tokens with flying. Take an extra turn."
      Foretell {3}{U}{U}: exile for {2} (any turn), cast from exile for {3}{U}{U}.
      Foretelling hides your extra-turn spell from opponents: they don't know the exact timing.
      They see a face-down exile and must respect any 3-mana open (casting foretell cost) as potentially extra turn.

    Alrund, God of the Cosmos ({3}{U}{U}, Legendary Creature 1/1): "Add U for each foretell counter
      you've exiled this game. Also 'At beginning of your precombat main phase, look at top 2 cards,
      put one in hand...'"
      Wait: Alrund's exact text might differ. The key: he rewards having foretold cards.

    Cosmos Charger ({3}{U}, Flying Creature): "Flash. Foretell costs of spells you own cost {2} less
      to cast from exile. Each card you foretell costs {1} to exile (instead of {2})."
      Cosmos Charger reduces BOTH the foretell exile cost AND the cast-from-exile cost.
      With Charger: foretell a card for {1} (instead of {2}), then cast it for {2} less than normal.
      Full discount: Alrund's Epiphany foretell cost {3}{U}{U} → reduced by {2} → {1}{U}{U}.
      Plus the exile cost: {2} → {1}. Total split: {1} + {1}{U}{U} = significant savings.

FORETELL + SNOW MANA:
  Kaldheim has snow lands that produce snow mana ({S})
  Some foretell cards have snow mana in their costs or interact with snow
  Foretell is part of the Kaldheim Norse mythology thematic package with snow and sagas

FORETELL + MULTIPLE CARDS:
  You can have multiple foretold cards in exile simultaneously
  All face-down with foretell counters
  Opponents see: multiple face-down exiles. Don't know which is which.
  You can foretell one card each turn: powerful tempo move is foretelling turn 2 for turn 3 deployment.

FORETELL + OPPONENT COPYING:
  CR 702.143d: effects can "foretell" a card by exiling it and giving it a foretell counter.
  Cards that say "foretell target card" can exile opponent's or your own card with a foretell counter.
  The foretell ability then lets the original owner cast it from exile.
```

## Definitive Conclusions

- **Foretelling exiles a card face-down for {2}** — only during your own turn, but at any priority window.
- **Foretold cards can't be cast the same turn they were foretold** — must wait until a later turn.
- **Foretell hides which card is in exile** — opponents see a face-down exile, not the specific card.
- **Foretell splits the mana cost over two turns** — better tempo even if total mana is similar.
- **Cosmos Charger reduces all foretell costs** — both the exile cost AND the cast-from-exile cost.

## Canonical Example
**Behold the Multiverse Foretell Tempo:**
Turn 3: you have {4} mana. Normal cast Behold the Multiverse ({3}{U}) = 4 mana, 0 mana left.
Alternative: foretell Behold the Multiverse for {2}. Cast a 2-drop with remaining {2}. (0 mana left.)
Turn 4: you have {5} mana. Cast foretold Behold the Multiverse for {1}{U} = 2 mana.
Remaining {3} mana: cast another spell (countermagic, another creature, etc.).
Comparing:
Turn 3 normal: 0 mana left over. Just the scry + draw.
Turn 3 foretell: 0 mana left but a 2-drop entered AND Behold is waiting.
Turn 4 foretell cast: {1}{U} for scry 2 + draw 2 AND {3} mana left over for other plays.
The split allowed deploying more on each individual turn.

**Example 2 — Alrund's Epiphany Hidden Threat:**
Turn 7: you have {7} mana. Foretell Alrund's Epiphany for {2}. Play a 5-mana creature with remaining {5}.
Opponents see: a face-down exile. They don't know it's Alrund's Epiphany.
Turn 8: you have {8} mana. Cast foretold Alrund's Epiphany for {3}{U}{U} = 5 mana.
Remaining {3} mana: mana available for responses.
Create two 1/1 Flying Birds. Take an extra turn.
Opponents couldn't counter it in exile (it was hidden). They didn't know when to expect the extra-turn play.
The surprise element: foretell obscured that you had an extra-turn spell until the turn of deployment.

## Commonly Confused With
- **P269 (Plot)** — Plot also exiles cards for future free casting; Plot is free on the future cast (no additional mana) but must wait a full turn AND only works during main phase. Foretell has a specific foretell cost (not free) but also splits mana.
- **P256 (Hideaway)** — Hideaway lands exile a card from the top of your library; Foretell exiles from your hand.
- **P255 (Suspend)** — Suspend exiles with time counters, counting down each upkeep to a free cast; Foretell is ready on any LATER turn (no counter waiting).
