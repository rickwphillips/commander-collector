---
id: p495
name: Copy-of-Copy Recursion and Copy Chains — Characteristics Preservation and Divergence
category: continuous
cr_refs: [706.2, 110.3j, 613.1, 613.2]
tags: [copy, copy-of-copy, clone, recursion, characteristics, divergence, layer-system]
created: 2026-03-30
examples_count: 2
---

# P495 — Copy-of-Copy Recursion and Copy Chains — Characteristics Preservation and Divergence

## Abstract

When a **copy of a copy** is created, the new copy uses the **current game state** of its immediate source (the first copy), not the original object. Each copy in the chain reflects the state of the object it's copying at the time of copying. If the first copy has been modified (via continuous effects applied after it entered), the second copy reflects those modifications. However, **timestamp order matters**: effects with earlier timestamps apply to later copies. Copies of copies do not create infinite recursion loops because copy effects are not "abilities" that re-trigger; they are one-time replacements that establish a new object.

## The Definitive Rules

**CR 706.2 (Copy Effects):** *"When an object is copied, the copy is created with the same characteristics as the original... If the copy is created as a spell or permanent, it isn't a token."*

**CR 110.3j (Token Copies):** *"A token that is a copy of a permanent copies the characteristics of that permanent at the time of copying."*

**CR 613.2 (Copiable Values):** *"Copiable values are the values of characteristics and counters on a permanent that a copy effect can reference. If a permanent is a copy, its copiable values are the values it was created with, not the values it currently has."*

**Official Ruling (Factual Recursion — 2018):** *"When Clone copies Mirror Image, Clone becomes a copy of what Mirror Image was copying at the time Clone was created. If the characteristics of Mirror Image's source change, Clone doesn't change (it's a fixed copy)."*

## The Pattern

```
COPY-OF-COPY MECHANICS:

  Original object: Card A (2/2 creature)
  First copy: Clone copies Card A → Clone is 2/2 (with Card A's abilities)
  Second copy: Fact or Fiction copies Clone → FoF is 2/2 (with Clone's abilities)

  Each copy reflects its immediate source's state at the time of copying.

CHARACTERISTIC PRESERVATION:

  If Card A has a static ability that modifies power/toughness:
    Clone copies Card A (including its ability) → Clone is 2/2
    FoF copies Clone (including the ability) → FoF is 2/2

  The ability is preserved through the copy chain (if the copy text copies abilities).

DIVERGENCE WHEN SOURCE CHANGES:

  Original: Card A (2/2 creature)
  Clone copies Card A → Clone becomes 2/2

  Then, Card A gets +1/+1 (continuous effect applied).
  Card A is now 3/3.

  Clone is still 2/2 (it's a fixed copy; characteristics don't update).

  Then, Mirror Image copies Clone → Mirror Image is 2/2 (copying Clone's current state).

  All three have different P/T:
    - Card A: 3/3
    - Clone: 2/2
    - Mirror Image: 2/2

COPIABLE VALUES AT TIME OF COPYING:

  CR 613.2: If a permanent is a copy, its copiable values are the values it was
    created with, not the values it currently has.

  This means:
    - Clone's copiable values = Card A's values at the time Clone was created
    - If Card A's power then changes, Clone's copiable values don't change
    - But effects that apply to Clone continuously (like auras) still apply

RECURSIVE COPY CHAINS DON'T CREATE LOOPS:

  Copy effects create a new object (a snapshot), not a reference.
  When Clone copies Mirror Image, Clone does not gain "an ability to copy things."
  The copy effect is one-time; it doesn't re-trigger or chain indefinitely.

  Example:
    1. Clone copies Mirror Image
    2. Clone is a 2/2 with no "copy" ability (Clone is now static)
    3. Fact or Fiction copies Clone
    4. FoF is a 2/2 with no "copy" ability (FoF is now static)
    5. No further copies happen (no copy ability propagates)

CONTINUOUS EFFECTS APPLY TO COPIES:

  If Clone copies Card A, and then an aura enchants Clone:
    - Clone is a copy of Card A (static)
    - The aura modifies Clone (continuous effect, Layer 6)
    - Clone's P/T may change based on the aura

  If Mirror Image later copies Clone (with the aura on it):
    - Does Mirror Image also become enchanted? NO
    - Mirror Image is a 2/2 copy, but the aura is not copied (it's a separate object)
    - Only Clone has the aura

PRINTED TEXT VS. COPYING:

  If Card A has printed text that says "Whenever this creature attacks, draw a card":
    - Clone copies that text (is a copy, has the ability)
    - Mirror Image copies Clone's text (is a copy of a copy, still has the ability)
    - The text chains through the copy chain

COUNTERS DO NOT COPY:

  Card A has 3 +1/+1 counters (is 5/5).
  Clone copies Card A → Clone is 5/5 (but has 0 +1/+1 counters)

  The counters don't copy; only the base P/T and printed characteristics do.

```

## Definitive Conclusions

- **Copies reflect the source's state at copy time** — each copy in a chain reflects its immediate source, not the original.
- **Copy characteristics are fixed** — when Clone copies Card A as 2/2, Clone remains 2/2 even if Card A later becomes 3/3.
- **Copy chains don't propagate "copy" abilities** — the copy effect creates a one-time snapshot; no recursive loop forms.
- **Continuous effects apply to copies normally** — auras, pumps, and other Layer effects apply to copies as they would any other object.
- **Counters don't copy** — only printed characteristics and abilities copy; counters are separate objects.

## Canonical Example

**Clone Copying Mirror Image:**

You control Card A (2/2 creature with an ability). You cast Clone, which copies Card A. Clone becomes a 2/2 with Card A's ability.

Later, you cast Mirror Image targeting Clone. Mirror Image becomes a 2/2 copy of Clone (with Clone's ability, which is Card A's ability, preserved).

Card A then gets +1/+1 (continuous effect). Card A is now 3/3. Clone remains 2/2. Mirror Image remains 2/2. All three are now different objects with different P/T.

**Example 2 — Counters and Copies:**

Card A has 2 +1/+1 counters (is 4/4). Clone copies Card A. Clone becomes 4/4 but has 0 +1/+1 counters (counters don't copy).

Fact or Fiction copies Clone. FoF becomes 4/4 (a copy of a copy) with 0 +1/+1 counters.

If a +1/+1 counter is placed on Card A (now 5/5), Clone and FoF remain 4/4 (their copiable values don't update).

## Commonly Confused With

- **P003 (Zone Identity and Object Sameness)** — P003 covers whether objects are "the same"; P495 clarifies how characteristics propagate through copy chains.
- **P004 (Layer System)** — P004 covers layer ordering; P495 applies that to how copies determine their characteristics via layers.
- **P006 (Triggered Ability Double-Trigger)** — P006 covers ability firing; P495 clarifies that copy effects don't re-trigger (one-time snapshot).
