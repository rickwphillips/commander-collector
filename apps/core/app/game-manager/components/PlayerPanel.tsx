'use client';

import { useMemo, useRef, useEffect, useCallback, useState } from 'react';
import { Box, Stack, SvgIcon, Typography } from '@mui/material';
import { usePoisonSound } from '@/game-manager/hooks/usePoisonSound';
import { useSounds } from '@/game-manager/hooks/useSounds';
import { useDamageFlash } from '@/game-manager/hooks/useDamageFlash';
import { useMonarchTransition } from '@/game-manager/hooks/useMonarchTransition';
import { useCitysBlessingExit } from '@/game-manager/hooks/useCitysBlessingExit';
import { useLongPress } from '@/game-manager/hooks/useLongPress';
import InitiativeIcon from '@mui/icons-material/Castle';
import type { PlayerState, CommanderDamageMap } from '../types';
import { PlayerCard, type PlayerCardProps, type KillOpponent } from './PlayerCard';

// ─── Local glyphs used only by the orchestrator's renderSourceSnapshot ─────
// PlayerCard owns its own copies of these for the card render.
const CrownIcon = (props: React.ComponentProps<typeof SvgIcon>) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M5 16l-3-10 5.5 4L12 2l4.5 8L22 6l-3 10H5zm0 2h14v2H5v-2z" />
  </SvgIcon>
);
const CityIcon = ({ active, ...props }: React.ComponentProps<typeof SvgIcon> & { active?: boolean }) => (
  <SvgIcon {...props} viewBox="0 0 1024 1024">
    {active && (
      <defs>
        <linearGradient id="cityGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E040FB" />
          <stop offset="50%" stopColor="#7851A9" />
          <stop offset="100%" stopColor="#311B92" />
        </linearGradient>
      </defs>
    )}
    <path fill={active ? 'url(#cityGrad)' : 'currentColor'} d="M503.612.522c5.954-.16 11.908-.32 17.862-.522 11.304 64.93 18.666 130.504 28.924 195.596 51.816 6.276 101.46 25.586 144.826 54.55 37.576-10.66 75.028-21.764 112.604-32.504-10.42 36.206-21.362 72.332-31.702 108.578-2.052 5.03 2.656 9.334 4.626 13.558 26.754 40.51 42.524 87.498 48.84 135.492 64.688 9.374 129.336 18.908 194.026 28.402.04 5.994.12 12.03.242 18.104-64.77 10.822-130.062 18.344-194.912 28.684-6.156 51.896-26.35 101.256-55.316 144.544 10.982 37.896 22.488 75.632 33.068 113.648-38.58-10.742-76.758-22.93-115.378-33.592-42.402 28.724-91.642 45.782-142.17 52.742-9.454 65.252-18.828 130.544-28.402 195.796-6.074.12-12.15.242-18.184.402-9.936-62.316-18.022-124.952-27.154-187.428-1.086-3.862-.846-10.862-6.598-10.622-48.638-6.436-94.66-25.666-135.694-52.178-39.144 11.426-78.206 23.174-117.43 34.276 10.58-38.096 22.528-75.792 33.23-113.848 2.252-5.432-2.736-10.098-4.868-14.604-24.702-38.982-40.27-83.638-45.7-129.458-65.736-11.104-131.994-19.27-197.89-29.368-.12-6.074-.2-12.19-.322-18.224 65.896-10.822 132.356-18.144 198.17-29.328 5.352-50.206 24.622-97.958 51.656-140.28-10.984-38.902-22.488-77.642-33.632-116.464 38.7 11.144 77.2 23.052 116.022 33.712 42.482-29.448 91.964-47.148 142.854-54.912 9.212-64.97 18.908-129.82 28.402-194.752zm-47.914 270.302c-33.47 8.006-65.13 23.294-92.526 44.132-5.432 3.742-10.54 10.018-8.852 17.058 1.852 7.844 9.696 11.706 15.448 16.494 23.494 16.776 46.064 34.878 69.798 51.332 8.69 5.994 21.644-.724 22.128-11.184 5.51-33.712 10.136-67.584 15.004-101.378 2.576-11.546-10.458-21.12-21-16.454zm104.074-1.488c-8.448 1.81-13.678 10.782-11.424 19.068 4.344 32.224 9.05 64.408 13.718 96.552.442 7.442 4.546 16.01 12.832 16.896 7.806 1.528 13.718-4.708 19.672-8.57 23.576-18.022 47.994-34.878 71.328-53.222 8.81-5.794 7.282-19.714-1.61-24.662-30.412-23.132-66.458-41.034-104.516-46.062zM326.28 354.22c-7.602 2.736-11.586 10.298-16.172 16.374-17.862 26.43-31.66 56.04-37.936 87.418-2.976 9.696 6.478 20.074 16.374 17.982 33.39-4.506 66.82-9.01 100.09-14.322 12.23-.32 17.782-16.332 9.656-24.86-17.38-24.138-35.362-47.834-52.862-71.85-4.304-6.156-10.822-12.954-19.15-10.742zm362.468.08c-19.472 21.242-34.718 46.184-52.74 68.712-5.714 8.972-16.816 17.58-13.156 29.448 3.54 9.334 14.442 9.616 22.77 11.104 31.178 4.224 62.276 9.414 93.494 13.436 10.138 1.892 19.31-9.132 15.97-18.868-7.644-35.722-23.694-69.838-46.344-98.48-4.264-6.598-12.994-8.892-19.994-5.352zM282.672 547.604c-7.604 2.574-12.834 10.66-10.218 18.666 7.482 34.798 23.212 67.988 45.178 95.986 5.108 8.088 17.982 9.214 23.654 1.168 17.782-22.57 34.236-46.144 51.736-68.914 4.706-6.678 11.948-14.28 8.126-23.092-3.34-10.902-17.018-9.412-25.988-11.626-30.856-3.46-61.512-10.378-92.488-12.188zm422.168 5.028c-24.178 3.902-48.598 6.154-72.614 10.902-10.5 2.052-13.84 16.414-6.84 23.936 18.586 25.626 37.534 51.012 56.564 76.356 5.47 10.138 20.758 10.098 26.35.08 23.252-30.454 42.24-66.458 46.786-104.758-8.368-20.556-34.074-6.476-50.246-6.516zm-265.434 71.086c-23.936 16.372-46.546 34.556-70.16 51.372-6.316 5.07-15.488 10.098-15.046 19.43.724 8.168 8.448 12.834 14.282 17.42 26.752 18.948 57.044 33.43 89.148 40.35 9.976 3.38 20.638-6.638 18.424-16.736-4.626-33.55-9.132-67.142-14.442-100.572-.28-10.54-13.596-17.46-22.206-11.264zm129.016.562c-6.356 3.258-5.994 11.788-7.604 17.822-4.384 31.016-9.052 62.034-13.396 93.09-2.976 10.622 7.926 21.806 18.626 18.024 35.322-7.524 68.994-23.092 97.556-45.138 8.288-4.948 9.938-17.66 1.892-23.614-24.782-19.512-50.568-37.776-75.712-56.844-5.794-5.07-14.402-8.046-21.362-3.34z" />
  </SvgIcon>
);
const XP_ICON_SRC = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPxc2Yz21vbnc5VP3Muxnx5VtQGAynItuNWg&s';

// ─── Module-level commander-art preload cache ──────────────────────────────
// Preloading commander images on mount keeps them in the browser cache so
// state-driven re-renders (life totals, counters) never re-fetch them.
const _artPreloadCache = new Map<string, HTMLImageElement>();
function preloadArt(url: string | undefined) {
  if (!url || _artPreloadCache.has(url)) return;
  const img = new Image();
  img.src = url;
  _artPreloadCache.set(url, img);
}

interface PlayerPanelProps {
  player: PlayerState;
  playerIdx: number;
  allPlayers: PlayerState[];
  commanderDamage: CommanderDamageMap;
  onLifeChange: (idx: number, delta: number) => void;
  onPoisonChange: (idx: number, delta: number) => void;
  onCommanderTaxChange: (idx: number, delta: number) => void;
  onEnergyChange: (idx: number, delta: number) => void;
  onExperienceChange: (idx: number, delta: number) => void;
  onToggleMonarch: (idx: number) => void;
  onToggleInitiative: (idx: number) => void;
  onToggleCitysBlessing: (idx: number) => void;
  onCommanderDamageChange: (targetIdx: number, sourceIdx: number, isPartner: boolean, delta: number) => void;
  onEliminate: (idx: number) => void;
  onUndoEliminate: (idx: number) => void;
  onPassTurn?: () => void;
  lifeKillOpponents?: KillOpponent[];
  onLifeKillSelect?: (sourceIdx: number | null) => void;
  poisonKillOpponents?: KillOpponent[];
  onPoisonKillSelect?: (sourceIdx: number | null) => void;
  isHighlighted?: boolean;
  isCurrentPlayer?: boolean;
  elapsedSeconds?: number;
  turnTimerSeconds?: number;
  startingLife?: number;
  monarchTransfer?: { fromPos: string | null; toPos: string | null };
  highlightMode?: boolean;
  remoteMode?: boolean;
  seatCode?: string;
  activePlayerIdx?: number;
  remoteConnected?: boolean;
  soundEnabled?: boolean;
  onSwitchToPlayer?: (targetIdx: number) => void;
  isBeingViewed?: boolean;
  viewerPlayerNames?: string[];
  onToggleTheme?: () => void;
  themeMode?: 'light' | 'dark';
  onToggleSound?: () => void;
  onOpenChat?: (playerName: string) => void;
}

export function PlayerPanel({
  player,
  playerIdx,
  allPlayers,
  commanderDamage,
  onLifeChange,
  onPoisonChange,
  onCommanderTaxChange,
  onEnergyChange,
  onExperienceChange,
  onToggleMonarch,
  onToggleInitiative,
  onToggleCitysBlessing,
  onCommanderDamageChange,
  onEliminate,
  onUndoEliminate,
  onPassTurn,
  lifeKillOpponents,
  onLifeKillSelect,
  poisonKillOpponents,
  onPoisonKillSelect,
  isHighlighted = false,
  isCurrentPlayer = false,
  elapsedSeconds = 0,
  turnTimerSeconds = 300,
  startingLife = 40,
  monarchTransfer = { fromPos: null, toPos: null },
  highlightMode = false,
  remoteMode = false,
  seatCode,
  activePlayerIdx,
  remoteConnected = false,
  soundEnabled = true,
  onSwitchToPlayer,
  isBeingViewed = false,
  viewerPlayerNames = [],
  onToggleTheme,
  themeMode,
  onToggleSound,
  onOpenChat,
}: PlayerPanelProps) {
  // ─── Side-effect hooks ───────────────────────────────────────────────────
  usePoisonSound(player.poison, player.isEliminated, soundEnabled);
  const { playCitysBlessing } = useSounds(soundEnabled, player.hasCitysBlessing);

  // ─── Animation lifecycle hooks (drive the animations bundle) ─────────────
  const damageFlash = useDamageFlash(player.life);
  const { monarchAnim, monarchEnterIsTransfer } = useMonarchTransition(
    player.isMonarch,
    monarchTransfer,
  );
  const { cityBlessingVisible, cityBlessingExiting } = useCitysBlessingExit(
    player.hasCitysBlessing,
    playCitysBlessing,
  );

  // ─── XP flash (transient ripple on experience increment) ─────────────────
  const [xpFlashing, setXpFlashing] = useState(false);
  const [xpRippleKey, setXpRippleKey] = useState(0);
  const prevExperience = useRef(player.experience);
  useEffect(() => {
    if (player.experience > prevExperience.current) {
      setXpFlashing(true);
      setXpRippleKey(k => k + 1);
      setTimeout(() => setXpFlashing(false), 700);
    }
    prevExperience.current = player.experience;
  }, [player.experience]);

  // ─── Long-press detector ─────────────────────────────────────────────────
  const longPressRaw = useLongPress();
  const { lpKey } = longPressRaw;

  // ─── Last-tapped CMD damage source (for threat-source tiebreak) ──────────
  const [lastCmdDmgSourceIdx, setLastCmdDmgSourceIdx] = useState<number | null>(null);

  // ─── Viewer banner (auto-hide 2.5s after view-state change or manual ping)
  const isBeingViewedByAnyone = isBeingViewed || viewerPlayerNames.length > 0;
  const viewerTooltipText = useMemo(() => {
    if (viewerPlayerNames.length === 1) return `${viewerPlayerNames[0]} is viewing your panel`;
    if (viewerPlayerNames.length === 2) return `${viewerPlayerNames[0]} and ${viewerPlayerNames[1]} are viewing your panel`;
    if (viewerPlayerNames.length > 2) return `${viewerPlayerNames.slice(0, 2).join(', ')} and ${viewerPlayerNames.length - 2} other${viewerPlayerNames.length - 2 > 1 ? 's' : ''} are viewing your panel`;
    return 'Someone is viewing your panel';
  }, [viewerPlayerNames]);
  const [viewerBannerVisible, setViewerBannerVisible] = useState(false);
  const [viewerBannerNonce, setViewerBannerNonce] = useState(0);
  const showViewerBanner = useCallback(() => setViewerBannerNonce((n) => n + 1), []);
  useEffect(() => {
    if (!isBeingViewedByAnyone && viewerBannerNonce === 0) return;
    setViewerBannerVisible(true);
    const t = setTimeout(() => setViewerBannerVisible(false), 2500);
    return () => clearTimeout(t);
  }, [isBeingViewedByAnyone, viewerPlayerNames.length, viewerBannerNonce]);

  // ─── Preload all commander art once on mount ─────────────────────────────
  useEffect(() => {
    allPlayers.forEach(p => {
      preloadArt(p.commander.artCropUrl);
      preloadArt(p.partner?.artCropUrl);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Derived: timer ──────────────────────────────────────────────────────
  const timerOff = turnTimerSeconds === 0;
  const timerProgress = timerOff ? 0 : Math.min(elapsedSeconds / turnTimerSeconds, 1);
  const isTimerExpired = isCurrentPlayer && !timerOff && elapsedSeconds >= turnTimerSeconds;

  function timerColorChannels(): [number, number, number] {
    if (timerOff) return [66, 165, 245];
    if (timerProgress <= 0.5) {
      const p = timerProgress * 2;
      return [Math.round(102 + 153 * p), Math.round(187 - 20 * p), Math.round(106 - 68 * p)];
    }
    const p = (timerProgress - 0.5) * 2;
    return [Math.round(255 - 26 * p), Math.round(167 - 110 * p), Math.round(38 + 15 * p)];
  }
  function timerColorStr(): string {
    const [r, g, b] = timerColorChannels();
    return `rgb(${r},${g},${b})`;
  }
  const timerColor = timerColorStr();
  const timerColorRgba = useCallback((alpha: number): string => {
    if (timerOff) return `rgba(66,165,245,${alpha})`;
    let r: number, g: number, b: number;
    if (timerProgress <= 0.5) {
      const p = timerProgress * 2;
      r = Math.round(102 + 153 * p); g = Math.round(187 - 20 * p); b = Math.round(106 - 68 * p);
    } else {
      const p = (timerProgress - 0.5) * 2;
      r = Math.round(255 - 26 * p); g = Math.round(167 - 110 * p); b = Math.round(38 + 15 * p);
    }
    return `rgba(${r},${g},${b},${alpha})`;
  }, [timerOff, timerProgress]);

  const currentPlayerBorder = isCurrentPlayer ? `3px solid ${timerColor}` : undefined;
  const currentPlayerShadow = isCurrentPlayer ? `0 0 16px 4px ${timerColor}88` : undefined;

  // ─── Derived: life / poison / warning ────────────────────────────────────
  function lifeColor(life: number): string {
    if (life <= 0) return '#6B0000';
    if (life > startingLife) {
      const gain = Math.min((life - startingLife) / startingLife, 1);
      const r = Math.round(180 - 140 * gain);
      const g = Math.round(120 + 102 * gain);
      const b = Math.round(60 - 36 * gain);
      return `rgb(${r},${g},${b})`;
    }
    const ratio = Math.max(0, Math.min((startingLife - life) / startingLife, 1));
    if (ratio <= 0) return '';
    const r = Math.round(180 + 71 * ratio);
    const g = Math.round(120 - 120 * ratio);
    const b = Math.round(60 - 60 * ratio);
    return `rgb(${r},${g},${b})`;
  }
  const computedLifeColor = lifeColor(player.life);
  const lostRatio = player.life <= 0 ? 1 : Math.max(0, Math.min((startingLife - player.life) / startingLife, 1));

  const isLifeLow = player.life <= 0;
  const isPoisoned = player.poison >= 10;
  const isCmdDmgHigh = Object.values(commanderDamage[playerIdx] ?? {}).some(
    (dmg) => dmg[0] >= 21 || dmg[1] >= 21
  );
  const isWarning = isLifeLow || isPoisoned || isCmdDmgHigh;

  // ─── Derived: threat source (biggest CMD damage threat against this player)
  const threatSource = useMemo(() => {
    if (player.isEliminated) return null;
    const myDmg = commanderDamage[playerIdx] ?? {};
    type Candidate = { srcIdx: number; isPartner: boolean; dmg: number; hasArt: boolean };
    const candidates: Candidate[] = [];
    for (const [sidxStr, dmgTuple] of Object.entries(myDmg)) {
      const sidx = Number(sidxStr);
      const srcPlayer = allPlayers[sidx];
      if (!srcPlayer) continue;
      const [main, partner] = dmgTuple;
      if (main > 0) candidates.push({ srcIdx: sidx, isPartner: false, dmg: main, hasArt: !!srcPlayer.commander.artCropUrl });
      if (partner > 0) candidates.push({ srcIdx: sidx, isPartner: true, dmg: partner, hasArt: !!(srcPlayer.partner?.artCropUrl) });
    }
    if (candidates.length === 0) return null;
    candidates.sort((a, b) => {
      if (b.dmg !== a.dmg) return b.dmg - a.dmg;
      if (a.hasArt !== b.hasArt) return a.hasArt ? -1 : 1;
      if (a.srcIdx === lastCmdDmgSourceIdx) return -1;
      if (b.srcIdx === lastCmdDmgSourceIdx) return 1;
      return 0;
    });
    const best = candidates[0];
    const srcPlayer = allPlayers[best.srcIdx];
    const artUrl = best.isPartner ? srcPlayer.partner?.artCropUrl : srcPlayer.commander.artCropUrl;
    const cmdName = best.isPartner ? (srcPlayer.partner?.name ?? '') : srcPlayer.commander.name;
    const intensity = Math.max(0, Math.min((best.dmg - 7) / 14, 1));
    return { artUrl, cmdName, intensity, dmg: best.dmg };
  }, [commanderDamage, playerIdx, allPlayers, player.isEliminated, lastCmdDmgSourceIdx]);

  // ─── Derived: crack alpha closure (depends only on lostRatio) ────────────
  const crackAlpha = useCallback(
    (from: number) => Math.min(Math.max((lostRatio - from) / 0.15, 0), 1),
    [lostRatio],
  );

  // ─── Wrapped CMD damage handler (tracks last-tapped source for tiebreak) ─
  const handleCmdDmgChange = useCallback(
    (targetIdx: number, sourceIdx: number, isPartner: boolean, delta: number) => {
      setLastCmdDmgSourceIdx(sourceIdx);
      onCommanderDamageChange(targetIdx, sourceIdx, isPartner, delta);
    },
    [onCommanderDamageChange],
  );

  // ─── Source-snapshot renderer (closure over allPlayers / commanderDamage) ─
  const renderSourceSnapshot = useCallback((src: PlayerState, srcIdx: number) => {
    const dealtRows = allPlayers.flatMap((tgt, tgtIdx) => {
      if (tgtIdx === srcIdx) return [];
      const d = commanderDamage[tgtIdx]?.[srcIdx] ?? [0, 0];
      if (d[0] === 0 && d[1] === 0) return [];
      return [{ tgt, d }];
    });
    const srcLifeColor = lifeColor(src.life);
    return (
      <Box sx={{ width: 190, position: 'relative', overflow: 'hidden' }}>
        {src.commander.artCropUrl && (
          <Box sx={{ position: 'absolute', inset: 0, backgroundImage: `url(${src.commander.artCropUrl})`, backgroundSize: 'cover', backgroundPosition: 'center top', opacity: 0.12, pointerEvents: 'none' }} />
        )}
        <Stack direction="row" alignItems="flex-start" spacing={0.75} sx={{ position: 'relative', p: 1, pb: 0.5 }}>
          {src.commander.artCropUrl && (
            <Box component="img" src={src.commander.artCropUrl} alt="" sx={{ height: 36, width: 'auto', borderRadius: 0.5, flexShrink: 0 }} />
          )}
          <Box sx={{ overflow: 'hidden', flex: 1, minWidth: 0 }}>
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography sx={{ fontSize: 12, fontWeight: 800, lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{src.playerName}</Typography>
              {src.isMonarch && <CrownIcon sx={{ fontSize: 12, color: '#DAA520', flexShrink: 0 }} />}
              {src.hasInitiative && <InitiativeIcon sx={{ fontSize: 12, color: '#4FC3F7', flexShrink: 0 }} />}
              {src.hasCitysBlessing && <CityIcon active sx={{ fontSize: 12, flexShrink: 0 }} />}
            </Stack>
            <Typography sx={{ fontSize: 10, color: 'text.secondary', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{src.commander.name}</Typography>
            {src.partner && <Typography sx={{ fontSize: 10, color: 'text.secondary', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{src.partner.name}</Typography>}
          </Box>
        </Stack>
        <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mx: 1 }} />
        <Stack direction="row" alignItems="center" sx={{ position: 'relative', px: 1, py: 0.5 }}>
          <Typography sx={{ fontSize: 40, fontWeight: 900, lineHeight: 1, flex: 1, textAlign: 'center', color: srcLifeColor || 'primary.main', textDecoration: src.isEliminated ? 'line-through' : 'none' }}>{src.life}</Typography>
          <Stack spacing={0.25} sx={{ minWidth: 60 }}>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: src.poison >= 10 ? 'error.main' : src.poison > 0 ? '#66BB6A' : 'text.disabled' }}>☠ {src.poison}</Typography>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: src.energy > 0 ? '#4FC8FF' : 'text.disabled' }}>⚡ {src.energy}</Typography>
            <Stack direction="row" alignItems="center" spacing={0.25}>
              <Box sx={{ bgcolor: 'background.paper', display: 'inline-flex' }}><Box component="img" src={XP_ICON_SRC} alt="XP" sx={{ width: 11, height: 11, objectFit: 'contain', mixBlendMode: 'multiply' }} /></Box>
              <Typography sx={{ fontSize: 11, fontWeight: 700, color: src.experience > 0 ? '#DAA520' : 'text.disabled' }}>{src.experience}</Typography>
            </Stack>
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: src.commanderTax > 0 ? 'text.secondary' : 'text.disabled' }}>Tax +{src.commanderTax * 2}</Typography>
          </Stack>
        </Stack>
        {dealtRows.length > 0 && (
          <>
            <Box sx={{ borderTop: '1px solid', borderColor: 'divider', mx: 1 }} />
            <Box sx={{ position: 'relative', px: 1, pt: 0.5, pb: 0.75 }}>
              <Typography sx={{ fontSize: 9, fontWeight: 700, color: 'text.disabled', textTransform: 'uppercase', letterSpacing: 0.5, mb: 0.25 }}>CMD Damage Dealt</Typography>
              {dealtRows.map(({ tgt, d }) => (
                <Stack key={tgt.playerName} direction="row" alignItems="center" justifyContent="space-between">
                  <Typography sx={{ fontSize: 11, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, color: 'text.secondary' }}>{tgt.playerName}</Typography>
                  <Typography sx={{ fontSize: 12, fontWeight: 700, color: (d[0] >= 21 || d[1] >= 21) ? 'error.main' : 'text.primary', ml: 1 }}>
                    {src.partner ? `${d[0]} / ${d[1]}` : d[0]}
                  </Typography>
                </Stack>
              ))}
            </Box>
          </>
        )}
      </Box>
    );
    // lifeColor closes over `startingLife`; otherwise pure-function over closed args.
  }, [allPlayers, commanderDamage, startingLife]);

  // ─── Memoized bundles (the whole point of the split: stable references so
  // PlayerCard's React.memo comparator can short-circuit on unchanged inputs).
  // ──────────────────────────────────────────────────────────────────────────

  const sizes = useMemo<PlayerCardProps['sizes']>(() => ({
    fsPlayerName:   remoteMode ? 'clamp(13px, 2.0dvmax, 26px)'  : 'clamp(9px,  1.8dvh, 15px)',
    fsDeckName:     remoteMode ? 'clamp(10px, 1.5dvmax, 20px)'  : 'clamp(7px,  1.3dvh, 11px)',
    fsPassBtn:      remoteMode ? 'clamp(13px, 1.8dvmax, 22px)'  : 'clamp(9px,  1.6dvh, 13px)',
    fsHeaderIcon:   remoteMode ? 'clamp(24px, 3.8dvmax, 48px)'  : 'clamp(16px, 3.0dvh, 26px)',
    fsSmallIcon:    remoteMode ? 'clamp(16px, 2.4dvmax, 30px)'  : 'clamp(11px, 2.0dvh, 16px)',
    fsMenuTrigger:  remoteMode ? 'clamp(20px, 2.8dvmax, 36px)'  : 'clamp(14px, 2.2dvh, 20px)',
    fsSectionLabel: remoteMode ? 'clamp(12px, 1.8dvmax, 24px)'  : 'clamp(8px,  1.4dvh, 13px)',
    fsSourceName:   remoteMode ? 'clamp(13px, 2.0dvmax, 28px)'  : 'clamp(10px, 1.9dvh, 18px)',
    fsStatBadge:    remoteMode ? 'clamp(10px, 1.4dvmax, 18px)'  : 'clamp(8px,  1.4dvh, 12px)',
    fsCounterLabel: remoteMode ? 'clamp(14px, 2.4dvmax, 32px)'  : 'clamp(10px, 1.9dvh, 18px)',
    fsCounterValue: remoteMode ? 'clamp(20px, 3.5dvmax, 44px)'  : 'clamp(14px, 2.8dvh, 24px)',
    fsCounterBtn:   remoteMode ? 'clamp(26px, 4.2dvmax, 52px)'  : 'clamp(17px, 3.2dvh, 26px)',
    fsLifeBtn:      remoteMode ? 'clamp(40px, 8.5dvmax, 90px)'  : 'clamp(28px, 7.0dvh, 56px)',
    fsKillPrompt:   remoteMode ? 'clamp(15px, 2.4dvmax, 28px)'  : 'clamp(11px, 2.0dvh, 15px)',
    artHeight:      remoteMode ? 'clamp(40px, 7.5dvmax, 80px)'  : 'clamp(24px, 4.5dvh, 42px)',
    cmdBtnWidth:    remoteMode ? 'clamp(44px, 6.0dvmax, 70px)'  : 'clamp(28px, 5.0dvh, 38px)',
    cmdBtnHeight:   remoteMode ? 'clamp(40px, 5.5dvmax, 64px)'  : 'clamp(26px, 4.5dvh, 36px)',
    valColWidth:    remoteMode ? 'clamp(32px, 6.0dvmax, 58px)'  : 'clamp(24px, 4.5dvh, 36px)',
  }), [remoteMode]);

  const position = useMemo<PlayerCardProps['position']>(() => {
    const POSITION_ROTATION = { top: '180deg', left: '90deg', right: '270deg', bottom: '0deg' } as const;
    const POSITION_HEADER_PLACEMENT = { top: 'top', left: 'left', right: 'left', bottom: 'bottom' } as const;
    const POSITION_SNAPSHOT_PLACEMENT = { bottom: 'top', top: 'bottom', left: 'right', right: 'left' } as const;
    const ttRotate = POSITION_ROTATION[player.position];
    return {
      ttRotate,
      ttHeaderPlacement: POSITION_HEADER_PLACEMENT[player.position],
      snapshotPlacement: POSITION_SNAPSHOT_PLACEMENT[player.position],
      ttSlotProps: { tooltip: { sx: { rotate: ttRotate } } },
      ttHeaderSlotProps: {
        tooltip: { sx: { rotate: ttRotate } },
        popper: { modifiers: [{ name: 'flip', enabled: false }] },
      },
    };
  }, [player.position]);

  const timer = useMemo<PlayerCardProps['timer']>(() => ({
    timerOff,
    timerProgress,
    isTimerExpired,
    timerColor,
    timerColorRgba,
    currentPlayerBorder,
    currentPlayerShadow,
  }), [timerOff, timerProgress, isTimerExpired, timerColor, timerColorRgba, currentPlayerBorder, currentPlayerShadow]);

  const animations = useMemo<PlayerCardProps['animations']>(() => ({
    damageFlash,
    monarchAnim,
    monarchEnterIsTransfer,
    cityBlessingVisible,
    cityBlessingExiting,
    xpFlashing,
    xpRippleKey,
  }), [damageFlash, monarchAnim, monarchEnterIsTransfer, cityBlessingVisible, cityBlessingExiting, xpFlashing, xpRippleKey]);

  const viewer = useMemo<PlayerCardProps['viewer']>(() => ({
    isBeingViewedByAnyone,
    viewerTooltipText,
    viewerBannerVisible,
    onEyeIconClick: showViewerBanner,
  }), [isBeingViewedByAnyone, viewerTooltipText, viewerBannerVisible, showViewerBanner]);

  const longPress = useMemo<PlayerCardProps['longPress']>(() => ({
    lpKey: longPressRaw.lpKey,
    startLongPress: longPressRaw.startLongPress,
    cancelLongPress: longPressRaw.cancelLongPress,
    guardClick: longPressRaw.guardClick,
  }), [longPressRaw.lpKey, longPressRaw.startLongPress, longPressRaw.cancelLongPress, longPressRaw.guardClick]);
  // Touch lpKey so eslint doesn't flag the unused destructure; the bundle is
  // what matters to the consumer.
  void lpKey;

  return (
    <PlayerCard
      player={player}
      playerIdx={playerIdx}
      allPlayers={allPlayers}
      commanderDamage={commanderDamage}
      startingLife={startingLife}
      activePlayerIdx={activePlayerIdx}
      remoteMode={remoteMode}
      seatCode={seatCode}
      remoteConnected={remoteConnected}
      soundEnabled={soundEnabled}
      highlightMode={highlightMode}
      isHighlighted={isHighlighted}
      isCurrentPlayer={isCurrentPlayer}
      themeMode={themeMode}
      lifeKillOpponents={lifeKillOpponents}
      poisonKillOpponents={poisonKillOpponents}
      onLifeChange={onLifeChange}
      onPoisonChange={onPoisonChange}
      onCommanderTaxChange={onCommanderTaxChange}
      onEnergyChange={onEnergyChange}
      onExperienceChange={onExperienceChange}
      onToggleMonarch={onToggleMonarch}
      onToggleInitiative={onToggleInitiative}
      onToggleCitysBlessing={onToggleCitysBlessing}
      onCommanderDamageChange={onCommanderDamageChange}
      onEliminate={onEliminate}
      onUndoEliminate={onUndoEliminate}
      onPassTurn={onPassTurn}
      onLifeKillSelect={onLifeKillSelect}
      onPoisonKillSelect={onPoisonKillSelect}
      onSwitchToPlayer={onSwitchToPlayer}
      onToggleTheme={onToggleTheme}
      onToggleSound={onToggleSound}
      onOpenChat={onOpenChat}
      sizes={sizes}
      position={position}
      timer={timer}
      animations={animations}
      viewer={viewer}
      longPress={longPress}
      threatSource={threatSource}
      computedLifeColor={computedLifeColor}
      lostRatio={lostRatio}
      crackAlpha={crackAlpha}
      isWarning={isWarning}
      renderSourceSnapshot={renderSourceSnapshot}
      handleCmdDmgChange={handleCmdDmgChange}
    />
  );
}
