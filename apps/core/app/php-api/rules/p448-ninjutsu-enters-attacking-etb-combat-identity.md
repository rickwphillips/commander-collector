---
id: p448
name: Ninjutsu — Enters-Attacking Deployment, ETBs in Combat, and Aura/Equipment Loss
category: combat
cr_refs: [702.49a, 702.49b, 702.49c, 702.49d, 508.3, 603.6a, 302.6]
tags: [ninjutsu, enters-attacking, ETB-in-combat, unblocked-attacker, return-to-hand, aura-loss, equipment-unattach, summoning-sickness-bypassed, attack-declaration-bypass, Higure-Still-Wind, Yuriko-Tiger-Shadow, Satoru-Umezawa, commander-ninjutsu, tapped-attacking, Kamigawa]
created: 2026-03-29
examples_count: 2
---

# P448 — Ninjutsu — Enters-Attacking Deployment, ETBs in Combat, and Aura/Equipment Loss

## Abstract
**Ninjutsu** (702.49) is an activated ability from the hand that bypasses the normal attack declaration to put a creature directly onto the battlefield "tapped and attacking." This creates several non-obvious interactions: (1) **the ninja's ETB triggers fire immediately when it enters**, before combat damage, while it is already in an attacking position; (2) **the ninja bypasses summoning sickness** — it doesn't need to have been on the battlefield since the start of the turn because it enters as an attacker rather than declaring an attack; (3) **the returned creature loses all Equipment and Auras** — when the original attacker returns to hand, Equipment unattaches and Auras go to the graveyard (illegal attachment); (4) **ninjutsu can be activated anytime you have priority, including after blockers are declared** — as long as the creature is currently unblocked at the time of activation. Commander ninjutsu (702.49d) works from either the hand OR the command zone.

## The Definitive Rules

**CR 702.49a** (verbatim): *"Ninjutsu is an activated ability that functions only while the card with ninjutsu is in a player's hand. 'Ninjutsu [cost]' means '[Cost], Reveal this card from your hand, Return an unblocked attacking creature you control to its owner's hand: Put this card onto the battlefield from your hand tapped and attacking.'"*

**CR 702.49c** (verbatim): *"The creature put onto the battlefield with the ninjutsu ability enters attacking the same player, planeswalker, or battle as the creature that was returned to its owner's hand."*

**CR 702.49d** (verbatim): *"Commander ninjutsu is a variant of the ninjutsu ability that also functions while the card with commander ninjutsu is in the command zone."*

**CR 508.3**: "Second, the active player gets priority. (This is the point at which players may cast instants and activate abilities.)" — The declare attackers step grants priority after attackers are declared but BEFORE declare blockers. Ninjutsu is an activated ability usable at any priority window.

## The Pattern

```
NINJUTSU ACTIVATION:

TIMING REQUIREMENTS:
  1. You must have priority.
  2. The ninjutsu card must be in your hand (or command zone for commander ninjutsu).
  3. You must control an "unblocked attacking creature."
     - "Unblocked": not currently blocked (no blockers assigned to it).
     - "Attacking": was declared as an attacker this turn and hasn't left combat.
  4. Pay the ninjutsu cost.
  5. Return the unblocked attacking creature to its OWNER'S hand.
  6. Put the ninjutsu creature from hand to battlefield: tapped and attacking the same target.

WHEN CAN YOU USE NINJUTSU:
  After declare attackers: priority is given. Ninjutsu activatable.
  After declare blockers: if the creature you want to return is UNBLOCKED (no blockers
    assigned to it), you can still activate ninjutsu. The creature is still unblocked
    even though the declare blockers step has passed.
  During combat damage step: you have priority before damage is assigned. If the creature
    is still unblocked, ninjutsu works.
    However: once damage is assigned in the damage step, you can still have priority after
    (to cast instants). Ninjutsu still works if the creature is unblocked.
  After combat damage is dealt: the attacker has dealt its damage. The ninjutsu creature
    enters tapped and attacking but the combat damage step may be past. The ninja enters
    but doesn't deal combat damage this step (combat damage was already assigned).
    BEST WINDOW: between declare blockers and combat damage step. The creature is confirmed
    unblocked; the ninja enters and can deal combat damage in the combat damage step.

ENTERS "TAPPED AND ATTACKING":
  702.49a: "Put this card onto the battlefield from your hand tapped and attacking."
  The ninja does NOT go through the declare attackers process. It ENTERS as an attacker.
  This has several implications:

  NO SUMMONING SICKNESS RESTRICTION:
    Summoning sickness (CR 302.6) prevents a creature from ATTACKING unless it has been
    under the controller's continuous control since the start of their turn.
    Ninjutsu bypasses this: the creature isn't "declaring an attack" (which summoning
    sickness would prevent). Instead, it ENTERS already attacking as part of the ninjutsu
    resolution. Summoning sickness doesn't prevent entering the battlefield attacking.
    A ninjutsu creature on the same turn you activate ninjutsu CAN be used immediately.
    Wait: do you need to have the ninjutsu card in hand since before this turn? You need it
    in HAND when you activate ninjutsu. You can draw a ninjutsu card this turn and use it.
    Even a ninjutsu card you just drew this turn can be used this turn.

  BYPASSES "WHENEVER A CREATURE ATTACKS" TRIGGERS:
    "Whenever [creature] attacks" triggers fire when creatures ATTACK (during declare
    attackers step). The ninjutsu creature doesn't go through declare attackers.
    Triggers that fire on attacking do NOT fire for the ninjutsu creature's entry.
    The ninja doesn't "declare an attack" — it enters as an attacker.
    NOTE: "Whenever [creature] attacks" vs. "whenever [creature] enters attacking" are
    different. The former only fires at declare attackers; the latter would fire for ninjutsu.
    Most attack triggers are phrased "whenever X attacks" and thus don't fire for ninjutsu.

  ETBs DO FIRE:
    "When this creature enters" ETBs fire when the ninjutsu creature enters the battlefield.
    The creature enters (from hand, directly to battlefield). ETBs trigger.
    This fires in combat (before damage) — potentially powerful.
    Yuriko, the Tiger's Shadow (commander ninjutsu {U}{B}): "whenever a Ninja deals combat
    damage to a player, reveal top card, put to hand, opponents lose life equal to its MV."
    This is a "combat damage" trigger, not an ETB. Fires when Yuriko DEALS combat damage.

  ATTACKING THE SAME TARGET:
    702.49c: "enters attacking the same player, planeswalker, or battle as the returned creature."
    If you return a creature attacking Player A: the ninja attacks Player A.
    You can't redirect the attack to a different player/permanent when using ninjutsu.

RETURNED CREATURE LOSES EQUIPMENT AND AURAS:
  The original attacker returns to its OWNER'S HAND.
  Zone change: battlefield → hand (for the returned creature).
  Equipment: when the equipped creature leaves the battlefield, the Equipment unattaches.
    The Equipment remains on the battlefield as an unattached artifact. No loss of Equipment.
    But: it's no longer equipping anything.
  Auras: when the enchanted creature leaves the battlefield, an Aura with illegal attachment
    goes to the graveyard (state-based action: Aura not attached to a legal object).
    The Aura is LOST. It goes to the GY.
    Important: if you want to ninjutsu, consider whether any Auras on the attacker will be lost.
    Equipment survives (unattaches safely); Auras are destroyed.

COMMANDER NINJUTSU (702.49d):
  Same as ninjutsu but also functions from the command zone.
  Yuriko can be put into play from the command zone with commander ninjutsu.
  This bypasses the commander tax when using commander ninjutsu (you don't pay the mana
  cost from the command zone — you pay the ninjutsu cost from the command zone).
  Wait: commander ninjutsu cost IS paid; the commander TAX is for casting from command zone.
  Commander ninjutsu is an ACTIVATED ABILITY (not casting). So the commander tax
  (which applies to casting) does NOT apply to commander ninjutsu activation.
  Each commander ninjutsu activation resets: you can use it again each turn with a new
  unblocked attacker, regardless of how many times it's been activated before.

  After commander ninjutsu: Yuriko is on the battlefield. It's a permanent.
  If it dies: goes to command zone (commander rules). Can be commander ninjutsu'd again
  next turn (from command zone, where the ability functions).
```

## Definitive Conclusions

- **Ninjutsu creatures bypass summoning sickness** — they don't declare an attack; they enter the battlefield already attacking; summoning sickness prevents declaring attacks, not entering as an attacker.
- **"Whenever X attacks" triggers do NOT fire for ninjutsu entry** — the ninja didn't declare as an attacker; it entered attacking; attack-declaration triggers require the creature to go through the declare attackers step.
- **Ninjutsu creature ETBs DO fire in combat** — the creature enters the battlefield normally (triggering all ETBs); it just happens to also be in an attacking position when it enters.
- **Auras on the returned attacker go to the graveyard** — when the original attacker returns to hand, any Auras enchanting it lose their attachment and are put into the graveyard (SBA); Equipment safely unattaches and remains on the battlefield.
- **Ninjutsu can be activated after declare blockers** — as long as the creature is still unblocked at the time of activation; ideal activation window is between declare blockers and combat damage.
- **Commander ninjutsu doesn't add commander tax** — it's an activated ability, not casting from the command zone; the commander tax applies only to casting.

## Canonical Example
**Yuriko + Ninjutsu loop:**
You control two 1/1 unblocked attacking creatures (from last turn, no summoning sickness).
Yuriko, the Tiger's Shadow (commander ninjutsu {U}{B}) is in your command zone.

Declare attackers: both 1/1s attack opponent.
Declare blockers: opponent has no blockers. Both 1/1s are unblocked.

Activate commander ninjutsu: {U}{B} + reveal Yuriko from command zone + return one 1/1 to its owner's hand.
Yuriko enters the battlefield tapped and attacking (the same opponent the 1/1 was attacking).
One 1/1 is in your hand.

Activate Higure, the Still Wind's ninjutsu ({2}{U}{U}) using the second 1/1:
Higure enters the battlefield tapped and attacking. Second 1/1 in hand.

Combat damage step: Yuriko deals 1 damage to opponent.
Yuriko trigger fires: reveal top card of library, put to hand, opponent loses life equal to MV.
Higure deals 1 damage to opponent.
Higure trigger fires: search library for Ninja card.

After combat: both ninjas are on the battlefield with no summoning sickness for NEXT turn.
You now have a fresh hand ready for next turn's attacks.

Note: the two 1/1s returned to hand this turn will have summoning sickness if re-cast/re-deployed this turn.
But Yuriko and Higure — having been on the battlefield from this turn via ninjutsu — can attack next turn
(the check is "under continuous control since START of your NEXT turn").

**Example 2 — Ninjutsu + Aura loss:**
You control a 3/3 creature enchanted by Rancor (+2/+0 trample, returns to hand on death when the creature dies) attacking unblocked.

You activate ninjutsu on Higure: pay {2}{U}{U}, return the 3/3 to hand.
The 3/3 returns to its owner's hand. It's now in hand. Zone change: battlefield → hand.
Rancor: the enchanted creature left the battlefield. Rancor is attached to nothing (illegal attachment).
SBA: Aura not attached to a legal object → Rancor goes to GY.
Rancor has "when enchanted creature dies, return Rancor to its owner's hand" — but the creature didn't DIE (it went to hand). The Rancor trigger is for death (GY), not "when the enchanted creature leaves the battlefield." Rancor goes to GY via SBA (illegal attachment), not via its own trigger. It stays in the GY.

Wait: Rancor says "when enchanted creature dies, return Rancor to its owner's hand." The 3/3 didn't die (it's in hand). Rancor's triggered ability doesn't fire. Rancor goes to GY via SBA.

You lost Rancor by using ninjutsu. Strategic consideration: don't ninjutsu away creatures with Auras unless you're okay losing those Auras.

Equipment: if the 3/3 had an Equipment attached, the Equipment would unattach safely (remaining on the battlefield as a standalone artifact, not lost).

## Commonly Confused With
- **P433 (Dash)** — Dash and ninjutsu both create temporary/alternative attack scenarios. Dash casts from hand with haste and returns at end step. Ninjutsu puts a card from hand to battlefield attacking, returning a different creature to hand. Both bypass normal casting but via very different mechanics.
- **P434 (Myriad)** — Myriad creates token copies that enter tapped and attacking (like ninjutsu). Both result in creatures entering already in combat. Myriad's tokens don't fire ETBs (wait: myriad DOES fire ETBs — tokens are put onto the battlefield). Both enter attacking without going through declare attackers.
- **P431 (Bestow)** — Bestow creatures entering as creatures trigger ETBs; bestow entering as Auras does not (no ETB for becoming an attachment). Ninjutsu entering as a creature always triggers ETBs (it enters the battlefield, just already attacking).
