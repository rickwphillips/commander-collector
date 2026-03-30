---
id: p316
name: Morph, Manifest, and Face-Down Permanents — Hidden 2/2 Creatures
category: zones
cr_refs: [702.37a, 702.37c, 702.37e, 701.40a, 701.40b, 708.2, 708.3, 708.8, 708.9]
tags: [morph, megamorph, manifest, face-down, disguise, 2/2-face-down, special-action, no-stack, ETB-not-triggered, reveal-on-leaving, Ixidron, Zoetic-Cavern, Brine-Elemental, Weaver-of-Lies, Senate-Courier]
created: 2026-03-29
examples_count: 2
---

# P316 — Morph, Manifest, and Face-Down Permanents — Hidden 2/2 Creatures

## Abstract
Face-down permanents created via Morph or Manifest enter the battlefield as a colorless 2/2 creature with no text, no name, no subtypes, and no mana cost. Their real characteristics are hidden until they're turned face up. **Turning face up is a special action** — it doesn't use the stack and can't be responded to in the normal way. Critically: **ETB abilities don't trigger when turning face up**, because the permanent already entered. Morph lets you cast the card face down for {3}; the morph cost turns it face up. Manifest puts a card directly onto the battlefield face down. When a face-down permanent leaves the battlefield, its owner **must reveal** what card it was.

## The Definitive Rules

**CR 702.37a** (verbatim): *"Morph is a static ability that functions in any zone from which you could play the card it's on, and the morph effect works any time the card is face down. 'Morph [cost]' means 'You may cast this card as a 2/2 face-down creature with no text, no name, no subtypes, and no mana cost by paying {3} rather than paying its mana cost.'"*

**CR 702.37e** (verbatim): *"Any time you have priority, you may turn a face-down permanent you control with a morph ability face up. This is a special action; it doesn't use the stack (see rule 116). To do this, show all players what the permanent's morph cost would be if it were face up, pay that cost, then turn the permanent face up. [...] Any abilities relating to the permanent entering the battlefield don't trigger when it's turned face up and don't have any effect, because the permanent has already entered the battlefield."*

**CR 701.40a** (verbatim): *"To manifest a card, turn it face down. It becomes a 2/2 face-down creature card with no text, no name, no subtypes, and no mana cost. Put that card onto the battlefield face down. That permanent is a manifested permanent for as long as it remains face down."*

**CR 701.40b** (verbatim): *"Any time you have priority, you may turn a manifested permanent you control face up. This is a special action that doesn't use the stack (see rule 116.2b). To do this, show all players that the card representing that permanent is a creature card and what that card's mana cost is, pay that cost, then turn the permanent face up."*

**CR 708.3** (verbatim): *"Objects that are put onto the battlefield face down are turned face down before they enter the battlefield, so the permanent's enters-the-battlefield abilities won't trigger (if triggered) or have any effect (if static)."*

**CR 708.8** (verbatim): *"As a face-down permanent is turned face up, its copiable values revert to its normal copiable values. Any effects that have been applied to the face-down permanent still apply to the face-up permanent. Any abilities relating to the permanent entering the battlefield don't trigger and don't have any effect, because the permanent has already entered the battlefield."*

**CR 708.9** (verbatim): *"If a face-down permanent [...] moves from the battlefield to any other zone, its owner must reveal it to all players as they move it."*

## The Pattern

```
CASTING A MORPH:
  You have a card with "Morph [cost]" (e.g., Brine Elemental, Morph {5}{U}{U}).
  Instead of casting it normally:
    Turn it face down.
    Declare: "casting this as a morph."
    Pay {3} (the universal morph casting cost).
    Place it on the stack as a face-down spell.
  When it resolves: enters battlefield as a 2/2 colorless creature.
    No name. No types (except "Creature"). No abilities. No mana cost.
  Opponents see: "a face-down 2/2."
  They do NOT know which card it is.

TURNING A MORPH FACE UP:
  Special action: doesn't use the stack.
  Any time you have priority: declare which face-down creature you're turning up.
  Reveal the card. Show the morph cost.
  Pay the morph cost.
  Permanent becomes face up with full printed characteristics.
  CRITICAL: ETB abilities DO NOT fire (CR 702.37e, 708.8).
  The creature already entered the battlefield (as a face-down 2/2).
  Turning face up ≠ entering the battlefield.
  "When Brine Elemental enters" trigger: did NOT fire when it entered as a 2/2.
  Does NOT fire when it turns face up.
  However: "When Brine Elemental is turned face up" abilities DO fire.
    Some cards have special "when turned face up" triggered abilities.
    These are distinct from ETB triggers.

MEGAMORPH:
  Like morph but adds a +1/+1 counter when turned face up (if you paid the megamorph cost).
  The counter is placed as part of the face-up procedure.
  "Megamorph {cost}" = "Morph {cost}" + "As this is turned face up, if megamorph cost was paid, put a +1/+1 counter on it."

MANIFEST:
  An effect (not morph ability) puts a card from some zone onto the battlefield face down.
  Most common: "manifest the top card of your library."
  The card becomes a 2/2 face-down creature regardless of its actual card type.
    Even if it's a land card or instant: it's a 2/2 creature while face down.
  Turning face up:
    ONLY if the card is a CREATURE card: pay its mana cost.
    Non-creature cards CANNOT be turned face up (701.40b).
    Exception: a card with morph/disguise that was manifested can be turned up using that cost.
    If you manifested Brine Elemental (creature with morph): you may pay mana cost OR morph cost.
    If you manifested Counterspell (instant): it's a face-down 2/2. Can NEVER be turned up.
    If opponent Path to Exiles it: it goes to exile face down → revealed to all (CR 708.9).
  Manifested sorceries/instants: beware — you spend resources manifesting and might never flip it.

FACE-DOWN CHARACTERISTICS:
  CR 708.2a: face-down permanent = 2/2 colorless creature with:
    No name (for purposes of "search for a creature named X" — it has no name)
    No mana cost (MV = 0)
    No subtypes
    No rules text
    No abilities
  These ARE the copiable values. If someone Clones a face-down creature: they get a 2/2 faceless creature.
    The Clone cannot then be turned face up (it has no morph cost; it's a Clone, not the original card).

WHAT EFFECTS SEE:
  Face-down permanents are 2/2 colorless creatures.
  "Destroy all blue creatures" → doesn't destroy face-down morphs (they're colorless).
  "Destroy all creatures with flying" → doesn't destroy face-down morphs (no flying).
  "Destroy all creatures with power 2 or less" → destroys face-down morphs (they're 2/2).
  "All creatures get +1/+1" → face-down morphs benefit (they become 3/3 face-down).
  Counter-manipulation: +1/+1 counters placed on a face-down morph stay when it flips up.
    If you proliferate 3 counters onto a face-down morph, then flip it: it keeps those counters.

MULTI-MORPH AND DIFFERENTIATION:
  CR 708.6: you must keep track of which face-down permanent is which.
  "Which one entered first?" — relevant for some effects.
  "Which one attacked last turn?" — relevant for evasion/combat history.
  You may look at your own face-down permanents at any time (CR 708.5).
  Opponents may NOT look at your face-down permanents.

LEAVING THE BATTLEFIELD:
  CR 708.9: when a face-down permanent leaves the battlefield (any zone), reveal it.
  This is mandatory: you must show what card it was.
  Exceptions: player leaving the game also reveals all their face-down cards.
  End of game: reveal all face-down cards.

IXIDRON (unique effect):
  Ixidron ({4}{U}{U}) "As this creature enters, turn all other nontoken creatures face down."
  ETB: turns ALL other nontoken creatures face down simultaneously.
  These creatures didn't "morph" — they were turned face down by an ability.
  They cannot be turned face up via morph cost (they might not have morph).
  They have NO morph cost (unless the card has morph printed on it).
  They can be turned face up if you have a separate effect.
  Critical: this "freezes" opponent's creatures as 2/2s with no abilities.
  Legendary creatures turned face down: they have no name → legend rule doesn't apply.
  (Two legendary creatures turned face down by Ixidron aren't "same name" — they have no name.)
  When they leave the battlefield: each is revealed.

DISGUISE (Outlaws of Thunder Junction era):
  Disguise is to morph what megamorph is to morph — a variant.
  "Disguise [cost]": cast face down for {3}. Turn up for the disguise cost.
  Additionally: face-down permanents with disguise have ward {2} (opponents must pay {2} to target them).
  This provides more protection for the face-down creature.
```

## Definitive Conclusions

- **Face-down permanents are 2/2 colorless creatures with no abilities** — they aren't affected by "all creatures with [keyword] get..." effects.
- **Turning face up does NOT trigger ETB abilities** — the creature already entered the battlefield.
- **Manifested non-creature cards can never be turned face up** — instants/sorceries are stuck as 2/2s.
- **Face-down permanents reveal when leaving the battlefield** — hidden information is only on the battlefield.
- **Counters and damage apply to face-down creatures normally** — they persist when the permanent is turned face up.
- **You can look at your own face-down permanents at any time** — opponents cannot.

## Canonical Example
**Brine Elemental + Vesuvan Shapeshifter Lock:**
Board: you control Brine Elemental ({4}{U}{U}: 5/4, Morph {5}{U}{U}).
"When Brine Elemental is turned face up, each opponent skips their next untap step."
You also control Vesuvan Shapeshifter ({4}{U}: "At the beginning of your upkeep, you may have this creature become a copy of target face-down creature you control, except it's still a Vesuvan Shapeshifter.").
Turn 1 of lock: Turn Brine Elemental face up → trigger: opponent skips their next untap step.
Brine Elemental is now face up (its full 4/4 characteristics are public).
Turn 2 upkeep: Vesuvan Shapeshifter's triggered ability: "become a copy of target face-down creature."
You have the Brine Elemental face up... so you can't target it (it's face-up).
INSTEAD: cast ANOTHER Brine Elemental face down for {3} (or recast original if it died).
Better: use the Shapeshifter to copy the face-down Brine Elemental.
Shapeshifter becomes a Brine Elemental copy (face-down). At will: turn the Shapeshifter face up.
Trigger: opponent skips their next untap step again.
Then at beginning of NEXT upkeep: Shapeshifter copies the face-down Brine Elemental again.
Repeat: lock the opponent's untap step every turn. Infinite soft lock.
Opponent can't untap → can't attack → can't generate mana effectively → helpless.
Morph interaction: the ETB of Brine Elemental ("when it enters") didn't fire when it entered face-down.
But "when turned face up" fires each time it's flipped. This is the key distinction.

**Example 2 — Manifest vs. Sweep:**
Board: Forest Dryads player. You have Mastery of the Unseen ({1}{W}: "Whenever you cast a face-down creature spell, manifest the top card of your library.").
Turn 3: cast Deathmist Raptor (has morph {2}{G}) face down for {3}.
Mastery of the Unseen triggers: manifest top card of library. Top card: Leyline of Sanctity (enchantment, {2}{W}{W}).
Leyline enters as a 2/2 face-down creature (manifest). It's a non-creature card.
Opponent casts Wrath of God (destroy all creatures, can't be regenerated):
ALL your creatures (including both face-down morphs/manifests) are destroyed.
The Deathmist Raptor dies → its morph ability was dormant (face down). No ETB trigger.
The Leyline manifest dies → revealed as Leyline of Sanctity (not a creature card).
Both revealed as they leave the battlefield (CR 708.9).
You thought you were bluffing. Now both cards are revealed and gone.
Key lesson: when face-down permanents die, they reveal — the "hidden information" advantage ends.
Can you turn the Leyline face up before the Wrath resolves? NO — Leyline is not a creature card.
It's forever stuck as a face-down 2/2 until it dies and reveals.

## Commonly Confused With
- **P314 (Copy Effects)** — Copying a face-down creature gives the copy's controller a face-up 2/2 clone (the Clone is face-up but copies the face-down characteristics). The Clone can't be turned face up by morph cost.
- **P311 (New Object Rule)** — When a face-down permanent is turned face up, it does NOT become a new object. It keeps all counters, damage marks, and applied effects. Zone change would create a new object; face-up transition does not.
- **P303 (Split Second)** — Turning a morph face up is a special action; split second says "players can't cast spells or activate abilities that aren't mana abilities." Turning a morph face up is a SPECIAL ACTION (not a spell or ability) — you CAN turn a morph face up while a split-second spell is on the stack.
- **P002 (Replacement vs. Triggered)** — Morph's "cast as a 2/2" is a replacement effect (modifies how the card is cast); "when turned face up" abilities are triggered abilities that fire later.
