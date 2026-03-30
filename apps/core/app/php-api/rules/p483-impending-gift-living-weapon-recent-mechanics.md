---
id: p483
name: Impending, Gift, and Living Weapon — Enchantment-then-Creature, Optional-Opponent-Benefit, and Germ-Token-Attachment
category: replacement
cr_refs: [702.186, 702.187, 702.86, 603.2, 614.1, 301.5, 400.7, 704.5d]
tags: impending, gift, living-weapon, formal-keyword, enchantment-becomes-creature, optional-opponent-benefit, equipment-germ-token, duskmourn, bloomburrow, mirrodin-besieged
created: 2026-03-29
examples_count: 6
---

# P483 — Impending, Gift, and Living Weapon — Enchantment-then-Creature, Optional-Opponent-Benefit, and Germ-Token-Attachment

## Abstract

Three formal keywords from recent and older sets: **Impending** (CR 702.186, Duskmourn: House of Horror, 2024) allows casting a creature as an enchantment with time counters — when the last counter is removed, it becomes the creature; **Gift** (CR 702.187, Bloomburrow, 2024) is an optional additional cost that gives an opponent a specified benefit in exchange for the Gift spell gaining an additional effect; and **Living Weapon** (CR 702.86, Mirrodin Besieged, 2011) is a triggered ability on Equipment that creates a 0/0 Phyrexian Germ creature token when the Equipment enters and attaches the Equipment to that token. All three have non-obvious rules interactions.

## The Definitive Rules

### Impending (CR 702.186)
**CR 702.186a verbatim:** *"Impending N — [cost] means 'You may cast this card by paying [cost] rather than its mana cost. If you do, it enters the battlefield as an enchantment with N time counters on it rather than as a creature. At the beginning of your upkeep, remove a time counter from it. When the last is removed, it becomes a creature.'"*

Impending allows casting a creature as a cheaper enchantment with a countdown. When the time counters run out, it transforms from enchantment to creature.

### Gift (CR 702.187)
**CR 702.187a verbatim:** *"Gift [effect] means 'You may pay any additional costs this spell requires. If you do, [opponent gets the gift effect].' A card or token with gift refers to the player receiving the gift when it refers to 'the player who received the gift.'"*

Gift spells offer a bonus to one opponent in exchange for an enhanced effect on the Gift spell itself. You choose whether to "give the gift" (pay the additional cost, opponent gets the benefit, you get the enhanced version).

### Living Weapon (CR 702.86)
**CR 702.86a verbatim:** *"Living Weapon means 'When this Equipment enters the battlefield, create a 0/0 black Phyrexian Germ creature token, then attach this Equipment to it.'"*

Living Weapon creates its own creature and immediately equips to it. The Equipment enters attached to the Germ token, making it a creature immediately (with the Equipment's P/T bonus if any).

## The Pattern

```
IMPENDING N — [cost] pattern:
Alternative cast as enchantment:
  → Pay the impending cost instead of the regular mana cost
  → Enters as an ENCHANTMENT (not a creature) with N time counters
  → At the beginning of your end step: remove one time counter
  → When the last time counter is removed: it becomes a creature
    → It "becomes a creature" — it retains being an enchantment? Or transforms fully?
    → CR 702.186: "it becomes a creature" means it gains the creature card type
    → The permanent now has the enchantment AND creature types (enchantment creature)
    → OR: it loses the enchantment type and just becomes a creature? Check card text.
    → Based on typical Impending design: when time counters run out, the enchantment
      loses the "impending" designation and the creature's actual characteristics take effect
  → While an enchantment (not yet creature):
    → It has no P/T (not a creature)
    → Targeted by "destroy target enchantment" effects
    → Not targeted by creature removal
    → Doesn't die to SBAs for creatures
    → NO summoning sickness (it's not a creature)
  → Proliferate: can ADD time counters → delays becoming a creature
  → Time Travel: adds time counters → also delays
  → Remove all time counters at once (Vampire Hexmage, Clockspinning): immediately becomes creature
  → Normal cast (full mana cost, no impending): enters as a creature immediately

GIFT pattern:
Optional additional cost: "You may give [gift] to target opponent."
  → If you pay the gift (and choose an opponent to give to):
    → The chosen opponent gets the specified benefit (e.g., draw a card, gain life)
    → The Gift spell gains its enhanced effect (usually stronger than the non-gift version)
  → If you DON'T pay the gift: normal resolution, no benefit to opponent, weaker effect
  → The gift is given to ONE opponent (you choose at cast time)
  → In multiplayer: gift goes to one chosen opponent, not all
  → The "gift" benefit to the opponent is a cost you pay; it's asymmetric — you get more, they get some
  → Gift incentivizes group-hug or political gameplay in Commander

LIVING WEAPON pattern:
ETB trigger: "When this Equipment enters the battlefield, create a 0/0 black Phyrexian Germ creature token, then attach this Equipment to it."
  → The Germ token is created FIRST, then the Equipment attaches
  → The Equipment's stats boost: Germ is 0/0 → Equipment gives +N/+N → Germ becomes N/N
  → If the Equipment gives +2/+2: the Germ is a 2/2 creature
  → The Germ dies if the Equipment is unequipped and not given another attachment:
    → Germ has 0 base P/T → without the Equipment, toughness ≤ 0 → SBA destroys it
  → Multiple Living Weapons: each creates its own Germ token
  → The Equipment can be moved from the Germ to another creature via equip activation
    → When moved: the old Germ (now 0/0 without the Equipment) is destroyed by SBA
  → Living Weapon + Doubling Season: when the token enters, create TWO Germ tokens?
    → Doubling Season doubles tokens → creates 2 Germ tokens. The Equipment can only
      attach to ONE. The second Germ is a 0/0 without the Equipment → immediately dies to SBA.
      → Net: you still get only one equipped Germ (same as without Doubling Season)
```

## Definitive Conclusions

**Impending:**
- The key benefit of Impending is getting a cheaper, harder-to-answer enchantment version now, with the full creature coming online in N turns. Your opponent can't use creature removal (Lightning Bolt, Path to Exile) on the enchantment version.
- The risk: enchantment removal (Disenchant, Naturalize) CAN destroy the Impending permanent. And Proliferate can push it forward faster (by adding counters... wait — no, Proliferate ADDS counters, which DELAYS the creature. To speed it up, remove counters).
- Impending works with Time Travel to delay; effects that remove counters accelerate.
- Key card: *Overlord of the Floodpits* (DSK): "Impending 4 — {1}{U}{U}." A 5/3 that enters as an enchantment with 4 time counters for {1}{U}{U} instead of its full cost of {3}{U}{U}. Four upkeeps later, becomes its full creature form.

**Gift:**
- Gift creates political dynamics similar to Tempt with but different: you're giving ONE opponent something they want. This can be used as a negotiating tool in Commander.
- Gift payoffs are usually strong enough that giving the gift is worth it in most cases. The gift recipient gets something nice, but you get a significantly better version of the spell.
- Key card: *Harmonious Emergence* (BLB): "Gift of a land. When [creature] enters, if the gift was given, [bonus effect]." Giving an opponent a land draw triggers your own enhanced effect.

**Living Weapon:**
- Living Weapon creates instant "creature + Equipment" value from a single card. The Germ token is a sacrifice target, a blocker, and an Equipment host all in one.
- The Germ as sacrifice target: sacrifice the Germ for an effect (e.g., Viscera Seer's scry) while keeping the Equipment on the battlefield to be re-equipped to another creature.
- If the Germ is equipped with a +5/+5 Equipment (Living Weapon), it's a 5/5 creature. Any removal on the Germ also leaves the Equipment as an artifact on the battlefield.
- Key card: *Batterskull* (NPH): "Living Weapon. Equipped creature gets +4/+4 and has vigilance and lifelink. {3}: Return Batterskull to its owner's hand." The Germ becomes a 4/4 vigilance lifelink creature. Batterskull can be bounced and replayed to create a new Germ.
- Key card: *Mortarpod* (MBS): "Living Weapon. Equipped creature gets +0/+1 and has '{T}, Sacrifice this creature: This creature deals 1 damage to any target.'" The Germ sacrifices itself to deal 1 damage (removing 1 counter, etc.).

## Canonical Examples

**Impending:**
- Cast *Overlord of the Floodpits* with Impending cost ({1}{U}{U}). It's an enchantment for 4 turns. Opponent's creature removal (Doom Blade, Lightning Bolt) can't touch it. On turn 4 upkeep: last time counter removed → becomes its full 5/3 creature form.

**Gift:**
- Cast Gift spell: opponent gets a free card draw; you get a powerful effect that would normally cost {3} more mana without the gift. In Commander, the chosen opponent is likely someone you want to ally with temporarily.

**Living Weapon:**
- *Batterskull* enters: create 0/0 Germ token, attach Batterskull → Germ is now 4/4 vigilance lifelink. Opponent destroys the Germ: Batterskull sits as a plain artifact, pay {3} to return to hand, replay → new Germ → new 4/4 lifelink.

## Commonly Confused With

- **P417** (Suspend/Vanishing) — Impending uses time counters and counts down like Vanishing; Time Travel affects both Impending's time counters and Vanishing's time counters; but Impending becomes a creature while Vanishing sacrifices the permanent
- **P467** (Parley/Will of Council/Tempt with) — Gift gives ONE opponent a benefit; Tempt with offers ALL opponents a benefit; similar political mechanics but different scope
- **P099** (Equipment/Equip) — Living Weapon is a triggered ability on Equipment; the resulting Germ token is a creature with the Equipment attached; same Equipment rules apply (sorcery speed re-equip, etc.)
- **P460** (Incubate) — Both Incubate and Living Weapon create tokens; Incubate creates a double-faced Incubator token that becomes a creature via activation; Living Weapon creates a Germ creature immediately with the Equipment attached
