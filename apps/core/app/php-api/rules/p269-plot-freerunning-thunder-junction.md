---
id: p269
name: Plot and Freerunning — Exile to Cast Later and Assassin Alternative Cost
category: stack
cr_refs: [702.170a, 702.170b, 702.170c, 702.170d, 702.170e, 702.170f, 702.173a]
tags: [plot, freerunning, exile, alternative-cost, assassin, commander, sorcery-speed, special-action, Outlaws-of-Thunder-Junction, Assassins-Creed, Cunning-Coyote, Vraska-the-Silencer, Three-Steps-Ahead]
created: 2026-03-29
examples_count: 2
---

# P269 — Plot and Freerunning — Exile to Cast Later and Assassin Alternative Cost

## Abstract
Two mechanics from 2024. **Plot** (Outlaws of Thunder Junction): a special action — pay the plot cost during your main phase while the stack is empty to exile the card from your hand. On any future turn (not the same turn), cast the card for free from exile during your main phase. Plot "pre-pays" for a spell, letting you load it into exile and deploy it for free when timing is right. **Freerunning** (Assassin's Creed crossover set): an alternative casting cost — you may cast a spell with freerunning for its cheaper freerunning cost if an Assassin or a commander you control dealt combat damage this turn. Freerunning rewards aggressive Assassin tribal or commander-attack builds with cheaper powerful spells.

## The Definitive Rules

**CR 702.170a** (verbatim): *"Plot is a keyword ability that functions while the card with plot is in a player's hand. 'Plot [cost]' means 'Any time you have priority during your main phase while the stack is empty, you may exile this card from your hand and pay [cost]. It becomes a plotted card.'"*

**CR 702.170b** (verbatim): *"Exiling a card using its plot ability is a special action, which doesn't use the stack. See rule 116, 'Special Actions.'"*

**CR 702.170d** (verbatim): *"A plotted card's owner may cast it from exile without paying its mana cost during their main phase while the stack is empty during any turn after the turn in which it became plotted. Casting a spell this way follows the rules for paying alternative costs in rules 601.2b and 601.2f–h. A plotted card may be cast this way even if it doesn't have the plot ability while in exile."*

**CR 702.173a** (verbatim): *"Freerunning is a static ability that functions on the stack. 'Freerunning [cost]' means 'You may pay [cost] rather than pay this spell's mana cost if a player was dealt combat damage this turn by a creature that, at the time it dealt that damage, was an Assassin creature or a commander under your control.' Casting a spell for its freerunning cost follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

## The Pattern

```
PLOT:
  Special action (doesn't use the stack): during your main phase, stack empty
  Cost: pay the plot cost → card exiles from hand → becomes "plotted"
  Later turns: during your main phase, stack empty → cast the plotted card FOR FREE

  PLOT TIMING:
    Turn 1: Plot this card during your main phase (pay the plot cost)
    The card is now in exile as a plotted card
    Turn 2+ (any future turn): cast it for free from exile during your main phase
    "Any turn after the turn in which it became plotted" = NOT the same turn
    Can't plot AND cast in the same turn

  PLOT COST vs MANA COST:
    Plot cost is typically cheaper than the mana cost
    You pay the plot cost on turn N to prepare; you cast for free on turn N+1 or later
    Effect: you pay early for a card you want to deploy later
    Alternatively: cards with Plot often have reduced plot costs relative to their power

  PLOT + DECK CONSTRUCTION:
    Plotting during one main phase + casting during another = split activation across turns
    Great for: cards you want at instant speed in terms of "this is ready when I need it"
    Not actual instant speed (still main phase only) but frees up mana on deployment turn
    Strategy: plot 2-3 cards in early turns, then unleash them free over several turns

  PLOT + SORCERY RESTRICTIONS:
    Plotted cards are cast "during main phase while stack is empty" = sorcery timing
    Even instants: if plotted, they can only be cast from exile during main phase
    This is the limitation of the "free cast from exile" — loses instant speed
    Exception: if an effect allows you to cast from exile at other times...
    But plotted cards' free cast restriction is sorcery-timing.

  PLOT NOTABLE CARDS (Outlaws of Thunder Junction):
    Cunning Coyote ({1}{R}, Creature, Plot {1}):
      "When Cunning Coyote enters, it deals 1 damage to any target."
      Plot {1}: exile from hand by paying {1}. Next turn: cast free → enter → deal 1 damage.
      Effectively: pay {1} now, get a free 1-damage ETB and creature later.
      Value: 1 mana for a future free drop.

    Three Steps Ahead ({X}{U}{U}, Instant, Plot {2}{U}):
      "Choose one or more of the following. [Draw X cards. Counter target spell. Create a token copy.]"
      Plot {2}{U}: exile it for {2}{U}.
      Next turn: cast it free from exile for free. Then X = 0? No: you choose X when casting.
      Wait: X is chosen when casting. From exile free cast: you still choose X but don't pay the mana.
      Free cast means "without paying its mana cost" → you don't pay {X}{U}{U} → you cast X=0?
      Actually: when casting a card without paying its mana cost, if it has {X} in cost, X = 0.
      So Three Steps Ahead plotted and then free-cast: X=0, but you still choose a mode...
      "Choose one or more" with X=0: modes that don't need X are useful (counter, token).
      Counter a spell OR create a token for free.

    Vraska, the Silencer ({4}{B}{G}, Legendary Creature, Plot {3}{B}{G}):
      5/4 Deathtouch. When Vraska ETBs: "Target opponent sacrifices a non-Vraska creature. If they
      can't, they each lose 3 life."
      Plot {3}{B}{G}: exile her for {3}{B}{G} (cheaper than {4}{B}{G}).
      Next turn: cast for free → ETB → force opponent to sacrifice a creature.
      Plotted Vraska: pre-pay on turn 4 (less than normal cost), cast for free turn 5 → threat removal.

FREERUNNING:
  Alternative cost on instants and sorceries
  Condition: an Assassin creature OR a commander you control dealt combat damage to a player this turn
  If condition met: cast the spell by paying the freerunning cost instead of normal mana cost

  FREERUNNING CONDITION:
    "A player was dealt combat damage this turn by a creature that, at the time it dealt that damage,
    was an Assassin creature or a commander under your control"
    The creature must be an Assassin at the time of damage OR your commander at the time of damage
    If a non-Assassin becomes an Assassin after dealing damage: doesn't count (condition is checked at damage time)
    If a commander dealt damage: that's sufficient, regardless of creature type

  FREERUNNING + COMMANDER:
    Any commander dealing combat damage enables freerunning
    Non-Assassin commanders count (they're commanders)
    Relevant in Commander format: attack with commander, then cast freerunning spells for cheap

  FREERUNNING NOTABLE CARDS (Assassin's Creed):
    Ezio Auditore da Firenze ({2}{W}{B}): 3/3, Assassin, First Strike.
      When Ezio attacks, put a +1/+1 counter on each Assassin you control.
      His attack triggers freerunning condition (he's an Assassin dealing combat damage).
      After Ezio connects: cast freerunning spells for their reduced cost.

    Hidden Strings ({U}, Sorcery, Freerunning {0}):
      "Tap or untap up to two target permanents. Cipher."
      Freerunning {0}: if condition met, cast for FREE. A sorcery that taps/untaps + ciphers for 0 mana.
      Use in Assassin decks: attack with Assassin, then encode Hidden Strings on it for free.

    Multiple freerunning cards from Assassin's Creed crossover are themed around Assassin tribal.

PLOT vs FREERUNNING COMPARISON:
  Plot: pay a cost now to cast for free later (always sorcery timing from exile)
  Freerunning: pay reduced cost NOW (when condition is met this turn, as an alternative cost)
  Plot: any deck, any spell type — pre-pay and deploy next turn
  Freerunning: Assassin tribal or commander-attack strategy, combat-conditional
```

## Definitive Conclusions

- **Plot exiles the card from hand** as a special action (doesn't use the stack) — then cast for free on a future turn.
- **Plotted cards must wait until the NEXT turn** to be cast free — can't plot and cast in the same turn.
- **Plotted instants lose instant speed** — the free cast from exile is always sorcery timing.
- **Freerunning requires combat damage from an Assassin or commander this turn** — battle first, then cast cheap.
- **Freerunning costs {0} on some spells** — effectively free after an Assassin deals combat damage.

## Canonical Example
**Vraska the Silencer Plot Setup:**
Turn 4 (main phase): You have {3}{B}{G} mana. Vraska, the Silencer in hand.
Activate Plot {3}{B}{G}: exile Vraska from hand. She's now a plotted card in exile.
Turn 4: opponent uses all their mana on development. Nothing threatens Vraska in exile.
Turn 5 (main phase): cast plotted Vraska for FREE from exile.
Vraska ETBs: opponent must sacrifice a non-Vraska creature (their best threat). Gone.
You deployed a 5/4 Deathtouch that removed their best creature, without paying the normal {4}{B}{G} cost on turn 5.
You paid {3}{B}{G} (one mana cheaper) on turn 4, cast free on turn 5.

**Example 2 — Hidden Strings Freerunning Cipher Loop:**
Board: Ezio Auditore da Firenze (3/3 First Strike, Assassin).
Declare Ezio as attacker. Ezio deals combat damage to opponent (first strike in combat, unblocked).
Freerunning condition met: an Assassin dealt combat damage this turn.
Main phase: cast Hidden Strings with Freerunning {0} → pay nothing.
Taps two permanents. Cipher: encode Hidden Strings onto Ezio.
Next time Ezio deals combat damage: copy of Hidden Strings triggers → tap two more permanents.
Ezio attacks each turn → cipher triggers → two permanents tapped each attack → opponent's board is locked.
All enabled by Freerunning: the first cast was free, and subsequent copies are free via Cipher.

## Commonly Confused With
- **P255 (Suspend)** — Suspend also exiles cards to cast later; Plot's free cast is on any future turn, not waiting for counters to be removed.
- **P256 (Hideaway)** — Hideaway casts a card face-down from an ETB effect; Plot is an intentional hand-to-exile special action.
- **P247 (Prowl)** — Prowl requires the matching creature type to deal combat damage; Freerunning requires specifically an Assassin or commander.
