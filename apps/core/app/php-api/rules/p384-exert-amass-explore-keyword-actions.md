---
id: p384
name: Exert, Amass, and Explore — Optional Attack Costs and Creature Growth Actions
category: combat
cr_refs: [701.43a, 701.43b, 701.43c, 701.43d, 701.47a, 701.47b, 701.47c, 701.44a, 701.44b, 701.44c, 701.44d]
tags: [exert, amass, explore, optional-cost-attack, no-untap-next-step, army-token, subtype-zombie, land-reveal-explore, counter-on-nonland, exert-linked-abilities, multiple-exert, Glorybringer, Glory-Bearer, Hazoret-the-Fervent, Path-of-Discovery, Muldrotha-amass, Eternal-Skylord, March-of-the-Machine-amass, explore-library-top]
created: 2026-03-29
examples_count: 2
---

# P384 — Exert, Amass, and Explore — Optional Attack Costs and Creature Growth Actions

## Abstract
**Exert** (701.43) is an optional cost to attack: you choose to "exert" a creature as it attacks, meaning it won't untap during your next untap step. In exchange, the exerted creature usually gets a bonus (from a linked triggered ability). Exerting is a way to extract extra value in the short term while accepting reduced availability next turn. **Amass** (701.47) creates (or grows) an Army token: if you don't control an Army, create a 0/0 Army token of a specified subtype; otherwise choose an Army you control and put N +1/+1 counters on it. **Explore** (701.44) has a creature reveal the top card of its controller's library: if it's a land, the player puts it in hand; if not, the exploring creature gets a +1/+1 counter and the controller may put the revealed card in the graveyard. All three are keyword actions that trigger off specific game events and provide incremental advantages — exert for combat, amass for growing a single token, explore for card selection and creature growth.

## The Definitive Rules

**CR 701.43a** (verbatim): *"To exert a permanent, you choose to have it not untap during your next untap step."*

**CR 701.43b** (verbatim): *"A permanent can be exerted even if it's not tapped or has already been exerted in a turn. If you exert a permanent more than once before your next untap step, each effect causing it not to untap expires during the same untap step."*

**CR 701.43d** (verbatim): *"'You may exert [this creature] as it attacks' is an optional cost to attack (see rule 508.1g). Some objects with this static ability have a triggered ability that triggers 'when you do' printed in the same paragraph. These abilities are linked."*

**CR 701.47a** (verbatim): *"To amass [subtype] N means 'If you don't control an Army creature, create a 0/0 black [subtype] Army creature token. Choose an Army creature you control. Put N +1/+1 counters on that creature. If it isn't a [subtype], it becomes a [subtype] in addition to its other types.'"*

**CR 701.47c** (verbatim): *"The phrases 'the Army you amassed' and 'the amassed Army' refer to the creature you chose, whether or not it received counters."*

**CR 701.44a** (verbatim): *"Certain spells and abilities instruct a permanent to explore. To do so, that permanent's controller reveals the top card of their library. If a land card is revealed this way, that player puts that card into their hand. Otherwise, that player puts a +1/+1 counter on the exploring permanent and may put the revealed card into their graveyard."*

## The Pattern

```
EXERT (701.43):
  WHAT IT IS:
    A choice made when a creature attacks (usually).
    "You may exert [this creature] as it attacks."
    Choosing to exert: the creature doesn't untap during your NEXT untap step.
    Not untapping is not the same as being tapped indefinitely — it's specifically one untap step.
    After that next untap step: the "don't untap" effect expires (701.43b). Normal untapping resumes.
  LINKED TRIGGER:
    701.43d: "some objects with this static ability have a triggered ability that triggers
      'when you do' printed in the same paragraph. These abilities are linked."
    The "when you do" trigger fires IF AND ONLY IF you actually exerted.
    If you attack WITHOUT exerting: the trigger doesn't fire.
    You choose whether to exert WHILE declaring the attack.
    Decision point: exert (get bonus, can't untap next turn) or don't exert (no bonus, normal untap).
  EXERT WITHOUT ATTACKING:
    701.43c: "An object that isn't on the battlefield can't be exerted."
    But some effects let you exert without attacking (e.g., "when this creature attacks or is exerted").
    If an effect says "tap this creature and exert it": it can be exerted without attacking.
    The "don't untap" effect still applies.
  MULTIPLE EXERT:
    701.43b: "A permanent can be exerted even if it's already been exerted in a turn."
    If you exert a creature twice (via two exert abilities or two effects):
      "Each effect causing it not to untap expires during the same untap step."
      Both effects expire during the same untap step.
      The creature doesn't untap twice — it just doesn't untap during your next untap step once.
      This means: double-exerting doesn't mean it skips TWO untap steps.
      All "don't untap" effects are simultaneous — they all expire together.
  EXERT WITH VIGILANCE:
    Vigilance: creature doesn't tap when attacking.
    If a vigilance creature exerts: it attacks without tapping, but still won't untap next turn.
    Wait: if it never tapped, what does "won't untap" mean?
    The "don't untap" effect is independent of whether the creature was tapped.
    It's a replacement effect: "during your next untap step, skip the untap of this creature."
    Even if untapped, the effect applies — the creature won't untap (no effect if already untapped,
      but the duration still expires normally).
    Practically: vigilance creature exerted = it stays untapped this turn, then stays untapped next
      untap step... but since it's untapped anyway, there's no visible consequence.
    The exert bonus still applies regardless.
  GLORYBRINGER ({3}{R}{R}: 4/4 flying, haste, "You may exert Glorybringer as it attacks.
    When you do, it deals 4 damage to target non-Dragon creature an opponent controls."):
    If you exert: Glorybringer deals 4 damage to a non-Dragon. Doesn't untap next turn.
    If you don't exert: 4/4 flyer that attacks, untaps next turn. No bonus damage.
    Turn 5: cast Glorybringer (has haste). Attack immediately. Exert → deal 4 damage.
      Glorybringer is now exerted and won't untap turn 6.
    Turn 6: attack with Glorybringer again (it's tapped and won't untap).
      Wait: Glorybringer is tapped AND won't untap. You can't attack with it unless you give it a way.
      You don't attack with Glorybringer turn 6 (it's tapped).
    Turn 7: untap step. The "don't untap" from the turn 5 exert expired at turn 6's untap step.
      Actually: "next untap step" after turn 5 exert = turn 6 untap step. Glorybringer doesn't untap.
      Turn 7 untap step: Glorybringer untaps normally.
    Attack Glorybringer turn 7: may exert again for another 4 damage.

AMASS (701.47):
  WHAT IT CREATES:
    An Army token (or chooses an existing one).
    "If you don't control an Army creature, create a 0/0 black [subtype] Army creature token."
    Then: "Choose an Army creature you control. Put N +1/+1 counters on that creature."
    So: first time = make an Army + add N counters (Army would be N/N after counters).
      Wait: 0/0 + N counters: the Army would be N/N (SBA would remove it if it's still 0/0).
      Immediately after amassing, the Army has N counters → N/N (doesn't die).
    Second amass: don't create a new Army (you already have one). Add N counters to existing Army.
    The Army grows over time: each amass adds to it.
  SUBTYPE NOTE (701.47a):
    "If it isn't a [subtype], it becomes a [subtype] in addition to its other types."
    Original amass (War of the Spark): "amass N" → always created Zombie Armies.
    Updated CR: "amass [subtype] N" — the subtype is specified.
    Modern amass (March of the Machine and newer): explicitly says "amass Zombies N" or "amass Phyrexians N."
    Old cards received errata: "amass Zombies N."
    Subtype-adding: if your existing Army is an Elf Army and you amass Zombies, it becomes
      a Zombie Elf Army. Multiple subtypes can accumulate.
  ONE ARMY AT A TIME:
    You always amass INTO ONE chosen Army.
    You can't split counters across multiple Armies.
    If you have multiple Army tokens: choose one to receive the counters each time.
    Strategic: keep all amass on one Army for maximum single-creature power.
  "THE ARMY YOU AMASSED" (701.47c):
    After amassing, some effects refer to "the amassed Army."
    This refers to the CHOSEN creature (the one that received counters), whether or not it grew.
    If counters couldn't be placed (e.g., opponent responded by exiling the Army):
      "The amassed Army" is still that creature — its last known information.
    Actually: if the Army left the battlefield before amassing completed... complex case.
  AMASS AND COMBAT:
    Amass tokens are creatures. They can attack and block.
    Many amass cards give the Army indestructible, flying, or other keywords temporarily.
    "Eternal Skylord" ({3}{U}: "Other Zombie Armies you control have flying."):
      Your Zombie Army token gets flying while Eternal Skylord is in play.
  AMASS AND DEATH:
    If the Army is destroyed: it dies. Next amass creates a new 0/0 Army and adds counters.
    Starting over at 0/0 + N counters each time you lose the Army is painful.
    Build the Army up and protect it — it's a significant board investment.

EXPLORE (701.44):
  WHAT IT DOES:
    A creature "explores": its controller reveals the top card of their library.
    If land: put it in hand. Good for ramp/card advantage.
    If non-land: put a +1/+1 counter on the exploring creature. May put the revealed card in GY.
      "May" put in GY: you choose. If you want to keep it on top (for other reasons), you can.
  RESULTS:
    Land revealed: card advantage (land in hand). Creature doesn't grow.
    Non-land revealed: creature grows (+1/+1). Card selection (put it in GY if you want to, e.g.,
      for graveyard synergies; or leave it on top).
  DESIGN:
    Explore is a "scry-but-with-upside" mechanic. It's always net positive:
      Either you draw a land (better than +1/+1 in certain situations) OR you grow the creature.
    Particularly powerful when your deck has few lands (more likely to hit non-lands and grow creatures).
    Or with graveyard synergies: put the non-land in GY deliberately for reanimation.
  MULTIPLE EXPLORES:
    If a creature explores twice: it may grow +2/+2 (if both reveals are non-lands) or get
      different results based on what's on top each time.
    Each explore is a separate action (reveals top card each time, makes the decision each time).
  PATH OF DISCOVERY ({3}{G}: "Whenever a creature enters the battlefield under your control,
    it explores."):
    Every creature ETBing causes it to explore immediately.
    Green token strategy: lots of small creatures entering = lots of explores.
    Each creature may grow and reveal your top library card.
    Turns token strategies into a library-selection engine.
  JADELIGHT RANGER ({1}{G}{G}: 2/1 Elf Scout):
    "When Jadelight Ranger enters, it explores, then it explores again."
    Explores twice on ETB.
    Best case: 2 non-lands → Jadelight Ranger becomes a 4/3.
    Mixed: 1 land + 1 non-land → 1 card to hand + Jadelight 3/2. Still good.
    Worst case: 2 lands → 2 cards to hand. Jadelight stays 2/1. Still drew lands.
    Always net positive. This is why it was a format staple.
  EXPLORE TIMING:
    Explore is a keyword action, not an activated ability. It happens when instructed.
    ETB triggers that cause explore: fire when the creature enters, go on stack, resolve later.
    At resolution of the ETB trigger: the creature explores.
    If the creature dies before the trigger resolves: "last known information" (701.44c) —
      "if a permanent changes zones before an effect causes it to explore, its last known
      information is used to determine which object explored and who controlled it."
    So: if the creature was somehow removed before the explore trigger resolves, the explore
      still happens (using last known info for what creature it was and who controlled it).
    The counters go on... nothing (the creature is gone). "Some or all impossible: still explored."
    The +1/+1 counter would have gone on the creature — but if it's gone, the counter fizzles.
    HOWEVER: the land-reveal result (put in hand) still works regardless.
```

## Definitive Conclusions

- **Exert is a choice made when declaring attackers** — you exert as part of declaring the attack; the linked "when you do" trigger fires only if you chose to exert; the creature doesn't untap during your NEXT untap step (just one untap step, not indefinitely).
- **Exerting multiple times doesn't skip multiple untap steps** — all "don't untap" effects expire at the same untap step regardless of how many exerts were applied.
- **Amass either creates or grows a single Army token** — if you already control an Army, no new token is created; you choose one Army to receive all the counters; the Army can have multiple subtypes from different amass effects.
- **Explore always results in something positive** — land revealed = card to hand; non-land revealed = +1/+1 counter on the exploring creature + optional GY placement.
- **If the exploring creature leaves the battlefield before the explore effect resolves** — the counter fizzles (nothing to put it on), but any land card is still put in hand (the land-draw effect doesn't require the creature to be present).

## Canonical Example
**Glorybringer Combat Sequence:**
Turn 5: Cast Glorybringer ({3}{R}{R}) — 4/4 flying, haste.
Declare attack with Glorybringer. Choose: exert or not.

Exert: Glorybringer won't untap next turn. Trigger fires: "deal 4 damage to target non-Dragon creature."
Opponent controls Tarmogoyf (5/6). Choose Tarmogoyf: 4 damage → Tarmogoyf has 4 damage marked.
(5/6 with 4 damage: not dead from damage alone — toughness is 6. Mark the damage.)
Glorybringer attacks for 4 flying. If unblocked: 4 damage to opponent.
After turn 5 combat: Glorybringer is tapped. Won't untap turn 6.

Turn 6: Your untap step. Glorybringer stays tapped ("don't untap" effect).
Glorybringer cannot attack (tapped). The "don't untap" effect fires and then expires.

Turn 7: Your untap step. Glorybringer untaps (previous effect expired).
You may exert again (new combat): deal 4 more damage to another creature.

Strategic note: "Glorybringer every other turn" is the base rate.
Use haste to attack the same turn it enters: don't exert on turn 5 if you need the creature
  to untap AND be available for blocking. Or exert for aggressive lethal pressure.

**Example 2 — Jadelight Ranger Explores:**
Jadelight Ranger ({1}{G}{G}: 2/1 Scout) enters the battlefield.
Two explore triggers go on the stack (one for each "then it explores again").

First explore trigger resolves: reveal top card.
Top card: Llanowar Elves (non-land).
Result: put a +1/+1 counter on Jadelight Ranger (now 3/2). May put Llanowar Elves in GY.
You choose: put it in GY (it's not useful to leave it on top; or keep for top-deck play).
Jadelight Ranger is now 3/2.

Second explore trigger resolves: reveal top card.
Top card: Forest (land).
Result: put Forest in hand. No counter on Jadelight Ranger.
Jadelight Ranger stays 3/2.

Final state: Jadelight Ranger is 3/2 (one counter). You got a Forest in hand.
This is the "1 land + 1 counter" result — extremely common and still powerful.

Best case scenario: both reveals are non-lands:
→ 4/3 Jadelight Ranger + 2 cards potentially in GY.
Worst case: both reveals are lands:
→ 2/1 Jadelight Ranger + 2 lands in hand.
Both extremes are useful. The double-explore design ensures high card quality over time.

## Commonly Confused With
- **P016 (Combat — Declaring Attackers / Optional Costs)** — Exert is specifically "optional cost to attack" (rule 508.1g), similar to how other optional attack costs work (pay to get a bonus). The key distinction: exert's "cost" is the tapping-and-won't-untap effect, not a mana cost. P016 covers general attack declaration rules.
- **P363 (Tokens)** — Amass creates Army tokens (or adds to existing ones). Tokens from amass follow all normal token rules (they leave the battlefield when exiled; they can't be put in zones other than the battlefield). The "choose your Army" decision is strategic — only one Army receives counters each time.
- **P011 (ETB Triggers)** — Explore is often triggered by ETB ("when this enters, it explores"). The explore trigger goes on the stack and resolves later. If the creature is removed before the explore trigger resolves, last known information applies and the trigger resolves with the creature's identity but no target to put counters on.
- **P006 (Intervening If — Condition at Trigger and Resolution)** — Exert's "when you do" trigger fires only if the exert choice was made. This is a linked ability structure (607.2h), not an intervening "if" — but the effect is similar: the trigger is conditional on whether you paid the optional cost.
