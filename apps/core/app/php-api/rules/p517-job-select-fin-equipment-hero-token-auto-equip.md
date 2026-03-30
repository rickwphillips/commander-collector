---
id: p517
name: Job Select (FIN) — Equipment Hero Token Auto-Equip on ETB
category: mechanics
cr_refs: [301.5, 603.3, 702.6, 110.5c]
tags: [job-select, fin, final-fantasy, equipment, token, hero, ETB, auto-equip, doubling-season, torpor-orb, living-weapon, FIN-2025]
created: 2026-03-30
examples_count: 3
---

# P517 — Job Select (FIN) — Equipment Hero Token Auto-Equip on ETB

## Abstract

Job Select is an Equipment-specific triggered ability from the Final Fantasy set (2025). When an Equipment with Job Select enters the battlefield, it automatically creates a 1/1 colorless Hero creature token and attaches itself to that token. This is an ETB trigger that packages two effects: token creation and Equipment attachment, in a single triggered ability. The Equipment can then be moved to other creatures using normal equip costs. The Hero token's creature type makes the Equipment immediately "in use" before you ever spend equip mana — the token receives all the Equipment's bonuses immediately upon attachment.

## Representative Cards

**Dragoon's Lance** {1}{W} — Artifact — Equipment (FIN)
> Job select (When this Equipment enters, create a 1/1 colorless Hero creature token, then attach this to it.)
> Equipped creature gets +1/+0 and is a Knight in addition to its other types.
> During your turn, equipped creature has flying.
> Gae Bolg — Equip {4}

**Bard's Bow** (FIN)
> Job select (When this Equipment enters, create a 1/1 colorless Hero creature token, then attach this to it.)
> Equipped creature gets +2/+2, has reach, and is a Bard in addition to its other types.
> Perseus's Bow — Equip {6}

**Dark Knight's Greatsword** (FIN)
> Job select (When this Equipment enters, create a 1/1 colorless Hero creature token, then attach this to it.)
> Equipped creature gets +3/+0 and is a Knight in addition to its other types.
> Chaosbringer — Equip—Pay 3 life. Activate only once each turn.

**Black Mage's Rod** (FIN)
> Job select (When this Equipment enters, create a 1/1 colorless Hero creature token, then attach this to it.)
> Equipped creature gets +1/+0, has "Whenever you cast a noncreature spell, this creature deals 1 damage to each opponent," and is a Wizard in addition to its other types.
> Equip {3}

**Astrologian's Planisphere** (FIN)
> Job select (When this Equipment enters, create a 1/1 colorless Hero creature token, then attach this to it.)
> Equipped creature is a Wizard in addition to its other types and has "Whenever you cast a noncreature spell and whenever you draw your third card each turn, put a +1/+1 counter on this creature."
> Diana — Equip {2}

## Official Rulings (Dragoon's Lance, 2025-06-06)

- *"If the Hero token is destroyed, the Equipment stays on the battlefield."*
- *"The Hero token enters as a 1/1 creature, then the Equipment becomes attached to it. Abilities that trigger when a creature enters the battlefield see that a 1/1 creature entered the battlefield."*
- *"You may pay the Equipment's equip cost as normal to move it from the Hero token to another creature you control."*
- *"If the job select ability causes two Hero tokens to be created (due to an effect such as that of Doubling Season), the Equipment becomes attached to only one of them."*

## The Pattern

```
JOB SELECT TRIGGER SEQUENCE:
  1. Equipment spell resolves → enters the battlefield
  2. Job Select ETB trigger goes on stack
  3. Trigger resolves:
     a. Create a 1/1 colorless Hero creature token
     b. Attach this Equipment to that token
  4. Other ETB triggers fire seeing the 1/1 creature
  5. After attachment, equipped creature has the Equipment's bonuses

ETB TRIGGER TIMING:
  The Hero token enters as a 1/1 BEFORE the Equipment attaches
  → ETB triggers see it enter as a 1/1 (Soul Warden, Cathars' Crusade)
  → After attachment, it gains the Equipment's bonuses
  → Dragoon's Lance Hero = 2/1 Knight with flying on your turn after attachment

HERO TOKEN DESTROYED — EQUIPMENT SURVIVES:
  Destroying the Hero token does NOT destroy the Equipment
  Equipment falls off (becomes unattached) per normal SBA rules
  Equipment remains on battlefield, unattached, waiting for equip
  You can equip it to another creature with the equip cost

DOUBLING SEASON / TOKEN DOUBLERS:
  Token doubler creates TWO Hero tokens instead of one
  Equipment attaches to exactly one of them (per ruling)
  The second Hero token enters as a free 1/1 without Equipment
  Result: one equipped Hero + one unequipped 1/1 Hero

STIFLE / TORPOR ORB:
  Job Select is an ETB triggered ability — NOT a replacement effect
  Torpor Orb ("creatures entering don't cause abilities to trigger") suppresses it
  → No Hero token created, Equipment enters unattached
  Stifle counters the triggered ability → same result

MOVING THE EQUIPMENT:
  After Job Select fires, Equipment is attached to the Hero token
  Normal equip cost (sorcery speed) moves it to any creature you control
  The Hero token remains on the battlefield as a 1/1 (without Equipment)
  The Hero token is NOT sacrificed when the Equipment moves

SUMMONING SICKNESS:
  Hero token enters with summoning sickness — cannot attack or use tap abilities
  Equipment attaches immediately (attaching doesn't require the creature to tap)
  Token can attack on subsequent turns (or with haste)

COMPARED TO LIVING WEAPON (P090):
  Living Weapon: creates a 0/0 black Phyrexian Germ token, attaches Equipment
  Job Select: creates a 1/1 colorless Hero token, attaches Equipment
  Both: Equipment survives token death, can be re-equipped to other creatures
  Difference: Hero is a 1/1 (survives without buffs); Germ is 0/0 (dies without Equipment)
  Difference: Job Select tokens are colorless; Germ tokens are black
  Difference: Germ dies to SBA if Equipment moves off; Hero stays alive
```

## Definitive Conclusions

- **Job Select is an ETB triggered ability, not a replacement effect.** Torpor Orb suppresses it. The Equipment enters first as an unattached artifact, then the trigger fires and resolves.
- **The Hero token enters as a 1/1 before Equipment bonuses apply.** ETB-watchers (Soul Warden, Cathars' Crusade) see a 1/1 entering. The token only gains Equipment bonuses after the trigger attaches the Equipment.
- **Destroying the Hero token leaves the Equipment on the battlefield.** The Equipment is an independent permanent — the token's death does not destroy it. It just becomes unattached.
- **Doubling Season creates two tokens but Equipment attaches to only one.** The second token is a free 1/1 Hero but unequipped. Moving the Equipment to it later requires paying the equip cost.
- **Unlike Living Weapon's Germ token, the Hero is a 1/1 that survives Equipment being moved.** A Germ is 0/0 and immediately dies to SBA if the Equipment detaches; a Hero is 1/1 and lives on.
- **Re-equipping is normal sorcery-speed activation.** After the auto-attach, you can move the Equipment to any creature you control by paying the equip cost.

## Canonical Example

**Dragoon's Lance enters (normal play):**
You cast Dragoon's Lance ({1}{W}). It enters the battlefield. Job Select triggers, goes on stack. Soul Warden triggers for the incoming 1/1 (fires for the entering Hero token). On Job Select resolution: create a 1/1 colorless Hero token. Soul Warden trigger fires — you gain 1 life. Then the Lance attaches to the Hero. The Hero is now a 2/1 Knight with flying during your turn. Later, you pay {4} to equip the Lance to your Grizzly Bears — the Hero remains as a 1/1 on the battlefield.

**Dragoon's Lance + Doubling Season:**
With Doubling Season on the battlefield, Job Select's token creation is doubled — two 1/1 Hero tokens are created. The Lance attaches to one of them. You have one 2/1 equipped Knight (flying on your turn) and one vanilla 1/1 Hero.

**Dragoon's Lance — Torpor Orb:**
With Torpor Orb in play, the Job Select triggered ability is suppressed. Dragoon's Lance enters the battlefield with no Hero token and is unattached. You must pay {4} (Gae Bolg equip cost) to attach it to an existing creature.

**Black Mage's Rod — ETB granted ability trigger:**
Black Mage's Rod enters, Hero token is created. Hero now has "whenever you cast a noncreature spell, this creature deals 1 damage to each opponent." You cast a cantrip (noncreature spell) — Hero's ability triggers, 1 damage to each opponent. Note: the Hero token must be equipped for this ability to exist. If you move the Rod to another creature, the Hero loses the ability.

## Commonly Confused With

- **P090 (Living Weapon — Germ Token)** — Structurally identical but key difference: Germ is 0/0 and dies to SBA when Equipment detaches. Hero is 1/1 and persists after Equipment is moved.
- **P039 (Equipment Attach Mechanics)** — General Equipment rules apply after auto-attach: sorcery speed re-equip, Equipment falls off on illegal attachment, Equipment is independent of its host.
- **P023 (Torpor Orb — Trigger Suppression)** — Job Select is a triggered ETB ability, so Torpor Orb fully suppresses it. No Hero token, Equipment enters unattached.
- **P028 (Simultaneous ETB)** — If multiple Job Select Equipment enter simultaneously, each creates its own Hero token trigger independently (APNAP ordering for multiple triggers).
