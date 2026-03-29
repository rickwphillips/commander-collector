---
id: p349
name: Monarch, Initiative, Dungeons, and Emblems — Special Designations and Out-of-Game Objects
category: multiplayer
cr_refs: [724.1, 724.2, 724.3, 724.4, 725.1, 725.2, 725.3, 725.4, 725.5, 701.49a, 701.49b, 701.49c, 309.1, 309.2, 309.7]
tags: [monarch, initiative, dungeon, venture, emblem, out-of-game, designation, combat-damage-steal, draw-at-end-step, command-zone, Undercity, Dungeon-of-the-Mad-Mage, Lost-Mine-of-Phandelver, Throne-of-Eldraine, Lolth-Spider-Queen, The-Undead-King, Sefris-of-the-Hidden-Ways, Caves-of-Chaos-Adventurer]
created: 2026-03-29
examples_count: 2
---

# P349 — Monarch, Initiative, Dungeons, and Emblems — Special Designations and Out-of-Game Objects

## Abstract
**The Monarch** (rule 724) is a player designation that provides a card draw at the end step and is stolen by combat damage. **The Initiative** (rule 725) is similar but instead triggers ventures into **Undercity** (a specific dungeon). **Dungeons** (rule 309) are nontraditional cards outside the game brought in when a player "ventures into the dungeon." They have rooms connected by arrows; venturing advances the marker along the dungeon's path. Completing a dungeon triggers an effect and allows choosing a new dungeon. **Emblems** are objects players can gain (usually from planeswalker ultimates) that function like permanents with abilities but are in the command zone — they can't be removed by most effects and the abilities don't "target" an emblem.

## The Definitive Rules

**CR 724.2** (verbatim): *"There are two inherent triggered abilities associated with being the monarch. These triggered abilities have no source and are controlled by the player who was the monarch at the time the abilities triggered. The full texts of these abilities are 'At the beginning of the monarch's end step, that player draws a card' and 'Whenever a creature deals combat damage to the monarch, its controller becomes the monarch.'"*

**CR 724.3** (verbatim): *"Only one player can be the monarch at a time. As a player becomes the monarch, the current monarch ceases to be the monarch."*

**CR 725.2** (verbatim): *"There are three inherent triggered abilities associated with having the initiative. The full text of these abilities are 'At the beginning of the upkeep of the player who has the initiative, that player ventures into Undercity,' 'Whenever one or more creatures a player controls deal combat damage to the player who has the initiative, the controller of those creatures takes the initiative,' and 'Whenever a player takes the initiative, that player ventures into Undercity.'"*

**CR 701.49a** (verbatim): *"If a player is instructed to venture into the dungeon while they don't own a dungeon card in the command zone, they choose a dungeon card they own from outside the game and put it into the command zone. They put their venture marker on the topmost room."*

**CR 701.49c** (verbatim): *"If a player is instructed to venture into the dungeon while their venture marker is in the bottommost room of a dungeon card, they remove that dungeon card from the game. Doing so causes the player to complete that dungeon. They then choose an appropriate dungeon card they own from outside the game, put it into the command zone, and put their venture marker on the topmost room of that dungeon."*

## The Pattern

```
THE MONARCH (CR 724):
  BECOMING THE MONARCH:
    An effect says "you become the monarch." No monarch exists until an effect grants it.
    Example: Court of Grace ({2}{W}{W}): "When this enters, you become the monarch."
    Example: Marchesa, the Black Rose ({2}{U}{B}): "Whenever a creature dies, if you were the monarch..."
  ONCE YOU ARE THE MONARCH:
    TWO INHERENT TRIGGERED ABILITIES (no source — the game itself provides these):
      1. "At the beginning of the monarch's end step: draw a card."
         → Monarch draws an extra card each turn. Powerful.
      2. "Whenever a creature deals combat damage to the monarch: its controller becomes the monarch."
         → Any player can steal the monarchy by connecting combat damage.
  STEALING THE MONARCHY:
    Any creature that deals COMBAT DAMAGE to the current monarch steals it.
    Includes:
      - Your own creatures dealing damage to yourself (if you're the monarch).
        Wait: can you attack yourself? In multiplayer, no — you attack opponents.
        In 2-player: you're the nonactive player when opponent attacks.
      - Opponent's creatures dealing combat damage to you (the monarch).
      - Multiple creatures dealing combat damage: each instance of combat damage could trigger.
        BUT: "whenever a creature deals combat damage to the monarch" → triggers once per creature.
        If 3 creatures hit the monarch: 3 triggers, all change the monarchy to the same player (attacker).
  MONARCH LEAVING THE GAME:
    Current monarch leaves the game → active player becomes the monarch (724.4).
  MONARCHY MATTERS FOR CARDS LIKE:
    Court cards (Court of Grace, Court of Cunning): triggered abilities that are better when you're the monarch.
    "If you are the monarch" conditions on certain cards.

THE INITIATIVE (CR 725):
  TAKING THE INITIATIVE:
    An effect says "you take the initiative."
    Example: Lair of the Hydra ({8}): "... take the initiative."
    Example: Caves of Chaos Adventurer: creatures ETB triggers, take the initiative.
  THREE INHERENT TRIGGERED ABILITIES:
    1. "At the beginning of the upkeep of the player who has the initiative: venture into Undercity."
       → Advances the Undercity dungeon once per turn for the holder.
    2. "Whenever one or more creatures deal combat damage to the player who has the initiative:
          the controller of those creatures takes the initiative."
       → Stolen by dealing ANY combat damage (same mechanism as monarchy but with multiple creatures
          counted differently — "one or more creatures" means the trigger fires ONCE per combat damage
          event that connects, not per creature).
       Wait: 725.2 says "one or more creatures a player controls deal combat damage" → one trigger per
          player per combat damage step. Even if 3 creatures all hit: one trigger (controller takes initiative).
    3. "Whenever a player takes the initiative: that player ventures into Undercity."
       → Each time the initiative changes hands (or you take it): immediately venture.
  DIFFERENCE FROM MONARCH:
    Monarch: draw a card at end step (ongoing value each turn).
    Initiative: venture into Undercity at upkeep (dungeon progression value each turn).
  STEALING INITIATIVE:
    Deal combat damage to the player who has the initiative → steal it.
    On stealing: venture into Undercity immediately (trigger 3).
    Then each upkeep: venture again (trigger 1).
    Very powerful in formats where it exists (Commander, Legacy, some Limited).

DUNGEONS (CR 309, 701.49):
  DUNGEON CARDS:
    Not part of any deck. They exist outside the game (in a player's collection of nontraditional cards).
    Three main dungeons: Dungeon of the Mad Mage, Lost Mine of Phandelver, Dungeon of the Infinite, Tomb of Annihilation.
    Also: Undercity (used specifically for the Initiative).
  STRUCTURE:
    Rooms connected by arrows. Each room has an effect.
    When you venture: move your venture marker one room forward (following an arrow).
    If multiple paths: choose which arrow to follow.
    Each time you enter a room: that room's effect triggers (or happens).
  COMPLETING A DUNGEON:
    Reach the bottommost room. Complete the dungeon. Remove it from the game.
    Completing triggers a completion effect (usually on the dungeon card's room text or a separate trigger).
    Can then start a new dungeon.
  VENTURE MARKER:
    Physical token or counter tracking which room you're in.
    If venturing when not in a dungeon: bring in a new dungeon, place marker at top.
    If already in a dungeon: advance one step.
  DUNGEON ROOMS — EXAMPLES (Dungeon of the Mad Mage):
    Room 1 (Yawning Portal): "Scry 1."
    Room 2 (Dungeon Level): "Mill 2."
    ... multiple paths of rooms ...
    Final Room (Throne of Madness): "Each opponent discards a card."
  DUNGEON OF THE INFINITE:
    A dungeon that generates emblems and powerful effects as you complete it repeatedly.
    "Completing" it places an emblem — get one each time.
    Very powerful in long games.

EMBLEMS (rule 113.9, command zone):
  Created by effects (usually planeswalker ultimates or dungeon completions).
  Live in the COMMAND ZONE (like commanders and dungeon cards).
  NOT permanents. Not in any game zone (aside from command zone).
  They have abilities that affect the game, but they CAN'T be:
    - Targeted by spells (they're not on the battlefield).
    - Destroyed, exiled, bounced.
    - Affected by "all permanents" effects.
  Once created: they stay for the game.
  Examples:
    Jace, the Mind Sculptor (-12 ultimate): "Exile your library. Your hand has no maximum size.
      At the beginning of your upkeep, you may put any card from your exiled pile into your hand."
      → This emblem is unkillable. The effect persists.
    Elspeth, Knight-Errant (-8 ultimate): "Artifacts, creatures, enchantments, and lands you control
      are indestructible."
      → All your permanents gain indestructible for the rest of the game.
  EMBLEM RULES:
    The emblem's abilities are continuous or triggered effects, checked normally.
    Even if the planeswalker that created them is gone: emblems stay.
    "Emblem — Jace, Mind Sculptor" is the name but doesn't reference the Jace planeswalker.

INTERACTION: STEALING MONARCH/INITIATIVE IN MULTIPLAYER:
  In Commander (4 players): any player can steal the monarch by dealing combat damage.
  Player A is the monarch. Player B attacks Player A with a 1/1. 1/1 deals 1 combat damage.
  Player B becomes the monarch. Player C attacks Player B. Player C becomes the monarch.
  Etc. Monarchy passes around the table.
  Drawing extra cards each turn = powerful. Worth fighting for.
  Some decks use creatures with flying or evasion to guarantee hitting the monarch each turn.

TAKING THE INITIATIVE = VENTURE INTO UNDERCITY:
  "Whenever you take the initiative, venture into Undercity" means:
    If you take it, you get a free venture. PLUS each of your upkeeps: another venture.
    If you STEAL it from an opponent: they stop getting upkeep ventures; you start getting them.
  Undercity has specific rooms leading to powerful effects:
    Some rooms give card advantage, life gain, or create tokens.
    The path choices let you optimize for what you need.
```

## Definitive Conclusions

- **The monarch draws a card each end step** — very powerful; any creature dealing combat damage to the monarch steals it.
- **The initiative ventures into Undercity each upkeep** — AND ventures once when first taken; stolen by dealing ANY combat damage (one trigger per combat, not per creature).
- **Dungeons are out-of-game nontraditional cards** — brought in via "venture into the dungeon" effects; advancing through rooms triggers effects; completing allows starting a new dungeon.
- **Emblems can't be removed** — they exist in the command zone, not on the battlefield; removal spells, board wipes, and bounce effects don't affect them.
- **Neither monarch nor initiative requires you to attack** — holding both is powerful because you get card draw (monarch) and dungeon progress (initiative) just by maintaining them.

## Canonical Example
**Sefris of the Hidden Ways — Initiative and Dungeon Synergy:**
You control Sefris of the Hidden Ways ({1}{U}{B}{W}): "Whenever one or more creatures you control die, venture into the dungeon."
You also have the initiative (you took it from your last card: Caves of Chaos Adventurer).

Your upkeep begins:
  Initiative trigger: "venture into Undercity."
  You're currently in "Dungeon Level" (room 2 of Undercity). Two paths:
    Path A: "Forge" (create a 5/5 Golem artifact creature).
    Path B: "Stables" (create two 2/2 Horse creature tokens).
  You choose Path A: Forge. A 5/5 Golem token enters the battlefield under your control.

Later that turn, an opponent casts Wrath of God. All your creatures die.
  Sefris trigger: "whenever one or more creatures die": venture into the dungeon.
  Your venture marker advances one more room in Undercity.
  New room: "Lost Library" (mill 3 and put one into your hand).

Your end step (if monarch): you'd also draw a card.
But you don't have the monarch — just the initiative.
Note: you could seek to take the monarch too. Having both is extremely powerful:
  Monarch: +1 card per end step.
  Initiative: venture each upkeep (dungeon progress).

**Example 2 — Emblem Permanence After Planeswalker Dies:**
You control Elspeth, Knight-Errant ({2}{W}{W}: 4 loyalty). You've been activating her for years.
She reaches 8 loyalty. You activate her ultimate (-8): "You get an emblem with: artifacts, creatures, enchantments, and lands you control are indestructible."
The emblem goes to your command zone. Your ENTIRE board is now indestructible.

Opponent responds by... nothing can stop an emblem from being created (it's created as part of the ability resolving; you can't counterspell after the ability resolves).

Next turn: opponent casts Wrath of God. All creatures are destroyed.
But YOUR creatures have the emblem: "artifacts, creatures, enchantments, and lands you control are indestructible."
Indestructible prevents Wrath's "destroy" effect.
Your creatures survive. Opponent's creatures (no emblem) die.

What if opponent casts Merciless Eviction ({4}{W}{B})? "Choose one: exile all artifacts, exile all creatures..."
The emblem only gives indestructible, not exile protection.
Exile bypasses indestructible (see P335). Merciless Eviction exiles your creatures even with the emblem.

Can opponent destroy the emblem? No. The emblem is in the command zone. It's not a permanent, spell, or player. Effects targeting "permanents" or "spells" can't touch it. Effects targeting "players" can't touch it either. The emblem is effectively permanent for the rest of the game.

## Commonly Confused With
- **P330 (Commander Rules)** — Both emblems and commanders live in the command zone, but for different reasons. Commanders can be cast from the command zone (with tax). Emblems can't be cast — they're created and exist there until the game ends. Dungeons are also in the command zone while in use.
- **P339 (Dies Triggers)** — "Whenever a creature dies" effects in Sefris and similar cards interact with Wrath effects on boards with dungeon synergies. P339 covers the "dies" definition; P349 covers what dungeon ventured abilities do with those deaths.
- **P333 (Planeswalkers)** — Emblems are created by planeswalker ultimates. Once created, the emblem exists independently. If the planeswalker is killed after creating the emblem: the emblem remains. P333 covers planeswalker loyalty and ultimates; P349 covers what happens after the emblem is created.
