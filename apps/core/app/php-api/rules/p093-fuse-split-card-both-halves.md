---
id: p093
name: Fuse — Casting Both Halves of a Split Card
category: stack
cr_refs: [702.102a, 709]
tags: [fuse, split-card, both-halves, combined-cost, CMC, storm, cascade, hand-only]
created: 2026-03-28
examples_count: 2
---

# P093 — Fuse — Casting Both Halves of a Split Card

## Abstract
Fuse allows you to cast both halves of a split card from your hand simultaneously, paying the combined mana cost. The resulting fused split spell is a single spell on the stack but has the combined properties of both halves (types, colors, effects). The CMC of the fused spell is the combined CMC of both halves. Important: Fuse can only be used when casting from your hand — flashback and other alternative zones don't allow fuse.

## The Definitive Rule

**CR 702.102a** (verbatim): *"Fuse is a static ability found on some split cards (see rule 709, 'Split Cards') that applies while the card with fuse is in a player's hand. If a player casts a split card with fuse from their hand, the player may choose to cast both halves of that split card rather than choose one half. This choice is made before putting the split card with fuse onto the stack. The resulting spell is a fused split spell."*

## The Pattern

```
FUSE SPLIT SPELL:
  Choose to cast both halves simultaneously (from hand only)
  Total cost: combined mana cost of both halves
  The result: ONE spell on the stack with:
    → Combined colors of both halves
    → Combined types of both halves
    → Effects of both halves happen when it resolves

FUSED SPELL CMC:
  CMC = sum of both halves' mana costs
  Example: Fire (CMC 1) // Ice (CMC 2) fused = CMC 3
  This is important for:
    Cascade: cascade hits a fused spell as CMC 3
    Storm: counts as one spell cast
    Cost reductions: based on combined CMC

FUSE FROM HAND ONLY:
  "While in a player's hand" — must be cast from hand to use fuse
  Cannot fuse when casting via flashback, escape, or other graveyard cast methods
  Cannot fuse a copy (copies aren't cast from hand)

HALVES WITHOUT FUSE:
  Most split cards can also be cast as one half
  When cast as one half: only that half's CMC, only that half's effects
  Fuse is additional option (both halves at once)

COUNTERING A FUSED SPELL:
  The fused spell is ONE spell on the stack
  Counter it: both halves are countered (the whole spell is one object)
  If countered: neither half takes effect

FUSED SPELL AND STORM:
  Fuse counts as ONE spell cast (storm count +1)
  Storm copies of a fused spell: copies are also fused
```

## Definitive Conclusions

- **Fuse lets you cast both halves simultaneously from hand.** Combined mana cost.
- **Fused CMC is the sum of both halves.** Important for cascade and other CMC checks.
- **Fuse only works from hand.** Not applicable to graveyard or alternative zone casts.
- **A fused spell is one spell on the stack.** Countering it counters both halves.
- **Storm copies of a fused spell are also fused.** Both halves resolve.

## Canonical Example
**Far // Away (Far: {1}{U} return a creature; Away: {1}{B} target player sacrifices a creature):**
Fused: pay {1}{U}{1}{B} = {2}{U}{B}. One spell on stack. Resolves: return target creature (Far), and target player sacrifices a creature (Away). Both effects happen. CMC = 4 total (2+2).

**Example 2 — Cascade hitting a fuse card:**
You cascade from a 5-CMC spell into cards with CMC < 5. Hit Fire // Ice (CMC 1 + 2 = 3 when fused, but what CMC when not fused?). Without fuse, each half has its own CMC. Cascade reveals the card — you can cast it as one half OR fused (from hand? Cascade isn't from hand...). Actually: cascade lets you cast the card "without paying its mana cost" which means it's not from hand → fuse doesn't apply → can only cast one half.

## Commonly Confused With
- **P093 and P102 (Split Cards)** — Fuse is the mechanic that allows casting both halves. Split cards without fuse must choose one half. Fused casting is explicitly hand-only.
- **P029 (Spell Copy)** — Copies of fused spells are also fused and have the combined CMC. They're not "cast" though, so storm + fuse results in one cast (the original) with fused copies.
