---
id: p136
name: Skulk, Renown, and Awaken — Conditional Combat Mechanics
category: combat
cr_refs: [702.118a, 702.118b, 702.112a, 702.113a, 702.113b]
tags: [skulk, renown, awaken, power-comparison, +1/+1, land-creature, damage-to-player, evasion]
created: 2026-03-28
examples_count: 3
---

# P136 — Skulk, Renown, and Awaken — Conditional Combat Mechanics

## Abstract
Three combat-adjacent mechanics: **Skulk** restricts which creatures can block (evasion based on power comparison). **Renown** rewards dealing combat damage to a player by permanently marking the creature with counters and a status. **Awaken** is an alternative cost that animates a land into a creature-land. Each mechanic has specific interaction patterns worth knowing.

## The Definitive Rules

**CR 702.118b** (verbatim): *"A creature with skulk can't be blocked except by creatures with greater power."*

**CR 702.112a** (verbatim for renown): *"Renown N means 'When this creature deals combat damage to a player, if it isn't renowned, put N +1/+1 counters on it and it becomes renowned.'"*

**CR 702.113a** (verbatim for awaken): *"'Awaken N—[cost]' means 'You may pay [cost] rather than pay this spell's mana cost as you cast this spell' and 'If this spell's awaken cost was paid, put N +1/+1 counters on target land you control. That land becomes a 0/0 Elemental creature with haste. It's still a land.'"*

## The Pattern

```
SKULK:
  Evasion ability: can't be blocked EXCEPT by creatures with GREATER power
  "Greater" = strictly greater, not equal
  A 2/2 with skulk: can be blocked only by creatures with power 3+
  A 1/1 with skulk: only blockable by creatures with power 2+
  A 4/4 with skulk: only blockable by creatures with power 5+

  SKULK + PUMPING:
    If you pump a potential blocker to match skulk creature's power: still can't block (needs GREATER)
    If you pump a blocker to have MORE power: it CAN now block

  SKULK + POWER = 0:
    A 0/X skulk creature: needs a blocker with power 1+ (greater than 0)
    Most creatures have power ≥ 1 → most creatures CAN block a 0/X skulk
    (Making skulk less useful on 0-power creatures)

RENOWN:
  Once: "When this creature deals combat damage to a player, if it isn't renowned..."
  One-time only — the card gets the "renowned" status permanently
  Can't trigger again once renowned
  The "if it isn't renowned" is an intervening-if check

  RENOWN + ZONE CHANGE:
    If the creature dies and is returned to the battlefield: new object, not renowned anymore
    New object can become renowned again (it lost the "renowned" status from moving zones)

  CLASSIC CARD: Consul's Lieutenant (Renown 1): deals damage → put 1 counter → becomes renowned
    Now has +1/+1 buff. In combat: if renowned, other attacking creatures get +1/+0 until end of turn.
    Knight of the White Orchid is NOT a renown creature — wrong example.

AWAKEN:
  Alternative cost: pay the awaken cost instead of mana cost
  Effect 1: the spell's normal effect resolves
  Effect 2: target land you control gets N +1/+1 counters AND becomes 0/0 Elemental with haste
    But: "it's still a land" — so the awakened land is both a land AND a creature
    It doesn't lose its land type (it's a Creature Enchantment Land or similar)

  AWAKENED LAND:
    Has haste: can attack the turn it becomes a creature
    Is a 0/0 + N +1/+1 counters = effectively N/N Elemental
    Counts as BOTH a land AND a creature
    Tap for mana: still works (it's a land)
    Attack: can attack (it's a creature with haste)
    Remove counters: if it drops to 0 +1/+1 counters and remains 0/0: dies from SBA 704.5f

  AWAKEN + PROTECTION:
    A land with protection from a color: the protection applies to it as a creature and as an enchantment target
    Awakened lands can have protection
```

## Definitive Conclusions

- **Skulk: blocked only by creatures with STRICTLY GREATER power.** Equal power = can't block.
- **Renown triggers once when dealing combat damage to a player** and gives permanent "renowned" status + counters.
- **Zone change resets "renowned" status** (new object isn't renowned).
- **Awaken animates a land into an Elemental creature** — still a land AND a creature simultaneously.
- **Awakened land dies if its counters drop to 0** (0/0 creature SBA 704.5f).

## Canonical Example P136a — Skulk:
**Slither Blade (Skulk, 1/1 Merfolk Rogue):**
Can be blocked only by creatures with power 2+.
Opponent has 1/3 Wall (power 1): can't block. Opponent's 3/3: can block (power 3 > 1).
Effective vs token swarms (1/1s can't block it).

**Example P136b — Renown:**
**Honored Crop-Captain (Renown 1):** Attacks, unblocked, deals combat damage to player.
Trigger: "if it isn't renowned" → true → put 1 counter on it, it becomes renowned.
Now it's 3/2. Future turns: whenever it attacks and it's renowned, other attackers get +1/+0.
If it dies and returns from graveyard (persist etc.): NEW object, not renowned → can become renowned again.

**Example P136c — Awaken:**
**Scatter to the Winds (Awaken 3 — {4}{U}{U}):**
Pay {4}{U}{U}: counter target spell AND target land becomes 3/3 Elemental with haste.
Your Island is now an Island AND a 3/3 Elemental creature with haste.
Attack immediately this turn (haste). Can still tap for {U} mana on your turn.

## Commonly Confused With
- **P110 (Menace)** — Menace requires 2 blockers; skulk limits WHO can block based on power. Both are evasion-style restrictions.
- **P076 (Mentor)** — Mentor gives a counter to ANOTHER attacker when a more powerful creature attacks. Renown gives counters to ITSELF when it deals damage to a player. Subtle difference.
- **P058 (Crew)** — Crewed Vehicles are also land+creature style hybrid. Awaken lands are naturally occurring without the vehicle type.
