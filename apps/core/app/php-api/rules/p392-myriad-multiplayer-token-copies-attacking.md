---
id: p392
name: Myriad — Multiplayer Token Copies Attacking Each Opponent
category: combat
cr_refs: [702.116a, 702.116b, 508.1, 603.6a, 704.5d, 704.5j]
tags: [myriad, multiplayer, token-copies-attacking, legend-rule, delayed-trigger, blade-of-selves, warchief-giant, broodbirth-viper, one-v-one-does-nothing, ETB-triggers-on-tokens, no-further-myriad-triggers, combat-tokens, exile-at-end-of-combat, Commander]
created: 2026-03-29
examples_count: 2
---

# P392 — Myriad — Multiplayer Token Copies Attacking Each Opponent

## Abstract
**Myriad** (702.116) is a triggered ability that fires whenever the myriad creature attacks. For each opponent other than the defending player, you may create a token that is a copy of the attacking creature — each token enters the battlefield tapped and attacking that opponent (or a planeswalker they control). If any tokens were created, a delayed triggered ability exiles them at end of combat. Three crucial interactions define myriad: (1) myriad does nothing in 1v1 games because there are no "other opponents" besides the defending player; (2) myriad tokens enter already-attacking and do NOT re-trigger their own myriad (they were never "declared as attackers"); (3) legendary creatures with myriad create legendary token copies that immediately run into the legend rule — but any ETB triggers the tokens have still fire before state-based actions kill them.

## The Definitive Rules

**CR 702.116a** (verbatim): *"Myriad is a triggered ability that may also create a delayed triggered ability. 'Myriad' means 'Whenever this creature attacks, for each opponent other than defending player, you may create a token that's a copy of this creature that's tapped and attacking that player or a planeswalker they control. If one or more tokens are created this way, exile the tokens at end of combat.'"*

**CR 702.116b** (verbatim): *"If a creature has multiple instances of myriad, each triggers separately."*

**CR 603.6a** (verbatim): *"A triggered ability triggers when an event matching its trigger event occurs. All permanents on the battlefield check the event against their triggered abilities."*

**CR 704.5d** (verbatim): *"If a token is in a zone other than the battlefield, it ceases to exist."*

**CR 704.5j** (verbatim): *"If a player controls two or more legendary permanents with the same name, that player chooses one to remain on the battlefield and puts the rest into their owners' graveyards."*

## The Pattern

```
MYRIAD TRIGGER MECHANICS (702.116a):
  WHEN IT FIRES:
    "Whenever this creature attacks" — fires at the declare attackers step (508.1).
    Specifically: when this creature is declared as an attacker.
    The trigger condition: this creature attacked (was declared as an attacker).
  WHAT IT DOES:
    For each opponent OTHER THAN the defending player:
      You MAY create a token copy of this creature.
      Each token is:
        - A copy (same name, P/T, abilities, types, etc.)
        - Tapped
        - Attacking that specific opponent (or a planeswalker they control)
    "For each... you may" — it's one trigger, you choose for each opponent separately.
      You don't have to create tokens for all opponents. May create for some, skip others.
    Result: the original creature attacks one player; tokens attack every other opponent.
    In a 4-player game (3 opponents): original attacks Player B; tokens attack C and D.
  THE DELAYED TRIGGER:
    "If one or more tokens are created this way, exile the tokens at end of combat."
    This is a delayed triggered ability created when myriad resolves.
    At end of combat: these specific tokens are exiled.
    Purpose: tokens can't be kept permanently. Myriad is a combat-only benefit.
    If a token leaves the battlefield before end of combat (blocked, legend rule, etc.):
      Token goes to GY → SBAs: token ceases to exist (704.5d).
      The delayed trigger fires at end of combat but finds nothing on the battlefield.
      Token is gone regardless of the delayed trigger.

MYRIAD IN 1v1 GAMES:
  "For each opponent OTHER THAN the defending player" = 0 opponents in 1v1.
  In 1v1: no opponents besides the one you're attacking. Myriad does NOTHING.
  Blade of Selves equipped on a creature attacking in 1v1:
    Myriad triggers. For each opponent other than the defending player = none.
    No tokens created. The delayed trigger never fires. Completely blank effect.
  Commander is the primary format for myriad (3+ opponents required to be useful).

MYRIAD TOKENS AND "WHENEVER ATTACKS" TRIGGERS:
  KEY DISTINCTION: tokens "enter tapped and attacking" — they were NOT declared as attackers.
  Rule 508.1: "the active player declares attackers" — only permanents go through this process.
  Myriad tokens are created by a triggered ability AFTER attack declaration, already attacking.
  The "attacks" event (for triggered ability purposes) occurs when a creature is declared as attacker.
  Myriad tokens bypass attack declaration entirely. Therefore:
    The tokens' own myriad triggers DO NOT fire. (They were never "declared as attackers.")
    No chain reaction of more and more tokens attacking additional players.
    Multiple instances of myriad (702.116b): each fires ONCE for the original attacker,
      creating one set of tokens per instance. The tokens themselves don't create more.
  OTHER "WHENEVER ATTACKS" TRIGGERS also don't fire for myriad tokens.
    Example: Warchief Giant ({4}{R}: 5/3 myriad, "when this attacks, target opponent can't block").
      Wait — the "attacks" ability on a card fires based on myriad tokens being declared as attackers.
      Since myriad tokens enter already-attacking (not declared), they don't trigger their own
      "whenever [this/this creature] attacks" abilities.
    Example: Battle-Rattle Shaman ({3}{R}: 2/2, "At the beginning of combat, you may have a
      creature get +2/+0"). This fires based on combat beginning, not attack declaration.
      A myriad token exists during combat. If it has abilities triggered on combat beginning:
      those would have already triggered before the token entered. This token doesn't trigger
      "beginning of combat" retroactively.
    BOTTOM LINE: myriad tokens don't trigger "attacks" abilities. They DO trigger ETB abilities.

MYRIAD TOKENS TRIGGER THEIR OWN ETB:
  Myriad tokens are put onto the battlefield. ETB triggers fire when a permanent enters.
  If the original creature has an ETB trigger, the token (as a copy) also has that trigger.
  The token entering the battlefield DOES trigger that ETB.
  Example: Broodbirth Viper ({4}{G}: 3/3 myriad, "When this creature enters or attacks,
    create a 1/1 green Snake creature token"):
    Original Broodbirth Viper attacks Player B → myriad triggers → token copies enter
      attacking Players C and D.
    Each myriad token has the same ETB trigger. Each token entering fires "When this creature enters":
      Each token creates a 1/1 Snake.
    Plus the original triggers "when this creature attacks."
    Note: "or attacks" on the original fires both when it enters (ETB) and when it attacks.
      For myriad tokens: the "enters" part fires; the "attacks" part doesn't (never declared).

LEGENDARY CREATURES AND MYRIAD:
  If the myriad creature is legendary: token copies are also legendary with the same name.
  SBAs (704.5j): you now control multiple legendary permanents with the same name.
  The legend rule applies AFTER the tokens enter. Sequence:
    1. Myriad trigger resolves → tokens enter the battlefield.
    2. ETB triggers of the tokens fire (go on the stack).
    3. State-based actions are checked before priority:
       - Legend rule: you control multiple copies of the same legendary permanent.
       - You choose one to keep; the rest go to the GY.
       - The sacrificed tokens go to GY → 704.5d: tokens cease to exist.
    4. The ETB triggers (from step 2) are still on the stack. They still resolve.
  KEY: ETB triggers of legendary myriad creatures still resolve even if the tokens die to legend rule.
  KEY: DIES triggers ("when this creature dies") also fire when tokens go to the GY (legend rule).
    The token "dies" (moved from battlefield to GY due to SBA). The dies trigger fires.
    Token then ceases to exist in the GY (704.5d). But the trigger is already on the stack.
  Example: Kokusho, the Evening Star ({4}{B}{B}: 5/5, "When Kokusho dies, each opponent loses 5
    life, you gain life equal to the total life lost"):
    Kokusho attacks Player B with myriad (via Blade of Selves). Tokens attack C and D.
    Tokens are legendary (same name as Kokusho). Legend rule: you keep the original, sacrifice tokens.
    Tokens go to GY (each one dying) → dies triggers for each token fire → then tokens cease to exist.
    Each token dying triggers "when Kokusho dies" — in a 3-opponent game: 2 extra triggers.
    Result: 3 total Kokusho dies triggers (original + 2 tokens if original eventually dies,
      or just 2 token triggers if original doesn't die).
    In Commander: 2 extra "each opponent loses 5" triggers from the myriad tokens alone.
    THIS IS EXTREMELY POWERFUL and is why Blade of Selves on Kokusho is a Commander threat.

EXILE AT END OF COMBAT — CLARIFICATIONS:
  The delayed trigger exiles the tokens "at end of combat."
  If a token dies before end of combat (combat damage, legend rule, etc.):
    It's already in the GY. 704.5d: it ceases to exist.
    The delayed trigger fires at end of combat but can't find the token on the battlefield.
    Nothing happens. (You can't exile from GY with this effect — it targets battlefield tokens.)
  If a token survived combat (wasn't blocked, or had indestructible, etc.):
    The delayed trigger exiles it. It doesn't go to GY. Graveyard recursion doesn't apply.
  Key: you CAN'T keep the myriad tokens permanently. Even tokens that survive combat get exiled.
    Unless: a replacement effect changes where the token goes ("if a token would be exiled, instead...").
    Or: the delayed trigger is countered somehow (Discontinuity, etc.) — tokens would survive.

MULTIPLE MYRIAD INSTANCES (702.116b):
  Each instance triggers separately. Each creates its own set of tokens.
  A creature with two instances of myriad attacks in a 4-player game (targeting Player B):
    First myriad trigger: may create tokens for C and D (up to 2 tokens).
    Second myriad trigger: may create tokens for C and D (up to 2 more tokens).
    You could have 2 tokens attacking Player C and 2 tokens attacking Player D (+ original → B).
    Delayed triggers from each instance: "exile those tokens at end of combat."
  Player C is attacked by up to 2 tokens (if both myriad instances created tokens for them).
```

## Definitive Conclusions

- **Myriad does nothing in 1v1** — the trigger fires but finds 0 opponents besides the defending player; no tokens are created.
- **Myriad tokens don't trigger their own myriad** — they enter the battlefield already-attacking (created by a triggered ability), not declared as attackers; "whenever this creature attacks" doesn't fire for them.
- **Myriad tokens DO trigger ETB abilities** — they enter the battlefield, so ETB triggers on those tokens (as copies of the original) fire normally.
- **Legendary myriad creatures create legendary tokens that die to the legend rule** — but ETB and dies triggers from those tokens still fire (already on the stack before SBAs kill the tokens).
- **Tokens are exiled at end of combat** — the delayed trigger exiles surviving myriad tokens; tokens that already left the battlefield cease to exist before the delayed trigger fires.
- **Blade of Selves is the Commander-format myriad enabler** — any creature can get myriad; abuse is especially potent with ETB/dies triggers on legendary creatures (e.g., Kokusho).

## Canonical Example
**Blade of Selves Equipping Warchief Giant in Commander:**
Warchief Giant ({4}{R}: 5/3, myriad). Blade of Selves (Equipment: equip {3}, equipped creature has myriad — giving it a second myriad instance effectively):

4-player Commander game. You attack Player B with Warchief Giant.
Myriad triggers. "For each opponent other than the defending player [Player B]..."
Opponents C and D: for each, you may create a token copy.
You create tokens: Warchief Giant-1 attacks Player C; Warchief Giant-2 attacks Player D.
The tokens are 5/3 creatures (same P/T as Warchief Giant). Not legendary — no legend rule concern.
Delayed trigger: "exile those tokens at end of combat."

Players C and D must deal with blockers or take 5 damage each.
After combat ends: both tokens exiled. They don't linger.

Warchief Giant in combat with Player B: no special interaction (myriad just sends tokens to other players).
Result: one attack declaration covers all 3 opponents simultaneously.

**Example 2 — Legendary Myriad with Dies Trigger (Kokusho + Blade of Selves):**
Kokusho, the Evening Star ({4}{B}{B}: 5/5 Dragon, "When Kokusho, the Evening Star is put into a graveyard from the battlefield, each opponent loses 5 life and you gain life equal to the total life lost this way").

Kokusho has Blade of Selves equipped. 4-player game (3 opponents): attacking Player A.
Myriad triggers. "For each opponent other than Player A" = Players B and C.
Two myriad tokens created: both legendary creatures named "Kokusho, the Evening Star."
You now control 3 legendary permanents with the same name: original + 2 tokens.

SBAs (704.5j): legend rule. You choose to keep the original Kokusho.
Tokens are put into your GY (sent there by the legend rule "sacrifice").
Each token going to the GY triggers "When Kokusho, the Evening Star is put into a graveyard from the battlefield" (dies trigger).
Two dies triggers go on the stack. Then tokens cease to exist in the GY (704.5d).
But the triggers are already on the stack. They resolve.

Each dies trigger: "each opponent loses 5 life, you gain life equal to life lost."
3 opponents × 2 triggers = each opponent loses 5 life twice (10 life total).
You gain 30 life (3 opponents × 5 life × 2 triggers).

This is before any combat damage. The original Kokusho hasn't attacked yet.
And if Kokusho dies in combat (or later): third dies trigger for another 15-life swing.
Kokusho + Blade of Selves in a 4-player game = one of the most powerful myriad interactions.

## Commonly Confused With
- **P391 (Persist/Undying/Evolve)** — Both evolve and myriad involve other creatures interacting with a creature's triggered ability. Myriad creates tokens attacking opponents; evolve places counters based on incoming creatures' stats. Unrelated mechanics, similar "other creatures matter" flavor.
- **P380 (Voting)** — Myriad and voting are both Commander-dominant multiplayer mechanics. Voting involves all players making choices simultaneously; myriad is a triggered ability during combat.
- **P011 (ETB Triggers)** — Myriad creates tokens that enter the battlefield, triggering ETBs. The ETB of myriad tokens fires; the "attacks" trigger does not (not declared as attacker). Understanding which triggers fire vs. don't fire is a direct P011 application.
- **P001 (Trample/Combat Damage Assignment)** — Myriad tokens are independent attackers against their respective opponents. Each token deals damage independently. Trample on a myriad token deals excess to the defending player (the one that token is attacking).
