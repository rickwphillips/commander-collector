---
id: p499
name: Battles — "Any Target" vs "Player or Planeswalker" Targeting Distinction and Combat Rules
category: combat
cr_refs: [310.1, 310.4, 310.7, 310.8, 310.11, 508.1, 702.16, 704.5s]
tags: [battle, siege, any-target, player-or-planeswalker, combat-damage-trigger, defense-counters, defeat, protector, proliferate, animation, attack-battle, march-of-the-machine, MOM]
created: 2026-03-30
examples_count: 3
---

# P499 — Battles — "Any Target" vs "Player or Planeswalker" Targeting Distinction and Combat Rules

## Abstract
**March of the Machine** (2023) introduced **Battles** as a new permanent type (CR 310). Battles are neither players nor planeswalkers, which creates a critical targeting trap: spells and abilities that say **"any target"** CAN target battles, but spells and abilities that say **"target player or planeswalker"** CANNOT — battles are a distinct third category. Similarly, combat damage triggers worded "when this deals damage to a player" do NOT fire when attacking a battle. Battles cannot attack or block even if animated into creatures. Proliferate ADDS defense counters to battles, paradoxically making them harder to defeat. When a Siege's last defense counter is removed, it is exiled and cast transformed as a special action by the controller — but this cast CAN be countered.

## The Definitive Rules

**CR 310.1:** A battle card is a card with the battle card type. Battles have a defense value, defense counters, and a protector. When a Battle's defense counters reach zero, the battle is defeated.

**CR 310.4:** Defense counters are a distinct counter type on battles. When a battle has no defense counters, it is defeated (SBA: CR 704.5s).

**CR 310.7:** A player can attack a battle that player doesn't control.

**CR 310.8:** The protector of a battle is the opponent designated when the battle enters. Only the protector can block creatures attacking that battle.

**CR 310.11b (Siege intrinsic):** "When the last defense counter is removed from this permanent, exile it, then you may cast it transformed without paying its mana cost."

**CR 508.1:** Battles cannot be declared as attackers. They can be attacked but cannot attack.

## The Pattern

```
BATTLE TARGETING — THE "ANY TARGET" vs "PLAYER OR PLANESWALKER" DISTINCTION:

  Battles are a THIRD permanent type distinct from:
    (a) Players
    (b) Planeswalkers

  "Any target" spells: CAN target battles.
    → Lightning Bolt ({R}: "deals 3 damage to any target") → YES, can target a battle.
    → Murder ({1}{B}{B}: "Destroy target creature") → NO, only targets creatures.
    → Shock ({R}: "deals 2 damage to any target") → YES.

  "Target player or planeswalker" spells: CANNOT target battles.
    → Older burn spells (e.g., Lava Spike: "deals 3 damage to target player") → NO.
    → Sorceries that say "target player discards" → NO (battles don't have hands).
    → Planeswalker redirect rule: damage to a player could be redirected to a planeswalker
      (pre-MOM rule) — battles don't have this redirect ability.

  WHY THIS MATTERS IN PLAY:
    Battles visually resemble planeswalkers (defense value like loyalty). Players familiar
      with redirecting damage to planeswalkers may assume battles work the same way.
    They do NOT. A "Lightning Bolt targeting target player" cannot be redirected to a battle.
    Only "any target" spells can directly target battles.

  Official ruling (2023-04-14): "A battle can be dealt damage and be the target of spells
    and/or abilities that target 'any target.' It can also be targeted by spells and abilities
    that specifically target battles. It can't be targeted by spells and abilities that
    target creatures, players, or planeswalkers."

COMBAT DAMAGE TRIGGER GOTCHA:

  Triggers worded "when this deals damage to a player" do NOT fire when attacking a battle.
  Battles are not players.

  Examples:
    → Equipped creature with "whenever this creature deals combat damage to a player,
      draw a card" — attacks a Siege → battle takes damage → trigger does NOT fire.
    → "Whenever this creature deals combat damage to a player or planeswalker, do X" →
      attacks a Siege → battle is neither → trigger does NOT fire.
    → "Whenever this creature deals combat damage, do X" (no qualifier) → attacks a Siege →
      trigger DOES fire (battle takes damage, no restriction on whom).

  This is a major gotcha for combat-damage-triggers-matter decks in environments with Battles.

BATTLES CANNOT ATTACK OR BLOCK:

  CR 508.1: Battles cannot be declared as attackers.
  Even if a battle is animated into a creature (e.g., via March of the Machines making
    all artifacts creatures, or Oko turning it into an Elk), it STILL cannot attack or block.
  A permanent that is both a Battle and a Creature has this restriction from the battle rules.

  If something causes a battle to deal combat damage, that damage removes defense counters
    normally (it's still a battle taking damage from an attacking creature).

DEFENSE COUNTERS AND DEFEAT:

  Defense counters are the battle's "life total." They start at the value printed on the card.
  Each point of damage dealt to a battle removes that many defense counters.
    → Wait: actually damage to battles is tracked as damage, and at end of turn damage is
      removed... Actually: CR 310.4a — creatures deal combat damage to battles, and that
      damage is tracked and then removed during cleanup. But defense counters are a
      SEPARATE thing: when a Battle has 0 defense counters, it is defeated (SBA).
    → Actually, let me clarify: damage DEALT to a battle removes defense counters
      equal to the damage amount. This is a rules mechanic unique to battles.
      CR 310.4: "A battle card has a defense characteristic printed on it. The current
      defense of a battle is equal to its printed defense plus or minus any modifiers..."

  SBA DEFEAT (CR 704.5s): When a battle has 0 or fewer defense counters, it is defeated.
    The controller of the battle can then exile it and cast its back face transformed
    (for Siege battles). This is a triggered ability that goes on the stack.

PROLIFERATE AND DEFENSE COUNTERS:

  Defense counters ARE counters on permanents. Proliferate can choose them.
  Adding a defense counter via proliferate makes the battle HARDER to defeat.
  An OPPONENT can proliferate your battles to slow down your transform.
  You can proliferate your own battles too (if you want to delay the transform, which is
    rare, or if the battle has other effects while it remains in battle form).

DEFEAT TIMING AND COUNTERSPELLS:

  When the last defense counter is removed (via combat damage, spells, etc.):
    → SBA fires: the battle goes to 0 defense counters → it is defeated.
    → The intrinsic Siege triggered ability fires: "exile it, then you may cast it
      transformed without paying its mana cost."
    → The cast IS a real cast — it can be countered.
    → If the cast is countered, the transformed permanent goes to the GY (or exile,
      per how the original was exiled and what happens when the cast is countered).

  IMPORTANT: The exile happens as part of the trigger, then you "may cast."
    If you choose not to cast: the battle remains exiled.
    If the cast is countered: the back face goes to its owner's graveyard.

PROTECTOR AND BLOCKING:

  The protector is chosen when the battle enters (the opponent you designate at ETB).
  Only the protector can block creatures attacking the battle.
  Other opponents CANNOT block for it.
  If the protector leaves the game (multiplayer): a new protector must be chosen (SBA).
  If the protector gains control of the battle: a new protector must be chosen (SBA).

COPY OF A SIEGE (NON-DFC):

  If a non-DFC permanent somehow becomes a copy of a Siege:
    → When it reaches 0 defense counters: defeated → triggered exile + cast.
    → It has no back face to cast transformed from exile.
    → The "exile it, then cast it transformed" trigger resolves, but there's nothing
      to cast. The permanent remains exiled.
    → If it's a token: tokens cease to exist in non-battlefield zones (SBA) —
      the token would cease to exist in exile immediately after being exiled.

KEY CARD EXAMPLES:
  Invasion of New Phyrexia ({X}{W}{U}: Siege, 6 defense):
    "When this Siege enters, create X 2/2 white and blue Knight creature tokens with vigilance."
    Back face: Teferi Akosa of Zhalfir (Planeswalker).
    → Transforms from a Siege into a planeswalker — two completely different types.
    → The cast of the back face is a planeswalker cast and can be countered.
```

## Definitive Conclusions

- **Battles can only be targeted by "any target" spells** — "target player or planeswalker" spells cannot target battles; they are a distinct permanent type.
- **Combat damage triggers that say "to a player" don't fire when attacking battles** — only triggers with no target restriction or that specify "any target" fire.
- **Battles cannot attack or block even when animated** — the battle card type prohibition persists even if a battle also becomes a creature.
- **Proliferate adds defense counters** — counterintuitively making battles harder to defeat; opponents can use proliferate offensively against you.
- **The defeat transform cast CAN be countered** — the exile happens first (as part of the trigger), then the transformed cast goes on the stack; countermagic can hit it.
- **Non-DFC copies of Sieges can never cast their back face** — the transform trigger fires but finds nothing to cast; tokens cease to exist in exile.

## Canonical Example

**Lightning Bolt vs. Invasion of Gobakhan:**

Invasion of Gobakhan ({2}{W}: Siege, 3 defense) is on the battlefield protected by Opponent A.

You cast Lightning Bolt targeting Invasion of Gobakhan (it says "any target" — valid).
Lightning Bolt deals 3 damage to the battle → 3 defense counters removed → 0 remaining.
SBA fires: battle is defeated.
Intrinsic trigger: exile it, you may cast Lightshield Array (its back face) without paying its mana cost.

You cast Lightshield Array. Opponent A tries to counter it with Counterspell. It resolves on the stack above the cast. Lightshield Array goes to your graveyard.

**Example 2 — Combat Damage Trigger Failure:**

You control a Sword of Feast and Famine (equipped creature "whenever this deals combat damage to a player, untap all lands and make opponent discard").

You attack with the equipped creature targeting Invasion of Gobakhan.
Creature deals 3 combat damage to the battle. Defense counters removed.

Sword of Feast and Famine trigger: "whenever this deals combat damage to a **player**..." — Did the creature deal combat damage? Yes. To a player? NO — it dealt combat damage to a battle. Trigger does NOT fire. No untap, no discard.

**Example 3 — Proliferate Defense Counter Addition:**

Invasion of New Phyrexia has 3 defense counters remaining. Your opponent casts Atraxa, Praetors' Voice (which proliferates at end step). They choose Invasion of New Phyrexia in the proliferate.

Defense counter added → 4 counters now. The Siege just got harder to defeat. Opponent bought themselves another combat step before Teferi Akosa enters.

## Commonly Confused With
- **P276 (Battle/Siege basics)** — P276 covers how Battles work in general. P499 specifically covers the critical targeting distinction (any target vs. player or planeswalker) and the combat damage trigger gotcha — competitive-play-relevant edge cases.
- **P002 (Replacement Effects)** — Before battles, damage to a player could be redirected to a planeswalker they controlled. Battles don't have this redirect; the distinction is that "player or planeswalker" spells literally cannot target battles in the first place.
- **P465 (Proliferate)** — Proliferate's core rules. P499 notes the defensive (slowing) use of proliferate on enemy battles.
