---
id: p386
name: Backup, Bargain, and Craft — Ability-Granting, Optional Sacrifice, and Exile-to-Transform
category: costs
cr_refs: [702.165a, 702.165b, 702.165c, 702.165d, 702.166a, 702.166b, 702.166c, 702.166d, 702.167a, 702.167b, 702.167c]
tags: [backup, bargain, craft, ability-granting-ETB, sacrifice-artifact-enchantment-token, exile-materials-transform, backup-self-counter, bargained-flag, craft-sorcery-speed, ability-locked-at-stack-time, Beluna-Grandsquall, Abuelo-Ancestral-Echo, Restless-Bivouac, Barrow-Witches, Iridescent-Hornbeetle, Collector-Cage, Kellan-Kid]
created: 2026-03-29
examples_count: 2
---

# P386 — Backup, Bargain, and Craft — Ability-Granting, Optional Sacrifice, and Exile-to-Transform

## Abstract
**Backup** (702.165) is a triggered ability that fires when the creature with backup enters the battlefield: it puts N +1/+1 counters on target creature, and if that target is ANOTHER creature (not itself), it also grants that target all non-backup abilities of the backup creature until end of turn. **Bargain** (702.166) is an optional additional cost: sacrifice an artifact, enchantment, or token to gain an enhanced effect from the spell (the "bargained" version of the effect — if the card was bargained, extra things happen). **Craft** (702.167) is a sorcery-speed activated ability: exile this permanent + exile specified materials (from battlefield or GY) to return this card transformed. All three are from Wilds of Eldraine and The Lost Caverns of Ixalan era, providing synergies with sacrifice, graveyard recursion, and "self-improving" permanent strategies.

## The Definitive Rules

**CR 702.165a** (verbatim): *"Backup is a triggered ability. 'Backup N' means 'When this creature enters, put N +1/+1 counters on target creature. If that's another creature, it also gains the non-backup abilities of this creature printed below this one until end of turn.'"*

**CR 702.165c** (verbatim): *"Only abilities printed on the object with backup are granted by its backup ability. Any abilities gained by a permanent, whether due to a copy effect, an effect that grants an ability to a permanent, or an effect that creates a token with certain abilities, are not granted by a backup ability."*

**CR 702.165d** (verbatim): *"The abilities that a backup ability grants are determined as the ability is put on the stack. They won't change if the permanent with backup loses any abilities after the ability is put on the stack but before it resolves."*

**CR 702.166a** (verbatim): *"Bargain is a static ability that functions while the spell with bargain is on the stack. 'Bargain' means 'As an additional cost to cast this spell, you may sacrifice an artifact, enchantment, or token.' Paying a spell's bargain cost follows the rules for paying additional costs."*

**CR 702.166b** (verbatim): *"If a spell's controller declares the intention to pay that spell's bargain cost, that spell has been 'bargained.'"*

**CR 702.166d** (verbatim): *"If part of a spell's ability has its effect only if that spell was bargained and that part of the ability includes any targets, the spell's controller chooses those targets only if that spell was bargained. Otherwise, the spell is cast as if it did not have those targets."*

**CR 702.167a** (verbatim): *"Craft represents an activated ability. It is written as 'Craft with [materials] [cost],' where [materials] is a description of one or more objects. It means '[Cost], Exile this permanent, Exile [materials] from among permanents you control and/or cards in your graveyard: Return this card to the battlefield transformed under its owner's control. Activate only as a sorcery.'"*

## The Pattern

```
BACKUP (702.165):
  HOW IT WORKS:
    ETB trigger: "When this creature enters the battlefield, put N +1/+1 counters on target creature."
    IF the target is ANOTHER creature (not the backup creature itself):
      The target ALSO gains all non-backup abilities printed below the backup text, until EOT.
    IF the target IS the backup creature itself:
      Just gets N +1/+1 counters. No ability-granting (can't grant to itself via this).
  WHAT ABILITIES ARE GRANTED:
    702.165a: "non-backup abilities of this creature PRINTED BELOW THIS ONE."
    "Printed below" = abilities that appear after the backup text on the card.
    Abilities printed BEFORE the backup text are NOT granted.
    Only PRINTED abilities — not abilities gained via copy effects or other grants (702.165c).
    EXAMPLE: A creature has:
      Line 1: "When this creature enters, draw a card." (BEFORE backup)
      Line 2: "Backup 1"
      Line 3: "First strike." (AFTER backup)
      Line 4: "Whenever this creature attacks, it gets +1/+0 until end of turn." (AFTER backup)
      If you target ANOTHER creature: they get first strike + the "whenever attacks +1/+0" trigger.
      They do NOT get the "draw a card" ETB from line 1 (it's before backup).
      Also: the ETB trigger already resolved (entering); it doesn't re-trigger on the target.
  ABILITIES LOCKED AT STACK TIME (702.165d):
    "The abilities granted are determined as the ability is put on the stack."
    If the backup creature loses abilities after the trigger is put on the stack (but before it
      resolves): those abilities have already been determined. They're still granted.
    Example: In response to backup trigger, opponent casts Humility (all creatures become 1/1
      with no abilities). The backup trigger is already on the stack. It still grants the originally
      printed abilities (what they were when the trigger was created).
      At resolution: the granted abilities might be immediately removed by Humility's continuous
        effect (layer 6). But the backup trigger still resolved "granting" them.
      In practice: Humility removes them after granting → creature still has Humility's effect.
  BACKUP TO SELF:
    You may target the backup creature itself.
    Result: N +1/+1 counters only. No ability grant (can't grant non-backup abilities to itself
      — well, 702.165a says "if that's another creature" triggers the ability grant).
    If you target yourself: just counters. Useful if no better target exists.
  TOKEN COPYING BACKUP:
    702.165b: "If a permanent enters as a copy of a permanent with backup, the order of abilities
      is maintained."
    A token that is a copy of a backup creature: the copy has the abilities in the same order.
    Backup trigger fires for the token ETB. The "printed below" abilities are the same as the original.
  EXAMPLE — BELUNA GRANDSQUALL ({3}{R}{G}):
    "Backup 1. (Grants below-listed abilities to another creature.)
    Trample. Whenever this creature attacks, create a 2/2 green Bear creature token that's tapped
      and attacking."
    If you backup another creature: it gets trample AND "whenever attacks, create a Bear token."
    For one turn, that other creature effectively has both abilities.
    The Bear-creating trigger: fires for the target creature's attacks THAT turn (EOT expires).
    Next turn: the target creature no longer has the Bear-creating trigger.
    Beluna herself: gains the 1 counter. Next time she attacks: creates a Bear token permanently.

BARGAIN (702.166):
  WHAT IT IS:
    Optional additional cost during casting: sacrifice one artifact, enchantment, or token.
    Sacrificing for this purpose = "paying the bargain cost."
    The spell is "bargained" if the cost was paid (702.166b).
    Bargained spells have additional effects that trigger if the spell was bargained.
  TARGETS FOR BARGAINED EFFECTS:
    702.166d: "If part of a spell's ability has its effect only if that spell was bargained and
      that part includes any targets, the spell's controller chooses those targets only if
      that spell was bargained."
    If you DON'T bargain: you can't choose targets for bargained-only effects.
    If you DO bargain: you choose targets for those effects as normal (during casting).
  WHAT CAN BE SACRIFICED:
    "An artifact, enchantment, or token."
    NOT a creature (unless it's also an artifact or token).
    NOT a land.
    NOT a sorcery or instant.
    Tokens: any token qualifies (including creature tokens, treasure tokens, food tokens, etc.).
    Clue/treasure/food tokens: perfect bargain fodder.
  EXAMPLE — INTO THE FLOOD MAW ({6}{U}: "Bargain. Return all non-Aura permanents you don't
    control to their owners' hands. If this spell was bargained, you also draw a card."):
    Without bargain: pay {6}{U}, bounce everything you don't control. Massive sweep.
    With bargain: pay {6}{U} + sacrifice an artifact/enchantment/token:
      Bounce everything + draw a card.
    Sacrifice a Clue token: trivial cost. Get a card draw on top of the bounce.
    The bargain "bonus" is a draw — a small but real benefit for a cheap cost.
  BARGAIN IN ELDRAINE CONTEXT:
    Wilds of Eldraine: many tokens (food, role-enchantments) can be bargained.
    Roles (enchantment Auras created by Eldraine cards): "Virtuous" role, "Monster" role, etc.
      These are enchantments → can be sacrificed as bargain cost.
    Food tokens: artifacts → can be sacrificed as bargain cost.
    Strategic: use expired-value tokens to upgrade your spells.
  ABUELO'S AWAKENING ({X}{W}: "Return target artifact or creature card from your graveyard...
    If this spell was bargained, that card returns with two +1/+1 counters and indestructible."):
    Normal: spend {X}{W}, return a card. X mana value determines nothing specific.
    Wait: probably it returns with X counters normally and the bargain adds counters + indestructible.
    The bargain bonus is often powerful enough to justify sacrificing something.

CRAFT (702.167):
  WHAT IT IS:
    An activated ability on certain DFC permanents (primarily from Lost Caverns of Ixalan).
    Lets you "craft" the permanent by exiling it + specified materials → transforms it.
    "Craft with [materials] [cost]" means:
      "[Cost], Exile this permanent, Exile [materials] from among permanents you control and/or
        cards in your graveyard: Return this card to the battlefield transformed."
    "Activate only as a sorcery."
  HOW IT WORKS:
    Craft is a sorcery-speed activated ability.
    Pay the cost (usually mana). Exile this permanent. Exile the specified "materials."
    The card returns to the battlefield transformed (as its back face).
    Materials can come from: permanents you control OR cards in your graveyard.
    This lets you use GY as a resource to upgrade permanents.
  THE MATERIALS RULE (702.167b):
    "If an object in the [materials] is described using only a card type or subtype without the
      word 'card,' it refers to either a permanent on the battlefield or a card in a graveyard."
    So "Craft with artifacts" means: artifacts on your battlefield OR artifact cards in your GY.
    Both are valid materials. You can mix and match (some from battlefield, some from GY).
  EXAMPLE — COLLECTOR'S CAGE (Land/Artifact: "When this enters, exile target creature or
    planeswalker you control face down. Craft with creatures {3}: Return it transformed as a
    creature that exiles the face-down card when it enters."):
    (This is a simplified example. Actual Collector's Cage is more nuanced.)
    Actual "Craft with creatures" means: exile creatures (battlefield or GY) as the material.
    The transformation happens when you've assembled the required materials.
  CRAFTED PERMANENTS REFERENCE EXILED MATERIALS (702.167c):
    "An ability of a permanent may refer to the exiled cards used to craft it."
    The transformed card can reference what was exiled as its crafting materials.
    This enables effects like "this creature has power equal to the number of cards exiled to craft it."

INTERACTION NOTES:
  BACKUP + GRAVEYARD EFFECTS:
    Backup gives abilities until EOT. The trigger resolves from the stack.
    If the backup creature dies before the trigger resolves: the trigger still resolves (abilities
      determined when put on stack — 702.165d). Target still gets the abilities.
    This means: backup creatures that die to ETB interactions (e.g., legend rule) still give
      their abilities if the trigger was already on the stack.
  BARGAIN + TOKENS:
    Food, Clue, Treasure, Blood, and role tokens from Eldraine: all valid bargain fodder.
    Abundant tokens = cheap upgrades.
    This was a primary design intent: Eldraine generates lots of small tokens → bargain
      makes those tokens useful late (as bargain cost) when they're no longer needed.
  CRAFT + REANIMATION:
    Craft exiles this permanent — so cards that care about dying (death triggers) DON'T fire.
    The permanent is exiled directly. Not destroyed. Not moved to GY.
    Then it returns transformed.
    This is similar to "blink" effects — the permanent leaves and returns, triggering ETB
      of the new face. (It's a new object per zone change rules — P003.)
    The transformed card's ETB triggers fire when it returns.
```

## Definitive Conclusions

- **Backup grants only abilities printed BELOW the backup text** — abilities above are not granted; abilities from copy effects or other grants are not granted (702.165c); the abilities are locked in at the time the trigger is placed on the stack (702.165d).
- **Targeting yourself with backup only gives counters** — the ability-granting only happens if the target is "another creature"; targeting the backup creature itself just puts N counters on it.
- **Bargain's "bargained" flag is set at cast time** — if you didn't pay the bargain cost, you can't choose targets for bargained-only effects; sacrifice options are artifacts, enchantments, or tokens only (not creatures unless they're also one of those).
- **Craft exiles the permanent (not destroys it)** — death triggers don't fire; the card returns transformed (as a new object — ETB of the new face triggers); materials can come from your battlefield or GY; craft is sorcery-speed.
- **Craft materials from the GY are "cards" not permanents** — but the rule (702.167b) explicitly allows materials described by type/subtype to include both battlefield permanents and GY cards of that type.

## Canonical Example
**Backup Ability Locking:**
You control Iridescent Hornbeetle ({3}{G}: 3/4 with "backup 1" and, below backup: "Deathtouch. At the beginning of your end step, create a 1/1 green Insect creature token for each +1/+1 counter on this creature.").

Iridescent Hornbeetle enters. Backup trigger goes on the stack: "Put 1 counter on target creature. If another creature, it gains non-backup abilities."

Before backup resolves: opponent casts Humility ({3}{W}: "All creatures lose all abilities and become 1/1 creatures."). Humility resolves (it was already on the battlefield or opponent cast it in response).
Humility makes all creatures 1/1 with no abilities — including Iridescent Hornbeetle.

Now backup trigger resolves: abilities were determined WHEN the trigger was placed on the stack (the moment Iridescent Hornbeetle entered, before Humility). So the abilities determined = deathtouch + end-step-Insect-token-trigger.

Target creature (your 2/2 Elf): gets 1 +1/+1 counter (but Humility already made it 1/1, so it becomes... 2/2 due to the counter? Actually counters apply in layer 7c AFTER Humility's layer 7b set effect. The Elf is 1/1 from Humility + 1 counter from backup = 2/2 with Humility's effects. Plus: it "gains deathtouch" and "gains the Insect trigger." These are abilities granted via the backup trigger. They're granted but Humility's layer 6 effect removes them. The granting happens but is immediately overridden by Humility's "all creatures lose all abilities." Net: the Elf ends up 2/2 with no abilities — Humility removes the deathtouch and trigger.

Key lesson: backup determines WHAT to grant at trigger-creation time (702.165d), but continuous effects (like Humility) still apply to the granted abilities. The grant happened; the removal also happened.

**Example 2 — Bargain with Clue Token:**
You cast Into the Flood Maw ({6}{U}) to bounce everything you don't control. Battlefield is chaotic — opponent has Rhystic Study, Doubling Season, and a 5/5 creature.

Option A (No bargain): pay {6}{U}. Bounce Rhystic Study, Doubling Season, and the 5/5.
Massive swing but you don't draw a card.

Option B (Bargain with a Clue token you control): pay {6}{U} + sacrifice a Clue token.
Clue tokens are artifacts (eligible for bargain). Sacrifice it.
Bounce everything + draw a card.
Net: same bounce effect + 1 free card draw.
The Clue token was worth 2 mana to crack (for the normal "pay 2, draw a card" ability).
By sacrificing it as bargain instead: you get 1 card draw without spending the 2 mana.
Value: saves {2} of the Clue's normal use and gets you the extra draw for "free" (in mana).
Total spend: {6}{U}. You saved {2} by bargaining the Clue instead of cracking it normally.

Bargain with Food tokens (Eldraine mechanic): same logic.
Food tokens normally require {2} + tap + sacrifice to gain 3 life.
As bargain: sacrifice the Food directly → gain the bargained bonus (worth more than 3 life typically).
Efficiently converts surplus token value into spell upgrades.

## Commonly Confused With
- **P375 (Blitz/Casualty/Disturb/Decayed)** — Casualty (sacrifice creature for a spell copy) is similar to Bargain (sacrifice permanent for bonus) in "pay extra to enhance." Casualty is specifically creatures and creates a copy; Bargain is artifacts/enchantments/tokens and enables the spell's bargained clause. Both are optional additional costs.
- **P011 (ETB Triggers)** — Backup is an ETB trigger. It resolves like any ETB trigger. The "abilities determined at stack time" rule (702.165d) is specific to backup — it's an exception to the usual "evaluate at resolution" behavior for what abilities are granted.
- **P372 (Emerge/Aftermath/Embalm/Eternalize)** — Craft shares DNA with embalm/eternalize (exile the card from a zone to return it transformed). But craft exiles from the battlefield (not the GY), requires materials, and both materials and the source are exiled simultaneously. Embalm/eternalize use only the card in the GY.
- **P003 (Zone Change — New Object)** — When a crafted permanent returns transformed, it's a new object (zone change: battlefield → exile → battlefield). ETB triggers of the new face fire. Any auras or equipment attached before crafting may fall off or attempt to re-attach depending on the new characteristics of the transformed permanent.
