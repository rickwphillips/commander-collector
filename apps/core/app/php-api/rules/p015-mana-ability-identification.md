---
id: p015
name: Mana Ability Identification
category: stack
cr_refs: [605.1a, 605.1b, 605.3, 605.4]
tags: [mana-ability, stack, stifle, fetchland, activated-ability, triggered-ability, priority, respond, target]
created: 2026-03-28
examples_count: 2
---

# P015 — Mana Ability Identification

## Abstract
Mana abilities are a special class of activated and triggered abilities that bypass the stack entirely. They resolve immediately when activated, cannot be targeted by spells or abilities (including Stifle), and opponents have no window to respond. The defining criterion for an activated mana ability is that it could add mana to a player's pool when it resolves — not merely that it involves mana or lands. Abilities that produce a land, draw a card, or do anything else at resolution are not mana abilities, even if their ultimate effect is enabling future mana production. Correctly identifying whether an ability is a mana ability determines whether it can be responded to, targeted, or countered.

## The Definitive Rule

**CR 605.1a**: An activated ability is a mana ability if it meets ALL of these:
1. It doesn't require a target (CR 115.6)
2. It **could add mana to a player's mana pool when it resolves**
3. It's not a loyalty ability

**CR 605.1b**: A triggered ability is a mana ability if it meets ALL of these:
1. It doesn't require a target
2. It triggers from the activation/resolution of an activated mana ability OR from mana being added to a pool
3. It could add mana to a player's mana pool when it resolves

**CR 605.3**: Mana abilities don't go on the stack and can't be targeted, countered, or responded to.

**CR 605.4**: A mana ability resolves immediately when activated/triggered.

## The Pattern

```
MANA ABILITY TEST (605.1a) — all three must be true:
  ✓ No target required
  ✓ Could add mana to a pool when it RESOLVES (not "eventually" — at resolution)
  ✓ Not a loyalty ability

  → All true: MANA ABILITY — no stack, no response window, can't be Stifled

  → Any false: NOT a mana ability — uses stack, priority window exists, Stifle can target

COMMON TRAPS:
  - Fetchland: searches for a land → land is put onto battlefield (no mana added at resolution)
    → NOT a mana ability → uses stack → Stifle-able
  - Basic land tap: {T}: Add {G} → adds mana directly at resolution
    → IS a mana ability → no stack → can't be Stifled
  - Selvala, Heart of the Wilds: reveals card, may add mana to pool
    → Could add mana → IS a mana ability
  - Cabal Coffers: {2}{T}, Tap lands: Add {B} for each swamp
    → Adds mana at resolution → IS a mana ability

COSTS ARE PAID BEFORE STACK:
  For non-mana abilities (like fetchlands), costs are locked in
  before the ability goes on stack. If Stifled, costs are NOT refunded.
  Opponent loses 1 life AND the sacrificed land AND gets no land.
```

## Definitive Conclusions

- **Fetchlands are NOT mana abilities.** They search for and put a land onto the battlefield — they don't add mana at resolution. Stifle can target them.
- **Basic land tap abilities ARE mana abilities.** `{T}: Add {G}` adds mana directly. No stack, no response, can't be Stifled.
- **Stifling a fetchland is catastrophic for the opponent** — they've already paid 1 life and sacrificed the land (costs paid before the stack), and get nothing in return.
- **Mana abilities bypass priority entirely.** There is never a window to respond, not even for instants or abilities with flash.
- **The test is "adds mana when it resolves"** — not "involves lands" or "eventually enables mana production." A fetchland ultimately enables future mana but doesn't produce it at resolution.
- **Triggered mana abilities** (e.g., "whenever you tap a land for mana, add one mana of any color") also skip the stack if they meet 605.1b — they trigger and resolve immediately.
- **Stony Silence prevents mana ability activation via static "can't" — this is different from Stifle.** Stifle is a spell that targets abilities on the stack; mana abilities never go on the stack, so Stifle can't target them. But Stony Silence is a static "can't activate" restriction that applies before activation, bypassing the stack entirely. Gatherer ruling: "No abilities of artifacts can be activated, including mana abilities." The key distinction: *targeting an ability on the stack* (Stifle) vs. *preventing the activation entirely* (Stony Silence). Mana abilities are immune to the former but not the latter.
- **Deathrite Shaman's first ability (exile land from GY for mana) is NOT a mana ability — it requires a target.** Because it targets a land card in a graveyard, it fails criterion #1 of 605.1a. It uses the stack, can be responded to, and can be Stifled. Exile happens at resolution, not as a cost. (Gatherer ruling 6/8/2016: "Because the first ability requires a target, it is not a mana ability. It uses the stack and can be responded to.")

## Canonical Example
**Stifle targeting Misty Rainforest activation:**

Opponent activates Misty Rainforest: pays {T}, 1 life, sacrifices the land. Ability goes on stack: "Search your library for a Forest or Island card, put it onto the battlefield, then shuffle."

Is this a mana ability? — No target ✓; adds mana at resolution? ✗ (puts a land onto battlefield, doesn't produce mana) → NOT a mana ability → uses stack.

Player casts Stifle targeting the ability. Stifle resolves, counters the fetch ability. Opponent: -1 life, no fetchland, no land found.

## Additional Examples

**Example 2 — Selvala, Heart of the Wilds:**
"{T}: Reveal the top card of your library. If it's a creature card, add mana equal to its power." — This adds mana at resolution (if conditions met). It "could" add mana. IS a mana ability → no stack → can't Stifle.

## Commonly Confused With
- **P007 (Priority Windows)** — P007 asks whether there's a window between two events. P015 asks whether there's a stack at all. Mana abilities eliminate the question — there's no window because there's no stack. For non-mana abilities, P007 then applies: yes, there's a priority window after the ability is placed on the stack.
- **P008 (Can't Overrides Can)** — Stifle doesn't "override" the fetchland — it counters it as a legal target. The question isn't about can't vs. can; it's about whether the ability uses the stack in the first place.
