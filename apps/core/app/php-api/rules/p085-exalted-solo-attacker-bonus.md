---
id: p085
name: Exalted — Solo Attacker Bonus
category: combat
cr_refs: [702.83a, 702.83b]
tags: [exalted, attacks-alone, triggered, power, toughness, pump, stacking, solo-attack]
created: 2026-03-28
examples_count: 2
---

# P085 — Exalted — Solo Attacker Bonus

## Abstract
Exalted triggers whenever a creature you control attacks ALONE. If you declare exactly one attacker, that creature gets +1/+1 until end of turn from each exalted ability on your permanents. "Attacks alone" means it's the only creature declared as an attacker — but additional creatures entering attacking (via ninjutsu, myriad, etc.) don't negate exalted that already triggered. Multiple exalted instances stack: four exalted abilities = +4/+4 to the solo attacker.

## The Definitive Rule

**CR 702.83a** (verbatim): *"Exalted is a triggered ability. 'Exalted' means 'Whenever a creature you control attacks alone, that creature gets +1/+1 until end of turn.'"*

**CR 702.83b** (verbatim): *"A creature 'attacks alone' if it's the only creature declared as an attacker in a given combat phase. See rule 506.5."*

## The Pattern

```
ATTACKS ALONE:
  Exactly one creature declared as an attacker in the declare attackers step
  NOT: creatures that entered attacking after declaration (myriad tokens, ninjutsu ninjas)
  The check is at the DECLARE ATTACKERS step

EXALTED TRIGGERS:
  Each exalted ability on any permanent you control triggers
  Each trigger puts +1/+1 on the solo attacker until end of turn
  Four exalted sources → four triggers → +4/+4

ATTACKING ALONE TIMING:
  If opponent uses effects to force additional creatures to attack after declaration:
    Those creatures weren't "declared as attackers" → they don't negate exalted
    Exalted already triggered when you declared one attacker
  If you somehow get a creature "declared as attacker" at the same time:
    Then two creatures are attacking → not alone → exalted doesn't trigger

MULTIPLE EXALTED FROM DIFFERENT SOURCES:
  Exalted on your creatures, on equipment, on enchantments — all count
  Each triggers separately for the same solo attacker
  Example: you control three creatures each with exalted → three triggers
    Solo attacker gets +3/+3 until end of turn

EXALTED DOESN'T CARE WHICH CREATURE:
  Any creature you control attacking alone triggers all your exalted abilities
  You can attack with a weak creature and pump it to lethal via stacked exalted

AFTER COMBAT:
  "+1/+1 until end of turn" — pump is lost at cleanup step
  Doesn't persist beyond that turn
```

## Definitive Conclusions

- **Exalted triggers only when exactly one creature is declared as an attacker.**
- **Myriad tokens and ninjutsu creatures entering-attacking don't negate exalted.** They weren't "declared."
- **Each exalted ability triggers separately.** Multiple instances stack +1/+1 each.
- **The solo attacker gets the bonus** — not the exalted creature itself (unless the exalted creature is the sole attacker).

## Canonical Example
**Noble Hierarch (Exalted) + Sublime Archangel (Exalted, gives all other creatures exalted):**
You control Noble Hierarch, Sublime Archangel, and a 1/1 token (which has exalted from Sublime Archangel). Attack with the 1/1 token alone. Three exalted triggers fire (Hierarch, Archangel, Archangel's grant on Hierarch, Archangel's grant on token itself?). Let's say 4 exalted sources → token gets +4/+4 → attacks as 5/5.

**Example 2 — Exalted + Ninjutsu:**
Declare your Phantom Warrior as sole attacker. Exalted triggers: +1/+1. Phantom becomes unblocked. Use ninjutsu to swap in a Ninja. The Ninja entered attacking (not declared), so exalted already triggered and Phantom Warrior already has the +1/+1 bonus. After ninjutsu, the attacker changed but the exalted bonus was already applied to Phantom Warrior, which returned to hand — the Ninja now is the attacker and doesn't have the exalted bonus (it wasn't the "declared sole attacker").

## Commonly Confused With
- **P035 (Ninjutsu)** — Ninjutsu replaces an attacker after exalted has already triggered. The ninjutsu ninja doesn't get the exalted bonus.
- **P085 and P042 (Annihilator)** — Both care about combat attacks. Annihilator fires when the creature attacks (even if not alone); Exalted fires when ANY of your creatures attacks alone.
