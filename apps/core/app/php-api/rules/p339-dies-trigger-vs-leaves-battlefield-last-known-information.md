---
id: p339
name: "Dies" vs "Leaves the Battlefield" — Trigger Conditions and Last Known Information
category: triggered
cr_refs: [700.4, 603.6, 603.6a, 603.6c, 603.10, 603.10a, 400.7]
tags: [dies, leaves-the-battlefield, last-known-information, trigger-condition, graveyard-trigger, LTB-trigger, zone-change-trigger, Mikaeus, Grave-Pact, Blood-Artist, command-zone-not-dying, Deathmist-Raptor, Reclamation-Sage, persist-trigger, ETB-vs-LTB]
created: 2026-03-29
examples_count: 2
---

# P339 — "Dies" vs "Leaves the Battlefield" — Trigger Conditions and Last Known Information

## Abstract
**"Dies"** has a specific rules definition: "is put into a graveyard from the battlefield" (CR 700.4). A creature that goes from the battlefield to the COMMAND ZONE did NOT die. A creature that's exiled did NOT die. By contrast, **"leaves the battlefield"** triggers whenever a permanent moves from the battlefield to ANY zone. Understanding which trigger condition applies determines what fires when. **Last known information (LKI)** allows triggered abilities and effects to reference characteristics of the permanent as they existed just before it left — crucial for "when X dies, deal damage equal to its power" effects.

## The Definitive Rules

**CR 700.4** (verbatim): *"The term dies means 'is put into a graveyard from the battlefield.'"*

**CR 603.6c** (verbatim): *"Leaves-the-battlefield abilities trigger when a permanent moves from the battlefield to another zone, or when a phased-in permanent leaves the game because its owner leaves the game. These are written as, but aren't limited to, 'When [this object] leaves the battlefield, . . .' or 'Whenever [something] is put into a graveyard from the battlefield, . . .' (See also rule 603.10.)"*

**CR 603.10** (verbatim): *"Normally, objects that exist immediately after an event are checked to see if the event matched any trigger conditions, and continuous effects that exist at that time are used to determine what the trigger conditions are and what the objects involved in the event look like. However, some triggered abilities are exceptions to this rule; the game 'looks back in time' to determine if those abilities trigger."*

**CR 603.10a** (verbatim): *"Some zone-change triggers look back in time. These are leaves-the-battlefield abilities, abilities that trigger when a card leaves a graveyard, and abilities that trigger when an object that all players can see is put into a hand or library."*

## The Pattern

```
THE "DIES" DEFINITION (CR 700.4):
  DIES = "is put into a graveyard from the battlefield."
  Required: started on the battlefield, went to the graveyard.
  NOT DYING:
    Creature goes from battlefield to exile → exiled, not dead.
    Creature goes from battlefield to hand (bounce) → bounced, not dead.
    Commander goes from battlefield to command zone → command-zoned, not dead.
    Creature phases out → phased out, not dead.
    Creature is sacrificed but its replacement sends it to exile → NOT dead.
    Token that "dies" → goes to GY momentarily then ceases to exist? No: tokens die when they'd go to GY.
      Wait: CR 704.5d: tokens in zones other than battlefield cease to exist.
      A token that would die: it IS put into the GY (if nothing prevents it), then it ceases to exist (SBA).
      But it DID reach the GY → "dies" trigger fires for the token being put into GY.
      Then the SBA removes the token. But the trigger already fired.

  EFFECT: if a trigger says "whenever a creature DIES," it fires only when the creature goes to GY.
    Grave Pact ({1}{B}{B}{B}): "Whenever a creature you control dies, each other player sacrifices a creature."
    Dictate of Erebos ({3}{B}{B}): same effect.
    Blood Artist ({1}{B}): "Whenever Blood Artist or another creature dies, target player loses 1 life..."
    If your creature is exiled (Path to Exile, etc.): these triggers DON'T fire. No "dies" event.
    If your Commander goes to command zone instead of GY: no "dies" event. Grave Pact doesn't trigger.

LEAVES THE BATTLEFIELD (LTB):
  LTB triggers fire when a permanent moves from the battlefield to ANY zone.
    → To GY (dying)
    → To exile
    → To hand (bounce)
    → To library (Condemn puts creature on bottom)
    → To command zone
  More inclusive than "dies."
  Examples:
    "When [creature] leaves the battlefield...": fires regardless of destination.
    Skullclamp's trigger: "Whenever equipped creature dies, draw 2 cards." Dies-trigger only.
      If creature is bounced while equipped: Skullclamp trigger does NOT fire. Creature didn't die.
      Must actually go to GY.
    Witness the Future (Eternalize) or similar effects that care about specific zone destination.

LAST KNOWN INFORMATION (LKI) — CR 603.10a:
  When a permanent "looks back in time" before it left the battlefield.
  LKI applies to:
    - Leaves-the-battlefield triggers
    - Abilities that trigger when a card leaves a graveyard
    - Abilities that trigger when an object goes to a hand or library
  HOW LKI WORKS:
    The game "looks back" to the state immediately before the permanent left.
    Triggers use this information to determine:
      1. Whether the trigger should fire at all.
      2. What values to use in the trigger's effect.
  EXAMPLES OF LKI:
    Solemn Simulacrum ({4}: 2/2 Golem): "When Solemn Simulacrum dies, you may draw a card."
    Solemn is a 2/2. Opponent gives it -2/-2 (making it 0/0) and then it dies.
    LKI: what was Solemn before it left? A 2/2 with -2/-2 marks on it (0/0 effective). It was a creature.
    The "dies" trigger: did Solemn die? Yes (went to GY from battlefield). Trigger fires.
    LKI for VALUES in the trigger:
    Nekrataal: "When Nekrataal enters, destroy target non-black, non-artifact creature."
      Not an LKI scenario. The ETB uses current info.
    Goblin Sharpshooter ("Whenever a creature dies, untap Sharpshooter and it deals 1 damage"):
      LKI: the creature that died — was it a creature when it left? LKI checks the state before death.
      If something was a creature when it died: trigger fires.
      If something that was a creature became a non-creature before dying (e.g., via a type-changing effect): LKI checks the state immediately before death. Was it a creature then? If type change happened before the death event: it might not be a creature at death.
      This gets complex. Typically: if a creature dies during combat, it was a creature when it died.

  CLASSIC LKI TRAP — TRIGGERED ABILITY REFERENCING THE DEAD CREATURE'S VALUES:
    Brion Stoutarm ({2}{R}{W}): "T, sacrifice a creature: Brion Stoutarm deals damage equal to the sacrificed creature's power to target player or planeswalker."
    You sacrifice a 5/5 creature → 5 damage to opponent.
    LKI: power is measured at the time of sacrifice (last known). The creature's power WAS 5.
    What if the creature had +2/+2 from a pump spell that expired? The pump expired before sacrifice.
      At time of sacrifice, the creature's power is base power. LKI uses that value.
    What if you pump the creature AS you sacrifice it? The pump is applied simultaneously or before.
      Stack: Brion activation (sacrifice + target). You pay {T} + sacrifice. The creature leaves the field.
      LKI: its power just before leaving the battlefield (with any active boosts that were continuous effects).

  LKI PREVENTS INFORMATION LOSS:
    Without LKI: when a creature leaves the battlefield, it's a new object with no characteristics.
      Triggers would have no way to check what the dead creature was.
    With LKI: triggered abilities can look at what the creature was just before it left.
    This allows "when X dies, gain life equal to X's toughness" to work correctly.

"DIES" TRIGGER FROM OUTSIDE YOUR CONTROL:
  Blood Artist / Zulaport Cutthroat: trigger when ANY creature dies.
    Opponent's creatures dying also triggers Blood Artist.
    Wrath of God: all creatures die. Each triggers Blood Artist.
    In a 100-creature board state + Blood Artist: Blood Artist triggers 100 times.

  GRAVE PACT CHAIN:
    Creature A dies → Grave Pact triggers → opponent sacrifices creature B.
    Does creature B dying trigger Grave Pact again? YES.
    Creature B was SACRIFICED → B goes to GY → B "dies" (GY from battlefield) → Grave Pact triggers.
    In a loop: each sac triggers the next. Until no more creatures.
    CRITICAL: this can spiral in multiplayer Commander. Each player losing creatures.

PHASED-OUT PERMANENTS AND DEATH:
  Phased-out permanents don't change zones. They're not "on the battlefield" effectively.
  But: CR 702.26d: phasing doesn't count as leaving the battlefield for triggers or history.
  A phased-out creature that's "destroyed" while phased out: phased-out permanents don't exist for most purposes.
  Wrath of God "destroys all creatures": doesn't affect phased-out creatures (they don't exist).
  So phased-out creatures don't die during Wrath.
```

## Definitive Conclusions

- **"Dies" only triggers when a creature goes from battlefield to GY** — exile, bounce, and command zone all prevent "dies" triggers.
- **"Leaves the battlefield" is broader** — fires on any zone change from the battlefield (to GY, exile, hand, library, or command zone).
- **LKI applies to leaves-the-battlefield triggers** — the game looks back in time to determine characteristics just before the permanent left.
- **Tokens do "die"** — they go to the GY (triggering "dies" triggers), then cease to exist as an SBA.
- **Grave Pact chains: each sacrifice is a separate "dies" event** — each death triggers Grave Pact independently, potentially cascading.
- **Phased-out creatures don't die during "destroy all creatures"** — phasing keeps them "not existing" for most effects.

## Canonical Example
**Blood Artist — Every Death Counts:**
You control Blood Artist ({1}{B}: 0/1 Vampire Artist). "Whenever Blood Artist or another creature dies, target player loses 1 life and you gain 1 life."
Opponent casts Wrath of God (destroy all creatures).
Board: 5 of your creatures (including Blood Artist) + 4 opponent's creatures.
All 9 creatures die simultaneously (Wrath).
Blood Artist triggers 9 times (for each creature dying, including itself).
Wait: Blood Artist is being destroyed too. Does it trigger for itself?
Yes: "whenever Blood Artist or another creature dies." Blood Artist dying = Blood Artist or another creature. It counts itself.
But: Blood Artist leaves the battlefield (it's destroyed). Can it still trigger?
Yes: the trigger FIRES before Blood Artist's characteristics change. LKI: Blood Artist was a creature when everything died. 9 triggers fire.
Each trigger: target player loses 1 life + you gain 1 life.
You choose to target opponent 9 times. Opponent loses 9 life. You gain 9 life.
From a board wipe: effectively gave your opponent a -9 life swing.

Note: if opponent exiles Blood Artist BEFORE casting Wrath (to silence it): no triggers.
Path to Exile on Blood Artist → Blood Artist exiled → Wrath destroys remaining creatures → no Blood Artist to trigger.
Order of operations matters.

**Example 2 — Commander Goes to Command Zone, Not "Dies":**
Your commander: Ghave, Guru of Spores ({2}{W}{B}{G}: 0/0 Fungus Shaman, enters with 5 counters).
You control Butcher of Malakir ({5}{B}{B}): "Whenever Butcher of Malakir or another creature you control dies, each opponent sacrifices a creature."
Opponent casts Swords to Plowshares targeting Ghave.
You choose to put Ghave in the command zone (CR 903.9b replacement effect) instead of exile.

Did Ghave go to exile? NO. It went to the command zone (you chose the replacement).
Did Butcher of Malakir's trigger fire? Let's check:
"Whenever Butcher or another creature you control DIES." DIES = goes to GY from battlefield.
Ghave went from battlefield to command zone. NOT to GY.
Result: Ghave did NOT die. Butcher of Malakir's trigger does NOT fire.
Each opponent does NOT have to sacrifice a creature.

If instead you had chosen to let Ghave go to exile (not choosing the command zone option):
Ghave goes to exile. Still not GY. Still "not dying." Still no Butcher trigger.

For Butcher to trigger: Ghave would need to actually go to the GY.
That means: not using the command zone option AND not being exiled.
Example: Doom Blade on Ghave (destroy). You choose not to command-zone it. Ghave goes to GY. NOW Butcher triggers.

## Commonly Confused With
- **P311 (New Object Rule)** — When a creature dies and is reanimated, it's a new object with no memory. LKI applies at the moment of death (just before), not at reanimation.
- **P330 (Commander)** — Going to command zone is a replacement effect/SBA, not a "dies" event. This fundamentally changes interactions with death triggers.
- **P325 (Finality Counters)** — A creature with a finality counter that "dies" goes to exile instead (replacement effect). The creature moved from battlefield → exile. Not to GY. So "dies" triggers don't fire for it. Neither do most "when this leaves the battlefield" triggers if they specifically look for the creature in the GY.
- **P332 (Phasing)** — Phasing does not cause zone changes, so no "dies" or LTB triggers fire. This is distinct from all other ways a creature can leave the battlefield.
