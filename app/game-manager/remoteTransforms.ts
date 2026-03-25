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
  const newPlayers = state.players.map((p, i) =>
    i === idx
      ? { ...p, isEliminated: true, isConceded: true, eliminatedTurn: state.turnNumber }
      : p,
  );
  return { ...state, players: newPlayers };
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

export function applyPassTurn(state: GameManagerState): GameManagerState {
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
 * Dispatch a LiveGameEvent to the correct state-transform function.
 * The host calls this for each event it dequeues from remote_events.
 * Unknown event types are ignored (returns state unchanged).
 */
export function applyEvent(state: GameManagerState, event: LiveGameEvent): GameManagerState {
  switch (event.type) {
    case 'life_change':
      return applyLifeChange(state, event.playerIdx!, event.delta!);
    case 'poison_change':
      return applyPoisonChange(state, event.playerIdx!, event.delta!);
    case 'commander_tax_change':
      return applyCommanderTaxChange(state, event.playerIdx!, event.delta!);
    case 'energy_change':
      return applyEnergyChange(state, event.playerIdx!, event.delta!);
    case 'experience_change':
      return applyExperienceChange(state, event.playerIdx!, event.delta!);
    case 'toggle_monarch':
      return applyToggleMonarch(state, event.playerIdx!);
    case 'toggle_initiative':
      return applyToggleInitiative(state, event.playerIdx!);
    case 'toggle_citys_blessing':
      return applyToggleCitysBlessing(state, event.playerIdx!);
    case 'commander_damage_change':
      return applyCommanderDamageChange(
        state, event.targetIdx!, event.sourceIdx!, event.isPartner!, event.delta!
      );
    case 'eliminate':
      return applyEliminate(state, event.playerIdx!);
    case 'undo_eliminate':
      return applyUndoEliminate(state, event.playerIdx!);
    case 'pass_turn':
      return applyPassTurn(state);
    case 'checkin':
      return applyCheckin(state, event.seat, event.ts);
    case 'life_kill_attr':
      return applyLifeKillAttr(state, event.playerIdx!, event.sourcePlayerIdx ?? null);
    case 'poison_kill_attr':
      return applyPoisonKillAttr(state, event.playerIdx!, event.sourcePlayerIdx ?? null);
    default:
      return state;
  }
}
