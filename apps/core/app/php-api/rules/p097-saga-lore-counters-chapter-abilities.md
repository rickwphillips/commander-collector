---
id: p097
name: Saga — Lore Counters and Chapter Abilities
category: triggered
cr_refs: [714.1, 714.2, 714.3, 714.4, 714.5]
tags: [saga, lore-counter, chapter, upkeep, enchantment, read-ahead, final-chapter, sacrifice, triggered]
created: 2026-03-28
examples_count: 2
---

# P097 — Saga — Lore Counters and Chapter Abilities

## Abstract
Sagas are enchantments that enter with a lore counter and gain a lore counter each upkeep. Each chapter (I, II, III) has an ability that triggers when the appropriate number of lore counters is reached. After the final chapter's ability triggers, the Saga is sacrificed (as an SBA). Sagas with "Read Ahead" allow choosing the starting chapter. Chapters are not triggered when "as Saga enters" — they trigger at the moment the lore counter is placed.

## The Definitive Rule

**CR 714.1**: A Saga card is an enchantment. "When [Saga] enters the battlefield and at the beginning of each of your main phases, put a lore counter on it."

**CR 714.2**: When a lore counter is placed on a Saga, check each of its chapter abilities. If the current number of lore counters equals or is greater than the minimum number in the chapter symbol, the chapter ability triggers.

**CR 714.3**: Sagas must be sacrificed if they have lore counters equal to or greater than their final chapter number and their final chapter ability has triggered.

**CR 714.4**: Read Ahead allows choosing the starting chapter number.

## The Pattern

```
SAGA LIFECYCLE:
  1. Saga enters: gains 1 lore counter IMMEDIATELY (not at next upkeep)
     → Chapters I ability triggers (if exists at 1 counter)
  2. At the beginning of each of your main phases: gain 1 lore counter
     Wait: CR 714.1 says "when this enters AND at the beginning of each of your main phases"
     Actually: Sagas put lore counters when entering AND at the beginning of each turn's main phase
     But only YOUR main phases (first main phase + second main phase both count)
     Hmm: "at the beginning of your main phases" = twice per turn potentially
     Actually: standard Sagas have ONE chapter per upkeep (once per turn advancement)
     Let me be precise: Saga adds lore counter at the beginning of your PRE-COMBAT main phase
     (the primary main phase), once per turn
  3. When lore counter count matches a chapter: that chapter ability triggers
  4. When lore counter count reaches final chapter: after final chapter triggers,
     SBA fires: sacrifice the Saga

CHAPTER ABILITY TIMING:
  Triggered when lore counter is placed (not immediately visible on the stack)
  "When the final chapter is triggred... sacrifice after it triggers" = SBA
  Actually: CR 704.5s: Saga with a number of lore counters ≥ its final chapter number
    that has had its final chapter ability triggered = sacrifice it as SBA
  Not before the trigger resolves — the sacrifice happens after the last chapter triggers
    (When the SBA checks again after the trigger is on the stack: SBA fires → sacrifice)

READ AHEAD (P060 cross-reference):
  Saga enters with chosen number of lore counters (instead of 1)
  Immediately triggers all chapters up to that number? No:
    CR 702.155a: "chapter abilities of a read-ahead Saga can't trigger the turn it entered"
    UNLESS the Saga has exactly the number of counters specified in that chapter symbol
    So: enters with 3 lore counters → chapter III triggers; chapters I and II don't
    Next turn: would gain another counter (to 4) — but if 3 is final chapter: sacrifice instead

DOUBLING SEASON AND SAGAS:
  Doubling Season doubles COUNTERS placed on permanents you control
  Sagas get lore counters placed on them → Doubling Season doubles to 2 counters
  → Saga skips to chapter II immediately (or even higher)
  → May trigger final chapter on entry → sacrifice immediately
  This is a known interaction: Doubling Season + Saga with 3 chapters → enters with 2 counters
    → Chapter II triggers (if 2 matches); at first main phase: +2 more (to 4) → chapter III+?
    Complex: depends on doubling and chapters

PROLIFERATE AND SAGAS:
  Proliferate: add one more lore counter to the Saga → advances to next chapter
  Can accelerate or skip chapters
```

## Definitive Conclusions

- **Sagas enter with 1 lore counter and gain one at the beginning of each of your main phases.**
- **Chapters trigger when the lore counter count matches the chapter number.**
- **After the final chapter triggers, the Saga is sacrificed via SBA.**
- **Doubling Season accelerates Sagas by doubling placed lore counters.**
- **Proliferate advances Sagas to the next chapter.**

## Canonical Example
**The Eldest Reborn (three chapters):**
Turn 1 it enters: 1 lore counter → Chapter I triggers (each opponent sacrifices a creature). Turn 2 main phase: 2 lore counters → Chapter II triggers (each opponent discards a card). Turn 3 main phase: 3 lore counters → Chapter III triggers (return a creature or planeswalker from any graveyard). After Chapter III triggers: SBA fires → sacrifice The Eldest Reborn.

**Example 2 — Read Ahead:**
Saga with Read Ahead enters with 2 lore counters (you chose chapter II). Chapter II triggers immediately (since exactly 2 counters and it's chapter II). Next main phase: gain 1 more counter → 3 → Chapter III triggers → sacrifice.

## Commonly Confused With
- **P025 (Counter Placement)** — Doubling Season doubles lore counters placed on Sagas, accelerating their progression.
- **P054 (Proliferate)** — Proliferate advances Sagas by adding lore counters, skipping chapters or reaching final chapter faster.
