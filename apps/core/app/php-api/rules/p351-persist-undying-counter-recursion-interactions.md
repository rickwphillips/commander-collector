---
id: p351
name: Persist, Undying, and Counter-Based Recursion — +1/+1 and -1/-1 Counter Interactions
category: triggered
cr_refs: [702.79a, 702.93a, 122.1a, 120.3d, 400.7, 603.6, 704.5q]
tags: [persist, undying, counter-removal, recursion, minus-counter, plus-counter, counter-interaction, Mikaeus-the-Unhallowed, Kitchen-Finks, Murderous-Redcap, Glen-Elendra-Archmage, infinite-combo, counter-cancel, Solemnity, Melira, persist-undying-abuse]
created: 2026-03-29
examples_count: 2
---

# P351 — Persist, Undying, and Counter-Based Recursion — Interactions Between +1/+1 and -1/-1 Counters

## Abstract
**Persist** (702.79a): when a permanent dies, if it had NO -1/-1 counters, it returns to the battlefield with a -1/-1 counter. **Undying** (702.93a): when a permanent dies, if it had NO +1/+1 counters, it returns with a +1/+1 counter. A crucial rule: **+1/+1 and -1/-1 counters on the same permanent cancel each other out** as a state-based action (704.5q). This cancellation creates powerful infinite loops: if you can REMOVE the -1/-1 counter added by persist (or the +1/+1 counter from undying) before the creature dies again, it will trigger persist/undying again on the next death. The most famous infinite combo uses Melira (removes -1/-1 counters from persist creatures) or Mikaeus the Unhallowed (gives undying to non-humans, removing their +1/+1 counter after sacrifice).

## The Definitive Rules

**CR 702.79a** (verbatim): *"Persist is a triggered ability. 'Persist' means 'When this permanent is put into a graveyard from the battlefield, if it had no -1/-1 counters on it, return it to the battlefield under its owner's control with a -1/-1 counter on it.'"*

**CR 702.93a** (verbatim): *"Undying is a triggered ability. 'Undying' means 'When this permanent is put into a graveyard from the battlefield, if it had no +1/+1 counters on it, return it to the battlefield under its owner's control with a +1/+1 counter on it.'"*

**CR 704.5q** (verbatim): *"If a permanent has both a +1/+1 counter and a -1/-1 counter on it, N +1/+1 counters and N -1/-1 counters are removed from it, where N is the smaller of the number of +1/+1 and -1/-1 counters on it. This is a state-based action."*

## The Pattern

```
PERSIST (CR 702.79a):
  Trigger condition: permanent put into GY from battlefield.
  Requirement for trigger: it had NO -1/-1 counters when it left.
  Effect: returns to battlefield under owner's control WITH a -1/-1 counter.
  FIRST DEATH:
    Kitchen Finks ({1}{G/W}{G/W}): 3/2. No -1/-1 counters. Dies.
    Persist checks: had no -1/-1 counters? YES → persist triggers.
    Returns with one -1/-1 counter. Now 2/1 (3-1=2, 2-1=1).
  SECOND DEATH:
    Kitchen Finks (now 2/1 with -1/-1 counter). Dies again.
    Persist checks: had -1/-1 counters? YES (it has one). → persist does NOT trigger.
    Goes to GY and stays there.
  REMOVING THE -1/-1 COUNTER:
    If you remove the -1/-1 counter BEFORE it dies again: persist triggers again on death.
    Infinite recursion if you have a reliable counter-removal engine.

UNDYING (CR 702.93a):
  Trigger condition: permanent put into GY from battlefield.
  Requirement: had NO +1/+1 counters when it left.
  Effect: returns with +1/+1 counter.
  Same structure as persist, but for +1/+1 counters.
  Example: Young Wolf ({G}): 1/1 undying. Dies → returns with +1/+1 counter → 2/2.
  Second death: had +1/+1 counter → undying doesn't trigger.

COUNTER CANCELLATION SBA (CR 704.5q):
  If a permanent has BOTH +1/+1 and -1/-1 counters:
    Remove N of each, where N = the smaller count.
    Example: 3 +1/+1 + 2 -1/-1 counters → remove 2 of each → net 1 +1/+1 counter.
    Example: 1 +1/+1 + 1 -1/-1 counter → remove 1 of each → 0 net counters.
  TIMING:
    This is a state-based action. Happens before priority is given (704, rule 117.5).
    So as soon as a permanent has both counter types: they cancel immediately.
    BEFORE any player can do anything: the SBA fires.

PERSIST + UNDYING INTERACTION:
  What if a creature has both persist AND undying?
    Example: Glen-Elendra Archmage ({3}{U}): 2/2 persist. Dies.
    Murderous Redcap ({2}{B/R}{B/R}): 2/2 persist. Dies.

  Now what if a creature has NEITHER but you give it persist AND undying?
  Or: a creature with undying gets persist added?
  When it dies: BOTH triggers try to fire.
  Trigger check for persist: "had no -1/-1 counters?" Yes (no -1/-1). Persist triggers.
  Trigger check for undying: "had no +1/+1 counters?" Yes (no +1/+1). Undying triggers.
  BOTH go on the stack.
  The LAST to resolve fires:
    Suppose undying resolves first: creature returns to battlefield with +1/+1 counter.
    Now persist trigger: "return this creature to battlefield." But it's already on the battlefield.
      The persist trigger tries to find the creature in the GY. It's not there (it came back via undying).
      The trigger fizzles. Creature stays on battlefield with +1/+1 counter.
    Result: undying "wins" if it resolves first (creature returns, persist can't find it in GY).

    If persist resolves first: creature returns with -1/-1 counter.
    Undying trigger: also tries to return it. It's no longer in GY.
    Result: persist "wins," creature returns with -1/-1 counter.

  The active player (or owner of triggers) controls ordering in APNAP.
  Both triggers are on the same creature, controlled by the same player.
  They choose which resolves first (603.3b: controller of triggers orders them).
  CHOOSE UNDYING FIRST:
    Creature returns with +1/+1 counter.
    Persist trigger fizzles.
    Creature is on battlefield with +1/+1 counter.
    Note: it now has a +1/+1 counter, so UNDYING is spent (needs no +1/+1 to trigger next death).
    But PERSIST: still needs no -1/-1 counter. Still has none (after SBA, if no -1/-1 counter added).
    Wait: +1/+1 counter doesn't affect persist's condition (-1/-1 check).
    So: creature has undying spent but persist still available! Next death: persist triggers.

CLASSIC INFINITE COMBO — MELIRA + PERSIST:
  Melira, Sylvok Outcast ({1}{G}): "You can't get poison counters. Creatures you control can't have -1/-1 counters put on them."
  With Melira on battlefield:
    Persist creature dies → persist triggers → tries to return with -1/-1 counter.
    But Melira prevents -1/-1 counters from being PUT onto your creatures.
    The replacement effect applies as the creature enters: it enters WITHOUT the -1/-1 counter.
    The creature is back on the battlefield with NO counters.
    Next time it dies: persist checks "had no -1/-1 counters?" YES → triggers again.
    INFINITE PERSIST LOOP.
  ENGINE:
    Murderous Redcap ({2}{B/R}{B/R}) + persist: "When Murderous Redcap enters, it deals damage equal to its power to any target."
    Redcap ETB deals 2 damage. Under Melira: persists infinitely.
    With a free sac outlet (Viscera Seer, Altar of Dementia): sac Redcap → ETB deals 2 damage → sac again.
    Each loop: 2 damage. Infinite damage. Win.
  MELIRA INTERACTION:
    Technically: the -1/-1 counter can't be placed, so the creature enters without one.
    This isn't a "remove the counter" effect — the counter is NEVER placed. Persist still triggers.
    Why? Persist's trigger condition is "had no -1/-1 counters when it LEFT." It had none when it died.
    And the entering-with-counter is a separate replacement — the trigger already fired based on the death condition.

MIKAEUS, THE UNHALLOWED + SACRIFICE ENGINE:
  Mikaeus, the Unhallowed ({3}{B}{B}{B}): "Non-Human creatures get +1/+1 and undying."
  All your non-human creatures gain undying.

  Triskelion ({6}) or Walking Ballista: enters and can remove its own +1/+1 counters for damage.
  Triskelion enters (normally: 3 +1/+1 counters in older versions, but Ballista-based works similarly).
  Actually: use Walking Ballista ({X}{X}): enters with X +1/+1 counters. Spend them for damage.
    Under Mikaeus: Ballista enters with +1/+1 counters (from X) PLUS undying (net: Ballista has counters).
  The classic version uses Triskelion:
    Triskelion enters → has undying from Mikaeus → has +1/+1 counter (from undying? No: enters fresh first time).
    Actually: Mikaeus gives +1/+1 as a static ability. Triskelion enters and gets +1/+1 from Mikaeus static effect.
    Triskelion uses its counters for damage. Spends all 3 (from Mikaeus if 3-counter Triskelion base + 1 from Mikaeus = 4 counters).
    Wait: let me simplify.

  SIMPLE VERSION:
    Walking Ballista enters with 1 counter (X=1, cost {2}).
    Under Mikaeus: gains +1/+1 (static). Now has 2 +1/+1 counters.
    Activate Ballista: remove +1/+1 counter → deal 1 damage to opponent.
    Activate again: remove another counter → deal 1 damage. Ballista at 0/0 → dies (SBA 704.5f).
    But wait: before dying, had it spent all its counters? SBA fires IMMEDIATELY when toughness ≤ 0.
    Ballista (0/0 now) → SBA fires, goes to GY.
    Undying checks: had no +1/+1 counters? YES (it spent them all). → Undying triggers!
    Ballista returns with +1/+1 counter. Plus Mikaeus gives another +1/+1 = 2 total.
    Repeat infinitely: each loop = 2 damage (spend both counters one at a time).
    Infinite damage = win.
```

## Definitive Conclusions

- **Persist returns a creature ONLY if it had no -1/-1 counters when it died** — the second death (with -1/-1 counter from persist) doesn't trigger persist again.
- **+1/+1 and -1/-1 counters cancel each other out as an SBA** — this happens before priority; a creature with both types of counters immediately loses N of each.
- **Melira + persist = infinite loop** — because Melira prevents -1/-1 counters from being placed, persist creatures return without counters and can persist again indefinitely.
- **Both persist AND undying can trigger simultaneously** — the controller chooses which resolves first; the second trigger fizzles as the creature is no longer in the GY.
- **Undying/persist check is about counters at time of death** — not current counters; what mattered was the counter state when the creature left the battlefield.

## Canonical Example
**Kitchen Finks Abuse with Sac Outlet:**
You control:
  Kitchen Finks ({1}{G/W}{G/W}): 3/2 creature with persist, lifelink, and "when this enters, you gain 2 life."
  Viscera Seer ({B}): 1/1 creature with "Sacrifice a creature: scry 1."
  Melira, Sylvok Outcast ({1}{G}): 2/2 "creatures you control can't have -1/-1 counters."

Turn of play:
  Sacrifice Kitchen Finks to Viscera Seer. Scry 1.
  Finks dies → persist triggers ("had no -1/-1 counters when it died? YES").
  Persist effect tries to return Finks with -1/-1 counter.
  Melira replacement: "creatures you control can't have -1/-1 counters put on them."
  Kitchen Finks enters without the -1/-1 counter.
  Kitchen Finks ETB triggers: "you gain 2 life."
  Repeat: sac Finks → scry 1 → return → gain 2 life. Infinite scry. Infinite life gain.

  To win: need a third piece.
  Option A: Aristocrat (Blood Artist, Zulaport Cutthroat): "whenever a creature dies, target player loses 1 life."
    Each sac of Finks: Blood Artist triggers → opponent loses 1 life. Infinite loops → infinite damage.
  Option B: Altar of Dementia + infinite sacs → mill opponent's entire library → opponent can't draw → win on their draw step.

**Example 2 — Persist vs. Undying Both Triggered:**
You control a creature with BOTH persist and undying (via Mikaeus giving undying and the creature having persist):
Example: Puppeteer Clique ({3}{B}{B}): 3/2 with persist. Mikaeus in play gives it undying too.

Puppeteer Clique dies (no +1/+1 or -1/-1 counters on it).
BOTH triggers check:
  Persist: "had no -1/-1 counters? Yes." Triggers.
  Undying: "had no +1/+1 counters? Yes." Triggers.
Both go on the stack. You control both triggers. Choose order:
  CHOICE: put undying on top (resolves first), persist below (resolves second).

  Undying resolves: Clique returns to battlefield with +1/+1 counter.
  Persist trigger: tries to find Clique in GY. Clique is no longer in GY (it returned via undying).
  Persist fizzles.
  Clique is on battlefield with +1/+1 counter.

  Next death:
    Undying checks: "had no +1/+1 counters?" NO (it has a +1/+1 counter). Undying does NOT trigger.
    Persist checks: "had no -1/-1 counters?" YES. Persist DOES trigger.
    Persist returns it with -1/-1 counter.
    +1/+1 and -1/-1 counters cancel (SBA 704.5q): 0 net counters.
    Clique is on battlefield with NO counters.

  Third death:
    Undying: no +1/+1 counters. Triggers!
    Persist: no -1/-1 counters. Triggers!
    Both trigger again. Choose undying first...
    Infinite recursion: you can bounce the creature between both keywords forever (with a sac outlet).

## Commonly Confused With
- **P339 (Dies Triggers)** — Persist and undying are both "when this is put into a graveyard from the battlefield" triggers — they fire on the "dies" event. LKI applies: the counter state is checked as it LEFT (died), not after it arrives in the GY.
- **P347 (Infect/Wither)** — Infect and wither place -1/-1 counters on creatures. A creature with persist that accumulates -1/-1 counters from wither damage won't trigger persist on its next death (it has -1/-1 counters). Combined with counter-cancellation: a creature with both +1/+1 (from undying) and -1/-1 (from wither) = net 0 counters, re-enabling both persist and undying.
- **P002 (Replacement vs. Trigger)** — Melira's effect is a replacement effect (prevents counters from being placed). Persist is a triggered ability. The trigger fires based on the death condition; Melira's replacement modifies how the creature enters when persist resolves. The interplay between trigger (persist) and replacement (Melira) is crucial for the infinite loop.
- **P011 (ETB Triggers)** — Persist creatures that have ETB triggers (like Kitchen Finks's "gain 2 life") fire their ETB triggers each time they return from persist/undying. This is how the infinite loop creates infinite life gain or damage — each return fires the ETB.
