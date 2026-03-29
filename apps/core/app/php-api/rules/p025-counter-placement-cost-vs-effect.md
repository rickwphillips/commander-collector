---
id: p025
name: Counter Placement — Cost vs. Effect
category: costs
cr_refs: [601.2b, 122.1, 614.1, 614.1c, 119.3]
tags: [counters, cost, effect, doubling-season, vorinclex, hardened-scales, planeswalker, loyalty, replacement-effect, doubling]
created: 2026-03-28
examples_count: 2
---

# P025 — Counter Placement — Cost vs. Effect

## Abstract
Counter-modifying replacement effects (Doubling Season, Hardened Scales, Vorinclex) only apply when counters are placed as an *effect* — the result of a spell resolving, an ability resolving, or a permanent entering. They do NOT apply when counters are placed as a *cost* — something paid before the effect happens, such as adding loyalty counters to activate a planeswalker ability. This distinction determines whether a planeswalker entering the battlefield gets doubled loyalty, but activation of its abilities does not get doubled.

## The Definitive Rule

**CR 601.2b**: *"Some spells and abilities have additional or alternative costs. A player announces their choice to pay such a cost as they take the [casting/activating] action... [Costs] are paid as part of... [activation]."*

**CR 122.1**: Counters can be placed on permanents by effects (spells resolving, ability resolving) or as costs (paying by adding/removing counters).

**Doubling Season ruling (2024-11-08)**: *"Planeswalkers will enter with double the normal number of loyalty counters. However, if you activate an ability whose cost has you put loyalty counters on a planeswalker, the number you put on isn't doubled. This is because those counters are put on as a cost, not as an effect."*

**Vorinclex ruling (2021-02-05)**: *"If you control two or more effects that attempt to modify how many counters would be put onto a permanent you control, you choose the order to apply those effects, no matter who controls the sources of those effects."*

## The Pattern

```
COUNTER PLACEMENT TYPE → DOUBLING APPLIES?

"Put X counters on this permanent as a cost to activate"
  → COST → NOT doubled by Doubling Season / Vorinclex / Hardened Scales

"[Effect] puts X counters on this permanent"
  → EFFECT → IS doubled by Doubling Season / Vorinclex / Hardened Scales

"This permanent enters with X counters"
  → ETB replacement effect (614.1c) → EFFECT → IS doubled

EXAMPLES:
  Planeswalker entering the battlefield:
    Loyalty counters placed on entry = effect → Doubling Season applies
    Ajani Goldmane (4 loyalty) enters with 8 loyalty

  Activating planeswalker +1 ability:
    "+1: [effect]" means put 1 loyalty counter as COST, then effect resolves
    Doubling Season does NOT double the cost payment
    Ajani +1 puts exactly 1 loyalty counter

  Walking Ballista enters for X=3:
    "Enters with X +1/+1 counters" = effect → Doubling Season doubles
    Ballista enters with 6 counters instead of 3

  Removing a +1/+1 counter from Walking Ballista to deal 1 damage:
    Removing = cost → Doubling Season doesn't help (removal, not placement)
    But this doesn't involve placement at all — irrelevant

STACKING MULTIPLE REPLACEMENT EFFECTS (player controls all):
  You choose the order they apply
  Optimal order for placement: apply additive effects (Hardened Scales +1) FIRST,
    then multiplicative doublers (Doubling Season ×2, Vorinclex ×2)
  Example: 1 counter → +1 (Hardened Scales) = 2 → ×2 (Doubling Season) = 4 → ×2 (Vorinclex) = 8
```

## Definitive Conclusions

- **Planeswalkers enter with doubled loyalty (Doubling Season).** The entry counters are placed as an effect.
- **Loyalty ability activations are not doubled.** The loyalty adjustment is a cost paid during activation.
- **Two Doubling Seasons = ×4.** Three = ×8. Each applies separately to the doubled result.
- **Vorinclex doubles your counter placements (effects).** Opponent's counter placements are halved. Works on planeswalker ETB loyalty.
- **Hardened Scales adds +1 to +1/+1 counter placements** — not a doubler, an adder. Apply before doublers for maximum output.
- **Player choice of replacement order.** When multiple replacement effects modify the same counter placement event and you control all of them, you choose the order. Pick additive effects first (scale better), then multiplicative.
- **Ozolith's counter duplication on creature death** = effect → doubled. A creature dying with 4 counters → Ozolith receives 8 under Doubling Season.

## Canonical Example
**Doubling Season + Doubling Season + Hardened Scales (1 +1/+1 counter placed):**
1. Apply Hardened Scales first: 1 → 2 (added 1)
2. Apply Doubling Season #1: 2 → 4
3. Apply Doubling Season #2: 4 → 8
Result: 8 counters from a single-counter effect.

If you applied doublers first then Hardened Scales: 1 → 2 → 4 → 5. Only 5. Apply additive last gives fewer when doublers outnumber additives, but apply additive first when it's the only additive and there are multiple doublers.

Wait — recalculate: additive first = 1+1=2, ×2=4, ×2=8. Additive last = 1×2=2, ×2=4, +1=5. So additive FIRST is better (8 > 5) because the +1 gets doubled twice. Always apply Hardened Scales before doublers.

**Example 2 — Nissa, Who Shakes the World + Doubling Season:**
Nissa normally enters with 5 loyalty. Ultimate is -12. Under Doubling Season, enters with 10. You can activate her ultimate immediately if... wait, 10 - 12 = -2 which would make her go to -2 loyalty and then SBA removes her (0 loyalty → graveyard at next SBA check). Can't activate ultimate immediately unless you first build to 12 (need 2 more turns of +1 activation, each placing 1 counter, giving 10 → 11 → 12 → activate). The entry doubling doesn't immediately enable the ultimate unless the doubled value ≥ the ultimate cost.

## Commonly Confused With
- **P008 (Can't vs. May)** — Counter placement cost/effect is distinct from conflicting permissions. P025 is about what triggers/applies to the placement, not about conflicting instructions.
- **P002 (Replacement vs. Trigger)** — Doubling Season is a replacement effect. P025 identifies *when* that replacement applies (effects, not costs). This is a sub-question of P002's framework.
- **P018 (Static Ability Universal Scope)** — Doubling Season and Hardened Scales are static abilities generating continuous replacement effects. Their scope is the battlefield (permanents you control). P018 covers zone scope. P025 covers the cost/effect distinction within that scope.
