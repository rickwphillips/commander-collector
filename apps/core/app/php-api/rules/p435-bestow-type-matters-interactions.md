---
id: p435
name: Bestow and Emerge/Exploit/Devour — Bestowed Auras Are Not Creatures, Can't Be Sacrificed as Creatures
category: costs
cr_refs: [702.103b, 702.119a, 702.110a, 702.82a, 205.2a, 205.2b]
tags: [bestow, emerge, exploit, devour, bestow-not-creature, sacrifice-type-check, bestowed-aura-type, Boon-Satyr, Elder-Deep-Fiend, Sidisi-Undead-Vizier, Mycoloth, type-on-battlefield, permanent-card-type, enchantment-sacrifice, creature-sacrifice-requirement, Aura-vs-creature, bestow-sacrifice-stack]
created: 2026-03-29
examples_count: 2
---

# P435 — Bestow and Emerge/Exploit/Devour — Bestowed Auras Are Not Creatures, Can't Be Sacrificed as Creatures

## Abstract
When a creature is cast bestowed (702.103b), it becomes an **Aura enchantment** on the stack AND on the battlefield while attached. It is no longer a creature. Effects that require sacrificing "a creature" — emerge, exploit, devour, and any other sacrifice-cost mechanic — cannot use a bestowed Aura as the sacrificed creature, because the bestowed Aura is not a creature (it lacks the Creature card type). This interaction is counterintuitive because the CARD is still a creature card (you can cast it as a creature), but while it's bestowed on the battlefield as an Aura, it has no Creature card type. The same applies to effects that check "target creature" or "number of creatures you control" — a bestowed Aura is excluded from all of these. Conversely, effects that check for "an enchantment" or "an Aura" DO apply to the bestowed permanent.

## The Definitive Rules

**CR 702.103b** (verbatim, key excerpt): *"As a spell cast bestowed is put onto the stack, it becomes an Aura enchantment and gains enchant creature... These effects last until the spell or the permanent it becomes ceases to be bestowed."*

**CR 205.2a** (verbatim): *"The card types are artifact, battle, conspiracy, creature, dungeon, enchantment, instant, kindred, land, phenomenon, plane, planeswalker, scheme, sorcery, and vanguard."*

**CR 205.2b** (verbatim): *"Some objects have more than one card type (for example, an artifact creature). Such objects satisfy the criteria for any effect that applies to any of their card types."*

**CR 702.119a** (verbatim, emerge): *"'Emerge [cost]' means 'You may cast this spell by paying [cost] and sacrificing a creature rather than paying its mana cost'..."*

**CR 702.110a** (verbatim, exploit): *"Exploit is a triggered ability. 'Exploit' means 'When this creature enters, you may sacrifice a creature.'"*

## The Pattern

```
THE CORE RULE:
  While bestowed on the stack or battlefield:
    The permanent is an AURA ENCHANTMENT. Its card types are: Enchantment (and subtype: Aura).
    It does NOT have the Creature card type.
    702.103b: "becomes an Aura enchantment" — this REPLACES the creature type with enchantment.
    The bestow effect "lasts until the spell or the permanent ceases to be bestowed."
    While bestowed: no Creature card type. While not bestowed (falls off or cast normally): Creature.

  WHAT THIS MEANS FOR SACRIFICE COSTS:
    "Sacrifice a creature" requirements (emerge, exploit, devour, Viscera Seer tap ability, etc.):
      These require a permanent with the Creature card type.
      A bestowed Aura on the battlefield is NOT a creature. Cannot be sacrificed as a creature.
      Even though the card TEXT says "creature" and it has creature subtypes, it lacks the Creature
      card type while bestowed.

  EMERGE + BESTOWED AURA:
    Emerge (702.119a): "sacrifice a creature" as part of paying the cost.
    Your bestowed Eidolon of Countless Battles is on the battlefield attached to a creature.
    You want to emerge Elder Deep-Fiend by sacrificing the Eidolon.
    Eidolon of Countless Battles while bestowed: is an Aura enchantment. NOT a creature.
    You CANNOT sacrifice the bestowed Eidolon for emerge. It's not a creature.
    If you had Eidolon NOT bestowed (entered normally as a 1/1+ creature): it IS a creature.
    You can sacrifice it for emerge.

  EXPLOIT + BESTOWED AURA:
    Exploit (702.110a): "you may sacrifice a creature."
    Similarly: a bestowed Aura is not a legal sacrifice for exploit.
    Sidisi, Undead Vizier exploit trigger: choose to sacrifice a creature.
    Your bestowed Boon Satyr attached to a creature: not a legal exploit sacrifice.

  DEVOUR + BESTOWED AURA:
    Devour (702.82a): "you may sacrifice any number of creatures."
    Same rule. Bestowed Auras are not creatures. Cannot be devoured.

  EDICT EFFECTS:
    "Each player sacrifices a creature" (Innocent Blood, Fleshbag Marauder, etc.):
    If your only creatures are bestowed Auras... wait. Each player sacrifices "a creature."
    Bestowed Auras are not creatures. You wouldn't have a creature to sacrifice.
    If you only have bestowed Auras on the battlefield (no non-bestowed creatures): you can't
    satisfy the edict sacrifice. An edict forces sacrifice of "a creature you control." If you
    control no creatures (only bestowed Auras), you sacrifice nothing.
    This is an unusual interaction: a player with many bestowed Auras but no actual creature
    permanents is immune to edict effects!

  CREATURE COUNT EFFECTS:
    "You control the most creatures" — bestowed Auras don't count toward creature count.
    "Number of creatures you control" for mana production (Priest of Titania, etc.): doesn't
      count bestowed Auras.
    "Creatures you control get +1/+1": doesn't apply to bestowed Auras (they're not creatures).

  WHAT BESTOWED AURAS DO SATISFY:
    "Sacrifice an enchantment": bestowed Auras ARE enchantments. Legal sacrifice.
    "Sacrifice an Aura": bestowed Auras are Auras. Legal sacrifice.
    "Target enchantment you control": bestowed Auras can be targeted.
    "Enchantment enters under your control" triggers: fire when a bestow spell resolves.
    Enchantress effects (e.g., Enchantress's Presence: "whenever you play an enchantment, draw"):
      fires when you cast a bestow spell (it's an enchantment spell while bestowed).

  THE BESTOW SPELL ON THE STACK:
    While on the stack as a bestow spell: Aura enchantment spell. NOT a creature spell.
    "Counter target creature spell": can't counter a bestow spell (Aura spell, not creature).
    "Counter target enchantment spell": CAN counter a bestow spell.
    "Destroy target creature": can't destroy a bestow spell (it's a spell, not a permanent; also
      not a creature while bestowed). This is irrelevant since spells can't be "destroyed" via
      permanent removal anyway (spells use the stack and are countered, not destroyed).

BESTOWED AURA TYPE CHANGES FROM OTHER EFFECTS:
  What if an effect makes the bestowed Aura into a creature while it's bestowed?
  Example: Mycosynth Lattice makes all permanents into artifacts. But not creatures.
  Another example: "all Auras become creatures" hypothetically.
  If a bestowed Aura gains the Creature card type from another effect (rare): it now has both
    Enchantment and Creature card types. It satisfies both creature and enchantment requirements.
  But: 702.103f: "if a bestowed Aura is attached to an illegal object or player, it becomes
    unattached and ceases to be bestowed." If it becomes a creature (and thus has Creature card
    type) while bestowed, does it "fall off"? Only if it's attached to an illegal object.
    Becoming a creature while still attached doesn't automatically detach it. It's still a
    bestowed Aura attached to a creature. It just also has the Creature card type now.

BESTOW FALLING OFF AND SACRIFICE AVAILABILITY:
  When the enchanted creature dies and the bestow falls off:
    The bestow permanent is still on the battlefield, now as a creature.
    NOW it's a creature and CAN be sacrificed as a creature (for emerge, exploit, devour, etc.).
    The transition happens immediately when the enchanted creature dies and the Aura becomes unattached.
  This creates a potential play: let the enchanted creature die, the bestow falls off as a creature,
    then use that creature for another ability.
```

## Definitive Conclusions

- **A bestowed Aura on the battlefield is NOT a creature** — it lacks the Creature card type while bestowed; emerge, exploit, devour, edicts, and "sacrifice a creature" effects cannot use it.
- **A player controlling only bestowed Auras (no non-bestowed creatures) is immune to edict sacrifice** — if they control no actual creature permanents, they can't sacrifice a creature.
- **Bestowed Auras DO count as enchantments** — "sacrifice an enchantment," "enchantment enters," enchantress effects, and other enchantment-dependent effects all apply.
- **When a bestowed Aura falls off (enchanted creature dies), it immediately becomes a creature** — at that moment, it CAN be sacrificed as a creature; you can exploit, emerge-sacrifice, or otherwise use it as a creature.
- **The bestow spell on the stack is an Aura spell** — enchantment-spell effects (Enchantress's Presence) trigger for it; creature-spell effects don't.

## Canonical Example
**Emerge + Bestow — the mistaken sacrifice:**
You control Elder Deep-Fiend in your hand and on the battlefield: Boon Satyr ({1}{G}{G}: 4/2; bestow {3}{G}{G}) that you cast bestowed onto your Elvish Mystic ({G}: 1/1; Elvish Mystic taps for {G}).

Your battlefield: Elvish Mystic enchanted with Boon Satyr (Elvish Mystic gets +4/+2; Boon Satyr on battlefield as an Aura, NOT as a creature).

You want to cast Elder Deep-Fiend ({8}: 5/6; flash; emerge {5}{U}). Emerge: sacrifice a creature.
Can you sacrifice Boon Satyr to emerge Elder Deep-Fiend? Boon Satyr while bestowed = Aura enchantment.
No. Boon Satyr is not a creature while bestowed. You cannot sacrifice it for emerge.

You CAN sacrifice Elvish Mystic (it IS a creature). Elvish Mystic (MV 1) for emerge: {5}{U} - {1} = {4}{U}.
When Elvish Mystic dies: Boon Satyr's enchanted creature is gone. Boon Satyr falls off.
Boon Satyr BECOMES A 4/2 CREATURE on the battlefield (it ceases to be bestowed per 702.103f).
Now: Elder Deep-Fiend enters (ETB: tap 4 permanents). Boon Satyr is a 4/2 creature you control.

Result: Boon Satyr became a creature as a side effect. You have Elder Deep-Fiend + Boon Satyr.

**Example 2 — Edict immunity:**
You control only three bestowed Auras on the battlefield (all attached to creatures you DON'T own,
  somehow — or all attached to permanents that just died and haven't been type-changed yet).
Actually: your only permanents are three bestowed Auras attached to your three creatures.
Wait: the bestowed Auras ARE your creatures (you control them). But they're not creatures while bestowed.
You control: Island (land), Bestowed Boon Satyr on opponent's... wait, bestow goes on YOUR creatures.

Simplified: you control 3 bestowed Auras + 3 creatures they're attached to. You control 3 creatures
(the enchanted creatures). You DO have creatures to sacrifice for edicts.

Better example: You control Bestowed Boon Satyr attached to YOUR creature + no other creatures.
But your creature is also bestowed? No — you can only bestow onto existing creatures.
If ALL of your permanents are bestowed Auras: you have no creatures to sacrifice for edicts.
For this to work: your actual creatures all died, leaving only bestowed Auras with no host.
But: when a bestowed Aura's host dies, the Aura falls off and BECOMES A CREATURE. So you now have
creatures. The edict immunity only exists in the brief window where hosts have died and you
haven't addressed the Auras yet.

In practice: if you run many bestow creatures and your opponent has edicts, your bestow creatures
becoming Auras effectively converts them from "creatures vulnerable to edicts" to "enchantments
immune to edicts." Opponent must time their edicts when your creatures are NOT bestowed.

## Commonly Confused With
- **P431 (Bestow)** — P431 covers bestow's general rules. P435 covers specifically how bestow's type change affects sacrifice requirements and creature-count effects. The two patterns together give the complete picture.
- **P434 (Emerge)** — P434 covers emerge's cost structure and timing. P435 covers the specific interaction where bestowed Auras can't be sacrificed for emerge.
- **P429 (Devour)** — P429 covers devour's mechanics and persist interaction. P435 covers why bestowed Auras can't be devoured.
- **P425 (Changeling Card Types)** — P425 covers how Changeling doesn't grant Artifact card type. P435 covers how bestow removes the Creature card type. Both are about the distinction between card types and creature subtypes, but in opposite directions: Changeling adds ALL creature subtypes without adding card types; bestow REMOVES the creature card type while adding enchantment.
