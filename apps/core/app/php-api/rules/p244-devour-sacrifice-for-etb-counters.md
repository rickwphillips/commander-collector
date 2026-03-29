---
id: p244
name: Devour — Sacrifice Creatures on Entry for +1/+1 Counters
category: costs
cr_refs: [702.82a, 702.82b, 702.82c]
tags: [devour, sacrifice, +1/+1-counters, ETB-replacement, Shards-of-Alara, Jund, Dragon-Broodmother, Predator-Dragon, Mycoloth]
created: 2026-03-28
examples_count: 2
---

# P244 — Devour — Sacrifice Creatures on Entry for +1/+1 Counters

## Abstract
Devour N is a static ability that functions as the permanent enters the battlefield: you may sacrifice any number of creatures, and the permanent enters with N +1/+1 counters per creature sacrificed. This is an "enters with" replacement effect — you decide how much to sacrifice when the permanent enters. Devour turns your smaller creatures into a larger threat: feeding tokens, 1/1s, or even valuable creatures into a Devour creature to make it enormous. Some Devour cards have additional abilities that care about how many creatures were devoured. Jund (black-red-green in Shards of Alara) featured Devour heavily, representing the predatory food-chain theme.

## The Definitive Rules

**CR 702.82a** (verbatim): *"Devour is a static ability. 'Devour N' means 'As this object enters, you may sacrifice any number of creatures. This permanent enters with N +1/+1 counters on it for each creature sacrificed this way.'"*

**CR 702.82b** (verbatim): *"Some objects have abilities that refer to the number of creatures the permanent devoured. 'It devoured' means 'sacrificed as a result of its devour ability as it entered the battlefield.'"*

**CR 702.82c** (verbatim): *"Devour [quality] is a variant of devour. 'Devour [quality] N' means 'As this object enters, you may sacrifice any number of [quality] permanents. This permanent enters with N +1/+1 counters on it for each permanent sacrificed this way.'"*

## The Pattern

```
DEVOUR:
  Static ability: functions AS the permanent enters (not a triggered ability)
  Choice: may sacrifice any number of creatures (0 to all you control)
  Result: N +1/+1 counters per sacrificed creature
  Devour 2: sacrifice 5 creatures → enter with 10 +1/+1 counters

DEVOUR + ETB REPLACEMENT:
  Since it's a static ability ("as this enters"), it's an ETB replacement effect
  The permanent enters in its devoured state — with counters already on it
  Not: enters then gains counters (no window for opponents to respond to the sacrifice + counters separately)
  The creatures are sacrificed and the counters are placed as part of the same ETB event

DEVOUR + WHAT CAN BE SACRIFICED:
  Devour N (basic): sacrifice CREATURES (any creatures you control)
  Devour [quality] N: only sacrifice [quality] permanents
  Example: Devour Dragon 2: only sacrifice Dragons
  You can sacrifice the Devour creature ITSELF? No — it's entering, not yet on battlefield
  The creature you can sacrifice are those already on the battlefield BEFORE the Devour creature enters

DEVOUR + ZERO SACRIFICE:
  You MAY sacrifice — it's optional
  Choose to sacrifice 0: Devour creature enters with 0 counters (its printed P/T)
  Useful when you don't want to sacrifice your creatures

DEVOUR + TOKENS:
  Token creatures can be sacrificed to Devour: great synergy
  Generate tokens (Saprolings, Goblins, etc.) then Devour them all into one enormous creature
  Dragon Broodmother creates tokens each turn: feed old tokens to Devour creatures, keep fresh tokens
  Mycoloth ({3}{G}{G}): "Devour 2 — at each of your upkeeps, create N 1/1 green Saproling tokens, where N is the number of +1/+1 counters on Mycoloth."
    Sacrifice 5 Saprolings: Mycoloth enters with 10 counters → creates 10 Saprolings per upkeep!
    Exponential: 10 Saprolings created → sacrifice some next Devour → even more counters

DEVOUR CARDS (Jund — Shards of Alara):
  Predator Dragon ({4}{R}{R}): 4/4 Flying Haste, Devour 2.
    Sacrifice 4 creatures → 4×2 = 8 counters → 12/12 flying haste.
    Sacrificing 4 1/1 goblins: net power trade.
    With goblin token generation (Goblin Assault, etc.): massive dragon each turn.

  Caldera Hellion ({3}{R}{R}): 3/3, Devour 1, "when enters, deals 3 damage to each creature."
    Devour your own 1/1s → they're already gone before the 3 damage sweep → dodge your own board wipe!
    Enters: sweeps opponent's small creatures. Your devoured creatures are already in the sacrifice zone.
    Classic: sacrifice your board to Devour, make Caldera huge, sweep opponents remaining creatures.

  Dragon Broodmother ({2}{R}{R}{G}{G}): 4/4 Flying, "at beginning of each upkeep, create a 1/1 red and green Dragon token with flying and Devour 2."
    Each upkeep: create a Dragon token that can devour 2 creatures each for 2 counters.
    Feed older, smaller Dragon tokens to the newest Dragon token: exponential Dragon growth.

  Gluttonous Slime ({2}{G}): 2/2, Devour 1, Flash.
    Flash + Devour: cast at instant speed in response to opponents' removal → eat some of your own creatures as they'd die anyway, enter as a larger creature instead.

DEVOUR + FLASH INTERACTION:
  Flash creatures with Devour can be cast in response to sweepers
  "Your board wipe will kill my creatures → I'll sacrifice them to my Devour creature first"
  Then enter with huge counters AND dodge the wipe (Devour creature was just cast)
  Wait: if a board wipe resolves and then the Devour creature is still being cast:
    Gluttonous Slime (flash) can be cast in response to the wipe
    Before the wipe resolves: sacrifice your creatures to Devour
    Wipe resolves: no creatures left to destroy (they were sacrificed). Slime enters.
    Actually: the Slime is on the stack, creatures sacrifice as it enters (replacing the ETB)
    But the wipe is on the stack... needs precise ordering
    Simplest: cast flash Devour creature, choose creatures to sacrifice. Then let wipe resolve.

DEVOUR + "IT DEVOURED":
  Some cards check "how many creatures this devoured" for additional effects
  Dragon Broodmother Dragon tokens: Devour 2 with no specific ability referencing devoured count
  Skullmulcher ({4}{G}): "Devour 1 — when enters, draw a card for each creature it devoured."
    Sacrifice 5: enter with 5 counters AND draw 5 cards. Devour for card advantage!
```

## Definitive Conclusions

- **Devour N sacrifices creatures as the permanent enters** — N +1/+1 counters per sacrifice.
- **Sacrifice is optional** — you choose how many (0 to all) to feed to the Devour permanent.
- **ETB replacement**: creatures sacrificed before the permanent "fully enters" — no response window between sacrifice and counters.
- **Token synergy**: generate tokens, then devour them for outsized threats.
- **Caldera Hellion trick**: devour your board to dodge your own sweeper effect.

## Canonical Example
**Predator Dragon Combo in Shards of Alara Standard:**
Battlefield: 6 Goblin tokens (1/1 each) from Goblin Assault and Horde of Notions.
Cast Predator Dragon ({4}{R}{R}): choose to Devour 2.
Sacrifice all 6 Goblin tokens: Predator Dragon enters with 6×2 = 12 +1/+1 counters.
Predator Dragon is a 16/16 Flying Haste. Attack immediately for 16 damage.
The opponent has no answer for a 16/16 haste flier that appeared from sacrificing trash tokens.
This is the Jund "build tokens, Devour all, swing" one-shot plan.

**Example 2 — Mycoloth Token Engine:**
Cast Mycoloth ({3}{G}{G}) with 4 Saproling tokens on the battlefield.
Devour 2: sacrifice all 4 Saprolings → Mycoloth enters with 4×2 = 8 counters → becomes 13/13.
Each upkeep: create 8 Saproling tokens (1/1 green).
Turn 2: 8 Saprolings available. Can sacrifice some to another Devour creature (or keep).
Keep 8 Saprolings: next Mycoloth? Cast with Devour 8 Saprolings → 8×2 = 16 counters.
Or: attack with 8 Saprolings (8 total power spread) + 13/13 Mycoloth.
Mycoloth is the exponential token engine: sacrifice tokens → create more → sacrifice more next cycle.

## Commonly Confused With
- **P218 (Modular)** — Modular also puts counters on entry but they transfer on death; Devour adds counters by sacrificing other creatures.
- **P239 (Convoke)** — Convoke taps creatures to pay mana; Devour sacrifices creatures for ETB counters (creatures consumed permanently).
- **P220 (Ward)** — Unrelated; Ward is a targeting protection. Commonly confused: Devour is sometimes confused with "sacrifice as an additional cost to cast" but it's actually an ETB replacement.
