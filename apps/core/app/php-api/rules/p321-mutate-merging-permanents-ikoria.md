---
id: p321
name: Mutate — Merging Permanents and the Topmost Characteristics Rule
category: continuous
cr_refs: [702.140a, 702.140c, 702.140d, 702.140e, 729.2, 729.2a, 729.2b, 729.2c, 729.3]
tags: [mutate, merge, merged-permanent, topmost-characteristics, Ikoria, non-Human-target, mutate-trigger, all-abilities, Nethroi, Illuna, Gemrazer, Ketria-Triome, merged-leaves-battlefield, multiple-death-triggers]
created: 2026-03-29
examples_count: 2
---

# P321 — Mutate — Merging Permanents and the Topmost Characteristics Rule

## Abstract
**Mutate** is an alternative casting cost that, when paid, merges the mutating spell with a target non-Human creature you own. The merged permanent gets **all abilities from all components** but **characteristics (P/T, name, types) only from the topmost card** (CR 702.140e, 729.2a). Merging is NOT entering the battlefield — ETB triggers don't fire (CR 729.2b), but "whenever a creature mutates" abilities DO fire (CR 702.140d). When a merged permanent leaves the battlefield, ALL components go to the appropriate zone and **each death trigger fires separately** for each component. Crucially, mutate targets non-Human creatures — Humans can't be mutated onto.

## The Definitive Rules

**CR 702.140a** (verbatim): *"'Mutate [cost]' means 'You may pay [cost] rather than pay this spell's mana cost. If you do, it becomes a mutating creature spell and targets a non-Human creature with the same owner as this spell.'"*

**CR 702.140c** (verbatim): *"As a mutating creature spell resolves, if its target is legal, it doesn't enter the battlefield. Rather, it merges with the target creature and becomes one object represented by more than one card or token. The spell's controller chooses whether the spell is put on top of the creature or on the bottom. The resulting permanent is a mutated permanent."*

**CR 702.140e** (verbatim): *"A mutated permanent has all abilities of each card and token that represents it. Its other characteristics are derived from the topmost card or token."*

**CR 729.2a** (verbatim): *"A merged permanent has only the characteristics of its topmost component, unless otherwise specified by the effect that caused them to merge. This is a copiable effect whose timestamp is the time the objects merged."*

**CR 729.2b** (verbatim): *"As an object merges with a permanent, that object leaves its previous zone and becomes part of an object on the battlefield, but the resulting permanent isn't considered to have just entered the battlefield."*

**CR 729.2c** (verbatim): *"Because a merged permanent is the same object that it was before, it hasn't just come under a player's control, any continuous effects that affected it continue to do so, and so on."*

**CR 729.3** (verbatim): *"If a merged permanent leaves the battlefield, one permanent leaves the battlefield and each of the individual components are put into the appropriate zone."*

## The Pattern

```
CASTING A MUTATE SPELL:
  Card with Mutate: "Mutate {cost}: ..."
  Normal cast: pays the card's printed mana cost. Enters the battlefield as a standalone creature.
  Mutate cast: pays the mutate cost (usually different from printed mana cost, often cheaper).
    → Targets a non-Human creature you own (same owner, not same controller necessarily).
    → The spell on the stack is a "mutating creature spell."
    → Requires a legal non-Human target when it resolves.
  If target becomes illegal when it resolves:
    CR 702.140b: ceases to be a mutating spell. Resolves as a normal creature spell.
    Enters the battlefield as a separate creature (no merging).

NON-HUMAN RESTRICTION:
  Can only mutate onto non-Human creatures.
  Humans: any creature with the Human subtype.
  This was a Theros/Ikoria lore decision: Mutant/Beast creatures mutate, not Humans.
  In Commander: your commander may be a Human (can't be mutated onto).
  Your commander might be non-Human (can be mutated onto — careful!).

CHOOSING TOP OR BOTTOM:
  When the mutating spell merges: choose to put it on TOP or BOTTOM of the existing creature.
  Top: the mutating spell's characteristics (name, P/T, types) are what you see.
  Bottom: the original creature's characteristics remain visible.
  All abilities from ALL cards in the pile apply regardless.
  Key: you want the most useful characteristics on top while wanting all abilities from all.
  Example: Gemrazer on top → gets Gemrazer's name, P/T, types, and abilities from the pile.
  Original creature's abilities still apply (from the bottom).

TOPMOST CHARACTERISTICS:
  CR 702.140e + 729.2a:
  Name: the topmost card's name.
  Power/Toughness: topmost card.
  Mana cost / MV: topmost card.
  Card types: topmost card.
  Color: topmost card.
  Abilities: ALL cards in the merged permanent.
  This means: put a 1/1 with Haste on top of an 8/8 with Trample → 1/1 Haste AND Trample.
  Put the 8/8 with Trample on top of 1/1 with Haste → 8/8 Trample AND Haste.
  Strategic choice: which stats do you want? Put those on top.
  Ability stacking: every mutated creature contributes all its abilities.
  With 4 mutated cards: potentially 4+ distinct ability lines active simultaneously.

MUTATE TRIGGER:
  CR 702.140d: "An ability that triggers whenever a creature mutates triggers when a spell merges with a creature as a result of a resolving mutating creature spell."
  This fires ONCE per merge event (once when each mutating spell resolves and merges).
  NOT an ETB trigger. This is a separate, mutation-specific trigger.
  Cards with "Whenever this creature mutates" get that ability from the top card's rules text.
  BUT: since ALL abilities of all cards in the pile apply, if ANY card in the merged pile
  has a "whenever this creature mutates" ability, EACH subsequent mutate onto the pile
  triggers it again.
  Example: Illuna, Apex of Wishes (has "whenever this creature mutates, exile cards from
    top of library until you hit non-land permanent, put it onto the battlefield").
    Illuna at bottom of a pile. Each time you mutate anything onto the pile: Illuna's ability triggers.
    Stack mutates for repeated ETB-like effects without entering the battlefield.

NOT AN ENTERS-THE-BATTLEFIELD EVENT:
  CR 729.2b: merging does NOT count as entering the battlefield.
  No ETB triggers fire.
  No "enters with counters" effects.
  No "as this enters" replacement effects.
  The merged permanent is the SAME OBJECT (CR 729.2c): continuous effects on the old creature still apply.
  Control effects, damage marked, counters on the original creature: all persist.

LEAVING THE BATTLEFIELD (death of a merged pile):
  CR 729.3: one permanent leaves → ALL components go to their respective zones.
  If destroyed: ALL components go to GY (or appropriate GY alternative).
  "When this creature dies" triggers: each component that has such a trigger fires separately!
  A pile of 4 mutated creatures dying: 4 separate "when this creature dies" triggers.
  Each goes to the GY as a separate card. No longer merged.

COUNTERPLAY TO MUTATE:
  Destroy the creature before the mutating spell resolves.
  CR 702.140b: if target is illegal when resolving, the mutating spell enters as its own creature.
  You "wasted" the mutate — the spell enters normally (potentially at its mutate cost, which
  may be a mana advantage for you if mutate cost was cheaper).
  Wait: the spell still resolves. The creature still enters. You haven't stopped it.
  Counterspell: counter the mutating spell before it resolves. The pile isn't broken up.
  BUT: countering the mutating spell doesn't affect the pile that already existed.

TOKENS IN MUTATE PILES:
  CR 729.2d: merged permanent is a token only if topmost component is a token.
  If a token is at the bottom of a pile with a card on top: it's not a token (top is a card).
  If a token is on top: the merged permanent IS a token.
  Token at top: when it leaves battlefield, it goes to GY (token rules: ceases to exist).
  Cards in the pile below the token: they go to GY as normal cards (729.3e).

NETHROI + MUTATE COMBO:
  Nethroi, Apex of Death (Mutate {2}{W}{B}{G}): "Whenever this creature mutates,
    return from GY all creature cards with total power 10 or less."
  At 0/0 or 0/1 base: power 0. Return creatures with total power 10 = up to ten 1/1s or a 10/X.
  Strategy: build a mutate pile focused on Nethroi. Each mutate triggers more GY recursion.
  With Nethroi in a pile at any position (bottom or top): each mutate onto that pile triggers Nethroi's ability.
  This generates massive value from the GY each time you mutate.
```

## Definitive Conclusions

- **Mutate merges cards; the topmost card sets characteristics** — name, P/T, types, color, MV are all from the top.
- **All abilities from all components apply** — stacking multiple mutated creatures gives all their keyword and triggered abilities.
- **Merging is NOT entering the battlefield** — no ETB triggers fire, but mutate triggers do fire.
- **When a merged permanent dies, all components go to their zones and all death triggers fire** — one creature dying can trigger multiple "when this creature dies" abilities.
- **Mutate can only target non-Human creatures** — Humans are immune to being mutated onto.
- **If the target becomes illegal before resolution, the mutating spell enters as its own creature** — it's not countered; it resolves as a normal creature spell.

## Canonical Example
**Gemrazer Mutate Pile:**
Board: You control Pouncing Shoreshark (non-Human, 3/3 Flash, Mutate {3}{U}).
You cast Gemrazer ({2}{G} or Mutate {1}{G}): 4/4 Reach, Trample, "whenever this creature mutates, destroy target artifact or enchantment an opponent controls."
Choose to mutate (pay {1}{G}): target Pouncing Shoreshark.
Choose: put Gemrazer on TOP of Pouncing Shoreshark.
The merged permanent:
  Top (Gemrazer): 4/4, Reach, Trample, destroy-artifact-or-enchantment trigger.
  Bottom (Pouncing Shoreshark): Flash, Mutate ability (now part of the pile too), "whenever this creature mutates, return target creature an opponent controls to their hand."
Active abilities of the merged pile: Reach, Trample, both "whenever this creature mutates" triggers.
Mutate trigger: destroy target artifact or enchantment (from Gemrazer's ability).
Also: Pouncing Shoreshark's mutate ability triggers: bounce target creature.
TWO separate mutate triggers from one mutate event.
Opponent's threat answered. 4/4 Reach Trample bounce + artifact/enchantment removal all in one card.
If the pile dies: Gemrazer (4/4) and Pouncing Shoreshark (3/3) each go to GY separately.
Reanimate one: you have a standalone creature. Reanimate the other: another standalone creature.

**Example 2 — Nethroi Pile Recursion Engine:**
Board: you control a 2/3 Birds of Paradise (non-Human, Flying, {T}: add any color).
Turn 5: Cast Nethroi, Apex of Death with Mutate cost ({2}{W}{B}{G}).
Target: Birds of Paradise. Choose: Nethroi on BOTTOM.
Top: Birds of Paradise (2/3 Flying, {T}: add color).
Bottom: Nethroi (0/0 Deathtouch Lifelink, whenever this creature mutates, return creatures from GY with total power ≤ 10).
Active abilities: Nethroi's Deathtouch AND Lifelink (from bottom), Flying and mana ability (from top), AND Nethroi's mutate trigger.
Mutate trigger fires: return creatures from GY with total power ≤ 10.
Your GY has: Llanowar Elves (1/1), Wall of Blossoms (0/4), Reveillark (2/3), Mulldrifter (2/2) = 5 power total ≤ 10. Return all four.
All four ETB triggers fire (Wall of Blossoms, Mulldrifter: draw cards, etc.).
Turn 7: cast another mutate spell targeting the pile.
Another mutate trigger: Nethroi's ability fires again → return more creatures from GY.
Chain: each mutate onto the Nethroi pile = more GY recursion.
Important: Nethroi's ability fires even when Nethroi is NOT on top — the ability is part of the pile's active abilities regardless of position.

## Commonly Confused With
- **P314 (Copy Effects)** — Copying a mutated permanent copies only the characteristics of the topmost card (the copiable values per 729.2a). The copy is NOT a merged permanent — it's just a copy of the top card's characteristics. The copy won't have abilities from the non-top components.
- **P311 (New Object Rule)** — Merging does NOT create a new object (CR 729.2c). The merged permanent is the same object. Any spells targeting it before the merge still target it after. Counters on it persist.
- **P315 (Token Rules)** — A merged pile containing tokens: if the token is on top, the merged permanent is a token. The token's zone rules still apply: when it leaves the battlefield, it ceases to exist. The card components below it still go to GY normally.
- **P316 (Morph/Manifest)** — A face-down creature can be in a mutate pile (CR 729.2e); if the face-down component is on top, the pile's status is face down. If turned face up, all components face up.
