---
id: p197
name: Mayhem — Cast from Graveyard If Discarded This Turn
category: costs
cr_refs: [702.187a, 702.187b, 702.187c]
tags: [mayhem, graveyard-cast, discard-synergy, alternative-cost, looting, wheels, Outlaws-Thunder-Junction]
created: 2026-03-28
examples_count: 2
---

# P197 — Mayhem — Cast from Graveyard If Discarded This Turn

## Abstract
Mayhem is a static ability that enables casting a card from the graveyard — but only if you discarded it this turn. If you discarded the card with Mayhem at any point this turn, you can cast it from the graveyard: either for a listed Mayhem cost (alternative cost) or for free (if the card has "Mayhem" without a cost). This rewards looting effects, Wheel effects, and other discard-and-draw engines by giving an immediate second use of discarded cards. Cards you're forced to discard (opponent effects, overfull hand) can become free instant-speed plays.

## The Definitive Rules

**CR 702.187a** (verbatim): *"Mayhem is a static ability that functions while the card with mayhem is in a player's graveyard."*

**CR 702.187b** (verbatim): *"'Mayhem [cost]' means 'As long as you discarded this card this turn, you may cast it from your graveyard by paying [cost] rather than paying its mana cost.' Casting a spell using its mayhem ability follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

**CR 702.187c** (verbatim): *"'Mayhem' without a cost means 'You may play this card from your graveyard if you discarded it this turn.'"*

## The Pattern

```
MAYHEM:
  Static ability functioning in graveyard
  Condition: "you discarded this card this turn"
  Two variants:
  - "Mayhem [cost]": cast from graveyard at alternative cost if discarded this turn
  - "Mayhem" (no cost): play from graveyard for free if discarded this turn

  MAYHEM + DISCARD CONDITION:
    Must have been discarded in the CURRENT turn (your turn or opponent's turn)
    "Discarded this turn" means any discard — your own looting, opponent's Thoughtseize, end-of-turn cleanup
    If you discarded it on a previous turn: condition not met; can't use Mayhem
    The condition resets each turn (new turn = condition not met until discarded again)

  MAYHEM + TIMING (YOUR DISCARD):
    Loot effect (discard a card, draw a card): discard a Mayhem card → it's now in graveyard with condition met
    Immediately can cast from graveyard this same turn
    Wheel of Fortune (all discard, then draw): discard all Mayhem cards → immediately cast any from graveyard

  MAYHEM + END-OF-TURN DISCARD:
    If hand is too large at end of turn (7+ cards): discard down to hand size
    Discard a Mayhem card during cleanup: condition met during cleanup step
    Can you cast it from graveyard during cleanup? Normally no — priority during cleanup is unusual
    But if you have priority during cleanup: you could cast it

  MAYHEM + OPPONENT DISCARD:
    Opponent casts Thoughtseize on YOUR turn: makes you discard a Mayhem card
    Condition is met! You can now cast it from your graveyard (this turn)
    Anti-synergy: opponent trying to strip your hand, but Mayhem card becomes even harder to remove

  MAYHEM + ONCE PER DISCARD:
    Mayhem doesn't have an "activate only once" clause — you can cast it if the condition is met
    But: once cast and resolved, it's no longer in graveyard
    If it returns to graveyard: the "discarded this turn" condition is about the DISCARD event
    The discard event still occurred this turn — condition still true
    So theoretically: cast Mayhem, it countered (returns to graveyard via counter), cast again?
    Actually: if countered, it would go to graveyard. The discard occurred this turn → condition met again.
    Depends on how the card leaves the stack (countered → graveyard vs. resolved → elsewhere).

  MAYHEM (NO COST) VS MAYHEM [COST]:
    "Mayhem [cost]": pay the alternative cost instead of normal mana cost
    "Mayhem" (no cost): play for free (like CR 702.187c says "you may PLAY" — includes casting)
    "Play" includes casting (for spells) or playing as a land (for lands with Mayhem)
    Free Mayhem: powerful — discard for free (looting), then cast for free

  MAYHEM + DISCARD ENGINES:
    Faithless Looting: discard 2, draw 2 → cast the 2 Mayhem cards from graveyard this turn
    Careful Study: similar — discard 2, draw 2 → Mayhem both discarded cards
    Wild Guess (discard 2, draw 2): powerful Mayhem enabler
    Wheel of Fortune/Windfall: mass discard → mass Mayhem (if multiple Mayhem cards discarded)

  MAYHEM + TURN TRACKING:
    The condition tracks across the entire turn (all priority windows)
    "This turn" in MTG = from the beginning of the turn to its end
    Both your turn and opponent's turns count as "a turn"
    If discarded on opponent's turn: can cast from graveyard during the rest of that turn
```

## Definitive Conclusions

- **Mayhem enables graveyard cast** after discarding the card in the same turn.
- **Any discard counts** — self-discard, opponent's effects, or end-of-turn discard.
- **"Mayhem [cost]"** = pay that alternative cost instead of mana cost.
- **"Mayhem" (no cost)** = free play from graveyard if discarded this turn.
- **Looting synergy** — discard + redraw engines maximize Mayhem value.

## Canonical Example
**A Mayhem {R} instant (normally {3}{R}) in an Outlaws of Thunder Junction deck:**
Turn 4: Cast Faithless Looting (draw 2, discard 2). Discard the Mayhem instant.
Mayhem instant is in graveyard. Condition met (discarded this turn).
Cast Mayhem instant from graveyard for {R} (instead of {3}{R}). Save 3 mana.
Total: Faithless Looting + Mayhem instant for {1}{R} + {R} = {1}{R}{R}. Efficient!

**Example 2 — Opponent Discard Empowers Mayhem:**
Opponent's Turn: Opponent casts Hymn to Tourach (discard 2 at random).
You randomly discard your Mayhem sorcery.
Opponent intended to strand you — instead: condition met during opponent's turn.
Cast Mayhem sorcery from graveyard for its Mayhem cost (this turn, any priority window).
If Mayhem sorcery is "Mayhem" (no cost, free): cast it immediately after the Hymn resolves!
Opponent's disruption backfired completely.

## Commonly Confused With
- **P168 (Escape)** — Escape casts from graveyard by exiling N other cards. No discard condition, more expensive, but not turn-limited.
- **P165 (Miracle)** — Miracle triggers when drawn as the first draw. Mayhem triggers when discarded this turn. Both care about specific card acquisition events.
- **P163 (Retrace)** — Retrace casts from graveyard by discarding a land (any land, each turn). Mayhem requires the SPECIFIC card was discarded; Retrace requires discarding a LAND.
- **P197 vs Flashback (P142)** — Flashback: cast from graveyard for flashback cost (no discard condition). Mayhem: cast from graveyard only if discarded this turn.
