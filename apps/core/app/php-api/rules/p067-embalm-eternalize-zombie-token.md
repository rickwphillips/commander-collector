---
id: p067
name: Embalm and Eternalize — Zombie Token from Graveyard
category: zones
cr_refs: [702.128a, 702.128b, 702.129a]
tags: [embalm, eternalize, graveyard, token, zombie, white, black, copy, sorcery-speed, exile-on-activate]
created: 2026-03-28
examples_count: 2
---

# P067 — Embalm and Eternalize — Zombie Token from Graveyard

## Abstract
Embalm and Eternalize are activated abilities that function in the graveyard. They exile the card and create a token copy of it with modifications: Embalm makes it white with no mana cost and adds Zombie type. Eternalize makes it black, 4/4, no mana cost, and adds Zombie type. Both are sorcery-speed only. The resulting tokens are permanent creatures that don't go away unless killed — they're not temporary like encore tokens. The exiled card can't be embalmed/eternalized again.

## The Definitive Rule

**CR 702.128a** (verbatim): *"Embalm is an activated ability that functions while the card with embalm is in a graveyard. 'Embalm [cost]' means '[Cost], Exile this card from your graveyard: Create a token that's a copy of this card, except it's white, it has no mana cost, and it's a Zombie in addition to its other types. Activate only as a sorcery.'"*

**CR 702.129a** (verbatim): *"Eternalize is an activated ability that functions while the card with eternalize is in a graveyard. 'Eternalize [cost]' means '[Cost], Exile this card from your graveyard: Create a token that's a copy of this card, except it's black, it's 4/4, it has no mana cost, and it's a Zombie in addition to its other types. Activate only as a sorcery.'"*

## The Pattern

```
EMBALM/ETERNALIZE SEQUENCE:
  Card in graveyard: pay embalm/eternalize cost + exile the card
  → Activated ability resolves (goes on stack first)
  → Create a token copy of the card with modifications:

EMBALM TOKEN:
  Copy of the original card, except:
  - Color changed to white (only white, not multicolor)
  - Mana cost: none (CMC = 0)
  - Subtype: Zombie added
  → Token retains all original abilities, P/T, other types, etc.

ETERNALIZE TOKEN:
  Copy of the original card, except:
  - Color changed to black
  - P/T set to 4/4 (regardless of original)
  - Mana cost: none
  - Subtype: Zombie added
  → Token retains all original abilities and types (except P/T for Eternalize)

TOKEN IS PERMANENT:
  Unlike encore tokens: NOT sacrificed at end of turn
  Embalm/eternalize tokens stay on battlefield until destroyed
  No "at the beginning of next end step, sacrifice"

SORCERY SPEED:
  "Activate only as a sorcery" — can't activate during opponent's turn
  Can't activate during your combat phase or draw step without special effects
  Only during main phase when you have priority and stack is empty
    (standard sorcery-speed rules)

EXILE ON ACTIVATION:
  Exiling the card is part of the cost (not the effect)
  If the ability is countered (Stifle): the card is still exiled (cost already paid)
  Cannot embalm/eternalize the same card twice

ETB TRIGGERS:
  Token enters the battlefield → ETB triggers fire normally
  "When Temmet, Vizier of Naktamun enters" would trigger again
  All abilities on the token function normally (it has all original abilities)
```

## Definitive Conclusions

- **Embalm/Eternalize tokens are permanent.** They don't go away at end of turn.
- **Embalm creates a white Zombie token copy.** Eternalize creates a black 4/4 Zombie token copy.
- **ETB triggers fire** when the token enters the battlefield.
- **If the ability is countered (Stifle), the card is still exiled** — the exile is a cost.
- **Only sorcery-speed activation.** Must be your main phase with empty stack.

## Canonical Example
**Vizier of Many Faces (Embalm {5}{U}{U}):**
Vizier of Many Faces is in your graveyard. Pay {5}{U}{U} and exile it. Create a token copy of Vizier of Many Faces that's white (not blue), has no mana cost, and is a Zombie in addition to being a Wizard. The token enters, its ETB fires ("enter as a copy of any creature on the battlefield"). You get a second copy creature — permanently.

**Example 2 — Eternalize:**
Champion of the Flame (Eternalize {4}{R}{R}). Original is 1/1. Eternalize creates a 4/4 black Zombie token with all Champion's abilities (including "gets +2/+2 for each Aura and Equipment"). The token is 4/4 base but can grow from Auras/Equipment triggers.

## Commonly Confused With
- **P061 (Encore)** — Encore tokens are one-per-opponent, attack-this-turn, sacrifice-at-end-step. Embalm/Eternalize tokens are single, permanent. Both are graveyard activated sorcery-speed abilities.
- **P067 and P046 (Flashback)** — Flashback is a one-time cast from graveyard. Embalm/Eternalize create tokens, not casting the card.
