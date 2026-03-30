---
id: p307
name: Cycling, Buyback, and Echo — Discard-Based Draw, Return to Hand, and Upkeep Costs
category: costs
cr_refs: [702.29a, 702.29c, 702.29e, 702.27a, 702.30a]
tags: [cycling, buyback, echo, typecycling, discard-draw, return-to-hand, upkeep-cost, Cycling, Tempest, Living-End-setup, Krosan-Tusker, Street-Wraith, Capsize, Regrowth, Pernicious-Deed]
created: 2026-03-29
examples_count: 2
---

# P307 — Cycling, Buyback, and Echo — Discard-Based Draw, Return to Hand, and Upkeep Costs

## Abstract
Three mechanics centered around card hand management and recurring costs. **Cycling** lets you pay a cost and discard the card to draw a card — providing card selection and powering graveyard strategies. **Typecycling** is a cycling variant that finds a specific card type from your library instead of just drawing. **Buyback** lets you pay an additional cost when casting an instant/sorcery to put it back in your hand after it resolves (recurring use). **Echo** triggers at the beginning of your upkeep on a permanent that just entered, requiring payment or sacrifice.

## The Definitive Rules

**CR 702.29a** (verbatim): *"Cycling is an activated ability that functions only while the card with cycling is in a player's hand. 'Cycling [cost]' means '[Cost], Discard this card: Draw a card.'"*

**CR 702.29c** (verbatim): *"Some cards with cycling have abilities that trigger when they're cycled. 'When you cycle this card' means 'When you discard this card to pay an activation cost of a cycling ability.' These abilities trigger from whatever zone the card winds up in after it's cycled."*

**CR 702.29e** (verbatim): *"Typecycling is a variant of the cycling ability. '[Type]cycling [cost]' means '[Cost], Discard this card: Search your library for a [type] card, reveal it, and put it into your hand. Then shuffle your library.'"*

**CR 702.27a** (verbatim): *"Buyback appears on some instants and sorceries. It represents two static abilities that function while the spell is on the stack. 'Buyback [cost]' means 'You may pay an additional [cost] as you cast this spell' and 'If the buyback cost was paid, put this spell into its owner's hand instead of into that player's graveyard as it resolves.'"*

**CR 702.30a** (verbatim): *"Echo is a triggered ability. 'Echo [cost]' means 'At the beginning of your upkeep, if this permanent came under your control since the beginning of your last upkeep, sacrifice it unless you pay [cost].'"*

## The Pattern

```
CYCLING:
  Activated ability from hand: pay the cycling cost + discard this card → draw a card
  Net: swap this card for a random draw. Useful when the card in hand is a "dead card" in current state.
  Cycling triggers: if the card says "when you cycle this card," that triggers on cycling.
  Triggers: even though the card goes to GY when cycled, the trigger fires from the GY
    (CR 702.29c: triggers from whatever zone the card ends up in).

  CYCLING USES:
    (A) Flexibility: a land with cycling lets you draw when you flood. A creature with cycling lets you
        find something better in the mid-game.
    (B) Graveyard filling: cycling puts cards in GY. Dredge, Living End, Reanimator use this.
    (C) Cheap filters: cycle high-cost cards to smooth draws.

  CYCLING NOTABLE CARDS:
    Street Wraith ({3}{B}{B}): 3/4 Swampwalk. Cycling — Pay 2 life.
      Cycle for 2 life: discard, draw. ZERO mana cost.
      Used in combo decks as a free cantrip: "I take 2 life, draw a card" with no mana.
      In Living End: cycle to fill GY with a 3/4 creature. Then Living End returns it.
      In Death's Shadow: lose life deliberately. Street Wraith cycling = free life loss + draw.

    Krosan Tusker ({5}{G}{G}): 6/5. Cycling {2}{G}.
      When you cycle Krosan Tusker: "You may search your library for a basic land card, reveal that card,
        put it into your hand, then shuffle."
      Combined cycling + trigger: cycle it for {2}{G}, get a land into hand + draw a card.
      The land goes to HAND — you still need to play it normally as your land drop.
      "Cycling Krosan Tusker" = Tithe-like land fetch + card draw from a 7-drop creature.

  TYPECYCLING (CR 702.29e):
    Instead of drawing a card: search library for a [type] card, reveal, put in hand.
    More selective than basic cycling.

    Loxodon Wayfarer (Planarcycling): Planarcycling {2}. "Search for any plane." (Portal/special format)
    Krosan Colossus: Forestcycling {2} (search for a Forest card).
    Staple in lands.dec: cycle for any basic land of that type (not just Forest—it's the subtype).

    Gempalm Incinerator ({2}{R}): Goblin. Cycling {1}{R}. "When you cycle this card, it deals
      damage to target creature equal to the number of Goblins in play."
      Instead of drawing: deal N damage to a creature (where N = Goblin count).
      In Goblin tribal: this is a cycling trigger kill spell for the cycling cost.
      You don't draw a card from the trigger — the trigger replaces the "draw" effect as a bonus?
      Actually: cycling = draw a card. The trigger is separate (fires when cycled).
      So: pay {1}{R}, discard Gempalm, draw a card (from cycling), AND the trigger fires (deal damage).
      Two effects for one cycling.

BUYBACK:
  Additional cost: pay the buyback cost on top of the spell's mana cost.
  When the spell resolves: instead of going to GY, goes back to your hand.
  Enables INFINITE RECURSION of an instant/sorcery with enough mana.

  BUYBACK NOTABLE CARDS (Tempest block):
    Capsize ({1}{U}{U}): Instant. Buyback {3}. "Return target permanent to owner's hand."
      Normal cost: {1}{U}{U} = 3 mana. Bounces a permanent, then goes to GY.
      With buyback: {1}{U}{U} + {3} = {4}{U}{U} = 6 mana. Bounces a permanent AND Capsize returns to hand.
      Once you have 6 mana open: Capsize-lock an opponent. Each turn: bounce their biggest threat.
      With more mana: bounce two permanents in one turn.
      Ultimate lock: in counterspell heavy control, Capsize every threat every turn.

    Whispers of the Muse ({U}): Instant. Buyback {5}. "Draw a card."
      With buyback: {U} + {5} = {5}{U} (6 mana) = draw a card, card goes back to hand. Repeat.
      In infinite mana scenarios: draw your entire library with Whispers of the Muse.

    Reclaim ({G}): Sorcery. Buyback {2}{G}. "Put target card from GY on top of library."
      With buyback: {2}{G}{G} = put GY card on top, Reclaim returns to hand.
      Infinite: use Reclaim to recur specific GY cards into library, then draw them.
      Loop: Reclaim → returns to hand → recur with Reclaim next turn again.

  BUYBACK TIMING:
    You decide to pay buyback at CAST TIME: during casting declaration.
    After the spell resolves: it goes to hand (not GY). This is a replacement effect.
    "Instead of putting into GY, put into hand" = replacement.

ECHO:
  Triggered at beginning of YOUR upkeep: if this permanent came under your control since your last upkeep.
  Check: did it enter "this cycle" (since last upkeep)? If yes: pay echo cost or sacrifice.
  "Echo [cost]" = usually the same as the casting cost.
  First turn under your control: pay or die. If you pay: no more echo triggers (it only triggers once per arrival).

  ECHO NOTABLE CARDS (Tempest/Urza block):
    Rofellos, Llanowar Emissary ({G}{G}): 2/1. "Tap: Add {G} for each Forest you control."
      Has echo (Urza block errata). Echo = {G}{G}. Pay or sacrifice on your next upkeep.
      High-value elf: producing tons of mana. Worth paying the echo.

    Callous Oppressor ({1}{U}{U}): "Opponents can't cast creature spells of the creature type of your choice."
      With echo, you pay or sacrifice. The echo cost is usually the mana cost.
      Echo makes a card "pay again" on the second turn.

  ECHO INTERACTIONS:
    If the permanent changes controllers, echo can trigger again for the new controller.
    CR 702.30a: "if this permanent came under your control since the beginning of your last upkeep."
    Ownership change: even if the original controller already paid, if it moves to a new controller,
    their upkeep requires a new echo payment.

    Flicker a creature with echo: it leaves and re-enters → comes under your control "this cycle" again.
    Next upkeep: echo triggers again (it came under your control since last upkeep = after blinking).

CYCLING + TRIGGER INTERACTIONS:
  Some spells care about cycling: "Whenever a card is cycled" (Decree of Silence).
  Astral Slide ({2}{W}): "Whenever a player cycles a card, you may exile target creature. Return it
    at beginning of next end step."
  Cycling a land? Counting as "a card is cycled": yes.
  Massive cycling + Astral Slide: cycle 4 cards in one turn → exile 4 creatures.
  Onslaught block cycling engine: Astral Slide + Lightning Rift (deal 2 damage per cycle).
```

## Definitive Conclusions

- **Cycling is from the hand** — discard + pay cost → draw a card. Works as GY enabler and card filter.
- **Typecycling searches your library for a specific card type** instead of drawing randomly.
- **Buyback puts the spell back in your hand** after it resolves, enabling infinite recursion with enough mana.
- **Echo triggers once when the permanent first comes under your control** — subsequent turns don't trigger it again unless it re-enters.
- **Cycling triggers fire from the graveyard** — the trigger resolves even though the card is now in the GY.

## Canonical Example
**Capsize Lock in Commander:**
Board: You have 8+ lands untapped. Opponent just cast Blightsteel Colossus.
Cast Capsize with buyback: pay {1}{U}{U} + {3} = {4}{U}{U} (6 mana).
Target: Blightsteel Colossus. Bounce it to their hand.
Capsize resolves: Blightsteel goes to hand. Capsize goes to YOUR HAND (buyback).
Opponent's turn: cast Blightsteel Colossus again (or anything threatening).
Your turn: 8 mana available again. Cast Capsize with buyback.
Bounce their threat. Capsize back in hand.
Repeat every turn as long as you have 6 mana.
The lock: opponent can never keep a permanent in play. Every threat bounced.
Eventually: opponent decks out (they keep redrawing the bounced card and playing it, then it gets bounced).
Or: you win while locking them out. Capsize lock in Commander = "I win slowly but surely."

**Example 2 — Street Wraith Cycling in Death's Shadow:**
Turn 1: draw step. Hand: Mishra's Bauble, Street Wraith, Thoughtseize, Death's Shadow.
No mana needed for this sequence.
During main phase: cycle Street Wraith (pay 2 life). Life total: 18. Draw a land.
Thoughtseize ({B}): pay 1 mana, pay 1 life. Life total: 17. Strip opponent's best card.
Mishra's Bauble ({0}): artifact, tap to look at top card and draw at beginning of next upkeep. Life total: 17.
Turn 2: Death's Shadow ({B}): 13/13 - your life total. At 17 life: Shadow is 13-17 = negative... wait.
Death's Shadow is 13/13 minus life total. But it can't have negative power/toughness from static rules.
Actually: Death's Shadow gets -X/-X where X = your life total (it's 13/13 normally, minus your life for the static).
At 17 life: Shadow is effectively 13-17 = -4 power. Still too low.
Keep cycling: life at 13 = Death's Shadow is a 0/0... no. 13-13 = 0. Still nothing.
At 12 life: 13-12 = 1/1. Getting there.
At 7 life: 13-7 = 6/6. Playing perfectly.
At 1 life: 13-1 = 12/12. One attack: lethal.
Street Wraith cycling contributes 2 life loss each cycle → makes Death's Shadow much bigger.

## Commonly Confused With
- **P282 (Escape/Delve)** — Both use the GY; cycling fills it, escape uses it as a cost. Cycling doesn't exile GY cards.
- **P295 (Flashback)** — Flashback casts from GY; cycling discards to draw (the card is gone, not cast from GY).
- **P298 (Kicker)** — Both buyback and kicker are additional costs; kicker scales the spell's effect, buyback returns it to hand instead of GY.
- **P300 (Undying/Persist)** — Echo triggers when the permanent enters under your control (recurring cost); undying and persist trigger when the permanent DIES. Both involve "when it enters/dies" conditions but are opposite trigger events.
