---
id: p071
name: Prowess — Noncreature Spell Pump
category: triggered
cr_refs: [702.108a, 702.108b]
tags: [prowess, noncreature, triggered, pump, until-end-of-turn, stacking, cantrip, storm]
created: 2026-03-28
examples_count: 2
---

# P071 — Prowess — Noncreature Spell Pump

## Abstract
Prowess triggers whenever you cast a noncreature spell, giving the creature +1/+1 until end of turn. Multiple instances of prowess on the same creature each trigger separately. Storm spells are cast once (generating copies, not additional casts) — only the original cast triggers prowess. Cantrips (cheap noncreature spells) are a common way to stack multiple prowess triggers in one turn, enabling surprise lethal damage.

## The Definitive Rule

**CR 702.108a** (verbatim): *"Prowess is a triggered ability. 'Prowess' means 'Whenever you cast a noncreature spell, this creature gets +1/+1 until end of turn.'"*

**CR 702.108b** (verbatim): *"If a creature has multiple instances of prowess, each triggers separately."*

## The Pattern

```
PROWESS TRIGGER:
  Fires whenever you CAST a noncreature spell
  "Noncreature" = instants, sorceries, enchantments, artifacts, planeswalkers
  Must be YOU casting (not opponents)
  The +1/+1 is until end of turn (lost at cleanup)

STACKING PROWESS:
  Each noncreature spell cast → one prowess trigger
  Cast 3 spells → 3 prowess triggers → +3/+3 until end of turn
  Multiple creatures with prowess: each triggers independently

WHAT DOESN'T TRIGGER PROWESS:
  Casting a creature spell: no prowess (creatures are creatures, not noncreatures)
  Playing a land: not a cast (lands aren't cast)
  Storm copies: not cast (copies go directly to stack without casting)
    → One original cast → one prowess trigger, regardless of storm count
  Flashback, cascade, etc.: still "cast" → triggers prowess

MULTIPLE PROWESS:
  Creature with two prowess instances: each triggers separately
  Cast one noncreature spell → 2 triggers → +2/+2 total

TIMING:
  Triggers when the spell is CAST (going on the stack), not when it resolves
  Prowess trigger goes on stack above the cast spell
  Prowess resolves before the spell, pumping the creature before damage
  This is relevant: if you cast a damage spell WITH prowess active, the creature
    is pumped before the damage spell resolves

PROWESS + COMBAT TRICK:
  Common sequence:
  1. Declare attacker (Monastery Swiftspear)
  2. During combat, cast Lightning Bolt (noncreature)
  3. Prowess triggers (+1/+1)
  4. Bolt resolves
  → Swiftspear was 1/2 attacker, becomes 2/3 during combat
```

## Definitive Conclusions

- **Prowess triggers on ANY noncreature spell you cast.** Instants, sorceries, artifacts, enchantments, planeswalkers.
- **Storm copies don't trigger prowess.** Only the original cast counts.
- **Multiple prowess instances each trigger.** A creature with two prowess gets +2/+2 per noncreature spell.
- **Triggers when cast, not when resolved.** Prowess pump happens before the spell that triggered it resolves.
- **Pump is until end of turn.** Lost at cleanup.

## Canonical Example
**Monastery Swiftspear (prowess, haste, 1/2):**
Cast Monastery Swiftspear. During combat: hold Swiftspear back as attacker. Cast Brainstorm → prowess triggers (+1/+1). Cast Gut Shot → prowess triggers (+1/+1). Cast Lightning Bolt → prowess triggers (+1/+1). After all triggers resolve: Swiftspear is 4/5 for this combat. End of turn: returns to 1/2.

**Example 2 — Storm + prowess:**
You cast Grapeshot (storm). Storm copies are created — they go on the stack but are NOT cast. Only the original Grapeshot was cast. Prowess triggers once (for the one cast). Not once per storm copy.

## Commonly Confused With
- **P036 (Storm Count)** — Storm counts spells cast; prowess triggers on casts. Both care about "casting" but for different reasons — storm counts earlier spells, prowess cares about the casting action itself.
- **P071 and P045 (Convoke)** — Convoke tapping creatures to cast: the spell is still "cast," so prowess still triggers on a convoked noncreature spell.
