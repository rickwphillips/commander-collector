---
id: p243
name: Persist and Undying — Return from Death With a Counter
category: triggered
cr_refs: [702.79a, 702.93a]
tags: [persist, undying, -1/-1, +1/+1, death-trigger, return, graveyard, Shadowmoor, Innistrad, Kitchen-Finks, Mikaeus-the-Unhallowed, Strangleroot-Geist]
created: 2026-03-28
examples_count: 2
---

# P243 — Persist and Undying — Return from Death With a Counter

## Abstract
Two parallel death-recursion mechanics. **Persist**: when a creature with no -1/-1 counters dies, it returns to the battlefield with a -1/-1 counter on it — so it comes back once, but slightly weaker, and won't persist again unless the counter is removed. **Undying**: symmetric but opposite — when a creature with no +1/+1 counters dies, it returns with a +1/+1 counter on it, slightly stronger. Both allow one-time resurrection, and both are "spent" once the counter is on the creature. The counters can be removed to reset the ability. Classic combos: Kitchen Finks + Viscera Seer (sacrifice → persist, scry, remove -1/-1 by re-entering) and Mikaeus, the Unhallowed (gives non-Human creatures undying) + any creature with a relevant death trigger.

## The Definitive Rules

**CR 702.79a** (verbatim): *"Persist is a triggered ability. 'Persist' means 'When this permanent is put into a graveyard from the battlefield, if it had no -1/-1 counters on it, return it to the battlefield under its owner's control with a -1/-1 counter on it.'"*

**CR 702.93a** (verbatim): *"Undying is a triggered ability. 'Undying' means 'When this permanent is put into a graveyard from the battlefield, if it had no +1/+1 counters on it, return it to the battlefield under its owner's control with a +1/+1 counter on it.'"*

## The Pattern

```
PERSIST:
  Triggered: when permanent goes to GY from battlefield
  Condition check: it had NO -1/-1 counters on it when it died
  If no counters: return to battlefield with ONE -1/-1 counter
  If it already had a -1/-1 counter: persist doesn't trigger (condition fails)

UNDYING:
  Triggered: when permanent goes to GY from battlefield
  Condition check: it had NO +1/+1 counters on it when it died
  If no counters: return to battlefield with ONE +1/+1 counter
  If it already had a +1/+1 counter: undying doesn't trigger (condition fails)

PERSIST + CONDITION TIMING:
  The counter check is at the TIME OF DEATH (when it was on the battlefield, just before moving to GY)
  Intervening-if clause (CR 603.4): checked at trigger time AND resolution
  At trigger: no counters → trigger fires
  At resolution: checked again? Actually, for persist/undying — the condition is at the time of dying
  The card is now in GY when the trigger resolves — but the check was already made

PERSIST + COUNTER REMOVAL:
  If the creature dies with a -1/-1 counter: persist doesn't fire
  Remove the -1/-1 counter BEFORE it dies: persist fires again
  Classic interaction: Kitchen Finks + Melira, Sylvok Outcast (creatures can't get -1/-1 counters):
    Kitchen Finks with persist dies → tries to enter with -1/-1 counter → Melira prevents it → enters with no counter
    NOW persist is ready to fire again (it has no -1/-1 counter!)
    This creates an INFINITE loop: Kitchen Finks dies → returns (Melira stops the counter) → dies again → returns
    Each return: Kitchen Finks's ETB fires (gain 2 life). Infinite life gain!
    Win condition: Kitchen Finks + Melira + Viscera Seer (sacrifice, scry) = infinite life + infinite scries → draw library

UNDYING + COUNTER REMOVAL:
  Undying creature has +1/+1 counter: undying spent (won't trigger on next death)
  Remove the +1/+1 counter: undying is "reset" (no counter → will undying again)
  Mikaeus, the Unhallowed ({3}{B}{B}{B}): legendary, "Whenever a Human creature is put into a GY from the battlefield, return it from exile instead... Non-Human creatures get +1/+1 and Undying."
    Mikaeus gives ALL non-Humans on your board +1/+1 AND Undying
    Your creatures die → undying fires → return with +1/+1 counter
    When they die again (with +1/+1 counter): undying doesn't fire
    But: Mikaeus gave them +1/+1 ON TOP of being on battlefield... hmm
    Mikaeus gives a continuous +1/+1 (layer 7c) to non-humans
    When they die: do they have a +1/+1 COUNTER? The Mikaeus bonus is NOT a counter — it's a continuous effect
    So undying checks for +1/+1 COUNTERS (not continuous effects): a creature pumped by Mikaeus has NO +1/+1 counter
    When it dies: undying triggers → returns with a +1/+1 counter
    Now it has one +1/+1 counter: undying won't fire again... unless the counter is removed

PERSIST + UNDYING COMBO (same creature):
  If a creature has both Persist AND Undying: interesting interaction
  It has no -1/-1 counters AND no +1/+1 counters: both conditions are met
  When it dies: BOTH persist and undying trigger
  Both triggers on stack: resolve one first
    First trigger: returns creature with -1/-1 counter (if persist resolves first)
    Second trigger: tries to return creature, but creature is ALREADY on battlefield (new object now)
    The second trigger references the card in GY — but the card moved to the battlefield
    The second trigger has nothing to return (the card is no longer in GY)
    Net result: creature returns once with either a -1/-1 or +1/+1 counter (whichever trigger resolved first)
  If the creature has both counters now: neither persist nor undying will trigger on next death (both conditions fail)

PERSIST CARDS:
  Kitchen Finks ({1}{G/W}{G/W}): 3/2, "when enters, gain 2 life" + Persist.
    ETB: gain 2 life. When dies: persist fires, returns with -1/-1 → becomes 2/1, gain 2 life again.
    Total: 4 life gained, blocks twice.
    With Melira: infinite life gain combo.

  Murderous Redcap ({2}{B/R}{B/R}): 2/2, "when enters, deal X damage to any target" (X = its power) + Persist.
    ETB: deal 2 damage. Persist: return as 1/1, ETB deals 1 damage.
    Total: 3 damage AND two blockers.
    With Melira + sacrifice outlet: infinite damage (Redcap ETB fires → damage, sacrifice, persist, repeat).

UNDYING CARDS:
  Strangleroot Geist ({G}{G}): 2/1 Haste + Undying.
    Attacks for 2, dies: returns as 3/2 haste. Attacks for 3 more before dying again.
    Total: 5 damage over two "lives." Efficient aggressive threat.

  Young Wolf ({G}): 1/1 + Undying.
    1 mana 1/1 that comes back as 2/2. Excellent two-for-one on a 1-mana creature.
```

## Definitive Conclusions

- **Persist returns with a -1/-1 counter** if it had no -1/-1 counters when it died.
- **Undying returns with a +1/+1 counter** if it had no +1/+1 counters when it died.
- **Counter removal resets** both abilities — removing the counter lets them trigger again on the next death.
- **Mikaeus grants undying to non-Humans** via a continuous effect (not a counter), so undying still triggers.
- **Persist + Melira + sacrifice outlet** = infinite loop with Kitchen Finks (infinite life) or Murderous Redcap (infinite damage).

## Canonical Example
**Melira Combo (Modern/Legacy):**
Battlefield: Melira, Sylvok Outcast ("creatures can't get -1/-1 counters"), Viscera Seer (sacrifice a creature, scry 1), Kitchen Finks (3/2, gain 2 life ETB, Persist).
Sacrifice Kitchen Finks to Viscera Seer: scry 1.
Kitchen Finks dies → Persist triggers → tries to return with -1/-1 counter → Melira prevents the counter.
Kitchen Finks enters the battlefield with NO -1/-1 counter (Melira stopped it).
ETB: gain 2 life.
Kitchen Finks is now back on battlefield, persist is "active" again (no counter).
Sacrifice it again to Viscera Seer: scry 1. Repeat.
Result: infinite life, infinite scries (see entire library), infinite sacrifice triggers.
With Altar of Dementia (sac to mill) instead of Seer: mill opponent's entire library.

**Example 2 — Mikaeus Undying Engine:**
Battlefield: Mikaeus, the Unhallowed (gives non-Humans +1/+1 and undying).
Creature: Puppeteer Clique (non-Human 3/2, "when enters, take control of target creature from opponent's GY until EOT, then exile it").
Puppeteer Clique ETB: steal a creature from opponent's GY.
Puppeteer Clique is destroyed: Undying triggers (Clique had no +1/+1 COUNTER despite Mikaeus's pump).
Returns as 4/3 with a +1/+1 counter.
ETB again: steal another creature from opponent's GY!
One more death: Undying doesn't fire (has +1/+1 counter now).
But: Mikaeus is on the board → Clique gets Mikaeus's continuous +1/+1 boost (layer effect), not a counter.
Wait: Mikaeus's grant of undying is what matters. The +1/+1 counter from undying stops THAT path.
Remove the counter (via Mikaeus's own +1/+1 COUNTER from undying being negated?): complex interaction.
Simplified: Mikaeus + any death-trigger creature = ETB fires twice per creature (once normal, once from undying).

## Commonly Confused With
- **P227 (Wither)** — Wither deals damage as -1/-1 counters; putting wither damage on a persist creature loads it with -1/-1 counters, preventing future persist triggers.
- **P228 (Unearth)** — Unearth is a manually activated ability to return from GY; Persist/Undying are automatic death triggers.
- **P157 was not explicitly created** — Persist and Undying are the "return from death" canonical pair. Compare to Haunt (P238), which exiles and triggers on ANOTHER creature's death.
