---
id: p282
name: Escape and Delve — Cast From Graveyard by Exiling Graveyard Cards as Cost
category: costs
cr_refs: [702.100a, 702.100b, 702.156a, 702.35a, 702.35b]
tags: [escape, delve, graveyard-cost, exile-from-graveyard, cost-reduction, Theros-Beyond-Death, Khans-of-Tarkir, Uro-Titan-of-Natures-Wrath, Kroxa-Titan-of-Deaths-Hunger, Tasigur-the-Golden-Fang, Treasure-Cruise]
created: 2026-03-29
examples_count: 2
---

# P282 — Escape and Delve — Cast From Graveyard by Exiling Graveyard Cards as Cost

## Abstract
Two mechanics that use your graveyard as a resource for cheaper casting. **Escape** (Theros Beyond Death): cast a card from your graveyard by paying the escape cost AND exiling a set number of other cards from your graveyard. Escape is a "second chance" mechanic — use the card once, it goes to the graveyard, then spend graveyard resources to reuse it. **Delve**: when casting a spell, exile cards from your graveyard to reduce the generic mana cost (each exiled card reduces by {1}). Delve lets powerful high-cost spells become cheap if you have a full graveyard. Both mechanics incentivize filling the graveyard as a strategic resource.

## The Definitive Rules

**CR 702.100a** (verbatim): *"Escape represents a static ability that functions while the card with escape is in a player's graveyard. 'Escape [cost]' means 'You may cast this card from your graveyard by paying [cost] rather than paying its mana cost.' Casting a spell using its escape ability follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

**CR 702.100b** (verbatim): *"Cards that have escape and are in a player's graveyard can be cast using their escape ability only if the player's graveyard meets the conditions required by that card's escape cost."*

**CR 702.35a** (verbatim): *"Delve is a static ability that functions while the spell with delve is on the stack. 'Delve' means 'For each generic mana in this spell's total cost, you may exile a card from your graveyard rather than pay that mana.'"*

**CR 702.35b** (verbatim): *"The delve ability isn't an additional cost to cast the spell. Rather, delve allows the player to exile cards from their graveyard as part of paying the spell's total cost."*

## The Pattern

```
ESCAPE:
  Keyword in the graveyard zone (static ability while in GY)
  Cast from graveyard: pay escape cost (usually escape cost includes "exile N cards from GY")
  Escape cost typically: {mana cost} + exile {N} other cards from your graveyard
  When escape spell resolves: the card goes to exile or wherever (not back to GY unless specified)
  Wait: if an escape spell would go to GY again: it can be escaped again (still has the ability)
  Actually: the card doesn't change — it still has escape in the GY → can be cast again!
  The only limit: you need enough OTHER cards in your GY to exile each time.

  ESCAPE + INFINITE LOOP PREVENTION:
    Each escape activation costs exiling OTHER cards
    Eventually: run out of other cards to exile → can't escape again
    Not truly infinite: limited by graveyard depth
    Decks with high self-mill: more escape activations available

  ESCAPE + FIRST CAST:
    Many escape cards have effects that only trigger on the first cast (or have asymmetry)
    Example: Uro, Titan of Nature's Wrath — when cast NOT via escape: has a "sacrifice unless it escaped" clause
    Uro escaping: comes back without the "sacrifice" clause — stays on battlefield permanently.

  ESCAPE NOTABLE CARDS (Theros Beyond Death):
    Uro, Titan of Nature's Wrath ({1}{G}{U}): 6/6 Legendary Creature.
      When Uro enters for the first time: you MUST sacrifice it (unless it escaped).
      When Uro enters or attacks: gain 3 life, draw a card, you may put a land from hand into play.
      Escape {3}{G}{U}, exile 5 other cards: cast Uro from GY for {3}{G}{U} + exile 5 cards.
      Escaped Uro: stays on battlefield as a 6/6 that gains life + draws + ramps every attack.
      Fill graveyard with 5+ cards, escape → 6/6 that generates value every attack.

    Kroxa, Titan of Death's Hunger ({B}{R}): 6/6 Legendary Creature.
      When Kroxa enters (non-escape): sacrifice it AND each opponent discards and loses life.
      Escape {3}{B}{R}, exile 5 other cards: escaped Kroxa stays, each opponent discards/loses each turn.
      Two uses: cast for {B}{R} as a "each opponent discard + lose life" and sacrifice; or escape for a 6/6 recurring value engine.

    Elspeth, Sun's Nemesis ({2}{W}{W}): Planeswalker, Escape {2}{W}{W}, exile 4 other cards.
      Planeswalker that can be escaped from GY: repeated planeswalker value.

DELVE:
  Keyword on spell when on the stack (while casting)
  For each generic mana in the total cost: may exile a card from GY instead of paying {1}
  Exile from YOUR graveyard specifically
  Maximum delve: can't reduce below colored mana requirements

  DELVE MATH:
    Treasure Cruise ({7}{U}): total cost {8} (seven generic + one blue).
    Delve: exile up to 7 cards from GY → reduces generic cost by up to 7.
    With 7 cards in GY: cast Treasure Cruise for {U} (one blue mana! Draw 3 cards).
    The most efficient card draw spell in the game when your GY is full.

    Tasigur, the Golden Fang ({5}{B}): 4/5 Legendary Creature.
    Delve: exile up to 5 cards → as cheap as {B} with a full graveyard.
    A 4/5 for {B}: absurd rate. Plus activated ability to recover cards from GY.

  DELVE + GRAVEYARD MANAGEMENT:
    You choose WHICH cards to exile when delving
    Don't exile cards you want for flashback, unearth, escape, or other GY effects
    Exile "spent" cards — lands, creatures already used, etc.
    Prioritize: keep the most valuable GY cards, exile the least useful

  DELVE + COMMANDER:
    Commander deck graveyard fills quickly
    Delve spells become very cheap mid-to-late game
    Dig Through Time ({6}{U}{U}, Delve): look at top 8, take 2. With 6 delve → {U}{U} cost.

  DELVE + MULTIPLE COPIES:
    If you cast a second Treasure Cruise: your GY might be empty (you delved the first time)
    Second Cruise: full cost {7}{U}
    Treasure Cruise is most effective as a one-of: the GY fuel only lasts once

ESCAPE vs DELVE COMPARISON:
  Escape: cast FROM graveyard (the card is in GY), paying a specific escape cost + exile N cards
  Delve: cast NORMALLY (card in hand), using GY cards to pay for generic mana cost
  Escape: gives cards a second (or third, etc.) casting from GY — stored value
  Delve: makes expensive spells cheap by burning GY contents
  Both: reduce the "total cost" to cast by consuming graveyard resources
```

## Definitive Conclusions

- **Escape casts the card FROM the graveyard** at the escape cost — requires exiling other graveyard cards.
- **Escaped permanents can often be escaped again** if they return to the graveyard (the ability is still there).
- **Uro escaping allows it to stay on the battlefield** — the "sacrifice unless escaped" clause only applies to non-escaped casts.
- **Delve reduces generic mana cost** by exiling graveyard cards — one card = {1} less mana.
- **Treasure Cruise for {U} with 7 cards in GY** is the apex of Delve efficiency.

## Canonical Example
**Uro Titan Escape Engine:**
Turn 1-3: fill graveyard through draw/discard, fetchlands, cantrips. Get 7+ cards in GY.
Turn 3: cast Uro normally ({1}{G}{U}). ETB: gain 3 life + draw a card + put a land into play.
SBA: Uro was "entered without escape" → must sacrifice it. It goes to the graveyard.
Turn 4: you have 7 cards in GY (including the Uro just sacrificed). Pay Escape: {3}{G}{U} + exile 5.
Choose 5 "spent" cards to exile. Uro escapes.
Escaped Uro: stays on battlefield! It's a 6/6 Trample that gains 3 life + draws + ramps every attack.
Future attacks: gain 3 life, draw a card, ramp a land — repeat forever.
You paid: {1}{G}{U} (first cast, sacrificed) + {3}{G}{U} + exile 5 cards (second cast, stays).
Result: permanent 6/6 Trample value engine.

**Example 2 — Treasure Cruise Delve:**
Turn 5. Graveyard has: 2 fetchlands + 3 spells = 7 cards.
Cast Treasure Cruise ({7}{U}). Declare Delve: exile all 7 cards from graveyard.
Total cost: {7}{U} - {7} (delve for 7) = {U}.
Pay {U}: Treasure Cruise resolves. Draw 3 cards.
You drew 3 cards for one blue mana. Your graveyard is now empty.
Potential follow-up: fill GY again (Gitaxian Probe, Thought Scour, etc.) for a second Cruise.

## Commonly Confused With
- **P211 (Flashback)** — Flashback also casts from the graveyard; it has a specific printed flashback cost (often different from the original cost) and no additional exile requirement.
- **P240 (Dredge)** — Dredge replaces draws with mill to return a dredge card; it's about drawing, not casting.
- **P282 note**: Escape requires exiling SPECIFIC number of OTHER graveyard cards (printed as part of the cost). Delve reduces generic mana flexibly (exile as many as you want, up to the generic cost).
