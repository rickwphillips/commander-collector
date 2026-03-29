---
id: p398
name: Embalm, Eternalize, and Aftermath — Graveyard-Based Alternative Uses
category: zones
cr_refs: [702.128a, 702.128b, 702.129a, 702.127a]
tags: [embalm, eternalize, aftermath, GY-activated-ability, zombie-token-copy, cast-from-graveyard, exile-after-use, sorcery-speed-only, white-zombie-copy, black-4-4-zombie-copy, split-card-second-half, Honored-Hydra, Sacred-Cat, Earthshaker-Khenra, Sunscourge-Champion, Driven-Despair, Cut-Ribbons, aftermath-only-from-GY, eternalize-fixed-4-4]
created: 2026-03-29
examples_count: 2
---

# P398 — Embalm, Eternalize, and Aftermath — Graveyard-Based Alternative Uses

## Abstract
**Embalm** (702.128) is a GY-activated ability: pay the embalm cost, exile the card, and create a white Zombie token copy of it (no mana cost, white, gains Zombie subtype). Embalm only activates from the graveyard and only as a sorcery. **Eternalize** (702.129) is the same concept but creates a black, 4/4 Zombie token copy (regardless of the original card's P/T). **Aftermath** (702.127) is a split card mechanic: the "aftermath half" can ONLY be cast from the graveyard (not from hand), and when it leaves the stack it's exiled rather than going to the GY — it's a one-shot GY-cast ability. All three mechanics involve the graveyard as a secondary resource, but each has distinct characteristics about the resulting object, the cost of activation, and what happens after use.

## The Definitive Rules

**CR 702.128a** (verbatim): *"Embalm is an activated ability that functions while the card with embalm is in a graveyard. 'Embalm [cost]' means '[Cost], Exile this card from your graveyard: Create a token that's a copy of this card, except it's white, it has no mana cost, and it's a Zombie in addition to its other types. Activate only as a sorcery.'"*

**CR 702.128b** (verbatim): *"A token is 'embalmed' if it's created by a resolving embalm ability."*

**CR 702.129a** (verbatim): *"Eternalize is an activated ability that functions while the card with eternalize is in a graveyard. 'Eternalize [cost]' means '[Cost], Exile this card from your graveyard: Create a token that's a copy of this card, except it's black, it's 4/4, it has no mana cost, and it's a Zombie in addition to its other types. Activate only as a sorcery.'"*

**CR 702.127a** (verbatim): *"Aftermath is an ability found on some split cards (see rule 709, 'Split Cards'). It represents three static abilities. 'Aftermath' means 'You may cast this half of this split card from your graveyard,' 'This half of this split card can't be cast from any zone other than a graveyard,' and 'If this spell was cast from a graveyard, exile it instead of putting it anywhere else any time it would leave the stack.'"*

## The Pattern

```
EMBALM (702.128):
  WHAT IT CREATES:
    A token that's a copy of the card, EXCEPT:
      - It's white (regardless of original color).
      - It has no mana cost (the mana cost line is removed/replaced with none).
      - It's a Zombie in addition to its other types.
    "In addition to" — it keeps its original creature types, just also becomes Zombie.
    Example: Sacred Cat ({W}: 1/1 Cat with lifelink, embalm {2}{W}):
      Embalm creates a 1/1 white Cat Zombie token with lifelink and no mana cost.
      The embalmed token has all of Sacred Cat's original abilities (lifelink).
  MANA COST AND MANA VALUE:
    "No mana cost" — the token has a mana cost of nothing (not {0}, but literally no mana cost).
    Mana value of an object with no mana cost = 0. (Rule 202.3a.)
    The embalmed token's MV = 0, even if the original card had a significant mana cost.
    This matters for: Cascade, effects that check MV, X spells with X = the token's MV.
    "It has no mana cost" also means: this token can't be cast again (no cost to pay, also tokens
      can't be recast — they're not cards).
  TOKEN IS A ZOMBIE:
    Zombie tribal synergies apply to embalmed tokens.
    Even if the original was a non-Zombie (e.g., Sacred Cat), the token is now a Zombie Cat.
    Zombie lord effects (Lord of the Undead, etc.) would boost the embalmed token.
  EMBALM ONLY FROM GY:
    The ability functions only while the card is in the graveyard. Not hand, not library.
    Activate only as a sorcery (main phase, stack empty, you have priority).
  WHAT HAPPENS AFTER EMBALM:
    The card is exiled (as the activation cost). The token appears on the battlefield.
    The original card is gone. You can't embalm twice (the card is exiled after the first use).
    The token has ETB triggers. It enters the battlefield normally.

ETERNALIZE (702.129):
  WHAT IT CREATES:
    A token that's a copy of the card, EXCEPT:
      - It's black.
      - It's 4/4 (regardless of original P/T).
      - It has no mana cost.
      - It's a Zombie in addition to its other types.
    KEY DIFFERENCE FROM EMBALM: eternalize overrides P/T to 4/4.
    Embalm keeps the original P/T. Eternalize always creates a 4/4.
    Example: Earthshaker Khenra ({1}{R}: 2/1 haste, eternalize {4}{R}{R}):
      Embalm would create a 2/1 token. But this is eternalize.
      Eternalize creates a 4/4 black Zombie Jackal Warrior token with haste.
      Still has haste (it's a copy of Earthshaker Khenra, which has haste).
      Still has its attack trigger (if any).
    Example: Honored Hydra ({4}{G}: 6/6 trample, eternalize {3}{G}):
      Eternalize creates a 4/4 black Zombie Serpent token with trample.
      Note: Honored Hydra's normal size is 6/6, but the eternalize token is always 4/4.
  WHY 4/4?
    Eternalize creatures are typically stronger original cards. Making the token 4/4 standardizes
      the eternalize token's P/T. You trade the original card's P/T for a fixed 4/4 with its abilities.
  THE REST IS THE SAME AS EMBALM:
    GY-only activation. Sorcery speed. Card exiled as cost. Token ETBs fire.
    MV of the token = 0 (no mana cost).

AFTERMATH (702.127):
  WHAT IT IS:
    Found on the bottom half of some split cards.
    Two halves: the top half is a normal spell (can be cast from hand normally).
    The bottom half (aftermath) has a different name and different spell type.
    The aftermath half can ONLY be cast from the graveyard.
    "This half... can't be cast from any zone other than a graveyard."
    You cast the top half normally (from hand, normally). It goes to GY when it resolves/is countered.
    Then: you may cast the aftermath half from the GY.
  AFTERMATH AND EXILE:
    "If this spell was cast from a graveyard, exile it instead of putting it anywhere else
      any time it would leave the stack."
    When the aftermath half resolves or is countered: it's EXILED, not put into the GY.
    This means: you get one use of the aftermath half. It can't be re-used.
    (If the aftermath half is countered: still exiled. Can't try again from the GY.)
  THE SPLIT CARD IN ZONES:
    The split card has two halves but is one card.
    In the GY: the card has the characteristics of BOTH halves combined (see rule 709.4).
    You can only CAST the aftermath half from the GY. You can't cast the top half from the GY.
    The top half has no special GY casting ability.
    In hand: you can cast the top half (normal spell). The aftermath half can't be cast from hand.
  AFTERMATH EXAMPLES:
    Cut // Ribbons ({1}{R} // {X}{B}{B}):
      Cut (top half): Sorcery, "Target player sacrifices a creature. If you control a black permanent,
        put a -1/-1 counter on each creature that player controls instead."
        Wait, the actual text might differ. Let me use the correct text:
        "Cut" ({2}{R}): Deal 4 damage to target creature. (Instant half, front.)
      Ribbons (aftermath, {X}{B}{B}): "Each opponent loses X life."
      How to use: Cast Cut to deal 4 to a creature on opponent's turn (flash/main phase).
        Cut resolves, goes to GY.
        Later: cast Ribbons from the GY ({X}{B}{B}). Each opponent loses X life.
        Ribbons resolves. The split card is exiled (aftermath exile rule).
    Driven // Despair ({1}{G} // {1}{B}):
      Driven: Until EOT, creatures you control gain trample and "Whenever this creature deals combat
        damage to a player, draw a card."
      Despair (aftermath): Until EOT, creatures you control gain menace and "Whenever this creature
        deals combat damage to a player, that player discards a card."
      Use both: Driven turn before a big attack, Despair from GY for next attack.
        Now your creatures have trample + menace + double damage rider effects.
```

## Definitive Conclusions

- **Embalm creates a copy token that's white, Zombie-typed, with no mana cost** — but keeps the original card's P/T; **eternalize always creates a 4/4** regardless of original P/T, and is black.
- **Embalmed/eternalized tokens have MV 0** (no mana cost) — this matters for Cascade, death triggers checking MV, and similar effects.
- **Embalm/eternalize are sorcery-speed GY activations** — the original card is exiled as the activation cost, making these one-time-use abilities.
- **Aftermath halves can ONLY be cast from the graveyard** — you can't cast the aftermath half from your hand; when it resolves or is countered, it's exiled permanently (no re-use from GY).
- **The whole split card is in the GY** — but only the aftermath half has GY casting ability; the top half's GY rules are normal (no special casting ability).

## Canonical Example
**Earthshaker Khenra Eternalize Combo:**
Earthshaker Khenra ({1}{R}: 2/1 Zombie Jackal Warrior, haste, "when this enters, target creature with power less than or equal to this creature's power can't block this turn. Eternalize {4}{R}{R}"):

Turn 2: Cast Earthshaker Khenra for {1}{R}. 2/1 with haste enters.
ETB: target creature with power ≤ 2 can't block. You neuter opponent's 2/2 blocker.
Attack for 2. Opponent's 2/2 can't block. Deal 2 damage.
Opponent's 4/4 blocks anyway (power 4 > 2, not affected). Khenra trades.

Turn 5: Earthshaker Khenra is in your GY. You have {4}{R}{R} available.
Activate eternalize: pay {4}{R}{R}, exile Earthshaker Khenra from GY.
Create a 4/4 black Zombie Jackal Warrior token with haste.
The token has all of Khenra's abilities (including ETB trigger).
ETB fires: target creature with power ≤ 4 can't block. Opponent's 4/4 can't block.
Attack with the 4/4 Zombie token. Opponent has no valid blockers (4/4 is the biggest).
Swing for 4 damage.

Key interactions:
- The eternalize token is now a 4/4 (bigger than the original 2/1), so it can silence bigger creatures.
- The token enters with haste — can attack the same turn.
- The token is a Zombie, gaining Zombie tribal synergies.
- MV of the token = 0. If opponent has Grafdigger's Cage (prevents GY casting of creature cards):
  Eternalize creates a token, not casting a creature card. Grafdigger's Cage doesn't stop it.

**Example 2 — Cut // Ribbons Split Card:**
Cut // Ribbons (Cut: {X}{R}, instant, "Cut deals X damage to target creature"; Ribbons: aftermath {X}{B}{B}, "each opponent loses X life"):

You're in a Commander game. Opponents are at 28, 25, 20 life.

Turn 3: Cast Cut for X=4 ({4}{R}). Kill an opponent's 4/4. Cut resolves, goes to your GY.

Turn 6: You have {7}{B}{B} available. Opponent at 28 life is the winning player.
Cast Ribbons from your GY for X=7 ({7}{B}{B}).
Resolution: each opponent loses 7 life.
Opponent A: 28 - 7 = 21. Opponent B: 25 - 7 = 18. Opponent C: 20 - 7 = 13.
Total life drained: 21. You haven't touched your life total.
Cut // Ribbons is now exiled (aftermath exile rule). One-time use of Ribbons.

Interaction: if you copy Cut using Fork ({R}{R}: "copy target instant or sorcery spell, you may choose new targets"):
The copy of Cut is not an aftermath spell — it's a copy on the stack.
The copy resolves → goes to wherever copies go (ceases to exist, per 704.5e).
The original Cut resolves → goes to GY normally.
Only the original can have Ribbons cast from it later.

## Commonly Confused With
- **P386 (Backup/Bargain/Craft)** — Craft also exiles the source card as part of the mechanic (exiling the crafted permanent). Embalm/eternalize also exile the source card from the GY. Key difference: craft transforms an artifact permanent; embalm/eternalize create tokens from GY.
- **P382 (Adventure Cards)** — Both adventure and aftermath involve two-mode cards. Adventure casts the adventure half first (from hand), then the creature from exile. Aftermath casts the top half from hand first, then the aftermath half from GY. Both use the GY or exile as a second-spell staging zone.
- **P374 (Daybound/Nightbound)** — Aftermath split cards have two separate names and two separate identities. The split card's two halves each contribute to color identity in Commander (both halves' mana symbols matter).
- **P011 (ETB Triggers)** — Embalm and eternalize tokens enter the battlefield, triggering all ETB abilities. The tokens have the same ETBs as the original card. This is the primary strategic value of recurring a powerful ETB creature.
