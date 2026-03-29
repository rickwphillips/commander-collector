---
id: p391
name: Persist, Undying, and Evolve — Death-Resurrection and Growth Triggers
category: triggered
cr_refs: [702.79a, 702.93a, 702.100a, 702.100b, 702.100c, 702.100d]
tags: [persist, undying, evolve, -1/-1-counter-on-return, +1/+1-counter-on-return, counter-condition-on-death, growth-on-creature-enter, persist-combo, undying-combo, Kitchen-Finks, Glen-Elendra-Archmage, Mikaeus-the-Unhallowed, Young-Wolf, Geralf-Messenger, Strangleroot-Geist, Experiment-One, Zegana-biomass, persist-undying-interaction, counter-removal-trick]
created: 2026-03-29
examples_count: 2
---

# P391 — Persist, Undying, and Evolve — Death-Resurrection and Growth Triggers

## Abstract
**Persist** (702.79a) returns a creature from the GY when it dies — but only if it had NO -1/-1 counters at the time of death; it returns with a -1/-1 counter. **Undying** (702.93a) is the mirror: returns from the GY if the creature had NO +1/+1 counters at the time of death; it returns with a +1/+1 counter. Both are death-triggered abilities that use the counter as a "used up" marker — the creature can only persist/undying once unless the counter is removed. **Evolve** (702.100a) triggers when a creature you control enters the battlefield with greater power or toughness than the evolve creature's current stats — the evolve creature gets a +1/+1 counter. Critical interactions: persist + Melira (removes -1/-1 counter prevention) creates infinite loops; undying + immediate +1/+1 counter removal = re-trigger; evolve checks at the trigger AND at resolution (intervening-if style); and evolve interacts with pump effects that boost stats after the ETB check.

## The Definitive Rules

**CR 702.79a** (verbatim): *"Persist is a triggered ability. 'Persist' means 'When this permanent is put into a graveyard from the battlefield, if it had no -1/-1 counters on it, return it to the battlefield under its owner's control with a -1/-1 counter on it.'"*

**CR 702.93a** (verbatim): *"Undying is a triggered ability. 'Undying' means 'When this permanent is put into a graveyard from the battlefield, if it had no +1/+1 counters on it, return it to the battlefield under its owner's control with a +1/+1 counter on it.'"*

**CR 702.100a** (verbatim): *"Evolve is a triggered ability. 'Evolve' means 'Whenever a creature you control enters, if that creature's power is greater than this creature's power and/or that creature's toughness is greater than this creature's toughness, put a +1/+1 counter on this creature.'"*

**CR 702.100b** (verbatim): *"A creature 'evolves' when one or more +1/+1 counters are put on it as a result of its evolve ability resolving."*

**CR 702.100c** (verbatim): *"A creature can't have a greater power or toughness than a noncreature permanent."*

**CR 702.100d** (verbatim): *"If a creature has multiple instances of evolve, each triggers separately."*

## The Pattern

```
PERSIST (702.79a):
  TRIGGER CONDITION:
    "When this permanent is put into a graveyard from the battlefield."
    This is a leaves-the-battlefield trigger (goes to GY specifically — not exile, not hand).
    "If it had no -1/-1 counters on it": checked using LAST KNOWN INFORMATION (603.10a).
    The creature's state just before leaving the battlefield is what matters.
  RETURN WITH COUNTER:
    Triggers. Resolves: return to battlefield under owner's control WITH a -1/-1 counter.
    The -1/-1 counter = the "used" marker. Persist fired, it's now "spent."
    SECOND DEATH: creature dies again (with the -1/-1 counter): persist does NOT trigger.
      Condition fails: "if it had no -1/-1 counters" → it DID have -1/-1 counters → no persist.
    So: one free resurrection per creature (unless counter is removed).
  PERSIST AND P/T:
    The -1/-1 counter reduces the creature's stats by 1/1.
    A 2/2 with persist dies, returns as a 1/1 with a -1/-1 counter.
    If it was a 1/1: returns as 0/0... but P003: it's a new object on the battlefield.
      A 0/0 creature = SBA: 704.5f (creature with toughness ≤ 0 → GY).
      But: 704.5 checks happen after the persist trigger resolves.
      The creature enters, SBA fires: 0/0 toughness → immediately destroyed.
      PERSIST DOES NOT TRIGGER AGAIN (the creature just entered, has a -1/-1 counter).
      So: a 0/0 persist creature dies again immediately, but doesn't loop.
  PERSIST COMBO:
    Persist + any effect that removes the -1/-1 counter before or as the creature dies again:
    Kitchen Finks ({1}{G/W}{G/W}: 3/2, persist — when this enters, you gain 2 life):
      Kitchen Finks dies with no -1/-1 counters: persist triggers. Enters as 2/1 with -1/-1 counter.
      ETB fires again: you gain 2 more life.
      Kitchen Finks now has a -1/-1 counter. Dies again: no persist (has counter).
    MELIRA INTERACTION: Melira, Sylvok Outcast ({1}{G}: "Creatures you control can't have -1/-1
      counters placed on them" and "creatures your opponents control can't have +1/+1 counters
      placed on them"):
      With Melira out: when persist triggers and tries to put a -1/-1 counter on the returning
        creature: it CAN'T (Melira prevents it). The creature enters WITHOUT the -1/-1 counter.
        Wait: persist says "return it to the battlefield with a -1/-1 counter." If the counter
        can't be placed (due to Melira), the creature still enters but without the counter.
      Now: the creature is on the battlefield with NO -1/-1 counters.
      If it dies again: persist triggers again (no -1/-1 counters). INFINITE LOOP.
      This is a real and famous infinite combo: Melira + Kitchen Finks + a sacrifice outlet.
        Sacrifice Kitchen Finks → persist trigger → enters without counter (Melira) → gain life →
        sacrifice again → repeat. With a damage outlet = infinite life gain = win condition.
  PERSIST TIMING:
    Persist is a death trigger. It goes on the stack. Opponents can respond.
    Before persist resolves: the creature is in the GY. It's not on the battlefield.
    After persist resolves: the creature is a NEW OBJECT on the battlefield (P003).
    All past history (damage marked, other counters, enchantments) is gone (new object).
    Except: the -1/-1 counter is placed as part of the ETB of the persist return.

UNDYING (702.93a):
  TRIGGER CONDITION:
    Same structure as persist but with +1/+1 counters:
    "When this dies, if it had no +1/+1 counters on it, return it with a +1/+1 counter."
    Last known information applies.
  MIRROR OF PERSIST:
    Undying: no +1/+1 counters → returns with a +1/+1 counter.
    Persist: no -1/-1 counters → returns with a -1/-1 counter.
    Both: one free resurrection, then the counter marks "used."
  UNDYING STATS:
    A 2/2 with undying dies (no +1/+1 counters): returns as 3/3. Better than it was.
    Undying makes small creatures bigger on death. The natural upgrade.
  UNDYING COMBO:
    Undying + counter removal = re-trigger.
    Mikaeus, the Unhallowed ({4}{B}{B}{B}: gives all non-Human creatures undying; whenever a Human
      attacks you, destroy it):
      With Mikaeus: all non-Human creatures get undying.
      Small combo piece (e.g., Triskelion, {6}: enter with 3 +1/+1 counters):
        Triskelion (6/6): remove 3 counters to deal 3 damage. Triskelion is now 3/3 (counters gone? No).
        Wait: Triskelion removes +1/+1 counters to deal 1 damage per counter removed.
        At 3/3 (started 6/6, removed 3 counters): now 3/3. Remove 2 more: 1/1. Remove 1 more: 0/0.
        At 0/0: SBA → dies. Undying triggers: had no +1/+1 counters (removed them all).
        Returns with one +1/+1 counter: now 1/1 again.
        Remove 1 counter: deal 1 damage. Now 0/0. Dies. Undying again (no counters).
        INFINITE damage. Kills entire table. Famous Commander combo.
  UNDYING AND +1/+1 COUNTERS FROM OTHER SOURCES:
    If the creature has +1/+1 counters from any source when it dies: undying doesn't trigger.
    Winding Constrictor (adds extra counters): creature might get +1/+1 counters inadvertently.
    Combat pump that gives +1/+1 until EOT: those are NOT counters (they expire). No issue.
    But: +1/+1 counters from any source count. Be careful with counter-adding effects.
  PERSIST vs. UNDYING:
    A creature with BOTH persist and undying:
      Dies with no counters: both triggers fire simultaneously (APNAP order).
      Both triggers are put on the stack. Let's say persist goes on first, undying second.
      Undying resolves first (LIFO): creature returns with +1/+1 counter.
      Persist tries to resolve: "if it had no -1/-1 counters." The creature is now on the battlefield
        (returned via undying). The persist trigger was waiting. Can persist still bring it back?
        The persist trigger's target was the creature. But the creature is no longer in the GY.
        Persist: "return it to the battlefield under its owner's control." Target: the creature in GY.
        The creature is no longer in the GY. Persist has no valid target? Or fizzles?
        Actually: persist is a triggered ability with a conditional clause, not a targeted ability.
        It says "return it to the battlefield." The "it" is the specific object that died.
        That object is now a new object on the battlefield (undying returned it, new P003 object).
        The persist trigger refers to the original GY object, which is gone.
        The trigger resolves: attempts to return the original GY object. It's not there anymore.
        Nothing happens (the trigger fizzles — can't return something that's not in the GY).
      Bottom line: with both persist and undying, the trigger that resolves SECOND will fizzle
        because the creature already returned from the trigger that resolved first.
      The "winning" trigger is whichever resolves first. Usually: order them so the better one wins.

EVOLVE (702.100):
  TRIGGER CONDITION:
    "Whenever a creature you control enters the battlefield, if that creature's power is greater than
      this creature's power AND/OR that creature's toughness is greater than this creature's toughness."
    Important: OR condition. Greater power OR greater toughness (doesn't need both).
    Evolve triggers EVEN IF only one stat is exceeded.
  AT TRIGGER AND AT RESOLUTION:
    This is an intervening-if trigger (P006 pattern):
      Condition is checked WHEN it would trigger AND when it resolves.
      If the entering creature temporarily has greater power/toughness at trigger time but not at
        resolution: evolve doesn't put a counter.
      Example: a 3/1 creature enters. Evolve creature is 2/3. At trigger: 3 > 2 (power triggers).
        At resolution: check again. If the 3/1 has been reduced to 1/1: 1 is not > 2. No counter.
  EVOLVE WITH PUMP EFFECTS:
    Pump spells applied AFTER evolve triggers: affect whether the condition is met at resolution.
    If evolve creature is pumped to 4/4 before the evolve trigger resolves:
      The entering creature (3/1) no longer has power > 4 or toughness > 4. Trigger fizzles.
  EVOLVE AND STATS:
    If the entering creature is 2/3 and the evolve creature is 2/2:
      Power: 2 is NOT greater than 2. Toughness: 3 IS greater than 2. So: evolve triggers (toughness).
    If the entering creature is 1/1 and the evolve creature is 2/2:
      Neither power (1 < 2) nor toughness (1 < 2) is greater. Evolve doesn't trigger.
  EVOLVE CASCADING:
    If the evolve creature gets a counter (grows), it might trigger other evolve creatures.
    Example: you control a 2/2 evolve and a 1/1 evolve. A 3/3 enters.
      3/3 triggers the 2/2's evolve (3 > 2). The 2/2 would get a counter → becomes 3/3.
      Does that 2/2→3/3 transition trigger the 1/1's evolve? No: evolve triggers when a creature
        ENTERS the battlefield. Growing a counter isn't entering. No cascade evolve trigger.
    BUT: if the 3/3 enters and it exceeds the 1/1's stats AND the 2/2's stats: both evolve trigger.
      Both the 1/1 and the 2/2 each trigger independently (702.100d: each instance triggers separately).
```

## Definitive Conclusions

- **Persist and undying are death triggers that fire based on the creature's counter state at death** — last known information determines whether the condition was met; a creature can only persist/undying once unless its counter is removed.
- **Persist + Melira = infinite resurrections** — if the -1/-1 counter can't be placed (Melira prevents it), the creature returns without the counter and persist can trigger again on the next death; requires a sacrifice outlet for the loop.
- **Undying + counter removal = re-trigger** — Mikaeus + Triskelion is a famous infinite combo; removing all +1/+1 counters enables undying to fire again.
- **If a creature has both persist and undying, only one trigger effectively resolves** — whichever trigger fires first returns the creature; the second trigger fizzles because the creature is no longer in the GY.
- **Evolve triggers only when a creature ENTERS and has strictly greater power or toughness** — growing existing creatures (via counters, pump, etc.) does not trigger evolve; the condition is checked at trigger time AND resolution (intervening-if).

## Canonical Example
**Kitchen Finks + Viscera Seer + Melira Combo:**
Battlefield: Melira, Sylvok Outcast + Viscera Seer ({B}: creature, "sacrifice a creature: scry 1").
You want to gain infinite life and scry infinitely.

Kitchen Finks ({1}{G/W}{G/W}: 3/2, lifelink, persist — "when this enters, gain 2 life"):
Step 1: Cast Kitchen Finks. Enters: gain 2 life. (ETB trigger.)
Step 2: Sacrifice Kitchen Finks to Viscera Seer: scry 1.
Step 3: Kitchen Finks dies (no -1/-1 counters). Persist triggers.
Step 4: Persist resolves: "return Kitchen Finks to battlefield with a -1/-1 counter."
  BUT: Melira prevents -1/-1 counters on creatures you control.
  Kitchen Finks enters WITHOUT the -1/-1 counter.
Step 5: Kitchen Finks ETB trigger: gain 2 more life.
Step 6: Sacrifice Kitchen Finks again (no counters). Persist triggers again.
REPEAT INFINITELY.

Results: Infinite life gain. Infinite scry. Can also drain opponents if you add a "when a creature leaves your battlefield" damage trigger (like Zulaport Cutthroat or Blood Artist).

This combo is one of the most famous in competitive Magic. It requires:
- A persist creature (Kitchen Finks, Murderous Redcap, Woodfall Primus, etc.)
- Melira, Sylvok Outcast (prevents -1/-1 counters)
- A sacrifice outlet

The loop is deterministic (no probability) and infinite. Always results in win if uncountered.

**Example 2 — Evolve with Intervening-If:**
You control Experiment One ({G}: 1/1 evolve, "remove a +1/+1 counter from this creature: regenerate it").

Turn 3: Cast Flinthoof Boar ({1}{G}: 2/2). Flinthoof Boar enters.
Evolve trigger fires: "if Flinthoof Boar's power > Experiment One's power OR toughness > Experiment One's toughness."
At trigger time: 2 > 1 (power). 2 > 1 (toughness). Both conditions met. Trigger fires.
Trigger goes on stack. Opponent passes priority.
Trigger resolves: check again (intervening-if). Flinthoof Boar still 2/2. Experiment One still 1/1.
2 > 1: condition still met. Experiment One gets +1/+1 counter (now 2/2).

Turn 4: Cast Kalonian Tusker ({G}{G}{G}: 3/3). Enters.
Evolve trigger: 3 > 2 (Experiment One's current power). OR 3 > 2 (toughness). Both.
Trigger fires. Resolves. Experiment One grows to 3/3.

Turn 5: Cast Elvish Mystic ({G}: 1/1). Enters.
Evolve trigger: 1 > 3? NO. 1 > 3? NO. Neither power nor toughness exceeds Experiment One (3/3).
Evolve does NOT trigger. Experiment One stays at 3/3.

Evolution in action: Experiment One grows to match your biggest creatures.
Once it's grown: small utility creatures don't trigger it. Only NEW bigger threats do.

## Commonly Confused With
- **P003 (Zone Change — New Object)** — Persist and undying return the creature to the battlefield as a new object (zone change: GY → battlefield). All attachments, damage markings, and other counters are lost. The new object starts fresh (except for the persist/undying counter placed on entry).
- **P006 (Intervening If — Condition at Trigger and Resolution)** — Evolve uses the intervening-if pattern: the power/toughness comparison is checked when the trigger would fire AND when it resolves. If the entering creature is temporarily pumped above threshold and then returns below threshold before resolution: no counter.
- **P002 (Replacement Effects)** — Melira's effect is a replacement effect: "if a -1/-1 counter would be placed on a creature you control, instead it isn't placed." The persist trigger still resolves (it returned the creature to the battlefield); the replacement effect modified the "enter with -1/-1 counter" part.
- **P005 (APNAP — Simultaneous Triggers)** — If persist and undying both trigger at the same time (a creature dies with both), the APNAP rule determines stack ordering. The player who controls the creature orders their own triggers. Since both are controlled by the same player: they choose which to place on the stack first. The one placed second resolves first (LIFO). Both usually fizzle except the first to resolve (the creature gets returned once, then is no longer in the GY for the second).
