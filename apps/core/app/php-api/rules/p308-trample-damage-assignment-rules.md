---
id: p308
name: Trample — Lethal Damage Assignment and Excess Damage to Players
category: combat
cr_refs: [702.19a, 702.19b, 702.19c, 702.19d]
tags: [trample, combat-damage, damage-assignment, lethal-damage, excess-damage, deathtouch-trample, indestructible-blocker, protection-trample, Craterhoof-Behemoth, Tarmogoyf, Blightsteel-Colossus]
created: 2026-03-29
examples_count: 2
---

# P308 — Trample — Lethal Damage Assignment and Excess Damage to Players

## Abstract
Trample is a combat damage assignment rule: the controller of an attacking creature with trample must assign lethal damage to all blocking creatures first, then may assign any excess damage to the defending player (or planeswalker). The key is the definition of "lethal damage" — enough to kill the blocker, accounting for its current toughness and existing damage. Crucially, the damage assignment step calculates "lethal" based on expected damage without considering prevention effects — so a 6/6 Trample attacking into a 2/2 with protection must still assign 2 damage to the blocker (even though it's prevented), and can assign 4 to the player.

## The Definitive Rules

**CR 702.19a** (verbatim): *"Trample is a static ability that modifies the rules for assigning an attacking creature's combat damage. The ability has no effect when a creature with trample is blocking or is dealing noncombat damage."*

**CR 702.19b** (verbatim): *"The controller of an attacking creature with trample first assigns damage to the creature(s) blocking it. Once all those blocking creatures are assigned lethal damage, any excess damage is assigned as its controller chooses among those blocking creatures and the player, planeswalker, or battle the creature is attacking. When checking for assigned lethal damage, take into account damage already marked on the creature and damage from other creatures that's being assigned during the same combat damage step, but not any abilities or effects that might change the amount of damage that's actually dealt."*

**CR 702.19d** (verbatim): *"If an attacking creature with trample or trample over planeswalkers is blocked, but there are no creatures blocking it when damage is assigned, its damage is assigned to the defending player and/or planeswalker as though all blocking creatures have been assigned lethal damage."*

## The Pattern

```
TRAMPLE BASICS:
  Trample attacker → blocked by creatures → must assign lethal to all blockers first
  "Lethal damage" = damage equal to the blocker's toughness (accounting for existing damage on it)
  After assigning lethal to ALL blockers: excess goes to player/planeswalker

  SIMPLE EXAMPLE:
    5/5 Trample attacker blocked by one 2/2 blocker.
    Must assign ≥2 to the blocker (lethal). May assign rest (3) to player.
    Attacker assigns: 2 to blocker, 3 to player.
    Combat resolves: blocker takes 2 (dies), player takes 3.
    Alternative assignment: 5 to blocker, 0 to player (valid but suboptimal).
    Can OVERKILL the blocker and still assign 0 to player.

  MULTIPLE BLOCKERS:
    5/5 Trample attacked → two 2/2 blockers declare blocks.
    Must assign lethal to ALL blockers: 2 to first + 2 to second = 4 total.
    Remaining 1 damage: to player.
    Assign: 2 to blocker A, 2 to blocker B, 1 to player.
    Or: 5 to blocker A (overkill), 0 to B — but then 0 more to player (not all lethal assigned yet).
    Wait: must assign 2 (lethal) to B first before assigning to player.
    Correct assignment: AT LEAST 2 to each blocker, then excess to player.
    So 3 to A + 2 to B + 0 to player = valid (A overkilled, B lethal, 0 excess).
    And: 2 to A + 2 to B + 1 to player = valid (lethal to both, 1 excess to player).

  KEY WORDING (CR 702.19b):
    "Take into account damage already marked on the creature AND damage from other creatures being
     assigned during the same step, but NOT abilities or effects that might change damage actually dealt."
    Translation:
      - Other attackers assigning damage to the same blocker: count that toward "already assigned lethal"
        so your trample creature may need to assign less.
      - Prevention effects (protection, Fog effects, regeneration shields): IGNORED when checking lethal.
      - Deathtouch: NOT counted by default as "changing lethal." Deathtouch makes 1 damage lethal, but
        that's a rule about deathtouch interacting with assignment, not the trample check.

TRAMPLE + DEATHTOUCH (critical interaction):
  A creature with BOTH Trample and Deathtouch:
  Deathtouch: "Any damage this creature deals to a creature is enough to kill it."
  Combined: lethal damage = 1 damage to any blocker (deathtouch makes 1 lethal).
  If a 6/6 has Trample + Deathtouch:
    Assign 1 damage to the blocker (1 is lethal with deathtouch).
    Assign remaining 5 to player.
    Result: 5 damage to player even through a large blocker!
  This is the most powerful trample interaction: even small creatures with deathtouch+trample are lethal.

  EXAMPLE:
    1/1 creature with Trample + Deathtouch (e.g., from an Aura).
    Blocked by a 5/5.
    Assign 1 to the 5/5 (deathtouch makes 1 lethal). 0 excess to player (1 - 1 = 0).
    Actually: 1/1 — has only 1 damage to assign. 1 is lethal. 0 to player.
    If 3/3 with Trample + Deathtouch:
      Assign 1 to 5/5 (lethal via deathtouch). 2 to player.
      Player takes 2. 5/5 dies.
    Notable: Bow of Nylea grants all attackers Deathtouch; Primal Rage gives Trample.
    Combine: all your creatures have deathtouch trample. Each one tramples freely.

TRAMPLE + INDESTRUCTIBLE BLOCKER:
  Indestructible creature can't be destroyed by damage. But it can still take damage.
  For trample purposes: lethal = enough to kill. But indestructible can't be killed by damage.
  CR 702.19b: "When checking lethal, don't consider effects that might change damage actually dealt."
  Indestructible: it's not a damage amount effect — it prevents death, but the DAMAGE is still marked.
  For trample assignment: indestructible blocker requires the same lethal damage (based on toughness).
  10/10 Trample attacks; blocked by 1/1 Indestructible.
    Assign 1 damage to indestructible blocker (its toughness is 1 = lethal for trample purposes).
    Assign 9 to player.
    Indestructible blocker: takes 1 damage, doesn't die (indestructible). Player takes 9.
  Wait — if the blocker's toughness is 2:
    Must assign 2 damage to the 1/2 indestructible blocker (its toughness is 2).
    Assign 8 to player.
    Indestructible takes 2 damage marks but doesn't die.

TRAMPLE + PROTECTION FROM ATTACKER:
  CR 702.19b's example verbatim: "A 6/6 green creature with trample is blocked by a 2/2 creature with
  protection from green. The attacking creature's controller must assign at least 2 damage to the blocker,
  even though that damage will be prevented by the blocker's protection ability."
  Must still assign 2 to the protected blocker.
  That 2 damage is prevented (protection prevents damage from that source).
  But: must ASSIGN 2 first. Then 4 can go to player.
  The prevention happens AFTER damage assignment, not at assignment time.
  Player takes 4 (not prevented). Protected blocker takes 0 (prevented but surviving).

TRAMPLE + REGENERATION:
  A creature with regeneration: tapping it and removing damage prevents it from dying this turn.
  Regeneration doesn't reduce toughness. For trample: lethal is still based on toughness.
  Must assign toughness-worth of damage to the blocker, then excess to player.
  The blocker regenerates (survives), damage is removed from it. Player takes excess.
  Same as protection: regeneration is NOT factored in the "lethal check."

TRAMPLE + BLOCKED THEN BLOCKER REMOVED:
  CR 702.19d: "If blocked but no creatures blocking when damage is assigned..."
  Example: declare attackers (5/5 Trample) → declare blockers (2/2 blocks) → instant removes the 2/2.
  The 5/5 is "blocked" but has no blockers when damage assignment happens.
  CR 702.19d: all damage goes to player "as though all blocking creatures have been assigned lethal damage."
  Full 5 damage to player — even though nothing was actually blocking it at damage step!
  This is why "I'll block, then sacrifice the blocker" doesn't help against trample!

TRAMPLE OVER PLANESWALKERS (CR 702.19c):
  Newer variant keyword.
  "Trample over planeswalkers": after assigning lethal to blockers AND loyalty to the planeswalker,
  excess damage may go to the defending player.
  Regular Trample attacking a planeswalker: excess damage stays on the planeswalker (can't go to player).
  Trample over Planeswalkers: excess beyond the planeswalker's loyalty → to the player.
```

## Definitive Conclusions

- **Trample must assign "lethal" to all blockers first** — lethal means enough to kill based on toughness, NOT considering prevention.
- **Trample + Deathtouch: assign just 1 damage to any blocker** (deathtouch makes 1 lethal), rest tramples through.
- **Protected blockers still require lethal damage assignment** — the damage is prevented after assignment, but you still must assign it.
- **If the blocker is removed after blocks are declared but before damage, all trample damage goes to the player** — "blocked but no blockers when damage assigned" = full trample.
- **Indestructible blockers require toughness-worth of damage assigned** — same as normal; indestructible doesn't lower toughness.

## Canonical Example
**Craterhoof Behemoth Trample Army:**
Turn 9. Board: Craterhoof Behemoth (8/8 Trample) + 5 other creatures you've given Trample.
Craterhoof enters: "When ETBs, creatures you control get +X/+X and Trample where X = creatures you control."
6 creatures: each gets +6/+6 and Trample.
Attack with all 6 creatures. Opponent has two 4/4 defenders.
Opponent blocks: 4/4 blocks your 2/2 (now 8/8) Elvish Mystic and 4/4 blocks another 3/3 (now 9/9).
Damage assignment:
  8/8 Elf vs. 4/4: assign 4 to blocker (lethal), 4 to player.
  9/9 vs. 4/4: assign 4 to blocker (lethal), 5 to player.
  Remaining 4 creatures unblocked: their full power goes to player.
  Example: 4/4 (becomes 10/10), 2/3 (becomes 8/9), 1/1 (becomes 7/7), 1/2 (becomes 7/8).
  Unblocked trample to player: 10+9+8+7=34. Plus 4+5=9 from the blocked creatures.
  Total: 34+9 = 43 damage. Opponent at 20 life. Game.
Craterhoof Behemoth: the most common Commander "I win this turn" finisher.

**Example 2 — Deathtouch Trample 1/1 Through a Wall:**
Board: your 1/1 creature with Deathtouch and Trample (e.g., Glissa with buffs, or any deathtouch creature granted trample).
Opponent's 0/6 Wall blocks.
Damage assignment: 1/1 with Deathtouch + Trample.
Deathtouch: any amount of damage from this source is lethal to the blocker.
So: 1 damage is "lethal" to the 0/6 Wall (deathtouch — any damage is lethal).
Assign 1 damage to the Wall. 0 damage left for player (1/1 total power = 1).
Wall takes 1 deathtouch damage: dies (deathtouch makes any damage lethal).
Player takes 0.
BUT: if the creature is a 3/3 with deathtouch + trample:
  Assign 1 damage to Wall (deathtouch lethal). 2 damage to player.
  Wall dies. Player takes 2.
The 0/6 Wall that previously could brick your attacker indefinitely now dies in one hit,
AND the player takes 2 damage.
Deathtouch + Trample is the best combination for pushing damage through large blockers.

## Commonly Confused With
- **P305 (Protection)** — Protection prevents damage from the protected quality's sources; trample damage assignment still requires you to assign to the protected blocker first, even though that damage is prevented.
- **P033 (Indestructible)** — Indestructible blockers still need to receive toughness-worth of damage assigned (they just don't die from it); deathtouch + indestructible = deathtouch can kill indestructible? No: deathtouch only makes damage "lethal" for the "destroy" check, but indestructible prevents "destroy." Deathtouch doesn't overcome indestructible.
- **P001 (Combat Damage Routing)** — Trample specifically covers excess damage routing after lethal assignment; P001 covers the base damage assignment rules.
- **P292 (Annihilator)** — Both affect the defending player significantly during combat; annihilator forces sacrifice before damage assignment, trample deals extra damage after.
