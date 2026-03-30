---
id: p520
name: Mobilize (TDM) — Attacking Warrior Tokens, Not-Declared Trigger Trap, End-Step Sacrifice, and Multiplayer Attack Choice
category: combat
cr_refs: [508.3, 603.2c, 700.4, 507.1, 710.4]
tags: [mobilize, ability-word, warrior-token, attacking, not-declared, trigger-suppression, end-step-sacrifice, multiplayer, tarkir-dragonstorm, TDM, mardu]
created: 2026-03-30
examples_count: 4
---

# P520 — Mobilize (TDM) — Attacking Warrior Tokens, Not-Declared Trigger Trap, End-Step Sacrifice, and Multiplayer Attack Choice

## Abstract
**Mobilize N** (Tarkir: Dragonstorm, 2025) is a triggered ability: "Whenever [this creature] attacks, create N tapped and attacking 1/1 red Warrior creature tokens. Sacrifice them at the beginning of the next end step." The tokens enter as **attacking** creatures, but they were **never declared as attackers** — this means abilities that say "whenever a creature attacks" or "whenever a creature is declared as an attacker" do **not** trigger from Mobilize tokens entering. They participate in the current attack as blockers choose them and they deal/receive combat damage — but they didn't "attack" in the trigger sense. After combat, they survive until the **next end step** (not the current end step), then are sacrificed. In multiplayer, each Warrior token can attack a different player, planeswalker, or battle.

## The Definitive Rules

**Official Ruling (2025-04-04):** *"You choose the player, planeswalker, or battle each Warrior token is attacking. They don't all have to attack the same one, and they don't have to attack the same player, planeswalker, or battle as the creature with mobilize."*

**Official Ruling (2025-04-04):** *"Although the Warrior tokens enter as attacking creatures, they were never declared as attacking creatures. Abilities that trigger whenever a creature attacks won't trigger when the tokens enter attacking."*

**CR 508.3:** *"A permanent that enters the battlefield attacking isn't declared as an attacker; it is simply placed in the attacking state."*

**CR 700.4 (Tapped and attacking):** Tokens placed in the attacking state are attacking creatures for the purposes of blocking, combat damage, and "while attacking" checks — but not for "whenever a creature attacks" triggers.

## The Pattern

```
MOBILIZE N STRUCTURE:

  "Mobilize N (Whenever this creature attacks, create N tapped and attacking 1/1 red
    Warrior creature tokens. Sacrifice them at the beginning of the next end step.)"

  N is fixed at declaration: Mobilize 1, Mobilize 2, Mobilize 3.
  Special case: Avenger of the Fallen uses "Mobilize X, where X is the number of creature
    cards in your graveyard" — X is determined when the trigger resolves.

TRIGGER TIMING:

  The Mobilize trigger fires when the Mobilize creature is declared as an attacker.
  The trigger resolves... during the declare-attackers step? Or after?
  Standard trigger timing: goes on stack after declare-attackers is complete.
  Tokens enter after the trigger resolves during the declare-attackers step.
  Result: Warrior tokens are in the attack for that combat, attacking the chosen targets.

NOT-DECLARED TRIGGER TRAP:

  "Whenever a creature attacks" = triggers when a creature is DECLARED as an attacker.
  Mobilize tokens ENTER as attacking creatures — they were never declared.
  → Exert abilities ("this creature exerts whenever it attacks") don't trigger.
  → "Whenever [creature] attacks, [creature] gets +2/+2" doesn't apply to tokens.
  → "Whenever a creature you control attacks, draw a card" does NOT fire for Warrior tokens.
  → Furious Charge ({R}: "whenever a creature you control attacks, it gets +1/+0 until EOT"):
    Does NOT apply to Warrior tokens (they enter attacking, not declared attacking).
  → Ninjutsu: the tokens are "attacking" — but ninjutsu requires "unblocked attacker."
    If a Warrior token is unblocked, it IS an attacking creature, so ninjutsu COULD apply.
    But the token isn't declared as an attacker — ninjutsu doesn't require "declared," just
    "attacking." So ninjutsu CAN be applied to a Mobilize token that is unblocked.

WHAT THE TOKENS ARE:
  - Tapped and attacking: they are attacking
  - 1/1 red Warrior tokens: creature type Warrior, color red
  - They can be blocked, deal combat damage, receive combat damage
  - "While attacking" abilities apply to them
  - First/double strike applies to them normally
  - They survive until "the beginning of the NEXT end step"

"NEXT END STEP" — NOT THE CURRENT ONE:

  CRITICAL: "Sacrifice them at the beginning of the NEXT end step."
  The current combat's end step: tokens are NOT sacrificed here.
  They survive through:
    - End of combat
    - Postcombat main phase
    - End step of the CURRENT TURN (they survive this)
    - Wait: "next" end step means the end step AFTER they were created.
    If created during the attack, they survive until the NEXT player's end step.
    In a 2-player game: your turn's end step is the next end step after creation.
    But "the beginning of the next end step" triggers at the start of that step.

  CLARIFICATION on timing:
    Tokens created during YOUR declare-attackers step.
    "Next end step" = the very next end step that occurs, which is YOUR OWN end step.
    The tokens survive the combat itself and the entire postcombat main phase.
    They are sacrificed at the beginning of your end step (the same turn).

    In extra combat scenarios (Aggravated Assault): if extra combat is triggered during
    your postcombat main phase, and you have tokens from an earlier Mobilize in that turn,
    those tokens are still alive (they haven't reached an end step yet). They can attack
    again in the extra combat — but they still die at your end step.

MULTIPLAYER ATTACK CHOICES:

  In Commander or multiplayer games:
  Each Warrior token can attack a different legal defending player/planeswalker/battle.
  They don't have to follow the Mobilize creature's chosen defender.
  Example: You control Bone-Cairn Butcher (Mobilize 2) and attack Player A.
    The 2 Warrior tokens can: both attack Player A, both attack Player B, or split (1A, 1B).
    Your choice when the trigger resolves (as you place the tokens in the attack).

MOBILIZE + "WHENEVER [THIS CREATURE] ATTACKS" CHAIN:

  The Mobilize creature's own "whenever it attacks" trigger fires (Mobilize is that trigger).
  But the tokens don't fire their own Mobilize (they don't have Mobilize).
  And the tokens don't trigger other "whenever attacks" abilities on other permanents.
  Exception: if a token has a "whenever this creature attacks" ability (from an enchantment
    or equipment that gives the token the ability), and it was DECLARED as an attacker...
    Mobilize tokens are never declared, so even equipment-granted "whenever attacks"
    abilities don't fire from Mobilize tokens. They enter attacking, but weren't declared.

MOBILIZE X (AVENGER OF THE FALLEN):

  Avenger of the Fallen ({2}{B}: 2/4 Deathtouch):
    "Mobilize X, where X is the number of creature cards in your graveyard."
  X is determined when the trigger resolves (standard variable X in trigger).
  If your GY has 0 creature cards: X = 0, no tokens created.
  If your GY has 5 creature cards: create 5 attacking 1/1 red Warriors.
  The GY count is evaluated at resolution — not at the time the trigger fired.

MOBILIZE + DOUBLING SEASON / ANOINTED PROCESSION:

  Token doublers apply to Mobilize token creation.
  Doubling Season out + Mobilize 2 → create 4 Warrior tokens.
  Anointed Procession out + Mobilize 3 → create 6 Warrior tokens.
  All tokens enter tapped and attacking.
  All tokens are sacrificed at the next end step.

MOBILIZE + DEATHTOUCH (BONE-CAIRN BUTCHER):

  Bone-Cairn Butcher ({1}{R}{W}{B}: 4/4; Mobilize 2):
    "Attacking tokens you control have deathtouch."
  The Warrior tokens enter attacking → they immediately have deathtouch (from Butcher's static).
  Two 1/1 deathtouch attackers. Any creature they deal 1 damage to dies (SBA).
  This makes Mobilize tokens punch far above their weight for killing blockers.
```

## Definitive Conclusions

- **Mobilize tokens enter as attacking creatures but were never declared** — "whenever a creature attacks" triggers do not fire for Mobilize tokens entering; they participate in combat but skip the declaration trigger.
- **Tokens are sacrificed at the beginning of the NEXT end step** — they survive the entire current turn's combat and main phase, dying at your own end step of that turn.
- **In multiplayer, each Warrior token can attack a different player/planeswalker/battle** — they are individually assignable, not locked to the same target as the Mobilize creature.
- **Mobilize X (Avenger of the Fallen) evaluates X at trigger resolution** — the graveyard count at resolution determines the token count, not at the time of attack declaration.
- **Token doublers work with Mobilize** — Doubling Season/Anointed Procession double the token creation; all tokens still enter attacking and die at the next end step.
- **Static abilities affecting "attacking tokens" (Bone-Cairn Butcher) apply immediately** — the tokens enter in the attacking state and receive deathtouch (or similar bonuses) from static effects before combat damage is assigned.

## Canonical Example

**Dragonback Lancer + Ninjutsu:**

You control Dragonback Lancer ({3}{W}: 3/3 Flying; Mobilize 1). It attacks. Mobilize trigger fires: create a 1/1 red Warrior token, tapped and attacking.

The Warrior token is attacking and unblocked. You have a Ninja in hand with ninjutsu.

Can you ninjutsu? Ninjutsu requires an "unblocked attacker." The Warrior token is attacking and unblocked. Even though it wasn't declared as an attacker, it IS an attacking creature and it IS unblocked. Ninjutsu can be applied to it. You return the Warrior token to your hand... wait, tokens can't be put in hand (they cease to exist). Ninjutsu requires returning the attacker to hand. Tokens cannot go to hand — they cease to exist if they would go to a non-battlefield zone. This is a rules complication: the token would cease to exist when returned to hand via ninjutsu, so ninjutsu would technically work (the token ceases, the ninja enters) — but the token wasn't generating value in hand anyway.

**Example 2 — Bone-Cairn Butcher Deathtouch Blitz:**

You control Bone-Cairn Butcher ({1}{R}{W}{B}: 4/4; Mobilize 2; "Attacking tokens you control have deathtouch"). It attacks. Mobilize 2 creates two 1/1 Warrior tokens, tapped and attacking.

Immediately: Bone-Cairn Butcher's static ability grants deathtouch to both attacking tokens. Two 1/1 deathtouch creatures are now attacking. The opponent must block with two creatures to absorb them (or lose both blockers to 1 damage each). The tokens die at your next end step regardless — but they trade for blockers first.

**Example 3 — Avenger of the Fallen with Full Graveyard:**

You control Avenger of the Fallen ({2}{B}: 2/4 Deathtouch). Your graveyard has 6 creature cards. Avenger attacks. Mobilize X trigger fires. X = number of creature cards in GY at resolution = 6. Six 1/1 red Warrior tokens enter tapped and attacking. Each can attack a different player.

In Commander (4 players): distribute as 2 tokens attacking Player A, 2 attacking Player B, 2 attacking Player C. Avenger itself attacks Player D. The game board is under fire from all directions.

**Example 4 — Not-Declared Trap:**

You control Stadium Headliner ({R}: 1/1; Mobilize 1) and Glorious Anthem ({2}{W}: "creatures you control get +1/+1"). The Anthem doesn't help here — it affects all your creatures.

You also control Gideon Jura (hypothetical "whenever a creature attacks, tap it"). Headliner attacks. Mobilize trigger fires: 1/1 Warrior token enters attacking. Does Gideon's hypothetical trigger fire for the token? NO — the token was never declared as an attacker; it entered attacking. Gideon's trigger would not fire.

## Commonly Confused With
- **P510 (Extra Combat Phases)** — P510 covers how multiple combat phases work. P520 covers Mobilize tokens within a single combat. Tokens from Mobilize survive to the next end step — in an extra combat scenario, they would still be alive for that extra combat too.
- **P028 (Simultaneous ETB)** — Mobilize tokens all enter simultaneously (all N tokens enter at once). Simultaneous ETB rules apply to them collectively.
- **P517 (Job Select — Hero Token)** — Job Select creates tokens then attaches Equipment; those tokens are not attacking. Mobilize creates tokens that enter attacking. Different entry states.
- **P195 (Warp/Station — EOE mechanics)** — Station charge counters and Mobilize tokens both represent "deploy and expend" patterns but through completely different mechanics.
