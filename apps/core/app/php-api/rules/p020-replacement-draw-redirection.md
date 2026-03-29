---
id: p020
name: Replacement Draw Redirection
category: replacement
cr_refs: [614.1, 614.5, 120.2, 120.3, 614.8b]
tags: [draw, replacement, redirection, notion-thief, wheel-of-fortune, multi-draw, individual-draw, opponent, redirect]
created: 2026-03-28
examples_count: 1
---

# P020 — Replacement Draw Redirection

## Abstract
"Draw N cards" is not a single atomic event — it is N individual draw events processed one at a time (CR 120.2). This means replacement effects that modify individual draws apply N times to an N-card draw effect. A replacement effect that says "if an opponent would draw a card, instead that player skips that draw and you draw a card" intercepts each individual draw, one at a time, and redirects them. In a multiplayer game with a Wheel effect, the controller of the redirection effect can end up drawing all the cards every opponent would have drawn.

## The Definitive Rule

**CR 120.2**: *"Cards are drawn one at a time. If a player is instructed to draw multiple cards, that player performs that many individual card draws."*

**CR 614.1a**: Replacement effects apply to events using "instead." Each draw event is individually checked against all applicable replacement effects.

**CR 614.5**: A replacement effect applies only once to any given event (single draw). But since "draw 7" is 7 separate draw events, the replacement can apply to each of the 7 independently.

**Notion Thief ruling (2018-03-16)**: *"If two or more players each control a Notion Thief and a player would draw a card other than the first one in their draw step, that player chooses one of the applicable Notion Thief effects to apply..."*

## The Pattern

```
"DRAW N CARDS" DECOMPOSITION:
  Instruction: "each player draws 7 cards" (Wheel of Fortune)
  ↓
  Decompose to: 7 individual draws per player
  ↓
  For each draw, check replacement effects:

  Notion Thief: "If an opponent would draw a card except the first
    one they draw in each of their draw steps, instead that player
    skips that draw and you draw a card."
  ↓
  Opponent's draw → Notion Thief intercepts → you draw instead
  ↓
  Repeat for each of opponent's 7 draws
  ↓
  You draw 7 for each opponent (14 in 2-player, 21 in 3-player, etc.)
  Opponents draw 0 (except first draw step draw — but Wheel isn't
    their draw step, so all 7 are intercepted)

MULTI-PLAYER WHEEL IN COMMANDER (4 players, you have Notion Thief):
  → You discard hand, draw 7 (your own draws, not affected by Thief)
  → Opponent A draws 0, you draw 7 more (intercepted)
  → Opponent B draws 0, you draw 7 more
  → Opponent C draws 0, you draw 7 more
  Total: you draw 28 cards, opponents draw 0
```

## Definitive Conclusions

- **"Draw N" = N individual draws.** The N-draw instruction decomposes. Each individual draw is a separate replaceable event.
- **Notion Thief intercepts each draw separately.** A single Wheel of Fortune results in the Thief's controller drawing 7 per opponent, since each of those 7 draws is individually redirected.
- **The "first draw in draw step" exception is irrelevant for Wheel.** Notion Thief's exception is for draw steps only. Wheel of Fortune resolves during a main phase — all 7 opponent draws are non-draw-step draws and are intercepted.
- **Opponents still discard.** Notion Thief ruling: *"If an opponent is instructed to draw a card then discard a card, and Notion Thief causes you to draw instead, that opponent still discards."* A Wheel makes opponents discard their hand regardless of whether their draws are stolen.
- **Two Notion Thieves = choosing order.** If two players each control a Notion Thief, the player whose draw would be intercepted chooses which Thief to apply, then the chosen Thief's controller chooses, and so on. In practice, the choosing chain usually returns the draw to the original player (two Thieves = paradox resolves by having the player draw their own cards per ruling).
- **The replacement effect replaces, not redirects as a trigger.** There is no priority window between the draw being "stolen." No way to respond to Notion Thief intercepting — it applies as a replacement.

## Canonical Example
**Notion Thief + Windfall/Wheel of Fortune:**
Opponent casts Windfall (each player discards hand, draws X). You flash in Notion Thief in response, before Windfall resolves. Windfall resolves: you discard your hand and draw X (your own draws, unaffected). Each opponent discards their hand. Then their draw X is intercepted draw-by-draw — you draw X per opponent. In a 4-player game, you draw 3X cards, opponents draw 0.

**Notion Thief + Sylvan Library:**
Sylvan Library gives the Library's controller extra draws — those are draws by the Library's controller (you), not an opponent. Notion Thief doesn't apply to your own draws. No interaction.

## Commonly Confused With
- **P002 (Replacement vs. Trigger)** — P020 is a specific application of P002. The key new insight is the decomposition of "draw N" into N individual events.
- **P012 (Recursive Replacement)** — P012 is about the same replacement applying again to the event it generates. P020 is about a replacement applying to each element of a decomposed event. These are different: Notion Thief applies once per draw (not to the replacement draw itself, since you draw, not an opponent).
