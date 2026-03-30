---
id: p400
name: Afflict, Ascend, Mentor, and Afterlife — Blocked Life Loss, City's Blessing, Combat Growth, and Death Tokens
category: triggered
cr_refs: [702.130a, 702.130b, 702.131a, 702.131b, 702.131c, 702.131d, 702.134a, 702.134b, 702.134c, 702.135a, 702.135b]
tags: [afflict, ascend, mentor, afterlife, blocked-life-loss, citys-blessing-designation, ten-permanents, counter-on-attacking-creature, death-token-spirits, Amonkhet, Ixalan, Dominaria, Ravnica-Allegiance, Ammit-Eternal, Charging-Monstrosaur, Famished-Paladin, Golden-Demise, Conclave-Tribunal, Tajic-Legion-Edge, Teysa-Karlov, make-blocking-bad, cant-stop-life-loss, mentor-requires-lower-power]
created: 2026-03-29
examples_count: 2
---

# P400 — Afflict, Ascend, Mentor, and Afterlife — Blocked Life Loss, City's Blessing, Combat Growth, and Death Tokens

## Abstract
**Afflict N** (702.130) triggers whenever the afflict creature becomes blocked: the defending player loses N life. This happens regardless of combat damage — blocking an afflict creature costs you life even before damage is dealt. **Ascend** (702.131) checks for 10 permanents under your control; once that threshold is met, you get the "city's blessing" for the rest of the game. The city's blessing is a permanent designation (not a counter, not an ability) that many Ixalan cards care about. **Mentor** (702.134) triggers on attack: put a +1/+1 counter on target attacking creature with power less than this creature's power. Multiple mentor creatures can chain their counters to grow smaller attackers. **Afterlife N** (702.135) triggers when the permanent dies: create N 1/1 white-black Spirit tokens with flying. Multiple afterlife instances stack, creating more tokens when the creature dies.

## The Definitive Rules

**CR 702.130a** (verbatim): *"Afflict is a triggered ability. 'Afflict N' means 'Whenever this creature becomes blocked, defending player loses N life.'"*

**CR 702.130b** (verbatim): *"If a creature has multiple instances of afflict, each triggers separately."*

**CR 702.131a** (verbatim): *"Ascend on an instant or sorcery spell represents a spell ability. It means 'If you control ten or more permanents and you don't have the city's blessing, you get the city's blessing for the rest of the game.'"*

**CR 702.131b** (verbatim): *"Ascend on a permanent represents a static ability. It means 'Any time you control ten or more permanents and you don't have the city's blessing, you get the city's blessing for the rest of the game.'"*

**CR 702.131c** (verbatim): *"The city's blessing is a designation that has no rules meaning other than to act as a marker that other rules and effects can identify. Any number of players may have the city's blessing at the same time."*

**CR 702.131d** (verbatim): *"After a player gets the city's blessing, continuous effects are reapplied before the game checks to see if the game state or preceding events have matched any trigger conditions."*

**CR 702.134a** (verbatim): *"Mentor is a triggered ability. 'Mentor' means 'Whenever this creature attacks, put a +1/+1 counter on target attacking creature with power less than this creature's power.'"*

**CR 702.134b** (verbatim): *"If a creature has multiple instances of mentor, each triggers separately."*

**CR 702.134c** (verbatim): *"An ability that triggers whenever a creature mentors another creature triggers whenever a mentor ability whose source is the first creature and whose target is the second creature resolves."*

**CR 702.135a** (verbatim): *"Afterlife is a triggered ability. 'Afterlife N' means 'When this permanent is put into a graveyard from the battlefield, create N 1/1 white and black Spirit creature tokens with flying.'"*

**CR 702.135b** (verbatim): *"If a permanent has multiple instances of afterlife, each triggers separately."*

## The Pattern

```
AFFLICT (702.130):
  WHAT IT IS:
    Triggered ability. Fires "whenever this creature becomes blocked."
    "Becomes blocked" = the moment a blocker is declared against it (declare blockers step).
    Effect: the defending player loses N life. Not combat damage — a triggered life loss.
  TIMING:
    Trigger fires when blockers are declared. Goes on the stack.
    Resolves before combat damage is dealt.
    The defending player loses N life REGARDLESS of what happens in damage (creature trades, kills, etc.).
  KEY INTERACTIONS:
    The defender cannot avoid the life loss by blocking — blocking triggers afflict.
    The only way to avoid afflict: let the creature through unblocked.
    This creates a dilemma: block (take the afflict life loss + prevent combat damage)
      vs. don't block (take full combat damage).
    With high-power afflict creatures: the life loss from not blocking + afflict can be severe.
    Example: Ammit Eternal ({2}{B}: 5/5, afflict 3, "whenever an opponent casts a spell, put a
      -1/-1 counter on Ammit Eternal; whenever it deals combat damage to a player, remove all -1/-1 counters"):
      If opponent blocks Ammit: they lose 3 life + take 5 combat damage = 8 life total if they die.
      If opponent doesn't block: they take 5 combat damage.
      Blocking "costs" 3 life but prevents up to 5 damage. Net: blocking is worth it only if the
        blocker kills Ammit. If the blocker doesn't kill Ammit: opponent loses both 3 (afflict) + the
        blocker, and Ammit survives for next attack.
  MULTIPLE AFFLICT INSTANCES (702.130b):
    A creature with afflict 2 and afflict 1 (from two separate sources): both trigger separately.
    Total: defending player loses 3 life when it becomes blocked.
  AFFLICT AND PROTECTION:
    "Defending player loses life" — afflict is not damage. Protection from black (or any color)
      does NOT prevent afflict life loss. Protection prevents targeted damage.
    Afflict is life loss from a triggered ability, not damage.

ASCEND (702.131):
  WHAT IT IS:
    On spells (702.131a): a spell ability that fires when the spell resolves.
      "If you control 10+ permanents and don't have city's blessing, you get the city's blessing."
    On permanents (702.131b): a static ability.
      "Any time you control 10+ permanents and don't have city's blessing: you get it."
    The city's blessing: a permanent designation. Once you have it, you keep it forever in that game.
      (Even if your permanents drop below 10 later.)
  THE CITY'S BLESSING:
    702.131c: "a designation that has no rules meaning other than to act as a marker."
    NOT a counter. NOT an ability. NOT part of any permanent's copiable values.
    Multiple players can have it simultaneously.
    Cards check "if you have the city's blessing" to determine if effects apply.
    Example: Golden Demise ({1}{B}{B}: sorcery, "Ascend. If you have the city's blessing,
      each opponent's creature gets -2/-2 until EOT. Otherwise, all creatures get -2/-2 until EOT"):
      Without blessing: hits all creatures (including yours). With blessing: hits opponents' only.
    Example: Famished Paladin ({1}{W}: 3/3, "Famished Paladin doesn't untap during your untap step"):
      Not an ascend card, but representative.
      Actual example: Skymarcher Aspirant ({W}: 1/1, "Ascend. Skymarcher Aspirant has flying
        as long as you have the city's blessing"):
        Once you get the blessing: your 1/1 becomes a 1/1 flyer. Permanently.
  COUNTING 10 PERMANENTS:
    All permanents on your side: lands, creatures, artifacts, enchantments, planeswalkers, tokens.
    Tokens count. An emblem? No — emblems aren't permanents.
    10 permanents is achievable in midgame if you have a lot of token producers.
  702.131d EFFECT:
    "After a player gets the city's blessing, continuous effects are reapplied."
    This ensures that any existing continuous effects that depend on "if you have the city's blessing"
      are immediately evaluated.
    Example: Skymarcher Aspirant is already on the battlefield. You get the blessing.
      The continuous "has flying as long as you have city's blessing" effect now applies.
      The game reapplies continuous effects: Aspirant now has flying. No trigger needed.

MENTOR (702.134):
  WHAT IT IS:
    Triggered ability. Fires when THIS creature attacks.
    Effect: put a +1/+1 counter on target attacking creature with power LESS THAN this creature's power.
  THE TARGET REQUIREMENT:
    "Target attacking creature with power less than this creature's power."
    The mentor creature must have HIGHER power than the target.
    If the mentor creature is 3/3: can mentor any attacking creature with power ≤ 2.
    If the mentor creature is 2/2: can mentor any attacking creature with power ≤ 1.
    The mentor creature cannot mentor itself (it's not a creature with power less than its own).
    Can mentor another mentor creature with lower power.
  MENTOR CHAIN INTERACTIONS:
    Tajic, Legion's Edge ({1}{R}{W}: 3/2, mentor, haste, "prevent all noncombat damage to other
      creatures you control"):
    Attack with Tajic (3/2) + some 1/1 creature (1 power < 3):
      Tajic's mentor trigger: put +1/+1 counter on the 1/1 → it's now 2/2.
    Next turn: that 2/2 creature may have mentor (if it also has the ability).
      It can now mentor anything with power ≤ 1.
    Mentor creates a chain where the mentor creature grows smaller attackers over time.
  MENTOR AND POWER COMPARISON AT TRIGGER:
    The comparison "power less than this creature's power" is made when targets are chosen.
    If you give the mentor creature +2/+0 before blocking: larger threat, can mentor bigger creatures.
    If the target creature gains a counter AFTER targeting but BEFORE resolution: the counter is applied
      even if the power comparison no longer holds at resolution?
    Actually: mentor says "put counter on TARGET attacking creature with power less than this."
      This is an intervening-if? Not quite — it's a "target" selection criterion, not a trigger condition.
      "Target [creature meeting criteria]" — the criteria are checked when choosing targets.
      If the target's power changes after targeting: the counter is still placed (target was legal when chosen).
    702.134a doesn't explicitly say "if" at resolution. The comparison is in the target selection.
    Standard rules: once a target is chosen legally, the spell/ability resolves unless the target
      is no longer a legal target at resolution. "Legal target" for mentor = "attacking creature."
      If the creature is still attacking at resolution: the counter is placed, even if power changed.
  MULTIPLE MENTOR INSTANCES (702.134b):
    Each fires separately. A creature with two mentor instances, attacking:
      Two triggers. Each can target any attacking creature with power less than this.
      Could target the same creature twice (two counters on it) or different creatures.

AFTERLIFE (702.135):
  WHAT IT IS:
    Triggered ability. Fires "when this permanent is put into a graveyard from the battlefield."
    Same as a "dies" trigger.
    Creates N 1/1 white and black Spirit creature tokens with flying.
  THE SPIRIT TOKENS:
    White AND black (both colors). Flying.
    Both colors matter for: color-based removal, color identity in Commander.
    Flying makes them good blockers and attackers.
    They're Spirits — Tribal Flames, Spirit synergies apply.
  MULTIPLE AFTERLIFE (702.135b):
    Each instance triggers separately.
    Teysa Karlov ({2}{W}{B}: 2/4, "if a creature dying causes a triggered ability of a permanent
      you control to trigger, that ability triggers an additional time"):
    When a creature with afterlife 1 dies under Teysa's control:
      Afterlife 1 triggers → 1 Spirit token. But Teysa doubles it:
      "Triggered ability triggers an additional time." So afterlife fires TWICE → 2 Spirit tokens.
    A creature with afterlife 2 + Teysa: each afterlife trigger fires twice (but there's only 1 trigger).
      Afterlife 2 triggers, then Teysa doubles it → it triggers again → 4 Spirits total.
    Wait: Teysa says triggered abilities trigger an "additional time." For afterlife 2 (one trigger, N=2):
      The single afterlife 2 trigger triggers additionally once → 2 total resolutions of that trigger.
      Each resolution creates 2 tokens. 2 × 2 = 4 Spirit tokens.
    This makes Teysa + afterlife creatures an insane combo in Commander.
  AFTERLIFE AND EXILE:
    "When this permanent is put into a graveyard from the battlefield" — goes to GY.
    If the creature is exiled instead of dying: afterlife does NOT trigger. (It went to exile, not GY.)
    Example: Path to Exile (exile target creature). A creature with afterlife that's exiled: no tokens.
    Destroy effects (SBAs, Doom Blade): creature dies → goes to GY → afterlife triggers.
    Protection from black + targeted black destruction: might not die to that removal (protection rule).
      But if it does die another way: afterlife fires.
```

## Definitive Conclusions

- **Afflict life loss is unavoidable when blocking** — the defending player loses life when any creature blocks the afflict creature; this is not damage; protection and damage prevention don't apply; the only way to avoid afflict is to NOT block.
- **The city's blessing is permanent once gained** — even if you drop below 10 permanents, you keep it; multiple players can have it simultaneously; it's a designation, not a counter.
- **Mentor requires a target with strictly lower power at the time of target selection** — if the target's power changes after being targeted but before resolution, the counter is still placed.
- **Afterlife only triggers when the permanent is put into the GY** — exile effects don't trigger it; Teysa Karlov doubles afterlife triggers, multiplying token generation.
- **Multiple afterlife instances stack** — a creature with afterlife 1 and afterlife 2 (separately) creates 3 Spirit tokens on death (or 6 under Teysa Karlov).

## Canonical Example
**Ammit Eternal Afflict Dilemma:**
Ammit Eternal ({2}{B}: 5/5, Afflict 3, "whenever an opponent casts a spell, put a -1/-1 counter on Ammit Eternal; whenever it deals combat damage to a player, remove all -1/-1 counters"):

Turn 4: Ammit Eternal attacks Player B.
Player B's board: 3/3 blocker, 2/2 blocker. Player B at 18 life.

Option 1 (block with 3/3): Afflict 3 triggers → Player B loses 3 life (18 → 15). Combat damage: Ammit deals 5 to the 3/3 (it dies), 3/3 deals 3 to Ammit. Ammit survives with 2 damage marked.
  Player B: lost 3 life (afflict), lost a 3/3 blocker.
Option 2 (block with 2/2): Afflict 3 triggers → Player B loses 3 life (18 → 15). Combat damage: Ammit deals 5 to the 2/2 (it dies), 2/2 deals 2 to Ammit. Ammit survives with 2 damage marked.
  Player B: same life loss, lost a 2/2 blocker. Neither blocker killed Ammit.
Option 3 (no block): No afflict trigger. Player B takes 5 combat damage (18 → 13).

Analysis: If neither blocker can kill Ammit, Player B is better off NOT blocking (5 damage is less than 3+combat damage from options 1-2 where the blocker also dies).
If Player B has a 5/5+ blocker that can kill Ammit: blocking removes the recurring threat but still costs 3 life.
Afflict makes blocking a true dilemma — paying 3 "life insurance" to keep blockers alive vs. just taking the hit.

**Example 2 — Teysa Karlov + Afterlife Combo:**
Teysa Karlov ({2}{W}{B}: 2/4, "If a creature dying causes a triggered ability of a permanent you control to trigger, that ability triggers an additional time. Creature tokens you control have vigilance and lifelink"):

You control Teysa Karlov + Ministrant of Obligation ({2}{W}: 2/1, Afterlife 2).
Opponent destroys Ministrant of Obligation. It dies (goes to GY).

Afterlife 2 trigger fires: "when this permanent is put into a graveyard, create 2 Spirit tokens."
Teysa Karlov: "if a creature dying causes a triggered ability to trigger, it triggers an additional time."
The afterlife 2 trigger triggers an additional time.
Stack: two copies of the afterlife 2 trigger.

Resolution: each copy of the afterlife 2 trigger creates 2 Spirit tokens.
2 tokens + 2 tokens = 4 Spirit tokens total.
All Spirits have: flying (afterlife), + vigilance (Teysa) + lifelink (Teysa).

If you had a creature with afterlife 1 AND afterlife 2 (hypothetical — or use Hunted Witness afterlife 1 + a separate afterlife 2 grant):
That creature dying: afterlife 1 trigger fires, afterlife 2 trigger fires.
Each triggers additionally (Teysa). Total: 2 × 2 = 4 resolutions, giving 1+1+2+2 = 6 tokens.
Teysa turns every death into an explosive token generation event.

## Commonly Confused With
- **P391 (Persist/Undying/Evolve)** — Afterlife is a "dies" trigger like persist and undying. Key difference: afterlife creates tokens; persist/undying return the creature itself. Afterlife works regardless of counters; persist/undying check for counter absence.
- **P393 (Extort/Exploit)** — Exploit sacrifices a creature for a bonus; afterlife creates tokens when a creature dies (from any cause). Both care about creatures dying but from very different angles.
- **P394 (Renown/Awaken/Devoid)** — Ascend and renown are both "designation" mechanics (the city's blessing, renowned). Both are permanent designations once gained; renown resets on leaving the battlefield; the city's blessing never resets once gained.
- **P397 (Prowess/Dash/Dethrone)** — Mentor and dethrone are both attack-triggered mechanics that place +1/+1 counters. Dethrone: the attacker gets the counter (self-growth). Mentor: you put a counter on a DIFFERENT attacking creature with lower power.
