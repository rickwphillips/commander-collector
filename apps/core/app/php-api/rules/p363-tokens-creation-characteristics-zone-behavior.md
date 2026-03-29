---
id: p363
name: Tokens — Creation, Characteristics, Zone Behavior, and Copy Tokens
category: zones
cr_refs: [111.1, 111.2, 111.3, 111.4, 111.5, 111.6, 111.7, 111.8, 111.9, 704.5d, 704.5e]
tags: [token, create-token, token-owner, token-zone, token-ceases-to-exist, copy-token, Treasure, Food, Clue, Blood, predefined-token, Saproling, token-characteristics, legendary-token, token-in-graveyard, blink-token-dies]
created: 2026-03-29
examples_count: 2
---

# P363 — Tokens — Creation, Characteristics, Zone Behavior, and Copy Tokens

## Abstract
**Tokens** (rule 111) are permanents on the battlefield that aren't represented by actual cards. They're created by spell and ability effects. The **owner** of a token is the player who created it (111.2); it enters under their control. A token's characteristics (name, type, abilities, P/T) are defined by the creating effect (111.3) — it has **no characteristics beyond what's defined**. Tokens cease to exist as a **state-based action** when they leave the battlefield (111.7, SBA 704.5d): they can't be in a graveyard, hand, library, or exile. If a token would change zones, applicable triggers fire first, then the token ceases to exist. Critically: if you blink a token (exile then return), the "return to battlefield" never happens — the token in exile ceases to exist before it can return.

## The Definitive Rules

**CR 111.1** (verbatim): *"Some effects put tokens onto the battlefield. A token is a marker used to represent any permanent that isn't represented by a card."*

**CR 111.3** (verbatim): *"The spell or ability that creates a token may define the values of any number of characteristics for the token. This becomes the token's 'text.' The characteristic values defined this way are functionally equivalent to the characteristic values that are printed on a card; for example, they define the token's copiable values. A token doesn't have any characteristics not defined by the spell or ability that created it."*

**CR 111.6** (verbatim): *"A token is subject to anything that affects permanents in general or that affects the token's card type or subtype. A token isn't a card (even if represented by a card that has a Magic back or that came from a Magic booster pack)."*

**CR 111.7** (verbatim): *"A token that's in a zone other than the battlefield ceases to exist. This is a state-based action; see rule 704. (Note that if a token changes zones, applicable triggered abilities will trigger before the token ceases to exist.)"*

**CR 111.8** (verbatim): *"A token that has left the battlefield can't move to another zone or come back onto the battlefield. If such a token would change zones, it remains in its current zone instead. It ceases to exist the next time state-based actions are checked."*

**CR 704.5d** (verbatim): *"If a token is in a zone other than the battlefield, it ceases to exist."*

## The Pattern

```
TOKEN CREATION (111.1–111.4):
  Tokens are created by spell or ability effects.
  The creating effect defines ALL token characteristics:
    Name, type, subtype, color, power/toughness, abilities — exactly as stated.
    NOTHING beyond what's explicitly defined.
  Example: "Create a 1/1 green Saproling creature token."
    This token: 1/1, green, creature, Saproling subtype.
    It has NO: mana cost, rules text, other abilities.
    It is NOT legendary. It is NOT named anything except "Saproling Token" (default naming: type + Token).
  IF THE EFFECT NAMES THE TOKEN (111.4):
    "Create Boo, a legendary 1/1 red Hamster token with trample and haste."
    Name: Boo. Type: legendary creature. Subtype: Hamster. Color: red. P/T: 1/1. Trample. Haste.
    The name doesn't include "Hamster" or "Token."
    Changing the name later (via text-changing effect) doesn't change the subtype (Hamster stays).

TOKEN OWNER AND CONTROLLER (111.2):
  Owner: the player who created the token (by the effect creating it).
  In multiplayer: if an effect tells Player B to "create a token," Player B owns that token.
  If an effect tells Player A to create a token under Player B's control:
    Owner = Player A (they were instructed to create it? Actually: "Player A creates a token under
      Player B's control" — the owner is the player whose control effects are creating it.
    Actually: 111.2: "the player who creates a token is its owner." "Creates" means the one whose
      spell or ability is causing the creation.
    So: Player A's spell causes the creation → Player A is owner. If it enters under Player B's
      control: Player A owns it, Player B controls it. (Owner ≠ controller in this case.)
  WHY OWNERSHIP MATTERS:
    If the token would go to its owner's GY/library/hand: it goes to the OWNER (Player A).
    But it ceases to exist anyway (tokens can't exist outside battlefield).
    In a "return to owner's hand" effect: the token goes to Player A's hand... then ceases to exist
      (it's a token in a hand, which is a zone other than battlefield — SBA 704.5d).

TOKENS IN OTHER ZONES (111.7, 111.8):
  WHEN A TOKEN LEAVES THE BATTLEFIELD:
    Triggered abilities fire first (111.7: "applicable triggered abilities will trigger before the
      token ceases to exist").
    Then: SBA fires → token ceases to exist.
    The token IS in the zone briefly (long enough for triggers), but then it's gone.
  COMMON SCENARIO:
    Token dies (battlefield → GY):
      Token is "put into the graveyard." "Dies" triggered abilities fire (Blood Artist, etc.).
      SBA check: token in GY (not battlefield) → ceases to exist. Removed from game.
      The GY never contains the token after this SBA.
    What this means for "exile and return" effects on tokens:
      Flickerwisp targeting a token: token is exiled. Token triggers (if any) on leaving battlefield.
      Token in exile (not battlefield) → SBA → ceases to exist.
      Flickerwisp's delayed trigger: "at end of turn, return that exiled card to play."
      But the token is no longer in exile (it ceased to exist). Nothing to return.
      The token is GONE. It doesn't return.
    Same: blinking a token with Soulherder: token exiles, ceases to exist, doesn't return.
    This is a key interaction: targeting tokens with "blink" effects results in LOSING the token.
  TOKEN THAT WOULD GO TO HAND OR LIBRARY:
    Opponent casts "return target creature to its owner's hand."
    Targets a token: the token goes to its owner's hand.
    SBA fires: token in hand (not battlefield) → ceases to exist.
    Owner never has the token in hand. It's just gone.
    Similarly: "put target creature on top of its owner's library": token goes to top of library, ceases to exist.
    Library top is now one card smaller (the token is gone).

TOKEN EFFECTS — WHAT IS AND ISN'T A TOKEN:
  Token vs. Card (111.6):
    "A token isn't a card." Tokens are permanents but not cards.
    Implications:
      "Return target creature card from your graveyard": tokens in GY? Can't return (they ceases to exist, so nothing to return; and even if they could, they're not "cards").
      "Sacrifice a creature card": you can't sacrifice a TOKEN as a "creature card" (tokens aren't cards).
      Wait: but tokens ARE creatures. "Sacrifice a creature" (without "card"): tokens can be sacrificed.
      "Draw a card": no. "Put a token on the battlefield": is that like drawing a card? No. Token creation ≠ drawing.
      "Exile target card": can't exile a token as a "card" (it's not a card).
      "Exile target permanent": CAN exile a token (it's a permanent, even if not a card).
  COPY TOKENS (111.3):
    "Create a token that's a copy of [permanent]": the token gets all copiable values of the original.
    This is both a token AND a copy effect.
    Copy effects apply in Layer 1. The token's characteristics = copiable values of the original.
    The token is NOT a card; it IS a permanent.
    Rules: same as any token — ceases to exist if it leaves the battlefield.
    Populate ({G}{W}): "Create a token that's a copy of a creature token you control."
    Populate copies one of your creature tokens. The copy-token has all characteristics of the original token.
    If the original token was a 3/3 with flying: the copy-token is also a 3/3 with flying.

PREDEFINED TOKENS (111.10):
  MTG has defined "standard" tokens for convenience:
    Treasure: colorless artifact, "{T}, Sacrifice: Add one mana of any color."
    Food: colorless artifact, "{2}, {T}, Sacrifice: Gain 3 life."
    Clue: colorless artifact, "{2}, Sacrifice: Draw a card."
    Blood: colorless artifact, "{1}, {T}, Discard a card, Sacrifice: Draw a card."
    Gold: colorless artifact, "Sacrifice: Add one mana of any color." (like Treasure but no tap needed)
    Powerstone: colorless artifact, "{T}: Add {C}. This mana can't be used for nonartifact spells."
  These are shorthand. When a card says "create a Treasure token": uses the predefined definition.

LEGENDARY TOKEN RULE (111.9, SBA 704.5j):
  "Create a legendary token": the token is legendary.
  Legendary rule: if you control two or more legendary permanents with the same name, you sacrifice
    all but one (SBA 704.5j).
  If you create two tokens with the same legendary name: one must be sacrificed.
  Most legendary tokens have unique names (Boo, Emrakul token, etc.) — usually only one per game.
  But if an effect creates multiple of the same legendary token: the legendary rule applies immediately.
```

## Definitive Conclusions

- **Tokens have only the characteristics defined by their creating effect** — no mana cost, no rules text, no abilities beyond what's stated; not legendary unless specified.
- **Token owner = player whose effect created it** — not necessarily the controller.
- **Tokens cease to exist when they leave the battlefield (SBA)** — triggered abilities fire first, then the token is gone; it can't exist in any other zone.
- **Blinking a token destroys it** — exile causes it to cease to exist; the return trigger finds nothing; the token doesn't come back.
- **Tokens aren't cards** — "return creature card from GY," "exile target card," "sacrifice a creature card" — all require cards, which tokens aren't.
- **Populate creates a copy-token** — gets all copiable values of the original token; is itself a token that ceases to exist if it leaves the battlefield.
- **Predefined tokens (Treasure, Food, Clue, etc.) have standard characteristics** — when cards create these, they use the predefined rules.

## Canonical Example
**Flickerwisp Targeting a Token — Token Dies:**
You control a 3/3 green Elephant token (created by a Saproling-type effect, or Elephant Tokens from tokens).
Opponent casts Flickerwisp ({2}{W}): 3/1 flying creature. "When this creature enters, exile target permanent until this creature leaves the battlefield."
Flickerwisp ETB: exile the 3/3 Elephant token.
The Elephant token is exiled. "Leaves the battlefield" triggers fire (if any).
Token is now in exile. SBA: token in a zone other than battlefield → ceases to exist (704.5d).
Token is gone.
Flickerwisp later dies or leaves: its "until this creature leaves the battlefield" delayed trigger fires.
"Return that exiled permanent."
The Elephant token is no longer in exile (it ceased to exist). There's nothing to return.
Delayed trigger: the effect fails to return anything (the token no longer exists in exile to be returned).
Net result: You lost your 3/3 Elephant token for free. Bad outcome.

Lesson: Don't target your own tokens with "blink" effects. Targets opponents' REAL CARDS (permanents backed by actual cards) if you want them gone permanently.
If you target an opponent's creature (real card) with Flickerwisp: their creature goes to exile, then returns at end of turn. Flickerwisp = temporary exile for real cards, permanent exile for tokens.

**Example 2 — Blood Artist and Token Death Triggers:**
You control Blood Artist ({1}{B}): "Whenever this creature or another creature dies, target player loses 1 life and you gain 1 life."
You also control 10 Saproling tokens (1/1 green each).
Opponent casts Wrath of God: destroy all creatures.
Wrath resolves:
  ALL creatures are destroyed simultaneously (including Blood Artist itself and all 10 tokens).
  "Dies" triggers fire for each creature dying: Blood Artist (1 creature) + 10 tokens = 11 deaths.
  Blood Artist trigger fires once for EACH creature that dies (including itself).
  But wait: Blood Artist itself died. Can it trigger if it died?
  603.2: "A triggered ability triggers based on the state of the game at the time of the triggering event... the permanent was on the battlefield when the trigger condition occurred."
  Wrath: all are destroyed simultaneously. The triggering event is "a creature dies."
  All deaths are simultaneous. Blood Artist was on the battlefield when the deaths occurred.
  So Blood Artist's trigger fires once for itself and 10 times for the 10 tokens = 11 triggers.
  But Blood Artist is now in the GY. It triggered but it's gone.
  The 11 triggers go on the stack. Each trigger is controlled by Blood Artist's controller (you).
  For each trigger: "target player loses 1 life, you gain 1 life."
  11 triggers: opponent loses 11 life, you gain 11 life.
  The Saprolings: once they're in the GY (destroyed), SBA fires: tokens in GY → cease to exist.
  But the triggers already fired before tokens ceased to exist (111.7: triggers fire first).
  The triggers are already on the stack. They still resolve.
  Result: 11 life gained, 11 lost by opponent.

## Commonly Confused With
- **P003 (Zone Change — New Object)** — Tokens that are exiled and would return become new objects... except they don't exist at all. Tokens can't return from exile (111.8). P003 applies to cards; tokens are a special case where zone change = permanent destruction.
- **P011 (ETB Triggers)** — When you "create a token," the token ENTERS the battlefield. ETB triggers of the token (if it has any) fire. Also: effects that say "whenever a creature enters the battlefield" trigger for tokens entering (as they are permanents).
- **P355 (Copy Effects)** — A "token that's a copy of" something uses copy effect rules (copiable values). The copy-token has all characteristics from Layer 1 of the copy. If you then copy the copy-token with populate: you copy the copy-token's copiable values (not the original permanent's values if the copy-token has changed).
- **P339 (Dies Triggers)** — Tokens dying trigger "whenever a creature dies" effects. The trigger fires in the brief window before the token ceases to exist. Blood Artist, Zulaport Cutthroat: all trigger for token deaths.
