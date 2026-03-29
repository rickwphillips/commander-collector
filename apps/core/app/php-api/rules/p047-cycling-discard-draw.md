---
id: p047
name: Cycling — Discard-to-Draw, Madness Interaction, and Typecycling
category: costs
cr_refs: [702.29a, 702.29b, 702.29c, 702.29e, 702.29f]
tags: [cycling, discard, draw, activated-ability, madness, typecycling, land-cycling, trigger, hand]
created: 2026-03-28
examples_count: 2
---

# P047 — Cycling — Discard-to-Draw, Madness Interaction, and Typecycling

## Abstract
Cycling is an activated ability that discards the card to draw a card. Because cycling involves a discard, it interacts with madness — you can cycle a card with madness and use the discard to trigger madness. Cycling also triggers any abilities that say "when you cycle this card" or "whenever a player cycles a card." Typecycling lets you search for a specific type instead of drawing. Cycling functions only from hand but the ability "exists" in other zones for purposes of effects that care about activated abilities.

## The Definitive Rule

**CR 702.29a** (verbatim): *"Cycling is an activated ability that functions only while the card with cycling is in a player's hand. 'Cycling [cost]' means '[Cost], Discard this card: Draw a card.'"*

**CR 702.29c**: "When you cycle this card" triggers from whatever zone the card ends up in after cycling.

**CR 702.29e**: Typecycling lets you search for a [type] card instead of drawing.

## The Pattern

```
CYCLING SEQUENCE:
  1. Pay the cycling cost
  2. Discard this card (as part of the cost)
  3. Draw a card (effect)

  Priority note: cycling is an activated ability → it uses the stack
  Opponents can respond between when you cycle and when you draw
  (Unlikely to matter, but Stifle can counter the cycling ability)

CYCLING IS A DISCARD:
  The discard happens as a cost (step 2 above)
  → Madness triggers off the discard
  → You can cycle a card with madness to trigger madness
  → You discard the madness card as cycling cost
  → Madness replacement: exiles it instead of graveyard
  → Madness triggered ability goes on stack
  → Cycling ability (draw a card) resolves: you draw a card
  → Madness trigger resolves: you may cast the exiled card
  Net: you cycle (draw a card) AND get to cast the madness card

CYCLING TRIGGERS:
  "When you cycle this card" — triggers from wherever the card goes
    (graveyard for normal cycling; exile for madness cycling)
  "Whenever you cycle a card" — creature with this ability triggers on any cycling
  CR 702.29d: "Cycles or discards" abilities trigger once per cycling (not twice)

TYPECYCLING:
  "[Type]cycling [cost]" = discard to search library for a [type] card
  You reveal it and put it in your hand
  Counts as cycling for "whenever you cycle" triggers
  Land cycling: search for a basic land type (Forest cycling, etc.)

ABILITIES EXIST IN OTHER ZONES:
  CR 702.29b: Cycling ability exists while card is on battlefield/other zones
  Relevant for: effects that say "creatures with activated abilities"
  Example: Vedalken Orrery giving flash to permanents — cycling creatures count as
    having activated abilities even on battlefield
  Not relevant for: you CAN'T activate cycling from battlefield (only from hand)
```

## Definitive Conclusions

- **Cycling triggers madness.** The discard-as-cost triggers the madness replacement, exiling the card. You still draw (from cycling) and can cast the madness card when its trigger resolves.
- **Cycling is an activated ability on the stack.** Stifle can counter it.
- **"When you cycle this card" triggers from wherever the card ends up.** Even from exile (after madness).
- **Typecycling counts as cycling for trigger purposes.** "Whenever a player cycles a card" triggers on typecycling.
- **Cycling ability exists in all zones.** Relevant for effects caring about activated abilities on permanents.

## Canonical Example
**Firestorm + cycling:**
You activate Astral Slide's cycling (cycling {2}{W}): discard Astral Slide, draw a card. Astral Slide has a triggered ability on other cards: "whenever a player cycles a card, you may exile target creature. Return it at the beginning of the next end step." That trigger fires when you cycle anything — useful for flickering your own creatures.

**Example 2 — Cycling + madness:**
Obsessive Search (cycling {U}, madness {U}). You activate cycling on Obsessive Search: discard it as cost. Madness fires: Obsessive Search is exiled instead. Cycling effect resolves: draw a card. Madness trigger resolves: cast Obsessive Search for {U}... but Obsessive Search also draws you a card ("Target player draws a card"). You spent {U} and {U} total and drew 2 cards. Net advantage from the madness cast.

## Commonly Confused With
- **P033 (Madness)** — Cycling IS a discard, which triggers madness. P047 establishes why; P033 establishes the madness timing details.
- **P007 (Priority Windows)** — The cycling ability is on the stack; there's a response window between activation and the draw.
