'use client';

/**
 * TeamPanel — the 2HG team view (one panel per team).
 *
 * In Two-Headed Giant the two teammates share one life total and one poison
 * total, so a team is presented as a SINGLE panel. The board renders one panel
 * per team in the left and right columns and rotates each 90deg / -90deg so it
 * faces its own long side of the table (the tablet lies flat between the two
 * teams). The panel is therefore laid out in LANDSCAPE (a horizontal row) with
 * the shared life centered, so it reads correctly after either rotation:
 *
 *   [ pilots + commander tax ] [ shared LIFE + poison ] [ commander damage ]
 *
 * It reads the real 4-seat GameManagerState (life/poison are already mirrored
 * across teammates by reconcileTeams) and routes every mutation through the
 * normal handlers, targeting the team's primary seat so reconcileTeams keeps
 * both heads in sync. Standard games never use this component.
 */
import { useState, useEffect, useRef, useMemo } from 'react';
import { Box, Stack, Typography, IconButton, TextField, Menu, MenuItem } from '@mui/material';
import InitiativeIcon from '@mui/icons-material/Castle';
import CityIcon from '@mui/icons-material/LocationCity';
import ElimIcon from '@mui/icons-material/PersonOff';
import ReplayIcon from '@mui/icons-material/Replay';
import SettingsIcon from '@mui/icons-material/Settings';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import { QRCodeSVG } from 'qrcode.react';
import { ASSET_BASE, remoteQrOrigin } from '@/lib/api';
import { CommanderArt } from './CommanderArt';
import { useCommanderPreview } from './useCommanderPreview';
import { useBlessingAndSound } from '@/game-manager/hooks/useBlessingAndSound';
import { computeThreatSource } from '@/game-manager/threatSource';
import { ThreatNames } from './ThreatNames';
import { PoisonOverlay } from './PoisonOverlay';
import { EliminatedOverlay } from './EliminatedOverlay';
import { LifeCracks } from './LifeCracks';
import { CityBlessing } from './CityBlessing';
import { InitiativeTorch } from './InitiativeTorch';
import { CrownIcon, MonarchCrown, monarchCrownAnim } from './MonarchCrown';
import { LifeTotal } from './LifeTotal';
import { useTimerTokens, TIMER_EXPIRED_BORDER_BLINK, TIMER_EXPIRED_HEADER_BLINK } from '@/game-manager/hooks/useTimerTokens';
import { StepperControl, StepperOverlayHost, type StepperSize } from './StepperControl';
import { useXpKeyframes } from './PlayerCard.keyframes';
import { xpGlowFor, energyGlowFor, counterValueSx } from './counterEffects';

// Shared poison total is lethal at 15 in 2HG; the danger pulse fires one below.
const POISON_DANGER_2HG = 14;
import { lifeColor } from '@/game-manager/lifeColor';
import { teamColor, otherTeam } from '@/lib/teams';
import type { PlayerState, CommanderDamageMap } from '@/lib/types';

export interface TeamMember {
  player: PlayerState;
  idx: number;
}

// Highest energy across a team's seats (the shared readout reacts to whichever
// teammate is highest). One rule for both this team and the opposing team.
function maxEnergy(list: TeamMember[]): number {
  return list.reduce((max, m) => Math.max(max, m.player.energy), 0);
}

// A member's commanders in tuple order: commander → dmg[0], partner → dmg[1].
// Single source of the partner/damage-index convention shared by the editable
// cmd-damage rows and the read-only opponent summary.
function commanderEntries(member: TeamMember): { name: string; isPartner: boolean }[] {
  const out = [{ name: member.player.commander.name, isPartner: false }];
  if (member.player.partner) out.push({ name: member.player.partner.name, isPartner: true });
  return out;
}

interface TeamPanelProps {
  teamNumber: number;
  teamName: string;
  opponentTeamName?: string;
  onTeamNameChange: (name: string) => void;
  members: TeamMember[];
  opponents: TeamMember[];
  commanderDamage: CommanderDamageMap;
  startingLife: number;
  isActiveTeam: boolean;
  // Turn-timer + Highlight parity with standard games: the active team's panel
  // reflects the countdown color (border/shadow with Highlight off, app-bar
  // gradient with Highlight on) via the shared useTimerTokens hook.
  elapsedSeconds: number;
  turnTimerSeconds: number;
  highlightMode: boolean;
  // Remote phone (per team): the primary seat's code drives one QR / connection
  // indicator for the whole team; a phone scanning it renders this same panel.
  seatCode?: string;
  remoteConnected?: boolean;
  // On the phone the panel fills the viewport, so it scales up (dvmax clamps)
  // and reflows its three sections into a vertical stack. Table stays as-is.
  remoteMode?: boolean;
  // Gates the poison ambience + City's Blessing sting (same hooks PlayerPanel uses).
  soundEnabled?: boolean;
  onLifeChange: (idx: number, delta: number) => void;
  onPoisonChange: (idx: number, delta: number) => void;
  onCommanderTaxChange: (idx: number, delta: number, isPartner?: boolean) => void;
  // Per-player (NOT shared): each teammate keeps their own energy, experience,
  // and monarch / initiative / city's-blessing toggles. These route to the
  // member's real seat idx, never the primary seat.
  onEnergyChange: (idx: number, delta: number) => void;
  onExperienceChange: (idx: number, delta: number) => void;
  onToggleMonarch: (idx: number) => void;
  onToggleInitiative: (idx: number) => void;
  onToggleCitysBlessing: (idx: number) => void;
  onCommanderDamageChange: (targetIdx: number, sourceIdx: number, isPartner: boolean, delta: number) => void;
  // Concede is a team action: eliminating either head concedes the whole team
  // (reconcileTeams marks both eliminated together). Routed through the primary seat.
  onEliminate: (idx: number) => void;
  onUndoEliminate: (idx: number) => void;
  // Present only when it is this team's turn (remote sends a pass_turn event).
  onPassTurn?: () => void;
}

// Responsive size tokens. Table (!remoteMode) keeps the original fixed px so the
// on-table strip is pixel-identical; phone (remoteMode) uses viewport-relative
// clamp(dvmax) so the panel scales with the device, mirroring PlayerCard.
interface Sz {
  art: number | string;
  briefName: number | string;
  briefSub: number | string;
  miniGlyph: number | string;
  xsLabel: number | string;
  val: number | string;
  btnSm: number | string;
  btnCmd: number | string;
  btnPoison: number | string;
  btnLife: number | string;
  ability: number | string;
  sectionLabel: number | string;
  poisonVal: number | string;
  cmdLabel: number | string;
  cmdVal: number | string;
  life: string;
  oppLife: string;
  big: boolean;
}

// Table: dvh-based clamps whose mins equal the original fixed px, so the strip
// never shrinks below its shipped look but grows on taller displays.
const SZ_TABLE: Sz = {
  art: 'clamp(36px, 4dvh, 46px)',
  briefName: 'clamp(12px, 1.4dvh, 15px)',
  briefSub: 'clamp(10px, 1.2dvh, 13px)',
  miniGlyph: 'clamp(11px, 1.3dvh, 14px)',
  xsLabel: 'clamp(9px, 1.1dvh, 12px)',
  val: 'clamp(12px, 1.4dvh, 15px)',
  btnSm: 'clamp(12px, 1.4dvh, 15px)',
  btnCmd: 'clamp(14px, 1.6dvh, 17px)',
  btnPoison: 'clamp(16px, 1.8dvh, 20px)',
  btnLife: 'clamp(30px, 3.6dvh, 40px)',
  ability: 'clamp(14px, 1.6dvh, 17px)',
  sectionLabel: 'clamp(10px, 1.2dvh, 13px)',
  poisonVal: 'clamp(20px, 2.3dvh, 26px)',
  cmdLabel: 'clamp(12px, 1.4dvh, 15px)',
  cmdVal: 'clamp(14px, 1.6dvh, 17px)',
  life: 'clamp(52px, 9dvh, 96px)',
  oppLife: 'clamp(30px, 4.5dvh, 48px)', big: false,
};

// Phone: scale to dvmin (the panel's SHORT/constraining dimension), not dvmax —
// this strip is wide and short, so dvmax tracked the large side and ballooned on
// wide screens. dvmin sizes to what's actually tight, so the caps don't overshoot.
const SZ_PHONE: Sz = {
  art: 'clamp(36px, 11dvmin, 54px)',
  briefName: 'clamp(13px, 3.6dvmin, 18px)',
  briefSub: 'clamp(10px, 3dvmin, 14px)',
  miniGlyph: 'clamp(12px, 3.4dvmin, 16px)',
  xsLabel: 'clamp(10px, 3dvmin, 14px)',
  val: 'clamp(14px, 4dvmin, 19px)',
  btnSm: 'clamp(14px, 4dvmin, 19px)',
  btnCmd: 'clamp(15px, 4.2dvmin, 20px)',
  btnPoison: 'clamp(16px, 4.5dvmin, 22px)',
  btnLife: 'clamp(28px, 9dvmin, 42px)',
  ability: 'clamp(15px, 4.2dvmin, 20px)',
  sectionLabel: 'clamp(10px, 3dvmin, 14px)',
  poisonVal: 'clamp(20px, 6dvmin, 28px)',
  cmdLabel: 'clamp(13px, 3.7dvmin, 18px)',
  cmdVal: 'clamp(15px, 4.2dvmin, 20px)',
  life: 'clamp(52px, 20dvmin, 100px)',
  oppLife: 'clamp(32px, 11dvmin, 54px)',
  big: true,
};

// Per-counter stepper sizing. The − / + glyphs and tap targets read a touch
// larger than the old bordered StatButton so the buttons are easy to hit.
function miniStepSize(sz: Sz): Partial<StepperSize> {
  return { btnFont: sz.btnPoison, valueFont: sz.val, btnMinWidth: sz.big ? 40 : 34, btnMinHeight: sz.big ? 40 : 34, valueMinWidth: 18 };
}
function taxStepSize(sz: Sz): Partial<StepperSize> {
  return { btnFont: sz.btnCmd, valueFont: sz.cmdVal, btnMinWidth: sz.big ? 36 : 30, btnMinHeight: sz.big ? 36 : 30, valueMinWidth: 16 };
}

/**
 * One pilot's energy + XP counters. A component (not inline) so it can call the
 * XP shimmer hook once per pilot — hooks can't run inside members.map(). Ports
 * PlayerCard's value effects: XP gold glow + shimmer, energy cyan glow, and the
 * poison "closing in" blur that ramps as the team nears lethal poison.
 */
function TeammateCounters({ member, sz, poisonProgress, onEnergyChange, onExperienceChange }: {
  member: TeamMember;
  sz: Sz;
  poisonProgress: number;
  onEnergyChange: (idx: number, delta: number) => void;
  onExperienceChange: (idx: number, delta: number) => void;
}) {
  const { energy, experience } = member.player;
  const idx = member.idx;

  const { intensity: xpIntensity, glow: xpGlow } = xpGlowFor(experience);
  const { xpShimmerAnim } = useXpKeyframes(experience, xpGlow, xpIntensity);
  const energyGlow = energyGlowFor(energy);
  const glow = { xpGlow, xpShimmerAnim, energyGlow };

  return (
    <Stack direction="row" alignItems="center" useFlexGap flexWrap="wrap" spacing={1}>
      <StepperControl
        label="Energy"
        glyph="⚡"
        glyphColor="#4FC8FF"
        value={energy}
        color={energy > 0 ? '#4FC8FF' : 'text.primary'}
        // Energy has no card-wide glow surface in 2HG (unlike PlayerCard), so its
        // cyan glow rides directly on the value here.
        valueSx={{ ...counterValueSx('energy', energy, poisonProgress, glow, POISON_DANGER_2HG), ...(energyGlow ? { textShadow: energyGlow } : {}) }}
        onDec={() => onEnergyChange(idx, -1)}
        onInc={() => onEnergyChange(idx, 1)}
        onDec5={() => onEnergyChange(idx, -5)}
        onInc5={() => onEnergyChange(idx, 5)}
        size={miniStepSize(sz)}
        lpKeyPrefix={`energy-${idx}`}
      />
      <StepperControl
        label="XP"
        glyph="✦"
        glyphColor="#DAA520"
        value={experience}
        color={experience > 0 ? '#DAA520' : 'text.primary'}
        valueSx={counterValueSx('xp', experience, poisonProgress, glow, POISON_DANGER_2HG)}
        onDec={() => onExperienceChange(idx, -1)}
        onInc={() => onExperienceChange(idx, 1)}
        onDec5={() => onExperienceChange(idx, -5)}
        onInc5={() => onExperienceChange(idx, 5)}
        size={miniStepSize(sz)}
        lpKeyPrefix={`xp-${idx}`}
      />
    </Stack>
  );
}

/** Compact per-player ability toggle (monarch / initiative / city's blessing). */
function AbilityToggle({
  active,
  color,
  title,
  onToggle,
  big = false,
  redundant = false,
  children,
}: {
  active: boolean;
  color: string;
  title: string;
  onToggle: () => void;
  big?: boolean;
  /** Activation would be redundant (a teammate already holds this exclusive ability). */
  redundant?: boolean;
  children: React.ReactNode;
}) {
  return (
    <IconButton
      onClick={onToggle}
      title={title}
      sx={{
        p: big ? 0.5 : 0.25,
        borderRadius: 1,
        border: (theme) => `1px solid ${active ? color : theme.palette.divider}`,
        bgcolor: active ? `${color}22` : 'transparent',
        color: active ? color : 'text.disabled',
        ...(redundant && { opacity: 0.35, cursor: 'not-allowed' }),
      }}
    >
      {children}
    </IconButton>
  );
}

/** Compact commander identity shown in the team app bar, one per pilot. */
function CommanderBrief({ member, align, onView, sz }: { member?: TeamMember; align: 'left' | 'right'; onView: (name: string) => void; sz: Sz }) {
  if (!member) return <Box sx={{ flex: 1, minWidth: 0 }} />;
  const { player } = member;
  return (
    <Box sx={{ flex: 1, minWidth: 0, textAlign: align }}>
      <Typography
        noWrap
        onClick={() => onView(player.commander.name)}
        title={player.commander.name}
        sx={{ fontSize: sz.briefName, fontWeight: 700, lineHeight: 1.15, cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
      >
        {player.playerName}
      </Typography>
      <Typography noWrap sx={{ fontSize: sz.briefSub, color: 'text.secondary', lineHeight: 1.15 }}>
        {player.commander.name}{player.partner ? ` / ${player.partner.name}` : ''}
      </Typography>
    </Box>
  );
}

export function TeamPanel({
  teamNumber,
  teamName,
  opponentTeamName,
  onTeamNameChange,
  members,
  opponents,
  commanderDamage,
  startingLife,
  isActiveTeam,
  elapsedSeconds,
  turnTimerSeconds,
  highlightMode,
  seatCode,
  remoteConnected = false,
  remoteMode = false,
  soundEnabled = false,
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
}: TeamPanelProps) {
  // Commander card preview — shared with PlayerCard. Tap any commander (own team
  // or opposing) to enlarge; the overlay is scoped to this panel's root.
  const { openPreview: setCmdPreviewName, overlay: cmdPreviewOverlay } = useCommanderPreview();

  // Inline team-name editing in the app bar. Commit on Enter/blur, cancel on Esc.
  const [editingName, setEditingName] = useState(false);
  const [nameDraft, setNameDraft] = useState(teamName);
  const startEditName = () => { setNameDraft(teamName); setEditingName(true); };
  const commitName = () => {
    const trimmed = nameDraft.trim();
    if (trimmed && trimmed !== teamName) onTeamNameChange(trimmed);
    setEditingName(false);
  };

  // Life and poison are mirrored across teammates, so either head is the team
  // total. All shared mutations target the primary seat; reconcileTeams mirrors.
  const primary = members[0];
  const life = primary?.player.life ?? startingLife;
  const poison = primary?.player.poison ?? 0;
  // Poison "closing in" ramp: counters blur as shared poison approaches the 2HG
  // lethal threshold of 15 (PlayerCard uses 10 for singles). Mirrors PlayerCard.
  const poisonProgress = Math.min(poison / 15, 1);
  // Life-lost ratio drives the shared crack overlay (same closure as PlayerCard).
  const lostRatio = startingLife > 0 ? Math.min(Math.max((startingLife - life) / startingLife, 0), 1) : 0;
  const crackAlpha = (from: number) => Math.min(Math.max((lostRatio - from) / 0.15, 0), 1);
  const eliminated = primary?.player.isEliminated ?? false;

  // Biggest commander-damage threat against the team (over both teammates), same
  // computation PlayerPanel uses per seat. Drives the flag-steal in <CityBlessing>.
  const threatSource = useMemo(() => {
    if (eliminated) return null;
    const byIdx = new Map<number, PlayerState>();
    for (const t of [...members, ...opponents]) byIdx.set(t.idx, t.player);
    return computeThreatSource(members.map((m) => commanderDamage[m.idx]), (i) => byIdx.get(i), null);
  }, [eliminated, members, opponents, commanderDamage]);

  // Sound + City's Blessing lifecycle, shared with PlayerPanel via one hook
  // (poison ambience, intro sting on gain, and the 3.8s fade-out on loss).
  const teamHasBlessing = members.some((m) => m.player.hasCitysBlessing);
  const { cityBlessingVisible, cityBlessingExiting } = useBlessingAndSound(teamHasBlessing, poison, eliminated, soundEnabled);
  // A team is "conceded" if either head was manually conceded (vs eliminated by
  // damage). reconcileTeams only stamps isConceded on the head that received the
  // eliminate event, so check both.
  const conceded = members.some((m) => m.player.isConceded);
  const [showConcedeConfirm, setShowConcedeConfirm] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const closeMenu = () => { setMenuAnchor(null); setShowConcedeConfirm(false); };

  const sz = remoteMode ? SZ_PHONE : SZ_TABLE;


  // Shared smooth ramp (greens above starting life, reds out below) — same fn
  // the standard PlayerPanel uses. lifeColor returns '' at exactly starting life;
  // LifeTotal's `color ?? primary.main` does NOT treat '' as default, so fall back
  // explicitly (matches the opponent readout below).
  const teamLifeColor = lifeColor(life, startingLife) || 'primary.main';

  // Opposing team's shared stats (mirrored across their heads, so either head
  // is the team total). Shown in the cmd-damage column so you can track them.
  const oppPrimary = opponents[0];
  const oppLife = oppPrimary?.player.life ?? startingLife;
  const oppPoison = oppPrimary?.player.poison ?? 0;
  const oppEnergy = maxEnergy(opponents);
  const oppEliminated = oppPrimary?.player.isEliminated ?? false;
  const oppTeamNumber = oppPrimary?.player.teamNumber ?? otherTeam(teamNumber);
  const oppColor = teamColor(oppTeamNumber);
  const oppLifeColor = lifeColor(oppLife, startingLife) || 'text.primary';

  // Commander damage THIS team's commanders have dealt to the opposing team,
  // read off the opponent primary seat as target (mirror of their own panel).
  const oppReceived = oppPrimary
    ? members.flatMap((m) => {
        const dmg = commanderDamage[oppPrimary.idx]?.[m.idx] ?? [0, 0];
        return commanderEntries(m).map((e) => ({ name: e.name, value: e.isPartner ? dmg[1] : dmg[0] }));
      })
    : [];

  // Turn timer, shared with standard games. The active team plays the role of
  // the current player: its panel carries the countdown color.
  const timer = useTimerTokens(elapsedSeconds, turnTimerSeconds, isActiveTeam);

  // The shared life number's reactions (damage flash, energy pulse, poison boil)
  // are rendered by the shared <LifeTotal>. Per-player counters react to the
  // team's HIGHEST value, so a teammate raising energy lights up the shared
  // readout the moment they do. Poison/life are mirrored across heads, so their
  // single value is already the team value.
  const teamEnergy = maxEnergy(members);

  // Drive the damage flash transiently off shared-life decreases, then clear it
  // so it plays once per hit and unmounts when done.
  const prevLifeRef = useRef(life);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [damageFlash, setDamageFlash] = useState(0);
  useEffect(() => {
    if (life < prevLifeRef.current) {
      setDamageFlash(prevLifeRef.current - life);
      if (flashTimer.current) clearTimeout(flashTimer.current);
      flashTimer.current = setTimeout(() => setDamageFlash(0), 650);
    }
    prevLifeRef.current = life;
  }, [life]);
  useEffect(() => () => { if (flashTimer.current) clearTimeout(flashTimer.current); }, []);

  return (
    <StepperOverlayHost
      sx={{
        position: 'relative',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        // Highlight OFF: the active team's border/shadow carry the timer color.
        // Highlight ON: the border stays neutral and the color rides the app bar
        // gradient instead (see the header Stack below). Matches PlayerCard.
        border: !highlightMode && timer.currentPlayerBorder
          ? timer.currentPlayerBorder
          : (theme) => `2px solid ${isActiveTeam ? theme.palette.primary.main : theme.palette.divider}`,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#221913' : '#FFFDFA'),
        boxShadow: !highlightMode && timer.currentPlayerShadow
          ? timer.currentPlayerShadow
          : isActiveTeam ? (theme) => `0 0 14px 2px ${theme.palette.primary.main}55` : 'none',
        ...(!highlightMode && timer.isTimerExpired && TIMER_EXPIRED_BORDER_BLINK),
        opacity: eliminated ? 0.5 : 1,
        overflow: 'hidden',
        // Own stacking context so the negative-z decoration layer below is scoped
        // to this panel (sits behind content, above the panel background).
        isolation: 'isolate',
      }}
    >
      {/* Themed background decorations (City's Blessing skyline/flags, Initiative
          torch) sit BEHIND all panel content via a negative-z layer, so the flags
          and skyline don't paint over the counters — especially in light theme. */}
      <Box sx={{ position: 'absolute', inset: 0, zIndex: -1, pointerEvents: 'none' }}>
        {/* City's Blessing (shown when either teammate holds the blessing; flags
            fly the primary pilot's commander art). */}
        <CityBlessing
          visible={cityBlessingVisible}
          exiting={cityBlessingExiting}
          threatSource={threatSource}
          commander={primary.player.commander}
        />
        {/* Initiative torch (shown when either teammate holds the initiative). */}
        <InitiativeTorch visible={members.some((m) => m.player.hasInitiative)} />
      </Box>

      {/* Custom 2HG app bar: each commander's current details flank a centered,
          editable team name (click to rename — persists with the live game
          state). Mirrors the 4-player card's header, doubled for the two pilots. */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={1}
        sx={{
          flexShrink: 0, px: 1.25, py: 0.5,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          transition: 'background 0.3s ease',
          // Highlight ON: the active team's app bar carries the timer gradient.
          background: isActiveTeam && highlightMode
            ? `linear-gradient(90deg, ${timer.timerColorRgba(0.3)} 0%, ${timer.timerColorRgba(0.7)} 50%, ${timer.timerColorRgba(0.3)} 100%)`
            : undefined,
          ...(isActiveTeam && highlightMode && timer.isTimerExpired && TIMER_EXPIRED_HEADER_BLINK),
        }}
      >
        <CommanderBrief member={members[0]} align="left" onView={setCmdPreviewName} sz={sz} />

        {/* Center: color badge + editable team name + active flag. */}
        <Stack direction="row" alignItems="center" spacing={0.75} sx={{ flexShrink: 0 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: 0.5, flexShrink: 0, bgcolor: teamColor(teamNumber) }} />
          {editingName ? (
            <TextField
              value={nameDraft}
              onChange={(e) => setNameDraft(e.target.value)}
              onBlur={commitName}
              onKeyDown={(e) => { if (e.key === 'Enter') commitName(); else if (e.key === 'Escape') setEditingName(false); }}
              autoFocus
              variant="standard"
              inputProps={{ maxLength: 32, style: { textAlign: 'center' } }}
              sx={{ '& .MuiInput-input': { fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, py: 0 } }}
            />
          ) : (
            <Typography
              noWrap
              onClick={startEditName}
              title="Click to rename team"
              sx={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', letterSpacing: 0.5, cursor: 'pointer', textAlign: 'center', '&:hover': { color: 'primary.main' } }}
            >
              {teamName}
            </Typography>
          )}
          {isActiveTeam && !eliminated && (
            <Typography sx={{ fontSize: 10, fontWeight: 700, color: 'primary.main', textTransform: 'uppercase', letterSpacing: 0.5, whiteSpace: 'nowrap' }}>
              Active
            </Typography>
          )}
          {/* Green dot when a teammate's phone is connected (glanceable). The QR
              to pair one lives in the gear menu below. */}
          {remoteConnected && (
            <SmartphoneIcon sx={{ fontSize: 16, color: 'success.main', animation: 'remotePulse 2s ease-in-out infinite', '@keyframes remotePulse': { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.4 } }, flexShrink: 0 }} />
          )}
          {/* Team options gear — QR pairing + concede live here to stay unobtrusive. */}
          <IconButton size="small" title="Team options" onClick={(e) => setMenuAnchor(e.currentTarget)} sx={{ p: 0.25, color: 'text.disabled' }}>
            <SettingsIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <Menu
            anchorEl={menuAnchor}
            open={Boolean(menuAnchor)}
            onClose={closeMenu}
            slotProps={{ paper: { sx: { maxHeight: 'min(80dvh, 480px)', overflowY: 'auto' } } }}
          >
            {seatCode && !remoteConnected && (
              <Box
                key="qr"
                onClick={() => { navigator.clipboard?.writeText(seatCode).catch(() => {}); }}
                sx={{ px: 2, py: 0.75, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}
              >
                <Typography sx={{ fontSize: 10, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>Pair a phone</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.25 }}>
                    <Box sx={{ p: 0.75, bgcolor: '#fff', borderRadius: 1 }}>
                      <QRCodeSVG value={`${remoteQrOrigin()}${ASSET_BASE}/game-manager/remote/?code=${seatCode}`} size={92} />
                    </Box>
                    <Typography sx={{ fontSize: 9, color: 'text.secondary' }}>Scan to join</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0.25 }}>
                    <Box sx={{ p: 0.75, bgcolor: '#fff', borderRadius: 1 }}>
                      <QRCodeSVG value={seatCode} size={92} />
                    </Box>
                    <Typography sx={{ fontSize: 9, color: 'text.secondary' }}>Scan for code</Typography>
                  </Box>
                </Box>
                <Typography sx={{ fontFamily: 'monospace', fontSize: 13, letterSpacing: 2, fontWeight: 700 }}>{seatCode}</Typography>
                <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>tap to copy code</Typography>
              </Box>
            )}
            {remoteConnected && (
              <MenuItem key="connected" disabled sx={{ fontSize: 13, opacity: '1 !important' }}>
                <SmartphoneIcon sx={{ fontSize: 16, mr: 1, color: 'success.main' }} /> Phone connected
              </MenuItem>
            )}
            {eliminated
              ? [
                  <MenuItem key="undo" onClick={() => { onUndoEliminate(primary.idx); closeMenu(); }} sx={{ fontSize: 13, fontWeight: 700, color: 'error.main' }}>
                    <ReplayIcon sx={{ fontSize: 16, mr: 1 }} /> Undo concede
                  </MenuItem>,
                ]
              : showConcedeConfirm
              ? [
                  <MenuItem key="confirm" onClick={() => { onEliminate(primary.idx); closeMenu(); }} sx={{ fontSize: 13, fontWeight: 700, color: '#DAA520' }}>
                    <ElimIcon sx={{ fontSize: 16, mr: 1 }} /> Confirm concede
                  </MenuItem>,
                  <MenuItem key="cancel" onClick={() => setShowConcedeConfirm(false)} sx={{ fontSize: 13, color: 'text.secondary' }}>
                    Cancel
                  </MenuItem>,
                ]
              : [
                  <MenuItem key="concede" onClick={() => setShowConcedeConfirm(true)} sx={{ fontSize: 13, color: 'text.secondary' }}>
                    <ElimIcon sx={{ fontSize: 16, mr: 1 }} /> Concede
                  </MenuItem>,
                ]}
          </Menu>
        </Stack>

        <CommanderBrief member={members[1]} align="right" onView={setCmdPreviewName} sz={sz} />
      </Stack>

      {/* Concede confirm + conceded/eliminated overlays (mirrors PlayerCard). */}
      {showConcedeConfirm && !eliminated && (
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, pointerEvents: 'none', bgcolor: 'rgba(218,165,32,0.12)' }}>
          <Typography sx={{ fontWeight: 900, color: '#DAA520', fontSize: 22, letterSpacing: 2, textShadow: '0 2px 8px rgba(0,0,0,0.5)', transform: 'rotate(-10deg)' }}>
            CONCEDE?
          </Typography>
        </Box>
      )}
      {eliminated && (
        <Box sx={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 11, pointerEvents: 'none', bgcolor: conceded ? 'rgba(218,165,32,0.12)' : 'transparent' }}>
          <Typography
            sx={{ fontWeight: 900, letterSpacing: 4, fontSize: 40, transform: 'rotate(-12deg)', color: conceded ? '#DAA520' : 'error.main' }}
            style={conceded ? { WebkitTextStroke: '2px black' } : undefined}
          >
            {conceded ? 'CONCEDED' : 'ELIMINATED'}
          </Typography>
        </Box>
      )}

      {/* Body: landscape stat row (pilots | shared life | commander damage).
          Row on the table and on a phone held landscape; a phone in PORTRAIT
          stacks the three sections into a column (scrollable). */}
      <Box sx={{
        flex: 1, minHeight: 0, display: 'flex', flexDirection: 'row', alignItems: 'stretch', gap: 1.5, p: 1.5,
        // On a phone held landscape the body is tall, so centering each column
        // leaves a dead band under the header and misaligns the three columns
        // (they have different heights). Top-align them instead so content sits
        // under the header and the columns share a baseline. The on-table strip
        // (!remoteMode) and portrait stack keep their centered/stretch layout.
        ...(remoteMode && {
          alignItems: 'flex-start',
          gap: 4, // wider separation between the three columns on a phone landscape
          '@media (orientation: portrait)': { flexDirection: 'column', overflowY: 'auto', gap: 2, alignItems: 'stretch' },
        }),
      }}>
      {/* Section A: pilots + per-commander tax. Ordered to the RIGHT (order 3). */}
      <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0, justifyContent: 'center', order: 3 }}>
        {members.map((m) => (
          <Box key={m.idx}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <CommanderArt
                name={m.player.commander.name}
                onClick={(e) => { e.stopPropagation(); setCmdPreviewName(m.player.commander.name); }}
                title={m.player.commander.name}
                sx={{ height: sz.art, width: 'auto', borderRadius: 0.5, flexShrink: 0, cursor: 'pointer', '&:hover': { opacity: 0.85 } }}
              />
              {/* Per-player controls, labeled with the pilot they apply to so the
                  two teammates' counters aren't ambiguous. */}
              <Stack spacing={0.25} sx={{ flex: 1, minWidth: 0 }}>
                {/* Name + commander tax share the top row: tax is the most-used
                    control, so it sits by the pilot name and reads slightly larger
                    (cmd-tier tokens) than the energy/XP counters below. */}
                <Stack direction="row" alignItems="center" useFlexGap flexWrap="wrap" spacing={1} sx={{ minWidth: 0 }}>
                  <Typography
                    noWrap
                    onClick={() => setCmdPreviewName(m.player.commander.name)}
                    title={`View ${m.player.commander.name}`}
                    sx={{ fontSize: sz.briefName, fontWeight: 700, lineHeight: 1.1, color: teamColor(teamNumber), minWidth: 0, flexShrink: 1, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                  >
                    {m.player.playerName}
                  </Typography>
                  {/* One tax counter per commander (each commander taxes
                      independently). Labeled 'Tax' for a single-commander deck, or
                      by the commander name when there are two. */}
                  {commanderEntries(m).map((e) => {
                    const value = e.isPartner ? m.player.partnerCommanderTax : m.player.commanderTax;
                    const key = e.isPartner ? 'p' : 'o';
                    return (
                      <Stack key={key} direction="row" alignItems="center" spacing={0.25} sx={{ flexShrink: 0 }}>
                        <Typography noWrap onClick={() => setCmdPreviewName(e.name)} title={`View ${e.name}`} sx={{ fontSize: sz.cmdLabel, color: 'text.secondary', maxWidth: '9ch', overflow: 'hidden', textOverflow: 'ellipsis', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}>{m.player.partner ? e.name : 'Tax'}</Typography>
                        <StepperControl
                          label={m.player.partner ? `${e.name} Tax` : 'Tax'}
                          value={value}
                          onDec={() => onCommanderTaxChange(m.idx, -1, e.isPartner)}
                          onInc={() => onCommanderTaxChange(m.idx, 1, e.isPartner)}
                          onDec5={() => onCommanderTaxChange(m.idx, -5, e.isPartner)}
                          onInc5={() => onCommanderTaxChange(m.idx, 5, e.isPartner)}
                          size={taxStepSize(sz)}
                          lpKeyPrefix={`tax-${m.idx}-${key}`}
                        />
                      </Stack>
                    );
                  })}
                </Stack>
                {/* Individual per-player counters (energy + XP). No text label —
                    the ⚡ / ✦ glyph identifies each; buttons run a touch larger.
                    Value effects (XP glow/shimmer, energy glow, poison blur) live
                    in TeammateCounters so the shimmer hook runs once per pilot. */}
                <TeammateCounters
                  member={m}
                  sz={sz}
                  poisonProgress={poisonProgress}
                  onEnergyChange={onEnergyChange}
                  onExperienceChange={onExperienceChange}
                />
                {/* Per-player ability toggles (individual, not shared). Monarch and
                    Initiative are one-per-game: activating one that the OTHER teammate
                    already holds is redundant, so it's a no-op (and the toggle dims).
                    Turning your own off, or taking it from the opposing team, still works.
                    City's Blessing is non-exclusive, so no such guard. */}
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  {(() => {
                    const teammateMonarch = members.some((o) => o.idx !== m.idx && o.player.isMonarch);
                    const teammateInitiative = members.some((o) => o.idx !== m.idx && o.player.hasInitiative);
                    const monarchRedundant = !m.player.isMonarch && teammateMonarch;
                    const initiativeRedundant = !m.player.hasInitiative && teammateInitiative;
                    return (
                      <>
                        <AbilityToggle active={m.player.isMonarch} color="#DAA520" title={monarchRedundant ? 'Monarch (your team already has it)' : 'Monarch'} redundant={monarchRedundant} onToggle={() => { if (monarchRedundant) return; onToggleMonarch(m.idx); }} big={sz.big}>
                          <CrownIcon sx={{ fontSize: sz.ability }} />
                        </AbilityToggle>
                        <AbilityToggle active={m.player.hasInitiative} color="#4FC3F7" title={initiativeRedundant ? 'Initiative (your team already has it)' : 'Initiative'} redundant={initiativeRedundant} onToggle={() => { if (initiativeRedundant) return; onToggleInitiative(m.idx); }} big={sz.big}>
                          <InitiativeIcon sx={{ fontSize: sz.ability }} />
                        </AbilityToggle>
                      </>
                    );
                  })()}
                  <AbilityToggle active={m.player.hasCitysBlessing} color="#7851A9" title="City's Blessing" onToggle={() => onToggleCitysBlessing(m.idx)} big={sz.big}>
                    <CityIcon sx={{ fontSize: sz.ability }} />
                  </AbilityToggle>
                </Stack>
              </Stack>
            </Stack>
          </Box>
        ))}
      </Stack>

      {/* Section B: shared life (centered + prominent) and poison. Order 2 (center). */}
      <Stack sx={{ flex: 1.2, minWidth: 0, alignItems: 'center', justifyContent: 'center', order: 2, ...(remoteMode && { alignSelf: 'stretch' }) }} spacing={0.5}>
        {/* Shared crack overlay behind the life number + floating Monarch crown
            (same components as PlayerCard). overflow:visible so the crown can rise
            above the life row; the crack layers are inset:0 so they don't spill. */}
        <Box sx={{
          position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          // A generous life-total container so the crack + threat layers cover a
          // real area (not just the digits). overflow:visible lets the crown rise.
          minWidth: 'clamp(180px, 42dvw, 340px)',
          minHeight: 'clamp(110px, 24dvh, 220px)',
          ...(remoteMode && { width: '100%', flex: 1 }),
        }}>
          {/* Cracks + threat names fill the whole container and are clipped to it,
              so long names don't spill onto the pilot columns. */}
          <Box sx={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
            <LifeCracks fingerprint={teamNumber} crackAlpha={crackAlpha} />
            <ThreatNames threatSource={threatSource} fingerprint={teamNumber} />
          </Box>
          {/* Monarch is one-per-game; show the crown when either teammate holds it. */}
          <MonarchCrown show={members.some((m) => m.player.isMonarch)} animStr={monarchCrownAnim('steady', false)} />
          <StepperControl
            label="Life Total"
            value={life}
            color={teamLifeColor}
            onDec={() => onLifeChange(primary.idx, -1)}
            onInc={() => onLifeChange(primary.idx, 1)}
            onDec5={() => onLifeChange(primary.idx, -5)}
            onInc5={() => onLifeChange(primary.idx, 5)}
            size={{ btnFont: sz.btnLife, valueFont: sz.life, btnMinWidth: sz.big ? 52 : 44, btnMinHeight: sz.big ? 52 : 44, valueMinWidth: 96 }}
            rowSpacing={1.5}
            lpKeyPrefix="life"
            valueNode={
              <LifeTotal
                value={life}
                fontSize={sz.life}
                color={teamLifeColor}
                damageFlash={damageFlash}
                energy={teamEnergy}
                poison={poison}
                reactions={{ swipes: false }}
                sx={{ minWidth: 96, textAlign: 'center' }}
              />
            }
          />
        </Box>
        <Typography sx={{ fontSize: sz.sectionLabel, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
          Shared Life
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mt: 0.5 }}>
          <Typography sx={{ fontSize: sz.sectionLabel, color: 'text.secondary' }}>Poison</Typography>
          <StepperControl
            label="Poison"
            value={poison}
            color={poison >= 15 ? '#2E7D32' : 'text.primary'}
            valueSx={{ fontWeight: 800, ...counterValueSx('poison', poison, poisonProgress, {}, POISON_DANGER_2HG) }}
            onDec={() => onPoisonChange(primary.idx, -1)}
            onInc={() => onPoisonChange(primary.idx, 1)}
            onDec5={() => onPoisonChange(primary.idx, -5)}
            onInc5={() => onPoisonChange(primary.idx, 5)}
            size={{ btnFont: sz.btnPoison, valueFont: sz.poisonVal, btnMinWidth: sz.big ? 40 : 34, btnMinHeight: sz.big ? 40 : 34, valueMinWidth: 26 }}
            lpKeyPrefix="poison"
          />
          <Typography sx={{ fontSize: sz.sectionLabel, color: 'text.secondary' }}>/ 15</Typography>
        </Stack>
        {/* Pass Turn — only on the active team's panel (the remote sends a
            pass_turn event; the host advances the turn). The flex spacer pushes
            it to the bottom of the (stretched) center column in landscape; in the
            portrait stack there's no free space so it sits after poison. */}
        {isActiveTeam && onPassTurn && (
          <>
          <Box sx={{ flexGrow: 1, minHeight: 0, width: '100%' }} />
          <Box
            onClick={onPassTurn}
            sx={{ px: 1.5, py: 0.5, borderRadius: 1.5, border: '2px solid', borderColor: 'primary.main', cursor: 'pointer', userSelect: 'none' }}
          >
            <Typography sx={{ fontSize: sz.sectionLabel, fontWeight: 800, color: 'primary.main', textTransform: 'uppercase', letterSpacing: 1, lineHeight: 1.4 }}>
              Pass Turn
            </Typography>
          </Box>
          </>
        )}
      </Stack>

      {/* Section C: opposing-team stats + commander damage taken from each of
          their commanders. Ordered to the LEFT (order 1). All damage is tracked
          against this team's primary seat so reconcileTeams sums it for the
          21-damage check. */}
      <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0, justifyContent: 'center', order: 1 }}>
        {/* Opposing team's shared life/poison, so you can see how they're doing. */}
        <Box sx={{ opacity: oppEliminated ? 0.5 : 1 }}>
          <Typography noWrap sx={{ fontSize: sz.briefName, fontWeight: 700, color: oppColor, lineHeight: 1.1, textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {opponentTeamName ?? `Team ${oppTeamNumber}`}
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1.25}>
            {/* Reuse the shared LifeTotal so the opponent number carries the same
                color ramp + poison boil / energy pulse (read-only, no buttons). */}
            <LifeTotal
              value={oppLife}
              fontSize={sz.oppLife}
              color={oppLifeColor}
              energy={oppEnergy}
              poison={oppPoison}
              reactions={{ swipes: false }}
              sx={{ minWidth: 0, lineHeight: 1 }}
            />
            {/* Commander damage this team has dealt to them, stacked beside the
                life (read-only; edited from their own panel). Only shows once > 0. */}
            {oppReceived.some((r) => r.value > 0) && (
              <Stack spacing={0} sx={{ minWidth: 0, maxWidth: '16ch' }}>
                {oppReceived.filter((r) => r.value > 0).map((r) => (
                  <Stack
                    key={r.name}
                    direction="row"
                    alignItems="baseline"
                    spacing={0.5}
                    onClick={() => setCmdPreviewName(r.name)}
                    title={`View ${r.name}`}
                    sx={{ minWidth: 0, cursor: 'pointer', '&:hover': { opacity: 0.8 } }}
                  >
                    <Typography noWrap sx={{ fontSize: sz.xsLabel, color: 'text.secondary', lineHeight: 1.3, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.name}</Typography>
                    <Typography sx={{ fontSize: sz.xsLabel, color: 'text.secondary', lineHeight: 1.3, flexShrink: 0, whiteSpace: 'nowrap' }}>
                      <Box component="span" sx={{ fontWeight: 800, color: r.value >= 21 ? '#B71C1C' : 'text.primary' }}>{r.value}</Box>/21
                    </Typography>
                  </Stack>
                ))}
              </Stack>
            )}
            {oppPoison > 0 && (
              <Typography sx={{ fontSize: sz.cmdLabel, color: 'text.secondary', ml: 0.5 }}>
                Poison <Box component="span" sx={{ fontWeight: 800, color: oppPoison >= 15 ? '#2E7D32' : 'text.primary' }}>{oppPoison}</Box><Box component="span" sx={{ color: 'text.disabled' }}> / 15</Box>
              </Typography>
            )}
          </Stack>
        </Box>
        <Typography sx={{ fontSize: sz.sectionLabel, fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5, mt: 0.5 }}>
          Cmd Damage
        </Typography>
        {opponents.flatMap((opp) => {
          const dmg = commanderDamage[primary.idx]?.[opp.idx] ?? [0, 0];
          // Same commander → dmg[0] / partner → dmg[1] convention as oppReceived.
          return commanderEntries(opp).map((e) => (
            <CmdDamageRow
              key={`${opp.idx}-${e.isPartner ? 'partner' : 'own'}`}
              label={e.name}
              value={e.isPartner ? dmg[1] : dmg[0]}
              tax={e.isPartner ? opp.player.partnerCommanderTax : opp.player.commanderTax}
              onChange={(delta) => onCommanderDamageChange(primary.idx, opp.idx, e.isPartner, delta)}
              onView={() => setCmdPreviewName(e.name)}
              lpKey={`cmd-${opp.idx}-${e.isPartner ? 'partner' : 'own'}`}
              sz={sz}
            />
          ));
        })}
      </Stack>
      </Box>

      {/* Shared Phyrexian poison overlay — washes the whole panel as the team's
          shared poison closes on lethal (15). Same component as PlayerCard. */}
      <PoisonOverlay poison={poison} poisonProgress={poisonProgress} />

      {/* Eliminated / Conceded / Poisoned outcome overlay (shared with PlayerCard),
          shown per team. Poison is lethal at 15 in 2HG. */}
      <EliminatedOverlay eliminated={eliminated} conceded={primary?.player.isConceded ?? false} poisoned={poison >= 15} />

      {/* Commander card preview overlay — shared with PlayerCard, scoped to this
          panel via the root Box's position:relative + inset:0. */}
      {cmdPreviewOverlay}
    </StepperOverlayHost>
  );
}

// The commander NAME opens the card preview (onView); the VALUE opens the
// shared focus modal (±1 big + ±5), same as every other counter.
function CmdDamageRow({ label, value, tax, onChange, onView, lpKey, sz }: { label: string; value: number; tax: number; onChange: (delta: number) => void; onView: () => void; lpKey: string; sz: Sz }) {
  return (
    <Stack direction="row" alignItems="center" spacing={0.75}>
      {/* Commander name + its current tax (+{tax*2} generic mana) sit together. */}
      <Stack direction="row" alignItems="baseline" spacing={0.5} sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          noWrap
          onClick={(e) => { e.stopPropagation(); onView(); }}
          sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', fontSize: sz.cmdLabel, color: value >= 21 ? '#B71C1C' : 'text.primary', fontWeight: value >= 21 ? 700 : 400, cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
        >
          {label}
        </Typography>
        {tax > 0 && (
          <Typography title={`Tax: cast ${tax}x`} sx={{ fontSize: sz.xsLabel, fontWeight: 700, color: 'warning.main', flexShrink: 0, whiteSpace: 'nowrap' }}>+{tax * 2}</Typography>
        )}
      </Stack>
      <StepperControl
        label={`CMD Dmg — ${label}`}
        value={value}
        color={value >= 21 ? '#B71C1C' : 'text.primary'}
        onDec={() => onChange(-1)}
        onInc={() => onChange(1)}
        onDec5={() => onChange(-5)}
        onInc5={() => onChange(5)}
        size={{ btnFont: sz.btnCmd, valueFont: sz.cmdVal, btnMinWidth: sz.big ? 36 : 30, btnMinHeight: sz.big ? 36 : 30, valueMinWidth: 22 }}
        lpKeyPrefix={lpKey}
      />
      <Typography sx={{ fontSize: sz.xsLabel, color: 'text.secondary' }}>/21</Typography>
    </Stack>
  );
}
