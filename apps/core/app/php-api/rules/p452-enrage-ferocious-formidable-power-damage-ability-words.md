---
id: p452
name: Enrage, Ferocious, and Formidable — Power-Check and Damage-Triggered Ability Words
category: triggered
cr_refs: [207.2c, 603.2, 603.4, 510.1, 700.4, 703.4]
tags: enrage, ferocious, formidable, ability-word, power-check, damage-trigger, condition, ixalan, khans, magic-origins
created: 2026-03-29
examples_count: 8
---

# P452 — Enrage, Ferocious, and Formidable — Power-Check and Damage-Triggered Ability Words

## Abstract

**Enrage**, **Ferocious**, and **Formidable** are ability words (CR 207.2c) with no formal rules entries — the actual mechanics are written on the cards. All three involve checking the power of creatures: **Enrage** triggers whenever the creature itself is *dealt damage* (any amount, from any source); **Ferocious** (Khans of Tarkir) and **Formidable** (Magic Origins) create conditional effects based on whether you control a creature with power 4 or greater. The critical distinctions: Enrage triggers once per damage event regardless of how much damage was dealt, a Ferocious/Formidable condition checks the current board state at the moment relevant (not when you cast the spell), and prevention effects that reduce damage to zero *do* prevent Enrage from triggering.

## The Definitive Rules

### Ability Words (CR 207.2c)
Enrage, Ferocious, and Formidable are ability words with no individual CR entries. The mechanics appear in card text. All rules conclusions derive from the underlying triggered ability (CR 603) and static ability (CR 604) rules.

### Enrage — Damage-Triggered Ability
Enrage text pattern: *"Whenever [creature] is dealt damage, [effect]."*

This is a triggered ability (CR 603.2). The trigger condition is the *dealing* of damage to this specific creature. Damage is dealt simultaneously in a damage event; the trigger fires once per damage event, regardless of how much damage was dealt.

**CR 510.1** (Combat Damage Step): Combat damage is dealt simultaneously. One combat damage event deals damage from all sources simultaneously.

**CR 703.4** (Damage): A source deals damage only if it successfully delivers nonzero damage. Damage that is prevented entirely is not "dealt."

### Ferocious — Power-4 Conditional
Ferocious text pattern: *"If you control a creature with power 4 or greater, [effect]."* or *"[Effect]. If you control a creature with power 4 or greater, [additional effect instead]."*

This is a condition checked at the relevant timing — typically at the time the spell resolves or at the time the triggered ability resolves.

### Formidable — Power-4 Activated/Triggered Condition
Formidable text pattern: *"[Effect] — Activate only if you control a creature with power 4 or greater."* or *"Whenever [event], if you control a creature with power 4 or greater, [effect]."*

Identical in spirit to Ferocious. The condition "control a creature with power 4 or greater" is checked at the appropriate time (resolution for triggers with the condition in an intervening-if clause; activation time for activated abilities).

## The Pattern

```
ENRAGE pattern:
When [creature with Enrage] is dealt any damage from any source:
  → Trigger fires (once per damage event — not once per point of damage)
  → Trigger fires on:
    - Combat damage (from attackers or blockers)
    - Direct damage spells (Lightning Bolt, etc.)
    - Non-combat triggered damage
    - Your own damage (Arena of Glory effects, fight spells)
  → Trigger does NOT fire on:
    - Damage that is completely prevented (Fog of War, Circle of Protection, Absorb, etc.)
    - "0 damage is dealt" — prevention shields prevent the event
  → Multiple simultaneous damage sources: one damage event = one enrage trigger
    UNLESS a rule says damage is dealt by multiple separate events

FEROCIOUS / FORMIDABLE pattern:
Condition check: "Do I control a creature with power 4 or greater?"
  → Check at the moment of resolution (for triggered abilities)
  → Check at activation time (for "activate only if..." text)
  → Uses CURRENT power, not base power — includes all continuous effects
    (so a 3/3 with +1/+1 counter qualifies; a 5/5 that's been Shrunk to 2/5 does not)
  → Must control the creature at the relevant check moment
  → If the 4-power creature dies in response to the spell,
    the Ferocious condition fails at resolution (if it's a trigger or resolution check)
  → If it's on a resolved permanent checking continuously,
    uses real-time power calculation
```

## Definitive Conclusions

**Enrage:**
- Enrage triggers on ANY nonzero damage — including 1 damage from a 1/1, 1 damage from Gut Shot, or damage from a fight spell you initiate yourself. This is a feature that enables self-damage combos (Pyrohemia, Blazing Sunsteel, Snapping Sailback + Flame Slash).
- Enrage does NOT trigger if all damage is prevented. If the creature has Absorb 3 and takes 3 damage, the 3 damage is prevented — 0 damage is dealt — no enrage trigger.
- If a creature with Enrage takes damage from multiple sources in the same damage event (e.g., two attackers deal damage simultaneously in combat), Enrage triggers ONCE for each damage event. Combat damage is one simultaneous event (CR 510.1), so one trigger fires if the creature is dealt damage from any source in that event — but the trigger fires once regardless of how many sources contributed.
- Actually: re-reading CR 603.2c: a triggered ability triggers once per occurrence of the triggering event, but if the event occurs multiple times simultaneously, the trigger fires once per occurrence. "Dealt damage" from a single damage event is ONE occurrence. So one trigger for the whole combat damage step.
- Enrage is particularly powerful with ping effects (Goblin Sharpshooter, Basilisk Collar, Cunning Sparkmage) which deal 1 damage per activation and can trigger Enrage repeatedly.

**Ferocious:**
- Ferocious checks power "4 or greater" — a creature with a base power of 3 that has been given +1/+0 by an effect qualifies (power is currently 4). A creature with base 5 that has been reduced to 3 does not qualify.
- Toughness doesn't matter for Ferocious. A 4/1 qualifies; a 3/10 does not.
- The check is a snapshot at resolution. If you cast a Ferocious spell and the opponent kills your 4-power creature in response, Ferocious is NOT satisfied at resolution.
- Example: *Become Immense* (Khans) — "Ferocious — If you control a creature with power 4 or greater, instead of +6/+6 until end of turn, [effect]." This checks at resolution.

**Formidable:**
- Identical to Ferocious mechanically. Same power-4+ check, same timing.
- Key card: *Hydra Broodmaster* (Magic Origins): "Formidable — {X}{X}{G}: Monstrosity X. Activate only if Hydra Broodmaster has power 4 or greater." Wait — the Formidable ability here is actually on the Hydra's own power check. If the Hydra has been reduced below 4, you can't activate.
- More commonly on instants/sorceries: *Atarka's Command* (Khans) has options including a Formidable-adjacent power check.

## Canonical Examples

**Enrage (Ixalan dinosaurs):**
- *Ripjaw Raptor* (Ixalan): "Enrage — Whenever Ripjaw Raptor is dealt damage, draw a card." A 4/5 dinosaur that draws a card every time it takes damage. Pyrohemia (which deals 1 damage to all creatures) triggers Enrage once per Pyrohemia activation — an extremely common combo.
- *Trapjaw Tyrant*: "Enrage — Whenever Trapjaw Tyrant is dealt damage, exile target creature an opponent controls until Trapjaw Tyrant leaves the battlefield." Self-pinging triggers exile effects.
- *Ranging Raptors*: "Enrage — Whenever Ranging Raptors is dealt damage, you may search your library for a basic land card, put it onto the battlefield tapped, then shuffle." Stone Rain your own Raptors to ramp.

**Ferocious:**
- *Stubborn Denial* (Khans): "Counter target noncreature spell unless its controller pays {1}. Ferocious — If you control a creature with power 4 or greater, counter that spell instead." Essentially a Force Spike upgrading to hard counter.
- *Crater's Claws* (Khans): *"Ferocious — If you control a creature with power 4 or greater, it deals X+2 damage instead."*

**Formidable:**
- *Surrak, the Hunt Caller* (Magic Origins): "Formidable — At the beginning of combat on your turn, if you control creatures with total power 8 or greater, target creature you control gains haste until end of turn." Note: this checks TOTAL power, not any single creature.

## Commonly Confused With

- **P037** (Infect/Wither — Damage as Counters) — Wither and infect deal damage as counters; Enrage DOES trigger off wither/infect damage (it's still "dealt damage")
- **P105** (Deathtouch) — Deathtouch with Enrage: if a deathtouch source deals 1 damage to an Enrage creature, Enrage triggers AND the deathtouch applies (creature dies from SBAs); Enrage fires before SBAs check
- **P006** (Intervening If Clause) — Ferocious/Formidable conditions are sometimes intervening-if clauses (checked at trigger AND resolution) depending on card text; always read the specific card
- **P004** (Layer Dependency) — Power is checked after all continuous effects apply (Layers 7a-7d); a creature with a CDA-based power is measured at the time of the Ferocious check
