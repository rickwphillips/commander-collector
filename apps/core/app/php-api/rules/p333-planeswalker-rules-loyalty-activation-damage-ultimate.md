---
id: p333
name: Planeswalker Rules — Loyalty Counters, One Activation Per Turn, Attacking, Damage, and Ultimates
category: continuous
cr_refs: [306.1, 306.4, 306.5, 306.5b, 306.5c, 306.5d, 306.6, 306.7, 306.8, 306.9, 606.1, 606.3, 606.4, 606.6]
tags: [planeswalker, loyalty, loyalty-ability, activation-restriction, attacking-planeswalker, damage-removes-counters, 0-loyalty-dies, ultimate, legendary-planeswalker, redirect-removed, proliferate-loyalty, Jace-Mind-Sculptor, Liliana-of-the-Veil, Teferi-Hero-of-Dominaria]
created: 2026-03-29
examples_count: 2
---

# P333 — Planeswalker Rules — Loyalty Counters, One Activation Per Turn, Attacking, Damage, and Ultimates

## Abstract
**Planeswalkers** are permanents with **loyalty counters** representing their power level. Their abilities are **loyalty abilities** — activated abilities with loyalty symbols as costs. A player may activate only **one loyalty ability per planeswalker per turn**, and only during their main phase with an empty stack. Loyalty abilities aren't instant or sorcery speed in the ordinary sense — they have specific timing restrictions. **Damage to planeswalkers removes loyalty counters.** When a planeswalker has 0 loyalty, it goes to the GY as an SBA. Planeswalkers are subject to the **legendary rule** (not the old "planeswalker uniqueness rule"). Ultimates are just high-cost loyalty abilities — powerful but not inherently uncounterable.

## The Definitive Rules

**CR 306.5b** (verbatim): *"A planeswalker has the intrinsic ability 'This permanent enters with a number of loyalty counters on it equal to its printed loyalty number.' This ability creates a replacement effect (see rule 614.1c)."*

**CR 306.5d** (verbatim): *"Each planeswalker has a number of loyalty abilities, which are activated abilities with loyalty symbols in their costs. Loyalty abilities follow special rules: A player may activate a loyalty ability of a permanent they control any time they have priority and the stack is empty during a main phase of their turn, but only if none of that permanent's loyalty abilities have been activated that turn."*

**CR 306.8** (verbatim): *"Damage dealt to a planeswalker results in that many loyalty counters being removed from it."*

**CR 306.9** (verbatim): *"If a planeswalker's loyalty is 0, it's put into its owner's graveyard. (This is a state-based action.)"*

**CR 606.3** (verbatim): *"A player may activate a loyalty ability of a permanent they control any time they have priority and the stack is empty during a main phase of their turn, but only if no player has previously activated a loyalty ability of that permanent that turn."*

**CR 606.6** (verbatim): *"A loyalty ability with a negative loyalty cost, taking into account any additional costs, can't be activated unless the permanent has at least that many loyalty counters on it."*

**CR 306.4** (verbatim): *"Previously, planeswalkers were subject to a 'planeswalker uniqueness rule' that stopped a player from controlling two planeswalkers of the same planeswalker type. This rule has been removed and planeswalker cards printed before this change have received errata in the Oracle card reference to have the legendary supertype. Like other legendary permanents, they are subject to the 'legend rule' (see rule 704.5j)."*

## The Pattern

```
PLANESWALKER BASICS:
  Card type: Planeswalker (has subtype like "Planeswalker — Jace").
  Enters with loyalty counters equal to printed loyalty (bottom right number).
  Sits on battlefield as a permanent. Can be attacked, targeted, damaged.

LOYALTY ABILITY TIMING (CR 606.3):
  Can ONLY activate a loyalty ability:
    1. During YOUR main phase.
    2. While the stack is empty.
    3. If NO loyalty ability of this planeswalker has been activated THIS TURN.
  ONE activation per planeswalker per turn.
    You can't activate two loyalty abilities of the same planeswalker in one turn.
    Even if the first ability added counters and now a "higher" ability is accessible: only one per turn.
    Different planeswalkers: can activate each one once per turn.
  Timing is SORCERY-SPEED equivalent: main phase, stack empty (CR 307.5).
    But: not because they're sorceries. It's a unique rule for loyalty abilities.
  CANNOT activate loyalty abilities at instant speed.
    Exception: if an effect says "you may activate loyalty abilities at instant speed" (Teferi, etc.).
    Teferi, Temporal Archmage: ultimate gives emblem "you can activate planeswalker loyalty abilities at instant speed." Then you can activate during combat, end step, etc.

LOYALTY COST MECHANICS:
  Positive loyalty abilities ([+1], [+2], [+X]): add that many loyalty counters as cost + effect.
  Negative loyalty abilities ([-2], [-5], [-14]): remove that many counters as cost.
  Zero loyalty abilities ([0]): no counter change.
  REQUIREMENT: negative ability requires that many counters to exist (CR 606.6).
    Jace, the Mind Sculptor at 3 loyalty: can activate [+2] (goes to 5), [0] (stays at 3), [-1] (goes to 2).
    Cannot activate [-12] (needs 12 loyalty). That's Jace's ultimate.
  HOW TO BUILD TO AN ULTIMATE:
    Activate the + ability each turn (assuming it survives). After several turns: enough loyalty.
    Proliferate: add a loyalty counter → get to the ultimate faster.
    Doubling Season: enters with TWICE the printed loyalty (the replacement effect doubles counters).
      Planeswalker with 3 printed loyalty enters with 6 (3 × 2 from Doubling Season).
      An ultimate at -6 can be activated immediately on entry if Doubling Season is in play.

DAMAGE TO PLANESWALKERS:
  CR 306.8: damage → remove that many loyalty counters.
  When loyalty reaches 0 → SBA puts it in the GY (CR 306.9).
  REDIRECTED DAMAGE (REMOVED RULE):
    CR 306.7 notes that the OLD rule allowed damage to opponents to be redirected to planeswalkers.
    That rule has been removed (as of Magic core rules update).
    Modern cards that deal damage "to any target" explicitly include planeswalkers in target options.
    Example: Shock ({R}): "deal 2 damage to any target." Can target a planeswalker directly.
    "Deal 3 damage to target player or planeswalker" — old wording style.
    "Deal 3 damage to any target" — new wording, covers players, creatures, and planeswalkers.
  COMBAT DAMAGE to planeswalkers:
    Attack the planeswalker (declare it as the attack target instead of the defending player).
    Unblocked attackers deal combat damage to the planeswalker (remove loyalty counters).
    Defending player can block with creatures to prevent the damage.
    The planeswalker itself doesn't deal combat damage back (unlike creatures).

ATTACKING PLANESWALKERS (CR 306.6):
  Planeswalkers can be attacked.
  When declaring attackers: instead of attacking a player, attack one of their planeswalkers.
  The DEFENDING PLAYER is still the player who controls the planeswalker.
  That player can block with their creatures (the planeswalker itself can't fight back).
  Trample vs planeswalker: if attacker has trample and is blocked with a 1/1:
    Assign 1 damage to the 1/1 (lethal), trample the rest to the planeswalker (removes loyalty counters).
  Deathtouch attacker vs planeswalker: deathtouch only "kills" creatures.
    A deathtouch creature doing combat damage to a planeswalker: removes loyalty counters normally.
    Deathtouch doesn't "kill in one hit" planeswalkers (no toughness to compare to, just loyalty).

PLANESWALKER AND LEGENDARY RULE:
  CR 306.4: planeswalkers are legendary. Subject to the legend rule (CR 704.5j).
  If you control two Jace, the Mind Sculptors: SBA checks → both have the same legendary name.
    Choose one to keep. The other goes to the GY.
  This is the same as the legendary rule for creatures.
  OLD RULE (removed): "planeswalker uniqueness rule" prevented two of the same SUBTYPE.
    Now: planeswalkers have the legendary supertype. The regular legend rule applies (same NAME, not same subtype).

ULTMATES — JUST HIGH-COST LOYALTY ABILITIES:
  An "ultimate" is informal. There's no rules term "ultimate."
  It's just a loyalty ability with a high negative cost (usually called "−X" where X is very high).
  Ultimates go on the STACK when activated (like all loyalty abilities) and CAN be countered.
  There's no "once ultimate is on the stack, nothing can stop it" rule.
  A player CAN activate a loyalty ability in response to an ultimate (before it resolves).
  The planeswalker can be destroyed in response to its own ultimate being on the stack.
    Destroying the planeswalker while the ultimate is on the stack: the ultimate still resolves.
    (The source of the ability is gone, but the ability is already on the stack and will resolve.)
  COMMON ULTIMATES:
    Jace, the Mind Sculptor [-12]: "Exile all cards from target player's library, then that player shuffles their hand into their library." → "Mill everything, then make them draw nothing." Win condition.
    Liliana of the Veil [-6]: "Separate all permanents on the battlefield into two piles. Target player sacrifices all permanents in the pile of their choice."
    Garruk Wildspeaker [-4]: "You get an emblem with 'Creatures you control have trample.' Creatures you control get +3/+3 until end of turn." Low loyalty, very accessible.
    Teferi, Hero of Dominaria [-8]: "You get an emblem with 'Whenever you draw a card, exile target permanent an opponent controls.'"

PROLIFERATE AND PLANESWALKERS:
  Loyalty counters are regular counters. Proliferate adds one loyalty counter.
  If you proliferate while a planeswalker has 5 loyalty → 6 loyalty.
  This accelerates ultimates.
  Atraxa, Praetors' Voice: proliferate at end of each turn → all your planeswalkers grow.
  Doubling Season: "If an effect would put one or more counters on a permanent you control, it puts twice that many instead."
    Planeswalker enters with printed loyalty (a replacement effect). Doubling Season doubles those entering counters.
    If Doubling Season is in play when planeswalker enters: enters with 2× printed loyalty.
    Allows immediate ultimate activation in many cases.

CARTH THE LION AND LOYALTY COSTS:
  Carth the Lion: "Planeswalkers your opponents control enter with one fewer loyalty counter on them. Planeswalkers' loyalty abilities you control cost an additional [+1] to activate."
  Carth modifies the COST of your planeswalkers' loyalty abilities:
    A [+1] becomes [+2]: you add 2 loyalty instead of 1.
    A [-2] becomes [-1]: you remove 1 loyalty instead of 2.
    A [-6] becomes [-5]: you remove 5 instead of 6.
    This makes ultimates easier to reach (with + abilities gaining more loyalty)
    and makes negative abilities cost less loyalty.
```

## Definitive Conclusions

- **One loyalty ability activation per planeswalker per turn** — sorcery speed (main phase, stack empty), regardless of the ability's type.
- **Damage to a planeswalker removes loyalty counters** — when 0 loyalty, it's GY as an SBA.
- **Planeswalkers are legendary** — subject to the legend rule (not the old "planeswalker uniqueness rule" by subtype).
- **Ultimates are just high-cost loyalty abilities** — they go on the stack, can be countered, and the source being destroyed doesn't prevent the ability from resolving.
- **Doubling Season lets planeswalkers enter with double loyalty** — often enabling immediate ultimate activation.
- **Old damage redirection rule is gone** — direct targeting of planeswalkers with damage spells is explicit in card text.

## Canonical Example
**Jace, the Mind Sculptor — Four Abilities, One Per Turn:**
Turn 4: Cast Jace, the Mind Sculptor ({2}{U}{U}). Enters with 3 loyalty (printed).
Abilities: [+2] Brainstorm (look at top 3, put 2 back), [0] Unsummon (bounce target creature), [-1] Fateseal (look at top 2, put one on bottom), [-12] Ultimate.
This turn: can activate one ability.
  Choose [+2] Brainstorm: look at top 3, put 2 back. Jace goes from 3 → 5 loyalty.
Opponent's turn: they can attack Jace to reduce loyalty, or cast spells to deal damage to Jace.
  They attack with a 3/3. You block with a 2/2. 3 damage to Jace → remove 3 loyalty counters. 5 → 2 loyalty.
Your turn: activate [+2] Brainstorm again. 2 → 4 loyalty.
Opponent's turn: they let it sit (no attackers). They're busy with their own plays.
Your turn: [+2] Brainstorm again. 4 → 6 loyalty.
Opponent's turn: attack with a 5/5. You block nothing (better to preserve Jace).
  5 damage to Jace → remove 5 loyalty. 6 → 1 loyalty.
Your turn: [-1] Fateseal. 1 → 0 loyalty. Jace is put in the GY (SBA: 0 loyalty).
Note: you couldn't do the ultimate [-12] without accumulating 12 loyalty first.
Jace survived 3 turns but only reached 6 loyalty max. Ultimate requires a protected, growing strategy.

**Example 2 — Doubling Season Infinite Loyalty:**
Board: Doubling Season ({4}{G}): "If an effect would put one or more counters on a permanent you control, it puts twice that many of those counters on it instead."
Cast Nissa, Vital Force ({3}{G}{G}): printed loyalty 5.
Doubling Season replacement: "enters with 5 loyalty" → "enters with 10 loyalty."
Nissa enters with 10 loyalty counters.
Nissa's ultimate is [-6]: "You get an emblem with 'Landfall — Whenever a land enters under your control, you may draw a card.'"
Immediate activation: -6 costs 6 loyalty counters. 10 → 4 loyalty. Ultimate achieved on entry.
Every land you play for the rest of the game: draw a card.

Another example: Liliana of the Veil ({1}{B}{B}): printed loyalty 3.
With Doubling Season: enters with 6 loyalty.
Liliana's abilities: [+1] each player discards, [-2] destroy target non-black creature, [-6] ultimate.
Activate [-6] immediately: 6 → 0. Liliana goes to GY (SBA), but the ultimate resolves.
Ultimate resolved: "Separate all permanents into two piles. Target player sacrifices the pile of their choice."
This two-pile division gives your OPPONENT a choice — but both piles are full of permanents they lose.
With clever division, you can put them in a position where both options are terrible.
This is why Doubling Season is a Commander staple in planeswalker-heavy decks.
