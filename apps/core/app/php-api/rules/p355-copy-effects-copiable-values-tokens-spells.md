---
id: p355
name: Copy Effects — Copiable Values, Copying Spells vs. Permanents, and What Gets Copied
category: stack
cr_refs: [707.1, 707.2, 707.2a, 707.2b, 707.3, 707.4, 707.5, 707.6, 707.9, 707.10, 707.10a, 707.10b, 707.10c, 707.10f, 613.2, 708.2]
tags: [copy, copiable-values, clone, fork, populate, token-copy, permanent-copy, spell-copy, counters-not-copied, effects-not-copied, Clone, Strionic-Resonator, Fork, Fling-copy, Cackling-Counterpart, Esika-copy, counters-copy, face-down-copy, Vesuvan-Doppelganger, copy-of-morph, ETB-triggers-copy]
created: 2026-03-29
examples_count: 2
---

# P355 — Copy Effects — Copiable Values, Copying Spells vs. Permanents, and What Gets Copied

## Abstract
**Copy effects** create an object that has the **copiable values** of the original (707.2). Copiable values are derived from **printed text only** (plus other copy effects, face-down status, and "as...enters" ability results): name, mana cost, color indicator, card types, subtypes, supertypes, rules text, power, toughness, loyalty. What is **NOT** copied: counters, damage marks, other continuous effects (type-changing, pump), status (tapped/untapped), attachments. A copy of a spell copies its targets and mode choices; when a spell copy resolves and becomes a permanent, it can trigger ETB abilities (707.5). Copy effects apply in **Layer 1** of the layer system (613.2) — meaning they establish the base copiable values, and all other continuous effects (type changes, pump, etc.) are then applied on top.

## The Definitive Rules

**CR 707.2** (verbatim): *"When copying an object, the copy acquires the copiable values of the original object's characteristics and, for an object on the stack, choices made when casting or activating it (mode, targets, the value of X, whether it was kicked, how it will affect multiple targets, and so on). The copiable values are the values derived from the text printed on the object (that text being name, mana cost, color indicator, card type, subtype, supertype, rules text, power, toughness, and/or loyalty), as modified by other copy effects, by its face-down status, and by 'as . . . enters' and 'as . . . is turned face up' abilities that set power and toughness (and may also set additional characteristics). Other effects (including type-changing and text-changing effects), status, counters, and stickers are not copied."*

**CR 707.5** (verbatim): *"An object that enters the battlefield 'as a copy' or 'that's a copy' of another object becomes a copy as it enters the battlefield. It doesn't enter the battlefield, and then become a copy of that permanent. If the text that's being copied includes any abilities that replace the enters-the-battlefield event (such as 'enters with' or 'as [this] enters' abilities), those abilities will take effect. Also, any enters-the-battlefield triggered abilities of the copy will have a chance to trigger."*

**CR 707.10** (verbatim, partial): *"To copy a spell, activated ability, or triggered ability means to put a copy of it onto the stack; a copy of a spell isn't cast and a copy of an activated ability isn't activated. A copy of a spell or ability copies both the characteristics of the spell or ability and all decisions made for it, including modes, targets, the value of X, and additional or alternative costs."*

**CR 707.2b** (verbatim): *"Once an object has been copied, changing the copiable values of the original object won't cause the copy to change."*

**CR 707.4** (verbatim): *"Some effects cause a permanent that's copying a permanent to copy a different object while remaining on the battlefield. The change doesn't cause enters-the-battlefield or leaves-the-battlefield abilities to trigger. This also doesn't change any noncopy effects presently affecting the permanent."*

**CR 707.10a** (verbatim): *"If a copy of a spell is in a zone other than the stack, it ceases to exist. If a copy of a card is in any zone other than the stack or the battlefield, it ceases to exist. These are state-based actions."*

## The Pattern

```
WHAT IS COPIED — THE COPIABLE VALUES (707.2):
  COPIED (from printed text):
    - Name
    - Mana cost (and converted mana value derived from it)
    - Color indicator (if printed)
    - Card types (creature, instant, artifact, etc.)
    - Subtypes (Human, Warrior, Forest, etc.)
    - Supertypes (legendary, basic, snow, etc.)
    - Rules text / abilities
    - Printed power and toughness
    - Starting loyalty

  ALSO COPIED (modifications to base copiable values):
    - Other copy effects already applied to the object
    - Face-down status (if copying a face-down permanent: gets the face-down 2/2 values)
    - "As [this] enters" choices that set P/T or other characteristics

  NOT COPIED:
    - Counters (+1/+1, -1/-1, loyalty, charge, etc.)
    - Current damage marked on the creature
    - Status: tapped, untapped, flipped, face-up/down (wait: face-down status is in copiable values above)
      Actually: face-DOWN status IS part of copiable values. Face-up vs face-down is part of layer 1b.
    - Continuous effects applied to the object (Giant Growth +3/+3, type changes from Blood Moon, etc.)
    - Attached Auras, Equipment
    - "Until end of turn" effects granted by other spells

  EXAMPLES:
    Clone ({3}{U}): "You may have this creature enter as a copy of any creature on the battlefield."
    Clone copies a 5/5 Construct (originally 1/1 given +4/+4 by a continuous effect):
      COPIED: the 1/1 Construct's printed stats (1/1) and abilities.
      NOT COPIED: the +4/+4 continuous effect.
      Clone enters as a 1/1 Construct (not 5/5).
      (But if the effect were a copy effect that SET the 5/5 as base, then it would be copied.)

    Clone copies a Chimeric Staff artifact that became a 5/5 Construct via its activated ability:
      The 5/5 result came from "until end of turn" effect (continuous, not copiable).
      Clone copies the STAFF's original values (artifact with activated ability), not 5/5 Construct.

COPYING A PERMANENT THAT WAS COPIED (707.3):
  The copy's copiable values include any COPY EFFECTS applied to the original.
  If Shapeshifter copied Runeclaw Bear (became a bear) and Clone copies the Shapeshifter:
    Clone sees: "the Shapeshifter's copiable values include the Runeclaw Bear's characteristics
      (due to copy effect) plus the Shapeshifter's own 'except' clause."
    Clone copies the RESULT of copy effects, not the original card's text.

COPYING SPELLS ON THE STACK (707.10):
  A copy of a spell includes:
    - All characteristics of the spell
    - Targets chosen for it
    - Mode selected (for modal spells)
    - Value of X
    - Kicked or not
    - Additional costs paid
  The copy is put on the stack, NOT cast (707.10: "a copy of a spell isn't cast").
  Implications:
    - Prowess doesn't trigger (it triggers when you CAST a spell, not copy)
    - Storm count doesn't include the copy (copies aren't spells you cast)
    - The copy can be responded to like any stack object
  CHOOSING NEW TARGETS (707.10c):
    Many copy effects say "you may choose new targets for the copy."
    If you choose new targets: they must be legal.
    You can leave targets unchanged (even if now illegal), but then the copy may fizzle.
    If you change targets: must be legal targets.
    Example: Fork copies Lightning Bolt targeting your 2/2. Fork says "you may choose new targets."
      Option 1: Keep target (2/2). Copy targets 2/2. Two Lightning Bolts hit the 2/2. It dies.
      Option 2: Change target. Redirect copy to opponent (legal target). 2/2 takes one Bolt.

ETB TRIGGERS ON COPIED PERMANENTS (707.5):
  When a copy enters "as a copy of" another permanent:
    It becomes the copy as it ENTERS (not after entering, then becoming).
    This means: ETB abilities of the copied card fire when the copy enters.
    Example: Clone enters as a copy of Wall of Omens (1/4 defender, "when this enters, draw a card").
      Clone enters with Wall's characteristics. Wall's ETB fires: Clone's controller draws a card.
  IMPORTANT EXCEPTION (707.4):
    If a permanent already on the battlefield BECOMES a copy of something else (like Unstable Shapeshifter):
      The copy change doesn't cause ETB or LTB triggers. It's the same object.
      "The change doesn't cause enters-the-battlefield or leaves-the-battlefield abilities to trigger."
      Only when it ENTERS as a copy do ETB triggers fire.

COPYING "AS ENTERS" ABILITIES (707.6):
  When a copy enters the battlefield and the copied card has "as [this] enters, choose..."
    The COPY gets to make new choices. It doesn't inherit the original's choices.
    Example: Clone copying Adaptive Automaton ("as this enters, choose a creature type").
      Clone's controller chooses a creature type (doesn't inherit Automaton's chosen type).

COPY EFFECTS AND THE LAYER SYSTEM (CR 613.2):
  Copy effects are Layer 1 (the lowest layer).
  They establish the base copiable values.
  All other continuous effects (type changes, text changes, P/T changes) apply in higher layers.
  This means:
    If an effect CHANGES THE TYPE of a permanent (Blood Moon making it a Mountain):
      That change is in Layer 4 (type changes).
      A copy of that permanent DOESN'T COPY the type change (it's not in copiable values).
      Copy gets the original printed type (from Layer 1).
    Then the type-changing effect is RE-APPLIED in Layer 4.
  Order of application:
    Layer 1 copy effect → establishes base.
    Layer 4+ continuous effects reapply to the new copy.

FACE-DOWN COPIES (707.2, 708.2):
  Copying a face-DOWN morph creature:
    "The copy acquires copiable values... as modified by its face-down status."
    Face-down permanents have copiable values of: 2/2, no name, no types, no text (708.2a).
    Copying a face-down permanent: copy gets these 2/2 face-down values.
    Clone copies face-down Grinning Demon:
      Clone is 2/2 colorless face-UP with no name, no text, no mana cost.
      The face-down status is in the copiable values, but Clone itself isn't face-down.
      Clone: same characteristics as the face-down card, but Clone is face-up.
      Clone CAN'T be turned face-up as a morph (it doesn't have morph ability).

TOKEN COPIES (707.1):
  Some effects create a token that is a copy of a permanent.
  Tokens follow all the same copy rules.
  A token copy has all the same characteristics as the original.
  If the original is legendary, the token is also legendary (legendary rule applies: SBA check).
  Example: Populate ("create a token that's a copy of a creature token you control"):
    Create a token copy of a 3/3 Elephant token.
    Token copy: 3/3 Elephant with same abilities (if any). Two 3/3 Elephants.
```

## Definitive Conclusions

- **Copy effects copy printed values only** — counters, continuous effects (type changes, pump), damage, status, and attachments are NOT copied.
- **Copying a copy captures copy-effect modifications** — if an object was already transformed by a copy effect, copying it inherits those copy-effect changes (707.3).
- **ETB triggers fire when a copy enters the battlefield** — a Clone entering as a Wall of Omens draws a card; but a permanent already on the field that BECOMES a copy doesn't trigger ETB/LTB.
- **"As [this] enters" choices are made fresh for copies** — Clone copying Adaptive Automaton lets the Clone's controller choose a new creature type.
- **Copy effects apply in Layer 1** — continuous effects from other layers (type changes, pump, etc.) re-apply on top of the copied base values.
- **Copies of spells aren't "cast"** — prowess, storm, and "when you cast" effects don't trigger for copied spells; but "when this spell resolves" effects do trigger.
- **Copying a face-down creature creates a face-up 2/2 with no text** — the face-down characteristics become the copiable values, but the copy itself enters face-up.

## Canonical Example
**Clone Enters as a Copy of Grave Titan:**
You control Clone ({3}{U}): "You may have this creature enter as a copy of any creature on the battlefield."
Opponent controls Grave Titan ({4}{B}{B}): 6/6, deathtouch. "Whenever Grave Titan or another Zombie enters under your control, create two 2/2 black Zombie creature tokens."

You choose: Clone enters as a copy of Grave Titan.
Result:
  Clone becomes a 6/6 with deathtouch, with the Zombie ETB trigger.
  The Clone-that-is-Grave-Titan has ETB triggered ability.
  ETB fires: "Whenever Grave Titan or another Zombie enters under your control."
    Clone-Titan is a Grave Titan (it copied Grave Titan). Is it also a Zombie?
    Grave Titan's type: "Legendary Creature — Zombie Giant."
    Clone is now a Zombie Giant legendary creature.
    The trigger says "whenever Grave Titan or another Zombie enters." The Clone IS a Zombie.
    Actually: the trigger checks "Grave Titan... enters." Clone is a copy, not the original Grave Titan.
    But the trigger fires for "Grave Titan" — this is a name check. The Clone is named "Grave Titan" now.
    So yes: the trigger fires for "Grave Titan entering" (the Clone has the name Grave Titan).
    Result: Clone-Titan enters → Zombie token trigger fires → create 2 Zombie tokens.

After entering:
  Opponent's original Grave Titan and your Clone-Titan are both named "Grave Titan."
  Legendary rule (SBA 704.5j): two legendary permanents with the same name AND same controller?
    They're controlled by DIFFERENT players. Legendary rule only applies if the same PLAYER controls both.
    You control Clone-Titan. Opponent controls original Titan. No legendary rule issue.

COUNTERS NOT COPIED:
  Suppose Grave Titan had 3 +1/+1 counters on it (9/9 total).
  Clone enters as a copy of Grave Titan: clone is 6/6 (base printed values).
  The +1/+1 counters on the original: NOT part of copiable values. Not copied.
  Clone is a fresh 6/6.

**Example 2 — Copying a Spell: Fork and New Targets:**
You cast Lightning Bolt ({R}) targeting your opponent (at 20 life).
Opponent responds with... wait, you have Fork ({R}{R}): "Copy target instant or sorcery spell. You may choose new targets for the copy. The copy is red."

Actually: You cast Lightning Bolt. THEN you cast Fork targeting Lightning Bolt (while Bolt is on the stack).
Fork resolves: creates a copy of Lightning Bolt on the stack.
  Copy: red, "Lightning Bolt deals 3 damage to any target."
  Same target as original? By default: same target (opponent).
  You may choose new targets: redirect the copy to opponent's 5/5 creature instead.
  Now: copy targets creature, original targets opponent.
Stack order (LIFO): Copy of Lightning Bolt (top) → Original Lightning Bolt (bottom).
Copy resolves first: deals 3 damage to opponent's 5/5. The 5/5 takes 3 damage.
  If 5/5 has toughness ≤ 3 total damage: SBA destroys it.
Original resolves: deals 3 damage to opponent. Opponent at 17.

What if you use Fork on YOUR OWN Lightning Bolt (cast it in response to your own bolt):
  This is legal. Fork targets your Lightning Bolt on the stack.
  Fork resolves: copy of Lightning Bolt, you may redirect.
  Redirect copy to opponent's creature (same player can do this).
  Original was targeting opponent. Both deal damage. Efficient use.

COPYING DOESN'T COUNT AS CASTING — PROWESS:
  Goblin Electromancer ({1}{R}): "Instant and sorcery spells you cast cost {1} less."
  Goblin Electromancer doesn't affect fork/copy costs: Fork is what you CAST (reduces it by {1}).
  But the COPY of Lightning Bolt isn't cast. Prowess wouldn't trigger for the copy.
  Guttersnipe ({2}{R}): "Whenever you cast an instant or sorcery spell, Guttersnipe deals 2 damage."
    Guttersnipe triggers when you CAST a spell. Fork (the sorcery you cast): triggers Guttersnipe.
    But the COPY of Lightning Bolt: not cast. Guttersnipe doesn't trigger again.

## Commonly Confused With
- **P004 (Layer System)** — Copy effects apply in Layer 1. Other continuous effects (type changes, ability additions, P/T changes) apply in Layers 4–7. A copy captures the Layer 1 base values; other layers re-apply to the copy afterward. When you copy a Blood-Moon'd creature (now a Mountain), the copy has the ORIGINAL permanent's copiable values (not the Blood-Moon-modified ones), then Blood Moon applies again to the copy.
- **P003 (Zone Changes — New Object)** — When a copy goes to a GY or is exiled, the original still exists as a separate object. Copies are independent objects once created. A copy of a spell on the stack that goes to a GY ceases to exist as an SBA (707.10a) — it's not a real card.
- **P344 (Split/DFC Cards)** — Copying a DFC permanent uses the face that's currently up (707.8). The copy has both faces if the original was double-faced (707.8a), but the copy enters with the currently-up face's values.
- **P011 (ETB Triggers)** — Copies entering "as a copy" trigger ETBs of the copied card (707.5). This is the key interaction for Clone-like effects: entering as Grave Titan fires Titan's ETB. But if a permanent already on the field BECOMES a copy, no ETB fires.
