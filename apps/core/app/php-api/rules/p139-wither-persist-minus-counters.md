---
id: p139
name: Wither + Persist — The Minus Counter Synergy
category: triggered
cr_refs: [702.80a, 702.80b, 702.79a, 704.5f, 120.3]
tags: [wither, persist, -1/-1, counters, damage, lethal, toughness, infinite-loop, melira, kitchen-finks]
created: 2026-03-28
examples_count: 2
---

# P139 — Wither + Persist — The -1/-1 Counter Ecosystem

## Abstract
Wither changes how damage works: damage from a wither source doesn't go on the creature as damage — instead it places -1/-1 counters. This interacts fundamentally with persist: persist returns a creature that had NO -1/-1 counters. If a creature is killed by wither (because -1/-1 counters reduce its toughness to ≤ 0), it had -1/-1 counters → persist does NOT trigger. Melira, Sylvok Outcast breaks this by preventing -1/-1 counters from being placed → the creature always has "no -1/-1 counters" → persist always returns it. This enables the famous Melira Persist infinite loop.

## The Definitive Rules

**CR 702.80a** (verbatim): *"Damage dealt to a creature by a source with wither isn't marked on that creature. Rather, it causes that source's controller to put that many -1/-1 counters on that creature. See rule 120.3."*

**CR 702.79a** (verbatim): *"Persist means 'When this permanent is put into a graveyard from the battlefield, if it had no -1/-1 counters on it, return it to the battlefield under its owner's control with a -1/-1 counter on it.'"*

## The Pattern

```
WITHER — DAMAGE AS -1/-1 COUNTERS:
  A source with wither deals damage to a creature:
    Instead of marking damage on the creature:
    Place -1/-1 counters equal to the damage amount
  This affects SBA 704.5f: creature with toughness ≤ 0 → die
  (Note: 704.5g — lethal damage — uses damage markers, not counters)
  Wither damage bypasses "regeneration" in some ways:
    Regeneration removes damage markers, not counters
    -1/-1 counters from wither persist through regeneration!

PERSIST CONDITION:
  Persist triggers only if the creature "had no -1/-1 counters" when it died
  If killed by wither → had -1/-1 counters → persist does NOT trigger
  If killed normally (no wither) → no -1/-1 counters → persist triggers → returns with -1/-1 counter

PERSIST RETURNING WITH A COUNTER:
  Returned by persist: enters with 1 -1/-1 counter
  Now the creature has a -1/-1 counter → if killed again → persist does NOT trigger again
    (Persist is effectively a "one-time return" — once you have a -1/-1 counter, it won't return again from persist)

MELIRA INTERACTION (the famous loop):
  Melira, Sylvok Outcast: "Creatures you control can't have -1/-1 counters placed on them"
  With Melira: when persist triggers, it says "return with a -1/-1 counter"
    But Melira prevents placing -1/-1 counters
    The counter placement fails → creature returns with NO -1/-1 counter
    Next time it dies: persist triggers AGAIN (no -1/-1 counter → persists again)
    → INFINITE DEATH AND RETURN LOOP

MELIRA PERSIST INFINITE LOOP COMBO:
  Kitchen Finks (Persist) + Melira, Sylvok Outcast + Viscera Seer (sacrifice outlet):
    Sacrifice Kitchen Finks → dies → persist triggers → returns with no counter (Melira)
    Kitchen Finks' lifegain ETB triggers (gaining 2 life and a +1/+1)
    Wait: Kitchen Finks ETB on persist: enters → gains you 2 life
    Repeat: sacrifice → return → gain life → infinite life
    With a "whenever a creature dies, opponent loses 1 life" → infinite damage

WITHER + DEATHTOUCH (P105):
  Wither: damage becomes -1/-1 counters (for creatures)
  Deathtouch: any damage is lethal
  A source with wither AND deathtouch: 1 damage → 1 -1/-1 counter → toughness reduced →
    If toughness reaches ≤ 0: SBA 704.5f → dies
    If toughness > 0 but damage was "lethal" for deathtouch: SBA 704.5g... but wither replaces damage with counters
    Wait: wither converts damage to counters → 704.5g (lethal damage) uses damage markers, not counters
    So wither+deathtouch: the creature gets -1/-1 counters (not damage) → 704.5g might not apply (no marked damage)
    → 704.5f does apply if toughness ≤ 0 from counters

WITHER + REGENERATION:
  Regeneration: remove all damage markers → tap → remove from combat
  -1/-1 counters from wither: NOT "damage markers" → regeneration doesn't remove them
  A 2/2 with a -1/-1 counter from wither becomes 1/1 (effectively) even after regeneration
  The counter stays → permanent toughness reduction

PERSIST + UNDYING INTERACTION (P038):
  Both return from death with different conditions
  If a creature has both: they can create loops without Melira
    Actually: +1/+1 counter and -1/-1 counter on same creature annihilate (704.5q)
    This enables different infinite loop structures
```

## Definitive Conclusions

- **Wither converts damage to -1/-1 counters.** Not damage markers — regeneration doesn't remove them.
- **Persist does NOT trigger if the creature had -1/-1 counters** when it died.
- **Melira prevents -1/-1 counter placement** → persist returns with no counter → infinite loop possibility.
- **Kitchen Finks + Melira + Viscera Seer** is the classic infinite life combo.
- **Wither + deathtouch: SBA 704.5f applies** (toughness ≤ 0 from counters) rather than 704.5g (lethal damage).

## Canonical Example
**Kitchen Finks (Persist) dies normally (no -1/-1 counters):**
Persist triggers → returns with 1 -1/-1 counter → Kitchen Finks is now 2/1 (3/2 - 1/-1).
Next death: had -1/-1 counter → persist does NOT trigger. Kitchen Finks goes to graveyard permanently.

**Example 2 — Melira Loop:**
Melira + Kitchen Finks + Viscera Seer on battlefield.
Sacrifice Kitchen Finks → dies (trigger: "scry 1" from Viscera Seer) → persist triggers → returns with no counter (Melira).
Kitchen Finks ETB: you gain 2 life.
Sacrifice again → repeat. Infinite life, infinite scry.
Add Blood Artist or Zulaport Cutthroat: opponent also loses infinite life.

## Commonly Confused With
- **P037 (Infect/Wither)** — P037 covers the combo overview; P139 focuses on the persist interaction specifically.
- **P038 (Persist/Undying)** — P038 covers the basic loop conditions; P139 adds the Melira + wither nuances.
- **P054 (Proliferate)** — Proliferate can add -1/-1 counters to a persist creature to prevent future persist triggers.
