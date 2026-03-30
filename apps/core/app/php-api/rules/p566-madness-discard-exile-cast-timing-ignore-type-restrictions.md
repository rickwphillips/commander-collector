---
id: p566
name: Madness — Discard-to-Exile, Cast Timing, and Type Restriction Override
category: costs
cr_refs: [702.35, 702.35a, 702.35b, 702.35c, 400.7k]
tags: [madness, discard, exile, cast, alternative-cost, timing, sorcery-speed-override, triggered-ability, graveyard, cost-payment]
created: 2026-03-31
examples_count: 3
---

# P566 — Madness — Discard-to-Exile, Cast Timing, and Type Restriction Override

## Abstract

**Madness replaces discarding with exile, then gives a one-time window to cast the card for its madness cost regardless of timing restrictions.** When a card with madness is discarded, it goes to exile instead of the graveyard (replacement effect). This triggers a madness triggered ability: the owner may cast it for its madness cost or put it into the graveyard. Casting via madness ignores normal timing rules — you can cast a sorcery at instant speed via madness. The madness cost is an alternative cost. If you don't cast it when the trigger resolves, it goes to the graveyard — you don't get another chance. The discard still "counts" as a discard for all purposes: costs are paid, discard triggers fire, and the card was discarded even though it went to exile. The madness triggered ability resolves before the spell/ability the discard paid for.

## The Definitive Rules

**CR 702.35a (Madness):** *"'Madness [cost]' means 'If a player would discard this card, that player discards it, but exiles it instead of putting it into their graveyard' and 'When this card is exiled this way, its owner may cast it by paying [cost] rather than paying its mana cost. If that player doesn't, they put this card into their graveyard.'"*

**CR 702.35b (Alternative Cost):** *"Casting a spell using its madness ability follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

**CR 702.35c (Finding the Card):** *"After resolving a madness triggered ability, if the exiled card wasn't cast and was moved to a public zone, effects referencing the discarded card can find that card."*

**Official Ruling (2022-12-08):** *"A card with madness that's discarded counts as having been discarded even though it's put into exile rather than a graveyard. If it was discarded to pay a cost, that cost is still paid. Abilities that trigger when a card is discarded will still trigger."*

**Official Ruling (2022-12-08):** *"Casting a spell with madness ignores the timing rules based on the card's card type. For example, you can cast a sorcery with madness if you discard it during an opponent's turn."*

**Official Ruling (2022-12-08):** *"If you choose not to cast a card with madness when the madness triggered ability resolves, it's put into your graveyard. Madness doesn't give you another chance to cast it later."*

**Official Ruling (2022-12-08):** *"If you discard a card with madness to pay the cost of a spell or activated ability, that card's madness triggered ability (and the spell that card becomes, if you choose to cast it) will resolve before the spell or ability the discard paid for."*

**Official Ruling (2022-12-08):** *"If you discard a card with madness while a spell or ability is resolving, it moves immediately to exile. Continue resolving that spell or ability, noting that the card you discarded is not in your graveyard at this time. Its madness triggered ability will be placed onto the stack once that spell or ability has completely resolved."*

## The Pattern

```
MADNESS — TWO ABILITIES:

  Ability 1 (Static — Replacement Effect):
    "If you would discard this card, exile it instead"
    - Replaces the destination: graveyard → exile
    - The discard STILL HAPPENED (for all game purposes)
    - Discard triggers fire
    - Costs that require discarding are paid
    - The card is in EXILE (not graveyard) at this point

  Ability 2 (Triggered — Cast Window):
    "When this card is exiled this way, you may cast it
     for [madness cost] or put it into your graveyard"
    - Triggered ability goes on the stack
    - Resolves: one-time choice to cast or graveyard
    - If cast: spell goes on stack (can be countered)
    - If not cast: card goes to graveyard immediately
    - NO second chance — this is the only window

TIMING OVERRIDE:

  Casting via madness ignores card type timing restrictions:
    - Sorcery → can be cast at instant speed
    - Creature → can be cast at instant speed
    - Enchantment → can be cast at instant speed
    - Planeswalker → can be cast at instant speed

  This is because the cast happens during resolution of the
  madness triggered ability, which creates a special permission.

STACK ORDERING:

  Scenario A: Discard as a COST (e.g., activating Putrid Imp or Psychatog):
    Stack (bottom to top):
      1. [Spell/ability that required the discard]
      2. [Madness triggered ability] → resolves first
      3. [Madness spell, if cast] → resolves before #1

    Result: Madness spell resolves BEFORE the ability you discarded for.

  Scenario B: Discard during RESOLUTION (e.g., opponent's spell):
    - Card is exiled immediately during resolution
    - Spell/ability finishes resolving completely
    - THEN madness triggered ability goes on the stack
    - The spell that caused the discard has ALREADY resolved

MADNESS COST IS AN ALTERNATIVE COST:

  - You pay [madness cost] instead of the mana cost
  - Cannot combine with other alternative costs
  - CAN pay additional costs (kicker, etc.)
  - MUST pay mandatory additional costs
  - MV is still determined by the original mana cost (not madness cost)

  Example: Card costs {3}{R}{R} with madness {R}
    → Cast for {R} (madness cost)
    → MV = 5 (from {3}{R}{R}, not {R})

WHAT COUNTS AS A DISCARD:

  Madness triggers only on actual DISCARDS:
    - From your hand to graveyard (that's what discard means)
    - Includes: cleanup step excess, paying discard costs, forced discard

  Does NOT trigger on:
    - Mill (library to graveyard) — not a discard
    - Exile from hand (not a discard unless specifically stated)
    - "Put into graveyard" from zones other than hand
    - Manifest (library to battlefield, not a discard)
    - See P543 for manifest vs discard distinction

DISCARD STILL "COUNTS":

  Even though the card goes to exile:
    - The discard DID happen
    - "Whenever you discard" triggers fire
    - "If you discarded" conditions are met
    - Costs of "discard a card" are paid
    - Cards that count discards see it

  Example: You activate Faithless Looting ("draw 2, discard 2").
    You discard a card with madness and a normal card.
    → Madness card goes to exile (madness replacement)
    → Normal card goes to graveyard
    → You drew 2 and discarded 2 (cost is paid)
    → Madness trigger fires

IF YOU DON'T CAST:

  If you choose not to cast when the trigger resolves:
    → Card goes to your graveyard immediately
    → No more madness window — it's done
    → In the graveyard, it's a normal card
    → Can be cast from graveyard only via other effects (flashback, etc.)

COUNTERING A MADNESS SPELL:

  If the madness spell is countered:
    → Goes to graveyard (normal countering rules)
    → Madness doesn't provide any special protection
    → The discard still counted
```

## Definitive Conclusions

- **Madness exiles instead of graveyard** — but the discard still counts for all purposes.
- **One-time cast window** — if you don't cast when the trigger resolves, it goes to graveyard permanently.
- **Ignores timing restrictions** — sorceries can be cast at instant speed via madness.
- **Madness cost is alternative** — MV uses original mana cost, not madness cost.
- **Madness trigger resolves before the ability you discarded for** — important stack ordering.
- **Only actual discards trigger madness** — not mill, not exile, not "put into graveyard."

## Canonical Example

**Fiery Temper Discarded to Faithless Looting:**

You cast Faithless Looting ({R}, "Draw two cards, then discard two cards"). You draw two. You discard Fiery Temper (madness {R}) and a land.

Fiery Temper's madness replacement: goes to exile instead of graveyard. Land goes to graveyard normally. You discarded two cards (cost paid).

Madness triggered ability fires for Fiery Temper. Faithless Looting is still resolving — the trigger waits. Faithless Looting finishes resolving. Madness trigger goes on the stack.

Madness trigger resolves: you may cast Fiery Temper for {R}. You pay {R} and cast it targeting an opponent's creature. Fiery Temper deals 3 damage. It resolves and goes to graveyard.

**Example 2 — Sorcery at Instant Speed:**

Opponent attacks you during their combat phase. You block, then discard a sorcery-speed card with madness to pay an activation cost.

Madness triggered ability fires. On resolution, you may cast the sorcery for its madness cost — even though it's your opponent's turn and it's the combat phase. Madness overrides timing restrictions. The sorcery goes on the stack and resolves.

**Example 3 — Choosing Not to Cast:**

You discard a card with madness. It goes to exile. Madness trigger fires.

On resolution, you decide not to cast it (maybe you can't pay the madness cost, or you don't want to). The card is put into your graveyard. You cannot use madness on it later — the window is closed. If you want to cast it from the graveyard, you need a separate effect like flashback or Yawgmoth's Will.

## Commonly Confused With

- **P543 (Manifest vs Discard)** — P543 covers why manifest doesn't trigger madness; P566 covers what does trigger madness (only actual discards).
- **P559 (Cascade Free Cast)** — P559 covers cascade's "without paying mana cost"; P566 covers madness's alternative cost (you pay the madness cost, which can differ from both MV and free).
- **P556 (Hideaway Free Cast)** — P556 covers hideaway's conditional play; P566 covers madness's discard-triggered cast window.
