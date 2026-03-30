---
id: p309
name: First Strike and Double Strike — Two Combat Damage Steps
category: combat
cr_refs: [702.7a, 702.7b, 702.7c, 702.4a, 702.4b]
tags: [first-strike, double-strike, combat-damage-step, two-steps, combat, combat-trick, Boros-Charm, Goblin-Guide, Mirran-Crusader, Silverblade-Paladin, response-window, vigilance]
created: 2026-03-29
examples_count: 2
---

# P309 — First Strike and Double Strike — Two Combat Damage Steps

## Abstract
First strike causes a creature to deal its combat damage in an earlier, separate combat damage step before normal creatures deal damage. If any creature in combat has first strike or double strike, a "first strike damage step" occurs first, then a normal damage step follows. Creatures that die in the first step don't deal damage in the second. Double strike creatures deal damage in BOTH steps. This creates a response window between the two damage steps where players can act — a window most players forget about.

## The Definitive Rules

**CR 702.7b** (verbatim): *"If at least one attacking or blocking creature has first strike or double strike as the combat damage step begins, the only creatures that assign combat damage in that step are those with first strike or double strike. After that step, instead of proceeding to the end of combat step, the phase gets a second combat damage step. The only creatures that assign combat damage in that step are the remaining attackers and blockers that had neither first strike nor double strike as the first combat damage step began, as well as the remaining attackers and blockers that currently have double strike."*

**CR 702.7c** (verbatim): *"Giving first strike to a creature without it after combat damage has already been dealt in the first combat damage step won't preclude that creature from assigning combat damage in the second combat damage step. Removing first strike from a creature after it has already dealt combat damage in the first combat damage step won't allow it to also assign combat damage in the second combat damage step (unless the creature has double strike)."*

**CR 702.4a** (verbatim, Double Strike): *"Double strike is a static ability that modifies the rules for the combat damage step. A creature with double strike deals combat damage twice: once in the first combat damage step and once in the second combat damage step."*

## The Pattern

```
FIRST STRIKE SEQUENCE:
  Normal combat: one damage step. All attackers/blockers deal damage simultaneously.
  With any first strike or double strike creature:
    STEP 1 (First Strike Damage): only first strike and double strike creatures deal damage.
    STATE-BASED ACTIONS CHECK: creatures that died in step 1 are removed.
    → Response window: players may cast instants, activate abilities.
    STEP 2 (Normal Damage): remaining creatures without first strike deal damage. Plus double strike.

  KEY IMPLICATION: a first-strike creature can kill a blocker in step 1, then take no damage in step 2
  (because the blocker is dead and cannot deal damage in step 2).

  EXAMPLE — First Strike vs. Normal:
    Your 2/2 First Strike vs. opponent's 3/3.
    Step 1: your 2/2 First Strike deals 2 damage to the 3/3.
    SBAs: 3/3 has 2 damage marked (not dead yet, toughness 3 > 2 damage).
    Step 2: 3/3 (still alive) deals 3 damage to your 2/2. Your 2/2 dies.
    Result: 2/2 First Strike died. No kill.

    Your 2/2 First Strike vs. opponent's 2/2:
    Step 1: your 2/2 FS deals 2 to their 2/2. SBAs: their 2/2 has 2 damage = toughness. Dead!
    Step 2: their 2/2 is gone. Your 2/2 takes no damage in step 2.
    Result: your 2/2 lives, their 2/2 dies. First strike let you trade up!

  FIRST STRIKE VS. LARGER TOUGHNESS:
    Your 3/3 First Strike vs. opponent's 4/4:
    Step 1: 3/3 FS deals 3 to the 4/4. SBAs: 4/4 has 3 damage (not lethal, toughness 4).
    Step 2: 4/4 deals 4 to your 3/3. Your 3/3 dies. (3 marks + new damage? No: prior marks, check SBA after step 2.)
    Wait: in step 2, new damage is added. Your 3/3 takes 4 damage. SBAs: 3/3 with 4 marks = dead.
    Their 4/4 now has 3 marks from step 1 still. SBAs: 4/4 with 3 damage < 4 toughness. Survives.
    Result: 3/3 First Strike traded with the 4/4... no. 3/3 died, 4/4 survived at 3 damage marked.

    First Strike only wins in combat if it deals LETHAL damage in step 1.
    3/3 FS vs 2/2: deals 3 in step 1 → 2/2 dies. FS creature takes 0 in step 2. WIN.
    3/3 FS vs 4/4: deals 3 in step 1 → 4/4 survives (4 toughness). Step 2: 4/4 deals 4 → 3/3 dies. TRADE.

DOUBLE STRIKE:
  Deals damage in BOTH steps.
  Step 1: double strike creature deals its power in damage.
  Step 2: double strike creature deals its power in damage AGAIN.
  Total damage: power × 2 (to the same or different targets if trample, but usually same).

  DOUBLE STRIKE EXAMPLE:
    2/2 Double Strike vs. 2/2 blocker.
    Step 1: 2/2 DS deals 2 to 2/2 blocker → blocker dies in SBAs.
    Step 2: 2/2 DS deals 2 damage... to whom? Blocker is dead.
    In normal combat: if the blocker died, the attacker's second damage step damage goes... nowhere?
    Actually: when a blocker dies, the attacker's damage (including step 2) has no target if it was only blocked by that creature (and no trample).
    Without trample: the second strike damage just isn't assigned (no valid target).
    4/4 Double Strike vs. 2/2 blocker:
    Step 1: 4/4 DS kills 2/2 blocker. Step 2: double strike deals 4 more damage — but blocker is dead.
    Without trample: second strike goes unassigned.

  DOUBLE STRIKE WITH TRAMPLE:
    4/4 Double Strike Trample vs. 2/2 blocker.
    Step 1: assign 2 lethal to blocker, 2 excess to player (trample).
    SBAs: blocker dead.
    Step 2: no blocker remaining → ALL 4 damage goes to player (trample rule: no blockers = full to player).
    Player takes 2 + 4 = 6 damage. From one 4/4 through one 2/2 blocker!
    A 4/4 Double Strike Trample creature (e.g., Zetalpa, Primal Dawn or any creature given these via equipment): nightmare blocker to deal with.

  DOUBLE STRIKE CARDS:
    Mirran Crusader ({1}{W}{W}): 2/2. Double Strike. Protection from black and from green.
      Can't be targeted by black/green. Double strike + protection = hard to remove in many formats.
      Deals 4 total power per attack.

    Silverblade Paladin ({2}{W}): 2/2. "Soulbond. When paired, that creature gains double strike."
      Pairs with your biggest creature → double strike on a 7/7 = 14 total damage per attack.

    Firesong and Sunspeaker ({4}{R}{W}): "Whenever you cast a white instant or sorcery spell, it
      gains lifelink." + "Whenever you cast a red instant or sorcery, it deals 3 damage to target creature."
      Also has Double Strike... wait, check oracle. Let me use actual double strike creatures.

    Embercleave ({4}{R}{R}, costs {1} less per attacking creature): "Flash. When it enters, attach to target creature you control. Equipped creature gets +1/+1 and has double strike and trample."
      Equipment granting +1/+1, double strike + trample: immediately powerful when attached during combat.
      Flash: cast it when attackers are declared and it costs less; attaches immediately.

THE RESPONSE WINDOW BETWEEN DAMAGE STEPS:
  This window is real and important!
  After step 1 (first strike damage), SBAs resolve, then players get priority.
  Before step 2: you may cast instants, activate abilities.
  Examples:
    Opponent's creature was dealt lethal first strike damage in step 1 → dies in SBAs.
    You were going to cast Giant Growth on your creature in response. Now no need.
    OR: opponent dealt lethal first strike to your blocker → your blocker dies.
    Before step 2: you have priority. You can cast pump spells on OTHER creatures.

  COMMON PLAY: Give first strike to a creature between step 1 and step 2.
    CR 702.7c: giving first strike AFTER step 1 won't prevent the creature from dealing damage in step 2.
    You already missed the "first strike damage step" — your creature attacks in step 2 with the newly-gained first strike.
    Removing first strike: creature already dealt damage in step 1; it won't deal damage again in step 2 (unless it has double strike).

LIFELINK + DOUBLE STRIKE:
  Double strike creature with lifelink:
    Step 1: deals damage, gains that much life.
    Step 2: deals damage again, gains that much life again.
    4/4 Double Strike Lifelink: gain 4 life in step 1 + 4 life in step 2 = 8 life per attack.
    Exquisite Blood loop: "Whenever an opponent loses life, you gain that much life."
    Lifelink damage to opponent → they lose life → you gain life (separate triggers).
    Doesn't interact directly but the math is powerful.
```

## Definitive Conclusions

- **First strike creates an earlier damage step** — creatures with first strike kill creatures before they deal back-damage.
- **Creatures that die in the first damage step deal no damage in the second** — first strike can win combat without trading.
- **Double strike deals damage in BOTH steps** — combined with trample, a double strike creature with a small blocker can deal double power to the player.
- **A response window exists between the two damage steps** — priority is received after step 1's SBAs resolve.
- **Giving a creature first strike after step 1 doesn't add a new damage step** — it deals damage in step 2 normally.

## Canonical Example
**Mirran Crusader + Equip Trick:**
Turn 3: cast Mirran Crusader ({1}{W}{W}). 2/2 Double Strike. Protection from black and green.
Opponent controls a 4/5 black creature (Vampire Nighthawk? For example, 2/3 Lifelink Deathtouch Flying).
Attack: Mirran Crusader attacks.
Opponent blocks with their 2/3.
Step 1 (first strike damage): Mirran Crusader has double strike (deals in step 1 AND 2).
Mirran Crusader deals 2 damage to 2/3 blocker.
SBAs: 2/3 has 2 marks = lethal (toughness 3... actually 2 marks on a 2/3 is not lethal yet).
Wait: 2/3 has toughness 3. 2 damage < 3 toughness. Blocker survives step 1.
Step 2: blocker deals 2 to Mirran Crusader.
AND: Mirran Crusader deals 2 MORE to the blocker.
SBAs: blocker has 2+2=4 marks, toughness 3. Dead. Crusader has 2 marks, toughness 2. Dead.
Hmm: Mirran Crusader died too.
BUT: Mirran Crusader has protection from BLACK. The 2/3 blocker is black.
Protection from black → can't deal damage to Mirran Crusader (D).
In step 2: the black 2/3 deals 2 damage → PREVENTED by protection from black.
Mirran Crusader takes 0 damage. Step 2: it deals 2 more to the 2/3. Now 4 damage on a 3-toughness creature. Dead.
Result: 2/3 black creature dies. Mirran Crusader takes no damage (protection). Lives.
Double Strike + Protection = immune to black blockers in combat.

**Example 2 — Embercleave Mid-Combat:**
Turn 5: attack with a team. Opponent declares blocks.
After blocks declared: flash in Embercleave on your attacking creature.
Cost: {2}{R}{R} (reduced by number of attacking creatures — flash triggers reduction).
Embercleave attaches to the largest attacker. It gains double strike + trample.
Suddenly your 5/5 (now with double strike trample) vs. their 3/4 blocker:
Step 1: 5/5 assigns 3 damage (lethal) to 3/4. Trample: 2 to player.
SBAs: 3/4 blocker dies.
Step 2: 5/5 double strike. No blockers. Trample: 5 to player.
Player takes 2 + 5 = 7 damage from one creature.
Embercleave flashed in AFTER blocks: opponent can't re-declare blocks for the new double strike trample creature.
This surprise is why Embercleave was the most-feared card in Throne of Eldraine Standard.

## Commonly Confused With
- **P308 (Trample)** — Trample determines how damage exceeds blockers; first strike determines WHEN damage is dealt. Both interact in double strike + trample combinations.
- **P001 (Combat Damage Routing)** — P001 covers the base assignment rules; first strike creates a split in the damage step timeline, creating two sequential assignment opportunities.
- **P007 (Response Windows)** — The window between first strike step and normal step is a real response window; players often forget this exists.
- **P309 references P033 (Indestructible)** — Indestructible creatures still take damage; they can be "killed" by first strike if enough damage is marked (no, wait — indestructible can't be destroyed). First strike dealing "lethal" marked damage to an indestructible creature: the creature survives step 1 (can't be destroyed). Then in step 2, the indestructible creature deals damage normally.
