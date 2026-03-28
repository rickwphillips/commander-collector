---
id: p001
name: Threshold-Based Damage Assignment
category: combat
cr_refs: [510.1d, 702.2, 702.19b, 704.5g, 704.5h]
tags: [trample, deathtouch, damage-assignment, multiple-blockers, first-strike, lethal]
created: 2026-03-28
examples_count: 4
---

# P001 — Threshold-Based Damage Assignment

## Abstract
When a creature assigns combat damage, it sometimes must assign a minimum ("lethal") amount to one target before routing excess elsewhere. The definition of **lethal** is not fixed — certain abilities modify the threshold. The pattern applies anywhere assignment order matters: trample, ninjutsu routing, multiple blockers.

## The Definitive Rule

**CR 510.1d** (damage assignment order):
An attacking creature with trample must assign at least lethal damage to each blocker (in the order the attacker chose) before assigning any damage to the defending player or planeswalker.

**CR 510.1d footnote / deathtouch interaction:**
Lethal damage = (creature's toughness) − (damage already marked on it).

**CR 702.2 (Deathtouch):**
Any nonzero amount of damage from a source with deathtouch is considered lethal for the purpose of damage assignment. This modifies the threshold from (toughness − marked) to **1**.

**CR 704.5g** — A creature with lethal damage marked is destroyed (state-based action).
**CR 704.5h** — A creature dealt damage by a deathtouch source is destroyed (separate SBA from lethal damage).

## The Pattern

```
lethal_threshold(blocker) =
  IF attacker has deathtouch:
    1
  ELSE:
    blocker.toughness - blocker.damage_marked

damage_assignment:
  for each blocker in attacker's chosen order:
    assign >= lethal_threshold(blocker)
  assign remaining to player/planeswalker (only if attacker has trample)
```

## Definitive Conclusions

- **Deathtouch + Trample**: Attacker assigns 1 damage to each blocker; all remaining damage tramples through. The 1-damage deathtouch assignment is legally "lethal" even if the blocker has 10 toughness.
- **Deathtouch without Trample**: Still must assign all damage to blockers (no trample routing). Deathtouch only changes the threshold, not whether excess can go to the player.
- **Multiple blockers + Trample**: Work through each blocker in order. First strike step: deathtouch-source assigns 1 per blocker, routes excess through. At start of regular damage step, those blockers are already dead (SBA from first strike damage), so attacker can assign all remaining damage to the player.
- **Trample without Deathtouch**: Must assign at least (toughness − marked damage) to each blocker — the full "real" lethal threshold.
- **First Strike + Deathtouch + Trample**: Most powerful combination. In first strike step, assign 1 per blocker. SBAs kill all deathtouch-damaged blockers before regular combat damage step. Attacker is effectively unblocked for regular damage.
- **Multiple Trample attackers, same blocker**: Each attacker assigns its own damage independently. Shared blocker's toughness can be split however the defending player assigned blockers; the attacker with trample uses remaining toughness as threshold.

## Canonical Example
A 3/3 with deathtouch and trample attacks. Blocked by a 6/6. Attacker assigns 1 to the 6/6 (deathtouch makes any amount lethal) and 2 trample damage to the defending player. Total: 6/6 destroyed by deathtouch SBA, player takes 2.

## Additional Examples

**Example 2 — No deathtouch, multiple blockers:**
5/5 trample attacks. Blocked by a 2/2 and a 1/1. Attacker assigns 2 to the 2/2 (lethal), 1 to the 1/1 (lethal), 2 trample to player.

**Example 3 — Regeneration doesn't remove trample:**
Blocker has regeneration. Attacker with trample must still assign lethal damage to trigger the destroy event (which regeneration then replaces). The lethal amount is still the normal threshold. Trample damage still goes through once lethal assigned.

**Example 4 — Wither/Infect modifies form, not threshold:**
A creature with wither and trample deals damage as -1/-1 counters. Lethal threshold still = toughness - already-marked (from counters). The deathtouch interaction still applies if the source also has deathtouch.

## Commonly Confused With
- **P007 (Priority Windows)** — People ask "can I respond before trample damage resolves?" — no, damage assignment and dealing happen simultaneously within the combat damage step.
- **P005 (Simultaneous Event Ordering)** — When multiple blockers die simultaneously from first strike + deathtouch, all SBAs are checked together.
