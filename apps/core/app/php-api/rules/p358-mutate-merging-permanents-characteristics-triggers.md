---
id: p358
name: Mutate — Merging Permanents, Characteristics, Abilities, and Trigger Stacking
category: zones
cr_refs: [702.140a, 702.140b, 702.140c, 702.140d, 702.140e, 729.1, 729.2, 729.2a, 729.2b, 729.2c, 729.3, 729.3a, 729.3c]
tags: [mutate, merge, merged-permanent, topmost-component, non-human, Gemrazer, Illuna, Otrimi, Vadrok, creature-dies-merged, mutate-trigger, ETB-merged, zone-change-merged, Snapdax, non-human-requirement, characteristics-topmost]
created: 2026-03-29
examples_count: 2
---

# P358 — Mutate — Merging Permanents, Characteristics, Abilities, and Trigger Stacking

## Abstract
**Mutate** (702.140) is an alternative casting cost that merges the mutating spell with a non-Human creature you control already on the battlefield, creating a single **merged permanent** (rule 729). The merged permanent's **characteristics** (power, toughness, name, types, text) come from the **topmost component** (729.2a); all components contribute their **abilities** (702.140e). Mutating doesn't cause ETB or LTB triggers for either the new component or the existing creature (729.2b). Each time a creature **mutates**, a special "whenever a creature mutates" trigger fires for each component that has such a trigger (702.140d). When a merged permanent **dies or leaves the battlefield**, all components go to the graveyard simultaneously — each "dies" trigger fires once (one permanent dying), and each individual component goes to its appropriate zone.

## The Definitive Rules

**CR 702.140a** (verbatim): *"Mutate appears on some creature cards. It represents a static ability that functions while the spell with mutate is on the stack. 'Mutate [cost]' means 'You may pay [cost] rather than pay this spell's mana cost. If you do, it becomes a mutating creature spell and targets a non-Human creature with the same owner as this spell.'"*

**CR 702.140c** (verbatim): *"As a mutating creature spell resolves, if its target is legal, it doesn't enter the battlefield. Rather, it merges with the target creature and becomes one object represented by more than one card or token. The spell's controller chooses whether the spell is put on top of the creature or on the bottom. The resulting permanent is a mutated permanent."*

**CR 702.140e** (verbatim): *"A mutated permanent has all abilities of each card and token that represents it. Its other characteristics are derived from the topmost card or token."*

**CR 729.2a** (verbatim): *"A merged permanent has only the characteristics of its topmost component, unless otherwise specified by the effect that caused them to merge. This is a copiable effect whose timestamp is the time the objects merged."*

**CR 729.2b** (verbatim): *"As an object merges with a permanent, that object leaves its previous zone and becomes part of an object on the battlefield, but the resulting permanent isn't considered to have just entered the battlefield."*

**CR 729.2c** (verbatim): *"Because a merged permanent is the same object that it was before, it hasn't just come under a player's control, any continuous effects that affected it continue to do so, and so on."*

**CR 729.3** (verbatim): *"If a merged permanent leaves the battlefield, one permanent leaves the battlefield and each of the individual components are put into the appropriate zone."*

## The Pattern

```
MUTATING A CREATURE (702.140a–c):
  REQUIREMENTS:
    1. Pay the mutate cost (alternative cost — different from printed mana cost).
    2. Target: a non-Human creature you OWN (not control — same owner).
       Wait: 702.140a says "same owner." But targeting usually goes to controller.
       Let me check: "targets a non-Human creature with the same owner as this spell."
       Hmm: typically "target creature you control" in practice. The "owner" phrasing is unusual.
       The intent is that you can only mutate your own creatures.
    3. The target must be a non-Human creature.
       Human subtype: can't be targeted by mutate. Even token Humans.
       Why: Humans resist Ikoria's Kaiju-like mutations.
  WHAT HAPPENS:
    The mutating spell doesn't enter the battlefield.
    It MERGES with the target creature (729.2).
    You choose: put the new card ON TOP or ON BOTTOM of the stack.
    Resulting merged permanent:
      - Characteristics (name, P/T, types, etc.) = TOPMOST component (729.2a).
      - Abilities = ALL components combined (702.140e).
    Does NOT trigger ETB or LTB abilities (729.2b):
      "The resulting permanent isn't considered to have just entered the battlefield."
      No ETB trigger from the merge itself.
    EXISTING continuous effects on the target creature CONTINUE (729.2c):
      If the creature had +2/+2 from a pump spell: still applies.
      Enchantments/Equipment still attached.
      The object is the "same object" — just with a new component.

CHARACTERISTICS OF MERGED PERMANENTS (729.2a, 702.140e):
  TOPMOST CARD DETERMINES:
    Name, card type, subtype, supertype, color, mana cost, power, toughness.
    Only the TOP card's printed characteristics count.
  ALL CARDS CONTRIBUTE ABILITIES:
    Every ability from every card in the pile: active on the merged permanent.
    Example: 5 mutated cards, each with a different keyword ability.
      Permanent has ALL 5 keyword abilities.
    Triggered abilities: all trigger from any component.
  EXAMPLE:
    Gemrazer ({1}{G}{G}): 4/4 creature. Mutate {1}{G}. "Reach, trample. Whenever this creature mutates, destroy target artifact or enchantment."
    Your target: Pouncing Shoreshark ({3}{U}): 3/3 "Whenever this creature mutates, you may return target nonland permanent to its owner's hand."
    Mutate Gemrazer on top of Shoreshark:
      Topmost = Gemrazer. Name: Gemrazer. P/T: 4/4. Types: Creature — Beast. Colors: green.
      Abilities: Gemrazer's abilities + Shoreshark's abilities:
        Gemrazer: reach, trample, "whenever mutates → destroy artifact/enchantment."
        Shoreshark: "whenever mutates → return nonland permanent to hand."
      Merged permanent: 4/4 Gemrazer with reach, trample, and BOTH mutate triggers.
    Mutate Gemrazer on BOTTOM of Shoreshark:
      Topmost = Shoreshark. Name: Pouncing Shoreshark. P/T: 3/3. Types: Creature — Shark. Colors: blue.
      Abilities: same combination (still all abilities from both).

WHENEVER A CREATURE MUTATES TRIGGER (702.140d):
  "Whenever a creature mutates" triggers fire when a mutation occurs.
  Each component with this ability triggers SEPARATELY.
  If you have a merged permanent with 3 mutate triggers and you mutate again:
    All 3 triggers fire (plus the new card's mutate trigger if it has one).
  This stacks with each successive mutation.
  Example: Stack 4 cards, each with "whenever mutates → scry 2."
    Each mutation now fires 4 triggers → scry 8 total.

IF THE TARGET IS ILLEGAL WHEN THE SPELL RESOLVES (702.140b):
  "If its target is illegal, it ceases to be a mutating creature spell and continues resolving
    as a creature spell and will be put onto the battlefield."
  If the target creature was killed in response: mutating spell just resolves as a normal spell.
  It ENTERS THE BATTLEFIELD as a regular creature (with its printed characteristics).
  This IS an ETB event (normal entry). ETB triggers fire.

ZONE CHANGES — MERGED PERMANENT LEAVING BATTLEFIELD (729.3):
  When the merged permanent dies/is exiled/is bounced:
    ONE permanent leaves. Each component goes to the appropriate zone.
    Cards: go to owner's GY (or exile, or hand, per the zone change effect).
    Tokens: cease to exist (they can't exist outside the battlefield).
    Note: it's ONE permanent leaving → one "dies" trigger fires per "whenever a creature dies" effect.
    But each component individually moves to the appropriate zone.
  OWNER ARRANGES GY ORDER (729.3a):
    If put into GY: the owner can arrange the order.
  EXAMPLE:
    You have a merged permanent: Gemrazer (bottom) + Shoreshark (top).
    Opponent casts Wrath of God. All creatures destroyed.
    ONE permanent (the merged creature) leaves battlefield.
    Blood Artist trigger: fires ONCE (one creature died).
    Both Gemrazer and Shoreshark go to your GY separately (as individual cards).
    You can reuse them from the GY (flashback/escape/etc. if they have those abilities).
  BOUNCE (RETURN TO HAND):
    "Return target creature to its owner's hand."
    The merged permanent is the "creature." All components go to the owner's hand.
    They arrive as a pile of cards in hand (unmerged).

NON-HUMAN REQUIREMENT:
  Humans can't be mutated:
    Humans have the "Human" creature subtype.
    Even if a Human gains other subtypes: if it's still a Human, can't be mutate target.
    If a Human LOSES the Human subtype (loses all subtypes?): might become a valid target.
    Tokens with Human type: not valid targets.
  Why this matters in practice:
    Many popular creatures in Human-based decks: Thalia, Champion of the Parish, Thalia's Lieutenant.
    None of these can be mutate targets.
    You need non-Human creatures to build around mutate.
```

## Definitive Conclusions

- **Merged permanent's characteristics come from the topmost card** — name, P/T, types, colors all come from top; abilities come from ALL components.
- **Mutating doesn't trigger ETB or LTB** — the merged object is the "same object" as before, just augmented; no new ETB event occurs.
- **Mutate triggers stack with each additional mutation** — 3 "whenever mutates" triggers from different components all fire on the 4th mutation.
- **Only non-Human creatures can be targeted by mutate** — Humans in the Human subtype are immune to mutation.
- **When a merged permanent dies, it counts as ONE creature dying** — but all component cards go to their individual GY slots; tokens cease to exist.
- **If the mutate target is killed in response, the spell resolves as a normal creature** — it enters the battlefield normally, triggering ETB abilities.
- **Bouncing a merged permanent sends all components back to hand** — they arrive as individual unmerged cards in hand.

## Canonical Example
**Illuna, Apex of Wishes — Mutate for Free Cascade:**
Illuna, Apex of Wishes ({3}{R}{G}{U}): 6/6. Mutate {2}{R/G}{U}.
"Whenever this creature mutates, exile cards from the top of your library until you exile a nonland permanent card. Put that card onto the battlefield and the rest on the bottom of your library in a random order."

You control Gemrazer ({1}{G}{G}): 4/4.
You cast Illuna using its mutate cost: {2}{R/G}{U} targeting Gemrazer.
Illuna merges with Gemrazer. You choose: Illuna on TOP.

Result:
  Name: Illuna, Apex of Wishes.
  P/T: 6/6.
  Types: Creature — Elemental Dinosaur Beast (Illuna is Elemental Dinosaur; Gemrazer is Beast).
    Wait: topmost determines types. Illuna's types: Creature — Elemental Dinosaur.
    ALL component types? Actually: 702.140e says "A mutated permanent has all abilities of each
      card and token that represents it. Its OTHER CHARACTERISTICS are derived from the topmost card."
    "Other characteristics" = P/T, name, mana cost, card type, subtypes, color.
    So subtypes come ONLY from the topmost card (Illuna). Gemrazer's Beast subtype: NOT included.
    Result: 6/6 Illuna, Apex of Wishes — Creature — Elemental Dinosaur (Illuna's types).
    Abilities: Illuna's abilities + Gemrazer's abilities:
      Illuna: "whenever mutates → exile until nonland permanent."
      Gemrazer: reach, trample, "whenever mutates → destroy artifact/enchantment."
      Combined: 6/6 with reach, trample, and BOTH mutate triggers.

Next mutation: Mutate Vadrok, Apex of Thunder on top of Illuna+Gemrazer stack.
Vadrok on top: characteristics → Vadrok's (3/3 with flying, first strike, "whenever mutates → cast noncreature from GY").
Abilities: Vadrok + Illuna + Gemrazer = reach, trample, flying, first strike, and ALL THREE mutate triggers.
WHEN YOU MUTATE VADROK: all three triggers fire simultaneously:
  Vadrok trigger: cast a noncreature card from GY.
  Illuna trigger: exile until nonland permanent.
  Gemrazer trigger: destroy target artifact or enchantment.
Three value effects from one mutate action.

**Example 2 — Merged Permanent Dies: What Goes Where:**
You control a merged permanent:
  TOP: Otrimi, the Ever-Playful ({3}{B}{G}): 6/5. "Whenever this creature mutates, put target creature card with mutate from your graveyard into your hand."
  MIDDLE: Snapdax, Apex of the Hunt: 5/4.
  BOTTOM: a 3/3 token with trample.

Opponent casts Wrath of God. All creatures destroyed.
ONE permanent leaves: the merged creature. ONE Blood Artist trigger (you control Blood Artist).
All components go to their appropriate zones:
  Otrimi card → your GY.
  Snapdax card → your GY.
  3/3 token → CEASES TO EXIST (tokens can't exist outside the battlefield, SBA 704.5d).
Two cards in your GY (Otrimi and Snapdax). Token is gone.

Next turn: you can cast Otrimi normally (it's in your GY... wait, Otrimi has no flashback).
Actually: just cast it from your hand if you have another copy, or you can cast Snapdax.
The two mutate components are back as individual cards.

To rebuild the mutate stack: cast one creature, then mutate others onto it again.
Note: the "whenever mutates" triggers only fire during MUTATIONS. Rebuilding from scratch doesn't trigger them.

## Commonly Confused With
- **P355 (Copy Effects)** — The topmost component's characteristics are treated as a copiable effect (729.2a: "a copiable effect whose timestamp is the time the objects merged"). If you copy a merged permanent, you get the copiable values = the topmost component's characteristics PLUS the copiable copy effect. P355 covers copy effects in general; P358 covers how merged permanents interact with copy effects.
- **P011 (ETB Triggers)** — Mutating does NOT trigger ETB abilities (729.2b). If the mutate target becomes illegal and the spell resolves normally as a creature, THEN ETBs fire. This is a key distinction: planned merges don't trigger ETBs; accidental normal entry does.
- **P003 (Zone Changes — New Object)** — Merging doesn't change the object's identity (729.2c: "same object"). Continuous effects persist. Compare to blinking (which does create a new object on return). Mutating is intentionally "same object" to preserve enchantments, counters, continuous effects.
- **P339 (Dies Triggers)** — When a merged permanent dies, it counts as ONE creature dying (one "whenever a creature dies" trigger per Blood Artist etc.). All component cards go to GY, but they're not "multiple creatures dying" — it's one merged permanent.
