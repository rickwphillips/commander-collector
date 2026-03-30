---
id: p563
name: Hexproof, Shroud, Indestructible — Defensive Keywords and What They Don't Stop
category: continuous
cr_refs: [702.11, 702.11b, 702.11c, 702.11d, 702.12, 702.12b, 702.18, 702.18a]
tags: [hexproof, shroud, indestructible, cant-target, cant-destroy, defensive, edict, sacrifice, exile, minus-toughness, board-wipe, deathtouch, lethal-damage]
created: 2026-03-31
examples_count: 3
---

# P563 — Hexproof, Shroud, Indestructible — Defensive Keywords and What They Don't Stop

## Abstract

**Hexproof, Shroud, and Indestructible are the three major defensive keywords, each protecting against a specific axis of interaction.** Hexproof prevents targeting by opponents only (you can still target your own creature). Shroud prevents targeting by ALL players (including you). Indestructible prevents destruction (both "destroy" effects and lethal damage). None of these prevent sacrifice, exile from non-targeting effects, -X/-X reducing toughness to 0, bouncing, or being countered. Indestructible does NOT prevent damage — the creature still takes damage, it just doesn't die from it (damage is marked but doesn't trigger the lethal-damage SBA). Deathtouch combined with damage does NOT destroy an indestructible creature. Understanding what each keyword stops — and crucially, what it doesn't stop — is essential for correct play.

## The Definitive Rules

**CR 702.11b (Hexproof):** *"'Hexproof' on a permanent means 'This permanent can't be the target of spells or abilities your opponents control.'"*

**CR 702.11d (Hexproof from [quality]):** *"'Hexproof from [quality]' on a permanent means 'This permanent can't be the target of [quality] spells your opponents control or abilities your opponents control from [quality] sources.'"*

**CR 702.18a (Shroud):** *"Shroud is a static ability. 'Shroud' means 'This permanent or player can't be the target of spells or abilities.'"*

**CR 702.12b (Indestructible):** *"A permanent with indestructible can't be destroyed. Such permanents aren't destroyed by lethal damage, and they ignore the state-based action that checks for lethal damage."*

## The Pattern

```
HEXPROOF VS SHROUD VS INDESTRUCTIBLE:

  ┌──────────────────┬───────────┬───────────┬───────────────┐
  │ Interaction       │ HEXPROOF  │  SHROUD   │ INDESTRUCTIBLE│
  ├──────────────────┼───────────┼───────────┼───────────────┤
  │ Opponent targets  │ BLOCKED   │ BLOCKED   │ allowed       │
  │ You target own    │ allowed   │ BLOCKED   │ allowed       │
  │ "Destroy target"  │ can't     │ can't     │ BLOCKED       │
  │   (opponent)      │ target    │ target    │ (if targeted) │
  │ "Destroy all"     │ allowed   │ allowed   │ BLOCKED       │
  │ Lethal damage     │ allowed   │ allowed   │ SURVIVES      │
  │ Deathtouch dmg    │ allowed   │ allowed   │ SURVIVES      │
  │ Sacrifice/edict   │ allowed   │ allowed   │ allowed       │
  │ -X/-X (non-tgt)   │ allowed   │ allowed   │ DIES (0 tough)│
  │ Exile (non-tgt)   │ allowed   │ allowed   │ allowed       │
  │ Bounce (non-tgt)  │ allowed   │ allowed   │ allowed       │
  │ Counter on stack  │ allowed   │ allowed   │ allowed       │
  │ Damage marked     │ yes       │ yes       │ yes (no kill) │
  └──────────────────┴───────────┴───────────┴───────────────┘

HEXPROOF IN DETAIL:

  What it stops:
    - Opponent targeting your permanent with spells
    - Opponent targeting your permanent with abilities
    - ONLY from opponents — you CAN target your own hexproof permanent

  What it doesn't stop:
    - Non-targeting effects ("destroy all," "each creature gets -3/-3")
    - Sacrifice effects ("each player sacrifices a creature")
    - Your own spells and abilities targeting it
    - Damage from non-targeting sources (combat, "deals damage to each")
    - Being blocked in combat
    - Losing abilities (Overwhelming Splendor removes hexproof)

  Hexproof from [quality]:
    - "Hexproof from red" → can't be targeted by red opponent spells/abilities
    - Narrower than full hexproof
    - Blue opponent CAN target it even with "hexproof from red"

SHROUD IN DETAIL:

  What it stops:
    - ANY player targeting the permanent (including its controller!)
    - All spells and abilities that target it

  What it doesn't stop:
    - Same as hexproof's exceptions (non-targeting, sacrifice, etc.)

  Key difference from hexproof:
    - YOU can't target your own shroud creature
    - Can't enchant with your own Auras (Auras target on cast)
    - Can't equip via "equip" ability (equip targets)
    - CAN benefit from "attach" effects that don't use the word "target"

INDESTRUCTIBLE IN DETAIL:

  What it stops:
    - "Destroy" effects (Murder, Wrath of God, Doom Blade)
    - Lethal damage (SBA 704.5g is ignored)
    - Deathtouch + damage (deathtouch makes any amount lethal, but
      lethal damage doesn't destroy indestructible permanents)

  What it DOESN'T stop:
    - Sacrifice (not destruction)
    - Exile (not destruction)
    - Bounce to hand/library (not destruction)
    - -X/-X reducing toughness to 0 or less (SBA 704.5f: toughness 0 → GY,
      this is NOT destruction — it's a different SBA)
    - Being countered on the stack
    - "Loses indestructible" effects
    - Legend rule (not destruction; owner chooses which to keep)

  Damage and indestructible:
    - The creature STILL TAKES DAMAGE (damage is marked on it)
    - The SBA that would destroy it from lethal damage is ignored
    - Damage-based triggers ("whenever this creature is dealt damage") fire
    - Lifelink still applies (damage is still dealt)
    - Deathtouch: damage is dealt, creature marked, but not destroyed
    - The damage stays marked until end of turn (or removed)

COMMON TRAPS:

  Trap 1: "Indestructible survives everything"
    → FALSE. -1/-1 counters, -X/-X effects, and sacrifice all kill it.
    → Tragic Slip (-13/-13) kills an indestructible creature.

  Trap 2: "Hexproof stops board wipes"
    → FALSE. Board wipes don't target. Hexproof is irrelevant.

  Trap 3: "Shroud means I can enchant my own creature"
    → FALSE. Shroud prevents ALL targeting, including yours.
    → You CAN attach an Aura via a non-targeting effect
      (e.g., return Aura from GY "attached to" a creature)

  Trap 4: "Deathtouch kills indestructible"
    → FALSE. Deathtouch makes damage "lethal" but indestructible
      ignores the lethal-damage SBA entirely.

  Trap 5: "Indestructible prevents damage"
    → FALSE. Damage is still dealt and marked. Effects that care
      about damage being dealt still work (lifelink, etc.).

HEXPROOF + INDESTRUCTIBLE COMBINED:

  A creature with both hexproof and indestructible:
    - Can't be targeted by opponents
    - Can't be destroyed
    - CAN still be: sacrificed, exiled (non-targeting), bounced (non-targeting),
      given -X/-X (non-targeting), affected by "each player sacrifices"

  The combination is strong but not absolute.

LOSING THESE ABILITIES:

  If a permanent loses hexproof/shroud/indestructible:
    - The protection is immediately gone
    - Opponents can now target (hexproof/shroud lost)
    - Can now be destroyed (indestructible lost)
    - Common way: "loses all abilities" effects (Overwhelming Splendor,
      Dress Down)
```

## Definitive Conclusions

- **Hexproof = opponent can't target; you can** — does NOT prevent non-targeting effects.
- **Shroud = nobody can target** — including you, the controller.
- **Indestructible = can't be destroyed** — NOT immune to sacrifice, exile, -X/-X, or bounce.
- **Indestructible does NOT prevent damage** — damage is still dealt and marked; it just doesn't kill.
- **Deathtouch doesn't beat indestructible** — the lethal-damage SBA is ignored entirely.
- **-X/-X beats indestructible** — toughness 0 or less is a different SBA (704.5f, not destruction).
- **None of these work on the stack** — creatures can still be countered before resolving.

## Canonical Example

**Hexproof vs Board Wipe:**

You control a creature with hexproof. Opponent casts Day of Judgment ("Destroy all creatures"). Day of Judgment doesn't target — hexproof is irrelevant. Your creature is destroyed.

Opponent tries to cast Murder targeting your hexproof creature — illegal target. Murder can't be cast targeting it.

You cast Giant Growth targeting your own hexproof creature — legal. Hexproof only prevents opponent targeting.

**Example 2 — Indestructible vs Various Removal:**

You control an indestructible creature (e.g., Darksteel Colossus).

Opponent casts Murder: "Destroy target creature." Murder resolves, tries to destroy — indestructible prevents it. Creature survives.

Opponent casts Tragic Slip: "Target creature gets -13/-13 until end of turn." If the creature's toughness reaches 0 or less, SBA 704.5f puts it into the graveyard. This is NOT destruction — indestructible doesn't help. Creature dies.

Opponent casts Path to Exile: "Exile target creature." Exile is not destruction. Creature is exiled.

Opponent attacks with a deathtouch creature, deals 1 damage. Deathtouch means 1 is lethal. But indestructible ignores the lethal-damage SBA. Creature survives with 1 damage marked.

**Example 3 — Shroud vs Owner:**

You control a creature with shroud. You want to enchant it with an Aura from your hand — you can't. Auras target when cast, and shroud prevents ALL targeting including yours.

However, if an effect says "return an Aura from your graveyard to the battlefield attached to a creature," this doesn't target. You CAN attach the Aura to your shroud creature this way.

## Commonly Confused With

- **P561 (Protection DEBT)** — P561 covers protection (prevents DEBT); P563 covers hexproof/shroud (target only) and indestructible (destroy only). Protection is broader than hexproof.
- **P553 (Ward)** — P553 covers Ward (pay or counter); hexproof/shroud make targeting impossible; Ward makes it costly.
- **P008 (Can't vs Can Conflicts)** — P008 covers "can't" rule conflicts; hexproof/shroud/indestructible are specific "can't" effects.
