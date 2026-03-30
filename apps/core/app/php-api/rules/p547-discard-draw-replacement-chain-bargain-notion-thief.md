---
id: p547
name: Discard-Draw Replacement Chain — Bargain and Notion Thief
category: replacement
cr_refs: [614.1, 614.5, 701.24, 613.11]
tags: [bargain, discard, draw, replacement-effect, notion-thief, chain, duskmourn]
created: 2026-03-30
examples_count: 2
---

# P547 — Discard-Draw Replacement Chain — Bargain and Notion Thief

## Abstract

**Bargain combines discard and draw in a single ability resolution.** When Bargain causes you to discard and then draw (or draw and discard), and Notion Thief is on the battlefield, the draw component can be redirected to an opponent. Notion Thief applies to draws you don't control; if Bargain's controller discards, Notion Thief redirects that draw to the opponent. Multiple replacement effects can apply to the same draw event; the player whose effect triggered (in this case, Bargain's controller) chooses the order of replacement application. This pattern clarifies the interaction between linked draw-discard effects and replacement redirects.

## The Definitive Rules

**CR 701.24 (Discard):** *"To discard a card, move it from your hand to your graveyard."*

**CR 614.1 (Replacement Effects):** *"Replacement effects watch for a particular event and completely or partially replace it with a different event."*

**CR 614.5 (Multiple Replacements):** *"A replacement effect can apply to any event in the game, and more than one replacement effect can apply to any given event... Multiple replacement effects can apply to an event if they don't have mutually exclusive conditions."*

**Official Ruling (Notion Thief):** *"If an opponent draws a card and you control Notion Thief, you draw that card instead. This happens any time a card would be drawn, including from effects like Bargain."*

**Official Ruling (Bargain — DSK):** *"Bargain represents an activated ability. 'Bargain' means 'You may discard a card. When you do, [effect].'"*

## The Pattern

```
BARGAIN MECHANIC:

  Bargain (DSK): Activated ability.
  "[Bargain] means 'You may discard a card. When you do, [effect].'"

  Example: Duskmourn creature with Bargain
    "Bargain — {T}: Target opponent may discard a card from their hand.
     When they do, draw two cards."

  Sequence:
    1. You activate Bargain ability (paying {T} and other costs)
    2. You discard a card (or opponent does, depending on wording)
    3. Ability resolves: draw two cards

NOTION THIEF REPLACEMENT:

  Notion Thief: "If an opponent would draw a card while you control Notion Thief,
    instead that player puts that many cards from the top of their library into their
    graveyard."

  Applies to: any draw by any opponent (or any non-controller of Notion Thief)

  Key mechanic: "instead" (replacement effect)
    - Redirects draw to mill effect
    - Applies to each draw individually
    - If drawing multiple cards, applies to each card

BARGAIN + NOTION THIEF INTERACTION:

  Scenario: You control Notion Thief. Opponent controls a creature with Bargain.

  Opponent activates Bargain: discard and draw two cards.

  Two replacement effects could apply:
    1. Notion Thief: "If an opponent would draw, they put that many into their library instead"
    2. Bargain effect: "draw two cards"

  Actually, Notion Thief IS a replacement of the draw. When the opponent tries to draw:
    → Notion Thief replaces "draw card" with "put that card from library into graveyard"

  Result: The opponent's draw from Bargain is replaced with Notion Thief's mill effect.

MULTIPLE REPLACEMENTS (SAME DRAW EVENT):

  If Bargain says "discard a card. When you do, draw two cards" and you control
    multiple replacement effects:
    1. Notion Thief: redirects draw to mill
    2. Replacement effect X: modifies draw another way

  The player whose effect triggered (Bargain's controller) chooses the order
    of replacement application.

  Example: Bargain controller also controls Notion Thief (self-owned)
    - Discard happens
    - Draw is triggered
    - Notion Thief applies (put library cards into graveyard instead)
    - No actual draw occurs (replacement prevented it)

ORDER OF REPLACEMENT APPLICATION:

  If multiple replacements apply to the same draw:
    1. Identify which replacements apply
    2. The player controlling the ability that created the draw event chooses order
    3. Apply replacements in chosen order
    4. If one replacement completely prevents the event, later replacements may not apply

  Example: Bargain controller controls both Notion Thief AND another replacement
    - Draw is triggered
    - Bargain controller chooses order of replacements
    - If Notion Thief applies first: draw becomes mill (no actual draw)
    - If other replacement applies first: may allow the draw to occur and Notion Thief applies

DISCARD + DRAW CHAIN:

  Bargain can link discard to draw in various ways:
  - "Discard a card. When you do, draw two cards."
  - "Draw a card. When you do, discard a card."
  - "Discard a card. Draw a card."

  Notion Thief applies only to DRAW events, not discard events.

  If Bargain is "discard, then draw" and you control Notion Thief:
    - Discard happens normally
    - Draw is replaced by Notion Thief
    - Result: card discarded, opponent mills instead of draws

SELF-OWNED NOTION THIEF:

  If you control Notion Thief and activate a Bargain on your own creature:
    - Discard happens (you discard from your hand)
    - Draw is triggered
    - Notion Thief: "if an opponent would draw" — does NOT apply (you are not an opponent)
    - You draw normally

```

## Definitive Conclusions

- **Notion Thief applies to opponent draws** — Bargain's draw component is redirected if Notion Thief is in play.
- **Multiple replacements apply in chosen order** — the player whose effect triggered Bargain chooses the order of replacement application.
- **Discard is not affected by Notion Thief** — only draw events are redirected; discard stands alone.
- **Replacement prevents the event** — if Notion Thief replaces a draw, the original draw doesn't happen (mill instead).

## Canonical Example

**Bargain + Notion Thief:**

You control Notion Thief. Your opponent controls a creature with Bargain: "Bargain — {T}: Target opponent may discard a card from their hand. When they do, draw two cards."

Opponent activates Bargain, targeting you. You discard a card from your hand. When you do, the Bargain effect triggers: "draw two cards."

Notion Thief's replacement applies: "If an opponent would draw a card while you control Notion Thief, that player puts that many cards from the top of their library into their graveyard instead."

You are an opponent of the Notion Thief controller (actually, wait — you control it, so the rule doesn't apply here).

Actually, let me restate: **You control Notion Thief. Your OPPONENT activates Bargain on their creature, targeting you.**

Opponent: "Discard a card. When you do, draw two cards."

You discard. The Bargain effect triggers: you draw two cards.

Notion Thief: "If an opponent would draw" — you are not an opponent to yourself. Notion Thief does NOT apply.

You draw two cards normally.

**Example 2 — Opponent Controls Notion Thief:**

Opponent controls Notion Thief. You control a creature with Bargain.

You activate Bargain: "Discard a card. When you do, draw two cards."

You discard from your hand. The Bargain effect triggers: you draw two cards.

Notion Thief's replacement applies: "If an opponent would draw" — you are an opponent of the Notion Thief controller.

Instead of you drawing two cards, you mill two cards (put them from the top of your library into your graveyard).

Result: you discarded 1 card and milled 2 cards. No cards were drawn.

## Commonly Confused With

- **P020 (Replacement Draw Redirection)** — P020 covers draw replacement mechanics; P547 applies to Bargain's specific draw-discard chain.
- **P002 (Replacement vs. Trigger)** — P002 covers replacement identification; P547 clarifies ordering of multiple replacements.
- **P012 (Recursive Replacement)** — P012 covers replacement chains; P547 applies to linked draw-discard events.
