---
id: p004
name: Layer Dependency Override
category: continuous
cr_refs: [613.1, 613.3, 613.4, 613.7, 613.8, 613.8a, 613.8b, 613.8c]
tags: [layers, continuous-effects, timestamp, dependency, P/T, type, color, ability, static]
created: 2026-03-28
examples_count: 4
---

# P004 — Layer Dependency Override

## Abstract
When multiple continuous effects modify the same object in the same layer, they normally apply in timestamp order (oldest first). But if applying one effect would change what another effect does or who it applies to, a dependency exists — and the depended-upon effect applies first regardless of timestamp. The question to ask: "If I apply effect B first, does it change what effect A does?"

## The Definitive Rule

**CR 613.7** — Within a layer, effects apply in timestamp order (earlier = first applied = potentially overridden by later).

**CR 613.8a** — Effect A **depends on** Effect B if:
1. Both are in the same layer (and same sublayer if layer 7), AND
2. Applying B would change A's text, existence, what A applies to, or what A does to its targets, AND
3. Neither is from a CDA, OR both are from CDAs.

**CR 613.8b** — A dependent effect waits until all effects it depends on have applied, then applies. If a dependency loop exists, ignore the rule and use timestamp order.

**CR 613.8c** — After each effect applies, re-evaluate remaining effects for new dependencies.

## The Pattern

```
QUESTION: "Does applying Effect B change what Effect A does?"

IF YES:
  → A depends on B
  → B applies first (regardless of timestamp)
  → Then A applies to the modified game state

IF NO:
  → No dependency
  → Timestamp order: earlier timestamp wins final state (because later overrides)

DEPENDENCY LOOP:
  → A depends on B, B depends on A
  → Ignore dependency, use timestamp order
```

## Definitive Conclusions

- **"All creatures are red" + "All red creatures get +1/+1"**: The pump depends on the color effect (same layer? No — color is layer 5, pump is layer 7c). Different layers don't have dependency. Each applies in its own layer. The pump applies to whatever creatures are red AFTER layer 5 is resolved. (This is not actually a dependency scenario — it's just normal layer ordering.)
- **"All creatures lose all abilities" + "This creature's P/T = number of cards in your hand" (CDA)**: CDA applies in layer 7a, ability-removal applies in layer 6. Layer 6 runs first. CDA is gone by layer 7a. Creature is 0/0 (or uses printed values if no CDA) — actually, CDA is removed in layer 6, so layer 7a has nothing to apply. Creature is 0/0 from printed values... wait. See resolution below.

  **Correct resolution**: If a creature's P/T is ONLY defined by a CDA (characteristic-defining ability) and the CDA is removed by layer 6, then in layer 7b there's no set-P/T effect, in 7c no modifications, and the base P/T from the card's printing is used. For a card like Tarmogoyf, the printed "*/1+*" is the CDA. Without the CDA, the game can't compute P/T from the printed text, so it defaults to 0/0. Then Humility's layer 7b "becomes 1/1" applies. Result: 1/1.

- **"All creatures are 1/1" (Humility layer 7b) + Opalescence ("enchantments are creatures with P/T = CMC")**: Humility is an enchantment. If Opalescence makes Humility a creature (layer 4), it then becomes subject to its OWN effect in layer 7b. Does Humility make itself 1/1? — This is a famous dependency question. Neither effect depends on the other in the same layer (one is layer 4, one is layer 7b). They're in different layers and simply apply in order: layer 4 (Opalescence makes Humility a creature with CMC P/T), then layer 7b (Humility makes all creatures 1/1, including itself). Result: all creatures, including Humility, are 1/1.

- **Real dependency example**: "All noncreature artifacts become creatures" + "All creatures get +2/+2". The pump effect depends on the type-change effect (same sublayer? No — type is layer 4, pump is layer 7c). Different layers again. Dependency only matters WITHIN the same layer.

  **True same-layer dependency**: Two effects both in layer 5 (color). Effect A: "Target creature becomes red." Effect B: "All red creatures become blue." Does applying B first change what A does? No — A targets a specific creature regardless. Does applying A first change what B does? Yes — now the targeted creature is red and becomes subject to B. So A depends on B? Let's check: does applying B change what A does or what A applies to? B makes red creatures blue BEFORE A makes the creature red. If B is applied first, the creature won't be red when B applies (it's not red yet), so B doesn't make it blue. Then A makes it red. Result: red. If A is applied first, creature is red, then B makes it blue. Result: blue. Timestamp decides since neither depends on the other by the strict definition (applying B doesn't change what A does — A still applies to the same creature).

## Canonical Example
Conspiracy names "Sliver." Now all your Conspiracied creatures have all Sliver abilities from all Slivers you control. Does "this creature is a Sliver" (type change, layer 4) cause all Sliver abilities to then apply to it (layer 6)? Yes — type change in layer 4 happens before ability-adding in layer 6. No dependency needed; it's just normal layer order working correctly.

## Additional Examples

**Example 2 — Double timestamp fight:**
Two Auras each trying to set a creature's P/T (layer 7b). First Aura: "Enchanted creature is 4/4." Second Aura: "Enchanted creature is 3/3." Whichever was attached most recently has the later timestamp and wins. Result: creature is 3/3.

**Example 3 — Humility + creature with abilities:**
Humility on battlefield. A creature enters with an ETB ability. The ETB ability triggers before Humility's continuous effect removes it? No — continuous effects apply immediately. The creature is on the battlefield with no abilities (Humility layer 6 applies instantly). The ETB trigger was generated as part of the enters-the-battlefield event (603.6a) — even if the creature now has no abilities, the trigger was already put into the system during the ETB event. Result: ETB trigger fires even though Humility already removed the ability. (This is a subtle but important point confirmed by 603.6b.)

**Example 4 — Layers and counters don't interact:**
"This creature is 2/2" (layer 7b) applied to a creature with a +1/+1 counter. The counter applies in 7c, after the set. Result: 3/3. Someone thinks "the counter overwrites the set" — wrong direction. 7b sets to 2/2, 7c counter adds 1/1, result 3/3.

## Commonly Confused With
- **P001 (Threshold Damage Assignment)** — Different context entirely; both involve multiple effects but one is combat, one is continuous.
- **P002 (Replacement vs. Trigger)** — Static ability producing continuous effects is different from a replacement or triggered ability.
