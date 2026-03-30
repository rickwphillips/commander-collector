---
id: p508
name: Sagas — Lore Counter Acceleration via Proliferate, Doubling Season, and Counter Removal Replay
category: triggered
cr_refs: [702.67, 701.27, 614.1, 704.5s]
tags: [saga, lore-counter, chapter-ability, proliferate, doubling-season, counter-removal, urza-saga, atraxa, clockspinning, read-ahead, turn-based-action, sacrifice-sba, dominaria, brothers-war]
created: 2026-03-30
examples_count: 4
---

# P508 — Sagas — Lore Counter Acceleration via Proliferate, Doubling Season, and Counter Removal Replay

## Abstract
Sagas place lore counters through two turn-based actions: once when entering the battlefield, and once at the beginning of each of your precombat main phases. Both of these counter placements are **effects** for purposes of Doubling Season and similar replacement effects — so Doubling Season causes a Saga to enter with **two** lore counters and gain an additional two each turn, firing two chapter abilities simultaneously in each case. Proliferate (including Atraxa, Praetors' Voice's end-step trigger) advances Sagas by one chapter per proliferate event, and can be used offensively on opponents' Sagas to accelerate them toward sacrifice. Removing lore counters (via Clockspinning or similar) **resets** chapter trigger eligibility — a chapter will re-trigger the next time a counter brings the count back to or above that chapter's number. The sacrifice SBA fires as soon as the last chapter ability has left the stack while the Saga has max or more lore counters.

## The Definitive Rules

**CR 702.67a (Saga):** *"A Saga card has the subtype Saga and a number of chapter abilities. As a Saga enters the battlefield, its controller puts a lore counter on it. At the beginning of each of the Saga's controller's precombat main phases, that player puts a lore counter on each Saga they control."*

**CR 702.67b:** *"Each chapter ability triggers when the number of lore counters on the Saga becomes equal to or greater than the ability's chapter number. A chapter ability won't trigger if a lore counter is put on a Saga that already had a number of lore counters equal to or greater than the ability's chapter number."*

**CR 702.67c:** *"After a Saga's last chapter ability has left the stack and all of its abilities have been put on the stack at least once, that Saga's controller sacrifices it."* (SBA per CR 704.5s)

**CR 701.27a (Proliferate):** *"Choose any number of permanents and/or players, then give each another counter of each kind already there."*

**Doubling Season (Oracle):** *"If an effect would put one or more counters on a permanent you control, it puts twice that many of those counters on that permanent instead."*

**Official ruling (History of Benalia, 2018-04-27):** *"If counters are removed from a Saga, the appropriate chapter abilities will trigger again when the Saga receives lore counters. Removing lore counters won't cause a previous chapter ability to trigger."*

**Official ruling (History of Benalia, 2018-04-27):** *"If multiple chapter abilities trigger at the same time, their controller puts them on the stack in any order. If any of them require targets, those targets are chosen as you put the abilities on the stack, before any of those abilities resolve."*

## The Pattern

```
NORMAL SAGA PROGRESSION:

  Turn 1 (enter): +1 lore counter → triggers Chapter I
  Turn 2 (main phase start): +1 lore counter → triggers Chapter II
  Turn 3 (main phase start): +1 lore counter → triggers Chapter III
    After Chapter III leaves stack → SBA: sacrifice Saga

DOUBLING SEASON ACTIVE (your Saga):

  Doubling Season is a REPLACEMENT EFFECT watching counter placement events.
  Lore counter placements (ETB and main phase turn-based actions) are effects
    → Doubling Season doubles them.

  Turn 1 (enter): +2 lore counters (Doubling Season doubles 1→2)
    → Triggers Chapter I AND Chapter II simultaneously
    → Both go on stack; controller orders them; both resolve
  Turn 2 (main phase start): +2 lore counters (total: 4)
    → Count was 2, new count ≥ 3 (Chapter III trigger): Chapter III fires
    → Count ≥ 4: if there were a Chapter IV, it fires; most sagas have no IV
    → For a 3-chapter saga: Chapter III fires, then SBA sacrifice applies

  NET WITH DOUBLING SEASON:
    Standard 3-chapter Saga completes in 2 turns instead of 3.
    Chapters I and II fire turn 1; Chapter III fires turn 2.

DOUBLING SEASON ACTIVE (special: Urza's Saga):

  Urza's Saga is an Enchantment Land — Urza's Saga (a land, not a spell).
  It can only be played as a land (once per turn, sorcery speed).
  Normal progression: Turn 1 → I (mana tap ability), Turn 2 → II (Construct token),
    Turn 3 → III (search for 0-1 mana artifact), then sacrifice.

  With Doubling Season:
  Turn 1 (played): +2 counters → Chapter I AND II trigger simultaneously
    → Gains "{T}: Add {C}" AND gains "{2}, {T}: Create Construct token"
    Both abilities are gained immediately. Both triggers resolve.
  Turn 2 (main phase): +2 more counters (total: 4)
    → Chapter III triggers (count went from 2 to 4, ≥ 3 for first time since start = no,
       actually 2 → 4 means it passes 3: Chapter III fires once regardless of reaching 4)
    → Sacrifice SBA fires after Chapter III leaves the stack

  NET: Urza's Saga completes in 2 turns. Gains mana-tap AND Construct activation turn 1.
  The Chapter III search fires turn 2.

PROLIFERATE AND SAGAS:

  Proliferate chooses permanents with counters → a Saga with lore counters qualifies.
  Proliferating gives +1 lore counter per proliferate action.

  Use cases:
    (1) ACCELERATE YOUR OWN SAGA: Skip ahead when earlier chapters are unwanted.
        Saga at Chapter I (1 counter) + proliferate = 2 counters → Chapter II triggers now.
        Can skip to Chapter III entirely by proliferating twice before your main phase.

    (2) ACCELERATE OPPONENT'S SAGA (OFFENSIVE): Opponents' Sagas can be proliferated too.
        An opponent's Urza's Saga at Chapter II + proliferate = Chapter III fires immediately,
          then SBA sacrifice.
        This denies them mana-tap and Construct-creating turns and forces early sacrifice.

    (3) ATRAXA SYNERGY: Atraxa's "at the beginning of your end step, proliferate" advances
        every Saga (yours and opponents') by one chapter per turn cycle.

    (4) CONTAGION ENGINE: {4}{T}: Proliferate TWICE → Saga gains 2 lore counters in one activation.
        Can fire two chapter abilities in a single turn.

  PROLIFERATE DOES NOT TRIGGER ALREADY-PASSED CHAPTERS:
    CR 702.67b: Chapter ability doesn't trigger if the Saga already had ≥ that number of counters.
    Saga at 3 lore counters (Chapter III done) + proliferate → 4 counters.
    No chapter triggers fire (all chapters already triggered at ≥3 before this).
    The SBA sacrifice would fire if last chapter has left the stack.

COUNTER REMOVAL — CHAPTER REPLAY:

  Clockspinning ({U}: remove or add one counter on target permanent/suspended card):

  Removing a lore counter from a Saga is LEGAL.
  If a Saga was at 3 lore counters and you remove one: now at 2.
    The SBA sacrifice has NOT fired yet if Chapter III is still on the stack or pending.
    When a counter is later added (turn-based action or proliferate): count goes 2→3.
    Chapter III RE-TRIGGERS (count just became ≥ 3 again for the first time since removal).

  IMPORTANT: "Removing lore counters won't cause a previous chapter ability to trigger."
    The act of removing is not a trigger event.
    Only adding a counter that crosses the threshold again causes re-trigger.

  LOOPING EARLY CHAPTERS:
    With Buyback Clockspinning ({U} + {3} buyback):
    Saga at 2 counters (Chapter I and II triggered):
    → Remove counter → now 1 counter
    → Add counter (turn-based action next main phase, or proliferate) → 2 counters
    → Chapter II re-triggers
    This can be repeated to loop Chapter II.
    Chapter I re-trigger requires dropping to 0 and getting back to 1.
    (Note: Sagas are not "destroyed" by going to 0 counters — SBA only fires at max+.)

READ AHEAD + DOUBLING SEASON:

  Read Ahead (Dominaria United mechanic): "As this Saga enters the battlefield,
    choose a chapter number. Add that many lore counters instead of one."

  If you choose Chapter II (2 counters) with Doubling Season active:
    Doubling Season doubles: 4 counters enter instead of 2.
    A 3-chapter saga now has 4 counters → chapters II and III both triggered (I already
      triggered from count being ≥1 along the way... actually: the counters are placed
      as a group: you go from 0 to 4. Chapters I, II, III all trigger simultaneously
      (each chapter whose number is ≤ 4 and ≤ new total triggers).
    All three chapters trigger at once. Saga is then sacrificed after Chapter III resolves.

  If you choose Chapter III (3 counters) normally with Read Ahead:
    All three chapters trigger simultaneously (count 0→3 passes all thresholds).
    Saga is immediately done. Useful for Urza's Saga: choose III → immediate artifact search.

  With Doubling Season + Read Ahead Chapter III: 6 counters enter.
    Chapters I, II, III all trigger. Saga sacrifices after III resolves.
    (No additional benefit over no Doubling Season for a 3-chapter saga; same triggers.)

SACRIFICE TIMING (SBA CR 704.5s):

  The SBA fires when:
    (a) The Saga's controller controls the Saga.
    (b) The Saga has a number of lore counters ≥ its greatest chapter number.
    (c) No chapter abilities are on the stack.

  "After a Saga's last chapter ability has left the stack" — you CAN respond before sacrifice.
  If Chapter III is on the stack, the SBA has not fired yet.
  → You can blink the Saga in response to Chapter III (before SBA fires), resetting it.
  → Blinking removes all lore counters (zone change) → new object, starts fresh.

  URZA'S SAGA + BLINK:
    Urza's Saga is a land. Most blink effects target "permanent" not "land" specifically.
    Effects like Ephemerate (target creature) CANNOT blink Urza's Saga.
    Effects targeting "permanent" (Conjurer's Closet can't blink lands either — it says "creature").
    Urza's Saga cannot typically be blinked by conventional blink spells.
```

## Definitive Conclusions

- **Doubling Season fires chapters I and II simultaneously on entry** — a Saga enters with 2 lore counters under Doubling Season, triggering both; a 3-chapter saga completes in 2 turns instead of 3.
- **Proliferate advances Sagas offensively or defensively** — you can proliferate opponents' Sagas to force them into sacrifice; Atraxa does this every end step against everyone.
- **Removing lore counters enables chapter replay** — if a Saga drops below a chapter's threshold and is re-incremented past it, that chapter triggers again; the removal itself triggers nothing.
- **Chapter abilities don't re-trigger while already at or above their number** — proliferating a Saga that has already passed all chapters does nothing except potentially accelerate the sacrifice.
- **Read Ahead + Doubling Season overshoots the chosen chapter** — choosing Chapter II on a 3-chapter Saga with Doubling Season in play puts 4 counters, triggering all three chapters.
- **Sacrifice SBA fires only after all chapter abilities leave the stack** — there is a window to blink the Saga, but most blink effects require a creature target, and Urza's Saga (a land) cannot be conventionally blinked.

## Canonical Example

**Doubling Season + History of Benalia:**

You control Doubling Season ({4}{G}: enchantment) and cast History of Benalia ({1}{W}{W}: Saga). It enters:

Normally, 1 lore counter is placed. Doubling Season replaces this: 2 lore counters are placed instead.

Chapter I triggers (count ≥ 1): create a 2/2 white Knight token.
Chapter II triggers (count ≥ 2): create another 2/2 white Knight token.

Both triggers go on the stack. You order them; both resolve. Two Knight tokens enter this turn.

Next turn (precombat main phase): normally +1 lore counter. Doubling Season doubles: +2 lore counters. Total: 4.

Chapter III triggers (count just became ≥ 3): Knights you control get +2/+1 until end of turn.

After Chapter III resolves and leaves the stack: SBA fires. You sacrifice History of Benalia.

Result: You got 2 Knights on turn 1 and the Knight pump on turn 2.

**Example 2 — Atraxa Advancing Urza's Saga:**

You control Atraxa, Praetors' Voice ({G}{W}{U}{B}: 4/4 Flying/Vigilance/Deathtouch/Lifelink). An opponent plays Urza's Saga (Enchantment Land — at Chapter I after entering).

At the beginning of YOUR end step, Atraxa's proliferate trigger fires. You choose Urza's Saga as one of the permanents.

Urza's Saga moves from 1 to 2 lore counters. Chapter II triggers: Saga gains "{2}, {T}: Create a Construct token."

On your opponent's next turn, their precombat main phase triggers: +1 lore counter → 3 total. Chapter III: search for 0-1 mana artifact. Then SBA: sacrifice.

Result: Atraxa shaved an entire chapter off Urza's Saga, denying the opponent one turn of Construct activation.

**Example 3 — Clockspinning Chapter II Loop:**

You control a 3-chapter Saga currently at 2 lore counters (Chapters I and II have resolved). You control Clockspinning with buyback.

You activate Clockspinning ({U} + {3} buyback): remove a lore counter from your Saga. It drops to 1.
Clockspinning returns to your hand.

At your precombat main phase next turn: +1 lore counter → 2 counters. Chapter II re-triggers (count just became ≥ 2 again for the first time since you removed a counter).

You can continue this loop each turn, re-triggering Chapter II while spending {4} per cycle. (Chapter III never fires as long as you reset before 3.)

**Example 4 — Proliferate Opponent's Saga to Force Sacrifice:**

Opponent controls Urza's Saga at 2 lore counters (Chapter II just triggered this turn, Construct ability gained). They're planning to use the Construct factory next turn.

You cast Contentious Plan ({1}{U}): proliferate. You choose Urza's Saga. It gains a lore counter → 3 total.

Chapter III triggers (count just became ≥ 3): opponent searches for a 0-1 mana artifact.
After Chapter III resolves: SBA fires. Opponent must sacrifice Urza's Saga.

They lose the Construct-creation tap ability. The Saga is gone one full turn earlier than expected.

## Commonly Confused With
- **P205 (Saga basics)** — P205 covers how Sagas normally work. P508 covers cross-mechanic acceleration, doubling, and chapter replay via counter manipulation.
- **P181 (Read Ahead)** — P181 covers choosing starting chapters. P508 covers what happens when Doubling Season doubles those initial Read Ahead counters.
- **P216 (Proliferate)** — P216 covers proliferate in general. P508 shows the specific Saga interaction: lore counters can be proliferated, chapters re-trigger when thresholds are re-crossed, and the offensive use to accelerate opponents' Sagas toward sacrifice.
- **P025 (Counter Placement Cost vs. Effect)** — P025 covers Doubling Season not doubling loyalty counters added as costs. For Sagas, there's no cost-based lore counter placement; all lore counter placements are effects (turn-based or ability effects), so Doubling Season always doubles them.
