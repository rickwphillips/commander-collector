---
id: p181
name: Read Ahead — Choose Starting Chapter for Sagas
category: replacement
cr_refs: [702.155a, 702.155b, 702.155c]
tags: [read-ahead, saga, lore-counter, chapter, choose-start, Dominaria-United, Atraxa-Saga]
created: 2026-03-28
examples_count: 2
---

# P181 — Read Ahead — Choose Starting Chapter for Sagas

## Abstract
Read Ahead is a keyword on some Saga cards. Normally, Sagas enter with one lore counter and advance one chapter at a time. With Read Ahead, the controller chooses a number from 1 to the Saga's final chapter number as the Saga enters, and the Saga enters with that many lore counters. This allows skipping directly to a later chapter (at the cost of all earlier chapters). Additionally, chapter abilities can only trigger on the turn the Saga entered if it has exactly the right number of counters for that chapter. This means a Saga can be "jumped in" to its middle or final chapter immediately.

## The Definitive Rules

**CR 702.155a** (verbatim): *"Read ahead is a keyword found on some Saga cards. 'Read ahead' means 'Chapter abilities of this Saga can't trigger the turn it entered the battlefield unless it has exactly the number of lore counters on it specified in the chapter symbol of that ability.' See rule 714, 'Saga Cards.'"*

**CR 702.155b** (verbatim): *"As a Saga with the read ahead ability enters the battlefield, its controller chooses a number from one to that Saga's final chapter number. That Saga enters the battlefield with the chosen number of lore counters on it. See rule 714, 'Saga Cards.'"*

## The Pattern

```
READ AHEAD:
  Replacement effect: instead of entering with 1 counter, choose 1 to max chapter count
  Restriction: chapter abilities only trigger the turn it entered IF it has exactly that chapter's count

  NORMAL SAGA BEHAVIOR (no read ahead):
    Enters with 1 lore counter → chapter 1 triggers
    Each upkeep: add 1 lore counter → appropriate chapter triggers
    After final chapter: sacrifice the Saga

  READ AHEAD BEHAVIOR:
    Enter with chosen number of lore counters
    That chapter triggers (if it has exactly that count)
    Each upkeep: add 1 lore counter → next chapter triggers

  READ AHEAD + SKIPPING CHAPTERS:
    Choose to enter at chapter 3 of a 3-chapter saga: skip chapters 1 and 2
    Chapter 3 triggers immediately (if that's the entry count)
    Then the saga is sacrificed next upkeep (or at the beginning of the controller's upkeep)
    Wait: when is the saga sacrificed? After the final chapter triggers: SBA sacrifice

  READ AHEAD + "EXACTLY":
    CR 702.155a: chapter abilities don't trigger on entry unless it has EXACTLY the right count
    If you enter with 2 counters: chapter 2 triggers on entry turn (has exactly 2)
    Chapter 1 doesn't trigger (had 1 counter BEFORE entering, but entered with 2)
    This prevents a Saga from triggering all previous chapters on the turn it enters

  READ AHEAD + PROLIFERATE:
    Proliferate adds lore counters to a Saga with at least one counter
    Can accelerate a Saga through chapters faster
    Or: skip directly to final chapter + proliferate immediately for the sacrifice

  READ AHEAD + CHAPTER CHOICE:
    Strategic: skip early utility chapters to reach the powerful final chapter immediately
    Or: start at chapter 1 for multiple turns of value
    Read ahead gives flexibility: context-dependent chapter selection

  READ AHEAD SAGAS:
    The Brothers' War (Dominaria United): several powerful sagas with read ahead
    Atraxa's Fall, The Phasing of Zhalfir, etc.
```

## Definitive Conclusions

- **Read Ahead lets you choose which chapter to start on** — enter with N lore counters.
- **The chosen chapter triggers on entry day** — but ONLY if the Saga has exactly that chapter's counter count.
- **Earlier chapters are permanently skipped** if you enter at a later chapter.
- **Proliferate accelerates Sagas** through chapters.
- **Flexibility**: context-dependent value: early chapters for sustained utility, later chapters for immediate impact.

## Canonical Example
**The Brothers' War (Read Ahead, 3-chapter saga):**
Chapter 1: Create two 3/3 artifact creature tokens.
Chapter 2: Mill cards until you hit an artifact, put it in your hand.
Chapter 3: Return all artifact creatures from your graveyard to play.

In a long game with a full graveyard: skip to chapter 3 immediately → all artifact creatures return.
In an early-game situation needing tokens: enter at chapter 1 → get two 3/3 artifact tokens.
Read Ahead makes it a flexible mid/late-game toolbox.

**Example 2 — Skipping for Final Chapter:**
A Read Ahead Saga with a powerful chapter 5 (ultimate) ability.
Normal play: 5 turns to reach chapter 5.
With Read Ahead: enter at chapter 5 → trigger immediately → Saga is sacrificed next upkeep.
Pay full investment upfront to get the ultimate effect immediately.

## Commonly Confused With
- **P181 vs Normal Sagas** — Normal sagas advance through all chapters in order. Read Ahead lets you skip to any chapter at entry.
- **P112 (Vanishing)** — Vanishing counts time counters down to sacrifice. Saga counts lore counters UP to sacrificed.
- **P134 (Cumulative Upkeep)** — Cumulative upkeep adds age counters each upkeep, escalating cost. Sagas add lore counters for triggered abilities, then sacrifice.
