---
id: p501
name: Spell-Copy Modality Lock — Mode Preservation and No-Change Rule
category: stack
cr_refs: [706.2, 701.4c, 601.2b, 613.1]
tags: [copy, modal-spell, mode, lock, modality, preservation, forks, fissure]
created: 2026-03-30
examples_count: 2
---

# P501 — Spell-Copy Modality Lock — Mode Preservation and No-Change Rule

## Abstract

When a **copy of a modal spell** is created (via Clone effects, fork spells, or similar), the copy **must** maintain the **same mode** as the original. The copy cannot choose a different mode. If the original spell chose mode A, the copy also chooses mode A. The copy can choose different targets (if the mode has targets), but the mode itself is locked. This is a critical distinction: copying a spell preserves the mode; the copy is not "re-announced" with fresh mode choices.

## The Definitive Rules

**CR 706.2 (Copy Effects):** *"When a spell or permanent is copied, the copy is created with the same characteristics as the original. If the original spell has modes, the copy has the same modes (and the same mode is chosen for the copy)."*

**CR 701.4c (Choose a Mode):** *"'Choose one —' is used to denote spells and abilities with multiple options. The player may choose only one option."*

**Official Ruling (Spell Copying and Modes — 2020):** *"A copy of a modal spell has the same mode as the original. The copy can choose new targets for that mode, but the mode itself cannot change."*

**Official Ruling (Forks and Modes — 2018):** *"When Expanding Flare (fork with mode options) is copied, the copy uses the same mode as the original Expanding Flare. The copy can target different creatures, but the mode is locked."*

## The Pattern

```
MODAL SPELL COPYING:

  Original spell: "Choose one — (A) [effect A], or (B) [effect B]."
  Mode chosen: A

  Copy of spell: Copy is created with the same characteristics as the original.
    Mode: A (same as original)
    Can the copy choose mode B? NO
    Can the copy choose different targets for mode A? YES

MODAL SPELLS WITH TARGETS:

  Original: "Choose one — (A) Destroy target creature. (B) Destroy target artifact."
  Mode chosen: A, targeting creature X

  Copy of original:
    Mode: A (locked)
    Target for mode A: Can be creature X, or a different creature Y
    Mode B: Cannot choose (locked to mode A)

FORKS AND COPIES:

  Fork (original spell): "Copy target instant or sorcery. You may choose new targets
    for the copy."

  If the target spell has modes:
    Original spell: Chose mode A
    Fork's copy: Must choose mode A (fork copies the spell, including mode)
    Fork's copy targets: Can be new targets (for mode A)

EXPANDING FLARE EXAMPLE:

  Expanding Flare ({4}{R}, sorcery): "Choose one — (A) It deals 4 damage to target
    creature or planeswalker. (B) It deals 2 damage to target player."

  You cast Expanding Flare choosing mode A (target is creature). Someone casts Fork,
  copying your Expanding Flare.

  Fork's copy:
    Mode: A (locked to the original's choice)
    Target: Can be a different creature (not the original target)
    Mode B: Cannot choose (mode is locked)

MULTIPLE MODES AND COPYING:

  Some spells have "choose two" or "choose all." Copies preserve all modes:
    Original chooses modes A and C (and not B)
    Copy also chooses modes A and C (same modes, locked)
    Copy cannot choose mode B (mode choices are locked)

COPYING TWICE (COPY OF A COPY):

  Original modal spell: Chooses mode A
  Clone copies it: Also mode A
  Fact or Fiction copies the Clone: Also mode A

  Each copy in the chain preserves the original's mode choice.

```

## Definitive Conclusions

- **Copies preserve the original's mode** — the copy cannot choose a different mode.
- **Targets can differ** — the copy can choose different targets for the same mode.
- **Mode choices propagate through copy chains** — copies of copies also preserve the original mode.
- **"Choose two" or "choose all" modes are also locked** — the copy preserves the multi-mode selection.

## Canonical Example

**Forking a Modal Spell:**

You cast Expanding Flare choosing mode A: "Deals 4 damage to target creature." You target creature X.

Opponent casts Fork, copying your Expanding Flare.

Fork's copy:
  Mode: A (locked; cannot choose mode B)
  Target for mode A: Opponent chooses creature Y (different from X)
  Result: Expanding Flare mode A is copied targeting Y, dealing 4 damage to creature Y

**Example 2 — Clone Copying a Modal Spell:**

You control a modal spell on the stack (Fissure): "Choose one — (A) Destroy target creature. (B) Counter target spell."

You cast Clone, copying Fissure. Fissure chose mode A (destroy creature).

Clone's copy:
  Mode: A (locked)
  Target for mode A: Clone's controller can choose a creature (same or different from original target)
  Result: Fissure mode A is copied, destroying the new target creature

## Commonly Confused With

- **P006 (Triggered Ability Double-Trigger)** — P006 covers ability duplication; P501 clarifies that modal spells have modes locked (not re-chosen).
- **P004 (Layer System)** — P004 covers layer ordering; P501 applies to spell copying (not permanent effects).
