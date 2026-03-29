---
id: p111
name: Haste — Summoning Sickness Override
category: continuous
cr_refs: [702.10a, 702.10b, 702.10c, 302.6]
tags: [haste, summoning-sickness, attack, tap-ability, activated-ability, control-since-start, new-control]
created: 2026-03-28
examples_count: 2
---

# P111 — Haste — Summoning Sickness Override

## Abstract
Haste overrides the "summoning sickness" rule, allowing a creature to attack and use tap/untap activated abilities even if it hasn't been under its controller's control since the beginning of that player's most recent turn. The underlying rule (CR 302.6) says creatures can only attack or use {T}/{Q} abilities if controlled "continuously since your most recent turn began." Haste bypasses this check entirely. Importantly: haste only matters for attacking and {T}/{Q} abilities — other abilities on a creature (activated without {T}, triggered, etc.) are unaffected by summoning sickness at all.

## The Definitive Rule

**CR 702.10b** (verbatim): *"If a creature has haste, it can attack even if it hasn't been controlled by its controller continuously since their most recent turn began."*

**CR 702.10c** (verbatim): *"If a creature has haste, its controller can activate its activated abilities whose cost includes the tap symbol or the untap symbol even if that creature hasn't been controlled by that player continuously since their most recent turn began."*

## The Pattern

```
SUMMONING SICKNESS (CR 302.6) — what it is:
  A creature can't attack or use {T}/{Q} abilities unless:
    its controller has controlled it continuously since their most recent turn began
  This applies to creatures that JUST entered (entered this turn)
  AND to creatures whose control changed this turn

HASTE — what it overrides:
  With haste: the "continuously since turn began" check is bypassed
  Can attack the turn it enters (even if entered this turn)
  Can use {T}/{Q} activated abilities immediately

WHAT HASTE DOESN'T AFFECT:
  Activated abilities WITHOUT {T}/{Q}: no summoning sickness to bypass
    → Creatures can always use non-tap/untap activated abilities regardless
  Triggered abilities: also not affected by summoning sickness
  Just being a blocker: doesn't require haste (can block even on first turn)
  Static abilities: never affected by summoning sickness

CONTROL CHANGES AND HASTE:
  Stolen creature (taken this turn): has summoning sickness under new controller
    → Haste lets it attack immediately even if stolen
  Creature returned to hand and replayed: summoning sickness applies again
    → Haste removes it again

HASTE AT END OF TURN:
  Haste doesn't "wear off" — it's a static ability
  If a creature has haste via a spell "until end of turn": haste lost at end of turn
    → After end of turn: if creature survived, it no longer has haste
    → Next turn: it will have been controlled "since turn began" → no summoning sickness anyway
  So haste "until end of turn" only matters on the turn the creature entered

TIMING:
  Haste is checked at the time of declaring attacks / activating {T}/{Q}
  The creature has haste NOW → attack/activate
  The creature had haste when it entered but lost it → summoning sickness applies again if control is new
```

## Definitive Conclusions

- **Haste lets a creature attack and use {T}/{Q} abilities the turn it enters.**
- **Haste doesn't help with non-{T}/{Q} activated abilities or triggered abilities** — those aren't affected by summoning sickness anyway.
- **Creatures can always block, even with summoning sickness.** Blocking doesn't require haste.
- **A creature gains summoning sickness again if control changes** (unless it has haste).

## Canonical Example
**Goblin Guide (Haste) enters the battlefield:**
Immediately declared as an attacker. No summoning sickness because of haste. Trigger fires when it attacks.

**Example 2 — Control change + haste:**
Opponent casts Act of Treason, gaining control of your 5/5. Even though it's now under opponent's control this turn (summoning sickness!), the opponent can attack with it because the spell grants haste alongside control.

## Commonly Confused With
- **P109 (Vigilance)** — Vigilance doesn't help you attack (you can always attack with any untapped creature); vigilance just keeps you untapped afterward. Haste specifically enables the attack.
- **P039 (Equipment)** — The equip ability is {T}-cost — a creature with summoning sickness can't activate equip on creatures it controls. Haste bypasses this.
