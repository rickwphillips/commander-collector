---
id: p178
name: Reconfigure — Equipment That Becomes a Creature
category: continuous
cr_refs: [702.151a, 702.151b]
tags: [reconfigure, equipment, creature, attach, unattach, sorcery-speed, Kamigawa-Neon-Dynasty, Cybermen-Squad]
created: 2026-03-28
examples_count: 2
---

# P178 — Reconfigure — Equipment That Becomes a Creature

## Abstract
Reconfigure gives an Equipment two activated abilities: attach to another creature (as a sorcery) or unattach (as a sorcery). When a reconfigure Equipment is attached to a creature, it stops being a creature itself and becomes just the Equipment it is. When unattached, it's a creature again. This means a reconfigure card starts as a creature, can be attached to another creature to grant Equipment benefits (and the Equipment itself stops being a creature while attached), and can be detached to become a creature again. The flexibility of creature vs. Equipment attachment is the core mechanic.

## The Definitive Rules

**CR 702.151a** (verbatim): *"Reconfigure represents two activated abilities. Reconfigure [cost] means '[Cost]: Attach this permanent to another target creature you control. Activate only as a sorcery' and '[Cost]: Unattach this permanent. Activate only if this permanent is attached to a creature and only as a sorcery.'"*

**CR 702.151b** (verbatim): *"Attaching an Equipment with reconfigure to another creature causes the Equipment to stop being a creature until it becomes unattached from that creature."*

## The Pattern

```
RECONFIGURE:
  Two sorcery-speed activated abilities:
    1. Attach: [cost] → attach this Equipment to another target creature you control
    2. Unattach: [cost] → unattach this Equipment (if currently attached)

  RECONFIGURE STATE:
    Unattached: the Equipment IS a creature (has P/T, creature type, abilities)
    Attached: the Equipment is NOT a creature (just an Equipment granting bonuses)
    CR 702.151b: attaching causes it to stop being a creature

  RECONFIGURE + SUMMONING SICKNESS:
    When the reconfigure card is a creature: it has summoning sickness if you just played it
    Can't attack or use {T} abilities
    CAN activate the reconfigure ability to attach it (sorcery-speed activation, not {T})
    Wait: activating the reconfigure attach ability: this is NOT the creature's own {T} ability
    It's an activated ability that costs mana, not tap
    Summoning sickness doesn't prevent activating sorcery-speed mana-cost abilities
    → Can attach a reconfigure Equipment on the same turn it enters (if main phase, stack empty)
    → But once attached, the Equipment isn't a creature anymore — no summoning sickness concern

  RECONFIGURE + COMBAT:
    Unattached: can attack and block as a creature
    Attached: can't attack/block (it's just an Equipment)
    Strategy: attack with the Equipment-creature, then attach it to another creature at sorcery speed
    Or: keep it as a standalone creature for aggression, attach when you need the Equipment bonus

  RECONFIGURE + EQUIPPED ABILITIES:
    The Equipment card has abilities printed on it
    When attached, it grants those abilities to the equipped creature
    When unattached, the reconfigure card itself has those abilities (as a creature)
    Effectively: the abilities are always present, just on different objects

  RECONFIGURE + EQUIPMENT SYNERGIES:
    Reconfigure Equipment benefits from "whenever an equipment enters" or "equipped creature gets..."
    But: it's only an Equipment (not a creature) while attached
    If an effect says "Artifact creatures you control get..." → only applies when unattached

  RECONFIGURE + FLICKERING:
    If the reconfigure Equipment is blinked while attached: it re-enters the battlefield unattached (as a creature)
    Then you'd need to pay the reconfigure cost again to re-attach

RECONFIGURE CARDS (Kamigawa: Neon Dynasty):
  Lion Sash (2/2, Reconfigure {2}):
    When entering: exile target card from a graveyard
    As Equipment: +1/+1 to equipped, can exile graveyards when sacrificed
    As creature: 2/2 with exile-graveyard ETB
  Mukotai Soulripper (3/1, Reconfigure {3}{B}):
    As creature: 3/1 with "sacrifice an artifact, draw a card" payoff
    As Equipment: equipped creature gets +3/+1 and the payoff
```

## Definitive Conclusions

- **Reconfigure Equipment starts as a creature** and becomes Equipment when attached to another creature.
- **Attaching stops it being a creature** (CR 702.151b) — no more attacks or blocking while attached.
- **Two sorcery-speed activations** — attach and unattach, both at main phase with empty stack.
- **ETB abilities** trigger when the reconfigure card enters as a creature (unattached).
- **Flexible**: use as a threat one turn, Equipment boost another.

## Canonical Example
**Lion Sash (2/2 Creature, Reconfigure {2}, When this enters exile target card from a graveyard):**
Enter: exile a target graveyard card (ETB fires because it's entering as a creature).
As 2/2: attack on turn 2 (after summoning sickness wears off).
Later: pay {2} to attach Lion Sash to your 5/5 attacker → Lion Sash stops being a creature → 5/5 equipped with +1/+1 bonus.
If 5/5 dies: Lion Sash detaches → it becomes a creature again (2/2, but already on battlefield, just changes state).
Pay {2} to unattach → Lion Sash is a creature again, ready to attack or defend.

**Example 2 — Reconfigure as Combat Trick:**
You have 2/2 Reconfigure creature and a 4/4 friend attacking.
Opponent blocks your 4/4 with a 5/5.
Main phase combat: can't reconfigure during combat (sorcery speed).
Post-combat main phase: pay reconfigure cost → attach to your 4/4 (now a 5/5 with Equipment bonus) → ready for next turn.

## Commonly Confused With
- **P178 vs Crew (Vehicle)** — Crew taps creatures to make a Vehicle a creature. Reconfigure attaches/detaches an Equipment to/from a creature.
- **P058 (Crew)** — Crew is the Vehicle equivalent; reconfigure is the Equipment equivalent of creature-flexibility.
- **P119 (Bestow)** — Bestow also toggles between Aura and creature. Reconfigure toggles between Equipment and creature.
