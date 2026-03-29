---
id: p115
name: Modular and Sunburst — Counter Entry and Death Transfer
category: triggered
cr_refs: [702.43a, 702.43b, 702.44a, 702.44b, 702.44c, 702.44d]
tags: [modular, sunburst, +1/+1, artifact-creature, counter-transfer, death-trigger, colored-mana, hardened-scales]
created: 2026-03-28
examples_count: 2
---

# P115 — Modular and Sunburst — Counter Entry and Death Transfer

## Abstract
Modular enters with N +1/+1 counters and triggers on death to transfer those counters to another artifact creature. This is a death-triggered ability — you get to put ALL remaining counters on a target artifact creature. Sunburst is an entry-only ability: the permanent enters with +1/+1 counters (if a creature) or charge counters (if not) for each color of mana spent casting it. These two often appear together: a modular permanent can use sunburst to enter with more counters, then transfer on death. Key: modular transfer targets artifact CREATURES specifically.

## The Definitive Rule

**CR 702.43a** (verbatim): *"'Modular N' means 'This permanent enters with N +1/+1 counters on it' and 'When this permanent is put into a graveyard from the battlefield, you may put a +1/+1 counter on target artifact creature for each +1/+1 counter on this permanent.'"*

**CR 702.44a** (verbatim): *"'Sunburst' means 'If this object is entering as a creature, ignoring any type-changing effects that would affect it, it enters with a +1/+1 counter on it for each color of mana spent to cast it. Otherwise, it enters with a charge counter on it for each color of mana spent to cast it.'"*

## The Pattern

```
MODULAR — ENTRY:
  Enters with N +1/+1 counters
  Replacement effects apply (Doubling Season, Hardened Scales)

MODULAR — DEATH TRIGGER:
  When put into graveyard from battlefield:
  "You MAY put a +1/+1 counter on target ARTIFACT CREATURE for each +1/+1 counter on this permanent"
  KEY: counts counters "on this permanent" at the time of death
    (As it's leaving, last known info = counters it had before moving)
  Optional: "you may" → can choose not to
  Target: must be an artifact creature (not just any creature)

COUNTERS TRANSFERRED:
  Each counter that was on the dead modular permanent → one counter on the target
  Doubling Season / Hardened Scales: apply to the transfer as well
    (These replacement effects apply to "putting +1/+1 counters on a creature")

SUNBURST:
  Replacement effect (not triggered) — as the permanent enters
  Counts COLORS of mana spent (not total mana)
  5 colors max → max 5 counters from sunburst
  Colorless mana counts as 0 colors
  Creature entering: gets +1/+1 counters per color
  Non-creature entering: gets charge counters per color
  Modular-Sunburst: enters with counters based on colors spent (modular # sets floor)
    Actually "Modular-Sunburst" means the modular N is determined by sunburst

MODULAR + ARTIFACT CREATURE RESTRICTION:
  The death trigger needs an artifact creature target
  If no artifact creatures: you can choose "may not" (optional)
  Equipment is an artifact — if crewed by a creature: still needs to be an artifact creature type

DYING WITH NO COUNTERS:
  If modular permanent has no counters when it dies:
  Trigger still fires but putting 0 counters does nothing
  (Or can choose not to trigger — "you may")

MULTIPLE MODULAR INSTANCES (702.43b):
  Each triggers separately → multiple transfer triggers → each needs a target
```

## Definitive Conclusions

- **Modular death trigger transfers ALL remaining counters to one artifact creature target.**
- **Optional ("you may") — can choose not to transfer.**
- **Target must be an artifact creature.** Not just any artifact or any creature.
- **Sunburst counts colors of mana (not total mana).** Max 5 +1/+1 counters (one per color).
- **Doubling Season applies to both entry (sunburst) AND transfer (modular death).**

## Canonical Example
**Arcbound Ravager (Modular 1) + sacrificed to its own ability:**
Ravager has 4 +1/+1 counters. Sacrificed. Death trigger: transfer 4 counters to target artifact creature.
Target Ornithopter → becomes 4/5.

**Example 2 — Sunburst:**
Engineered Explosive with {W}{U}{B} cast (3 colors). Not a creature → charge counters.
Enters with 3 charge counters. {T}, remove all charge counters: destroy each nonland permanent with CMC equal to the number of counters.

## Commonly Confused With
- **P054 (Proliferate)** — Proliferate can add more +1/+1 counters to a modular creature before it dies, increasing the transfer.
- **P092 (Scavenge)** — Scavenge also transfers counters from dead creature to living creature, but based on POWER and targets any creature (not just artifacts).
- **P100 (Enter-With-Counters Replacement Stack)** — Multiple counter-doubling effects apply at entry for sunburst/modular.
