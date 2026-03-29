---
id: p014
name: Player Control
category: multiplayer
cr_refs: [722.1, 722.3, 722.4, 722.5, 722.5a, 722.5b, 722.6]
tags: [mindslaver, player-control, decisions, choices, resources, concede, tournament, commander]
created: 2026-03-28
examples_count: 3
---

# P014 — Player Control

## Abstract
Some effects allow one player to control another player for a turn. This transfers all in-game decision-making authority to the controlling player — what to cast, what to target, how to attack, all "may" choices — but does not transfer control of any objects. The controlled player's permanents remain theirs; only the decisions about how to use them are transferred. Strict limits apply: the controller cannot use their own resources for the controlled player, cannot force a concede, and cannot make any decision that isn't required or permitted by in-game rules.

## The Definitive Rule

**CR 722.3**: *"Only control of the player changes. All objects are controlled by their normal controllers. A player who's being controlled during their turn is still the active player."*

**CR 722.5**: *"While controlling another player, a player makes all choices and decisions the controlled player is allowed to make or is told to make by the rules or by any objects."*

**CR 722.5a**: *"The controller of another player can use only that player's resources (cards, mana, and so on) to pay costs for that player."*

**CR 722.5b**: *"The controller of another player can't make choices or decisions for that player that aren't called for by the rules or by any objects. The controller also can't make any choices or decisions for the player that would be called for by the tournament rules."*

**CR 722.6**: *"The controller of another player can't make that player concede. A player may concede the game at any time, even if they are controlled by another player."*

## The Pattern

```
WHAT TRANSFERS:
  ✓ All in-game choices and decisions (722.5)
  ✓ What spells to cast, what to target
  ✓ How to attack, what to attack (player/planeswalker/battle)
  ✓ How to assign combat damage
  ✓ All "may" choices — activating optional abilities, paying optional costs
  ✓ Discard choices at end of turn cleanup
  ✓ Visibility of hand and face-down permanents (722.4)

WHAT DOES NOT TRANSFER:
  ✗ Control of permanents — still controlled by normal controllers (722.3)
  ✗ Controller's own resources — can only spend controlled player's resources (722.5a)
  ✗ Concede decision — controlled player retains this unconditionally (722.6)
  ✗ Tournament/meta decisions — restroom, judge calls, draws, trades (722.5b)
  ✗ Choices not called for by rules or objects (722.5b)

INFORMATION:
  ✓ Controller sees hand and face-down permanents of controlled player (722.4)
  ✗ Controller cannot see cards outside the game (sideboard, etc.) (722.4)
```

## Definitive Conclusions

- **All in-game decisions belong to the controller.** Every cast, target, attack declaration, damage assignment, and optional choice is made by the controlling player.
- **Objects stay under their normal controller.** The permanents aren't yours — you just decide how they're used.
- **Spending resources:** You spend their mana, their cards, their life. Not yours.
- **You can make them attack with all their creatures** into an unfavorable board to destroy their army.
- **You can cast their combo pieces badly** — target the wrong things, pay Phyrexian mana costs in life, search up useless tutors, float mana into nothing.
- **You can force them to discard** their best cards at end of turn cleanup if they're over hand size.
- **Multiple player-control effects overwrite each other** — last created wins (722.1a).
- **A skipped turn delays the effect** — it waits for the next actual turn (722.1b).
- **The controlled player is still "active player"** for all purposes — their triggers trigger, their SBAs apply, APNAP applies to their abilities.

## Canonical Example
**Mindslaver (6, Legendary Artifact): {4}{T}, Sacrifice Mindslaver: You control target player during that player's next turn.**

Opponent's turn begins. You control all their decisions:
- Declare their creatures as attackers into your blockers — their creatures die in combat
- Cast their Demonic Consultation from hand: name a card not in their deck — exile their entire library
- Tap all their lands and rocks for mana at the beginning of their main phase, float it until end of step where it evaporates
- During cleanup: discard their best cards to hand size

Result: their board is gone, their hand is gone, their library may be gone. They get their turn back technically — with nothing left to work with.

**The Infinite Lock (Commander):** Mindslaver + Academy Ruins. Control their turn, then use Academy Ruins during their turn to return Mindslaver to top of your library. Draw it next turn. Repeat. Opponent never gets a free turn.

## Additional Examples

**Example 2 — Opposition Agent + Fetchland:**
Opposition Agent has flash and a limited player-control effect during library searches. Opponent activates a fetchland. You control their search: you make them find the land they wanted, but the Agent exiles it instead of putting it onto the battlefield. You may play that land later. The Agent's control is limited to the library search window only (CR 722.5 context: "it's unlikely the player will be allowed to make any decisions other than what to find with the search").

**Example 3 — Opposition Agent + Tutors:**
Opponent casts Demonic Tutor. You control their library search. Quality restriction: "a card" (no qualifier) → they must find exactly one card. You choose which card they find (and exile it, granting you play permission). Their tutor found nothing useful for them.

**Nuance — "May find nothing":** If the search instruction specifies a card *type or quality* ("search for a basic land card"), you may have them find nothing. This is because finding a card matching a quality is optional. If it's "search for a card" with no qualifier, you must find the specified number.

## Commonly Confused With
- **Control-changing effects (Layer 2)** — Taking control of a *permanent* is a layer 2 continuous effect (P004). Taking control of a *player* is an entirely different mechanism (CR 722) and doesn't go through the layer system at all.
- **P005 (Simultaneous Event Ordering)** — APNAP applies normally during a controlled turn; the controlled player is still the active player. P005 still governs trigger ordering.
