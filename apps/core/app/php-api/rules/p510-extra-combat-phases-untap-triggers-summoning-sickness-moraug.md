---
id: p510
name: Extra Combat Phases — Untap Conditions, Trigger Resets, Summoning Sickness, and Moraug Landfall Sequencing
category: combat
cr_refs: [508.1, 507.1, 603.2c, 702.9, 500.6]
tags: [extra-combat, additional-combat, aggravated-assault, moraug, world-at-war, savage-beating, untap-creatures, summoning-sickness, haste, once-per-combat, vigilance, helm-of-the-host, ninjutsu, landfall, combat-phase]
created: 2026-03-30
examples_count: 4
---

# P510 — Extra Combat Phases — Untap Conditions, Trigger Resets, Summoning Sickness, and Moraug Landfall Sequencing

## Abstract
Extra combat phases (from Aggravated Assault, Moraug, World at War, Savage Beating, etc.) are complete combat phases with all five steps (beginning, declare attackers, declare blockers, damage, end of combat). Key rules: (1) Most extra combat sources specifically **untap** creatures before the new combat — but the untap step is NOT repeated; (2) "Whenever this creature attacks" triggers fire **once per attack declaration**, resetting each combat; (3) "Once per combat" abilities reset between combat phases; (4) "Once each turn" abilities (like Boast) do **not** reset between combats; (5) Creatures with summoning sickness still **cannot** attack in extra combats unless the untap effect specifically gave them haste or they gained haste some other way — "untapping" doesn't grant haste; (6) Moraug's landfall trigger during the precombat main phase creates an additional combat **before** the regular combat, and without an additional untap step, creatures that entered that turn will still have summoning sickness; (7) Helm of the Host tokens created at the beginning of combat have haste and can attack that combat — and again in extra combats.

## The Definitive Rules

**CR 500.6:** *"Some effects can add phases to a turn. A turn can have any number of phases of the same type."*

**CR 508.1:** *"The active player declares attackers. This is a turn-based action."* — Attacks are declared fresh each combat phase.

**CR 702.9a (Haste):** *"Haste lets a creature attack even if it hasn't been under its controller's control continuously since the beginning of that player's most recent turn."* — Haste lets you bypass summoning sickness, but UNTAPPING does not grant haste.

**CR 603.2c:** *"If multiple events occur in a single ability trigger, each event triggers separately unless the trigger references them together."* — "Whenever [creature] attacks" fires once per declare-attackers step per creature, regardless of how many combats have occurred.

**Aggravated Assault (Oracle):** *"{3}{R}{R}: Untap all creatures you control. After this main phase, there is an additional combat phase followed by an additional main phase. Activate only as a sorcery."*

**Moraug (Official ruling, 2020-09-25):** *"If the landfall ability resolves during your precombat main phase, the additional combat phase will happen before your regular combat phase. You'll untap creatures you control at the beginning of the additional combat but not at the beginning of your regular combat."*

**Moraug (Official ruling, 2020-09-25):** *"A creature that enters the battlefield attacking hasn't attacked that combat. Moraug's ability won't count that combat."*

**World at War (Oracle):** *"After the second main phase this turn, there's an additional combat phase followed by an additional main phase. At the beginning of that combat, untap all creatures that attacked this turn."*

## The Pattern

```
STRUCTURE OF AN EXTRA COMBAT PHASE:

  An additional combat phase is a COMPLETE combat phase:
    (1) Beginning of combat
    (2) Declare attackers
    (3) Declare blockers
    (4) Combat damage
    (5) End of combat

  Each step fires all relevant triggers.
  "At the beginning of combat" triggers fire each combat.
  "Whenever [creature] attacks" triggers fire each combat in which it attacks.
  "At end of combat" triggers fire at the end of EACH combat phase.

UNTAP MECHANICS:

  Extra combat grants DO NOT include a new untap step.
  The question "can a creature attack in extra combat?" depends on:
    (a) Is it untapped? (Most extra combat sources untap creatures.)
    (b) Does it have haste, or has it been under your control since your last turn's start?

  AGGRAVATED ASSAULT: "Untap all creatures you control" before the extra combat.
    → All creatures you control untap (even those with summoning sickness).
    → But untapping does NOT grant haste.
    → A creature that entered THIS TURN still has summoning sickness unless it has haste.
    → It untaps, but cannot attack (summoning sickness).

  WORLD AT WAR: "At the beginning of that combat, untap all creatures that attacked this turn."
    → Only creatures that ATTACKED this turn get untapped for the extra combat.
    → Other creatures remain tapped (or untapped but not relevant).

  MORAUG: "At the beginning of that combat, untap all creatures you control."
    → All creatures untap at the beginning of each additional combat.
    → Still: untap ≠ haste. New creatures with summoning sickness cannot attack.

SUMMONING SICKNESS AND EXTRA COMBATS:

  Summoning sickness rule: A creature can't attack or use {T} abilities unless:
    (a) You have controlled it continuously since the beginning of your MOST RECENT TURN, OR
    (b) It has haste.

  A creature that entered THIS TURN (say, via flash during your precombat main phase) can:
    → Be untapped by Aggravated Assault → but STILL cannot attack (summoning sickness).
    → Attack in extra combats ONLY if it has haste.

  Workaround: Fervor, Lightning Greaves, Swiftfoot Boots, etc. grant haste → removes
    summoning sickness → creature CAN attack in extra combats.

  KEY DISTINCTION:
    Vigilance: creature attacks without tapping → can attack in every combat without needing
      to be untapped by an extra-combat effect.
    Haste: creature can attack even with summoning sickness → can attack in extra combats
      even on the turn it entered.

MORAUG LANDFALL SEQUENCING:

  Moraug trigger: "whenever a land enters under your control, if it's your main phase,
    there's an additional combat phase AFTER THIS PHASE."

  LANDFALL DURING PRECOMBAT MAIN PHASE:
    → Extra combat happens BEFORE your regular combat.
    → During that extra combat, creatures untap.
    → During your REGULAR combat: NO additional untap step.
    → Creatures that attacked in the extra combat are tapped going into regular combat.
      (Unless they have vigilance.)

  LANDFALL DURING POSTCOMBAT MAIN PHASE:
    → Extra combat happens after your postcombat main phase.
    → Creatures that attacked in regular combat get untapped for the extra combat.
    → This is the typical "second combat" use: post-combat land drop → extra swing.

  MULTIPLE LANDFALLS IN ONE MAIN PHASE:
    "If the landfall ability resolves twice during your postcombat main phase, you'll get
     two consecutive additional combat phases (untapping at beginning of each)."
    → Stack: both triggers placed on stack in APNAP order.
    → When the first resolves: extra combat 1 happens → return to main phase.
    → Second trigger fires: extra combat 2 happens.
    → Two total combats after the main phase.

  MORAUG'S +1/+0 SCALING:
    "Each creature gets +1/+0 for each time it has attacked this turn."
    → Counts ALL attacks across ALL combat phases.
    → A creature that attacked twice gets +2/+0 on its third attack.
    → The bonus applies DURING combat damage (retroactively counts attacks in the same turn).

ONCE-PER-COMBAT VS. ONCE-EACH-TURN:

  ONCE PER COMBAT (like Boast): "Activate only once each combat."
    These abilities RESET between combat phases.
    Example: Boast can be activated once in regular combat AND once in each extra combat.

  ACTUALLY: "Boast — ...activate only if this creature attacked this combat."
    The condition must be met each time. In each extra combat, the creature must attack to boast.
    But the "once per combat" limitation is per-combat-phase.

  ONCE EACH TURN (similar phrasing to once-per-combat but NOT):
    "Activate only as a sorcery" means once per stack-clear, not once per combat.
    Aggravated Assault's own ability can be activated multiple times in the SAME main phase
      as long as you have enough mana.
    Official ruling: "If you have enough mana, the ability may be activated more than once
      in a turn."

"WHENEVER [CREATURE] ATTACKS" TRIGGERS:

  Fires once per declare-attackers step in which the creature is declared as an attacker.
  With N extra combats: the creature can trigger up to N+1 times (once per combat).
  Does NOT fire if the creature "enters the battlefield attacking" (as a token or via
    ninjutsu) — CR 508.1c: "A permanent that enters attacking hasn't been declared as an
    attacker for purposes of triggered abilities."

HELM OF THE HOST IN EXTRA COMBATS:

  Helm of the Host ({4}: equip {5}) triggers "at the beginning of combat on your turn."
  This fires at the BEGINNING OF EACH COMBAT PHASE.
  → In regular combat: token enters with haste.
  → In extra combats: ANOTHER trigger fires at the beginning of that combat.
    → Another token is created with haste.
    → The new token CAN attack in that extra combat (it has haste).
    → The previous token may or may not be able to attack (if it tapped to attack last
        combat, it's tapped; if it has vigilance, it's untapped).

  Result: With 3 combat phases, Helm creates 3 tokens total — one per combat, each with haste.

NINJUTSU IN EXTRA COMBATS:

  Ninjutsu: "Return an unblocked attacker you control to hand: put this card from hand into play
    tapped and attacking."

  In extra combat phases: if you have unblocked attackers, you CAN use ninjutsu again.
  The creature that was returned to hand is untapped in your hand (cards in hand aren't tapped).
  It can be cast again with haste if it has haste, or held for next turn if not.
  The ninjutsued creature enters attacking — but hasn't been "declared as attacker" per rules.
  "Whenever this creature attacks" does NOT fire for a ninjutsued entry (it entered attacking,
    not declared as attacker).
```

## Definitive Conclusions

- **Untapping a creature does not grant haste** — creatures with summoning sickness are untapped by Aggravated Assault but still cannot attack; only haste removes summoning sickness.
- **"Whenever this creature attacks" fires once per combat phase** — with three combat phases and attacking each time, the trigger fires three times; the creature's TOTAL attacks count for Moraug's bonus.
- **Moraug landfall in precombat main phase creates extra combat before regular combat** — creatures untap for the extra combat but NOT again for regular combat; attackers from the extra combat are tapped going into regular combat.
- **Helm of the Host creates a new token at the beginning of EACH combat phase** — three combats = three tokens, each with haste, each able to attack that combat.
- **Aggravated Assault can be activated multiple times per turn** — each activation creates another extra combat; "once per combat" does not apply to its own activation timing.
- **Ninjutsu works in extra combats if you have an unblocked attacker** — the ninjutsued creature enters attacking but doesn't trigger "whenever this creature attacks."

## Canonical Example

**Aggravated Assault + Savage Ventmaw:**

You control Aggravated Assault ({2}{R}) and attack with Savage Ventmaw ({4}{R}{G}: Flying; "whenever this creature attacks, add {R}{R}{R}{G}{G}{G}"). It connects.

During your postcombat main phase: activate Aggravated Assault for {3}{R}{R} (you have the mana from Savage Ventmaw's combat trigger). Untap all creatures. After this main phase, another combat begins.

In the new combat: Savage Ventmaw attacks again → triggers again → adds {R}{R}{R}{G}{G}{G}.

You can keep doing this as long as you can pay {3}{R}{R} = 5 mana. Savage Ventmaw generates 6, so you net {R}{G}{G} per cycle. Infinite combats.

**Example 2 — Moraug Double Landfall:**

You control Moraug, Fury of Akoum ({4}{R}{R}: 6/6) with three creatures on the battlefield. During your postcombat main phase, you play a fetchland. Moraug's landfall trigger fires: "additional combat after this phase." The fetchland enters: second landfall trigger fires: "additional combat after this phase."

Stack (APNAP): Trigger 1 (bottom), Trigger 2 (top). Trigger 2 resolves first: extra combat 1. Your three creatures untap. Attack. End of combat.

Return to main phase. Trigger 1 resolves: extra combat 2. Creatures untap again. Attack.

Two extra combats. Moraug's bonus: if a creature attacked twice in both extra combats and the regular combat, it has attacked 3 times total, getting +3/+0 on its third attack.

**Example 3 — Summoning Sickness in Extra Combat:**

You use Chord of Calling at instant speed during your precombat main phase to put Goblin Rabblemaster ({2}{R}: 3/2) onto the battlefield (it entered this turn, so it has summoning sickness).

Aggravated Assault activates. Rabblemaster is untapped by the effect. The extra combat begins. Can Rabblemaster attack? NO — it has summoning sickness (entered this turn, doesn't have haste). It's untapped but cannot attack.

Solution: If you had Lightning Greaves equipping Rabblemaster, it would have haste, removing summoning sickness, allowing it to attack in every combat this turn.

**Example 4 — World at War + Rebound:**

You cast World at War ({3}{R}{R}: Sorcery). It resolves: exile it (rebound). After your second main phase, an extra combat follows (untapping creatures that attacked this turn).

Turn 2: At your upkeep, you may cast World at War for free from exile. It resolves again (rebound done — it goes to graveyard since it was already rebounded). After your second main phase, another extra combat with untap.

This gives you an extra combat on TWO consecutive turns from one World at War cast.

## Commonly Confused With
- **P341 (Combat Phase Structure)** — P341 covers the five steps of a single combat phase. P510 covers what happens when multiple combat phases occur in one turn.
- **P016 (Phasing)** — Phasing is not a zone change and does not reset "times attacked this turn" counters.
- **P482 (Boast — Once Per Combat)** — Boast is specifically "once per combat" and resets between combat phases. P510 clarifies that "once each turn" abilities (Aggravated Assault) do NOT reset between combats.
- **P188 (Exhaust — Once Only)** — Exhaust abilities do NOT reset between combats (they reset on zone change). Once-per-combat abilities are fundamentally different from exhaust.
