---
id: p492
name: Disguise and Collect Evidence — Ward-Protected Face-Down Casting and Graveyard-Exile Cost
category: costs
cr_refs: [702.168a, 702.168b, 702.168c, 702.168d, 702.168f, 701.59a, 701.59b, 701.59c, 708]
tags: [disguise, collect-evidence, face-down, ward-2, morph-comparison, special-action, mkm, murders-at-karlov-manor, alternative-cost, graveyard-exile, mana-value, Hunted-Bonebrute, Axebane-Ferox, Forensic-Researcher, Deadly-Cover-Up, Coveted-Falcon, ward-cost, cloak-interaction]
created: 2026-03-30
examples_count: 3
---

# P492 — Disguise and Collect Evidence — Ward-Protected Face-Down Casting and Graveyard-Exile Cost

## Abstract
**Disguise** (Murders at Karlov Manor, 2024; CR 702.168) is the successor to Morph: you may cast a card face down for {3} as a 2/2 with no name, no subtypes, and no mana cost — but unlike Morph, a Disguised permanent also has **ward {2}** while face-down, protecting it from targeted spells. Turning it face up is a special action (not a spell, can't be responded to). **Collect Evidence N** (CR 701.59) is a keyword action used as an additional cost or Ward cost: exile cards from your graveyard with total mana value N or greater. You choose how many cards to exile and which ones — you can exile more than needed. Collect Evidence cannot be partially paid; if you can't meet the MV threshold, you simply can't use it.

## The Definitive Rules

**CR 702.168a** (verbatim): *"Disguise is a static ability that functions in any zone from which you could play the card it's on, and the disguise effect works any time the card is face down. 'Disguise [cost]' means 'You may cast this card as a 2/2 face-down creature with ward {2}, no name, no subtypes, and no mana cost by paying {3} rather than paying its mana cost.'"*

**CR 702.168b** (verbatim): *"To cast a card using its disguise ability, turn the card face down and announce that you are using a disguise ability. It becomes a 2/2 face-down creature card with ward {2}, no name, no subtypes, and no mana cost... The disguise effect applies to the face-down object wherever it is, and it ends when the permanent is turned face up."*

**CR 702.168d** (verbatim): *"Any time you have priority, you may turn a face-down permanent you control with a disguise ability face up. This is a special action; it doesn't use the stack (see rule 116). To do this, show all players what the permanent's disguise cost would be if it were face up, pay that cost, then turn the permanent face up... Any abilities relating to the permanent entering the battlefield don't trigger when it's turned face up and don't have any effect, because the permanent has already entered the battlefield."*

**CR 701.59a** (verbatim): *"To 'collect evidence N' means to exile any number of cards from your graveyard with total mana value N or greater."*

**CR 701.59b** (verbatim): *"If a player is given the choice to collect evidence but is unable to exile cards with total mana value N or greater from their graveyard (usually because there aren't enough cards to do so) they can't choose to collect evidence."*

**CR 701.59c** (verbatim): *"A spell that has an ability that allows a player to collect evidence as an additional cost to cast it may have another ability that refers to whether evidence was collected. These abilities are linked. See rule 607, 'Linked Abilities.'"*

## The Pattern

```
DISGUISE vs. MORPH (CR 702.168 vs. 702.36):
  Same:
    Both cost {3} to cast face-down.
    Both are 2/2 face-down creatures with no name, no subtypes, no mana cost (colorless, MV 0).
    Turning face-up is a special action — doesn't use the stack, can't be responded to.
    ETBs don't trigger on turning face-up (permanent was already on the battlefield).
    Face-down spell or permanent can be looked at by its controller at any time.

  KEY DIFFERENCES:
    Disguise: face-down permanent has WARD {2}.
      → Targeting a face-down Disguise creature with a spell or ability costs {2} extra.
      → If the opponent doesn't pay {2}, the spell/ability is countered.
    Morph: face-down permanent has no ward — it can be freely targeted.

  Other differences:
    Megamorph (a Morph variant) puts a +1/+1 counter on the creature when turned face-up.
    Disguise has no analogous counter effect.
    Disguise and Cloak interact: if a Disguise card is cloaked, its controller may pay
      the disguise cost to turn it face up (CR 701.58d).

WARD {2} ON FACE-DOWN DISGUISE (CR 702.168a):
  The face-down creature is a 2/2 with ward {2} WHILE face-down.
  Ward {2} means: whenever the face-down creature becomes the target of a spell or ability
    an opponent controls, counter that spell/ability unless its controller pays {2}.
  This makes Disguise creatures significantly harder to kill face-down than Morph creatures:
    → Opponent can't freely Doom Blade your face-down Disguise — it costs {2} extra.
    → But ward {2} is still payable: opponent can pay {2} to successfully target it.
  Note: ward {2} is lost when the creature turns face-up.
    The face-up creature's own ward (if any, from its printed text) applies instead.

TURNING FACE-UP — SPECIAL ACTION (CR 702.168d):
  Special action = doesn't use the stack, can't be responded to.
  You reveal what the permanent IS (show the card), pay the disguise cost, it flips.
  Opponents cannot respond between "I'm turning this face up" and the creature being face-up.
  After flipping, the new characteristics are now active — triggered abilities that care
    about characteristics apply now.
  If a disguised creature loses its abilities while face-down, it CAN'T be turned face-up
    via disguise (because the disguise ability is gone once face-up, and the ability must
    be present face-up to know the cost). Official ruling: "If a face-down creature loses
    its abilities, it can't be turned face up with a disguise ability."

FACE-DOWN CHARACTERISTICS:
  Face-down = 2/2, ward {2}, no name, no subtypes, no mana cost, colorless, MV 0.
  These are copiable values while face-down.
  Copying a face-down Disguise creature copies the face-down characteristics (2/2 ward {2}).
  The copy doesn't know the face-up identity — only what the face-down state is.
  Auras enchanting a face-down creature: if the Aura says "enchant creature with [subtype]"
    and the face-down creature has no subtypes, the Aura falls off via SBA.
  Equipment attached to a face-down creature: stays attached (Equipment doesn't care about subtypes).

COLLECT EVIDENCE N (CR 701.59):
  "Exile any number of cards from your GY with total MV N or greater."
  You choose which cards to exile. You can exile MORE than N total.
  Exiling more is your choice — sometimes useful to thin GY or set up other effects.
  MV of cards:
    Lands: MV 0 (they don't contribute to the threshold meaningfully, but you CAN exile them).
    Split cards: MV is the combined MV of both halves (CR 202.3c).
    Adventure cards in GY: MV is the creature card's MV, not the adventure's.
  "Can't collect evidence": if your GY has only lands and your threshold is N > 0, you
    cannot collect evidence (lands are MV 0; total MV can't reach N).

COLLECT EVIDENCE AS WARD COST (Axebane Ferox):
  "Ward — Collect evidence 4."
  Whenever Axebane Ferox becomes the target of a spell/ability an opponent controls:
    Counter that spell/ability UNLESS that player exiles cards with total MV 4+ from THEIR GY.
  Key: the OPPONENT must collect evidence from their OWN GY, not yours.
  This is powerful: it punishes opponents who've been discarding/milling into their own GY,
    and forces them to exile their own GY to interact with Axebane Ferox.

COLLECT EVIDENCE ON CAST (as additional cost):
  Analyze the Pollen ({G}: "as additional cost, you may collect evidence 8; if evidence was
    collected, search for creature or land instead of just land"):
    If you exile 8+ MV from GY at cast time, you get the enhanced tutor.
    The sacrifice happens as a cost — if the spell is countered, the GY cards are still exiled.
  If you don't collect evidence, the "if evidence was collected" portion is ignored.
```

## Definitive Conclusions

- **Disguise = Morph + ward {2} while face-down** — the defining difference; Morph face-down creatures can be freely targeted; Disguise creatures cost opponents an extra {2} to target, and the spell is countered if they don't pay.
- **Turning a Disguise creature face-up is a special action** — can't be responded to; opponents cannot kill the creature "in response" to the face-up reveal; after the flip, it's face-up with its real characteristics.
- **ETBs don't trigger on face-up** — the permanent is the same object, just revealing itself; "when this creature enters" abilities don't re-fire.
- **Collect Evidence exiles cards permanently** — even if the spell using it is countered; the cards are gone from the GY.
- **Lands contribute MV 0 to Collect Evidence** — exiling a land helps exile a card, but contributes nothing to the MV threshold; you'd need other cards in the GY to reach the threshold.
- **Collect Evidence as Ward** (Axebane Ferox) requires the OPPONENT to exile from their own GY, not yours.

## Canonical Example

**Hunted Bonebrute ({2}{B}: Menace; 6/2; "when this creature enters, target opponent creates two 1/1 white Dog creature tokens; when this creature dies, each opponent loses 3 life"; Disguise {1}{B})**

Cast face-down: pay {3}. 2/2 creature with ward {2}, face-down. Opponents don't know what it is.
Opponent casts Doom Blade targeting it:
  Ward {2} triggers: Doom Blade is countered unless opponent pays {2}.
  Opponent pays {2}: Doom Blade resolves, Hunted Bonebrute is destroyed.
    → Dies trigger: each opponent loses 3 life. (Triggered at face-down, but fires normally.)
  Opponent doesn't pay {2}: Doom Blade is countered. Bonebrute survives.

Turn face-up (when able): reveal card to all players. Pay {1}{B}. Special action — can't be responded to. Bonebrute is now 6/2 menace. "When this creature enters" does NOT trigger — it already entered. Opponent creates no Dog tokens.

Net: you paid {3} + {1}{B} = {4}{B} total for a 6/2 menace that makes opponents lose 3 life on death. No ETB token generation (that only happens when it enters the battlefield, not when turned face-up).

**Example 2 — Collect Evidence Ward (Axebane Ferox):**
Axebane Ferox ({2}{G}{G}: 4/4 Deathtouch; "Ward — Collect evidence 4"):

Opponent tries to target Axebane Ferox with a removal spell.
Ward trigger fires: the spell is countered unless the opponent exiles cards from their OWN graveyard with total MV ≥ 4.
Opponent has in GY: 2x Island (MV 0) and one Lightning Bolt (MV 1).
Total available MV: 0 + 0 + 1 = 1. Not enough to collect evidence 4.
Opponent can't collect evidence → spell is countered.

Opponent has in GY: Counterspell (MV 2) + Brainstorm (MV 1) + Ponder (MV 1) = MV 4.
Exile all three (or any combination totaling ≥ 4) → evidence collected → spell resolves.
Axebane Ferox is destroyed, but the opponent permanently lost three cards from their GY.

**Example 3 — Face-Down Disguise Under Remove-Abilities Effect:**
Your face-down Disguise creature is on the battlefield. Opponent plays Humility ({2}{W}{W}: "all creatures lose all abilities and have base P/T 1/1"). Your face-down creature loses all abilities — including its disguise ability. Now you cannot turn it face-up using the disguise ability (it has no disguise ability to pay). The creature is permanently stranded face-down as a 1/1 with ward {2}... wait: if it loses all abilities, it also loses ward {2}. Under Humility, the face-down creature is just a 1/1 with no abilities and no way to turn face-up. (If Humility were removed, the disguise ability returns and you could turn it face-up again.)

## Commonly Confused With
- **P016 (Morph)** — Disguise is mechanically similar to Morph but with the key addition of ward {2} while face-down. Everything about face-down permanents applies equally to both (MV 0, no name, copiable values, etc.). The face-up turn is a special action in both cases.
- **P470 (Cloak/Manifest Dread)** — Cloak puts a card face-down with ward {2} from another zone (top of library, etc.). Disguise casts the card itself face-down. A Cloaked card with Disguise can be turned face-up by paying its Disguise cost (CR 701.58d).
- **P460 (Suspect)** — Suspect is another MKM mechanic. Suspected creatures have menace and can't block — a completely different effect from Disguise.
- **P485 (Bargain)** — Both Bargain and Collect Evidence involve sacrificing/exiling things as costs. Bargain sacrifices one artifact/enchantment/token; Collect Evidence exiles GY cards to a MV threshold.
