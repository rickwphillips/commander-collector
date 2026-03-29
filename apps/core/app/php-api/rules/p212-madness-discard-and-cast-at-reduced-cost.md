---
id: p212
name: Madness — Discard to Exile, Then Cast at Madness Cost
category: costs
cr_refs: [702.35a, 702.35b, 702.35c]
tags: [madness, discard-synergy, exile-on-discard, alternative-cost, Stromkirk-Occultist, Fiery-Temper, Innistrad, looting]
created: 2026-03-28
examples_count: 2
---

# P212 — Madness — Discard to Exile, Then Cast at Madness Cost

## Abstract
Madness allows casting a card at its madness cost when it would be discarded — instead of going to the graveyard, it's exiled, and you have the opportunity to cast it for the madness cost. If you choose not to cast it, it goes to the graveyard. Madness turns discard costs and effects into casting opportunities: loot with Faithless Looting and "discard" Fiery Temper? Cast it for {R} instead of {2}{R}. Madness is most powerful in decks that combine discard outlets (looting, cycling, Wheel effects) with cards that have strong madness discounts.

## The Definitive Rules

**CR 702.35a** (verbatim): *"Madness is a keyword that represents two abilities. The first is a static ability that functions while the card with madness is in a player's hand. The second is a triggered ability that functions when the first ability is applied. 'Madness [cost]' means 'If a player would discard this card, that player discards it, but exiles it instead of putting it into their graveyard' and 'When this card is exiled this way, its owner may cast it by paying [cost] rather than paying its mana cost. If that player doesn't, they put this card into their graveyard.'"*

**CR 702.35b** (verbatim): *"Casting a spell using its madness ability follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

**CR 702.35c** (verbatim): *"After resolving a madness triggered ability, if the exiled card wasn't cast and was moved to a public zone, effects referencing the discarded card can find that card."*

## The Pattern

```
MADNESS SEQUENCE:
  1. Card with madness is discarded (for any reason: discard as cost, forced discard, etc.)
  2. Replacement effect: instead of going to graveyard → exiled
  3. Triggered ability fires: "you may cast this card for madness cost"
  4. You choose: cast it for madness cost (instant speed!), or put it into graveyard

MADNESS + TIMING:
  When the triggered ability resolves: you may cast the madness spell
  This happens BEFORE the discarding player (or the person who caused the discard) gets priority back
  Specifically: the discard event triggers madness → madness trigger goes on stack
  When madness trigger resolves: you decide whether to cast
  This can happen at ANY time (if you discarded in response to something) — madness is instant speed!
  Madness sorceries: can still be cast at "instant speed" from this trigger resolution?
  Actually: madness casting happens as the trigger resolves (a special timing window)
  The spell can be cast even if it's a sorcery, because it's being cast as part of resolving a triggered ability
  This is an exception: madness sorceries can be cast during other players' turns

MADNESS + DISCARD TRIGGERS:
  Faithless Looting, Wild Guess, Careful Study: discard as a cost
  Each discard triggers madness for the discarded card
  Multiple madness cards discarded to one Looting: multiple madness triggers on stack
  Resolve them in APNAP/choice order

MADNESS + OPPONENT'S DISCARD:
  If opponent makes you discard (Hymn to Tourach, Thoughtseize): madness can trigger!
  You discard a madness card "for any reason"
  You get to cast it for madness cost in response (sort of) — after the discard resolves
  Anti-disruption: opponent trying to strip your hand → you get to cast the card instead!

MADNESS + GRAVEYARD IF NOT CAST:
  If you choose NOT to cast: card moves to graveyard (from the exile state)
  CR 702.35c: after this, effects referencing the "discarded" card can find it in graveyard
  Standard: the card is in graveyard now, can be retrieved by graveyard recursion

MADNESS + COST COMPARISON:
  Fiery Temper: mana cost {2}{R}, madness cost {R} → save 2 mana
  Just the Madness Cost: just pay 1 red for 3 damage — extremely efficient
  Faithless Looting discard Fiery Temper: net = Looting ({R} for draw2+discard2) + Fiery Temper ({R} for 3 damage)
  Total: {R}{R} for 2 draws, 2 discards (likely other cards), and 3 damage. Excellent value.

MADNESS + VAMPIRES:
  Many Vampire cards in Innistrad have madness
  Vampire tribal: discard outlets (Stromkirk Occultist, Olivia Voldaren abilities)
  Madness lets Vampires be cast at discount after being discarded by their own tribal synergies

MADNESS + CYCLING:
  Cycling is "discard this card: draw a card"
  If a card has both cycling and madness? Not common but possible via effect
  Discard via cycling triggers madness: you can cast it instead of drawing
  But if you cast it via madness, do you draw? No — you chose to cast, not to cycle
  Actually: cycling IS the discard; madness triggers; you choose to cast → no draw from cycling
  Net: use the card as a spell for madness cost, not drawn a card

NOTABLE MADNESS CARDS:
  Fiery Temper ({2}{R}, Madness {R}): deal 3 damage to any target
  Stromkirk Occultist ({2}{R}, Madness {R}): discard trigger for card draw
  Avacyn's Judgment (Madness X): scales with extra mana
  Eternal Witness: not madness, but retrieves from graveyard if you didn't cast via madness
```

## Definitive Conclusions

- **Madness replaces discard** with exile, then gives a window to cast at madness cost.
- **Instant-speed sorceries**: madness allows casting sorceries outside main phase (via the trigger window).
- **Choose not to cast**: card moves to graveyard (normal graveyard targeting then works).
- **Opponent's discard triggers madness** — turns disruption into tempo plays.
- **Looting + Madness**: discard as part of looting, cast discarded spell for cheap.

## Canonical Example
**Turn 2, Vampire deck:**
You have Faithless Looting and Fiery Temper in hand.
Cast Faithless Looting ({R}): draw 2, then discard 2.
Discard Fiery Temper: it's exiled (madness replaces graveyard).
Madness trigger fires: you may cast Fiery Temper for {R} (its madness cost).
Cast it: deal 3 damage to opponent's face.
Total this turn: {R}{R} spent, drew 2 cards, dealt 3 damage, discarded 2 other cards.
Extremely efficient burst turn.

**Example 2 — Opponent's Thoughtseize Backfires:**
Opponent casts Thoughtseize ({B}): "target player reveals hand, opponent chooses nonland and you discard it."
You reveal hand: they see Avacyn's Judgment (madness card).
Opponent forces you to discard Avacyn's Judgment.
Madness triggers: you may cast Avacyn's Judgment for its madness cost (scale by X).
Pay {R}{R}{R}: deal 3 damage to any number of targets (sharing or not, per the card).
Opponent's Thoughtseize backfired: they helped you cast your spell at a discount!

## Commonly Confused With
- **P197 (Mayhem)** — Mayhem: cast from graveyard if discarded this turn. Madness: cast WHILE being discarded (from exile during the trigger window).
- **P212 vs Flashback** — Flashback: cast from graveyard for flashback cost after arriving in graveyard. Madness: cast at madness cost when being discarded (never reaches graveyard unless you decline).
- **P165 (Miracle)** — Miracle triggers when drawn as first draw. Madness triggers when discarded. Both care about specific card movement events.
