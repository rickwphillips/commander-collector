---
id: p038
name: Persist/Undying — Counter Check and Infinite Loop Conditions
category: triggered
cr_refs: [702.79a, 702.93a, 704.5q, 704.5g]
tags: [persist, undying, counter-check, -1/-1, +1/+1, melira, mikaeus, sacrifice, infinite-loop, zone-change]
created: 2026-03-28
examples_count: 3
---

# P038 — Persist/Undying — Counter Check and Infinite Loop Conditions

## Abstract
Persist and undying are triggered abilities that return a permanent from the graveyard to the battlefield — persist returns creatures with no -1/-1 counters (adding one on return); undying returns creatures with no +1/+1 counters (adding one on return). The counter check happens at the time the permanent is put into the graveyard. The +1/+1 and -1/-1 counter cancellation SBA (704.5q) can reset persist/undying by removing the tracking counter, enabling infinite loops when combined with effects that exploit this reset.

## The Definitive Rule

**CR 702.79a** (verbatim): *"Persist means 'When this permanent is put into a graveyard from the battlefield, if it had no -1/-1 counters on it, return it to the battlefield under its owner's control with a -1/-1 counter on it.'"*

**CR 702.93a** (verbatim): *"Undying means 'When this permanent is put into a graveyard from the battlefield, if it had no +1/+1 counters on it, return it to the battlefield under its owner's control with a +1/+1 counter on it.'"*

**CR 704.5q**: If a permanent has both +1/+1 counters and -1/-1 counters, remove N of each where N = the lesser count (SBA).

## The Pattern

```
PERSIST TRIGGER CONDITION:
  "if it had no -1/-1 counters on it" — checked using LAST KNOWN INFO
  (how many -1/-1 counters did it have immediately before leaving the battlefield)
  If it had 0 -1/-1 counters → trigger fires → returns with 1 -1/-1 counter
  If it had 1+ -1/-1 counters → trigger does NOT fire → stays in graveyard

UNDYING TRIGGER CONDITION:
  "if it had no +1/+1 counters on it" — same logic
  If it had 0 +1/+1 counters → trigger fires → returns with 1 +1/+1 counter
  If it had 1+ +1/+1 counters → does NOT fire → stays in graveyard

ONE TIME (NORMALLY):
  Persist creature returns with -1/-1 counter → dies again → has 1 -1/-1 counter
    → persist condition fails → stays in graveyard
  Undying creature returns with +1/+1 counter → dies again → has 1 +1/+1 counter
    → undying condition fails → stays in graveyard

COUNTER RESET ENABLING LOOPS:
  If something removes the -1/-1 counter BEFORE the creature dies again,
  persist can trigger again.

  Method 1: +1/+1 counter addition (704.5q cancellation)
    Persist creature returns with 1 -1/-1 counter
    Give it a +1/+1 counter (Gavony Township, Hardened Scales trigger, etc.)
    SBA: 1 +1/+1 + 1 -1/-1 → remove 1 of each → 0 of each
    Creature now has no -1/-1 counters
    If it dies again → persist fires again → infinite loop with sacrifice outlet

  Method 2: Melira, Sylvok Outcast
    "Creatures you control can't have -1/-1 counters placed on them"
    When a persist creature returns, the -1/-1 counter CAN'T be placed on it
    (replacement effect: "would have -1/-1 counter placed on it" → that doesn't happen)
    Creature enters with NO -1/-1 counters
    If it dies → persist fires → returns with (blocked) -1/-1 counter = 0 counters
    → Infinite loop available with any sac outlet

  Method 3: Mikaeus, the Unhallowed
    "Nonhuman creatures you control get +1/+1 and have undying"
    Undying + sacrifice → returns with +1/+1 counter → sacrifice outlet → returns again?
    No: second death has 1 +1/+1 counter → undying fails
    UNLESS: something removes the +1/+1 counter first (P004 layer interaction)

PERSIST + UNDYING ON SAME CREATURE:
  A creature with both persist and undying dies with 0 of each counter type
  BOTH triggers fire simultaneously
  APNAP player chooses order to put on stack
  One resolves first: creature returns with the counter (say +1/+1 from undying)
  Second trigger resolves: creature is on battlefield, not in graveyard
    → "return it to the battlefield" — creature is already on the battlefield
    → Second trigger fizzles (can't return a creature that's not in the graveyard)
  Net result: one of persist/undying triggers resolves; the other fizzles
  Which fires is determined by APNAP ordering (controller chooses which goes on stack first/last)

LAST KNOWN INFO PRINCIPLE:
  Counter check uses what was true BEFORE the creature left the battlefield
  If counter was removed AS PART OF the dying effect, it still counts as having had it
  Example: creature dies with 1 -1/-1 counter, persist doesn't fire
    Even if the counter would've been removed by a replacement effect, persist
    checks the last known info of the creature immediately before it left
```

## Definitive Conclusions

- **Persist and undying check the counter state at the moment the creature left the battlefield** (last known info).
- **Counter cancellation SBA (704.5q) can reset persist/undying**, enabling infinite loops.
- **Melira + persist + sac outlet = infinite triggers**, because Melira prevents the -1/-1 counter from being placed, so persist always fires.
- **Persist and undying on the same creature = only one returns the creature.** Both trigger simultaneously; APNAP order determines which goes on stack first (resolves last). The second trigger fizzles because the creature is no longer in the graveyard.
- **Persist/undying don't fire for zone changes other than battlefield → graveyard.** They specifically say "put into a graveyard FROM THE BATTLEFIELD."

## Canonical Example
**Melira + Kitchen Finks + Viscera Seer = infinite life:**
Kitchen Finks has persist and "when this enters, gain 2 life." Melira makes your creatures unable to have -1/-1 counters. Sacrifice Finks to Viscera Seer (scry 1). Finks dies, persist triggers: returns with (blocked) -1/-1 counter = enters with 0 counters. ETB: gain 2 life. Sacrifice again. Infinite life, infinite scrys. Combo is: Melira + persist creature + sac outlet.

**Example 2 — Counter cancellation reset (Mikaeus + Triskelion):**
Triskelion (modular artifact creature) has undying from Mikaeus. Enters with +1/+1 counter from Mikaeus's static + however many from Triskelion's own entry. Remove all counters by shooting something. Sacrifice Triskelion. Undying: returns with +1/+1 counter (from undying, was at 0). Remove that counter for 1 damage. Sacrifice. Undying fires again? No — Triskelion has 1 +1/+1 counter when it dies (it was just given one by undying return) → undying checks: had +1/+1 counter → fails.
CORRECTION: The standard Mikaeus+Triskelion combo works differently: remove ALL but 1 counter, deal 1 damage to opponent, then sacrifice. Triskelion dies with 0 +1/+1 counters → undying fires → returns with 1 counter → repeat. The key is removing all counters before sacrificing.

**Example 3 — Both persist and undying:**
Creature has both persist and undying (through effects). It dies with 0 of each counter. Both triggers go on stack. Active player puts persist on stack first (resolves last), undying resolves first: creature returns with +1/+1 counter. Then persist trigger resolves: creature is on battlefield (not in graveyard) → fizzles. Creature ends up with +1/+1 counter. (Active player can choose the opposite ordering to return with -1/-1 counter instead, or choose undying first if they want +1/+1 vs persist returning with -1/-1.)

## Commonly Confused With
- **P009 (Zone-Change Trigger Race)** — P009 covers multiple triggers firing on the same zone change (persist vs. replacement effects racing). P038 covers the persist/undying mechanics themselves, including the infinite loop conditions.
- **P025 (Counter Placement — Cost vs. Effect)** — The counter placed by persist/undying is placed as an effect when the trigger resolves. Doubling Season could double persist's -1/-1 counter (two -1/-1 counters placed), making the creature die immediately after returning if toughness ≤ 2. (Note: Doubling Season typically only doubles counters placed on your permanents.)
