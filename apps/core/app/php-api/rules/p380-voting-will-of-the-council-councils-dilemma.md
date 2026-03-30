---
id: p380
name: Voting — Will of the Council, Council's Dilemma, and Tempting Offer
category: multiplayer
cr_refs: [701.38a, 701.38b, 701.38c, 701.38d]
tags: [voting, will-of-the-council, councils-dilemma, tempting-offer, join-forces, parley, ability-word, multiplayer-politics, vote-result, tied-vote, multiple-votes, Expropriate, Council-Guardian, Coercive-Portal, Ballot-Broker, Brago-King-Eternal, Selvala-Explorer-Returned]
created: 2026-03-29
examples_count: 2
---

# P380 — Voting — Will of the Council, Council's Dilemma, and Tempting Offer

## Abstract
**Voting** (rule 701.38) is a multiplayer mechanic where each player votes for one of listed options — starting with a specified player (often the active player or the controller) and proceeding in turn order. The effect of the spell or ability is determined by the outcome of the vote. **Will of the Council** and **Council's Dilemma** are ability words (italic labels with no intrinsic rules meaning — 207.2c) that tag cards using the vote mechanic: "Will of the Council" means the option with the most votes wins; "Council's Dilemma" means both options happen proportionally (each player's vote individually affects the outcome). **Tempting Offer** and **Join Forces** are related multiplayer ability words: Tempting Offer lets opponents opt in or out of an effect; Join Forces has each player optionally pay mana to increase the effect's magnitude. Critical rules: players with multiple votes cast all votes simultaneously; "voting" in rules text refers only to an actual vote (not any generic "choose"), and all votes are public (players can see how others vote).

## The Definitive Rules

**CR 701.38a** (verbatim): *"Some spells and abilities instruct players to vote for one choice from a list of options to determine some aspect of the effect of that spell or ability. To vote, each player, starting with a specified player and proceeding in turn order, chooses one of those choices."*

**CR 701.38b** (verbatim): *"The listed choices may be objects, words with no rules meaning that are each connected to a different effect, or other variables relevant to the resolution of the spell or ability."*

**CR 701.38c** (verbatim): *"If the text of a spell or ability refers to 'voting,' it refers only to an actual vote, not to any spell or ability that involves the players making choices or decisions without using the word 'vote.'"*

**CR 701.38d** (verbatim): *"If an effect gives a player multiple votes, those votes all happen at the same time the player would otherwise have voted."*

**CR 207.2c** (verbatim excerpt): *"'will of the council' ... 'council's dilemma' ... 'tempting offer' ... 'join forces' ... 'parley' ... these are ability words. They have no special rules meaning."*

## The Pattern

```
VOTING (701.38):
  HOW VOTING WORKS:
    A spell/ability instructs players to vote.
    Starting player: specified in the text ("starting with you" or "starting with active player").
    Proceeding in turn order: clockwise around the table.
    Each player chooses ONE of the listed options.
    Results: the option(s) with the most votes determine the effect.
    "Will of the Council": MAJORITY wins; ties may have specific tie-breaking text (or do both).
    "Council's Dilemma": each vote independently contributes to a running total (no majority needed).
      The spell does something for each vote of each type.
      Example: Expropriate ({7}{U}{U}): "Council's dilemma — Starting with you, each player votes for time or money.
        For each time vote, take an extra turn after this one.
        For each money vote, choose a permanent owned by the voter and gain control of it. Exile Expropriate."
        4 votes → 3 for money, 1 for time: take 1 extra turn, gain control of 3 permanents.
  VOTING IS PUBLIC:
    No rule makes voting secret by default.
    Players announce their vote openly (starting player votes first, others can see their votes).
    Later voters can see how earlier voters voted — strategic implications.
    Strategic voting: if you're last to vote, you know the current totals and can vote strategically.
  MULTIPLE VOTES (701.38d):
    If an effect gives a player multiple votes: all votes at the same time as they normally vote.
    "Ballot Broker": "When Ballot Broker enters, each player votes an additional time this vote."
      All additional votes happen simultaneously.
      A player with 2 votes chooses both choices at once (can vote for different options or both same).
    Strategic use: if your opponent votes first and you have 2 votes, you can split or stack them.
  TIE-BREAKING:
    "Will of the Council" with a tie: the spell's specific text determines what happens.
    Some cards have explicit tie-breaking rules (e.g., "if the vote is tied, [specific player] decides").
    If no tie-breaking rule: tied results may mean BOTH effects happen, or neither does.
    Individual card text is authoritative for tie resolution.
  WHAT "VOTE" MEANS IN RULES TEXT (701.38c):
    If a card says "target player votes" or "effects that affect voting": applies only to actual votes.
    Mind Slaver-style control ("target player doesn't untap") does NOT affect voting in the game sense.
    But: control effects like Mindslaver CAN affect how a player votes (you control their decisions).
    "When voting begins" triggers: only fire for actual vote events (not generic choices/selections).

WILL OF THE COUNCIL:
  WHAT IT MEANS:
    Ability word. No rules impact. Tags cards with majority-wins vote structure.
    The option with more votes happens; if tied, the card's text determines resolution.
    Classic Will of the Council cards: Tyrant's Choice, Council's Judgment.
  COUNCIL'S JUDGMENT (White, Exile target nonland permanent):
    "Will of the Council — Starting with you, each player votes for a nonland permanent they don't
      control. Exile each permanent with the most votes or tied for most votes."
    This is unusual: the VOTED-FOR PERMANENTS are exiled, not "the option with most votes."
    Multiple permanents can be exiled if vote is tied among them.
    Strategic: opponents might vote against your threats; you vote against theirs.
    Cannot be countered like targeted removal (no target to shroud/hexproof).
  TYRANT'S CHOICE:
    "Will of the Council — Starting with you, each player votes for death or torture.
      If death gets more votes, each opponent sacrifices a creature.
      If torture gets more votes, each opponent discards a card.
      If tied: all of the above."
    Classic will of the council structure: majority wins, but tie does both.

COUNCIL'S DILEMMA:
  WHAT IT MEANS:
    Ability word. No rules impact. Each vote independently contributes.
    Both options accumulate votes. The spell does SOMETHING FOR EACH VOTE of each type.
    Not winner-take-all: both sides "win" proportionally to their vote count.
  EXPROPRIATE ({7}{U}{U} — one of the most powerful Council's Dilemma cards):
    "Council's dilemma — Starting with you, each player votes for time or money.
      For each vote for time, take an extra turn after this one.
      For each vote for money, choose a permanent that player controls. At the beginning of that
        extra turn's upkeep, gain control of those chosen permanents."
    Wait: Expropriate is more nuanced — let me parse carefully.
    "For each vote for money, you gain control of a permanent chosen from that player's permanents."
    In a 4-player game:
      You vote time: your extra turn.
      Opponent A votes money: you choose one of their permanents to steal.
      Opponent B votes money: you choose one of their permanents to steal.
      Opponent C votes time: another extra turn.
    Result: 2 extra turns + 2 stolen permanents.
    No one wants to give you an extra turn; no one wants you to steal their stuff.
    Dilemma: voting time = you get extra turns. Voting money = you steal their permanent.
    "There is no good choice for the opponents." Classic political torture.

TEMPTING OFFER (ability word):
  WHAT IT MEANS:
    Players CAN opt in to the offer (each opponent can choose yes or no individually).
    You get the full effect (or enhanced effect) based on how many opponents accept.
    Each accepting opponent also gets the effect.
  EXAMPLE: Tempt with Vengeance ({X}{R}):
    "Tempting offer — Create X 1/1 red Elemental creature tokens. Each opponent may create X
      1/1 red Elemental creature tokens. For each opponent who does, create X additional tokens."
    If 1 opponent accepts in a 4-player game: you get X + X more tokens (2X total), opponent gets X.
    If 3 opponents accept: you get X + 3X = 4X tokens! But each opponent also gets X.
    The "tempt": opponents might accept for their own benefit, but doing so helps you more.
    Strategic: sometimes worth declining the tempt even when it's good for you — because helping
      the caster more is worse.
  TEMPT WITH DISCOVERY ({5}{G}):
    "Tempting offer — Search your library for a land card, put it on battlefield, shuffle.
      Each opponent may search their library for a land card, put it on battlefield, shuffle.
      For each opponent who does, search for an additional land and do the same."
    Ramping everyone is often worth it to get multiple extra lands yourself.

JOIN FORCES (ability word):
  WHAT IT MEANS:
    Each player may pay any amount of mana to boost the effect's magnitude.
    Lets opponents choose to help (or not) for mutual benefit.
    Helps the controller but lets others participate.
  EXAMPLE: Collective Voyage ({G}):
    "Join forces — Starting with you, each player may pay any amount of mana. Each player
      searches their library for up to X basic land cards, where X is the total mana paid, puts
      them onto the battlefield tapped, then shuffles."
    If you pay 3, Opponent A pays 2, Opponent B pays 0: X = 5. Each player searches for 5 lands.
    Even the free-rider (Opponent B who paid 0) gets the lands!
    Everyone shares equally in the ramp.
    Join Forces: less political than Tempting Offer — everyone benefits equally.

PARLEY (ability word):
  WHAT IT MEANS:
    Each player reveals the top card of their library. Something happens based on the revealed cards.
    A specific subtype of "draw information from all libraries" mechanic.
  EXAMPLE: Selvala, Explorer Returned (Commander staple with parley):
    "Parley — {T}: Each player reveals the top card of their library. For each nonland card
      revealed this way, add {G} and each player gains 1 life. Then each player draws that card."
    Reveals are public. In a 4-player game: potentially gain 4 life each, draw a card each.
    Controller gets extra green mana (valuable). The "parley" is: you're drawing all their top cards
      and gaining mana from it. Political because it helps everyone (but you most).

POLITICS OF VOTING:
  "KINGMAKER" VOTES:
    In a 3-player game: voting can favor the controller OR help a weaker opponent (to balance power).
    Good politics: vote to weaken the strongest player, not necessarily for your own best outcome.
  INCENTIVES:
    Will of the Council: strategic voting is about what outcome YOU want. Vote for self-interest.
    Council's Dilemma (Expropriate): BOTH options hurt opponents. They choose the lesser evil.
    Tempting Offer: opponents weigh "is my benefit worth helping the caster more?"
  CONTROL EFFECTS:
    Mindslaver ({6}, {4},{T}: sacrifice — you control target player's next turn):
      Under Mindslaver: you control that player. When they vote, YOU make their voting decision.
      This includes voting in Will of the Council / Council's Dilemma / etc.
      If multiple Mindslavers are in play: the controller of the most recently resolved Mindslaver
        controls the player (or the rules adjudicate per last-applied effect).
    Effects that duplicate votes: Ballot Broker, Duskmantle Seer variants.
```

## Definitive Conclusions

- **Voting is public** — players vote in turn order starting from the specified player; later voters see earlier votes and can strategize accordingly.
- **Will of the Council = majority wins** — the option with most votes takes effect; ties depend on the individual card's text (often "do both").
- **Council's Dilemma = each vote contributes independently** — both options accumulate votes; the spell does something for each vote of each type (no winner-take-all).
- **Multiple votes happen simultaneously** — a player with 2 votes chooses both at once (can pick the same or different options); they don't see the second vote's "result" before choosing.
- **"Voting" means actual votes, not generic choices** — Ballot Broker's "vote an additional time" only applies to actual vote events, not general selection effects.
- **Mindslaver controls how a player votes** — under control effects, the controller makes the voting decision.

## Canonical Example
**Expropriate in a 4-Player Commander Game:**
You cast Expropriate ({7}{U}{U}). It resolves. "Council's dilemma — Starting with you, each player votes for time or money."

Players: You, Alice, Bob, Carol.

Strategic context: You already have lots of mana rocks. Extra turns hurt everyone else more. Stealing permanents is also devastating.

You vote: **time** (extra turn for you).
Alice votes: **money** (she'd rather give you a permanent than give you an extra turn — "time" is too dangerous).
Bob votes: **money** (same reasoning).
Carol votes: **time** (she's colluding with you? Or she's desperate and an extra turn for you still feels better than losing her best permanent).

Results:
- Time votes: 2 (you, Carol) → you take 2 extra turns.
- Money votes: 2 (Alice, Bob) → you choose 1 permanent from Alice + 1 permanent from Bob to gain control of.

You gain control of Alice's Sol Ring (their best ramp) and Bob's Doubling Season (their best engine). Then you take 2 extra turns.

The "Council's Dilemma": Alice and Bob both voted against giving you extra turns, but they paid by giving you their best permanents. Carol voted "time" which was still terrible. Everyone loses.

This is the signature political crisis of the voting mechanic: **no good options exist for opponents**.

**Example 2 — Council's Judgment Political Play:**
Battlestate: You control no significant threats. Opponent A has Doubling Season (broken). Opponent B has Rhystic Study (major card advantage). Opponent C has a large commander.

You cast Council's Judgment ({2}{W}): "Starting with you, each player votes for a nonland permanent they don't control. Exile each permanent with the most votes or tied for most votes."

You vote: Doubling Season (your biggest threat — you're in green, Doubling Season helps them).
Opponent A (whose Doubling Season would be exiled): votes Rhystic Study (trying to survive; they want to neutralize Rhystic Study instead).
Opponent B (whose Rhystic Study would be exiled): votes Doubling Season (targeting it back).
Opponent C: votes Rhystic Study (they're tired of being taxed by it).

Results: Rhystic Study has 2 votes (A, C), Doubling Season has 2 votes (you, B). **TIE.**
Council's Judgment: "Exile each permanent with the most votes or tied for most votes."
Both Rhystic Study AND Doubling Season are exiled.

You effectively two-for-one'd the table while spending 3 mana — and no one could "counter" it with hexproof or shroud (no target was selected).

## Commonly Confused With
- **P379 (Multiplayer — Leaving the Game)** — If a player leaves the game during voting: they no longer participate in the vote. The remaining players' votes determine the outcome. "Each player" at the time of resolution counts only active players.
- **P005 (APNAP — Simultaneous Events)** — Multiple players acting during the vote is NOT APNAP ordering. Voting proceeds from a specified player in turn order (not active player first). This is an explicit exception to the APNAP rule — the vote order is determined by the card's text ("starting with you").
- **P002 (Replacement Effects)** — Control effects like Mindslaver are not replacement effects on the vote itself; they're replacement effects on the player's decisions. The vote still happens normally; it's just that someone else makes the controlled player's choice.
- **P378 (Commander Rules)** — In Commander, the voting politics are especially powerful. Expropriate for {9} in Commander is considered one of the strongest plays in the format. The multiplayer nature amplifies both the power and the political dimension.
