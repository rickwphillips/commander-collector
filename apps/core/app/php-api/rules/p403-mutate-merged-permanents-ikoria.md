---
id: p403
name: Mutate — Merging Creatures into a Single Permanent with Combined Abilities
category: zones
cr_refs: [702.140a, 702.140b, 702.140c, 702.140d, 702.140e, 702.140f, 729.2a, 729.2b, 729.2c, 729.3, 729.3a]
tags: [mutate, merged-permanent, topmost-characteristics, all-abilities-combine, leaves-as-multiple, non-human-target, mutating-etb-trigger, Ikoria, Nethroi-Apex-of-Death, Migratory-Greathorn, Gemrazer, Brokkos-Apex-of-Forever, Illuna-Apex-of-Wishes, merged-creature-abilities, separate-cards-on-leaving, mutate-target-illegal, no-ETB-on-merge]
created: 2026-03-29
examples_count: 2
---

# P403 — Mutate — Merging Creatures into a Single Permanent with Combined Abilities

## Abstract
**Mutate** (702.140) lets you cast a creature spell for its mutate cost (an alternative cost) targeting a non-Human creature you own. Instead of entering the battlefield, the mutating spell merges with the target creature: they become one merged permanent. The merged permanent has all the abilities of every card in the pile, but its name, P/T, and other "text box" characteristics come only from the topmost card (the one you choose to place on top or bottom). Critically: the merged permanent is NOT considered to have entered the battlefield (no ETB trigger for the mutate itself), but the "whenever a creature mutates" trigger fires when the merge happens. When the merged permanent leaves the battlefield, each individual card/token goes to its appropriate zone separately.

## The Definitive Rules

**CR 702.140a** (verbatim): *"Mutate appears on some creature cards. It represents a static ability that functions while the spell with mutate is on the stack. 'Mutate [cost]' means 'You may pay [cost] rather than pay this spell's mana cost. If you do, it becomes a mutating creature spell and targets a non-Human creature with the same owner as this spell.' Casting a spell using its mutate ability follows the rules for paying alternative costs (see 601.2b and 601.2f–h)."*

**CR 702.140b** (verbatim): *"As a mutating creature spell begins resolving, if its target is illegal, it ceases to be a mutating creature spell and continues resolving as a creature spell and will be put onto the battlefield under the control of the spell's controller."*

**CR 702.140c** (verbatim): *"As a mutating creature spell resolves, if its target is legal, it doesn't enter the battlefield. Rather, it merges with the target creature and becomes one object represented by more than one card or token (see rule 729, 'Merging with Permanents'). The spell's controller chooses whether the spell is put on top of the creature or on the bottom. The resulting permanent is a mutated permanent."*

**CR 702.140d** (verbatim): *"An ability that triggers whenever a creature mutates triggers when a spell merges with a creature as a result of a resolving mutating creature spell."*

**CR 702.140e** (verbatim): *"A mutated permanent has all abilities of each card and token that represents it. Its other characteristics are derived from the topmost card or token."*

**CR 702.140f** (verbatim): *"Any effect that refers to or modifies the mutating creature spell refers to or modifies the mutated permanent it merges with as it resolves."*

**CR 729.2a** (verbatim): *"A merged permanent has only the characteristics of its topmost component, unless otherwise specified by the effect that caused them to merge. This is a copiable effect whose timestamp is the time the objects merged."*

**CR 729.2b** (verbatim): *"As an object merges with a permanent, that object leaves its previous zone and becomes part of an object on the battlefield, but the resulting permanent isn't considered to have just entered the battlefield."*

**CR 729.2c** (verbatim): *"Because a merged permanent is the same object that it was before, it hasn't just come under a player's control, any continuous effects that affected it continue to do so, and so on."*

**CR 729.3** (verbatim): *"If a merged permanent leaves the battlefield, one permanent leaves the battlefield and each of the individual components are put into the appropriate zone."*

## The Pattern

```
MUTATE CASTING (702.140a):
  WHAT IT IS:
    Alternative cost for some creature spells.
    Pay the mutate cost instead of normal cost.
    The spell becomes a "mutating creature spell" targeting a non-Human creature you OWN.
    Note: "you own" — can only mutate creatures you own. Can't mutate opponent's creatures.
    The target: "non-Human creature." Human creatures can't be mutated (any Human subtype).
    If your creature has a Human subtype (even granted): can't be the target.
  MUTATE RESOLVING (702.140c):
    The mutating spell merges with the target creature. No ETB.
    Controller chooses: spell goes on TOP of the creature, or on the BOTTOM.
    The pile is now one merged permanent.
  TOPMOST DETERMINES MOST CHARACTERISTICS (729.2a, 702.140e):
    From 729.2a: "characteristics of its topmost component."
    From 702.140e: "all abilities of each card and token."
    Combined: the topmost card determines: name, P/T, type line, colors, mana cost, loyalty.
    ALL cards in the pile contribute: abilities (triggered, activated, static, keywords).
    The merged permanent has ALL the abilities of every card in the pile.
  CHOOSING TOP OR BOTTOM:
    Put mutating spell on TOP: the new spell's characteristics become the merged permanent's.
      The new creature's P/T, name, type, color become the combined creature's characteristics.
      But ALL abilities from every card below are also gained.
    Put mutating spell on BOTTOM: the existing creature remains "on top."
      The existing creature's P/T, name, etc. remain.
      The new spell's abilities are added to the pile's collective abilities.
    Strategy: put the card with better characteristics/abilities on top.
  NO ETB TRIGGER ON MERGE (729.2b):
    "The resulting permanent isn't considered to have just entered the battlefield."
    ETB triggers from the merged spell do NOT fire when merging.
    The existing creature's ETBs also don't re-fire.
    The ONLY trigger that fires: "whenever a creature mutates" abilities (702.140d).
  THE MUTATE TRIGGER (702.140d):
    "Whenever a creature mutates" — fires when a spell merges with a creature via mutate.
    This trigger is typically on the mutating creatures themselves.
    Example: Migratory Greathorn ({2}{G}: 3/4, mutate {1}{G}, "when this creature mutates, search
      your library for a basic land, put it onto the battlefield tapped, shuffle"):
      When any creature in the pile mutates: Migratory Greathorn's ability triggers.
      If Migratory Greathorn is in the pile (anywhere), and another mutate happens on this creature:
        Migratory Greathorn's "whenever a creature mutates" triggers again.
    KEY: every card in the pile with "whenever a creature mutates" fires each time you add a new
      mutating spell to the pile. Multiple mutations = multiple trigger fires.
    A pile of 5 mutated creatures: each has 5 "whenever mutates" abilities (all stacked).
      Adding a 6th: 5 separate "whenever mutates" triggers from the existing pile fire.
  MUTATE TARGET BECOMES ILLEGAL (702.140b):
    If the target creature becomes illegal before the mutate spell resolves:
      "It ceases to be a mutating creature spell and continues resolving as a creature spell."
      It enters the battlefield as a normal creature (goes to battlefield, ETB fires).
    This is similar to bestow (P396): target dies → spell continues as a creature.
    Meaningful resilience: even if opponent kills the target, you still get the creature.

MERGED PERMANENT RULES:
  ONE OBJECT — SAME PERMANENCE (729.2c):
    "Because a merged permanent is the same object it was before, it hasn't just come under a
      player's control, any continuous effects that affected it continue to do so."
    Auras on the original: still attached to the merged permanent.
    Equipment: still attached.
    Counters on the original: still there (unless removed by the merge effect).
    The merged permanent doesn't "reset" its state.
  P/T DERIVED FROM TOPMOST:
    If topmost has a CDA (like Tarmogoyf's power = card types in GY):
      The merged permanent uses that CDA for P/T.
    If the topmost has +1/+1 counters: those are on the merged permanent (they were on the
      original creature before merge).
    Counters on the merged permanent apply to the topmost component's base P/T.
  WHEN THE MERGED PERMANENT DIES (729.3):
    "If a merged permanent leaves the battlefield, one permanent leaves the battlefield and each
      of the individual components are put into the appropriate zone."
    Normally (if destroyed): all components go to the GY.
    Player can arrange order in the GY (729.3a).
    If exiled: all components are exiled (they go to exile).
    "One permanent leaves the battlefield" — from a trigger standpoint: one leaves-the-battlefield
      event. Not multiple. The pile is one permanent.
    Dies trigger fires ONCE. Not once per component.
    Important: in Commander, if one component is your commander:
      The commander component can go to the command zone. The other components go to GY/exile as normal.
  ABILITIES FROM BOTTOM CARDS:
    Brokkos, Apex of Forever ({2}{B}{G}{U}: 6/6 trampler, mutate {3}{B}{G}, "you may cast Brokkos
      from your GY using its mutate ability"):
      If Brokkos is on the bottom of a pile: it's still in the pile (not in the GY).
      Brokkos's GY ability can't activate because Brokkos is on the battlefield (in the pile).
      If the pile dies and Brokkos goes to the GY: then you can mutate Brokkos from the GY.
    This creates interesting recursion: build up a pile, it dies, Brokkos goes to GY, mutate again.
  MULTIPLE MUTATES ON THE PILE:
    You can keep adding mutate spells to an existing merged permanent.
    Each addition: puts the new card on top or bottom.
    The pile grows. The topmost determines characteristics.
    ALL "whenever mutates" abilities in the pile fire for EACH new addition.
    A pile of 4 creatures with "whenever mutates, draw a card": adding a 5th = draw 4 cards.
    Building up massive piles with powerful triggers is the core Mutate win condition.
```

## Definitive Conclusions

- **The merged permanent has ALL abilities of every card in the pile** — name, P/T, type, color, mana cost come from the TOPMOST card only; abilities come from every card.
- **No ETB triggers fire when merging** (729.2b) — only "whenever a creature mutates" triggers; the merged permanent is the same object as before (not a new entering).
- **When a merged permanent leaves the battlefield, all components go to appropriate zones simultaneously** — one dies event, not multiple; dies triggers fire once.
- **Mutate target becoming illegal causes the spell to resolve as a normal creature** (702.140b) — similar to bestow; you still get the creature even if the target dies in response.
- **Non-Human restriction is checked when choosing targets** — if the target gains the Human subtype after being targeted but before resolution, the target is now illegal → mutating creature resolves as a normal creature.

## Canonical Example
**Gemrazer + Illuna Pile with Mutate Triggers:**
Gemrazer ({2}{G}: 4/4 reach trample, mutate {1}{G}, "when this creature mutates, destroy target artifact or enchantment"):
Illuna, Apex of Wishes ({3}{R}{G}{U}: 6/6 flying trample, mutate {2}{R}{G}{U}, "when this creature mutates, exile cards from the top of your library until you exile a nonland permanent, put that card onto the battlefield"):

You control: a 2/2 Human... wait, Human can't be mutated. Use a 2/2 non-Human creature.
You control: Llanowar Elves ({G}: 1/1 elf, "{T}: Add {G}").

Turn 3: Cast Gemrazer using its mutate cost ({1}{G}). Target: Llanowar Elves (non-Human elf).
Gemrazer merges with Llanowar Elves. You put Gemrazer on top.
Merged permanent: topmost = Gemrazer (4/4 reach trample).
Abilities: Gemrazer's abilities + Llanowar Elves' "{T}: Add {G}".
"When this creature mutates" trigger fires: destroy target artifact or enchantment.
Destroy opponent's Sol Ring.

The merged permanent is a 4/4 reach trample elf that also taps for {G}.

Turn 5: Cast Illuna using mutate cost ({2}{R}{G}{U}). Target: the Gemrazer/Elf pile.
Illuna merges with the pile. You put Illuna on top.
Stack is now: Illuna (top) / Gemrazer / Llanowar Elves (bottom).
Characteristics: topmost = Illuna (6/6 flying trample).
Abilities: Illuna's abilities + Gemrazer's abilities + Elf's "{T}: Add {G}".
"When this creature mutates" triggers fire:
  - Illuna's trigger: exile cards until you hit a nonland permanent, put it onto the battlefield.
  - Gemrazer's trigger (still in pile): destroy target artifact or enchantment.

You hit two triggers from one mutate. Your 6/6 flyer also taps for {G} and has trample + reach + flying.

Opponent uses Doom Blade. The merged permanent dies.
All 3 components go to GY: Illuna, Gemrazer, Llanowar Elves.
One death event. One dies trigger (not three).
Gemrazer in GY: can be cast normally. Illuna in GY: can be cast normally.
Llanowar Elves in GY: standard (no GY ability).

**Example 2 — Brokkos Recursion:**
Brokkos, Apex of Forever ({2}{B}{G}{U}: 6/6 trample, mutate {3}{B}{G}, "You may cast Brokkos from your GY using its mutate ability"):

First merge: cast Brokkos for mutate cost targeting your Migratory Greathorn. Merge.
"When creature mutates" → Migratory Greathorn's trigger: search library for basic land, put in play tapped.
You put Brokkos on the bottom (to keep Migratory Greathorn's stats visible if it had better P/T for the format).
Or top (to get Brokkos's 6/6 trample). Let's say top → 6/6 trample + land search trigger + all abilities combined.

The pile attacks. Opponent blocks with enough to kill it. Pile dies.
Brokkos goes to GY. Migratory Greathorn goes to GY.

From GY: you may cast Brokkos AGAIN using its mutate ability.
Target: Migratory Greathorn (if you reanimated it). Or any non-Human creature.
Merge again. "When creature mutates" triggers again: search for another land.

Each death of the pile → Brokkos goes to GY → mutate again next turn → another land search.
Brokkos is self-recurring: it always goes to the GY with its mutate ability available.

## Commonly Confused With
- **P389 (Meld/Prototype)** — Meld also combines two cards into one permanent. Key difference: meld combines two specific paired cards into a single pre-defined combined permanent; mutate stacks any number of mutate-compatible creatures, with the topmost determining characteristics. Meld can't transform/convert; mutate creates a pile with evolving characteristics based on stacking order.
- **P011 (ETB Triggers)** — Mutate specifically does NOT trigger ETBs on the merged permanent; the "whenever a creature mutates" ability is a separate trigger. Understanding which triggers fire (mutate triggers vs. ETBs) is critical.
- **P396 (Bestow)** — Both bestow and mutate involve a spell that can go to a creature (bestow as Aura; mutate as merge). Both have rules for what happens when the target is illegal at resolution (both continue resolving as creatures). Key difference: bestow attaches as an Aura; mutate fully merges into one permanent with combined abilities.
- **P004 (Layer System)** — The merged permanent's characteristics follow the layer system with the topmost card's copiable values as the base (layer 1). Other continuous effects apply in their appropriate layers after.
