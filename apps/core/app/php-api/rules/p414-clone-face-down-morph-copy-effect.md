---
id: p414
name: Clone and Copy Effects Targeting Face-Down Morphs — Copying 2/2 Blank Characteristics
category: zones
cr_refs: [707.2, 707.3, 708.2, 708.2a, 708.10, 702.37e]
tags: [morph, clone, copy-effects, face-down-morph, 2/2-blank-copy, can't-turn-face-up, Vesuvan-Doppelganger, clone-face-down, face-down-copiable-values, face-up-later, Metamorphic-Alteration, copy-token-face-down, turn-face-up-from-copy, face-down-permanent-copy]
created: 2026-03-29
examples_count: 2
---

# P414 — Clone and Copy Effects Targeting Face-Down Morphs — Copying 2/2 Blank Characteristics

## Abstract
A face-down morph has copiable values of: 2/2 colorless creature, no text, no name, no subtypes, no mana cost (CR 708.2a). When Clone or another copy effect copies a **face-down** morph, the copy acquires those **face-down copiable values** — not the real card's characteristics. The result is a **colorless 2/2 with no name, no types, no abilities**. Critically: the copy **cannot be turned face up as a morph** (it has no morph ability — no morph ability was on the face-down copiable values, and the copy didn't inherit any hidden identity). However, if a copy effect later causes the copy to become a copy of the same card face-up, it acquires the real characteristics. This pattern is explicitly illustrated in the Comprehensive Rules with a Clone + face-down Grinning Demon example.

## The Definitive Rules

**CR 707.2** (verbatim): *"When copying an object, the copy acquires the copiable values of the original object's characteristics and, for an object on the stack, choices made when casting or activating it."*

**CR 708.2** (verbatim): *"Face-down spells and face-down permanents have no characteristics other than those listed by the ability or rules that allowed the spell or permanent to be face down. Any listed characteristics are the copiable values of that object's characteristics."*

**CR 708.2a** (verbatim): *"A permanent that enters the battlefield face down also has these characteristics unless otherwise specified by the effect that put it onto the battlefield face down or allowed it to be cast face down. These values are the copiable values of that object's characteristics."*

**CR 708.10** (verbatim): *"If a face-down permanent becomes a copy of another permanent, its copiable values become the copiable values of that permanent, as modified by its face-down status. Its characteristics therefore remain the same: the characteristics listed by the ability or rules that allowed it to be turned face down. However, if it is turned face up, its copiable values become the values it copied from the other permanent. See rule 707.3."*

**CR 707.2 Example** (verbatim from CR): *"Clone enters the battlefield as a copy of a face-down Grinning Demon (a creature with morph {2}{B}{B}). The Clone is a colorless 2/2 creature with no name, no types, no abilities, and no mana cost. It will still be face up. Its controller can't pay {2}{B}{B} to turn it face up."*

**CR 707.3 Example** (verbatim from CR): *"A face-down Grinning Demon (a creature with morph) becomes a copy of Wandering Ones (a 1/1 blue Spirit creature that doesn't have morph). It will be a face-down Wandering Ones. It remains a 2/2 colorless creature with no name, types, or abilities, and no mana cost. Its controller can't turn it face up as a special action. If an effect turns it face up, it will have the characteristics of Wandering Ones."*

## The Pattern

```
WHY COPYING FACE-DOWN = BLANK COPY:
  The face-down morph's copiable values ARE its face-down characteristics (708.2, 708.2a).
  These are: 2/2 colorless, no name, no subtypes, no text, no mana cost.
  When Clone copies a face-down morph, it acquires THOSE copiable values.
  The "real" card's characteristics (name, type, abilities, morph cost) are NOT copiable
    while the permanent is face down. They're hidden — not in the copiable values.
  Result: The Clone is:
    → 2/2 colorless
    → No name
    → No subtypes
    → No abilities (no morph, no ETBs, nothing)
    → No mana cost (mana value 0)
  And the Clone itself is face UP (Clone entered face-up per its own card text).

CAN'T TURN THE CLONE FACE UP AS A MORPH:
  702.37e: "If the permanent wouldn't have a morph cost if it were face up, it can't be
    turned face up this way."
  The Clone has no morph ability (it only copied the 2/2 blank characteristics).
  The Clone therefore has no morph cost.
  → The Clone can't be turned face up as a morph.
  This is explicitly stated in the CR example: "Its controller can't pay {2}{B}{B} to
    turn it face up."
  The Clone remains forever a 2/2 colorless with no abilities. Unless:
    → Another copy effect replaces its characteristics (e.g., Vesuvan Doppelganger's
      triggered ability lets it copy a different creature on upkeep).
    → Some other effect changes its characteristics.

FACE-DOWN BECOMING A COPY OF ANOTHER PERMANENT (708.10):
  What if you use a copy effect ON THE FACE-DOWN MORPH ITSELF (not cloning it, but making
  the face-down morph copy something)?
  708.10: "If a face-down permanent becomes a copy of another permanent, its copiable
    values become the copiable values of that permanent, as modified by its face-down status."
  While it's face down, its characteristics REMAIN the 2/2 blank (the new copiable values
    are modified by face-down status → still 2/2 blank).
  BUT: "if it is turned face up, its copiable values become the values it copied from
    the other permanent."
  So: make a face-down Grinning Demon copy Wandering Ones.
    → Still a 2/2 blank while face-down.
    → If turned face up: becomes Wandering Ones (1/1 blue Spirit, no morph).
    → Can the controller turn it face up as a morph? Wandering Ones has no morph.
      → No morph cost. Can't use morph special action.
      → Would need a "turn face up" effect that doesn't require a morph cost.

IF THE REAL MORPH TURNS FACE UP AFTER CLONE:
  The Clone already copied the face-down characteristics. 707.2b: "Once an object has
    been copied, changing the copiable values of the original object won't cause the
    copy to change."
  Original morph turns face up: original becomes Grinning Demon (a 7/7).
  The Clone is still a 2/2 colorless with no abilities.
  The Clone does NOT update to match the face-up real card.
  The copy locked in the face-down characteristics at the moment of copying.

TARGETING A FACE-DOWN MORPH WITH EFFECTS:
  A face-down morph has no name, no types, no abilities:
  → "Destroy target creature named Grinning Demon": can't target face-down Grinning Demon.
  → "Destroy target black creature": face-down morph is colorless. Can't target.
  → "Destroy target creature with flying": face-down morph has no flying. Can't target.
  → "Destroy target creature with morph": wait — does the face-down morph "have morph"?
    In OTHER zones, the morph ability exists on the card (702.37a: "functions in any
    zone from which you could play the card it's on"). But ON THE BATTLEFIELD FACE DOWN,
    the permanent has NO text. No abilities.
    → A spell targeting "creature with morph" checks the on-battlefield characteristics.
    → Face-down: no text = no morph ability visible.
    → CAN'T target a face-down morph with "target creature with morph."
    This is subtle: morph exists as a spell ability (in hand/stack) but not as a
    battlefield characteristic while face down.

PROTECTION AND FACE-DOWN MORPH:
  If a spell gives "protection from colorless" to a permanent: face-down morphs are
    colorless, so that protection doesn't apply to the spell itself.
  But: creatures with "protection from everything" (like Progenitus): nothing can target
    them face-down either... wait, Progenitus doesn't have morph. But if something had
    protection from everything AND was face-down, the protection might not "exist" while
    face-down (no abilities). Unusual edge case.

PRACTICAL CLONING STRATEGIES:
  Clone the FACE-UP morph (after it's flipped): gets real characteristics + morph.
    The clone has morph! Can cast from face-up state.
    Wait — Clone enters as a copy of the current creature. If the real morph is face-up
    as Grinning Demon (7/7), Clone entering as a copy = 7/7 Grinning Demon WITH morph.
    The Clone (now face-up Grinning Demon) has morph {2}{B}{B} as an ability.
    But Clone doesn't enter face-down (it entered normally). To use morph from hand:
    the Clone would need to be in hand, which it isn't. On the battlefield: no.
    Morph only functions from zones you could cast it from (hand, exile if given ability).
    Clone on battlefield face-up as Grinning Demon: can't use morph from the battlefield.

  Correct play: clone AFTER the morph flips to get the real card.
    But cloning face-up gives you the creature with its abilities.
    This is the intended play: clone things face-up, not face-down.
```

## Definitive Conclusions

- **Cloning a face-down morph gives you a 2/2 colorless with no abilities** — the face-down permanent's copiable values are just the blank 2/2 stats; the real card's characteristics are hidden and not copiable (confirmed verbatim in CR 707.2 example).
- **The clone cannot be turned face up as a morph** — it has no morph ability (copied from the blank face-down characteristics); there is no morph cost to pay to flip it.
- **Making a face-down morph copy another permanent keeps it 2/2 blank while face-down** — but if it's later turned face up (by an effect that can do so), it reveals the copied permanent's characteristics (CR 708.10).
- **After cloning, turning the original face-up doesn't change the clone** — copy effects lock in characteristics at the time of copying; changes to the original don't retroactively update existing copies (CR 707.2b).
- **Face-down morphs can't be targeted by effects requiring specific characteristics** — name-based targeting, color-based targeting, ability-based targeting all fail because face-down = no characteristics.

## Canonical Example
**Clone + Face-Down Grinning Demon (CR's own example):**
Opponent controls Grinning Demon ({2}{B}{B}: 7/7; morph {2}{B}{B}) cast face-down as a 2/2.

You play Clone ({3}{U}: "You may have this creature enter as a copy of any creature on the battlefield").

Clone enters. You choose to copy the face-down Grinning Demon.
CR 707.2 Example applies directly: "The Clone is a colorless 2/2 creature with no name, no types, no abilities, and no mana cost. It will still be face up. Its controller can't pay {2}{B}{B} to turn it face up."

Your Clone is a 2/2 colorless with nothing. You gain nothing useful.

Later: Opponent turns their Grinning Demon face up (pays {2}{B}{B}).
Now they have a real 7/7 Grinning Demon on the battlefield.
Your Clone is still a 2/2 colorless blank — it does NOT update to match the now-face-up Demon.
(CR 707.2b: "Once an object has been copied, changing the copiable values of the original object won't cause the copy to change.")

Lesson: Always clone morphs AFTER they've been turned face up to get the real creature.

**Example 2 — Vesuvan Doppelganger and Face-Down Targeting:**
Vesuvan Doppelganger ({3}{U}{U}: 0/0; "when this creature enters, it becomes a copy of target creature, except it has this ability; at the beginning of your upkeep, you may have this become a copy of target creature..."):

You use Vesuvan Doppelganger's upkeep ability: "become a copy of target creature."
You target your own face-down morph (let's say it's actually Ixidron {2}{U}{U}: 3/4 morph-like ability — actually Ixidron turns other creatures face down, but it can be morphed).

Wait — you need to target the face-down morph. It IS a creature. You CAN target it.
The Doppelganger becomes a copy of the face-down morph's characteristics: 2/2 colorless, no abilities.
The Doppelganger is now a 2/2 colorless blob.

Actually, the useful play: target the face-down morph AFTER you've revealed it (turned it face up).
Or: use the upkeep ability to RETARGET to a different creature once your morph reveals itself.
Example: You flip your Rattleclaw Mystic (2/1; morph {1}{G}; "when turned face up, add {R}{G}{W}") on your opponent's upkeep as a trick. On YOUR upkeep, Vesuvan Doppelganger can now copy the face-up Rattleclaw Mystic's characteristics (2/1 with its mana ability).

This is the correct play for Doppelganger + morph: flip the morph first, then copy it.
Copying face-down = wasted copy; copying face-up = real value.

## Commonly Confused With
- **P413 (Morph/Megamorph)** — P413 covers how morph works. P414 covers the specific interaction when copy effects interact with face-down permanents — the non-obvious result that copies lock in blank characteristics.
- **P409 (Copy Effects and Alternative/Additional Costs)** — P409 covers how copies inherit kicked/flashback status. P414 is about what the copy ACQUIRES when the original is face-down (blank characteristics, not the real card's stats).
- **P004 (Layer System)** — The face-down status (layer 1b) modifies copiable values. Copying a face-down permanent means the copy has the modified (blank) copiable values as its layer 1 values. When the copy is face-up (if it ever is), different copiable values apply.
- **P003 (Zone Changes and Object Identity)** — Face-down permanents that leave the battlefield must be revealed. The "identity" of a face-down permanent is hidden while it exists on the battlefield but becomes public the moment it leaves.
