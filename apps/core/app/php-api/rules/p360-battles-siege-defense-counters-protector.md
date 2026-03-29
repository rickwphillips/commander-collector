---
id: p360
name: Battles — Siege Type, Defense Counters, Protector, Attacking and Defeating Battles
category: combat
cr_refs: [310.1, 310.4, 310.4a, 310.4b, 310.4c, 310.5, 310.6, 310.7, 310.8, 310.8a, 310.8b, 310.8c, 310.8d, 310.11, 310.11a, 310.11b, 120.3h, 508.1]
tags: [battle, siege, defense-counter, protector, attacking-battle, blocking-battle, defeat-battle, transform-battle, Invasion-of-Zendikar, Invasion-of-Alara, March-of-the-Machine, DFC-battle, own-battle-can-attack, opponent-protects-siege]
created: 2026-03-29
examples_count: 2
---

# P360 — Battles — Siege Type, Defense Counters, Protector, Attacking and Defeating Battles

## Abstract
**Battles** (rule 310) are a card type introduced in March of the Machine (2023). They enter the battlefield with **defense counters** (equal to their printed defense number), and damage dealt to them removes that many defense counters (120.3h, 310.6). When a battle's defense reaches 0, it's put into its owner's graveyard (or, for Siege battles, exiled and cast transformed). All current battles are **Siege** type (310.11): the controller **must choose an opponent** as the battle's **protector** (310.11a). The controller (not the protector) can **attack the battle**, while the protector can **block** creatures attacking it (310.8b–c). When a Siege's defense hits 0: exile it, then optionally cast it transformed without paying its mana cost — getting a powerful permanent for free.

## The Definitive Rules

**CR 310.4b** (verbatim): *"A battle has the intrinsic ability 'This permanent enters with a number of defense counters on it equal to its printed defense number.' This ability creates a replacement effect (see rule 614.1c)."*

**CR 310.6** (verbatim): *"Damage dealt to a battle results in that many defense counters being removed from it."*

**CR 310.7** (verbatim): *"If a battle's defense is 0 and it isn't the source of an ability which has triggered but not yet left the stack, it's put into its owner's graveyard. (This is a state-based action. See rule 704.)"*

**CR 310.8** (verbatim): *"Each battle has a player designated as its protector."*

**CR 310.8b** (verbatim): *"A battle's protector can never attack it. A battle can be attacked by any attacking player for whom its protector is a defending player. Notably, a Siege battle can be attacked by its own controller."*

**CR 310.8c** (verbatim): *"A battle's protector may block creatures attacking that battle with creatures they control. Creatures controlled by other players can't block those attackers."*

**CR 310.11b** (verbatim): *"Sieges have the intrinsic ability 'When the last defense counter is removed from this permanent, exile it, then you may cast it transformed without paying its mana cost.'"*

**CR 120.3h** (verbatim): *"Damage dealt to a battle causes that many defense counters to be removed from that battle."*

## The Pattern

```
BATTLES — NEW PERMANENT TYPE (310):
  Battles are permanents (they go on the battlefield).
  Cast like spells from hand during main phase (310.1).
  Enter with defense counters (310.4b: replacement effect).
  They're NOT creatures (unless they also have creature type, which current ones don't).
  They're NOT planeswalkers (despite having a "counter-based durability" like planeswalkers).
  They CAN be targeted by spells/abilities like any permanent on the battlefield.

DEFENSE COUNTERS (310.4):
  Defense = the battle's "health."
  Printed defense (in lower right corner): amount it enters with.
  Current defense = number of defense counters on it (310.4c).
  DAMAGE TO BATTLES (120.3h, 310.6):
    "Damage dealt to a battle causes that many defense counters to be removed."
    Unlike players (life loss) and creatures (damage marks), battles REMOVE counters directly.
    This means:
      Prevention effects that prevent damage: also prevent defense counter removal.
      Effects that add defense counters back: effectively "heal" the battle.
      Proliferate: doesn't add defense counters (they're being removed, not added — and
        proliferate adds, so it WOULD add defense counters to a battle).
        Actually: proliferate says "choose any number of permanents and/or players with counters."
        A battle with defense counters: you COULD proliferate to add a defense counter.
        This extends the battle's "life." Unusual but legal.
  STATE-BASED ACTION (310.7):
    When defense = 0: battle goes to GY (SBA). Unless it's a Siege — which has a triggered ability
      that fires just before the SBA would kill it (310.11b: "when last defense counter removed, exile it...").

SIEGE SUBTYPE (310.11):
  ALL current battles are Sieges.
  Siege-specific rules:
    1. Protector must be chosen from opponents (310.11a):
       "As a Siege enters, its controller must choose its protector from among their opponents."
       In multiplayer: choose ONE opponent as protector.
       You (controller) don't protect your own Siege.
    2. When defense reaches 0: triggered ability fires (310.11b):
       "When the last defense counter is removed, exile it, then you may cast it transformed
        without paying its mana cost."
       This is a TRIGGERED ability (fires when the last counter is removed, before SBA).
       The trigger: exile the battle → optionally cast the BACK FACE for free (no mana cost).
       The back face is a powerful permanent (creature, planeswalker, etc.).
    3. Controller can attack their own Siege (310.8b):
       "Notably, a Siege battle can be attacked by its own controller."
       Why: because the PROTECTOR (an opponent) is who the battle "defends for."
       You attack YOUR OWN Siege to reduce its defense counters, eventually defeating it.
       Flavor: you're "attacking" the enemy territory your opponent was protecting.

ATTACKING A BATTLE (310.5, 310.8):
  DECLARING ATTACKERS:
    You may declare creatures as attackers attacking a battle (just like attacking players or planeswalkers).
    Battles must be attacked by players for whom the battle's PROTECTOR is a defending player.
    For Sieges (protector = one opponent): the controller can attack it (opponent is the protector).
    OTHER opponents can't attack your battle (their "defending player" is you, not the protector).
  PROTECTOR BLOCKING:
    The battle's protector can block creatures attacking the battle.
    Other players can't block those attackers (310.8c).
    In a Commander 4-player game: if Player A controls a Siege (protector = Player B):
      Player A attacks their own Siege with a 5/5.
      Player B (protector) can block with their creatures.
      Player C and D can't block.
  PROTECTION DOESN'T "BLOCK" THE ATTACK:
    If a battle has any protection ability (unusual), it affects being targeted/damaged.
    But protection from a creature's color doesn't prevent the creature from attacking the battle.
    The battle being attacked is a normal combat declaration.
  BATTLE ISN'T A PLAYER OR PLANESWALKER:
    Some rules specifically mention "players, planeswalkers, or battles" — battles are a new third
      category of "things you can attack."
    Damage to battles: defense counters removed (not "life" or "loyalty").
    Trample over battles: excess damage can trample to the defending player (well — to the protector?).
    Actually: 702.19b: excess damage goes to "the player, planeswalker, or battle the creature is attacking."
    If attacking a battle: trample goes to the battle, not the protector.
    Wait: trample's excess goes to the defending player/planeswalker/battle. The battle IS the target.
    Trample doesn't go past the battle to the protector — the battle absorbs all the excess.
    (Unlike attacking a planeswalker where excess can go to the player with trample over planeswalkers.)

DEFEATING A BATTLE:
  When the last defense counter is removed:
    Trigger fires: "exile this permanent, then you may cast it transformed."
    "Cast it transformed without paying its mana cost": FREE cast of the back face.
    The back face enters the battlefield immediately (it resolves as it's cast).
    You can choose NOT to cast it: just exile it (it's gone).
  Why you'd cast it:
    Most Siege back faces are powerful permanents: legendary creatures, planeswalkers, enchantments.
    You invested attacking power and combat resources to reduce defense; the reward is the free permanent.
  TIMING:
    The trigger fires before the SBA (310.7: "if a battle's defense is 0 and it isn't the source of
      an ability which has triggered but not yet left the stack, it's put into its owner's graveyard").
    So: trigger fires → resolves (exile + optional cast) → no SBA needed (battle is gone).

INTERACTIONS:
  DIRECT DAMAGE TO BATTLES:
    Instants that deal damage can target battles.
    Lightning Bolt ("deal 3 damage to any target"): can target a Siege, remove 3 defense counters.
    This lets you defeat battles without attacking.
  PROLIFERATE AND BATTLES:
    Proliferate adds counters. You can add a defense counter to a battle (extending its "life").
    Use this to protect your opponent's Siege from being defeated by their own attacks (if you want the Siege to last longer).
    Or: use it on YOUR Siege to give it more defense, requiring more attacks to defeat it.
  DEATHTOUCH AND BATTLES:
    Deathtouch affects creatures. Does deathtouch damage to a battle cause some special effect?
    No: deathtouch destroys creatures via SBA (702.2b). Battles aren't creatures.
    Deathtouch dealing damage to a battle: removes defense counters (normal damage result). No "deathtouch kill" for non-creatures.
```

## Definitive Conclusions

- **Battles are permanents with defense counters** — damage removes defense counters (unlike creatures where damage marks stay until cleanup).
- **All current battles are Sieges** — the Siege type requires choosing an opponent as protector; the controller attacks their own Siege; the protector blocks.
- **When defense hits 0, the triggered ability exiles and offers a free transformed cast** — this is the primary payoff for defeating a Siege.
- **Trample damage to a battle stays on the battle** — unlike "trample over planeswalkers," excess trample damage against a battle doesn't go to the protector; it all goes to the battle.
- **Proliferate can add defense counters to extend a battle's life** — unusual but legal; can be used to prevent an opponent from defeating their own Siege too quickly.
- **Battles can be targeted by any damage or removal effect** — they're permanents; Lightning Bolt can remove 3 defense counters; "destroy target permanent" can destroy one.

## Canonical Example
**Invasion of Zendikar — Defeating for Free Permanent:**
Invasion of Zendikar ({2}{G}): Battle — Siege. Defense 4. "When you defeat Invasion of Zendikar, search your library for up to two basic land cards, put them onto the battlefield tapped, then shuffle."
Back face (when defeated): Awakened Skyclave ({3}{G}{G}): 4/4 legendary Elemental creature with "this spell costs {1} less for each land you control."
Wait: that's simplified. The actual back face varies. Using the concept: back face = a powerful card.

You cast Invasion of Zendikar. Choose protector: your opponent Player B.
Invasion of Zendikar enters with 4 defense counters.

Player A's turn: Declare attack. Declare creatures attacking Invasion of Zendikar (not Player B).
  Creature: 3/3. Deals 3 combat damage to the Siege. Remove 3 defense counters. Siege now has 1 counter.
Player B (protector) could have blocked with their creatures but chose not to.

Player A's next turn: Attack again with a 2/2.
Player B blocks with their 2/2 (they CAN block attackers targeting their protected Siege).
2/2 vs 2/2: both deal 2 damage. Both die. No damage to Siege.

Player A's next turn: Attack with a 3/3 and a 1/1 (don't need the 1/1, but why not).
Player B blocks the 3/3 with a 4/4. 3/3 dies. 4/4 takes 3 damage, survives.
1/1 hits the Siege: 1 defense counter removed. Siege now has 0 counters!
Triggered ability: "When the last defense counter is removed, exile it, then you may cast it transformed without paying its mana cost."
Trigger goes on stack. Resolves: Exile Invasion of Zendikar. Cast the back face (free).
You cast the back face (free). A powerful permanent enters the battlefield.

**Example 2 — Direct Damage to a Siege:**
You control Invasion of Alara ({W}{U}{B}{R}{G}): Battle — Siege. Defense 6.
Your opponent controls Chandra, Torch of Defiance (activated ability: "{T}: Chandra deals 4 damage to any target").

Opponent activates Chandra's ability targeting your Invasion of Alara.
4 damage to Invasion. 4 defense counters removed. Now has 2 counters.
Opponent uses a Lightning Bolt ({R}) targeting Invasion of Alara.
3 damage → 3 defense counters would be removed. But it only has 2.
Remove all 2 remaining. Defense = 0!
Triggered ability fires: exile it, then you may cast it transformed.
(Even though opponent dealt the final damage: the triggered ability is the CONTROLLER'S — you own Invasion of Alara. You choose whether to cast the back face for free.)
You choose: cast the back face. Free powerful permanent enters.

Weird interaction: opponent "helped" you defeat your own Siege (or defeated it for you).
In typical cases: YOU attack your own Siege to defeat it. But opponents can also use damage
  to reduce defense counters, potentially helping (or hindering) your plan.
  Opponents might target a Siege to prevent you from getting the back face (if they deal enough to
    destroy it immediately before the trigger resolves... no: trigger fires when last counter removed,
    then you exile it and cast the back face. No window for opponent to stop the transformation after
    the last counter is removed).
  The only way opponents stop the transformation: prevent the last damage (prevention effects) or
    exile/destroy the Siege before its defense hits 0.

## Commonly Confused With
- **P333 (Planeswalkers)** — Planeswalkers take damage as loyalty loss; battles take damage as defense counter removal. Both have "durability-by-counter" design, but planeswalkers use loyalty for abilities too; battles only use defense counters for surviving. Creatures can attack both planeswalkers and battles.
- **P341 (Combat Phase)** — Attacking a battle follows the same declare-attackers rules. Battles can be "the thing being attacked" just like players or planeswalkers. P341 covers combat structure; P360 covers battle-specific attack and blocking rules.
- **P351 (Persist/Undying/Counter Manipulation)** — Proliferating defense counters on a battle is an unusual interaction. Battles have defense counters which can be proliferated (added). This parallels other counter-manipulation patterns but is unique to battles.
- **P340 (Two-Headed Giant/Multiplayer)** — In multiplayer, choosing which opponent is the protector has strategic implications. Which opponent you choose determines who blocks your attacks on the Siege and who can attack it. P340 covers multiplayer rules; P360 covers battles within that context.
