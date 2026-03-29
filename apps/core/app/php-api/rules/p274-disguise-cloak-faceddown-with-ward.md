---
id: p274
name: Disguise and Cloak — Face-Down Creatures With Ward 2
category: zones
cr_refs: [702.168a, 702.168b, 702.168c, 702.168d, 702.168e, 702.168f, 708.1, 708.2]
tags: [disguise, cloak, face-down, morph, ward-2, 2/2, manifest, Outlaws-of-Thunder-Junction, March-of-the-Machine, Wanderer-in-the-Wilds, Riku-of-Many-Paths, Raksha-Golden-Cub]
created: 2026-03-29
examples_count: 2
---

# P274 — Disguise and Cloak — Face-Down Creatures With Ward 2

## Abstract
Disguise and Cloak are modern variants of the classic Morph mechanic. Both put cards face-down as 2/2 creatures, but with an added Ward {2} protection — unlike original Morph (which had no ward). **Disguise**: a keyword on individual cards allowing them to be cast face-down for {3} (with Ward {2}), and turned face-up for their printed disguise cost. **Cloak**: an effect that puts a card face-down as a 2/2 creature with Ward {2} and manifests it — similar to Manifest but with the Ward protection. Both interact with the face-down object rules (CR 708) where face-down permanents are generic 2/2 creatures with no name, no subtypes, no abilities (except the given ones), and no mana cost.

## The Definitive Rules

**CR 702.168a** (verbatim): *"Disguise is a static ability that functions in any zone from which you could play the card it's on, and the disguise effect works any time the card is face down. 'Disguise [cost]' means 'You may cast this card as a 2/2 face-down creature with ward {2}, no name, no subtypes, and no mana cost by paying {3} rather than paying its mana cost.'"*

**CR 702.168b** (verbatim): *"To cast a card using its disguise ability, turn the card face down and announce that you are using a disguise ability. It becomes a 2/2 face-down creature card with ward {2}, no name, no subtypes, and no mana cost. Any effects or prohibitions that would apply to casting a card with these characteristics (and not the face-up card's characteristics) are applied to casting this card... When the spell resolves, it enters the battlefield with the same characteristics the spell had."*

**CR 702.168d** (verbatim): *"Any time you have priority, you may turn a face-down permanent you control with a disguise ability face up. This is a special action; it doesn't use the stack (see rule 116). To do this, show all players what the permanent's disguise cost would be if it were face up, pay that cost, then turn the permanent face up."*

## The Pattern

```
DISGUISE (on a card):
  The card has "Disguise [cost]" printed on it
  Casting option: cast face-down as a 2/2 Creature with ward {2} for generic {3}
  While face-down: it has NO name, NO subtypes, NO abilities, NO mana cost
  The ONLY exception: it has ward {2} (from the disguise mechanic)
  Turn face up: pay the disguise cost (printed in the card text) → becomes its true face-up self
  Turning face up is a special action (doesn't use the stack, can be done any time you have priority)

  DISGUISE WARD 2:
    While face-down with disguise: it has ward {2}
    Any spell or ability that would target it: opponent must pay {2} more or the spell/ability is countered
    Protection: face-down disguised creatures can't be trivially removed (unlike original Morph)
    Opponent must pay {2} extra per targeting attempt
    Still vulnerable to non-targeting effects (Wrath of God, Supreme Verdict, etc.)

  DISGUISE vs MORPH:
    Morph (P050): face-down for {3}, no ward, turn face-up for morph cost
    Disguise: face-down for {3} WITH ward {2}, turn face-up for disguise cost
    Disguise is strictly better protection during the face-down phase

  DISGUISE TURN FACE UP:
    Timing: any time you have priority (including opponent's turn, during combat)
    Special action: doesn't go on the stack — immediate, can't be responded to
    Pay the disguise cost: the permanent flips to its face-up state
    ETB abilities do NOT re-trigger (the permanent was already on the battlefield)
    "When this permanent enters" abilities: already fired when it entered face-down — don't fire again
    Note: some disguise cards have "when this is turned face up" abilities (not ETB)

  DISGUISE + FACE-DOWN RULES (CR 708):
    All face-down permanents are 2/2 creatures with no name, no subtypes, no mana cost, no abilities
    Except: they have whatever the turning-face-down mechanism provides (ward {2} for disguise)
    Opponents can see the number of face-down permanents but not what they are
    Disguise permanents all look the same to opponents (2/2 creature with ward {2})

  DISGUISE NOTABLE CARDS (Outlaws of Thunder Junction, Outlaws...):
    Wanderer in the Wilds ({4}{G}{G}, 5/5 Trample with "when turned face up, put 3 +1/+1 counters"):
      Disguise {3}: cast face-down as 2/2 with ward {2}.
      Turn face-up: pay {4}{G}{G} (full cost?) → becomes 5/5 Trample + gets 3 counters (8/8 Trample).
      OR: the disguise cost might be a reduced version.

    Riku of Many Paths ({2}{U}{R}{G}, Legendary Creature, Disguise {U}{R}{G}):
      Cast face-down for {3}. Turn face-up for {U}{R}{G} (3 mana, specific colors).
      "When Riku of Many Paths is turned face up, copy target instant or sorcery."
      Deploy Riku face-down → wait → flip at the right moment when a powerful spell is on stack.
      Ward {2} protects while waiting for the perfect moment to flip.

CLOAK (Effect):
  Cloak is not a keyword on cards — it's an effect that can be applied
  "Cloak [a card]" means: put the card face-down as a 2/2 creature with ward {2}
  Similar to Manifest (put top of library face-down as 2/2 creature)
  But Cloak adds ward {2} — Manifest doesn't have ward

  CLOAK vs MANIFEST:
    Manifest: face-down, no ward, can turn face-up if it's a creature card (pay mana cost)
    Cloak: face-down WITH ward {2}, same face-up rules as manifest (if creature card, pay mana cost)

  CARDS THAT CLOAK:
    March of the Machine has cards that cloak permanents or cards from libraries
    "Cloak the top card of your library" = put it face-down as 2/2 ward {2} creature
    If that card is a creature: can turn it face-up by paying its mana cost

  CLOAK + NON-CREATURE CARDS:
    Just like Manifest: a non-creature card cloaked is face-down
    Can't be turned face-up using the normal method (must have a creature card to turn up for mana cost)
    Can be flipped face-up by other effects: disguise ability (if it has one) or specific effects
    If it's a creature card and you cloak it: you can pay its mana cost to flip it (like manifest)

FACE-DOWN INFORMATION RULES:
  Players may note information about their face-down cards for their own reference
  Opponents know: there's a face-down permanent with ward {2} (if disguise/cloak), 2/2 creature
  Opponents don't know: which specific card it is
  Public information: the number and existence of face-down permanents
  Not public: the identity of the specific face-down card
  When a face-down permanent leaves the battlefield: it's revealed (placed face-up in GY, etc.)

DISGUISE + "AS THOUGH FACE UP":
  Some effects refer to face-down permanents "as though face up"
  Or reveal the face-down permanent to check if conditions are met
  These are specific effects that bypass the normal hidden information rules
```

## Definitive Conclusions

- **Disguise casts face-down as a 2/2 with Ward {2}** — better protection than classic Morph while face-down.
- **Turning face-up is a special action** — immediate, non-stackable, opponent can't prevent it mid-action.
- **ETB abilities don't re-trigger when turning face-up** — only "when turned face up" triggers fire.
- **Cloak is an effect (not a keyword)** that puts a card face-down with Ward {2} — like a warded Manifest.
- **All face-down permanents are identical information to opponents** — a 2/2 creature with ward {2}, no distinguishing features visible.

## Canonical Example
**Riku of Many Paths Disguise Flip Timing:**
Turn 3: cast Riku face-down ({3}). Enters as 2/2 with Ward {2}.
Opponent doesn't know what the face-down creature is.
Turn 5: opponent casts their most powerful instant (Cyclonic Rift for 7 mana).
After Cyclonic Rift is on the stack: you have priority.
Pay {U}{R}{G}: turn Riku face-up (special action, doesn't use the stack).
"When Riku of Many Paths is turned face up, copy target instant or sorcery."
Target: Cyclonic Rift (your opponent's own spell on the stack).
Riku's trigger resolves: copy of Cyclonic Rift (you control the copy, choose new targets for it).
Your copy of Cyclonic Rift bounces opponent's permanents; original still resolves normally.
You copied their board-wipe for {U}{R}{G} by hiding Riku face-down until the perfect moment.

**Example 2 — Disguise Ward Protection:**
You have three face-down creatures (all disguise/cloak).
Opponent wants to target one with a removal spell.
They must pay {2} extra (ward {2}) for each targeted face-down creature.
Targeting all three: they'd need 3 × {2} = {6} extra mana on top of the removal costs.
The ward makes each one taxing to remove. Opponent focuses resources elsewhere.
Later: turn them face-up at optimal moments — one per turn during opponent's end step.
Disguise creates a "hidden threat" wall where the ward cost deters targeted removal.

## Commonly Confused With
- **P050 (Morph)** — Classic Morph is face-down for {3} with no ward; Disguise adds Ward {2} while face-down. Morph turn-up cost uses "morph [cost]"; Disguise uses "disguise [cost]."
- **P066 (Manifest)** — Manifest puts the top of library face-down; it can be turned up by paying mana cost if it's a creature. Cloak is like Manifest with Ward {2} added.
- **P235 (Epic)** — Epic prevents future spell-casting; Disguise is about face-down casting. Unrelated but both involve locking yourself into a different game mode.
