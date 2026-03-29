---
id: p204
name: Double-Faced Cards — Transform, Convert, and Zone Characteristics
category: zones
cr_refs: [712.1, 712.2, 712.3, 712.8a, 712.8c, 712.8d]
tags: [double-faced-card, DFC, transform, convert, front-face, back-face, modal-DFC, werewolf, innistrad]
created: 2026-03-28
examples_count: 2
---

# P204 — Double-Faced Cards — Transform, Convert, and Zone Characteristics

## Abstract
Double-faced cards (DFCs) have a front face and a back face instead of a normal card back. There are three types: nonmodal DFCs (the original "transforming" type), modal DFCs (two independent castable faces, like Zendikar Rising), and meld cards (two cards that combine into one). In all zones except the battlefield/stack, a DFC has only its front face characteristics. On the battlefield face-up: only that face's characteristics apply. Transforming/converting flips the permanent to its other face. Modal DFCs can have either face cast as the spell. Mana value of a back face spell uses the front face's mana cost.

## The Definitive Rules

**CR 712.1** (verbatim): *"A double-faced card has a Magic card face on one side and either a Magic card face or half of an oversized card face on the other. (It does not have a Magic card back.) There are three kinds of double-faced cards: nonmodal double-faced cards (previously called 'transforming double-faced cards'), modal double-faced cards, and meld cards."*

**CR 712.8a** (verbatim): *"While a double-faced card is outside the game or in a zone other than the battlefield or stack, it has only the characteristics of its front face."*

**CR 712.8c** (verbatim): *"Normally, a nonmodal double-faced spell has its front face up while on the stack and has only the characteristics of its front face. However, if an effect allows a player to cast a nonmodal double-faced card 'transformed' or 'converted,' the resulting spell will have its back face up and have only the characteristics of its back face. Its mana value is calculated using the mana cost of its front face."*

**CR 712.8d** (verbatim): *"While a double-faced permanent has its front face up, it has only the characteristics of its front face."*

## The Pattern

```
DFC TYPES:
  1. NONMODAL DFC (transforming DFC):
     Front face: enters and plays as front face
     Back face: accessed via "transform" or "convert" (or enters transformed)
     Examples: Werewolves (Innistrad), Elspeth (Magic Origins Planeswalker)
     Transform: flip to back face (one-way or two-way depending on card)
     Convert: different action (some DFCs use "convert" to flip)

  2. MODAL DFC:
     Two independent castable faces (either can be cast as a spell)
     Front face: normal casting (front face symbol in upper left)
     Back face: can be cast instead of front face as alternative spell
     Example: Pathway Lands (Clearwater Pathway // Murkwater Pathway)
     Example: Emeria's Call // Emeria, Shattered Skyclave — cast as sorcery OR land
     The caster chooses WHICH face to cast when announcing the spell

  3. MELD CARDS (separate rule, CR 712.4):
     Two separate cards that combine into a single permanent
     Example: Gisela + Bruna → Brisela, Voice of Nightmares

DFC ZONES:
  In any zone except battlefield/stack: only FRONT FACE characteristics
  - DFC in hand: is it a land? creature? — check front face only
  - DFC in graveyard: front face name, type, and mana cost only
  - This matters for: cascade, flashback, Snapcaster Mage's ability, etc.
  Exception: modal DFC — either face can be cast, but the card still has front face characteristics in hand

DFC + MANA VALUE OF BACK FACE:
  CR 712.8c: if casting a DFC "transformed/converted" (back face up on stack):
  The MANA VALUE is still calculated from the front face's mana cost!
  Example: Werewolf with front face {1}{R} and back face that has no mana cost:
  When a spell effects Werewolf on the stack at back-face (if somehow allowed): mana value = front face cost
  This prevents infinite-value tricks using 0-cost back faces

DFC + TRANSFORM:
  Transform: turn the permanent to its other face
  "Transform" effects: "transform target permanent" or "this creature transforms"
  The permanent is the SAME object: same counters, attachments, ownership, but face changes
  Daybound/Nightbound (Innistrad DFCs): transform triggered by checking spell cast counts per turn

DFC + WEREWOLVES (DAYBOUND/NIGHTBOUND):
  Werewolf DFCs: front face (human) and back face (wolf form)
  Daybound: "at the beginning of each upkeep, if a player cast no spells on the previous turn, transform this"
  Nightbound: "at the beginning of each upkeep, if a player cast two or more spells on the previous turn, transform this"
  These are automatic transform triggers based on game state

DFC + PLANESWALKERS (MAGIC ORIGINS):
  Several Origins Planeswalkers: creature front, planeswalker back
  Jace, Vryn's Prodigy: 0/2 Wizard on front. When 5+ cards in graveyard and ability used: exiles itself, returns as transformed (Planeswalker back)
  The PW back face has loyalty but starts with specific counters

DFC + LANDS (MODAL DFC):
  Pathway lands: each side is a land (produces different mana)
  Only one face is active at a time — you cast/play it as the face you want
  Once on battlefield: can't switch faces (not a transforming DFC)

DFC IN GRAVEYARD + SNAPCASTER:
  Snapcaster Mage targets a spell in your graveyard
  DFC in graveyard: only front face characteristics (CR 712.8a)
  Only the front face can be targeted and get flashback via Snapcaster
```

## Definitive Conclusions

- **DFCs have only front face characteristics** in all zones except battlefield/stack.
- **Transforming DFCs**: transform to back face on battlefield; same object, different face.
- **Modal DFCs**: choose which face to cast; two fully independent spell options.
- **Back face mana value** = front face's mana cost (prevents CMC tricks with 0-cost back faces).
- **Meld cards** are DFCs that require two separate cards to combine.

## Canonical Example
**Jace, Vryn's Prodigy // Jace, Telepath Unbound:**
Cast front face (0/2 Jace creature) for {U}{U}.
Ability: "Tap: draw, discard. Then if 5+ cards in graveyard, exile this, return as Jace, Telepath Unbound."
After condition met: Jace exiles himself, re-enters as transformed Planeswalker.
On the stack (the original cast): front face {U}{U} mana value = 2.
In graveyard (if somehow there): front face characteristics (creature, not planeswalker).

**Example 2 — Emeria's Call (Modal DFC):**
Front face: Emeria's Call — {4}{W}{W}{W} sorcery, creates Angels.
Back face: Emeria, Shattered Skyclave — basic Plains land.
Cast the sorcery side: pay {4}{W}{W}{W}, make Angels.
OR: play it as a land (the back face — Emeria, Shattered Skyclave enters tapped, produces {W}).
In hand: front face characteristics (it's counted as a sorcery for card type purposes in hand).
The modal DFC choice is made when casting/playing.

## Commonly Confused With
- **P148 (Morph)** — Morph creates face-down creatures from any card. DFCs have two faces visible but only one active at a time.
- **P186 (Disguise)** — Disguise is face-down casting. DFCs transform on the battlefield.
- **P203 (Split Cards)** — Split cards have two halves on one card, both castable independently. DFCs have a front and back face.
