---
id: p412
name: Mutate Pile + Persist/Undying — One Death Event, Only the Persist Card Returns
category: zones
cr_refs: [729.3, 702.79a, 702.88a, 702.140e, 702.140d]
tags: [mutate, persist, undying, merged-permanent, one-death-event, pile-death, persist-returns-only-one, undying-returns-only-one, -1/-1-counters-on-merged, +1/+1-counters-on-merged, Ikoria, Shadowmoor, Tariel-Reckoner, Vorapede, Glen-Elendra-Archmage, Kitchen-Finks, Nethroi-pile, persist-not-full-pile, undying-not-full-pile, mutate-graveyard]
created: 2026-03-29
examples_count: 2
---

# P412 — Mutate Pile + Persist/Undying — One Death Event, Only the Persist Card Returns

## Abstract
When a **merged mutate permanent** dies, CR 729.3 says **one permanent leaves the battlefield** and all individual component cards go to their appropriate zones (usually all to the graveyard). This is one death event — not multiple. If any card in the merged pile has **persist** or **undying**, those abilities trigger from the merged permanent's death. However, the persist/undying trigger says "return **it** to the battlefield" — "it" refers to the specific **card** with persist/undying, not the entire pile. The other cards in the pile remain in the graveyard. The persist/undying card re-enters as a standalone creature, **not** as a merged pile. Additionally, whether persist/undying triggers at all depends on whether the merged permanent had -1/-1 counters (persist) or +1/+1 counters (undying) — these counter checks apply to the **merged permanent as a whole**, not to individual component cards.

## The Definitive Rules

**CR 729.3** (verbatim): *"If a merged permanent leaves the battlefield, one permanent leaves the battlefield and each of the individual components are put into the appropriate zone."*

**CR 702.79a** (verbatim): *"Persist is a triggered ability. 'Persist' means 'When this permanent is put into a graveyard from the battlefield, if it had no -1/-1 counters on it, return it to the battlefield under its owner's control with a -1/-1 counter on it.'"*

**CR 702.88a** (verbatim, undying): *"Undying is a triggered ability. 'Undying' means 'When this permanent is put into a graveyard from the battlefield, if it had no +1/+1 counters on it, return it to the battlefield under its owner's control with a +1/+1 counter on it.'"*

**CR 702.140e** (verbatim): *"A mutated permanent has all abilities of each card and token that represents it. Its other characteristics are derived from the topmost card or token."*

## The Pattern

```
ONE DEATH EVENT FOR THE MERGED PILE (729.3):
  When the merged permanent dies:
    → ONE permanent leaves the battlefield.
    → All component cards go to their zones (usually all to GY, per 729.3a: "player
      may arrange any number of cards in the order they want. Cards not arranged
      remain in the order they were in.").
  This is one death event. "Dies" triggers fire once.
  Afterlife (P400): triggers once, not once per component.
  Persist: triggers once (for the merged permanent that died).
  Undying: triggers once.

PERSIST TRIGGER FIRES FROM THE MERGED PERMANENT:
  The merged permanent "had" persist (702.140e: all abilities from all cards).
  When it's "put into a graveyard from the battlefield": persist trigger fires.
  Persist trigger checks: "if it had no -1/-1 counters on it."
    "It" = the merged permanent before it died.
    If the merged permanent had ANY -1/-1 counters (from any source, including from
      a previous persist return on one of the component cards), persist doesn't trigger.
    If the merged permanent had no -1/-1 counters: persist triggers.

  THE KEY RULE — "RETURN IT TO THE BATTLEFIELD":
    Persist: "return it to the battlefield."
    "It" = the card with persist.
    When the merged pile died, all components went to GY separately (729.3).
    "Return it" refers back to the source of the triggered ability —
      the specific card with persist.
    Only that card returns to the battlefield. It enters as a standalone creature.
    The other components in the pile remain in the GY.

  WHY THIS IS NON-OBVIOUS:
    Players often think: "the merged permanent had persist, so the whole pile returns."
    OR: "persist applies to each card separately, so each one with persist returns."
    Both are wrong. The pile was ONE permanent. ONE persist trigger fired.
    The trigger returns ONE thing: the card whose persist triggered.

UNDYING AND THE SAME PRINCIPLE:
  Identical reasoning for undying (702.88a).
  Undying checks if the merged permanent had no +1/+1 counters.
  If the merged pile had even ONE +1/+1 counter (from any source): undying doesn't fire.
  If triggered: returns only the card with undying to the battlefield with a +1/+1 counter.

MULTIPLE PERSIST/UNDYING IN THE PILE:
  702.140e: "all abilities of each card" — the merged permanent has all instances.
  If multiple cards in the pile have persist: the merged permanent has multiple
    instances of persist.
  When the merged permanent dies: each persist instance triggers separately.
  EACH trigger fires (if the counter condition was met).
  EACH trigger returns its own card: "return it" = the card that has that particular ability.
  But: "a triggered ability's controller chooses which object the trigger is linked to."
    Actually, this is cleaner: each persist ability is linked to the card it came from
    (per 607, "Linked Abilities"). Each persist trigger returns its source card.
  RESULT: If cards A and B both have persist in the pile:
    Both persist triggers fire.
    Trigger from A's persist: returns card A.
    Trigger from B's persist: returns card B.
    Net: both cards return as separate standalone creatures!

  MULTIPLE PERSIST INTERACTING:
    The merged permanent had NO -1/-1 counters (condition for ALL persist triggers to fire).
    Both return. Both enter with -1/-1 counters (each has its own -1/-1 counter from its own return).
    Cards C, D, E (other pile components) remain in GY.

COUNTER CHECK ON THE MERGED PERMANENT:
  Persist condition: "if it had no -1/-1 counters."
  The merged permanent is ONE permanent. Counter checks apply to the WHOLE permanent.
  Example:
    Top card: Vorapede (5/4 vigilance trample undying; no counters)
    Bottom card: Kitchen Finks (3/2 "when Kitchen Finks enters, gain 2 life"; persist)
    The merged permanent: 5/4 trample (topmost), all abilities from both.
    Counters: whatever the merged permanent has accumulated.
  If the merged permanent was returned by its own persist once already:
    It came back with a -1/-1 counter.
    Now the merged permanent has a -1/-1 counter.
    It dies again. Persist fires: "if it had no -1/-1 counters." It DID have counters.
    Persist does NOT trigger. Neither card returns.
  This is the standard "persist prevents double-return" mechanic.

MUTATE PILE DYING AND PERSIST COUNTERS EDGE CASE:
  What if the pile was built AFTER a persist card returned (already has -1/-1 counter)?
    Kitchen Finks returned via persist: now has -1/-1 counter. It's a 2/1 in play.
    You cast Migratory Greathorn (mutate {1}{G}) targeting Kitchen Finks.
    Merged pile: Greathorn (top) + Kitchen Finks (with -1/-1 counter, bottom).
    The -1/-1 counter from Kitchen Finks is on the merged permanent (counters stay with
      the permanent through merging per 729.2c: "it hasn't just come under a player's control,
      any continuous effects that affected it continue to do so").
    The merged permanent has a -1/-1 counter.
    It dies. Persist fires: "if it had no -1/-1 counters." It DID. Persist doesn't fire.
    Woops: you lost your Kitchen Finks's persist recursion by building a pile on top of it.

  LESSON: Mutating onto a persist creature that already has -1/-1 counters permanently
    disables persist for the resulting pile (until the -1/-1 counter is removed).

UNDYING PILE — SPECIFIC:
  Undying creatures want NO +1/+1 counters.
  If you mutate onto an undying creature and give the merged permanent +1/+1 counters
    (e.g., via Migratory Greathorn's "search library for basic land" that inadvertently
    ...actually Greathorn doesn't add counters):
  But: if any effect puts +1/+1 counters on the merged permanent, undying is disabled.
  Be careful with persist/undying + counter-adding effects on merged permanents.

PERSIST/UNDYING RETURNED CARD RE-ENTERING:
  The card with persist returns "to the battlefield under its owner's control."
  It's a standalone creature now (not merged).
  Its ETBs fire normally. (It's a fresh ETB — the returned card enters the battlefield.)
  Kitchen Finks ETB: "when Kitchen Finks enters, gain 2 life." Fires. Gain 2 life.
  If you want to rebuild the mutate pile: cast a new mutate spell targeting the returned card.
```

## Definitive Conclusions

- **Only the card with persist/undying returns — not the whole pile** — CR 729.3 sends all components to their zones on death; persist's "return it" refers to the specific card whose persist triggered; other pile components stay in GY.
- **Multiple persist/undying cards in a pile each trigger separately** — the merged permanent has all abilities (702.140e); each persist instance is linked to its own card; each can return its own card if the counter condition is met.
- **Counter checks apply to the MERGED permanent, not individual cards** — if the merged permanent has a -1/-1 counter (from any source, including a prior persist return of a component card), persist doesn't trigger for the entire merged permanent.
- **Mutating onto a persist/undying creature that already has counters permanently suppresses those abilities** — the existing counters carry onto the merged permanent via 729.2c (continuity of the object); persist/undying won't fire if the counter condition fails.
- **Returned cards re-enter standalone** — the persist/undying card returns as an independent creature with its own ETB; the pile is rebuilt only if you cast new mutate spells.

## Canonical Example
**Glen-Elendra Archmage Mutate Pile:**
Glen-Elendra Archmage ({3}{U}: 2/2 faerie wizard, persist, "{U}, sacrifice Glen-Elendra Archmage: counter target noncreature spell"):

You mutate Illuna, Apex of Wishes ({2}{G}{U}{R}: 6/6 flying trample, mutate {3}{R/G}{U}{U}, "when this creature mutates, exile cards until you hit a nonland permanent, put it in play") onto Glen-Elendra Archmage.

Merged pile: Illuna (top) + Glen-Elendra (bottom).
Characteristics: 6/6 flying trample (Illuna), with all Glen-Elendra abilities INCLUDING persist AND the sacrifice-to-counter ability.

The merged permanent dies (opponent's Cyclonic Rift overloaded — wait, overloaded CRift bounces, not destroys. Let's say they cast Wrath of God instead.)

Wrath of God destroys all creatures. The merged permanent is destroyed.
CR 729.3: one permanent leaves the battlefield. Both Illuna and Glen-Elendra go to GY.

Persist triggers from the merged permanent (all abilities = persist is on the merged permanent).
Condition: did the merged permanent have -1/-1 counters? Assume no → persist triggers.

Persist resolves: "return it to the battlefield" — "it" = Glen-Elendra Archmage (the card with persist).
Glen-Elendra Archmage returns with a -1/-1 counter: now 1/1 in play.
Glen-Elendra's ETB fires (wait, Glen-Elendra doesn't have an ETB — just the persist and sacrifice ability).

Illuna is in the GY. Glen-Elendra is in play (standalone 1/1).

Illuna in GY: can it be cast? No — it's just in the GY waiting for normal casting.
Glen-Elendra in play: can still counter noncreature spells by sacrificing itself.
If Glen-Elendra is sacrificed (to counter a spell): it goes to GY. Persist fires again? NO — it has a -1/-1 counter now. Persist won't fire a second time.

To rebuild the pile: cast Illuna again (or another mutate creature) targeting Glen-Elendra.

**Example 2 — Kitchen Finks + Vorapede Pile Counter Interaction:**
Kitchen Finks ({1}{G/W}{G/W}: 3/2, persist, "when Kitchen Finks enters, gain 2 life"):
You control Kitchen Finks. It died once: returned from persist with -1/-1 counter: now 2/1.

You want to build a mutate pile. Cast Migratory Greathorn ({2}{G}: 3/4; mutate {1}{G}; "when this creature mutates, search for basic land, put in play tapped").

Cast using mutate cost, targeting Kitchen Finks (now 2/1 with -1/-1 counter).
Mutate trigger fires: search for a basic land (Forest). Tap, put in play.
Merged pile: Greathorn (top) + Kitchen Finks (with -1/-1 counter, bottom).
Counters on merged permanent: the -1/-1 counter from Kitchen Finks persists onto the merged permanent (per 729.2c).

Merged permanent stats: 3/4 (Greathorn topmost) minus -1/-1 counter = effectively 2/3 power/toughness in layer 7c.

Opponent kills the merged permanent.
Persist on the merged permanent triggers (from Kitchen Finks's persist ability).
Condition: "if it had no -1/-1 counters on it." The merged permanent DID have a -1/-1 counter.
Persist DOES NOT trigger. Both Greathorn and Kitchen Finks go to GY and stay there.

LESSON: If you mutate onto a Kitchen Finks that already returned once, you lose the persist recursion forever (unless a separate effect removes the -1/-1 counter before death).

Correct play: build the pile on a FRESH Kitchen Finks (no -1/-1 counter).
Then the merged permanent has no -1/-1 counters → persist works → Kitchen Finks returns on death → enter the battlefield alone → gain 2 life → rebuild pile next turn.

## Commonly Confused With
- **P403 (Mutate)** — P403 establishes that merged permanents have all abilities from all cards and die as one event. P412 zooms into the specific persist/undying interaction that makes the "return it" wording non-obvious.
- **P391 (Persist/Undying/Evolve)** — P391 covers how persist and undying work on standalone creatures. P412 extends this to the merged-permanent scenario where the source of persist is only one component of a multi-card object.
- **P005 (Simultaneous Deaths and Trigger Ordering)** — When the pile dies, there's one death event but potentially multiple persist/undying triggers if multiple cards in the pile have those abilities. Those triggers all go on the stack and resolve in APNAP order.
- **P400 (Afterlife)** — Afterlife on a merged permanent also triggers once (one death event). Like persist, if multiple cards in the pile have afterlife, all instances trigger — but each creates tokens, not returns cards. The combined afterlife token count = sum of all afterlife N values in the pile.
