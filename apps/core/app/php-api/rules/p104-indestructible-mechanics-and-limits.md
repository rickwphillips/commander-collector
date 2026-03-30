---
id: p104
name: Indestructible — What It Prevents and What It Doesn't
category: continuous
cr_refs: [702.12a, 702.12b, 702.12c, 704.5g]
tags: [indestructible, destroy, lethal-damage, sacrifice, exile, bounce, toughness-zero, cant-be-destroyed]
created: 2026-03-28
examples_count: 2
---

# P104 — Indestructible — What It Prevents and What It Doesn't

## Abstract
Indestructible prevents a permanent from being destroyed — it ignores "destroy" effects and ignores the state-based action for lethal damage. However, indestructible doesn't prevent exile, sacrifice, -X/-X effects reducing toughness to 0 or below, bounce, or any effect that doesn't use the word "destroy." It's purely a protection from the "destroy" event and lethal-damage SBA. A 10/10 indestructible creature with -12/-12 applied still dies — not because of damage but because toughness ≤ 0 (SBA 704.5f), which is different from SBA 704.5g (lethal damage).

## The Definitive Rule

**CR 702.12b** (verbatim): *"A permanent with indestructible can't be destroyed. Such permanents aren't destroyed by lethal damage, and they ignore the state-based action that checks for lethal damage (see rule 704.5g)."*

## The Pattern

```
WHAT INDESTRUCTIBLE STOPS:
  "Destroy" effects: Wrath of God, Terminate, Doom Blade, "destroy all creatures"
  Lethal damage SBA (704.5g): damage ≥ toughness → normally destroyed → indestructible ignores this
  Deathtouch: deathtouch causes death by making any damage "lethal" damage
    → Indestructible ignores lethal damage → deathtouch CANNOT kill an indestructible creature
  "When this creature would be destroyed" effects: never trigger on indestructible

WHAT INDESTRUCTIBLE DOESN'T STOP:
  Exile: "exile target creature" → not a destroy effect → indestructible irrelevant
  Sacrifice: "sacrifice a creature" → sacrifice ≠ destroy → indestructible irrelevant
  Bounce: "return to owner's hand" → not destroy → irrelevant
  Toughness ≤ 0 (SBA 704.5f): if toughness is reduced to 0 via -X/-X:
    SBA 704.5f: "creature with toughness ≤ 0 → put into owner's graveyard"
    This is NOT a "destroy" effect — it's a different SBA
    Indestructible doesn't prevent 704.5f
    → A -6/-6 effect on a 5/5 indestructible creature (4/4 after) then another -5/-5
       would reduce to -1/-1 toughness → SBA 704.5f fires → dies (not destroyed, just removed)
  Legend rule (704.5j): multiple same-named legends → sacrifice one → not destroy

DAMAGE ACCUMULATION:
  Indestructible creatures CAN take damage (damage is marked)
  The SBA that would destroy it (704.5g) is ignored
  But damage doesn't cause the creature to "ignore" other damage
  If damaged: cleanup step removes all damage markers

INDESTRUCTIBLE + COMBAT:
  In combat: blocking/being blocked still happens
  Trample: can still deal excess damage to the player
  Protection: protection prevents damage from that source (separate from indestructible)
  An indestructible blocker can be "killed" in combat if exiled instead

REGENERATION AND INDESTRUCTIBLE:
  Regeneration replaces "would be destroyed"
  Indestructible ALSO handles "would be destroyed"
  You can't regenerate an indestructible permanent (it can't be destroyed → regeneration is irrelevant)
  But regeneration is still a replacement effect — if you set up regeneration and then give it
    indestructible: the regeneration shield is wasted (the destroy never happens)
```

## Definitive Conclusions

- **Indestructible stops "destroy" effects and lethal damage SBA only.**
- **Exile bypasses indestructible.** So does sacrifice, bounce, and toughness-reduction to 0.
- **Deathtouch cannot kill indestructible creatures.** Deathtouch works by making any damage lethal; lethal damage is ignored.
- **-X/-X reducing toughness to ≤ 0 kills indestructible creatures** via SBA 704.5f (not 704.5g).
- **Lethal damage is marked on an indestructible creature and persists.** If the creature later loses indestructibility (e.g., its Indestructibility Aura is destroyed) while that marked damage is still present, SBA 704.5g fires immediately and the creature is destroyed. Indestructible is checked at SBA time, not at damage time. (Gatherer ruling 2013-07-01: "If a creature enchanted by Indestructibility is dealt lethal damage, the creature isn't destroyed, but the damage remains marked on the creature. If Indestructibility stops enchanting that creature later in the turn, the creature will no longer have indestructible and will be destroyed.")
- **Simultaneously destroying an Indestructibility Aura and its enchanted creature: only the Aura is destroyed.** The enchanted creature cannot be destroyed because it has indestructible at the time of the "destroy all" effect. The Aura (which does NOT have indestructible itself) is destroyed. (Gatherer ruling 2009-10-01 on Indestructibility)

## Canonical Example
**Darksteel Colossus (Indestructible):**
Wrath of God: "destroy all creatures" → Indestructible: not destroyed → Colossus survives.
Oblivion Ring: exile → Colossus is exiled (indestructible irrelevant).
Black Sun's Zenith (X=12): each creature gets -12/-12. Colossus is 11/11 → becomes -1/-1. SBA 704.5f: toughness ≤ 0 → put into graveyard. Not "destroyed" — bypasses indestructible.

**Example 2 — Deathtouch + Indestructible:**
Deathtouch attacker is blocked by indestructible creature. Deathtouch assigns 1 damage (which would be lethal for any other creature). Indestructible: "can't be destroyed by lethal damage" → ignore. The indestructible creature survives (with 1 damage marked, cleared at cleanup).

## Commonly Confused With
- **P027 (Protection — DEBT)** — Protection prevents damage (D). Indestructible ignores lethal damage SBA. A creature can be both indestructible AND have protection, stacking different layers of defense.
- **P082 (Unearth)** — Unearth creatures can be indestructible but still get exiled at end step (exile ≠ destroy → indestructible doesn't help there).
