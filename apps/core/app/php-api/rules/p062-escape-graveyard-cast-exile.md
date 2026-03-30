---
id: p062
name: Escape — Graveyard Cast with Exile Cost
category: costs
cr_refs: [702.138a, 702.138b, 702.138c, 702.138d]
tags: [escape, graveyard, exile, alternative-cost, escaped, counters, theros, cast-from-graveyard]
created: 2026-03-28
examples_count: 2
---

# P062 — Escape — Graveyard Cast with Exile Cost

## Abstract
Escape lets you cast a card from your graveyard by paying an alternative cost that typically requires exiling other cards from your graveyard. It functions like flashback and other alternative-cost graveyard casts. A card "escaped" if it was cast from the graveyard using an escape ability — this status matters for some card-specific abilities that say "this permanent escapes with [counters/abilities]." Those are replacement/triggered abilities that only apply when the permanent enters via escape.

## The Definitive Rule

**CR 702.138a** (verbatim): *"Escape represents a static ability that functions while the card with escape is in a player's graveyard. 'Escape [cost]' means 'You may cast this card from your graveyard by paying [cost] rather than paying its mana cost.' Casting a spell using its escape ability follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

**CR 702.138b** (verbatim): *"A spell or permanent 'escaped' if that spell or the spell that became that permanent as it resolved was cast from a graveyard with an escape ability."*

**CR 702.138c** (verbatim): *"An ability that reads '[This permanent] escapes with [one or more of a kind of counter]' means 'If this permanent escaped, it enters with [those counters]' That ability may have a triggered ability linked to it that triggers 'When it enters this way.'"*

## The Pattern

```
ESCAPE SEQUENCE:
  Card with escape is in your graveyard
  Any time you could normally cast it (respecting timing restrictions):
    Pay the escape cost instead of the mana cost
    → Escape cost typically includes exile of other graveyard cards
    → After paying, card is cast from graveyard and put on the stack
  When spell resolves: permanent enters battlefield (or spell effect happens)

ESCAPE COST STRUCTURE:
  Escape costs are typically: {mana cost} + exile N other cards from your graveyard
  The exile is part of the cost (paid when casting)
  Fewer cards in graveyard than required → can't pay escape cost
  After escape: the escaped card enters from graveyard normally

"ESCAPED" STATUS:
  Only relevant if the card has "escapes with [counters/abilities]" text
  These are replacement effects that apply when entering via escape
  Example: Uro, Titan of Nature's Wrath "escapes with five +1/+1 counters"
    → Only gets those counters if it was cast with escape ability
    → Entering via other means (reanimate) → no counters from this ability

ESCAPE VS. FLASHBACK:
  Flashback: spell exiles itself when leaving the stack (countered or resolved)
  Escape: no built-in exile when leaving the stack
  If escape spell is countered: goes to graveyard (not exiled by default)
    → Can escape again! (Unless the card says otherwise)
  This is a key difference from flashback

MULTIPLE ESCAPE ACTIVATIONS:
  Unlike flashback, escape doesn't exile itself on resolution/counter
  Card can be cast with escape multiple times if it keeps returning to graveyard
  (Unless the card has a "exile this instead" clause)

ESCAPE FROM GRAVEYARD ONLY:
  Escape only functions in the graveyard (CR 702.138a)
  Can't escape from library, hand, exile
  The card must actually be in the graveyard
```

## Definitive Conclusions

- **Escape costs are alternative costs.** Pay them instead of the mana cost.
- **Escape cards can be cast multiple times if they return to the graveyard.** No built-in exile-on-resolution like flashback.
- **"Escapes with counters" applies only to escape casts.** Reanimation doesn't grant escape counters.
- **If escape spell is countered:** the spell goes to the graveyard (can escape again).
- **Escape cost often requires exiling other graveyard cards** as part of the cost payment.
- **Non-permanent escape spells return to the graveyard after resolving.** An instant or sorcery cast with escape goes to the graveyard when it resolves (it can escape again later). Permanent escape spells enter the battlefield; if they die they go to graveyard. (Gatherer ruling 2020-01-24)
- **Reanimating a creature bypasses "escaped" status.** "Escaped" means specifically cast from the graveyard using an escape ability. Reanimation and other non-cast methods do not count as "escaped," so abilities like Uro's "sacrifice unless it escaped" still trigger. (Gatherer ruling 2020-01-24)
- **Multiple graveyard-cast permissions (escape + flashback): choose one.** You decide which applies; the others are ignored. (Gatherer ruling 2020-01-24)

## Canonical Example
**Escape to the Wilds (escape {3}{G}{R}, exile five other cards from your graveyard):**
Cast from graveyard by exiling 5 other cards and paying {3}{G}{R}. If countered, the spell goes to graveyard — you can try again next turn if you have enough graveyard cards and mana.

**Example 2 — Uro, Titan of Nature's Wrath (escape with five +1/+1 counters):**
Uro enters graveyard from dying. You cast Uro with escape (pay {1}{G}{U}, exile three other cards). Uro "escaped" → enters battlefield with five +1/+1 counters (from the "escapes with" replacement effect). If you reanimated Uro without escape, it would NOT get the five counters.

## Commonly Confused With
- **P046 (Flashback)** — Flashback exiles itself when leaving the stack. Escape doesn't. A countered escape spell goes to the graveyard; a countered flashback spell is exiled.
- **P051 (Dredge)** — Dredge is a draw replacement that mills and returns. Escape is a graveyard cast with an exile-cards cost. Both use the graveyard but mechanically different.
