---
id: p300
name: Undying and Persist — Return From the Graveyard With a Counter
category: triggered
cr_refs: [702.93a, 702.79a]
tags: [undying, persist, graveyard-return, +1+1-counter, -1-1-counter, death-trigger, counter-removal, Kitchen-Finks, Mikaeus-the-Unhallowed, Young-Wolf, Geralf-Messenger, Strangleroot-Geist, Vorapede]
created: 2026-03-29
examples_count: 2
---

# P300 — Undying and Persist — Return From the Graveyard With a Counter

## Abstract
Undying and Persist are mirror-image triggered death abilities. **Undying** returns a permanent from the graveyard to the battlefield with a +1/+1 counter — but only if it had NO +1/+1 counters when it died. **Persist** does the same but with a -1/-1 counter — returning only if the permanent had NO -1/-1 counters. Both mechanics trigger once; once the counter is present, the permanent dies for good (unless the counter is removed). The classic combo: pair Persist creatures with Mikaeus, the Unhallowed's undying effect or use counter-removal to reset the ability for infinite death loops.

## The Definitive Rules

**CR 702.93a** (verbatim): *"Undying is a triggered ability. 'Undying' means 'When this permanent is put into a graveyard from the battlefield, if it had no +1/+1 counters on it, return it to the battlefield under its owner's control with a +1/+1 counter on it.'"*

**CR 702.79a** (verbatim): *"Persist is a triggered ability. 'Persist' means 'When this permanent is put into a graveyard from the battlefield, if it had no -1/-1 counters on it, return it to the battlefield under its owner's control with a -1/-1 counter on it.'"*

## The Pattern

```
UNDYING:
  Trigger condition: permanent dies (put into GY from battlefield)
  Check: "if it had no +1/+1 counters on it" — checked immediately before death
  Result: return to battlefield under owner's control WITH a +1/+1 counter

  FIRST DEATH: permanent had 0 +1/+1 counters → returns with +1/+1 counter
  SECOND DEATH: permanent now has a +1/+1 counter → condition fails → doesn't return
  The +1/+1 counter blocks the second trigger.

  UNDYING + REMOVAL:
    Remove the +1/+1 counter from the undying creature:
    It's back to 0 +1/+1 counters. When it dies again: undying can fire again.
    Mikaeus, the Unhallowed: "Non-Human creatures you control have undying."
    Plus: when another non-Human creature you control dies, put a +1/+1 counter on all non-Human creatures.
    Wait: Mikaeus himself gives +1/+1 (he's a lord) AND gives non-humans undying.
    The +1/+1 he grants: if a creature has a +1/+1 counter already (from undying), adding more doesn't help.

  UNDYING LOOP SETUP:
    Need: creature with undying + a sacrifice outlet + a way to remove the +1/+1 counter
    Sacrifice creature → undying returns with +1/+1 counter → remove counter → sacrifice again → repeat
    Each loop: any "whenever a creature dies" triggers fire.
    For infinite: need the loop to be free (no mana cost each cycle).

    Classic Combo: Geralf's Messenger + Mikaeus the Unhallowed + Altar of Dementia:
      Geralf's Messenger: "Undying. When it enters, target opponent loses 2 life."
      Mikaeus gives ALL non-human creatures undying (stacks with Messenger's own undying).
      Wait: Mikaeus gives non-Human creatures "+1/+1 and undying." Messenger is a Zombie (Human subtype? No).
      Each time Messenger dies with Mikaeus in play: it gets the +1/+1 from undying. Plus Mikaeus's +1/+1?
      Complex: the net effect is it can die twice before losing both counters.
      Simpler infinite: Young Wolf (undying) + Mikaeus (non-human, gives +1/+1 and undying) + sacrifice outlet.
      Young Wolf enters with Mikaeus's +1/+1 bonus → is a 2/2. Sacrifice it.
      Dies: if it had no +1/+1 counters... but it HAD +1/+1 from Mikaeus.
      Hmm — the counter on it means undying doesn't trigger.
      Actually the trick: Mikaeus gives a bonus of +1/+1, but that's not a counter. It's a static effect.
      "Creatures you control get +1/+1" is a continuous buff, not a +1/+1 counter.
      Young Wolf dies with 0 +1/+1 COUNTERS (though Mikaeus gives +1/+1 as a static bonus).
      Undying triggers: Young Wolf returns with one +1/+1 counter.
      Die again: has +1/+1 counter → undying doesn't trigger → dies for good.
      Still nets: two deaths before truly dying (without counter removal).

PERSIST:
  Trigger condition: permanent dies (put into GY from battlefield)
  Check: "if it had no -1/-1 counters on it"
  Result: return to battlefield under owner's control WITH a -1/-1 counter

  FIRST DEATH: 0 -1/-1 counters → returns with -1/-1 counter
  SECOND DEATH: has -1/-1 counter → condition fails → stays in GY
  The -1/-1 counter degrades the creature slightly (+1/+1 base minus 1/-1 = original -1/-1).

  PERSIST NOTABLE CARDS:
    Kitchen Finks ({1}{G/W}{G/W}): Persist. 3/2. "When ETBs, gain 2 life."
    First death: returns with -1/-1 → becomes 2/1 (3-1 / 2-1) with persist.
    Second death: has -1/-1 counter, persist fails.
    But Kitchen Finks ETB also fires on persist return: gain 2 more life.
    Total life gain from one Kitchen Finks: 2 (original) + 2 (persist return) = 4 life for {1}{G/W}{G/W}.

    Voice of Resurgence ({G}{W}): Not persist, but related: "When an opponent casts a spell during your turn
      or when V.o.R dies, create an Elemental token that's X/X where X = number of creatures you control."
    Persist + ETB trigger cards: maximum value per death cycle.

    Woodfall Primus ({5}{G}{G}{G}): Persist. 6/6 Trample. "When ETBs, destroy target non-creature permanent."
    Persist return: kill ANOTHER non-creature permanent. Two vindicate effects.
    With infinite-persist loop: destroy ALL non-creature permanents.

  PERSIST LOOP SETUP:
    Woodfall Primus + Altars of Dementia + Melira, Sylvok Outcast:
    Melira: "You can't get poison counters. Creatures you control can't have -1/-1 counters put on them."
    Melira's effect: when Primus would return with a -1/-1 counter, the counter can't be placed.
    Persist tries to put -1/-1 on it: the counter is prevented. But Primus returns to battlefield.
    Now: Primus returned with NO -1/-1 counter (Melira prevented it).
    On next death: still no -1/-1 → persist fires again → returns again. INFINITE.
    Each return: destroy a non-creature permanent. Destroy opponent's ENTIRE board of non-creatures.

UNDYING VS PERSIST — COMPARISON:
  Undying:
    Condition: no +1/+1 counters when dying
    Returns with: +1/+1 counter
    Net effect: creature is slightly BIGGER after first death
    Combo with: -1/-1 counter removal, or effects that remove +1/+1 counters

  Persist:
    Condition: no -1/-1 counters when dying
    Returns with: -1/-1 counter
    Net effect: creature is slightly SMALLER after first death
    Combo with: Melira (prevents -1/-1) or effects that remove -1/-1 counters

UNDYING + PERSIST INTERACTION:
  A creature with BOTH undying and persist (e.g., via effects):
    When it dies with no +1/+1 counters AND no -1/-1 counters:
      BOTH undying and persist trigger simultaneously.
      APNAP order: only one trigger can return it (it can only come back once from one trigger).
      Wait: after first trigger resolves (returns it to battlefield), second trigger looks for the card.
      The card is no longer in the GY (it's on the battlefield now). Second trigger does nothing.
    So: both trigger, but only one puts it back into play. Whichever resolves first "wins."

  IMPORTANT: once back with a +1/+1 counter (from undying), the -1/-1 (persist) counters cancel.
    +1/+1 and -1/-1 counters annihilate each other via SBA (CR 704.5q).
    Net: both counters removed. Next death: both undying and persist can trigger again!
    This creates infinite loop without any external counter removal.

COUNTER REMOVAL ENABLING INFINITE:
  -1/-1 counter removal: Devoted Druid ({1}{G}).
    "Tap: Add {G}." Untap ability: "Put a -1/-1 counter on Devoted Druid: Untap it."
    Devoted Druid with undying: dies → returns with +1/+1 counter.
    But: separately, Devoted Druid's own untap ability puts -1/-1 counters on itself.
    +1/+1 and -1/-1 annihilate → 0 counters → undying can fire again.
    Result: loop between Devoted Druid ability and undying return.
```

## Definitive Conclusions

- **Undying checks for no +1/+1 counters; persist checks for no -1/-1 counters** — the opposite counter type conditions.
- **A creature with both undying and persist creates an automatic loop** — +1/+1 and -1/-1 annihilate each other, resetting both conditions.
- **Melira, Sylvok Outcast prevents persist's -1/-1 from sticking** — enables infinite persist loops.
- **Undying returns the creature stronger** (+1/+1); **persist returns it weaker** (-1/-1).
- **The condition is checked immediately before dying** — if the counter was removed at instant speed just before death, the ability can fire.
- **A persist creature with both +1/+1 and -1/-1 counters that dies from toughness ≤ 0 will NOT return.** Persist checks the creature's last known state on the battlefield — it still has the -1/-1 counters at that point (the SBA that annihilates matched +1/+1 / -1/-1 pairs and the SBA for toughness ≤ 0 both happen simultaneously). (Gatherer ruling 2013-06-07)
- **If a token with persist dies (no -1/-1 counters), the ability triggers but the token ceases to exist and can't return.** (Gatherer ruling 2013-06-07)
- **Multiple instances of persist each trigger separately, but only the first to resolve can return the card.** Once it's back on the battlefield, subsequent triggers find it's no longer in the graveyard. (Gatherer ruling 2013-06-07)

## Canonical Example
**Melira + Kitchen Finks + Viscera Seer Infinite Life Loop:**
Board: Melira, Sylvok Outcast + Viscera Seer (sacrifice: scry 1) + Kitchen Finks (3/2, persist).
Step 1: Sacrifice Kitchen Finks to Viscera Seer. Seer scries 1.
Kitchen Finks dies: persist triggers (no -1/-1 counters). Would return with -1/-1 counter.
Melira: creatures you control can't have -1/-1 counters placed on them.
Kitchen Finks returns to battlefield WITHOUT the -1/-1 counter.
Kitchen Finks ETB triggers: gain 2 life.
Finks is back as 3/2 with no -1/-1 counter (Melira prevented it).
Step 2: Sacrifice Kitchen Finks again. Same process.
Step 3: repeat infinitely.
Each cycle: gain 2 life + scry 1.
Infinite life + infinite scry = combo win (tutor into a finisher, or just outlive opponent).
Winning: add a Blasting Station ({T}: deal 1 to target → untaps when creature enters). Each Finks return untaps Blasting Station: deal 1 damage. Infinite damage.

**Example 2 — Strangleroot Geist Undying Aggro:**
Turn 2: cast Strangleroot Geist ({G}{G}): 2/1 Haste, Undying.
Attack immediately: 2 damage. Opponent's blocker kills Strangleroot Geist in combat.
Undying triggers: Strangleroot Geist had no +1/+1 counters → returns to battlefield with +1/+1 counter.
Now Strangleroot Geist is 3/2 (2+1 / 1+1). Haste: attack immediately!
3 more damage. Total: 5 damage from one 2-mana creature in two attacks.
If opponent tries to kill it with removal at 3/2: it dies but has a +1/+1 counter → undying fails.
The threat: opponent MUST answer a 2/1 on turn 2 OR take 3 damage plus a 3/2 attacking on turn 3.
Strangleroot Geist in tempo aggro: two bodies in one card, forces opponent's removal early.

## Commonly Confused With
- **P009 (Sacrifice vs Destroy)** — Both undying and persist return after dying (which includes being sacrificed), not just destroyed.
- **P288 (Adapt/Mutate)** — Adapt adds +1/+1 counters; a creature that just returned via undying with a +1/+1 counter already meets the "has a +1/+1 counter" condition blocking adapt (wait: adapt checks "no +1/+1 counters," so having one blocks it).
- **P002 (Replacement vs Triggered Effects)** — Undying/persist are triggered abilities (go on the stack), not replacement effects; there's a brief window between death and return where the permanent is in the GY.
- **P033 (Indestructible)** — Indestructible creatures can't be destroyed, so they don't trigger undying/persist from destruction; they can still die from being sacrificed (which does trigger it).
