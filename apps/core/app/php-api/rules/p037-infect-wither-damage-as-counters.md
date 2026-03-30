---
id: p037
name: Infect and Wither — Damage as -1/-1 Counters
category: combat
cr_refs: [702.90a, 702.90b, 702.90c, 702.80a, 120.3b, 120.3d, 704.5c, 704.5q]
tags: [infect, wither, poison, counters, -1/-1, damage, player, creature, melira, proliferate, trample-assign, protection]
created: 2026-03-28
examples_count: 3
---

# P037 — Infect and Wither — Damage as -1/-1 Counters

## Abstract
Infect and wither both convert creature damage to -1/-1 counters instead of damage marks. Infect additionally converts player damage to poison counters instead of life loss. Wither affects only creature damage, leaving player damage as normal life loss. Because the counters are permanent (unlike marked damage which clears at cleanup), infect and wither dramatically change combat math. For trample purposes, "lethal damage" is still calculated by normal toughness — but because -1/-1 counters reduce toughness, the threshold can shift mid-combat.

## The Definitive Rule

**CR 702.90b** (verbatim): *"Damage dealt to a player by a source with infect doesn't cause that player to lose life. Rather, it causes that source's controller to give the player that many poison counters."*

**CR 702.90c** (verbatim): *"Damage dealt to a creature by a source with infect isn't marked on that creature. Rather, it causes that source's controller to put that many -1/-1 counters on that creature."*

**CR 702.80a** (verbatim): *"Damage dealt to a creature by a source with wither isn't marked on that creature. Rather, it causes that source's controller to put that many -1/-1 counters on that creature."*

**CR 120.3b**: Damage from infect source to player → poison counters.

**CR 120.3d**: Damage from wither/infect source to creature → -1/-1 counters.

**CR 704.5c**: Player with 10+ poison counters loses the game (SBA).

**CR 704.5q**: If a permanent has both +1/+1 and -1/-1 counters, remove N of each (N = lesser count) as an SBA.

## The Pattern

```
INFECT — DUAL CONVERSION:
  vs. creatures: damage → -1/-1 counters (no marked damage)
  vs. players: damage → poison counters (no life loss)

WITHER — CREATURE ONLY CONVERSION:
  vs. creatures: damage → -1/-1 counters (no marked damage)
  vs. players: damage → normal life loss (no poison)

KEY CONSEQUENCES:
  -1/-1 counters are PERMANENT (don't clear at cleanup step)
  Marked damage clears at cleanup — counters do NOT
  A 2/2 with wither fights a 4/4: 2 counters put on 4/4 → becomes 2/2
    Next turn, 4/4 is still a 2/2 (counters persist)

  TOUGHNESS REDUCTION = NEW LETHAL THRESHOLD:
    A creature with -1/-1 counters has reduced toughness
    Subsequent damage is lethal at the new (lower) toughness
    Example: 4/4 takes 2 infect/wither damage → now 2/2 with counters
    Another 2 damage = lethal (2 ≥ current toughness 2)

TRAMPLE + INFECT:
  "Lethal damage" for trample assignment = toughness - damage marked
  But infect damage becomes counters, not marks
  So a 4/4 blocking an infect attacker: no marks, but counters reduce toughness
  During same combat step: counters ARE placed as part of damage assignment
  CR 702.19b: "take into account damage already marked on the creature"
  -1/-1 counters from infect reduce toughness → reduce the threshold
  But counters are placed AFTER damage is assigned simultaneously (CR 510.2)
  → Effectively: for same-combat assignment, use original toughness
  → After damage resolves, creature may die from reduced toughness SBA

DEATHTOUCH + INFECT:
  Any nonzero infect/wither damage → ANY nonzero damage from deathtouch source
    → creature is destroyed (SBA 704.5h)
  Deathtouch still requires nonzero damage
  With trample: 1 damage = lethal for deathtouch blocker (can trample for all but 1)

PROTECTION + INFECT:
  Protection prevents all DAMAGE from the protected-quality source
  → No damage → no -1/-1 counters placed (infect/wither don't apply)
  Example: Creature with protection from black vs. a black infect source
  → Black infect deals 0 damage (prevented) → 0 counters placed

POISON COUNTERS AND PROLIFERATE:
  Proliferate: "choose any number of permanents/players with counters, add one more"
  Poison counters are counters → can be proliferated
  Can also proliferate -1/-1 counters on creatures
  This is a powerful interaction for infect decks

COUNTER CANCELLATION SBA (704.5q):
  If a creature has both +1/+1 AND -1/-1 counters → remove N of each
  N = lesser count
  This happens continuously as SBA before any player gets priority
  A creature with 3 +1/+1 counters getting 2 -1/-1 counters from infect:
    SBA: remove 2 of each → ends up with 1 +1/+1 counter

WIN CONDITION — POISON:
  10 poison counters → SBA → player loses game (704.5c)
  Normal damage + infect damage combine: no — infect replaces life loss with poison
  A player can have BOTH life loss (from non-infect) AND poison (from infect)
  reaching 0 life → SBA → lose; reaching 10 poison → SBA → lose
  Two independent loss conditions
```

## Definitive Conclusions

- **Infect damage to planeswalkers = loyalty counter loss, not -1/-1 counters.** CR 702.90c specifies *creature*; CR 702.90b specifies *player*. Planeswalkers are neither, so infect damage to a planeswalker causes that many loyalty counters to be removed — the normal planeswalker damage rule. (Gatherer ruling 2020-08-07: "Damage dealt to planeswalkers still results in that planeswalker losing that many loyalty counters.")
- **Lifelink + infect: the controller still gains life.** Damage dealt by an infect source is still damage in all respects. If the infect source also has lifelink, its controller gains that much life. (Gatherer ruling 2020-08-07)
- **"Whenever [a creature] is dealt damage" triggers fire for infect damage.** Infect replaces the damage type, but the damage event still occurred — it just caused counters instead of marks. Abilities that trigger on damage being dealt trigger as normal. (Gatherer ruling 2020-08-07: "Abilities that trigger on damage being dealt will trigger if a source with infect deals damage, if appropriate.")
- **Wither = -1/-1 counters on creatures only.** Wither damage to players = normal life loss.
- **Infect = -1/-1 counters on creatures + poison counters on players.** Infect sources deal no life damage to players.
- **Counters persist through cleanup; marked damage doesn't.** Infect/wither damage is permanent.
- **Protection prevents infect/wither counters.** Protection prevents damage → 0 damage → 0 counters.
- **Deathtouch + infect = any 1 damage kills the creature.** Both apply: deathtouch requires nonzero damage, which infect converts to a -1/-1 counter reducing toughness to 0 (or SBA 704.5h from deathtouch).
- **Poison and life loss are independent.** A player can lose via poison (10 counters, SBA 704.5c) independently of their life total.
- **+1/+1 and -1/-1 counters cancel via SBA (704.5q).** 3 +1/+1 counters + 2 -1/-1 counters = 1 +1/+1 counter.
- **Soul-Scar Mage's replacement is NOT a prevention effect.** Soul-Scar says "noncombat damage ... becomes -1/-1 counters instead." This is a replacement (not prevention). Damage that "can't be prevented" can still be replaced by Soul-Scar. (Soul-Scar ruling 2017-04-18: "This effect isn't a prevention effect. Damage that can't be prevented will be replaced with -1/-1 counters.")
- **Soul-Scar + Solemnity = damage dealt to creatures is nullified entirely.** Under both Solemnity (counters can't be placed) and Soul-Scar Mage (noncombat damage → -1/-1 counters): the damage replacement applies (damage → counters), but Solemnity prevents the counters from being placed. The original damage event was replaced, so neither the damage NOR the counters occur. The creature takes nothing. (Solemnity ruling 2017-07-14: "If a replacement effect allows a player to modify or replace an event by putting counters on an artifact, creature, enchantment, or land, that player may apply that replacement effect. Counters won't be put on the object, but if the original event is entirely replaced... it replaces it.")
- **Infect + Solemnity is DIFFERENT from Soul-Scar + Solemnity.** Under Solemnity + an infect source: damage IS still "dealt" (the damage event occurs), but no counters or marks result. Lifelink still gives the controller life. Damage-dealt triggers still fire. What Solemnity prevents is the *result* of infect (the counter placement), not the damage event itself. (Solemnity ruling 2017-07-14: "Damage from a source with infect has no effect on creatures or players. No -1/-1 counters are put on creatures, and no damage is marked on them. Players don't get poison counters and they don't lose life. The damage is still dealt for purposes of effects that care about damage, such as lifelink.") Contrast with Soul-Scar, where the damage event itself is replaced with counter placement — under Solemnity, that entire replaced event fails to occur.

## Canonical Example
**Phyrexian Crusader (2/2, protection from red and white, infect) attacking:**
Opponent blocks with a 4/4. Crusader deals 2 infect damage → 2 -1/-1 counters on the 4/4. 4/4 now has toughness 2. At end of step, SBA: does the 4/4 have damage ≥ toughness? Infect damage is counters (not marks) — no marked damage, so 704.5g (lethal damage SBA) doesn't apply. But toughness is now 2 (from counters). If the 4/4 takes any more damage this combat (or next turn), it may die. The counters remain permanently.

**Example 2 — Poison win condition:**
Opponent is at 7 poison from previous infect damage. You attack with a 3/3 infect creature. Opponent blocks with a 3/3. Your infect creature and theirs trade. Before damage, opponent has 7 poison. After combat damage: infect creature deals 3 to opponent (7+3=10 poison). SBA: 10 poison → opponent loses the game. Combat also kills both creatures. Happens simultaneously at SBA check.

**Example 3 — Counter cancellation:**
Your creature has 3 +1/+1 counters (from Cathars' Crusade). An infect creature deals 2 damage to it — 2 -1/-1 counters placed. SBA: both types present, remove 2 of each. Creature now has 1 +1/+1 counter. No marked damage — cleanup step doesn't matter. The creature keeps the remaining +1/+1 counter permanently.

## Commonly Confused With
- **P027 (Protection — DEBT Only)** — Protection prevents infect damage (D in DEBT), which means no counters are placed. P037 explains why; P027 establishes the principle.
- **P025 (Counter Placement — Cost vs. Effect)** — The -1/-1 counters from infect are placed as an effect. Doubling Season (if opponent controls it and your creature is the target) would... wait, Doubling Season doubles counters placed on your own permanents. If opponent controls Doubling Season, does it double -1/-1 counters placed on your creatures? Doubling Season says "If one or more counters would be placed on a permanent you control..." — the controller of Doubling Season controls it, but the counters are being placed on an opponent's permanent. So no — Doubling Season only doubles counters on permanents YOU control.
