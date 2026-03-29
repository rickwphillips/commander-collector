---
id: p451
name: Eminence, Battalion, and Raid — Commander-Zone Static, Multi-Attacker Trigger, and Attacked-This-Turn Ability Words
category: triggered
cr_refs: [207.2c, 702.71, 603.4, 700.4, 900.1, 606.3]
tags: eminence, battalion, raid, ability-word, command-zone, triggered, condition, attacked-this-turn, three-attackers
created: 2026-03-29
examples_count: 7
---

# P451 — Eminence, Battalion, and Raid — Commander-Zone Static, Multi-Attacker Trigger, and Attacked-This-Turn Ability Words

## Abstract

**Ability words** (CR 207.2c) are italicized flavor keywords that have no individual rules entries but group cards with similar mechanics. Three such ability words raise non-obvious rules questions: **Eminence** enables effects that function while a commander is *either* in the command zone or on the battlefield — a rare "two-zone" ability that applies even before the commander is cast; **Battalion** triggers "when this creature and at least two other creatures attack" — raising questions about when the count is locked in and how combat tricks interact; and **Raid** enables or triggers conditions based on "if you attacked with a creature this turn" — a "this turn" check with specific timing rules.

## The Definitive Rules

### Ability Words (CR 207.2c)
**CR 207.2c verbatim:** *"An ability word appears in italics at the beginning of some abilities. Ability words are similar to keywords in that they tie together cards that have similar functionality, but they have no special rules meaning and no individual entries in the Comprehensive Rules. The ability words are [list including] battalion, eminence, raid..."*

Ability words have NO special rules meaning. The actual mechanic is in the card's rules text. The ability word is purely a visual/flavor label.

### The Eminence Ability Pattern
Cards with Eminence have static or triggered abilities with text like:
*"As long as [Card Name] is your commander and in the command zone or on the battlefield, [effect]."*

Key rule: The command zone is a recognized game zone (CR 400.1). A commander in the command zone is still on the battlefield's "in play" zone — no. A commander in the command zone is in the command zone, NOT the battlefield. The eminence ability explicitly lists BOTH locations.

**CR 606.3** (Commander-specific rules): A player's commander is in the command zone until cast. While in the command zone, it's not on the battlefield and can't normally be targeted or affected by spells/abilities.

**CR 700.4** (On the battlefield): "On the battlefield" refers specifically to the battlefield zone.

### The Battalion Ability Pattern
Example text: *"Battalion — Whenever [this creature] and at least two other creatures attack, [effect]."*

This is a triggered ability (CR 603.2). The trigger condition is checked at the moment the attacking is declared (the declare attackers step). The relevant count is: does this creature plus at least two others = three or more total attackers?

**CR 508.1** (Declare Attackers): The active player declares all attacking creatures simultaneously. The triggering event (attacking as a group) is a single simultaneous event.

### The Raid Ability Pattern
Example text: *"Raid — [Effect] if you attacked with a creature this turn."*

This creates an intervening "if" condition (CR 603.4) or a static condition checked at a specific moment. The condition "attacked with a creature this turn" is true if any creature you controlled was declared as an attacker during any combat phase this turn that has already occurred.

## The Pattern

```
EMINENCE pattern:
[Card] is your commander.
  Case 1: Commander is in the command zone:
    → Eminence static ability IS ACTIVE
    → The commander is not on the battlefield, but the ability text covers both zones
  Case 2: Commander is on the battlefield:
    → Eminence static ability IS ACTIVE
    → Normal static ability applies
  Case 3: Commander is in exile, graveyard, hand, or library:
    → Eminence ability is NOT active (neither listed zone)
  Case 4: In non-Commander formats:
    → "Is your commander" is never true; Eminence abilities that require this condition never apply

BATTALION pattern:
As declare attackers step begins, players declare all attackers:
  → Check: does [battalion creature] attack AND are there ≥2 other attacking creatures?
  → If yes: triggered ability goes on stack (active player gets priority after attacks declared)
  → Creatures added to combat after (ninjutsu, special abilities) do NOT retroactively satisfy battalion
  → Creatures removed from combat after (effect removes attacker) do NOT retroactively un-satisfy it
    (the trigger already fired based on the state at declaration)

RAID pattern:
Check "if you attacked with a creature this turn":
  → True if any creature was declared as an attacker in any prior combat phase this turn
  → The condition checks attack declaration specifically — entering combat via other means (ninjutsu, sneak, myriad tokens) might not count depending on the card's text
  → In the same main phase after combat: attack declaration is complete, condition is true
  → Before combat this turn: condition is false
  → If the attacking creature died immediately after declaring, the condition is STILL true (the attack happened)
```

## Definitive Conclusions

**Eminence:**
- Eminence IS active while the commander is in the command zone, even at the start of the game before the commander is cast. This enables a "passive" commander effect across every turn, every phase.
- If an Eminence commander is somehow bounced or exiled, the ability is NOT active while it's in the wrong zone (hand, exile, graveyard, library). Only the command zone and battlefield qualify.
- In non-Commander formats (Standard, Legacy, etc.), a card with an Eminence ability just has a condition that is never true. The card functions normally as a card but the Eminence text is dead.
- Multiple commanders with Eminence (partner commanders, for example): each commander's Eminence applies independently based on where that specific commander is.
- Example: *The Ur-Dragon*'s Eminence ability (*"As long as The Ur-Dragon is in the command zone or on the battlefield, Dragon spells you cast cost {1} less"*) applies from the moment the game starts, even before The Ur-Dragon is cast. This is an unusual and powerful property of the Eminence ability word.

**Battalion:**
- Battalion is checked at the time of attack declaration. All attackers are declared simultaneously, so the "at least two other creatures attack" count is taken from the final set of declared attackers.
- A creature that was going to contribute to battalion but is removed before declaration (by something happening during the declare attackers step) will not have been declared as an attacker, so won't count.
- Creatures that enter attacking (ninjutsu, myriad tokens, equipment giving "enters attacking") are placed attacking AFTER blockers are declared — these creatures were NOT declared attackers in the normal sense. Battalion triggers in the declare attackers step, before blockers, so these creatures can't satisfy battalion retroactively.
- Multiple battalion creatures: each triggers its own battalion trigger independently if they each attack in the same combat along with two or more other creatures.

**Raid:**
- Raid checks whether you *attacked* this turn, which means a creature was declared as an attacker during a declare attackers step this turn that has already completed. The creature doesn't need to have dealt damage or survived.
- Extra combat phases (from Aggravated Assault, etc.) grant a second set of attack declarations. After a Raid-enabled spell is cast with a condition about "attacked this turn," subsequent extra combats don't retroactively un-satisfy it.
- Opponents can respond to your Raid spell before it resolves; the "attacked this turn" condition was met at the time of casting (unless it's an intervening-if clause also checked at resolution — card text varies).

## Canonical Examples

**Eminence:**
- *The Ur-Dragon*: Dragon spells cost {1} less as long as it's in the command zone or on the battlefield. A player running The Ur-Dragon as their Commander effectively gets a permanent mana discount from game start.
- *Arahbo, Roar of the World*: "Eminence — At the beginning of combat on your turn, if Arahbo, Roar of the World is in the command zone or on the battlefield, another target Cat you control gets +3/+3 until end of turn." This triggers at the beginning of each of your combat phases, even with Arahbo sitting in the command zone.

**Battalion:**
- *Firemane Avenger* (Gatecrash): "Battalion — Whenever Firemane Avenger and at least two other creatures attack, Firemane Avenger deals 3 damage to target creature or player and you gain 3 life." You attack with Firemane Avenger + three other creatures = battalion triggers. You attack with Firemane Avenger alone = no trigger.
- *Boros Elite* (Gatecrash): "Battalion — Whenever Boros Elite and at least two other creatures attack, Boros Elite gets +2/+2 until end of turn." Attack with Boros Elite + two others = it becomes 3/3.

**Raid:**
- *Wingcrafter* is a Raid-condition card that asks whether you attacked to enable a bonus ability.
- *Raiders' Spoils* (Khans of Tarkir): After attacking during main phase 2, raid is satisfied. Raid abilities on permanents are continuous checks; a raid static ability reads the current game state whenever it needs to apply.
- *Grim Haruspex* raid check: "Raid — If you attacked with a creature this turn, draw a card" — if you didn't attack, no draw.

## Commonly Confused With

- **P006** (Intervening If Clause) — Raid is often a condition checked once (at casting time or at the specified timing), not always a true intervening-if clause; card text varies
- **P014 / P293** (Commander Format Rules) — Commander zone is a real zone; Eminence works FROM the command zone by explicit card text, not due to any general rule about commanders affecting the game from there
- **P341** (Combat Phase Steps) — Battalion triggers during declare attackers, not at the beginning of combat; the distinction matters for ninjutsu
- **P343** (Summoning Sickness) — A creature with summoning sickness CAN be declared as an attacker if it has haste; if hasted creatures trigger battalion, that's fine
