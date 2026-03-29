---
id: p162
name: Myriad — Create Tokens Attacking Each Other Opponent
category: combat
cr_refs: [702.116a, 702.116b]
tags: [myriad, token, copy, opponent, attacking, multiplayer, Commander, exile-end-combat, Blade-of-Selves]
created: 2026-03-28
examples_count: 2
---

# P162 — Myriad — Create Tokens Attacking Each Other Opponent

## Abstract
Myriad triggers when a creature attacks in multiplayer. For each opponent other than the defending player, you may create a tapped-and-attacking token that's a copy of the myriad creature, attacking that opponent (or a planeswalker/battle they control). These tokens are exiled at the end of combat. In a 4-player Commander game, attacking one player with a myriad creature can create 2 token copies attacking the other 2 opponents. ETB triggers don't fire for tokens created this way (they enter as copies already in attack position, but ETB still fires — actually ETB does trigger since they enter the battlefield), but crucially, "whenever this creature attacks" triggers fire for each token separately.

## The Definitive Rules

**CR 702.116a** (verbatim): *"Myriad is a triggered ability that may also create a delayed triggered ability. 'Myriad' means 'Whenever this creature attacks, for each opponent other than defending player, you may create a token that's a copy of this creature that's tapped and attacking that player or a planeswalker they control. If one or more tokens are created this way, exile the tokens at end of combat.'"*

**CR 702.116b** (verbatim): *"If a creature has multiple instances of myriad, each triggers separately."*

## The Pattern

```
MYRIAD:
  Triggered: when this creature attacks
  Effect: for each OTHER opponent (not the defending player), create one copy token, tapped and attacking
  Optional: "you may" create each token
  End-of-combat cleanup: exile all myriad tokens at end of combat

  MYRIAD + MULTIPLAYER:
    In Commander (4 players): attacking player A with myriad creature
    Myriad creates tokens attacking player B, player C (the 2 OTHER opponents)
    Original creature attacks player A; tokens attack B and C simultaneously

  MYRIAD + ETB TRIGGERS:
    Tokens created by myriad enter the battlefield (they're put into play tapped and attacking)
    ETB triggers on the token's card DO fire → each token ETB fires
    A myriad creature with "when this enters, draw a card": each myriad token draws you a card
    In Commander 4-player: 3 total copies (1 original + 2 tokens) → 3 ETB triggers

  MYRIAD + ATTACK TRIGGERS:
    Each token is attacking → "whenever this creature attacks" triggers fire for each
    Original creature: attacks → triggers
    Each token: attacking (enters attacking) → triggers
    Wait: tokens ENTER tapped and attacking — they didn't "become an attacker" through declare attackers
    Do attack triggers fire for myriad tokens?
    Rule: tokens enter attacking (they are attacking when they enter) — the "declare attackers" event doesn't happen for them
    "Whenever this creature attacks" specifically triggers during declare attackers step
    Myriad tokens: entered already attacking, NOT declared in the declare attackers step
    → Attack triggers (like battle cry, exalted) MAY NOT trigger for myriad tokens
    But: the myriad ability itself triggers from the original creature's attack

  MYRIAD + COMMANDER DAMAGE:
    Myriad tokens count for combat damage
    A 21/21 myriad creature: original attacks player A (commander damage), tokens attack B and C
    But tokens are not commanders → no commander damage tracking for tokens
    (The original commander still counts for commander damage to the player it attacks)

  MYRIAD + LIFELINK:
    Myriad tokens deal combat damage → if they have lifelink, you gain life from each token's damage
    In Commander: 3 creatures with lifelink dealing combat damage → 3× life gain

  MYRIAD + LEAVES COMBAT:
    "Exile at end of combat" — delayed trigger
    If tokens die before end of combat: they're already exiled/dead → no need to exile again
    If tokens somehow leave the attacking state: the delayed trigger still tries to exile them at end of combat

  MYRIAD 2-PLAYER:
    In 1v1: myriad triggers but there are NO opponents other than the defending player
    "For each opponent other than defending player": zero opponents qualify
    Myriad does nothing in 1v1 games
    Blade of Selves in Commander only → useless in 1v1

MYRIAD CARDS:
  Blade of Selves (Equipment — equipped creature has myriad): the signature card
  Myriad Landscape: land that fetches basic lands, NOT related to the myriad keyword
  Several creatures in C15/Commander sets have myriad
```

## Definitive Conclusions

- **Myriad creates tokens attacking OTHER opponents** (not the one being attacked).
- **Tokens are exiled at end of combat** — temporary creatures.
- **ETB triggers fire** for myriad tokens — powerful with ETB-heavy creatures.
- **Useless in 1v1** — no other opponents to create tokens for.
- **Blade of Selves** is the premier myriad equipment for Commander.

## Canonical Example
**Blade of Selves (Equipment, Equipped creature has myriad):**
Equip to Wurmcoil Engine (6/6, lifelink, deathtouch, ETB: two 3/3 tokens when it dies).
In 4-player Commander: attack Player A → Myriad triggers → create tokens attacking Players B and C.
Each token is a copy of Wurmcoil Engine → ETB: "When Wurmcoil Engine enters" — each token ETBs → not applicable (ETB is at entry, but these tokens enter as copies)... Let me reconsider.
Actually: "Create a token that's a copy of this creature that's tapped and attacking" — the token enters the battlefield → ETB triggers DO fire.
So: Wurmcoil Engine enters → myriad creates 2 more Wurmcoil tokens → each Wurmcoil token ETB fires if applicable.
Wurmcoil Engine's ETB (the token creation from DYING) doesn't apply here. But if Wurmcoil had an "enters" ETB instead of a "dies" one, it would fire.

**Example 2 — Myriad + Combat Damage:**
3-player game. You control Myriad creature (4/4 double strike).
Attack Player A (has 15 life). Myriad creates token attacking Player B (20 life).
Both deal double strike damage: A takes 8, B takes 8.
Both creatures exile at end of combat. You hit both opponents simultaneously.

## Commonly Confused With
- **P036 (Storm)** — Storm copies a spell for each previous spell. Myriad creates creature token copies in combat.
- **P140 (Demonstrate)** — Demonstrate creates copies of spells with opponent getting one. Myriad creates attacking creature tokens.
- **P160 (Annihilator)** — Annihilator forces sacrifice. Myriad creates tokens to attack. Both are multiplayer-scaling combat abilities.
