---
id: p278
name: Voting — Will of the Council and Council's Dilemma
category: multiplayer
cr_refs: [701.31, 701.31a, 701.31b, 701.31c, 701.31d, 701.31e, 701.31f]
tags: [voting, will-of-the-council, councils-dilemma, political, multiplayer, Conspiracy, Commander, Brago-King-Eternal, Tyrant-Choice, Expropriate, Illusion-of-Choice]
created: 2026-03-29
examples_count: 2
---

# P278 — Voting — Will of the Council and Council's Dilemma

## Abstract
Voting is a game action used in multiplayer Magic (primarily the Conspiracy sets). Cards with voting effects either use "Will of the Council" (majority vote wins) or "Council's Dilemma" (outcome depends on how many votes each option gets). In a voting scenario, each player casts exactly one vote from the listed options. For Will of the Council, the option with the most votes wins (ties go to the spell's controller). For Council's Dilemma, each option can trigger separately based on how many votes it received. Voting introduces political gameplay: lobbying, horse-trading, and strategic alliance-building to direct the outcome.

## The Definitive Rules

**CR 701.31a** (verbatim): *"Some spells and abilities instruct players to vote. To vote, each player, starting with a specified player and proceeding in turn order, chooses one option from a list specified by the spell or ability."*

**CR 701.31b** (verbatim): *"If the vote is a 'will of the council' vote, after all players have voted, the outcome with the most votes is chosen. If two or more outcomes are tied for the most votes, the controller of the spell or ability that instructed players to vote chooses one of the tied outcomes."*

**CR 701.31c** (verbatim): *"If the vote is a 'council's dilemma' vote, after all players have voted, for each outcome, the controller of the spell or ability that instructed players to vote either chooses a player who voted for that outcome or, if no player voted for it, nothing happens for that outcome. Then, each of those outcomes happens. If an outcome has players who voted for it but no player was chosen to be affected by it, that outcome doesn't happen."*

**CR 701.31d** (verbatim): *"If the vote has an "each player" vote, after all players have voted, each outcome happens for each player who voted for it. If no players voted for an outcome, that outcome doesn't happen."*

**CR 701.31e** (verbatim): *"A player may cast a spell, activate an ability, or take another game action that affects how another player votes. This can change the outcome of the vote."*

**CR 701.31f** (verbatim): *"If an effect says a player gets more than one vote, that player votes that many times."*

## The Pattern

```
VOTING SETUP:
  Voting spell/ability is cast. It specifies:
  1. Who votes (usually all players)
  2. What the options are (two or more named outcomes)
  3. Vote type: Will of the Council, Council's Dilemma, or Each Player

  VOTE ORDER:
    Starting with a specified player (usually the spell's controller or the active player)
    Proceeding in turn order (clockwise in multiplayer)
    Each player casts exactly one vote per voting effect
    Exception: effects that give a player extra votes (that player votes that many times)

WILL OF THE COUNCIL VOTES:
  Each player votes. After voting: the option with the most votes WINS.
  That option's effect is executed.
  Ties: the spell/ability controller chooses which tied option wins.
  Strategy: you control the tie-break! Cast Will of the Council spells when you want tie-break power.
  Political: ask opponents to vote with you ("I'll vote for X, you vote for X, then X wins")
  Treachery: promise one vote, deliver another (it's not binding)

COUNCIL'S DILEMMA VOTES:
  Each player votes. After voting: for EACH option, the caster chooses ONE player who voted for it.
  The chosen player receives that option's effect.
  If no one voted for an option: nothing happens for that option.
  Key: the caster chooses WHICH player gets the effect for each option voted.
  You can control the allocation of effects: give good effects to allies, bad effects to enemies.

EACH PLAYER VOTES:
  Each option's effect applies to each player who voted for it.
  No controller choice needed — each voter bears the consequence of their vote.

VOTING NOTABLE CARDS:

  WILL OF THE COUNCIL EXAMPLES (Conspiracy):
    Tyrant's Choice ({1}{R}, Sorcery, Will of the Council): "Vote for death or prey.
      Death: each opponent sacrifices a creature. Prey: each opponent loses 4 life."
      Voting: you want opponents to suffer maximum harm. Ask opponents who are behind to vote
      for the option that hurts the leader most. Political manipulation.
      Tie: you choose which option — guaranteeing your preferred outcome in a tie.

  COUNCIL'S DILEMMA EXAMPLES:
    Expropriate ({7}{U}{U}, Sorcery, Council's Dilemma): "Vote for time or money.
      For each time vote, each player other than the voter takes an extra turn after this one.
      For each money vote, the voter gains control of target permanent."
      Every player votes: time or money.
      You (as caster) want: as many extra turns as possible (vote time), or steal a permanent.
      Opponents: if they vote money, they're giving YOU the choice of which permanent to steal.
      If they vote time: everyone gets extra turns (you get extra turns too).
      Political: "vote for money so I take your worst permanent, not your best" (negotiation).
      Expropriate: one of the most powerful voting cards. At 9 mana: potentially multiple extra turns.

  EXTRA VOTES:
    Illusion of Choice ({U}, Instant): "Until end of turn, if you would vote, you vote an additional
      time and may change your votes." — you vote twice and can change them.
    Political tool: control the voting outcome by having more votes.

  VOTING + "VOTE FOR X OR Y":
    The listed options are always specific choices (not generic)
    Some options benefit opponents; some benefit the caster
    Reading what opponents want: propose options where all choices benefit you in some way

VOTING IN COMMANDER:
  4-player pod: 3 opponents + you voting.
  Will of the Council: 3 votes vs 1 (yours). You're outvoted unless you negotiate.
  Council's Dilemma: you allocate effects. Control who gets what.
  Voting becomes political currency: "Vote with me on X, I'll help you later"

VOTING MANIPULATION:
  Some effects allow changing votes:
    "Target player votes an additional time for [option]"
    "Players can't change their votes"
    "Each player votes one additional time for [specific option]"
  Giving opponents extra votes for bad options is powerful political control.
```

## Definitive Conclusions

- **Will of the Council: majority wins; ties go to the spell controller** — cast these when you want to win a tie.
- **Council's Dilemma: controller chooses which voter gets each option's effect** — gives you allocation control.
- **Extra votes from effects** stack additively — more votes = more influence.
- **Voting is purely political in multiplayer** — no rule forces players to honor verbal agreements.
- **Expropriate is the premier voting card** — 9 mana for potential extra turns AND permanent theft.

## Canonical Example
**Tyrant's Choice Political Maneuvering:**
4-player Commander game. You cast Tyrant's Choice ({1}{R}).
Death: each opponent sacrifices a creature. Prey: each opponent loses 4 life.
You vote: you want "death" (it destroys the biggest threats on the table).
Negotiate: "Player B, you're behind — vote Death, everyone's big creatures die."
Player B agrees: votes Death. You vote Death (2 for Death).
Players C and D both have big boards and don't want to sacrifice: vote Prey.
Tie: Death 2, Prey 2. You're the spell controller → you choose the tie! Pick Death.
Outcome: each opponent sacrifices a creature. Player C and D's best threats die.
Tie-break control transformed a 50-50 political gamble into a sure thing.

**Example 2 — Expropriate Extra Turns:**
You cast Expropriate ({7}{U}{U}) with 4 players.
Options: Time = extra turns for the voter's opponents. Money = caster steals a permanent.
You vote Time. (You want the extra turns other players give you.)
Opponent 1 (furthest behind) votes Time: everyone gets extra turns.
Opponent 2 (in the lead) votes Money: you steal a permanent (you choose which).
Opponent 3 (fearful of steals) votes Time.
Results:
Time votes (3): each player other than the time-voter takes an extra turn.
Opponent 1 voted Time: you take an extra turn (and opponent 2 and 3 do too, but that's fine).
You voted Time: opponent 1, 2, and 3 take extra turns (but you already have the lead).
Opponent 3 voted Time: same as above.
Money vote (1): Opponent 2 voted money. You (as caster) choose a permanent to steal from any player.
Choose Opponent 2's best creature. It's now yours.
End result: you stole their best permanent AND took extra turns from the Time votes.
Expropriate effectively gave you extra turns and permanent theft for 9 mana.

## Commonly Confused With
- **P217 (Goad)** — Goad forces creatures to attack other players; Voting requires players to make strategic choices about spell effects. Both are political multiplayer mechanics but different in kind.
- **P206 (Hidden Agenda)** — Hidden Agenda in Conspiracy sets is also political but is a face-down conspiracy card; Voting is an in-game action.
- **P038 (Monarch)** — Monarch is a designation that gives card advantage to the current holder; Voting directly modifies spell effects. Both create political dynamics.
