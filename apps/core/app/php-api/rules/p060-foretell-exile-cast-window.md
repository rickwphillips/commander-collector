---
id: p060
name: Foretell — Special Action Exile and Cast Window
category: stack
cr_refs: [702.143a, 702.143b, 702.143c, 702.143d, 702.143e, 702.143f, 116]
tags: [foretell, special-action, exile, face-down, alternative-cost, cast-window, next-turn, split-second]
created: 2026-03-28
examples_count: 2
---

# P060 — Foretell — Special Action Exile and Cast Window

## Abstract
Foretell lets you exile a card face down from your hand for {2} as a special action during your turn. On a future turn (after the current turn ends), you may cast the foretold card for its foretell cost instead of its mana cost. The exile is a special action — it doesn't use the stack and can't be responded to. The cast window opens "after the current turn has ended" — you cannot foretell and cast in the same turn. Foretelled cards are yours to see but hidden from opponents.

## The Definitive Rule

**CR 702.143a** (verbatim): *"Foretell is a keyword that functions while the card with foretell is in a player's hand. Any time a player has priority during their turn, that player may pay {2} and exile a card with foretell from their hand face down. That player may look at that card as long as it remains in exile. They may cast that card after the current turn has ended by paying any foretell cost it has rather than paying that spell's mana cost. Casting a spell this way follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

**CR 702.143b** (verbatim): *"Exiling a card using its foretell ability is a special action, which doesn't use the stack. See rule 116, 'Special Actions.'"*

**CR 702.143c** (verbatim): *"If an effect refers to foretelling a card, it means performing the special action associated with a foretell ability. If an effect refers to a card or spell that was foretold, it means a card put in the exile zone as a result of the special action associated with a foretell ability, or a spell that was a foretold card before it was cast, even if it was cast for a cost other than a foretell cost."*

## The Pattern

```
FORETELL SEQUENCE:
  TURN 1 (your turn, any time you have priority):
  1. Special action: pay {2}, exile card from hand face down
     → Doesn't use the stack → can't be countered, responded to
     → Card is now face-down in exile (you can see it, opponents can't)

  SUBSEQUENT TURNS (after current turn ends):
  2. At any time you have priority, on any future turn:
     Cast the foretold card by paying its foretell cost (alternative cost)
     → Foretell cost is typically cheaper than the mana cost
     → Follows alternative cost rules (601.2b, 601.2f-h)
     → Can also cast it for its normal mana cost (forgoing the discount)

SPECIAL ACTION (NO STACK):
  The exile itself doesn't use the stack (CR 702.143b)
  Contrast with activated abilities (use the stack) and split second:
    Split second doesn't stop special actions (P041 morph example)
    During opponent's split-second spell: you can't foretell
      (Split second prevents special actions? No — CR 116 says special actions
       happen when you have priority. Split second removes priority. So during
       split second, you don't have priority → can't foretell.)
    Actually: split second means players can't cast spells or activate abilities (CR 702.61a)
    Special actions don't use the stack — they're neither spells nor abilities
    CR 702.61b: "special actions" still work during split second
    → You CAN foretell during split second (special action, not ability)

CAST WINDOW:
  "After the current turn has ended" = starting from your NEXT turn's beginning
  Cannot foretell on turn 1 of a game and cast on the same turn
  Can foretell during opponent's turn? No: foretell can only happen during YOUR turn
    (CR 702.143a: "any time a player has priority during their turn")
  Can cast the foretold card during OPPONENT's turn: Yes, if the card is an instant
    or if you have effects giving it flash

TRACKING FORETOLD CARDS:
  Multiple foretold cards must be distinguishable (CR 702.143e)
  You must track which is which and in what order they were foretold
  Opponents can see how many foretold cards you have but not what they are

FORETELL COST = ALTERNATIVE COST:
  Can use kicker/other additional costs with foretell cost
  "Without paying its mana cost" overrides the mana cost, not the foretell cost
  If something lets you cast a foretold card "without paying its foretell cost":
    It can be cast for free
```

## Definitive Conclusions

- **Foretelling is a special action.** Doesn't use the stack — instant, can't be countered.
- **Can only foretell during YOUR turn.** Cannot foretell on opponent's turn.
- **Can cast foretold card the NEXT turn or any turn after.** Not the same turn it was foretold.
- **Foretell cost is an alternative cost.** Can still pay the normal mana cost if preferred.
- **Foretelling works through split second.** Special actions are not affected by split second.

## Canonical Example
**Behold the Multiverse (foretell {1}{U}, mana cost {3}{U}):**
Turn 1: pay {2}, exile Behold the Multiverse face down. Turn 2: cast it for {1}{U} (foretell cost) instead of {3}{U}. Net savings: {2}. Behold the Multiverse scries 2 then draws 2.

**Example 2 — Foretell an instant for opponent's turn:**
Foretell Saw It Coming (counterspell, foretell {1}{U}). On your turn, pay {2}, exile it. During opponent's next turn, cast it for {1}{U} to counter their spell. The foretell cost applies regardless of whose turn it is when cast — the restriction is only on when you EXILE (your turn), not when you CAST.

## Commonly Confused With
- **P041 (Morph)** — Both are special actions. Foretell exiles from hand; morph turns a permanent face-up. Both bypass split second.
- **P022 (End-Turn Stack Exile)** — Foretold cards in exile persist; they are not exiled "until end of turn." They stay in exile until cast.
- **P033 (Madness)** — Both let you cast a card in an unusual way. Madness is a replacement effect; foretell is a special action followed by an alternative-cost cast.
