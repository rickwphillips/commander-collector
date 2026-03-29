---
id: p165
name: Miracle — Cast at Reduced Cost When Drawn as First Draw This Turn
category: costs
cr_refs: [702.94a, 702.94b]
tags: [miracle, first-draw, reveal, reduced-cost, flash-cast, Temporal-Mastery, Entreat-the-Angels, AVR]
created: 2026-03-28
examples_count: 2
---

# P165 — Miracle — Cast at Reduced Cost When Drawn as First Draw This Turn

## Abstract
Miracle is a linked static/triggered ability: if you reveal a miracle card when you draw it AS THE FIRST CARD you've drawn this turn, you may cast it at its miracle cost instead of its normal mana cost. This allows instant-speed sorceries (since the draw can happen during an opponent's turn), and the miracle cost is typically much cheaper. The reveal is optional — you don't have to reveal, so you can "hide" the miracle by not revealing. If you do reveal, you must cast it immediately or not at all (it returns to hand as normal if you don't cast).

## The Definitive Rules

**CR 702.94a** (verbatim): *"Miracle is a static ability linked to a triggered ability. (See rule 603.11.) 'Miracle [cost]' means 'You may reveal this card from your hand as you draw it if it's the first card you've drawn this turn. When you reveal this card this way, you may cast it by paying [cost] rather than its mana cost.'"*

**CR 702.94b** (verbatim): *"If a player chooses to reveal a card using its miracle ability, they play with that card revealed until that card leaves their hand, that ability resolves, or that ability otherwise leaves the stack. (See rule 701.20a.)"*

## The Pattern

```
MIRACLE:
  Two linked abilities:
    1. Static (as drawn): if first card drawn this turn, may reveal
    2. Triggered (when revealed): may cast at miracle cost

  MIRACLE TIMING:
    "As you draw it" — the reveal happens immediately when drawn
    The triggered ability goes on the stack after drawing
    Before anything else in that draw step resolves: the trigger is set up

  MIRACLE + FIRST DRAW:
    Strictly the FIRST card drawn this turn (by you)
    If you've drawn before this turn (draw step, cantrip, etc.): too late for miracle
    Opponent's Brainstorm giving you cards: you drew first on THEIR end step → not your draw → may still be your first draw this turn
    Wait: "this turn" — it's about whether YOU have drawn before THIS turn
    Your draw step draw: first draw this turn (if you haven't drawn yet this turn)
    A card drawn during your draw step: first draw → miracle possible

  MIRACLE + INSTANT SPEED:
    Miracle's triggered ability can be used at instant speed
    The trigger goes on the stack when drawn — even during an opponent's turn
    If you draw a miracle card during opponent's end step (e.g., opponent played a spell that let you draw):
      → If it's your first draw this turn: reveal → trigger → cast at miracle cost at INSTANT SPEED
      Even if the miracle card is a sorcery! (The miracle ABILITY lets you cast it at that time)

  MIRACLE + CAST DECISION:
    "You may cast it" — optional at trigger resolution
    If you don't cast it: card remains in hand at normal cost
    You can choose NOT to reveal → no trigger → draw normally, cast later

  MIRACLE + COST:
    Normal cost vs miracle cost:
    Temporal Mastery ({5}{U}{U} = 7 mana normally): miracle cost {1}{U} = 2 mana!
    Entreat the Angels ({X}{W}{W}{W} normally): miracle {X}{W}{W} = slightly cheaper
    Miracle costs are typically much cheaper → huge tempo advantage

  MIRACLE + REVEALS:
    If you reveal for miracle: card is visible to all players until the trigger resolves
    Must keep it revealed — CR 702.94b
    If opponent has a response: they can act before you cast the miracle spell

  MIRACLE + FETCH LANDS / CARD ORDER MANIPULATION:
    Scroll Rack: put cards from hand on top of library, draw that many
      → The first of those draws: miracle-eligible
    Brainstorm: put 2 cards on top after drawing 3
      → On next draw step: first draw → miracle if that top card has miracle

  MIRACLE CARDS:
    Temporal Mastery (Extra turn): miracle {1}{U} → one of the cheapest extra turn spells
    Entreat the Angels (create X 4/4 angels): miracle {X}{W}{W} → instant-speed angel army
    Devastation Tide (bounce all nonland): miracle {1}{U} → one-sided board reset
    Banishing Stroke (exile a nonland): miracle {W} → free exile
    Thunderous Wrath (5 damage): miracle {R}
```

## Definitive Conclusions

- **Miracle requires the FIRST card drawn that turn** — reveals must be immediate.
- **Revealing is optional** — choose not to reveal to preserve surprise.
- **Miracle casts can be at instant speed** — even sorceries can be cast via miracle during opponent's turn.
- **Much cheaper than normal cost** — Temporal Mastery costs {1}{U} instead of {5}{U}{U}.
- **If you reveal but don't cast**, the card stays in hand to cast later at normal cost.

## Canonical Example
**Temporal Mastery (Miracle {1}{U}, normal {5}{U}{U}):**
Your draw step: draw Temporal Mastery → first draw this turn → reveal → miracle trigger.
Pay {1}{U}: cast Temporal Mastery → you take an extra turn.
Without miracle: would cost {5}{U}{U} = 7 mana. With miracle: {1}{U} = 2 mana.
Seven mana saved on a Time Walk effect.

**Example 2 — Entreat the Angels (Miracle {X}{W}{W}, normal {X}{W}{W}{W}):**
Opponent attacks you during their turn. You've set up Miracles on top (via Brainstorm, Scroll Rack).
At the beginning of their end step: if you had not yet drawn this turn → miracle opportunity?
Actually: your draw step is on YOUR turn. "This turn" = the current game turn.
More likely: on YOUR draw step, draw Entreat → miracle → pay {5}{W}{W} → create five 4/4 flying angels at instant speed (well, sorcery rules apply here if you can only cast at sorcery speed normally, but miracle says "you may cast it" — this is during your draw step, which is before main phase, so it's cast as you would cast a spell at instant speed during draw step).
Actually: miracle fires when drawn, even during the draw step — you can cast a sorcery during the draw step via miracle since the miracle ability itself says "cast it."

## Commonly Confused With
- **P164 (Rebound)** — Rebound casts again from exile at next upkeep. Miracle casts immediately when drawn as first draw.
- **P146 (Suspend)** — Suspend delays the cast with time counters. Miracle speeds up the cast with a discount when drawn.
- **P165 vs Foretell (P128)** — Foretell exiles and casts later. Miracle casts immediately when drawn.
