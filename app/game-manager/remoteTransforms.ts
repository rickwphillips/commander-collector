/**
 * Pure state-transformation functions for the remote panel.
 *
 * Each function takes the CURRENT game state (from the DB) and returns the
 * updated state.  Keeping them pure lets them be unit-tested independently and
 * ensures that when remoteWrite() applies them on top of a fresh DB read they
 * never overwrite fields (like currentPlayerIdx / turnNumber) that the host
 * may have changed since the remote panel last polled.
 */
import type { GameManagerState, CommanderDamageMap } from '@/lib/types';

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
  const isNewElimination = !players[targetIdx].isEliminated && cmdDmgTotal >= 21;
  const isUndoElimination =
    players[targetIdx].isEliminated && prevTotal >= 21 && cmdDmgTotal < 21;
  const target = players[targetIdx];
  const source = players[sourceIdx];
  const cmdLabel = source.partner
    ? `${source.commander.name} / ${source.partner.name}`
    : source.commander.name;
  const noteTag = `[cmdkill:${targetIdx}:${sourceIdx}]`;
  const noteLine = `${noteTag} ${target.playerName} eliminated by ${cmdLabel} commander damage (turn ${turnNumber})`;
  let newNotes = notes;
  if (isNewElimination) newNotes = [notes, noteLine].filter(Boolean).join('\n');
  else if (isUndoElimination)
    newNotes = notes.split('\n').filter((l) => !l.includes(noteTag)).join('\n');
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
