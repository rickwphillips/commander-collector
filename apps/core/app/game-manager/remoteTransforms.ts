/**
 * Pure state-transformation functions for the remote panel.
 *
 * Each function takes the CURRENT game state (from the DB) and returns the
 * updated state.  Keeping them pure lets them be unit-tested independently and
 * ensures that when remoteWrite() applies them on top of a fresh DB read they
 * never overwrite fields (like currentPlayerIdx / turnNumber) that the host
 * may have changed since the remote panel last polled.
 */
import type { GameManagerState, CommanderDamageMap, LiveGameEvent } from '@/lib/types';

export const CLOCKWISE: ReadonlyArray<'bottom' | 'left' | 'top' | 'right'> = [
  'bottom',
  'left',
  'top',
  'right',
];

// In Two-Headed Giant a team loses at 15 poison counters (vs 10 for a single
// player) and at 21 combat damage from a single commander (same as standard).
export const TWOHG_POISON_THRESHOLD = 15;

/**
 * reconcileTeams — the only place 2HG team semantics live.
 *
 * The per-player reducers above are entirely 2HG-agnostic: they apply a life /
 * poison / commander-damage change to a single seat exactly as they do for a
 * standard game. After the reducer runs, this function (called from applyEvent
 * for 2HG games only) makes the two teammates on each team share one life and
 * one poison total, and eliminates both heads together when any team-level loss
 * condition is met:
 *   - shared life reaches 0
 *   - shared poison reaches 15
 *   - a single commander has dealt 21+ combat damage to the team
 *     (summed across both heads)
 *   - either head concedes
 *
 * It compares prev → next to find which teammate's value the reducer changed and
 * mirrors that value onto the other head, so a single +/- on either seat moves
 * the team total exactly once. Elimination is recomputed from scratch every call,
 * which makes undo (life back above 0, poison back below 15) self-correcting.
 */
export function reconcileTeams(
  prev: GameManagerState,
  next: GameManagerState,
): GameManagerState {
  if (next.gameType !== '2hg') return next;

  // Group seat indices by team number.
  const teams = new Map<number, number[]>();
  next.players.forEach((p, i) => {
    if (p.teamNumber == null) return;
    const arr = teams.get(p.teamNumber) ?? [];
    arr.push(i);
    teams.set(p.teamNumber, arr);
  });

  const players = [...next.players];

  for (const idxs of teams.values()) {
    if (idxs.length < 2) continue; // not a full pair yet (seating); leave as-is

    // Shared life: take the value the reducer just changed, else the existing
    // (already-mirrored) value.
    const lifeChanged = idxs.find((t) => next.players[t].life !== prev.players[t]?.life);
    const teamLife = lifeChanged != null ? next.players[lifeChanged].life : next.players[idxs[0]].life;

    // Shared poison: same rule.
    const poisonChanged = idxs.find((t) => next.players[t].poison !== prev.players[t]?.poison);
    const teamPoison =
      poisonChanged != null
        ? next.players[poisonChanged].poison
        : Math.max(...idxs.map((t) => next.players[t].poison));

    // 21 combat damage from a single commander, summed across both heads. The
    // commanderDamage slot is [ownCommander, partnerCommander]; own and partner
    // are distinct commanders, so each is checked separately.
    const sources = new Set<number>();
    idxs.forEach((t) =>
      Object.keys(next.commanderDamage[t] ?? {}).forEach((s) => sources.add(Number(s))),
    );
    let cmdKill = false;
    for (const s of sources) {
      let own = 0;
      let partner = 0;
      for (const t of idxs) {
        const d = next.commanderDamage[t]?.[s] ?? [0, 0];
        own += d[0];
        partner += d[1];
      }
      if (own >= 21 || partner >= 21) cmdKill = true;
    }

    const conceded = idxs.some((t) => next.players[t].isConceded);
    const eliminated = teamLife <= 0 || teamPoison >= TWOHG_POISON_THRESHOLD || cmdKill || conceded;
    const wasEliminated = idxs.every((t) => prev.players[t]?.isEliminated);
    let eliminatedTurn: number | null = null;
    if (eliminated) {
      eliminatedTurn = wasEliminated
        ? (prev.players[idxs[0]]?.eliminatedTurn ?? next.turnNumber)
        : next.turnNumber;
    }

    for (const t of idxs) {
      players[t] = {
        ...players[t],
        life: teamLife,
        poison: teamPoison,
        isEliminated: eliminated,
        eliminatedTurn,
      };
    }
  }

  return { ...next, players };
}

export function applyLifeChange(
  state: GameManagerState,
  idx: number,
  delta: number,
): GameManagerState {
  const { players, turnNumber, notes } = state;
  const target = players[idx];
  const newLife = target.life + delta;
  const isNewLifeKill = target.life > 0 && newLife <= 0;
  const isUndoLifeKill = target.life <= 0 && newLife > 0;
  const wasEliminatedByLife = target.isEliminated && target.life <= 0 && target.poison < 10;
  const lifeNoteTag = `[lifekill:${idx}]`;
  let newNotes = notes;
  if (isUndoLifeKill) {
    newNotes = notes.split('\n').filter((l) => !l.includes(lifeNoteTag)).join('\n');
  }
  const newPlayers = players.map((p, i) => {
    if (i !== idx) return p;
    return {
      ...p,
      life: newLife,
      ...(isNewLifeKill && !p.isEliminated ? { isEliminated: true, eliminatedTurn: turnNumber } : {}),
      ...(isUndoLifeKill && wasEliminatedByLife ? { isEliminated: false, eliminatedTurn: null } : {}),
    };
  });
  return { ...state, players: newPlayers, notes: newNotes };
}

export function applyPoisonChange(
  state: GameManagerState,
  idx: number,
  delta: number,
): GameManagerState {
  const { players, turnNumber, notes } = state;
  const target = players[idx];
  const newPlayers = players.map((p, i) => {
    if (i !== idx) return p;
    const poison = Math.max(0, p.poison + delta);
    const wasEliminatedByPoison = p.isEliminated && p.poison >= 10;
    const isEliminated = poison >= 10 ? true : wasEliminatedByPoison ? false : p.isEliminated;
    const eliminatedTurn =
      poison >= 10 && !p.isEliminated ? turnNumber : isEliminated ? p.eliminatedTurn : null;
    return { ...p, poison, isEliminated, eliminatedTurn };
  });
  const isUndoPoisonKill =
    target.isEliminated && target.poison >= 10 && Math.max(0, target.poison + delta) < 10;
  const poisonNoteTag = `[poisonkill:${idx}]`;
  let newNotes = notes;
  if (isUndoPoisonKill) {
    newNotes = notes.split('\n').filter((l) => !l.includes(poisonNoteTag)).join('\n');
  }
  return { ...state, players: newPlayers, notes: newNotes };
}

export function applyCommanderTaxChange(
  state: GameManagerState,
  idx: number,
  delta: number,
): GameManagerState {
  const newPlayers = state.players.map((p, i) =>
    i === idx ? { ...p, commanderTax: Math.max(0, p.commanderTax + delta) } : p,
  );
  return { ...state, players: newPlayers };
}

export function applyEnergyChange(
  state: GameManagerState,
  idx: number,
  delta: number,
): GameManagerState {
  const newPlayers = state.players.map((p, i) =>
    i === idx ? { ...p, energy: Math.max(0, p.energy + delta) } : p,
  );
  return { ...state, players: newPlayers };
}

export function applyExperienceChange(
  state: GameManagerState,
  idx: number,
  delta: number,
): GameManagerState {
  const newPlayers = state.players.map((p, i) =>
    i === idx ? { ...p, experience: Math.max(0, p.experience + delta) } : p,
  );
  return { ...state, players: newPlayers };
}

export function applyToggleMonarch(state: GameManagerState, idx: number): GameManagerState {
  const newPlayers = state.players.map((p, i) => ({
    ...p,
    isMonarch: i === idx ? !p.isMonarch : false,
  }));
  return { ...state, players: newPlayers };
}

export function applyToggleInitiative(state: GameManagerState, idx: number): GameManagerState {
  const newPlayers = state.players.map((p, i) => ({
    ...p,
    hasInitiative: i === idx ? !p.hasInitiative : false,
  }));
  return { ...state, players: newPlayers };
}

export function applyToggleCitysBlessing(state: GameManagerState, idx: number): GameManagerState {
  const newPlayers = state.players.map((p, i) =>
    i === idx ? { ...p, hasCitysBlessing: !p.hasCitysBlessing } : p,
  );
  return { ...state, players: newPlayers };
}

export function applyCommanderDamageChange(
  state: GameManagerState,
  targetIdx: number,
  sourceIdx: number,
  isPartner: boolean,
  delta: number,
): GameManagerState {
  const { players, commanderDamage, turnNumber, notes } = state;
  const current = commanderDamage[targetIdx]?.[sourceIdx] ?? [0, 0];
  const newDmg: [number, number] = [
    isPartner ? current[0] : Math.max(0, current[0] + delta),
    isPartner ? Math.max(0, current[1] + delta) : current[1],
  ];
  const newCommanderDamage: CommanderDamageMap = {
    ...commanderDamage,
    [targetIdx]: { ...(commanderDamage[targetIdx] ?? {}), [sourceIdx]: newDmg },
  };
  const prevTotal = current[0] + current[1];
  const cmdDmgTotal = newDmg[0] + newDmg[1];
  const actualDelta = cmdDmgTotal - prevTotal;
  const target = players[targetIdx];
  const source = players[sourceIdx];
  const newLife = target.life - actualDelta;

  // 21 from a single commander is a cmd kill; life hitting 0 is attributed to source player
  const isNewCmdKill = !target.isEliminated && (newDmg[0] >= 21 || newDmg[1] >= 21);
  const isNewLifeKill = !target.isEliminated && target.life > 0 && newLife <= 0 && !isNewCmdKill;
  const isNewElimination = isNewCmdKill || isNewLifeKill;
  const isUndoCmdElim = target.isEliminated && (current[0] >= 21 || current[1] >= 21) && newDmg[0] < 21 && newDmg[1] < 21;
  const isUndoLifeElim = !isUndoCmdElim && target.isEliminated && target.life <= 0 && newLife > 0 && target.poison < 10;
  const isUndoElimination = isUndoCmdElim || isUndoLifeElim;

  const cmdLabel = source.partner
    ? `${source.commander.name} / ${source.partner.name}`
    : source.commander.name;
  const cmdKillNoteTag = `[cmdkill:${targetIdx}:${sourceIdx}]`;
  const lifeKillNoteTag = `[lifekill:${targetIdx}]`;
  const cmdKillLine = `${cmdKillNoteTag} ${target.playerName} eliminated by ${cmdLabel} (${source.playerName}) commander damage (turn ${turnNumber})`;
  const lifeKillLine = `${lifeKillNoteTag} ${target.playerName} brought to 0 life by ${cmdLabel} (${source.playerName}) (turn ${turnNumber})`;

  let newNotes = notes;
  if (isNewCmdKill) newNotes = [notes, cmdKillLine].filter(Boolean).join('\n');
  else if (isNewLifeKill) newNotes = [notes, lifeKillLine].filter(Boolean).join('\n');
  else if (isUndoCmdElim) newNotes = notes.split('\n').filter((l) => !l.includes(cmdKillNoteTag)).join('\n');
  else if (isUndoLifeElim) newNotes = notes.split('\n').filter((l) => !l.includes(lifeKillNoteTag)).join('\n');

  const newPlayers = players.map((p, i) => {
    if (i !== targetIdx) return p;
    return {
      ...p,
      life: p.life - actualDelta,
      ...(isNewElimination ? { isEliminated: true, eliminatedTurn: turnNumber } : {}),
      ...(isUndoElimination ? { isEliminated: false, eliminatedTurn: null } : {}),
    };
  });
  return { ...state, commanderDamage: newCommanderDamage, players: newPlayers, notes: newNotes };
}

export function applyEliminate(state: GameManagerState, idx: number): GameManagerState {
  const target = state.players[idx];
  const note = `${target.playerName} conceded (turn ${state.turnNumber})`;
  const newNotes = state.notes ? `${state.notes}\n${note}` : note;
  const newPlayers = state.players.map((p, i) =>
    i === idx
      ? { ...p, isEliminated: true, isConceded: true, eliminatedTurn: state.turnNumber }
      : p,
  );
  return { ...state, players: newPlayers, notes: newNotes };
}

export function applyUndoEliminate(state: GameManagerState, idx: number): GameManagerState {
  const newPlayers = state.players.map((p, i) =>
    i === idx ? { ...p, isEliminated: false, isConceded: false, eliminatedTurn: null } : p,
  );
  return { ...state, players: newPlayers };
}

export function applyLifeKillAttr(
  state: GameManagerState,
  targetIdx: number,
  sourcePlayerIdx: number | null,
): GameManagerState {
  const target = state.players[targetIdx];
  const source = sourcePlayerIdx !== null ? state.players[sourcePlayerIdx] : null;
  const lifeNoteTag = `[lifekill:${targetIdx}]`;
  const noteLine = source
    ? `${lifeNoteTag} ${target.playerName} brought to 0 life by ${source.playerName} (turn ${state.turnNumber})`
    : `${lifeNoteTag} ${target.playerName} brought to 0 life (turn ${state.turnNumber})`;
  return { ...state, notes: [state.notes, noteLine].filter(Boolean).join('\n') };
}

export function applyPoisonKillAttr(
  state: GameManagerState,
  targetIdx: number,
  sourcePlayerIdx: number | null,
): GameManagerState {
  const target = state.players[targetIdx];
  const source = sourcePlayerIdx !== null ? state.players[sourcePlayerIdx] : null;
  const poisonNoteTag = `[poisonkill:${targetIdx}]`;
  const noteLine = source
    ? `${poisonNoteTag} ${target.playerName} eliminated by ${source.playerName}'s poison (turn ${state.turnNumber})`
    : `${poisonNoteTag} ${target.playerName} eliminated by poison (turn ${state.turnNumber})`;
  return { ...state, notes: [state.notes, noteLine].filter(Boolean).join('\n') };
}

export function applyCheckin(state: GameManagerState, seat: string, ts: number): GameManagerState {
  return {
    ...state,
    remoteCheckins: { ...(state.remoteCheckins ?? {}), [seat]: ts },
  };
}

/**
 * 2HG turn passing: hand the turn to the other team as a unit. `dir > 0` is
 * Next Turn, `dir < 0` is Previous Turn. currentPlayerIdx points at one live
 * seat of the active team (it just identifies whose turn it is; the board
 * highlights both teammates). The turn number counts rounds: going forward it
 * increments when play returns to the team that started the game; going back it
 * decrements when leaving the starting team.
 */
function passTeamTurn(state: GameManagerState, dir: number): GameManagerState {
  const { players, currentPlayerIdx, turnNumber } = state;
  const firstIdx = state.firstPlayerIdx ?? 0;
  const curTeam = players[currentPlayerIdx]?.teamNumber;
  const firstTeam = players[firstIdx]?.teamNumber;
  if (curTeam == null) return state;
  const nextIdx = players.findIndex(
    (p) => p.teamNumber != null && p.teamNumber !== curTeam && !p.isEliminated,
  );
  if (nextIdx === -1) return state; // no opposing team to pass to
  let newTurnNumber = turnNumber;
  if (dir > 0) {
    if (players[nextIdx].teamNumber === firstTeam) newTurnNumber = turnNumber + 1;
  } else {
    if (curTeam === firstTeam) {
      if (turnNumber === 1) return state; // can't step before the first turn
      newTurnNumber = turnNumber - 1;
    }
  }
  return {
    ...state,
    currentPlayerIdx: nextIdx,
    turnNumber: newTurnNumber,
    turnStartTime: Date.now(),
  };
}

export function applyPassTurn(state: GameManagerState): GameManagerState {
  // 2HG: teammates share one turn. Passing the turn hands play to the OTHER
  // team as a unit (not the next seat). The turn number counts rounds, so it
  // increments when play returns to the team that started the game.
  if (state.gameType === '2hg') return passTeamTurn(state, +1);

  const { players, currentPlayerIdx, turnNumber } = state;
  const firstIdx = state.firstPlayerIdx ?? 0;
  const currentPos = players[currentPlayerIdx].position;
  const curCW = CLOCKWISE.indexOf(currentPos);
  const firstCW = CLOCKWISE.indexOf(players[firstIdx].position);
  let nextPlayerIdx = -1;
  let stepsToNext = 0;
  for (let step = 1; step <= 4; step++) {
    const nextPos = CLOCKWISE[(curCW + step) % 4];
    const idx = players.findIndex((p) => p.position === nextPos && !p.isEliminated);
    if (idx !== -1) {
      nextPlayerIdx = idx;
      stepsToNext = step;
      break;
    }
  }
  if (nextPlayerIdx === -1) return state;
  const distToFirst = (firstCW - curCW + 4) % 4;
  const newTurnNumber =
    distToFirst >= 1 && distToFirst <= stepsToNext ? turnNumber + 1 : turnNumber;
  return {
    ...state,
    currentPlayerIdx: nextPlayerIdx,
    turnNumber: newTurnNumber,
    turnStartTime: Date.now(),
  };
}

/**
 * Mirror of applyPassTurn going backwards. Steps counter-clockwise through
 * active seats and decrements the turn number when departing through the
 * first player's position. Refuses to step back below turn 1.
 */
export function applyPrevTurn(state: GameManagerState): GameManagerState {
  if (state.gameType === '2hg') return passTeamTurn(state, -1);

  const { players, currentPlayerIdx, turnNumber } = state;
  const firstIdx = state.firstPlayerIdx ?? 0;
  const currentPos = players[currentPlayerIdx].position;
  const curCW = CLOCKWISE.indexOf(currentPos);
  const firstCW = CLOCKWISE.indexOf(players[firstIdx].position);
  let prevPlayerIdx = -1;
  let stepsBack = 0;
  for (let step = 1; step <= 4; step++) {
    const prevPos = CLOCKWISE[(curCW - step + 4) % 4];
    const idx = players.findIndex((p) => p.position === prevPos && !p.isEliminated);
    if (idx !== -1) {
      prevPlayerIdx = idx;
      stepsBack = step;
      break;
    }
  }
  if (prevPlayerIdx === -1) return state;
  const distBackToFirst = (curCW - firstCW + 4) % 4;
  const wouldDecrement = distBackToFirst < stepsBack;
  if (wouldDecrement && turnNumber === 1) return state;
  const newTurnNumber = wouldDecrement ? Math.max(1, turnNumber - 1) : turnNumber;
  return {
    ...state,
    currentPlayerIdx: prevPlayerIdx,
    turnNumber: newTurnNumber,
    turnStartTime: Date.now(),
  };
}

type ViewEvent = Extract<LiveGameEvent, { type: 'view_open' | 'view_heartbeat' | 'view_close' }>;

function applyViewPlayer(state: GameManagerState, event: ViewEvent): GameManagerState {
  const prevMap = state.viewerMap ?? {};
  if (event.type === 'view_close') {
    const { [event.seat]: _removed, ...rest } = prevMap;
    return { ...state, viewerMap: Object.keys(rest).length > 0 ? rest : null };
  }
  const targetIdx = event.playerIdx;
  if (targetIdx < 0) {
    const { [event.seat]: _removed, ...rest } = prevMap;
    return { ...state, viewerMap: Object.keys(rest).length > 0 ? rest : null };
  }
  const viewer = state.players.find((p) => p.position === event.seat);
  const existing = prevMap[event.seat];
  // Preserve firstSeenTs on heartbeat or if reconnecting quickly (within 20s)
  const isReconnect = existing && Date.now() - existing.ts < 20000;
  const firstSeenTs = event.type === 'view_heartbeat' || isReconnect
    ? existing?.firstSeenTs ?? event.ts
    : event.ts;
  return {
    ...state,
    viewerMap: {
      ...prevMap,
      [event.seat]: { targetIdx, viewerName: viewer?.playerName ?? event.seat, ts: event.ts, firstSeenTs },
    },
  };
}

/**
 * Dispatch a LiveGameEvent to the correct state-transform function.
 * The host calls this for each event it dequeues from remote_events.
 * Unknown event types are ignored (returns state unchanged).
 */
export function applyEvent(state: GameManagerState, event: LiveGameEvent): GameManagerState {
  const next = applyEventInner(state, event);
  // For 2HG, fold each per-seat change into shared team life/poison + joint
  // elimination. No-op for standard games (reconcileTeams returns next as-is).
  return reconcileTeams(state, next);
}

function applyEventInner(state: GameManagerState, event: LiveGameEvent): GameManagerState {
  switch (event.type) {
    case 'life_change':
      return applyLifeChange(state, event.playerIdx, event.delta);
    case 'poison_change':
      return applyPoisonChange(state, event.playerIdx, event.delta);
    case 'commander_tax_change':
      return applyCommanderTaxChange(state, event.playerIdx, event.delta);
    case 'energy_change':
      return applyEnergyChange(state, event.playerIdx, event.delta);
    case 'experience_change':
      return applyExperienceChange(state, event.playerIdx, event.delta);
    case 'toggle_monarch':
      return applyToggleMonarch(state, event.playerIdx);
    case 'toggle_initiative':
      return applyToggleInitiative(state, event.playerIdx);
    case 'toggle_citys_blessing':
      return applyToggleCitysBlessing(state, event.playerIdx);
    case 'commander_damage_change':
      return applyCommanderDamageChange(
        state, event.targetIdx, event.sourceIdx, event.isPartner, event.delta,
      );
    case 'eliminate':
      return applyEliminate(state, event.playerIdx);
    case 'undo_eliminate':
      return applyUndoEliminate(state, event.playerIdx);
    case 'pass_turn':
      return applyPassTurn(state);
    case 'checkin':
      return applyCheckin(state, event.seat, event.ts);
    case 'life_kill_attr':
      return applyLifeKillAttr(state, event.playerIdx, event.sourcePlayerIdx);
    case 'poison_kill_attr':
      return applyPoisonKillAttr(state, event.playerIdx, event.sourcePlayerIdx);
    case 'view_open':
    case 'view_heartbeat':
    case 'view_close':
      return applyViewPlayer(state, event);
    default: {
      const _exhaustive: never = event;
      void _exhaustive;
      return state;
    }
  }
}
