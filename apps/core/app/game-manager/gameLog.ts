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
import { teamLabel as formatTeamLabel } from '@/lib/teams';

// Names in clockwise play order starting from the first player: 1st, 2nd, 3rd, 4th.
function playOrderNames(state: GameManagerState, firstIdx: number): string[] {
  const n = state.players.length;
  return Array.from({ length: n }, (_, k) => state.players[(firstIdx + k) % n]?.playerName ?? '');
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
  const tagsForTarget = notes
    ? [...notes.matchAll(KILL_TAG_RE)]
        .filter((m) => Number(m[2]) === targetIdx)
        .map((m) => ({ cause: CAUSE_BY_KIND[m[1]], sourceIdx: m[3] != null ? Number(m[3]) : null }))
    : [];
  // Prefer the first tag that names a source; otherwise the first tag at all;
  // otherwise unknown.
  return tagsForTarget.find((t) => t.sourceIdx != null) ?? tagsForTarget[0] ?? { cause: 'unknown', sourceIdx: null };
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
  const is2hg = next.gameType === '2hg';

  // 2HG resolves turns, shared life/poison, and joint elimination at the team
  // level, so those actions name the whole team ("Team N (A / B)") via the shared
  // teamLabel helper; per-player counters (monarch, energy, XP, commander tax)
  // stay individual.
  const teamLabel = (teamNumber: number | null | undefined): string =>
    formatTeamLabel(teamNumber, N, next.teamNames);
  const teamActor = (idx: number): string => {
    const t = N[idx]?.teamNumber;
    return is2hg && t != null ? teamLabel(t) : (N[idx]?.playerName ?? '');
  };

  // Turn order established: a first player was chosen (via roll-off or pick).
  if (prev.firstPlayerIdx == null && next.firstPlayerIdx != null) {
    const first = next.firstPlayerIdx;
    const seatOrder = Array.from({ length: N.length }, (_, k) => (first + k) % N.length);
    // 2HG: the distinct teams in play order; standard: individual seats.
    const order = is2hg
      ? [...new Set(seatOrder.map((idx) => N[idx]?.teamNumber).filter((t): t is number => t != null))].map(teamLabel)
      : playOrderNames(next, first);
    events.push({
      type: 'turn_order',
      payload: { firstPlayer: teamActor(first), order },
    });
  }

  // Turn changes (only once the game's first player is set). A backwards step
  // (host long-press on the turn button) is logged as turn_revert.
  if (next.firstPlayerIdx != null && prev.currentPlayerIdx !== next.currentPlayerIdx) {
    events.push({
      type: opts?.reverse ? 'turn_revert' : 'pass_turn',
      payload: {
        to: teamActor(next.currentPlayerIdx),
        turn: next.turnNumber,
      },
    });
  } else if (next.firstPlayerIdx != null && prev.turnNumber !== next.turnNumber) {
    events.push({
      type: opts?.reverse ? 'turn_revert' : 'turn_change',
      payload: { turn: next.turnNumber },
    });
  }

  // Per-player field changes (players are index-stable during play). In 2HG the
  // shared/team fields (life, poison, elimination, concede) are mirrored across
  // both teammates, so they collapse to a single team-labelled entry;
  // firstForTeam returns true only the first time a given team hits each kind.
  const len = Math.min(P.length, N.length);
  const teamEmitted = { life: new Set<number>(), poison: new Set<number>(), elim: new Set<number>(), concede: new Set<number>() };
  const firstForTeam = (kind: keyof typeof teamEmitted, teamNumber: number | null | undefined): boolean => {
    if (!is2hg || teamNumber == null) return true;
    if (teamEmitted[kind].has(teamNumber)) return false;
    teamEmitted[kind].add(teamNumber);
    return true;
  };
  // Seats freshly eliminated this diff on a given team. A 2HG joint elimination
  // flips both teammates at once but the kill tag sits on only one seat, so the
  // team's attribution must be gathered across every newly-eliminated member,
  // not just the first one the loop reaches.
  const newlyEliminatedSeats = (teamNumber: number | null | undefined): number[] =>
    N.map((_, idx) => idx).filter((idx) => N[idx]?.teamNumber === teamNumber && !P[idx]?.isEliminated && N[idx]?.isEliminated);
  for (let i = 0; i < len; i++) {
    const a = P[i];
    const b = N[i];
    if (!a || !b) continue;
    const player = b.playerName;   // per-player counters
    const actor = teamActor(i);    // shared/team actions
    const team = b.teamNumber;
    if (a.life !== b.life && firstForTeam('life', team)) {
      events.push({ type: 'life_change', payload: { player: actor, from: a.life, to: b.life, delta: b.life - a.life } });
    }
    if (a.poison !== b.poison && firstForTeam('poison', team)) {
      events.push({ type: 'poison_change', payload: { player: actor, from: a.poison, to: b.poison } });
    }
    if (!a.isEliminated && b.isEliminated && firstForTeam('elim', team)) {
      const payload: Record<string, unknown> = { player: actor, turn: next.turnNumber };
      if (b.isConceded) {
        payload.cause = 'concede';
      } else {
        // Gather attribution across every newly-eliminated seat of this team
        // (2HG tags only one teammate); prefer a tag that names a source, then
        // any known cause. Standard games look at just this seat.
        const seats = is2hg && team != null ? newlyEliminatedSeats(team) : [i];
        const attrs = seats.map((idx) => parseKillAttribution(next.notes, idx));
        const attr = attrs.find((x) => x.sourceIdx != null)
          ?? attrs.find((x) => x.cause !== 'unknown')
          ?? { cause: 'unknown', sourceIdx: null };
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
        if (attr.sourceIdx != null) payload.source = teamActor(attr.sourceIdx);
      }
      events.push({ type: 'eliminate', payload });
    }
    // A concede that also eliminates is already covered by the eliminate event
    // above (cause=concede). Only emit a standalone concede if it did not
    // coincide with a fresh elimination.
    if (!a.isConceded && b.isConceded && a.isEliminated === b.isEliminated && firstForTeam('concede', team)) {
      events.push({ type: 'concede', payload: { player: actor, turn: next.turnNumber } });
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
  events.push(...Object.keys(ncd).flatMap((targetKey) => {
    const ti = Number(targetKey);
    const pRow = pcd[ti] || {};
    const nRow = ncd[ti] || {};
    return Object.keys(nRow).flatMap((sourceKey): GameLogEvent[] => {
      const si = Number(sourceKey);
      const pTotal = cmdDamageTotal(pRow[si]);
      const nTotal = cmdDamageTotal(nRow[si]);
      if (pTotal === nTotal) return [];
      return [{
        type: 'commander_damage',
        payload: {
          source: N[si]?.playerName ?? '',
          target: N[ti]?.playerName ?? '',
          from: pTotal,
          to: nTotal,
        },
      }];
    });
  }));

  return events;
}
