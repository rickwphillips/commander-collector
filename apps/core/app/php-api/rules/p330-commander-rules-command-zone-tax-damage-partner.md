---
id: p330
name: Commander Rules — Command Zone, Commander Tax, Commander Damage, Partner
category: multiplayer
cr_refs: [903.3, 903.4, 903.5a, 903.5c, 903.8, 903.9, 903.9a, 903.9b, 903.10a, 702.124a, 702.124b, 702.124c, 702.124d, 702.125a]
tags: [Commander, command-zone, commander-tax, commander-damage, partner, Background, color-identity, 100-cards, singleton, 40-life, combat-damage-21, zone-replacement, Thrasios, Tymna, Korvold, Atraxa, Kenrith, Undaunted, Choose-a-Background]
created: 2026-03-29
examples_count: 2
---

# P330 — Commander Rules — Command Zone, Commander Tax, Commander Damage, Partner

## Abstract
Commander is a multiplayer singleton format with 100-card decks, 40 starting life, and a designated **commander** that starts in the **command zone**. When a commander would go to a graveyard or exile, its owner may instead put it into the command zone — a zone replacement. Casting a commander from the command zone costs an additional {2} for each previous casting (the **commander tax**). A player who has taken **21 or more combat damage from the same commander** over the course of the game loses. **Partner** abilities allow two commanders, combining their color identities. **Undaunted** reduces casting cost by the number of opponents. **Choose a Background** allows a non-legendary Background enchantment as a second commander.

## The Definitive Rules

**CR 903.8** (verbatim): *"A player may cast a commander they own from the command zone. A commander cast from the command zone costs an additional {2} for each previous time the player casting it has cast it from the command zone that game. This additional cost is informally known as the 'commander tax.'"*

**CR 903.9a** (verbatim): *"If a commander is in a graveyard or in exile and that object was put into that zone since the last time state-based actions were checked, its owner may put it into the command zone. This is a state-based action."*

**CR 903.9b** (verbatim): *"If a commander would be put into its owner's hand or library from anywhere, its owner may put it into the command zone instead. This replacement effect may apply more than once to the same event. This is an exception to rule 614.5."*

**CR 903.10a** (verbatim): *"A player who's been dealt 21 or more combat damage by the same commander over the course of the game loses the game. (This is a state-based action.)"*

**CR 702.124b** (verbatim): *"Your deck must contain exactly 100 cards, including its two commanders. Both commanders begin the game in the command zone."*

**CR 702.124c** (verbatim): *"A rule or effect that refers to your commander's color identity refers to the combined color identities of your two commanders."*

**CR 702.124d** (verbatim): *"Except for determining the color identity of your commander, the two commanders function independently. When casting a commander with partner, ignore how many times your other commander has been cast (see rule 903.8). When determining whether a player has been dealt 21 or more combat damage by the same commander, consider damage from each of your two commanders separately (see rule 903.10a)."*

**CR 702.125a** (verbatim): *"Undaunted means 'This spell costs {1} less to cast for each opponent you have.'"*

## The Pattern

```
COMMANDER BASICS:
  Format: 100-card singleton (no duplicates except basic lands).
  Start: 40 life. Commander begins in command zone.
  Win conditions: reduce all opponents to 0 life (or 0 cards when drawing),
    or deal 21 commander damage from YOUR specific commander.

THE COMMAND ZONE:
  A special zone where commanders live between casts.
  Not hand, not battlefield, not GY, not exile, not library.
  Commander in command zone: can be cast (paying current tax).
  Casting from command zone: puts commander on the stack (as a spell).
  On resolution: commander enters the battlefield like any other permanent.
  When the commander would leave the battlefield: owner CHOOSES (or must check).

COMMANDER REPLACEMENT RULES (CR 903.9):
  When a commander would go to the graveyard or exile (CR 903.9a):
    "That object was put into that zone since last SBA check."
    Owner MAY put it in the command zone instead.
    This is a STATE-BASED ACTION — happens after SBAs are checked.
    Not optional: owner decides after the event is already happening.
  When a commander would be put in a player's hand or library (CR 903.9b):
    Owner MAY put it in the command zone INSTEAD.
    This is a REPLACEMENT EFFECT.
    Note (CR 903.9b): "This replacement effect may apply more than once to the same event." — unusual exception to 614.5.

  IMPORTANT IMPLICATIONS:
    Commander dies: owner chooses GY or command zone.
      If command zone: the commander is NOT in the GY.
      Effects that trigger when a creature "dies" (is put into GY from battlefield):
        If you choose command zone instead of GY: it didn't "go to the GY" → dies trigger... wait.
        Actually: the death still HAPPENED (it left the battlefield). "Dies" = goes to GY from battlefield.
        If it went to command zone, not GY: the creature left the battlefield, but didn't go to GY.
        CR 700.4: "A creature or planeswalker 'dies' if it is put into a graveyard from the battlefield."
        If commander goes to command zone instead: it did NOT die (didn't go to GY).
        BUT: "when this creature leaves the battlefield" triggers DO fire (it left the battlefield).
    Blink effects (exile then return): commander would be exiled → owner may put in command zone.
      Then it doesn't "return" — it's in the command zone.
      Flickerwisp exiles a commander → owner may command zone it → Flickerwisp tries to return it...
      but it's not in exile anymore → doesn't return. Commander must be recast from command zone with tax.
      Exception: some effects use replacement that exile "until end of turn" — commander goes to exile
        and can be command-zoned instead. If command-zoned, the "at end of turn, return from exile"
        doesn't find it there → doesn't return.

COMMANDER TAX (CR 903.8):
  Each cast FROM THE COMMAND ZONE costs +{2} per previous command zone cast.
  First cast: no tax.
  Second cast: +{2}.
  Third cast: +{4}.
  Tenth cast: +{18}. (Yes, this can get very high.)
  TAX ONLY APPLIES to casts FROM THE COMMAND ZONE.
    If you cast your commander from your hand (e.g., via Brainstorm putting it in hand + casting):
      No commander tax. Costs only its mana cost.
      But this is unusual — most players let it go to command zone when it dies.
  TAX IS CUMULATIVE: tracks casts from command zone, not how many times the commander has died.
    Commander dies 5 times, you chose command zone each time, cast each time: fifth cast costs +{8}.
    But if you chose GY for some deaths (for reanimate tricks), fewer taxes may have accumulated.

  TAX INTERACTION WITH COST REDUCTION:
    Tax is an additional cost. Cost reductions apply against it.
    Goblin Electromancer reduces your sorcery commander's total cost by {1}.
    With 2 taxes accumulated: commander base cost + {4} tax - {1} reduction.
    Net: you pay base cost + {3}.
    Reductions CAN reduce commander tax; the total simply can't go below {0}.

COMMANDER DAMAGE (CR 903.10a):
  If a single commander deals 21+ COMBAT damage to a player cumulatively, that player loses.
  "Combat damage" = damage dealt during the combat damage step.
    Deathtouch Commander: still tracks damage; if deathtouch kills a blocker, the damage to player is 0.
    Commander dealing damage via activated abilities or spells: NOT commander damage.
      "This creature deals 5 damage to any target" — that's ability damage, not combat damage.
      Only COMBAT DAMAGE during combat counts.
  SAME COMMANDER: the SPECIFIC object must be the same.
    Commander tax tracking is per-commander identity (the card).
    But for commander damage: if the commander is a different object (new cast after dying), is it the same?
    Yes: "same commander" means the same commander card, regardless of how many times it's been cast.
    The commander damage counter tracks the CARD, not the object instance.
  OPPONENTS GET 21 DAMAGE CHECK INDEPENDENTLY:
    Each player tracks separately how much combat damage YOUR commander has dealt them.
    In a 4-player game: Player A might take 20 commander damage from your commander without losing.
    Next hit: 21st combat damage from your commander → Player A loses.
    Players B and C: independent counters.
  LIFELINK AND COMMANDER DAMAGE:
    If your commander has lifelink and deals 21 combat damage: that opponent loses AND you gain 21 life.
    Both effects happen simultaneously.
  COMMANDER DAMAGE IS NOT LIFE LOSS:
    Gaining life doesn't prevent the damage from being marked as "commander damage."
    A player at 100 life who takes 21 commander damage still loses.
    Commander damage is an additional win condition independent of life totals.

PARTNER (CR 702.124):
  Multiple partner ability variants:
    "Partner": any two legendary creatures with "partner" can be your two commanders.
    "Partner with [Name]": only pairs with the specific named card.
    "Choose a Background": pairs with any legendary Background enchantment.
    "Doctor's companion": pairs with a Time Lord Doctor legendary creature.
    "Friends forever" / "Partner—[text]": specific group-based partnership.
  TWO COMMANDERS:
    Both go to command zone at game start.
    Both can be cast (each with their own tax counter — independent).
    Both in the 100-card count.
  COLOR IDENTITY OF TWO COMMANDERS (CR 702.124c):
    The combined color identity of BOTH commanders determines legal cards.
    Thrasios, Triton Hero ({2}{G}{U}) + Tymna the Weaver ({1}{W}{B}):
      Thrasios: green + blue. Tymna: white + black.
      Combined identity: WUBG — four colors.
      Can include any card with color identity subsetted by WUBG. No red.
    This makes four-color partner combinations very powerful for deckbuilding.
  TAX IS SEPARATE (CR 702.124d):
    Commander A cast 3 times: tax of +{4}.
    Commander B never cast: no tax.
    They're tracked INDEPENDENTLY.
  COMMANDER DAMAGE IS SEPARATE (CR 702.124d):
    21 damage from Commander A is tracked independently from Commander B.
    A player who took 15 from Commander A and 15 from Commander B hasn't lost (neither is at 21).
    The 21-damage threshold is per-commander.

UNDAUNTED (CR 702.125a):
  "This spell costs {1} less for each opponent you have."
  In Commander (4-player): 3 opponents → costs {3} less.
  Scales with multiplayer: Undaunted cards are much more efficient in Commander than 1v1.
  Ravos, Soultender has a tax and Undaunted creatures are harder to balance.
  Classic example: Curtains' Call ({7}{B}{B}): destroys two target creatures.
    With 3 opponents (Commander): costs {4}{B}{B} = 6 mana.
    Powerful Commander removal that scales with the format.

BACKGROUND (CR 702.124k):
  "Choose a Background" commanders: legendary creatures with this keyword.
  You may also designate a legendary Background enchantment as your second commander.
  Background enchantments are in the command zone with your first commander.
  When you cast the Background: it enters as an enchantment.
  It grants abilities to your "commander" (usually the commander creature).
  Combined color identity: Background's color identity + your commander's identity.
  Example: Sefris of the Hidden Ways + City on Fire (red Background):
    Sefris: {U}{B}{R}. City on Fire: {2}{R}{R}. Combined: {U}{B}{R} still (red is already there).
    Sefris benefits from City on Fire's "Spells you cast cost {R} less" ability.
```

## Definitive Conclusions

- **Commander goes to command zone instead of GY/exile as an SBA** — owner chooses at the time of the SBA check (graveyard/exile) or by replacement effect (hand/library).
- **Going to command zone instead of GY is NOT "dying"** — leaves-the-battlefield triggers fire, but not "dies" triggers.
- **Commander tax applies only when casting from command zone** — casting from other zones (hand, graveyard) has no tax.
- **Commander damage tracks the card, not the object** — same commander re-cast after dying still accumulates damage from prior instances.
- **Partner combines color identities but tracks tax and damage independently** — each commander in a partner pair has its own tax and its own commander damage counter.
- **21 commander damage is an additional loss condition** — independent of life totals; gaining life doesn't prevent commander damage loss.

## Canonical Example
**Atraxa Proliferate — Commander Tax Math:**
Commander: Atraxa, Praetors' Voice ({G}{W}{U}{B}).
Turn 3: cast Atraxa. No tax. Cost: {G}{W}{U}{B} = 4 mana (with appropriate sources).
Turn 5: opponent removes Atraxa (Go for the Throat). Owner puts her in command zone.
Turn 6: cast Atraxa again. Tax: +{2}. Cost now: {G}{W}{U}{B}{2} = 6 mana.
Turn 9: opponent exiles Atraxa (Swords to Plowshares). Owner puts her in command zone.
Turn 10: cast Atraxa a third time. Tax: +{4}. Cost now: {G}{W}{U}{B}{4} = 8 mana.
Note on Swords to Plowshares: "Exile target creature. Its controller gains life equal to its power."
Atraxa has power 4. You gain 4 life. But: Atraxa is going to EXILE.
Owner can put Atraxa in command zone instead of exile (CR 903.9a).
If command-zoned: Atraxa is NOT in exile. The "gain life" effect: it referenced Atraxa's power (already determined). You still gain 4 life (the effect uses last known information / the effect already captured the power value).
WAIT: actually Swords to Plowshares: "exile target creature" = a cost (targeting). The life gain is a replacement or triggered effect that checks power.
Actually, Swords to Plowshares is not a replacement effect — it simply exiles and gives life. The exile happens. Then you command-zone it instead (903.9a). Life gain: the text says "its controller gains life equal to its power." Since the creature went to command zone (not staying in exile), does life still apply? The SBA command-zone replacement fires after the spell has resolved. Swords resolved: Atraxa was put in exile as part of resolution. Then SBA: owner may put in command zone. Swords' life gain applies because the exile event happened.
RESULT: Atraxa goes to command zone. Owner gains life. Atraxa available to recast.

**Example 2 — Partner Commander Damage Tracking:**
Commander deck: Thrasios, Triton Hero (Partner) + Tymna the Weaver (Partner).
Game situation: You have been attacking opponent Alice for several turns.
Thrasios (2/3): has dealt 15 combat damage to Alice over the game.
Tymna (2/2): has dealt 10 combat damage to Alice over the game.
Total damage Alice has taken from your commanders: 25 combat damage.
But: neither individual commander has dealt 21 to Alice.
  Thrasios: 15 damage. Below 21.
  Tymna: 10 damage. Below 21.
Alice has NOT lost to commander damage.
CR 702.124d: commander damage tracked per-commander individually.
To win via commander damage: deal 6 more with Thrasios (reaches 21) OR deal 11 more with Tymna.
Alice is well aware and will prioritize blocking whichever is closer.
Meanwhile: Alice is at 35 life (she gained some).
SEPARATE WIN PATH: if you can get Thrasios to 6 more combat damage (with pump), she loses
  to Thrasios specifically, even though she has 35 life.
Commander damage win condition is SEPARATE from life total and is a legitimate path in Commander.
