---
id: p537
name: TDM × DSK × FIN × DFT Cross-Set Interactions
category: [stack, zones, continuous, triggered, costs]
cr_refs: [601.2f, 603.2, 603.4, 603.6a, 613.1, 613.4c, 708.3]
tags: [duskmourn, final-fantasy, aetherdrift, eerie, survival, tiered, job-select, cost-reduction, delirium, manifest-dread, triggered-abilities]
created: 2026-03-30
examples_count: 7
---

# P537 — TDM × DSK × FIN × DFT Cross-Set Interactions

## Abstract

Non-obvious interactions between TDM mechanics (Survival, Eerie, Room unlock), FIN mechanics (Tiered, Job Select, Affinity), and DSK mechanics (Delirium, Manifest Dread, Eerie/Survival overlaps) reveal complex trigger chains, continuous effect applications, and intervening if clause nuances. These interactions span cost-reduction mechanisms, token generation from Eerie triggers, counter doubling via Delirium, and zone-change mechanics.

---

## The Definitive Rule

### Triggered Ability Resolution × Continuous Effects (Layer System)

**CR 603.2** — Triggered abilities trigger automatically when game state or event matches.
**CR 613.1** — Continuous effects apply in layer order; characteristic-defining abilities apply first within each layer.
**CR 613.5** — The layer system is applied continuously and automatically; all changes are instantaneous.

### Cost-Reduction as Continuous Effect

**CR 601.2f** — Costs are determined by starting with the mana cost, then applying cost-reduction effects (layer 6).
**CR 613.1** — Cost-reduction effects that depend on game state (graveyard size, creature count, etc.) are continuous effects applied in layer order.

### Delirium × Intervening If Clause

**CR 603.4** — Intervening if clauses on triggered abilities are checked at trigger time AND at resolution time. If the condition is not true at resolution, the ability does nothing.

### Manifest Dread × Layer Application

**CR 708.3** — A face-down permanent has characteristics defined by rule 708.2. It is a 2/2 creature.
**CR 613.4a** — Characteristic-defining abilities that set P/T apply in layer 7a.
**CR 613.4c** — Effects and counters that modify P/T (without setting to specific number) apply in layer 7c.

---

## The Pattern

### Interaction Class 1: Token Generation × Counter Doubling

```
Eerie Trigger (enchantment enters)
  → Create token (triggered ability produces effect)
  → Token enters battlefield (separate ETB event, 603.6a)
  → Delirium ability triggers on new ETB
  → Counter placement in layer 7c
  → Condition check (4+ card types, 6+ card types)
  → Doubling of counters in layer 7c (if condition met)
```

**Non-obvious:** Each token entering triggers separate ETB abilities. The doubling of counters is a separate layer 7c effect applied after initial counter placement.

### Interaction Class 2: Cost-Reduction Continuous Effect × Graveyard State

```
Permanent in graveyard (game state)
  → Cost-reduction effect continuous (layer 6)
  → Spell casting begins (601.2f)
  → Cost is calculated with reduction applied
  → Spell resolves, graveyard state changes
  → Cost-reduction recalculated continuously for next spell
```

**Non-obvious:** Cost-reduction is a continuous effect (not static ability). It is recalculated continuously (613.5) before priority is given.

### Interaction Class 3: Zone-Change × Delirium Activation vs. Triggered

```
Delirium activation (cost requires 4+ types)
  → Ability activation resolves
  → Creature enters from graveyard
  → Delirium triggered ability triggers (separate check)
  → Intervening if checks condition at resolution
  → If condition no longer met: ability removed from stack
```

**Non-obvious:** Activation cost and triggered ability both check Delirium, but at different times (activation at cost time, trigger at both trigger and resolution time per 603.4).

---

## Definitive Conclusions

1. **Gremlin Tamer + Omnivorous Flytrap**: Eerie creates token → token enters → Flytrap triggers separately → counters placed in 7c → doubled if 6+ types. With Doubling Season, each token is doubled in creation (layer 1/6), then each triggers Flytrap separately.

2. **Defiant Survivor + Omnivorous Flytrap**: Survival manifests dread → manifest is 2/2 face-down creature (708.3) → enters battlefield → Flytrap triggers → counters in 7c (applied after layer 7a CDA). If manifest has 0 toughness after face-down characteristics, counters prevent SBA 704.5f from applying (layer 7c after layer 7a).

3. **Diamond Weapon + Defiant Survivor**: DW cost-reduction is continuous effect (layer 6, CR 613.1). Survivor mills permanents via Survival ability. If 7 permanents in graveyard, DW costs {7} generic less to cast (from {9} total).

4. **Balustrade Wurm + Omnivorous Flytrap**: Wurm activation requires 4+ types (cost check). When Wurm enters, Flytrap triggers (separate intervening if check at trigger time AND resolution time, 603.4). If card leaves graveyard between activation and resolution, Flytrap's intervening if may fail, but Wurm was already activated successfully.

5. **Fire Magic + Balemurk Leech**: Fire Magic Tiered damage does NOT trigger Eerie. Indirect interaction: if damage kills creatures blocking a Room, board state changes, potentially affecting Room unlock conditions (but no triggered event).

6. **Ice Magic + Cult Healer**: Ice Magic Tiered zone-change modes do NOT trigger Eerie. Indirect interaction: if creature leaving battlefield was part of Room unlock condition, the Room state changes. Eerie on "fully unlock" may fire if Room becomes fully unlocked by other means.

7. **Bartz and Boko + Fire Magic**: Both interact with cost system. Affinity reduces Bartz cost; Fire Magic is Tiered with cost escalation choices. If Bartz ETB kills creatures, board state affects Fire Magic's targeting, but not cost interaction.

---

## Canonical Example

**P537-EX1: Gremlin Tamer + Omnivorous Flytrap + 4+ card types in graveyard**

1. You control Gremlin Tamer, Omnivorous Flytrap, and 4+ card types in graveyard.
2. You cast an enchantment (e.g., Aura).
3. Enchantment enters battlefield.
4. Eerie trigger on Gremlin Tamer puts "create a 1/1 red Gremlin creature token" on the stack (603.2).
5. Gremlin token is created (not on stack, effect of trigger).
6. Gremlin token enters battlefield (separate event, 603.6a).
7. Omnivorous Flytrap's Delirium ability triggers on Gremlin entering (603.2).
8. Both triggers resolve in APNAP order.
9. Omnivorous Flytrap: distribute 2 +1/+1 counters (layer 7c). Condition (4+ types) is true at resolution, so ability resolves.
10. If 6+ card types in graveyard, double the counters in layer 7c (second application of layer 7c).
11. Result: Gremlin token has 2 counters (or 4 if 6+ types).

---

## Additional Examples

### Example: Diamond Weapon × Defiant Survivor (Graveyard Cost-Reduction)

**Setup:**
- Graveyard: 5 permanent cards (Artifact, Creature, Enchantment, Land, Sorcery)
- Diamond Weapon in hand
- Defiant Survivor on battlefield, tapped

**Sequence:**
1. You activate Defiant Survivor's Survival ability during second main phase (603.1, activated ability).
2. Survivor manifests dread: top 2 cards of library → 1 face-down 2/2 creature, 1 to graveyard.
3. Manifest enters battlefield (2/2 face-down, 708.3).
4. Assume the milled card is another permanent type (6 types now in graveyard).
5. You cast Diamond Weapon from hand.
6. Cost calculation (601.2f): {7}{G}{G} minus {1} per permanent in graveyard (layer 6).
7. Cost = {7}{G}{G} - {6} = {1}{G}{G} (6 permanents in graveyard).
8. Spell resolves.

**Why non-obvious:** Cost-reduction is a continuous effect, not a static ability. It is recalculated continuously (613.5) before each priority assignment. The Survivor's Survival activation mills cards as part of its resolution (not a separate triggered event), filling the graveyard in real-time.

---

### Example: Balustrade Wurm × Omnivorous Flytrap (Intervening If Timing)

**Setup:**
- Graveyard: 4 card types exactly (Artifact, Creature, Enchantment, Land)
- Balustrade Wurm in graveyard
- Omnivorous Flytrap on battlefield
- Target creature on battlefield

**Sequence:**
1. You activate Balustrade Wurm's Delirium ability: {2}{G}{G}, return from graveyard (602.2, activated ability).
2. Cost is paid. Condition (4+ types) is checked (activated cost requirement).
3. Ability resolves: Wurm returns to battlefield with finality counter.
4. Wurm enters. Omnivorous Flytrap's Delirium ability triggers (603.2).
5. Before Flytrap resolves, you cast a spell with a 5th card type, exiling a card (now 5 types in graveyard, reaching 6).
6. Flytrap resolves: distribute 2 +1/+1 counters on target (condition still true, 6+ types).
7. Double the counters (condition true, 6+ types).
8. Result: Target has 4 +1/+1 counters.

**Alternative:** If a card leaves the graveyard (e.g., another card was cast), and graveyard drops to 3 types before Flytrap resolves, the Flytrap's intervening if clause fails at resolution (603.4). The ability would be removed from stack and do nothing. However, Balustrade Wurm was already successfully activated and entered the battlefield.

**Why non-obvious:** Activation cost and triggered ability both check Delirium, but at different times. The intervening if clause on the triggered ability is a separate check from the activation cost check.

---

### Example: Fire Magic (Tiered) × Balemurk Leech (Eerie)

**Setup:**
- You control Balemurk Leech
- You have Enchantments you control and Rooms on battlefield
- Opponent has creatures and players

**Sequence:**
1. You cast Fire Magic, choosing Firaga tier ({1}{R} + {5} = {6}{R} total).
2. Fire Magic deals 3 damage to each creature.
3. Some creatures die (lethal damage, 704.5g).
4. Creatures that are "unlocking" a Room may no longer be on battlefield.
5. Balemurk Leech's Eerie ability does NOT trigger (Fire Magic is not an enchantment entering, nor is it a Room unlock event).
6. However, if the creatures killed were required for a Room to be "fully unlocked," the state changes (110.1 — zone changes).
7. The state-based action check (117.5) may process Room unlock conditions.
8. If a Room becomes "fully unlocked" as a result, Balemurk Leech's Eerie trigger on "fully unlock a Room" fires.

**Why non-obvious:** The interaction is indirect. Fire Magic's damage does not directly trigger Eerie. The board state change (creatures dying) may alter Room unlock conditions, which then triggers Eerie on "fully unlock."

---

## Commonly Confused With

- **P001** (Damage assignment) — No direct application here; damage is dealt all at once by Fire Magic.
- **P002** (Replacement vs. Reaction) — Eerie is a triggered ability, not replacement. It reacts to enchantments entering, not replacing them.
- **P004** (Continuous effects order) — Layer 7c (counters) applies after layer 7a (CDAs that set P/T). Counters on 0-toughness creatures may save them from SBA.
- **P006** (Condition checked twice) — Delirium intervening if checks at trigger time AND resolution time (603.4). Activation cost checks at cost time only.

---

## Non-Application Notes

- **Tiered spells do NOT stack with Eerie directly:** Fire Magic and Ice Magic are not enchantments entering; they do not trigger Eerie. The interaction is board-state-based, not rules-based.
- **Affinity × Tiered is a parallel cost system, not a nested interaction:** Both modify casting cost (layer 6), but Affinity reduces while Tiered increases as a choice. They are independent cost-modification mechanisms.
- **Room unlock is not a triggered event:** Unlocking a Room is a game state change, not a triggered event. Eerie triggering on "fully unlock" is triggered by the unlock event itself, not by any spell or ability resolution.

---

## Rules Clarifications

### CR 601.2f — Casting Spell With Cost-Reduction

*"[Cost] = [mana cost] - [cost reduction] (minimum 0)"*

Cost-reduction effects are applied as continuous effects (layer 6) while the spell is being cast. The reduction is calculated before mana payment.

### CR 603.4 — Intervening If Clause

*"When/Whenever [trigger], if [condition], [effect]."*

The condition is checked:
1. At trigger time (when the event occurs)
2. At resolution time (when the ability resolves)

If the condition is not true at resolution, the ability is removed from the stack and does nothing.

### CR 708.3 — Face-Down Permanents

*"A face-down permanent has the characteristics of a 2/2 creature."*

Face-down permanents are creatures with 2 power and 2 toughness. All other characteristics are determined by rules text of abilities that define them.

---

## Summary Table

| Interaction | Cards | Type | Mechanic Classes | Non-Obvious Element |
|-------------|-------|------|------------------|-------------------|
| Token × Doubling | Gremlin Tamer + Omnivorous Flytrap | ETB × Delirium | Triggered, Counters, Layer 7c | Separate ETB per token; doubling as separate layer effect |
| Survival × Counter | Defiant Survivor + Omnivorous Flytrap | TDM × Delirium | Manifest Dread, CDAs, Layer 7a/7c | 0-toughness manifest survives with counters (layer order) |
| Cost-Reduction × TDM | Diamond Weapon + Defiant Survivor | Continuous Effect × Survival | Cost (Layer 6), Graveyard State | Continuous recalculation (613.5) during resolution chain |
| Activation × Trigger | Balustrade Wurm + Omnivorous Flytrap | Zone-Change × Delirium | Intervening If, Activation Cost | Two separate condition checks at different times |
| Tiered × Eerie (Indirect) | Fire Magic + Balemurk Leech | Modal Cost × Room Unlock | Board State, Triggered Event | Damage doesn't trigger Eerie; board state affects unlock conditions |
| Zone-Change × Eerie (Indirect) | Ice Magic + Cult Healer | Tiered Zone-Change × Room Unlock | Last Known Info, Eerie Trigger | Creature leaving may affect unlock state; Eerie triggers on state change |
| Affinity × Tiered | Bartz and Boko + Fire Magic | Cost-Reduction × Modal Cost | Cost System, ETB × Targeting | Parallel cost mechanics; ETB board state affects targeting |
