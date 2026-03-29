---
id: p345
name: Saga Cards — Lore Counters, Chapter Abilities, and the Sacrifice SBA
category: triggered
cr_refs: [714.1, 714.2, 714.2b, 714.2c, 714.3, 714.3a, 714.3b, 714.4, 505.4, 702.155]
tags: [saga, lore-counter, chapter-ability, precombat-main-phase, SBA-sacrifice, read-ahead, enchantment, final-chapter, Binding-the-Old-Gods, The-Book-of-Exalted-Deeds, Urza-Saga, Phyrexian-Scriptures, Sagas-as-creatures, Kiora-Bests-the-Sea-God]
created: 2026-03-29
examples_count: 2
---

# P345 — Saga Cards — Lore Counters, Chapter Abilities, and the Sacrifice SBA

## Abstract
Saga enchantments gain lore counters at the **start of the controller's precombat main phase** as a turn-based action (505.4). Each lore counter gain triggers the corresponding **chapter ability** (714.2b). The Saga's **final chapter ability** fires when the last lore counter is placed; after that chapter ability has left the stack, the Saga is sacrificed as a **state-based action** (714.4). **Read Ahead** lets the controller choose how many lore counters the Saga enters with (702.155), enabling immediate access to later chapters. Sagas can also be enchantment creatures (like Urza Saga), with creature-specific text below the type line that functions independently of chapter abilities.

## The Definitive Rules

**CR 714.2b** (verbatim): *'"{rN}—[Effect]" means "When one or more lore counters are put onto this Saga, if the number of lore counters on it was less than N and became at least N, [effect]."'*

**CR 714.3a** (verbatim): *"As a Saga without the read ahead ability enters the battlefield, its controller puts a lore counter on it. As a Saga with the read ahead ability enters the battlefield, its controller chooses a number from one to that Saga's final chapter number. That Saga enters the battlefield with the chosen number of lore counters on it."*

**CR 714.3b** (verbatim): *"As a player's precombat main phase begins, that player puts a lore counter on each Saga they control with one or more chapter abilities. This turn-based action doesn't use the stack."*

**CR 714.4** (verbatim): *"If the number of lore counters on a Saga permanent with one or more chapter abilities is greater than or equal to its final chapter number, and it isn't the source of a chapter ability that has triggered but not yet left the stack, that Saga's controller sacrifices it. This state-based action doesn't use the stack."*

## The Pattern

```
LORE COUNTER GAIN — WHEN AND HOW:
  ENTERING THE BATTLEFIELD:
    A Saga without read ahead enters with exactly 1 lore counter (714.3a).
    This counter gain triggers chapter I (per 714.2b).
  PRECOMBAT MAIN PHASE (505.4):
    At the start of EACH precombat main phase, each Saga the active player controls
      gains a lore counter. Turn-based action — doesn't use the stack.
    This fires after phasing/untap/upkeep/draw but BEFORE the player gets priority in main phase.
    Chapter abilities triggered by this counter placement go on stack when player gets priority.
  COMBINED: a Saga on the battlefield at start of your precombat main phase immediately gains
    a lore counter, triggering the appropriate chapter ability.

CHAPTER ABILITY TRIGGERING (714.2b):
  Format: "{rN}—[Effect]" means:
    "When one or more lore counters are put onto this Saga,
      if the number of lore counters on it WAS LESS THAN N and BECAME AT LEAST N, [effect]."
  KEY POINT: triggers on the TRANSITION (below N → at or above N).
    If you proliferate a Saga (add a lore counter): the chapter fires if the count crossed a threshold.
    If a Saga already has 3 counters and gains another → chapter III doesn't re-trigger
      (it was already at 3 or above; threshold already crossed).
  MULTIPLE CHAPTERS WITH SAME NUMERAL (714.2c):
    "{rI}, {rII}—[Effect]" means the effect fires for chapter I AND chapter II separately.
    Each counter gain that crosses either threshold fires the ability.
    Not combined into one double-firing; each is its own trigger event.

CHAPTERS SEQUENCE (typical 3-chapter Saga):
  Enter with 1 lore counter: Chapter I triggers.
  Precombat main turn 2: gain 1 more → 2 counters → Chapter II triggers.
  Precombat main turn 3: gain 1 more → 3 counters → Chapter III triggers.
    After Chapter III resolves (leaves the stack): SBA fires — controller sacrifices the Saga.

SACRIFICE SBA (714.4):
  Conditions for sacrifice:
    1. Lore counters ≥ final chapter number.
    2. No chapter ability from this Saga is currently on the stack.
  WHY THE SECOND CONDITION:
    The Saga waits until the final chapter ability has left the stack before being sacrificed.
    This ensures the final chapter's effect resolves before the Saga dies.
    If multiple instances of the final chapter triggered simultaneously: wait for all to leave stack.
  SAGA IS SACRIFICED (not "destroyed"):
    Sacrifice = not subject to indestructible. Can't be regenerated.
    Sacrifice doesn't trigger "dies" unless you have a sacrifice-counts-as-death effect.
    Wait: sacrificing IS putting into the GY from the battlefield. So "dies" trigger (700.4) fires.
      A Saga sacrifice triggers Blood Artist, Grave Pact, etc.

PREVENTING SACRIFICE:
  Remove lore counters: some effects remove counters from permanents.
    If lore counters drop below final chapter number: SBA condition no longer met. Saga stays.
  Proliferate can ACCELERATE: add lore counters to skip to higher chapters faster.
    But can't extend — once at final chapter number and chapter ability leaves stack: sacrifice.
  Bounce the Saga: exile/return or bounce returns it to hand (new object, restarts).
  Note: an indestructible Saga still gets sacrificed by the SBA (sacrifice bypasses indestructible).

READ AHEAD (702.155):
  "Read Ahead" on a Saga: as it enters, choose a number from 1 to the final chapter number.
  It enters with that many lore counters.
  This may immediately put the Saga past earlier chapters (skipping them).
  Example: A 3-chapter Saga with read ahead entering with 3 counters:
    → Immediately fires chapter III trigger.
    → After Chapter III resolves: sacrifice SBA fires.
    Chapters I and II are skipped entirely.
  STRATEGIC CHOICE:
    Enter at I: get all chapters over 3 turns. Full value.
    Enter at III: get only the final chapter immediately, then sacrifice. Speed over value.
    Enter at II: skip chapter I, get chapters II and III.
  You choose the number on entry. Can't change it afterward.

SAGAS AS CREATURES (714.1a):
  Some Sagas are also creatures (printed in post-Innistrad sets).
  Example: Urza Saga (Artifact Land with Saga properties isn't a creature, but others are).
  Teferi's Protecion-era Sagas: just enchantments. Modern: enchantment creature Sagas.
  CREATURE TEXT IS INDEPENDENT:
    The abilities in the text box BELOW the type line (not in chapter symbols) are regular abilities.
    They don't relate to lore counters. They function as normal creature abilities.
  SUMMONING SICKNESS: if the Saga is also a creature:
    New creature → summoning sickness → can't attack or use {T} abilities until next turn.
    Chapter abilities still fire (triggered, not {T} costs).
  P/T: Saga creatures have printed P/T.
    If the Saga dies to damage: normal SBA (toughness ≤ total damage).
    If sacrificed by Saga SBA: goes to GY (it "dies" per CR 700.4).

INTERACTION WITH DOUBLING EFFECTS:
  If an effect doubles lore counters placed: "put a lore counter" → 2 lore counters placed.
  Chapter ability checks: if count WAS below N and becomes ≥ N → triggers.
  With 2 counters placed simultaneously: the Saga may cross multiple chapter thresholds at once.
    Example: 0 counters → place 2 → now at 2. Chapter I (threshold ≥ 1) and Chapter II (threshold ≥ 2)
      BOTH trigger. Both effects resolve.
    Jumping straight from 0 to 3 with a counter-tripling effect: all three chapter abilities trigger.

COUNTER MANIPULATION — PROLIFERATE:
  Proliferate: choose any number of permanents with counters, add one more of each type.
    A Saga with lore counters: you may proliferate and add a lore counter.
    This triggers the next chapter if the count crosses a threshold.
  STRATEGIC USE:
    Proliferate to advance Urza Saga to chapter III for its "create Construct" ability.
    Proliferate to skip mid-chapters you don't want.
    Proliferate on opponent's Saga to advance it to sacrifice faster (remove it sooner).
      Dangerous for opponent if they have only chapter I and you jump them to III.
```

## Definitive Conclusions

- **Lore counters added at precombat main phase start as a turn-based action** — this fires BEFORE the player gets priority; the chapter trigger is placed on the stack when priority is about to be given.
- **Chapter abilities trigger on the TRANSITION to N** — already being at or above N doesn't re-trigger; it only triggers when lore counters cross the threshold.
- **Saga sacrifice is an SBA** — after the final chapter's ability leaves the stack, the SBA fires. It's a sacrifice, not destruction; indestructible doesn't prevent it.
- **Read Ahead lets you choose entry chapters** — you can skip earlier chapters entirely and begin at the final chapter for immediate access to powerful late effects.
- **Counter effects can accelerate Sagas** — proliferate advances a Saga; entering with high counters triggers multiple chapters simultaneously.
- **Saga sacrifice triggers "dies" effects** — going to GY from battlefield = "dies" per CR 700.4.

## Canonical Example
**Urza's Saga — The Artifact Land that Tutors:**
Urza's Saga is an Enchantment Land — Urza's Saga. Not a creature (despite later Sagas being creatures).
It has three chapter abilities:
  I: Add {C} to your mana pool.
  II: You may pay {C}. If you do, create a 0/0 colorless Construct artifact token with "+1/+1 for each artifact you control."
  III: Search your library for an artifact card with mana value 0 or 1, put it onto the battlefield.

Turn 1: cast spells normally. Say it's turn 2 and you play Urza's Saga as a land (your one land for the turn).
  It enters with 1 lore counter. Chapter I triggers: add {C}.
  Now it can tap for {C} (as a land). Also, it's a land — it enters tapped or untapped? Card text says nothing about entering tapped. It enters untapped.
  Wait: Urza's Saga taps for {C} as a land (mana ability); it also has the chapter I effect. Both are separate.

Turn 3 precombat main phase begins:
  Turn-based action: Urza's Saga gains 1 lore counter → now 2 counters.
  Chapter II triggers (count was 1, became 2, threshold ≥ 2). Goes on stack.
  Chapter II resolves: you may pay {C} → create a 0/0 Construct. With artifacts you control, it grows.

Turn 4 precombat main phase begins:
  Urza's Saga gains 1 lore counter → now 3 counters.
  Chapter III triggers (count was 2, became 3, threshold ≥ 3). Goes on stack.
  Chapter III resolves: search library for an artifact with MV 0 or 1. Put it onto the battlefield.
    Find: Mox Amber (MV 0), Aether Spellbomb (MV 1), Sensei's Divining Top (MV 1), etc.
  Chapter III has LEFT the stack. SBA check: 3 counters ≥ final chapter 3. No ability on stack.
  SBA fires: Urza's Saga is sacrificed. Goes to GY. It "dies" (enchantment-land to GY from battlefield).

Strategic note: Using Urza's Saga means you lose a land for 3+ turns until it's sacrificed. You trade land for a tutor + construct + mana. In artifact-heavy decks this is devastating.

**Example 2 — Proliferating Opponent's Saga:**
You're playing against an opponent with Phyrexian Scriptures on the battlefield at 1 lore counter.
Phyrexian Scriptures has:
  I: Put a +1/+1 counter on up to one target creature. That creature becomes an artifact in addition.
  II: Destroy all nonartifact creatures.
  III: Exile all cards from all graveyards.

It's opponent's turn 3 precombat main phase:
  Phyrexian Scriptures gains 1 counter → 2 counters. Chapter II triggers: "destroy all nonartifact creatures."
  This will destroy most of YOUR creatures. But you have a Proliferate ability on your artifact:
    Wait: Proliferate happens on YOUR turn. On opponent's turn, you use an INSTANT-speed proliferate.
    Actually, let's say you have Thrummingbird ({1}{U}: "Flying. Whenever this creature deals combat damage to a player, proliferate.") — that's your turn.
    OR: you have a Karn's Bastion activation: "{4}{T}: Proliferate." Activated ability → instant speed if cost allows.
    BUT you'd have to activate this on your turn, before Phyrexian Scriptures gets to Chapter II.

Alternative: you're on YOUR turn and opponent has Phyrexian Scriptures at 1 counter.
You proliferate: choose Phyrexian Scriptures. It gains a lore counter → 2 counters.
Chapter II triggers (on stack, your turn). You're the one who "put" the counter, but the trigger is on opponent's stack.
Wait: triggered abilities are controlled by the controller of the source permanent.
Phyrexian Scriptures's Chapter II trigger is controlled by the OPPONENT (who controls the Saga).
Opponent destroys all nonartifact creatures. This is bad for you if your creatures aren't artifacts!

But the upside: you also advanced them to Chapter III faster. If they were going to Chapter II anyway next turn, you've now accelerated them to lose their Saga sooner (Chapter III fires, then sacrifice).
This is a deliberate tactic: proliferate opponent's Saga to push it through its chapters faster, especially if the final chapter is less impactful than maintaining the Saga.

## Commonly Confused With
- **P342 (Turn Structure)** — Lore counters are gained as a turn-based action at the START of precombat main phase (before priority), not during upkeep. This is important for ordering: upkeep triggers fire in the upkeep step, Saga counters are gained at the start of main phase.
- **P002 (Replacement vs. Trigger)** — The lore counter placement is a turn-based action (not a trigger); the resulting chapter ability is a triggered ability. This matters for replacement effects: something that says "instead of putting lore counters" would be a replacement effect on the turn-based action; something that says "whenever a lore counter is put" would trigger in addition to it.
- **P005 (Simultaneous Events)** — If multiple lore counters are placed simultaneously (from an effect or entering with read ahead at high value), multiple chapter abilities can trigger at once, following APNAP ordering on the stack.
- **P339 (Dies Triggers)** — A Saga sacrifice triggers "dies" triggers because sacrifice = battlefield to GY. Blood Artist, Grave Pact, and other death triggers fire when a Saga is sacrificed by the SBA.
