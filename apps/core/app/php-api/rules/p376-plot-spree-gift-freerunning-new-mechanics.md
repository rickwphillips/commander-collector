---
id: p376
name: Plot, Spree, Gift, and Freerunning — Outlaws of Thunder Junction and Modern Horizons 3 Mechanics
category: stack
cr_refs: [702.170a, 702.170b, 702.170c, 702.170d, 702.172a, 702.173a, 702.174a, 702.174b, 702.174c, 702.174d]
tags: [plot, spree, gift, freerunning, exile-then-free-cast, modal-additional-cost, choose-opponent-give-effect, assassin-or-commander-damage, face-down-main-phase, stack-empty-sorcery-speed, Oko-the-Ringleader, Kellan-Inquisitive-Prodigy, Plot-mechanics, Outlaws-Thunder-Junction, Modern-Horizons-3]
created: 2026-03-29
examples_count: 2
---

# P376 — Plot, Spree, Gift, and Freerunning — Outlaws of Thunder Junction and Modern Horizons 3 Mechanics

## Abstract
**Plot** (702.170a) lets you pay a cost during your main phase (stack empty) to exile a card face down, then cast it for free on a future main phase (stack empty). Unlike foretell: plot requires sorcery-speed conditions (stack empty); you can cast the plotted card on any future turn (not just your own). **Spree** (702.172a) is a modal mechanic for spells with multiple modes, where each mode costs an additional amount on top of the base cost — you choose which modes to include and pay their combined costs. **Freerunning** (702.173a) is an alternative cost available if a player was dealt combat damage this turn by an Assassin creature or your commander. **Gift** (702.174a) is an optional additional cost: choose an opponent and pay the gift cost — the spell gives that opponent a bonus while you get the full spell effect. Strategic: sometimes the gift is worth it for cheaper casting.

## The Definitive Rules

**CR 702.170a** (verbatim): *"Plot is a keyword ability that functions while the card with plot is in a player's hand. 'Plot [cost]' means 'Any time you have priority during your main phase while the stack is empty, you may exile this card from your hand and pay [cost]. It becomes a plotted card.'"*

**CR 702.170d** (verbatim): *"A plotted card's owner may cast it from exile without paying its mana cost during their main phase while the stack is empty during any turn after the turn in which it became plotted."*

**CR 702.172a** (verbatim): *"Spree is a static ability found on some modal spells that applies while the spell on the stack. Spree means 'Choose one or more modes. As an additional cost to cast this spell, pay the costs associated with those modes.'"*

**CR 702.173a** (verbatim): *"Freerunning is a static ability that functions on the stack. 'Freerunning [cost]' means 'You may pay [cost] rather than pay this spell's mana cost if a player was dealt combat damage this turn by a creature that, at the time it dealt that damage, was an Assassin creature or a commander under your control.'"*

**CR 702.174a** (verbatim): *"Gift is a keyword that represents two abilities. It is written 'Gift a [something].' The first ability is a static ability that functions while the card with gift is on the stack... The first ability is always 'As an additional cost to cast this spell, you may choose an opponent.'"*

**CR 702.174b** (verbatim): *"On a permanent, the second ability represented by gift is 'When this permanent enters, if its gift cost was paid, [effect].' On an instant or sorcery spell, the second ability represented by gift is 'If this spell's gift cost was paid, [effect].'"*

## The Pattern

```
PLOT (702.170a–f):
  WHAT IT IS:
    While the card is in hand: during your main phase with empty stack, pay the plot cost.
    Exile the card face down. It's now "plotted."
    Future turns: during YOUR main phase with empty stack, you may cast it from exile for FREE.
    "Without paying its mana cost" — no mana needed for the cast. Just timing requirement.
  TIMING REQUIREMENTS:
    PLOT ACTION: main phase, stack empty, while you have priority (702.170a).
    Special action: doesn't use the stack. Can't be responded to. (702.170b)
    CAST FROM EXILE: main phase, stack empty, any future turn.
    "Any turn after the turn in which it became plotted" — not the same turn.
    But: does "your main phase" apply? 702.170d says "during their main phase."
    Wait: "their main phase" = the plotted card's owner's main phase.
    So: you can ONLY cast the plotted card during YOUR main phase (the owner's).
    Not at instant speed. Not during opponents' turns. Main phase, stack empty only.
  FACE-DOWN IN EXILE:
    Like foretell: face down. Only you can see what it is.
    Unlike foretell: the cost conditions are different (sorcery-speed conditions for casting).
    Also unlike foretell: you KNOW plot cost was paid for that specific card (vs. foretell which
      uses the foretell cost, not "free").
  PLOT vs. FORETELL:
    Foretell: pay {2} to exile, then pay foretell cost (reduced cost) on future turns.
    Plot: pay plot cost to exile, then cast FOR FREE on future turns.
    Timing:
      Foretell: can exile any time (any priority during your turn).
      Plot: can only exile during your main phase with empty stack (sorcery speed).
      Foretell: can cast the foretold card on any future turn (instants can be cast at instant speed if instant).
      Plot: can only cast plotted card during your main phase (always sorcery speed, even for instants!).
  PLOT EXAMPLES (OUTLAWS OF THUNDER JUNCTION):
    Oko, the Ringleader ({3}{G}{U}): "Plot {2}{G}{U}. When this enters..." Planeswalker.
      Plot for {2}{G}{U}: exile Oko face down this main phase.
      Next turn: cast Oko for free during main phase.
      Effect: spread cost over two turns, and the second turn is free.
    Various spells with high mana costs: plot lets you "compress" two turns of mana into one
      by paying the plot cost one turn and getting the free cast the next.

SPREE (702.172a):
  WHAT IT IS:
    Modal spells with an additional-cost system.
    "Choose one or more modes." Each mode has an associated cost (displayed with + symbol).
    The spell has a base mana cost + you pay additional costs for each mode you choose.
    You must choose at least ONE mode (and can choose all of them if you pay all costs).
  COMPARED TO CHOOSE ONE/TWO:
    Standard modal spells (Charm with "choose one"): you pick one mode, pay the one mana cost.
    Spree: you pick multiple modes, paying ADDITIONAL costs per extra mode.
    This gives spree spells incredible flexibility: spend more mana = more effects.
  SPREE EXAMPLE:
    A spree spell might have:
      Base cost: {1}{U}
      Mode 1 (+{U}): "Draw two cards."
      Mode 2 (+{2}): "Counter target spell."
      Mode 3 (+{R}): "Deal 3 damage to target creature."
    Choose modes 1 and 3: pay {1}{U} + {U} + {R} = {U}{R}{1}{U} total.
    All three modes: {1}{U} + {U} + {2} + {R} = {4}{U}{U}{R}. Expensive but does everything.
    Just mode 2: {1}{U} + {2} = {3}{U}. A counterspell for {3}{U}.
  FLEXIBILITY AS VALUE:
    Unlike overload (702.96a: all-or-nothing text change), spree lets you customize per situation.
    In a given situation: choose only what you need and pay only for that.

FREERUNNING (702.173a):
  CONDITION:
    "A player was dealt combat damage this turn by a creature that, at the time it dealt that damage,
      was an Assassin creature or a commander under your control."
    Requires: combat damage this turn FROM an Assassin or your commander.
    The check is "at the time it dealt that damage" — the creature must have been an Assassin
      or your commander WHEN the damage was dealt. Not before, not after.
  ONCE AVAILABLE, ALL FREERUNNING:
    Any time in the turn after the condition is met, any spell you cast can use freerunning cost
      (if it has one) instead of normal cost.
    The condition needs to be met once per turn (combat damage from Assassin/commander).
  DESIGN INTENT:
    Outlaws of Thunder Junction: Assassin tribal theme. Hit with an Assassin → cheaper follow-up.
    Commander variants: hit with your commander → cheaper spells. (This creates a "commander combat"
      incentive in Commander games.)
  FREERUNNING EXAMPLES:
    Vraska, the Silencer ({4}{B}{G}): "Freerunning {3}{B}{G}." 5/4 planeswalker.
      Hit with an Assassin or commander → cast Vraska for {3}{B}{G} instead of {4}{B}{G}.
      Slightly reduced. More meaningful on expensive spells.
    Multiple freerunning spells in a turn: once the condition is met, all freerunning spells that
      turn are eligible (as long as the condition remains true — since it's based on already-dealt
      damage, it stays true for the rest of the turn).

GIFT (702.174a–k):
  WHAT IT IS:
    Optional additional cost: choose an opponent. Pay the gift cost (usually no extra mana).
    Choosing an opponent = "gifting" — the chosen opponent gets the gift effect.
    "Gift a [something]" specifies what the chosen opponent receives.
  THE TRADEOFF:
    You give the opponent something (Food, a card, a token, etc.).
    In exchange: the spell often costs less with the gift paid, OR the spell has extra effects.
    Actually: looking at 702.174a–b: the gift cost is the additional cost of "choosing an opponent."
      There's no mana reduction implied (the text says "as an additional cost").
      The benefit might be that choosing the opponent gives the spell an additional effect.
      702.174b: "When this permanent enters, if its gift cost was paid, [effect]." OR
        "If this spell's gift cost was paid, [effect]."
    So: the spell's "effect" (the main effect) still happens regardless.
    But: if you paid the gift cost (chose an opponent), an ADDITIONAL effect happens — for the opponent.
    AND: the spell may have a cost reduction or bonus for you too.
    Actually: it depends on the individual card. Some gift cards reduce the cost; others just give
      the opponent something as a "bargain" — you choose to give them something for a bigger effect.
  GIFT EXAMPLES:
    Sneaky Snacker ({1}{U}): "Gift a card. When this enters, if its gift cost was paid, draw a card."
      Wait, if gift a card: "the chosen player draws a card." And you get an effect.
      Gift version: chosen opponent draws a card. You also get a draw (if the gift effect was paid).
      Net: you draw 1, opponent draws 1. The gift makes it symmetrical. But the base spell might be
        asymmetric (you only draw if gift was paid).
    Gift of Wicker ({1}{W}): "Gift a Treasure. [Main effect]."
      With gift: opponent gets a Treasure. You get the full effect.
      Sometimes opponent's Treasure is worth it for a discounted or boosted effect on your side.
  DESIGN PHILOSOPHY:
    Gift cards are designed for politics in multiplayer/Commander.
    "I'll give YOU a Treasure [political currency] in exchange for this effect."
    Also: vs. weaker opponents, the "gift" might be too small to matter.
    Vs. strong opponents: giving them a card/treasure might be too costly.
    Strategic choice: worth it or not?
  GIFT "COST" IS CHOOSING AN OPPONENT:
    702.174a: "The first ability is always 'As an additional cost to cast this spell, you may choose an opponent.'"
    The "additional cost" is choosing an opponent. You don't pay extra mana.
    You give them something (the gift) AS PART OF THE SPELL RESOLVING.
```

## Definitive Conclusions

- **Plot requires sorcery-speed conditions for both exiling and casting** — unlike foretell (any priority to exile), plot needs main phase + empty stack; plotted cards are cast for free but ONLY during your main phase with empty stack (never at instant speed, even if the card is an instant).
- **Spree lets you pay for multiple modes as additional costs** — the base cost covers the spell; each mode adds its own additional cost; you can scale up to buy as many modes as you can afford.
- **Freerunning requires combat damage from an Assassin or commander THIS TURN** — the creature must BE an Assassin or commander at the time of dealing damage (not just before or after); once condition is met, all freerunning spells are discounted for the rest of the turn.
- **Gift's "cost" is choosing an opponent** — the opponent receives the gift on resolution; you get the spell's effect; whether it's worth it depends on the strategic context.

## Canonical Example
**Oko, the Ringleader Plot:**
Turn 3: Main phase, stack empty. Hand contains: Oko, the Ringleader ({3}{G}{U}: planeswalker, powerful abilities). Plot cost: {2}{G}{U}.
  Plot action: pay {2}{G}{U}, exile Oko face down. Not on the stack (special action). No responses.
  Face-down card in exile. Opponents know you plotted something but not what.

Turn 4: Main phase, stack empty.
  "Cast Oko from exile without paying its mana cost."
  Oko goes on the stack for FREE (no mana paid for casting).
  Opponents CAN respond (counter, etc.) — it's on the stack now as a normal spell.
  Oko resolves: enters the battlefield as a planeswalker.

Total cost: {2}{G}{U} (turn 3 plot cost). Normal cast would be {3}{G}{U}.
Plot version: 1 less generic mana, but over two turns.
Plus: hidden information during the plot phase.

If opponents had held a counterspell specifically for Oko: they might have wasted it.
By the time you cast Oko from exile: they may have spent their interaction on other things.
Plot creates decision pressure even before the spell resolves.

**Example 2 — Spree Spell Flexibility:**
Bourne Upon the Wind (hypothetical spree spell):
  Base cost: {2}{U}
  Mode A (+{1}): "Draw two cards."
  Mode B (+{U}): "Return target permanent to its owner's hand."
  Mode C (+{2}{U}): "Counter target spell."

Scenario 1: Opponent just cast a 5-drop threat. You have {7}{U}{U}{U}.
  Choose modes A, B, and C: pay {2}{U} + {1} + {U} + {2}{U} = {5}{U}{U}{U}.
  Counter the 5-drop. Bounce their 3-drop that's been bothering you. Draw 2 cards.
  All three effects for 8 mana. Massive value.

Scenario 2: You have {3}{U} and need card advantage.
  Choose mode A only: pay {2}{U} + {1} = {3}{U}.
  Draw 2 cards. Simple.

Scenario 3: Opponent cast something you must counter. You have {5}{U}{U}.
  Choose mode C only: pay {2}{U} + {2}{U} = {4}{U}{U}.
  Counter target spell. Don't draw, don't bounce.

Spree spell adapts to every situation by scaling its mana investment.
The base card is essentially 3 cards in one, selectively activated.

## Commonly Confused With
- **P373 (Foretell/Spectacle)** — Plot is closely related to foretell. Both exile face down and cast later. Key differences: foretell can be done at any priority during your turn (not just main phase), foretold cards can be cast at instant speed (if the card is an instant), foretell uses a different cost (foretell cost, not free). Plot: strictly sorcery-speed for both exile and cast, but the cast is FREE.
- **P370 (Miracle/Overload)** — Overload is also a "target-to-each" text-change like spree (which changes how many modes apply). But overload is binary (target vs. each); spree is gradated (choose which modes). Miracle and plot both have a "cast for free/reduced" aspect — miracle from hand at draw, plot from exile at main phase.
- **P367 (Splice/Conspire/Ninjutsu)** — Gift giving an opponent something is similar in concept to "helping your opponent" cards. But gift is straightforward: opt-in political deal where you pay a cost (choose opponent, they receive something) to unlock an effect. Splice adds text to another spell.
- **P362 (Storm)** — Plotting and casting from exile: the cast from exile IS a cast event. Storm count increases when you cast a plotted card. If you cast a storm spell via its plot: storm triggers and counts other spells cast that turn.
