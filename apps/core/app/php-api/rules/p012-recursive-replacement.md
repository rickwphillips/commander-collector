---
id: p012
name: Recursive Replacement
category: replacement
cr_refs: [614.5, 614.1, 614.6]
tags: [replacement, recursive, draw, discard, chains-of-mephistopheles, instead, new-event, loop, termination]
created: 2026-03-28
examples_count: 1
---

# P012 — Recursive Replacement

## Abstract
A replacement effect that generates a new event can cause that new event to be subject to the same (or another) replacement effect — creating a recursive chain. This is not blocked by CR 614.5, which prevents a replacement from applying twice to the *same* event. Each generated event is a *new* event and may be replaced independently. The chain terminates only when the conditions required to trigger the replacement are no longer met, or when the replacement generates no further events.

## The Definitive Rule

**CR 614.5**: *"A replacement effect may apply only once to any given event."*

This prevents the same replacement from applying twice to the same event. It does NOT prevent a replacement from applying to new events generated as a result of its own application.

**CR 614.6**: The replaced event never happens. The modified event occurs instead. If that modified event itself matches the condition of a replacement effect, a new application begins.

**CR 614.1**: Replacement effects watch for events and replace them. A replaced event that is replaced by a new draw, a new discard, etc. creates a new independent event — subject to all applicable replacement effects.

## The Pattern

```
GIVEN: Replacement effect R watches for event E
       R replaces E with: [do something, then generate new event E']

IF: E' is the same type of event as E (e.g., both are "draw a card")
AND: R applies to E' (i.e., E' is not exempt)

THEN: R intercepts E' as well → generates E'' → R intercepts E'' → ...

TERMINATION: The chain ends when:
  (a) The conditions for R no longer apply (e.g., hand is empty → different branch taken)
  (b) The new event is exempt from R (e.g., first draw of draw step)
  (c) R's "new event" branch leads to no further event (e.g., mill — which is not a draw)

KEY INSIGHT: This is NOT an infinite loop — there is always a termination condition.
             CR 614.5 governs the same event; it does not limit applications to different events.
```

## Definitive Conclusions

- **CR 614.5 does not prevent recursive replacement.** It blocks the same replacement from applying to the same event twice, but every step generates a new event.
- **Chains of Mephistopheles: one non-exempt draw attempt with N cards in hand results in N discards + 1 mill + 0 draws.** Every Chains-generated "draw a card" is immediately intercepted by Chains again until the hand is empty, at which point the mill branch terminates the chain.
- **Empty hand is the termination state.** With Chains on the board, any non-exempt draw when your hand is empty simply mills 1 card — no discard, no recursion.
- **Multiple replacement effects on the same event extend the chain.** If two different replacement effects both apply to draw events, each new event generated must go through both. The order of application is chosen by the affected player (614.5 still governs the specific event each replacement sees).
- **Design intent vs. recursion:** The intent of Chains-style effects is "pay a cost to draw." The recursion means the cost is paid repeatedly until the condition no longer applies — not just once.
- **Draws as costs are affected by Chains.** If an ability requires drawing a card as a cost (rather than as an effect), Chains still intercepts it — replacement effects can apply to cost payments. (Chains ruling 2004-10-04: "Cards which are drawn as a cost are affected by this card because replacement effects can alter the payment of costs.") This is rare since most draw-as-cost abilities are uncommon, but it confirms Chains has no "effect draws only" exemption.

## Canonical Example
**Chains of Mephistopheles — drawing a non-exempt card with 3 cards in hand:**

Player would draw (non-exempt). Hand: [A, B, C].
1. Chains: discard A instead. "If discarded, draw a card." → New draw event.
2. New draw is non-exempt. Chains: discard B instead. Draw again. → New draw event.
3. New draw is non-exempt. Chains: discard C instead. Draw again. → New draw event.
4. New draw is non-exempt. Chains: can't discard (empty hand) → mill 1. No new draw. DONE.

Result: discarded A, B, C. Milled 1 card. Drew 0 cards.

**Sylvan Library + Chains:** Library offers 2 extra draws. Both are non-exempt. First triggers the full discard chain (empties hand) + mill 1. Second: hand empty → mill 1. 0 additional cards drawn. Library's "choose two drawn cards" clause is mostly inapplicable.

## Commonly Confused With
- **P002 (Replacement vs. Trigger)** — Chains is a replacement effect (P002 identifies the type). P012 is the sub-pattern for what happens when a replacement generates a new event of the same kind, creating recursion. P002 identifies the mechanism; P012 explains the recursive consequence.
- **P008 (Can't Overrides Can)** — Not a conflict between permission and prohibition. Chains doesn't prohibit drawing; it replaces the draw with a discard-then-maybe-draw cycle.
- **P005 (Simultaneous Event Ordering)** — P005 covers multiple things happening at once. P012 covers one thing happening, generating another of the same kind, in strict sequence.
