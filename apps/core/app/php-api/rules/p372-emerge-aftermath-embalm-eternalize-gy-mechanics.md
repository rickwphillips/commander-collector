---
id: p372
name: Emerge, Aftermath, Embalm, and Eternalize — Graveyard-Adjacent Alternative Costs and Token Recreation
category: zones
cr_refs: [702.119a, 702.119b, 702.119c, 702.127a, 702.128a, 702.128b, 702.129a]
tags: [emerge, aftermath, embalm, eternalize, sacrifice-creature-for-cost, graveyard-only-cast, exile-on-cast, zombie-token, white-zombie-black-token, 4-4-black-eternalize, Elder-Deep-Fiend, Wretched-Gryff, Farm-Market, Honored-Hydra, Nicol-Bolas-God-Pharaoh, Glyph-Keeper, self-mill-setup]
created: 2026-03-29
examples_count: 2
---

# P372 — Emerge, Aftermath, Embalm, and Eternalize — Graveyard-Adjacent Alternative Costs and Token Recreation

## Abstract
**Emerge** (702.119a) lets you cast an Eldrazi-style creature by paying its emerge cost and sacrificing a creature: the total emerge cost is reduced by the sacrificed creature's mana value. A 7-emerge creature sacrificing a 4-MV creature costs only 3 mana from the emerge cost. **Aftermath** (702.127a) is an ability on the right half of split cards that can ONLY be cast from the graveyard (not hand, not library) — and when it leaves the stack, it's exiled. **Embalm** (702.128a) and **Eternalize** (702.129a) are activated abilities that function from the graveyard: pay the cost, exile the card, create a token copy of it (embalm: white, Zombie, same stats; eternalize: black, 4/4, Zombie). The original card is consumed (exiled) to create the token. These are one-shot graveyard activations — you get the token once, then the card is gone.

## The Definitive Rules

**CR 702.119a** (verbatim): *"Emerge represents two static abilities that function while the spell with emerge is on the stack. 'Emerge [cost]' means 'You may cast this spell by paying [cost] and sacrificing a creature rather than paying its mana cost' and 'If you chose to pay this spell's emerge cost, its total cost is reduced by an amount of generic mana equal to the sacrificed creature's mana value.'"*

**CR 702.119c** (verbatim): *"You choose which permanent to sacrifice as you choose to pay a spell's emerge cost (see rule 601.2b), and you sacrifice that permanent as you pay the total cost (see rule 601.2h)."*

**CR 702.127a** (verbatim): *"Aftermath is an ability found on some split cards. It represents three static abilities. 'Aftermath' means 'You may cast this half of this split card from your graveyard,' 'This half of this split card can't be cast from any zone other than a graveyard,' and 'If this spell was cast from a graveyard, exile it instead of putting it anywhere else any time it would leave the stack.'"*

**CR 702.128a** (verbatim): *"Embalm is an activated ability that functions while the card with embalm is in a graveyard. 'Embalm [cost]' means '[Cost], Exile this card from your graveyard: Create a token that's a copy of this card, except it's white, it has no mana cost, and it's a Zombie in addition to its other types. Activate only as a sorcery.'"*

**CR 702.129a** (verbatim): *"Eternalize is an activated ability that functions while the card with eternalize is in a graveyard. 'Eternalize [cost]' means '[Cost], Exile this card from your graveyard: Create a token that's a copy of this card, except it's black, it's 4/4, it has no mana cost, and it's a Zombie in addition to its other types. Activate only as a sorcery.'"*

## The Pattern

```
EMERGE (702.119a–c):
  WHAT IT IS:
    Alternative casting cost for large Eldrazi-style creatures.
    Instead of paying full mana cost: pay [emerge cost] and sacrifice a creature.
    The emerge cost is reduced by the MV of the sacrificed creature.
    Formula: ACTUAL COST = emerge cost - sacrificed creature's MV.
  CHOOSING THE SACRIFICE:
    702.119c: Choose which creature to sacrifice as you announce casting with emerge (601.2b).
    You sacrifice that creature as you pay the total cost (601.2h) — not before, not after.
    The sacrifice is part of paying the cost, not an effect of the spell.
    If the sacrificed creature has "when this creature is sacrificed" triggers: they fire normally.
  MV REDUCTION:
    The emerge cost listed on the card is the starting cost.
    Generic mana in the emerge cost can be reduced.
    A creature with emerge {6}{U}: if you sacrifice a 4-MV creature → total: {2}{U}.
    The reduction applies to generic mana only. Colored mana in emerge is always required.
    Example: Emerge {6}{U} sacrificing a 4-MV creature:
      Emerge cost = {6}{U}. Reduce by 4 (generic). Total: {2}{U}.
      Pay {2}{U} to emerge with that sacrificed creature.
    Example: Emerge {6}{U} sacrificing a 7-MV creature:
      Reduce by 7. But: generic component is 6. Can't reduce below 0. Pay {0}{U} = {U}.
      Even with a huge creature: minimum cost is the colored mana component.
  EMERGE CARDS (ELDRITCH MOON):
    Elder Deep-Fiend ({8}): "Emerge {5}{U}{U}. Flash. When this enters, tap up to four target permanents."
      Emerge with a 3-MV creature: {5}{U}{U} - {3} = {2}{U}{U}.
      Flash + enters tapped = tap 4 on opponent's end step → they untap only 4 remaining → disruption.
    Wretched Gryff ({7}): "Emerge {5}{U}. When this enters, draw a card."
      Emerge with any creature: reduce the generic cost.
    Elder Deep-Fiend + Emerge engine: sacrifice Eldrazi Scions (MV 0) for no reduction, or sacrifice
      higher-cost creatures for bigger reduction. Sacrifice in upkeep with flash → major disruption.
  CASTING AND CASTING TRIGGERS:
    Emerge is an alternative cost — you ARE CASTING the spell. All "when you cast" effects trigger.
    Prowess fires. Storm count increases. Cascade chains if the emerge spell has cascade.

AFTERMATH (702.127a):
  WHAT IT IS:
    A split card variant where the right half (aftermath half) can ONLY be cast from the GY.
    Three components:
    1. "You may cast this half from your graveyard." (can use aftermath from GY)
    2. "This half can't be cast from any zone other than a graveyard." (restricted to GY only)
    3. "If this spell was cast from a graveyard, exile it instead of putting it anywhere else
       when it leaves the stack." (one-time use — goes to exile after)
  HOW TO GET IT TO THE GY:
    The split card has the aftermath half written sideways on the bottom.
    The left half can be cast normally (from hand, for its mana cost).
    When the left half is cast: the card goes to the GY? No:
      Actually: the left half of a split card is the entire card.
      When you cast the left half: the card (entire split card) goes to the GY on resolution.
      The right half (aftermath) is then in the GY. You can now cast it.
    Alternative: mill, discard, or other effects put the split card in GY. Then cast the aftermath half.
  ONE-TIME USE:
    After the aftermath half resolves (or is countered): exiled. Gone. Can't use again.
    Can't flashback an aftermath card. Can't escape it (wait: escape exiles other GY cards,
      but aftermath is a different ability — the "exile on leave stack" is aftermath's own rule).
  AFTERMATH EXAMPLES:
    Farm // Market (Amonkhet):
      Farm ({2}{W}): "Destroy target attacking or blocking creature."
      Market ({2}{U}): Aftermath. "Draw two cards, then discard two cards."
      Play: cast Farm to destroy an attacking/blocking creature. Card goes to GY. Then cast Market from GY for card draw/discard.
    Cut // Ribbons (Amonkhet):
      Cut ({1}{R}): "Cut deals 4 damage to target creature."
      Ribbons ({X}{B}{B}): Aftermath. "Each opponent loses X life."
      Cut + Ribbons: deal 4 damage to a creature with Cut, then drain opponents with Ribbons from GY.
      Ribbons alone (from GY, after putting Cut in GY somehow): win-condition late-game.
    The aftermath half of the split card stays in GY until cast. It's always there if the card was discarded or
      destroyed. You can hold the aftermath half in reserve.

EMBALM (702.128a):
  WHAT IT IS:
    Activated ability from the GY. [Cost], Exile this card from your GY: Create a white Zombie token copy.
    Activates only as a sorcery.
    ONE-TIME USE: the original card is exiled. Token remains on the battlefield.
  WHAT THE TOKEN LOOKS LIKE:
    Copy of the original card, EXCEPT:
    1. Color: white (regardless of original color).
    2. No mana cost (no CMC — the token is priceless; MV = 0 on the stack... wait: tokens without
       mana costs have MV 0 in most contexts).
    3. Zombie is an additional creature type.
    Stats (P/T), abilities, name: same as original (except as noted).
  USE CASES:
    Creatures with powerful ETB triggers (that fire when the token enters):
      The token entering the battlefield = entering the battlefield. ETBs fire.
    Creatures that provide value while on the battlefield: the token repeats that value.
    Honored Hydra ({5}{G}): 6/6. "Trample. Embalm {3}{G}."
      Embalm: create a white Zombie Hydra token that's a copy (6/6 trample).
      (Tokens are copies of the original; the Honored Hydra is 6/6 with trample.)
    Glyph Keeper ({3}{U}{U}): Whenever ~ becomes the target of a spell for the first time each turn,
      counter that spell. Embalm {5}{U}{U}.
      Embalm: get a 5/3 Zombie Sphinx token with the counterspell ability.
  EMBALM AND GRAVEYARD HATE:
    Rest in Peace / Leyline of the Void exile cards as they enter the GY.
    Embalm requires the card to be IN the GY. If the card never reaches the GY (exiled instead):
      Embalm can't be activated (the card isn't in the GY).

ETERNALIZE (702.129a):
  WHAT IT IS:
    Like embalm but:
    1. The token is BLACK (not white).
    2. The token is 4/4 (regardless of original P/T).
    3. Still has Zombie as additional type.
    4. Still no mana cost.
    Activates only as a sorcery from GY. Exile original card: create 4/4 black Zombie token copy.
  USE CASES:
    Creatures where the abilities are more important than P/T:
      The original might be a 2/1 with a great ability. Eternalized: 4/4 + same abilities.
    Nicol Bolas, the Ravager ({1}{U}{B}{R}): "When ~ enters, each opponent discards a card.
      {4}{U}{B}{R}: Exile ~, then return it transformed under its owner's control."
      The Ravager is legendary and a creature on this side.
      Can eternalize it after it dies? Only after it dies and is in GY.
      Eternalized Nicol Bolas: 4/4 black Zombie Dragon token (legendary? wait: tokens can be legendary).
      But legend rule: two Nicol Bolas → sacrifice one.
      Practically: after Ravager dies, eternalize it for a 4/4 with "when enters, each opponent discards."
      Value.
    Honored Hydra and others: the 4/4 stat is usually a buff for smaller creatures.
  ETERNALIZE vs. EMBALM:
    Embalm: white token, same P/T as original.
    Eternalize: black token, always 4/4.
    Both: Zombie, no mana cost, exile original card from GY, sorcery speed.
    The choice between them reflects the original set design (Amonkhet themes).
```

## Definitive Conclusions

- **Emerge reduces by sacrificed creature's MV — only generic mana in emerge cost is reducible** — colored mana always must be paid; with a 7-MV sacrifice and emerge {6}{U}, you still pay {U} at minimum.
- **Aftermath half can only be cast from the graveyard** — can't cast it from hand or library; after resolving, it's exiled (one-time use).
- **Embalm creates a white Zombie copy token with same stats** — token enters battlefield triggering ETBs; original card is exiled (one shot).
- **Eternalize creates a black 4/4 Zombie copy token** — P/T is always 4/4 regardless of original's P/T; all other characteristics (abilities, name, types) are copied.
- **All of embalm/eternalize are sorcery speed** — can't activate at instant speed; both consume the GY card, leaving you without the card for future use.
- **Emerge is a casting event** — prowess triggers; storm count increases; all "when you cast this" effects fire.

## Canonical Example
**Elder Deep-Fiend Emerge on Opponent's End Step:**
You're playing Sultai Emerge in Standard 2016. Board: Pilgrim's Eye ({3}: Artifact creature 1/1 flying, MV 3). Hand: Elder Deep-Fiend.
Elder Deep-Fiend: Emerge {5}{U}{U}. "Flash. When this enters, tap up to four target permanents." 5/6.

Opponent's end step (before their untap):
  Cast Elder Deep-Fiend with Flash using Emerge.
  Choose to emerge: pay {5}{U}{U} - 3 (Pilgrim's Eye MV) = {2}{U}{U}.
  Pay {2}{U}{U}. Sacrifice Pilgrim's Eye (as part of paying emerge cost).
  Elder Deep-Fiend enters the battlefield (5/6 Eldrazi).
  ETB trigger: tap up to 4 target permanents. Choose opponent's 4 lands.
  Opponent's 4 lands are tapped.

Opponent's untap step: opponent untaps their tapped permanents.
  But: the 4 tapped lands were tapped AT END OF OPPONENT'S TURN.
  Normally: things tapped during your turn untap during YOUR next untap step, not the opponent's.
  Wait: the opponent's untap step: they untap their own permanents that are "tapped."
  These 4 lands WERE tapped (by Elder Deep-Fiend's ETB). They're opponent's lands.
  Opponent's untap step: opponent untaps all their permanents normally.
  So: the lands ARE untapped on their next turn.
  Wait: the timing matters differently. If this happens at END of opponent's turn: their untap is NEXT.
  The value isn't "they lose a turn of mana permanently" — it's "they lose access to mana during their MAIN PHASE THIS TURN."
  No: it's END STEP. Untap is BEFORE main phase in the next turn.
  Actually the timing only helps if there's something relevant to tap during THEIR end step or if there's an "upkeep" effect.
  But the value is: you cast it at instant speed (flash) for {2}{U}{U} (emerged) → get a 5/6 body + ETB tap.

The real line: cast during their end step → their untap step happens next → lands untap.
Better use: tap 4 permanents that AREN'T just lands (creatures that were going to block, planeswalkers, etc.)
Tap 2 blockers + 2 other things: on YOUR next turn, when they'd want to block: those things are tapped.

**Example 2 — Aftermath: Cut // Ribbons:**
Cut ({1}{R}): "Target creature gets +2/+0 until end of turn and fights target creature you control."
  Wait, checking actual text: "Cut deals 4 damage to target creature. Aftermath."
  Actually: Cut deals 4 to a creature (kills it). Aftermath half: Ribbons ({X}{B}): "Each opponent loses X life."

Turn 5: Cast Cut ({1}{R}). Kill opponent's 4-toughness blocker (4 damage).
  Cut // Ribbons card goes to GY after resolution (it's a sorcery).
  Now the full card is in your GY. The Ribbons half is available via aftermath.
Turn 7: You have {X}{B} mana (say X=10). Cast Ribbons from GY for {10}{B}.
  "Each opponent loses 10 life." In Commander (3 opponents): each loses 10 → 30 total damage.
  Ribbons exiled after resolution (aftermath rule: exiled when it leaves stack).
  You drained 3 opponents for 10 each with X=10 plus the original removal from Cut.

Aftermath sequence: the LEFT half is a normal spell (valuable effect); the RIGHT half is a GY-only finisher.
The card provides TWO uses: once from hand (left half), once from GY (right half).
This is a unique design — the split card is inherently two-for-one when things go right.

## Commonly Confused With
- **P356 (Flashback/Jump-Start/Escape)** — These are all GY-based alternative casting mechanics. Aftermath differs: it can ONLY be cast from GY (not hand), and only the right half has aftermath. Flashback/jump-start/escape cast the whole card from GY. Embalm/eternalize don't cast the card — they create tokens and exile the card.
- **P363 (Tokens)** — Embalm and eternalize create tokens. Those tokens are on the battlefield; they cease to exist if they leave the battlefield. The original card that was embalmed/eternalized is in exile (not in the GY); the token is not the card.
- **P354 (Equipment/Auras)** — When a token created by embalm or eternalize enters the battlefield with an Equipment attached from a previous instance (hypothetical): the Equipment detaches if the new entity isn't legal. The embalmed/eternalized token has no mana cost, which might affect Aura targeting restrictions.
- **P362 (Storm/Cascade)** — Emerge is a casting event. If you emerge into a storm spell: storm triggers. If you cascade into an emerge creature: you may cast it emerged from the cascade. Storm count before cascade resolves includes spells cast this turn.
