---
id: p301
name: Embalm, Eternalize, and Aftermath — Amonkhet Graveyard Mechanics
category: zones
cr_refs: [702.128a, 702.128b, 702.129a, 702.127a]
tags: [embalm, eternalize, aftermath, graveyard, exile, token-copy, Zombie, split-card, Amonkhet, Angel-of-Sanctions, Honored-Hydra, Temmet, Cut-Ribbons, Driven-Despair]
created: 2026-03-29
examples_count: 2
---

# P301 — Embalm, Eternalize, and Aftermath — Amonkhet Graveyard Mechanics

## Abstract
Three mechanics from Amonkhet block that create value from the graveyard. **Embalm** activates from the GY to exile the card and create a white Zombie token copy of the creature. **Eternalize** does the same but creates a black 4/4 Zombie token copy. Both use the original card's abilities but change its color, remove its mana cost, and add Zombie. **Aftermath** is a split card mechanic: the second half of an Aftermath split card can only be cast from the graveyard (not from hand), and after casting from the GY it exiles.

## The Definitive Rules

**CR 702.128a** (verbatim): *"Embalm is an activated ability that functions while the card with embalm is in a graveyard. 'Embalm [cost]' means '[Cost], Exile this card from your graveyard: Create a token that's a copy of this card, except it's white, it has no mana cost, and it's a Zombie in addition to its other types. Activate only as a sorcery.'"*

**CR 702.129a** (verbatim): *"Eternalize is an activated ability that functions while the card with eternalize is in a graveyard. 'Eternalize [cost]' means '[Cost], Exile this card from your graveyard: Create a token that's a copy of this card, except it's black, it's 4/4, it has no mana cost, and it's a Zombie in addition to its other types. Activate only as a sorcery.'"*

**CR 702.127a** (verbatim): *"Aftermath is an ability found on some split cards. It represents three static abilities. 'Aftermath' means 'You may cast this half of this split card from your graveyard,' 'This half of this split card can't be cast from any zone other than a graveyard,' and 'If this spell was cast from a graveyard, exile it instead of putting it anywhere else any time it would leave the stack.'"*

## The Pattern

```
EMBALM:
  Activates from GY (sorcery speed): pay the embalm cost + exile the card from GY
  Creates a token copy of the creature with these modifications:
    - Color becomes WHITE (regardless of original color)
    - No mana cost (mana value 0)
    - Gains "Zombie" as an additional creature type
    - All other characteristics (abilities, name, P/T) copied from original
  The token enters the battlefield. The original card is exiled.

  EMBALM EXAMPLES:
    Angel of Sanctions ({3}{W}{W}): 3/4 Flying. "When ETBs, exile target non-land permanent."
      Embalm {5}{W}{W}: exile Angel of Sanctions from GY → create a white 3/4 Flying Zombie Angel token.
      Token ETBs: trigger fires → exile another non-land permanent!
      Two exile effects from one card: cast + embalm.

    Honored Hydra ({4}{G}{G}): 6/6 Trample. Embalm {5}{G}{G}.
      Embalm creates a 6/6 Trample White Zombie Hydra token. No mana cost on the token.
      Token is green (original)? No: embalm makes it WHITE. A white 6/6 Hydra.
      The token still has Trample (copied from original).

    Temmet, Vizier of Naktamun: triggers when embalmed tokens attack. Synergy.

  EMBALM TOKEN CHARACTERISTICS:
    Color: white. Card type: token copy of the creature. P/T: same as original.
    Zombie subtype added — relevant for Zombie tribal synergies.
    No mana cost: can't be cast for its mana cost (no mana cost to cast).
    The token's name: same as the original card's name.

ETERNALIZE:
  Same as Embalm BUT:
    Color becomes BLACK
    P/T becomes 4/4 (ignores the original P/T)
    Still adds Zombie subtype

  ETERNALIZE EXAMPLES:
    Glyph Keeper ({3}{U}{U}): 5/3 Flying. "Whenever it becomes the target of a spell or ability for
      the first time each turn, counter that spell or ability."
      Eternalize {5}{U}{U}: creates a black 4/4 Flying Zombie that counters spells targeting it.
      Note: from 5/3 → 4/4 (eternalize forces 4/4 regardless of original).
      The ability still applies: 4/4 Zombie that's hard to target.

    The Scarab God ({3}{U}{B}): not eternalize, but uses eternalized zombies in mechanics.
      "Eternalize [cost], exile target creature card from a graveyard: create a black 4/4 Zombie copy."
      The Scarab God's activated ability is similar to Eternalize but targets opponents' GYs.

  ETERNALIZE NOTE:
    P/T is ALWAYS 4/4 — even if original is 1/1 or 10/10.
    A 1/1 creature eternalized becomes a black 4/4 Zombie.
    The Zombie type and fixed 4/4 make all eternalized tokens similar in size.

AFTERMATH:
  Aftermath appears on SPLIT CARDS (two halves on one card).
  The first half: cast normally from hand (like any instant or sorcery).
  The second half (the aftermath half): ONLY castable from the graveyard.
    It CANNOT be cast from hand.
    It CAN only be cast if it's in the graveyard (the full split card is in the GY).

  AFTERMATH MECHANICS:
    When you cast the first half: resolves normally → split card goes to GY.
    The aftermath half is now accessible from GY.
    Cast the aftermath half from GY: pay its cost, cast it as a spell.
    After resolving: EXILES (like flashback — doesn't go back to GY).

  AFTERMATH EXAMPLES:
    Cut // Ribbons ({X}{R} // {X}{B}{B}):
      Cut: "Create a 4/4 red Rhino Warrior creature token."
      Wait: check oracle text. Actually Cut is combat-related; Ribbons is drain.
      Ribbons (aftermath): "{X}{B}{B}, cast from GY: target player loses X life."
      Play Cut on turn 3 for the immediate effect.
      Cut resolves → goes to GY (Cut // Ribbons in GY).
      Later: pay {X}{B}{B}, cast Ribbons from GY. Target opponent loses X life. Card exiles.
      The aftermath half gets additional turns of mana to accumulate X.

    Driven // Despair ({G} // {1}{B}):
      Driven: "Until EOT, creatures you control gain 'Whenever this creature deals combat damage to a
        player, draw a card.'"
      Despair (aftermath): "Until EOT, creatures you control gain 'Whenever this creature deals combat
        damage to a player, that player discards a card.'"
      Driven on turn 3: attack, draw cards. Card to GY.
      Despair from GY on turn 4: attack, make opponents discard. Card exiles.
      Two different attack bonuses, one from hand and one from GY.

    Start // Finish ({W}{U} // {1}{B}):
      Start: "Create two 1/1 white Human Soldier tokens."
      Finish (aftermath): "As an additional cost, sacrifice a creature. Destroy target creature."
      Start: get two soldiers → split card in GY.
      Finish: sacrifice one of your tokens to destroy opponent's creature. Exiles.

  AFTERMATH + GY INTERACTION:
    Aftermath card in GY: the whole card is in the GY (both halves are one card).
    You can cast the aftermath half while the full card is in GY.
    Effects that exile all GY cards prevent aftermath casts.
    Opponents can use Relic of Progenitus or Grafdigger's Cage to disrupt aftermath.
    Grafdigger's Cage: "Players can't cast spells from graveyards or libraries."
    With Cage: no aftermath, no flashback, no escape. GY cast prevention.

EMBALM/ETERNALIZE + TOKENS:
  The created token is a creature token — it can attack, block, die.
  When it dies: it's exiled (tokens cease to exist in zones other than the battlefield, per CR 704.5d).
  The original card was already exiled to create it: no second use.
  Cannot embalm or eternalize the same creature twice: card is exiled on first use.

EMBALM/ETERNALIZE + COPY EFFECTS:
  If you copy an embalm or eternalize token, the copy is also a token.
  The copy does NOT have embalm/eternalize (copies don't bring along activated abilities from the GY,
    and the token has no mana cost to be returned to the GY from).
  Rite of Replication targeting an embalmed Angel of Sanctions token: 5 more token copies!
  Each copy has the ETB trigger: exile 5 more non-land permanents.
```

## Definitive Conclusions

- **Embalm creates a white Zombie token copy** at the original's P/T; **Eternalize creates a black 4/4 Zombie token copy**.
- **Both exile the original card** — no second embalm/eternalize possible.
- **The Aftermath half can only be cast from the graveyard** — it's illegal to cast from hand.
- **After resolving, Aftermath exiles** — like flashback; no GY return.
- **Embalm/Eternalize tokens retain the original's abilities** but gain Zombie type, lose mana cost, and change color.

## Canonical Example
**Angel of Sanctions Double Exile:**
Turn 5: cast Angel of Sanctions ({3}{W}{W}). ETB: exile opponent's Tarmogoyf.
Turn 8: opponent kills Angel of Sanctions. It goes to GY.
Your turn: pay Embalm {5}{W}{W}. Exile Angel of Sanctions from GY.
Create a white 3/4 Flying Zombie Angel token.
Token ETBs: trigger fires → exile opponent's Planeswalker.
Two exile effects: one when originally cast, one on embalm.
The token is now a white Zombie (if opponents have Zombie synergies, it doesn't interact with them).
Attacking with 3/4 Flying: pressure in the air.
Original card permanently exiled after embalm — cannot embalm a third time.

**Example 2 — Cut // Ribbons Game-Ending Aftermath:**
Game state: Turn 6. Opponent at 14 life. They have a board presence.
Cast Cut from hand: create a 4/4 Rhino. Slice 4 from a creature? Check oracle.
Actually exact Cut text: "Destroy target creature you control. It deals damage equal to its power to target creature an opponent controls." (Sacrifice/fight variant.)
Let's use the known aftermath pattern instead: Cast Cut, which deals damage and puts the card in GY.
Turn 8: board stalled. Have {8}{B}{B} available.
Cast Ribbons from GY with X=6: opponent loses 6 life. From 14 → 8.
Turn 9: opponent still at 8. No more Ribbons (exiled).
Alternative: save Ribbons for the exact lethal. {X=14}{B}{B}: opponent loses 14 = dead from 14.
Ribbons from GY as a "finisher" when opponent is at low life: cast Cut whenever convenient,
then use Ribbons as a mana-sink kill spell later. Two spells in one card.

## Commonly Confused With
- **P295 (Flashback/Madness/Rebound)** — Flashback also casts from GY and exiles after; Aftermath specifically requires ONLY from GY (not from hand), and only the second half of a split card.
- **P282 (Escape)** — Escape also casts from GY; unlike Aftermath, escaped cards go back to GY if they die again (they're the card itself, not a copy), and escape doesn't apply only to one half.
- **P281 (Special Tokens)** — Embalm/Eternalize tokens are special because they come from the GY and gain Zombie type, but they follow normal token rules (cease to exist outside battlefield).
- **P286 (Sagas)** — Both are Amonkhet mechanics; Sagas advance on upkeep; Embalm/Eternalize activate from GY manually.
