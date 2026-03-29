---
id: p317
name: Double-Faced Cards — Transform, Modal DFCs, and Meld
category: zones
cr_refs: [701.27a, 701.27f, 712.2, 712.3, 712.8a, 712.8c, 712.8e, 712.9, 712.18, 701.42]
tags: [double-faced-card, DFC, transform, convert, modal-DFC, meld, werewolf, daybound, nightbound, Innistrad, Delver-of-Secrets, Huntmaster-of-the-Fells, Valki, Tibalt, Bruna-Gisela-Brisela, new-object-no, mana-value-front-face]
created: 2026-03-29
examples_count: 2
---

# P317 — Double-Faced Cards — Transform, Modal DFCs, and Meld

## Abstract
Double-faced cards (DFCs) have two faces and can "transform" or "convert" (turn over) to show the other face. There are three kinds: **nonmodal DFCs** (transform when a condition is met), **modal DFCs** (choose which face to cast), and **meld pairs** (two separate cards combine into one). Crucially: **transforming a permanent does NOT make it a new object** (CR 712.18) — effects on it persist. In all zones outside the battlefield and stack, a DFC has only the characteristics of its front face (CR 712.8a). When on the battlefield with the back face up, the back face's characteristics apply but **mana value is calculated from the front face's mana cost** (CR 712.8e).

## The Definitive Rules

**CR 712.8a** (verbatim): *"While a double-faced card is outside the game or in a zone other than the battlefield or stack, it has only the characteristics of its front face."*

**CR 712.8e** (verbatim): *"While a nonmodal double-faced permanent has its back face up, it has only the characteristics of its back face. However, its mana value is calculated using the mana cost of its front face."*

**CR 712.9** (verbatim): *"Only permanents represented by double-faced tokens and double-faced cards that are not meld cards can transform or convert. [...] If a spell or ability instructs a player to transform or convert any permanent that isn't represented by a double-faced token or a double-faced card, nothing happens."*
*Example: "A Clone enters the battlefield as a copy of Wildblood Pack (the back face of a double-faced card). The Clone will be a copy of the Wildblood Pack. Because the Clone is itself not a double-faced card, it can't transform."*

**CR 712.18** (verbatim): *"When a double-faced permanent transforms or converts, it doesn't become a new object. Any effects that applied to that permanent will continue to apply to it."*
*Example: "An effect gives Village Ironsmith (the front face of a double-faced card) +2/+2 until end of turn and then Village Ironsmith transforms into Ironfang. Ironfang will continue to get +2/+2 until end of turn."*

**CR 701.27f** (verbatim): *"If an activated or triggered ability of a permanent that isn't a delayed triggered ability of that permanent tries to transform it, the permanent does so only if it hasn't transformed or converted since the ability was put onto the stack."*

## The Pattern

```
THREE TYPES OF DOUBLE-FACED CARDS:

(A) NONMODAL DFCs (Transform/Convert):
  Two faces. Front face has ability that allows transformation.
  Transform: physical action = turn the card over.
  NOT a new object. Effects persist. (CR 712.18)
  Examples:
    Delver of Secrets ({U}): front = 1/1. "At beginning of upkeep, reveal top card.
      If it's an instant or sorcery, transform this."
    Back: Insectile Aberration: 3/2 Flying. Same creature, now 3/2 with flying.
    Effects applied before transformation still apply after.

  DAYBOUND / NIGHTBOUND (Innistrad mechanic):
    Day/Night is a global game state (not a zone).
    Werewolves and other daybound/nightbound creatures transform based on day/night.
    Day begins: if no spells were cast on previous turn → becomes Night.
    Night begins: if two or more spells cast on turn → becomes Day.
    Cards with daybound: enter front face up only during the day; must immediately
      transform to back face if it's night when they enter.
    Huntmaster of the Fells: transforms to Ravager of the Fells at night → deals 2 damage.

(B) MANA VALUE OF TRANSFORMED PERMANENTS:
  CR 712.8e: back face is up → characteristics are back face's, BUT MV = front face mana cost.
  Example: Delver of Secrets front face: {U}. MV = 1.
    When transformed to Insectile Aberration: still MV 1.
    If someone asks "creatures with MV ≤ 2" — Insectile Aberration qualifies (MV 1).
  Example: Nicol Bolas, the Ravager ({1}{U}{B}{R}): MV 4.
    Transforms to Nicol Bolas, the Arisen (planeswalker back face).
    Back face has no mana cost. But MV is still 4 (calculated from front face mana cost).
  Exception: if someone copies the back face as a permanent, the copy has MV 0.
    (Copied back face = no front face to reference for MV. CR 712.8e exception.)

(C) MODAL DFCs:
  Can be cast as EITHER face. Choose before putting on stack.
  Front is usually a creature/spell. Back is usually a land or alternate permanent.
  Both faces exist but only one can be cast at a time.
  In all zones except battlefield and stack: only front face characteristics apply.
    So Valki, God of Lies // Tibalt, Cosmic Impostor in your hand:
    MV = front face (Valki, {1}{B}) = 2. It's a 2-MV card in hand.
  Casting as the back face (Tibalt):
    You choose to cast Tibalt ({5}{B}{R}) = 7 mana. The spell is Tibalt on the stack.
    The back face characteristics apply while it's on the stack and when it resolves.
    MV of Tibalt on the stack = Tibalt's mana cost ({5}{B}{R}) = 7? No:
    CR 712.8f: modal DFC spell/permanent only has characteristics of the face that's up.
    Tibalt on stack: characteristics of Tibalt face only. MV of back face = its own mana cost.
    (Modal DFCs don't use front-face MV for back-face calculations. Different from nonmodal.)
  Playing as a land: many back faces of modal DFCs are lands.
    Jwari Disruption // Jwari Ruins: front = counter target spell unless {1} paid. Back = land.
    You may play the land face any time you could play a land. No mana cost. Doesn't use mana.

  CASCADE AND MODAL DFCs:
    Classic issue: Tibalt's Trickery (cascade) targets another spell, replaces it with a random
    spell. Players used this to cascade into Emrakul or other bombs.
    The MV question: what does cascade see for a modal DFC?
    Answer: cascade sees the MV of the front face (in library, DFC has front face characteristics).
    Valki ({1}{B}) = MV 2 in library. Cascade from a MV 3 spell can find Valki.
    BUT: when cast for free via cascade, you may cast it as EITHER face (rules evolved over time).
    Current rulings: cascade can cast either face. This is why Tibalt's Trickery combos were banned.

(D) MELD PAIRS:
  Two separate cards that can combine into one.
  Each has a front face (normal card characteristics).
  One card's ability: "Exile this and [counterpart name]. If you controlled them both, put them
    onto the battlefield combined with their back faces up."
  The melded permanent is a SINGLE object represented by TWO physical cards.
  It has only the characteristics of the combined back face.
  MV = sum of the front faces' mana values.
    Bruna, the Fading Light + Gisela, the Broken Blade = Brisela, Voice of Nightmares.
    Bruna MV 7 + Gisela MV 5 = Brisela MV 12.
  Brisela: 9/10 Flying First Strike Vigilance Lifelink. "Your opponent can't cast spells with MV 3 or less."
    This MV 12 bomb suppresses most instants and small creatures.

TRANSFORMING vs. NEW OBJECT RULE:
  CR 712.18: transformation ≠ zone change ≠ new object.
  Counters stay: if Village Ironsmith has a +1/+1 counter when it transforms, Ironfang has it.
  Applied effects stay: a pump effect applied stays.
  Targeting: a spell that targeted the creature before transformation still targets it.
    It's the SAME object; just different face.
  Contrast with morph (P316): turning face up from morph is also NOT a zone change,
    so similar rules apply — but morph ETBs don't fire, and neither do transform ETBs.

COPIES OF BACK FACES (can't transform):
  CR 712.9 + example: Clone copying Wildblood Pack (back face) → Clone becomes a copy.
  The Clone is NOT a double-faced card. Instructions to "transform" the Clone are ignored.
  The Clone can never transform — it's stuck as Wildblood Pack permanently.
  (Or until it leaves or another copy effect overwrites it.)

CASTING A DFC IN BACK FACE (entered transformed):
  Some abilities say "enter the battlefield transformed."
  The permanent enters with its back face up from the start.
  Example: Huntmaster of the Fells has daybound — enters with front face up in day.
    At night: would have nightbound — enters with back face (Ravager of the Fells) up.
  ETBs: if the BACK face has an ETB, it fires when entering with back face up.
    Because "entering the battlefield with back face up" is still entering the battlefield.

MODAL DFC LANDS:
  Playing a modal DFC as a land is a land play (not casting).
  Does not use the stack. Can't be countered.
  The card enters the battlefield as the land face.
  It can still transform if the land face somehow gains a transform ability.
  The land face's characteristics apply on the battlefield.
```

## Definitive Conclusions

- **Transforming doesn't make a new object** — counters, damage, and applied effects persist through transformation (CR 712.18).
- **Outside the battlefield/stack, DFCs have only front face characteristics** — mana value, name, and type in a library, hand, or GY are all front face (CR 712.8a).
- **Nonmodal DFC back face has front face's mana value** — Insectile Aberration is MV 1 even though it has no printed mana cost (CR 712.8e).
- **Copies of back faces can't transform** — they're not double-faced cards; the instruction is ignored (CR 712.9).
- **Modal DFCs can be cast as either face** — choose before putting on the stack.
- **Meld combines two cards into one permanent** — the melded object's MV is the sum of both front faces.

## Canonical Example
**Delver of Secrets in Legacy:**
Turn 1: cast Delver of Secrets ({U}): 1/1. "At the beginning of your upkeep, reveal the top card of your library. If it's an instant or sorcery, transform this."
Turn 2 upkeep: you have Force of Will on top (instant). Trigger fires: transform condition met.
Delver transforms to Insectile Aberration: 3/2 Flying.
The transformation:
  (A) NOT a zone change — same object. Any counters/effects persist.
  (B) MV remains 1 (front face {U}).
  (C) Flying makes it nearly unblockable in many formats.
Legacy: Insectile Aberration + counter-magic represents "Delver" aggro-control strategy.
Opponent Path to Exiles the Aberration: it leaves battlefield → reveals BOTH faces (CR 708.9 applies to DFCs too? No — DFCs aren't face-down. The card goes to exile as Delver of Secrets (front face in GY/exile: CR 712.8a). No reveal needed since it's a public double-faced card.
If Delver had been morphed face-down somehow (unusual): THEN reveal required on leaving.

**Example 2 — Valki as Tibalt via Cascade:**
Opponent builds a Standard deck with Tibalt's Trickery (Cascade, but actually Deflect: counter target spell, then reveal cards until you hit something).
Actually: Cascade is the mechanic that matters.
Build: cast Tibalt's Trickery for its cascade trigger (counters own spell, casts random free spell).
The deck is 4x Tibalt's Trickery + 60 cards with MV ≥ 8.
Cast Tibalt's Trickery (MV 3): cascade triggers. Exile cards until you find a nonland with MV < 3.
Problem: no cards with MV < 3 in the deck.
Instead: include Valki, God of Lies // Tibalt, Cosmic Impostor.
In library: Valki has MV 2 (front face {1}{B}). Cascade from MV 3 can find it (2 < 3).
When casting the found card: you choose to cast it as Tibalt (the MV 7 planeswalker back face).
Turn 1-2: play Tibalt on the battlefield for free. His loyalty: 5. Exile two permanents per turn.
This was a banned interaction. Tibalt's Trickery: banned in Modern, Pioneer.
The pattern: modal DFCs let you "sneak" a high-MV back face through cascade restrictions.
CR principle: cascade sees the card's front face MV in the library; player chooses which face to cast.

## Commonly Confused With
- **P316 (Morph/Manifest)** — Face-down permanents created by morph are NOT double-faced cards. "Turn face up" via morph ≠ "transform." They're different game actions (CR 701.27b). Morph permanents aren't DFCs and can't transform.
- **P311 (New Object Rule)** — Zone changes create new objects; transformation does NOT. This is the critical distinction: a transformed creature retains all attached permanents, counters, and effects, whereas a bounced-and-recast creature loses them.
- **P314 (Copy Effects)** — Copying the back face of a DFC creates a non-DFC permanent with those characteristics; it can't transform (CR 712.9). Copiable values when copying a transformed permanent = the back face's characteristics (plus the front face MV per CR 712.8e handling).
- **P303 (Split Second)** — Some werewolves have triggered transform abilities. Split second says no new spells/abilities; a triggered transform ability that was already triggered WILL STILL RESOLVE despite split second on the stack.
