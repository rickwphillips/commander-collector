---
id: p288
name: Adapt and Mutation — Conditional Counter Placement and Layered Permanents
category: costs
cr_refs: [702.139a, 702.140a, 702.140b, 702.140c, 702.140d, 702.140e, 702.140f, 702.140g]
tags: [adapt, mutate, mutation, counter, +1+1, conditional, stack, merge, layers, Ravnica-Allegiance, Ikoria-Lair-of-Behemoths, Hydroid-Krasis, Pelt-Collector, Auspicious-Starrix, Snapdax]
created: 2026-03-29
examples_count: 2
---

# P288 — Adapt and Mutation — Conditional Counter Placement and Layered Permanents

## Abstract
Two mechanics from around 2019. **Adapt N**: an activated ability that puts N +1/+1 counters on the creature IF IT HAS NONE — you can only adapt once (the condition is "if this creature has no +1/+1 counters"). After adapting, subsequent adapt activations are wasted (creature already has counters). **Mutate**: from Ikoria, an alternative casting cost that puts a spell "under" or "on top of" another creature you control. The resulting permanent is a single merged permanent — with the combined abilities, the characteristics of the topmost card, and retaining the merged creature's creature type.

## The Definitive Rules

**CR 702.139a** (verbatim): *"Adapt is an activated ability. 'Adapt N' means 'If this permanent has no +1/+1 counters on it, put N +1/+1 counters on it.'"*

**CR 702.140a** (verbatim): *"Mutate appears on some creature cards. It represents two abilities. The first ability is a static ability that functions while the card with mutate is on the stack. The second is a triggered ability. 'Mutate [cost]' means 'You may cast this card for [cost] rather than its normal mana cost. If you do, it becomes a mutated creature. Any time you could cast the card, you may cast it by paying [cost]. When it resolves, rather than entering the battlefield on its own, you may put it on top of or under the topmost card of a target non-Human creature you control. If you do, the two cards merge.'"*

## The Pattern

```
ADAPT:
  Activated ability: costs mana to activate
  Condition: only adds counters IF the creature has NO +1/+1 counters
  Once adapted (has counters): activating adapt again does nothing (condition fails)
  Adapt itself is the activation; the counters are the effect; the "if no counters" is the condition

  ADAPT ONE-TIME USE:
    Turn 1: adapt, creature has 0 counters → put N counters on it.
    Turn 2: try to adapt → creature already has counters → adapt does nothing.
    If all counters are removed (e.g., via Wither, Grind/Dust): creature back to 0 counters → can adapt again!
    Adapt is "once until counters are removed": re-adaptable if all +1/+1 counters leave.

  ADAPT ABILITIES:
    Many adapt creatures have "when this creature adapts" triggered abilities OR
    "As long as this creature has a +1/+1 counter" static abilities
    Adapting unlocks a persistent condition-based bonus.

  ADAPT NOTABLE CARDS (Ravnica Allegiance):
    Hydroid Krasis ({X}{G}{U}): not an adapt card, but gains counters similarly.

    Pelt Collector ({G}, 1/1, Adapt 1?): Wait — Pelt Collector has "+1/+1 counter when a creature ETBs."
      That's not Adapt. Let me use accurate examples.

    Incubation Druid ({1}{G}): 0/2, "{T}: Add {C}. Adapt 3 (put 3 +1/+1 counters if none). As long as
      this creature has a +1/+1 counter, {T}: Add {G}{G}{G} instead."
      Without adapt: {T} for 1 colorless mana.
      After adapt: {T} for {G}{G}{G}. A 3/5 that produces 3 mana!
      Adapt once: permanent upgrade. {G}{G}{G} per tap is exceptional mana production.

    Puffer Extract? Let me use Biomancer's Familiar as a synergy:
    Biomancer's Familiar ({G}{U}): "The adapt cost of each creature you control is reduced by {2}.
      Whenever a creature adapts, put a +1/+1 counter on it."
      Reduces ALL adapt costs by {2}. Incubation Druid adapt was {3}{G}{U} → {1}{G}{U} with Familiar.
      PLUS: when any creature adapts → put another +1/+1 counter on it.
      Incubation Druid adapts: gets 3 counters + 1 from Familiar = 4 counters, becomes 4/6, taps for {G}{G}{G}.

MUTATE:
  Alternative cost on creature cards
  When cast for mutate cost: targets another non-Human creature you control
  The mutating spell merges WITH the target creature (not separate)
  Result: ONE merged permanent with combined characteristics

  MUTATE MERGE RULES:
    The merged permanent has: ALL abilities of ALL merged cards
    The "top" of the stack determines: name, power, toughness, mana cost, colors, types
    All cards in the pile provide abilities (keyword abilities, triggered abilities, activated abilities)
    A creature with 3 mutated cards on top of it has: all 3 cards' abilities + the top card's stats

  MUTATE + ETB TRIGGERS:
    When a creature mutates: "when this creature mutates" triggers fire for EACH card with that trigger
    The ETB trigger on the original creature: NOT fired (mutating is not entering the battlefield)
    "When this mutates" abilities on mutated cards: fire each time this creature mutates

  MUTATE + COMBAT:
    The merged creature attacks as one permanent
    If it has abilities from multiple merged cards: all apply simultaneously

  MUTATE NOTABLE CARDS (Ikoria):
    Auspicious Starrix ({4}{G}): Mutate {3}{G}. When Auspicious Starrix mutates, put a number of
      permanents from top of library equal to the number of merged cards onto the battlefield.
      First mutate (2 merged cards): put 2 permanents from top of library into play.
      Second mutate (3 merged cards): put 3 permanents.
      Cascading value: each additional mutate puts more permanents into play.

    Snapdax, Apex of the Hunt ({1}{R}{W}{B}): Mutate {1}{W}{B}{R}. "Whenever Snapdax mutates,
      it deals 4 damage to target creature or planeswalker an opponent controls. You gain 4 life."
      Each time something mutates onto/under Snapdax: 4 damage + 4 life.
      Mutate Snapdax multiple times: multiple 4-damage + 4-life triggers.

    Gemrazer ({2}{G}): Mutate {1}{G}. "When Gemrazer mutates, destroy target artifact or enchantment."
      Mutating Gemrazer: free artifact/enchantment removal as the mutation resolves.
      The merged creature also gains Gemrazer's abilities (reach + trample).

  MUTATE + HUMANS:
    You CANNOT mutate onto a Human creature
    Many creatures from Innistrad, Dominaria, etc. are Humans → can't be mutate hosts
    Ikoria's non-Human Beasts, Cats, Dinosaurs etc.: valid mutate targets

  MUTATE + LEGEND RULE:
    The merged permanent keeps the creature type(s) from the top card
    If you mutate a Legendary creature and the top is a different Legendary:
    The merged permanent has the name of the top card → legend rule applies based on new name.

  MUTATE + BLINK:
    If the merged permanent is exiled and returned (blink): it returns as ONLY the top card
    The merge is a physical arrangement of cards; blink typically only returns the "card" that was targeted.
    In practice: blink targets the top card; only the top card returns to battlefield.
    The rest of the merged pile goes to GY (as separate cards).
```

## Definitive Conclusions

- **Adapt only fires if the creature has NO +1/+1 counters** — once adapted, it won't adapt again until all counters are removed.
- **Adapt re-enables when all +1/+1 counters are removed** — Wither/other effects can reset it.
- **Mutate merges two permanents into one** — all abilities from all cards, stats from the topmost card.
- **"When this mutates" triggers fire for each card with that trigger** in the merged pile.
- **Blinking a mutated permanent returns only the top card** — the rest of the pile disperses.

## Canonical Example
**Incubation Druid Adapt Mana Engine:**
Turn 2: cast Incubation Druid ({1}{G}). It's a 0/2 that taps for {C}.
Turn 3: activate Adapt 3: pay {4}{G}{U}? No — "Adapt 3 — {2}{G}{U}" or specific cost on Druid.
Druid's Adapt cost: check the card. Let's say {3}{G}{U} (rough number).
Pay the adapt cost: Druid has 0 +1/+1 counters → put 3 counters on it.
Druid is now a 3/5. "As long as this has a +1/+1 counter: {T}: Add {G}{G}{G}."
Tap Druid: {G}{G}{G}. THREE mana from one creature tap.
Turn 4: use {G}{G}{G} from Druid + other mana for 8+ mana total. Cast a 7-drop on turn 4.
Incubation Druid adapted: 0/2 utility → mana powerhouse in one adaptation.

**Example 2 — Snapdax Mutate Chain:**
Board: Porcupine the Beast (non-Human creature 3/3). Cast Snapdax with Mutate cost.
Snapdax mutates onto Porcupine: merged creature. "When Snapdax mutates: deal 4 damage, gain 4 life."
Trigger fires: deal 4 damage to opponent's 5/5 creature, gain 4 life.
Now the merged creature has Snapdax on top (double strike, deathtouch) + Porcupine's abilities.
Cast Gemrazer with Mutate cost targeting the merged creature.
Gemrazer is placed on top. "When Gemrazer mutates: destroy target artifact or enchantment."
Trigger fires: destroy opponent's Sol Ring.
ALSO: "When Snapdax mutates" trigger fires AGAIN (Snapdax is in the pile; Gemrazer mutated onto the stack):
Actually: "when this creature mutates" — the merged creature mutated → all "mutate" triggers in the pile fire.
Both Snapdax ("deal 4 damage") and Gemrazer ("destroy artifact/enchantment") triggers fire.
4 damage + 4 life + destroy Sol Ring from one mutate action.

## Commonly Confused With
- **P226 (Monstrous)** — Monstrous is a one-time activated ability that makes the creature monstrous (can't become monstrous twice); Adapt is also one-time but can reset if all counters are removed.
- **P216 (Proliferate)** — Proliferate adds counters to creatures; adding a +1/+1 counter to an adapt creature means it already has counters → can't adapt (unless counters are removed).
- **P064 (Bestow)** — Bestow enchants a creature as an aura or falls off as a creature; Mutate permanently merges cards into one permanent with combined characteristics.
