---
id: p083
name: Rebound — Delayed Free Cast on Next Upkeep
category: stack
cr_refs: [702.88a, 702.88b, 702.88c]
tags: [rebound, delayed-trigger, upkeep, free-cast, hand-cast-only, exile, copy-rebound]
created: 2026-03-28
examples_count: 2
---

# P083 — Rebound — Delayed Free Cast on Next Upkeep

## Abstract
Rebound exiles a spell when it resolves (instead of going to graveyard), then creates a delayed trigger to cast it again for free at the beginning of your next upkeep. Critically, rebound only works when the spell is cast from your hand — not from graveyard, not copied (copies aren't cast), not via flashback or cascade. If the spell was cast by any other means, rebound does not apply. Multiple instances of rebound on the same spell are redundant.

## The Definitive Rule

**CR 702.88a** (verbatim): *"Rebound appears on some instants and sorceries. It represents a static ability that functions while the spell is on the stack and may create a delayed triggered ability. 'Rebound' means 'If this spell was cast from your hand, instead of putting it into your graveyard as it resolves, exile it and, at the beginning of your next upkeep, you may cast this card from exile without paying its mana cost.'"*

## The Pattern

```
REBOUND TRIGGER CONDITION:
  Only fires if the spell was cast FROM YOUR HAND
  Cast from graveyard (flashback, escape, etc.): no rebound
  Cast as a copy: no rebound (copies aren't "cast from hand")
  Cast via cascade: was cast but not from hand → no rebound
  Cast normally from hand: rebound applies

REBOUND SEQUENCE (when cast from hand):
  1. Spell resolves
  2. Instead of going to graveyard: exiled face-up
  3. Delayed trigger created: "at beginning of your next upkeep, you may cast this card
     from exile without paying its mana cost"
  4. At next upkeep: trigger fires → choose whether to cast
     → If you cast: spell resolves again (but this time it was cast from exile → no rebound!)
     → If you don't: card stays in exile (you can try on future upkeeps? No:
        CR 702.88a says "at the beginning of your next upkeep" — the trigger fires ONCE)
       Actually: "at the beginning of your next upkeep" creates ONE delayed trigger
       It fires once. If you decline, the card stays in exile permanently.

WHEN CAST FROM EXILE (UPKEEP TRIGGER):
  The spell is cast from exile, not hand
  → Rebound doesn't apply again (only triggers when "cast from hand")
  → Spell resolves → goes to graveyard (no further exile)

MULTIPLE REBOUND INSTANCES:
  CR 702.88c: redundant — having two copies of rebound does nothing extra
  Still only exiles once and rebinds once

REBOUND + COPIES:
  If you Twincast a rebound spell:
  Twincast creates a copy (copy is not cast from hand → no rebound on the copy)
  The original spell (cast from hand) → rebound applies
  Copy resolves without rebound

REBOUND + MAGECRAFT:
  Magecraft triggers "when you cast or copy a spell"
  The rebound cast-from-exile-at-upkeep is CASTING a spell → magecraft triggers again
```

## Definitive Conclusions

- **Rebound only applies when cast from your hand.** Flashback, cascade, copy, etc. → no rebound.
- **The delayed upkeep trigger fires ONCE.** Decline it and the card stays exiled permanently.
- **When cast from exile at upkeep, rebound doesn't apply again.** Spell goes to graveyard after resolving.
- **Multiple rebound instances on same spell are redundant.**
- **Magecraft and "whenever you cast a spell" effects trigger again** on the rebound-cast at upkeep.

## Canonical Example
**Distortion Strike (Rebound):**
Cast from hand: target creature gets +1/+0 and is unblockable until end of turn. Rebound: instead of going to graveyard, card is exiled. Next upkeep: free cast trigger. Cast it again for free: same effect. Spell goes to graveyard this time (cast from exile, no rebound). Two turns of unblockable attacker for the cost of one spell.

**Example 2 — Rebound + Flashback:**
Distortion Strike somehow gets flashback. Cast via flashback (from graveyard): rebound does NOT apply (not cast from hand). The spell resolves and is exiled (from flashback's exile-on-leave-stack). No rebound trigger.

## Commonly Confused With
- **P046 (Flashback)** — Flashback also has "exile when leaving stack." Rebound exiles on resolution and creates a cast trigger. Flashback is an alternative cost; rebound is a resolution effect.
- **P083 and P044 (Epic)** — Epic creates upkeep copies; rebound creates an upkeep free cast. Both have upkeep triggers but different structures.
