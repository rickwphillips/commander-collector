---
id: p043
name: Miracle — Draw Reveal Window and First-Card Restriction
category: replacement
cr_refs: [702.94a, 702.94b, 603.11]
tags: [miracle, draw, first-card, reveal, cast-window, draw-step, instant-speed, linked-ability]
created: 2026-03-28
examples_count: 2
---

# P043 — Miracle — Draw Reveal Window and First-Card Restriction

## Abstract
Miracle is a static ability linked to a triggered ability that creates a cast opportunity. The reveal can only happen if the miracle card is the FIRST card drawn in the turn. If revealed, the triggered ability goes on the stack and when it resolves, the controller may cast it at the miracle cost. Because the cast happens when the trigger resolves, a miracle instant can be cast at any time the trigger resolves, and a miracle sorcery can be cast during the draw step (which is the active player's turn) — a rare opportunity to cast a sorcery during a step that isn't the main phase.

## The Definitive Rule

**CR 702.94a** (verbatim): *"Miracle is a static ability linked to a triggered ability. 'Miracle [cost]' means 'You may reveal this card from your hand as you draw it if it's the first card you've drawn this turn. When you reveal this card this way, you may cast it by paying [cost] rather than its mana cost.'"*

**CR 702.94b**: If a player reveals a miracle card, they play with that card revealed until it leaves their hand, the ability resolves, or it leaves the stack.

## The Pattern

```
MIRACLE SEQUENCE:
  1. You draw a card
  2. If it's the FIRST card drawn this turn AND it has miracle:
     → You may reveal it as you draw it (before it enters your hand)
     → "As you draw it" — this is instantaneous, part of the draw event

  3. If revealed:
     → Triggered ability goes on the stack
     → The card is held in a "revealed from hand" state
     → Opponents can respond to the triggered ability

  4. When trigger resolves:
     → You may cast the card at miracle cost
     → This is a casting permission — timing overrides normal rules
     → Miracle sorcery drawn in draw step can be cast at miracle cost
       even though draw step isn't a main phase (special casting permission)

FIRST CARD RESTRICTION:
  "First card you've drawn this turn" — strict
  If you've already drawn a card this turn, miracle can't be triggered
  Ways to draw a card before your draw step:
    → Sylvan Library (draws at upkeep): if this draws, draw step draw isn't first
    → Any draw at end step last turn: that's a different turn, fine
    → Card drawn during opponent's turn: that's a different turn, fine
  "Cantrip" effects: if you draw via a cantrip BEFORE your draw step, your
    draw step card is no longer the first card drawn this turn

CAN OPPONENTS RESPOND TO MIRACLE TRIGGER?
  Yes — the triggered ability is on the stack
  They can Stifle it (cancel the cast opportunity → card stays in hand normally)
  They cannot remove the card from hand (it's in your hand, just revealed)

WHAT IF MIRACLE ISN'T CAST?
  You choose not to cast at miracle cost → trigger resolves without casting
  You may still cast it later from your hand at full cost
  The miracle cost is optional, not mandatory

DRAW STEP SORCERY:
  During your draw step, you draw your card (turn-based action)
  If it's a miracle sorcery and you reveal it:
  Triggered ability goes on stack → receives priority → trigger resolves
  You may cast the sorcery right there in the draw step
  This is because "you may cast it" overrides the "main phase only" sorcery restriction
```

## Definitive Conclusions

- **Miracle only triggers if it's the first card you've drawn this turn.** Draw anything else first and miracle is disabled for that turn.
- **The trigger goes on the stack — opponents can respond.** They can counter the trigger with Stifle.
- **Miracle sorceries can be cast in the draw step.** The casting permission in the triggered ability overrides normal sorcery timing.
- **Not casting via miracle is fine.** You keep the card and can cast it later at full cost.
- **The reveal is instantaneous "as you draw it" — no window.** Once you decide to reveal, the trigger goes on the stack.

## Canonical Example
**Temporal Mastery (Miracle {1}{U}) drawn as first card:**
Your draw step: you draw Temporal Mastery (take an extra turn). It's the first card drawn this turn. You reveal it immediately. Triggered ability goes on stack. Priority passes. Opponents pass back. Trigger resolves: you may cast it for {1}{U} instead of {5}{U}{U}. You cast it. Take an extra turn. 2 mana for Time Walk.

**Example 2 — First card restriction foiled:**
You control Phyrexian Arena, which says "At the beginning of your upkeep, you draw a card and you lose 1 life." Upkeep trigger fires, you draw a card. That's now your first card of this turn. During draw step, you draw Entreat the Angels (miracle). It's NOT the first card — Phyrexian Arena already gave you one. Miracle doesn't trigger. You cast it normally at full sorcery cost or wait.

## Commonly Confused With
- **P033 (Madness)** — Both madness and miracle create a "cast this from a zone" triggered ability. Madness is triggered by discard; miracle is triggered by drawing. Both can override normal timing restrictions.
- **P006 (Intervening If Clause)** — "If it's the first card you've drawn this turn" appears in the STATIC ability (first part), not as an intervening-if in the triggered ability. The condition is checked at draw time, not when the trigger resolves.
