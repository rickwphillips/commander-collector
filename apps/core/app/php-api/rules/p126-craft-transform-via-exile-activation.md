---
id: p126
name: Craft — Transform via Exile with Materials
category: zones
cr_refs: [702.167a, 702.167b, 702.167c]
tags: [craft, exile, transform, activated-ability, sorcery-speed, materials, graveyard, double-faced]
created: 2026-03-28
examples_count: 2
---

# P126 — Craft — Transform via Exile with Materials

## Abstract
Craft is an activated ability that transforms a permanent by exiling it and some materials (other permanents/cards), then returning it transformed. The permanent exiles itself AND exiles the specified materials (artifacts, creatures, etc.) from your permanents or graveyard, then returns to the battlefield as its transformed face. Craft activates only as a sorcery. After crafting, the new permanent can reference the exiled materials. Key: the materials are consumed (exiled) as the cost.

## The Definitive Rule

**CR 702.167a** (verbatim): *"'Craft with [materials] [cost]' means '[Cost], Exile this permanent, Exile [materials] from among permanents you control and/or cards in your graveyard: Return this card to the battlefield transformed under its owner's control. Activate only as a sorcery.'"*

**CR 702.167b** (verbatim): *"If an object in the [materials] of a craft ability is described using only a card type or subtype without the word 'card,' it refers to either a permanent on the battlefield that is that type or subtype or a card in a graveyard that is that type or subtype."*

**CR 702.167c** (verbatim): *"An ability of a permanent may refer to the exiled cards used to craft it. This refers to cards in exile that were exiled to pay the activation cost of the craft ability."*

## The Pattern

```
CRAFT ACTIVATION:
  Cost: [Mana cost] + exile this permanent + exile [specified materials]
  Materials: permanents you control AND/OR cards in your graveyard of the described type
  Both battlefield AND graveyard sources can fill the materials requirement
  Effect: return this card (now in exile) to the battlefield transformed

TRANSFORM VIA CRAFT:
  The permanent is exiled by its own cost payment
  The permanent is in exile → then returned to battlefield as its back face
  This is NOT a zone-change triggered ability — it's part of the activation resolution

MATERIALS EXAMPLES:
  "Craft with creature": exile a creature permanent you control OR a creature card in graveyard
  "Craft with four artifacts": exile 4 artifacts total (mix of battlefield and graveyard OK)
  "Craft with Human": exile a Human (any human, regardless of the "card" distinction per 702.167b)

REFERENCING EXILED MATERIALS (702.167c):
  The crafted permanent can have abilities like "for each card exiled with it"
  These abilities only reference the cards exiled TO PAY the craft cost
  Not other cards in exile

CRAFT IS SORCERY-SPEED:
  "Activate only as a sorcery" → main phase only, stack empty
  Can't craft in response to anything

CRAFT + ZONE CHANGE IDENTITY (P003):
  The permanent exiles itself and returns transformed → NEW object
  Any effects targeting the previous permanent: those targets are now invalid
  The crafted (back face) permanent is a new object

CRAFT + INDESTRUCTIBLE:
  Craft exiles the permanent (part of the cost) — exile is not destroy
  Indestructible doesn't prevent crafting

CRAFTING FROM GRAVEYARD MATERIALS:
  You can use a creature card in your graveyard as a material
  Multiple materials can come from different sources (some battlefield, some graveyard)
```

## Definitive Conclusions

- **Craft exiles the permanent itself AND the specified materials as costs.** Sorcery speed only.
- **Materials can come from both the battlefield (permanents) and graveyard (cards).**
- **After crafting, the permanent returns transformed as a new object.**
- **The crafted permanent can reference its exiled materials** in its abilities.
- **Exile bypasses indestructible** — craft can remove indestructible permanents via their own cost.

## Canonical Example
**Abuelo, Ancestral Echo (Craft with four artifacts):**
You have 2 artifact creatures on battlefield and 2 artifact cards in graveyard.
Pay {W} + exile Abuelo + exile the 4 artifacts → Abuelo returns transformed as its back face.
The back face might say "for each artifact card exiled to craft this, create a token" → references the 4 exiled artifacts.

**Example 2 — Craft vs removal:**
You activate craft in your main phase. Opponent tries to counter it with Stifle. If Stifle counters the ability: craft ability fizzles. But the costs were already paid (permanent and materials are already exiled as part of cost payment). The materials remain exiled; you lose the permanent.
Note: actually costs are paid after the ability resolves... wait. In MTG, costs are paid when the ability is put on the stack. So exiling happens immediately when the ability is activated (not at resolution). If Stifled, the exile happened but the transformation doesn't.

## Commonly Confused With
- **P098 (Double-Faced Cards / Transform)** — Transform via triggers/abilities on DFCs. Craft is an activated ability that specifically exiles and returns transformed.
- **P167 (Craft)** — Also compare to Unearth (P082): unearth returns from graveyard temporarily; craft transforms the craft permanent itself by exiling it.
- **P003 (Zone Change Identity)** — The crafted permanent is a new object on re-entry.
