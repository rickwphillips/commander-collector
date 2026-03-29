---
id: p140
name: Demonstrate — Casting Trigger Copy with Opponent Copy
category: stack
cr_refs: [702.144a]
tags: [demonstrate, copy, opponent-copy, triggered, new-targets, multiplayer, strixhaven]
created: 2026-03-28
examples_count: 2
---

# P140 — Demonstrate — Casting Trigger Copy with Opponent Copy

## Abstract
Demonstrate is a triggered ability on certain spells that fires when you cast the spell. If you copy it (optional), you choose an opponent — that opponent ALSO gets to copy the spell. The structure: YOU copy first (optional), then the opponent copies (if you copied). Both copies can choose new targets independently. Demonstrate is a "punisher" design: you get a copy but give the opponent a copy too. The original spell still resolves (plus your copy and potentially the opponent's copy — 3 total instances).

## The Definitive Rule

**CR 702.144a** (verbatim): *"Demonstrate is a triggered ability. 'Demonstrate' means 'When you cast this spell, you may copy it and you may choose new targets for the copy. If you copy the spell, choose an opponent. That player copies the spell and may choose new targets for that copy.'"*

## The Pattern

```
DEMONSTRATE SEQUENCE:
  1. Cast the demonstrate spell
  2. "When you cast this spell" → demonstrate trigger goes on stack
  3. Trigger resolves:
     - You MAY copy the spell (optional)
     - If you copy: choose an opponent → that opponent ALSO copies the spell
     - If you don't copy: nothing happens (no opponent copy either)
  4. The original spell (and copies, if any) resolve LIFO

TOTAL INSTANCES:
  No copy: just the original spell → 1 effect
  You copy (and opponent copies): original + your copy + opponent's copy → 3 effects
  You can't copy without giving opponent a copy (they're linked)

NEW TARGETS:
  Your copy: you may choose new targets (all, some, or same as original)
  Opponent's copy: opponent may choose new targets
  The original resolves with its original targets (unchanged)

DEMONSTRATE + STIFLE:
  If the demonstrate trigger is countered (Stifle): no copies, no opponent copies
  The original spell still resolves

DEMONSTRATE + OPPONENTS (multiplayer):
  You choose ONE opponent to copy (not all opponents)
  That one opponent gets the copy

DESIGN INTENT:
  Demonstrate rewards casting high-value spells but punishes the caster by giving away a copy
  Best used when:
    - The spell's effect is symmetrical (both copies are equally useful)
    - OR you can target something that helps you but opponent copies to something less useful
    - OR you're ahead and can afford giving opponent a copy

DEMONSTRATE ON SPELLS THAT SAY "each player":
  If the spell already affects everyone: demonstrate's copies might be redundant for those effects
  But copies are useful for "target player" effects

SPECIFIC STRIXHAVEN CARD EXAMPLES:
  Leyline of Anticipation variants in Strixhaven use demonstrate for mass-copying
  Academic Dispute (Strixhaven): demonstrate on a spell that redirects an attack
```

## Definitive Conclusions

- **Demonstrate: optional copy for you + mandatory opponent copy if you copied.**
- **You can't copy without giving the opponent a copy.**
- **All three instances (original + your copy + opponent's copy) can have different targets.**
- **Stifling the demonstrate trigger prevents all copies.**
- **Best used when the spell effect favors you even if opponent also gets a copy.**

## Canonical Example
**Creative Technique (Demonstrate, {5}{R}: each player exiles top cards until they exile a nonland, then may cast it for free):**
Cast Creative Technique. Demonstrate trigger: you copy it, choose opponent.
Stack: Creative Technique original, your copy, opponent's copy.
All three resolve: 3 players each get to hit a free nonland spell from their libraries.
You got value — but so did the opponent.

**Example 2 — Stifle interaction:**
You cast a demonstrate spell. Demonstrate trigger goes on stack. Opponent Stifles the trigger.
No copies (neither yours nor opponent's). Just the original spell resolves.

## Commonly Confused With
- **P029 (Spell Copy)** — Normal spell copying (Fork, Reverberate, etc.) lets YOU copy a spell and choose new targets — no opponent copy. Demonstrate uniquely requires an opponent copy.
- **P101 (Replicate)** — Replicate creates N copies all for you; demonstrate creates at most 2 copies (one for you, one for opponent).
- **P096 (Casualty)** — Casualty copies the spell by sacrificing a creature (all for you). Demonstrate is less efficient but requires no additional cost.
