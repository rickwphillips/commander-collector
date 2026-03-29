---
id: p110
name: Menace — Must Be Blocked by Two or More
category: combat
cr_refs: [702.111a, 702.111b, 702.111c, 509.1]
tags: [menace, blocking, two-blockers, evasion, unblockable-unless, combat]
created: 2026-03-28
examples_count: 2
---

# P110 — Menace — Must Be Blocked by Two or More

## Abstract
Menace is an evasion ability that requires attackers with menace to be blocked by TWO or more creatures if they are blocked at all. The opponent can still choose not to block (take the damage) or can block with exactly 2+ creatures. If the opponent only has one creature available, they cannot block a menace attacker with it. Menace does not prevent blocking — it sets a minimum of 2 blockers. This means it essentially forces the defending player to "spend" two creatures to stop a menace attacker.

## The Definitive Rule

**CR 702.111b** (verbatim): *"A creature with menace can't be blocked except by two or more creatures."*

## The Pattern

```
MENACE — CORE RULE:
  A creature with menace:
    CAN'T be blocked by exactly 1 creature
    CAN be blocked by 2 or more creatures
    CAN be left unblocked (defender may choose not to block)

  Effectively: "if blocked, requires 2+ blockers"

DECLARING BLOCKERS WITH MENACE:
  Defender has 3 creatures available:
    Option A: Don't block (attacker hits face)
    Option B: Block with 2 (or all 3)
    NOT legal: block with just 1 creature
  Defender has exactly 1 creature:
    Cannot block the menace creature at all with it

MENACE + MULTIPLE BLOCKERS:
  If blocked by 2+ creatures:
    Attacker's controller assigns damage among all blockers (in declared order)
    Standard multi-blocker damage assignment rules apply (P001)

MENACE + TRAMPLE:
  Menace requires 2 blockers → both have toughness
  Trample: must assign "lethal" to each blocker, excess to player
  With 2 blockers and trample: assign lethal to each, trample excess

MENACE + DEATHTOUCH (P105):
  1 deathtouch damage is lethal to each blocker
  With deathtouch menace: 2 blockers needed, but assign 1+1 deathtouch damage
  Remaining power tramples (if trample) or is wasted (no trample)

LOSING MENACE DURING COMBAT:
  Menace is checked at declare blockers step
  If menace is removed after blockers are declared: blocks stand (retroactive check not done)
  If menace is removed BEFORE blockers are declared: only 1 blocker required

MULTIPLICITY:
  Multiple instances of menace are redundant (702.111c)
```

## Definitive Conclusions

- **Menace requires 2+ blockers to legally block it.** One creature alone cannot block.
- **Defender can still leave it unblocked.** Menace doesn't force blocking.
- **If blocked, standard multi-blocker rules apply.** The attacker assigns damage among all blockers.
- **Menace is checked at declare blockers.** Abilities gained or lost afterward don't retroactively change the block.

## Canonical Example
**3/3 Menace attacks. Opponent has one 5/5:**
The 5/5 cannot block the menace creature alone. Defender must either leave it unblocked (take 3 damage) or sacrifice the 5/5 as one of two blockers (but they only have one creature, so they can't legally block it).

**Example 2 — Menace + 2 blockers:**
5/5 menace trample attacks. Opponent blocks with 2/2 and 2/2.
Attacker assigns: 2 to first 2/2 (lethal), 2 to second 2/2 (lethal), 1 trample damage to player.

## Commonly Confused With
- **P108 (Flying/Reach)** — Flying can't be blocked at all by non-reach/flying. Menace can always be left unblocked — it just requires 2 if you DO block.
- **P001 (Threshold Damage Assignment)** — With multiple blockers, standard toughness-threshold assignment applies.
