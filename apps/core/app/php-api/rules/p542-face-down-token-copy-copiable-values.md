---
id: p542
name: Face-Down Token Copy — Copiable Values and Turn-Face-Up Restriction
category: copy
cr_refs: [708.3, 706.10, 613.1]
tags: [face-down, copy, token, populate, copiable-values, morph, manifestdread, survival]
created: 2026-03-30
examples_count: 2
---

# P542 — Face-Down Token Copy — Copiable Values and Turn-Face-Up Restriction

## Abstract

**Face-down permanents copied via token-copy effects (e.g., Populate) retain face-down status but with 0 power and 0 toughness as copiable base values.** A face-down 2/2 creature token created by Manifest Dread has all characteristics defined by the rules (CR 708.3), including the implicit "you may turn this face up" ability. When copied via Populate, the copy becomes a face-down creature with 0/0 copiable values — the face-down status persists, but the copy cannot be turned face-up unless it has a mechanic-specific ability that allows it (like Morph). This pattern clarifies the interaction between copy mechanics and hidden information.

## The Definitive Rules

**CR 708.3 (Face-Down Objects):** *"A face-down permanent has the following game properties: it's a colorless, nameless, typeless creature with no abilities and power and toughness 2/2. This is a game rule that applies to the permanent as it is on the battlefield. The permanent is still bound by effects that apply to it."*

**CR 706.10 (Copy Effects):** *"A copy of a permanent that is a token can become a copy of that token in every way, with the exception of copiable values. The copiable values of a token are defined by what it was created as."*

**CR 613.1 (Layer System):** *"An object has characteristics including power, toughness, type, and other properties. Characteristics are determined by starting with the object's actual printed values, then applying all continuous effects."*

**CR 708.3a verbatim:** *"If a face-down permanent is looked at, its controller reveals it to all players... Face-down permanents that are turned face-up that were cast using a morph ability have a special rule that allows them to be turned face-up for their morph cost."*

## The Pattern

```
FACE-DOWN TOKEN CREATION (MANIFEST DREAD):

  Manifest Dread creates a face-down 2/2 creature token.
  Characteristics per CR 708.3:
    - Colorless, nameless, typeless
    - Creature type (temporary rules-based)
    - 2/2 power and toughness
    - No abilities (implicit turn-face-up not a true ability)

POPULATE EFFECT ON FACE-DOWN TOKEN:

  Populate effect: "Create a token copy of target creature token you control."
  Target: Face-down 2/2 creature token from Manifest

  Copy creates:
    - Face-down creature token (status preserved)
    - Copiable values: 0/0 base (per CR 706.10)
    - No abilities to inherit (face-down has none)
    - Cannot be turned face-up (no mechanic supporting it)

  The copy is a face-down creature with 0 power, 0 toughness, and no way to turn it face-up.
  Result: 0/0 face-down token remains on battlefield.

TURN-FACE-UP MECHANICS:

  Face-down permanents can be turned face-up only if:
  1. A specific mechanic allows it (Morph, Megamorph, Manifest, Disguise)
  2. The permanent has that mechanic in its rules text

  A face-down creature copy created by Populate:
    - Does NOT have Morph (not in copy's characteristics)
    - Does NOT have Manifest ability (not applicable to creatures already face-down)
    - Cannot be turned face-up

COPIABLE VALUES OF TOKENS:

  Copiable values of a token = what it was created as (CR 706.10)
  Manifest token copiable values: 2/2 (at creation)
  Copy of Manifest token copiable values: 0/0 (copy receives no P/T characteristics from source)

SURVIVAL MANIFEST + POPULATE:

  Defiant Survivor Survival ability: "Manifest dread" (put top card face-down as 2/2)
  Populate on the manifested creature:
    - Copy is face-down 0/0
    - Cannot be turned face-up (no mechanic)
    - Remains 0/0 face-down token

```

## Definitive Conclusions

- **Face-down tokens copied via Populate retain face-down status** — the copy is a face-down creature.
- **Copiable values are 0/0** — the copy receives no P/T characteristics beyond what the rules-definition provides.
- **Turn-face-up requires explicit mechanic** — a copy of a face-down token cannot be turned face-up unless it has Morph, Disguise, or similar ability.
- **Result is a 0/0 permanent** — the copy is a face-down creature with 0 power and 0 toughness, effectively a blank permanent.

## Canonical Example

**Populate on Manifest Dread Token:**

You control Defiant Survivor (Survival ability creates a 2/2 face-down creature token). You activate Populate: "Create a token copy of target creature token you control."

You choose the face-down 2/2 creature token. Populate creates a copy.

Copy is face-down (status inherited). Copiable values are 0/0 (no printed characteristics to copy). The copy cannot be turned face-up (no Morph or Manifest ability). Result: a 0/0 face-down creature token on the battlefield.

**Example 2 — Morph + Manifest:**

You control a Morph creature face-down (entered via Morph ability). You activate Populate and copy it.

Copy is face-down. But the Morph creature HAS a Morph ability in its oracle text. The copy can be turned face-up for the Morph cost (because the Morph ability is copied). Result: you can turn the copy face-up using its Morph ability.

## Commonly Confused With

- **P053 (Populate)** — P053 covers token copy mechanics; P542 clarifies face-down status interaction with copying.
- **P041 (Morph)** — P041 covers Morph mechanics; P542 applies to copied tokens without inherent turn-face-up abilities.
