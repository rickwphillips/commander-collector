/**
 * detectSideEffects(prev, next) — pure diff of two game states, returning the
 * UI-level side effects that should fire as a result of the transition.
 *
 * Background. Host-driven actions previously fired their UI consequences (the
 * life-kill attribution prompt, the poison-kill prompt, the monarch transfer
 * animation) inline inside their handlers. Remote-driven events flowed through
 * `applyEvent` on the SSE path but skipped all of those consequences — meaning
 * a player killed via the remote panel never prompted the host to attribute
 * the kill.
 *
 * By deriving side effects from a state diff, we get the same UI behavior
 * whether the trigger was a local button press or a wire event from a remote.
 *
 * Winner detection lives in a state-driven useEffect in GameBoard and works
 * for both paths already, so it is intentionally NOT emitted here.
 */
import type { GameManagerState, PlayerState } from '@/lib/types';

export type SideEffect =
  | { type: 'lifeKillPrompt'; targetIdx: number }
  | { type: 'poisonKillPrompt'; targetIdx: number; newPlayers: PlayerState[] }
  | { type: 'monarchTransfer'; fromPos: string | null; toPos: string | null };

function commanderDamageChangedForTarget(
  prev: GameManagerState,
  next: GameManagerState,
  targetIdx: number,
): boolean {
  const prevMap = prev.commanderDamage[targetIdx] ?? {};
  const nextMap = next.commanderDamage[targetIdx] ?? {};
  const sources = new Set([...Object.keys(prevMap), ...Object.keys(nextMap)]);
  for (const k of sources) {
    const a = prevMap[Number(k)] ?? [0, 0];
    const b = nextMap[Number(k)] ?? [0, 0];
    if (a[0] !== b[0] || a[1] !== b[1]) return true;
  }
  return false;
}

export function detectSideEffects(
  prev: GameManagerState,
  next: GameManagerState,
): SideEffect[] {
  const effects: SideEffect[] = [];

  // Per-player diffs: life-kill prompt and poison-kill prompt.
  for (let i = 0; i < next.players.length; i++) {
    const p0 = prev.players[i];
    const p1 = next.players[i];
    if (!p0 || !p1) continue;

    // Poison-kill prompt: poison just crossed from <10 to >=10.
    // Predicate mirrors the existing GameBoard.handlePoisonChange:
    //   !target.isEliminated_at_kill_moment && newPoison >= 10
    if (p0.poison < 10 && p1.poison >= 10 && !p0.isEliminated) {
      effects.push({ type: 'poisonKillPrompt', targetIdx: i, newPlayers: next.players });
      continue;
    }

    // Life-kill prompt: life just crossed from >0 to <=0, AND the cause was
    // not commander damage (commanderDamage map carries its own attribution).
    // Predicate mirrors GameBoard.handleLifeChange: `target.life > 0 && newLife <= 0`.
    if (p0.life > 0 && p1.life <= 0) {
      const cmdDmgChanged = commanderDamageChangedForTarget(prev, next, i);
      if (!cmdDmgChanged) {
        effects.push({ type: 'lifeKillPrompt', targetIdx: i });
      }
    }
  }

  // Monarch transfer: who holds the crown changed.
  const prevMonarch = prev.players.find((p) => p.isMonarch) ?? null;
  const nextMonarch = next.players.find((p) => p.isMonarch) ?? null;
  const prevPos = prevMonarch?.position ?? null;
  const nextPos = nextMonarch?.position ?? null;
  if (prevPos !== nextPos) {
    effects.push({ type: 'monarchTransfer', fromPos: prevPos, toPos: nextPos });
  }

  return effects;
}
