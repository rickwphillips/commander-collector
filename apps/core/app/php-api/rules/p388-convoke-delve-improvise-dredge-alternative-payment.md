---
id: p388
name: Convoke, Delve, Improvise, Dredge, and Undaunted — Alternative Payment Mechanics
category: costs
cr_refs: [702.51a, 702.51b, 702.51c, 702.66a, 702.66b, 702.66c, 702.126a, 702.126b, 702.126c, 702.52a, 702.52b, 702.125a, 702.125b, 702.125c]
tags: [convoke, delve, improvise, dredge, undaunted, alternative-payment, tap-creatures-for-mana, exile-GY-for-generic, tap-artifacts-for-generic, replace-draw-with-GY-return, cost-reduction-per-opponent, not-additional-cost, applied-after-total-cost, Chord-of-Calling, Siege-Rhino-convoke, Treasure-Cruise, Murderous-Cut, Whir-of-Invention, Golgari-Grave-Troll, Reduce-to-Memory]
created: 2026-03-29
examples_count: 2
---

# P388 — Convoke, Delve, Improvise, Dredge, and Undaunted — Alternative Payment Mechanics

## Abstract
Several distinct mechanics allow paying a spell's mana cost in non-mana ways. **Convoke** (702.51) lets you tap creatures to pay for colored or generic mana. **Delve** (702.66) lets you exile cards from your graveyard to pay for generic mana. **Improvise** (702.126) lets you tap artifacts to pay for generic mana. **Dredge** (702.52) replaces draw effects: instead of drawing, mill N cards and return the dredge card from GY to hand. **Undaunted** (702.125) reduces a spell's cost by {1} for each opponent you have (Commander-focused). Critical shared rules: convoke, delve, and improvise are NOT additional or alternative costs — they're cost-reduction abilities that apply AFTER the total cost is determined; they allow the alternative payment; you pay any remaining mana normally. Dredge is a replacement effect on the draw mechanic.

## The Definitive Rules

**CR 702.51a** (verbatim): *"Convoke means 'For each colored mana in this spell's total cost, you may tap an untapped creature of that color you control rather than pay that mana. For each generic mana in this spell's total cost, you may tap an untapped creature you control rather than pay that mana.'"*

**CR 702.51b** (verbatim): *"The convoke ability isn't an additional or alternative cost and applies only after the total cost of the spell with convoke is determined."*

**CR 702.51b example** (verbatim): *"You control Heartless Summoning and cast Siege Wurm, a spell with convoke that costs {5}{G}{G}. The total cost to cast Siege Wurm is {3}{G}{G}. After activating mana abilities, you pay that total cost. You may tap up to two green creatures and up to three other creatures to pay that cost."*

**CR 702.66a** (verbatim): *"Delve means 'For each generic mana in this spell's total cost, you may exile a card from your graveyard rather than pay that mana.'"*

**CR 702.66b** (verbatim): *"The delve ability isn't an additional or alternative cost and applies only after the total cost of the spell with delve is determined."*

**CR 702.126a** (verbatim): *"Improvise means 'For each generic mana in this spell's total cost, you may tap an untapped artifact you control rather than pay that mana.'"*

**CR 702.126b** (verbatim): *"The improvise ability isn't an additional or alternative cost and applies only after the total cost of the spell with improvise is determined."*

**CR 702.52a** (verbatim): *"Dredge N means 'As long as you have at least N cards in your library, if you would draw a card, you may instead mill N cards and return this card from your graveyard to your hand.'"*

**CR 702.125a** (verbatim): *"Undaunted means 'This spell costs {1} less to cast for each opponent you have.'"*

**CR 702.125b** (verbatim): *"Players who have left the game are not counted when determining how many opponents you have."*

## The Pattern

```
SHARED RULE — "NOT AN ADDITIONAL OR ALTERNATIVE COST":
  Convoke (702.51b), Delve (702.66b), and Improvise (702.126b) all state:
  "The [ability] isn't an additional or alternative cost and applies only after the total cost
    of the spell is determined."
  What this means for casting:
    Step 1: Determine the total cost normally (base cost + additional costs - reductions).
    Step 2: Activate mana abilities to generate mana.
    Step 3: THEN use convoke/delve/improvise to pay some of that determined total cost
      with creatures/GY cards/artifacts instead of mana.
    Step 4: Pay remaining mana normally.
  Why this matters:
    Cost reductions (like Heartless Summoning's "{2} less for creature spells") apply FIRST.
    Then convoke/delve/improvise apply to whatever cost remains.
    These are not "alternative" costs in the rules sense (601.2b): you still pay the normal cost,
      but part of it can be paid via the alternative mechanism.
    They CAN reduce the cost to {0}: tap enough creatures to pay the entire cost.

CONVOKE (702.51):
  WHAT IT DOES:
    For each colored mana in the spell's cost: tap one creature OF THAT COLOR.
    For each generic mana in the spell's cost: tap any creature.
    Each creature can only be tapped once per spell (you don't double-dip).
    Creatures must be untapped when you declare you'll tap them (during the casting process).
  COLORED MANA IN CONVOKE:
    "For each COLORED mana": if the spell costs {2}{W}{G}:
      {W}: tap a white creature.
      {G}: tap a green creature.
      {2}: tap up to 2 other creatures (of any color) for the generic {2}.
    Multicolored creatures: "You may tap an untapped creature of that color."
      A white/green creature could tap for EITHER the {W} OR the {G} (but not both).
  CHORD OF CALLING ({X}{G}{G}{G}: Instant, Convoke):
    "Search your library for a creature card with converted mana cost X or less."
    With convoke: tap creatures to reduce the cost.
    You want to search for a 4-drop: X = 4. Base cost: {4}{G}{G}{G}.
    Tap 4 green creatures (or any color for generic): pay {0}{G}{G}{G} with remaining mana.
    With some green creatures to tap: potentially search for free-ish.
    Chord of Calling is an instant: you can cast it at end of opponent's turn.
    Tap creatures at EOT (not attacking): convoke reduces the cost. Tutor next turn ready.
  CONVOKE AND SUMMONING SICKNESS:
    Tapping for convoke: you're not activating an "activated ability." You're paying a mana cost.
    Summoning sickness only prevents TAPPING as an ACTIVATED ABILITY.
    Rule 302.6: "A creature... can't attack, or be used to pay for abilities with the tap symbol
      unless it has haste or has been under the controller's control continuously since the turn began."
    Convoke is NOT activating an ability. Convoke tapping is during the casting process (paying costs).
    Therefore: creatures with summoning sickness CAN be tapped for convoke.
    This is a major rules distinction — and a frequent mistake at the table.

DELVE (702.66):
  WHAT IT DOES:
    For each generic mana in the spell's cost: exile one card from your graveyard.
    Only generic mana can be paid this way (not colored).
    Colored mana still must be paid with mana.
  TREASURE CRUISE ({7}{U}: "Draw 3 cards." Delve.):
    Base cost: {7}{U}. With delve: exile 7 cards from GY → cast for just {U}.
    Banned in many formats because late-game GY is full. {U} for 3 cards = broken.
  MURDEROUS CUT ({4}{B}: "Destroy target creature." Delve.):
    Base cost: {4}{B}. Exile 4 cards from GY → cast for {B}. One mana instant-speed kill.
    Extremely efficient in mid-game when GY has been filling.
  DELVE AND GY INTERACTION:
    You CHOOSE which cards to exile from your GY when you delve.
    Don't exile cards you want for later (reanimation targets, flashback cards, etc.).
    Strategic sequencing: exile the "least useful" cards first.
  DELVE MULTIPLE TIMES:
    If you cast two delve spells in a row: the second one has a smaller GY to work with.
    The first delve exiled cards. Those are gone.
    Plan accordingly: you can't infinitely delve if the GY empties.

IMPROVISE (702.126):
  WHAT IT DOES:
    For each generic mana in the spell's cost: tap one untapped artifact you control.
    Only generic mana can be paid. Colored mana still requires mana.
    Unlike convoke: only artifacts, not creatures.
  WHIR OF INVENTION ({X}{U}{U}{U}: Improvise — "Search your library for an artifact card
    with converted mana cost X or less, put it onto the battlefield, shuffle."):
    Similar to Chord of Calling but for artifacts. Improvise instead of convoke.
    Tap your artifacts to pay for the generic {X} portion. Only need {U}{U}{U} in mana.
    With 3+ artifacts to tap: potentially search for free (pay just {U}{U}{U}).
    Improvise rewards artifact-heavy decks.
  IMPROVISE AND TAPPING:
    Unlike convoke: NO summoning sickness concern for artifacts.
    Artifacts don't have summoning sickness in the same way creatures do.
    Actually: 302.6 specifically references "a creature." Artifacts are not creatures (unless
      they're artifact creatures — then summoning sickness applies for their abilities).
    A regular non-creature artifact can always be tapped for improvise (no SS restriction).
    But if the artifact is also a creature (e.g., Ornithopter): it has summoning sickness
      and can't be tapped for improvise if it entered this turn.
    Wait: the same rule (302.6) applies: it's about creatures. Ornithopter as a creature:
      has summoning sickness. But tapping for improvise — is this an activated ability?
      Same as convoke: improvise tapping is during cost payment, not an activated ability.
      Therefore: artifact creatures with summoning sickness CAN be tapped for improvise.
      (Same logic as convoke: paying costs ≠ activating abilities.)

DREDGE (702.52):
  WHAT IT IS:
    A replacement effect on DRAWING. Not a cost. Not a keyword you activate.
    While the dredge card is in your GY: "if you would draw a card, you may instead:
      mill N cards and return this card from your GY to your hand."
    It replaces the draw. You don't draw — you mill N and get the dredge card back.
  DREDGE TRIGGER:
    Fires when you WOULD draw a card (any draw trigger — your draw step, Divination, etc.).
    You choose: take the normal draw OR dredge instead.
    If dredging: mill N cards, get the card back in hand.
    The dredge card is available to dredge again next time you would draw.
  DREDGE AND LIBRARY SIZE (702.52b):
    If you have fewer cards in library than N: you CANNOT dredge.
    Example: Stinkweed Imp (dredge 5): if you have 4 cards in library, can't dredge it.
    This is a hard rule — not just "can't do all of it" — if you can't do all N, no dredge.
  DREDGE STRATEGY:
    Dredge decks mill a lot and get cards back repeatedly.
    "Dredge" deck strategy: mill your library to fill GY with combo pieces.
    Narcomoeba ({1}{U}: 1/1 flying — "When this is milled, put it on the battlefield"):
      Combined with dredge: mill Narcomoebas → they enter for free.
    Golgari Grave-Troll ({3}{G}: 0/0 with counters, dredge 6):
      Each time you dredge it: mill 6 cards. GY grows fast.
  DREDGE IS A REPLACEMENT, NOT A TRIGGER:
    You don't put the dredge "on the stack." You choose to use dredge INSTEAD of drawing.
    It happens at the same time the draw would happen (replacement effect: see P002).
    You can only replace ONE draw per dredge card per draw opportunity.
    If multiple dredge cards are in your GY: you choose ONE to dredge with, or draw normally.
    You can't dredge multiple cards for a single draw opportunity.
  "DRAW X CARDS" AND DREDGE:
    "Draw 3 cards." You draw the first card. You may dredge for that draw.
    If you dredge: you don't draw card 1; you mill 6 (dredge 6 example) and get Grave-Troll.
    The trigger was "draw 3 cards." After the first "draw" (which was dredged):
      You now draw the 2nd card. You may dredge again for the 2nd draw (if the Grave-Troll is
        back in GY — but you just put it in your HAND from the dredge).
      Grave-Troll is in hand. Can't dredge it (must be in GY).
    If you have multiple dredge cards: you might dredge multiple times in a single "draw X" sequence.

UNDAUNTED (702.125):
  WHAT IT DOES:
    Reduces the spell's cost by {1} for each opponent you have.
    In Commander with 3 opponents: costs {3} less.
    In 1v1 (1 opponent): costs {1} less.
    The reduction is applied before you start paying.
  COMMANDER DESIGN:
    Undaunted spells are designed for multiplayer — they're much cheaper in Commander.
    Examples: Reduce to Ruin ({4}{R}{R} with undaunted → in 4-player: costs {1}{R}{R}):
      1v1: costs {3}{R}{R}. 4-player: costs {1}{R}{R}. Strong value in Commander.
    Reduces to minimum mana cost of {0} (can't go negative).
  PLAYERS WHO LEFT:
    702.125b: players who have left the game don't count.
    If a player left before you cast the undaunted spell: fewer opponents = less reduction.
    In a 4-player game where one player left: 2 opponents remain. Costs {2} less (not {3}).

SUMMARY TABLE:
  | Mechanic   | What it pays with          | Pays for         |
  |------------|----------------------------|------------------|
  | Convoke    | Tapping creatures          | Colored + generic |
  | Improvise  | Tapping artifacts          | Generic only     |
  | Delve      | Exiling cards from GY      | Generic only     |
  | Undaunted  | (automatic — per opponent) | Generic only     |
  | Dredge     | Milling library            | Replaces a draw  |
```

## Definitive Conclusions

- **Convoke, Delve, and Improvise are NOT additional costs** — they apply after the total cost is determined; cost reductions (like Heartless Summoning) happen first, then these mechanics let you pay the remaining cost in alternative ways.
- **Creatures/artifacts with summoning sickness CAN be tapped for Convoke/Improvise** — tapping for these is paying a cost during casting, not activating an ability; 302.6 (summoning sickness) only restricts activated abilities.
- **Delve only pays generic mana** — colored mana in Delve spells must still be paid with mana; Convoke can pay both colored and generic (with appropriate colored creature).
- **Dredge is a replacement for a draw** — not a triggered ability; replaces one draw per dredge card per draw opportunity; can't dredge if library has fewer cards than the dredge number.
- **Undaunted reduces cost per opponent** — in 4-player Commander, a {5}{R} spell with undaunted costs {2}{R}; departures of players before casting reduce the discount.

## Canonical Example
**Chord of Calling with Summoning Sickness Creatures:**
Turn 4 (opponent's end step): You have 4 creatures in play, all entered this turn.
Hand: Chord of Calling ({X}{G}{G}{G} with convoke).
You want to find a Restoration Angel (3-drop), so X = 3. Cost: {3}{G}{G}{G}.

Can you tap your summoning-sick creatures for convoke? YES.
Convoke tapping is cost payment during casting — NOT activating an ability.
Rule 302.6 (summoning sickness) prevents using the tap symbol in activated abilities.
Convoke is not activating an ability; it's paying a casting cost.

Tap 3 creatures for {G}{G}{G} and the generic {3} (if they're all green, 3 for colored + 0 for generic,
  but you can also use non-green creatures for the generic portion):
Actually: {3}{G}{G}{G} = you need {G}{G}{G} + {1}{1}{1} (generic).
Tap 3 green creatures for {G}{G}{G}. Tap 3 other creatures for {3}. Total: 6 creatures tapped.
But you only have 4 creatures. Pay {3}{G}{G}{G} with 4 creatures and some mana.

Simplified: 2 green creatures + 2 any creatures = pay {G}{G} + {2} from creatures. Need {G} and {1} more from mana.
If you have {G}{1} available: pay {G} (for the last {G}) and {1} (for the last generic) from mana pool.
Total mana spent: {1}{G}. Remaining paid by 4 creatures.

Result: Chord of Calling resolves at instant speed. Find Restoration Angel. ETB triggers.
Even though your creatures had summoning sickness: they're now tapped (no other impact — they weren't going to attack anyway).

**Example 2 — Treasure Cruise in Delve GY Race:**
Turn 6: Your GY has 10 cards (various creatures and spells that have died/been used).
You want to cast Treasure Cruise ({7}{U}: draw 3 cards).

Delve: for each generic mana in total cost, exile a card from GY.
Total cost: {7}{U} = {7} generic + {1} blue.
Exile 7 cards from GY: pay {7} generic with exiled cards.
Pay {U} with 1 blue mana.
Total mana paid: {U}. Draw 3 cards.

Strategic choice of what to exile:
- Don't exile reanimation targets (if you want them later).
- Don't exile flashback cards (if you want to use them).
- Exile creatures/instants/sorceries that are "dead" value.
- Prioritize: exile lands (you drew extra copies), artifacts, things with no GY synergy.

After casting: GY has 3 cards remaining (you exiled 7 of the 10).
If you want to cast another Delve spell later: only 3 + whatever you mill/play/die = smaller pool.
Don't over-rely on Delve spells in a row.

## Commonly Confused With
- **P016 (Combat — Attacking and Optional Costs)** — Convoke taps creatures during cost payment, not during combat. This is different from effects that tap creatures "as a cost to attack." Convoke can use summoning-sickness creatures; combat tapping cannot.
- **P002 (Replacement Effects)** — Dredge is a replacement effect that replaces "would draw." It fits the P002 pattern perfectly: "if you would draw a card, you may instead..." This is the prototypical replacement effect on draw mechanics.
- **P001 (Combat Damage Assignment)** — Not directly related. But Convoke is commonly misunderstood as "paying with creatures like damage." It's not damage — it's an alternative payment. No damage is involved.
- **P378 (Commander Rules)** — Undaunted is specifically designed for the Commander multiplayer format. The reduction scales with the number of opponents, making these cards more powerful in Commander than in 1v1. When a player leaves mid-game, the reduction decreases for subsequent casts.
