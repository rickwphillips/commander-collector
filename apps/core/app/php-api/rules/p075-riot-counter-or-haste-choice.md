---
id: p075
name: Riot — Counter or Haste Choice on Entry
category: replacement
cr_refs: [702.136a, 702.136b]
tags: [riot, haste, counter, ETB, choice, replacement-effect, enter-the-battlefield, gruul]
created: 2026-03-28
examples_count: 2
---

# P075 — Riot — Counter or Haste Choice on Entry

## Abstract
Riot is a static ability that presents a choice as the permanent enters the battlefield: either it enters with an additional +1/+1 counter, or it enters with haste. This is an "as enters" effect — a replacement effect that modifies how the permanent enters. Multiple instances of riot each provide a separate choice, letting you choose counter or haste independently for each. You could choose counter+counter, counter+haste, or haste+haste depending on your needs.

## The Definitive Rule

**CR 702.136a** (verbatim): *"Riot is a static ability. 'Riot' means 'You may have this permanent enter with an additional +1/+1 counter on it. If you don't, it gains haste.'"*

**CR 702.136b** (verbatim): *"If a permanent has multiple instances of riot, each works separately."*

## The Pattern

```
RIOT CHOICE:
  As the permanent enters the battlefield, make one choice per riot instance:
  Option A: Enter with one additional +1/+1 counter
  Option B: Enter without the counter, but gain haste

  This is a replacement effect ("as this permanent enters")
  → The choice modifies how it enters (counter or not)
  → The haste is gained "if you don't" take the counter

MULTIPLE RIOT INSTANCES:
  Each riot instance is a separate choice
  Two riot instances → two choices
  Possible combinations:
    Counter + Counter: enters with 2 +1/+1 counters, no haste
    Counter + Haste: enters with 1 counter, has haste
    Haste + Haste: "multiple instances of haste" → still just haste (redundant)
      Actually: gains haste once per "don't take counter" instance
      "gains haste" is redundant when already granted — but the counter isn't

COUNTER IS "ADDITIONAL":
  The counter is "additional" — meaning on top of any existing entry counters
  If the creature normally enters with +1/+1 counters (e.g., bloodthirst):
    Riot can add one MORE counter on top of those

TIMING:
  "As this permanent enters" = happens when entering the battlefield
  The choice is made before the permanent is fully on the battlefield
  Doubling Season: if applicable, the counter from riot is placed ON ENTRY
    Doubling Season doubles counters placed on permanents → riot counter is doubled
    → Choose counter with Doubling Season: enters with 2 +1/+1 counters (1 doubled to 2)
    → Choose haste: no counter, just haste (no Doubling Season interaction)

CHOOSING HASTE:
  Haste means can attack/use tap abilities this turn
  Useful for immediate offensive threat
  The creature gains haste as a static ability (not a granted ability with duration)
    Actually: "gains haste" is temporary? No — it's granted by the static riot ability
    As long as the riot is on the permanent, it has haste if you chose haste
    The "as enters" actually: the creature doesn't have haste unless you chose haste option
    Once on the battlefield, if you chose haste: it has haste permanently (until it leaves)
    Wait: actually riot grants haste as a continuous effect from the riot static ability
      "As long as this permanent's riot [chose haste] was chosen, it has haste"
    This is similar to how blitz/dash work — haste until the permanent leaves
```

## Definitive Conclusions

- **Riot offers a choice as the permanent enters:** +1/+1 counter or haste.
- **Multiple riot instances each give a separate choice.** Can get counter+haste, counter+counter, etc.
- **Doubling Season doubles the riot counter** (it's placed as the permanent enters).
- **The haste is permanent** (lasts until the permanent leaves the battlefield).
- **Choosing the counter is often better** for long-term value; choosing haste is better for immediate impact.

## Canonical Example
**Gruul Spellbreaker (Riot):**
Enters the battlefield. Riot choice: option A — enter with +1/+1 counter (becomes 4/4 instead of 3/3). Or option B — enter with haste (can attack this turn as a 3/3). With Doubling Season: choose counter → enters with 2 +1/+1 counters (5/5 total).

**Example 2 — Two riot instances:**
A creature has Riot twice. Make two independent choices. Choose: Counter + Haste. Creature enters with one +1/+1 counter AND gains haste. Or choose: Counter + Counter. Enters with two +1/+1 counters, no haste.

## Commonly Confused With
- **P023 (Trigger Suppression vs. Replacement)** — Riot is a replacement effect ("as this enters"), not a triggered ability. Torpor Orb suppresses triggered ETBs but not replacement effects like Riot.
- **P025 (Counter Placement — Cost vs. Effect)** — Riot's counter is placed as an "as enters" replacement effect. Doubling Season applies because it's placed as an effect, not as a cost.
