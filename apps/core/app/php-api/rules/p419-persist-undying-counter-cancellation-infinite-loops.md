---
id: p419
name: Persist/Undying Counter Cancellation — How +1/+1 and -1/-1 Counters Enable Infinite Recursion
category: triggered
cr_refs: [122.3, 702.79a, 702.88a, 702.58a, 704.5q]
tags: [persist, undying, counter-cancellation, infinite-loop, Melira, Vizier-of-Remedies, graft-persist-combo, +1/+1-cancels-minus1, Kitchen-Finks, Viscera-Seer, Mikaeus-the-Unhallowed, Woodfall-Primus, counter-removal, state-based-actions, persist-loop, undying-loop, Devoted-Druid, sacrifice-outlet]
created: 2026-03-29
examples_count: 2
---

# P419 — Persist/Undying Counter Cancellation — How +1/+1 and -1/-1 Counters Enable Infinite Recursion

## Abstract
Persist creatures return from the graveyard with a -1/-1 counter; undying creatures return with a +1/+1 counter. Normally, each can only trigger once (the counter prevents the next return). However, **CR 122.3** states that a permanent with both a +1/+1 counter and a -1/-1 counter has them removed as state-based actions. This means: if a +1/+1 counter is added to a persist creature that returned (removing the -1/-1 counter via SBA), the creature no longer has a -1/-1 counter and persist can trigger again on its next death. This is the engine behind multiple infinite combo loops in competitive Magic: **Melira, Sylvok Outcast** prevents -1/-1 counters from being placed (persist creatures return with no counter), while **Graft** can move +1/+1 counters to newly-returned persist creatures to cancel the -1/-1 counter. Combined with a sacrifice outlet, these enable **infinite persist loops** — and with Kitchen Finks, infinite life gain.

## The Definitive Rules

**CR 122.3** (verbatim): *"If a permanent has both a +1/+1 counter and a -1/-1 counter on it, N +1/+1 and N -1/-1 counters are removed from it as a state-based action, where N is the smaller of the number of +1/+1 and -1/-1 counters on it. See rule 704."*

**CR 702.79a** (verbatim): *"Persist is a triggered ability. 'Persist' means 'When this permanent is put into a graveyard from the battlefield, if it had no -1/-1 counters on it, return it to the battlefield under its owner's control with a -1/-1 counter on it.'"*

**CR 702.88a** (verbatim): *"Undying is a triggered ability. 'Undying' means 'When this permanent is put into a graveyard from the battlefield, if it had no +1/+1 counters on it, return it to the battlefield under its owner's control with a +1/+1 counter on it.'"*

**CR 702.58a** (verbatim): *"Graft represents both a static ability and a triggered ability. 'Graft N' means 'This permanent enters with N +1/+1 counters on it' and 'Whenever another creature enters, if this permanent has a +1/+1 counter on it, you may move a +1/+1 counter from this permanent onto that creature.'"*

## The Pattern

```
THE COUNTER CANCELLATION MECHANIC (122.3):
  "If a permanent has both a +1/+1 counter and a -1/-1 counter on it, N +1/+1 and N -1/-1
    counters are removed from it as a state-based action."
  This is an automatic, continuous SBA — no player action required.
  As soon as a permanent has both types of counters, the SBA fires and removes equal numbers.

PERSIST BASELINE (no combo):
  Kitchen Finks ({1}{G/W}{G/W}: 3/2; persist; "when it enters, gain 2 life") dies.
  Persist trigger fires: return it to battlefield WITH -1/-1 counter.
  Kitchen Finks re-enters: 3/2 - 1/-1 = 2/1. Gain 3 life (ETB trigger).
  If it dies again: persist fires again? "If it had NO -1/-1 counters on it."
  It had a -1/-1 counter. Persist does NOT fire again. Kitchen Finks stays in GY.
  Standard behavior: persist provides exactly ONE recursion per lifecycle.

COUNTER CANCELLATION ENABLES REPEATED PERSIST:
  When Kitchen Finks returns from persist (with -1/-1 counter), it's on the battlefield.
  If a +1/+1 counter is placed on Kitchen Finks (from any source):
    → Kitchen Finks now has both +1/+1 and -1/-1 counters.
    → SBA (122.3): remove one of each. Net result: 0 counters of either type.
    → Kitchen Finks is now a clean 3/2 with NO -1/-1 counter.
  If Kitchen Finks dies again now: persist fires (no -1/-1 counter).
  The cycle repeats.

METHOD 1: GRAFT (702.58a):
  A graft permanent has +1/+1 counters.
  When Kitchen Finks enters (from persist): Graft triggers.
  "Whenever another creature enters, if this permanent has a +1/+1 counter, you may move
    a +1/+1 counter from this permanent onto that creature."
  Move a +1/+1 counter from the graft permanent to Kitchen Finks.
  SBA: +1/+1 + -1/-1 cancel. Kitchen Finks has no counters. Graft permanent has N-1 counters.
  Sacrifice Kitchen Finks (sacrifice outlet): persist triggers. Return with -1/-1.
  Graft triggers on the enter. Move another counter. Counters cancel.
  Repeat for N iterations (N = number of graft counters available).
  When graft counters run out: no more +1/+1 counters to move → loop stops.
  NOT infinite (limited by graft counter supply).
  UNLESS: a way to replenish graft counters (proliferate, additional graft permanents).

METHOD 2: MELIRA, SYLVOK OUTCAST:
  Melira ({1}{G}: 2/2; "you can't get poison counters; creatures you control can't have -1/-1
    counters put on them; creatures your opponents control lose infect"):
  Persist says "return it to the battlefield with a -1/-1 counter."
  Melira says "creatures you control can't have -1/-1 counters put on them."
  This is a "can't" effect (CR 614.17). The -1/-1 counter CAN'T be placed.
  Result: when Kitchen Finks returns from persist with Melira out, the -1/-1 counter
    placement is prevented. Kitchen Finks enters clean (no -1/-1 counter).
  Dies again → persist fires (no -1/-1 counter) → returns clean → repeat INDEFINITELY.
  This IS infinite (with a sacrifice outlet).
  INFINITE COMBO: Melira + Kitchen Finks + Viscera Seer (sacrifice a creature: scry 1):
    → Sacrifice Finks to Seer: scry 1. Finks dies. Persist fires. Finks returns (no -1/-1 with Melira). ETB: gain 2 life.
    → Sacrifice Finks to Seer: scry 1. Finks dies again. Persist fires again. Returns. Gain 2 life.
    → Repeat infinitely: infinite life + infinite scry.
  Win condition: Viscera Seer scry gets you to a Spike Feeder or similar win card.

METHOD 3: VIZIER OF REMEDIES (Modern):
  Vizier of Remedies ({1}{W}: 2/1; "if one or more -1/-1 counters would be put on a creature
    you control, that many -1/-1 counters minus one are put on it instead"):
  Like Melira but only prevents -1/-1 counter placement on your creatures.
  Same result: persist creatures return without the -1/-1 counter.
  Infinite combo: Vizier of Remedies + Devoted Druid ({1}{G}: 0/2; {T}: add {G};
    "put a -1/-1 counter on it: untap it"):
    → Devoted Druid would gain -1/-1 counter from its untap ability.
    → Vizier prevents the -1/-1 counter.
    → Devoted Druid untaps at NO cost (the -1/-1 counter never lands).
    → Tap for {G}: untap (free with Vizier): tap for {G}: repeat → infinite mana.
    This is the Vizier Combo in Modern (and is a persist-adjacent use of counter prevention).

METHOD 4: UNDYING + -1/-1 COUNTER SOURCE (MIRROR OF PERSIST):
  Undying creatures return with a +1/+1 counter.
  If a -1/-1 counter is placed on the undying creature after it returns (canceling the +1/+1):
    → SBA: counters cancel. Creature has no +1/+1 counter.
    → If it dies again: undying fires (no +1/+1 counter).
  MIKAEUS, THE UNHALLOWED ({3}{B}{B}{B}: 5/5 intimidate; "whenever a Human deals damage to you, destroy it; other non-Human creatures you control get +1/+1 and have undying"):
  Woodfall Primus ({5}{G}{G}{G}: 6/6 trample; persist; "when it enters, destroy target
    noncreature permanent"):
  Wait — Mikaeus gives undying to nonhuman creatures, and Woodfall Primus already has persist.
  If a creature has BOTH persist and undying:
    When it dies (with no counters): both persist and undying trigger.
    If you arrange for persist to resolve first: returns with -1/-1 counter.
    Then undying resolves... but the creature is on the battlefield already. Undying would
    return "it to the battlefield if it had no +1/+1 counters." But the creature is ALREADY
    on the battlefield (from persist). What zone is "it" in? The creature already came back.
    Actually: both triggers went on the stack when the creature went to GY. Controller chooses
    order. If persist resolves first: creature enters from GY. When undying resolves: it
    targets the card in GY... but the card is no longer in GY (it's on the battlefield via
    persist). The undying trigger checks "if [the permanent] had no +1/+1 counters" at resolution.
    But the card is on the battlefield now (as a NEW object after persist returned it).
    The original "it" (the card that died) left the GY. Undying no longer has a valid target.
    Undying fizzles.
  RESULT: If persist fires first, undying fizzles (the card left the GY).
    If undying fires first: creature returns with +1/+1 counter. Persist fizzles for same reason.
    Controller picks which fires first = controller picks which counter the creature has.
  THEN: with the returned creature having one counter type:
    Use the other counter source to cancel (Mikaeus gives undying, so +1/+1 counter is added;
    if you can give a -1/-1 counter somehow, it cancels, and both can trigger on next death).
  Mikaeus + Woodfall Primus + Viscera Seer = infinite persist/undying loop:
    Primus has persist (its own) and undying (from Mikaeus).
    Sacrifice to Seer: both trigger. Put persist on top.
    Persist resolves: Primus returns with -1/-1 counter. Undying fizzles.
    Primus enters: ETB destroys noncreature permanent.
    Primus now has -1/-1 counter. SBA: -1/+1 cancel? No +1/+1 to cancel with.
    Wait: Primus has -1/-1 counter (from persist). Undying just fizzled.
    Primus sacrificed to Seer again: dies with -1/-1 counter. Persist: "if it had no -1/-1
      counters." It DID have counters. Persist doesn't fire.
    But UNDYING fires (Mikaeus's undying): "if it had no +1/+1 counters." It had none. Fire.
    Undying resolves: return with +1/+1 counter.
    Now Primus is on battlefield with +1/+1 counter and... wait, the -1/-1 counter from the
      previous persist return would have STAYED if it wasn't removed. It WAS removed (122.3).
    Let me re-trace:
    1. Sacrifice Primus (no counters): persist fires, undying fires. Put persist first.
       Persist: returns with -1/-1.
       Undying: fizzles (card left GY).
    2. Primus on battlefield with -1/-1 counter. ETB fires: destroy noncreature permanent.
    3. Sacrifice Primus (has -1/-1 counter): persist checks: HAS -1/-1 counters. Persist doesn't fire.
       Undying checks: has NO +1/+1 counters. Undying fires.
       Undying: returns with +1/+1 counter.
    4. Primus enters with +1/+1 counter. ETB fires again: destroy another noncreature.
    5. Sacrifice Primus (has +1/+1 counter): persist checks: no -1/-1 counter. PERSIST FIRES.
       Undying checks: HAS +1/+1 counter. Undying doesn't fire.
       Persist: returns with -1/-1 counter.
    6. Return to step 2: repeat.
    EACH CYCLE: 2 sacrifices, 2 ETBs, alternating counters.
    With Viscera Seer: scry 2 per full cycle. Infinite scrys. Infinite noncreature destruction.
    Infinite loop! Each loop requires 2 deaths (one persist return, one undying return).
```

## Definitive Conclusions

- **+1/+1 counters cancel -1/-1 counters via CR 122.3 state-based action** — adding a +1/+1 counter to a persist creature (with its -1/-1 counter) removes both; the creature has no -1/-1 counter and persist can fire on its next death.
- **Graft enables limited-recursion loops** — each loop iteration uses one graft counter; the loop ends when the graft creature runs out of counters (unless counters are replenished via proliferate).
- **Melira/Vizier of Remedies enable INFINITE persist loops** — by preventing the -1/-1 counter from being placed at all, these effects let persist creatures return with no counter, creating infinite loops with a sacrifice outlet.
- **When a creature has both Persist and Undying triggers (both fire simultaneously), the controller chooses which resolves first** — the one that resolves first returns the creature from GY; the other trigger fizzles because the card is no longer in GY.
- **The Mikaeus + Woodfall Primus loop alternates between persist and undying returns** — one return places a -1/-1 counter, the other places a +1/+1 counter; each subsequent death allows the OTHER trigger to fire; the cycle continues infinitely with a sacrifice outlet.

## Canonical Example
**Kitchen Finks + Melira + Viscera Seer (Infinite Life Gain):**
You control:
- Kitchen Finks ({1}{G/W}{G/W}: 3/2; persist; "when it enters, you gain 2 life")
- Melira, Sylvok Outcast ({1}{G}: 2/2; "creatures you control can't have -1/-1 counters")
- Viscera Seer ({B}: 1/1; "sacrifice a creature: scry 1")

Step 1: Sacrifice Kitchen Finks to Viscera Seer. Scry 1.
Finks dies (no counters). Persist triggers: "return it with a -1/-1 counter."
Melira is present. The "can't have -1/-1 counters" prevention: as Finks would enter with a -1/-1 counter, the counter can't be placed (CR 614.17 can't effect).
Finks enters WITHOUT the -1/-1 counter (clean 3/2). ETB fires: gain 2 life.

Step 2: Sacrifice Kitchen Finks to Viscera Seer again. Scry 1.
Finks dies (no counters — never got the -1/-1 due to Melira). Persist triggers again.
Same result: returns clean. Gain 3 life.

Repeat indefinitely:
- Each sacrifice: scry 1.
- Each persist return: gain 2 life.
- No counter ever accumulates.
- Kitchen Finks never "runs out" of persist.

Win condition: scry every turn to find a Spike Feeder or Auriok Champion.
Or: with a Blood Artist (triggers "whenever a creature dies, target player loses 1 life, you gain 1 life"), infinite life drain as well.
This is one of the most powerful infinite combos in Kitchen Finks's history.

**Example 2 — Mikaeus the Unhallowed + Woodfall Primus Loop:**
You control:
- Mikaeus, the Unhallowed ({3}{B}{B}{B}: 5/5 intimidate; "other non-Human creatures you control get +1/+1 and have undying")
- Woodfall Primus ({5}{G}{G}{G}: 6/6 trample; persist; "when Woodfall Primus enters, destroy target noncreature permanent")
- Viscera Seer ({B}: 1/1; "sacrifice a creature: scry 1")

Primus has both persist (its own) AND undying (from Mikaeus). Currently no counters.

Sacrifice Primus to Seer. Scry 1.
Both persist and undying triggers go on stack. You control both (your creature).
Put PERSIST FIRST on the stack (resolves last).
Undying resolves: "if it had no +1/+1 counters" — Primus had none. Return with +1/+1 counter.
Wait — I said put persist first. Let me re-think: persist fires "on death" (when going to GY). Both triggers fire. Stack them: put undying on the stack first (bottom), persist on top (resolves first).

Actually: your choice of ORDER means which is FIRST to resolve (LIFO — put it on LAST goes on TOP = resolves FIRST).
Let's say you put persist on the stack LAST (goes on TOP). Persist resolves first.
Persist: return Primus with -1/-1 counter. Primus enters. ETB: destroy a noncreature permanent (opponent's land).
Undying trigger now resolves: "if [Primus] had no +1/+1 counters." Primus was the creature that died. That object is now on the battlefield (returned by persist). "It" for the undying trigger refers to the card that died. The card is now on the battlefield as a new object (from persist). Undying resolves: checks the current zone of Primus. Primus is on the battlefield. Undying would return it "from the graveyard" — but it's not in the graveyard. Undying fizzles.

Result: Primus on battlefield with -1/-1 counter.

Sacrifice Primus again (it has -1/-1 counter). Scry 1.
Persist: "if it had NO -1/-1 counters." It DID. Persist doesn't fire.
Undying: "if it had no +1/+1 counters." It had none. Undying fires.
Undying returns Primus with +1/+1 counter. ETB: destroy another noncreature permanent.

Primus on battlefield with +1/+1 counter (and -1/-1 counter from before? No — when Primus went to GY, counters were removed — CR 122.2: "counters on an object are not retained if that object moves from one zone to another.").
So: Primus enters from undying with ONLY a +1/+1 counter.
SBA check: +1/+1 present, no -1/-1. SBA: nothing to cancel. Primus is clean 6/6 + 1 from Mikaeus + 1 from undying counter = 8/8 with +1/+1 counter.

Sacrifice again. Persist: has no -1/-1 counter. PERSIST FIRES.
Undying: has +1/+1 counter. Undying doesn't fire.

Put persist on stack last (resolves first). Persist returns with -1/-1 counter. ETB fires. Undying fizzles.

And repeat the cycle. Every 2 sacrifices: 2 ETB triggers = 2 noncreature permanents destroyed, 2 scry from Seer.

Infinite noncreature permanent destruction. In the right deck, this wins the game.

## Commonly Confused With
- **P391 (Persist/Undying/Evolve)** — P391 covers how persist and undying work. P419 covers what happens when you "break" the counter prevention mechanism, enabling infinite loops.
- **P418 (Graft/Modular/Bloodthirst/Sunburst)** — P418 covers graft and counter-based ETB mechanics. P419 explains the graft-persist interaction specifically: graft's counter movement triggers on entering persist creatures, enabling counter cancellation.
- **P412 (Mutate Pile + Persist)** — P412 covers what happens when a mutate pile has persist. P419 covers the counter-cancellation mechanism that enables multiple persist triggers from the same creature across multiple deaths.
- **P005 (Simultaneous Deaths)** — When persist and undying both fire simultaneously (on the same death), the controller stacks them. P419 explains how the one that resolves second fizzles because the card left the GY.
