---
id: p207
name: Adventure Cards — Cast as Adventure Then From Exile
category: zones
cr_refs: [715.1, 715.2, 715.3, 715.3d, 715.4]
tags: [adventure, adventurer-card, exile, inset-frame, Edgewall-Innkeeper, Lovestruck-Beast, Throne-of-Eldraine]
created: 2026-03-28
examples_count: 2
---

# P207 — Adventure Cards — Cast as Adventure Then From Exile

## Abstract
Adventure cards (Throne of Eldraine) have two parts: the main card (a permanent) and an Adventure (an instant or sorcery in the inset frame). You can cast either the main permanent normally, OR cast it as the Adventure first. When the Adventure spell resolves, instead of going to the graveyard, the card is exiled. From exile, you may cast the main permanent side at any time you could normally cast it. This enables a two-for-one pattern: instant/sorcery effect first, then later cast the creature for free (or for its mana cost). Adventure is not cast "for free" from exile — you still pay the creature's mana cost.

## The Definitive Rules

**CR 715.3** (verbatim): *"As a player plays an adventurer card, the player chooses whether they play the card normally or as an Adventure."*

**CR 715.3d** (verbatim): *"Instead of putting a spell that was cast as an Adventure into its owner's graveyard as it resolves, its controller exiles it. For as long as that card remains exiled, that player may play it. It can't be cast as an Adventure this way, although other effects that allow a player to cast it may allow a player to cast it as an Adventure."*

**CR 715.4** (verbatim): *"In every zone except the stack, and while on the stack not as an Adventure, an adventurer card has only its normal characteristics."*

## The Pattern

```
ADVENTURE ZONES:
  In every zone EXCEPT the stack as an Adventure: normal card characteristics only
  - Adventurer card in hand: creature characteristics (type, cost, name)
  - Adventurer card in graveyard: creature characteristics
  - Adventurer card in exile: creature characteristics (NOT the adventure half)

  ON THE STACK AS AN ADVENTURE:
    Only the alternative (Adventure) characteristics exist
    Spell type: instant or sorcery (the adventure half's type)
    Name: the adventure name
    Effect: the adventure effect

ADVENTURE FLOW:
  1. Choose to cast as Adventure (from hand)
  2. Adventure spell goes on stack with adventure characteristics
  3. Adventure resolves (or is countered)
  4. If resolved: instead of going to graveyard → exiled
  5. Owner may cast the main card from exile (when it would normally be legal to cast)
  6. If countered: goes to graveyard (not exiled) — can't cast from exile

ADVENTURE + EXILE FROM EXILE:
  When the card is in exile (after Adventure resolved): you can cast the MAIN card only
  Cannot cast as Adventure again from this exile state (CR 715.3d)
  "Other effects that allow casting from exile may allow casting as an Adventure" — edge case
  Mainly: the normal exile = cast main card only

ADVENTURE + COST:
  Casting main card from exile: pay full mana cost (not free!)
  The adventure gave you the instant/sorcery effect; the creature costs its mana cost
  This is the two-part pattern: pay adventure cost → later pay creature cost
  Or: skip adventure and cast creature directly (if you don't need the adventure effect)

ADVENTURE + GRAVEYARD RECURSION:
  If the Adventure spell is COUNTERED: card goes to graveyard (not exiled)
  You can then reanimate the creature from graveyard via normal recursion
  But: you don't get the "cast from exile" option (it's not in exile)

ADVENTURE + CARD TYPES IN ZONES:
  CR 715.4: adventurer card in graveyard has only main characteristics
  Snapcaster Mage targets "instant or sorcery in your graveyard" — the Adventure half
  But in graveyard: only creature characteristics → Snapcaster can't target the Adventure half
  The adventure text exists on the card but only functions when cast as an Adventure

ADVENTURE + EDGEWALL INNKEEPER:
  Edgewall Innkeeper: "Whenever you cast a creature spell that has an Adventure..."
  Triggers when you cast either the Adventure (as a spell that "has an Adventure") OR the creature directly
  Wait: on the stack as an Adventure, the spell has only Adventure characteristics
  Innkeeper says "cast a creature spell that has an Adventure" — adventure spell on stack isn't a creature
  So: Innkeeper triggers when you cast the CREATURE side (from hand or exile)
  Not when you cast the adventure side (which has only Adventure characteristics on stack)

LOVESTRUCK BEAST + HEART'S DESIRE:
  Lovestruck Beast (5/5 for {2}{G}): "Lovestruck Beast can't attack unless you control a 1/1 creature."
  Heart's Desire (adventure: create a 1/1 Human token) for {G}
  Cast Heart's Desire for {G}: get a 1/1 token. Card exiles.
  Now attack condition met! Cast Lovestruck Beast from exile for {2}{G}: 5/5 that can attack.
  Two-for-one: 1/1 token + 5/5 attacker for {3}{G} total.
```

## Definitive Conclusions

- **Adventure = cast the instant/sorcery half first**, then cast the creature from exile later.
- **Adventure resolves → exiled** (not graveyard); countered → graveyard.
- **Cast from exile**: pay full creature mana cost, only once.
- **In graveyard**: only creature characteristics (Snapcaster can't target the adventure half).
- **Two-for-one value**: adventure effect first, creature later for no extra setup cost.

## Canonical Example
**Bonecrusher Giant // Stomp:**
Stomp ({1}{R}): deal 2 damage to any target. Damage can't be prevented this turn.
Bonecrusher Giant (4/3): "Whenever Bonecrusher Giant becomes the target of a spell, it deals 2 damage to that spell's controller."

Turn 2: Cast Stomp ({1}{R}) as Adventure. Deal 2 damage to opponent's 1/1 creature (kill it). Card exiles.
Turn 3: Cast Bonecrusher Giant from exile ({2}{R}). 4/3 that punishes opponents targeting it.
Total: 2 damage removal + a 4/3 for {3}{R}. Efficient.

The giant also protects itself: if opponent tries to Doom Blade it: Giant deals 2 damage to opponent.

**Example 2 — Brazen Borrower // Petty Theft:**
Petty Theft ({1}{U} instant — Adventure): return target nonland permanent an opponent controls to hand.
Brazen Borrower (3/1 flash, can only block creatures): normally {1}{U}{U}.

Cast Petty Theft: bounce opponent's best permanent. Card exiles.
Later: flash in Brazen Borrower for {1}{U}{U} from exile at instant speed (it has flash).
Apply pressure: bounce threats, then deploy an evasive 3/1.

## Commonly Confused With
- **P168 (Escape)** — Escape casts from graveyard; Adventure casts from exile (after the adventure resolves).
- **P164 (Rebound)** — Rebound exiles and casts again at upkeep automatically. Adventure exiles and you choose when to cast the permanent side.
- **P163 (Retrace)** — Retrace casts the same spell from graveyard repeatedly. Adventure casts a different spell (the creature) from exile once.
