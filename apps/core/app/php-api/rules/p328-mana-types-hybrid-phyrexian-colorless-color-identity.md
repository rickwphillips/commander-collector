---
id: p328
name: Mana System — Types, Hybrid, Phyrexian, Colorless vs Generic, Color Identity, Mana Abilities
category: costs
cr_refs: [106.1, 106.1a, 106.1b, 106.4, 106.8, 106.9, 106.10, 107.4c, 107.4e, 107.4f, 605.1a, 605.1b, 605.3b, 605.4a, 903.4, 903.5c]
tags: [mana, hybrid-mana, phyrexian-mana, colorless-mana, generic-mana, snow-mana, color-identity, Commander-deckbuilding, mana-ability, mana-pool, Atraxa, Gitaxian-Probe, Dismember, Selvala, Devotion, color-pie]
created: 2026-03-29
examples_count: 2
---

# P328 — Mana System — Types, Hybrid, Phyrexian, Colorless vs Generic, Color Identity, Mana Abilities

## Abstract
Mana is the primary resource in Magic. There are **five colors** of mana (white, blue, black, red, green) and **six types** (those five plus colorless). **Generic mana** ({1}, {2}, {X}) in costs can be paid with ANY type of mana; **colorless mana** ({C}) in costs can ONLY be paid with colorless mana. **Hybrid mana** symbols represent costs payable with either of two options; **Phyrexian mana** symbols can be paid with the corresponding colored mana OR by paying 2 life. In Commander, **color identity** determines which cards are legal in a deck — it includes ALL mana symbols in the mana cost AND rules text of the card, plus any color indicators. **Mana abilities** are special: they don't go on the stack, can't be responded to, and resolve immediately.

## The Definitive Rules

**CR 106.1a** (verbatim): *"There are five colors of mana: white, blue, black, red, and green."*

**CR 106.1b** (verbatim): *"There are six types of mana: white, blue, black, red, green, and colorless."*

**CR 106.4** (verbatim): *"When an effect instructs a player to add mana, that mana goes into a player's mana pool. From there, it can be used to pay costs immediately, or it can stay in the player's mana pool as unspent mana. Each player's mana pool empties at the end of each step and phase, and the player is said to lose this mana."*

**CR 106.8** (verbatim): *"If an effect would add mana represented by a hybrid mana symbol to a player's mana pool, that player chooses one half of that symbol. If a colored half is chosen, one mana of that color is added to that player's mana pool. If a generic half is chosen, an amount of colorless mana represented by that half's number is added to that player's mana pool."*

**CR 106.9** (verbatim): *"If an effect would add mana represented by a Phyrexian mana symbol to a player's mana pool, one mana of the color of that symbol is added to that player's mana pool."*

**CR 107.4c** (verbatim): *"The colorless mana symbol {C} is used to represent one colorless mana, and also to represent a cost that can be paid only with one colorless mana."*

**CR 107.4e** (verbatim): *"A hybrid mana symbol is also a colored mana symbol, even if one of its components is colorless. [...] A hybrid symbol such as {W/U} can be paid with either white or blue mana, and a monocolored hybrid symbol such as {2/B} can be paid with either one black mana or two mana of any type. A hybrid mana symbol is all of its component colors."*

**CR 107.4f** (verbatim): *"Phyrexian mana symbols are colored mana symbols: {W/P} is white, {U/P} is blue, {B/P} is black, {R/P} is red, and {G/P} is green. A Phyrexian mana symbol represents a cost that can be paid either with one mana of its color or by paying 2 life."*

**CR 605.3b** (verbatim): *"An activated mana ability doesn't go on the stack, so it can't be targeted, countered, or otherwise responded to. Rather, it resolves immediately after it is activated."*

**CR 903.4** (verbatim): *"The Commander variant uses color identity to determine what cards can be in a deck with a certain commander. The color identity of a card is the color or colors of any mana symbols in that card's mana cost or rules text, plus any colors defined by its characteristic-defining abilities (see rule 604.3) or color indicator (see rule 204)."*

**CR 903.5c** (verbatim): *"A card can be included in a Commander deck only if every color in its color identity is also found in the color identity of the deck's commander."*

## The Pattern

```
THE SIX TYPES OF MANA:
  Five colored: {W} white, {U} blue, {B} black, {R} red, {G} green.
  One colorless: {C}.
  Note: "colorless" is both a type of mana AND the color of colorless cards.

GENERIC MANA IN COSTS ({1}, {2}, {X}):
  Generic mana = numerical symbols (not colored, not {C}).
  Generic mana in a cost can be paid with ANY type of mana (colored or colorless).
  A {3} cost: pay with 3 forests if you want. Or any combination.
  {X} is also generic mana in costs; X is announced as part of casting.

COLORLESS MANA ({C}):
  {C} in a cost can ONLY be paid with colorless mana.
  Example: Wastes produces {C}. Eldrazi like Thought-Knot Seer have {C} in their cost.
  "Tap: add {C}" from a Wastes = specifically colorless. Use it for {C} costs or for generic costs.
  If a cost has {2}{C}{C}, you need specifically 2 colorless mana + 2 mana of anything.
  {C} is NOT "any mana" — it's a restriction, not flexibility.
  Contrast: {1} in a cost = pay with any mana. {C} in a cost = pay with colorless mana only.

HYBRID MANA (CR 107.4e):
  Hybrid symbols like {W/U}, {B/R}, {G/W} etc.
  A hybrid symbol represents a cost payable with EITHER of its two colors.
  {W/U}: pay with {W} OR {U}.
  The hybrid symbol is ALL of its colors: {W/U} is both white and blue.
    → A card with {W/U} in its mana cost has color identity of both white AND blue.
    → A card with {W/U}{W/U} in its mana cost is white and blue.
    → BUT: you can cast it for {W}{W}, {W}{U}, or {U}{U}.
  Monocolored hybrid like {2/B}: pay with 1 black mana OR pay 2 generic mana.
    Creatures like Beseech the Queen use {2/B}{2/B}{2/B}: cast for 3 black OR 6 of anything.
    Color identity: {2/B} is black. The card is only black for color identity (the 2 is colorless/generic).
  Hybrid Phyrexian like {W/U/P}: pay with white, blue, OR 2 life.
    These are all colors involved. Very flexible mana cost.

PHYREXIAN MANA (CR 107.4f):
  Phyrexian symbols: {W/P}, {U/P}, {B/P}, {R/P}, {G/P}.
  Each can be paid with the corresponding color mana OR by paying 2 life.
  You don't have to choose at the time you cast — you choose for each symbol when casting (CR 118.13a).
  PHYREXIAN AND COLOR IDENTITY:
    {B/P} is black. A card with {B/P} in its mana cost has black in its color identity.
    IMPORTANT: Gitaxian Probe has {U/P} in its mana cost.
      In Commander: Gitaxian Probe has blue color identity. Can't go in a mono-black deck.
      Even though you can pay 2 life instead of {U}: the symbol is still blue for identity purposes.
    Dismember ({1}{B/P}{B/P}): mana cost has black Phyrexian symbols. Color identity includes black.
      Can be included in a black Commander deck.
      Can be cast in ANY deck: pay {1} + 4 life. Zero mana cost played in non-black decks.
      BUT: color identity says it's black. Commander deckbuilding requires black.
      Wait: a non-black Commander deck can't include Dismember even though players might pay all life.
      The DECKBUILDING rule (903.5c) is about color identity, not what mana you spend.

SNOW MANA {S}:
  Snow mana symbol in a cost = must be paid with mana from a snow source.
  Snow sources: snow lands, snow permanents with mana abilities.
  {S} in costs can't be reduced by generic mana cost reduction effects.
  Snow is not a color and not a type of mana — it's a property of the mana source.
  Most snow mana abilities: "{T}: Add {S}" where S is one of the colors/colorless.
  Example: Glacial Floodplain is a snow land that taps for {W} or {U} and is a snow source.

MANA POOL — FILLING AND EMPTYING (CR 106.4):
  Mana goes INTO the mana pool when an effect says "add."
  You can hold unspent mana in your pool.
  At the END OF EACH STEP AND PHASE: pool empties. You "lose" unspent mana.
  Steps: untap, upkeep, draw, main (has priority), beginning of combat, declare attackers,
    declare blockers, combat damage, end of combat, second main, end, cleanup.
  Mana doesn't persist between steps! If you add {G} during your main phase and don't spend it:
    When you move to declare attackers: mana pool empties → you lose that {G}.
    (This replaced the old "mana burn" rule in older editions. No damage, just lose the mana.)
  When you pass priority (CR 106.4b): announce what mana remains in your pool.
    If any mana in pool: you have unspent mana. Opponent knows about it (unless tricks are afoot).

MANA ABILITIES (CR 605.3b — the "no stack" rule):
  A mana ability is an activated ability that:
    1. Doesn't require a target (no "target creature" etc.)
    2. Could add mana when it resolves
    3. Is not a loyalty ability
  Mana abilities DON'T go on the stack.
  They resolve IMMEDIATELY when activated.
  They CAN'T be countered, targeted, or responded to.
  Examples: Forest ({T}: Add {G}), Sol Ring ({T}: Add {C}{C}), Selvala, Heart of the Wilds
    (tap: add {G} for each creature you control — still a mana ability, just variable output).
  NON-MANA ABILITY THAT MAKES MANA:
    Deathrite Shaman ({B}: Exile target creature card from a graveyard. Each opponent loses 1 life.)
    Wait: this has a TARGET and has other effects. NOT a mana ability.
    If it said "{B}: Add {B}" it'd be a mana ability.
    Faeburrow Elder ({T}: Add one mana of any color for each color among permanents you control):
      No target. Adds mana. Not a loyalty ability. → Mana ability. No stack.
  Selvala, Heart of the Wilds (rare exception to check):
    "{T}: Add {G}. For each other creature with power greater than or equal to its own, the controller of that creature may look at the top card of their library."
    Wait: actually Selvala's known version is:
    "{T}: Add an amount of {G} equal to the greatest power among creatures you control."
    No target. Adds mana. → Mana ability. Resolves immediately.

COLOR IDENTITY IN COMMANDER (CR 903.4):
  Color identity = ALL mana symbols in mana cost + ALL mana symbols in rules text.
  Also includes: color indicators (the dot on back faces), CDAs that define colors.
  NOT included: reminder text (CR 903.4c), basic land type alone.
    Note: a land with Forest type doesn't automatically have green identity—
    but Breeding Pool says "{T}: Add {G} or {U}" in its rules text → green + blue.
  COLOR IDENTITY EXAMPLES:
    Artifact creature Bosh, Iron Golem (mana cost {8}): rules text includes "{3}{R}" cost.
      Color identity: RED (from the {R} in the activated ability's cost).
    Deathbringer Liege (mana cost {2}{W/B}{W/B}): hybrid white/black symbols.
      Color identity: white AND black. Can't go in mono-white or mono-black Commander.
    Goblin Electromancer (mana cost {U}{R}): color identity = blue AND red.
    Atraxa, Praetors' Voice ({G}{W}{U}{B}): identity = green, white, blue, black. 4-color.
    Blightsteel Colossus (mana cost {12}): all generic. Rules text: no colored symbols.
      Color identity: COLORLESS. Goes in any Commander deck!
  THE RULES TEXT CATCH:
    Reflecting Pool ({T}: Add one mana of any type that a land you control could produce):
      No colored symbols in rules text (just describes what others produce). Colorless identity.
    Exotic Orchard ({T}: Add one mana of any color that a land an opponent controls could produce):
      Same. No colored symbols. Colorless identity.
    But: Sunpetal Grove (enters tapped unless Forest or Plains): no colored mana symbols in text.
      Colorless identity (can go in any Commander).
    Shock ({R}: deals 2 damage to any target): obvious red identity.

  ACTIVATED ABILITY COSTS COUNT:
    If a card says "{W}: Do something," the {W} in the activation cost contributes white identity.
    Bosh example: {3}{R} activation cost → red identity.
    This means a colorless artifact with an ability that costs {W}: is white identity.
      Example: Skullclamp has {1} equip — no color identity. Goes in any deck.
      Example: if a card said "{W}: regenerate this" — white identity.

DEVOTION AND MANA SYMBOLS:
  Devotion to a color = number of mana symbols of that color among permanents you control.
  Hybrid symbols count for EACH color component.
  {W/U} on a permanent: contributes 1 to white devotion AND 1 to blue devotion.
  Nightveil Specter {U/B}{U/B}{U/B}: 3 hybrid blue/black symbols.
    Devotion to blue: +3 (from Nightveil) + any other blue permanents.
    Devotion to black: +3 (from Nightveil) + any other black permanents.
    It counts for BOTH simultaneously.
  Phyrexian symbols: {B/P} on a permanent contributes 1 to black devotion.
    (Phyrexian mana is a colored mana symbol — CR 107.4f — so it counts for devotion.)
```

## Definitive Conclusions

- **Six types of mana: five colored plus colorless** — generic costs ({1},{2}) accept any type; {C} costs require specifically colorless.
- **Hybrid mana symbols are ALL their component colors** — for color identity AND devotion, they count for each component color.
- **Phyrexian mana pays 2 life instead of colored mana** — but it's still a colored mana symbol, so it contributes to color identity (e.g., Gitaxian Probe has blue identity even though you can pay life).
- **Mana pools empty at the end of each step and phase** — unspent mana is simply lost (no damage in modern rules).
- **Mana abilities don't use the stack** — they resolve immediately, can't be countered or responded to.
- **Color identity includes mana symbols in RULES TEXT** — not just the mana cost; activated ability costs count.
- **Commander deckbuilding uses color identity** — a card with any color in its identity that isn't in the commander's identity is illegal.

## Canonical Example
**Dismember in Commander — Color Identity Trap:**
A player wants to include Dismember ({1}{B/P}{B/P}) in their Atraxa, Praetors' Voice Commander deck.
Atraxa's color identity: {G}{W}{U}{B} — green, white, blue, black.
Dismember's color identity: {B/P}{B/P} contains black Phyrexian symbols → black identity.
Black is in Atraxa's identity. Dismember is legal in the Atraxa deck.

A second player wants to include Dismember in their Elesh Norn, Grand Cenobite Commander deck.
Elesh Norn's color identity: {W}{W}{W}{W} (mana cost {5}{W}{W}) and rules text has no other symbols.
Wait: does Elesh Norn's rules text have {B} anywhere? No: "Creatures your opponents control get -2/-2."
So Elesh Norn's color identity is WHITE only.
Dismember has BLACK in its identity. BLACK is not in Elesh Norn's identity.
Result: Dismember is ILLEGAL in an Elesh Norn Commander deck.
This shocks some players who plan to pay 4 life instead of any mana: the payment method doesn't matter for deckbuilding. Color identity is the symbol, not how you plan to pay.

**Example 2 — Mana Abilities and Responding:**
Your opponent is at 1 life. You want to cast Lightning Bolt ({R}) targeting them.
Your only red source: one Mountain.
You tap the Mountain. It produces {R} via its mana ability.
Opponent tries to "respond to your tapping the Mountain."
RULING: Mountain's tap ability is a mana ability (CR 605.1a): no target, adds mana, not loyalty.
CR 605.3b: Mana abilities don't go on the stack. They resolve immediately.
Opponent cannot respond to the mana ability itself. The {R} is immediately in your mana pool.
What opponent CAN do: they can wait until you cast Lightning Bolt (when it goes on the stack)
and respond to Lightning Bolt with removal on you, a counterspell, or instant-speed life gain.
But they can't prevent you from tapping for mana before you've committed to casting anything.

Additional complexity: Selvala, Heart of the Wilds ({2}{G}: Legendary 2/4).
Ability: "{T}: Add an amount of {G} equal to the greatest power among creatures you control."
If you control a 10/10 creature: tap Selvala → immediately adds {G}{G}{G}{G}{G}{G}{G}{G}{G}{G}.
No window to kill the 10/10 between "Selvala taps" and "mana goes in pool."
The mana ability is fast. Mana is in pool before anyone can act.
Compare: Faeburrow Elder — also a mana ability. Also instant.
The distinction matters when effects try to disrupt mana production.
Stifle (counter target activated or triggered ability): CAN'T target a mana ability.
CR 605.3b: mana abilities don't go on the stack → can't be targeted by Stifle.

## Commonly Confused With
- **P001 (Combat Damage Routing — Trample)** — Not directly related. But mana from combat effects (Selvala, GGGG from attack) are mana abilities and don't use the stack.
- **P317 (Double-Faced Cards)** — DFC back face contributes to color identity (CR 903.4d). If a back face has {R}, the whole card has red in its color identity even if the front face is colorless.
- **P323 (Modern Keywords Survey — Phyrexian/Compleated)** — Compleated planeswalkers use Phyrexian mana in their mana costs. Paying life instead of mana still means those symbols are in the mana cost; the planeswalker's color identity includes those colors. Also, when you pay life for Phyrexian symbols when casting a compleated planeswalker, it enters with fewer loyalty counters (CR 702.165a).
- **P325 (Proliferate/Counters)** — Energy counters ({E}) are a player resource. They're different from mana: they don't go in the mana pool and don't empty at end of step. Energy counters persist.
