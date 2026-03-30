---
id: p208
name: Commander Zone — Command Zone, Tax, and Commander Damage
category: multiplayer
cr_refs: [903.1, 903.3, 903.9, 903.10, 903.10a, 903.10b, 903.16]
tags: [commander, command-zone, commander-tax, commander-damage, 21-damage, multiplayer, EDH, companion]
created: 2026-03-28
examples_count: 2
---

# P208 — Commander Zone — Command Zone, Tax, and Commander Damage

## Abstract
In Commander (EDH), each player's designated commander starts in the command zone. From the command zone, commanders can be cast at any time they would normally be legal to cast — but each time they're cast after the first, their cost increases by {2} (the "commander tax"). When a commander would go to the graveyard or exile, its controller may choose to move it to the command zone instead (a replacement effect). Separately, a player loses the game if they've been dealt 21 or more combat damage from a single commander (commander damage tracks per-commander). These rules make commanders simultaneously resilient (recursive via command zone) and threatening (21-damage win condition).

## The Definitive Rules

**CR 903.9** (verbatim): *"Once the starting player has been determined, each player sets their starting hand. Then, in APNAP order, each player puts their commander from their hand into the command zone."*

**CR 903.10a** (verbatim): *"If a commander is in a graveyard or in exile and that card was put into that zone since the last time state-based actions were checked, its owner may put it into the command zone. This is a state-based action. See rule 704."*

**CR 903.10b** (verbatim): *"If a commander would be put into its owner's hand or library from anywhere, its owner may put it into the command zone instead. This replacement effect may apply more than once to the same event."*

**CR 903.16** (verbatim): *"If a player has been dealt 21 or more combat damage by the same commander over the course of the game, that player loses the game. (This is a state-based action. See rule 704.)"*

## The Pattern

```
COMMAND ZONE RULES:
  Commanders start in command zone before game begins
  Cast from command zone: pay commander's mana cost + {2} × (times cast previously)
  First cast: normal cost
  Second cast: normal cost + {2}
  Third cast: normal cost + {4}
  N-th cast: normal cost + {2 × (N-1)}
  Tax stacks with each casting (not each death)

COMMANDER ZONE REPLACEMENT:
  Two opportunities to send commander to command zone:
  1. Graveyard or exile: SBA after the event — owner "may" move it (rule 903.10a)
  2. Hand or library: replacement effect — owner "may" choose command zone instead (rule 903.10b)
  Both are the owner's CHOICE: can let it stay in graveyard (for escape, flashback, etc.)
  Most players return to command zone unless graveyard interaction is planned

COMMANDER TAX TRACKING:
  Tax is based on number of TIMES CAST from command zone
  NOT number of times died (other ways to replay don't add tax)
  If reanimated from graveyard (not cast from command zone): no tax for that casting
  If stolen by opponent and they cast it: that might not add to YOUR commander tax?
  Generally: the tax tracks castings from command zone only

COMMANDER DAMAGE:
  21 combat damage from a SINGLE commander = lose the game
  Each player tracks 21-damage threshold separately per opponent's commander
  In 4-player game: 3 separate commander damage trackers (one per opponent's commander)
  Commander damage is COMBAT DAMAGE only (not spell damage, ability damage)
  If commander deals 21 combat damage to a player over multiple combats: that player loses
  Gaining life doesn't reset commander damage (damage tracks differently from life total)
  Commander changing zones: the damage dealt by that commander still counts
  Even if commander was stolen and attacked with: the commander's "tracked damage" accumulates

COMMANDER + POISON / INFECT:
  A Commander with infect: combat damage to a player = poison counters (not life loss)
  Does this trigger commander damage? The infect damage IS commander damage (dealt in combat)
  A player hit by an infect commander: both poison counters AND commander damage track
  Typically: infect wins via 10 poison counters before 21 commander damage

COMMANDER + BLINK:
  Blinking a commander (exile + return): it re-enters as a NEW OBJECT
  But: it's still the same commander (game identifies commanders specially)
  Commander damage still accumulates across zone changes for the same commander
  The "21 damage" tracks the commander, not the specific object instance

COMMANDER DAMAGE + MULTIPLE COMBAT DAMAGE:
  Voltron strategy: buff the commander with equipment, enchantments
  Deal 21 commander damage over 3 turns: 7 + 7 + 7 (with Divinity Counter, etc.)
  Infect commander: need only 10 poison from combat damage
  Protection from commander damage: rarely possible (protection from a specific card? unusual)

PARTNERS:
  Two commanders: "Partner" keyword on both → can both go in command zone
  Commander damage tracks per commander: two separate thresholds of 21 each
  Tax: each commander cast tracks its own tax separately
```

## Definitive Conclusions

- **Commander tax**: +{2} for each time the commander has been cast from the command zone.
- **Command zone choice**: owner may redirect commander from graveyard/exile/hand/library to command zone.
- **Commander damage**: 21 combat damage from a single commander = lose (even if life total is fine).
- **Blink/zone changes**: commander damage accumulates across all zone changes.
- **Tax tracks command zone casts**, not deaths — reanimating from graveyard avoids tax.
- **Drannith Magistrate stops commanders from being cast from the command zone.** The command zone is "not the hand." Drannith's oracle says "Your opponents can't cast spells from anywhere other than their hands." The command zone is a separate zone. Drannith blocks flashback, escape, cycling cast, cascade, adventure return, and command zone casting equally. (Drannith ruling 2020-04-17: "If an effect says that an opponent may cast a spell from anywhere other than their hand, Drannith Magistrate's restriction overrules that permission.") Note: Drannith does NOT stop ninjutsu, Sneak Attack, Reanimation, or any other effect that PUTS a permanent onto the battlefield rather than CASTING it.
- **Commander damage tracking continues even if life doesn't change.** Under Platinum Emperion ("your life total can't change"), damage dealt by commanders still counts toward the 21-commander-damage threshold, even though it doesn't reduce your life total. If a commander deals 21 cumulative combat damage to a player with Platinum Emperion, that player still loses the game from the commander damage SBA (703.4/904.16). (Gatherer ruling 2018-12-07: "In a Commander game, the damage dealt to you by commanders will still be counted, even if that damage doesn't cause you to lose life.")
- **Commander ninjutsu does NOT count as casting the commander** — no commander tax is paid, and it does not increase the commander tax for future casts. Yuriko ruling (2020-11-10): "Activating Yuriko's commander ninjutsu ability isn't the same as casting Yuriko as a spell. You won't have to pay the commander tax to activate that ability, and activating that ability won't increase the commander tax to pay later." This applies to any commander with commander ninjutsu.

## Canonical Example
**Atraxa, Praetors' Voice commander (Toxic Commander deck):**
Player A controls Atraxa (Commander, infect). Attacks Player B.
Turn 1: Atraxa deals 4 infect combat damage → Player B has 4 poison counters + 4 commander damage.
Turn 2: Atraxa attacks again for 4 → Player B has 8 poison counters + 8 commander damage.
Turn 3: Atraxa attacks for 4 → Player B has 10 poison counters → Player B LOSES (10 poison).
The commander damage (12 total) wasn't the winning condition here — poison was faster.

**Example 2 — Commander Tax Escalation:**
Rafiq of the Many (commander). Player casts Rafiq: {1}{G}{W}{U} (4 mana).
Rafiq is killed.
Cast again from command zone: {1}{G}{W}{U} + {2} = 6 mana total.
Killed again.
Cast again: 8 mana total.
After 4 casts: {1}{G}{W}{U} + {6} = 10 mana.
Strategic: opponents kill Rafiq repeatedly to tax it into being uncastable.
Counter-strategy: reanimate Rafiq from graveyard instead (avoid the tax).

## Commonly Confused With
- **P169 (Companion)** — Companion has a deckbuilding restriction and a {3} cost to move from sideboard to hand once. Separate from commander zone rules.
- **P024 (Zone Change Object Identity)** — Zone changes make new objects in most cases, but commander damage tracks the commander across zone changes (special rule).
- **P208 vs Poison (P159/P179)** — Commander damage and poison are separate win conditions that can both apply to the same player.
