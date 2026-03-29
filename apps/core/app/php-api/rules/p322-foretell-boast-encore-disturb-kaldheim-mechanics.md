---
id: p322
name: Foretell, Boast, Encore, and Disturb — Kaldheim-Era Mechanics
category: costs
cr_refs: [702.143a, 702.143b, 702.142a, 702.141a, 702.146a, 702.146b]
tags: [foretell, boast, encore, disturb, Kaldheim, exile-face-down, special-action, attack-trigger, once-per-turn, GY-activated, transformed-DFC, Alrund-Prophesy, Magda, Glorious-Sunrise, Halvar, Twilight-Dancer]
created: 2026-03-29
examples_count: 2
---

# P322 — Foretell, Boast, Encore, and Disturb — Kaldheim-Era Mechanics

## Abstract
Four mechanics from Kaldheim (2021) and adjacent sets. **Foretell**: exile a card from hand face-down for {2} (special action), then cast it later at its foretell cost — useful for mana smoothing and bluffing. **Boast**: a once-per-turn activated ability that can only be used after the creature attacks. **Encore**: activated ability from GY — exile the card, create temporary attacking token copies (one per opponent), sacrifice at end of combat. **Disturb**: cast a double-faced card from the GY using its disturb cost, which puts it into play transformed (back face up). Each mechanic has subtle timing and zone rules.

## The Definitive Rules

**CR 702.143a** (verbatim): *"Foretell is a keyword that functions while the card with foretell is in a player's hand. Any time a player has priority during their turn, that player may pay {2} and exile a card with foretell from their hand face down. That player may look at that card as long as it remains in exile. They may cast that card after the current turn has ended by paying any foretell cost it has rather than paying that spell's mana cost."*

**CR 702.143b** (verbatim): *"Exiling a card using its foretell ability is a special action, which doesn't use the stack. See rule 116, 'Special Actions.'"*

**CR 702.142a** (verbatim): *"A boast ability is a special kind of activated ability. 'Boast — [Cost]: [Effect]' means '[Cost]: [Effect]. Activate only if this creature attacked this turn and only once each turn.'"*

**CR 702.141a** (verbatim): *"Encore is an activated ability that functions while the card with encore is in a graveyard. 'Encore [cost]' means '[Cost], Exile this card from your graveyard: For each opponent, create a token that's a copy of this card that attacks that opponent this turn if able. The tokens gain haste. Sacrifice them at the beginning of the next end step. Activate only as a sorcery.'"*

**CR 702.146a** (verbatim): *"Disturb is an ability found on the front face of some double-faced cards. 'Disturb [cost]' means 'You may cast this card transformed from your graveyard by paying [cost] rather than its mana cost.'"*

## The Pattern

```
FORETELL:

HOW IT WORKS:
  During your turn, any time you have priority: pay {2}, exile a card with foretell face down.
  This is a SPECIAL ACTION (doesn't use the stack — can't be responded to).
  The card is now face-down in exile.
  On any future turn (NOT the current turn): you may cast it for its foretell cost.
  Foretell cost is usually cheaper than the card's normal mana cost.
  You may look at your own foretold cards (but opponents can't).

  FORETELL BLUFFING:
    Multiple foretold cards in exile: opponents don't know which is which.
    "You have two face-down exile cards. One might be Alrund's Epiphany."
    Creates tension and uncertainty.
    CR 702.143e: you must be able to differentiate between your foretold cards.
    Use notes or consistent physical ordering.

  TIMING RULES:
    Pay {2} and exile: your turn only. Any time you have priority.
    Cast from exile: AFTER the current turn. This means: opponent's turn, your next turn, etc.
    Can't foretell and immediately cast same turn: must wait at least until next turn.
    Foretell cost is often cheaper but available on opponent's end step (if foretell is an instant).

  ALRUND'S EPIPHANY ({5}{U}{U}, foretell {4}{U}{U}):
    "Take an extra turn after this one. Exile this spell."
    Foretell turn 2-3: pay {2}, exile face down.
    Turn 5-6: cast for {4}{U}{U} (2 mana cheaper than normal).
    Extra turn effects that exile themselves are common for power balance.

  NOTABLE FORETELL CARDS:
    Ravenous Lindwurm ({5}{G}{G}, foretell {3}{G}{G}): Creature. Foretell saves 2 mana.
    Behold the Multiverse ({3}{U}{U}, foretell {2}{U}{U}): draw two cards, scry 2. Often foretold early.
    Alrund's Epiphany: the most powerful foretell card — extra turn engine.

BOAST:

HOW IT WORKS:
  "Boast — [Cost]: [Effect]. Activate only if this creature attacked this turn and only once each turn."
  CR 702.142a: the creature must have attacked THIS turn (on your turn during your attack step).
  After declaring attackers (and the creature is attacking): you can activate Boast anytime after.
  Only once per turn: not once per attack. If the creature is untapped by another effect
    and attacks again (via some effect), the second attack doesn't reset the boast limit.
  Can be activated during combat (after attackers declared) or after combat during main phase.
  Flash in another copy of the creature that attacks: new object, can activate its Boast too.

  BOAST WINDOW:
    Declare attackers: creature is now attacking.
    Boast can be activated: during declare attackers step (after you declare), blockers step,
      combat damage, or post-combat main phase.
    Typical: activate after combat to ensure the creature survived and didn't die to blockers.
    Or: activate during combat to use the effect (e.g., pump) before damage.

  MAGDA, BRAZEN OUTLAW ({1}{R}): boast example (though Magda doesn't use boast keyword):
    Magda triggers "whenever a Dwarf you control becomes tapped." Not exactly Boast.
  Halvar, God of Battle (front face of Kaldheim DFC) has no boast ability.
  Let's use: Glorious Sunrise ({3}{G}{G}) or Kolvori, God of Kinship — these don't use boast.
  Actual Boast example: Narfi, Betrayer King ({3}{U}{B}): Boast — {U/B}{U/B}: return target
    creature card from your GY to the battlefield.
    Attack with Narfi: then activate Boast. Pay {U/B}{U/B}. Return creature from GY.
    Once per turn.

ENCORE:

HOW IT WORKS:
  From the GY: "[Cost], Exile this card from your GY: For each opponent, create an attacking
    token that's a copy of this card. Tokens gain haste. Sacrifice at beginning of next end step."
  Sorcery speed (activate only as a sorcery).
  Number of tokens = number of opponents.
  In 1v1: 1 token. In Commander 4-player: 3 tokens (3 opponents).
  Each token attacks the respective opponent.
  Haste: tokens can attack the turn they enter (they're entering attacking, so haste for
    any other purpose).
  Sacrifice at end of combat's end step: "beginning of next end step" = after combat ends.
  The tokens last for the whole combat step.

  NOTABLE ENCORE CARDS:
    Nessian Boar ({3}{G}{G}: 10/6, "whenever a creature blocks this, that creature's controller
    draws a card"): Encore {6}{G}. Create 10/6 token-copies attacking each opponent.
    Grim Hireling ({3}{B}): Encore {6}{B}{B}. Each copy creates Treasure on attack.
    Champion of the Perished (Zombie matters): Encore {5}{B}. Can create attacking Zombie copies.

  ENCORE TOKENS AS COPIES:
    The tokens have the same copiable characteristics as the card (P314 applies).
    They're copies — they have the card's ETB abilities? NO: entering as attackers ≠ entering battlefield normally.
    Actually: the tokens "enter the battlefield" then attack. ETBs on the token-copies DO fire.
    If the creature has "when this creature enters" → fires for each token.
    This can be powerful: Encore a creature with a strong ETB.

DISTURB:

HOW IT WORKS:
  Found on front face of some DFCs.
  "Disturb [cost]": from your GY, cast for disturb cost instead of mana cost.
  When cast with Disturb: enters with back face up (CR 702.146b).
  The creature you're bringing back is transformed — you get the back face.
  Cards with Disturb: usually have a more powerful or different back face.

  DISTURB EXAMPLES:
    Delver of Secrets (front) / Insectile Aberration (back).
    Wait: Delver doesn't have Disturb. Let me use proper Kaldheim/Innistrad examples.
    Lunarch Veteran ({W}, 1/1 Human Cleric with "when creature enters, gain 1 life"):
    Back face: Luminous Phantom (has an ability useful in undead themes).
    Cast from GY via Disturb: enters as Luminous Phantom.
    No "Lunarch Veteran ETB" fires (the back face is entering, not the front).
    But the BACK FACE's ETBs fire if any exist.

    Faithbound Judge / Sinner's Judgment:
    Front: {3}{W}{W} spirit creature, disturb {5}{W}{W}.
    Back: saga that accrues lore counters, eventually exiles a creature.
    Cast via disturb from GY: enters as the Saga back face.
    The Saga begins its lore counter progression.

  BACK FACE MV:
    When cast via Disturb: it's on the stack with back face up.
    MV of the spell on stack = front face mana cost (CR 712.8c applies to DFCs).
    Wait: CR 712.8c says "if an effect allows casting transformed, its mana value is the front face mana cost."
    So Faithbound Judge disturb: the spell on stack is back face but MV = front face ({3}{W}{W} = 5).

  ON THE BATTLEFIELD TRANSFORMED:
    If something returns it to hand from transformed: it returns as the front face.
    (CR 712.8a: in hand, DFC has front face characteristics only.)
    Can transform back? Only if it has a mechanism to do so.
```

## Definitive Conclusions

- **Foretell exiles face-down as a special action** — can't be responded to; casts from exile starting the NEXT turn (not the same turn).
- **Boast requires the creature to have attacked this turn** — once per turn limit; subsequent attacks in the same turn don't reset it.
- **Encore creates tokens that attack each opponent** — tokens gain haste, are sacrificed at the beginning of the NEXT end step.
- **Disturb casts a DFC from the GY with the back face up** — you get the back face's characteristics on the battlefield.
- **Multiple foretold face-down cards in exile provide bluffing value** — opponents can't identify which is which.

## Canonical Example
**Foretell Mana Smoothing — Alrund's Epiphany:**
Turn 2: hand has Alrund's Epiphany ({5}{U}{U}). You have only 2 mana.
Foretell: pay {2}, exile Alrund's Epiphany face down. It's now in exile for later.
Opponents see: "This player foretold a card." Unknown which card.
Turn 6: you have 6 mana ({4}{U}{U} foretell cost) available.
Cast Alrund's Epiphany from exile for {4}{U}{U} (the foretell cost, 2 cheaper than {5}{U}{U}).
Resolve: take an extra turn after this one.
The mana smoothing: you spent 2 mana on turn 2 to "invest" in the epiphany.
On turn 6 you spent 6 mana (2 invested + 4 paid on cast = 6 total instead of 7 normal cost).
Saved 1 mana total while also spreading out the cost and enabling bluffing from turn 2.
Extra turn chain potential: during the extra turn, cast another extra-turn effect.
In competitive Standard (when Alrund's Epiphany was legal): built "time walk" loops.

**Example 2 — Encore in Commander:**
Board: Nessian Boar ({3}{G}{G}: 10/6, Trample) in your GY.
Encore cost: {6}{G}.
You have 4 opponents in Commander. Activate Encore: pay {6}{G}, exile Nessian Boar from GY.
Create 3 token copies (one per opponent) — each attacks a different opponent.
Each token: 10/6 Trample. Each attacks the assigned opponent.
Nessian Boar's text: "Whenever a creature blocks this, that creature's controller draws a card."
Your 10/6 tokens: if blocked, the blocker's controller draws a card (not usually a downside for YOU).
But with 10/6 Trample: even if blocked by a 10/10, 10 damage to 10/10 (dies) + trample = 0 to player.
If unblocked: 10 damage to each of 3 opponents.
Tokens have haste.
End of turn (beginning of end step): sacrifice all 3 Nessian Boar tokens.
"When this creature is put into the GY" triggers (if any): fire for each token.
Nessian Boar itself: exiled (from the encore activation). Can't encore it again.
Net: one Encore activation killed 3 opponents (or heavily damaged all of them).
In multiplayer: Encore creates N-1 tokens (where N = player count). Scales with table size.

## Commonly Confused With
- **P295 (Flashback/Rebound)** — Foretell differs: you exile it BEFORE casting (from hand), then cast it from exile later. Flashback exiles it AFTER casting (as it resolves). Rebound exiles after casting and casts again next upkeep for free.
- **P317 (DFC Transform)** — Disturb casts the DFC from GY with back face up. The resulting permanent is transformed (back face up). It follows all DFC rules: MV is front face, can potentially transform again if it has a mechanism.
- **P309 (First Strike)** — Boast can be activated DURING the declare attackers step or after. Timing choice matters: activating before blockers are declared vs. after combat damage to avoid wasting resources.
- **P314 (Copy Effects)** — Encore tokens are token copies: they have the card's copiable characteristics but not its counters, damage, or non-copy effects. Encore tokens with ETBs DO trigger their ETBs when they enter the battlefield attacking.
