---
id: p373
name: Foretell, Spectacle, Riot, and Surge — Conditional Alternative Costs Based on Game State
category: stack
cr_refs: [702.143a, 702.143b, 702.143c, 702.137a, 702.136a, 702.136b, 702.117a]
tags: [foretell, spectacle, riot, surge, alternative-cost, opponent-lost-life, face-down-exile, haste-or-counter, another-spell-cast, conditional-casting, Doomskar, Saw-It-Coming, Rix-Maadi-Reveler, Carnival-Carnage, Riot-Gruul-mechanics, Stormchaser-Mage, Goblin-Electromancer, foretell-face-down]
created: 2026-03-29
examples_count: 2
---

# P373 — Foretell, Spectacle, Riot, and Surge — Conditional Alternative Costs Based on Game State

## Abstract
**Foretell** (702.143a) lets you exile a card face down for {2} during your turn (a special action), then cast it from exile on any future turn for the foretell cost. The exile is a special action (doesn't use the stack), and the face-down card is visible only to you. **Spectacle** (702.137a) is an alternative cost available only if an opponent lost life this turn — you may pay the spectacle cost instead of the normal mana cost, usually cheaper and only available when you've been aggressive. **Riot** (702.136a) gives you a choice: the creature enters with a +1/+1 counter OR gains haste. **Surge** (702.117a) lets you pay a reduced surge cost if you or a teammate cast another spell this turn. All four are context-dependent mechanics: their benefits only apply under specific game conditions.

## The Definitive Rules

**CR 702.143a** (verbatim): *"Foretell is a keyword that functions while the card with foretell is in a player's hand. Any time a player has priority during their turn, that player may pay {2} and exile a card with foretell from their hand face down. That player may look at that card as long as it remains in exile. They may cast that card after the current turn has ended by paying any foretell cost it has rather than paying that spell's mana cost."*

**CR 702.143b** (verbatim): *"Exiling a card using its foretell ability is a special action, which doesn't use the stack. See rule 116, 'Special Actions.'"*

**CR 702.137a** (verbatim): *"Spectacle is a static ability that functions on the stack. 'Spectacle [cost]' means 'You may pay [cost] rather than pay this spell's mana cost if an opponent lost life this turn.'"*

**CR 702.136a** (verbatim): *"Riot is a static ability. 'Riot' means 'You may have this permanent enter with an additional +1/+1 counter on it. If you don't, it gains haste.'"*

**CR 702.117a** (verbatim): *"Surge is a static ability that functions while the spell with surge is on the stack. 'Surge [cost]' means 'You may pay [cost] rather than pay this spell's mana cost as you cast this spell if you or one of your teammates has cast another spell this turn.'"*

## The Pattern

```
FORETELL (702.143a–f):
  WHAT IT IS:
    While the card is in your hand: pay {2}, exile it face down.
    This is a SPECIAL ACTION — doesn't go on the stack, no response possible.
    Can do this any time you have priority during your turn.
    Can be done in any step/phase on your turn.
    After this turn ends: you may cast it from exile for its foretell cost.
  THE FACE-DOWN EXILE:
    Card is face down in exile. Opponents can't see what it is.
    You can look at it anytime (you own it).
    If you have multiple foretold cards: must differentiate them (702.143e: note the order
      and any cost differences).
    Opponents know it's a foretold card (it's face down with specific markings in practice).
    But they don't know WHICH card.
  CASTING FROM EXILE:
    "After the current turn has ended" — can't cast on the same turn you foretell it.
    On any future turn (yours or opponent's? — see: "they may cast that card").
    Can you cast a foretold instant on an opponent's turn? YES: it's an instant.
    "After the current turn has ended" just means not the same turn — future turns are fine.
    Foretell cost is the alternative cost. Use it instead of the mana cost.
    Usually: foretell cost < mana cost. (You already paid {2} when exiling it.)
    Total two-turn cost: {2} (foretell special action) + foretell cost = spread-out payment.
  THE VALUE:
    Foretell splits the cost across two turns.
    Turn 1: pay {2}, exile Doomskar face down.
    Turn 2 (or later): pay foretell cost (usually 1-2 mana), cast the foretold card.
    Surprise element: opponents don't know what the face-down card is.
    Anti-hand-disruption: foretell cards are in EXILE (not hand). Thoughtseize can't get them.
      Once foretold, the card is safe from discard effects.
  FORETELL CARDS (KALDHEIM):
    Doomskar ({3}{W}{W}): "Destroy all creatures." Foretell {2}{W}.
      Foretell it on turn 2 (pay {2}). Cast it turn 3 for {2}{W} = {4}{W} total, spread across turns.
      Surprise Wrath. Opponent doesn't know you have a board wipe ready.
    Saw It Coming ({2}{U}): "Counter target spell." Foretell {1}{U}.
      Foretell on turn 1 (pay {2}). Cast it as a counterspell on any future turn for {1}{U}.
      {2}+{1}{U} = {3}{U} total for Counterspell. Worse than Counterspell but deception value.
      Bluffing: opponents see a face-down exile and must consider if it's a counterspell.
    Behold the Multiverse ({3}{U}): "Surveil 2, then draw two cards." Foretell {2}{U}.
      Foretell cheapens a card draw/filter effect.
  FORETELL AND GRAVEYARD HATE:
    Rest in Peace/Leyline of the Void: these exile cards entering the GY.
    Foretell puts cards in EXILE (not GY). These effects don't interfere with foretell.
    BUT: "exile replacement effects" might apply. If an effect says "cards you would exile are
      instead put in the GY": the foretell card would go to GY? Unusual edge case.

SPECTACLE (702.137a):
  WHAT IT IS:
    Alternative cost available "if an opponent lost life this turn."
    "Lost life" includes: combat damage, burn spells, shock lands (Stomping Ground's 2 life),
      Phyrexian mana costs, any life loss effect. NOT just combat damage.
    If ANY opponent has lost life this turn: spectacle is available for all your spells with spectacle.
  SPECTACLE COST:
    Usually significantly cheaper than the normal cost.
    The discount incentivizes aggressive play: hit them once, unlock spectacle for the turn.
  SPECTACLE EXAMPLES (RAVNICA ALLEGIANCE):
    Light Up the Stage ({2}{R}): "Exile the top two cards of your library. Until the end of your
      next turn, you may play those cards." Spectacle {R}.
      Normal: {2}{R} for card advantage. Spectacle (after dealing 1 damage): {R} for same.
    Rix Maadi Reveler ({1}{R}): "Haste. Spectacle {3}{R}{R}: When this enters, discard all cards
      in your hand, then draw that many cards." (Wait: let me restate — Rix Maadi Reveler's
      spectacle is on the ETB effect, not the card itself.)
      Actually spectacle on Rix Maadi Reveler: pay {3}{R}{R} for spectacle version?
      Better example: Carnival // Carnage (Ravnica Allegiance):
        Carnival ({R/B}): "Carnival deals 1 damage to target creature or planeswalker."
          This can trigger spectacle! Deal 1 damage to something (opponent through a creature)
          → opponent lost life → spectacle unlocked → cast Carnage cheaply next.
  ONE CHECK PER SPELL:
    Spectacle checks at cast time: "did an opponent lose life this turn?"
    Not "right now during resolution" — just at time of casting, you check if they've lost life.
  SPECTACLE IN AGGRO:
    Shock + spectacle spell: shock deals 2, spectacle unlocked, cast spectacle spell cheaply.
    Consistent by turn 2-3 in aggressive decks.
    Can even use Shock/Galvanic Blast to yourself? No: "an OPPONENT lost life" — can't spec off
      yourself losing life.

RIOT (702.136a):
  WHAT IT IS:
    A choice as the permanent enters:
    1. Enter with an additional +1/+1 counter. (Permanent P/T boost.)
    2. Enter with haste. (Attack immediately.)
    This is decided as the permanent is entering the battlefield.
  WHEN IS THE CHOICE MADE?
    "You may have this permanent enter with an additional +1/+1 counter on it. If you don't, it gains haste."
    The choice is made as it enters. Not when casting; as it enters (614.12: replacement effects for ETB are
      applied as the permanent is entering).
    If entering with a counter: the counter is part of the ETB (replacement effect style).
    If entering with haste: haste is a static ability that fires on the battlefield.
    Actually: riot says "it gains haste" — this is a continuous effect, not a counter.
      Haste applies for the rest of the current turn.
  RIOT STRATEGY:
    Against slow opponents or when you need to clock them: haste (attack immediately).
    Against decks with lots of removal or when building a board: +1/+1 counter (bigger body, more durable).
    With multiple riot instances (702.136b): each works separately.
      A creature with riot twice: can have BOTH a counter and haste? Actually:
        "Each works separately." You make the choice for each separately.
        First riot: take haste. Second riot: take +1/+1 counter.
        Result: creature with +1/+1 counter AND haste. Having two riot is strictly better than one.
  RIOT EXAMPLES:
    Gruul Spellbreaker ({1}{R}{G}): "Riot. Trample. As long as it's your turn, Gruul Spellbreaker
      has hexproof."
      Turn 3: Enter with haste. Attack immediately for 3 trample damage.
      OR: Enter with +1/+1 counter (4/4). More durable. But no attack this turn.
    Ravager Wurm ({4}{R}{G}): "Riot. When this enters, choose one — Destroy target land a player
      controls; or Destroy target creature with defender." 6/6 or 7/7 with +1/+1.
      Flexibility: haste (attack for 6 trample?) or counter (7/7).

SURGE (702.117a):
  WHAT IT IS:
    Alternative cost available if YOU OR A TEAMMATE have cast another spell this turn.
    Cast any spell first → surge is available for surge spells.
    Only one spell needed: one cantrip activates surge for all surge spells that turn.
  SURGE COST:
    Usually cheaper than normal cost. But requires casting another spell first.
    Rewards "spell chains" — cast cheap spell, then surge into bigger spell cheaply.
  SURGE EXAMPLES:
    Crush of Tentacles ({5}{U}{U}): "Surge {4}{U} (if you or a teammate cast another spell this turn).
      Return all nonland permanents to their owners' hands. If surge cost was paid: create an 8/8 blue Octopus token."
      Normal: {5}{U}{U} for board bounce. Surge: {4}{U} AND creates 8/8.
      Cast a cantrip (Opt, Ponder, etc.) for {U}, then surge Crush of Tentacles for {4}{U}.
      Total: {U} + {4}{U} = {5}{U} for a board wipe + 8/8 Octopus. Incredible.
    Reckless Bushwhacker ({2}{R}): "Surge {1}{R}. Haste. When this enters, if surge cost was paid,
      other creatures you control get +1/+0 and gain haste until end of turn."
      Surge: {1}{R} to pump all your creatures. Classic combo with Goblin token drops.
      Cast a 1-drop Goblin (surge trigger), then surge Bushwhacker for {1}{R} → pump all.
```

## Definitive Conclusions

- **Foretell is a special action (no stack)** — exile face down, can't be responded to; cost is split across two turns; foretold cards are protected from discard effects (they're in exile, not hand).
- **Foretell cards can be cast on any future turn** — including opponents' turns if the card is an instant; "after the current turn" just means not the same turn you foretold it.
- **Spectacle checks if any opponent lost life this turn** — any life loss qualifies (combat, burn, shock lands, Phyrexian mana): one point of damage against anyone unlocks spectacle for all your spectacle spells that turn.
- **Riot is a choice as the creature enters** — counter = more durable; haste = attack immediately; with multiple riot instances, choose separately for each.
- **Surge requires you or a teammate to have cast another spell this turn** — any spell qualifies; a simple cantrip can unlock surge for powerful spells.

## Canonical Example
**Doomskar Foretell — The Surprise Wrath:**
Turn 1: Cast Hallowed Fountain (untapped, pay 2 life). First land.
Turn 2: Play Plains. You have {U}{W}. No threats.
  During your main phase: foretell Doomskar (pay {2}). Exile Doomskar face down in exile.
  Opponents see: you exiled a card face down. It COULD be anything.
Turn 3: Play land. Opponent plays two threats (they don't know about Doomskar).
Turn 4: Opponent attacks with their two creatures (4/4 and 3/3). After their attack, they play more.
  End of their turn:
  Your upkeep/main phase turn 4: cast Doomskar from exile for foretell cost {2}{W}.
  "Destroy all creatures." Both opponent's creatures die.
  Opponent: "I didn't know you had a Wrath!"
  Total cost: {2} (turn 2 foretell) + {2}{W} (turn 4 cast) = {4}{W} across two turns.
  Normal Doomskar: {3}{W}{W} = 5 mana all at once.
  Foretell version: {4}{W} spread = same total generic + 1 less white mana.
  Plus: hidden information and protected from Duress/Thoughtseize (it was in exile already).

**Example 2 — Surge + Reckless Bushwhacker Combo:**
You're playing Goblin Zoo in Standard. Your board: Goblin tokens from last turn (4 goblins, each 1/1).
Turn 3: Your hand: Goblin Guide ({R}), Reckless Bushwhacker ({2}{R}).
  Play: Cast Goblin Guide ({R}). It enters (5th goblin on board).
  Now: "you or a teammate cast another spell this turn" — surge condition met!
  Cast Reckless Bushwhacker via surge ({1}{R}).
  Reckless Bushwhacker enters. "Haste. Surge cost was paid: other creatures get +1/+0 and haste."
  ETB trigger: your OTHER creatures get +1/+0 and haste.
  All 5 goblins (including Goblin Guide that just entered): get +1/+0 and haste.
  Goblin Guide is 2/2 with haste. 4 Goblin tokens are 2/1 with haste.
  Reckless Bushwhacker itself: 2/1 with haste.
  Attack with everyone: 2 + 2 + 2 + 2 + 2 + 2 = 12 damage? Let's count: 4 tokens at 2/1 = 8, Goblin Guide 2/2 = 2, Reckless Bushwhacker 2/1 = 2. Total = 12.
  Opponent takes 12 in one swing on turn 3.
  Turn 2 the combo works even better with Burning-Tree Emissary (free 2/2 that adds {R}{G}).

This is the "Bushwhacker Zoo" turn 3 kill that was a real Legacy deck.

## Commonly Confused With
- **P366 (Suspend)** — Foretell is SIMILAR to suspend: pay now, cast later for reduced cost. Key differences: foretell is optional (you can cast the card normally instead), foretell is always one turn of delay (not N turns), foretell cards are face down (hidden info), and suspend is not optional once triggered (well, 702.62a says "you may play it" — technically optional, it remains exiled if you don't).
- **P356 (Flashback/Jump-Start)** — Both cast from alternative zones. Flashback/jump-start are from GY. Foretell is from exile. After using flashback: card is exiled. After foretelling and casting: card goes to GY (or wherever resolution sends it — unlike flashback which forces exile, foretell doesn't force exile after casting).
- **P362 (Storm)** — Surge requires casting another spell first (similar to storm's counting of prior spells). Storm triggers after you cast the storm spell. Surge is an alternative cost that requires a prior cast. Both reward spell-chaining — but surge is checked at cast time, not after.
- **P371 (Bestow/Tribute/Dash)** — All of these are alternative casting costs with different conditions. Foretell: spread cost, hidden. Spectacle: opponent-lost-life condition. Riot: ETB choice, not a casting cost. Dash: cast with haste + return. The theme: alternative costs that change how and when you cast cards.
