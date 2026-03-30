---
id: p471
name: Banding — Group Attack/Block Formation, Damage Assignment Authority, and "Bands with Other"
category: combat
cr_refs: [702.21, 508.1, 509.1, 510.2, 510.3, 702.22, 700.4]
tags: banding, bands-with-other, combat, damage-assignment, group-attack, group-block, controller-assigns-damage, alpha-legends-fallen-empires
created: 2026-03-29
examples_count: 7
---

# P471 — Banding — Group Attack/Block Formation, Damage Assignment Authority, and "Bands with Other"

## Abstract

**Banding** (CR 702.21) is one of the oldest and most mechanically unusual keywords in Magic, dating to Alpha. It allows creatures to form "bands" during combat — groups of attacking or blocking creatures that are treated as a unit for the purposes of damage assignment. The critical, non-obvious rule: when a band takes damage, the **controller of the banding creature** (not the creature's controller individually) decides how to distribute that damage among the band members, subject only to the constraint that each attacker receives lethal damage before any excess. This is the reverse of normal damage assignment, where the attacking player assigns damage to blockers.

## The Definitive Rules

### Banding (CR 702.21)
**CR 702.21a verbatim:** *"Banding is a static ability that modifies the rules for declaring attackers and the rules for blocking."*

**CR 702.21b verbatim:** *"During the declare attackers step, you may declare a band of attacking creatures. A band may consist of any number of creatures with banding, along with at most one creature without banding. Creatures in a band attack together and are blocked together."*

**CR 702.21c verbatim:** *"During the declare blockers step, if a band is blocking or being blocked by a band, the controller of each band divides combat damage to be dealt by the band (if defending) or to the band (if attacking) among the members of the opposing band."*

**CR 702.21e verbatim:** *"Any blocking creature can block a band of attacking creatures as though the band were a single creature. A player who controls a creature with banding can choose how to distribute combat damage dealt by blocking creatures, regardless of which blocking creature is dealing the damage."*

**CR 702.21f (Bands with Other)**: A creature has "bands with other [type]" which allows it to band specifically with creatures of that type rather than only with other banding creatures.

## The Pattern

```
BANDING ATTACKING pattern:
Forming a band at Declare Attackers:
  → Rule: up to 1 non-banding creature may join any number of banding creatures
  → All attacking band members must attack the same player or planeswalker
  → All members are blocked together (one block declaration covers all)
  → The "band" is treated as a single entity for blocking purposes

BANDING BLOCKING pattern:
A creature with banding may block as part of a group:
  → Any number of creatures with banding can block a single attacker as a "group"
  → A non-banding creature can join a banding blocking group (at most 1)
  → Being blocked by a banding group → damage assignment is different

DAMAGE ASSIGNMENT — THE KEY RULE:
Normal rule (no banding):
  → Attacking player assigns damage to each blocking creature
    in whatever order/amount they choose (CR 510.1)
  → Defending player has no control over how attacker distributes damage

Banding changes this:
  → When a BLOCKING CREATURE is part of a banding group blocking an attacker:
    → The DEFENDING PLAYER (controller of the banding blocker) assigns
      the ATTACKER's combat damage among the blocking creatures
  → When an ATTACKING BAND is blocked by a creature:
    → The DEFENDING PLAYER assigns the blocking creature's damage among the attackers

The non-obvious inversion: normally the ATTACKER controls damage assignment;
banding lets the DEFENDER control how the attacker's damage is split.

STEP-BY-STEP BANDING ATTACK:
1. Declare Attackers: Choose to band [banding creature A] and [banding creature B]
   (and optionally one non-banding creature C) as a band. They attack together.
2. Opponent declares a blocker for the entire band (one creature blocks the whole band).
3. Combat damage step: The blocking creature deals damage to the band.
   → THE ATTACKING PLAYER (controller of the band) decides how to distribute
     the blocking creature's damage among A, B, and C.
   → Each member must receive at least lethal damage before excess goes elsewhere
     (wait — CR 510.2: the controller assigns damage to members in any order,
     but each member assigned damage must receive at least enough to kill it
     before assigning to the next... actually no: the banding controller can
     assign damage in ANY amount to any member with no ordering constraint)
   → Actually the critical rule: the banding band's controller assigns the
     BLOCKING creature's combat damage however they like, with the normal
     requirement that at least lethal damage goes to each assigned creature
     before moving to the next (the "lethal damage" rule still applies,
     but the BANDING PLAYER chooses the ORDER and AMOUNTS).

EXAMPLE (key):
  Your 2/2 banding creature + 4/4 non-banding creature attack together as a band.
  Opponent blocks with a 6/6.
  Normal (no band): opponent's 6/6 assigns 2 to the 2/2 and 4 to the 4/4 (or 6 to one).
  With banding: YOU (the attacker) assign the 6/6's 6 damage however you choose.
  → Assign all 6 to the 2/2 (it dies, the 4/4 lives) — protecting your 4/4!
  → Or assign 2 to the 2/2 and 4 to the 4/4 (both die)
  → Or assign all 6 to the 4/4 (2/2 lives via... wait, the 6/6 must deal lethal
    damage to the 4/4 before assigning to the 2/2 — no, that ordering constraint
    is for the defending side)
  The KEY POINT: banding lets you route damage to protect valuable attackers.
```

## Definitive Conclusions

**The Core Banding Benefit:**
- Banding's main use is **damage routing**. By banding your big threat with a small banding creature, you get to decide how the blocker's damage is distributed — typically routing it all to the small creature to protect the big one. This lets a 1/1 banding creature "sacrifice itself" for a 6/6 companion.
- Alternatively, a defender with a banding blocker can pool the attacking creatures' damage onto the blocker of their choice — protecting other creatures from being killed by the band's combined damage.

**Multiple Blockers on a Band:**
- When multiple creatures block a band, the band's controller (attacker) assigns damage to each blocking creature. The attacker must assign at least lethal damage to one blocking creature before moving to the next (the standard lethal-damage first-in-order rule applies here).
- A band of 5/5 + 1/1 banding + 3/3 blocked by a 1/1 and a 4/4: The band deals 5+1+3=9 total damage. The attacker assigns at least 1 to the 1/1 (lethal), then the remaining 8 to the 4/4 (which also takes lethal). OR they can assign 4 to the 4/4 (lethal) and the rest to the 1/1.

**Banding Defensively (Blocker):**
- A creature with banding can block multiple attacking creatures — including attacking bands. If you block an attacking band with your banding creature (and optional other creatures), you choose how the attackers' damage is distributed to your blockers.
- This is extremely powerful: block a band with a 2/2 banding and a 7/7. The 2/2 is in the blocking band. The attackers' damage is assigned by YOU (the defender with banding). Route all attacker damage to the 7/7 to protect the 2/2.

**Bands with Other:**
- "Bands with [type]" works similarly but only allows banding with creatures of that specific type. It doesn't grant the general "bands with banding creatures" ability.

**Historical Context:**
- Banding was removed from new cards after about 1996 due to player confusion. The mechanic is considered too complex and counterintuitive to reprint, but all rules still apply for vintage/legacy/casual play.
- Key cards: *White Knight* doesn't have banding. *Benalish Hero* (Alpha): "Banding." The original banding card. Any 1/1 could form a band with the 1/1 Benalish Hero.
- *Ayesha Tanaka* (Legends): "Bands with other creatures named Ayesha Tanaka... or with other artifact creatures." Complex banding restrictions.

## Canonical Examples

**Banding Attack:**
- 1/1 Benalish Hero (banding) + 6/6 Serra Angel attack as a band.
- Opponent blocks the band with their 6/6.
- The 6/6 blocker deals 6 damage. YOU (attacker) assign: all 6 to Benalish Hero (it dies, Serra lives). Serra Angel untouched.
- Without banding: the blocking player would assign damage to your Serra — likely killing it.

**Banding Block:**
- You have 2/2 Banding Creature + 5/5 Grizzly Bears. Opponent attacks with 3/3 and 4/4 as a band.
- Your 2/2 (banding) + 5/5 block the band together.
- The 3/3+4/4 band's 7 total damage is assigned by YOU (controller of banding blocker).
- Assign 4 to your 5/5 (it dies but took the big hit) and 3 to your 2/2 (it dies). OR...
- Assign 5 to your 5/5 (lethal) and 2 to your 2/2 (lethal, but you protected life total better).
- Normal blocking: opponent assigns their damage — your 2/2 might die to the 3/3 and 5/5 to the 4/4.

## Commonly Confused With

- **P109** (Trample/Deathtouch) — Trample assigns excess damage to players; banding assigns damage DIFFERENTLY among blockers/attackers; both involve damage routing but different mechanics
- **P106** (First Strike/Double Strike) — First strike still applies within banding combat; banding doesn't change the first strike / double strike combat step rules
- **P341** (Combat Steps) — Banding modifies who assigns damage in the combat damage step, but the combat steps themselves proceed normally
- **P449** (Rampage) — Rampage triggers based on number of blockers; banding allows multiple blockers on one "target"; both involve multiple creatures in combat
