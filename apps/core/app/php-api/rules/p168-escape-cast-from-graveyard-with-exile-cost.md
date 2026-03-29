---
id: p168
name: Escape — Cast from Graveyard by Exiling Other Cards
category: costs
cr_refs: [702.138a, 702.138b, 702.138c, 702.138d]
tags: [escape, graveyard, exile, alternative-cost, Theros-Beyond-Death, Uro, Kroxa, Elspeth]
created: 2026-03-28
examples_count: 2
---

# P168 — Escape — Cast from Graveyard by Exiling Other Cards

## Abstract
Escape is an alternative cost that functions from the graveyard: pay the escape cost (mana + exile N other cards from your graveyard) to cast the card instead of its normal mana cost. Unlike delve (exile any amount you want), escape requires exiling a specific number. The card is cast and can enter the battlefield (from the graveyard via the alternate cast) — it "escaped." Permanents that escaped may enter with additional counters (via escape modifier rules), and some abilities specifically care whether a permanent escaped. Escape cards in Theros Beyond Death have powerful cast-from-graveyard effects tied to mythic creatures.

## The Definitive Rules

**CR 702.138a** (verbatim): *"Escape represents a static ability that functions while the card with escape is in a player's graveyard. 'Escape [cost]' means 'You may cast this card from your graveyard by paying [cost] rather than paying its mana cost.' Casting a spell using its escape ability follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

**CR 702.138b** (verbatim): *"A spell or permanent 'escaped' if that spell or the spell that became that permanent as it resolved was cast from a graveyard with an escape ability."*

**CR 702.138c** (verbatim): *"An ability that reads '[This permanent] escapes with [one or more of a kind of counter]' means 'If this permanent escaped, it enters with [those counters]'"*

## The Pattern

```
ESCAPE:
  Alternative cast (from graveyard): pay [escape cost] instead of mana cost
  Escape cost structure: [mana] + exile exactly N other cards from YOUR graveyard
  The card is cast from the graveyard, entering as normal

  ESCAPE + EXILE COUNT:
    Each escape card specifies how many other cards to exile
    Uro, Titan of Nature's Wrath: escape {G}{U} + exile 5 cards from graveyard
    Kroxa, Titan of Death's Hunger: escape {B}{R} + exile 5 cards from graveyard
    Elspeth, Sun's Nemesis: escape {W}{W} + exile 4 cards from graveyard
    You must have enough cards in graveyard to exile the required number

  ESCAPE + "ESCAPED" STATUS:
    A permanent "escaped" if it was cast from graveyard via escape
    Abilities can reference this: "If this creature escaped, it enters with N +1/+1 counters"
    Elspeth, Sun's Nemesis: "If this spell escaped, it enters with 5 loyalty instead of base loyalty"

  ESCAPE + GRAVEYARD FILLING:
    Escape requires a stocked graveyard
    Fast self-mill, fetchlands, cantrips fill graveyard to enable escape
    Uro: difficult to escape on turn 2-3 unless heavy self-mill
    Late game: graveyard is full → escape becomes easy

  ESCAPE + FIRST CAST:
    Most escape cards have an additional effect when first cast normally (from hand)
    Uro, Titan: "When this creature enters or attacks, gain 3 life and draw a card. Put a land from your hand into play."
    But: "When Uro enters, sacrifice it unless it escaped."
    So: Cast Uro from hand → ETB → sacrifice immediately (didn't escape)
    But: get the ETB trigger (life, draw, land) before sacrificing
    Cast Uro from graveyard via escape: it "escaped" → no sacrifice → stays on battlefield as 6/6!

  ESCAPE + CAST RESTRICTIONS:
    Sorcery-speed unless the card is an instant (follow normal timing rules)
    Can be countered like any spell
    If countered: goes to graveyard (normally) — can be escaped again if enough cards remain

  ESCAPE VS DELVE (comparison):
    Delve: exile ANY number of cards, each pays {1} generic
    Escape: exile EXACTLY N cards (required), reduces total cost to the escape cost
    Delve is flexible; escape has a fixed exile requirement

  ESCAPE + GRAVEYARD HATE:
    Leyline of the Void, Rest in Peace: graveyard cards are exiled → can't escape
    Relic of Progenitus: exile graveyard → escape disabled
    Escape decks are soft to graveyard hate
```

## Definitive Conclusions

- **Escape casts from graveyard with mana + exile N other cards** — exact exile count required.
- **A permanent "escaped"** if cast via escape — enables additional ETB counters/abilities.
- **Most escape permanents sacrifice if not escaped** (Uro, Kroxa) — designed to die on first cast.
- **Graveyard hate fully shuts down escape** decks.
- **Different from delve** — delve is flexible exile; escape is a fixed count.

## Canonical Example
**Uro, Titan of Nature's Wrath (Escape {G}{U}, exile 5 from graveyard):**
Cast from hand: {1}{G}{U} → ETB: gain 3 life, draw a card, put a land from hand into play. But must sacrifice Uro unless it escaped (it didn't). Sacrifice Uro.
Net: paid 3 mana, gained 3 life, drew a card, played a land. Now Uro is in the graveyard.
Later: 5 cards in graveyard. Pay {G}{U} + exile 5 → Uro ESCAPES → enters as 6/6.
ETB fires again: gain 3 life, draw a card, land into play. NO sacrifice (it escaped).
Uro stays on the battlefield as a 6/6. Now it attacks each turn → the trigger fires on attacks too.

**Example 2 — Elspeth, Sun's Nemesis (Escape {W}{W}, exile 4):**
Escape cost: {1}{W}{W} + exile 4 from graveyard.
If escaped: enters with 5 loyalty (instead of base 4).
1 mana cheaper than a full-cost planeswalker AND an extra loyalty counter when escaped.
Theros Beyond Death: graveyard-heavy set made escape synergize with all the self-mill.

## Commonly Confused With
- **P151 (Delve)** — Delve is flexible exile for generic mana reduction. Escape requires a specific count and provides a fixed alternative cost.
- **P163 (Retrace)** — Retrace casts repeatedly by discarding a land. Escape uses a fixed-count exile cost.
- **P082 (Unearth)** — Unearth returns a creature temporarily. Escape lets you cast the card as a new spell (with ETBs, etc.).
