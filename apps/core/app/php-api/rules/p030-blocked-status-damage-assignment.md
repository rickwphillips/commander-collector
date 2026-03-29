---
id: p030
name: Blocked Status and No-Blocker-Remaining Combat Damage
category: combat
cr_refs: [509.1h, 510.1c, 510.1d, 702.19b]
tags: [blocked, combat-damage, multiple-blockers, assignment-order, no-blockers-remaining, trample, indestructible, free-distribution]
created: 2026-03-28
examples_count: 3
---

# P030 — Blocked Status and No-Blocker-Remaining Combat Damage

## Abstract
Two deeply misunderstood combat rules interact. First: once a creature is declared blocked, it remains blocked until end of combat — even if every creature blocking it is killed or removed before the damage step (CR 509.1h). A creature is never "un-blocked" by losing its blockers. Second: a blocked attacker whose blockers are all gone at damage assignment time deals zero combat damage — not to the player, not to anyone (CR 510.1c). Trample is the only exception; with trample, damage can still be assigned to the player. Third (related misconception): the old "damage assignment order" requirement for multiple blockers was abolished. A non-trample attacker blocked by multiple creatures now freely divides its combat damage among them with no minimum-per-blocker requirement.

## The Definitive Rule

**CR 509.1h** (verbatim): *"An attacking creature with one or more creatures declared as blockers for it becomes a blocked creature; one with no creatures declared as blockers for it becomes an unblocked creature. This remains unchanged until the creature is removed from combat, an effect says that it becomes blocked or unblocked, or the combat phase ends, whichever comes first. A creature remains blocked even if all the creatures blocking it are removed from combat."*

**CR 510.1c** (verbatim): *"A blocked creature assigns its combat damage to the creatures blocking it. If no creatures are currently blocking it (if, for example, they were destroyed or removed from combat), it assigns no combat damage."*

**CR 510.1c free distribution**: *"If two or more creatures are blocking it, it assigns its combat damage to those creatures divided as its controller chooses among them."* (No assignment order; no minimum per blocker.)

**CR Glossary — "Damage Assignment Order (Obsolete)"**: *"Previously, if a creature blocks or becomes blocked by multiple creatures, the creature's controller would be required to choose an order in which it would assign combat damage to the creatures blocking or blocked by it. Now, its controller no longer needs to assign an order, and simply divides its combat damage as they choose among all creatures it's blocking or blocked by."*

**CR 702.19b (Trample exception)**: *"Once all those blocking creatures are assigned lethal damage, any excess damage is assigned as its controller chooses among those blocking creatures and the player... When checking for assigned lethal damage, take into account damage already marked on the creature and damage from other creatures that's being assigned during the same combat damage step, but not any abilities or effects that might change the amount of damage that's actually dealt."*

## The Pattern

```
BLOCKED STATUS (CR 509.1h):
  Declared blocked during declare blockers step
  → Remains blocked for the rest of combat
  → Unblocked only by: removal from combat, explicit effect, end of combat phase
  → Killing all blockers does NOT un-block the attacker

DAMAGE ASSIGNMENT — NO BLOCKERS REMAINING (CR 510.1c):
  Blocked attacker + all blockers killed/removed before damage step:
    → Attacker is blocked (status unchanged)
    → Attacker assigns NO combat damage (no blockers to assign to)
    → Attacker cannot hit the defending player
    → No damage happens at all for that creature

  Exception — TRAMPLE (702.19d):
    "If an attacking creature with trample is blocked, but there are no creatures
     blocking it when damage is assigned, its damage is assigned to the defending
     player and/or planeswalker as though all blocking creatures have been assigned
     lethal damage."
    → With trample: all damage goes to player even with no remaining blockers

DAMAGE ASSIGNMENT — MULTIPLE BLOCKERS (no trample):
  Old (Obsolete): assign in a chosen order, lethal to each before moving to next
  Current: freely divide among all blockers — any distribution is legal
    - Can put all damage on one blocker (leaving others with 0)
    - Can split exactly as desired
    - No minimum per blocker
    - Only constraint: CR 510.1e — total assignment from all attackers checked at end;
      must be legal in aggregate (doesn't add new per-creature minimum)

TRAMPLE + INDESTRUCTIBLE (CR 702.19b):
  "Lethal damage" for trample = blocker's toughness - damage already marked
  "Not any abilities or effects that might change the amount of damage that's
   actually dealt" (702.19b)
  Indestructible does NOT change the lethal calculation:
    Indestructible blocker with toughness 5 = must still assign 5 before trampling
    The damage is dealt, the indestructible blocker survives, excess goes to player

DEATHTOUCH + MULTIPLE BLOCKERS (per P001):
  Any nonzero damage from a deathtouch source = lethal
  Can assign 1 damage to each of multiple blockers — all die
  Works with or without trample
```

## Definitive Conclusions

- **Killing all blockers does not un-block the attacker.** It merely leaves the attacker blocked with no creatures to deal damage to. The attacker deals zero combat damage.
- **With trample, killing all blockers makes the full power go to the player.** CR 702.19d specifically handles this case.
- **A blocked non-trample attacker with 0 remaining blockers is a completely dead end.** It contributes nothing to the combat damage step.
- **No assignment order for multiple blockers.** Freely divide. There is no obligation to "kill" any particular blocker first.
- **Indestructible blockers still require full toughness assignment to trample through.** The trample lethal calculation ignores effects that change whether the damage actually destroys the creature — it's purely math: power vs. toughness minus marked damage.
- **First strike + multiple blockers: the blocked state and "no remaining blockers" rule applies in the first strike step too.** If a first-striker kills all its blockers, it remains blocked and deals no damage in the regular damage step either (since both steps check the same rules).
- **A creature deals damage to ALL creatures blocking it simultaneously (CR 510.2).** There is no round-robin. Damage is simultaneous.

## Canonical Example
**Attacker blocked, blockers killed before damage:**
You attack with a 5/5. Opponent blocks with two 2/2s. You respond to the block by casting Shock on each 2/2 (2 damage each — lethal). Both 2/2s die before the combat damage step. Your 5/5 is still "blocked" (509.1h). In the combat damage step, there are no creatures blocking it (510.1c) — it assigns no combat damage. It doesn't hit the opponent for 5. Nothing happens. The opponent took zero damage this combat.

If your 5/5 had trample: the situation is different. No blockers remain when damage is assigned → CR 702.19d → all 5 damage goes to the defending player.

**Example 2 — Free distribution, multiple blockers:**
Your 6/2 attacks. Opponent blocks with a 1/4 and a 1/4. You can assign 6/0, 5/1, 4/2, 3/3, 2/4, 1/5, or 0/6 (any split). No assignment order required. You choose 3/3 — both blockers survive with 3 damage. Your 6/2 takes 2 damage total (1 from each). You could instead assign all 6 to the first 1/4: it takes 6 damage and dies; the second 1/4 takes 0 and survives.

**Example 3 — Indestructible blocker + trample:**
Your 10/10 with trample attacks. Opponent blocks with an indestructible 3/3. For trample lethal assignment: "lethal damage" = 3/3's toughness − 0 already marked = 3. You must assign at least 3 to the indestructible 3/3. Remaining 7 can go to the player. Indestructible 3/3 takes 3 damage (marked on it) but isn't destroyed. Opponent takes 7.

## Commonly Confused With
- **P001 (Threshold-Based Damage Assignment)** — P001 covers trample + deathtouch specifically: what counts as "lethal" for trample purposes. P030 covers: (a) the blocked state surviving blocker removal, (b) zero damage when no blockers remain, and (c) the free-distribution misconception. Use P001 for trample math; use P030 for the blocked-state and distribution mechanics.
- **P027 (Protection — DEBT)** — A protection-from-attacker-color blocker prevents damage from the attacker (D in DEBT), but that doesn't un-block the attacker. The attacker is still blocked; it still assigns damage to the blocker (and damage is prevented). The attacker can't suddenly hit the player just because its damage is prevented.
