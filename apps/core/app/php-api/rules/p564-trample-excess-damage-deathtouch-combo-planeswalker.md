---
id: p564
name: Trample — Excess Damage, Deathtouch Combo, and Planeswalker Trample
category: combat
cr_refs: [702.19, 702.19a, 702.19b, 702.19c, 702.19d, 702.19f, 702.2c, 510]
tags: [trample, excess-damage, deathtouch, combat-damage, planeswalker, trample-over-planeswalkers, blocking, lethal-damage, indestructible, protection]
created: 2026-03-31
examples_count: 3
---

# P564 — Trample — Excess Damage, Deathtouch Combo, and Planeswalker Trample

## Abstract

**Trample allows excess combat damage to carry over to the defending player or planeswalker after lethal damage is assigned to all blockers.** The attacking creature's controller must assign at least lethal damage to each blocker before assigning any to the player/planeswalker. "Lethal damage" accounts for damage already marked and damage being assigned simultaneously, but NOT prevention effects or toughness changes that would occur later. The trample + deathtouch combo is devastating: since any nonzero amount of combat damage from a deathtouch source counts as "lethal" (CR 702.2c), a 6/6 trampler with deathtouch only needs to assign 1 damage to each blocker, sending the rest through. Trample only applies to combat damage from attacking creatures — not blocking, not noncombat damage. "Trample over planeswalkers" is a separate variant that allows excess damage to carry over to the planeswalker's controller.

## The Definitive Rules

**CR 702.19a (Trample — Combat Only):** *"Trample is a static ability that modifies the rules for assigning an attacking creature's combat damage. The ability has no effect when a creature with trample is blocking or is dealing noncombat damage."*

**CR 702.19b (Trample Damage Assignment):** *"The controller of an attacking creature with trample first assigns damage to the creature(s) blocking it. Once all those blocking creatures are assigned lethal damage, any excess damage is assigned as its controller chooses among those blocking creatures and the player, planeswalker, or battle the creature is attacking."*

**CR 702.19c (Trample over Planeswalkers):** *"If that creature is attacking a planeswalker, after lethal damage is assigned to all blocking creatures and damage at least equal to the loyalty of the planeswalker the creature is attacking is assigned to that planeswalker, further excess damage may be assigned... among those blocking creatures, that planeswalker, and that planeswalker's controller."*

**CR 702.19d (No Blockers):** *"If an attacking creature with trample is blocked, but there are no creatures blocking it when damage is assigned, its damage is assigned to the defending player and/or planeswalker as though all blocking creatures have been assigned lethal damage."*

**CR 702.19f (No Trample over PW):** *"If a creature without trample over planeswalkers is attacking a planeswalker, none of its combat damage can be assigned to the defending player, even if that planeswalker has been removed from combat or the damage the attacking creature could assign is greater than the planeswalker's loyalty."*

**CR 702.2c (Deathtouch + Lethal):** *"Any nonzero amount of combat damage assigned to a creature by a source with deathtouch is considered to be lethal damage for the purposes of determining if excess damage is being dealt."*

## The Pattern

```
BASIC TRAMPLE:

  When a creature with trample attacks and is blocked:
    1. Assign at least LETHAL DAMAGE to each blocking creature
    2. Remaining damage → defending player/planeswalker/battle
    3. Controller chooses how to distribute excess

  "Lethal damage" = toughness minus damage already marked
    - Include damage from other attackers assigned in the same step
    - Do NOT account for prevention effects (protection, etc.)
    - Do NOT account for effects that change damage (e.g., damage doublers)

  Example: 6/6 trample blocked by a 2/4
    → Assign at least 4 to the 2/4 (its toughness)
    → 2 excess → defending player

  Example: 6/6 trample blocked by a 2/4 with 1 damage already marked
    → Lethal = 4 - 1 = 3 (need 3 more to kill)
    → 3 excess → defending player

TRAMPLE + DEATHTOUCH (THE COMBO):

  CR 702.2c: Any NONZERO amount of deathtouch combat damage = lethal

  This means a trample + deathtouch creature only needs 1 damage per blocker:

  Example: 6/6 trample + deathtouch blocked by three creatures (2/2, 3/3, 5/5)
    → Assign 1 to each blocker (1 deathtouch damage = lethal for each)
    → 3 excess → defending player takes 3 damage
    → All three blockers are destroyed by deathtouch SBA

  Without deathtouch:
    → Must assign 2 + 3 + 5 = 10 lethal damage to blockers
    → 6/6 can't even assign 10, so 0 excess → no trample damage

  The combo is powerful because deathtouch redefines "lethal" for trample.

TRAMPLE + PROTECTION/INDESTRUCTIBLE BLOCKER:

  Trample assigns damage based on WHAT IT NEEDS TO ASSIGN (lethal),
  not on what actually happens.

  Protection blocker (damage will be prevented):
    → Attacker must STILL assign lethal damage to the blocker
    → The damage is assigned, then prevented
    → Excess goes through to the player
    → Example: 6/6 trample vs 2/2 with protection from green
      → Assign 2 (lethal) to the 2/2 → 4 to player
      → The 2 assigned to the blocker is prevented (protection)
      → Player takes 4

  Indestructible blocker:
    → Lethal damage must still be assigned (toughness value)
    → The blocker survives (indestructible), but damage is marked
    → Excess goes through
    → Example: 6/6 trample vs 3/3 indestructible
      → Assign 3 (lethal) to the blocker → 3 to player
      → Blocker survives with 3 damage marked

TRAMPLE WITH NO BLOCKERS:

  If an attacker with trample is BLOCKED but the blocker is removed
  before combat damage (e.g., bounced, killed):
    → All damage goes to the defending player (702.19d)
    → Treated as if lethal damage was assigned to 0 blockers

  If a creature with trample is NOT blocked:
    → Normal rules: all damage to the defending player
    → Trample is irrelevant (only matters when blocked)

TRAMPLE + MULTIPLE BLOCKERS:

  If blocked by multiple creatures:
    → Assign at least lethal damage to EACH blocker
    → Excess → player/planeswalker
    → Under current rules (CR 510.1c), ALL blocked creatures allow
      free damage division among blockers (no ordering for anyone)

  Note: The controller can assign MORE than lethal to a blocker if they want.
  They just can't assign to the player until all blockers have lethal.

TRAMPLE OVER PLANESWALKERS:

  A separate keyword: "trample over planeswalkers"
  Normal trample can't assign excess to the player when attacking a PW.

  Without trample over PW (702.19f):
    → If attacking a planeswalker and all blockers are dead/gone
    → ALL excess goes to the planeswalker (can't go to player)
    → Even if excess exceeds the PW's loyalty

  With trample over PW (702.19c):
    → Assign lethal to blockers → damage = PW's loyalty to PW
    → THEN excess → player
    → Example: 10/10 with trample over PW attacks a 3-loyalty PW
      → No blockers: 3 to PW (loyalty), 7 to player

  Regular trample attacking a planeswalker:
    → Excess damage after blockers goes to the PW, not the player
    → Even 100 excess damage all goes to the PW (loyalty removed)
    → The player takes 0

TRAMPLE DOES NOT APPLY TO:

  - Blocking creatures (702.19a)
  - Noncombat damage (702.19a)
  - Damage from spells or abilities
  - Damage from "fights" (fight is combat-like but NOT combat damage)
```

## Definitive Conclusions

- **Trample = excess combat damage to player after lethal to blockers** — combat only, attacking only.
- **Deathtouch + trample = 1 damage per blocker is "lethal"** — rest goes to player.
- **Protection/prevention doesn't reduce trample assignment** — you must assign lethal regardless of prevention.
- **Indestructible doesn't reduce trample assignment** — lethal damage based on toughness, not destruction.
- **Blocked but no blockers = all damage through** — if blockers are removed before damage step.
- **Trample over planeswalkers** is separate from regular trample — regular trample can't bypass PW to player.
- **Trample only works in combat, while attacking** — not blocking, not noncombat damage.

## Canonical Example

**Trample + Deathtouch:**

You attack with a 6/6 creature that has trample and deathtouch. Opponent blocks with three creatures: 1/1, 2/2, and 4/4.

Without deathtouch: you'd need to assign 1 + 2 + 4 = 7 lethal damage to blockers. Your 6/6 can't deal 7, so no damage gets through.

With deathtouch (CR 702.2c): 1 damage from deathtouch = lethal for each blocker. Assign 1 to the 1/1, 1 to the 2/2, 1 to the 4/4 (3 total). Remaining 3 damage → defending player. All three blockers are destroyed by deathtouch.

**Example 2 — Trample vs Protection Blocker:**

Your 6/6 green creature with trample is blocked by a 2/2 with protection from green. You must assign at least 2 damage (lethal) to the 2/2 blocker. You assign 2 to the blocker and 4 to the defending player.

The 2 damage assigned to the blocker is prevented by protection. The blocker survives unharmed. But the 4 damage to the defending player is NOT prevented (the player doesn't have protection). Defending player takes 4.

**Example 3 — Regular Trample Attacking a Planeswalker:**

Your 8/8 with trample (not trample over planeswalkers) attacks an opponent's planeswalker with 3 loyalty. Opponent blocks with a 2/2.

Assign 2 damage to the 2/2 (lethal). 6 excess damage → the planeswalker (not the player!). Regular trample cannot assign damage to the player when attacking a planeswalker (702.19f). The planeswalker takes 6 (loyalty reaches 0, it dies, 3 damage excess goes to the PW and is just "wasted").

If this creature had "trample over planeswalkers": assign 2 to blocker, 3 to PW (equal to loyalty), 3 to player.

## Commonly Confused With

- **P001 (Excess Damage Routing)** — P001 covers general excess damage rules; P564 covers trample's specific damage assignment rules.
- **P561 (Protection DEBT)** — P561 covers what protection prevents; P564 shows that trample still assigns damage to protection blockers (then it's prevented).
- **P563 (Indestructible)** — P563 covers indestructible generally; P564 shows trample still assigns based on toughness against indestructible blockers.
