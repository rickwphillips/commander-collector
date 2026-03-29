---
id: p379
name: Multiplayer — Leaving the Game, Opponent Definition, and Shared Effects
category: multiplayer
cr_refs: [800.4a, 800.4b, 800.4c, 800.4d, 800.4g, 800.4j, 800.4m, 103.4, 101.4]
tags: [multiplayer, leaving-the-game, opponent, owned-objects-leave, control-effects-end, tokens-leave-with-owner, Bribery-ruling, Act-of-Treason-ruling, each-opponent, targeted-opponent, Commander-multiplayer, free-for-all, priority-when-player-leaves]
created: 2026-03-29
examples_count: 2
---

# P379 — Multiplayer — Leaving the Game, Opponent Definition, and Shared Effects

## Abstract
In multiplayer games (rule 800), when a player **leaves the game** (800.4a), all objects they own leave with them — but objects they merely CONTROLLED (not owned) are handled differently. Objects currently controlled by the leaving player that are in exile are exiled (removed from game in practice); objects on the stack not represented by cards cease to exist. Effects giving them control of other players' objects end (those objects revert to original controllers). The definition of **"opponent"** in multiplayer is anyone else currently in the game — relevant for "each opponent" effects and political considerations. Crucially: objects OWNED by a leaving player (cards from their deck) leave the game; objects they temporarily controlled (via Act of Treason, Bribery, etc.) follow specific rules about ownership.

## The Definitive Rules

**CR 800.4a** (verbatim): *"When a player leaves the game, all objects owned by that player leave the game and any effects which give that player control of any objects or players end. Then, if that player controlled any objects on the stack not represented by cards, those objects cease to exist. Then, if there are any objects still controlled by that player, those objects are exiled."*

*Example (verbatim): "Alex casts Mind Control, an Aura... on Bianca's Assault Griffin. If Alex leaves the game, so does Mind Control, and Assault Griffin reverts to Bianca's control. If, instead, Bianca leaves the game, so does Assault Griffin, and Mind Control is put into Alex's graveyard."*

*Example (verbatim): "Alex casts Bribery... targeting Bianca. Alex puts Serra Angel onto the battlefield from Bianca's library. If Bianca leaves the game, Serra Angel also leaves the game. If, instead, Alex leaves the game, Serra Angel is exiled."*

**CR 800.4b** (verbatim): *"If an object would change to the control of a player who has left the game, it doesn't. If a token would be created under the control of a player who has left the game, no token is created. If an object would be put onto the battlefield or onto the stack under the control of a player who has left the game, that object remains in its current zone."*

**CR 800.4d** (verbatim): *"If an object that would be owned by a player who has left the game would be created in any zone, it isn't created. If a triggered ability that would be controlled by a player who has left the game would be put onto the stack, it isn't put on the stack."*

**CR 800.4m** (verbatim): *"When a player leaves the game, objects that last 'until that player's next turn' or 'until a specific point in that turn' will last until that turn would have begun. They neither expire immediately nor last indefinitely."*

## The Pattern

```
WHEN A PLAYER LEAVES THE GAME:
  SEQUENCE (800.4a):
    Step 1: All objects OWNED by that player leave the game (their cards, tokens they created).
      "Owned" = from their deck. Tokens owned by the leaving player (they created them) leave.
      Tokens created under opponents' control by the leaving player: these are owned by the leaving player.
        Wait: token ownership = player whose effect created it (111.2).
        If the leaving player's effect created tokens that other players control: those tokens
          are OWNED by the leaving player. They leave the game.
    Step 2: Effects giving that player CONTROL of objects or players end.
      "Act of Treason"-type effects: end. Stolen creatures revert.
      Enchantments like Mind Control (giving that player control of another's creature): leave game.
        The enchanted creature reverts to its owner's control.
    Step 3: Objects on the stack not represented by cards that were controlled by the leaving player
      cease to exist. (Tokens on the stack, copy effects, etc.)
    Step 4: Objects STILL controlled by that player after steps 1-3 are exiled.
      This catches any objects not handled by the above (e.g., via Bribery — the stolen creature
      is still controlled by the leaving player → exiled).
  OWNERSHIP vs. CONTROL:
    KEY DISTINCTION:
    Objects OWNED by the leaving player → leave the game.
    Objects CONTROLLED by the leaving player (but owned by others) → exiled (step 4) if still around.
    Objects controlled by the leaving player via effects → those effects end (step 2). Objects revert.
    Example: You used Bribery to steal their Serra Angel (now you own the Serra Angel? No):
      Bribery: "put that card onto the battlefield under your control." The card is still owned by Bianca.
      When Alex (who cast Bribery) leaves: control effect via Bribery ends? Actually:
        Bribery creates a permanent change of control (it's not a temporary "control until end of turn").
        Wait: Bribery says "under your control" with no duration. It's a permanent control change.
        But the CR example says: "If Alex leaves the game, Serra Angel is exiled."
        This is step 4: after steps 1-3, Serra Angel is still controlled by Alex (permanent control change).
        Serra Angel is owned by Bianca (in Bianca's deck). Alex leaving: Angel is exiled (step 4).
      If Bianca leaves instead: Serra Angel is owned by Bianca → leaves the game (step 1). Mind Control
        goes to Alex's GY (it's an enchantment Alex cast, owned by Alex).
  "EACH OPPONENT" IN MULTIPLAYER:
    "Each opponent loses 1 life": in a 4-player game, 3 opponents all lose 1 life.
    "Target opponent": you choose one opponent.
    "All opponents": = each opponent.
    When a player LEAVES: they're no longer an opponent. "Each opponent" at the time of resolution
      counts only players currently in the game.
    Example: You cast Plague Wind (destroy all creatures opponents control) in a 4-player game.
      While it's on the stack: 3 opponents, 15 creatures across their boards.
      Player 2 leaves the game. Their 5 creatures leave with them.
      Plague Wind resolves: "each opponent" = 2 remaining opponents. Destroy their 10 creatures.
      Player 2's creatures are already gone (they left).
  PRIORITY WHEN ACTIVE PLAYER LEAVES (800.4j):
    If the active player leaves the game during their turn: the turn continues without an active player.
    No active player: if active player would get priority → next player in turn order gets it instead.
    Or: top of stack resolves. Or: phase/step ends.
    The turn completes, then the game proceeds normally.
  "UNTIL THAT PLAYER'S NEXT TURN" EFFECTS (800.4m):
    If an effect lasts "until your next turn" and you leave the game:
    The effect lasts until that turn WOULD HAVE BEGUN. Then expires.
    Example: "Until your next turn, target player can't attack you." You then leave the game.
      The effect lasts until the turn that would have been yours.
      Not immediately. Not forever.

OPPONENT DEFINITION:
  WHO IS AN "OPPONENT":
    In a normal game: exactly one opponent (the other player).
    In multiplayer: all other players in the game.
    "An opponent" = any single player who isn't you.
    "Each opponent" = all of them.
    "Any target" includes opponents (and you, if legal).
  TEAMMATE vs. OPPONENT:
    In team formats (Two-Headed Giant): teammates are NOT opponents.
    "Each opponent loses 2 life" in 2HG: each member of the opposing team loses 2 life.
      Or: the opposing TEAM loses life (team shares life total in 2HG? No, they share life total).
      Actually in 2HG: "each opponent" means each player on opposing teams.
  "ANY PLAYER":
    "Any player" = you OR an opponent. You can be targeted by effects targeting "any player."
    Important: burn spells targeting "any target" include yourself.
    Redirecting damage to yourself: "any target" spells can target you.

TOKENS AND LEAVING:
  TOKENS OWNED BY LEAVING PLAYER:
    "Token owner = controller when created" (111.2, approximately).
    If Alex creates tokens (e.g., Goblin tokens from Krenko): those tokens are owned by Alex.
    Alex leaves → tokens owned by Alex leave the game.
    BUT: if Alex created tokens via a triggered ability of a creature he controls that entered
      the game via Bribery (he controls, Bianca owns): the tokens... Alex cast the Bribery spell,
      created the creature under his control → Alex creates the tokens → Alex owns the tokens.
      Alex leaves → those tokens also leave.
    Contrast: Genesis Chamber (Alex owns it) creates tokens for each player who has a creature enter.
      "That creature's controller creates a Myr token": the CREATURE'S CONTROLLER creates the token.
      If Bianca's creature enters: Bianca creates the Myr token under Bianca's control. Bianca owns it.
      If Alex leaves: Genesis Chamber leaves (Alex owns it). Myr tokens created under other players'
        control by Genesis Chamber stay (owned by those other players).
      CR 800.4a example confirms: "all such Myr tokens that entered the battlefield under Alex's
        control leave the game, and all such Myr tokens that entered the battlefield under any other
        player's control remain in the game."
```

## Definitive Conclusions

- **Objects OWNED by a leaving player leave the game; objects CONTROLLED but owned by others are exiled** — this distinction is critical: a Bribery target gets exiled when the Bribery caster leaves (because they controlled it via the effect), but reverts if the original owner leaves and the control effect was temporary.
- **Tokens follow their owner** — tokens created by the leaving player's effects leave the game, even if currently controlled by other players.
- **"Each opponent" counts players currently in the game at resolution** — if a player left before the spell resolves, they're not counted.
- **Effects lasting "until your next turn" don't expire immediately when you leave** — they last until that turn would have been your turn, then expire.
- **Priority passes to the next player when the active player leaves** — the turn continues to completion; the game proceeds normally after.

## Canonical Example
**Bribery Target After Caster Leaves:**
4-player Commander game: Alex, Bianca, Carol, Dan.
Alex casts Bribery targeting Bianca: Alex searches Bianca's library for a creature (finds Elesh Norn, Grand Cenobite), puts it on the battlefield under Alex's control.
Elesh Norn is OWNED by Bianca but CONTROLLED by Alex.

Scenario A: Alex loses the game (life total reaches 0) and leaves.
  Step 1: Objects owned by Alex leave. (Alex's cards, tokens he created, his deck's contents.)
  Step 2: Effects giving Alex control of objects end. But Bribery's effect is permanent control change...
    Actually: Bribery doesn't have an "end" condition. It's a permanent control change (not "until end of turn").
    Step 2 applies to ongoing effects. Permanent control changes (like Bribery's) might not qualify.
    But: step 4 still applies — objects still controlled by Alex are exiled.
  Elesh Norn is still controlled by Alex (permanent control change). Not owned by Alex.
  Step 4: Elesh Norn is exiled.
  Result: Elesh Norn goes to exile (not Bianca's battlefield, not Bianca's GY).
    The card is in exile. It's not lost from the game (it's Bianca's card in exile — she owns it).
    But Bianca likely can't get it back easily.

Scenario B: Bianca loses the game and leaves.
  Step 1: Objects owned by Bianca leave the game.
  Elesh Norn is owned by Bianca. It leaves the game.
  Also: Mind Control (if it's on Elesh Norn via another effect) goes to the GY of its owner.
  Result: Elesh Norn is gone (Bianca's card). Alex still controls... nothing now (Elesh Norn is gone).

This distinction matters: who leaves the game determines what happens to stolen permanents.

**Example 2 — "Each Opponent" During Player Loss:**
Carol controls Liliana of the Veil, activating the +1: "Each player discards a card." This is "each player" (not "each opponent"), so even Carol discards.
But later, Carol casts Windfall in a 4-player game: "Each player discards their hand, then draws that many cards."
Dan loses the game before Windfall resolves (is killed by commander damage just before resolution).
Windfall resolves: "each player" = Alex, Bianca, Carol. Dan is gone. Dan doesn't discard or draw.
Dan's board state: gone. Dan's players is gone.

Different scenario: Carol's Consecrated Sphinx: "Whenever an opponent draws a card, you may draw two."
Player count: Alex, Bianca, Carol, Dan.
As long as Carol is in the game: each time ANY opponent draws, she may draw 2.
Dan leaves: Dan was an opponent. Now: only Alex and Bianca draw cards that trigger Sphinx.
The "opponents" for Sphinx checks are only players currently in the game when the trigger fires.

## Commonly Confused With
- **P003 (Zone Change — New Object)** — When objects leave the game with a player, they're removed from the game entirely (not a zone change in the traditional sense). Objects in exile that leave the game via player-departure don't trigger "when a card leaves exile" effects because leaving the game is not the same as changing zones within the game.
- **P378 (Commander Rules)** — In Commander, when a player leaves, their commander's permanent command zone designation might matter. The commander still "leaves the game" with all their cards (803.4a applies in Commander). Any cards sent to command zone by the leaving player? Command zone is the leaving player's cards; they leave with that player.
- **P363 (Tokens)** — Tokens owned by the leaving player leave the game. Tokens can't go to other zones anyway (they cease to exist outside the battlefield), but the "leaving with owner" rule adds another reason they're gone. Tokens owned by other players that are currently on the battlefield remain (they're not owned by the leaving player).
- **P005 (APNAP — Simultaneous Triggers)** — When a player leaves the game, triggered abilities they would put on the stack are not put on the stack (800.4d). The APNAP order for triggers doesn't include the leaving player's triggers.
