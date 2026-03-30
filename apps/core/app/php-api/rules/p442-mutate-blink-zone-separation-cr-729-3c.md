---
id: p442
name: Mutate + Blink — Merged Permanent Zone Separation and CR 729.3c All-Components Return
category: zones
cr_refs: [729.3, 729.3c, 400.7, 702.140c, 702.140d]
tags: [mutate, blink, flicker, zone-separation, all-components-return, demerge, ETB-per-component, Ephemerate, Restoration-Angel, Thassa-Deep-Dwelling, merged-permanent, individual-ETBs, 729-3c, new-object, Gemrazer, Pouncing-Shoreshark, Ikoria]
created: 2026-03-29
examples_count: 2
---

# P442 — Mutate + Blink — Merged Permanent Zone Separation and CR 729.3c All-Components Return

## Abstract
When a blink effect (Ephemerate, Restoration Angel, Thassa, Deep-Dwelling) targets a merged mutated permanent, **CR 729.3c explicitly governs the result**: the effect finds ALL component cards in exile and takes the same return action on EACH of them. The merged permanent de-merges completely — every component card enters the battlefield separately as its own individual creature, each triggering its own ETBs. This is the opposite of what most players expect (either "only one card returns" or "the whole merged stack returns as one merged permanent"). The correct result: a 3-card mutate stack that is blinked yields three separate creatures entering the battlefield, each with their own ETBs, none merged. This can be exploited deliberately (force ETBs from the whole stack) or cause confusion when blink is used for protection.

## The Definitive Rules

**CR 729.3** (verbatim): *"If a merged permanent leaves the battlefield, one permanent leaves the battlefield and each of the individual components are put into the appropriate zone."*

**CR 729.3c** (verbatim): *"If an effect can find the new object that a merged permanent becomes as it leaves the battlefield, it finds all of those objects. (See rule 400.7.) If that effect causes actions to be taken upon those objects, the same actions are taken upon each of them."*

**CR 400.7** (tracking through zone changes): Effects that refer to a specific object by tracking language (it, that creature) continue to track the object after zone changes per 400.7.

## The Pattern

```
THE BLINK PROCESS FOR MERGED PERMANENTS:

Step 1 — EXILE (729.3):
  Blink effect (Ephemerate: "Exile target creature you control, then return it...")
  targets the merged permanent (one object on the battlefield).
  Merged permanent leaves the battlefield.
  "Each of the individual components are put into the appropriate zone."
  All component cards go to EXILE (the zone the blink effect specifies).
  Now in exile: N separate cards, each a new object (CR 400.7).
  These are not merged — they are individual cards in exile.

Step 2 — RETURN (729.3c):
  "If an effect can find the new object that a merged permanent becomes as it leaves
   the battlefield, it finds ALL of those objects."
  Ephemerate says "return IT to the battlefield."
  "It" is tracking language. The effect can find the new objects the merged permanent
    became → finds ALL N component cards in exile.
  "If that effect causes actions to be taken upon those objects, the SAME ACTIONS are
   taken upon each of them."
  Action: "return to the battlefield under its owner's control."
  Each component card is returned to the battlefield separately.

RESULT:
  A merged permanent with N cards, when blinked:
    - N separate creatures enter the battlefield (one per component card)
    - Each is its own individual permanent (not merged)
    - Each enters the battlefield FRESH → ETBs fire for each individual creature
    - The "whenever this creature mutates" triggers do NOT fire (no mutation occurred)
    - Each has summoning sickness (they all just entered the battlefield)
    - None of them are merged to each other (they enter as separate permanents)

ETBs FIRE PER COMPONENT:
  Each component enters individually, triggering "when this creature enters" on itself.
  AND: "whenever a creature enters" triggers on other permanents fire separately for each.
  Pouncing Shoreshark enters: "whenever this creature mutates, bounce a creature" does NOT fire
    (it didn't mutate). But its own ETB fires if it has one.
  Gemrazer enters: its mutate trigger does NOT fire. But its regular ETB fires if it has one.
  Gilded Goose enters (from a base creature): it's now a 0/2 Bird again with its own abilities.

COMPARING TO NORMAL BLINK:
  Normal blink (non-mutated creature): one creature goes to exile, one creature returns.
  Mutate blink: one merged permanent goes to exile (as multiple cards), each returns separately.
  The number of permanents changes: you go from 1 merged permanent to N separate permanents.

WHY THIS IS COUNTERINTUITIVE:
  Most players assume one of two wrong things:
    (a) "Only the top card returns" — wrong; 729.3c says ALL objects are found.
    (b) "The whole merged stack comes back as a merged permanent" — wrong; they enter
        separately and are NOT merged (no mutate spell was cast to merge them).
  The correct answer requires knowing CR 729.3c, which is a specific carve-out rule.

EXPLOITING THIS INTENTIONALLY:
  A mutate stack with multiple ETB abilities: blink it to fire ALL ETBs simultaneously.
  Example: Illuna (6/6 flying trample; "when this creature mutates, exile cards until you exile
    a nonland permanent, put it on battlefield or hand") stacked on Gemrazer (4/4 reach trample;
    "when this creature mutates, destroy target artifact or enchantment") stacked on a base creature.
  Ephemerate blinks the merged permanent:
    - All 3 enter separately
    - Illuna's "when it mutates" trigger: DOESN'T fire (didn't mutate)
    - Gemrazer's "when it mutates" trigger: DOESN'T fire (didn't mutate)
    - But if Illuna or Gemrazer have "when this creature enters" ETBs: those DO fire
  This is less powerful than it sounds: mutate-specific triggers don't fire; only
  normal "when this creature enters" abilities (if any) trigger.

DEFENSIVE USE (PROTECTION FROM REMOVAL):
  You target the merged permanent with blink to protect it from targeted removal.
  The blink exiles it (saving from removal), then all components return separately.
  The "protection" works — the removal misses — but you pay the cost of de-merging.
  Rebuild the mutate stack by casting mutate spells on subsequent turns.
```

## Definitive Conclusions

- **When a blink effect targets a merged permanent, ALL component cards return to the battlefield separately** — CR 729.3c explicitly states the effect finds all new objects the merged permanent became, and the same return action is taken on each.
- **Each component enters as its own individual permanent** — they are NOT merged upon return; they enter as separate creatures with their own ETBs.
- **"Whenever this creature mutates" triggers do NOT fire on return** — the components didn't mutate; they entered normally; only "when this creature enters" abilities trigger.
- **The merged permanent de-merges completely** — a 3-card mutate stack becomes 3 separate creatures; the merged abilities (bottom cards' abilities accessible on the top) are lost.
- **This can be exploited for ETBs** — if component cards have "when this creature enters" abilities, blinking the merged stack triggers all of them simultaneously.

## Canonical Example
**Pouncing Shoreshark (top) + Gemrazer (middle) + base 2/2 creature (bottom):**
The merged permanent on the battlefield is a Pouncing Shoreshark 4/3 flash, with reach+trample from Gemrazer and the base creature's abilities.

Opponent plays Wrath of God (destroy all creatures). You respond with Ephemerate: "Exile target creature you control, then return it to the battlefield under its owner's control."

Step 1 — Exile: Merged permanent leaves. Each component goes to exile:
  Exile zone now contains: Pouncing Shoreshark, Gemrazer, base 2/2 creature.

Step 2 — Wrath of God resolves: no creatures on battlefield. Nothing to destroy.

Step 3 — Ephemerate's "return" resolves: finds ALL three objects (CR 729.3c).
  Pouncing Shoreshark enters the battlefield (new object; no mutation).
    Flash (irrelevant at this point). No mutate trigger fires.
    Pouncing Shoreshark's "when it mutates, bounce a creature": does NOT trigger.
  Gemrazer enters the battlefield (new object; no mutation).
    Reach, trample. No mutate trigger fires.
    Gemrazer's "when it mutates, destroy artifact or enchantment": does NOT trigger.
  Base 2/2 creature enters the battlefield (new object).
    If the base had an ETB ("when this creature enters"): it DOES trigger.

Result: 3 separate creatures on the battlefield. None merged. Wrath was dodged.
To rebuild: cast mutate spells again on subsequent turns.

Note: Ephemerate's rebound triggers next upkeep: "you may cast this card from exile."
If you use rebound to blink again, the same 3 creatures (now each 1-card permanents) are
each found separately. Same 3 creatures return. No change in card count.

**Example 2 — Deliberate de-merge for value:**
Merged permanent: Illuna, Apex of Wishes (top; "when this creature mutates, exile from library until nonland permanent, put on battlefield or hand") + two base creatures.
You have only 2 cards in library. You're about to lose to a mill.
You cast Ephemerate on the merged stack to force all 3 into exile (outside the mill zone) and then return them, simultaneously getting 2 of the bases' ETBs for value.
3 cards enter. If two base creatures have ETBs ("when this enters, draw a card" etc.): 2 ETBs fire.
Illuna's ETB: Illuna has NO "when this creature enters" ability — only "when this creature mutates." No ETB for Illuna.

## Commonly Confused With
- **P441 (Mutate)** — P441 covers the general mutate rules. P442 covers specifically what happens when a merged permanent is blinked. Understanding that a blink de-merges the stack requires knowing both 729.3 (components go to exile) and 729.3c (all components are returned).
- **P433 (Dash/Unearth + Blink)** — Dashed/Unearthed creatures blinked create a new object without the dash/exile properties. Mutated creatures blinked de-merge into separate objects. Both involve blink + special status, but the outcomes are different: dash gives permanent board presence (one creature stays); mutate gives multiple separate creatures (all return individually).
- **P430 (Rebound)** — Rebound blinks (exile and return from exile) of a merged permanent would also apply 729.3c. If a merged permanent were somehow rebounded, all components would return separately. The key principle (729.3c finds all objects) applies to any "return from exile" effect.
