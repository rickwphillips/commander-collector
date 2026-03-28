---
id: p013
name: Banding Damage Inversion
category: combat
cr_refs: [702.22c, 702.22h, 702.22i, 702.22j, 702.22k]
tags: [banding, combat, damage-assignment, inversion, blocking, band, attack]
created: 2026-03-28
examples_count: 1
---

# P013 — Banding Damage Inversion

## Abstract
Banding fundamentally reverses the normal rules for who assigns combat damage. In normal combat, the defending player assigns each blocker's damage to the attacking creatures it's blocking. When attacking creatures have banding, the attacking player takes over that assignment — they choose how each blocker's damage is distributed among the band members. Simultaneously, a single block declaration pulls the entire band into the combat — all band members become blocked by the same blocking creature. The result is that the attacking player controls both sides of the combat damage decision.

## The Definitive Rule

**CR 702.22h**: *"If an attacking creature becomes blocked by a creature, each other creature in the same band as the attacking creature becomes blocked by that same blocking creature."*

**CR 702.22k**: *"During the combat damage step, if a blocking creature is blocking a creature with banding... the active player (rather than the defending player) chooses how the blocking creature's damage is assigned. That player can divide that creature's combat damage as they choose among any creatures it's blocking."*

**CR 702.22j** (mirror rule for blocking with banding): If a blocker has banding, the DEFENDING player assigns the attacking creature's damage. The banding controller always gains the assignment advantage.

**CR 702.22c**: At most one non-banding creature may join an attacking band. That creature benefits from the assignment inversion even without the keyword.

## The Pattern

```
NORMAL COMBAT:
  Attacking player: assigns attacker damage to blockers
  Defending player: assigns blocker damage to attackers

WITH BANDING ATTACKERS (702.22k):
  Attacking player: assigns attacker damage to blockers (same)
  Attacking player: ALSO assigns blocker damage to band members (inverted!)
  Defending player: passive — no damage assignment choices

WITH BANDING BLOCKERS (702.22j):
  Defending player: assigns blocker damage to attackers (same)
  Defending player: ALSO assigns attacking creature damage to band members (inverted!)
  Attacking player: passive for that creature's damage

KEY: Banding gives damage assignment control to the controller of the banding creatures,
     regardless of whether they're attacking or defending.

BAND FORMATION:
  - Up to 1 non-banding creature may join an attacking band
  - All members must attack the same target (player, planeswalker, or battle)
  - One block declaration pulls in the entire band
```

## Definitive Conclusions

- **The entire band becomes blocked by a single block declaration.** If a creature blocks one band member, all band members are blocked by it — and vice versa (702.22h/i).
- **The attacking player assigns ALL blocker damage** to band members (702.22k). The defending player has no say in how their blockers' damage is distributed.
- **No damage pooling on the attacking side.** Each banding attacker assigns its own damage independently to blockers. Banding doesn't combine the band's total power into a pool.
- **One non-banding creature can join the band** and receive the full protection of banding's damage inversion (702.22c). It doesn't need the keyword to benefit.
- **Banding doesn't share abilities or remove them** (702.22g). Each creature remains a separate permanent.
- **The band lasts the entire combat** even if banding is removed after declaration (702.22e).
- **Defensive banding (702.22j) is the mirror:** a blocking creature with banding gives the defending player control over the attacking creature's damage assignment. Rare but powerful when it comes up.

## Canonical Example
**3-creature attacking band (2/2, 3/3, 1/1 all banding) vs. two blockers (4/4 and 2/2):**

Declare blockers: 4/4 blocks 2/2 attacker → entire band blocked by 4/4. 2/2 blocks 3/3 attacker → entire band also blocked by 2/2.

Attacker assigns damage: 3/3 → 3 to 4/4; 2/2 → 1 to 4/4 (lethal), 1 to 2/2 blocker; 1/1 → 1 to 2/2 blocker (lethal). Both blockers die.

Blocker damage (attacking player assigns): 4/4's 4 damage → all to 3/3 (3/3 dies, 1/1 and 2/2 survive). 2/2 blocker's 2 damage → all to 2/2 attacker (kills it, 1/1 survives).

Result: Both blockers dead. 3/3 and 2/2 attackers dead. 1/1 survives. Attacking player had full control over which of their creatures absorbed damage.

## Commonly Confused With
- **P001 (Threshold-Based Damage Assignment)** — P001 covers trample and deathtouch assignment ordering. Banding overrides who makes the assignment decision entirely; it's not about thresholds.
- **P005 (Simultaneous Event Ordering)** — P005 covers APNAP ordering of simultaneous triggers. Banding is a static ability that modifies combat structure, not event ordering.
