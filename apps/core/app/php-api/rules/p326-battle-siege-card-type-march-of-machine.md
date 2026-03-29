---
id: p326
name: Battle Cards — Siege Type, Defense Counters, Attacking Battles, and Transform
category: zones
cr_refs: [310.1, 310.4, 310.5, 310.6, 310.7, 310.8, 310.8a, 310.8b, 310.8c, 310.11, 310.11a, 310.11b]
tags: [battle, Siege, defense-counter, protector, attack-battle, transform-battle, March-of-the-Machine, Invasion-of-Alara, Invasion-of-Zendikar, Battle-of-Hoover-Dam, own-battle, removing-defense-counters]
created: 2026-03-29
examples_count: 2
---

# P326 — Battle Cards — Siege Type, Defense Counters, Attacking Battles, and Transform

## Abstract
**Battle** is a new card type introduced in March of the Machine (2023). All battles are currently **Sieges**. A Siege enters the battlefield with defense counters and must be assigned a **protector** (an opponent of the Siege's controller). Damage dealt to the battle removes defense counters. When the last counter is removed, the Siege is exiled and its controller may cast it **transformed** for free. Crucially: **the Siege's own controller can attack it** (to remove counters), while the protector defends it with blockers.

## The Definitive Rules

**CR 310.4b** (verbatim): *"A battle has the intrinsic ability 'This permanent enters with a number of defense counters on it equal to its printed defense number.' This ability creates a replacement effect."*

**CR 310.5** (verbatim): *"Battles can be attacked."*

**CR 310.6** (verbatim): *"Damage dealt to a battle results in that many defense counters being removed from it."*

**CR 310.7** (verbatim): *"If a battle's defense is 0 and it isn't the source of an ability which has triggered but not yet left the stack, it's put into its owner's graveyard. (This is a state-based action.)"*

**CR 310.8b** (verbatim): *"A battle's protector can never attack it. A battle can be attacked by any attacking player for whom its protector is a defending player. Notably, a Siege battle can be attacked by its own controller."*

**CR 310.8c** (verbatim): *"A battle's protector may block creatures attacking that battle with creatures they control. Creatures controlled by other players can't block those attackers."*

**CR 310.11a** (verbatim): *"As a Siege enters the battlefield, its controller must choose its protector from among their opponents. Only an opponent of a Siege's controller can be its protector."*

**CR 310.11b** (verbatim): *"Sieges have the intrinsic ability 'When the last defense counter is removed from this permanent, exile it, then you may cast it transformed without paying its mana cost.'"*

## The Pattern

```
WHAT IS A BATTLE?
  Battle is a permanent type (like creature, enchantment, planeswalker).
  All current battles are Siege battles.
  They look like planeswalker cards but instead of loyalty: DEFENSE counters.
  Defense counter = like loyalty counter, but starts high and decreases.
  A typical Siege: 6 defense counters.

HOW A SIEGE WORKS:
  (A) You cast the Siege. It enters the battlefield under YOUR control.
  (B) As it enters: choose a protector from among your opponents.
      The protector is the "defending player" for creatures attacking the Siege.
  (C) The Siege sits on the battlefield, visible, with its defense counters.
  (D) You can attack the Siege with your own creatures!
      The protector defends with their creatures.
      If the protector blocks all your attackers: no damage to the Siege.
      If attackers get through: remove defense counters equal to damage dealt.
  (E) When all defense counters are removed: the Siege is exiled.
      YOU (the controller) may then cast it TRANSFORMED for free.
      The transformed face is usually a powerful spell (often at a high MV).

THE ATTACK MECHANIC (key concept):
  CR 310.8b: "A battle's protector can never attack it. [...] Notably, a Siege can be attacked by its own controller."
  So: YOU cast the Siege, choose an opponent as protector, then attack IT yourself.
  The opponent (protector) defends the Siege with their creatures.
  This creates a unique dynamic: you're both the attacker and the caster.
  If you can't break through the protector's blockers, the Siege makes no progress.

  MULTIPLAYER NOTE (Commander):
  In multiplayer: only one opponent is chosen as protector.
  Other opponents can't attack the Siege on their turns (the protector defends, and only
    the protector is the "defending player" for that Siege).
  Wait: actually anyone who has the protector as their "defending player" can attack.
  In Commander with 3 opponents: you choose Player 1 as protector. Players 2 and 3 can also
    choose to attack Player 1 as their "defending player" — which would include the Siege.
    This is unusual: non-protector players CAN'T attack the Siege because it's not THEIR target.
  Actually: only the Siege's controller and players to whom the protector is a "defending player" can attack the Siege.
  In a 4-player game: Players 2, 3, and 4 are opponents of Player 1 (controller).
  If Player 1 chooses Player 2 as protector:
    Player 1 can attack the Siege (controller always can).
    Player 3 and 4: on their turns, can they attack the Siege?
    They'd declare the Siege as their attack target. But Player 2 is the "defending player" for that Siege.
    If Player 2 is normally a player they could attack (they're opponents of each other): yes.
    CR 310.8b says the Siege can be attacked by any attacking player for whom its protector is a defending player.
    Players 3 and 4: is Player 2 their "defending player"? Yes, if they can legally attack Player 2.
    So: all opponents of the Siege's controller can attack the Siege on their respective turns.

DAMAGE TO BATTLES:
  CR 310.6: damage to a battle removes defense counters (one per damage point).
  CR 120.3h: "Damage dealt to a battle causes that many defense counters to be removed."
  Unlike planeswalkers (loyalty counters removed), battles specifically have defense counters removed.
  Spells dealing direct damage to battles (if they can target battles): same effect.
  "Deal 3 damage to target creature or battle": remove 3 defense counters.

TRANSFORM ON DEFEAT:
  CR 310.11b: "when the last defense counter is removed... exile it, then you may cast it transformed without paying its mana cost."
  This is FREE CAST. No mana cost.
  It's cast as a spell (does use the stack). Can be countered.
  The transformed face is usually a major permanent or spell.

NOTABLE INVASION SIEGES (March of the Machine):
  Invasion of Alara ({4}{W}{U}{B}{R}{G}, defense 6): Exile top 7 cards, cast a nonland for free.
    Back face: Awaken the Maelstrom (deals 4 damage, creates token, draws, mills).
    Breaking through a 6-defense Siege is a significant challenge.
  Invasion of Zendikar ({2}{G}, defense 4): Put 2 +1/+1 counters on each creature, search for 2 basic lands.
    Back face: Awakened Skyclave (3/3 land creature).
    Easy to break: 4 defense, just deal 4 damage. Green can ramp and attack easily.
  Invasion of Ikoria ({3}{G}, defense 5): Search for non-Human creature card, put into hand.
    Back face: Zilortha, Apex of Ikoria (6/6 trample, costs opponents extra mana).
    Often cast just for the search effect; breaking it is a bonus.

BATTLES AND COMBAT RULES:
  Siege battle is a valid attack target like a player or planeswalker.
  You must have a legal attacker to attack it.
  You can't attack a battle if you're currently blocked (attacking it means declaring it as your attack target).
  Trample: if a creature with trample attacks the battle and the protector blocks with a 1/1:
    Trample assigns lethal damage to the 1/1 (1 damage), rest tramples to the battle.
    Defense counters are removed equal to the trample damage.

  DAMAGE FROM BATTLES:
    Battles don't deal combat damage back. The Siege itself doesn't fight back.
    Only the protector's blocking creatures deal combat damage to your attackers.

PROLIFERATE AND BATTLES:
  CR 122.1g: defense counters on a battle are like loyalty counters on a planeswalker.
  Proliferate: can ADD defense counters to a battle!
  Why would you? Only if you're the protector (defending) or if the battle is an opponent's.
  Opponent controlling a Siege you want to stop: proliferate their Siege → it's harder to defeat.
  Your OWN Siege: don't proliferate (you want the counters to go to 0).
  Wait: if you proliferate a permanent that has defense counters, you'd add counters, making it harder to defeat. Seems weird to do to your own.
  But: some interactions might be interesting.
```

## Definitive Conclusions

- **Sieges must have an opponent chosen as protector** — only the protector can block attackers targeting the Siege.
- **The Siege's controller can attack their own Siege** — this is the primary mechanism for defeating it.
- **Damage removes defense counters** — when defense hits 0, the Siege is exiled and the controller may cast it transformed for free.
- **The transformed back face is cast as a spell** — it can be countered; it's not a triggered ability.
- **Proliferate can add defense counters to battles** — potentially making the Siege harder for you to defeat.

## Canonical Example
**Invasion of Zendikar — Ramp and Flip:**
Turn 3: cast Invasion of Zendikar ({2}{G}): enters with 4 defense counters.
Choose opponent Player 2 as protector.
Enters: "Put a +1/+1 counter on each of up to two target creatures. Search your library for up to two basic land cards, put them onto the battlefield tapped."
ETB effect resolves: put +1/+1 on two creatures, search for 2 basics → Forest + Plains.
You now have 5 lands. The Siege has 4 defense counters. Player 2 is protector.
Turn 4: attack Invasion of Zendikar with two 3/3 creatures.
Player 2 blocks with one 2/2 blocker.
One 3/3 blocked by 2/2: both deal damage. 3/3 takes 2 damage (lives at 3/1 effectively with damage marked). 2/2 takes 3 damage, dies.
The other 3/3: unblocked. Deals 3 damage to the Invasion of Zendikar.
Remove 3 defense counters. Invasion of Zendikar now has 1 defense counter.
Turn 5: attack the Invasion of Zendikar with a 1/1 (or any creature ≥ 1 power). Unblocked.
Deals 1 damage: remove last defense counter.
CR 310.11b triggers: exile Invasion of Zendikar. Cast it transformed for free.
Awakened Skyclave (the back face) enters as a 3/3 land creature.
Total value: 2 lands (from ETB), pumped two creatures, then a free 3/3 creature from the flip.
For {2}{G}: substantial ramp + a future threat.

**Example 2 — Multiplayer Battle Dynamics:**
Commander game (4 players: You, Alice, Bob, Carol).
You cast Invasion of Alara ({4}{W}{U}{B}{R}{G}, defense 6): ETB: exile top 7 cards, cast one nonland for free.
You cast Emrakul from the top 7 for free. Emrakul on the battlefield. Battle enters with 6 defense.
Choose Alice as protector.
Your battle has 6 defense.
Alice's concern: if the battle is defeated, you get another free powerful spell (back face).
Alice protects aggressively.
Bob's turn: Bob is also an opponent of you. Can Bob attack the Invasion?
CR 310.8b: "A battle can be attacked by any attacking player for whom its protector is a defending player."
Bob vs. Alice: Bob considers Alice an opponent (they're in the same game). Alice is a "defending player" for Bob on Alice's turn if Bob attacks Alice.
Bob can declare the Invasion of Alara as an additional attack target on his turn.
Bob attacks: 3 creatures, 2 target Alice, 1 targets the Invasion.
Alice blocks the Invasion-attacker.
Combat: if the attacker gets through: removes defense counters.
Note: Bob defeating the Invasion helps YOU (you get the free spell). Bob might not want to do that.
If Carol attacks it too: all three opponents might refuse, leaving you to dismantle it yourself.
This political dynamic is unique to battles.

## Commonly Confused With
- **P317 (DFC Transform)** — The back face of a Siege is a DFC; when cast after defeating the Siege, it enters with its back face up. The MV of the transformed spell on the stack is the front face's MV (CR 712.8c). Can potentially be countered.
- **P290 (Planeswalker Loyalty)** — Battles are similar to planeswalkers in layout but different: planeswalkers take loyalty damage directly from players attacking them; battles take damage from creatures attacking them (removed as defense counters) and are defended by the protector.
- **P325 (Proliferate/Counters)** — Defense counters are regular counters and can be proliferated. Adding defense counters via proliferate makes the Siege harder to defeat (counterproductive if it's your own Siege).
- **P308 (Trample)** — Trample works against battles: assign lethal damage to blockers, excess tramples to the battle (removing defense counters).
