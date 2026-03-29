---
id: p313
name: X Spells — Choosing X and Mana Value of Zero Outside the Stack
category: costs
cr_refs: [107.3a, 107.3b, 107.3c, 107.3g, 107.3h]
tags: [X-spell, mana-value, variable-cost, announce-X, cascade-X, Fireball, Comet-Storm, Finale-of-Devastation, Hydra-Broodmaster, Grapeshot, Living-End-MV0, cost-without-paying]
created: 2026-03-29
examples_count: 2
---

# P313 — X Spells — Choosing X and Mana Value of Zero Outside the Stack

## Abstract
Spells with X in their mana cost require the caster to choose and announce the value of X when casting. While the spell is on the stack, X equals the announced value. **Crucially**: in any zone other than the stack (hand, graveyard, exile, library), a card with X in its mana cost has mana value (formerly "converted mana cost") where X = 0. This is critical for cascade interactions (cascade can't find a spell with {X}{R} if X=5 would make the MV too high — cascade uses X=0). When cast "without paying its mana cost," X must be 0 unless another effect defines X.

## The Definitive Rules

**CR 107.3a** (verbatim): *"If a spell or activated ability has a mana cost, alternative cost, additional cost, and/or activation cost with an {X}, [-X], or X in it, and the value of X isn't defined by the text of that spell or ability, the controller of that spell or ability chooses and announces the value of X as part of casting the spell or activating the ability."*

**CR 107.3b** (verbatim): *"If a player is casting a spell that has an {X} in its mana cost, the value of X isn't defined by the text of that spell, and an effect lets that player cast that spell while paying neither its mana cost nor an alternative cost that includes X, then the only legal choice for X is 0."*

**CR 107.3g** (verbatim): *"If a card in any zone other than the stack has an {X} in its mana cost, the value of {X} is treated as 0, even if the value of X is defined somewhere within its text."*

## The Pattern

```
CHOOSING X:
  When you cast a spell with {X} in mana cost: announce X before paying costs.
  X is your choice (unless the spell defines it).
  You pay {X} generic mana + any other costs in the mana cost.
  Example: Fireball ({X}{R}). Choose X=5. Pay {5}{R} = 6 total mana. Fireball deals 5 damage.

  ANNOUNCING X:
    Done at the start of casting: step 601.2b.
    X is locked in for the rest of casting.
    Opponents see your choice: no hidden X value.
    Changes to X after announcement: only via effects that explicitly say so.

MANA VALUE (MV) OF X SPELLS:
  On the stack: MV = X + any other mana in the cost.
    Fireball with X=5: MV = 5 + 1 (the {R}) = 6 while on stack.
    X=0: MV = 0 + 1 = 1.
  In any other zone (hand, GY, library, exile): X = 0 → MV = 0 + other costs.
    Fireball in hand: MV = 0 + 1 = 1.
    Comet Storm ({X}{R}R) in GY: X=0, MV = 0 + 2 = 2.
    Hydra Broodmaster ({4}{G}{G}) — NOT an X spell (fixed mana cost): MV = 6 everywhere.

  CRUCIAL: X = 0 outside the stack.
    If a card says "search for a card with MV 4 or less":
    A card like Finale of Devastation ({X}{G}{G}) in GY has MV 2 (0+2).
    It IS findable by "MV 4 or less" effects even though you'd pay large X values normally.

X SPELLS AND CASCADE:
  Cascade: "Exile until you find a nonland card with MV strictly less than this spell's MV."
  Bloodbraid Elf MV 4: cascade finds nonland with MV ≤ 3.
  If your deck has Grapeshot ({1}{R}, MV 2): cascade from Bloodbraid can find Grapeshot.
  Wait: Grapeshot is not an X spell. MV 2 regardless.
  Can cascade find Finale of Devastation ({X}{G}{G}): in library, X=0, MV=2. Cascade spell with MV 4 can find it (MV 2 < MV 4).
  If found, you "may cast it without paying mana cost." Since no mana cost being paid: X must be 0.
  CR 107.3b: cast without paying mana cost → X = 0.
  So cascade finds Finale of Devastation and casts it for free at X=0.
  Finale of Devastation at X=0: search for a creature with MV 0. Largely useless.
  Cascade + X spell interaction: usually not worth it (X=0 is weak).

X SPELLS CAST "WITHOUT PAYING MANA COST":
  CR 107.3b: "the only legal choice for X is 0."
  This applies to: flashback, cascade, Mind's Desire, various "cast without paying mana cost" effects.
  Exceptions: some effects say "you may cast it for its mana cost" (different from "without paying").
  Also: Omniscience ({7}{U}{U}{U}): "You may cast spells from hand without paying their mana costs."
  With Omniscience: cast Sphinx's Revelation ({X}{W}{U}) without paying mana cost.
  X must be 0. Draws 0 cards. Gains 0 life. Underwhelming.
  Better: Omniscience doesn't say "you may cast X spells." It says "without paying mana costs."
  X=0 is the only legal choice.
  UNLESS: the X spell's text defines X based on something else.
  Some X spells: "X is equal to the number of creatures you control."
  In that case, X isn't "chosen by you" — it's defined by the card. CR 107.3c applies.
  CR 107.3c: "if value of X is defined by the text, that's the value." X isn't your choice.
  Cast without mana cost: X uses the defined value, not 0.
  Example (hypothetical): "{X}{G}: Create X 1/1 tokens where X = number of lands you control."
  Cast without mana cost: X = lands you control (defined by text). You'd get X tokens.
  But: paying {0} to cast it... actually "cast without paying mana cost" doesn't even pay anything.
  The defined X still applies.

KICKER + X:
  Comet Storm with Multikicker and X:
    Multikicker cost is additional, not part of the X mana cost.
    Multikicker is paid separately. X is announced first, then multikicker payments.
    MV of Comet Storm with X=5 and kicked 3 times on the stack: MV = X + 1 (base) = 5+1=6.
    Multikicker doesn't affect MV.

PLANESWALKER X ABILITIES:
  Planeswalker loyalty abilities can have X in their cost: [-X] or [+X].
  "Nicol Bolas, Planeswalker [-X]: Destroy target creature you control. X is..."
  Wait: let me use a real example.
  Karn Liberated (Planeswalker): -3: Exile target permanent.
  Not X. Let me use: Vivien, Arkbow Ranger: [-5]: discard a card. Search for a creature.
  X abilities on planeswalkers: handled by CR 107.3c (planeswalker ability defines X or controller chooses).
  Ral, Storm Conduit: "[-X] Create a red instant copy of target instant or sorcery spell."
  X = loyalty you choose to remove. CR 107.3a applies.

NOTABLE X SPELL INTERACTIONS:
  Sphinx's Revelation ({X}{W}{U}{U}):
    Cast for X=7: pay {7}{W}{U}{U} = 10 mana total. Draw 7, gain 7 life.
    X=0: draw 0, gain 0. A 3-mana spell with no effect.
    In hand: MV = 0 + 3 = 3 (X=0 in hand).
    Cascade that hits Sphinx's Revelation (if cascade spell MV > 3): finds it. Cast for free. X=0. Useless.

  Finale of Devastation ({X}{G}{G}):
    "Search for a creature with MV ≤ X, put it on the battlefield."
    "If X ≥ 10: creatures you control get +X/+X and haste until EOT."
    X=10: put any creature, give +10/+10 haste. Game-winning.
    X=0: search for a creature with MV 0 (tokens or zero-drop creatures).
    In hand: MV = 2. Finding it by MV tutors: treated as a 2-drop.

  Genesis Wave ({X}{G}{G}{G}):
    "Reveal top X cards. Put all permanents revealed this way onto the battlefield."
    X=10: reveal top 10, put all permanents into play.
    In library: MV = 3 (X=0 + {G}{G}{G}).
    The "reveal and put into play" makes this an X spell where larger X is always better.
```

## Definitive Conclusions

- **X is announced when casting** — opponents know the value immediately.
- **In any zone other than the stack, X = 0** — so Fireball ({X}{R}) in your GY has MV 1 (not MV X+1).
- **Casting an X spell "without paying mana cost" forces X = 0** — unless the spell's text defines X.
- **Cascade can find X spells** — since X=0 outside the stack, many X spells have low MV and are findable.
- **If the card's text defines X** (not the player), CR 107.3c applies and X uses the defined value.

## Canonical Example
**Genesis Wave in Green Ramp — Turn 10:**
Turn 10: 12 Forests in play (with ramp). Cast Genesis Wave with X=12.
Pay {12}{G}{G}{G} = 15 mana total. Tap 12 forests + some ramp.
Reveal top 12 cards of library. All permanents among them enter the battlefield.
Library has: 4 Forests, Vorinclex (7/6 legendary), Craterhoof Behemoth (8/8), Avenger of Zendikar (5/5),
Llanowar Elves, Sylvan Library, Exploration, Doubling Season, Parallel Evolution, Tooth and Nail.
Permanents entering: Vorinclex, Craterhoof, Avenger, Llanowar Elves, Sylvan Library, Exploration,
  Doubling Season, Parallel Evolution (wait, that's an instant? no, it's sorcery) — check types.
All permanents (not instants/sorceries) enter simultaneously.
ETB triggers stack up: Avenger makes Plant tokens for each of 16 lands (12 original + 4 from wave),
Craterhoof's ETB pumps all creatures...
One Genesis Wave turn: put 8+ permanents into play simultaneously. Instant win.
Key: you chose X=12. MV of Genesis Wave in hand earlier: 3 (X=0+3 = MV 3).
No cascade can accidentally find it with MV restriction problem (cascade spell needs MV>3).

**Example 2 — X=0 Trap with Sphinx's Revelation:**
Your opponent has Temur Sabertooth and casts "Mind's Desire" (Storm, look at top card, cast for free).
Resolved: Mind's Desire with storm 5. 5 copies + original.
A copy of Mind's Desire reveals: Sphinx's Revelation from your hand.
Mind's Desire resolves: "Until EOT, you may cast Sphinx's Revelation without paying its mana cost."
Opponent tries to cast Sphinx's Revelation for free.
CR 107.3b: casting without paying mana cost and X not defined by text → X must be 0.
Sphinx's Revelation with X=0: draw 0 cards, gain 0 life.
"Worth it?" Not really — they spent a complex chain to draw nothing.
However: if their board has a way to define X (like "draw cards equal to creatures you control" type effect):
  That would be a different card's text defining X — this card's text still requires X choice.
Conclusion: X=0. They cast a useless spell.
Moral: don't include X spells in decks for "cast without paying mana cost" synergies unless you can control X.

## Commonly Confused With
- **P297 (Cascade)** — Cascade uses MV when finding cards; X spells in library/exile have MV with X=0, so a {X}{G} spell in exile has MV 1 (findable by cascade spells with MV > 1).
- **P282 (Escape)** — Escape casts from GY; an X spell escaped with "pay mana cost" must still have X chosen; escape with "pay {COST}" replaces the mana cost, so the X choice depends on whether the escape cost includes X.
- **P298 (Kicker)** — Kicker is an additional cost; X is a variable mana cost. Both scale spells, but X is part of the mana cost itself and affects MV.
- **P296 (Storm)** — Storm copies spells; a copied storm spell has the same X value as the original (copies inherit the spell's characteristics including the announced X value on the stack).
