---
id: p080
name: Spectacle — Conditional Alternative Cost
category: costs
cr_refs: [702.137a]
tags: [spectacle, alternative-cost, life-loss, condition, opponent, this-turn, cost-reduction]
created: 2026-03-28
examples_count: 2
---

# P080 — Spectacle — Conditional Alternative Cost

## Abstract
Spectacle is an alternative cost that can only be paid if an opponent lost life this turn. The spectacle cost is typically cheaper than the mana cost and is paid instead of it. The condition is checked when you announce casting the spell — if no opponent has lost life this turn, you cannot use the spectacle cost. The life loss can come from any source (combat damage, spells, effects) as long as it happened this turn before you cast the spell.

## The Definitive Rule

**CR 702.137a** (verbatim): *"Spectacle is a static ability that functions on the stack. 'Spectacle [cost]' means 'You may pay [cost] rather than pay this spell's mana cost if an opponent lost life this turn.' Casting a spell for its spectacle cost follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

## The Pattern

```
SPECTACLE CONDITION:
  "If an opponent lost life this turn"
  Condition checked at the time you DECLARE casting (announcement)
  Not at resolution — the announcement check is when you choose alternative costs

WHAT COUNTS AS "LOST LIFE":
  Combat damage dealt to any opponent this turn
  Spells/effects that cause opponents to lose life
  Extort (opponents lose life) → enables spectacle
  Shock targeting an opponent → opponent takes damage = loses life → spectacle enabled
  Life payment by an opponent (e.g., paying Phyrexian mana) → counts as losing life
  Land for turn, draw cards → these don't cause life loss → don't enable spectacle

EXACTLY WHEN IS IT CHECKED?
  "Spectacle [cost] if an opponent lost life this turn" is checked during announcement
  CR 601.2b: you choose the alternative cost during the announcement step
  If condition isn't met, you can't choose the spectacle alternative
  After choosing spectacle, the condition doesn't need to be re-checked at resolution

ORDER OF OPERATIONS:
  Turn 1: deal combat damage to opponent (they lose 3 life)
  Main phase 2 (or main phase 1 after first strike damage?):
    Cast spectacle spell using spectacle cost → valid (opponent lost life this turn)
  Turn 2 (opponent's turn):
    Can YOU use spectacle on opponent's turn (with flash)? Yes, if an opponent lost life this turn

SPECTACLE VS. RAID (similar conditional):
  Spectacle: opponent lost life this turn (any source)
  Raid: you attacked with a creature this turn
  Both are conditional alternative costs checked at announcement
  Spectacle has more ways to trigger (any life loss; not requiring your attack)
```

## Definitive Conclusions

- **Spectacle requires an opponent to have lost life this turn.** Any source counts.
- **The condition is checked at announcement** (when you declare you're casting with spectacle cost).
- **Combat damage, spells, extort — all can enable spectacle.**
- **Spectacle works on opponent's turn with flash** if an opponent lost life that turn.

## Canonical Example
**Rix Maadi Reveler (Spectacle {R}):**
Normal cost: {1}{R}. Spectacle: {R} (if an opponent lost life this turn). Turn 1: Shock an opponent (2 damage, they lose 2 life). Now spectacle is enabled. Cast Rix Maadi Reveler for {R} instead of {1}{R}, saving {1}. On spectacle: each player discards their hand and draws 3 cards.

**Example 2 — Spectacle during opponent's turn:**
You have a spectacle card with flash. During opponent's turn, they pay 2 life for Phyrexian mana. An opponent lost life this turn (their own turn). You cast the spectacle card with flash using spectacle cost.

## Commonly Confused With
- **P034 (Cascade)** — Cascade hits a card and casts it for free; spectacle is an optional cheaper alternative cost. No direct comparison, but both are alternative costs.
- **P049 (Kicker)** — Kicker is an additional cost; spectacle is an alternative cost (replaces mana cost). Both conditional, different mechanics.
