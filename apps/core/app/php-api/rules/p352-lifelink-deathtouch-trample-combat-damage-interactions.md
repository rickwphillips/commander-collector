---
id: p352
name: Lifelink, Deathtouch, and Trample — Combat Damage Interactions
category: combat
cr_refs: [702.2a, 702.2b, 702.2c, 702.2d, 702.15a, 702.15b, 702.15e, 120.3f, 120.4a, 120.4b, 120.4c, 120.4d, 702.19b, 510.1, 510.2]
tags: [lifelink, deathtouch, trample, combat-damage, lethal-damage, life-gain, simultaneous-damage, damage-assignment, Vampire-Nighthawk, Basilisk-Collar, Scion-of-Darkness, Garruk-Relentless, Questing-Beast, infect-deathtouch, trample-deathtouch, lifelink-trigger-myth]
created: 2026-03-29
examples_count: 2
---

# P352 — Lifelink, Deathtouch, and Trample — Combat Damage Interactions

## Abstract
**Lifelink** (702.15) is a **static ability**, NOT a triggered ability — life is gained simultaneously with damage being dealt (120.3f), not as a separate trigger that goes on the stack. **Deathtouch** (702.2) means ANY nonzero amount of combat damage assigned to a creature is considered lethal for damage-assignment purposes (702.2c). This interacts powerfully with **trample** (702.19b): a trample+deathtouch creature only needs to assign 1 damage to each blocker (lethal by deathtouch definition), then route all remaining damage to the defending player. These keywords interact in ways players frequently misunderstand: lifelink life gain can't be "responded to" (no stack), deathtouch still triggers SBA destruction (not immediate death), and trample's excess calculation uses assigned lethal damage (where deathtouch makes 1 = lethal).

## The Definitive Rules

**CR 702.15a** (verbatim): *"Lifelink is a static ability."*

**CR 702.15b** (verbatim): *"Damage dealt by a source with lifelink causes that source's controller, or its owner if it has no controller, to gain that much life (in addition to any other results that damage causes). See rule 120.3."*

**CR 702.15e** (verbatim): *"If multiple sources with lifelink deal damage at the same time, they cause separate life gain events (see rules 119.9–10). Example: A player controls Ajani's Pridemate, which reads 'Whenever you gain life, put a +1/+1 counter on this creature,' and two creatures with lifelink. The creatures with lifelink deal combat damage simultaneously. Ajani's Pridemate's ability triggers twice."*

**CR 120.3f** (verbatim): *"Damage dealt by a source with lifelink causes that source's controller to gain that much life, in addition to the damage's other results."*

**CR 702.2b** (verbatim): *"A creature with toughness greater than 0 that's been dealt damage by a source with deathtouch since the last time state-based actions were checked is destroyed as a state-based action. See rule 704."*

**CR 702.2c** (verbatim): *"Any nonzero amount of combat damage assigned to a creature by a source with deathtouch is considered to be lethal damage for the purposes of determining if excess damage is being dealt."*

**CR 702.19b** (verbatim, partial): *"The controller of an attacking creature with trample first assigns damage to the creature(s) blocking it. Once all those blocking creatures are assigned lethal damage, any excess damage is assigned as its controller chooses among those blocking creatures and the player, planeswalker, or battle the creature is attacking."*

**CR 120.4a** (verbatim, partial): *"Any amount of damage greater than 1 is excess damage if the source dealing that damage to a creature has deathtouch."*

## The Pattern

```
LIFELINK — STATIC, NOT TRIGGERED (702.15a, 120.3f):
  CRITICAL MISCONCEPTION: lifelink is NOT a triggered ability.
  "When this creature deals damage, you gain that much life" would be a TRIGGER.
  That's NOT how lifelink works.
  CORRECT: life gain happens SIMULTANEOUSLY as damage is dealt.
  This means:
    - No one can "respond" to lifelink life gain. It's not on the stack.
    - You can't cast "pay 2 life" spells in response to "the lifelink trigger."
      (There is no lifelink trigger.)
    - Life is gained immediately as part of the damage event (120.4c).
  SEQUENCE (120.4):
    1. Damage assignment (what amount goes where)
    2. Damage dealt (replacement/prevention effects apply)
    3. Results processed: life loss to players, -1/-1 or damage counters to creatures
       → Lifelink life gain happens HERE as part of results
    4. Damage event occurs

  MULTIPLE LIFELINK SOURCES (702.15e):
    If you have TWO creatures with lifelink dealing damage simultaneously:
      They cause SEPARATE life gain events, not one combined event.
      Why this matters: "Whenever you gain life" triggers (like Ajani's Pridemate)
      trigger ONCE PER LIFE GAIN EVENT.
      Two lifelink creatures dealing damage = two separate events = two Pridemate triggers.
      ONE creature with lifelink dealing damage to multiple targets in one event = ONE life gain event.
    Example:
      Creature A (2/2 lifelink): deals 2 damage. Creature B (3/3 lifelink): deals 3 damage.
      You gain 2 life (from A's event) + 3 life (from B's event) = 5 life total.
      Ajani's Pridemate gets TWO +1/+1 counters (one per event).
      If it were ONE creature with lifelink dealing 5 damage: ONE event, ONE Pridemate trigger.

DEATHTOUCH — LETHAL AT 1 (702.2b, 702.2c):
  DEATHTOUCH AND DESTRUCTION:
    702.2b: A creature that's been dealt ANY damage by a deathtouch source is destroyed as SBA.
    This is a state-based action, not immediate. The SBA fires AFTER the damage step, when
    SBAs are checked (before anyone gets priority — 704.3).
    The creature is NOT destroyed the moment it's assigned damage. It dies when SBAs are checked.
  DEATHTOUCH IN DAMAGE ASSIGNMENT (702.2c):
    When assigning combat damage from a deathtouch creature attacking (or blocking):
      1 damage assigned to a creature = "lethal" for damage-assignment rules.
      This is specifically for determining when "excess" damage can be routed elsewhere.
    WHY THIS MATTERS:
      Without deathtouch: a 1/7 blocker requires 7 damage assignment before trample goes through.
      With deathtouch: a 1/7 blocker only requires 1 damage assignment (lethal by deathtouch).
      Any attacker with deathtouch + trample can route through almost everything.

TRAMPLE + DEATHTOUCH (702.19b, 702.2c):
  The most powerful keyword combination for an attacking creature.
  HOW IT WORKS:
    Attacker with trample + deathtouch declares attack.
    Blockers declared.
    Damage assignment step:
      Assign minimum "lethal" damage to each blocker.
      With deathtouch: 1 damage = lethal for each blocker.
      Route ALL remaining damage to defending player.
  EXAMPLE:
    10/10 with trample + deathtouch attacks.
    Blocked by 3 creatures: 5/5, 7/7, 9/9.
    WITHOUT deathtouch: need 5+7+9=21 damage. Only 10 available. No trample damage.
    WITH deathtouch: need 1+1+1=3 damage. Remaining 7 damage goes to defending player.
    Result: all three blockers die (SBA from deathtouch damage), player takes 7.
  EDGE CASE: Indestructible blocker with deathtouch attacker
    Deathtouch DESTROYS via SBA. Indestructible prevents destruction.
    So 1 damage still "assigned" (= lethal per 702.2c for excess calculation).
    But the indestructible creature doesn't die.
    Trample still works: 1 damage assignment satisfies "lethal," excess goes through.
    The indestructible blocker survives but trample damage still reaches the player.
  PROTECTION AND DEATHTOUCH:
    If a blocker has protection from the attacker's color:
      Protection prevents all damage from that source (614.17).
      If no damage is DEALT (prevented): deathtouch doesn't trigger SBA destruction.
      702.2b says "been dealt damage" — not "been assigned damage."
      If damage is prevented: it's never dealt. Deathtouch SBA doesn't fire.
      But: for trample assignment, you must ASSIGN lethal (as if damage would be dealt, 702.19b).
      The assignment is made, but damage is prevented. Trample excess is still assigned.

LIFELINK + DEATHTOUCH ON THE SAME CREATURE:
  Classic example: Vampire Nighthawk ({1}{B}{B}): 2/3, flying, deathtouch, lifelink.
  When it deals combat damage:
    - Any amount dealt to a creature = that creature dies (SBA 702.2b).
    - That same damage causes you to gain life (702.15b, 120.3f).
  A 2/3 Nighthawk kills any blocker (deathtouch) and gains 2 life (lifelink) in combat.
  If unblocked: deals 2 to opponent, gain 2 life.
  If blocked by a 6/6: Nighthawk dies (2 damage ≥ 3? No, Nighthawk has 3 toughness, 6 damage = dead).
    Wait: 6/6 deals 6 damage to Nighthawk (3 toughness) → Nighthawk dies (SBA 704.5g).
    Nighthawk deals 2 damage to 6/6 → 6/6 destroyed (SBA 702.2b, deathtouch).
    Nighthawk's controller gains 2 life (lifelink, 120.3f).
    Both creatures die. Net: +2 life for Nighthawk's controller.

LIFELINK DOESN'T PREVENT LETHAL DAMAGE TO LIFELINK CREATURE:
  Lifelink causes life gain. It does NOT prevent the creature from dying.
  If a 2/2 lifelink creature blocks a 3/3:
    2/2 takes 3 damage. Dies (SBA: marked damage ≥ toughness).
    3/3 takes 2 damage. Survives (2 damage < 3 toughness).
    Lifelink creature's controller gains 2 life.
    The 2/2 still dies despite lifelink.

DEATHTOUCH FROM NONCOMBAT SOURCES:
  702.2d: Deathtouch functions regardless of what zone the source deals damage from.
  A spell with deathtouch (or an artifact giving deathtouch) that deals noncombat damage:
    If it deals ANY damage to a creature, that creature is destroyed as SBA (702.2b).
  This means: a card like Thornbite Staff ({2}) giving "Whenever equipped creature deals damage
    to another creature, that creature gets -1/-1" combined with deathtouch → instant kill.
  Wait: that's wither, not deathtouch. But the point stands for deathtouch noncombat damage:
    Deathtouch source dealing ANY damage to a creature → creature destroyed by SBA.
    This includes Lightning Bolt enchanted with Basilisk Collar (which grants deathtouch).
    Even 1 damage from a deathtouch source kills any creature with toughness > 0.

FIRST STRIKE / DOUBLE STRIKE + DEATHTOUCH:
  First strike and double strike deal combat damage in the FIRST strike damage step (510.4).
  Deathtouch SBA is checked after first strike damage.
  If a deathtouch + first strike creature deals 1 damage to a blocker:
    SBAs checked: blocker was dealt damage by deathtouch source → blocker destroyed.
    Blocker is dead before second/normal strike damage step.
    Result: deathtouch + first strike kills blockers before they deal normal damage back.
  EXTREMELY POWERFUL: 1/1 deathtouch first strike can kill any creature and take no damage.
    (Assuming the blocker has no first strike/double strike itself.)
    The 1/1 deals 1 damage (lethal by deathtouch) in first strike step.
    Blocker dies before it can deal damage back in normal step.
    1/1 survives unharmed.
```

## Definitive Conclusions

- **Lifelink is a static ability, not a triggered ability** — life gain is simultaneous with damage; opponents can't "respond to the lifelink trigger" because there is no trigger on the stack.
- **Multiple lifelink creatures dealing damage simultaneously cause SEPARATE life gain events** — each is its own event for triggers like Ajani's Pridemate.
- **Deathtouch makes 1 damage = lethal for assignment purposes** — this is the key for trample+deathtouch: assign 1 to each blocker (lethal), route the rest to the player.
- **Deathtouch destroys via SBA, not immediately** — the SBA fires after the damage step, before any player gets priority; the creature doesn't die the moment damage is assigned.
- **Deathtouch + trample is the most efficient blocker-clearing keyword combination** — a 2/2 deathtouch+trample attacker can kill multiple 10/10 blockers and still deal 1 damage to the player after assigning 1 to each.
- **Protected creatures prevent deathtouch damage** — if protection prevents the damage from being dealt, deathtouch SBA doesn't fire (no damage was dealt).
- **First strike + deathtouch = one-sided kills** — deals damage in first strike step, blocker dies, the first-strike creature takes no damage back.

## Canonical Example
**Questing Beast — Vigilance, Haste, Deathtouch, Lifelink:**
Questing Beast ({2}{G}{G}): 4/4 with vigilance, haste, deathtouch, lifelink (simplified — actual text includes more). Enters the battlefield.

TURN IT ENTERS (has haste):
  Declare Questing Beast as attacker. (Vigilance: doesn't tap.)
  Opponent has a 6/6 blocker and 5 other creatures.
  Opponent declares the 6/6 as blocker.
  Damage assignment:
    6/6 assigns 6 damage to Questing Beast (4 toughness — will die).
    Questing Beast assigns 4 damage to the 6/6.
    Note: with deathtouch, Questing Beast only NEEDED to assign 1 damage (lethal).
    But trample isn't relevant here — it's blocked by the 6/6 only.
    So all 4 damage goes to the 6/6.
  Damage dealt simultaneously:
    Questing Beast: 6 damage marked. Toughness 4. 6 ≥ 4: Questing Beast dies.
    6/6: any damage from deathtouch source → SBA destroys it. Dead.
    Questing Beast controller gains 4 life (lifelink: 4 damage dealt = 4 life).
  Questing Beast dies. 6/6 dies. Controller net: -1 creature, +4 life, trade-off removes
    opponent's 6/6 (could have been your biggest threat).

SCENARIO 2 — UNBLOCKED:
  Questing Beast attacks. Not blocked.
  Deals 4 damage to opponent (player).
  Deathtouch: doesn't matter for player damage (no SBA for players, they just lose life).
  Lifelink: controller gains 4 life.
  Net: opponent -4 life, controller +4 life. 8-point life swing.

SCENARIO 3 — BASILISK COLLAR ON AN X/1:
  You equip Basilisk Collar ({1}) on a 1/1 Squirrel token.
  Basilisk Collar: "Equipped creature has deathtouch and lifelink."
  1/1 deathtouch lifelink now.
  Attack. Blocked by a 10/10.
  Damage: 10/10 deals 10 damage to 1/1 → 1/1 dies (10 ≥ 1).
  1/1 deals 1 damage to 10/10 → deathtouch SBA → 10/10 destroyed.
  1/1 controller gains 1 life (lifelink).
  The 1/1 dies but takes down a 10/10.

**Example 2 — Deathtouch + Trample: 2/2 vs. an Army:**
You control a 2/2 with deathtouch and trample. Opponent has three 5/5 creatures as blockers.
They declare all three as blockers.

Damage assignment step:
  Deathtouch: 1 damage = lethal for each blocker.
  Assign 1 damage to blocker A. Assign 1 damage to blocker B. Assign 1 damage to blocker C.
  Wait: 2/2 only has 2 power. Can assign at most 2 total damage.
  Assign 1 to blocker A. Assign 1 to blocker B. 0 remaining — can't assign to C or player.
  Only 2 damage to go around. So kill 2 of the 3 blockers (1 each, deathtouch = lethal).
  Blocker C: no damage assigned. Survives.
  No trample damage to player (all 2 damage used on blockers).
  But! All 3 blockers deal damage to the 2/2: 5+5+5=15 damage. 2/2 dies.

Now scale up: 4/4 deathtouch + trample vs. the same three 5/5 blockers:
  Assign 1 to A. Assign 1 to B. Assign 1 to C. 1 damage remaining.
  Assign 1 to defending player (trample excess after lethal to all blockers).
  All three 5/5 blockers die (deathtouch SBA). Player takes 1 damage.
  The 4/4 also takes 15 damage from the three 5/5s... and dies.
  But: it cleared three 5/5s AND dealt 1 to the face. Massive tempo advantage.

## Commonly Confused With
- **P341 (Combat Phase)** — Damage assignment rules are in the combat damage step (P341). P352 covers how specific keywords (lifelink, deathtouch, trample) modify damage assignment and results. P341 covers the step itself; P352 covers keyword interactions within the step.
- **P347 (Infect/Wither)** — Infect creatures deal damage as -1/-1 counters. Combined with deathtouch: infect already would kill any creature via counter accumulation + SBA. But deathtouch + infect means ANY damage = destroyed (SBA 702.2b: dealt damage by deathtouch source) AND places -1/-1 counters. Deathtouch is redundant with infect's kill mechanism for 1-shot kills but the SBA destruction is separate from counter-based 704.5f check.
- **P002 (Replacement Effects vs. Triggers)** — Lifelink is NOT a trigger. This is a common misconception. Lifelink's effect is applied as part of damage processing (120.4c), not as a trigger on the stack. Blood Artist ("whenever a creature dies") IS a trigger. They're different mechanisms.
- **P339 (Dies Triggers)** — When deathtouch destroys a creature via SBA, "dies" triggers fire normally. Deathtouch SBA goes to GY from battlefield = "dies" event. Blood Artist, Zulaport Cutthroat, etc. all trigger on deathtouch kills.
