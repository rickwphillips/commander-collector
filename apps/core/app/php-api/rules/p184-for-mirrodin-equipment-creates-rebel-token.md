---
id: p184
name: For Mirrodin! — Equipment Creates a Rebel Token and Attaches
category: triggered
cr_refs: [702.163a]
tags: [for-mirrodin, equipment, rebel-token, ETB, attach, 2/2, One-with-the-Multiverse, Phyrexia-AWBO]
created: 2026-03-28
examples_count: 2
---

# P184 — For Mirrodin! — Equipment Creates a Rebel Token and Attaches

## Abstract
For Mirrodin! is a triggered ETB ability on Equipment cards. When the equipment enters, create a 2/2 red Rebel creature token, then attach the equipment to that token. This provides both a creature and an equipped creature in one — the Rebel token is instantly equipped without paying the equip cost. The Rebel token is a 2/2 that immediately benefits from whatever the equipment grants. This mechanic is from Phyrexia: All Will Be One, representing the Mirran resistance fighters arming themselves with equipment.

## The Definitive Rules

**CR 702.163a** (verbatim): *"For Mirrodin! is a triggered ability. 'For Mirrodin!' means 'When this Equipment enters, create a 2/2 red Rebel creature token, then attach this Equipment to it.'"*

## The Pattern

```
FOR MIRRODIN!:
  Triggered ETB ability on an Equipment card
  Effect: create a 2/2 red Rebel creature token → attach this Equipment to it
  Sequence: token is created FIRST, then equipment attaches
  No equip cost payment required for this attachment

  FOR MIRRODIN! + SEQUENCE:
    Token creation happens first
    Equipment is then attached to the newly created token
    The token enters the battlefield, then becomes equipped simultaneously (or nearly so)
    ETB triggers for the token fire: the token enters as a 2/2 Rebel (then gets equipment)
    The token's ETB abilities (if any, as a 2/2 generic Rebel) fire

  FOR MIRRODIN! + EQUIPMENT ABILITIES:
    The 2/2 Rebel immediately has the equipment's bonuses
    A +2/+2 equipment: Rebel is 4/4 immediately
    An equipment that gives first strike: Rebel has first strike immediately
    Very efficient: one card = one equipped creature

  FOR MIRRODIN! + EQUIP COST:
    You don't pay equip cost for the automatic attachment
    Later, to reattach to a different creature: pay normal equip cost
    If the Rebel dies: equipment falls off, then must be re-equipped (equip cost)

  FOR MIRRODIN! + MULTIPLE:
    Multiple "For Mirrodin!" equipments in play: each creates its own 2/2 Rebel
    If you play two such equipments: two 2/2 Rebels, each equipped separately

  FOR MIRRODIN! + ENTER SEQUENCING:
    Equipment enters → For Mirrodin! triggers → put on stack
    While trigger is on stack: the equipment is on the battlefield, unattached
    Trigger resolves: create Rebel, attach equipment to Rebel
    Responses before trigger resolution: equipment is on battlefield as an unattached equipment

  FOR MIRRODIN! + ETBS:
    Rebel token is created as a standard 2/2 — no unique ETB beyond the creation itself
    Equipment ETB: "For Mirrodin!" is the equipment's own ETB
    No double-ETB for the token unless the token has another source of abilities

  FOR MIRRODIN! CARDS:
    Vulshok Battlegear (For Mirrodin!, +2/+2 equipped): create 4/4 Rebel immediately
    Kemba's Runemark (For Mirrodin!): token + specific ability
    Various Mirran equipment in Phyrexia: AWBO had this cycle
```

## Definitive Conclusions

- **For Mirrodin! creates a 2/2 red Rebel token** and attaches the equipment to it — no equip cost.
- **The Rebel enters first**, then equipment attaches — ETB fires for the 2/2 token as a normal creature.
- **Efficient**: one equipment card = one equipped creature threat.
- **If Rebel dies**: equipment unattaches, must pay equip cost to re-equip to another creature.
- **Flavored as Mirran resistance** — soldiers arming themselves.

## Canonical Example
**Vulshok Battlegear (For Mirrodin!, Equipment: Equipped creature gets +2/+2):**
Cast Vulshok Battlegear. For Mirrodin! triggers → create 2/2 red Rebel token → attach Battlegear to it.
Rebel token is now 4/4 (2/2 + 2/2 from Battlegear).
You got a 4/4 for the cost of the equipment, no equip cost.
If this creature attacks and dies: Battlegear falls off, becomes unattached on the battlefield.
Next turn: pay equip cost to attach to another creature.

**Example 2 — Equipped Rebel in Combat:**
Rebel token (2/2 + equipment giving first strike) = 2/2 first strike.
Attack into a 3/3: Rebel deals first strike damage first (before 3/3 can deal damage if it's in first strike step).
Rebel's equipment might even give enough power to kill the 3/3 before it retaliates.

## Commonly Confused With
- **P184 vs Crew (P058)** — Crew taps creatures to make a Vehicle a creature. For Mirrodin! creates a creature to carry the equipment.
- **P178 (Reconfigure)** — Reconfigure Equipment is itself a creature. For Mirrodin! creates a separate token then attaches.
- **P092 (Living Weapon)** — Living Weapon also creates a creature token and attaches equipment, but creates a 0/0 Germ token (not a 2/2 Rebel). Very similar mechanic!
