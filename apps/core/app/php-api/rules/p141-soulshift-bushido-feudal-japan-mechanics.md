---
id: p141
name: Soulshift and Bushido — Kamigawa Death and Combat Triggers
category: triggered
cr_refs: [702.46a, 702.46b, 702.45a, 702.45b]
tags: [soulshift, bushido, spirit, death-trigger, combat, +N/+N, blocking, blocked-by, kamigawa]
created: 2026-03-28
examples_count: 2
---

# P141 — Soulshift and Bushido — Kamigawa Combat and Death

## Abstract
Two Kamigawa mechanics that work at different moments. **Soulshift** triggers on death and returns a Spirit card of sufficient mana value from your graveyard to your hand — a powerful death-based recursion for Spirit tribal decks. **Bushido N** triggers whenever the creature blocks OR becomes blocked, giving it +N/+N until end of turn — combat-focused pump for Samurai/Warrior creatures. Both are straightforward but have specific targeting and timing rules.

## The Definitive Rules

**CR 702.46a** (verbatim): *"'Soulshift N' means 'When this permanent is put into a graveyard from the battlefield, you may return target Spirit card with mana value N or less from your graveyard to your hand.'"*

**CR 702.45a** (verbatim): *"'Bushido N' means 'Whenever this creature blocks or becomes blocked, it gets +N/+N until end of turn.'"*

## The Pattern

```
SOULSHIFT:
  Death trigger: when this permanent is put into a graveyard from the battlefield
  Effect: return target Spirit card with CMC ≤ N from your graveyard to hand
  Optional ("you may" return) — can choose not to
  Target: must be a Spirit card in YOUR graveyard with CMC ≤ N

  SOULSHIFT N:
    Higher N = can return more expensive Spirits
    Soulshift 5: return any Spirit card with CMC 5 or less
    Soulshift 2: limited to cheap Spirits

  SOULSHIFT + ZONE CHANGE:
    The trigger fires when THIS permanent goes to the graveyard (not when it's exiled)
    If the creature is exiled instead of dying: soulshift does NOT trigger
    Standard LTB trigger rules apply (checks if condition met at death time)

  SOULSHIFT CHAIN:
    If Spirit A dies → soulshift returns Spirit B to hand
    If Spirit B enters and dies → its soulshift returns Spirit C to hand
    Can chain soulshifts for rapid recursion

  SOULSHIFT + CHANGELING:
    Changeling is every creature type including Spirit
    A Changeling card in the graveyard qualifies as a "Spirit card" for soulshift

BUSHIDO:
  Triggers when THIS creature blocks (it's the blocker) OR becomes blocked (it's the attacker being blocked)
  Effect: gets +N/+N until end of turn
  Stacks: multiple instances trigger separately → each gives +N/+N

  BUSHIDO TIMING:
    Triggers in declare blockers step
    Resolves before combat damage
    So the creature has the bonus when combat damage is dealt

  BUSHIDO + MULTIPLE BLOCKERS:
    If multiple creatures are blocking: bushido triggers once (it's one "became blocked" event)
    Only one trigger per combat even if multiple blockers

  BUSHIDO + FIRST STRIKE:
    Bushido pump + first strike: the creature is buffed before even the first combat damage step
    A 2/2 first strike bushido 2 becomes a 4/4 first striker → hits for 4 in first step

  BUSHIDO STACKING:
    A creature with bushido 1 twice: each instance triggers → +1/+1 twice → effectively +2/+2
    Bushido 2 and bushido 1 on same creature: +3/+3 total when blocking/blocked

  BUSHIDO + UNBLOCKED:
    If the creature is NOT blocked: bushido does NOT trigger
    Bushido only fires when blocking or BECOMING blocked
```

## Definitive Conclusions

- **Soulshift returns a Spirit card (CMC ≤ N) from YOUR graveyard to hand on death.** Triggered; optional.
- **Soulshift requires dying to the graveyard** — exile doesn't trigger it.
- **Changeling cards count as Spirits** for soulshift targets.
- **Bushido triggers when the creature blocks or becomes blocked.** +N/+N until end of turn.
- **Multiple bushido instances stack.** Bushido is powerful defensively and against blockers.

## Canonical Example
**Isamaru, Hound of Konda (3/3, no soulshift) attacks. Opponent blocks with Devoted Retainer (1/1, Bushido 1):**
Bushido triggers: Devoted Retainer becomes 2/2 until end of turn.
Combat: Isamaru deals 3 to Devoted Retainer (2/2) — kills it. Devoted Retainer deals 2 to Isamaru.

**Example 2 — Soulshift chain:**
Mothrider Samurai (Spirit, Soulshift 3) dies.
Soulshift triggers: return target Spirit with CMC ≤ 3 from graveyard to hand.
Return Ethereal Haze (Spirit, instant, CMC 1). Cast Ethereal Haze if needed.
If Ethereal Haze dies somehow: its soulshift triggers for a ≤1 CMC Spirit.

## Commonly Confused With
- **P074 (Afterlife)** — Afterlife creates tokens when dying; soulshift returns a card from graveyard to hand.
- **P082 (Unearth)** — Unearth returns a creature to battlefield temporarily; soulshift returns to HAND.
- **P076 (Mentor)** — Mentor gives a counter when attacking alongside weaker creatures. Bushido pumps the creature itself when in combat.
