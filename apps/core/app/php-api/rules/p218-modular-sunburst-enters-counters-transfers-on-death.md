---
id: p218
name: Modular and Sunburst — Enters With Counters, Transfers on Death
category: continuous
cr_refs: [702.43a, 702.43b, 702.44a, 702.44b]
tags: [modular, sunburst, +1+1-counters, artifact-creature, death-transfer, Mirrodin, Arcbound-Ravager, Hardened-Scales]
created: 2026-03-28
examples_count: 2
---

# P218 — Modular and Sunburst — Enters With Counters, Transfers on Death

## Abstract
Modular N is a dual-keyword: the permanent enters with N +1/+1 counters, and when it dies, you may move all its +1/+1 counters to another artifact creature. This creates a recursive counter engine — counters are never truly lost, just transferred when a modular creature dies. Arcbound Ravager (Modular 0, can sacrifice artifacts to grow itself) combined with small modular creatures is one of Modern's most powerful synergy engines. Sunburst places counters based on how many colors of mana were spent to cast the spell.

## The Definitive Rules

**CR 702.43a** (verbatim): *"Modular represents both a static ability and a triggered ability. 'Modular N' means 'This permanent enters with N +1/+1 counters on it' and 'When this permanent is put into a graveyard from the battlefield, you may put a +1/+1 counter on target artifact creature for each +1/+1 counter on this permanent.'"*

**CR 702.44a** (verbatim): *"Sunburst is a static ability that functions as an object is entering the battlefield. 'Sunburst' means 'If this object is entering as a creature, ignoring any type-changing effects that would affect it, it enters with a +1/+1 counter on it for each color of mana spent to cast it. Otherwise, it enters with a charge counter on it for each color of mana spent to cast it.'"*

## The Pattern

```
MODULAR:
  Static: enters with N +1/+1 counters (ETB replacement effect)
  Triggered: when put into graveyard from battlefield:
  → you MAY put a +1/+1 counter (for each counter on it) on target artifact creature

  MODULAR + COUNTER TRANSFER:
    Only to ARTIFACT CREATURES (not just any creature)
    Counter transfer is optional ("you may")
    Each counter on the modular creature = one counter placed on the target
    A 3/3 Arcbound Crusher (Modular 2 + grew to +4/+4) dying: may put 6 counters on another artifact creature

  MODULAR + ARCBOUND RAVAGER:
    Arcbound Ravager (Modular 0): "Sacrifice an artifact: put a +1/+1 counter on Arcbound Ravager."
    Sacrifice small modular creatures (Arcbound Worker, Arcbound Stinger) → Ravager grows
    When Ravager would die: transfer ALL its counters to another artifact creature
    Typically: transfer to Inkmoth Nexus (flying infect creature when activated)
    Or: Arcbound Ravager transfers to itself... no, it's dying
    Transfer to a Vault Skirge (flying lifelink) or Steel Overseer

  AFFINITY + MODULAR (Mirrodin/Modern):
    Affinity deck: all artifacts → Modular creatures have free/cheap casting via Affinity
    Cheap Modular 1-3 creatures → sacrifice to Arcbound Ravager → counter pile up
    When Ravager dies: dump all counters on Inkmoth Nexus (unblockable if opponent tapped out)
    One attack with 10-counter Inkmoth: 10 infect damage = opponent dies

  MODULAR + DEATH REPLACEMENT:
    If a modular creature would be destroyed but regenerates: it doesn't go to graveyard
    Regeneration prevents the "put into graveyard" — modular trigger doesn't fire
    Similarly: indestructible modular creature destroyed by damage: not put into graveyard → no trigger

  MODULAR + MULTIPLE INSTANCES:
    CR 702.43b: multiple instances of modular each trigger separately
    Two instances of Modular 2: two triggers when dying, each moving counters
    Complicated but powerful: doubles the counter transfer

SUNBURST:
  Static ETB ability: based on colors of mana spent to cast
  For creatures: enters with +1/+1 counters (one per color spent)
  For non-creatures: enters with charge counters (one per color spent)
  Maximum: 5 counters (WUBRG = 5 colors)

  SUNBURST + 5-COLOR:
    Paying WUBRG mana to cast a Sunburst creature: 5 +1/+1 counters
    Spellbomb + 5-color: enters with 5 charge counters (powerful activation)

  SUNBURST + MODULAR:
    "Modular—Sunburst" (Crystalline Crawler, Engineered Explosives):
    Wait: Engineered Explosives (Sunburst artifact) isn't Modular—Sunburst
    But Arcbound Slith (Modular 0): Sunburst version would enter with +1/+1 per color spent
    If a card has both: the counters from sunburst are counted for modular death trigger

  ENGINEERED EXPLOSIVES (Sunburst artifact):
    Enters with charge counters equal to colors spent
    Activated ability: sacrifice to destroy all permanents with mana value equal to charge counters
    Pay 5 colors: 5 charge counters → destroy everything with mana value 5
    Extremely flexible removal in Modern — scales to target any mana value

HARDENED SCALES:
  "If one or more +1/+1 counters would be placed on a permanent you control, that many plus one are placed instead."
  Modular N + Hardened Scales: enters with N+1 counters
  Arcbound Ravager gaining counters: gains extra +1 for each ability activation
  Death transfer with Hardened Scales: each counter placed → +1 extra → doubled counter growth
```

## Definitive Conclusions

- **Modular N enters with N +1/+1 counters**; on death, transfer those counters to any artifact creature.
- **Counter transfer is to artifact creatures only** — not creatures in general.
- **Arcbound Ravager**: sacrifice Modular creatures → grow Ravager → transfer huge pile of counters on death.
- **Sunburst**: counters based on number of distinct colors of mana spent (max 5).
- **Hardened Scales** dramatically amplifies Modular by adding +1 to every counter placement.

## Canonical Example
**Affinity deck — Arcbound Ravager combo:**
Turn 1: Memnite (0-cost artifact), Arcbound Worker (Modular 1), Arcbound Sprinter (Modular 1).
Turn 2: Arcbound Ravager enters (Modular 0).
Sacrifice Arcbound Worker to Ravager: {T} — Ravager gets +1 counter. Worker dies: Modular trigger → put 1 counter on Ravager.
Ravager is now 2/2.
Sacrifice Arcbound Sprinter: Ravager gets +1. Sprinter dies: Modular puts 1 on Ravager.
Ravager is now 4/4.
Sacrifice Memnite: Ravager gets +1. Memnite has no Modular.
Ravager is 5/5. Also has 5 modular counters.
Opponent blocks with a 6/6. Ravager dies!
Modular trigger: put 5 counters on... Inkmoth Nexus (activate it: becomes an artifact creature).
Inkmoth Nexus becomes a 6/6 infect flier (1/1 base + 5 counters).
Attack for 6 infect damage. Opponent at 6 poison counters. One more attack next turn = win.

**Example 2 — Engineered Explosives (Sunburst, non-modular):**
Opponent controls three 1-mana creatures (Goblin tokens with mana value 1).
Cast Engineered Explosives paying one white mana and one red mana = 2 colors of mana spent.
Sunburst: enters with 2 charge counters.
But you need charge counters = 1 for the tokens.
Actually: cast paying only {W} (1 color): enters with 1 charge counter.
Sacrifice: destroy all permanents with mana value 1. Kills all three tokens + anything else with MV 1.
Extremely versatile: pay more colors to destroy higher-mana-value permanents.

## Commonly Confused With
- **P216 (Proliferate)** — Proliferate adds one of each existing counter type. Modular specifically places +1/+1 counters from dying creatures.
- **P174 (Level Up)** — Level Up uses level counters on creatures. Modular uses +1/+1 counters.
- **P157 (Undying/Persist)** — Undying/Persist return creatures to battlefield with counters. Modular transfers counters on death to other artifact creatures.
