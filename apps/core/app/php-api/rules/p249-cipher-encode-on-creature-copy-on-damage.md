---
id: p249
name: Cipher — Encode Spell on a Creature, Copy When It Deals Combat Damage
category: zones
cr_refs: [702.99a, 702.99b, 702.99c]
tags: [cipher, encode, exile, combat-damage, copy, Ravnica-Gatecrash, Dimir, Hands-of-Binding, Shadow-Slice, Stolen-Identity]
created: 2026-03-28
examples_count: 2
---

# P249 — Cipher — Encode Spell on a Creature, Copy When It Deals Combat Damage

## Abstract
Cipher appears on instant/sorcery spells and creates a two-part effect: first the spell does its normal thing, and then (if it's a card, not a copy) you may exile it encoded on a creature you control. While encoded, that creature gains a triggered ability: whenever it deals combat damage to a player, you may copy the encoded spell and cast the copy for free. The cipher card persists in exile as long as the creature remains on the battlefield, giving you repeated free spell copies every time the creature connects. Cipher is a Dimir (blue/black) mechanic from Gatecrash, emphasizing "unblockable creature + powerful recurring spell."

## The Definitive Rules

**CR 702.99a** (verbatim): *"Cipher appears on some instants and sorceries. It represents two abilities. The first is a spell ability that functions while the spell with cipher is on the stack. The second is a static ability that functions while the card with cipher is in the exile zone. 'Cipher' means 'If this spell is represented by a card, you may exile this card encoded on a creature you control' and 'For as long as this card is encoded on that creature, that creature has "Whenever this creature deals combat damage to a player, you may copy the encoded card and you may cast the copy without paying its mana cost."'"*

**CR 702.99b** (verbatim): *"The term 'encoded' describes the relationship between the card with cipher while in the exile zone and the creature chosen when the spell represented by that card resolves."*

**CR 702.99c** (verbatim): *"The card with cipher remains encoded on the chosen creature as long as the card with cipher remains exiled and the creature remains on the battlefield. The card remains encoded on that object even if it changes controller or stops being a creature, as long as it remains on the battlefield."*

## The Pattern

```
CIPHER SEQUENCE:
  1. Cast the cipher spell normally (it has its main effect)
  2. As the spell resolves: "if this spell is represented by a card" (not a copy of a spell)
  3. May exile the card encoded on a creature you control
  4. The creature gains: "whenever this creature deals combat damage to a player, you may copy the encoded card and cast it for free"
  5. Each time the creature connects: free copy of the encoded spell fires

CIPHER + "IF REPRESENTED BY A CARD":
  If the cipher spell itself is already a COPY: can't encode (copies aren't cards)
  If you copy a cipher spell (e.g., with Fork) and the copy resolves: no encoding (it's a copy)
  Only the ORIGINAL CARD can be encoded
  This prevents infinite encoding loops from copies

CIPHER + ENCODED CREATURE REQUIREMENTS:
  Must be a creature you CONTROL when encoding
  The creature doesn't need any special abilities
  Best: creatures with evasion (flying, unblockable, shadow, etc.) to ensure repeated triggering
  Invisible Stalker ({1}{U}): 1/1 Hexproof, can't be blocked → guaranteed combat damage each turn → encode here for guaranteed cipher copies

CIPHER + CREATURE LEAVING BATTLEFIELD:
  CR 702.99c: card remains encoded while the creature stays on battlefield
  If the creature dies/is exiled/bounced: the encoded card is no longer encoded on anything
  The cipher card remains in exile but is no longer attached to a creature
  It can't be "re-encoded" unless the original spell is cast again (it's in exile now)
  Creature bounced: cipher card is "floating" in exile with no creature — loses its trigger
  Creature returns to battlefield: it's a new object — doesn't have the encoding (encoding was on the old object)

CIPHER + CONTROL CHANGE:
  CR 702.99c: "even if it changes controller" — the encoding persists through control changes
  If opponent takes control of your encoded creature: THEY can trigger the cipher (it deals damage to a player)
  But: "you may copy and cast" — who is "you"? The creature's controller? Or the card controller?
  The cipher gives the creature a triggered ability: the creature's controller would choose to copy/cast
  If opponent controls the creature: they control the encoded ability and could cast your cipher spell for free!
  Typically: don't encode on creatures opponent might steal

CIPHER + COPY CASTING:
  Each combat damage trigger: "copy the encoded card and cast the copy for free"
  Free = without paying its mana cost
  Cast the copy at that time (during the triggered ability's resolution)
  This is a TRIGGERED ability from exile zone: cipher copies are free casts

CIPHER CARDS (Gatecrash):
  Hands of Binding ({1}{U}): "Tap target creature an opponent controls. That creature doesn't untap during its controller's next untap step. Cipher."
    Encode on Invisible Stalker: each turn Stalker deals damage → Hands of Binding copy → tap a creature indefinitely.
    Multiple creatures tapped: effectively a soft lock on opponent's blockers.

  Shadow Slice ({4}{B}): "Target player loses 3 life. Cipher."
    Encode on unblockable creature: each combat → 3 life drain.
    Combines with Dimir aggressive strategy.

  Stolen Identity ({4}{U}{U}): "Create a token that's a copy of target artifact or creature. Cipher."
    Encode on evasion creature: each combat → copy a key creature or artifact.
    Build an army of copies of opponent's best permanent.

CIPHER + UNBLOCKABLE/EVASION:
  The most powerful cipher setup: encode on a creature that always deals combat damage
  Invisible Stalker (hexproof, unblockable): cipher fires every turn guaranteed
  Shadow creatures: cipher fires unless opponent also has shadow
  Flying creatures: fires unless opponent has flying blockers

CIPHER + MULTIPLE ENCODINGS:
  Can you encode multiple cipher spells on the same creature?
  Nothing prevents it: the creature gains multiple triggered abilities
  Each combat damage trigger fires for each encoded spell
  Two cipher cards on Invisible Stalker: each combat → resolve both free copies
```

## Definitive Conclusions

- **Cipher encodes the spell card** on a creature; the creature gains a triggered ability to copy the spell on combat damage.
- **Only the original card can be encoded** — copies of cipher spells can't trigger encoding.
- **Creature leaving the battlefield ends the encoding** — the card stays in exile but loses its trigger.
- **Best on evasion creatures** (hexproof/unblockable) for guaranteed repeated free spells.
- **Control change persists** — if opponent steals your encoded creature, they can trigger your cipher.

## Canonical Example
**Hands of Binding on Invisible Stalker:**
Turn 2: Cast Invisible Stalker ({1}{U}): 1/1 hexproof, can't be blocked.
Turn 3: Cast Hands of Binding ({1}{U}) targeting opponent's best creature: tap it, it doesn't untap next turn.
Cipher: exile Hands of Binding encoded on Invisible Stalker.
Invisible Stalker gains: "whenever this creature deals combat damage to a player, you may copy Hands of Binding and cast it for free."
Turn 4: Invisible Stalker attacks, can't be blocked: deals 1 damage to opponent.
Copy Hands of Binding: tap opponent's next biggest creature (it doesn't untap next turn).
Turn 5: Stalker attacks again → copy Hands again → tap another creature.
Each turn: soft-lock one of opponent's creatures permanently.
After 4 turns: 4 of opponent's creatures are tap-locked. They have nothing to attack or block with.

**Example 2 — Stolen Identity Copy Engine:**
Cast Stolen Identity ({4}{U}{U}): copy target creature (copy opponent's Grave Titan).
Cipher: encode on a 1/1 flying Faerie token.
Each turn the Faerie token deals combat damage: create another copy of Grave Titan.
Over 5 turns: 5 Grave Titan tokens (2/2 zombies included from each Titan's ETB).
Board becomes enormous from recurring free Titan copies.

## Commonly Confused With
- **P238 (Haunt)** — Haunt exiles a card haunting another creature, triggering when that creature DIES; Cipher exiles encoded on a creature, triggering when it DEALS DAMAGE.
- **P211 (Flashback)** — Flashback casts from GY at a cost; Cipher casts COPIES for FREE from exile on combat damage.
- **P215 (Storm)** — Storm copies based on spell count; Cipher copies on repeated combat damage triggers from an encoded creature.
