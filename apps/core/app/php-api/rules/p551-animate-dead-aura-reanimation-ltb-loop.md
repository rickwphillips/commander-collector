---
id: p551
name: Animate Dead — Aura Reanimation, LTB Triggers, and Loop Mechanics
category: zones
cr_refs: [603.6c, 614.1, 104.4b, 110.1]
tags: [animate-dead, aura, graveyard, reanimation, ltb, loop, necromancy, leaves-battlefield]
created: 2026-03-31
examples_count: 3
---

# P551 — Animate Dead — Aura Reanimation, LTB Triggers, and Loop Mechanics

## Abstract

**Animate Dead and similar reanimation Auras grant the enchanted creature abilities, including a leaves-the-battlefield trigger that returns the creature to the battlefield.** When the enchanted creature dies, the Aura's LTB trigger fires using last-known information (CR 603.6c) — the trigger sees the creature as it was when it left the battlefield. If the LTB trigger returns the creature immediately (via the Aura's ability), the creature is back on the battlefield while the death trigger is still pending. Multiple reanimation Auras on the same creature create independent LTB triggers, each with the potential to return the creature. Animate Dead combined with a sacrifice outlet and haste creates a potential loop; CR 104.4b governs whether infinite loops are legal (mandatory loops are illegal; optional loops require a declared stopping point). This pattern clarifies LTB trigger timing, last-known information, and loop mechanics with reanimation Auras.

## The Definitive Rules

**CR 603.6c (Leaves-The-Battlefield Abilities):** *"Leaves-the-battlefield abilities use last known information. The ability sees what the permanent was immediately before it left."*

**CR 614.1 (Replacement Effects):** *"Replacement effects watch for a particular event and completely or partially replace it with a different event."*

**CR 614.6 (Replaced Events Don't Trigger):** *"If an event is replaced, it doesn't happen. Triggered abilities that would trigger on the original event don't trigger."*

**CR 104.4b (Infinite Loops):** *"If a game state is repeating, the player whose turn it is makes a decision to break the loop (if a loop is infinite and mandatory, the player loses the game; if optional, the player chooses how many times the loop repeats)."*

**CR 110.1 (Zone Changes):** *"A permanent moves from one zone to another as a result of game events or player actions."*

**Official Ruling (Animate Dead):** *"When the creature enchanted by Animate Dead dies, Animate Dead's leaves-the-battlefield ability triggers and returns that creature to the battlefield. If Animate Dead is also sent to the graveyard (e.g., via the creature's death), the creature remains on the battlefield but Animate Dead is in the graveyard."*

## The Pattern

```
ANIMATE DEAD MECHANICS:

  Animate Dead: Enchantment — Aura ({1}{B})
  "Enchant creature card in a graveyard
   When Animate Dead enters, if it's on the battlefield,
   return enchanted creature card to the battlefield under your control.
   When Animate Dead leaves the battlefield, that creature dies."

  Key abilities:
    1. ETB: return enchanted creature (target card, not already on field)
    2. LTB: the creature dies (if it's on battlefield)

LAST-KNOWN INFORMATION AND LTB:

  When enchanted creature dies:
    - Animate Dead's LTB trigger fires
    - Trigger uses last-known information (LKI): creature's state immediately before death
    - LKI includes: name, type, P/T, abilities (all characteristics at time of leaving)
    - Even if the creature's characteristics changed (color, type, etc.) while on field,
      LTB sees the creature as it was when it left

  Example: Creatures dies as a 5/5 Zombie
    - LKI: 5/5 Zombie with all its abilities
    - Animate Dead returns: a 5/5 Zombie (as it was)
    - If creature was a 3/3 when it died, return 3/3 (not the Animate Dead's base state)

MULTIPLE ANIMATE DEAD AURAS:

  If a creature has TWO Animate Dead Auras enchanting it:
    - Creature dies
    - Both Animate Dead LTB triggers fire (one per Aura)
    - Both triggers use LKI (same creature state)
    - Both try to return the creature
    - First trigger resolves: creature returns to battlefield
    - Second trigger resolves: creature is on battlefield (can't return if already there)
      → Trigger checks: does the creature still exist in graveyard? No
      → Trigger tries to resolve: "return that creature" but it's not in graveyard
      → Trigger fizzles (target no longer valid)

ANIMATE DEAD + SACRIFICE OUTLET LOOP:

  Setup: Animate Dead enchanting creature + sacrifice outlet
    - Creature is on battlefield
    - Animate Dead is enchanting it

  Turn sequence:
    1. Sacrifice the creature (pays cost to sacrifice outlet)
    2. Creature is put into graveyard
    3. Animate Dead's LTB trigger fires: "that creature dies"
       (Note: creature is in graveyard, not from combat/damage; "dies" = state-based)
    4. Trigger resolves: return creature to battlefield under your control
    5. Back to step 1: sacrifice again

  Question: Is this loop mandatory?
    - Sacrifice is optional (you choose to pay the cost)
    - Animate Dead's return is a triggered ability (resolves without choice)
    - Loop is OPTIONAL (you choose whether to sacrifice)
    - Legal if you declare a stopping point (e.g., "I sacrifice 5 times, then stop")

ANIMATE DEAD + HASTE + SACRIFICE OUTLET:

  If the enchanted creature has HASTE:
    1. Creature enters (via Animate Dead return)
    2. Creature has haste (can attack immediately)
    3. Creature attacks (if you control a sacrifice outlet, sacrifice it in combat)
    4. Creature dies in combat
    5. Animate Dead LTB trigger fires: return creature
    6. Creature returns with haste (can attack again immediately)
    7. Loop repeats

  This loop is still OPTIONAL (you choose whether to attack/sacrifice).

ANIMATE DEAD AURA REMOVAL:

  If Animate Dead is removed from the battlefield (via destruction, bounce, etc.):
    - Aura leaves the battlefield
    - If Aura's LTB effect is "that creature dies":
      → Creature is on field when Aura leaves
      → Creature dies (SBA puts it in graveyard)
    - Creature is now in graveyard (no longer enchanted)
    - If Animate Dead is destroyed, it's in graveyard (can't return creature)

  Scenario: Animate Dead enchanting creature; creature dies; Animate Dead goes to graveyard
    - Creature: graveyard (died from damage)
    - Animate Dead: graveyard (destroyed/removed)
    - Animate Dead's LTB doesn't trigger (it was already gone when creature died)

ETB TRIGGERS AND ANIMATE DEAD:

  When Animate Dead returns a creature to the battlefield:
    - Creature enters the battlefield
    - ETB triggers on the creature fire
    - ETB triggers on other permanents fire (e.g., Panharmonicon, Warstorm Surge)
    - Creature is on field with fresh entry timestamp

ANIMATE DEAD + FLICKER EFFECTS:

  If a creature enchanted by Animate Dead is flickered (exiled and returned):
    - Creature returns to field
    - Animate Dead is still enchanting it (Aura persists)
    - When creature dies again: Animate Dead LTB triggers as normal

  If Animate Dead itself is flickered:
    - Aura leaves and returns (re-enters)
    - Aura's ETB trigger resolves: return enchanted creature (if in graveyard)
    - Result: creature returns via ETB of the Aura, not LTB

```

## Definitive Conclusions

- **LTB triggers use last-known information** — Animate Dead's trigger sees the creature as it was when it died.
- **Multiple Auras create multiple triggers** — each LTB trigger is independent; only one creature is returned per cycle.
- **Sacrifice loops are optional** — players choose whether to sacrifice, so infinite loops are legal if declared stopping point is given.
- **Haste enables repeated attacks** — creature can attack immediately after return if it has haste; loop is still optional.
- **Aura removal prevents LTB** — if Animate Dead is removed before creature death, LTB doesn't trigger.

## Canonical Example

**Animate Dead on Creature:**

You cast Animate Dead targeting a creature card in your graveyard. It enters, returning the creature to the battlefield.

The creature attacks and dies in combat. Animate Dead's LTB trigger fires: "that creature dies."

The creature returns to the battlefield under your control (from graveyard). You control a sacrifice outlet.

You activate the outlet: sacrifice the creature. Creature goes to graveyard. Animate Dead's LTB trigger fires again.

Creature returns. You sacrifice again (creating a loop). You declare you'll do this 5 times, then stop the loop.

After 5 iterations, you stop sacrificing. Creature remains on the battlefield.

**Example 2 — Multiple Animate Dead Auras:**

Creature in graveyard. You cast Animate Dead on it; it returns to the battlefield.

Later, you cast a second Animate Dead on the same creature (enchanting the creature card, which is now on the battlefield with one Aura already).

Creature dies in combat.

First Animate Dead's LTB trigger fires: creature returns to the battlefield.

Second Animate Dead's LTB trigger fires: tries to return the creature, but it's already on the battlefield (not in graveyard). Trigger fizzles.

Only one creature is returned.

**Example 3 — Animate Dead + Flicker:**

Creature enchanted by Animate Dead. You cast Ephemerate on the creature.

Creature is exiled, then returns at end of turn. Animate Dead is still attached.

Later, creature dies (not in combat). Animate Dead's LTB trigger fires: creature returns to the battlefield.

## Commonly Confused With

- **P003 (Zone Change Identity)** — P003 covers zone-change object identity; P551 applies to LTB triggers and reanimation mechanics.
- **P011 (Linked Ability Zone Reset)** — P011 covers linked ability zones; P551 clarifies Animate Dead's LTB trigger on zone-changed creatures.
- **P019 (Mandatory Infinite Loop)** — P019 covers mandatory loops; P551 applies to optional sacrifice loops with reanimation.
