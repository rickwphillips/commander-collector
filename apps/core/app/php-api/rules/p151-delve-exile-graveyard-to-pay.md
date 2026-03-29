---
id: p151
name: Delve — Exile Graveyard Cards to Pay Generic Mana
category: costs
cr_refs: [702.66a, 702.66b, 702.66c]
tags: [delve, graveyard, exile, cost-reduction, generic-mana, tarkir, gurmag-angler, treasure-cruise]
created: 2026-03-28
examples_count: 2
---

# P151 — Delve — Exile Graveyard Cards to Pay Generic Mana

## Abstract
Delve lets you exile cards from your graveyard to pay for generic mana in a spell's total cost. Each card exiled pays for {1} generic. This can make expensive spells extremely cheap if you've filled your graveyard. Like convoke and improvise, delve is not an additional or alternative cost — it applies after the total cost is calculated. You can exile any number of cards (each paying 1 generic), and you can combine delve with mana. Delve is one of the most powerful cost-reduction mechanics in the game: fetchlands and cantrips fill the graveyard fast, enabling turn-2 7/7s (Gurmag Angler) or draw-3s for {1} (Treasure Cruise).

## The Definitive Rules

**CR 702.66a** (verbatim): *"Delve is a static ability that functions while the spell with delve is on the stack. 'Delve' means 'For each generic mana in this spell's total cost, you may exile a card from your graveyard rather than pay that mana.'"*

**CR 702.66b** (verbatim): *"The delve ability isn't an additional or alternative cost and applies only after the total cost of the spell with delve is determined."*

## The Pattern

```
DELVE:
  Static ability on the spell (while on stack)
  Apply AFTER total cost is determined
  For each generic {1} in the total cost: may exile one card from YOUR graveyard
  Effect: each exiled card pays for one {1} generic mana

  DELVE + COST:
    Gurmag Angler: {6}{B} → total cost {6}{B}
    Can delve up to 6 cards (each covers one generic {1})
    Still must pay {B} with actual mana
    If you have 6 cards in graveyard: cast Angler for {B} total

  DELVE + COLORED MANA:
    Delve only covers GENERIC mana (the {1} symbols)
    Colored mana requirements CANNOT be paid with delve
    Treasure Cruise ({7}{U}): exile up to 7 cards to pay {7}, still need {U}
    Dig Through Time ({5}{U}{U}): exile up to 5 for {5}, still need {U}{U}

  DELVE + GRAVEYARD FILLING:
    The faster your graveyard fills: the cheaper delve spells get
    Fetchlands: put one land in play, shuffle, crack for another = each crack mills library indirectly AND the fetch goes to graveyard
    Cantrips (Ponder, Brainstorm): draw cards, discard surplus → graveyard fills
    Looting effects: draw + discard → 2 cards in graveyard per activation
    Flashback spells: cast from graveyard → exiled, but the discard/mill that got them there already helped

  DELVE + MULTIPLE DELVE SPELLS:
    Each cast of a delve spell exiles cards
    After casting Gurmag Angler (exiled 4 cards): graveyard has 3 fewer
    Second delve spell: graveyard is depleted
    Plan: only a few delve spells per deck, or fill graveyard very fast

  DELVE + GRAVEYARD HATE:
    Opponent exiles your graveyard: no cards to delve
    Leyline of the Void, Rest in Peace: graveyard never fills → delve is moot
    Counter-interaction: delve decks are soft to graveyard hate

  DELVE + ESCAPE (related mechanic):
    Escape (Theros Beyond Death) is similar: exile cards from graveyard as part of casting
    Escape: escape cost + exile exactly N specific cards from graveyard
    Delve: exile any number up to the generic cost
    Escape requires a specific number; delve is flexible

  DELVE + X SPELLS:
    X is chosen first, total cost = X + other costs, then delve applies
    X = 0 by default if no mana paid for X after delve covers it? No.
    X is chosen before paying costs. If X = 5, total cost = {5} + mana symbols → delve covers the 5 generics

DELVE POWER LEVEL:
  Gurmag Angler: format-warping in Legacy/Modern/Pauper
  Treasure Cruise: drew 3 cards for {1} routinely → banned in Modern, restricted in Vintage
  Dig Through Time: banned in Modern, Legacy
  Delve is one of the most efficient cost-reduction mechanics ever printed
```

## Definitive Conclusions

- **Delve pays for generic mana only** — colored mana still requires mana sources.
- **Each graveyard card exiled = {1} paid** — up to the number of generic mana in the cost.
- **Not an additional cost** — applies after total cost calculation.
- **Powerful with fast graveyard filling** — fetchlands + cantrips enable turn-2 delve bombs.
- **Soft to graveyard hate** — Leyline of the Void, Rest in Peace, etc. shut it down.

## Canonical Example
**Treasure Cruise ({7}{U} — Delve):**
Draw three cards (at sorcery speed). Turn 2 in Legacy with 7 cards in graveyard: exile 7, pay {U} → draw 3 for 1 blue mana. This was so efficient it was banned in Modern and restricted in Vintage.
Common sequence: Brainstorm (put 2 back), fetch land (crack, shuffle) → 3 cards in graveyard → Treasure Cruise for {4}{U}.

**Example 2 — Gurmag Angler ({6}{B} — Delve):**
A 7/5 fish zombie. Exile 6 cards from graveyard → pay {B} → cast on turn 2.
Modern Dredge/Delve strategies: turn 1 Faithless Looting (discard 2), crack fetch = 3+ cards → turn 2 Angler for {B}.
Resilient to most removal that doesn't exile (regeneration, protection, etc. all stop short of a 7/5).

## Commonly Confused With
- **P150 (Convoke/Improvise)** — Convoke taps creatures; Improvise taps artifacts. Delve exiles from graveyard. All pay generic mana differently.
- **P117 (Affinity)** — Affinity reduces cost by counting permanents (no exile). Delve reduces by exiling from graveyard.
- **P134 (Escape)** — Escape is like delve but exiles a fixed number. Delve is flexible.
