---
id: p315
name: Token Rules — Creation, Zone Behavior, and Predefined Tokens
category: zones
cr_refs: [111.1, 111.2, 111.3, 111.4, 111.5, 111.6, 111.7, 111.8, 111.10, 111.13, 704.5d]
tags: [token, token-creation, token-zone, Treasure, Food, Clue, Blood, Powerstone, Incubator, token-copy, token-name, token-subtype, doubling-effects, Anointed-Procession, Parallel-Lives, SBA-token-leaves-battlefield]
created: 2026-03-29
examples_count: 2
---

# P315 — Token Rules — Creation, Zone Behavior, and Predefined Tokens

## Abstract
Tokens are permanent markers that represent permanents not backed by a physical card. They're created by spells and abilities that define their characteristics — those defined values ARE the token's "printed" characteristics (its copiable values). Tokens follow all rules for permanents of their type. **Crucially**: when a token leaves the battlefield, it ceases to exist (state-based action CR 704.5d). It cannot be returned from a graveyard — it never exists in the graveyard for any meaningful time. Modern Magic defines many "predefined tokens" (Treasure, Food, Clue, Blood, etc.) with standardized characteristics.

## The Definitive Rules

**CR 111.1** (verbatim): *"Some effects put tokens onto the battlefield. A token is a marker used to represent any permanent that isn't represented by a card."*

**CR 111.3** (verbatim): *"The spell or ability that creates a token may define the values of any number of characteristics for the token. This becomes the token's 'text.' The characteristic values defined this way are functionally equivalent to the characteristic values that are printed on a card; for example, they define the token's copiable values. A token doesn't have any characteristics not defined by the spell or ability that created it."*

**CR 111.6** (verbatim): *"A token is subject to anything that affects permanents in general or that affects the token's card type or subtype. A token isn't a card (even if represented by a card that has a Magic back or that came from a Magic booster pack)."*

**CR 111.7** (verbatim): *"A token that's in a zone other than the battlefield ceases to exist. This is a state-based action; see rule 704."*

**CR 111.8** (verbatim): *"A token that has left the battlefield can't move to another zone or come back onto the battlefield. If such a token would change zones, it remains in its current zone instead. It ceases to exist the next time state-based actions are checked; see rule 704."*

**CR 704.5d** (verbatim): *"If a token is in a zone other than the battlefield, it ceases to exist."*

## The Pattern

```
TOKEN FUNDAMENTALS:
  Tokens are permanents. They enter the battlefield and exist there.
  Owner: the player whose spell/ability created the token (CR 111.2).
  Controller: same as owner by default (can be changed by control effects).

  Token characteristics = defined by the creating spell/ability.
  NOTHING ELSE defines the token (no mana cost, no additional types/abilities).
  Example: Jade Mage creates "1/1 green Saproling creature token."
    That token has: power 1, toughness 1, color green, type creature, subtype Saproling.
    It has: no mana cost, no rules text, no other abilities.
    Attempts to "copy its mana cost" for MV purposes → MV 0 (no mana cost = MV 0).

TOKEN NAMING:
  CR 111.4: name = specified by creating spell/ability OR subtype(s) + "Token."
  "Create a 1/1 white Human creature token" → token named "Human Token," subtype Human.
  "Create Boo, a legendary 1/1 red Hamster creature token with trample and haste" → named "Boo."
  Copy token: name = the copied object's name (not "[Name] Token").
    Spitting Image copies Doomed Dissenter → token named "Doomed Dissenter."

TOKEN ZONE BEHAVIOR:
  Tokens can exist ONLY on the battlefield.
  When a token moves to any other zone (GY, hand, library, exile, command zone):
    (A) Applicable zone-change triggers fire first (as usual).
    (B) SBA 704.5d removes the token — it ceases to exist.
  "Return target creature from your GY" targeting a token: can't work.
    The token is briefly in GY → before any player gets priority → SBA fires → token ceases.
    No player can act before the token is gone.
  "Reanimate target creature" = can't reanimate tokens.

  CR 111.8: a token that has left can't come back. Even "return from exile" won't work.
  Exile-and-return effects: token is exiled → ceases to exist (SBA) → when the return
    would trigger, the token is gone. Return effect fizzles or has no object to return.

  EXCEPTION (triggered abilities see the new zone):
    CR 400.7e: abilities that trigger when an object moves zones can still "find" it.
    "When [this creature] dies, create a 2/2 token" — the death trigger fires,
    even though the creature was a token and ceased to exist in GY.
    The trigger already fired (sees GY for triggers); the token can't come back, but the
    triggered ABILITY that fired from the token's death can still create new tokens.

DOUBLING EFFECTS:
  Anointed Procession ({3}{W}): "If an effect would create one or more tokens under your
    control, it creates twice that many of those tokens instead."
  Parallel Lives ({3}{G}): same text essentially.
  These are replacement effects (see P002) that double token creation.
  Both in play: effects stack — double twice = 4x tokens.
    "Create 1 token" → Parallel Lives: 2 → Anointed Procession: 4.
  Order: since both apply to the same event, the player whose turn it is (or active player)
    applies one, then the other applies to the result.
  Common misconception: "only one can apply" — WRONG. Both apply: 4x total.

TOKEN CHARACTERISTICS AND COPIABLE VALUES:
  A token's defined characteristics ARE its copiable values (CR 111.3).
  Clone copying a 1/1 Saproling token → Clone becomes a 1/1 green Saproling with no abilities.
  Clone copying a Treasure token → Clone becomes a Treasure with the sacrifice ability.
  The token's "printed" characteristics are whatever the creating spell defined.

TOKEN "ISN'T A CARD":
  CR 111.6: tokens are NOT cards.
  Effects that say "draw a card" → don't draw tokens.
  Effects that search a library "for a card" → can't find tokens (tokens aren't in libraries).
  "Discard a card" → can't discard a token (tokens aren't in hand).
  "Exile target card from a GY" → tokens in GY have already ceased to exist; can't target them.
  Prowess/spell-count effects: casting spells ≠ creating tokens.

PREDEFINED TOKENS (CR 111.10):
  Modern Magic standardizes common utility tokens:
  TREASURE: colorless artifact token. "{T}, Sacrifice: Add one mana of any color."
    Created by: Smothering Tithe, Unexpected Windfall, many pirates, etc.
    Use: tap-and-sac for mana. Must be tapped first (can't just sacrifice).
    Note: enters untapped; can tap same turn it enters (no summoning sickness on artifacts).

  FOOD: colorless artifact token. "{2}, {T}, Sacrifice: You gain 3 life."
    Created by: Gilded Goose, The Meathook Massacre, Tireless Provisioner, Oko synergies.
    Oko, Thief of Crowns: +1 ability can turn ANY artifact or creature into a Food token.
    This was format-warping — Oko now banned in most formats.

  CLUE: colorless artifact token. "{2}, Sacrifice: Draw a card."
    Created by: Tireless Tracker (each land drop creates a Clue), Thraben Inspector.
    Sacrifice Clue ≠ "draw a card" spell — it's an activated ability of the token.
    This matters for spell-count effects (casting Clue isn't a spell).

  BLOOD: colorless artifact token. "{1}, {T}, Discard a card, Sacrifice: Draw a card."
    Net effect: pay {1}, tap, and discard to cycle a card (replace a card in hand).
    Created by: Olivia's Attendants, various Crimson Vow cards.

  GOLD: colorless artifact token. "Sacrifice: Add one mana of any color."
    Like Treasure but no tap required. No "additional cost" step.
    Created by: various Commander cards.

  POWERSTONE: colorless artifact token. "{T}: Add {C}. This mana can't be used for non-artifacts."
    Created by: The Brothers' War block. Efficient for artifact-heavy decks.
    The {C} mana is colorless and restricted.

  WALKER: 2/2 black Zombie creature token named "Walker."
    Created by: The Walking Dead Secret Lair and specific cards. Named "Walker" not "Zombie Token."

COPY TOKENS AND SPECIAL INTERACTION (CR 111.13):
  A copy of a permanent spell that resolves becomes a TOKEN.
  Not "created" for replacement effects (CR 111.13).
  Example: Doubling Season / Anointed Procession don't double "copies of permanent spells."
  Those are not "tokens created by an effect" — they're copies resolving.
  Fork targets a creature token-creating effect: the Fork copy IS cast as a spell; if it creates
  tokens, those tokens ARE affected by doubling effects.

TOKENS AND LEGEND RULE:
  Tokens created as copies of legendary permanents are legendary.
  Multiple legendary tokens with the same name → legend rule.
  (See P312 for Rite of Replication example with legendary creatures.)
```

## Definitive Conclusions

- **Tokens cease to exist when they leave the battlefield** — they briefly enter other zones (triggering zone-change abilities), then SBA 704.5d removes them.
- **Tokens cannot be reanimated** — they're never in a graveyard long enough to target.
- **Token characteristics = what the creating effect defines** — nothing more, nothing less. No mana cost unless defined.
- **Two doubling effects multiply: 4x tokens** — both replacement effects apply sequentially.
- **Predefined tokens (Treasure, Food, Clue, etc.) have standard printed characteristics** — no need to specify them each time.
- **Tokens aren't cards** — can't be drawn, searched for in a library, or discarded from hand.

## Canonical Example
**Tireless Tracker Clue Engine:**
Board: Tireless Tracker (3/2 Human Scout). "Whenever a land enters under your control, investigate."
"Investigate" = create a Clue token.
You play 3 lands in a turn (via ramp + extra land drop effects).
3 Clue tokens enter the battlefield. Each is a colorless artifact.
CR 111.10f: each Clue is "{2}, Sacrifice this token: Draw a card."
Later: sacrifice all 3 Clues, paying {6} total → draw 3 cards.
Also: Tireless Tracker: "Whenever you sacrifice a Clue, put a +1/+1 counter on Tireless Tracker."
3 Clues sacrificed → 3 +1/+1 counters → Tracker is now 6/5.
Clues going to GY: tokens, cease to exist immediately (SBA 704.5d). They were tokens — no GY recursion.
Opponent's Bojuka Bog (exile GY): doesn't affect the Clues — they don't exist in GY.

Note: if you control Parallel Lives during all 3 land drops, you'd create 6 Clues (double each investigate).
Sacrificing all 6: pay {12} → draw 6 cards, Tracker gets 6 counters → 9/8.

**Example 2 — Token Returns to Exile Fizzle:**
Board: Restoration Angel. You control a 4/4 Elemental token (from Young Pyromancer).
You blink the Elemental token: Restoration Angel's ability says "exile target non-Angel creature you control, return it at beginning of next end step."
Token is exiled. SBA 704.5d fires: token in exile → ceases to exist.
End of turn: "return it to the battlefield." The token no longer exists. Return has no target.
The token is GONE. Restoration Angel's blink of a token permanently removes it.
This is a strategic mistake: blinking tokens destroys them permanently.
Contrast: blinking a creature CARD — it returns from exile because cards persist in exile.
Moral: never blink a token you want to keep.
Exception: effects that "exile until" where the token needs to survive long enough in exile
for the return trigger to find it. It won't. Token is gone.

## Commonly Confused With
- **P314 (Copy Effects)** — Tokens created as copies of permanents have characteristics defined by the copy process; they're tokens, not cards, and cease to exist when they leave the battlefield. Copy tokens and regular tokens both follow CR 111 zone rules.
- **P312 (Legendary Rule)** — Legendary tokens are subject to the legend rule; Rite of Replication kicked on a legendary creates 5 legendary tokens that all die to the legend rule (but ETBs and death triggers fire first).
- **P300 (Undying/Persist)** — Undying and persist would return the creature to the battlefield, but if the creature was a token, the return trigger fires... but the token in GY has already ceased to exist. The trigger has nothing to return. Tokens don't return from undying/persist.
- **P007 (Priority Windows)** — There's no window to interact with a token in a non-battlefield zone; SBAs fire immediately and the token ceases before priority is given to any player.
