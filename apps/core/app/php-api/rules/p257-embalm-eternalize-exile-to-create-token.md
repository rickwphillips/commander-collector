---
id: p257
name: Embalm and Eternalize — Exile From Graveyard to Create a Token Copy
category: zones
cr_refs: [702.129a, 702.129b, 702.130a, 702.130b]
tags: [embalm, eternalize, graveyard, token-copy, zombie, white-zombie, black-zombie, Amonkhet, Hour-of-Devastation, Sacred-Cat, Temmet-Vizier, Wildfire-Eternal]
created: 2026-03-28
examples_count: 2
---

# P257 — Embalm and Eternalize — Exile From Graveyard to Create a Token Copy

## Abstract
Two mechanics from the Amonkhet block. **Embalm**: pay the embalm cost and exile this creature from your graveyard — create a token that's a copy of the creature but is white, colorless in mana, and has the zombie creature type added. **Eternalize**: identical process but the token is a 4/4 black zombie version of the creature (instead of the creature's original P/T). Both convert dead creatures into "embalmed" zombie tokens, giving you a second use of the creature's abilities. The eternalized token always enters as 4/4 regardless of the original's P/T — it's a "powered up" zombie.

## The Definitive Rules

**CR 702.129a** (verbatim): *"Embalm is an activated ability that functions while the card with embalm is in a player's graveyard. 'Embalm [cost]' means '[Cost], Exile this card from your graveyard: Create a token that's a copy of this card, except it's white, it has no mana cost, its mana value is 0, and it's a Zombie [original creature types] in addition to its other types. Activate only as a sorcery.'"*

**CR 702.130a** (verbatim): *"Eternalize is an activated ability that functions while the card with eternalize is in a player's graveyard. 'Eternalize [cost]' means '[Cost], Exile this card from your graveyard: Create a token that's a copy of this card, except it's a 4/4 black Zombie [original creature types], it has no mana cost, and its mana value is 0. Activate only as a sorcery.'"*

## The Pattern

```
EMBALM:
  Activated ability from the GRAVEYARD
  Cost: pay embalm cost + exile this card
  Result: create a token that's a COPY of the creature EXCEPT:
    - It's WHITE (regardless of original color)
    - It has NO MANA COST (MV = 0)
    - It's a Zombie [original types] in addition to other types
  The token has all abilities, power, toughness of the original (same stats as the original creature)
  Sorcery speed only

ETERNALIZE:
  Same as Embalm but the token is:
    - 4/4 (not the original P/T)
    - BLACK
    - Zombie [original types]
    - No mana cost (MV = 0)
  Always 4/4 regardless of the original creature's power/toughness

EMBALM vs ETERNALIZE:
  Embalm: same stats as original, but white zombie
  Eternalize: 4/4 stats, but black zombie
  If the original was a 7/7: embalm creates a 7/7 white zombie. Eternalize creates a 4/4 black zombie.
  If the original was a 1/1: embalm creates a 1/1 white zombie. Eternalize creates a 4/4 black zombie (upgrade!).

EMBALM/ETERNALIZE + ETB TRIGGERS:
  The token is a copy: it enters the battlefield as a new permanent
  ETB triggered abilities on the original: they fire when the token enters!
  Sacred Cat ({W}): 1/1 Lifelink. Embalm {3}{W}.
    Embalm token: 1/1 white zombie cat with lifelink. ETB: does Sacred Cat have an ETB? No.
    But the token has lifelink: gain life when it deals combat damage.

  Champion of Wits ({2}{U}): 2/1, "when enters, draw cards equal to power, then discard 2." Eternalize {5}{U}{U}.
    Eternalize token: 4/4 black zombie with "when enters, draw 4 cards, discard 2."
    Drawing 4 (based on 4/4 power) for the eternalize token vs. 2 for original (2/1).
    Eternalize fires the ETB at 4 power → more cards drawn.

EMBALM/ETERNALIZE + ZOMBIE SYNERGIES:
  Both create Zombie tokens: synergize with Zombie tribal (Diregraf Captain, Risen Executioner)
  Amonkhet + Innistrad Zombie decks: embalm/eternalize tokens count as Zombies for tribal
  Lord of the Undead, Death Baron: buffs apply to embalmed/eternalized tokens

EMBALM/ETERNALIZE + ZONE MOVEMENT:
  Once embalmed/eternalized: the original card is EXILED (gone forever)
  Can't embalm or eternalize twice — the card is exiled after activation
  But the token: if the token dies, it goes to GY (as a token that then ceases to exist per SBA 704.5d)
  The token doesn't have embalm/eternalize (those are the ORIGINAL CARD'S abilities)
  Wait: the token is a copy of the card... Does it have embalm?
    The token is a copy of the original creature but the copy's embalm ability would function from the graveyard
    But tokens placed in the graveyard cease to exist immediately (SBA 704.5d)
    Even if the token "had" embalm: by the time it's in the GY, it ceases to exist — can't activate embalm
    Net: no, the token can't be embalmed again

EMBALM + ANIMATION:
  "No mana cost, MV 0": relevant for specific mechanics
  Cascade: cascades into cards with MV < cascade spell's MV. An embalm token has MV 0 → cascade finds it.
  Wait: cascade finds cards in the LIBRARY, not on the battlefield. Tokens aren't in the library.
  This is irrelevant: the token is created when the ability activates, not drawn from library.

EMBALM + COST REDUCTION:
  Embalm cost: pay the printed embalm cost
  Cost reduction effects (like Urza's Incubator for creature types): might reduce embalm cost if it applies to activated abilities of that type
  "Spells cost {2} less": applies to CAST spells. Embalm is an ACTIVATED ABILITY (not cast).
  Cost reduction for casting doesn't apply to embalm/eternalize.

EMBALM CARDS (Amonkhet):
  Sacred Cat ({W}): 1/1 Lifelink, Embalm {3}{W}. Embalm token: 1/1 white zombie cat with lifelink.
  Fan Bearer ({W}): 1/2, "tap: tap target creature." Embalm {3}{W}. Token can also tap creatures.
  Aven Mindcensor ({2}{W}): 2/1 Flash Flying, "players search only top 4 of library." Embalm {4}{W}. Token also has the restriction aura.

ETERNALIZE CARDS (Hour of Devastation / Amonkhet):
  Wildfire Eternal ({3}{R}): 1/4, "whenever Wildfire Eternal attacks and isn't blocked, you may cast an instant or sorcery from your hand without paying its mana cost." Eternalize {5}{R}{R}.
    Eternalize token: 4/4 black zombie Zombie with "attack unblocked → free instant/sorcery."
    A 4/4 with unblockable-trigger for free spells.
  Champion of Wits ({2}{U}): eternalize as described above.
```

## Definitive Conclusions

- **Embalm creates a white zombie token copy** of the original creature (same P/T, all abilities, but white and zombie-typed).
- **Eternalize creates a 4/4 black zombie token** of the original (always 4/4 regardless of original P/T).
- **The original card is exiled** on activation — only one use ever.
- **The token has the creature's abilities** including ETB triggers — relevant for enter-with-power effects.
- **Tokens can't be embalmed/eternalized** — they cease to exist before any graveyard ability could fire.

## Canonical Example
**Champion of Wits Eternalize in Control:**
Turn 3: Cast Champion of Wits ({2}{U}): 2/1 enters. ETB: draw 2, discard 2 (net 0 but filters hand).
Champion of Wits dies in combat (2/1 is small).
Turn 8: Activate Eternalize {5}{U}{U}: exile Champion from GY, create 4/4 black Zombie Champion.
Token enters (4/4): ETB fires with power = 4 → draw 4 cards, discard 2 cards.
Net: draw 4, discard 2 = draw 2 net cards from a 4/4 attacker.
The 4/4 black zombie attacks every subsequent turn as a solid body.
Total: first Champion drew 2, second (eternalized) drew 4 more, plus 4/4 body.

**Example 2 — Sacred Cat Embalm in Lifegain:**
Turn 1: Cast Sacred Cat ({W}): 1/1 Lifelink.
Attacks each turn: gain 1 life per combat damage.
Sacred Cat dies in combat eventually.
Turn 4: Embalm {3}{W}: exile Sacred Cat from GY → create 1/1 white zombie cat with lifelink.
Same creature! White Zombie Cat attacks → gain 1 life per hit.
In lifegain/soul sisters decks: two triggers from Sacred Cat (first and embalmed version).
Soul Warden: "whenever a creature enters, gain 1 life" — fires when the embalm token enters.
Embalm extends the lifelink clock cheaply.

## Commonly Confused With
- **P228 (Unearth)** — Unearth returns the ORIGINAL card from GY (temporarily); Embalm/Eternalize exiles the original and creates a TOKEN copy (permanent until the token dies).
- **P257 (Encore/P171)** — Encore creates one token per opponent; Embalm/Eternalize creates one permanent token from the GY card.
- **P243 (Undying)** — Undying returns the original creature from GY to battlefield with a counter; Embalm creates a DIFFERENT token with different characteristics.
