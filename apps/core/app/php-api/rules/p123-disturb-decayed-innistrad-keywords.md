---
id: p123
name: Disturb and Decayed — Innistrad Graveyard Keywords
category: zones
cr_refs: [702.146a, 702.146b, 702.147a]
tags: [disturb, decayed, zombie, graveyard-cast, transformed, can't-block, sacrifice, end-of-combat]
created: 2026-03-28
examples_count: 2
---

# P123 — Disturb and Decayed — Innistrad Graveyard Keywords

## Abstract
Disturb lets you cast a double-faced card from your graveyard for an alternative cost, but it enters the battlefield already transformed (back face up). Decayed is a static + triggered pair that defines zombie tokens from Innistrad: Midnight Hunt — they can't block, and when they attack, they are sacrificed at end of combat. Both mechanics are from Innistrad: Midnight Hunt and Night cycle sets, creating disposable attackers and graveyard-based value.

## The Definitive Rule

**CR 702.146a** (verbatim): *"Disturb is an ability found on the front face of some double-faced cards. 'Disturb [cost]' means 'You may cast this card transformed from your graveyard by paying [cost] rather than its mana cost.'"*

**CR 702.146b** (verbatim): *"A resolving double-faced spell that was cast using its disturb ability enters the battlefield with its back face up."*

**CR 702.147a** (verbatim): *"Decayed represents a static ability and a triggered ability. 'Decayed' means 'This creature can't block' and 'When this creature attacks, sacrifice it at end of combat.'"*

## The Pattern

```
DISTURB — CASTING TRANSFORMED:
  From graveyard: pay disturb cost (alternative to mana cost)
  Enters battlefield with BACK FACE up (transformed state)
  This is NOT a normal front-face cast + transform
  The card enters already showing its back face

  Targeting: since it's an alternative cost, normal casting rules apply
  (No transform trigger fires — it entered as the back face directly)

DISTURB + ZONE CHANGE (P003):
  When cast from graveyard: it's a new object on the stack
  If countered: goes to graveyard (as a spell being countered)
  If exiled while on stack: goes to exile

DISTURB + DFC RULES (P098):
  The DFC's front face has disturb
  Back face has the spirit/aura characteristics
  In graveyard/hand: it's seen as its front face (for most purposes)
  On battlefield (via disturb): it's the back face

DECAYED — DUAL NATURE:
  Static ability: "can't block" — always applies, no trigger
  Triggered ability: "when this creature attacks, sacrifice at end of combat"
    → This is a delayed trigger: it sacrifices at END OF COMBAT (not during declare attackers)
    → There IS a window between attack declaration and sacrifice

  Decayed creatures: can attack, deal damage, trigger "when attacks" abilities
    THEN: sacrificed at end of combat step

DECAYED + TOKENS:
  Most decayed creatures are zombie tokens (created by various Innistrad spells/abilities)
  Token is created with decayed → can't block immediately → can attack next turn
  (Or immediately if it has haste)

DECAYED ATTACK vs SACRIFICE TIMING:
  Declare attackers: declare decayed zombie as attacker
  Combat resolves (blockers declared, damage dealt, triggers resolve)
  End of combat step: sacrifice trigger resolves → zombie sacrificed
  The zombie dealt damage and triggered all attack-based abilities BEFORE being sacrificed

DECAYED + FLYING/TRAMPLE:
  Decayed creatures can have other abilities
  They just can't block and are sacrificed after attacking
```

## Definitive Conclusions

- **Disturb casts the card transformed from graveyard — enters with back face up, skipping front face.**
- **Decayed creatures can't block (static).**
- **Decayed creatures attack and then are sacrificed at end of combat (triggered).**
- **Window exists between attack and sacrifice** — combat damage and "when attacks" triggers resolve before sacrifice.
- **Disturb enters the back face directly** — no "transform" event triggers.

## Canonical Example
**Bereaved Survivor (front) / Dauntless Avenger (back), Disturb {3}{W}:**
Dies normally. In your graveyard: cast it using disturb {3}{W}. It enters the battlefield as Dauntless Avenger (back face) immediately — no "enters as front face then transforms."

**Example 2 — Decayed zombie attacks:**
You control a 2/2 Zombie token with Decayed (created by Diregraf Rebirth).
Can't block. On your turn: declare it as attacker. It deals 2 damage. End of combat: sacrifice trigger resolves, it's sacrificed. You got the attack, but the zombie is gone.

## Commonly Confused With
- **P098 (Double-Faced Cards)** — Disturb is a specific DFC mechanic. Normal transform/convert rules apply; disturb just enters already transformed.
- **P082 (Unearth)** — Unearth returns a creature to the battlefield temporarily; disturb casts the card as its back face from the graveyard.
- **P066 (Blitz)** — Blitz creatures sacrifice at end step; decayed zombies sacrifice at end of COMBAT.
