---
id: p503
name: Suspect — Designation Rules, Disguise Interaction, Humility, and Blink
category: designations
cr_refs: [702.231, 702.231a, 702.231b, 400.7, 704.5, 613.1b]
tags: [suspect, designation, menace, cant-block, agrus-kos, repeat-offender, caught-red-handed, disguise, ward, humility, blink, zone-change, hexproof, non-copiable]
created: 2026-03-29
examples_count: 4
---

# P503 — Suspect: Designation Rules, Disguise Interaction, Humility, and Blink

## Abstract
"Suspect" is a **designation** — not an ability, not a status in the rules sense, and not a copiable value. When a creature is suspected, it becomes suspected (gains a designation) and while suspected, it has menace and the ability "this creature can't block." The designation persists through ability loss (Humility removes the granted abilities but not the designation) and requires a specific clearing condition or zone change to remove. Because suspecting a face-down disguised creature is a targeting action, ward {2} on the face-down creature will trigger. Blink (exile + return) clears the designation because the returned creature is a new object.

## The Definitive Rules

**CR 702.231a** (Suspect): *"When a creature becomes suspected, it gains menace and 'This creature can't block.' for as long as it's suspected."*

**CR 702.231b**: *"A creature remains suspected until it's no longer suspected or it leaves the battlefield."*

**Official ruling (Agrus Kos / Repeat Offender / Caught Red-Handed, 2024-02-02):**
*"When an effect suspects a creature, it becomes suspected. It gains menace and 'This creature can't block.' for as long as it's suspected. It stays suspected until it leaves the battlefield or another effect causes it to no longer be suspected."*

**Official ruling (Agrus Kos / Repeat Offender / Caught Red-Handed, 2024-02-02):**
*"If a suspected creature loses all abilities, it will lose menace and 'This creature can't block', but it won't stop being suspected."*

**Official ruling (Agrus Kos / Repeat Offender / Caught Red-Handed, 2024-02-02):**
*"Being suspected isn't a copiable value. If a permanent becomes a copy of a suspected creature, it won't be suspected."*

**Official ruling (Agrus Kos / Repeat Offender / Caught Red-Handed, 2024-02-02):**
*"If a creature is already suspected, suspecting it again won't have any effect."*

**CR 400.7**: Zone change → new object; no designations, counters, or tracked effects carry through.

**Caught Red-Handed oracle text**: *"This spell can't be countered. (This includes by the ward ability.)"*

## The Pattern

```
SUSPECT IS A DESIGNATION, NOT AN ABILITY:

  Layer structure (CR 613.1b — ability-adding effects):
    Humility removes all abilities (layer 6) — creature loses menace and
    "can't block" granted by being suspected.
    BUT the "suspected" designation itself is not an ability. Humility
    cannot remove it. When Humility leaves or ceases to apply, the creature
    will regain menace and "can't block" because it is STILL suspected.

  Designation vs. ability:
    Designation = a status flag applied to the permanent by a game rule or effect.
    Ability = a characteristic that can be granted, removed, or suppressed.
    Suspect grants abilities BECAUSE the creature has the designation.
    Remove the designation → abilities leave. Suppress the abilities → designation stays.

DISGUISE + SUSPECT INTERACTION:

  Can you suspect a face-down Disguise creature?
    YES. Face-down creatures are valid targets for effects that say "target creature."
    Suspect effects (Agrus Kos ETB, Caught Red-Handed, Repeat Offender activation)
    target a creature. The face-down creature is a creature on the battlefield.

  Does ward {2} protect the face-down creature from being suspected?
    DEPENDS on whether the suspect effect targets the creature.

    Triggered suspect (e.g., Agrus Kos "choose up to one target creature"):
      → This TARGETS the creature → ward {2} triggers.
      → Opponent must pay {2} or the targeting spell/ability is countered.
      → If ward is satisfied (or can't be responded to in time), suspect is applied.

    Non-targeted suspect (e.g., a global "all creatures become suspected" effect):
      → Ward only triggers on targeting. A non-targeted effect bypasses ward entirely.

  What about Caught Red-Handed?
    → Its oracle text explicitly states "This spell can't be countered.
       (This includes by the ward ability.)"
    → Ward's triggered effect would counter the spell upon resolution, but
       Caught Red-Handed cannot be countered by any means.
    → Result: Caught Red-Handed resolves regardless of ward triggers.
    → The gained control + suspect effect proceeds even against a Disguise creature.

BLINK AND SUSPECT:

  Suspected creature → exiled (blink effect, Conjurer's Closet, etc.) and returned:
    → Zone change → new object (CR 400.7).
    → New object has no designation of "suspected."
    → The returned creature is NOT suspected.

  This means blink is a hard counter to any lingering suspect designation.

  Contrast with: Humility suppressing abilities while suspected
    → Designation persists through ability removal.
    → Not the same as blink: blink removes the designation; Humility masks effects.

HEXPROOF AND SUSPECT:

  Can hexproof protect a creature from suspect?
    → Hexproof prevents targeting by opponents.
    → If the suspect effect targets ("target creature"), hexproof stops it.
    → If the suspect effect does not target (blanket effect), hexproof is irrelevant.
    → Agrus Kos trigger: "choose up to one target creature" → hexproof works.
    → Repeat Offender: "{2}{B}: If this creature is suspected..." → self-targeting;
      this is an activated ability on the creature itself, not targeting another.
    → Caught Red-Handed: explicitly bypasses ward; hexproof is more restrictive (fully
      prevents targeting by opponents) so hexproof would still prevent Caught
      Red-Handed from targeting — HOWEVER, Caught Red-Handed's anti-ward note only
      applies to ward's counterspell effect, not to the targeting requirement itself.
      Hexproof prevents being targeted; Caught Red-Handed only overrides ward countering.
      THEREFORE: Hexproof DOES protect against Caught Red-Handed targeting.

IDEMPOTENCY:

  Suspecting an already-suspected creature has no effect.
  If you apply Agrus Kos's trigger to a suspected creature, it instead exiles it
  (that's the if/else in his text: "if it's suspected, exile it. Otherwise, suspect it.")
  This is NOT a "suspect does nothing" case — Agrus Kos checks and acts differently
  based on whether the creature is already suspected.

NON-COPIABLE DESIGNATION:

  Copy effects (Quasiduplicate, Clone) copy copiable values only.
  Being suspected is not a copiable value.
  A clone of a suspected creature enters NOT suspected.
  The original remains suspected.
```

## Definitive Conclusions

- **Suspect is a designation, not an ability.** The designation persists through ability suppression (Humility removes menace and "can't block" but the creature stays suspected). When Humility is removed, the abilities return.

- **Blink fully clears suspect.** Exile + return creates a new object with no designation. This is the cleanest way to remove the suspect designation from a creature you control.

- **Ward {2} on a face-down Disguise creature protects against targeted suspect effects.** The face-down creature is a legal creature target. Ward triggers when opponents target it. Pay {2} or the effect is countered.

- **Caught Red-Handed bypasses ward but not hexproof.** Its anti-counterspell clause overrides ward's triggered counterspell. Hexproof prevents targeting entirely, which is a stronger protection and still applies.

- **Suspecting an already-suspected creature is irrelevant (except for Agrus Kos).** Double-suspecting a creature does nothing. Agrus Kos specifically has a different action for already-suspected creatures (exile them instead).

- **Non-copiable.** Clones and copies of suspected creatures enter not suspected.

## Canonical Example

**Humility + Agrus Kos suspecting opponent's creature:**
Humility is in play. Agrus Kos attacks; you choose opponent's creature as target for his trigger. The creature becomes suspected. Humility suppresses all abilities from creatures — the creature loses menace and "can't block" from being suspected. However, the "suspected" designation is not removed. When Humility leaves the battlefield, the creature immediately regains menace and the blocking restriction because it is still suspected.

**Example 2 — Disguise ward vs. suspect:**
Opponent controls a face-down Disguise creature (ward {2}). You attack with Agrus Kos and his ETB trigger chooses that creature as the target. Ward triggers — opponent may pay {2}. If opponent pays {2}, Agrus Kos's trigger is countered (no suspect applied). If they don't pay, the trigger resolves and the face-down creature is suspected (gains menace and can't block while face-down).

**Example 3 — Blink removes suspect:**
Your creature is suspected. You blink it with Conjurer's Closet at end of your turn. The creature goes to exile, then returns as a new object — not suspected. It now has neither menace nor the blocking restriction from suspect (though it regains all its normal printed abilities).

**Example 4 — Copy of suspected creature:**
Opponent suspects their own Repeat Offender (common self-suspect). You cast Quasiduplicate targeting it. The token copy is NOT suspected. The original Repeat Offender remains suspected.

## Commonly Confused With
- **P065 (Ward)** — ward's triggered counter-tax; how ward interacts with spells that "can't be countered" (like Caught Red-Handed's explicit override).
- **P186 (Disguise Basics)** — face-down creature mechanics; ward {2} as a feature of disguise, not just of suspect interaction.
- **P010 (Multi-Layer Effect Continuity)** — ability suppression (Humility) vs. designation-based states. Humility removes abilities granted by the designation but doesn't remove the designation itself.
- **P003 (Zone Change Identity)** — blink clears suspect because the returned object is new; zone change = no memory of prior designation.
