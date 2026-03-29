---
id: p276
name: Battles and Siege Type — Attack the Opponent's Permanent to Flip It
category: combat
cr_refs: [310.1, 310.2, 310.3, 310.4, 310.5, 310.6, 310.7, 310.8, 310.9, 310.10, 310.11]
tags: [battle, siege, defense-counter, attack-battle, flip-battle, March-of-the-Machine, Invasion-of-Tarkir, Invasion-of-Ixalan, Invasion-of-Arcavios, Attack-of-the-Planar-Hydra]
created: 2026-03-29
examples_count: 2
---

# P276 — Battles and Siege Type — Attack the Opponent's Permanent to Flip It

## Abstract
Battles are a new permanent type introduced in March of the Machine (2023). They enter with defense counters and are controlled by one player but can be attacked by that player's opponents (or even the controlling player themselves, in the case of Siege-type battles). When all defense counters are removed, the battle is defeated and its controller exiles it, casting the face-down card from exile for free. The Siege subtype (the only Battle subtype in 2023) is specifically controlled by the opponent — you cast a Siege, but your opponent controls it. Your opponents then must attack it; when it's defeated, YOU exile and flip it.

## The Definitive Rules

**CR 310.1** (verbatim): *"Battle is a card type. The only battle subtype is Siege."*

**CR 310.4** (verbatim): *"When a battle with the defense symbol is put onto the battlefield, it enters with a number of defense counters on it equal to the number in that symbol."*

**CR 310.5** (verbatim): *"Damage dealt to a battle causes that many defense counters to be removed from it."*

**CR 310.6** (verbatim): *"A battle is defeated when it has no defense counters on it. When a battle is defeated, its controller exiles it, then casts the other face of the card without paying its mana cost."*

**CR 310.7** (verbatim): *"A Siege is a battle with the Siege subtype. When a Siege enters, its protector is chosen. The protector of a Siege is an opponent of the player who cast it. (If the Siege wasn't cast, its controller's controller becomes the protector when it enters.) The protector of a Siege can't attack it, and they can block creatures attacking it. Other players can attack a Siege as though it were a player they're attacking."*

## The Pattern

```
BATTLE STRUCTURE:
  A Battle is a permanent with defense counters (like a player with life)
  Damage is dealt to the Battle → removes defense counters
  When 0 defense counters: the Battle is "defeated" → controller exiles it → free cast of back face

SIEGE SUBTYPE RULES:
  When you cast a Siege: choose an opponent to be its "protector"
  The Siege enters under YOUR control (you're the controller)
  But: the protector acts as its defender — they can block creatures attacking it
  The protector CANNOT attack the Siege themselves
  All OTHER players CAN attack the Siege (treat it like they're attacking a player)

WHO ATTACKS A SIEGE:
  Opponent A casts Invasion of Tarkir (a Siege). Opponent B is the protector.
  Opponent A (the caster): THEY attack the Siege (attack their own permanent, protected by Opponent B)
  Wait: rules say "other players can attack a Siege." But the protector is the one protecting it.
  Actually: the CONTROLLER of the Siege can attack it? Let me clarify.
  CR 310.7: "The protector of a Siege can't attack it, and they can block creatures attacking it."
  "Other players can attack a Siege as though it were a player they're attacking."
  This means: the controller of the Siege AND all other non-protectors can attack it.
  The PROTECTOR is the only one who can't attack it (but they defend it).

SIEGE IN PRACTICE:
  You cast Invasion of Tarkir. Choose your opponent (in 1v1: there's only one opponent) as protector.
  On your turn: attack the Invasion of Tarkir with your creatures.
  Opponent (the protector): blocks your attacking creatures.
  Your creatures fight through the defenders → deal damage to the Siege → remove defense counters.
  When Invasion of Tarkir reaches 0 counters: you exile it and cast the back face for free.
  The back face is usually a powerful permanent (a dragon, a planeswalker, etc.).

DEALING DAMAGE TO BATTLES:
  Spells/abilities can deal damage to a Battle (it's a valid target where "deal damage to a permanent" or player is allowed)
  Combat damage to a Battle removes defense counters
  Effects that deal "damage" to "any target" can target a Battle

BATTLE FLIP FACE:
  The back face is the reward for defeating the Siege
  It's cast for FREE (no mana cost) when the Battle is defeated
  The back face is often a legendary creature, powerful enchantment, or planeswalker
  This is the primary motivation: the Battle's front face has an ETB effect, and the back face is the reward

NOTABLE BATTLES (March of the Machine):
  Invasion of Tarkir ({2}{R}): 4 defense counters.
    Front: look at top 7, put a Dragon with mana value ≤ 5 from among them into hand.
    Back face: Defiant Thundermaw (Dragon creature with haste and a triggered ability).
    Normal use: play for {2}{R}, get a dragon card from top 7, then attack down to 0 counters to flip to
    a Dragon creature for free.
    The 4 defense counters are relatively easy to remove with a few attackers.

  Invasion of Ixalan ({2}{G}): 4 defense counters.
    Front: look at top 4 cards, reveal any number of permanent cards, put them in hand, rest on bottom.
    Back face: Exati-Keq (Legendary Merfolk Pirate 4/4 creature).
    A {2}{G} card that digs 4 cards and eventually flips into a 4/4 body.

  Invasion of Arcavios ({2}{U}{U}): 6 defense counters.
    Front: counter target spell unless its controller pays {5}.
    Back face: Invocation of the Founders (Legendary Enchantment, double copies of instants/sorceries).
    Higher defense count (6) makes it harder to flip; back face is extremely powerful.

BATTLES IN MULTIPLAYER (COMMANDER):
  In Commander: multiple opponents.
  You cast a Siege → choose one opponent as protector.
  Other opponents (non-protector) can also attack the Siege.
  Political tool: allies attack the Siege to help you defeat it; the protector defends.
  Flipping a Battle in Commander: "attack the Siege" becomes a political negotiation.

BATTLE RULES SUMMARY:
  - Battles have defense counters (like a life total)
  - Damage removes defense counters
  - 0 defense counters → Battle is defeated → controller exiles and casts back face for free
  - Siege battles: controller chooses an opponent as protector; protector defends (blocks) but can't attack
  - Non-protector players can attack the Siege
```

## Definitive Conclusions

- **Battles are permanents that take damage in the form of defense counter removal** — 0 counters = defeated.
- **When defeated, controller exiles the Battle and casts the back face for free** — the back face is the reward.
- **Siege battles have a protector who can block but not attack** — the caster and others attack it.
- **Damage from spells can also defeat Battles** — not only combat damage.
- **In Commander, non-protector opponents can help you defeat your own Siege** — political coordination.

## Canonical Example
**Invasion of Tarkir — Dragon Tutor into Free Dragon:**
Turn 3: you have {2}{R}. Cast Invasion of Tarkir. Choose opponent as protector.
ETB: look at top 7 cards of your library. Find a Dragon (Glorybringer, Demanding Dragon, etc.). Put it in hand.
The Siege enters with 4 defense counters.
Turn 4: attack Invasion of Tarkir with your 3/3 and 2/2 (total 5 power).
Opponent blocks: the protector blocks with a 4/4 → opponent trades the 4/4 to block the 3/3.
Remaining combat damage from 2/2 hits the Invasion: remove 2 defense counters (4 → 2).
Turn 5: attack with 3/3 (the 3/3 respawned or another creature). Unblocked → deal 3 to Invasion.
Invasion drops from 2 counters to 0 (take 3 damage, but only 2 counters). Wait: damage only removes
counters equal to damage. 3 damage to Invasion with 2 counters: remove 2 counters (Battle goes to 0).
Defeat! Exile Invasion of Tarkir. Cast Defiant Thundermaw for free.
You got: a Dragon from your top 7 (to hand) AND a free 4/5 Dragon creature (Defiant Thundermaw).
Total investment: {2}{R} to cast, 2 attack phases, some creatures blocking.

**Example 2 — Burn to Defeat a Battle:**
Board: Your Invasion of Ixalan ({2}{G}), 4 defense counters.
You have Lightning Bolt and Searing Spear in hand.
Cast Lightning Bolt targeting Invasion of Ixalan: remove 3 defense counters → 1 counter remaining.
Cast Searing Spear targeting Invasion: deal 3 damage → remove last counter.
Invasion defeated: exile it, cast Exati-Keq (the Merfolk 4/4 Legendary) for free.
Cost: {2}{G} (Invasion) + {R} (Bolt) + {1}{R} (Spear) = 5 total mana for an ETB dig + free 4/4.
You didn't need to attack at all — burn spells defeated your own Battle.

## Commonly Confused With
- **P155 (Vehicles)** — Vehicles are animated by crewing (tapping creatures); Battles are defeated by dealing damage to them (removing defense counters). Very different mechanics.
- **P063 (Planeswalker Loyalty)** — Planeswalkers take damage that reduces loyalty; Battles take damage that reduces defense counters. Both are attacked by opponents — but Battles are attacked on the controlling player's behalf.
- **P204 (Double-Faced Cards)** — DFC rules generally; Battles are DFCs where the back face is only revealed/cast when the front is defeated, not through a transform mechanic.
