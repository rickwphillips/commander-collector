---
id: p341
name: Combat Phase — Steps, Declare Attackers, Declare Blockers, and Damage Assignment
category: combat
cr_refs: [506.1, 506.2, 506.3, 506.4, 506.4a, 506.4b, 507.1, 507.2, 508.1, 508.1a, 508.1c, 508.1d, 508.1f, 508.1k, 508.1m, 508.2, 508.3a, 508.4, 508.8, 509.1, 509.1a, 509.1b, 509.1c, 509.1h, 509.3a, 509.3g, 510.1, 510.1a, 510.1c, 510.2, 510.4, 511.1, 511.2, 511.3]
tags: [combat, declare-attackers, declare-blockers, combat-damage, first-strike, double-strike, blocked-creature, unblocked-creature, removed-from-combat, tapping-attacker, assignment-order, multiple-blockers, damage-simultaneous, end-of-combat, vigilance, Fog, Lure, Silhana-Ledgewalker, Mogg-Fanatic, Bile-Urchin]
created: 2026-03-29
examples_count: 2
---

# P341 — Combat Phase — Steps, Declare Attackers, Declare Blockers, and Damage Assignment

## Abstract
The combat phase has five steps: **beginning of combat**, **declare attackers**, **declare blockers**, **combat damage**, and **end of combat**. Declare blockers and combat damage are skipped if no attackers are declared. The combat damage step splits into two if any attacker or blocker has first strike or double strike — first strikers deal damage first, then normal damage follows. Once a creature is declared as an attacker or blocker, tapping or untapping it doesn't remove it from combat (506.4b). A once-blocked creature remains blocked even if all its blockers are removed. The attacker assigns damage to blockers in order, satisfying "lethal damage" to each before assigning to the next — unless the creature has deathtouch, in which case 1 damage is lethal.

## The Definitive Rules

**CR 506.1** (verbatim): *"The combat phase has five steps, which proceed in order: beginning of combat, declare attackers, declare blockers, combat damage, and end of combat. The declare blockers and combat damage steps are skipped if no creatures are declared as attackers or put onto the battlefield attacking (see rule 508.8). There are two combat damage steps if any attacking or blocking creature has first strike (see rule 702.7) or double strike (see rule 702.4)."*

**CR 508.1a** (verbatim): *"The active player chooses which creatures that they control, if any, will attack. The chosen creatures must be untapped, they can't also be battles, and each one must either have haste or have been controlled by the active player continuously since the turn began."*

**CR 508.1f** (verbatim): *"The active player taps the chosen creatures. Tapping a creature when it's declared as an attacker isn't a cost; attacking simply causes creatures to become tapped."*

**CR 506.4** (verbatim, excerpt): *"A permanent is removed from combat if it leaves the battlefield, if its controller changes, if it phases out, if an effect specifically removes it from combat, if it's... an attacking or blocking creature that regenerates, stops being a creature, or becomes a battle."*

**CR 506.4b** (verbatim): *"Tapping or untapping a creature that's already been declared as an attacker or blocker doesn't remove it from combat and doesn't prevent its combat damage."*

**CR 509.1h** (verbatim): *"An attacking creature with one or more creatures declared as blockers for it becomes a blocked creature; one with no creatures declared as blockers for it becomes an unblocked creature. This remains unchanged until the creature is removed from combat, an effect says that it becomes blocked or unblocked, or the combat phase ends, whichever comes first. A creature remains blocked even if all the creatures blocking it are removed from combat."*

**CR 510.2** (verbatim): *"Second, all combat damage that's been assigned is dealt simultaneously. This turn-based action doesn't use the stack. No player has the chance to cast spells or activate abilities between the time combat damage is assigned and the time it's dealt."*

**CR 510.4** (verbatim): *"If at least one attacking or blocking creature has first strike or double strike as the combat damage step begins, the only creatures that assign combat damage in that step are those with first strike or double strike. After that step, instead of proceeding to the end of combat step, the phase gets a second combat damage step. The only creatures that assign combat damage in that step are the remaining attackers and blockers that had neither first strike nor double strike as the first combat damage step began, as well as the remaining attackers and blockers that currently have double strike."*

## The Pattern

```
THE FIVE COMBAT STEPS (CR 506.1):
  1. Beginning of Combat Step (507)
     - In multiplayer: active player chooses defending player (turn-based action, no stack).
     - Active player gets priority. Last chance to act BEFORE attackers are declared.
       Example: Fog ({G}): "Prevent all combat damage that would be dealt this turn."
         Cast in beginning of combat BEFORE attackers declared: damage is prevented.
         Cast after declare attackers: still works (prevents all damage this turn).
         BUT: some effects like "creatures can't attack" must be activated in beginning of combat.
     - "At the beginning of combat" abilities trigger here.

  2. Declare Attackers Step (508)
     TURN-BASED ACTION — doesn't use the stack:
       Active player declares all attackers simultaneously.
       Requirements to attack:
         a) Must be an untapped creature (not battle).
         b) Must have haste OR been controlled continuously since the turn began (508.1a).
         c) Tapping to attack is NOT a cost (508.1f) — it just happens.
     RESTRICTIONS AND REQUIREMENTS:
       Restrictions (can't attack): "This creature can't attack alone." Must obey ALL restrictions.
       Requirements (must attack): "Attack if able." Must maximize requirements while obeying restrictions.
       Example (CR 508.1d): If two creatures with "attacks if able" but only one can legally attack:
         Must choose the one that can attack (not allowed to leave both home to "avoid" the requirement).
     TARGET OF ATTACK (508.1b):
       Attacking player announces which creature attacks which player/planeswalker/battle.
       In two-player: simple (must attack the one opponent).
       In multiplayer: must be the chosen defending player or a planeswalker/battle they control.
     TAPPING HAPPENS:
       Creatures tap as they're declared (unless they have vigilance — vigilance = don't tap to attack).
     TRIGGERS FIRE (508.1m):
       "Whenever [creature] attacks..." triggers are put on stack after turn-based action.
       Active player gets priority (508.2). Responses happen here.
     CREATURES ENTERING BATTLEFIELD ATTACKING (508.4):
       "Put onto the battlefield attacking" = already attacking, no declaration.
       They never "attacked" for trigger purposes.
       They're NOT tapped by entering attacking (unless another effect taps them).
       They're subject to restrictions? No — 508.4c: "not affected by restrictions that apply to declaration."

  3. Declare Blockers Step (509)
     TURN-BASED ACTION — defending player declares all blockers simultaneously.
       Requirements to block:
         a) Must be untapped creature (not battle).
         b) No restrictions being violated (evasion keywords, "can't block," etc.) (509.1b).
       LEGAL BLOCKER MUST SATISFY ALL EVASION:
         Flying: blocker needs flying or reach.
         Menace: must declare 2+ blockers for the creature.
         Shadow: blocker must also have shadow.
         If any restriction violated: declaration illegal.
       REQUIREMENTS TO BLOCK:
         "Blocks if able": must block if legally can. But not required to pay optional block costs.
       EACH BLOCKER ASSIGNED TO ONE ATTACKING CREATURE:
         Can't split one blocker across two attackers.
         Multiple blockers can pile onto one attacker.
     BLOCKED vs. UNBLOCKED STATUS SET HERE (509.1h):
       Once declared blocked: remains blocked even if ALL blockers die before damage.
       A creature with trample + blocked: must still assign lethal to each blocker before trampling.
       Unless trample says "as though unblocked" — that's different.
     TRIGGERS FIRE (509.3a):
       "Whenever [creature] blocks..." triggers go on stack.
       "Whenever [creature] becomes blocked..." triggers go on stack.
     ATTACKER ASSIGNS BLOCKER ORDER (after triggers):
       If multiple creatures are blocking one attacker: ATTACKING PLAYER assigns damage order.
       This isn't turn-based. It's announced by the active player.
       (See P001 for damage assignment threshold rules.)

  4. Combat Damage Step (510)
     ASSIGNMENT PHASE (turn-based action, no stack):
       Active player assigns each attacker's damage.
       Defending player assigns each blocker's damage.
       No player can act between assignment and dealing.
     UNBLOCKED ATTACKER (510.1b):
       Assigns all damage to the player/planeswalker/battle being attacked.
     BLOCKED ATTACKER WITH ONE BLOCKER (510.1c):
       Assigns all damage to that blocker.
     BLOCKED ATTACKER WITH MULTIPLE BLOCKERS (510.1c):
       Attacker assigns damage to declared blockers in chosen order.
       Must assign "lethal damage" to each blocker before assigning to the next.
       "Lethal damage" = damage ≥ blocker's toughness (subtracting any damage already marked).
       With DEATHTOUCH: 1 damage is lethal. Can spread 1 damage to each blocker.
     BLOCKER ASSIGNS DAMAGE (510.1d):
       If blocking one creature: all damage to that creature.
       If blocking multiple: divided as controller chooses (rarely happens except with banding).
     DAMAGE DEALT SIMULTANEOUSLY (510.2):
       No priority between assignment and dealing.
       All combat damage resolves at once.
       Example: 2/2 attacker vs. 2/2 blocker — both die simultaneously. You can't kill the blocker
         first to "save" your attacker by giving it +2/+2 after damage (combat damage is instant).
     FIRST STRIKE / DOUBLE STRIKE (510.4):
       If ANY attacker OR blocker has first strike or double strike:
         FIRST COMBAT DAMAGE STEP: only first-strikers and double-strikers deal damage.
         Check: do any creatures die now? SBAs fire. Triggers resolve.
         SECOND COMBAT DAMAGE STEP: non-first-strikers + double-strikers deal damage.
       IMPORTANT: first strikers can KILL blockers before normal damage step.
         A 2/1 first striker vs. a 2/2 blocker: first striker deals 2 in first step → blocker dies.
         Second step: no blocker to assign, first striker takes 0 damage.
         A 1/1 first striker vs. a 2/2 blocker: deals 1 in first step (not lethal). Blocker survives.
         Second step: blocker deals 2 to the first striker → dies.
       GAINING FIRST STRIKE AFTER DECLARATION:
         If a creature gains first strike AFTER the first combat damage step has already occurred:
           It participates in the second combat damage step only (no retroactive first-step inclusion).

  5. End of Combat Step (511)
     "At end of combat" triggers fire (511.2).
     Effects lasting "until end of combat" expire (511.2).
     After end of combat step: all creatures/planeswalkers/battles removed from combat (511.3).
     Removed from combat = stops being attacking/blocking/blocked/unblocked creature.
     Postcombat main phase begins.

REMOVED FROM COMBAT (506.4):
  Causes:
    - Leaves the battlefield (dies, exiled, bounced).
    - Controller changes (gain control of attacker).
    - Phases out.
    - Explicitly removed by effect ("remove [creature] from combat").
    - Stops being a creature (type-change).
    - Regenerates (regen removes from combat but doesn't kill).
  NOT removed from combat:
    - Being tapped or untapped (506.4b).
    - Becoming blocked or unblocked.
    - Simply taking damage.
  TAPPING/UNTAPPING AFTER DECLARATION (506.4b):
    If opponent taps your attacker AFTER it attacked: too late. Still attacks, still deals damage.
    Example: Opponent casts Icy Manipulator tap effect targeting your attacking 5/5.
      After declare attackers: the 5/5 is attacking. Tapping it doesn't remove it from combat.
      It still deals 5 damage. (This "combat trick" against tapping effects doesn't work post-declare.)
    BUT: if tapped BEFORE the declare attackers step: it can't be declared as an attacker.
      Timing of the tap matters: before declaration = can't attack; after declaration = still attacks.

COMBAT TRICKS — TIMING WINDOWS:
  BEFORE COMBAT (beginning of combat step):
    Give evasion (flying, etc.) — set up before blockers declared.
    Set up damage modification (pump, -X/-X kill defender's creatures).
  AFTER DECLARE ATTACKERS, BEFORE BLOCKERS:
    Kill potential blockers. Tap them. Give "can't block" effects.
    Last chance to Fog or damage prevention.
  AFTER DECLARE BLOCKERS, BEFORE DAMAGE:
    Pump attackers (giant growth at instant speed).
    Kill blockers (lightning bolt).
    Modify damage assignment order (rare — must happen when order is announced by active player).
  DURING DAMAGE:
    No priority! Damage is assigned and dealt without a window.
  AFTER DAMAGE, BEFORE EOC:
    Spells/abilities that trigger on damage fire here.
    Lifelink, deathtouch, etc. resolve.

VIGILANCE:
  Vigilance = "attacking doesn't cause this creature to tap" (702.20a).
  Rules still force non-vigilance creatures to tap (508.1f).
  Vigilance creature attacks: doesn't tap. Can still tap for other reasons (abilities, opponents' effects).
  Vigilance doesn't help with blocking — all untapped creatures can block (tapping isn't how blocking works).
```

## Definitive Conclusions

- **No priority during damage assignment** — once damage is assigned, it's dealt simultaneously with no window to act.
- **A blocked creature remains blocked even if all its blockers die** — "blocked" status is set at declare blockers and doesn't revert unless specifically changed or the creature is removed from combat.
- **Tapping an attacker after declare attackers doesn't remove it from combat** — the damage still happens; the tap must happen BEFORE declaration to prevent attacking.
- **First strike creates two damage steps** — first strikers deal damage and blockers may die before the normal damage step; double strikers deal damage in BOTH steps.
- **Damage assignment order matters for multiple-blocker situations** — the attacking player chooses the order and must assign lethal to each blocker before proceeding to the next (except with deathtouch where 1 = lethal).
- **Beginning of combat is the last window before attackers are declared** — pump, evasion grants, and tap effects must happen here to affect what can attack.

## Canonical Example
**Combat Trick Timing — The Giant Growth Window:**
You control a 2/2 Grizzly Bears. Opponent controls a 3/3 Leatherback Baloth.
Turn: yours. You declare Grizzly Bears as an attacker.

After declare attackers (priority window): you hold priority. No pump yet.
Opponent declares Leatherback Baloth as a blocker.
After declare blockers (priority window):
  You cast Giant Growth ({G}): "Target creature gets +3/+3 until end of turn."
  Target: Grizzly Bears. It becomes 5/5.
Combat damage:
  Grizzly Bears (5/5) vs. Leatherback Baloth (3/3).
  Grizzly Bears assigns 5 damage to Baloth (lethal — Baloth has 3 toughness, 5 ≥ 3).
  Leatherback Baloth assigns 3 damage to Grizzly Bears (3 ≥ 2 toughness, lethal).
  Simultaneously: Grizzly Bears takes 3 damage (dies — 2 toughness), Baloth takes 5 damage (dies — 3 toughness).
Both die. Giant Growth didn't save Bears — Baloth's damage kills it despite the pump.

For Giant Growth to save Bears: you need it before damage is dealt (after blockers declared, before damage — which is the right window). But in this case Bears has 2 toughness and Baloth deals 3 — +3/+3 makes Bears 5/5, still takes 3 damage. Bears toughness = 5, so it survives! And it deals 5 to Baloth (lethal). Result: Bears lives, Baloth dies.

Wait — with Giant Growth (Bears 5/5 toughness): takes 3 damage, which isn't lethal (3 < 5). Bears survives!
Correct: Giant Growth cast at the right window (after blockers declared) saves Grizzly Bears.

**Example 2 — First Strike Two-Step:**
You control: Serra Angel ({3}{W}{W}): 4/4 flying vigilance. **No first strike.**
Opponent blocks with: Mirran Crusader ({1}{W}{W}): 2/2 double strike, protection from black/green.

First combat damage step:
  Mirran Crusader has double strike → participates in first step.
  Serra Angel has NO first strike → does NOT deal damage in first step.
  Mirran Crusader deals 2 damage to Serra Angel.
  SBAs: Serra Angel has 4 toughness, only 2 damage marked. Survives.

Second combat damage step:
  Serra Angel (now with 2 damage on it) deals 4 damage to Mirran Crusader.
  Mirran Crusader has double strike → also deals 2 more damage to Serra Angel.
  Damage dealt simultaneously:
    Serra Angel: had 2 damage from step 1 + 2 more = 4 total. Serra Angel toughness = 4. Dies (704.5g).
    Mirran Crusader: takes 4 damage from Serra Angel. Toughness = 2. Dies.

Result: both die. Serra Angel took 4 total damage (2 + 2), Mirran Crusader took 4 (fatal given 2 toughness).
Note: Mirran Crusader's protection from black and green doesn't help here — Serra Angel is white.
If you could give Mirran Crusader +0/+4 toughness: it survives Serra Angel's 4 damage and wins the fight via double strike.

## Commonly Confused With
- **P001 (Threshold Damage Assignment)** — Damage assignment ORDER and the "lethal damage" threshold rule. P001 covers the mechanics of multiple-blocker assignment in detail; P341 covers the broader combat phase structure and steps.
- **P340 (Evasion Keywords)** — Evasion abilities restrict what creatures can legally block an attacker. P341 covers WHEN and HOW blocking declarations are made; P340 covers which creatures qualify as legal blockers.
- **P339 (Dies vs LTB)** — When a creature dies during combat (to damage, SBAs), its death triggers follow the "dies" = GY-from-battlefield rule. P341 covers the structure of combat; P339 covers what death means.
- **P309 (First Strike / Double Strike)** — First strike/double strike create the two-step combat damage. P341 covers the two-step structure at a high level; detailed first-strike interactions live in P309.
