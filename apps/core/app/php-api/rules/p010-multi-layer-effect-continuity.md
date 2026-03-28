---
id: p010
name: Multi-Layer Effect Continuity
category: continuous
cr_refs: [613.6, 613.4, 613.3]
tags: [layers, continuous-effects, ability-removal, multi-layer, ghost-effect, humility, 613.6, timestamp]
created: 2026-03-28
examples_count: 1
---

# P010 — Multi-Layer Effect Continuity

## Abstract
A single continuous effect can apply across multiple layers simultaneously (e.g., "lose all abilities" in layer 6 AND "have base P/T 1/1" in layer 7b). CR 613.6 guarantees that once this effect begins applying to a set of objects in an earlier layer, it continues applying to that same set in all subsequent layers — even if the ability generating it is removed during the process. The "ghost" of the effect persists through all its layers. This creates counterintuitive situations where a permanent can lose the very ability whose effect is still shaping the game state.

## The Definitive Rule

**CR 613.6 verbatim**: *"An effect that applies in multiple layers applies each part in the appropriate layer. Once it starts applying to an object, it continues to apply to that same set of objects through all layers, even if the ability generating it is removed during this process."*

This rule exists to prevent infinite loops and resolve contradictions when a multi-layer effect modifies the very source of its own generation.

## The Pattern

```
IF: A continuous effect spans multiple layers (e.g., layer 6 AND layer 7b)
AND: In an earlier layer, the ability generating the effect is removed
      (e.g., the permanent generating the effect loses its ability in layer 6)

THEN: The effect continues to apply in all later layers
      to the SAME SET OF OBJECTS it was already affecting.
      The removed ability is irrelevant — the effect is already in motion.

KEY: "Ability" and "Effect" are distinct.
  - The ABILITY (text on the card) can be removed.
  - The EFFECT (the ongoing change to the game state) continues through its layers.

STACK ORDER:
  Layer 6: ability removed from generating permanent
           → but effect was already set in motion
  Layer 7b: effect still applies (sets P/T) for the same objects
```

## Definitive Conclusions

- **A permanent can lose the ability whose effect is currently shaping the game.** The effect persists regardless — it was already in motion when it started applying.
- **The set of objects is locked in at the layer where the effect first applies.** If a creature enters the battlefield AFTER layer 6 is processed, it would not be in the set the effect is tracking — but in practice, layers are re-evaluated continuously, so this is mostly theoretical.
- **This is distinct from the ability being removed "permanently" vs. "within this evaluation."** CR 613.6 only covers within a single pass of the layer system — but since layers are evaluated continuously, the effect is always active.
- **The ability loss is still real.** The permanent genuinely has no ability. Other effects that care about "a creature with [ability]" would not see it. Only the continuous effect itself persists.
- **P/T winner is still determined by timestamp in layer 7b.** CR 613.6 keeps the effect alive; CR 613.7 (timestamp) determines which 7b effect wins if multiple effects compete there.

## Canonical Example
**Humility + Opalescence (Humility entered before Opalescence):**

- **Layer 4**: Opalescence ("each other non-Aura enchantment is a creature") makes Humility a creature. Opalescence does NOT make itself a creature ("each other").
- **Layer 6**: Humility ("all creatures lose all abilities") strips its own ability. Opalescence is not a creature — it keeps its ability.
- **CR 613.6 activates**: Humility's effect (layer 6 + layer 7b parts) continues applying to all creatures despite the ability being gone.
- **Layer 7b**: Both Humility's ghost effect ("base P/T 1/1") and Opalescence's effect ("P/T = CMC") apply to Humility. Timestamp order: Opalescence's later timestamp wins. Humility = **4/4**.
- **Result**: Humility is an Enchantment Creature 4/4 with no abilities. Opalescence is an Enchantment (not a creature) with its ability intact.

Note: If timestamps were reversed (Opalescence entered first, Humility second), Humility's effect would win layer 7b → Humility would be 1/1. Opalescence would still not be a creature. Timestamp is decisive.

## Additional Examples

*(Add over time)*

## Commonly Confused With
- **P004 (Layer Dependency Override)** — P004 covers when dependency overrides timestamp within a layer. P010 covers a different issue: whether a multi-layer effect survives the removal of its generating ability in an earlier layer. Both can be active in the same question (Humility+Opalescence involves P010 for the ghost effect AND P004/timestamp logic for the layer 7b winner).
- **P008 (Can't Overrides Can)** — P008 is about prohibitions winning over permissions. P010 is not about conflicting permissions — it's about an effect that survives the destruction of its own source within the layer system.
- **P002 (Replacement vs. Trigger)** — No replacement events here. P010 is pure continuous effect layer evaluation.
