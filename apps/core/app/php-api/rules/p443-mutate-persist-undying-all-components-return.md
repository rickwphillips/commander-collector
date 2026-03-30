---
id: p443
name: Mutate + Persist/Undying — Merged Stack Death and All-Components Return with Counters
category: zones
cr_refs: [729.3, 729.3c, 702.79a, 702.93a, 400.7, 122.2]
tags: [mutate, persist, undying, merged-permanent, all-components-return, zone-separation, minus-one-counter, plus-one-counter, demerge-on-death, kitchen-finks-mutate, persist-tracking, undying-tracking, counter-reset, 729-3c, Ikoria]
created: 2026-03-29
examples_count: 2
---

# P443 — Mutate + Persist/Undying — Merged Stack Death and All-Components Return with Counters

## Abstract
When a merged mutated permanent with **persist** (or undying) dies, CR 729.3c governs what returns: the persist/undying trigger tracks the merged permanent, finds ALL component cards in the graveyard, and takes the same return action on **each** of them. Every component card returns to the battlefield as its own individual creature with a -1/-1 counter (persist) or +1/+1 counter (undying). The stack permanently de-merges — the cards are no longer merged and each must be mutated back together deliberately. The key interactions: (1) **only one persist/undying trigger fires** (one permanent died), but (2) **ALL components are returned** per 729.3c; (3) each component gets the counter, not just the one that had persist/undying; (4) on subsequent deaths, each component's OWN persist/undying ability (if any) governs whether it re-triggers, checked on that individual card.

## The Definitive Rules

**CR 702.79a** (verbatim, persist): *"Persist is a triggered ability. When a permanent with persist is put into a graveyard from the battlefield, if it had no -1/-1 counters on it, return it to the battlefield under its owner's control with a -1/-1 counter on it."*

**CR 702.93a** (verbatim, undying): *"Undying is a triggered ability. When a permanent with undying is put into a graveyard from the battlefield, if it had no +1/+1 counters on it, return it to the battlefield under its owner's control with a +1/+1 counter on it."*

**CR 729.3** (verbatim): *"If a merged permanent leaves the battlefield, one permanent leaves the battlefield and each of the individual components are put into the appropriate zone."*

**CR 729.3c** (verbatim): *"If an effect can find the new object that a merged permanent becomes as it leaves the battlefield, it finds all of those objects. (See rule 400.7.) If that effect causes actions to be taken upon those objects, the same actions are taken upon each of them."*

**CR 122.2**: Counters are placed on the specific returning object, not inherited from the previous merged state.

## The Pattern

```
PERSIST/UNDYING TRIGGER FOR A MERGED PERMANENT:

Step 1 — DEATH (729.3):
  Merged permanent with persist (from one component) dies with no -1/-1 counters.
  "One permanent leaves the battlefield."
  Persist trigger fires ONCE (for the one permanent that died).
  "Each individual component is put into the appropriate zone" → all go to GY.

  Counter check: "if it had no -1/-1 counters on it"
    This checks the merged permanent's state immediately before it died (LKI).
    The merged permanent's characteristics come from the TOPMOST component (729.2a).
    -1/-1 counters are on the permanent AS A WHOLE (not on individual components separately).
    If the merged permanent had no -1/-1 counters: persist trigger fires.

Step 2 — WHICH OBJECT DOES PERSIST RETURN? (729.3c):
  Persist says "return IT to the battlefield."
  "It" is tracking language: the effect tracks the merged permanent.
  Per 729.3c: the effect finds ALL component cards (the new objects the merged permanent became).
  ALL component cards are in the GY (step 1).
  Per 729.3c: "the same actions are taken upon each of them."
  Action: "return to the battlefield under its owner's control with a -1/-1 counter on it."
  EACH component card returns with a -1/-1 counter.

RESULT:
  N component cards return to the battlefield as separate creatures.
  Each has a -1/-1 counter.
  They are NOT merged (no mutate spell was cast to merge them).
  Each is its own permanent.

SUBSEQUENT DEATHS:
  Each individual component now has a -1/-1 counter.
  If component A has persist: "when this permanent is put into a GY, if it had no -1/-1 counters."
    It ALREADY HAS a -1/-1 counter. Persist does NOT trigger. No return.
  If component B has no persist: no return regardless.
  The stack has been permanently de-merged, and the persist component has used its "life."

  EXCEPTION: -1/-1 counter removal (Fate Transfer, Renewing Touch, wither cancellation):
    Remove the -1/-1 counter from the persist component: it can return again on next death.
    See P428: wither places -1/-1 counters and +1/+1 counters cancel -1/-1 counters.
    Wither damage to the returned persist creature: each point of wither places a -1/-1 counter.
    If a +1/+1 counter is placed on the creature with the -1/-1 counter: they cancel (SBA).
    Canc sellation via P428 wither/counter interaction effectively "resets" persist again.

UNDYING + MUTATE:
  Same logic. Undying checks "if it had no +1/+1 counters on it."
  If no +1/+1 counters on merged permanent: undying fires.
  ALL components return, each with a +1/+1 counter.
  On subsequent deaths: each component with undying checks ITS OWN +1/+1 counters.
    If the component that had undying returns with a +1/+1 counter and then dies:
    it now HAS a +1/+1 counter → undying does NOT trigger again.

PERSIST ONLY IN ONE COMPONENT:
  Only one component has persist. The trigger fires once (for the merged permanent dying).
  Via 729.3c, ALL components return.
  After return: each component has a -1/-1 counter. The single persist component can't
    re-trigger (it has the -1/-1 counter). Components without persist: also no re-trigger.

WHAT IF PERSIST IS IN MULTIPLE COMPONENTS?
  The merged permanent has persist from BOTH components (702.140e: all abilities apply).
  When it dies: the same persist trigger fires once (it's the same trigger; having it from
    two sources still creates one trigger per death event? Actually: each instance of persist
    is a separate triggered ability. 702.79a: "persist is a triggered ability." With 2 instances,
    2 triggers fire when the merged permanent dies.
  Two persist triggers: each trigger finds all components (729.3c). Each trigger tries to
    return all components with a -1/-1 counter.
  First trigger resolves: all components return with -1/-1 counters (now on battlefield).
  Second trigger: tries to return them again. But the components are now on the battlefield
    (not in GY). The return effect can't find them in the GY → second trigger does nothing.
  Wait: are the components "in the GY" when the second trigger resolves? They returned after
    the first trigger. So when the second trigger resolves, they're on the battlefield.
    "Return target permanent from GY to battlefield" — they're not in the GY anymore.
    The second trigger fizzles.
  RESULT: two persist instances don't cause double-return.

MERGED PERMANENT WITH -1/-1 COUNTER ALREADY (WITHER DAMAGE):
  If the merged permanent had wither/infect damage applied (placing -1/-1 counters):
  P428: damage placed as -1/-1 counters (not marked damage).
  If the merged permanent has a -1/-1 counter when it dies: persist DOES NOT trigger.
  This is an important interaction: wither damage to a mutated persist creature permanently
  "uses up" the persist (disables it on death). Same as P428's discussion of wither + persist.
```

## Definitive Conclusions

- **Persist/undying fires once but returns ALL component cards** — one trigger for one merged permanent dying; CR 729.3c causes all N components to be returned by that single trigger; each gets a -1/-1/+1/+1 counter.
- **After return, components are permanently de-merged** — each is its own creature; the mutate stack must be rebuilt with explicit mutate casts.
- **Each returned component with a -1/-1 counter can't re-trigger persist immediately** — the counter condition prevents re-triggering until the counter is removed.
- **Wither/infect damage to a merged persist permanent permanently disables its persist** — -1/-1 counters placed by wither (not marked damage) are on the merged permanent; if it has those counters when it dies, persist doesn't trigger. (P428 interaction.)
- **Multiple persist instances don't cause double-return** — the second trigger resolves after the first has already returned the components to the battlefield; the components are no longer in the GY; the second trigger does nothing.

## Canonical Example
**Gemrazer (top, 4/4 reach trample; no persist) + Kitchen Finks (bottom; 3/2 gain-life-on-ETB; persist) merged permanent:**

The merged permanent: characteristics from Gemrazer (4/4, reach, trample, green). Abilities from both: reach, trample, Kitchen Finks' ETB (gain 2 life when it enters), persist.

Opponent casts Doom Blade: destroy target nonblack creature. The merged permanent is destroyed.
Merged permanent goes to GY. Both components — Gemrazer and Kitchen Finks — are put into the GY (729.3).

Persist trigger fires: "When Kitchen Finks is put into a graveyard from the battlefield, if it had no -1/-1 counters on it, return it to the battlefield."
The merged permanent had no -1/-1 counters. Trigger fires.

At resolution: persist finds ALL component cards (729.3c). Gemrazer and Kitchen Finks are in the GY.
Both are returned to the battlefield, each with a -1/-1 counter.

Result: You now have:
- Gemrazer (3/3 after -1/-1 counter): reach, trample. No persist on this card.
- Kitchen Finks (2/1 after -1/-1 counter): ETB triggers "you gain 2 life" when it enters. Has persist — but the -1/-1 counter means persist won't re-trigger if it dies.

ETBs fire:
- Kitchen Finks: "When this creature enters, you gain 2 life." (2 life gained.)
- Gemrazer: "Whenever this creature mutates, destroy target artifact or enchantment." (Did it mutate? NO — it entered, didn't mutate.) No ETB from Gemrazer if it only has a mutate trigger.

Net: you lost the merged 4/4 but got back a 3/3 and a 2/1 with lifelink.

**Example 2 — Wither disabling persist on merged permanent:**
Merged permanent: Spike Feeder (2/2 persist; remove +1/+1 counter: gain 2 life) mutated under Gemrazer (4/4 reach trample on top).

Opponent's wither creature attacks: deals 4 wither damage to the merged permanent.
Wither damage places four -1/-1 counters on the merged permanent (P428).
P/T affected: Gemrazer base 4/4, -4/-4 from counters = 0/0. SBA: toughness 0 → dies.
Merged permanent has -1/-1 counters. Goes to GY with -1/-1 counters on it.
Persist: "if it had no -1/-1 counters on it" — it DID have -1/-1 counters. Persist DOES NOT trigger.
Neither component returns. The stack is permanently in the GY.
Opponent's wither creature effectively "countered" your persist.

## Commonly Confused With
- **P441 (Mutate)** — P441 covers general mutate mechanics. P443 covers specifically what persist/undying does when the merged permanent dies: trigger fires once, all components return (729.3c), each with a counter.
- **P442 (Mutate + Blink)** — Same 729.3c principle: both blink and persist/undying return all component cards separately. The key difference is that blink's "exile and return" gives each component a fresh ETB; persist/undying's "GY and return" also gives each component its ETB. Both rely on 729.3c for all-components return.
- **P428 (Wither/Infect)** — Wither damage disabling persist on a merged permanent is the direct application of P428. Wither places -1/-1 counters on the permanent; if the merged permanent dies with those counters, persist doesn't trigger. Same principle applies to individual unmerged persist creatures.
- **P426 (Champion + persist/undying counter reset)** — Champion exiles (not GY), so persist doesn't trigger on exile (different scenario). P443 covers GY-involved scenarios where persist does trigger but multiple components return.
