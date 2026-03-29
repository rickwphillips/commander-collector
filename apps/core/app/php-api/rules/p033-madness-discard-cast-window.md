---
id: p033
name: Madness — Discard Replacement and Cast Window
category: replacement
cr_refs: [702.35a, 702.35b, 702.35c, 601.2]
tags: [madness, discard, replacement-effect, exile, cast-window, instant-speed, sorcery-speed, timing]
created: 2026-03-28
examples_count: 3
---

# P033 — Madness — Discard Replacement and Cast Window

## Abstract
Madness is two abilities layered together: a static replacement effect that redirects discards to exile, and a triggered ability that offers the cast opportunity when exiled this way. Because the triggered ability creates a casting permission, you may cast madness cards at the timing point when the trigger resolves — regardless of whether the card is a sorcery. This means a madness sorcery can be cast at instant speed if it was discarded during an opponent's turn or during a spell's resolution. The key vulnerability: opponents can respond to the triggered ability and remove the card from exile before you cast it.

## The Definitive Rule

**CR 702.35a** (verbatim): *"Madness is a keyword that represents two abilities. The first is a static ability that functions while the card with madness is in a player's hand. The second is a triggered ability that functions when the first ability is applied. 'Madness [cost]' means 'If a player would discard this card, that player discards it, but exiles it instead of putting it into their graveyard' and 'When this card is exiled this way, its owner may cast it by paying [cost] rather than paying its mana cost. If that player doesn't, they put this card into their graveyard.'"*

**CR 702.35b**: Casting via madness follows the rules for alternative costs.

**CR 702.35c**: After the madness trigger resolves, if the card wasn't cast and moved to a public zone, effects referencing the discarded card can find it.

## The Pattern

```
MADNESS SEQUENCE:
  1. Player would discard a card with madness from their hand
     → Replacement fires: exile the card instead of graveyarding it
     → Card is now in exile (face-up, in a special madness exile)

  2. Triggered ability triggers: "When this card is exiled this way..."
     → Goes on the stack at the next opportunity
     → Opponents CAN respond to this triggered ability

  3. When trigger resolves: owner may cast it at madness cost
     → This is a "casting permission" that overrides normal timing
     → Can cast a SORCERY at instant speed if trigger resolves during
        opponent's turn or during a spell resolution
     → If not cast: card moves to graveyard

TIMING OF THE CAST:
  The "you may cast" permission is created at trigger resolution time
  Normal timing restrictions (sorcery speed) are OVERRIDDEN by this permission
  Example: Opponent casts Boomerang targeting your permanent
    → You respond with Tormenting Voice (discard a card) → madness triggers
    → Tormenting Voice resolves → madness trigger on stack during opponent's turn
    → Trigger resolves → you may cast the sorcery even on opponent's turn

  BUT: if discard happens during your main phase with an empty stack:
    Madness trigger goes on stack, opponent gets priority, you get priority
    You can cast the madness spell when trigger resolves (during your main phase)

CAN OPPONENTS RESPOND TO THE MADNESS TRIGGER?
  YES — the trigger is on the stack
  They can counter it with Stifle (trigger fizzles → card to graveyard)
  They can't "destroy" the exiled card (it's in a face-up exile, not targetable)
  They can cast spells that would prevent your cast before the trigger resolves

MADNESS COST ALTERNATIVE:
  You can choose NOT to cast via madness — trigger resolves, card goes to graveyard
  You can't cast it at normal mana cost via madness — it's the alternative cost or nothing
  You CAN still pay kicker and other additional costs on top of madness cost

WHAT COUNTS AS "DISCARD"?
  Any effect that uses the word "discard" triggers madness
  Looter (draw, discard): ✓ triggers madness
  Cycling (discard to draw): ✓ triggers madness if it's discarding
  "Exile from hand" effects: ✗ NOT a discard, madness doesn't trigger
  Hand size discard at cleanup: ✓ triggers madness
```

## Definitive Conclusions

- **Madness sorceries can be cast at instant speed** if the discard occurred at a time that puts the trigger's resolution during a non-main-phase window.
- **The triggered ability is the window, not the replacement.** The replacement is automatic (discard goes to exile). The trigger offers the choice.
- **Opponents can counter the madness trigger with Stifle.** The card goes to the graveyard without being cast.
- **If you don't cast via madness, the card goes to the graveyard**, not back to hand. Madness is use-it-or-graveyard-it.
- **Cycling can enable madness.** If a card with both madness and cycling is cycled (which involves discarding), madness replaces the discard to exile first.

## Canonical Example
**Fiery Temper (Madness {R}) discarded to Faithless Looting:**
You cast Faithless Looting during opponent's end step ("Draw two cards, then discard two cards"). You choose to discard Fiery Temper. Replacement: Fiery Temper is exiled instead of graveyarded. Madness trigger goes on the stack. Trigger resolves: you may cast Fiery Temper for {R} targeting opponent. You cast it — a sorcery (no, Fiery Temper is an instant) — actually instant, so this is straightforward. But even if it were a sorcery, the madness permission overrides timing.

**Example 2 — Madness sorcery at opponent's end step:**
Grave Upheaval is a sorcery with madness {2}{B}. Opponent forces you to discard it (Thoughtseize effect, or opponent uses an ability causing you to discard). Madness replacement fires → exiled. Madness trigger goes on stack during opponent's turn → trigger resolves → you may cast Grave Upheaval for {2}{B} even though it's a sorcery and it's opponent's turn. The madness permission overrides the sorcery timing restriction.

**Example 3 — Cleanup step discard:**
You have 8 cards at end of turn. You discard down to 7 including a madness card. The madness trigger fires. If triggered abilities fire during cleanup, players get priority and another cleanup follows (CR 514.2). The madness trigger goes on the stack, you get a priority window, cast or discard.

## Commonly Confused With
- **P002 (Replacement vs. Trigger)** — Madness uses BOTH. The replacement (discard→exile) is automatic; the trigger (may cast) uses the stack. P033 focuses on the practical timing consequence of this combination.
- **P012 (Recursive Replacement)** — Madness's replacement applies once to the discard event. If the cast from exile is a new event, madness doesn't re-apply.
