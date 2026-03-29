---
id: p438
name: Jump-Start, Escape, and Foretell — GY/Exile Alternative Casting and Zone Restrictions
category: zones
cr_refs: [702.133a, 702.138a, 702.138b, 702.143a, 702.143b, 614.15, 400.7, 702.135a]
tags: [jump-start, escape, foretell, GY-cast, exile-cast, alternative-cost, additional-cost, Grafdigger-Cage, escaped-status, blink-escape, exile-face-down, special-action, Chemister-Insight, Uro-Titan, Saw-It-Coming, Elspeth-Conquers-Death, cage-stops-casting, Uro-sacrifice-blink, Guilds-of-Ravnica, Theros-Beyond-Death, Kaldheim]
created: 2026-03-29
examples_count: 2
---

# P438 — Jump-Start, Escape, and Foretell — GY/Exile Alternative Casting and Zone Restrictions

## Abstract
Three mechanics from different sets that enable casting spells from non-hand zones. **Jump-Start** (702.133) casts an instant or sorcery from the GY with a discard-a-card additional cost, then exiles the card. **Escape** (702.138) casts from the GY via an alternative cost that typically includes exiling other cards from the GY. **Foretell** (702.143) is a two-step process: exile a card face-down from hand as a special action, then cast it from exile on a future turn for its foretell cost. Key non-obvious interactions: (1) **Grafdigger's Cage stops jump-start AND escape but NOT foretell** — Cage stops casting from graveyards; foretell casts from exile, which Cage doesn't restrict; (2) **blinking an escaped creature removes the "escaped" status** — blink creates a new object (CR 400.7); the new Uro that enters is a fresh object without the "escaped" designation; Uro's "sacrifice unless escaped" trigger fires again and you must sacrifice the new Uro unless it escapes again; (3) **foretell exiling is a special action**, not a spell cast — it can be done during any step or phase of YOUR turn as long as you have priority, not just during main phase.

## The Definitive Rules

**CR 702.133a** (verbatim): *"Jump-start appears on some instants and sorceries. It represents two static abilities: one that functions while the card is in a player's graveyard and another that functions while the card is on the stack. 'Jump-start' means 'You may cast this card from your graveyard if the resulting spell is an instant or sorcery spell by discarding a card as an additional cost to cast it' and 'If this spell was cast using its jump-start ability, exile this card instead of putting it anywhere else any time it would leave the stack.'"*

**CR 702.138a** (verbatim): *"Escape represents a static ability that functions while the card with escape is in a player's graveyard. 'Escape [cost]' means 'You may cast this card from your graveyard by paying [cost] rather than paying its mana cost.' Casting a spell using its escape ability follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

**CR 702.138b** (verbatim): *"A spell or permanent 'escaped' if that spell or the spell that became that permanent as it resolved was cast from a graveyard with an escape ability."*

**CR 702.143a** (verbatim): *"Foretell is a keyword that functions while the card with foretell is in a player's hand. Any time a player has priority during their turn, that player may pay {2} and exile a card with foretell from their hand face down. That player may look at that card as long as it remains in exile. They may cast that card after the current turn has ended by paying any foretell cost it has rather than paying that spell's mana cost."*

**CR 702.143b** (verbatim): *"Exiling a card using its foretell ability is a special action, which doesn't use the stack."*

## The Pattern

```
JUMP-START (702.133a):
  "Cast this card from your GY if resulting spell is instant or sorcery,
   by discarding a card as an additional cost.
   If cast this way: exile instead of going anywhere else when it leaves stack."

  ADDITIONAL COST (not alternative):
    Jump-start cast = original mana cost + discard a card.
    Not "instead of mana cost" — you pay BOTH the mana cost AND discard.
    Can you jump-start an already-paid card from GY? Yes: pay mana cost again + discard.

  "RESULTING SPELL IS AN INSTANT OR SORCERY":
    Jump-start only works for instant or sorcery spells.
    If somehow a non-instant/sorcery card had jump-start: couldn't be used (restriction).
    In practice: jump-start appears only on instants and sorceries in the game.

  CAN'T DISCARD THE JUMP-START CARD TO PAY ITS OWN COST:
    The jump-start card is in the GY being CAST. It's not in your hand.
    "Discard a card" means from hand. The jump-start card isn't in hand.
    You must discard a different card from hand.

  EXILE ON LEAVING STACK ("exile instead"):
    This is a self-replacement effect (614.15): applies before other replacement effects.
    When the jump-started spell would go anywhere (GY, library, hand, exile via other effect):
      it goes to exile instead. One-shot use from GY; can't jump-start again afterward.
    Except: if the spell is on the stack and is somehow moved to a zone OTHER than GY
      before it would normally leave: the "leave the stack" replacement fires when it does.

  GRAFDIGGER'S CAGE + JUMP-START:
    Cage: "Players can't cast spells from graveyards or libraries."
    Jump-start casts a spell from the graveyard. CAGE STOPS JUMP-START.
    Compare: embalm/eternalize (activated ability, not casting) = Cage doesn't stop those.

ESCAPE (702.138a):
  ALTERNATIVE COST:
    Pay escape cost INSTEAD OF the mana cost. Escape cost often includes:
      - Colored mana symbols (replacing the original cost)
      - "Exile N other cards from your graveyard" as additional cost component
    Uro, Titan of Nature's Wrath ({1}{G}{U}: escape {G}{G}{U}{U}, exile 5 other cards):
      Pay {G}{G}{U}{U} + exile 5 other GY cards. That's both the mana and the exile cost.
    If you don't have 5 other GY cards: CAN'T activate escape (can't pay the exile cost).

  "ESCAPED" STATUS (702.138b):
    A permanent "escaped" if the spell that became it was cast from a GY using escape.
    The escaped status is a fact about the current permanent object.
    Uro's "sacrifice unless escaped": checks if THIS Uro (this permanent object) escaped.

  BLINK REMOVES "ESCAPED" STATUS:
    Ephemerate exiles Uro then returns it. Zone change = new object (CR 400.7).
    The new Uro that enters the battlefield is a FRESH OBJECT. It did NOT escape — it
      entered via Ephemerate, not by being cast from the GY with escape.
    Uro's ETB trigger fires: "sacrifice this unless it escaped." New Uro didn't escape.
    You must sacrifice the new Uro UNLESS you have another way to give it "escaped" status.
    There is no rules mechanism to give a permanent "escaped" status except by actually
      casting it from the GY with escape.
    RESULT: Uro's blink doesn't persist. Every blink re-triggers the sacrifice clause.
      Uro is a temporary threat unless you're re-escaping it each time it dies/is exiled.

  ESCAPE + "ENTERS WITH COUNTERS" (702.138c):
    CR 702.138c: "escaped with [counters]" means "if this permanent escaped, it enters
      with those counters."
    The escape status affects the ETB — counters only appear if the card actually escaped.

  GRAFDIGGER'S CAGE + ESCAPE:
    Same as jump-start: casting from GY. Cage stops escape.

FORETELL (702.143a):
  TWO-STEP PROCESS:
    Step 1 (any time you have priority during YOUR turn): pay {2}, exile a foretell card
      face-down from hand. SPECIAL ACTION — not a spell, uses no stack.
    Step 2 (on any future turn, after the current one ends): cast the face-down exiled card
      by paying its foretell cost (alternative cost to its mana cost).

  TIMING OF THE EXILE STEP:
    "Any time you have priority during your turn" — not just main phase.
    You can foretell during your combat phase, upkeep, draw step, etc.
    Priority during your end step: you can foretell then too.
    Opponent can't do anything in response to the foretell action (special action, no stack).

  "AFTER THE CURRENT TURN HAS ENDED":
    Can't cast the foretold card on the same turn it was exiled.
    Next turn (yours OR opponent's): can cast it if during your main phase?
    Actually: "may cast that card after the current turn has ended" — any turn after.
    Since casting usually requires your main phase with an empty stack (for sorceries):
      Foretold sorceries: your main phase, stack empty.
      Foretold instants: any time you have priority (any turn, any step).

  FORETELL COST IS ALTERNATIVE COST:
    Paying foretell cost = alternative to paying the printed mana cost.
    Saw It Coming ({1}{U}{U}: foretell {1}{U}): normal cost = {1}{U}{U}; foretell cost = {1}{U}.
    The foretell cost is cheaper — provides discount + surprise factor (face-down exile).

  INFORMATION HIDING:
    The exiled card is face-down. Opponent can't see it.
    You can have multiple foretold cards in exile. Must be able to differentiate between them
      (CR 702.143e: keep track of order and any different foretell costs).
    Opponent knows you exiled something (the action isn't secret) but doesn't know what.

  GRAFDIGGER'S CAGE + FORETELL:
    Cage: "Players can't cast spells from graveyards or libraries."
    Foretell casts from EXILE, not GY or library. CAGE DOES NOT STOP FORETELL.
    Compare cascade (casts from exile) — also not stopped by Cage.

SUMMARY: CAGE STOPS / DOES NOT STOP:
  STOPS (cast from graveyard):
    - Jump-start (instant/sorcery from GY + discard)
    - Escape (any card type from GY with alternative cost)
    - Aftermath (split card second half from GY)
    - Retrace (instant/sorcery from GY + discard a land)
    - Flashback (cast from GY, exile on resolve)
  DOES NOT STOP (cast from exile OR activated ability):
    - Foretell (cast from exile)
    - Cascade (cast from exile)
    - Rebound (cast from exile)
    - Embalm/Eternalize (activated ability, not casting — creates token)
```

## Definitive Conclusions

- **Grafdigger's Cage stops jump-start and escape but NOT foretell** — jump-start and escape cast from the graveyard (Cage applies); foretell casts from exile (Cage says "graveyards or libraries" — exile is neither).
- **Blinking an escaped Uro removes its escaped status permanently** — the new object that re-enters hasn't escaped; Uro's "sacrifice unless escaped" trigger fires; you must sacrifice the blinked Uro unless you escape it from the GY again.
- **Jump-start requires a DIFFERENT card to discard** — the jump-start card is in the GY being cast, not in hand; you must have another card in hand to discard.
- **Foretell exile is a special action, not a spell** — it can happen during any step/phase of your turn (including combat, upkeep, etc.) and opponents can't respond with anything.
- **Foretold cards remain in face-down exile; opponents can see one was exiled but not what it is** — significant information advantage in games with counterspells.
- **Escape requires sufficient GY fuel** — if you can't exile the required number of other GY cards, you can't use escape regardless of mana availability.

## Canonical Example
**Uro, Titan of Nature's Wrath + blink:**
Uro ({1}{G}{U}: legendary creature; "when it enters, sacrifice unless escaped; whenever it enters or attacks, gain 3 life, draw a card, may put a land from hand onto battlefield"; escape—{G}{G}{U}{U}, exile 5 other GY cards) is in your GY with 5 other cards.

You escape Uro: pay {G}{G}{U}{U}, exile 5 other GY cards.
Uro enters the battlefield. "Escaped" status: yes, this Uro escaped.
ETB trigger: "sacrifice unless escaped." This Uro escaped. Don't sacrifice. Gain 3 life, draw, put land.

You cast Ephemerate ({W}: instant; "exile target creature you control, return it to battlefield under your control") targeting Uro.
Uro is exiled, then re-enters. New object (CR 400.7). Did this new Uro escape? NO — it entered via Ephemerate, not by being cast from GY.
ETB trigger fires again: "sacrifice unless escaped." This Uro did NOT escape. You must sacrifice it.
Also triggers: gain 3 life, draw, put land (those trigger separately from the sacrifice clause).
You sacrifice Uro. It goes to GY. You gained 3 life and drew a card.

If you want to avoid the sacrifice: don't blink Uro. Or: after blinking, escape it again from GY if possible.

**Example 2 — Foretell timing edge case:**
You have Saw It Coming in hand ({1}{U}{U}: counter target spell; foretell {1}{U}).
Your opponent has a big threat they'll play on their next turn.

During your end step (priority on your end step): pay {2}, exile Saw It Coming face-down.
Your turn ends. Now it's opponent's turn.
Opponent casts their big spell.
You have priority (you can respond). Cast Saw It Coming from exile for foretell cost {1}{U}.
Counter target spell. Paid only {1}{U} instead of {1}{U}{U}.

Why foretell during your END STEP rather than main phase: you saved the {2} foretell cost
for when you actually needed to hold up countermagic mana, while still hiding the card type.
If you'd foretold earlier, you'd have tapped out paying {2}.
Timing the foretell action in end step gives maximum information (opponent committed to their plan)
before you decide whether to foretell or hold the card for other purposes.

## Commonly Confused With
- **P437 (Embalm/Eternalize/Aftermath)** — Aftermath also casts from GY and exiles on resolution; jump-start similarly exiles after GY cast. The key distinction: aftermath is specifically for split card second halves; jump-start works on standalone instants/sorceries with a discard additional cost; both are stopped by Grafdigger's Cage.
- **P430 (Rebound)** — Rebound exiles on first cast, re-casts from exile. Foretell pre-positions in exile before the first cast. Both cast from exile; both dodge Grafdigger's Cage. Rebound is automatic (if cast from hand); foretell is a deliberate special action.
- **P423 (Retrace)** — Retrace and jump-start both cast from GY with a discard cost; retrace discards a land specifically; jump-start discards any card. Both stopped by Cage. Retrace can be used repeatedly (each time you draw the card and discard lands); jump-start exiles the card on first use.
- **P424 (Cascade)** — Cascade casts from exile after revealing; foretell casts from exile. Both dodge Cage. Cascade is a triggered ability; foretell cast is a deliberate player action.
