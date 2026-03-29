---
id: p370
name: Miracle, Overload, and Cipher — Draw-Triggered Casting, Text-Replacement Spells, and Combat-Encoding
category: stack
cr_refs: [702.94a, 702.94b, 702.96a, 702.96b, 702.96c, 702.99a, 702.99b, 702.99c]
tags: [miracle, overload, cipher, first-draw-of-turn, alternative-cost, text-changing-target-to-each, encoded-spell, combat-damage-copy, Temporal-Mastery, Bonfire-of-the-Damned, Mizzium-Mortars, Cyclonic-Rift, Hands-of-Binding, Hidden-Strings, no-targets-overload, linked-ability]
created: 2026-03-29
examples_count: 2
---

# P370 — Miracle, Overload, and Cipher — Draw-Triggered Casting, Text-Replacement Spells, and Combat-Encoding

## Abstract
**Miracle** (702.94a) is a static ability linked to a triggered ability: if you reveal a miracle card as you draw it AND it's the first card you've drawn this turn, you may cast it by paying the miracle cost instead of its normal mana cost. The reveal is optional — you can decline to reveal. If you reveal, the triggered ability goes on the stack; when it resolves, you may cast it for the miracle cost. **Overload** (702.96a) is an alternative cost that changes all instances of "target" in the spell's text to "each" — transforming a single-target spell into a board-wide effect. No targets means the spell can't be responded to with "counter target spell targeting..." and doesn't fizzle if targets become illegal (there are none). **Cipher** (702.99a) encodes an instant or sorcery onto a creature: whenever that creature deals combat damage, the ciphered spell may be copied and cast for free. The card stays encoded in exile until the creature leaves the battlefield.

## The Definitive Rules

**CR 702.94a** (verbatim): *"Miracle is a static ability linked to a triggered ability. 'Miracle [cost]' means 'You may reveal this card from your hand as you draw it if it's the first card you've drawn this turn. When you reveal this card this way, you may cast it by paying [cost] rather than its mana cost.'"*

**CR 702.96a** (verbatim): *"Overload is a keyword that represents two static abilities that function while the spell with overload is on the stack. Overload [cost] means 'You may choose to pay [cost] rather than pay this spell's mana cost' and 'If you chose to pay this spell's overload cost, change its text by replacing all instances of the word "target" with the word "each."' Casting a spell using its overload ability follows the rules for paying alternative costs in rules 601.2b and 601.2f–h."*

**CR 702.96b** (verbatim): *"If a player chooses to pay the overload cost of a spell, that spell won't require any targets. It may affect objects that couldn't be chosen as legal targets if the spell were cast without its overload cost being paid."*

**CR 702.99a** (verbatim): *"Cipher appears on some instants and sorceries. It represents two abilities. The first is a spell ability that functions while the spell with cipher is on the stack. The second is a static ability that functions while the card with cipher is in the exile zone. 'Cipher' means 'If this spell is represented by a card, you may exile this card encoded on a creature you control' and 'For as long as this card is encoded on that creature, that creature has "Whenever this creature deals combat damage to a player, you may copy the encoded card and you may cast the copy without paying its mana cost."'"*

## The Pattern

```
MIRACLE (702.94a):
  WHAT IT IS:
    A static ability + linked triggered ability on instants and sorceries.
    Condition: card must be drawn as the FIRST CARD drawn this turn.
    "As you draw it" — at the moment of drawing, you may reveal it.
    Reveal = optional. You can choose not to reveal (just keep it unrevealed in hand).
  THE TRIGGER:
    "When you reveal this card this way, you may cast it by paying [cost]."
    The trigger goes on the stack when you reveal.
    Resolves: you choose to cast at miracle cost or not.
  "FIRST CARD DRAWN THIS TURN":
    If you've already drawn a card this turn (including your normal draw): can't use miracle.
    First draw of the turn = the miracle is potentially active.
    Your upkeep draw: this is the first draw of your turn (usually).
    If you draw during your upkeep (before your draw step), the draw step card is second.
    In practice: most miracle decks try to ensure the miracle is drawn during the draw step
      (first draw of the turn), or during an opponent's turn (first draw since last draw, but
      technically this is still "this turn" when drawn).
    Wait: "this turn" in MTG = the current turn. If you draw on your opponent's turn: yes,
      if it's your opponent's turn, it's their turn, not yours. So if an opponent forces
      you to draw during their turn: is it the "first card you've drawn this turn"?
        "This turn" = the current game turn (active player's turn).
        If it's opponent's turn and you draw: it IS the first card you've drawn THIS TURN
          (since this is their turn, and you haven't drawn yet this turn).
        So: you CAN miracle from a card drawn during an opponent's turn if you haven't drawn
          in that opponent's turn yet.
    Brainstorm ({U}): "Draw 3 cards." If you Brainstorm: draw first card (can miracle), then
      draw second and third (those are NOT the first draw — you already drew).
      CRITICAL: With Brainstorm, only the FIRST card drawn may be miracled.
      If you miracle the first card: the trigger goes on the stack.
      The trigger resolves: you may cast the miracles card for its miracle cost.
  MIRACLE AND FETCHLANDS:
    Fetch + Brainstorm + miracle: cycle cards to set up top of library, then miracle the top.
    Classic Legacy / Vintage setup.
  MIRACLE CARDS:
    Temporal Mastery ({5}{U}{U}): "Take an extra turn." Miracle {1}{U}.
      Normal cost: 7 mana. Miracle: 2 mana. That's a huge discount.
      With top-of-library manipulation (Sensei's Divining Top, Brainstorm): reliable.
    Bonfire of the Damned ({X}{X}{R}): "Deals X damage to target creature and X+1 to
      target player." Miracle {X}{R}.
      Normal: pay {X}{X}{R} for X damage to creature + X+1 to player.
      Miracle: pay {X}{R} for same effect. Half the mana.
      At miracle cost of {4}{R}: X=4, deals 4 to a creature and 5 to opponent. Board wipe + damage.

OVERLOAD (702.96a):
  WHAT IT IS:
    An alternative cost that replaces the normal mana cost AND changes the spell's text.
    "Overload [cost]": choose to pay the overload cost instead of normal cost.
    Text change: all instances of "target" → "each."
    "Target creature" becomes "each creature." Single-target → board-wide.
  NO TARGETS WHEN OVERLOADED (702.96b):
    The spell won't require any targets when overloaded.
    "May affect objects that couldn't be chosen as legal targets" — overload bypasses targeting restrictions.
    Creature with hexproof: can't normally be targeted. With overload: it's "each creature," no targeting.
      So overload spells bypass hexproof, shroud, and other targeting restrictions.
    This is significant: Cyclonic Rift ({X}{U}) for "return target nonland permanent"
      overloaded: "return EACH nonland permanent" — including hexproof/shroud permanents.
  OVERLOAD TEXT-CHANGING EFFECT (702.96c):
    This is a Layer 3 text-changing effect (rule 612).
    "All instances of 'target'" — literally all of them in the spell's text.
    If the spell says "target creature" three times: all three become "each creature."
  OVERLOAD EXAMPLES:
    Cyclonic Rift ({1}{U}): "Return target nonland permanent." Overload {6}{U}.
      Normal: return one permanent (instant). Used as bounce.
      Overloaded ({6}{U}): "Return EACH nonland permanent you don't control." All opponent permanents bounce.
      This is a one-sided board wipe. Used in Commander as a "reset" at instant speed.
      At overload: 7 mana, bounce everything opponents control. Incredible effect.
    Mizzium Mortars ({1}{R}): "Deals 4 damage to target creature." Overload {3}{R}{R}{R}.
      Normal: targeted removal (instant).
      Overloaded: "Deals 4 damage to EACH creature your opponents control." Destroy all opponent creatures.
      Board wipe for overload cost {3}{R}{R}{R}.
    Supreme Verdict ({1}{W}{W}{U}): "Destroy all creatures. Can't be countered."
      This is NOT overload — it's just already a board wipe.
      Comparing to overload: Mizzium Mortars' overload is similar in effect.

CIPHER (702.99a):
  WHAT IT IS:
    A two-ability mechanic on instants/sorceries.
    Ability 1 (spell ability while on stack): may exile this card encoded on a creature you control.
    Ability 2 (static while in exile): creature has "whenever this creature deals combat damage to
      a player, you may copy encoded card and cast copy without paying its mana cost."
  HOW IT WORKS:
    Cast the cipher spell. It resolves (effects happen first).
    Then: the cipher ability — exile the card encoded on a creature you control.
    Card is now in exile, encoded on that creature.
    As long as encoded on the creature: when the creature deals combat damage to a player,
      you may copy the encoded card and cast the copy for free.
  THE COPY:
    Copies are put onto the stack. They may be cast without paying mana cost.
    This IS a cast event (you "cast" the copy).
    Prowess triggers. Storm count. "When you cast a spell" effects.
    Wait: is cipher's copy a "cast" or a "put onto the stack without casting"?
    702.99a: "you may copy the encoded card and YOU MAY CAST THE COPY without paying its mana cost."
    "Cast the copy" — it is a cast. Triggers "when you cast" effects.
  ENCODED CARD STAYS IN EXILE:
    702.99c: The card stays encoded as long as card is exiled AND creature is on battlefield.
    Even if creature changes controller: still encoded (702.99c).
    If the creature leaves the battlefield: cipher ends (creature gone from battlefield).
    If the encoded card leaves exile somehow: cipher ends.
  CIPHER CARDS:
    Hands of Binding ({1}{U}): "Tap target creature an opponent controls. That creature doesn't untap during
      its controller's next untap step. Cipher." Encoded: repeat tap-lock every combat hit.
    Hidden Strings ({U}): "You may tap or untap target permanent, then you may tap or untap
      another target permanent. Cipher." Encoded: free tap/untap every combat hit.
    Stolen Identity ({4}{U}{U}): "Create a token that's a copy of target artifact or creature. Cipher."
      Encoded: free copy token every combat hit. Very powerful — repeated token creation.
  CIPHER AND EVASION:
    For cipher to trigger, the creature must deal combat damage to a player.
    Creatures with evasion (flying, unblockable, menace with good stats) are ideal cipher targets.
    Giving a cipher creature evasion = repeated free spell activations.
    Classic: encode Stolen Identity on an evasive flier → copy a permanent every attack.
```

## Definitive Conclusions

- **Miracle only applies to the first card drawn this turn** — if you've drawn before, miracle is unavailable; with Brainstorm (draws 3), only the first drawn card may be miracles.
- **Miracle reveal is optional** — you can choose not to reveal and just keep the card; the trigger only fires if you reveal.
- **Overloaded spells have no targets** — they affect "each" applicable object; hexproof and shroud don't stop overload because there's no targeting.
- **Overload bypasses targeting protections but uses an alternative cost** — must pay the overload cost; can't also pay the normal cost plus overload.
- **Cipher's copy IS a cast event** — triggers prowess, storm count, and "when you cast" effects; it's cast without paying mana cost (like miracle or cascade).
- **Cipher stays encoded until the creature leaves the battlefield** — it persists through controller changes (702.99c); only ends when the creature leaves or the card leaves exile.

## Canonical Example
**Temporal Mastery Miracle:**
You're playing Legacy control. Your hand has been managed with Brainstorm and fetchlands.
Using Sensei's Divining Top: you arrange Temporal Mastery on top of your library.
Your draw step: you draw the top card.
You draw Temporal Mastery ({5}{U}{U}: "Take an extra turn after this one. Exile." Miracle {1}{U}).
It's the first card you've drawn this turn.
You REVEAL Temporal Mastery using its miracle ability.
Miracle trigger fires: "When you reveal this card this way, you may cast it by paying {1}{U}."
Trigger goes on the stack.
Opponent can respond to the trigger (though they can't do much — they can't counter it yet).
Trigger resolves: you choose to cast Temporal Mastery for {1}{U} (2 mana, not 7).
Temporal Mastery goes on the stack as a spell. Opponent can counter it now (it's on the stack).
If not countered: resolves. You take an extra turn. Temporal Mastery is exiled.
Total: 2 mana for an extra turn instead of 7. Enormous value.

Without miracle: Temporal Mastery costs {5}{U}{U} (7 total) — almost never worth it.
With miracle: {1}{U} (2 mana) — one of the best extra-turn spells ever printed.

**Example 2 — Cyclonic Rift Overload:**
Commander game, turn 7. You have 7 lands (including {1}{U}).
Opponents collectively control: 15 permanents (lands excluded? No — overload says "nonland permanent").
Wait: "Return each nonland permanent you don't control."
Each opponent has 5 nonland permanents = 15 total across 3 opponents.
Plus any planeswalkers, enchantments, artifacts.

You cast Cyclonic Rift with overload (pay {6}{U} = 7 mana).
Text becomes: "Return each nonland permanent you don't control to its owner's hand."
No targets. Can't be responded to with "you can't target that" (there are no targets).
Opponents with hexproof creatures: doesn't help them. No targeting = hexproof irrelevant.

Rift resolves:
  All 15 nonland permanents controlled by opponents return to their hands.
  Your permanents: untouched (overload says "you don't control").
  Opponents lost their whole boards.
  On your next turn: attack with everything.

This is why Cyclonic Rift is one of the most powerful and most complained-about Commander cards.
Overloaded: board wipe at instant speed (use on opponent's end step before your turn).

## Commonly Confused With
- **P366 (Suspend)** — Miracle triggers from drawing a card; suspend creates a delayed trigger at upkeep. Both give you a future "cast for free" window, but the mechanism is completely different (draw vs. counters-over-time).
- **P356 (Flashback/Jump-Start)** — Cipher creates free copies on combat damage. Flashback casts from GY for an alternative cost. Cipher doesn't cast the CARD from GY (it casts a COPY). The encoded card stays in exile; it's never in the GY.
- **P361 (Ward/Hexproof/Shroud)** — Overload bypasses hexproof and shroud because it removes all targeting (702.96b). Ward, hexproof, and shroud only affect targeting. Without targets: none of those protections apply.
- **P362 (Storm)** — Cipher's copy IS a cast event (prowess triggers, storm count increases). Storm copies from the storm ability are NOT cast (don't trigger prowess or "when you cast"). Key difference: cipher copies are cast; storm copies are not.
