---
id: p444
name: Mutate + Cost Mechanics — Topmost-Determined Type and MV for Improvise, Emerge, and Convoke
category: costs
cr_refs: [729.2a, 702.126a, 702.119a, 702.51a, 202.3, 702.140e]
tags: [mutate, improvise, emerge, convoke, topmost-type, MV-of-merged, artifact-type-topmost, emerge-sacrifice-MV, convoke-color, tap-for-improvise, type-switching-via-top, Gemrazer, Elder-Deep-Fiend, Ikoria, cost-reduction]
created: 2026-03-29
examples_count: 2
---

# P444 — Mutate + Cost Mechanics — Topmost-Determined Type and MV for Improvise, Emerge, and Convoke

## Abstract
A merged mutated permanent has a split personality: **abilities come from ALL components** (702.140e) but **all other characteristics (type, color, MV, name, P/T) come ONLY from the topmost component** (729.2a). This creates three non-obvious interactions with cost mechanics: (1) **Improvise** — whether you can tap the merged permanent to pay generic mana depends entirely on whether the TOPMOST component is an artifact; a non-artifact on top of an artifact stack produces a non-artifact permanent that can't be tapped for improvise; (2) **Emerge** — when you sacrifice the merged permanent to pay emerge's cost reduction, the mana value used is the MV of the TOPMOST component's mana cost, not the combined MV of all components; a 6-MV card under a 1-MV top gives only 1 MV of reduction; (3) **Convoke** — the merged permanent's color comes from the topmost component; it can only tap to pay for colored mana symbols matching the topmost component's color, regardless of what colors the lower components were.

## The Definitive Rules

**CR 729.2a** (verbatim): *"A merged permanent has only the characteristics of its topmost component, unless otherwise specified by the effect that caused them to merge. This is a copiable effect whose timestamp is the time the objects merged."*

**CR 702.140e** (verbatim): *"A mutated permanent has all abilities of each card and token that represents it. Its other characteristics are derived from the topmost card or token."*

**CR 702.126a** (verbatim): *"Improvise means 'For each generic mana in this spell's total cost, you may tap an untapped artifact you control rather than pay that mana.'"*

**CR 702.119a** (verbatim, emerge): *"'Emerge [cost]' means 'You may cast this spell by paying [cost] and sacrificing a creature rather than paying its mana cost.' The cost to cast this spell using its emerge ability is that cost reduced by the sacrificed creature's mana value."*

**CR 702.51a** (verbatim, convoke): *"Convoke means 'Your creatures can help cast this spell. Each creature you tap while casting this spell pays for {1} or one mana of that creature's color.'"*

## The Pattern

```
THE CORE PRINCIPLE: TOPMOST DETERMINES EVERYTHING EXCEPT ABILITIES

Characteristics from TOPMOST only (729.2a):
  Name, mana cost, colors, mana value, card types, subtypes, supertypes, P/T.

Abilities from ALL components (702.140e):
  Activated abilities, triggered abilities, static abilities, keywords from every card.

This split creates non-obvious interactions with any mechanic that checks:
  - "Is this an artifact?" → check topmost card type
  - "What is this creature's mana value?" → check topmost mana cost
  - "What color is this creature?" → check topmost colors

IMPROVISE (702.126a):
  Condition: "may tap an untapped ARTIFACT you control."
  Whether the merged permanent is an artifact: topmost card's type (729.2a).

  SCENARIO A — Artifact on top:
    Creature A (artifact creature, 2/2) mutated under Gemrazer (4/4, non-artifact, top).
    Top card: Gemrazer. Not an artifact (Gemrazer is a Beast creature, not artifact).
    Merged permanent card types: Creature. NOT artifact.
    RESULT: merged permanent CANNOT be tapped for improvise.
    Artifacts below the top do NOT make the merged permanent an artifact.

  SCENARIO B — Artifact on bottom:
    Non-artifact creature with artifact creature mutated on TOP.
    Hypothetical: artifact creature is topmost.
    Top card: artifact creature. Card types: Artifact + Creature.
    Merged permanent: IS an artifact creature.
    RESULT: merged permanent CAN be tapped for improvise.

  KEY LESSON: Whether you can improvise with a mutated permanent depends solely on
    whether the TOPMOST card is an artifact. Changing which card is on top (by putting
    a non-artifact on top of an artifact via mutation) turns off improvise capability.
    The opposite: mutating an artifact creature ON TOP of a non-artifact makes it
    suddenly tappable for improvise.

EMERGE (702.119a):
  "Sacrificing a creature reduces the emerge cost by the sacrificed creature's MV."
  A creature's MV = its mana cost's MV (CR 202.3: total mana symbols in mana cost).
  For the merged permanent: mana cost comes from TOPMOST component (729.2a).
  MV used for emerge reduction = MV of TOPMOST component's mana cost.

  SCENARIO: Mutate stack with high-MV card buried under low-MV card:
    Card A: {5}{G} (MV 6) — on the bottom (not top).
    Card B: {G} (MV 1) — on the top.
    Merged permanent's MV: 1 (from top Card B).
    Sacrifice the merged permanent to emerge Elder Deep-Fiend ({8}: emerge {5}{U}{U}).
    Emerge cost reduction = sacrifice's MV = 1. Pay {4}{U}{U}.
    If you had sacrificed Card A alone (non-merged, MV 6): reduce emerge by 6. Pay {U}{U}.
    The buried high-MV card contributes ZERO to emerge cost reduction.

  OPTIMIZATION: For emerge sacrifice value, put the highest-MV card ON TOP.
    Top MV determines how much emerge discount you receive.
    OR: don't merge high-MV cards that you intend to use as emerge fodder.

CONVOKE (702.51a):
  "Each creature you tap pays for {1} or one mana of that creature's COLOR."
  A creature's colors: from its color indicator, mana cost, or color-granting abilities.
  For the merged permanent: colors come from TOPMOST component (729.2a).
    EXCEPTION: if a card in the stack has a color-granting static ability (devoid = colorless,
    or a color-adding effect), that ABILITY applies from all components (702.140e).
    But the mana cost (and thus base color) comes from the top.

  SCENARIO:
    White creature (base) under Green creature Gemrazer (top).
    Merged permanent is GREEN (Gemrazer's color from top).
    Can tap for {W} convoke? NO — it's green, not white.
    Can tap for {G} convoke? YES.
    The white component below contributes no white color to the merged permanent.

  PRACTICAL IMPACT: A WB deck mutating a G creature onto a WB creature loses color
    diversity for convoke purposes. The merged permanent is only G (or whatever colors
    the topmost card has).

ADDITIONAL: CARD TYPE SWITCHING VIA TOPMOST
  Mutating a non-creature (if somehow allowed) or a different card type on top changes
    the merged permanent's type entirely. In practice, mutate requires creature targets,
    so the merged permanent is always at minimum a creature. But:
    - Enchantment creatures can mutate — if an enchantment creature is on top, the merged
      permanent is an enchantment creature (both enchantment AND creature card types).
    - An enchantment creature on top: the merged permanent is an enchantment. Enchantress
      triggers that fire on "enchantment entering" do NOT trigger (729.2b: not considered
      to have just entered). But the merged permanent IS an enchantment for other purposes.
    - Artifact creatures on top: merged permanent is an artifact creature. Can be targeted by
      "destroy target artifact," can be equipped, etc.
```

## Definitive Conclusions

- **Improvise: only the topmost component's artifact type matters** — a non-artifact on top of a stack of artifacts creates a non-artifact permanent that can't be tapped for improvise; swapping the top card to an artifact enables improvise tapping of the merged permanent.
- **Emerge: sacrifice value is the topmost component's MV only** — burying a 6-MV card under a 1-MV card reduces emerge cost by only 1; for maximum emerge discount, the highest-MV card should be on top.
- **Convoke: only the topmost component's colors apply** — a white creature buried under a green creature makes the merged permanent green; it taps for {G} but not {W} for convoke.
- **All abilities from all components still apply** — the improvise, emerge, and convoke restrictions only affect characteristics (type, color, MV), not abilities; the bottom card's activated abilities are still on the merged permanent.
- **Strategic implication**: when building mutate stacks, card-order choice affects what costs you can pay and how much value you get from sacrifice effects; don't bury important type/color/MV characteristics under the wrong card.

## Canonical Example
**Emerge + Mutate optimization:**
You have two mutate creatures in hand: Gemrazer ({1}{G}{G}: Beast, 4/4; "when it mutates, destroy artifact or enchantment") and Trumpeting Gnarr ({4}{G}: Beast, 5/5; "when it mutates, put a +1/+1 counter on each other creature you control"). You also have Illuna, Apex of Wishes ({3}{R/G}{U}{U}: emerge {5}{U}{U}).

On the battlefield: a base 2/2 creature. You mutate both Gemrazer and Trumpeting Gnarr onto it over two turns.

Stack order: You chose to put Gemrazer on top (so it's Gemrazer on top, Trumpeting Gnarr middle, 2/2 base).

Merged permanent characteristics: Gemrazer (4/4, {1}{G}{G} mana cost, MV 3).
All abilities: reach, trample (Gemrazer), +1/+1 counter effect on mutate (Trumpeting Gnarr), 2/2's abilities.

Now you want to sacrifice this merged permanent for emerge to cast Illuna.
Emerge {5}{U}{U}: reduce by sacrifice's MV = 3 (Gemrazer on top). Pay {2}{U}{U}.

Alternative: if you'd put Trumpeting Gnarr ({4}{G}: MV 5) on top instead:
Merged permanent MV = 5. Emerge cost reduction = 5. Pay {U}{U}.
Saves {2} more mana.

Decision: which card on top matters for emerge sacrifice value. Trumpeting Gnarr on top = better emerge fodder. Gemrazer on top = better stats (4/4 vs 5/5, but closer to what you want for combat) and better destruction trigger when it mutates. Strategic tradeoff.

**Example 2 — Improvise + artifact creature mutated under:**
You control an artifact creature: Arcbound Ravager ({2}: artifact, 0/0 with +1/+1 counters). You mutate Gemrazer ON TOP of Arcbound Ravager.

Top card: Gemrazer. NOT an artifact. Merged permanent card types: Creature only.
Arcbound Ravager's artifact type is BURIED. The merged permanent is no longer an artifact.

You want to cast a spell with improvise. Can you tap the merged permanent?
NO — it's not an artifact (Gemrazer is non-artifact on top). Can't tap for improvise.

Your opponent sees your Gemrazer-looking creature and doesn't expect Arcbound Ravager's modular ability (buried underneath). The merged permanent still has Arcbound Ravager's abilities:
  - "{T}: sacrifice an artifact: put a +1/+1 counter on Arcbound Ravager" (from below)
  Wait: this ability says "Arcbound Ravager" specifically. When merged, ability refers to the merged permanent (it uses "this permanent" in its functionality). Actually modular's sacrifice ability:
  Arcbound Ravager's activate: "{T}: sacrifice an artifact: put a +1/+1 counter on this."
  The merged permanent is NOT an artifact (Gemrazer on top). Can it be sacrificed as an artifact to pay this cost? No — the artifact check is on the sacrificed artifact, not on the merged permanent. You'd need to sacrifice a DIFFERENT artifact. The merged permanent itself can't be the sacrificed artifact because it's not an artifact. But the merged permanent CAN activate the ability (it's from the stack) and the counters would go on it.

## Commonly Confused With
- **P441 (Mutate)** — P441 covers the general rule that topmost determines characteristics except abilities. P444 applies this specifically to cost mechanics, showing the strategic implications for improvise, emerge, and convoke.
- **P425 (Changeling card type vs. creature subtype)** — P425 covers how Changeling grants creature subtypes but not card types. P444 covers how topmost determines card types in a merged permanent. Both patterns address the distinction between card types (artifact, enchantment, creature) and subtypes (creature type, artifact type). The practical result is similar: having an artifact subtype (from Changeling) doesn't make a creature an artifact; having an artifact-typed creature buried under a non-artifact doesn't make the merged permanent an artifact.
- **P439 (Improvise)** — P439 covers improvise's core rules including that summoning-sick artifact creatures can be tapped. P444 covers the specific complication when the artifact is inside a mutate stack under a non-artifact top card.
