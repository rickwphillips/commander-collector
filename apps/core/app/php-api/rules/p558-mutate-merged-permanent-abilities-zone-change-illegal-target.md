---
id: p558
name: Mutate — Merged Permanent, All Abilities, Zone Change, and Illegal Target
category: zones
cr_refs: [702.140, 702.140a, 702.140b, 702.140c, 702.140d, 702.140e, 702.140f, 729.1, 729.2, 729.2a, 729.2b, 729.2c, 729.3, 729.3c, 729.3d, 608.3d]
tags: [mutate, merged-permanent, abilities, zone-change, illegal-target, topmost-card, all-abilities, ikoria, commander, etb, non-human, merge]
created: 2026-03-31
examples_count: 3
---

# P558 — Mutate — Merged Permanent, All Abilities, Zone Change, and Illegal Target

## Abstract

**Mutate allows a creature spell to merge with a non-Human creature you own, forming one permanent with the top card's characteristics plus ALL abilities from every card in the stack.** The mutating spell does not enter the battlefield — it merges with the existing permanent, which is NOT considered to have entered the battlefield. The merged permanent retains all continuous effects, counters, Auras, and Equipment from before. If the mutating spell's target becomes illegal, the spell resolves as a normal creature spell and enters the battlefield separately. When a merged permanent leaves the battlefield, ONE permanent leaves but ALL component cards/tokens go to the destination zone. "Whenever this creature mutates" triggers fire only when a mutating spell resolves and merges. Mutate targets non-Human creatures you OWN (not just control), and is an alternative cost (not an additional cost).

## The Definitive Rules

**CR 702.140a (Mutate):** *"Mutate appears on some creature cards. It represents a static ability that functions while the spell with mutate is on the stack. 'Mutate [cost]' means 'You may pay [cost] rather than pay this spell's mana cost. If you do, it becomes a mutating creature spell and targets a non-Human creature with the same owner as this spell.'"*

**CR 702.140b (Illegal Target):** *"As a mutating creature spell begins resolving, if its target is illegal, it ceases to be a mutating creature spell and continues resolving as a creature spell and will be put onto the battlefield under the control of the spell's controller."*

**CR 702.140c (Legal Target — Merge):** *"As a mutating creature spell resolves, if its target is legal, it doesn't enter the battlefield. Rather, it merges with the target creature and becomes one object represented by more than one card or token. The spell's controller chooses whether the spell is put on top of the creature or on the bottom. The resulting permanent is a mutated permanent."*

**CR 702.140d (Mutate Trigger):** *"An ability that triggers whenever a creature mutates triggers when a spell merges with a creature as a result of a resolving mutating creature spell."*

**CR 702.140e (All Abilities):** *"A mutated permanent has all abilities of each card and token that represents it. Its other characteristics are derived from the topmost card or token."*

**CR 729.2a (Topmost Characteristics):** *"A merged permanent has only the characteristics of its topmost component, unless otherwise specified by the effect that caused them to merge. This is a copiable effect whose timestamp is the time the objects merged."*

**CR 729.2b (Not a New ETB):** *"As an object merges with a permanent, that object leaves its previous zone and becomes part of an object on the battlefield, but the resulting permanent isn't considered to have just entered the battlefield."*

**CR 729.2c (Same Object):** *"Because a merged permanent is the same object that it was before, it hasn't just come under a player's control, any continuous effects that affected it continue to do so, and so on."*

**CR 729.3 (Leaves Battlefield):** *"If a merged permanent leaves the battlefield, one permanent leaves the battlefield and each of the individual components are put into the appropriate zone."*

**CR 729.3c (Effect Tracking):** *"If an effect can find the new object that a merged permanent becomes as it leaves the battlefield, it finds all of those objects. If that effect causes actions to be taken upon those objects, the same actions are taken upon each of them."*

## The Pattern

```
CASTING WITH MUTATE:

  Mutate is an ALTERNATIVE COST (CR 601.2b):
    - Pay [mutate cost] instead of mana cost
    - Spell becomes a "mutating creature spell"
    - Targets a non-Human creature with the SAME OWNER as the spell
    - "Same owner" means the creature must be owned by you
    - You do NOT need to control the creature (only own it)
    - Still goes on the stack; can be countered, responded to

  Restrictions:
    - Target must be non-Human (Human creatures can't be mutated onto)
    - Target must be a creature (not a non-creature permanent)
    - Target must have the same owner as the spell
    - Mutate is an alternative cost — can't combine with other alternative costs

RESOLUTION — TARGET LEGAL (MERGE):

  When the mutating spell resolves with a legal target:
    1. The spell DOES NOT enter the battlefield
    2. It merges with the target creature
    3. Controller chooses: spell on TOP or BOTTOM of the creature
    4. Result: one merged permanent

  The merged permanent:
    - Has characteristics of the TOPMOST card/token (name, type, P/T, mana cost, color)
    - Has ALL ABILITIES of every card/token in the stack
    - Is the SAME OBJECT as before (not a new permanent)
    - Retains: counters, Auras, Equipment, continuous effects
    - Does NOT trigger ETB abilities (it didn't enter)
    - DOES trigger "whenever this creature mutates" abilities

  Choosing top vs bottom:
    - Top: new card's characteristics (name, P/T, type) + all abilities from below
    - Bottom: old card's characteristics kept + new card's abilities added

RESOLUTION — TARGET ILLEGAL (FALLBACK):

  If the target is illegal when the spell begins resolving:
    - Spell ceases to be a mutating creature spell
    - Resolves as a NORMAL creature spell
    - Enters the battlefield under the spell's controller's control
    - ETB triggers fire normally
    - "Whenever this creature mutates" does NOT trigger (no merge happened)

  Common scenarios:
    - Target creature was destroyed/bounced in response
    - Target gained Human type in response
    - Target gained hexproof/shroud in response
    - Target changed ownership in response

"WHENEVER THIS CREATURE MUTATES" TRIGGERS:

  Triggers ONLY when:
    - A mutating creature spell resolves AND
    - Actually merges with the creature

  Does NOT trigger when:
    - The creature enters the battlefield normally
    - The creature is copied
    - Cards are put on top of or under the creature by other effects
    - The mutating spell's target was illegal (entered separately)

  The trigger fires for ALL "whenever mutates" abilities on
  every card in the merged stack (not just the new card).

CHARACTERISTICS OF MERGED PERMANENTS:

  Topmost card determines:
    - Name
    - Mana cost and mana value
    - Type line (including subtypes)
    - Color (and color indicator if present)
    - Power/toughness
    - Loyalty (if planeswalker)

  ALL cards contribute:
    - All abilities (activated, triggered, static, keyword)
    - If multiple cards have the same ability, the permanent has
      multiple instances of that ability

  Copiable values:
    - The merged permanent's copiable values are the topmost card's values
    - But copies DON'T get the "all abilities from below" benefit
    - A Clone copying a merged permanent copies ONLY the top card

MERGED PERMANENT LEAVES THE BATTLEFIELD:

  When a merged permanent dies/exiles/bounces:
    - ONE permanent leaves the battlefield (one LTB event)
    - ALL component cards go to the destination zone
    - In the new zone, each card is an independent object
    - Tokens cease to exist (SBA) if they were components

  Effect tracking (729.3c):
    - If an effect tracks "that card" → it finds ALL components
    - Example: "Exile target creature, return it..." → all cards exile
    - "Return it to the battlefield" → each card returns separately
    - Each returned card is a new independent permanent

  Commander exception (729.3d):
    - If a commander is part of a merged permanent that dies:
      → Commander can go to command zone
      → Other components go to graveyard
    - Replacement effect applies component-by-component

MUTATE AND AURAS/EQUIPMENT:

  When a creature mutates:
    - Auras and Equipment remain attached (same permanent)
    - Counters remain (same permanent)
    - If topmost card changes the creature's type:
      → Check if Auras are still legal (enchant creature on a non-creature?)
      → SBA will unattach illegal Auras

MUTATE AND FACE-DOWN CREATURES:

  You CAN mutate onto a face-down creature:
    - The face-down creature is a valid target (2/2 non-Human creature)
    - If new card goes on TOP: merged permanent has new card's characteristics
    - If new card goes on BOTTOM: merged permanent is still face-down 2/2
    - The face-down card retains its ability to be turned face up

MUTATE AND TOKENS:

  You CAN mutate onto a token creature:
    - Token creatures are valid targets (if non-Human)
    - If token is on top: merged permanent is a token (729.2d)
    - If card is on top: merged permanent is a card (not a token)
    - When it leaves the battlefield: token components cease to exist
```

## Definitive Conclusions

- **Merged permanent = same object** — counters, Auras, Equipment, continuous effects all persist through mutation.
- **All abilities from all cards** — every card in the stack contributes its abilities; only the topmost determines other characteristics.
- **No ETB on merge** — mutating does not trigger "enters the battlefield" abilities; it's NOT entering.
- **Illegal target = normal creature** — if the target is gone, the mutating spell just enters as a regular creature.
- **One LTB event, all cards move** — when a merged permanent leaves, all components go to the destination zone separately.
- **Mutate targets non-Human you OWN** — ownership, not just control, is required.
- **Copies see only the top** — copying a merged permanent copies the topmost card's characteristics only.

## Canonical Example

**Gemrazer Mutates onto a Creature:**

You control a 3/3 Beast token (non-Human). You cast Gemrazer for its mutate cost {1}{G}{G}, targeting the Beast. Opponents can respond (the spell is on the stack).

Gemrazer resolves. Target is legal. You choose to put Gemrazer on top. The merged permanent now has Gemrazer's characteristics (4/4 Beast, reach, trample, {3}{G} mana cost) plus the Beast token's abilities (none in this case). "Whenever this creature mutates" triggers on Gemrazer — you destroy target artifact or enchantment.

The permanent is the SAME object as the Beast token. Any +1/+1 counters from before remain. Any Auras stay attached. It's now a 4/4 with reach and trample (plus counters/Auras).

**Example 2 — Target Becomes Illegal:**

You cast Nethroi, Apex of Death for its mutate cost, targeting your Llanowar Elves. In response, opponent casts Fatal Push destroying Llanowar Elves.

Nethroi begins resolving. Target is illegal. Nethroi ceases to be a mutating creature spell. It resolves as a normal creature spell and enters the battlefield as a 5/5 with deathtouch and lifelink. Nethroi's "whenever this creature mutates" ability does NOT trigger. No creatures are returned from graveyard.

**Example 3 — Merged Permanent Dies (Multiple Components):**

You have a merged permanent: Gemrazer on top, Sea-Dasher Octopus in the middle, Llanowar Elves on the bottom. The permanent is a 4/4 with reach, trample, "whenever this creature deals combat damage, draw a card," and "{T}: Add {G}."

Opponent casts Murder targeting the merged permanent. One permanent dies. All three cards go to your graveyard. In the graveyard, each is a separate card with its own characteristics. If an effect says "return that card to the battlefield," it finds all three — each returns as an independent creature.

## Commonly Confused With

- **P555 (Meld)** — P555 covers meld's dual-card permanent (back-face characteristics only, MV = sum); P558 covers mutate's merged permanent (top-card characteristics, all abilities, same object).
- **P003 (Zone Change Identity)** — P003 covers single objects changing zones; P558 covers merged permanents (multiple cards, one object) leaving the battlefield.
- **P542 (Face-Down Token Copy)** — P542 covers copying face-down permanents; P558 covers mutating onto face-down creatures and the resulting merged permanent.
