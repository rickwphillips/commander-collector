---
id: p125
name: Bargain — Optional Sacrifice for Spell Bonus
category: costs
cr_refs: [702.166a, 702.166b, 702.166c, 702.166d, 607.2]
tags: [bargain, sacrifice, artifact, enchantment, token, additional-cost, bonus-effect, linked-ability]
created: 2026-03-28
examples_count: 2
---

# P125 — Bargain — Optional Sacrifice for Spell Bonus

## Abstract
Bargain is an optional additional cost: sacrifice an artifact, enchantment, or token as you cast the spell. If you pay this cost, the spell is "bargained" — it gains bonus effects described in the linked ability text. The sacrifice is at-cast time (cost payment), so the permanent is gone before the spell resolves. Bargain abilities are linked to the bargain static ability, so they reference only "if this spell was bargained." The spell still resolves normally even if not bargained, just without the bonus.

## The Definitive Rule

**CR 702.166a** (verbatim): *"'Bargain' means 'As an additional cost to cast this spell, you may sacrifice an artifact, enchantment, or token.' Paying a spell's bargain cost follows the rules for paying additional costs."*

**CR 702.166b** (verbatim): *"If a spell's controller declares the intention to pay that spell's bargain cost, that spell has been 'bargained.'"*

**CR 702.166c** (verbatim): *"Objects with bargain have additional abilities that specify what happens if they were bargained. These abilities are linked to the bargain ability printed on that object: they can refer only to that specific bargain ability."*

## The Pattern

```
BARGAIN — PAYMENT:
  Optional additional cost: sacrifice artifact, enchantment, OR token
  Declared at cast time (when you announce the spell)
  The sacrificed permanent is gone by the time the spell resolves

BARGAIN — BONUS:
  The spell has linked abilities that say "if this spell was bargained, [extra effect]"
  Bargained = you paid the bargain cost (sacrificed the qualifying permanent)
  Not bargained = still resolves normally, just no bonus

WHAT QUALIFIES FOR BARGAIN:
  Artifacts: any artifact permanent you control (including artifact creatures, Equipment)
  Enchantments: any enchantment you control (including Auras, Sagas)
  Tokens: any token you control (any token type — Food, Treasure, creature tokens)
  Must be a permanent you control at time of payment

BARGAIN + LINKED ABILITIES (CR 607):
  The "if this spell was bargained" text is linked to the bargain keyword
  If the bargain ability is removed (e.g., via text change): the linked ability loses its trigger
  The card may also have non-linked abilities that always apply

BARGAIN + TARGETS (702.166d):
  If a bargained-only ability includes targets and the spell was NOT bargained:
  Those targets are not chosen (the spell is cast as if it didn't have those targets)
  → You can't target something for a bonus you're not paying for

BARGAIN + COPY:
  A copy of a bargained spell: is it bargained?
  Copies inherit the status of the original at time of copy
  "Bargained" is a status the original spell has → copies inherit that status

SACRIFICING AN ENCHANTMENT-CREATURE:
  A creature enchanted with an Aura: the Aura is a separate permanent — can sacrifice the Aura (it's an enchantment)
  An enchantment that's also a creature: can sacrifice it (it's an enchantment)

SACRIFICING A CLUE/FOOD/TREASURE/MAP:
  Clue, Food, Treasure, Map tokens are artifacts → qualify for bargain
  Also function as tokens → also qualify as tokens
```

## Definitive Conclusions

- **Bargain sacrifices an artifact, enchantment, or token at cast time (optional).**
- **The spell is "bargained" if you paid — linked bonus abilities apply only then.**
- **Non-bargained cast resolves normally** without the bonus.
- **Targets for bargained-only effects are not chosen if you didn't bargain.**
- **Tokens, Clues, Food, Treasure all qualify** (they are artifacts and/or tokens).

## Canonical Example
**Beseech the Mirror (Bargain + tutor):**
Without bargaining: tutor for a card, put it in hand.
With bargaining (sacrifice an artifact/enchantment/token): tutor for a card with mana value ≤ {4} and cast it for free.
Decision: sacrifice a Treasure token → get a free powerful spell.

**Example 2 — Bargain with Treasure:**
You have a Treasure token and cast a bargain spell.
Pay bargain: sacrifice the Treasure token. The Treasure was an artifact AND a token — qualifies.
The bargain bonus triggers. The Treasure is gone.

## Commonly Confused With
- **P096 (Casualty)** — Casualty sacrifices a creature to copy the spell. Bargain sacrifices artifact/enchantment/token for a bonus effect (not a copy).
- **P125 and P049 (Kicker)** — Both are optional additional costs. Kicker has its own specified cost; bargain specifies a sacrifice.
- **P011 (Linked Abilities)** — Bargain's bonus is linked to the bargain ability via CR 607.
