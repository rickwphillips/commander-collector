---
id: p304
name: Ninjutsu, Convoke, and Dredge — Hand and Creature-Based Cost Mechanics
category: costs
cr_refs: [702.49a, 702.49b, 702.49c, 702.51a, 702.51b, 702.52a]
tags: [ninjutsu, convoke, dredge, hand, battlefield-entry, tapping-creatures, mill-to-draw, Kamigawa, Ravnica, Golgari, Yuriko-the-Tiger-Shadow, Siege-Wurm, Life-from-the-Loam, Stinkweed-Imp, Griselbrand]
created: 2026-03-29
examples_count: 2
---

# P304 — Ninjutsu, Convoke, and Dredge — Hand and Creature-Based Cost Mechanics

## Abstract
Three mechanics with distinct relationships to the hand, creatures on the battlefield, and the library. **Ninjutsu** swaps an unblocked attacking creature for a Ninja card from your hand — the Ninja enters tapped and attacking directly, bypassing summoning sickness. **Convoke** lets you tap creatures to pay for a spell's mana cost — each creature can pay one generic mana or one mana of its color. **Dredge** replaces a draw with milling N cards and returning the dredge card from the GY to hand — enabling powerful GY strategies by filling and recycling the graveyard.

## The Definitive Rules

**CR 702.49a** (verbatim): *"Ninjutsu is an activated ability that functions only while the card with ninjutsu is in a player's hand. 'Ninjutsu [cost]' means '[Cost], Reveal this card from your hand, Return an unblocked attacking creature you control to its owner's hand: Put this card onto the battlefield from your hand tapped and attacking.'"*

**CR 702.49c** (verbatim): *"The creature put onto the battlefield with the ninjutsu ability enters attacking the same player, planeswalker, or battle as the creature that was returned to its owner's hand."*

**CR 702.51a** (verbatim): *"Convoke is a static ability that functions while the spell with convoke is on the stack. 'Convoke' means 'For each colored mana in this spell's total cost, you may tap an untapped creature of that color you control rather than pay that mana. For each generic mana in this spell's total cost, you may tap an untapped creature you control rather than pay that mana.'"*

**CR 702.52a** (verbatim): *"Dredge is a static ability that functions only while the card with dredge is in a player's graveyard. 'Dredge N' means 'As long as you have at least N cards in your library, if you would draw a card, you may instead mill N cards and return this card from your graveyard to your hand.'"*

## The Pattern

```
NINJUTSU:
  Activated ability — functions only while card is in hand
  Cost: [cost] + reveal the Ninja + return an unblocked attacker to hand
  Effect: Ninja enters the battlefield tapped and attacking (the same target as the returned creature)

  TIMING:
    Ninjutsu can only be done AFTER a creature's attack is declared AND determined to be unblocked
    The defending player has declared no blockers for the target creature (or all blockers were removed)
    "Unblocked attacking creature" = declared as attacker + not blocked
    Window: after declare blockers step confirms the creature is unblocked
    Before combat damage step: this is the timing where ninjutsu is most commonly done

  WHY NINJUTSU IS POWERFUL:
    The Ninja enters TAPPED AND ATTACKING: bypasses summoning sickness completely
    It was in your hand with summoning sickness immunity by virtue of entering mid-combat
    The Ninja's power counts for damage: if it has bigger P/T than the returned creature, more damage dealt
    The returned creature: goes back to hand, can be cast again next turn (re-using ETB triggers)

  NINJUTSU MECHANICS:
    The Ninja enters the battlefield during the declare blockers step (or after)
    It attacks the same player/planeswalker/battle as the returned creature was attacking
    The Ninja is attacking — it will deal combat damage unless the defending player uses a trick
    Trample: if the Ninja has trample, it resolves with trample

  NOTABLE NINJUTSU CARDS (Kamigawa):
    Yuriko, the Tiger's Shadow ({1}{U}{B}):
      Commander ninjutsu: can be used from the command zone (not just hand)
      "Whenever a Ninja you control deals combat damage to a player, reveal the top card of your library
        and put it into your hand. You lose life equal to that card's mana value."
      In Commander: Yuriko is the Ninja commander. Put a cheap 1-mana evasive creature out turn 1.
      Turn 2: attack with 1-drop. Ninjutsu Yuriko in from command zone.
      Yuriko deals combat damage → reveal top card (library is full of high-MV cards).
      Reveal Blightsteel Colossus (MV 12): opponents all lose 12 life (Yuriko hits multiple players in some formats).
      Or: in 1v1, opponent loses 12 life from one reveal.

    Fallen Shinobi ({4}{U}{B}): 5/4. Ninjutsu {2}{U}{B}. "Whenever Fallen Shinobi deals combat damage
      to a player, that player exiles the top two cards of their library. Until EOT, you may play those
      cards without paying their mana costs."
      Hit opponent → play their cards for free!
      Ninjutsu cost {2}{U}{B}: much cheaper than casting it for {4}{U}{B}.

    Mistblade Shinobi ({1}{U}): 1/1. Ninjutsu {U}. "Whenever this Ninja deals combat damage to a player,
      you may return target creature that player controls to its owner's hand."
      Cheap tempo play: ninjutsu for {U}, bounce opponent's creature on hit.

  NINJUTSU + COMMANDER NINJUTSU (CR 702.49d):
    Commander ninjutsu also works from the command zone.
    Yuriko can be ninjutsued from the command zone as well as the hand.
    This bypasses the commander tax (you pay the ninjutsu cost, not the casting cost + tax).
    In Commander: Yuriko players almost never cast her normally — always ninjutsu.

CONVOKE:
  When casting a convoke spell: after determining total cost, you may tap creatures to pay mana
  Each colored mana: tap a creature of that color
  Each generic mana: tap any creature
  CR 702.51b: "Convoke isn't an additional or alternative cost"
    It applies after the total cost is determined
    Cost reducers (Goblin Electromancer) apply first to reduce the total cost; then convoke

  CONVOKE TIMING:
    Tapping creatures for convoke happens during step 601.2h (paying costs)
    Opponents can respond to the spell being cast but not to individual creatures being tapped
    (The spell is fully announced before the convoke taps are paid)

  CONVOKE EXAMPLES:
    Siege Wurm ({5}{G}{G}): 5/5 Trample. Convoke.
      Normal cost: {5}{G}{G} = 7 mana.
      With 7 creatures (at least 2 green): tap them all → cast Siege Wurm for {0}.
      A 7-creature board → free 5/5 Trample. In token decks: very achievable.

    Chord of Calling ({X}{G}{G}{G}): Instant — Convoke. "Search for a creature with MV ≤ X."
      Tap your creatures to pay for X + {G}{G}{G}.
      In Modern/Legacy combo: tap all creatures to tutor for a combo piece at instant speed.
      Used to find Viscera Seer, Melira, or Kitchen Finks for infinite loops.

    Venerated Loxodon ({4}{W}): Elephant. Convoke. "When V.L. enters, put a +1/+1 counter on
      each creature that convoked it."
      Tap 5 white creatures for convoke: Loxodon enters for free AND pumps all 5 creatures.
      Convoke + pump: paying with creatures rewards those same creatures.

DREDGE:
  Functions only in the graveyard
  Whenever you would DRAW a card: you may instead mill N + return this card to hand
  This replaces the draw (not "in addition to")
  Can only dredge if you have at least N cards in library

  KEY IMPLICATIONS:
    You are choosing to NOT draw a card in exchange for returning the dredge card
    This fills your GY rapidly (each dredge mills N cards)
    Dredge decks: maximize dredging to fill GY, then use GY synergies to win

  DREDGE CARD EXAMPLES:
    Golgari Grave-Troll (Dredge 6): 0/1 base. Gets +1/+1 for each creature in GY.
      Dredge 6: mill 6, return Grave-Troll to hand.
      Each dredge fills your GY with more creatures, making Grave-Troll bigger.
      In a dedicated dredge deck: Grave-Troll may be 20/21+ in the late game.

    Stinkweed Imp ({2}{B}): 1/2 Flying. Dredge 5. "Whenever this creature deals damage to a creature,
      destroy that creature."
      Dredge 5: mill 5 cards and get Stinkweed Imp back to hand.
      Keeps coming back: cast from hand → dies or attacks → back to GY → dredge to hand again.

    Life from the Loam ({1}{G}): Sorcery. Dredge 3. "Return up to 3 target land cards from your GY
      to your hand."
      Dredge 3: mill 3, return Life from the Loam to hand.
      Lands milled by dredge are recovered by Life from the Loam.
      Cycle: Dredge mills 3 → some are lands → Life from the Loam returns those lands.
      Engine: continuously convert draws into "mill 3 + recover lands."
      Used with cycling lands (Forgotten Cave etc.) for endless card advantage.

  DREDGE COMBO PAYOFFS:
    Narcomoeba ({1}{U}): "Whenever Narcomoeba is put into your GY from your library, you may put it
      onto the battlefield."
      Milled by dredge → enters play for free.
    Bloodghast ({B}{B}): "Bloodghast can't block. Landfall: return Bloodghast from GY to battlefield."
      Milled by dredge → play a land → Bloodghast returns.
    Dredge + these creatures: build a board from your GY without casting anything.

  DREDGE STRATEGY:
    1. Get a dredge card in GY (discard it, or mill it, or have it die).
    2. Each draw: choose to dredge instead.
    3. Fill GY with creatures and combo pieces.
    4. Use GY payoffs (Cabal Therapy, Bridge from Below, Dread Return) to win.
    Dread Return (flashback — sacrifice 3 creatures): return a creature from GY.
    Classic win: dredge into Griselbrand → Dread Return it out for free → Griselbrand draws 7 → win.
```

## Definitive Conclusions

- **Ninjutsu enters the Ninja tapped and attacking** — bypasses summoning sickness; activated from hand after opponent's blockers are declared.
- **Commander ninjutsu also works from the command zone** — Yuriko players pay ninjutsu cost instead of commander tax.
- **Convoke taps creatures to pay mana** — not an alternative cost; applies after total cost is determined (cost reducers apply first).
- **Dredge replaces a draw** — you mill N and get the dredge card back from GY (you don't draw the card).
- **Dredging is optional** — you may choose to take the normal draw instead at any draw opportunity.

## Canonical Example
**Yuriko Commander Damage Chain:**
Turn 1: cast Changeling Outcast (1/1 unblockable Shapeshifter — has all creature types including Ninja).
Turn 2: Changeling Outcast attacks (no blocker possible, it's unblockable).
During the declare blockers step: activate Yuriko from command zone (commander ninjutsu {1}{U}{B}).
Return Changeling Outcast to hand. Yuriko enters tapped and attacking.
Yuriko deals 2 combat damage (2/2) to opponent.
Yuriko's trigger: reveal top card of library. It's Blightsteel Colossus (MV 12).
Opponent loses 12 life.
Opponent at 8 life (20 - 12).
Turn 3: Recast Changeling Outcast. Attack again.
Repeat: ninjutsu Yuriko in. Another reveal. Another big reveal.
Typical game: Yuriko revealing high-MV spells kills opponents from full life in 2-3 attacks.
No commander tax paid ever: always using commander ninjutsu instead of casting.

**Example 2 — Dredge with Golgari Grave-Troll:**
Deck: Modern Dredge. Turn 1: discard Golgari Grave-Troll via Faithless Looting.
Turn 2: GY has Grave-Troll + 2 creatures (milled by Looting).
Draw step: choose to dredge instead. Dredge 6: mill 6 cards. Return Grave-Troll to hand.
Milled: Narcomoeba (enters play from mill), Stinkweed Imp, 4 more cards.
Narcomoeba trigger: enters the battlefield (0/0 flier — actually 1/1 flier, wait: Narcomoeba is 1/1).
Narcomoeba is now in play for free.
Cast Stinkweed Imp this turn? Or keep dredging.
Turn 3 draw: dredge Stinkweed Imp (Dredge 5). Mill 5. Return Imp to hand.
More Narcomoebas milled → more free 1/1 fliers.
GY has 15 creature cards now. Bridge from Below in GY: each creature death → 2/2 Zombie tokens.
Cast Dread Return (from GY, flashback — sacrifice 3 creatures): Sacrifice 3 Narcomoebas.
Return Griselbrand (7/7 Lifelink Flying). Trigger: Bridge from Below makes Zombie tokens for each sacrifice.
Griselbrand enters: pay 7 life → draw 7 cards. Find more combo pieces.
All from one Faithless Looting on turn 1.

## Commonly Confused With
- **P285 (Vehicles/Crew)** — Crew also taps creatures to activate something; Convoke taps to pay casting costs. Both use tapping as a resource.
- **P295 (Flashback)** — Dredge also recurs cards from GY; dredge returns to HAND (cast normally later), flashback casts directly from GY.
- **P282 (Escape/Delve)** — Delve also uses GY as a resource; delve exiles GY cards to reduce costs (destroying the resource), while dredge mills library cards and returns itself to hand (perpetual engine).
- **P297 (Cascade)** — Cascade exiles library cards looking for a spell; Ninjutsu bypasses normal casting rules to enter mid-combat. Both circumvent normal casting.
