---
id: p040
name: Aura Attachment — Illegal Aura SBA, Bestow, and ETB Targeting
category: continuous
cr_refs: [303.4, 304.5, 702.103a, 702.103e, 704.5m, 608.3b]
tags: [aura, enchant, bestow, illegal-attachment, SBA, graveyard, fizzle, ETB, target, hexproof, protection]
created: 2026-03-28
examples_count: 3
---

# P040 — Aura Attachment — Illegal Aura SBA, Bestow, and ETB Targeting

## Abstract
Auras must target a legal object when cast (because they're spells with a target), and they become attached upon resolution. If the target becomes illegal before the Aura resolves, the Aura fizzles and goes to the graveyard. But Auras that are already attached become unattached and go to the graveyard via SBA when their enchanted permanent becomes illegal. Bestow is the major exception: a bestowed Aura spell that loses its target instead becomes a creature spell and resolves as a creature.

## The Definitive Rule

**CR 303.4** (Aura targeting): An Aura spell must target when cast. The Aura enchants the object it targeted when it resolves.

**CR 704.5m** (verbatim): *"If an Aura is attached to an illegal object or player, or is not attached to an object or player, that Aura is put into its owner's graveyard."*

**CR 702.103e** (verbatim, Bestow fizzle exception): *"As a bestowed Aura spell begins resolving, if its target is illegal, it ceases to be bestowed and the effect making it an Aura spell ends. It continues resolving as a creature spell."*

**CR 608.3b**: If an Aura spell's target is illegal when it tries to resolve, it doesn't resolve — it's put into its owner's graveyard.

## The Pattern

```
AURA SPELLS — TARGETING AND RESOLUTION:
  Cast as a spell → must choose a legal target
  Target gains hexproof/shroud AFTER targeting but BEFORE resolution:
    → Target becomes illegal → spell fizzles → Aura goes to graveyard
    (This is different from the permanent ALREADY being on the battlefield with
     hexproof — you couldn't have targeted it in the first place)
  Target is still legal when the Aura resolves → Aura attaches and enters battlefield

AURA ON BATTLEFIELD — SBA DETACHMENT:
  Aura's "enchant [X]" condition becomes false (e.g., creature is no longer a creature,
    or protection makes attachment illegal, or creature dies):
  → SBA: Aura put into owner's graveyard (704.5m)
  → This triggers "when this goes to graveyard" effects on the Aura
  → Also triggers LTB effects on the enchanted permanent (for those)

PROTECTION AND AURAS:
  Protection's E pillar: can't be enchanted by Auras of that quality
  Aura already attached → protection gained → SBA puts Aura in graveyard
  Note (P027): some Auras specifically say their own effect doesn't remove them
    (CR 702.16n covers this exception)

HEXPROOF/SHROUD AND AURAS:
  Hexproof/Shroud prevents targeting by opponents
  An opponent can't TARGET a hexproof creature with an Aura spell
  But you CAN enchant YOUR OWN hexproof creature (hexproof = "by opponents")
  Shroud: can't be targeted by ANY spells/abilities — can't enchant with shroud
    (even you can't target a shroud creature with your Aura)

BESTOW — THE CREATURE/AURA HYBRID:
  Cast bestowed = cast as an Aura spell (becomes creature if target lost)
  Target becomes illegal before resolution:
    → NOT graveyarded (unlike a normal Aura)
    → Instead: ceases to be bestowed, becomes a creature spell, resolves normally
    → Enters battlefield as a creature (not attached to anything)
  Already attached bestowed Aura on battlefield, enchanted creature dies:
    → SBA would normally graveyard the Aura
    → Bestow exception (702.103f): "if a bestowed Aura becomes unattached, it
       ceases to be bestowed" → no longer a bestowed Aura → falls under 704.5m
    WAIT — 702.103f says it's an exception to 704.5m
    → Actually: when enchanted creature dies, the bestowed Aura becomes unattached
       and ceases to be bestowed, and it goes to... it becomes a creature permanent?
    → CR 702.103f: becomes unattached and ceases to be bestowed → becomes a creature!
    → It stays on the battlefield as a creature permanent
    → "ETB" abilities don't trigger again (it was already on the battlefield)

TARGETING RESTRICTIONS (what an Aura can enchant):
  Aura has "Enchant [X]" — X defines what it can be attached to
  "Enchant creature" → can only target creatures
  "Enchant permanent" → can target any permanent
  "Enchant player" → targets a player, not a permanent
  The "enchant" restriction also determines what's illegal for SBA purposes
```

## Definitive Conclusions

- **An Aura spell that loses its target goes to the graveyard, not to the battlefield.** It fizzles and is graveyarded.
- **A bestowed Aura spell that loses its target becomes a creature, not graveyarded.** This is the major exception.
- **An already-attached Aura whose host becomes illegal goes to the graveyard via SBA.** This triggers death-trigger effects on the Aura itself.
- **An attached bestowed Aura whose host dies becomes a creature on the battlefield.** It stays out, just no longer attached to anything.
- **Hexproof prevents opponents from targeting with Aura spells** (can't target). Shroud prevents everyone from targeting. Neither removes an already-attached Aura from a permanent that already had it.
- **Protection removes already-attached Auras via SBA.** If a creature gains protection from the Aura's color after the Aura is attached, the Aura goes to the graveyard at the next SBA check.

## Canonical Example
**Enchanting a hexproof creature:**
Your creature has hexproof (e.g., Swiftfoot Boots). Opponent can't cast Pacifism targeting it. You CAN cast your own Aura (e.g., Rancor) on it — hexproof only prevents opponent targeting. Your opponent can't target it either. But you can.

**Example 2 — Bestow creature survives after host dies:**
You cast Ethereal Armor as bestowed Aura on your creature. Your creature is later killed by a removal spell. SBA: the bestowed Aura becomes unattached and ceases to be bestowed (CR 702.103f). It becomes a creature permanent on the battlefield. No ETB trigger (already on battlefield). You now have a 0/3 or whatever it is as a creature.

**Example 3 — Aura fizzle:**
You target opponent's creature with your Aura spell. Before it resolves, opponent gives the creature hexproof. Your Aura spell's target is now illegal (hexproof prevents targeting by opponents). Your Aura fizzles → goes to your graveyard.

## Commonly Confused With
- **P039 (Equipment Mechanics)** — Equipment becomes unattached but stays on battlefield; Aura becomes unattached and goes to graveyard. Key distinction.
- **P027 (Protection — DEBT)** — Protection's E removes attached Auras via SBA. P040 covers the SBA mechanism that executes this.
- **P029 (Spell Copy Targeting)** — Copying an Aura spell creates a new Aura spell that also needs a target. The copy targets independently per 707.10c.
