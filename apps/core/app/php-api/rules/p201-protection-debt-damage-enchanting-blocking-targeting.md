---
id: p201
name: Protection — DEBT (Damage, Enchanting, Blocking, Targeting)
category: continuous
cr_refs: [702.16a, 702.16b, 702.16c, 702.16d, 702.16e, 702.16f, 702.16j]
tags: [protection, DEBT, damage-prevention, targeting-prevention, blocking, enchanting, equipment, white-knight]
created: 2026-03-28
examples_count: 3
---

# P201 — Protection — DEBT (Damage, Enchanting, Blocking, Targeting)

## Abstract
Protection from [quality] prevents four specific interactions, memorized as **DEBT**: **D**amage from sources with the quality is prevented, **E**nchanting/Equipping by sources with the quality is not allowed (existing ones fall off), **B**locking by creatures with the quality is not allowed, and **T**argeting by spells/abilities from sources with the quality is not allowed. Protection does NOT prevent: being sacrificed, being tapped by non-targeting effects, being killed by state-based actions (protection doesn't prevent toughness ≤ 0), Edict-style effects, and non-targeted mass removal.

## The Definitive Rules

**CR 702.16a** (verbatim): *"Protection is a static ability, written 'Protection from [quality].' This quality is usually a color (as in 'protection from black') but can be any characteristic value or information."*

**CR 702.16b** (verbatim): *"A permanent or player with protection can't be targeted by spells with the stated quality and can't be targeted by abilities from a source with the stated quality."*

**CR 702.16c** (verbatim): *"A permanent or player with protection can't be enchanted by Auras that have the stated quality. Such Auras attached to the permanent or player with protection will be put into their owners' graveyards as a state-based action."*

**CR 702.16d** (verbatim): *"A permanent with protection can't be equipped by Equipment that have the stated quality or fortified by Fortifications that have the stated quality. Such Equipment or Fortifications become unattached from that permanent as a state-based action, but remain on the battlefield."*

**CR 702.16e** (verbatim): *"Any damage that would be dealt by sources that have the stated quality to a permanent or player with protection is prevented."*

**CR 702.16f** (verbatim): *"Attacking creatures with protection can't be blocked by creatures that have the stated quality."*

**CR 702.16j** (verbatim): *"'Protection from everything' is a variant of the protection ability. A permanent or player with protection from everything has protection from each object regardless of that object's characteristic values. Such a permanent or player can't be targeted by spells or abilities and can't be enchanted by Auras. Such a permanent can't be equipped by Equipment, fortified by Fortifications, or blocked by creatures. All damage that would be dealt to such a permanent or player is prevented."*

## The Pattern

```
PROTECTION COVERAGE — DEBT:
  D — Damage prevented: all damage from sources with the quality is prevented
  E — Enchanting/Equipping blocked: can't be enchanted by Auras or equipped by Equipment with quality
    Existing auras/equipment with quality: fall off as SBA (equipment goes to battlefield unattached, auras go to GY)
  B — Blocking: creatures with the quality can't block the protected creature
  T — Targeting: can't be the target of spells or abilities from sources with the quality

WHAT PROTECTION DOES NOT PREVENT:
  - Sacrifice effects (Diabolic Edict): "sacrifice a creature" isn't targeting or blocking
  - Tapping via non-targeting effects (Icy Manipulator doesn't target? No — IM does target)
  - Non-targeted mass removal (Wrath of God, Destroy the Evidence): not targeted → no protection
  - Wrath of God has no color quality: "destroy all creatures" affects protection from everything?
    Wait: WoG itself is white — a white permanent has protection from white? Let's check:
    "Protection from white" means: can't be TARGETED BY white spells.
    Wrath of God doesn't target — it affects "all creatures."
    Therefore: Wrath of God DOES kill creatures with protection from white (no targeting protection)!
  - Deathtouch damage: damage from a deathtouch source with the quality would be prevented.
    But deathtouch requires nonzero damage → prevented damage = no damage = deathtouch doesn't apply
  - -1/-1 counter effects: if not targeted and not damage → protection doesn't stop this
  - Counterspells on the spell BEFORE it resolves: protection isn't active yet (creature not yet on BF)

PROTECTION FROM COLORS:
  White Knight (protection from black):
  - Can't be targeted by black spells (Terror can't target it)
  - Can't be enchanted by black Auras (Unholy Strength can't be put on it; existing falls off)
  - Can't be blocked by black creatures
  - Damage from black sources is prevented (black creature's combat damage, black spells)
  - Black Equipment falls off as SBA

PROTECTION FROM EVERYTHING (Emrakul, the Aeons Torn):
  - Can't be targeted by ANYTHING
  - Can't be enchanted by any Aura
  - Can't be equipped by any Equipment
  - Can't be blocked by any creature
  - All damage to it is prevented
  Note: Emrakul CAN be killed by Wrath of God (no target) or sacrificed (Edict)

PROTECTION + ANNIHILATOR:
  Emrakul has Annihilator 6 AND protection from everything
  Annihilator: defending player sacrifices 6 permanents (not targeted)
  Protection from everything doesn't prevent annihilator trigger's effect
  But: Emrakul can't be blocked (can't be blocked by anything)

PROTECTION + KEYWORDS:
  Trample: excess damage past a protection blocker — wait, protection stops blocking
  If somehow a protection creature IS blocking (or some weird effect): damage from protected source is prevented
  Indestructible: separate from protection. Indestructible prevents destroy/lethal damage, protection prevents damage entirely

PROTECTION FROM PLAYERS:
  CR 702.16k: "Protection from [player]" = protection from everything that player controls/owns
```

## Definitive Conclusions

- **DEBT** — Protection prevents Damage, Enchanting/Equipping, Blocking, and Targeting from the stated quality.
- **Does NOT stop** non-targeted mass removal, sacrifice effects, or -1/-1 counter placement.
- **Existing auras fall to graveyard**; existing equipment stays on battlefield but unattaches (SBA).
- **Protection from everything** is the ultimate version — covers all four DEBT components from all sources.
- **Color protection** is the most common — protection from a color protects from all DEBT from that color.

## Canonical Example
**White Knight (1/1 with protection from black):**
Opponent casts Terror (black instant: destroy target nonblack creature) targeting White Knight.
Terror can't target White Knight (T in DEBT) — White Knight can't be the target of black spells.
Terror is countered by game rules (illegal target on resolution, or can't even be CAST targeting it).
Opponent attacks with Black Knight: can't block White Knight (B in DEBT — black creatures can't block protection-from-black).
Actually: White Knight attacking is unblockable by black creatures. If White Knight is blocking, black creatures' damage is prevented (D).
Opponent tries to equip Black Sword (black Equipment) to White Knight: illegal (E in DEBT).

**Example 2 — Wrath and Protection:**
White Knight has protection from black.
Opponent casts Wrath of God (white sorcery, "destroy all creatures").
Wrath of God is a WHITE spell — but it doesn't TARGET White Knight.
Protection only blocks targeting (T), not non-targeted effects.
Wrath of God DESTROYS White Knight.
Common misconception: protection from [color] doesn't save you from untargeted [color] removal.

**Example 3 — Sacrifice Bypasses Protection:**
Pro from Black Knight, opponent controls Sac outlet.
Diabolic Edict: "target player sacrifices a creature."
The PLAYER is targeted, not the Knight. Then the player sacrifices a creature.
If the Knight is the only creature: player must sacrifice it.
Protection doesn't prevent "sacrifice" effects.

## Commonly Confused With
- **P103 (Hexproof)** — Hexproof only prevents targeting. Protection also prevents damage, enchanting, and blocking.
- **P104 (Indestructible)** — Indestructible prevents being destroyed (not damaged). Protection prevents damage entirely.
- **P159 (Infect)** — Infect damage would be prevented by protection (the damage is still "damage" from that source).
