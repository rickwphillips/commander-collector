---
id: p050
name: Overload — Target-to-Each Text Change and Targeting Implications
category: stack
cr_refs: [702.96a, 702.96b, 702.96c, 612]
tags: [overload, target, each, text-change, no-target, cant-be-countered, indestructible-objects, protection]
created: 2026-03-28
examples_count: 2
---

# P050 — Overload — Target-to-Each Text Change and Targeting Implications

## Abstract
Overload replaces "target" with "each" in the spell's text, making it affect all applicable objects or players instead of a single chosen target. This text change has critical implications: the overloaded spell has NO targets, which means it can't be countered by "counter target spell" (since it has no targets to be countered with that restriction), and hexproof/shroud/protection don't protect against it (those abilities protect from being targeted, and the overloaded spell doesn't target). However, the overloaded spell can still be countered by abilities that counter any spell (not specifically "target spell with a target").

## The Definitive Rule

**CR 702.96a** (verbatim): *"Overload [cost] means 'You may choose to pay [cost] rather than pay this spell's mana cost' and 'If you chose to pay this spell's overload cost, change its text by replacing all instances of the word "target" with the word "each."' Casting a spell using its overload ability follows the rules for paying alternative costs."*

**CR 702.96b** (verbatim): *"If a player chooses to pay the overload cost of a spell, that spell won't require any targets. It may affect objects that couldn't be chosen as legal targets if the spell were cast without its overload cost being paid."*

**CR 702.96c**: Overload's second ability creates a text-changing effect (rule 612).

## The Pattern

```
OVERLOAD SEQUENCE:
  Pay overload cost instead of mana cost
  → "target" → "each" in all instances throughout the spell text
  → Spell has NO targets (102.96b)

IMPLICATIONS OF NO TARGETS:
  Hexproof: only protects from being targeted → overloaded spell not stopped by hexproof
  Shroud: only protects from being targeted → overloaded spell not stopped by shroud
  Protection: D/E/B/T → T = targeted. No targeting → protection's T doesn't help
    BUT: protection's D is still relevant (prevents damage from that source)
  "Counter target spell that targets a permanent you control" → doesn't counter overload
    (the overloaded spell has no targets)
  "Counter target spell" → DOES counter overload (no restriction on targets needed)

OVERLOADED SPELLS CAN AFFECT OTHERWISE-PROTECTED OBJECTS:
  CR 702.96b: "may affect objects that couldn't be chosen as legal targets"
  Example: Cyclonic Rift overloaded returns ALL nonland permanents you don't control
    → Includes hexproof permanents, shroud permanents, indestructible permanents
    → Indestructible isn't relevant (being returned to hand isn't "destruction")
    → Hexproof/shroud aren't relevant (no targeting)
  Example: Mizzium Mortars overloaded → 4 damage to each non-Izziet creature you don't control
    → A creature with hexproof takes 4 damage (no targeting involved)
    → A creature with protection from red: D prevents damage (protection's D applies)
      But T doesn't prevent the targeting (there is no targeting)

TEXT CHANGE SCOPE:
  ALL instances of "target" become "each"
  "Target creature you control" → "each creature you control"
  "Target player" → "each player"
  The effect becomes a sweeper rather than a point removal

WHAT OVERLOAD DOESN'T CHANGE:
  Overloaded spells still go on the stack (can be responded to)
  Overloaded spells still resolve normally
  Overloaded spells are still affected by "spells cost {2} more to cast" effects
    (alternative cost, not free)
```

## Definitive Conclusions

- **Overloaded spells bypass hexproof, shroud, and protection's T.** They have no targets.
- **Overloaded spells still can be countered** by generic counterspells. Not by "counter target spell that targets X."
- **Protection's D still applies to overloaded damage spells.** No targeting, but damage from a red source is still prevented by protection from red.
- **Cyclonic Rift overloaded is one of the most powerful sweepers** precisely because of this: it hits hexproof, shroud, and indestructible permanents (since returning to hand isn't destruction).
- **The text change creates a different effect entirely.** "Target creature" → "each creature" changes point removal to a board wipe.

## Canonical Example
**Cyclonic Rift (overload {6}{U}):**
Pay {6}{U}. Spell text: "Return target nonland permanent you don't control to its owner's hand." → After overload: "Return each nonland permanent you don't control to its owner's hand." No targets. Opponent has a hexproof creature with protection from blue. Hexproof (no targeting) doesn't help. Protection from blue: T doesn't apply (no targeting), D doesn't apply (this is a return effect, not damage). The creature goes back to hand. This is why Cyclonic Rift is played at an overwhelming rate in Commander.

**Example 2 — Mizzium Mortars (overload {4}{R}{R}):**
Overloaded: 4 damage to each non-Izziet creature you don't control. Opponent has a hexproof 3/3 (normally can't be targeted). With overload, the 3/3 takes 4 damage — dies. Another creature has protection from red. Protection from red's D: damage from a red source is prevented → 0 damage dealt → doesn't die. The T component doesn't save it (no targeting), but D does.

## Commonly Confused With
- **P027 (Protection — DEBT)** — Overload bypasses T (no targeting) but NOT D (damage prevention). P027 establishes each DEBT pillar; P050 shows how overload selectively bypasses T.
- **P008 (Can't vs. May)** — "Can't be countered" on some spells: if the spell "can't be countered," overloading it doesn't change that. P050 covers "target" restrictions in counterspells interacting with overload.
