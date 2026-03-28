---
id: p008
name: Can't Overrides Can
category: continuous
cr_refs: [101.2, 122.6, 614.17, 614.17b, 614.17c]
tags: [cant, may, override, prevention, restriction, hexproof, shroud, protection, indestructible]
created: 2026-03-28
examples_count: 4
---

# P008 — Can't Overrides Can

## Abstract
When two effects directly conflict — one allowing or permitting an action and one prohibiting it — the prohibiting effect always wins. "Can't" beats "can." "Can't" beats "may." This is one of the few truly absolute rules in Magic, with no exceptions for card text.

## The Definitive Rule

**CR 101.2 verbatim:**
*"If a rule or effect says something can happen and another effect says it can't, the 'can't' effect takes precedence."*

This is the second of the Golden Rules, meaning it applies globally and cannot be overridden by card text.

**CR 614.17a** — "Can't" effects must exist before the event. They don't retroactively change things.
**CR 614.17b** — A player can't choose to pay a cost that includes a "can't" event.
**CR 614.17c** — A "can't happen" event can only be replaced by a self-replacement effect — no other replacement or prevention effects can modify it.

## The Pattern

```
IF: Effect A says "you MAY [action]" or "[thing] CAN [action]"
AND: Effect B says "[action] CAN'T happen" or "[thing] CAN'T [action]"
THEN: Effect B wins. The action cannot happen. Period.

REGARDLESS OF:
  - Timestamp (Effect A is newer)
  - Card text on Effect A
  - Whether Effect A seems "more specific"
  - Player intent
```

## Definitive Conclusions

- **Hexproof + "can target any creature"**: If an effect says "you may target any creature," hexproof (can't be targeted by opponents) wins. The creature cannot be targeted.
- **Shroud + Aura**: Shroud says the permanent can't be targeted by any spells or abilities. An Aura requires targeting to be cast. Even if you want to cast your own beneficial Aura on your shroud creature, you can't — shroud says no.
- **Indestructible + "destroy all creatures"**: "Can't be destroyed" wins. The indestructible creature survives even "destroy all" effects.
- **Protection + damage assignment**: Protection from [quality] says can't be damaged by [quality] sources. A source with that quality simply cannot deal damage to the protected creature — "can't" overrides any amount of "can."
- **"Players can't lose the game" + 0 life**: With an active Platinum Angel-style effect, the "can't lose" wins over the SBA that would cause losing. A player at -100 life still doesn't lose with Platinum Angel on the battlefield.
- **Cost with "can't" event**: If an ability costs "sacrifice a creature" and you can't sacrifice creatures (due to some "can't" effect), you can't activate the ability — you can't even try to pay the cost (614.17b).
- **"Must" vs. "can't"**: "Must attack if able" + "can't attack" = can't attack wins. The creature is simply unable to attack. This is not a violation — "can't" removes the ability, so the creature isn't "able" to attack anyway.
- **"Can't" is surgical, not a full-ability blocker**: When an ability says "do A and B" and "can't" prevents B, A still executes. A Persist trigger says "return it with a -1/-1 counter." Solemnity ("no counters can be placed on creatures") prevents the counter but not the return. The creature comes back counter-free. "Can't" stops only the specific prohibited action, not the ability containing it.
- **ETB counter placement is counter placement (CR 122.6)**: *"Some spells and abilities refer to counters being put on an object. This refers to putting counters on that object while it's on the battlefield and also to an object that's given counters as it enters the battlefield."* A "can't place counters on creatures" effect (like Solemnity) therefore applies to creatures entering with counters — not just mid-game placements. A creature that would enter with +1/+1 counters enters with none. If that makes toughness ≤ 0, it dies immediately via SBA. Conversely, abilities that trigger on counters being placed (like Auntie Ool, Cursewretch — "whenever one or more -1/-1 counters are put on a creature") also fire on ETB counter placement: a Persist creature returning with a -1/-1 counter triggers Auntie Ool because CR 122.6 treats entering-with as putting-on. If Solemnity is also on the battlefield, the counter placement is prevented entirely — the event never occurs — so Auntie Ool does NOT trigger (no counters were actually put on anything).

## Canonical Example
Sigarda, Host of Herons: "Spells and abilities your opponents control can't cause you to sacrifice permanents." Opponent plays Dictate of Erebos: "Whenever a creature you control dies, each opponent sacrifices a creature." Dictate's triggered ability tries to make you sacrifice. Sigarda says "can't." Sigarda wins — you don't sacrifice. The trigger still fires and resolves (your opponents ARE affected if they don't have Sigarda), but for you specifically, the "can't" prevents the sacrifice.

## Additional Examples

**Example 2 — Leyline of Sanctity:**
"You have hexproof" (you can't be targeted by opponent spells/abilities). A spell that says "choose any player; that player discards a card." If it targets: hexproof stops it. If it doesn't target (says "any opponent" without targeting): hexproof doesn't apply (hexproof only stops targeting).

**Example 3 — Two "can'ts" same side:**
"Creatures can't block" + another effect makes one creature able to block. The first "can't" wins over the new "can." The creature still can't block.

**Example 5 — Solemnity + Persist:**
Solemnity: "No counters can be placed on creatures." Kitchen Finks (Persist) dies. Persist tries to return it with a -1/-1 counter. Solemnity says can't place counters. The counter placement fails. The return still happens — "can't" is surgical. Finks returns counter-free. Next death: Persist fires again (condition: no -1/-1 counters — still true). Infinite loop with a free sac outlet. Same outcome as Melira + Persist but via a broader "can't" prohibition.

**Example 6 — Auntie Ool, Cursewretch + Persist (CR 122.6):**
Auntie Ool: "Whenever one or more -1/-1 counters are put on a creature, draw a card if you control that creature." A Persist creature dies and returns — "with a -1/-1 counter on it." Per CR 122.6, entering with a counter = putting counters on it. Auntie Ool triggers; you draw a card. Now add Solemnity: Solemnity prevents the counter from landing at all. The placement event is prohibited — it never occurs. Auntie Ool's trigger condition ("counters are put on") is never met. No draw. Solemnity and Auntie Ool directly conflict: one rewards -1/-1 counter placement, the other prevents it.

**Example 4 — "Can't" vs. replacement:**
A "can't be destroyed" creature and a spell that says "exile it instead of destroying it." Exile isn't destruction — "can't be destroyed" doesn't protect against exile. This is NOT a can't-vs-can scenario; these are different events entirely.

## Commonly Confused With
- **P002 (Replacement vs. Trigger)** — "Instead" effects are replacements; "can't" effects are prohibitions. Different mechanisms.
- **P004 (Layer Dependency)** — Ability removal (layer 6) can remove "can't" effects if it removes the ability that generates them. "Can't" wins vs. "can" but can itself be removed.
