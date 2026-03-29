---
id: p377
name: Sagas, Lore Counters, and Chapter Abilities — Triggered Chapter Abilities and Sacrifice Timing
category: triggered
cr_refs: [714.1, 714.2, 714.2b, 714.2d, 714.3a, 714.3b, 714.4, 702.155a, 702.155b]
tags: [saga, lore-counter, chapter-ability, precombat-main-phase-counter, state-based-sacrifice, read-ahead, saga-enchantment-creature, final-chapter, proliferate-saga, Urza-Saga, Elspeth-Conquers-Death, Binding-of-the-Titans, History-of-Benalia, Kiora-Bests-Sea-God, remove-lore-counters]
created: 2026-03-29
examples_count: 2
---

# P377 — Sagas, Lore Counters, and Chapter Abilities — Triggered Chapter Abilities and Sacrifice Timing

## Abstract
**Sagas** (rule 714) are enchantments with chapter abilities — triggered abilities that fire when lore counters are placed on the Saga. Sagas enter with one lore counter (or use "read ahead" to enter with more — see 702.155b), and at the beginning of each precombat main phase, the active player adds one more. Chapter abilities trigger when the required number of lore counters is reached. After the final chapter ability triggers (and while it's on the stack), the Saga remains. Once the final chapter ability has triggered and it leaves the stack, if the Saga's lore counter count is at or above the final chapter number and no chapter ability from it is still on the stack, the Saga is **sacrificed as a state-based action**. This SBA is slightly more nuanced than most: the sacrifice waits until all final chapter triggers have left the stack.

## The Definitive Rules

**CR 714.2b** (verbatim): *"'{rN}—[Effect]' means 'When one or more lore counters are put onto this Saga, if the number of lore counters on it was less than N and became at least N, [effect].'"*

**CR 714.3a** (verbatim): *"As a Saga without the read ahead ability enters the battlefield, its controller puts a lore counter on it. As a Saga with the read ahead ability enters the battlefield, its controller chooses a number from one to that Saga's final chapter number. That Saga enters the battlefield with the chosen number of lore counters on it."*

**CR 714.3b** (verbatim): *"As a player's precombat main phase begins, that player puts a lore counter on each Saga they control with one or more chapter abilities. This turn-based action doesn't use the stack."*

**CR 714.4** (verbatim): *"If the number of lore counters on a Saga permanent with one or more chapter abilities is greater than or equal to its final chapter number, and it isn't the source of a chapter ability that has triggered but not yet left the stack, that Saga's controller sacrifices it. This state-based action doesn't use the stack."*

**CR 702.155b** (verbatim): *"As a Saga with the read ahead ability enters the battlefield, its controller chooses a number from one to that Saga's final chapter number. That Saga enters the battlefield with the chosen number of lore counters on it."*

## The Pattern

```
SAGA BASICS:
  WHAT IS A SAGA:
    An enchantment subtype (some are also creature types).
    Has chapter symbols (I, II, III, etc.) each tied to an effect.
    Each chapter = a triggered ability that fires when lore counters reach that number.
    After all chapters are done: the Saga is sacrificed (SBA).
  LORE COUNTERS:
    Enter with 1 lore counter (714.3a) — OR chosen number for read ahead Sagas.
    Beginning of each precombat main phase: active player adds 1 lore counter to each Saga they control.
    "Turn-based action" — doesn't use the stack. Happens automatically.
  WHEN CHAPTER ABILITIES TRIGGER:
    714.2b: triggers "when one or more lore counters are put onto this Saga, if the number was less
      than N and became at least N."
    The trigger fires when counters are placed AND the count crossed N.
    If you place multiple counters at once (via proliferate, counter-adding effects):
      Multiple chapters might trigger simultaneously (if adding 2 counters crosses multiple thresholds).
      Example: Saga has 0 lore counters. You add 2 at once. Count: 0 → 2.
        Both Chapter I and Chapter II triggers fire (count "became at least 1" and "became at least 2").
  PROLIFERATE AND SAGAS:
    Proliferate on a Saga: add one more lore counter.
    If the extra counter advances the Saga to a new chapter threshold: that chapter triggers.
    If it advances past the final chapter: the Saga is eligible for SBA sacrifice.
    Accelerating a Saga via proliferate can be powerful (skip to final chapter effect quickly)
      OR dangerous (the Saga sacrifices sooner than planned).
  SAGA SACRIFICE (SBA — 714.4):
    After the final chapter number is reached:
      Check: "lore counters ≥ final chapter number AND no chapter ability from this Saga is
        currently on the stack."
      Only once all chapter abilities from this Saga have left the stack: sacrifice.
    WHY THIS MATTERS:
      The final chapter ability fires. Goes on the stack. SBA would say sacrifice, but...
      714.4: "it isn't the source of a chapter ability that has triggered but not yet left the stack."
      The final chapter is on the stack. Sacrifice SBA doesn't fire yet.
      Final chapter resolves. SBA now checks: lore counters ≥ final chapter, no pending triggers.
      Saga is sacrificed as SBA.
    CAN YOU RESPOND BEFORE SACRIFICE?
      After the final chapter ability RESOLVES: before priority is given, SBA fires.
      The sacrifice happens immediately after the last chapter trigger resolves.
      If you want to copy the Saga or interact with it: do so BEFORE the final chapter resolves.
      Once the final chapter fully resolves: sacrifice happens in the SBA check.
  REMOVING LORE COUNTERS:
    If you remove lore counters from a Saga: the SBA no longer fires if count drops below final chapter.
    But: removing lore counters doesn't "re-trigger" already-passed chapters.
    714.2b: triggers "if the number was LESS THAN N and became AT LEAST N."
    If the count was at N and you remove counters then re-add: it triggers again.
    (Was below N, became at least N again = trigger fires.)
    This is a form of repeating Saga effects:
      Reduce counters below a threshold → add back above it → that chapter triggers again.
  SAGA AND ENCHANTMENT CREATURES (714.1a):
    Some Sagas are also creature enchantments (like Background enchantments).
    These have P/T, creature abilities, AND chapter abilities.
    The chapter abilities are still in the text box. The creature abilities are separate.
    When the Saga is sacrificed: the creature dies (put into GY from battlefield via sacrifice).
      "Dies" triggers fire.
  READ AHEAD (702.155a):
    "Chapter abilities can't trigger the turn it entered unless it has exactly N lore counters."
    AND: "As this enters, choose a number from 1 to final chapter. Enter with that many counters."
    This lets you choose to enter at a later chapter:
      Skip early chapters and go straight to the middle or late effect.
      But: the chosen chapter's ability triggers THIS turn (because the counter entering = threshold).
        Wait: 702.155a says "can't trigger the turn it entered... unless it has EXACTLY the number
          of lore counters specified in that chapter symbol."
        If you enter with exactly 2 lore counters and Chapter II is {rII}: Chapter II triggers this turn.
        If you enter with 1 counter: Chapter I triggers. NOT Chapter II (you don't have exactly 2).
        If you enter with 3 counters for a 3-chapter Saga: Chapter III triggers (exactly 3). Saga immediately eligible for sacrifice after Chapter III resolves.
    The "can't trigger" part: if you enter with more counters than any chapter you've passed through:
      Those passed chapters DON'T trigger on entry. Only the EXACT current chapter.
  SAGA EXAMPLES:
    History of Benalia ({1}{W}{W}): Chapters I, II, III.
      I: Create a 2/2 Knight token with vigilance.
      II: Create another 2/2 Knight token.
      III: Knights you control get +2/+1 until end of turn.
      Turn 1: Enter. Chapter I triggers (lore counter 0→1). Create Knight.
      Turn 2: Add lore counter (1→2). Chapter II triggers. Create Knight.
      Turn 3: Add lore counter (2→3). Chapter III triggers. +2/+1 to Knights.
        Final chapter = III. SBA: sacrifice History of Benalia.
      Result: 2 Knights + combat boost over 3 turns.
    Urza's Saga ({0}: colorless land/enchantment, only 3 taps):
      I: Urza's Saga gains "{T}: Add {C}."
      II: Urza's Saga gains "{T}: Add {C}{C}."
      III: Search your library for an artifact with mana value 0 or 1. Put it onto the battlefield.
      Urza's Saga is both an enchantment AND a land. It has chapter abilities.
      I and II give it mana abilities (it becomes a land for mana). III finds artifacts.
      After III resolves: Saga sacrificed. (Urza's Saga is legendary? No, it's not legendary.)
      Very powerful in Modern (finds Retrofitter Foundry, Mishra's Bauble, etc. for free).
```

## Definitive Conclusions

- **Sagas add one lore counter at the beginning of each precombat main phase** — this is a turn-based action, doesn't use the stack, can't be responded to.
- **Chapter abilities trigger when the lore counter count crosses the chapter threshold** — adding multiple counters at once can trigger multiple chapters simultaneously.
- **The Saga is sacrificed as an SBA after all chapter abilities from it leave the stack** — while the final chapter is still on the stack, no sacrifice; once it resolves, sacrifice fires as SBA.
- **Removing lore counters below a chapter threshold lets that chapter re-trigger when counters are re-added** — a narrow but real rules interaction for re-triggering chapters.
- **Read ahead enters with a chosen number of counters** — only the exact chapter at entry triggers that turn; earlier chapters are skipped.
- **Proliferating a Saga accelerates it toward final chapter** — can be a benefit (faster effects) or a drawback (faster sacrifice).

## Canonical Example
**History of Benalia — Three-Turn Saga:**
Turn 1 (on battlefield this turn, cast precombat):
  Precombat main phase begins: "Put a lore counter on each Saga." History of Benalia: 0 → 1 lore counter.
  Chapter I trigger: "When one or more lore counters are put onto this Saga, if the number was less
    than I (1) and became at least 1, create a 2/2 white Knight token with vigilance."
  Wait: "As this enters, put a lore counter on it." (714.3a) The counter is placed when entering.
  So Chapter I triggers WHEN THE SAGA ENTERS (the counter from entering triggers it).
  Then: precombat main phase ALSO adds a counter... wait: does it enter AND get precombat counter?
  714.3a: enters with a lore counter. 714.3b: at beginning of precombat main phase, add a counter.
  If you cast the Saga during your main phase: it ENTERS with 1 counter (714.3a).
    Chapter I triggers (counter was added as it entered).
  Then: the NEXT main phase (your next turn), it gets a second counter.
  So the chapter sequence is:
    Turn cast: enter with counter → Chapter I fires (create Knight #1).
    Turn 2: precombat main phase counter → Chapter II fires (create Knight #2).
    Turn 3: another counter → Chapter III fires (Knights get +2/+1).
      Final chapter reached. After Chapter III resolves: sacrifice History.
  In practice: you have 2 Knights on battlefield + a combat buff happening.

**Example 2 — Proliferating Urza's Saga:**
Urza's Saga is a land/enchantment. You control it currently at lore counter 1 (after Chapter I: it has "{T}: Add {C}").
You have a proliferate effect (Karn's Bastion).

Use Karn's Bastion's proliferate: add a lore counter to Urza's Saga (1 → 2).
Chapter II triggers: "Urza's Saga gains '{T}: Add {C}{C}.'" (Now taps for 2 colorless.)
Now Urza's Saga has both mana abilities (from I and II).

Next turn: precombat main phase adds another counter (2 → 3).
Chapter III triggers: "Search your library for an artifact with mana value 0 or 1. Put it onto battlefield."
Find Mishra's Bauble ({0}: draw on next draw step).
Chapter III was the final chapter. After it resolves: SBA → sacrifice Urza's Saga.

Urza's Saga provided: ~3 colorless mana over 2 turns + a free 0-1 MV artifact.
By proliferating, you accelerated Chapter II → got the double-mana ability sooner.
Trade-off: used up Karn's Bastion activation to accelerate, and the Saga died on turn 3 instead of turn 4.

## Commonly Confused With
- **P011 (ETB Triggers)** — Sagas are enchantments entering the battlefield. The lore counter from entering (714.3a) triggers Chapter I (not an ETB trigger technically — it's a chapter ability triggered by the counter placement). But it behaves like an ETB trigger in practice (fires when the Saga enters). ETB trigger effects that say "when an enchantment enters" DO fire for Sagas (since Sagas are enchantments).
- **P002 (Replacement Effects)** — Copying a Saga: if you Animate Dead a Saga or copy it, the copy enters with 1 lore counter (or however many from its ETB). The chapter ability fires from the counter placed when it enters. Copy effects (Layer 1) capture the Saga's copiable values; the lore counters on the original are NOT copiable values.
- **P373 (Foretell/Spectacle)** — Read ahead is a saga-specific alternative that affects how many lore counters are placed at entry. This is conceptually similar to foretell's "delay the cast" — you can jump ahead in the Saga. But foretell delays the whole spell; read ahead modifies how the Saga begins (at a higher chapter).
- **P004 (Layer System/Continuous Effects)** — Urza's Saga's Chapter I and II add activated abilities to itself. These are continuous effects (adding activated abilities = Layer 6). When the Saga is sacrificed: those effects end. On the turn Chapter III fires and the Saga is sacrificed: the mana abilities were already on it when the main phase started, so they were available for tapping before sacrifice.
