---
id: p378
name: Commander Rules — Commander Tax, 21 Combat Damage, Command Zone Returns, and Color Identity
category: multiplayer
cr_refs: [903.3, 903.4, 903.5, 903.6, 903.7, 903.8, 903.9a, 903.9b, 903.10a, 903.4a, 903.4d]
tags: [commander, commander-tax, 21-combat-damage, command-zone, color-identity, commander-return, replacement-effect, SBA-21-damage, deck-construction, color-identity-back-face, commander-ninjutsu, 40-life, partner]
created: 2026-03-29
examples_count: 2
---

# P378 — Commander Rules — Commander Tax, 21 Combat Damage, Command Zone Returns, and Color Identity

## Abstract
The **Commander variant** (rule 903) adds several critical rules to normal Magic gameplay. **Commander tax** (903.8): each time you cast your commander from the command zone, it costs {2} more per previous cast from there. **Command zone returns** (903.9a–b): when your commander would go to the GY or exile, you may instead put it in the command zone (a state-based action or replacement effect). **21 combat damage** (903.10a): if a player has been dealt 21 or more combat damage by the SAME commander over the course of the game, they lose the game. **Color identity** (903.4): determines deck construction — a deck can only contain cards whose color identity is a subset of the commander's color identity. Color identity includes all mana symbols in the card's mana cost AND rules text (including reminder text's symbols? No — 903.4c: reminder text is ignored), AND the back face of DFCs.

## The Definitive Rules

**CR 903.8** (verbatim): *"A player may cast a commander they own from the command zone. A commander cast from the command zone costs an additional {2} for each previous time the player casting it has cast it from the command zone that game. This additional cost is informally known as the 'commander tax.'"*

**CR 903.9a** (verbatim): *"If a commander is in a graveyard or in exile and that object was put into that zone since the last time state-based actions were checked, its owner may put it into the command zone. This is a state-based action. See rule 704."*

**CR 903.9b** (verbatim): *"If a commander would be put into its owner's hand or library from anywhere, its owner may put it into the command zone instead. This replacement effect may apply more than once to the same event. This is an exception to rule 614.5."*

**CR 903.10a** (verbatim): *"A player who's been dealt 21 or more combat damage by the same commander over the course of the game loses the game. (This is a state-based action. See rule 704.)"*

**CR 903.4** (verbatim): *"The Commander variant uses color identity to determine what cards can be in a deck with a certain commander. The color identity of a card is the color or colors of any mana symbols in that card's mana cost or rules text, plus any colors defined by its characteristic-defining abilities or color indicator."*

## The Pattern

```
COMMANDER TAX (903.8):
  HOW IT WORKS:
    Each time you cast your commander FROM THE COMMAND ZONE: costs {2} more per prior casting.
    First cast from command zone: normal mana cost.
    Second cast from command zone: + {2}.
    Third cast: + {4}. Fourth: + {6}. Etc.
    Formula: normal cost + ({2} × number of prior casts from command zone).
  WHAT "FROM THE COMMAND ZONE" MEANS:
    Only counts casts from the COMMAND ZONE. Not from hand, GY, or other zones.
    If your commander is in your hand and you cast it: NO additional tax.
    If your commander goes to GY and you redirect to command zone: the NEXT cast from command zone
      incurs the tax.
    If you cast your commander from GY (via flashback, unearth, etc.): NO tax.
    If you use Yuriko commander ninjutsu: ninjutsu is an ACTIVATED ABILITY (not a cast). NO tax.
      Wait: ninjutsu puts the commander onto the battlefield directly (from hand or command zone).
      702.49d: Commander ninjutsu functions from the command zone.
      "Put this card onto the battlefield": NOT a cast. No tax.
    Tax accumulates per cast FROM command zone, not per death/exile/return.
  COMMANDER TAX AND COST REDUCTIONS:
    Like all costs: tax can be reduced by cost reduction effects.
    Emerald Medallion ({2}: reduces green spells by {1}): reduces your commander's cost too.
    Jodah, Archmage Eternal: "You may pay {W}{U}{B}{R}{G} rather than pay the mana cost of spells."
      This alternative cost DOESN'T bypass commander tax (it replaces the mana cost, not the total cost).
      Tax is an additional cost, separate from mana cost. Alternative cost replaces mana cost; tax still applies.
      Wait: Jodah says "rather than pay the mana cost." Additional costs (like commander tax) still apply.
      So Jodah + commander tax: pay {W}{U}{B}{R}{G} + {2} per tax increment.

COMMAND ZONE RETURNS (903.9a–b):
  TWO MECHANISMS:
    1. GY or Exile (903.9a): REPLACEMENT EFFECT? No, actually: 903.9a says "This is a state-based action."
       Hmm, re-reading: "If a commander is in a graveyard or in exile and that object was put into that
         zone since the last time state-based actions were checked, its owner may put it into the command
         zone. This is a state-based action."
       So: it's an SBA that fires when the commander lands in GY/exile.
       The owner CHOOSES (may = optional) whether to invoke this SBA.
       If they choose to put it in command zone: the commander goes directly to command zone from GY/exile.
    2. Hand or Library (903.9b): REPLACEMENT EFFECT.
       "If a commander would be put into its owner's hand or library from anywhere, its owner may put it
         into the command zone instead."
       This is a replacement effect ("instead"). It fires before the commander reaches hand/library.
  KEY TIMING:
    903.9a (GY/exile): the commander DOES enter GY/exile briefly (since the last SBA check).
      This means: "whenever a creature dies" triggers FIRE for commanders going to the GY.
      The commander is in the GY momentarily. Blood Artist triggers. Then: SBA → command zone.
      Death triggers see the commander die (briefly in GY before command zone redirect).
    903.9b (hand/library): the commander NEVER reaches hand/library.
      "Would be put into" — replacement effect. The commander goes to command zone instead.
      No "enters hand" triggers. No library placement effects.
    If the commander is EXILED: the SBA fires and owner may put it in command zone.
      But: if an exile effect says "exile it permanently" or "if it would leave exile, instead..."
        those replacement effects might conflict with the command zone SBA.
      SBA 903.9a: the OWNER CHOOSES. Even if the exile effect didn't intend permanent exile.
  COMMAND ZONE RETURN AND TAX:
    Returning to command zone doesn't automatically increase tax. Tax only increases when cast.
    A commander that goes back to command zone 5 times but was cast once: still only {2} tax.
    A commander cast twice from command zone: {4} tax regardless of how many times it died.

21 COMBAT DAMAGE (903.10a):
  WHAT COUNTS:
    "Combat damage" specifically. Not:
      - Direct damage spells (Lightning Bolt, Shock).
      - Non-combat damage from abilities (ETB damage, etc.).
      - Noncombat life loss.
    ONLY damage dealt "in combat" (during the combat damage step).
  "SAME COMMANDER":
    The damage tracker is tied to the specific commander identity (the card designation).
    If the commander leaves the battlefield and comes back: it's still the same commander.
    "Over the course of the game" = cumulative. Each combat damage hit is added.
    21 is the threshold. 21st point of combat damage from same commander = that player loses (SBA).
  COMMANDER DAMAGE AND EQUIPMENT:
    A commander equipped with +X/+0 deals more combat damage per hit.
    The damage dealt in combat with all its bonuses counts as commander damage.
    Doublestrike: deals damage in first-strike AND regular combat damage steps.
      Each step's damage counts (2 damage × 2 steps = 4 combat damage per attack with doublestrike).
      Wait: power doesn't change between steps. A 5/5 with doublestrike: deals 5 first strike, then 5 regular.
      Total combat damage to the same player from one attack: 10. Counts toward commander damage.
  MULTIPLE COMMANDERS (PARTNER):
    If a player has two commanders (partner): each has SEPARATE 21 damage trackers.
    702.124d: "each of your two commanders function independently... commander damage from each
      of your two commanders separately."
    So: 21 combat damage from Commander A kills a player. Commander B's 21 is tracked separately.
    Even if Partner 1 and Partner 2 are both attacking: their damage tracked separately.

COLOR IDENTITY (903.4):
  WHAT DETERMINES COLOR IDENTITY:
    All mana symbols in the mana cost.
    All mana symbols in the rules text (including in ability costs, effects, etc.).
    Characteristic-defining abilities that define colors (e.g., Devoid makes the card colorless).
    Color indicators on the card.
    For DFCs: 903.4d: "The back face of a double-faced card is included when determining color identity."
      So if the back face has {B} symbols: black is part of the color identity even if front face is only {W}.
  REMINDER TEXT EXCLUDED (903.4c):
    "Reminder text is ignored when determining color identity."
    If a card has "(This is an activated ability.)" reminder text in parentheses: those parenthetical
      symbols are reminder text and don't count.
    But actual mana symbols in the text DO count.
  WHY COLOR IDENTITY MATTERS:
    You can only put cards in your Commander deck whose color identity is a SUBSET of your commander's.
    Cards with mana symbols outside your commander's identity are not allowed.
    EXAMPLE: Commander with color identity {W}{U}{B} (Esper):
      Can include cards with any combination of W, U, B. Not R. Not G.
      A card with {R/G} hybrid mana in its text: banned (R and G are outside identity).
      A card with {C} (colorless) symbols only: allowed (no color).
      A card with {W} in activation cost AND {U} in another ability: both W and U are in identity.
        Allowed if commander is W/U or any superset including both.
    LANDS WITH MANA ABILITIES:
      Reflecting Pool ({T}: Add one mana of any type that a land you control could produce):
        Reflecting Pool's text has no mana symbols. No color identity from rules text.
        Color identity: colorless. Can be in any commander deck.
      City of Brass ({T}: Add one mana of any color, but you lose 1 life): same — no color symbols.
        City of Brass can be in any Commander deck (no mana symbols in rules text).
      But: Exotic Orchard ({T}: Add one mana of any type that a land an opponent controls could produce):
        "any type" — no mana symbols. Any commander deck.
      Sacred Foundry ({T}: Add {R} or {W}): has {R} and {W} symbols. Color identity is R/W.
        Can't be in a mono-blue commander deck. Can be in an R/W or any superset.
```

## Definitive Conclusions

- **Commander tax adds {2} per cast from the command zone** — only from command zone; casting from hand, GY, or via ninjutsu/other mechanisms doesn't count; cost reduction effects can reduce the total.
- **When a commander goes to GY/exile, the owner may choose (SBA) to redirect it to the command zone** — death triggers fire first (commander briefly in GY); then SBA fires; owner chooses command zone or not.
- **When a commander would go to hand/library, owner may redirect to command zone via replacement effect** — the commander never reaches hand/library; no "enters hand" triggers.
- **21 combat damage from the same commander = game loss (SBA)** — cumulative over the whole game; combat damage only (not burn spells); doublestrike counts both damage steps; partner commanders tracked separately.
- **Color identity includes all mana symbols in the card's text and back face of DFCs** — reminder text excluded; lands with no mana symbols in their text have colorless identity.

## Canonical Example
**Commander Tax Buildup:**
Your commander: Krenko, Mob Boss ({2}{R}{R}). Starting cost: {2}{R}{R} (4 mana).
First cast: {2}{R}{R}. Krenko enters. Opponents kill Krenko. You choose to redirect to command zone.
Second cast: {2}{R}{R} + {2} (1 prior cast) = {4}{R}{R} (6 mana total).
Third cast: {2}{R}{R} + {4} (2 prior casts) = {6}{R}{R} (8 mana). Quite expensive.
Fourth cast: {2}{R}{R} + {6} = {8}{R}{R} = 10 mana. Almost uncastable without ramp.

With Goblin Warchief ({1}{R}{R}): "Goblin spells you cast cost {1} less."
Krenko is a Goblin. Costs {1} less. Each cast from command zone now costs {1} less per cast.
First cast: {2}{R}{R} - {1} = {1}{R}{R} (3 mana).
Second cast: {4}{R}{R} - {1} = {3}{R}{R} (5 mana). Still manageable.
The cost reduction stacks with the tax reduction: Warchief cuts each cast by 1.

If Krenko goes to GY and redirects to command zone (doesn't increase tax):
If Krenko is bounced to your HAND (command zone replacement) — you choose command zone: no tax increase.
  But if you keep it in hand: next cast from HAND = no tax. Great option!
  Cast Krenko from hand for {2}{R}{R} (no tax). Value play.

**Example 2 — 21 Commander Damage Race:**
Your commander: Skithiryx, the Blight Dragon ({3}{B}{B}). Infect, flying, haste. 4/4.
With infect: damage to players gives poison counters, NOT commander damage?
Wait: infect replaces "life loss" with "poison counters." But commander damage is tracked separately.
Does infect damage count as commander damage for the 21-damage threshold?
Yes: Skithiryx still deals "combat damage" — it's just that the combat damage gives poison counters
  instead of life loss. The combat damage amount is still tracked for commander damage.
So: Skithiryx can kill via POISON (10 counters) OR via COMMANDER DAMAGE (21 combat damage).
  In practice: infect decks usually kill via poison (10 counters faster).
  But: theoretically, 21 commander damage tracking still happens.
  A 4/4 Skithiryx: 6 hits = 24 commander damage. That's faster than poison at 10 counters.
  Actually: 6 attacks × 4 damage = 24 commander damage. 3 attacks × 4 infect = 12 poison (still need 10).
  Either way: Skithiryx is terrifying as a commander.

Commander damage race example (non-infect):
Ulamog, the Infinite Gyre ({11}): 10/10 annihilator, indestructible.
Attacks: 10 commander damage per unblocked attack.
2 attacks: 20 damage. 3rd attack: 21 damage. Any player at 21+ loses the game (SBA).
Even if they're at 40 life: 3 hits from Ulamog = dead from commander damage regardless of life total.

## Commonly Confused With
- **P003 (Zone Change — New Object)** — When a commander changes zones normally, it would become a new object (P003). But 903.9a/b allow the owner to redirect it to command zone, where it retains its "commander" designation. It IS treated as the same commander for damage tracking and tax purposes — the command zone redirect preserves the identity.
- **P002 (Replacement Effects)** — 903.9b is a replacement effect. 903.9a is an SBA. The death-trigger vs. replacement timing is important: for GY/exile (903.9a), death triggers fire first. For hand/library (903.9b), it's a replacement — the commander never reaches hand/library.
- **P369 (Infect)** — Infect commanders still accumulate commander damage (the combat damage amount is tracked even if converted to poison counters). A player can die from commander damage (21) OR from infect (10 poison) — whichever threshold is hit first.
- **P352 (Lifelink/Deathtouch)** — Lifelink on a commander: you gain life from the commander's combat damage. That same damage is tracked as commander damage. A commander with lifelink dealing 21+ damage to a player: they lose the game AND you gain life from it.
