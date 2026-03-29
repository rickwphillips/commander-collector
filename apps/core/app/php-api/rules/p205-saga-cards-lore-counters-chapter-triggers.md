---
id: p205
name: Saga Cards — Lore Counters, Chapter Triggers, and Sacrifice
category: triggered
cr_refs: [714.1, 714.2, 714.2b, 714.3, 714.3b, 714.4]
tags: [saga, lore-counters, chapter-ability, sacrifice-when-complete, main-phase, read-ahead, Theros, Brothers-War]
created: 2026-03-28
examples_count: 2
---

# P205 — Saga Cards — Lore Counters, Chapter Triggers, and Sacrifice

## Abstract
Saga cards are enchantments that track their story through lore counters. When a Saga enters the battlefield (without Read Ahead), it immediately gets 1 lore counter. At the beginning of each player's precombat main phase, the active player puts a lore counter on each Saga they control — this is a turn-based action. Each lore counter put on triggers the corresponding chapter ability. When the final chapter triggers and the Saga has resolved its last chapter, it's sacrificed via state-based action. Sagas tell a three-act (or more) story: each chapter is a different effect, and the Saga consumes itself when the story ends.

## The Definitive Rules

**CR 714.2b** (verbatim): *"'{rN}—[Effect]' means 'When one or more lore counters are put onto this Saga, if the number of lore counters on it was less than N and became at least N, [effect].'"*

**CR 714.3a** (verbatim): *"As a Saga without the read ahead ability enters the battlefield, its controller puts a lore counter on it. As a Saga with the read ahead ability enters the battlefield, its controller chooses a number from one to that Saga's final chapter number. That Saga enters the battlefield with the chosen number of lore counters on it."*

**CR 714.3b** (verbatim): *"As a player's precombat main phase begins, that player puts a lore counter on each Saga they control with one or more chapter abilities. This turn-based action doesn't use the stack."*

**CR 714.4** (verbatim): *"If the number of lore counters on a Saga permanent with one or more chapter abilities is greater than or equal to its final chapter number, and it isn't the source of a chapter ability that has triggered but not yet left the stack, that Saga's controller sacrifices it. This state-based action doesn't use the stack."*

## The Pattern

```
SAGA PROGRESSION:
  Turn 1 (Saga enters): immediately +1 lore counter → Chapter I triggers
  Turn 2 (your next precombat main): +1 counter → Chapter II triggers
  Turn 3 (your next precombat main): +1 counter → Chapter III triggers → SBA: sacrifice it

  LORE COUNTER PLACEMENT TIMING:
    "As a Saga enters": immediate (entering event, part of ETB)
    "Beginning of precombat main phase": turn-based action, doesn't use stack
    Turn-based actions happen BEFORE triggers go on the stack
    So: lore counter is placed, THEN the chapter trigger goes on the stack

  CHAPTER TRIGGER CONDITION (CR 714.2b):
    "{rN}—[Effect]" triggers when "lore counters were < N and became >= N"
    This handles multi-chapter symbols: "{rII}, {rIII} — [Effect]"
    If you skip chapter II (e.g., counter placed jumping to III): both chapters don't trigger?
    Actually: the trigger fires when the COUNT crosses the threshold
    A counter placing that jumps from 0 to 3 (e.g., proliferate multiple times):
    Would trigger all chapters whose threshold was crossed (I, II, III if this is a 3-chapter Saga)
    But normally: counters placed one at a time → each chapter triggers individually

  SACRIFICE STATE-BASED ACTION (CR 714.4):
    When lore counters >= final chapter number AND the last chapter ability has left the stack:
    The Saga is sacrificed (SBA)
    Important: NOT sacrificed immediately when the last counter is placed
    The last chapter ability must resolve first (or be countered), THEN sacrifice SBA fires
    So: the last chapter effect resolves, player gets priority, THEN SBA fires

  SAGAS + PROLIFERATE:
    Proliferate adds a counter to each permanent with a counter you choose
    Can add lore counters to Sagas via Proliferate
    If you Proliferate a 1-counter Saga to 2: skips chapter I? No — chapter I already triggered
    Proliferating to chapter III before final chapter: skips intermediate chapters' triggers!
    Wait: chapter triggers fire when the count "crosses" the threshold
    Adding from 1 to 3 in one step: crosses II and III simultaneously?
    Actually: a single counter placed crosses one threshold. But Proliferate can add multiple...
    Proliferate adds one counter: 1 → 2 (crosses II threshold). Chapter II triggers.
    Proliferating again: 2 → 3 (crosses III threshold). Chapter III triggers.
    Each Proliferate activation adds 1 counter, each crossing triggers the corresponding chapter.

  SAGAS + BOUNCE/BLINK:
    Bouncing a Saga to hand: removes all lore counters (new object when re-enters)
    When Saga re-enters: starts from chapter I again
    Blink: same — new object, starts over
    Strategic: repeat chapter I effects by blinking the Saga

  SAGAS + SAGA-CREATURES:
    Some Sagas are also creatures (Creature Enchantment — Saga)
    These Sagas have power/toughness AND chapter abilities
    They have combat abilities AND tell a story
    The chapter abilities function normally; the creature stats are on the card

  SAGAS + READ AHEAD (P181):
    Sagas with Read Ahead: enter with chosen number of lore counters
    Can start at chapter II or III (skip earlier chapters)
    Useful: you only want the final effect, skip the build-up

  SAGA + COUNTER REMOVAL:
    If a counter is removed from a Saga: it doesn't "un-trigger" past chapters
    But: now the Saga has fewer counters and may not reach sacrifice threshold yet
    Can extend the Saga's life by removing lore counters
    This is unusual but possible (e.g., Vampire Hexmage removes all counters)
    Removing all counters: the Saga has 0 lore counters → the SBA won't fire
    But: no chapter abilities will trigger until counters are added again
    Effectively: the Saga sits dormant (no triggers, no sacrifice)
```

## Definitive Conclusions

- **Sagas advance by one chapter per turn** (precombat main phase lore counter + chapter I on entry).
- **Chapter triggers fire** when lore counters cross the chapter's threshold value.
- **Sacrifice is a SBA** — after the final chapter RESOLVES (or leaves the stack), not when triggered.
- **Proliferate advances Sagas** — each counter added triggers the crossed chapter.
- **Bouncing/blinking resets** the Saga to chapter I (all counters lost on zone change).

## Canonical Example
**The Eldest Reborn (3-chapter Saga):**
Chapter I: each opponent sacrifices a non-land permanent.
Chapter II: each opponent discards a card.
Chapter III: put a creature or planeswalker from any graveyard onto the battlefield.

Turn cast: enters with 1 counter → Chapter I triggers (opponents sacrifice).
Turn 2 (precombat main): +1 counter (now 2) → Chapter II triggers (opponents discard).
Turn 3 (precombat main): +1 counter (now 3, final chapter) → Chapter III triggers (reanimate something).
After Chapter III resolves: SBA checks → 3 counters >= 3 (final chapter) → sacrifice The Eldest Reborn.
Net: 3 powerful effects over 3 turns, then the Saga ends itself.

**Example 2 — Bouncing the Saga:**
Urza's Saga (powerful Saga in Modern with chapter abilities):
Chapter I: add colorless mana ability
Chapter II: create a 0/0 Construct token
Chapter III: search for an artifact with mana value ≤ 0 (like Springleaf Drum or Colossus Hammer)

After Chapter I: bounce Urza's Saga with Ephemerate (exile + return).
Urza's Saga re-enters: 0 lore counters (new object). Then immediately gains 1 counter → Chapter I again.
Repeat the Chapter III search by bouncing after Chapter II each time? No:
You can only bounce while the Saga exists (after Chapter III triggers, it sacrifices).
But bouncing early: re-trigger Chapter I or II effects.

## Commonly Confused With
- **P181 (Read Ahead)** — Read Ahead is a Saga modification that allows entering at higher chapters.
- **P174 (Level Up)** — Level Up puts level counters on creatures via activation. Sagas get lore counters automatically each turn.
- **P205 vs Enchantress** — Enchantress effects trigger "when you cast an enchantment" — Sagas fire this once (on cast/entry). Chapter abilities are separate triggers from chapter progress.
