---
id: p295
name: Flashback, Madness, and Rebound — Casting From Graveyard or Exile
category: zones
cr_refs: [702.34a, 702.35a, 702.35b, 702.35c, 702.88a, 702.88b]
tags: [flashback, madness, rebound, graveyard-cast, exile-cast, alternative-cost, discard, Snapcaster-Mage, Faithless-Looting, Lingering-Souls, Fiery-Temper, Think-Twice, Alrund-Epiphany]
created: 2026-03-29
examples_count: 2
---

# P295 — Flashback, Madness, and Rebound — Casting From Graveyard or Exile

## Abstract
Three mechanics that let you cast a card again from a non-standard zone: **Flashback** (cast from the GY for an alternate cost; card then exiles instead of going anywhere else), **Madness** (when discarded, exile it instead — then you may cast it at its madness cost before it goes to the GY), and **Rebound** (if cast from hand, instead of going to GY it exiles; at the beginning of your next upkeep you may cast it for free from exile). Each extends the value of a single card past its first use, but through fundamentally different timing and mechanisms.

## The Definitive Rules

**CR 702.34a** (verbatim): *"Flashback appears on some instants and sorceries. It represents two static abilities: one that functions while the card is in a player's graveyard and another that functions while the card is on the stack. 'Flashback [cost]' means 'You may cast this card from your graveyard if the resulting spell is an instant or sorcery spell by paying [cost] rather than paying its mana cost' and 'If the flashback cost was paid, exile this card instead of putting it anywhere else any time it would leave the stack.'"*

**CR 702.35a** (verbatim): *"Madness is a keyword that represents two abilities. The first is a static ability that functions while the card with madness is in a player's hand. The second is a triggered ability that functions when the first ability is applied. 'Madness [cost]' means 'If a player would discard this card, that player discards it, but exiles it instead of putting it into their graveyard' and 'When this card is exiled this way, its owner may cast it by paying [cost] rather than paying its mana cost. If that player doesn't, they put this card into their graveyard.'"*

**CR 702.88a** (verbatim): *"Rebound appears on some instants and sorceries. It represents a static ability that functions while the spell is on the stack and may create a delayed triggered ability. 'Rebound' means 'If this spell was cast from your hand, instead of putting it into your graveyard as it resolves, exile it and, at the beginning of your next upkeep, you may cast this card from exile without paying its mana cost.'"*

## The Pattern

```
FLASHBACK:
  Requirement: card is in your graveyard
  Window: any time you could cast that spell normally (instant any time; sorcery during your main phase)
  Cost: pay the flashback cost (printed on the card) instead of the normal mana cost
  On resolution: card exiles (NOT goes to GY)
  On countered or any other zone departure during flashback: still exiles
  Key limitation: only instants and sorceries can have flashback

  FLASHBACK ON INSTANTS:
    Think Twice ({1}{U}): Flashback {2}{U}. Draw a card.
    Cast from GY paying {2}{U}: draw a second card. Card then exiles.
    Total value: 2 cards for {1}{U} + {2}{U} = {3}{U}{U}

  FLASHBACK ON SORCERIES:
    Lingering Souls ({1}{W}): Flashback {1}{B}. Create two 1/1 Spirit tokens.
    Cast from GY during your main phase paying {1}{B}: two more spirits. Card exiles.
    Total value: 4 1/1 Spirits for {1}{W} + {1}{B} = {2}{W}{B} across 2 turns.

  SNAPCASTER MAGE INTERACTION:
    Snapcaster Mage ({1}{U}): "When it ETBs, target instant or sorcery in your GY gains flashback
      until end of turn. The flashback cost is equal to its mana cost."
    Snapcaster doesn't give the flashback cost as the alternative cost — it gives the SAME mana cost.
    So: casting a Counterspell via Snapcaster costs {U}{U} (the normal counterspell cost).
    Counterspell is in GY → Snapcaster enters → it gets flashback (at {U}{U}) until EOT.
    Then cast Counterspell from GY for {U}{U} via flashback. It exiles.
    NOT free: Snapcaster Mage + Counterspell costs {1}{U} + {U}{U} = {1}{U}{U}{U} total.

  FAITHLESS LOOTING + FLASHBACK:
    Faithless Looting ({R}): Draw 2, discard 2. Flashback {2}{R}.
    Cast on turn 1: draw 2, discard 2 (set up GY).
    Later: cast from GY for {2}{R}: draw 2, discard 2 again.
    Total: 4 cards drawn, 4 discarded, for {R} + {2}{R} = {3}{R}.
    Classic combo enabler: discard combo pieces to GY, then use them later.

MADNESS:
  Requirement: card is in hand; a discard effect discards it
  When discarded: replacement effect — instead of going to GY, it exiles
  Triggered ability fires: "you may cast this card from exile at its madness cost"
  If you cast it: resolves as normal; goes to GY/exile when done (not back to GY mid-cast)
  If you don't cast it: goes to GY immediately (now in GY, not exile)

  KEY TIMING: Madness happens DURING the discard effect
    Example: opponent casts Liliana of the Veil "+1: each player discards a card"
    You discard Fiery Temper from your hand
    Replacement: it goes to exile instead of GY
    Madness trigger: you may cast Fiery Temper paying {R} instead of {1}{R}{R}
    Stack: Liliana's +1 still resolving, but madness trigger goes on the stack
    You can cast Fiery Temper immediately targeting anything (opponent, creature, etc.)
    Fiery Temper resolves: deals 3 damage. Card goes to GY.
    Madness turns opponent's discard into YOUR aggressive play.

  MADNESS IS NOT FREE:
    You pay the madness cost, which is usually discounted
    Fiery Temper: normal {1}{R}{R} → madness {R} (2 mana cheaper)
    Circular Logic: normal {1}{U}{U} → madness {U} (deep discount)
    Aether Vial could cheat in creatures; madness cheats in instants/sorceries via discard

  MADNESS MUST BE CAST IMMEDIATELY:
    Madness trigger fires when exiled by the discard
    You can only cast it "now" — not hold it in exile for later
    If you choose not to cast: goes to GY. Cannot retrieve via madness again.

REBOUND:
  Requirement: spell cast from HAND (not from GY, not from exile)
  When the spell resolves: instead of going to GY, it's exiled
  Delayed trigger created: "at the beginning of your next upkeep, you may cast this card from exile"
  Upkeep trigger: if you choose to cast it, you cast it without paying its mana cost (free!)
  Key: the upkeep cast is optional ("may")
  After the upkeep cast resolves: card goes to GY (no more rebound; it was already done)

  REBOUND ONLY IF CAST FROM HAND:
    CR 702.88a: "If this spell was cast from your hand..."
    If cast via Snapcaster Mage (from GY): rebound doesn't apply (not cast from hand)
    If cast with flashback from GY: rebound doesn't apply
    Cascade → puts rebound card from top of library → that's casting from exile: rebound doesn't apply
    Rebound requires HAND → stack → exile path

  REBOUND NOTABLE CARDS:
    Distortion Strike ({U}): Rebound. Target creature gets +1/+0 and is unblockable this turn.
    Cast turn 1: +1/+0 unblockable. Exiles via rebound.
    Upkeep next turn: cast for free: +1/+0 unblockable again.
    Two attack buffs for {U} total.

    Narset Transcendent (Planeswalker +1): "Look at top card. If noncreature, put in hand and it gains rebound."
    The spell gets rebound from an external effect — unusual way to gain rebound mid-game.
    Rebound on a spell with powerful effect = free second copy next upkeep.

DISTINGUISHING THE THREE:
  Zone before casting:
    Flashback: FROM YOUR GRAVEYARD
    Madness: from exile (it was your hand → exile upon discard)
    Rebound: from exile (it was your stack → exile on resolution)

  What triggers the cast opportunity:
    Flashback: you choose to spend the flashback cost (you control the timing)
    Madness: fires when you discard the card (opponent or effect can force it)
    Rebound: fires at your next upkeep automatically (unless you skip it)

  End destination after the alternate cast:
    Flashback: EXILES (can't be flashbacked again)
    Madness: goes to GY normally after the madness cast resolves
    Rebound: goes to GY after the free upkeep cast resolves
```

## Definitive Conclusions

- **Flashback exiles the card on leaving the stack** — no GY loop; one additional use max.
- **Madness intercepts the discard event** — you cast at reduced cost immediately before GY arrival.
- **Rebound requires being cast from hand** — flashback or cascade triggers do NOT grant rebound's free replay.
- **Snapcaster Mage grants flashback at the card's original mana cost** — not free, not discounted.
- **Madness does not require your own discard** — opponent-forced discards (Liliana, Thoughtseize-effects) also trigger madness.

## Canonical Example
**Faithless Looting + Zombie Combo:**
Turn 1: cast Faithless Looting ({R}). Draw 2 (find Gravecrawler + Dread Return). Discard 2 (discard both).
Graveyard: Faithless Looting, Gravecrawler, Dread Return.
Turn 2: Flashback Faithless Looting. Pay {2}{R}. Draw 2 more (find Carrion Feeder + Bridge from Below).
Faithless Looting exiles (flashback used = permanent exile).
GY now has Dread Return and other setup pieces.
Continue graveyard synergy. Flashback doubles the cantrip value: 4 cards drawn total for {3}{R}.
Key: flashback cost is higher but the GY setup justifies the premium.

**Example 2 — Fiery Temper Madness via Wild Mongrel:**
Board: Wild Mongrel (2/2 creature). GY: empty. Hand: Fiery Temper.
Opponent's creature is attacking. Declare no blocks. During the declare attackers step: activate Wild Mongrel.
Wild Mongrel: "{: Discard a card: Wild Mongrel gets +1/+1 and becomes the color of your choice until EOT."
Discard Fiery Temper: it's discarded!
Madness replacement: Fiery Temper goes to exile instead of GY.
Madness trigger fires: "You may cast Fiery Temper for its madness cost {R}."
You choose to cast it for {R}. Target the attacking creature.
Fiery Temper deals 3 damage to the attacker. Creature dies.
Wild Mongrel: becomes bigger AND blocks were irrelevant.
Two effects for one discard: Wild Mongrel pumped AND attacker killed.
Classic Odyssey/Torment limited combo.

## Commonly Confused With
- **P282 (Escape/Delve)** — Escape also casts from GY; unlike flashback, escaped cards may be cast again if they re-enter the GY.
- **P269 (Plot)** — Plot also exiles for a future free cast; but the plot exile window is sorcery-speed and a player's deliberate choice, not a discard trigger.
- **P283 (Foretell)** — Foretell also exiles for later discount; but foretell happens from hand on YOUR terms; madness fires when you're forced to discard.
- **P286 (Sagas)** — Sagas are about chapter sequencing, not casting from alternate zones.
