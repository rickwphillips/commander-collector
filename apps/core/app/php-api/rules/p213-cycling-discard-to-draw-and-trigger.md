---
id: p213
name: Cycling — Discard to Draw, Typecycling, and Cycle Triggers
category: costs
cr_refs: [702.29a, 702.29b, 702.29c, 702.29d, 702.29e, 702.29f]
tags: [cycling, typecycling, draw, discard, cycle-trigger, Astral-Drift, Drake-Haven, Eternal-Cycle, Amonkhet]
created: 2026-03-28
examples_count: 2
---

# P213 — Cycling — Discard to Draw, Typecycling, and Cycle Triggers

## Abstract
Cycling is an activated ability that allows discarding a card to draw a card — card filtering at the cost of losing the card. It functions only in hand. Some cards have abilities that trigger "when you cycle this card" (cycle triggers — fire when cycled). Typecycling is a variant: discard to search your library for a specific type of card. Cycling creates a rich ecosystem: cards that were too slow/situational can be cycled away; cycle triggers turn cycling into proactive effects (not just filtering); Astral Drift and similar cards use cycling triggers as a full game mechanic.

## The Definitive Rules

**CR 702.29a** (verbatim): *"Cycling is an activated ability that functions only while the card with cycling is in a player's hand. 'Cycling [cost]' means '[Cost], Discard this card: Draw a card.'"*

**CR 702.29c** (verbatim): *"Some cards with cycling have abilities that trigger when they're cycled. 'When you cycle this card' means 'When you discard this card to pay an activation cost of a cycling ability.' These abilities trigger from whatever zone the card winds up in after it's cycled."*

**CR 702.29e** (verbatim): *"Typecycling is a variant of the cycling ability. '[Type]cycling [cost]' means '[Cost], Discard this card: Search your library for a [type] card, reveal it, and put it into your hand. Then shuffle your library.'"*

## The Pattern

```
CYCLING:
  Activated ability: pay [cost] + discard the card → draw a card
  Functions ONLY in hand (CR 702.29b: exists in all zones but activatable only in hand)
  Standard cycling costs: {1}, {2}, single colored mana, or hybrid
  Card filtering: trade an unwanted card for a fresh draw

CYCLE TRIGGERS:
  Some cards: "When you cycle this card, [effect]"
  Triggers from WHATEVER ZONE the card ends up in (graveyard usually)
  The trigger fires after the cycling (discard, draw, trigger goes on stack)
  Can't "respond" to cycling to put a blocker effect: cycling resolves then trigger fires

CYCLING + MADNESS:
  Discard via cycling triggers madness if the card has madness
  But: cycling IS the discard trigger; madness replaces going to graveyard → exile
  If you cast via madness: you discarded (cycling cost) but chose to cast instead of draw
  Net: no draw (cycling's draw was the cost result, but if madness interrupts... complex)
  Actually: cycling's activation = "discard this: draw a card"
  The DISCARD is how you pay the cycling activation cost
  Madness checks if the card "would be discarded" — it is! Triggers madness.
  But the cycling activation already includes "draw a card" as its effect
  When madness triggers and you cast the madness card: did the cycling also draw a card?
  Answer: cycling effect IS "draw a card" — the cycling resolves normally (draw a card), then madness trigger fires
  So: cycle (pay mana + discard), draw a card (cycling effect), then madness trigger fires
  If you cast the madness card: you got BOTH the draw AND a cheap cast!
  This is intentional design and very powerful with cards that have both cycling AND madness

TYPECYCLING:
  "[Type]cycling [cost]" = "pay cost, discard: search library for [type] card"
  Mountaincycling: search for a Mountain
  Basic landcycling: search for any basic land
  Forestcycling: search for a Forest
  Use cases: mana fixing, fetching the right land type, deck thinning

TYPECYCLING + TRIGGERS:
  Typecycling is cycling: "any effect that looks for cycling will find typecycling" (CR 702.29f)
  Drake Haven triggers on "whenever you cycle or discard": typecycling triggers it

ASTRAL DRIFT ENGINE:
  Astral Drift: "When you cycle a card, you may exile target creature. Return it at the beginning of the next end step."
  This is the CYCLE TRIGGER of Astral Drift (the card's triggered ability)
  Cycle any card → trigger from Astral Drift: exile a creature (yours or opponent's)
  Return at end step: your creature gets "blinked" (ETB again)
  Engine: run lots of cycling cards + Astral Drift → repeated ETB effects each turn

DRAKE HAVEN:
  Drake Haven: "Whenever you cycle or discard a card, you may pay {1}. If you do, create a 2/2 blue Drake token."
  Cycling any card → Drake token for {1}
  Wide board from cycling: discard-heavy deck makes lots of Drakes
  Drake Haven + Hollow One (cycle to reduce cost): cycle aggressively, make Drakes + cast cheap creatures

DRAKE HAVEN + MADNESS:
  Discard a madness card to Drake Haven trigger... wait, Drake Haven triggers on discard
  But cycling is separate from forced discard
  Drake Haven says "whenever you cycle OR discard" — both trigger it
  If you cycle a madness card: cycling trigger + madness trigger + Drake Haven trigger all fire
  Order them on the stack: multiple effects from one discard

CYCLING LAND CYCLING:
  Landcycling: discard to search for "land" (any land)
  Basic landcycling: search for basic land
  Example: Krosan Tusker ({5}{G}{G}) has "Cycling {2}{G}: when you cycle this, draw a card and search library for a basic land."
  Wait: that's not typecycling, it's regular cycling with a triggered ability
  Raging Ravine cycling finds a land and draws a card if it has "cycling"
  Land cycling on creatures: acts as flexible land fetch in mana-hungry decks
```

## Definitive Conclusions

- **Cycling is "pay cost, discard: draw a card"** — available only in hand.
- **Cycle triggers** fire from the zone the cycled card lands in (usually graveyard).
- **Typecycling** finds specific card types instead of drawing a card.
- **Cycling + Madness**: both draw AND madness cast is possible (cycling draw happens, then madness fires).
- **Drake Haven / Astral Drift**: turn every cycling activation into a proactive effect.

## Canonical Example
**Drake Haven ({2}{U}) + cycling in control deck:**
Turn 3: Cycle Irrigated Farmland ({2} cycling cost): Drake Haven triggers → pay {1} → 2/2 Drake.
Drew a card from cycling. Drake enters.
Turn 4: Cycle Archfiend of Ifnir ({2} cycling): Drake Haven → pay {1} → 2/2 Drake. Drew a card.
Turn 5: Cycle Censor ({1}{U} cycling, counter spell): Drake Haven → 2/2 Drake. Drew a card.
Five cycles: 5 Drakes, 5 cards drawn, flexible early interaction (counter or cycle away Censor).
Wide Drake board from cycling alone.

**Example 2 — Astral Drift + Solitude (Evoke Blink):**
Wait — let's use a clean Astral Drift example:
You control Astral Drift + Cloudblazer (ETB: gain 2 life, draw 2 cards).
Cycle Street Wraith ({0} cycling, pay 2 life): Astral Drift triggers.
Exile Cloudblazer (blinking it). End of turn: Cloudblazer returns.
Cloudblazer ETB: gain 2 life (recover the 2 life lost to Street Wraith), draw 2 cards.
Cost: cycle Street Wraith (pay 2 life + draw 1 card) → gain 2 life + draw 2 cards + removed a blocker temporarily.
Net: draw 3 total (1 from cycling + 2 from Cloudblazer ETB), net life gain 0 (paid 2, gained 2).
Free repeated Cloudblazer triggers via cycling.

## Commonly Confused With
- **P212 (Madness)** — Madness triggers when a card is DISCARDED (for any reason). Cycling triggers the cycling ability (and separately triggers madness if the card has both).
- **P165 (Miracle)** — Miracle triggers when DRAWN. Cycling triggers when discarded.
- **P213 vs Loot** — "Loot" (draw then discard) and cycling (discard to draw) are different: timing of draw/discard is swapped.
