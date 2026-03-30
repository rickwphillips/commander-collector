---
id: p561
name: Protection — DEBT (Damage, Enchant/Equip, Block, Target) and What It Doesn't Stop
category: continuous
cr_refs: [702.16, 702.16a, 702.16b, 702.16c, 702.16d, 702.16e, 702.16f, 702.16j, 702.16k, 702.16m]
tags: [protection, DEBT, damage-prevention, cant-target, cant-enchant, cant-equip, cant-block, board-wipe, sacrifice, protection-from-everything, static-ability]
created: 2026-03-31
examples_count: 3
---

# P561 — Protection — DEBT (Damage, Enchant/Equip, Block, Target) and What It Doesn't Stop

## Abstract

**Protection from [quality] prevents exactly four things, remembered by the mnemonic DEBT: Damage, Enchanting/Equipping, Blocking, and Targeting.** Protection does NOT prevent destruction from non-damage effects (board wipes), sacrifice, exile from non-targeting effects, -X/-X from non-targeting effects, or being countered. A creature with protection from red can still be destroyed by Wrath of God, forced to sacrifice by Liliana's -2, and given -3/-3 by Toxic Deluge. Protection is a static ability that checks the quality of the SOURCE (for damage/targeting) or the OBJECT (for Auras/Equipment/blockers). Existing Auras and Equipment with the protected quality fall off as a state-based action. "Protection from everything" applies against ALL objects regardless of characteristics. Multiple instances of the same protection are redundant.

## The Definitive Rules

**CR 702.16a (Protection):** *"Protection is a static ability, written 'Protection from [quality].' This quality is usually a color but can be any characteristic value or information."*

**CR 702.16b (Can't Target):** *"A permanent or player with protection can't be targeted by spells with the stated quality and can't be targeted by abilities from a source with the stated quality."*

**CR 702.16c (Can't Enchant):** *"A permanent or player with protection can't be enchanted by Auras that have the stated quality. Such Auras attached to the permanent or player with protection will be put into their owners' graveyards as a state-based action."*

**CR 702.16d (Can't Equip):** *"A permanent with protection can't be equipped by Equipment that have the stated quality or fortified by Fortifications that have the stated quality. Such Equipment or Fortifications become unattached from that permanent as a state-based action, but remain on the battlefield."*

**CR 702.16e (Damage Prevention):** *"Any damage that would be dealt by sources that have the stated quality to a permanent or player with protection is prevented."*

**CR 702.16f (Can't Block):** *"Attacking creatures with protection can't be blocked by creatures that have the stated quality."*

**CR 702.16j (Protection from Everything):** *"A permanent or player with protection from everything has protection from each object regardless of that object's characteristic values. Such a permanent or player can't be targeted by spells or abilities and can't be enchanted by Auras. Such a permanent can't be equipped by Equipment, fortified by Fortifications, or blocked by creatures. All damage that would be dealt to such a permanent or player is prevented."*

**Official Ruling (Progenitus, 2009-02-01):** *"Progenitus can still be affected by effects that don't target it or deal damage to it (such as Day of Judgment)."*

## The Pattern

```
DEBT — WHAT PROTECTION STOPS:

  D — DAMAGE:
    All damage from sources with the stated quality is PREVENTED.
    - Combat damage from a red creature → prevented (prot from red)
    - Damage from a red spell (Lightning Bolt) → prevented
    - Damage abilities from a red source → prevented
    - NOTE: damage is PREVENTED, not reduced. Effects that care about
      "damage that is prevented" will see it.

  E — ENCHANT/EQUIP:
    Can't be enchanted by Auras with the stated quality.
    Can't be equipped by Equipment with the stated quality.
    - If an Aura with the quality is ALREADY attached: SBA removes it
    - If Equipment with the quality is ALREADY attached: SBA detaches it
      (Equipment stays on battlefield, just unattached)
    - Auras go to graveyard; Equipment just detaches

  B — BLOCK:
    Can't be blocked by creatures with the stated quality.
    - Protection from green: green creatures can't block it
    - This is an evasion effect during the declare blockers step
    - Does NOT prevent the protected creature from blocking others

  T — TARGET:
    Can't be targeted by spells or abilities from sources
    with the stated quality.
    - Can't be targeted by red spells (prot from red)
    - Can't be targeted by abilities from red permanents
    - If a spell loses the quality after targeting, protection
      still prevents it (illegal target on resolution)

WHAT PROTECTION DOES NOT STOP:

  Protection is frequently OVERESTIMATED. It does NOT prevent:

  ✗ Non-targeting destruction:
    - "Destroy all creatures" (Wrath of God) — not targeted
    - "Each creature gets -X/-X" (Toxic Deluge) — not targeted, not damage
    - Exile effects that don't target: "Exile all creatures" (Farewell)

  ✗ Sacrifice:
    - "Each player sacrifices a creature" — not targeted, not damage
    - Forced sacrifice (Liliana, Edict effects) — not targeted

  ✗ Countering:
    - Protection doesn't apply on the stack; it's a static ability
      that functions on the battlefield (or sometimes on a player)
    - A spell with protection from blue can still be countered by Counterspell

  ✗ Non-damage effects from protected sources:
    - "All creatures lose all abilities" from a red source — not damage/target
    - Static effects that don't target: Humility makes all creatures 1/1
    - Continuous effects that don't target

  ✗ Costs and effects that don't involve DEBT:
    - You can still sacrifice your own creature with protection
    - Note: protection DOES prevent targeting from ANY source with the
      quality, including your own spells (protection from red blocks
      YOUR red spells too)

  ✗ Being put into zones by non-targeting effects:
    - "Put all creatures on the bottom of their owner's libraries"

QUALITY CHECKING:

  Protection checks the QUALITY of:
    - For damage: the SOURCE of damage
    - For targeting: the SPELL or the SOURCE of the ability
    - For Auras: the AURA itself (its color, type, etc.)
    - For Equipment: the EQUIPMENT itself
    - For blocking: the BLOCKING CREATURE

  Example: Protection from red
    - Red spell targets → prevented (T)
    - Red creature deals combat damage → prevented (D)
    - Red Aura attached → falls off (E)
    - Blue creature blocks → allowed (not red)
    - Colorless spell "exile target creature" → NOT prevented (not red)

PROTECTION FROM COLORS VS OTHER QUALITIES:

  Colors: "protection from black" — most common
  Card types: "protection from creatures" — sources that are creatures
  Players: "protection from [player name]" — all objects that player controls
  Everything: "protection from everything" — all objects period
  Named card: "protection from Demons" (subtype) — sources with that subtype

  Protection from a card type checks the source:
    - "Protection from artifacts" → can't be targeted by artifact abilities,
      can't be damaged by artifacts, can't be blocked by artifact creatures,
      can't be equipped by Equipment (Equipment are artifacts!)

EXISTING ATTACHMENTS AND PROTECTION:

  When a permanent GAINS protection from a quality:
    - All Auras with that quality fall off immediately (SBA)
    - All Equipment with that quality detach immediately (SBA)
    - This happens the next time SBAs are checked (before anyone gets priority)

  When protection is LOST:
    - Previously detached Equipment doesn't reattach
    - Destroyed Auras don't come back
    - Protection only prevents; it doesn't undo what happened after removal

REDUNDANCY:

  Multiple instances of protection from the same quality are redundant (702.16m).
  Protection from red + protection from red = protection from red (one instance).
  Protection from red + protection from blue = two separate protections.
```

## Definitive Conclusions

- **DEBT only** — Protection prevents Damage, Enchanting/Equipping, Blocking, and Targeting. Nothing else.
- **Board wipes work** — "Destroy all creatures" doesn't target, doesn't deal damage. Protection can't stop it.
- **Sacrifice works** — forced sacrifice doesn't target. Protection is irrelevant.
- **Protection from everything is comprehensive** — but still doesn't stop non-DEBT effects.
- **Existing Auras/Equipment fall off** — SBA detaches them immediately when protection is gained.
- **Quality is checked on the source** — protection from red checks if the damage source/spell/Aura/blocker is red.

## Canonical Example

**Protection from Red:**

You control a creature with protection from red. Opponent controls Lightning Bolt ({R}, "deal 3 damage to any target") and Wrath of God ({2}{W}{W}, "destroy all creatures").

Lightning Bolt targeting your creature? Illegal — can't target (T in DEBT).
Lightning Bolt resolves without targeting (hypothetically)? Damage prevented (D in DEBT).
Red creature tries to block? Can't block (B in DEBT).
Opponent attaches a red Aura? Can't enchant (E in DEBT). If already attached, SBA removes it.

Wrath of God? Your creature is DESTROYED. Wrath doesn't target, doesn't deal damage. Protection doesn't help.

**Example 2 — Progenitus and Board Wipes:**

Progenitus has protection from everything. It can't be targeted by any spell or ability, can't be enchanted, can't be equipped, can't be blocked, and all damage dealt to it is prevented.

Day of Judgment: "Destroy all creatures." This doesn't target Progenitus and doesn't deal damage. Progenitus IS destroyed. (Progenitus's shuffle ability would then trigger.)

Toxic Deluge: "All creatures get -X/-X." Not damage, not targeting. Progenitus gets -X/-X and can die from toughness 0 or less.

**Example 3 — Gaining Protection Mid-Combat:**

You control a creature enchanted by a red Aura, equipped with a red Equipment, and it's being blocked by a red creature. An effect gives your creature protection from red.

SBAs check: Red Aura goes to graveyard. Red Equipment detaches (stays on battlefield). The blocking red creature is already declared as a blocker — protection from red doesn't remove an already-declared blocker (blocking restrictions apply only at declare blockers). Combat damage from the red blocker is prevented (D in DEBT).

## Commonly Confused With

- **P008 (Can't vs Can Conflicts)** — P008 covers "can't" effect interactions; P561 covers protection's specific "can't" effects (DEBT only).
- **P553 (Ward)** — P553 covers Ward (pay or counter); P561 covers protection (prevents targeting entirely). Ward makes targeting expensive; protection makes it impossible.
- **P002 (Replacement vs Triggered)** — Protection's damage prevention is a prevention effect (a type of replacement), not a triggered ability.
