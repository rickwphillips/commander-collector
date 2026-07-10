import type { PlayerState } from '@/lib/types';

export interface ThreatSource {
  artUrl?: string | null;
  cmdName: string;
  intensity: number;
  dmg: number;
}

/**
 * Biggest commander-damage threat against a set of target players: one incoming
 * map for a standard seat, both teammates' maps for a 2HG team. This is
 * PlayerPanel's original logic verbatim, generalized to accept more than one
 * target map (candidates from each are pooled, then the single highest wins).
 * Shared by PlayerPanel + TeamPanel so the flag-steal / threat-name behavior is
 * identical on both.
 */
export function computeThreatSource(
  incoming: Array<Record<number, [number, number]> | undefined>,
  playerByIdx: (idx: number) => PlayerState | undefined,
  tiebreakSourceIdx: number | null,
): ThreatSource | null {
  type Candidate = { srcIdx: number; isPartner: boolean; dmg: number; hasArt: boolean };
  const candidates: Candidate[] = [];
  for (const map of incoming) {
    if (!map) continue;
    for (const [sidxStr, dmgTuple] of Object.entries(map)) {
      const sidx = Number(sidxStr);
      const srcPlayer = playerByIdx(sidx);
      if (!srcPlayer) continue;
      const [main, partner] = dmgTuple;
      if (main > 0) candidates.push({ srcIdx: sidx, isPartner: false, dmg: main, hasArt: !!srcPlayer.commander.artCropUrl });
      if (partner > 0) candidates.push({ srcIdx: sidx, isPartner: true, dmg: partner, hasArt: !!(srcPlayer.partner?.artCropUrl) });
    }
  }
  if (candidates.length === 0) return null;
  candidates.sort((a, b) => {
    if (b.dmg !== a.dmg) return b.dmg - a.dmg;
    if (a.hasArt !== b.hasArt) return a.hasArt ? -1 : 1;
    if (a.srcIdx === tiebreakSourceIdx) return -1;
    if (b.srcIdx === tiebreakSourceIdx) return 1;
    return 0;
  });
  const best = candidates[0];
  const srcPlayer = playerByIdx(best.srcIdx)!;
  const artUrl = best.isPartner ? srcPlayer.partner?.artCropUrl : srcPlayer.commander.artCropUrl;
  const cmdName = best.isPartner ? (srcPlayer.partner?.name ?? '') : srcPlayer.commander.name;
  const intensity = Math.max(0, Math.min((best.dmg - 7) / 14, 1));
  return { artUrl, cmdName, intensity, dmg: best.dmg };
}
