---
id: p365
name: Madness, Cycling, and Discard-Based Mechanics — Using Cards While Discarding
category: stack
cr_refs: [702.35a, 702.35b, 702.35c, 702.29a, 702.29b, 702.29c, 702.29d, 702.29e, 702.29f]
tags: [madness, cycling, discard, typecycling, exile-instead-of-GY, when-you-cycle, triggered-cycling, Liliana-of-the-Veil, Faithless-Looting, Fiery-Temper, Olivia-Voldaren, Animate-Dead-cycle, Zenith-Flare, Drake-Haven, Orcish-Bowmasters, discard-outlet, discard-trigger]
created: 2026-03-29
examples_count: 2
---

# P365 — Madness, Cycling, and Discard-Based Mechanics — Using Cards While Discarding

## Abstract
**Madness** (702.35a) is a two-part keyword: a static ability that redirects a discard to exile, and a triggered ability that lets you cast the exiled card at madness cost. The key: the card is **exiled** instead of going to the GY when discarded. If you don't cast it from exile, it goes to the GY. **Cycling** (702.29a) is an activated ability: pay the cycling cost, discard the card, draw a card. Cycling triggers separately from the discard event. Some cards have "when you cycle this card" triggers (702.29c) that fire when cycling. **Typecycling** (702.29e) is a cycling variant that searches for a card of a specific type instead of drawing. All cycling abilities remain on objects in all zones (702.29b), meaning some effects can reference that an object has cycling even while it's on the battlefield.

## The Definitive Rules

**CR 702.35a** (verbatim): *"Madness is a keyword that represents two abilities. The first is a static ability that functions while the card with madness is in a player's hand. The second is a triggered ability that functions when the first ability is applied. 'Madness [cost]' means 'If a player would discard this card, that player discards it, but exiles it instead of putting it into their graveyard' and 'When this card is exiled this way, its owner may cast it by paying [cost] rather than paying its mana cost. If that player doesn't, they put this card into their graveyard.'"*

**CR 702.29a** (verbatim): *"Cycling is an activated ability that functions only while the card with cycling is in a player's hand. 'Cycling [cost]' means '[Cost], Discard this card: Draw a card.'"*

**CR 702.29c** (verbatim): *"Some cards with cycling have abilities that trigger when they're cycled. 'When you cycle this card' means 'When you discard this card to pay an activation cost of a cycling ability.' These abilities trigger from whatever zone the card winds up in after it's cycled."*

**CR 702.29e** (verbatim): *"Typecycling is a variant of the cycling ability. '[Type]cycling [cost]' means '[Cost], Discard this card: Search your library for a [type] card, reveal it, and put it into your hand. Then shuffle your library.'"*

## The Pattern

```
MADNESS — EXILE-INSTEAD-OF-GY (702.35a):
  HOW IT WORKS:
    You discard a card with madness (via any discard effect).
    INSTEAD of going to the GY (normal discard destination):
      The card is EXILED. (Replacement effect: discard → exile instead.)
    A triggered ability fires: "when this card is exiled this way, its owner may cast it."
    The trigger goes on the stack. You can respond (opponents can also respond).
    When the trigger resolves: you CHOOSE:
      Cast it at madness cost (alternative cost — usually less than normal mana cost).
      OR: don't cast it → it goes to your GY now.
  TIMING:
    The trigger fires and goes on the stack WHILE the discarding event is resolving.
    "When you cycle, opponents respond" — similar with madness.
    You announce discard → card exiled → triggered ability goes on stack → opponents can respond
      → trigger resolves → you cast or not.
  EXAMPLE:
    Fiery Temper ({1}{R}{R}): Madness {R}. "Fiery Temper deals 3 damage to any target."
    Opponent plays Liliana of the Veil (+1 ability): "Each player discards a card."
    You discard Fiery Temper. Instead of GY: Fiery Temper is exiled (madness replacement).
    Madness trigger: "may cast Fiery Temper for {R}."
    Trigger goes on stack. Resolves. You cast Fiery Temper for {R}.
    Fiery Temper deals 3 damage to Liliana of the Veil (or opponent, etc.).
    Fiery Temper was "discarded" by a forced discard and became a spell for {R} instead of {1}{R}{R}.
  IF YOU DON'T CAST:
    You choose not to cast Fiery Temper (maybe you can't pay {R} or don't want to target anything).
    Fiery Temper goes to your GY.
  WHAT TRIGGERS MADNESS:
    ANY discard of the card with madness, by ANY effect:
      Your own discard effects (Faithless Looting).
      Opponent's forced discard (Liliana, Thoughtseize).
      Discard to cycling, jump-start, retrace costs.
      Discard to pay a kicker cost (if it says "discard a card").
    Any discard triggers madness. You choose to use it or not.
  MADNESS AND ORCISH BOWMASTERS:
    Orcish Bowmasters ({1}{B}): "Flash. When this enters, and whenever an opponent draws a card,
      create a 1/1 black Orc Army token... and Amass Orcs 1."
    This isn't directly madness, but illustrates forced-discard synergies.
    Madness specifically fires on discard events, not draw events.

CYCLING (702.29a):
  WHAT IT IS:
    Cycling is an ACTIVATED ABILITY (not a triggered ability).
    "Cycling [cost]" = "[Cost], Discard this card: Draw a card."
    The discard is the COST, not an effect.
    Activating cycling = pay cost, discard card → draw card.
  CYCLING IS NOT A SPELL CAST:
    Cycling is an activated ability. It's NOT casting a spell.
    This means:
      - Prowess does NOT trigger (prowess: "whenever you cast a spell").
      - Storm count does NOT increase.
      - "Whenever you cast a spell" effects don't trigger for cycling.
      - The card never goes on the stack as a spell.
    EXCEPTION: "Whenever you cycle a card" triggers (702.29c).
  TIMING:
    Cycling is an activated ability. Can be activated any time you have priority.
    So: instant speed. You can cycle during opponent's turn, during upkeep, etc.
    Normal cycling cost is paid, card is discarded, you draw a card.
  WHEN YOU CYCLE THIS CARD TRIGGERS (702.29c):
    Some cards have an additional trigger when they're cycled.
    "When you cycle this card" fires from whatever zone the card is in after cycling.
    The card was discarded to the GY (by the cycling cost). The trigger fires from the GY.
    Example: Astral Drift ({2}{W}): "When you cycle Astral Drift or cycle another card,
      you may exile target creature. If you do, return it to the battlefield under its owner's
      control at the beginning of the next end step."
    You cycle a random card. Astral Drift's trigger fires from the hand (? — it's an enchantment,
      not the cycled card). Wait: Astral Drift says "when you cycle Astral Drift OR CYCLE ANOTHER CARD."
      This is on the enchantment. It fires when ANY cycling happens — including Astral Drift cycling itself.
    A card with "when you cycle THIS card": when THIS specific card is cycled.
    Fires from the GY (after the card was discarded).
  CYCLING AND MADNESS INTERACTION:
    Can you cycle a card with madness and use madness?
    Cycling costs "discard this card." Discarding triggers madness.
    But: madness's replacement redirects the discard to EXILE (not GY).
    If the card is exiled (madness), the cycling cost is paid (discard happened, but destination changed).
    The draw from cycling still happens (cost was paid — card was discarded even if to exile).
    The madness trigger fires.
    So: you can cycle a madness card, draw a card from cycling, AND have the option to cast the card at madness cost.
    You're effectively: spend cycling cost + madness cost, get a draw AND cast the madness card.
  DRAKE HAVEN INTERACTION:
    Drake Haven ({2}{U}): "Whenever you cycle or discard a card, you may pay {1}. If you do, create a 2/2 blue Drake token with flying."
    Each time you cycle ANY card: Drake Haven trigger fires. Pay {1}: get a Drake.
    This rewards cycling-heavy decks with creature tokens.
  ZENITH FLARE — WIN CONDITION:
    Zenith Flare ({3}{R/W}): "Zenith Flare deals damage equal to the number of cards with cycling in your graveyard to any target. You gain that much life."
    After cycling many cards: Zenith Flare ends the game. Each cycled card in GY = 1 damage.
    At 10 cycled cards: Zenith Flare deals 10 damage. 20 cards = 20 damage.

TYPECYCLING (702.29e):
  "Mountaincycling," "basic landcycling," "swampcycling" etc.:
    Discard this card: SEARCH for a card of the specified type.
    Different from normal cycling (draw a card vs. search for a specific type).
  USEFULNESS:
    Landcycling: fix mana base by searching for land types.
    Swampcycling: search for a Swamp specifically.
    Basic landcycling: search for any basic land.
  STILL A CYCLING ABILITY (702.29f):
    Effects that say "whenever you cycle a card" ALSO trigger for typecycling.
    Drake Haven fires when you typecycle.
    Zenith Flare counts typecycled cards in GY.

DISCARD SYNERGIES AND ECONOMY:
  Faithless Looting ({R}): "Draw 2 cards, then discard 2 cards. Flashback {2}{R}."
    Non-madness discard. Good with madness cards in hand.
    Also: madness cards discarded to Looting trigger madness.
  Liliana of the Veil ({1}{B}{B}):
    +1: "Each player discards a card." Forces both players to discard.
    You can choose to discard a madness card → use madness for value while opponent loses a card.
```

## Definitive Conclusions

- **Madness exiles the card instead of putting it in the GY** — the exile is a replacement effect; the triggered ability then lets you cast at madness cost or put it in your GY.
- **Madness triggers on ANY discard** — your own looting spells, opponents' forced discard effects, discard costs (cycling, jump-start): all trigger madness.
- **Cycling is an activated ability, not a spell cast** — prowess and storm don't trigger; "when you cast a spell" effects don't see cycling.
- **Typecycling is a cycling ability** — it triggers "when you cycle" effects and is counted for Zenith Flare and similar.
- **"When you cycle THIS card" triggers from the GY** — the trigger fires after the card has been discarded as the cycling cost; it fires from wherever the card ended up.
- **You can cycle a madness card AND use madness** — the cycling discard triggers madness; you draw from cycling AND have the option to cast at madness cost.

## Canonical Example
**Fiery Temper + Faithless Looting:**
Your hand: Fiery Temper ({1}{R}{R}: madness {R}), Faithless Looting ({R}).
Opponent is at 3 life. You have 2 mountains.
Turn 3: Cast Faithless Looting ({R}). Resolve: draw 2, then discard 2.
You choose to discard Fiery Temper (and another card).
Fiery Temper madness triggers: it's exiled instead of going to GY.
Madness trigger: "may cast Fiery Temper for {R}."
Trigger resolves. You have 1 mountain remaining (tapped one for Looting).
Pay {R}: Cast Fiery Temper for madness cost {R}. Target opponent.
Fiery Temper deals 3 damage to opponent at 3 life. Opponent dies.
Total cost: {R} (Looting) + {R} (madness) = {R}{R} for draw 2, discard 1 (the other card), AND deal 3 damage.
Normally: 3 damage with Fiery Temper costs {1}{R}{R} plus you didn't draw. Huge value.

**Example 2 — Cycling Into Drake Haven Engine:**
You control Drake Haven ({2}{U}): "Whenever you cycle or discard a card, you may pay {1}. If you do, create a 2/2 blue Drake."
You have 5 cards with cycling in hand.

During opponent's turn (cycling is instant speed):
Cycle Desert Cerodon ({4}{R}): pay {R/W}, discard → draw a card.
Drake Haven trigger: pay {1}. Create 2/2 Drake.
Cycle Renewed Faith ({2}{W}): pay {1}{W}... wait: Renewed Faith has Cycling {2}. Pay {2}, discard → draw.
Drake Haven trigger: pay {1}. Another Drake.
Cycle another cycling card. Another Drake.
Cycle another. Another.
Cycle last one. Another.
5 cards cycled: 5 Drakes. Each cost the cycling cost + {1} for Drake Haven = efficient token production at instant speed.

Now you have 5 2/2 Drakes with flying. Attack for 10 next turn.
Additionally: each draw from cycling gives you new cards to work with.
This is the "Cycling Fires" deck engine in Standard (2020 rotation era).
Zenith Flare as win condition: GY has 5+ cycled cards. Cast Zenith Flare. 5+ damage to opponent.

## Commonly Confused With
- **P346 (Cycling/Adventure/Kicker)** — P346 covers cycling's basic mechanics and how it combines with kicker and adventure costs. P365 focuses on madness + cycling interaction specifically and discard-based mechanics as a whole.
- **P356 (Flashback/Jump-Start)** — Jump-start costs "discard a card." If you jump-start a card and have a madness card in hand, you could discard the madness card to pay the jump-start cost, triggering madness. Madness works with ANY discard source, including jump-start and retrace.
- **P002 (Replacement Effects)** — Madness's first ability is a replacement effect: "if this card would go to the GY from a discard, it goes to exile instead." This is a standard replacement effect (614.1a: "instead"). P002 covers how replacement effects work; P365 covers how madness specifically applies one.
- **P339 (Dies Triggers)** — "Whenever a player discards a card" triggers are NOT "dies" triggers; they're specific discard-event triggers. They fire when any card is discarded (including cycling and madness). Blood Artist doesn't trigger on discards; it triggers on creature deaths.
