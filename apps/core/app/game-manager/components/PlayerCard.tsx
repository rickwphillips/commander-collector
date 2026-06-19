'use client';

import { memo, useEffect, useRef, useState } from 'react';
import { keyframes } from '@emotion/react';
import { Box, Button, CircularProgress, IconButton, Stack, SvgIcon, TextField, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import ChatIcon from '@mui/icons-material/Chat';
import InitiativeIcon from '@mui/icons-material/Castle';
import CloseIcon from '@mui/icons-material/Close';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ElimIcon from '@mui/icons-material/PersonOff';
import QrCodeIcon from '@mui/icons-material/QrCode';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { QRCodeSVG } from 'qrcode.react';
import { getCardImageByName } from '@commander/shared/lib/cardImageCache';
import { ASSET_BASE } from '@/lib/api';
import { ControlFocusModal } from './ControlFocusModal';
import { useXpKeyframes } from './PlayerCard.keyframes';

const XP_ICON_SRC = 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRPxc2Yz21vbnc5VP3Muxnx5VtQGAynItuNWg&s';

// Local glyphs duplicated from PlayerPanel. Phase 3 will fold both into a
// shared icons module along with the keyframes.
const CrownIcon = (props: React.ComponentProps<typeof SvgIcon>) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M5 16l-3-10 5.5 4L12 2l4.5 8L22 6l-3 10H5zm0 2h14v2H5v-2z" />
  </SvgIcon>
);
const CityIcon = ({ active, ...props }: React.ComponentProps<typeof SvgIcon> & { active?: boolean }) => (
  <SvgIcon {...props} viewBox="0 0 1024 1024">
    {active && (
      <defs>
        <linearGradient id="cityGradCard" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E040FB" />
          <stop offset="50%" stopColor="#7851A9" />
          <stop offset="100%" stopColor="#311B92" />
        </linearGradient>
      </defs>
    )}
    <path fill={active ? 'url(#cityGradCard)' : 'currentColor'} d="M503.612.522c5.954-.16 11.908-.32 17.862-.522 11.304 64.93 18.666 130.504 28.924 195.596 51.816 6.276 101.46 25.586 144.826 54.55 37.576-10.66 75.028-21.764 112.604-32.504-10.42 36.206-21.362 72.332-31.702 108.578-2.052 5.03 2.656 9.334 4.626 13.558 26.754 40.51 42.524 87.498 48.84 135.492 64.688 9.374 129.336 18.908 194.026 28.402.04 5.994.12 12.03.242 18.104-64.77 10.822-130.062 18.344-194.912 28.684-6.156 51.896-26.35 101.256-55.316 144.544 10.982 37.896 22.488 75.632 33.068 113.648-38.58-10.742-76.758-22.93-115.378-33.592-42.402 28.724-91.642 45.782-142.17 52.742-9.454 65.252-18.828 130.544-28.402 195.796-6.074.12-12.15.242-18.184.402-9.936-62.316-18.022-124.952-27.154-187.428-1.086-3.862-.846-10.862-6.598-10.622-48.638-6.436-94.66-25.666-135.694-52.178-39.144 11.426-78.206 23.174-117.43 34.276 10.58-38.096 22.528-75.792 33.23-113.848 2.252-5.432-2.736-10.098-4.868-14.604-24.702-38.982-40.27-83.638-45.7-129.458-65.736-11.104-131.994-19.27-197.89-29.368-.12-6.074-.2-12.19-.322-18.224 65.896-10.822 132.356-18.144 198.17-29.328 5.352-50.206 24.622-97.958 51.656-140.28-10.984-38.902-22.488-77.642-33.632-116.464 38.7 11.144 77.2 23.052 116.022 33.712 42.482-29.448 91.964-47.148 142.854-54.912 9.212-64.97 18.908-129.82 28.402-194.752zm-47.914 270.302c-33.47 8.006-65.13 23.294-92.526 44.132-5.432 3.742-10.54 10.018-8.852 17.058 1.852 7.844 9.696 11.706 15.448 16.494 23.494 16.776 46.064 34.878 69.798 51.332 8.69 5.994 21.644-.724 22.128-11.184 5.51-33.712 10.136-67.584 15.004-101.378 2.576-11.546-10.458-21.12-21-16.454zm104.074-1.488c-8.448 1.81-13.678 10.782-11.424 19.068 4.344 32.224 9.05 64.408 13.718 96.552.442 7.442 4.546 16.01 12.832 16.896 7.806 1.528 13.718-4.708 19.672-8.57 23.576-18.022 47.994-34.878 71.328-53.222 8.81-5.794 7.282-19.714-1.61-24.662-30.412-23.132-66.458-41.034-104.516-46.062zM326.28 354.22c-7.602 2.736-11.586 10.298-16.172 16.374-17.862 26.43-31.66 56.04-37.936 87.418-2.976 9.696 6.478 20.074 16.374 17.982 33.39-4.506 66.82-9.01 100.09-14.322 12.23-.32 17.782-16.332 9.656-24.86-17.38-24.138-35.362-47.834-52.862-71.85-4.304-6.156-10.822-12.954-19.15-10.742zm362.468.08c-19.472 21.242-34.718 46.184-52.74 68.712-5.714 8.972-16.816 17.58-13.156 29.448 3.54 9.334 14.442 9.616 22.77 11.104 31.178 4.224 62.276 9.414 93.494 13.436 10.138 1.892 19.31-9.132 15.97-18.868-7.644-35.722-23.694-69.838-46.344-98.48-4.264-6.598-12.994-8.892-19.994-5.352zM282.672 547.604c-7.604 2.574-12.834 10.66-10.218 18.666 7.482 34.798 23.212 67.988 45.178 95.986 5.108 8.088 17.982 9.214 23.654 1.168 17.782-22.57 34.236-46.144 51.736-68.914 4.706-6.678 11.948-14.28 8.126-23.092-3.34-10.902-17.018-9.412-25.988-11.626-30.856-3.46-61.512-10.378-92.488-12.188zm422.168 5.028c-24.178 3.902-48.598 6.154-72.614 10.902-10.5 2.052-13.84 16.414-6.84 23.936 18.586 25.626 37.534 51.012 56.564 76.356 5.47 10.138 20.758 10.098 26.35.08 23.252-30.454 42.24-66.458 46.786-104.758-8.368-20.556-34.074-6.476-50.246-6.516zm-265.434 71.086c-23.936 16.372-46.546 34.556-70.16 51.372-6.316 5.07-15.488 10.098-15.046 19.43.724 8.168 8.448 12.834 14.282 17.42 26.752 18.948 57.044 33.43 89.148 40.35 9.976 3.38 20.638-6.638 18.424-16.736-4.626-33.55-9.132-67.142-14.442-100.572-.28-10.54-13.596-17.46-22.206-11.264zm129.016.562c-6.356 3.258-5.994 11.788-7.604 17.822-4.384 31.016-9.052 62.034-13.396 93.09-2.976 10.622 7.926 21.806 18.626 18.024 35.322-7.524 68.994-23.092 97.556-45.138 8.288-4.948 9.938-17.66 1.892-23.614-24.782-19.512-50.568-37.776-75.712-56.844-5.794-5.07-14.402-8.046-21.362-3.34z" />
  </SvgIcon>
);
import type { PlayerState, CommanderDamageMap } from '../types';
import type { MonarchAnim } from '@/game-manager/hooks/useMonarchTransition';

// ─── Local keyframes / constants used by migrated render blocks ────────────
// Phase 3 will sweep cross-component keyframes into a shared module. For now
// each block owns whatever it needs.
const tearFall = keyframes`
  0%   { transform: translateY(-12px) translateX(0px) scaleY(1);    opacity: 0; }
  8%   { opacity: 0.85; }
  40%  { transform: translateY(40%)  translateX(4px)  scaleY(1.1);  opacity: 0.75; }
  75%  { transform: translateY(80%)  translateX(-3px) scaleY(0.95); opacity: 0.4; }
  100% { transform: translateY(110%) translateX(1px)  scaleY(1);    opacity: 0; }
`;
const TEARS = [
  { left: '12%', delay: '0s',    dur: '2.9s' },
  { left: '28%', delay: '1.1s',  dur: '3.2s' },
  { left: '45%', delay: '0.4s',  dur: '2.6s' },
  { left: '60%', delay: '1.7s',  dur: '3.4s' },
  { left: '76%', delay: '0.7s',  dur: '2.8s' },
  { left: '88%', delay: '2.0s',  dur: '3.1s' },
];

/**
 * Presentational counterpart of PlayerPanel. All behavior hooks live in the
 * orchestrator (PlayerPanel.tsx); this component receives fully-computed props
 * and renders JSX. Wrapped in React.memo with a custom comparator so a life
 * change in one seat re-renders only that seat's card, not all four.
 *
 * Phase 2 migration in progress: render JSX is moving here from PlayerPanel one
 * logical block at a time. PlayerCard is not yet imported anywhere — PlayerPanel
 * still owns the real render. The card is being built in parallel; the wire-up
 * happens in Phase 4.
 *
 * Card-local UI state (qrOpen, countersOpen, eliminateTurnInput, etc.) lives
 * inside the card via useState — the orchestrator never reads it. Refs to
 * card-rendered DOM (cmdScrollRef) live here too. Derived values that follow a
 * pure function of props (showCrown, monarchAnimStr) are computed in render.
 */

// ─── Discriminated unions used by callbacks ────────────────────────────────
export type FocusedControl = {
  type: 'life' | 'poison' | 'energy' | 'experience' | 'commanderTax' | 'commanderDamage';
  sourceIdx?: number;
  isPartner?: boolean;
} | null;

export interface KillOpponent {
  name: string;
  idx: number;
}

// ─── Fluid size tokens (computed in orchestrator from remoteMode) ──────────
export interface SizeTokens {
  fsPlayerName: string;
  fsDeckName: string;
  fsPassBtn: string;
  fsHeaderIcon: string;
  fsSmallIcon: string;
  fsMenuTrigger: string;
  fsSectionLabel: string;
  fsSourceName: string;
  fsStatBadge: string;
  fsCounterLabel: string;
  fsCounterValue: string;
  fsCounterBtn: string;
  fsLifeBtn: string;
  fsKillPrompt: string;
  artHeight: string;
  cmdBtnWidth: string;
  cmdBtnHeight: string;
  valColWidth: string;
}

// ─── Position-derived rotation/placement values ────────────────────────────
export interface PositionTokens {
  ttRotate: string;
  ttHeaderPlacement: 'top' | 'bottom' | 'left' | 'right';
  snapshotPlacement: 'top' | 'bottom' | 'left' | 'right';
  ttSlotProps: { tooltip: { sx: { rotate: string } } };
  ttHeaderSlotProps: {
    tooltip: { sx: { rotate: string } };
    popper: { modifiers: { name: string; enabled: boolean }[] };
  };
}

// ─── Timer presentation (derived in orchestrator from elapsed/total) ───────
export interface TimerTokens {
  timerOff: boolean;
  timerProgress: number;
  isTimerExpired: boolean;
  timerColor: string;
  timerColorRgba: (alpha: number) => string;
  currentPlayerBorder?: string;
  currentPlayerShadow?: string;
}

// ─── Animation flags surfaced from extracted hooks ─────────────────────────
export interface AnimationFlags {
  /** Damage-flash counter (changes trigger flash). 0 = no flash. */
  damageFlash: number;
  /**
   * Monarch crown lifecycle from `useMonarchTransition`. The card derives
   * `showCrown` and the crown animation CSS from this value.
   */
  monarchAnim: MonarchAnim;
  monarchEnterIsTransfer: boolean;
  /** Citys-blessing render gate (visible includes exit animation tail). */
  cityBlessingVisible: boolean;
  cityBlessingExiting: boolean;
  /** XP +1 transient flash + ripple key. */
  xpFlashing: boolean;
  xpRippleKey: number;
}

// ─── Viewer/eye-icon presentation ──────────────────────────────────────────
export interface ViewerProps {
  isBeingViewedByAnyone: boolean;
  viewerTooltipText: string;
  viewerBannerVisible: boolean;
  /** Click handler for the eye icon — triggers banner ping in orchestrator. */
  onEyeIconClick: () => void;
}

// ─── Long-press hook surfaces (handlers + render key) ──────────────────────
// Signatures mirror `useLongPress` exactly so consumers can pass the bundle
// straight through without adapter shims.
export interface LongPressHandlers {
  lpKey: string | null;
  startLongPress: (key: string, onTrigger: () => void) => void;
  cancelLongPress: () => void;
  guardClick: (cb: () => void) => () => void;
}

// ─── Threat-source derivation (computed in orchestrator from cmd damage) ───
export interface ThreatSource {
  artUrl: string | undefined;
  cmdName: string;
  intensity: number;
  dmg: number;
}

// ─── Full prop surface ─────────────────────────────────────────────────────
export interface PlayerCardProps {
  // Identity / core state
  player: PlayerState;
  playerIdx: number;
  allPlayers: PlayerState[];
  commanderDamage: CommanderDamageMap;
  startingLife: number;
  activePlayerIdx?: number;

  // Mode flags
  remoteMode: boolean;
  seatCode?: string;
  remoteConnected: boolean;
  soundEnabled: boolean;
  highlightMode: boolean;
  isHighlighted: boolean;
  isCurrentPlayer: boolean;
  themeMode?: 'light' | 'dark';

  // Kill prompts (passed through from orchestrator)
  lifeKillOpponents?: KillOpponent[];
  poisonKillOpponents?: KillOpponent[];

  // Counter / state mutation handlers
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
  onLifeKillSelect?: (sourceIdx: number | null) => void;
  onPoisonKillSelect?: (sourceIdx: number | null) => void;
  onSwitchToPlayer?: (targetIdx: number) => void;
  onToggleTheme?: () => void;
  onToggleSound?: () => void;
  onOpenChat?: (playerName: string) => void;

  // Derived value bundles
  sizes: SizeTokens;
  position: PositionTokens;
  timer: TimerTokens;
  animations: AnimationFlags;
  viewer: ViewerProps;
  longPress: LongPressHandlers;

  // Other orchestrator-derived values
  threatSource: ThreatSource | null;
  computedLifeColor: string;
  lostRatio: number;
  crackAlpha: (from: number) => number;
  isWarning: boolean;

  // CMD damage source-snapshot renderer (orchestrator closure over allPlayers / cmd damage)
  renderSourceSnapshot: (src: PlayerState, srcIdx: number) => React.ReactNode;

  // Commander damage change wrapper (orchestrator memoizes; includes setLastCmdDmgSourceIdx)
  handleCmdDmgChange: (targetIdx: number, sourceIdx: number, isPartner: boolean, delta: number) => void;
}

// ─── Custom memo comparator ────────────────────────────────────────────────
// Strategy: rely on the orchestrator to pass stable references for arrays,
// objects, and handlers. Compare scalars by value, references by identity.
// Bundles (sizes/position/timer/animations/viewer/longPress) are expected to
// be stable references unless their contents actually change — the orchestrator
// will memoize each bundle so this comparator can rely on reference equality.
function arePlayerCardPropsEqual(prev: PlayerCardProps, next: PlayerCardProps): boolean {
  return (
    prev.player === next.player &&
    prev.allPlayers === next.allPlayers &&
    prev.commanderDamage === next.commanderDamage &&
    prev.playerIdx === next.playerIdx &&
    prev.startingLife === next.startingLife &&
    prev.activePlayerIdx === next.activePlayerIdx &&
    prev.remoteMode === next.remoteMode &&
    prev.seatCode === next.seatCode &&
    prev.remoteConnected === next.remoteConnected &&
    prev.soundEnabled === next.soundEnabled &&
    prev.highlightMode === next.highlightMode &&
    prev.isHighlighted === next.isHighlighted &&
    prev.isCurrentPlayer === next.isCurrentPlayer &&
    prev.themeMode === next.themeMode &&
    prev.lifeKillOpponents === next.lifeKillOpponents &&
    prev.poisonKillOpponents === next.poisonKillOpponents &&
    prev.sizes === next.sizes &&
    prev.position === next.position &&
    prev.timer === next.timer &&
    prev.animations === next.animations &&
    prev.viewer === next.viewer &&
    prev.longPress === next.longPress &&
    prev.threatSource === next.threatSource &&
    prev.computedLifeColor === next.computedLifeColor &&
    prev.lostRatio === next.lostRatio &&
    prev.crackAlpha === next.crackAlpha &&
    prev.isWarning === next.isWarning &&
    prev.renderSourceSnapshot === next.renderSourceSnapshot &&
    prev.handleCmdDmgChange === next.handleCmdDmgChange &&
    // handlers — identity check (orchestrator must memoize)
    prev.onLifeChange === next.onLifeChange &&
    prev.onPoisonChange === next.onPoisonChange &&
    prev.onCommanderTaxChange === next.onCommanderTaxChange &&
    prev.onEnergyChange === next.onEnergyChange &&
    prev.onExperienceChange === next.onExperienceChange &&
    prev.onToggleMonarch === next.onToggleMonarch &&
    prev.onToggleInitiative === next.onToggleInitiative &&
    prev.onToggleCitysBlessing === next.onToggleCitysBlessing &&
    prev.onCommanderDamageChange === next.onCommanderDamageChange &&
    prev.onEliminate === next.onEliminate &&
    prev.onUndoEliminate === next.onUndoEliminate &&
    prev.onPassTurn === next.onPassTurn &&
    prev.onLifeKillSelect === next.onLifeKillSelect &&
    prev.onPoisonKillSelect === next.onPoisonKillSelect &&
    prev.onSwitchToPlayer === next.onSwitchToPlayer &&
    prev.onToggleTheme === next.onToggleTheme &&
    prev.onToggleSound === next.onToggleSound &&
    prev.onOpenChat === next.onOpenChat
  );
}

function PlayerCardImpl(props: PlayerCardProps) {
  const {
    viewer, sizes, position, timer, animations, longPress,
    player, playerIdx, allPlayers, commanderDamage, computedLifeColor,
    isCurrentPlayer, highlightMode,
    seatCode, remoteConnected, remoteMode, soundEnabled, themeMode,
    lifeKillOpponents, onLifeKillSelect, poisonKillOpponents, onPoisonKillSelect,
    onLifeChange, onPoisonChange, onEnergyChange, onExperienceChange, onCommanderTaxChange,
    handleCmdDmgChange,
    onToggleMonarch, onToggleInitiative, onToggleCitysBlessing,
    onEliminate, onUndoEliminate, onPassTurn,
    onToggleSound, onToggleTheme, onOpenChat,
  } = props;
  const { lpKey, startLongPress, cancelLongPress, guardClick } = longPress;
  const isPoisoned = player.poison >= 10;

  // ─── Card-local UI state ────────────────────────────────────────────────
  // None of this state is read by the orchestrator or any sibling. Lifting it
  // would just add prop noise and break memoization. It stays here.
  const [eliminateTurnInput, setEliminateTurnInput] = useState('');
  const [showEliminateConfirm, setShowEliminateConfirm] = useState(false);
  const [stateMenuOpen, setStateMenuOpen] = useState(false);
  const [rulesOpenLabel, setRulesOpenLabel] = useState<string | null>(null);
  const toggleRules = (label: string) => setRulesOpenLabel(l => l === label ? null : label);

  // Auto-close the rules tooltip on next outside mousedown.
  useEffect(() => {
    if (!rulesOpenLabel) return;
    const close = () => setRulesOpenLabel(null);
    const id = setTimeout(() => document.addEventListener('mousedown', close), 0);
    return () => { clearTimeout(id); document.removeEventListener('mousedown', close); };
  }, [rulesOpenLabel]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [openSnapshotKey, setOpenSnapshotKey] = useState<string | null>(null);
  const [focusedControl, setFocusedControl] = useState<FocusedControl>(null);
  const [qrOpen, setQrOpen] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [countersOpen, setCountersOpen] = useState(true);
  const [cmdPreviewName, setCmdPreviewName] = useState<string | null>(null);
  const [cmdPreviewUrl, setCmdPreviewUrl] = useState<string | null>(null);
  const [cmdPreviewZoom, setCmdPreviewZoom] = useState(1);
  const [cmdPreviewBase, setCmdPreviewBase] = useState<{ w: number; h: number } | null>(null);
  const cmdScrollRef = useRef<HTMLDivElement>(null);

  // Resolve preview URL when name changes; reset zoom/base.
  // All inputs/outputs are card-local; no orchestrator hook reads cmdPreviewUrl.
  useEffect(() => {
    if (!cmdPreviewName) { setCmdPreviewUrl(null); setCmdPreviewZoom(1); setCmdPreviewBase(null); return; }
    setCmdPreviewUrl(null);
    setCmdPreviewZoom(1);
    setCmdPreviewBase(null);
    getCardImageByName(cmdPreviewName).then(url => setCmdPreviewUrl(url));
  }, [cmdPreviewName]);

  // Scroll to bottom when zoom changes so the card bottom (player name / mana cost)
  // stays in view.
  useEffect(() => {
    if (cmdPreviewZoom > 1 && cmdScrollRef.current) {
      cmdScrollRef.current.scrollTop = cmdScrollRef.current.scrollHeight;
    }
  }, [cmdPreviewZoom]);

  // Auto-close QR when remote player connects.
  useEffect(() => { if (remoteConnected && qrOpen) setQrOpen(false); }, [remoteConnected, qrOpen]);

  // ─── Derived from animations bundle (cheap, recompute every render) ─────
  // showCrown / monarchAnimStr were lifted as props in Phase 1; the card owns
  // them now because they're pure functions of `monarchAnim`.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { monarchAnim } = animations;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const showCrown = player.isMonarch || monarchAnim === 'exiting';

  // ─── XP keyframes (pure functions of player.experience) ─────────────────
  // These are derived from player.experience only — calling the shared hook
  // locally keeps invalidation tight and avoids threading 7 keyframe objects
  // through props.
  const xpGlowIntensity = player.experience > 0 ? Math.min(player.experience / 10, 1) : 0;
  const xpGlow = xpGlowIntensity > 0
    ? `0 0 ${4 + xpGlowIntensity * 12}px rgba(218,165,32,${(0.5 + xpGlowIntensity * 0.5).toFixed(2)}), 0 0 ${10 + xpGlowIntensity * 24}px rgba(218,165,32,${(0.2 + xpGlowIntensity * 0.3).toFixed(2)})`
    : undefined;
  const {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    xpShimmerAnim,
    xpFlashAnim,
    xpRippleAnim,
    xpLevelUpAnim,
    xpShimmerSweepAnim,
    xpEmberAnim,
    xpRuneGlowAnim,
  } = useXpKeyframes(player.experience, xpGlow, xpGlowIntensity);
  // monarchAnimStr is intentionally not derived here yet — it depends on the
  // crown keyframes which are migrated in Phase 3. The render block that needs
  // it will compute it locally when it lands.

  // ─── Render: outer container + per-block sections ──────────────────────
  // The outer container styling (warning border, timer-expired blink, poison
  // saturation, etc.) is migrated with the header/main blocks. For now the
  // card mounts a bare positioning shell so isolated render blocks have a
  // parent to anchor against.
  return (
    <Box sx={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      {/* ── Header ── */}
      <Box
        sx={{
        px: 1, py: 0.5, flexShrink: 0, filter: 'none', position: 'relative', zIndex: 3, display: 'flex', alignItems: 'center',
        background: isCurrentPlayer && highlightMode
          ? `linear-gradient(90deg, ${timer.timerColorRgba(0.3)} 0%, ${timer.timerColorRgba(0.7)} 50%, ${timer.timerColorRgba(0.3)} 100%)`
          : 'rgba(0,0,0,0.08)',
        transition: 'background-color 0.3s ease',
        ...(timer.isTimerExpired && highlightMode && {
          animation: 'headerBlink 0.5s step-end infinite',
          '@keyframes headerBlink': {
            '0%, 100%': { background: '#e9353540' },
            '50%': { background: 'rgba(0,0,0,0.08)' },
          },
        }),
      }}>
        {/* Left: commander art + tax */}
        <Stack direction="row" alignItems="center" spacing={0.75} sx={{ flexShrink: 0, zIndex: 1 }}>
          {player.commander.artCropUrl && (
            <Box component="img" src={player.commander.artCropUrl} alt={player.commander.name}
              onClick={(e) => { e.stopPropagation(); setCmdPreviewName(player.commander.name); }}
              sx={{ height: sizes.artHeight, width: 'auto', borderRadius: 0.5, flexShrink: 0, cursor: 'zoom-in' }} />
          )}
          {player.commanderTax > 0 && (
            <Tooltip title={`Tax: cast ${player.commanderTax}× (+${player.commanderTax * 2} generic mana)`} placement="bottom" arrow>
              <Stack direction="row" alignItems="center" spacing={0.25} sx={{ flexShrink: 0 }}>
                <Typography sx={{ fontSize: 11, fontWeight: 700, color: 'text.secondary', lineHeight: 1, userSelect: 'none' }}>+</Typography>
                <Box sx={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  background: 'radial-gradient(circle at 38% 35%, #d0d0d0, #7a7a7a)',
                  border: '1.5px solid #3a3a3a',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Typography sx={{ fontSize: 11, fontWeight: 800, color: '#111', lineHeight: 1, userSelect: 'none' }}>
                    {player.commanderTax * 2}
                  </Typography>
                </Box>
              </Stack>
            </Tooltip>
          )}
          {player.experience > 0 && (
            <Box sx={{
              position: 'relative', flexShrink: 0, width: 34, height: 34,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'visible',
              ...(xpRuneGlowAnim && { animation: `${xpRuneGlowAnim} 2.5s ease-in-out infinite${animations.xpFlashing ? `, ${xpLevelUpAnim} 0.7s ease-out` : ''}` }),
            }}>
              {/* Ember particles drifting upward */}
              {xpEmberAnim && [0, 1, 2, 3].map((i) => (
                <Box key={i} sx={{
                  position: 'absolute',
                  width: i % 2 === 0 ? 3 : 2, height: i % 2 === 0 ? 3 : 2,
                  borderRadius: '50%',
                  bgcolor: i % 2 === 0 ? '#FFD700' : '#FFA040',
                  bottom: '55%',
                  left: `${15 + i * 20}%`,
                  pointerEvents: 'none',
                  animation: `${xpEmberAnim} ${1.1 + i * 0.35}s ease-out ${i * 0.38}s infinite`,
                }} />
              ))}
              {/* Diamond shape with shimmer sweep inside */}
              <Box sx={{
                position: 'absolute',
                width: 26, height: 26,
                transform: 'rotate(45deg)',
                background: 'linear-gradient(135deg, #FFD700, #8B6914)',
                border: '1.5px solid rgba(255,215,0,0.85)',
                boxShadow: '0 2px 8px rgba(218,165,32,0.55)',
                overflow: 'hidden',
                ...(animations.xpFlashing && { animation: `${xpFlashAnim} 0.7s ease-out` }),
              }}>
                {xpShimmerSweepAnim && (
                  <Box sx={{
                    position: 'absolute', top: '-20%', left: 0,
                    width: '28%', height: '140%',
                    background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.72), transparent)',
                    pointerEvents: 'none',
                    animation: `${xpShimmerSweepAnim} 7.5s linear infinite`,
                  }} />
                )}
              </Box>
              {/* Ripple — also diamond */}
              <Box key={animations.xpRippleKey} sx={{
                position: 'absolute', top: '50%', left: '50%',
                width: 26, height: 26,
                border: '2px solid rgba(255,215,0,0.8)',
                pointerEvents: 'none',
                animation: `${xpRippleAnim} 0.7s ease-out forwards`,
              }} />
              {/* Text — unrotated, on top */}
              <Stack direction="column" alignItems="center" spacing={0} sx={{ position: 'relative' }}>
                <Box component="img" src={XP_ICON_SRC} alt="XP" sx={{ width: 10, height: 10, objectFit: 'contain', mixBlendMode: 'multiply' }} />
                <Typography sx={{ fontSize: 9, fontWeight: 900, color: '#111', lineHeight: 1, userSelect: 'none' }}>{player.experience}</Typography>
              </Stack>
            </Box>
          )}
          {/* Pass Turn */}
          {isCurrentPlayer && onPassTurn && (
            <Box
              onClick={onPassTurn}
              sx={{
                px: 1.5, py: 0.5,
                borderRadius: 1.5,
                border: '2px solid',
                borderColor: 'primary.main',
                cursor: 'pointer',
                userSelect: 'none',
              }}
            >
              <Typography sx={{ fontSize: sizes.fsPassBtn, fontWeight: 700, color: 'primary.main', whiteSpace: 'nowrap', lineHeight: 1.4 }}>
                PASS
              </Typography>
            </Box>
          )}
        </Stack>

        {/* Center: absolutely positioned so it's always centered relative to the full header */}
        <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: 'max-content', maxWidth: 'calc(100% - 96px)', textAlign: 'center', pointerEvents: 'none' }}>
          <Typography
            noWrap
            onClick={seatCode ? () => setQrOpen(true) : undefined}
            sx={{ fontWeight: 700, fontSize: sizes.fsPlayerName, lineHeight: 1.2, pointerEvents: seatCode ? 'auto' : 'none', cursor: seatCode ? 'pointer' : 'default' }}
          >
            {player.playerName}
          </Typography>
          <Typography noWrap sx={{ fontSize: sizes.fsDeckName, lineHeight: 1.2, color: 'text.secondary', pointerEvents: 'none' }}>
            {player.deckName} · {player.commander.name}{player.partner ? ` / ${player.partner.name}` : ''}
          </Typography>
        </Box>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 'auto', zIndex: 1 }}>
            {/* Being viewed indicator */}
            {viewer.isBeingViewedByAnyone && (
              <VisibilityIcon onClick={(e) => { e.stopPropagation(); viewer.onEyeIconClick(); }} sx={{ fontSize: sizes.fsHeaderIcon, color: 'primary.main', cursor: 'pointer', animation: 'eyePulse 1.5s ease-in-out infinite', '@keyframes eyePulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.4 } } }} />
            )}
            {/* Active game state indicators */}
            <>
              {player.isMonarch && (
                <Tooltip open={rulesOpenLabel === 'h:Monarch'} onClose={() => setRulesOpenLabel(null)} title={<Typography sx={{ fontSize: 12, maxWidth: 240 }}>Draw a card at the beginning of your end step. Whenever a creature deals combat damage to you, its controller becomes the monarch.</Typography>} placement={position.ttHeaderPlacement} arrow disableHoverListener disableFocusListener disableTouchListener slotProps={position.ttHeaderSlotProps}>
                  <CrownIcon
                    onClick={guardClick(() => toggleRules('h:Monarch'))}
                    onPointerDown={(e) => { e.stopPropagation(); startLongPress('off-monarch', () => onToggleMonarch(playerIdx)); }}
                    onPointerUp={cancelLongPress}
                    onPointerLeave={cancelLongPress}
                    onPointerCancel={cancelLongPress}
                    sx={{ fontSize: sizes.fsHeaderIcon, color: '#DAA520', cursor: 'pointer', animation: 'crownShimmer 2s ease-in-out infinite', '@keyframes crownShimmer': { '0%, 100%': { filter: 'drop-shadow(0 0 2px #DAA520) brightness(1)' }, '50%': { filter: 'drop-shadow(0 0 7px #FFD700) brightness(1.5)' } } }}
                  />
                </Tooltip>
              )}
              {!player.isMonarch && allPlayers.some(p => p.isMonarch) && (
                <Tooltip open={rulesOpenLabel === 'h:Monarch'} onClose={() => setRulesOpenLabel(null)} title={<Typography sx={{ fontSize: 12, maxWidth: 240 }}>Draw a card at the beginning of your end step. Whenever a creature deals combat damage to you, its controller becomes the monarch.</Typography>} placement={position.ttHeaderPlacement} arrow disableHoverListener disableFocusListener disableTouchListener slotProps={position.ttHeaderSlotProps}>
                  <CrownIcon
                    onClick={guardClick(() => toggleRules('h:Monarch'))}
                    onPointerDown={(e) => { e.stopPropagation(); startLongPress('take-monarch', () => onToggleMonarch(playerIdx)); }}
                    onPointerUp={cancelLongPress}
                    onPointerLeave={cancelLongPress}
                    onPointerCancel={cancelLongPress}
                    sx={{ fontSize: sizes.fsHeaderIcon, color: 'text.disabled', cursor: 'pointer', opacity: 0.4 }}
                  />
                </Tooltip>
              )}
              {player.hasInitiative && (
                <Tooltip open={rulesOpenLabel === 'h:Initiative'} onClose={() => setRulesOpenLabel(null)} title={<Typography sx={{ fontSize: 12, maxWidth: 240 }}>When you take the initiative, venture into the Undercity. At the beginning of your upkeep, venture into the Undercity. Whenever a creature deals combat damage to you, its controller takes the initiative.</Typography>} placement={position.ttHeaderPlacement} arrow disableHoverListener disableFocusListener disableTouchListener slotProps={position.ttHeaderSlotProps}>
                  <InitiativeIcon
                    onClick={guardClick(() => toggleRules('h:Initiative'))}
                    onPointerDown={(e) => { e.stopPropagation(); startLongPress('off-initiative', () => onToggleInitiative(playerIdx)); }}
                    onPointerUp={cancelLongPress}
                    onPointerLeave={cancelLongPress}
                    onPointerCancel={cancelLongPress}
                    sx={{ fontSize: sizes.fsHeaderIcon, color: '#4FC3F7', cursor: 'pointer' }}
                  />
                </Tooltip>
              )}
              {!player.hasInitiative && allPlayers.some(p => p.hasInitiative) && (
                <Tooltip open={rulesOpenLabel === 'h:Initiative'} onClose={() => setRulesOpenLabel(null)} title={<Typography sx={{ fontSize: 12, maxWidth: 240 }}>When you take the initiative, venture into the Undercity. At the beginning of your upkeep, venture into the Undercity. Whenever a creature deals combat damage to you, its controller takes the initiative.</Typography>} placement={position.ttHeaderPlacement} arrow disableHoverListener disableFocusListener disableTouchListener slotProps={position.ttHeaderSlotProps}>
                  <InitiativeIcon
                    onClick={guardClick(() => toggleRules('h:Initiative'))}
                    onPointerDown={(e) => { e.stopPropagation(); startLongPress('take-initiative', () => onToggleInitiative(playerIdx)); }}
                    onPointerUp={cancelLongPress}
                    onPointerLeave={cancelLongPress}
                    onPointerCancel={cancelLongPress}
                    sx={{ fontSize: sizes.fsHeaderIcon, color: 'text.disabled', cursor: 'pointer', opacity: 0.4 }}
                  />
                </Tooltip>
              )}
              {player.hasCitysBlessing && (
                <Tooltip open={rulesOpenLabel === "h:City's Blessing"} onClose={() => setRulesOpenLabel(null)} title={<Typography sx={{ fontSize: 12, maxWidth: 240 }}>You have the city&apos;s blessing for the rest of the game. Gained when you control ten or more permanents — it persists even if that number later drops below ten.</Typography>} placement={position.ttHeaderPlacement} arrow disableHoverListener disableFocusListener disableTouchListener slotProps={position.ttHeaderSlotProps}>
                  <CityIcon
                    active
                    onClick={guardClick(() => toggleRules("h:City's Blessing"))}
                    onPointerDown={(e) => { e.stopPropagation(); startLongPress("off-citys-blessing", () => onToggleCitysBlessing(playerIdx)); }}
                    onPointerUp={cancelLongPress}
                    onPointerLeave={cancelLongPress}
                    onPointerCancel={cancelLongPress}
                    sx={{ fontSize: sizes.fsHeaderIcon, cursor: 'pointer' }}
                  />
                </Tooltip>
              )}
              {/* Remote connected indicator */}
              {remoteConnected && (
                <SmartphoneIcon sx={{ fontSize: sizes.fsSmallIcon, color: 'success.main', animation: 'remotePulse 2s ease-in-out infinite', '@keyframes remotePulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } }, flexShrink: 0 }} />
              )}
              {/* Submenu trigger */}
              <IconButton size="small" onClick={() => setStateMenuOpen(o => !o)} onPointerDown={(e) => e.stopPropagation()} sx={{ p: 0.5, color: stateMenuOpen ? 'primary.main' : 'text.secondary' }}>
                <AddIcon sx={{ fontSize: sizes.fsMenuTrigger, transition: 'transform 0.2s ease', transform: stateMenuOpen ? 'rotate(45deg)' : 'none' }} />
              </IconButton>
            </>
          </Stack>
      </Box>

      {/* ── Faded background art ── */}
      {player.commander.artCropUrl && (
        <Box
          component="img"
          src={player.commander.artCropUrl}
          alt=""
          sx={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover', objectPosition: 'center',
            opacity: 0.12, zIndex: 0, pointerEvents: 'none',
          }}
        />
      )}

      {/* ── Concede confirm overlay ── */}
      {showEliminateConfirm && (
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, pointerEvents: 'none', bgcolor: 'rgba(218,165,32,0.12)' }}>
          <Typography sx={{ fontWeight: 900, color: '#DAA520', fontSize: 22, letterSpacing: 2, textShadow: '0 2px 8px rgba(0,0,0,0.5)', transform: 'rotate(-10deg)' }}>
            CONCEDE?
          </Typography>
        </Box>
      )}

      {/* ── Eliminated overlay ── */}
      {player.isEliminated && (
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 11, pointerEvents: 'none', bgcolor: player.isConceded && !isPoisoned ? 'rgba(218,165,32,0.12)' : 'transparent', overflow: 'hidden' }}>
          {player.isConceded && !isPoisoned && TEARS.map((t, i) => (
            <Box key={i} sx={{
              position: 'absolute', top: 0, left: t.left,
              width: 7, height: 11,
              borderRadius: '50% 50% 50% 50% / 70% 70% 30% 30%',
              bgcolor: 'rgba(120, 190, 255, 0.8)',
              boxShadow: '0 0 5px rgba(120,190,255,0.5)',
              animation: `${tearFall} ${t.dur} ${t.delay} ease-in infinite`,
            }} />
          ))}
          <Typography
            sx={{ fontWeight: 900, letterSpacing: 4, fontSize: 48, transform: 'rotate(-15deg)', color: isPoisoned ? undefined : player.isConceded ? '#DAA520' : 'error.main' }}
            style={isPoisoned ? { color: '#00c853', WebkitTextFillColor: '#00c853', WebkitTextStroke: '2px black' } : player.isConceded ? { WebkitTextStroke: '2px black' } : undefined}
          >
            {isPoisoned ? 'POISONED' : player.isConceded ? 'CONCEDED' : 'ELIMINATED'}
          </Typography>
        </Box>
      )}

      {/* ── Life kill attribution overlay ── */}
      {lifeKillOpponents && onLifeKillSelect && (
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, bgcolor: 'rgba(0,0,0,0.72)', px: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: sizes.fsKillPrompt, color: '#fff', mb: 0.5, textAlign: 'center' }}>
            Who brought {player.playerName} to 0?
          </Typography>
          {lifeKillOpponents.map((opp) => (
            <Button key={opp.idx} variant="outlined" fullWidth onClick={() => onLifeKillSelect(opp.idx)}
              sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.5)', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
              {opp.name}
            </Button>
          ))}
          <Button onClick={() => onLifeKillSelect(null)} sx={{ color: 'rgba(255,255,255,0.5)', fontSize: sizes.fsKillPrompt, mt: 0.5 }}>
            Skip
          </Button>
        </Box>
      )}

      {/* ── Poison kill attribution overlay ── */}
      {poisonKillOpponents && onPoisonKillSelect && (
        <Box sx={{ position: 'absolute', inset: 0, zIndex: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1, bgcolor: 'rgba(0,40,0,0.78)', px: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: sizes.fsKillPrompt, color: '#7fff7f', mb: 0.5, textAlign: 'center' }}>
            Who poisoned {player.playerName}?
          </Typography>
          {poisonKillOpponents.map((opp) => (
            <Button key={opp.idx} variant="outlined" fullWidth onClick={() => onPoisonKillSelect(opp.idx)}
              sx={{ color: '#7fff7f', borderColor: 'rgba(100,255,100,0.4)', '&:hover': { borderColor: '#7fff7f', bgcolor: 'rgba(100,255,100,0.1)' } }}>
              {opp.name}
            </Button>
          ))}
          <Button onClick={() => onPoisonKillSelect(null)} sx={{ color: 'rgba(100,255,100,0.4)', fontSize: sizes.fsKillPrompt, mt: 0.5 }}>
            Skip
          </Button>
        </Box>
      )}

      {/* ── Game state submenu ── */}
      {stateMenuOpen && (
        <Box
          sx={{
            position: 'absolute', inset: 0, zIndex: 20,
            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(20,12,6,0.93)' : 'rgba(255,248,240,0.95)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start',
            overflowY: 'auto', py: 2, gap: 0,
            animation: 'stateMenuFadeIn 0.15s ease-out both',
            '@keyframes stateMenuFadeIn': { from: { opacity: 0 }, to: { opacity: 1 } },
          }}
          onClick={() => { setStateMenuOpen(false); setShowEliminateConfirm(false); }}
        >
          <Box
            sx={{
              width: '90%', maxWidth: 220, maxHeight: '80%',
              bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1E1510' : '#FFFAF5',
              border: (theme) => `1px solid ${theme.palette.divider}`,
              borderRadius: 2, '& .MuiTouchRipple-root': { borderRadius: 2 },
              overflowY: 'auto', overflowX: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {([
              { label: 'Monarch', icon: <CrownIcon sx={{ fontSize: 18, color: player.isMonarch ? '#DAA520' : 'inherit' }} />, active: player.isMonarch, color: '#DAA520', toggle: () => { onToggleMonarch(playerIdx); setStateMenuOpen(false); }, rulesText: 'Draw a card at the beginning of your end step. Whenever a creature deals combat damage to you, its controller becomes the monarch.' },
              { label: 'Initiative', icon: <InitiativeIcon sx={{ fontSize: 18 }} />, active: player.hasInitiative, color: '#4FC3F7', toggle: () => { onToggleInitiative(playerIdx); setStateMenuOpen(false); }, rulesText: "When you take the initiative, venture into the Undercity. At the beginning of your upkeep, venture into the Undercity. Whenever a creature deals combat damage to you, its controller takes the initiative." },
              { label: "City's Blessing", icon: <CityIcon active={player.hasCitysBlessing} sx={{ fontSize: 18 }} />, active: player.hasCitysBlessing, color: '#7851A9', toggle: () => { onToggleCitysBlessing(playerIdx); setStateMenuOpen(false); }, rulesText: "You have the city&apos;s blessing for the rest of the game. Gained when you control ten or more permanents — it persists even if that number later drops below ten." },
            ] as { label: string; icon: React.ReactNode; active: boolean; color: string; toggle: () => void; rulesText: string }[]).map(({ label, icon, active, color, toggle, rulesText }) => (
              <Box key={label} onClick={toggle} sx={{
                display: 'flex', alignItems: 'center', gap: 1.25,
                px: 1.5, py: 1,
                cursor: 'pointer',
                color: active ? color : 'text.disabled',
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
                '&:hover': { bgcolor: 'action.hover' },
                transition: 'background-color 0.15s ease',
              }}>
                {icon}
                <Typography sx={{ fontSize: 13, fontWeight: active ? 700 : 400, lineHeight: 1 }}>{label}</Typography>
                <Tooltip
                  open={rulesOpenLabel === `m:${label}`}
                  onClose={() => setRulesOpenLabel(null)}
                  title={<Typography sx={{ fontSize: 12, maxWidth: 240 }}>{rulesText}</Typography>}
                  placement="left"
                  arrow
                  disableHoverListener
                  disableFocusListener
                  disableTouchListener
                  slotProps={{ tooltip: { sx: { rotate: position.ttRotate } } }}
                >
                  <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); toggleRules(`m:${label}`); }}
                    sx={{ p: 0.25, ml: 'auto', color: rulesOpenLabel === `m:${label}` ? 'primary.main' : 'text.disabled' }}
                  >
                    <InfoOutlinedIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Tooltip>
                {active && <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: color, flexShrink: 0 }} />}
              </Box>
            ))}
            {/* Eliminate row */}
            {player.isEliminated ? (
              <Box onClick={() => { onUndoEliminate(playerIdx); setStateMenuOpen(false); }} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 1.5, py: 1, cursor: 'pointer', color: 'error.main', borderTop: (theme) => `1px solid ${theme.palette.divider}`, '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.15s ease' }}>
                <ElimIcon sx={{ fontSize: 18 }} />
                <Typography sx={{ fontSize: 13, fontWeight: 700, lineHeight: 1 }}>Undo Concede</Typography>
              </Box>
            ) : showEliminateConfirm ? (
              <Stack spacing={0.75} sx={{ px: 1.5, py: 1, bgcolor: 'rgba(218,165,32,0.12)', borderTop: (theme) => `1px solid ${theme.palette.divider}` }}>
                <Typography sx={{ fontSize: 12, fontWeight: 600, color: '#DAA520', lineHeight: 1.3 }}>Are you sure you want to quit?</Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <TextField size="small" label="Turn #" type="number" value={eliminateTurnInput}
                    onChange={(e) => setEliminateTurnInput(e.target.value)}
                    slotProps={{ htmlInput: { min: 1 } }} sx={{ width: 72 }} />
                  <Button size="small" variant="contained"
                    onClick={() => { onEliminate(playerIdx); setShowEliminateConfirm(false); setEliminateTurnInput(''); setStateMenuOpen(false); }}
                    sx={{ fontSize: 9, py: 0, px: 0.5, minWidth: 0, bgcolor: '#DAA520', '&:hover': { bgcolor: '#c49a18' } }}>✓</Button>
                  <Button size="small" variant="outlined"
                    onClick={() => setShowEliminateConfirm(false)}
                    sx={{ fontSize: 9, py: 0, px: 0.5, minWidth: 0, borderColor: '#DAA520', color: '#DAA520' }}>✕</Button>
                </Stack>
              </Stack>
            ) : (
              <Box onClick={() => setShowEliminateConfirm(true)} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 1.5, py: 1, cursor: 'pointer', color: 'text.disabled', borderTop: (theme) => `1px solid ${theme.palette.divider}`, '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.15s ease' }}>
                <ElimIcon sx={{ fontSize: 18 }} />
                <Typography sx={{ fontSize: 13, lineHeight: 1 }}>Concede</Typography>
              </Box>
            )}
            {/* Seat code row */}
            {seatCode && (
              <Box
                onClick={(e) => { e.stopPropagation(); setQrOpen(true); setStateMenuOpen(false); }}
                sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 1.5, py: 1, cursor: 'pointer', borderTop: (theme) => `1px solid ${theme.palette.divider}`, color: 'text.secondary', '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.15s ease' }}
              >
                <Typography sx={{ fontSize: 12, fontFamily: 'monospace', letterSpacing: 1.5, fontWeight: 700, flex: 1 }}>
                  {seatCode}
                </Typography>
                <QrCodeIcon sx={{ fontSize: 16 }} />
              </Box>
            )}
            {/* Rules Guru chat — remote only */}
            {remoteMode && onOpenChat && (
              <Box
                onClick={(e) => { e.stopPropagation(); onOpenChat(player.playerName); setStateMenuOpen(false); }}
                sx={{ display: 'flex', alignItems: 'center', gap: 1.25, px: 1.5, py: 1, cursor: 'pointer', borderTop: (theme) => `1px solid ${theme.palette.divider}`, color: 'primary.main', '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.15s ease' }}
              >
                <ChatIcon sx={{ fontSize: 18 }} />
                <Typography sx={{ fontSize: 13, lineHeight: 1 }}>Ask Rules</Typography>
              </Box>
            )}
            {/* Remote-only: sound + theme toggles */}
            {remoteMode && (
              <Box sx={{ display: 'flex', borderTop: (theme) => `1px solid ${theme.palette.divider}` }}>
                <Box onClick={(e) => { e.stopPropagation(); onToggleSound?.(); setStateMenuOpen(false); }} sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75, py: 1, cursor: 'pointer', color: soundEnabled ? 'primary.main' : 'text.disabled', '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.15s ease' }}>
                  {soundEnabled ? <VolumeUpIcon sx={{ fontSize: 18 }} /> : <VolumeOffIcon sx={{ fontSize: 18 }} />}
                  <Typography sx={{ fontSize: 13, lineHeight: 1 }}>Sound</Typography>
                </Box>
                {onToggleTheme && (
                  <Box onClick={(e) => { e.stopPropagation(); onToggleTheme(); setStateMenuOpen(false); }} sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75, py: 1, cursor: 'pointer', color: 'text.secondary', borderLeft: (theme) => `1px solid ${theme.palette.divider}`, '&:hover': { bgcolor: 'action.hover' }, transition: 'background-color 0.15s ease' }}>
                    {themeMode === 'light' ? <Brightness4Icon sx={{ fontSize: 18 }} /> : <Brightness7Icon sx={{ fontSize: 18 }} />}
                    <Typography sx={{ fontSize: 13, lineHeight: 1 }}>{themeMode === 'light' ? 'Dark' : 'Light'}</Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>
          <Typography variant="caption" sx={{ color: 'text.disabled', mt: 1.5 }}>tap outside to close</Typography>
        </Box>
      )}

      {/* ── Viewer notification banner ── */}
      <Box sx={{
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 12,
        background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main}00 0%, ${theme.palette.primary.main}aa 44%, ${theme.palette.primary.main}ff 50%, ${theme.palette.primary.main}aa 56%, ${theme.palette.primary.main}00 100%)`,
        color: '#fff',
        px: 1, py: 0.4,
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5, textAlign: 'center',
        pointerEvents: 'none',
        opacity: viewer.viewerBannerVisible ? 1 : 0,
        transition: viewer.viewerBannerVisible ? 'opacity 0.2s ease' : 'opacity 0.6s ease',
      }}>
        <VisibilityIcon sx={{ fontSize: 13 }} />
        <Typography sx={{ fontSize: 19, fontWeight: 600, lineHeight: 1.3 }}>{viewer.viewerTooltipText}</Typography>
      </Box>

      {/* ── Focused control modal — enlarged single counter/damage control ── */}
      {(() => {
        if (!focusedControl) return null;
        const fc = focusedControl;
        let label = '';
        let value = 0;
        let onDec: () => void = () => {};
        let onInc: () => void = () => {};
        let onDec5: (() => void) | undefined;
        let onInc5: (() => void) | undefined;
        let valueColor: string = 'text.primary';
        if (fc.type === 'life') {
          label = 'Life Total';
          value = player.life;
          onDec = () => onLifeChange(playerIdx, -1);
          onInc = () => onLifeChange(playerIdx, 1);
          onDec5 = () => onLifeChange(playerIdx, -5);
          onInc5 = () => onLifeChange(playerIdx, 5);
          valueColor = computedLifeColor || 'primary.main';
        } else if (fc.type === 'poison') {
          label = 'Poison';
          value = player.poison;
          onDec = () => onPoisonChange(playerIdx, -1);
          onInc = () => onPoisonChange(playerIdx, 1);
          onDec5 = () => onPoisonChange(playerIdx, -5);
          onInc5 = () => onPoisonChange(playerIdx, 5);
          valueColor = player.poison >= 10 ? 'error.main' : player.poison > 0 ? 'warning.main' : 'text.disabled';
        } else if (fc.type === 'energy') {
          label = 'Energy';
          value = player.energy;
          onDec = () => onEnergyChange(playerIdx, -1);
          onInc = () => onEnergyChange(playerIdx, 1);
          onDec5 = () => onEnergyChange(playerIdx, -5);
          onInc5 = () => onEnergyChange(playerIdx, 5);
          valueColor = player.energy > 0 ? 'primary.main' : 'text.disabled';
        } else if (fc.type === 'experience') {
          label = 'XP';
          value = player.experience;
          onDec = () => onExperienceChange(playerIdx, -1);
          onInc = () => onExperienceChange(playerIdx, 1);
          onDec5 = () => onExperienceChange(playerIdx, -5);
          onInc5 = () => onExperienceChange(playerIdx, 5);
          valueColor = player.experience > 0 ? 'primary.main' : 'text.disabled';
        } else if (fc.type === 'commanderTax') {
          label = 'Tax';
          value = player.commanderTax;
          onDec = () => onCommanderTaxChange(playerIdx, -1);
          onInc = () => onCommanderTaxChange(playerIdx, 1);
          onDec5 = () => onCommanderTaxChange(playerIdx, -5);
          onInc5 = () => onCommanderTaxChange(playerIdx, 5);
          valueColor = player.commanderTax > 0 ? 'warning.main' : 'text.disabled';
        } else if (fc.type === 'commanderDamage' && fc.sourceIdx !== undefined) {
          const src = allPlayers[fc.sourceIdx];
          const dmg = commanderDamage[playerIdx]?.[fc.sourceIdx] ?? [0, 0];
          const isPartner = fc.isPartner ?? false;
          const srcName = isPartner ? (src?.partner?.name ?? 'Partner') : (src?.commander?.name ?? src?.playerName ?? `Player ${fc.sourceIdx + 1}`);
          label = `CMD Dmg — ${srcName}`;
          value = isPartner ? dmg[1] : dmg[0];
          onDec = () => handleCmdDmgChange(playerIdx, fc.sourceIdx!, isPartner, -1);
          onInc = () => handleCmdDmgChange(playerIdx, fc.sourceIdx!, isPartner, 1);
          onDec5 = () => handleCmdDmgChange(playerIdx, fc.sourceIdx!, isPartner, -5);
          onInc5 = () => handleCmdDmgChange(playerIdx, fc.sourceIdx!, isPartner, 5);
          valueColor = value >= 21 ? 'error.main' : 'text.primary';
        }
        return (
          <ControlFocusModal
            open
            onClose={() => setFocusedControl(null)}
            label={label}
            value={value}
            color={valueColor}
            onDec={onDec}
            onInc={onInc}
            onDec5={onDec5}
            onInc5={onInc5}
          />
        );
      })()}

      {/* ── Commander card preview overlay ── */}
      {cmdPreviewName && (
        <Box
          onClick={() => { setCmdPreviewName(null); setCmdPreviewZoom(1); setCmdPreviewBase(null); }}
          sx={{ position: 'absolute', inset: 0, zIndex: 35, bgcolor: 'rgba(0,0,0,0.88)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}
        >
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); setCmdPreviewName(null); setCmdPreviewZoom(1); setCmdPreviewBase(null); }}
            sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1, color: 'rgba(255,255,255,0.85)', bgcolor: 'rgba(0,0,0,0.5)', '&:hover': { bgcolor: 'rgba(0,0,0,0.75)' } }}
          >
            <CloseIcon sx={{ fontSize: 28 }} />
          </IconButton>
          {cmdPreviewUrl ? (
            cmdPreviewZoom > 1 ? (
              <Box
                ref={cmdScrollRef}
                onClick={() => { setCmdPreviewName(null); setCmdPreviewZoom(1); setCmdPreviewBase(null); }}
                sx={{ position: 'absolute', inset: 8, overflow: 'auto', cursor: 'zoom-out', background: 'transparent !important' }}
              >
                <Box sx={{ minWidth: '100%', minHeight: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent !important' }}>
                  <Box
                    component="img"
                    src={cmdPreviewUrl}
                    alt={cmdPreviewName ?? ''}
                    draggable={false}
                    onClick={(e) => { e.stopPropagation(); setCmdPreviewZoom(1); }}
                    sx={{ display: 'block', width: cmdPreviewBase ? cmdPreviewBase.w * cmdPreviewZoom : 'auto', height: 'auto', borderRadius: '4.7%', userSelect: 'none', flexShrink: 0 }}
                  />
                </Box>
              </Box>
            ) : (
              <Box
                component="img"
                src={cmdPreviewUrl}
                alt={cmdPreviewName ?? ''}
                draggable={false}
                onLoad={(e: React.SyntheticEvent<HTMLImageElement>) => setCmdPreviewBase({ w: e.currentTarget.clientWidth, h: e.currentTarget.clientHeight })}
                onClick={(e) => { e.stopPropagation(); setCmdPreviewZoom(2.5); }}
                sx={{ maxHeight: '88%', maxWidth: '88%', borderRadius: '4.7%', display: 'block', cursor: 'zoom-in', userSelect: 'none' }}
              />
            )
          ) : (
            <CircularProgress size={36} thickness={4} sx={{ color: 'rgba(255,255,255,0.45)' }} />
          )}
        </Box>
      )}

      {/* ── QR overlay — in-panel, does not take over the board ── */}
      {seatCode && qrOpen && (
        <Box
          onClick={() => { navigator.clipboard?.writeText(seatCode).catch(() => {}); setQrOpen(false); }}
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 30,
            bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(20,12,6,0.93)' : 'rgba(255,248,240,0.95)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1.5,
            cursor: 'pointer',
          }}
        >
          <Box sx={{ p: 1, bgcolor: '#fff', borderRadius: 1 }}>
            <QRCodeSVG
              value={`${typeof window !== 'undefined' ? window.location.origin : ''}${ASSET_BASE}/game-manager/remote/?code=${seatCode}`}
              size={140}
            />
          </Box>
          <Typography sx={{ fontFamily: 'monospace', fontSize: 15, letterSpacing: 3, fontWeight: 700 }}>
            {seatCode}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            tap to copy &amp; close
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export const PlayerCard = memo(PlayerCardImpl, arePlayerCardPropsEqual);
