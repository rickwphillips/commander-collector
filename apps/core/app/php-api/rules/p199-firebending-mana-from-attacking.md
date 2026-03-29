---
id: p199
name: Firebending — Generate Mana When Attacking (Persistent Through Combat)
category: combat
cr_refs: [702.189a, 702.189b]
tags: [firebending, mana-generation, attack-trigger, combat-mana, Avatar, Universes-Beyond]
created: 2026-03-28
examples_count: 2
---

# P199 — Firebending — Generate Mana When Attacking (Persistent Through Combat)

## Abstract
Firebending is a triggered combat ability from the Avatar: The Last Airbender Universes Beyond set. When a creature with Firebending N attacks, you add N {R} mana that persists through combat steps and phases (doesn't drain at end of steps/phases during combat). This is exceptional: normally, unspent mana empties at the end of each step and phase. Firebending mana stays available throughout the combat turn, enabling powerful mid-combat instant-speed spells. Other effects can trigger when a player "firebends" (activates a firebending ability).

## The Definitive Rules

**CR 702.189a** (verbatim): *"Firebending is a triggered ability. 'Firebending N' means 'Whenever this creature attacks, add N {R}. Until end of combat, you don't lose this mana as steps and phases end.'"*

**CR 702.189b** (verbatim): *"An ability that triggers whenever a player firebends triggers whenever a firebending ability they control resolves."*

## The Pattern

```
FIREBENDING:
  Triggered ability: "Whenever this creature attacks..."
  Trigger fires when creature attacks (declare attackers)
  Effect: add N {R} mana
  Special property: "Until end of combat, you don't lose this mana as steps and phases end"

  FIREBENDING + MANA PERSISTENCE:
    Normal MTG rule: unspent mana empties at end of each step and phase (rule 500.5)
    Firebending exception: this specific mana persists through combat steps
    Specifically: through declare attackers → declare blockers → combat damage → end of combat
    After end of combat: combat is over → mana drains normally in next step

  FIREBENDING + SPENDING OPPORTUNITIES:
    After attackers declared (firebending triggers): mana is available
    During declare blockers step: can activate instant-speed abilities or cast instants
    In combat damage step (first strike damage): can spend mana
    In combat damage step (regular damage): can spend mana
    At end of combat step: spend before exiting combat
    The mana window is the entire combat phase

  FIREBENDING + INSTANT-SPEED SPELLS:
    Pump spells mid-combat: Firebending gives you mana to cast them!
    Giant Growth on attackers: firebend, then use the R to pump a red creature
    Removal instants: if you have {R} instant removal, firebending pre-funds it
    Burn spells: Firebending 3 → add 3 {R} → cast Lightning Bolt ({R}) and have 2R left

  FIREBENDING + MULTIPLE ATTACKING CREATURES:
    Multiple creatures with Firebending attack simultaneously
    Each Firebending trigger adds N {R}
    Total mana: sum of all Firebending values across attacking creatures
    Wide Firebending attack → large mana pool for combat instants

  "FIREBENDS" TRIGGER (CR 702.189b):
    Some cards trigger "whenever a player firebends"
    This triggers when a firebending ability RESOLVES (not when it triggers)
    The firebending ability's resolution = the trigger event for these watchers
    Avatar-themed synergy cards that respond to firebending moments

  FIREBENDING + COLOR:
    Firebending always produces {R} mana
    Cannot be used to pay colored mana of other colors
    Can pay generic mana requirements {N}
    Ideal for: red pump spells, red instants, red abilities during combat

  FIREBENDING + AVATAR FLAVOR:
    Fire Nation / Fire Benders: create fire in combat → use that fire for further abilities
    Thematic: your attack generates firebending power (mana) for more combat tricks
    Zuko, Iroh, and other Fire Nation characters with this ability

  FIREBENDING + COMBAT TRICKS:
    Attack with Firebender → opponent must decide blocks WITHOUT knowing you have extra mana
    After blockers declared: reveal firebending mana by casting instants
    Unexpected pump: opponent thought trade was even, firebending changes math
    Mind games: opponent must assume you can firebend for combat tricks
```

## Definitive Conclusions

- **Firebending N adds N {R}** when the creature attacks.
- **Mana persists through combat** — unusually, it doesn't empty between combat steps.
- **Use for instant-speed spells/abilities** during combat steps.
- **"Firebends" triggers** fire when a firebending ability resolves.
- **Red mana only** — pays for red spells and generic mana costs.

## Canonical Example
**Zuko, Crown Prince (3/3 with Firebending 3):**
Declare attackers: Zuko attacks → Firebending triggers.
Add {R}{R}{R} that persists until end of combat.
Opponent declares blockers: they send a 4/4 to block Zuko (would kill him).
You have access to {R}{R}{R}. Cast Giant Growth? No, that's green.
Cast Incinerate ({1}{R}): deal 3 damage to the blocking 4/4 → it dies (state-based actions).
Zuko survives the block. Used {1}{R} of Firebending mana. {R} left over (drains after combat).
Net: Zuko dealt combat damage AND you killed their blocker for free (using firebending mana).

**Example 2 — Wide Firebending Army:**
Attack with three creatures, each with Firebending 1.
Three Firebending triggers: add {R}, {R}, {R} = {R}{R}{R} total.
Mid-combat: cast Lightning Bolt targeting opponent's face ({R}) = 3 damage.
Cast Shock ({R}) = 2 damage.
{R} mana left; not enough for another burn spell.
Total: 5 damage from burn spells + 3 creatures' combat damage. All from attacking.

## Commonly Confused With
- **P189 (Max Speed)** — Max Speed tracks speed (0–4) from opponents losing life. Firebending generates mana from attacking. Both are from recent UB sets but are unrelated mechanics.
- **P160 (Annihilator)** — Annihilator forces opponent sacrifices on attack. Firebending generates mana for you on attack.
- **P173 (Exalted)** — Exalted boosts a single attacker's P/T. Firebending generates mana from attacking. Both are "attacking triggers" but with different effects.
