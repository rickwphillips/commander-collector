---
id: p327
name: Equipment, Vehicles, and Attach Mechanics — Equip Cost, Crew, and Fortification
category: continuous
cr_refs: [301.5, 301.5b, 301.5c, 301.5d, 301.7, 702.6a, 702.6c, 702.122, 702.151]
tags: [equipment, equip, attach, vehicle, crew, fortification, sorcery-speed, controller-separate, creature-equipment-state, Stoneforge-Mystic, Embercleave, Skullclamp, Crewing-Vehicles, Living-Metal, Reconfigure, equip-planeswalker]
created: 2026-03-29
examples_count: 2
---

# P327 — Equipment, Vehicles, and Attach Mechanics — Equip Cost, Crew, and Fortification

## Abstract
**Equipment** are artifact subtypes that attach to creatures, granting benefits. The **equip ability** is sorcery-speed: pay the cost to attach to a creature you control. Equipment stays on the battlefield when the equipped creature leaves; it falls off (becomes unattached) as an SBA when the equipped creature stops being a legal attachment target. **Vehicles** are artifact creatures with a **crew** mechanic — tap creatures with enough total power to activate the Vehicle as a creature until end of turn. **Reconfigure** is a newer mechanic allowing an Equipment to also function as a creature.

## The Definitive Rules

**CR 702.6a** (verbatim): *"Equip is an activated ability of Equipment cards. 'Equip [cost]' means '[Cost]: Attach this permanent to target creature you control. Activate only as a sorcery.'"*

**CR 301.5b** (verbatim): *"Equipment spells are cast like other artifact spells. Equipment enter the battlefield like other artifacts. They don't enter the battlefield attached to a creature. [...] Control of the creature matters only when the equip ability is activated and when it resolves."*

**CR 301.5c** (verbatim): *"An Equipment that's also a creature can't equip a creature unless that Equipment has reconfigure. [...] An Equipment can't equip itself. An Equipment that equips an illegal or nonexistent permanent becomes unattached from that permanent but remains on the battlefield. (This is a state-based action.)"*

**CR 301.5d** (verbatim): *"An Equipment's controller is separate from the equipped creature's controller; the two need not be the same. [...] Only the Equipment's controller can activate its abilities. However, if the Equipment grants an ability to the equipped creature (with 'gains' or 'has'), the equipped creature's controller is the only one who can activate that ability."*

## The Pattern

```
EQUIPMENT BASICS:
  Equipment is an artifact with subtype "Equipment."
  Cast like any artifact. Enters unattached (not equipped to anything).
  To equip: pay the equip cost (activated ability, sorcery speed).
  Target: a creature you control.
  When equip resolves: Equipment is attached to that creature.
  The equipped creature gains whatever the Equipment grants.

  SORCERY SPEED:
  "Activate only as a sorcery" (CR 702.6a): can only equip during your main phase, stack empty.
  Can't equip in response to opponent's spells.
  Can't equip in combat (generally).
  Exception: some effects say "equip" at instant speed (specific cards/effects).
  Flash Equipment: some Equipment has flash → cast at instant speed, but still equip at sorcery speed.

  EQUIP COST VARIATIONS:
  Some Equipment: "Equip — [additional condition]"
  Skullclamp: equip {1}.
  Embercleave: flash, "When this enters, attach it to target creature you control."
    Embercleave self-attaches on ETB (not an equip activation). Can't be "responded to" in the same way.
  "Equip only to [quality]" creatures: restricts the target.
    Example: "Equip only to attacking creatures": must be an attacking creature when equip resolves.
  Equip Planeswalker (CR 702.6e): some Equipment can equip planeswalkers "as though they were creatures."

WHAT HAPPENS WHEN THE CREATURE LEAVES:
  CR 301.5c: "Equipment that equips an illegal or nonexistent permanent becomes unattached but remains on the battlefield."
  The Equipment stays. The creature doesn't.
  The Equipment has no P/T boost or stats; it just sits there until re-equipped.
  Re-equip: pay equip cost again. Attach to a new creature.
  Contrast with Auras: Auras go to GY when enchanted creature leaves. Equipment stays.

CONTROLLER DIFFERENCES (CR 301.5d):
  Equipment controller ≠ equipped creature controller.
  You control Sword of Fire and Ice. You equip it to your 2/2.
  Opponent steals your 2/2 with Act of Treason.
  They now control the creature. You still control the Equipment.
  The Sword's "equipped creature" now refers to their creature (they control the 2/2).
  But YOU control the Sword and its abilities.
  If the Sword grants an ability to the equipped creature:
    "Equipped creature has 'When this creature deals damage, draw a card'":
    The equipped creature (your opponent's stolen 2/2) has that ability.
    Its controller (opponent, via Act of Treason) is the only one who can activate it.
  When Act of Treason ends: your 2/2 returns to you. Equipment still attached.
  Wait: does Equipment "follow" a stolen creature?
    Equipment is attached to the creature. Control changes to opponent. Equipment stays attached.
    Opponent controls the creature-equipment combo.
    When control returns: Equipment is still attached to your creature.
  But: the Equipment itself remains under YOUR control (the Equipment didn't change control).

STONEFORGE MYSTIC AND EQUIPMENT:
  Stoneforge Mystic ({1}{W}): 1/2 Kor Artificer. ETB: search library for Equipment, reveal, put in hand.
  {1}{W}, {T}: "You may put an Equipment card from your hand onto the battlefield."
    This is a PUT ability: puts Equipment from hand directly to battlefield.
    This is NOT casting the Equipment. No equip activation either.
    The Equipment enters unattached.
  Stoneforge then allows fast Equipment access.
  Classic Legacy play: Stoneforge → Batterskull (Germ token + equipment).

VEHICLES (CR 301.7, 702.122):
  Vehicle artifacts have a printed P/T but are NOT creatures by default.
  To "crew" a Vehicle: tap creatures with total power ≥ crew value.
    Crew 2: tap any number of creatures with total power ≥ 2.
    Vehicle becomes an artifact creature until end of turn.
  During the current turn: the Vehicle is a creature and can attack/block.
  At end of turn: loses creature type (becomes just an artifact again).
  Summoning sickness: if a Vehicle became a creature for the first time this turn,
    it has summoning sickness (entered as a creature this turn).
    WAIT: Vehicles enter the battlefield as artifacts (not creatures). They don't have summoning sickness because they weren't "creatures" when they entered.
    When crewed: they become creatures this turn. But the "hasn't been controlled continuously since last turn" rule (302.6) checks whether the PERMANENT (not the creature) has been under your control.
    A Vehicle that was on the battlefield before this turn: it's been under your control continuously.
    When crewed this turn: it becomes a creature. It CAN attack (because the PERMANENT was under control since last turn).
    This is different from a creature entering this turn.
  Living Metal (702.161a): "During your turn, this Vehicle is an artifact creature."
    Always crewed during your turn (no need to tap creatures to crew).

RECONFIGURE (CR 702.151, see also P323 briefly):
  Equipment that's also a creature.
  When attached to a creature: it's no longer a creature (just Equipment).
  When unattached: it's a creature again.
  Reconfigure {cost}: sorcery speed. Attach to or detach from a creature.
  "An Equipment that's also a creature can't equip a creature UNLESS that Equipment has reconfigure." (CR 301.5c)
  So Reconfigure is the ONLY way an Equipment-creature can equip another creature.
  Otherwise: an Equipment that becomes a creature (via some effect) can't equip until it's not a creature.

NOTABLE EQUIPMENT INTERACTIONS:
  SKULLCLAMP ({1}): equip {1}. "Equipped creature gets -1/-1. Whenever equipped creature dies, draw 2 cards."
    1/1 creature + Skullclamp → -1/-1 → becomes 0/0 → dies → draw 2.
    Each 1/1 token with Skullclamp: auto-dies, draws 2. Banned in most formats.

  EMBERCLEAVE ({4}{R}{R}): Equipment with flash, enters attached.
    "Whenever you attack with two or more creatures, this spell costs {2} less to cast."
    Also: grants +1/+0 and double strike to equipped creature.
    The "attaches on ETB" triggers as part of entering: the creature immediately gets double strike.
    This can be done at instant speed (flash): attack, opponent doesn't block properly, cast Embercleave mid-combat attaching to biggest threat for a lethal double-strike attack.

  SWORD OF FIRE AND ICE ({3}): equip {2}. Grants +2/+2, protection from red and blue.
    "Whenever equipped creature deals combat damage to a player: deal 2 damage to any target and draw a card."
    The "equipped creature" gaining protection from red: if you attach it to a red creature, the creature gains protection from its OWN color.
    Protection from red on a red creature: can't be targeted by red spells. Tricky but legal.
```

## Definitive Conclusions

- **Equip is always sorcery speed** — can't equip in response to anything; only during your main phase with an empty stack.
- **Equipment stays on the battlefield when the equipped creature leaves** — it becomes unattached but persists as an artifact.
- **Equipment controller and creature controller are separate** — relevant when a creature is stolen.
- **Vehicles have printed P/T but aren't creatures until crewed** — crewed Vehicles from previous turns can attack without summoning sickness.
- **Reconfigure is the only way an Equipment-creature can equip another creature** — Equipment-creatures otherwise can't equip while they're creatures.

## Canonical Example
**Embercleave Alpha Strike:**
Turn 6, you have 4 attacking creatures: 3/3, 3/3, 2/2, 2/2.
You have {1}{R}{R} in mana.
Declare all 4 attackers. Embercleave's cost reduction: "Whenever you attack with 2+ creatures, costs {2} less."
With 4 attackers: cost reduced by {2}. Embercleave now costs {2}{R}{R} instead of {4}{R}{R}.
After declaring attackers (but before blockers), cast Embercleave ({2}{R}{R}) — you have {1}{R}{R} plus floating.
Wait: {2}{R}{R} = 4 mana. You have 6 lands (6 mana available). No problem.
Embercleave has flash. Cast it during the declare attackers step (opponent just declared attackers).
When Embercleave enters: "Attach it to target creature you control." Target 3/3.
3/3 gains +1/+0 (becomes 4/3) and double strike.
Opponent blocked your 2/2s and one 3/3, leaving the other 3/3 (now 4/3 double strike) unblocked.
Unblocked 4/3 with double strike: deals 4 damage in first strike step → 4 more in regular step = 8 damage total to player.
If opponent is at 8 life: dead.
The Embercleave surprise: opponent expected normal combat, suddenly their blocking plan is wrong.
They can't re-block after Embercleave resolves.

**Example 2 — Stoneforge Mystic Toolbox:**
Turn 2: cast Stoneforge Mystic. ETB: search for Batterskull (an Equipment with {5} mana cost).
Put Batterskull in hand.
Turn 3: activate Stoneforge: {1}{W}, tap Stoneforge: put Batterskull onto the battlefield for free.
Batterskull enters (the Equipment itself enters, unattached).
Batterskull: "Living weapon — attach this Equipment to a 0/0 black Germ token."
Wait: Living weapon! Batterskull enters with a 0/0 Germ creature that it automatically equips.
The Germ gains Batterskull's bonuses (+4/+4 vigilance lifelink): becomes 4/4.
4/4 Vigilance Lifelink on turn 3. Formidable.
If opponent destroys the Germ: Batterskull is unattached. Exists as Equipment artifact.
Stoneforge: tap, {1}{W}: put another Equipment onto the battlefield? No, Stoneforge already activated this turn.
But Batterskull itself: "{3}: Return Batterskull to its owner's hand." Return it. Next turn: cast for {5}? Or Stoneforge {1}{W} again.
Stoneforge-Batterskull is a resilient engine: the Equipment can be re-crewed by bouncing and re-entering.
Legacy staple because of the absurdly mana-efficient access to game-winning Equipment.

## Commonly Confused With
- **P319 (Aura Rules)** — Auras go to GY when enchanted creature leaves; Equipment stays on battlefield when equipped creature leaves. This is a key distinction: Aura = falls off and dies; Equipment = falls off but survives.
- **P311 (New Object Rule)** — If an Equipment's equipped creature is flickered, the Equipment falls off (new object = not equipped). The Equipment remains unattached on the battlefield until re-equipped.
- **P321 (Mutate)** — A mutated pile retains its Equipment. The Equipment is attached to the merged permanent (which is the same object). When the pile dies, each component goes to GY separately, but the Equipment stays as an unattached artifact.
- **P323 (Reconfigure)** — Reconfigure allows Equipment-creatures to work in a unique way: unattached = creature, attached = Equipment-only. Mentioned briefly here; detailed in P323.
