---
id: p344
name: Split Cards, Double-Faced Cards, and Modal DFCs — Mana Value, Zone Rules, and Cascade Interactions
category: zones
cr_refs: [202.3b, 202.3c, 202.3d, 709.2, 709.3, 709.3b, 709.4, 709.4b, 712.3, 712.8a, 712.8c, 712.8e, 712.8f, 712.11b, 712.11c, 712.12, 712.14, 712.18]
tags: [split-card, double-faced-card, DFC, modal-DFC, MDFC, nonmodal-DFC, transform, convert, mana-value, cascade-interaction, zone-rules, Fire-and-Ice, Valki-Tibalt, Alrund-Cosima, Huntmaster-of-the-Fells, fuse, Bloodbraid-Elf, alternate-faces]
created: 2026-03-29
examples_count: 2
---

# P344 — Split Cards, Double-Faced Cards, and Modal DFCs — Mana Value, Zone Rules, and Cascade Interactions

## Abstract
**Split cards** (e.g., Fire // Ice) exist as one card with two castable halves. In all zones except the stack, they have the combined characteristics of both halves — combined mana cost, combined types, combined abilities. On the stack, only the chosen half's characteristics exist. **Modal double-faced cards (MDFCs)** (e.g., Valki, God of Lies // Tibalt) have two independent faces; you choose which to cast or play as a land. The key rules: (1) **MV of an MDFC back face on stack or battlefield is the FRONT face's mana cost** (for nonmodal DFCs); (2) **MV of an MDFC back face on stack is the BACK face's mana cost** (for modal DFCs, since they're independent faces); (3) **cascade can only find a card whose resulting spell has MV less than the cascade spell** — and for MDFCs, you're limited to the front face, making high-MV back faces (like Tibalt) unreachable through cascade without ruling workarounds.

## The Definitive Rules

**CR 709.4** (verbatim): *"In every zone except the stack, the characteristics of a split card are those of its two halves combined."*

**CR 709.4b** (verbatim): *"The mana value of a split card is the combined mana costs of its two halves. A split card's colors and mana value are determined from its combined mana cost. An effect that refers specifically to the symbols in a split card's mana cost sees the separate symbols rather than the whole mana cost."*

**CR 709.3b** (verbatim): *"While on the stack, only the characteristics of the half being cast exist. The other half's characteristics are treated as though they didn't exist."*

**CR 712.8a** (verbatim): *"While a double-faced card is outside the game or in a zone other than the battlefield or stack, it has only the characteristics of its front face."*

**CR 712.8e** (verbatim): *"While a nonmodal double-faced permanent has its back face up, it has only the characteristics of its back face. However, its mana value is calculated using the mana cost of its front face."*

**CR 712.8f** (verbatim): *"While a modal double-faced spell is on the stack or a modal double-faced permanent is on the battlefield, it has only the characteristics of the face that's up."*

**CR 202.3b** (verbatim): *"The mana value of the back face of a nonmodal double-faced permanent or spell's back face is calculated as though it had the mana cost of its front face."*

**CR 202.3d** (verbatim): *"The mana value of a split card not on the stack or of a fused split spell on the stack is determined from the combined mana costs of its halves. Otherwise, while a split card is on the stack, the mana value of the spell is determined by the mana cost of the half that was chosen to be cast."*

## The Pattern

```
SPLIT CARDS (CR 709):
  One physical card, two halves (e.g., Fire // Ice, Wear // Tear, Assault // Battery).

  CHARACTERISTICS BY ZONE:
    In hand/GY/exile (any zone other than stack): BOTH halves combined (709.4).
    On stack: ONLY the chosen half (709.3b).

  MANA VALUE OF SPLIT CARDS:
    In zones other than stack: COMBINED mana value of both halves (202.3d, 709.4b).
    On stack: mana value of the CHOSEN half only (202.3d).
    Example: Fire // Ice.
      Fire: {R}. Ice: {1}{U}. Combined MV = 1 + 2 = 3.
      In hand: MV = 3 (combined). Color: red AND blue.
      On stack as Fire: MV = 1 (just Fire's cost).
      On stack as Ice: MV = 2 (just Ice's cost).

  CASCADE AND SPLIT CARDS:
    Bloodbraid Elf ({2}{R}{G}) has cascade: exile cards until you find one with MV < 4.
    If you hit a split card (say, Boom // Bust = {1}{R} and {5}{R}):
      Boom: {1}{R} = MV 2. Bust: {5}{R} = MV 6. Combined: MV = 8.
    Cascade requires MV less than the cascade spell's MV (4 for Bloodbraid Elf).
    A split card's MV in exile = combined = 8. That's NOT less than 4.
    Result: Bloodbraid can't cascade into Boom // Bust.
    BUT: if you COULD cascade into it and choose Boom (MV 2): the spell on the stack has MV 2.
    In practice: the card's MV in the cascade zone is checked BEFORE choosing half.
      The combined MV must be less than the cascade spell. Combined MV 10 > 4. No.
    EXCEPTION with Fuse (see below): casting both halves fused uses combined cost/MV.

  FUSE (702.102):
    Some split cards have fuse: you can cast BOTH halves simultaneously for the combined cost.
    On stack as fused: characteristics of BOTH halves combined (709.4d).
    MV of fused spell: combined mana costs.
    Example: Breaking // Entering ({U}{B} // {4}{B}{R}), fused = {U}{B}{4}{B}{R} = MV 8.
    Either half alone: Breaking = MV 2, Entering = MV 6.
    Cascade into Breaking // Entering: MV in exile (not on stack) = 2 + 7 = 9. Not < 4. No cascade.

NONMODAL DOUBLE-FACED CARDS (TRANSFORM/CONVERT) (CR 712.2):
  Cards that transform between two faces (e.g., Huntmaster of the Fells → Ravager of the Fells).
  Front face: card as printed. Back face: transformed state.

  ZONE RULES:
    In hand/GY/exile/library: FRONT FACE ONLY (712.8a). You see the front face's characteristics.
    On stack: FRONT face up by default (712.11). Unless cast "transformed" (rare effects).
    On battlefield front face up: front face characteristics only (712.8d).
    On battlefield back face up: BACK face characteristics, BUT mana value = front face's cost (712.8e).

  MANA VALUE OF BACK FACE (nonmodal DFC):
    Back face has no mana cost of its own. MV always = front face's mana cost (202.3b).
    Example: Huntmaster of the Fells has {2}{R}{G} = MV 4.
      When transformed to Ravager of the Fells: MV is still 4 (front face's MV).
    Example: Insectile Aberration (back face of Delver of Secrets):
      Delver of Secrets: {U} = MV 1.
      Insectile Aberration: MV = 1 (front face).

  TRANSFORMING DOESN'T CREATE A NEW OBJECT:
    When a permanent transforms, it doesn't leave the battlefield (712.18).
    No LTB triggers. No ETB triggers from the back face.
    Effects applied to the front face CONTINUE to apply after transforming.
    Example: Pump spell giving Village Ironsmith +2/+2 → transforms to Ironfang → still has +2/+2.

  COPIES OF BACK FACES:
    A Clone copying the back face of a DFC:
      Clone has MV 0 (it's a copy of the back face, which has no mana cost of its own).
      Clone can't transform (not a DFC itself) (712.9).

MODAL DOUBLE-FACED CARDS (MDFCs) (CR 712.3):
  Two independent faces (e.g., Valki, God of Lies // Tibalt, Cosmic Impostor).
  Chosen face is the face that's cast — the other face doesn't exist on the stack.

  ZONE RULES:
    In hand/GY/exile/library: FRONT FACE only (712.8a).
    On stack: CHOSEN FACE only (712.8f).
    On battlefield: CHOSEN FACE only (712.8f).

  MANA VALUE:
    MDFC mana values are DIFFERENT from nonmodal DFCs:
    In zones other than stack: front face's mana value.
    On stack: mana value of the CHOSEN face.
    Example: Valki, God of Lies // Tibalt, Cosmic Impostor.
      Valki front: {1}{B} = MV 2.
      Tibalt back: {5}{B}{B}{R}{R} = MV 9.
      In hand: MV = 2 (front face only, per 712.8a).
      On stack as Valki: MV = 2.
      On stack as Tibalt: MV = 9.

  CASCADE INTERACTION WITH MDFCs (CRITICAL):
    Cascade checks: find a card with MV less than cascade spell. Then MAY cast it.
    The CARD's MV in exile = front face MV (712.8a).
    Valki // Tibalt in exile: MV = 2 (front face).
    Bloodbraid Elf cascades (finds cards until MV < 4): Valki // Tibalt has MV 2. Found!
    BUT when casting: you must cast it. Which face?
      The card's "face on stack" is determined by your choice of which to cast (712.11b).
      MV restriction for cascade: the RESULTING SPELL must have MV less than cascade spell.
      If you choose Tibalt face: resulting spell has MV 9. That's not < 4. ILLEGAL.
      If you choose Valki face: resulting spell has MV 2. That IS < 4. Legal.
    Result: when cascading into a MDFC, you can ONLY cast the front face (if back face MV is too high).
    Famous scenario: Tibalt (MV 9) can't be cast via Bloodbraid cascade even though the CARD has MV 2.

  PLAYING AN MDFC AS A LAND:
    Some MDFCs have a land face (e.g., Emeria's Call // Emeria, Shattered Skyclave).
    During main phase, empty stack, if you haven't played a land: you may play the land face.
    It enters as a land with the land face's characteristics.
    Playing as land = your one land per turn (unless effects say otherwise).
    Once you choose land face: the creature/sorcery face doesn't exist on the battlefield.

SUMMARY TABLE:
  ┌─────────────────┬──────────────────────────────────────────────────────────────┐
  │ Card Type        │ MV Outside Stack    │ MV on Stack                           │
  ├─────────────────┼──────────────────────────────────────────────────────────────┤
  │ Split Card       │ Combined halves     │ Chosen half only                      │
  │ Non-modal DFC    │ Front face          │ Front face (or front face even if back │
  │ (transform)      │                     │ face up on battlefield)               │
  │ Modal DFC (MDFC) │ Front face          │ Chosen face                           │
  └─────────────────┴──────────────────────────────────────────────────────────────┘
```

## Definitive Conclusions

- **Split cards have combined MV outside the stack** — Fire // Ice has MV 3 in hand/GY, but MV 1 as Fire on the stack or MV 2 as Ice.
- **Non-modal DFC back face MV = front face MV** — Ravager of the Fells always has MV 4 (Huntmaster's cost) even when face up.
- **MDFC back face MV on stack = back face's own mana cost** — Tibalt on the stack has MV 9.
- **Cascade into MDFC: front face MV determines if the card is found; chosen-face MV determines if cast is legal** — you can cascade into Valki/Tibalt (front MV 2), but can only cast the Valki face (back face MV 9 > cascade threshold).
- **Transforming doesn't change zones** — no ETB/LTB triggers fire when a DFC transforms; existing effects continue.
- **DFCs in hidden zones show only their front face** — you can't see the back face when it's in an opponent's hand or library.

## Canonical Example
**Bloodbraid Elf vs. Valki // Tibalt — The Cascade MDFC Trap:**
You cascade with Bloodbraid Elf ({2}{R}{G}, MV 4). Exile cards until you find one with MV < 4.
You exile Valki, God of Lies // Tibalt, Cosmic Impostor from your deck.
In the exile zone (not on stack): MV = 2 (front face, per 712.8a). 2 < 4. Card found.
You "may cast it without paying its mana cost."
Which face can you cast?
  Valki face: {1}{B} = MV 2. Resulting spell has MV 2. 2 < 4. LEGAL to cast.
  Tibalt face: {5}{B}{B}{R}{R} = MV 9. Resulting spell has MV 9. 9 is NOT < 4. ILLEGAL.
Result: you must cast Valki face (or not cast it at all).
Tibalt, despite being the same physical card, can't be accessed through Bloodbraid cascade.

This was a controversial ruling from Kaldheim Standard: early tournament players tried to cascade into Tibalt with smaller cascade spells. The ruling confirmed that the "cast without paying its mana cost" is still constrained by the cascade condition: the resulting spell's MV must be less than the cascade spell's MV.

**Example 2 — Delver of Secrets Transforming — Same Object:**
Delver of Secrets ({U}): 1/1 Wizard. "At the beginning of your upkeep, look at the top card of your library. You may reveal it. If you reveal an instant or sorcery card, transform Delver of Secrets."
You cast Delver on turn 1. It enters as a 1/1 (front face).
You have a Curious Obsession aura enchanting Delver: "+1/+1. Whenever equipped creature attacks, draw a card."
Turn 2: upkeep. You look at top card: Force of Will (instant). Reveal it. Delver transforms to Insectile Aberration (3/2 Human Insect).
Does Curious Obsession fall off? NO — transforming doesn't change zones (712.18). It's the same object. The Aura stays attached.
Insectile Aberration is now 3/2 with +1/+1 from Obsession = 4/3. Attacks → draw a card.
MV of Insectile Aberration: still 1 (Delver's front face mana cost, 202.3b). For cascade purposes (irrelevant here but notable): MV = 1.

If the permanent is destroyed and an opponent casts Clone on it:
Clone says "enters as a copy of a creature on the battlefield."
Clone copies Insectile Aberration (back face characteristics). Clone's MV = 0 (copy of a back face = 0, per 202.3b).
Clone can't transform (not a DFC card itself). It's stuck as Insectile Aberration forever.

## Commonly Confused With
- **P336 (Storm and Cascade)** — Cascade's interaction with MDFCs is the most important: the CARD's MV determines what cascade finds, but the RESULTING SPELL's MV determines if casting is legal. P344 covers the card-type rules; P336 covers cascade mechanics.
- **P003 (Zone Change Identity)** — Nonmodal DFCs that transform stay the same object. MDFCs that are cast on their back face are simply permanents with the back face; no zone change occurs. In both cases, the underlying identity rules from P003 matter for targeting and counters.
- **P004 (Layer System)** — If a DFC is copying another object while also having its own transform ability, layer interactions become complex. The copy effect in layer 1 would override the card's printed characteristics.
- **P329 (Casting Costs)** — MDFC back face "casting without paying its mana cost" (e.g., via cascade) ignores the back face's mana cost entirely. But alternative costs and additional costs still apply.
