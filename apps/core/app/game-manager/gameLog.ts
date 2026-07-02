// Game event log — derivation helpers.
//
// The game manager records a durable event log for every game. Most events are
// derived by diffing successive GameManagerState snapshots (life, poison,
// commander damage, turn passes, eliminations, counters, and the turn order the
// moment a first player is chosen). Die-roll values, which live only inside the
// dice UI and never touch GameManagerState, are logged separately via an
// explicit tap (see CenterZone's onLogEvent).
//
// These functions are pure so they can be unit-tested and so the logging effect
// in page.tsx stays idempotent under React StrictMode's double-invoked renders.

import type { GameManagerState } from './types';
import type { GameLogEvent } from '@/lib/types';

// Names in clockwise play order starting from the first player: 1st, 2nd, 3rd, 4th.
function playOrderNames(state: GameManagerState, firstIdx: number): string[] {
  const n = state.players.length;
  const order: string[] = [];
  for (let k = 0; k < n; k++) {
    order.push(state.players[(firstIdx + k) % n]?.playerName ?? '');
  }
  return order;
}

// The opening event: who is seated, in what order, with which decks.
export function buildGameStartedEvent(state: GameManagerState): GameLogEvent {
  return {
    type: 'game_started',
    payload: {
      gameType: state.gameType ?? 'standard',
      startingLife: state.startingLife,
      players: state.players.map((p, i) => ({
        seat: i,
        position: p.position,
        name: p.playerName,
        deck: p.deckName,
        commander: p.commander?.name ?? '',
        team: p.teamNumber ?? null,
      })),
    },
  };
}

// Sum a commander-damage tuple [fromCommander, fromPartner] into a single total.
function cmdDamageTotal(tuple: [number, number] | undefined): number {
  if (!Array.isArray(tuple)) return 0;
  return (tuple[0] ?? 0) + (tuple[1] ?? 0);
}

// Kill-attribution markers written into notes at elimination time:
//   [cmdkill:target:source]     commander damage (source always present)
//   [lifekill:target(:source)]  brought to 0 life
//   [poisonkill:target(:source)] poison
const KILL_TAG_RE = /\[(cmdkill|lifekill|poisonkill):(\d+)(?::(\d+))?\]/g;
const CAUSE_BY_KIND: Record<string, string> = {
  cmdkill: 'commander_damage',
  lifekill: 'life',
  poisonkill: 'poison',
};

// Find how a player was eliminated from the kill tags present in the notes at
// that moment. Prefers a marker that carries a source index. Commander-damage
// kills tag the source in the same commit as the death; life/poison kills are
// attributed later via a prompt (logged separately as 'kill_attribution').
function parseKillAttribution(
  notes: string,
  targetIdx: number,
): { cause: string; sourceIdx: number | null } {
  let result: { cause: string; sourceIdx: number | null } = { cause: 'unknown', sourceIdx: null };
  if (!notes) return result;
  KILL_TAG_RE.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = KILL_TAG_RE.exec(notes)) !== null) {
    if (Number(m[2]) !== targetIdx) continue;
    const cause = CAUSE_BY_KIND[m[1]];
    const sourceIdx = m[3] != null ? Number(m[3]) : null;
    if (result.cause === 'unknown' || (sourceIdx != null && result.sourceIdx == null)) {
      result = { cause, sourceIdx };
    }
  }
  return result;
}

// Compare two consecutive states and emit the meaningful actions between them.
// `opts.reverse` marks the turn change as a step backwards (host long-press),
// logged as `turn_revert` instead of `pass_turn`.
export function diffGameEvents(
  prev: GameManagerState,
  next: GameManagerState,
  opts?: { reverse?: boolean },
): GameLogEvent[] {
  const events: GameLogEvent[] = [];
  const P = prev.players;
  const N = next.players;

  // Turn order established: a first player was chosen (via roll-off or pick).
  if (prev.firstPlayerIdx == null && next.firstPlayerIdx != null) {
    events.push({
      type: 'turn_order',
      payload: {
        firstPlayer: N[next.firstPlayerIdx]?.playerName ?? '',
        order: playOrderNames(next, next.firstPlayerIdx),
      },
    });
  }

  // Turn changes (only once the game's first player is set). A backwards step
  // (host long-press on the turn button) is logged as turn_revert.
  if (next.firstPlayerIdx != null && prev.currentPlayerIdx !== next.currentPlayerIdx) {
    events.push({
      type: opts?.reverse ? 'turn_revert' : 'pass_turn',
      payload: {
        to: N[next.currentPlayerIdx]?.playerName ?? '',
        turn: next.turnNumber,
      },
    });
  } else if (next.firstPlayerIdx != null && prev.turnNumber !== next.turnNumber) {
    events.push({
      type: opts?.reverse ? 'turn_revert' : 'turn_change',
      payload: { turn: next.turnNumber },
    });
  }

  // Per-player field changes (players are index-stable during play).
  const len = Math.min(P.length, N.length);
  for (let i = 0; i < len; i++) {
    const a = P[i];
    const b = N[i];
    if (!a || !b) continue;
    const player = b.playerName;
    if (a.life !== b.life) {
      events.push({ type: 'life_change', payload: { player, from: a.life, to: b.life, delta: b.life - a.life } });
    }
    if (a.poison !== b.poison) {
      events.push({ type: 'poison_change', payload: { player, from: a.poison, to: b.poison } });
    }
    if (!a.isEliminated && b.isEliminated) {
      const payload: Record<string, unknown> = { player, turn: next.turnNumber };
      if (b.isConceded) {
        payload.cause = 'concede';
      } else {
        const attr = parseKillAttribution(next.notes, i);
        let cause = attr.cause;
        // Life/poison kills flip elimination before the host attributes a
        // source, so the kill tag may not be present yet. Infer the cause from
        // the eliminated player's own state; the source arrives via a later
        // kill_attribution event.
        if (cause === 'unknown') {
          if (b.poison >= 10) cause = 'poison';
          else if (b.life <= 0) cause = 'life';
        }
        payload.cause = cause;
        if (attr.sourceIdx != null) payload.source = N[attr.sourceIdx]?.playerName ?? '';
      }
      events.push({ type: 'eliminate', payload });
    }
    // A concede that also eliminates is already covered by the eliminate event
    // above (cause=concede). Only emit a standalone concede if it did not
    // coincide with a fresh elimination.
    if (!a.isConceded && b.isConceded && a.isEliminated === b.isEliminated) {
      events.push({ type: 'concede', payload: { player, turn: next.turnNumber } });
    }
    if (a.isMonarch !== b.isMonarch) {
      events.push({ type: 'monarch', payload: { player, value: b.isMonarch } });
    }
    if (a.hasInitiative !== b.hasInitiative) {
      events.push({ type: 'initiative', payload: { player, value: b.hasInitiative } });
    }
    if (a.hasCitysBlessing !== b.hasCitysBlessing) {
      events.push({ type: 'citys_blessing', payload: { player, value: b.hasCitysBlessing } });
    }
    if (a.energy !== b.energy) {
      events.push({ type: 'energy_change', payload: { player, to: b.energy } });
    }
    if (a.experience !== b.experience) {
      events.push({ type: 'experience_change', payload: { player, to: b.experience } });
    }
    if (a.commanderTax !== b.commanderTax) {
      events.push({ type: 'commander_tax', payload: { player, to: b.commanderTax } });
    }
  }

  // Commander damage changes: commanderDamage[target][source] = [fromCmd, fromPartner].
  const pcd = prev.commanderDamage || {};
  const ncd = next.commanderDamage || {};
  for (const targetKey of Object.keys(ncd)) {
    const ti = Number(targetKey);
    const pRow = pcd[ti] || {};
    const nRow = ncd[ti] || {};
    for (const sourceKey of Object.keys(nRow)) {
      const si = Number(sourceKey);
      const pTotal = cmdDamageTotal(pRow[si]);
      const nTotal = cmdDamageTotal(nRow[si]);
      if (pTotal !== nTotal) {
        events.push({
          type: 'commander_damage',
          payload: {
            source: N[si]?.playerName ?? '',
            target: N[ti]?.playerName ?? '',
            from: pTotal,
            to: nTotal,
          },
        });
      }
    }
  }

  return events;
}
