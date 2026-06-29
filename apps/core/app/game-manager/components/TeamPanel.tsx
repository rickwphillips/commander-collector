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
import { useState, useEffect, useRef } from 'react';
import { Box, Stack, Typography, IconButton, SvgIcon, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CloseIcon from '@mui/icons-material/Close';
import InitiativeIcon from '@mui/icons-material/Castle';
import CityIcon from '@mui/icons-material/LocationCity';
import { getCardImageByName } from '@commander/shared/lib/cardImageCache';
import { useDamageFlashKeyframe, usePoisonBoilKeyframe } from './PlayerCard.keyframes';
import type { PlayerState, CommanderDamageMap } from '@/lib/types';

// Small crown glyph mirrored from PlayerCard so the Monarch toggle reads the
// same in both surfaces without forking the whole card component.
const CrownIcon = (props: React.ComponentProps<typeof SvgIcon>) => (
  <SvgIcon {...props} viewBox="0 0 24 24">
    <path d="M5 16l-3-10 5.5 4L12 2l4.5 8L22 6l-3 10H5zm0 2h14v2H5v-2z" />
  </SvgIcon>
);

export interface TeamMember {
  player: PlayerState;
  idx: number;
}

interface TeamPanelProps {
  teamNumber: number;
  members: TeamMember[];
  opponents: TeamMember[];
  commanderDamage: CommanderDamageMap;
  startingLife: number;
  isActiveTeam: boolean;
  onLifeChange: (idx: number, delta: number) => void;
  onPoisonChange: (idx: number, delta: number) => void;
  onCommanderTaxChange: (idx: number, delta: number) => void;
  // Per-player (NOT shared): each teammate keeps their own energy, experience,
  // and monarch / initiative / city's-blessing toggles. These route to the
  // member's real seat idx, never the primary seat.
  onEnergyChange: (idx: number, delta: number) => void;
  onExperienceChange: (idx: number, delta: number) => void;
  onToggleMonarch: (idx: number) => void;
  onToggleInitiative: (idx: number) => void;
  onToggleCitysBlessing: (idx: number) => void;
  onCommanderDamageChange: (targetIdx: number, sourceIdx: number, isPartner: boolean, delta: number) => void;
}

function StatButton({ onClick, size = 18, children }: { onClick: () => void; size?: number; children: React.ReactNode }) {
  return (
    <IconButton
      onClick={onClick}
      sx={{
        color: 'primary.main',
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 1,
        p: 0.25,
      }}
    >
      {children}
    </IconButton>
  );
}

/** Compact per-player counter (energy / experience) used inside a teammate block. */
function MiniCounter({
  glyph,
  glyphColor,
  label,
  value,
  active,
  onDec,
  onInc,
}: {
  glyph: React.ReactNode;
  glyphColor: string;
  label: string;
  value: number;
  active: boolean;
  onDec: () => void;
  onInc: () => void;
}) {
  return (
    <Stack direction="row" alignItems="center" spacing={0.25}>
      <Box component="span" sx={{ fontSize: 11, lineHeight: 1, color: glyphColor }}>{glyph}</Box>
      <Typography sx={{ fontSize: 9, color: 'text.secondary' }}>{label}</Typography>
      <StatButton onClick={onDec}><RemoveIcon sx={{ fontSize: 12 }} /></StatButton>
      <Typography sx={{ fontSize: 12, fontWeight: 700, minWidth: 14, textAlign: 'center', color: active ? glyphColor : 'text.primary' }}>
        {value}
      </Typography>
      <StatButton onClick={onInc}><AddIcon sx={{ fontSize: 12 }} /></StatButton>
    </Stack>
  );
}

/** Compact per-player ability toggle (monarch / initiative / city's blessing). */
function AbilityToggle({
  active,
  color,
  title,
  onToggle,
  children,
}: {
  active: boolean;
  color: string;
  title: string;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <IconButton
      onClick={onToggle}
      title={title}
      sx={{
        p: 0.25,
        borderRadius: 1,
        border: (theme) => `1px solid ${active ? color : theme.palette.divider}`,
        bgcolor: active ? `${color}22` : 'transparent',
        color: active ? color : 'text.disabled',
      }}
    >
      {children}
    </IconButton>
  );
}

export function TeamPanel({
  teamNumber,
  members,
  opponents,
  commanderDamage,
  startingLife,
  isActiveTeam,
  onLifeChange,
  onPoisonChange,
  onCommanderTaxChange,
  onEnergyChange,
  onExperienceChange,
  onToggleMonarch,
  onToggleInitiative,
  onToggleCitysBlessing,
  onCommanderDamageChange,
}: TeamPanelProps) {
  // Commander card preview — card-local view state, copied verbatim from
  // PlayerCard so any commander (own team or opposing) can be tapped to enlarge.
  // Nothing here is shared or routed through a handler; it is pure local view.
  const [cmdPreviewName, setCmdPreviewName] = useState<string | null>(null);
  const [cmdPreviewUrl, setCmdPreviewUrl] = useState<string | null>(null);
  const [cmdPreviewZoom, setCmdPreviewZoom] = useState(1);
  const [cmdPreviewBase, setCmdPreviewBase] = useState<{ w: number; h: number } | null>(null);
  const cmdScrollRef = useRef<HTMLDivElement>(null);

  // Resolve preview URL when name changes; reset zoom/base.
  useEffect(() => {
    if (!cmdPreviewName) { setCmdPreviewUrl(null); setCmdPreviewZoom(1); setCmdPreviewBase(null); return; }
    setCmdPreviewUrl(null);
    setCmdPreviewZoom(1);
    setCmdPreviewBase(null);
    getCardImageByName(cmdPreviewName).then(url => setCmdPreviewUrl(url));
  }, [cmdPreviewName]);

  // Scroll to bottom when zoom changes so the card bottom stays in view.
  useEffect(() => {
    if (cmdPreviewZoom > 1 && cmdScrollRef.current) {
      cmdScrollRef.current.scrollTop = cmdScrollRef.current.scrollHeight;
    }
  }, [cmdPreviewZoom]);

  // Life and poison are mirrored across teammates, so either head is the team
  // total. All shared mutations target the primary seat; reconcileTeams mirrors.
  const primary = members[0];
  const life = primary?.player.life ?? startingLife;
  const poison = primary?.player.poison ?? 0;
  const eliminated = primary?.player.isEliminated ?? false;

  const lifeColor =
    life <= 0 ? '#B71C1C' : life <= 10 ? '#E65100' : life <= 20 ? '#F9A825' : 'primary.main';

  // Damage + poison animations on the shared readouts (mirrored from PlayerCard).
  // The boil intensifies with poison; the red flash replays whenever shared life
  // drops. Both keyframe hooks are called once here (life/poison are single
  // shared values), so there is no rules-of-hooks issue from per-team rendering.
  const damageFlashAnim = useDamageFlashKeyframe();
  const poisonBoilAmp = poison >= 10 ? 5 : poison === 9 ? 3.8 : poison === 8 ? 1.5 : 0;
  const poisonBoilSkew = Math.min(poisonBoilAmp * 0.6, 2.5);
  const poisonBoilAnim = usePoisonBoilKeyframe(poison, poisonBoilAmp, poisonBoilSkew);
  const poisonBoilDuration = poison >= 10 ? 2.0 : poison >= 9 ? 2.5 : 5.0;

  // Bump a key on every shared-life decrease so the flash keyframe replays.
  const prevLifeRef = useRef(life);
  const [lifeFlashKey, setLifeFlashKey] = useState(0);
  useEffect(() => {
    if (life < prevLifeRef.current) setLifeFlashKey((k) => k + 1);
    prevLifeRef.current = life;
  }, [life]);

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        gap: 1.5,
        p: 1.5,
        borderRadius: 2,
        border: (theme) => `2px solid ${isActiveTeam ? theme.palette.primary.main : theme.palette.divider}`,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#221913' : '#FFFDFA'),
        boxShadow: isActiveTeam ? (theme) => `0 0 14px 2px ${theme.palette.primary.main}55` : 'none',
        opacity: eliminated ? 0.5 : 1,
        overflow: 'hidden',
      }}
    >
      {/* Section A: team header + pilots + per-commander tax */}
      <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0, justifyContent: 'center' }}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            sx={{
              px: 0.75,
              py: 0.25,
              borderRadius: 1,
              bgcolor: teamNumber === 1 ? 'primary.main' : 'secondary.main',
              color: '#fff',
              fontSize: 12,
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              whiteSpace: 'nowrap',
            }}
          >
            Team {teamNumber}
          </Box>
          {isActiveTeam && (
            <Typography sx={{ fontSize: 10, fontWeight: 700, color: 'primary.main', textTransform: 'uppercase', letterSpacing: 0.5 }}>
              Active
            </Typography>
          )}
        </Stack>
        {members.map((m) => (
          <Box key={m.idx}>
            <Stack direction="row" alignItems="center" spacing={1}>
              {m.player.commander.artCropUrl && (
                <Box
                  component="img"
                  src={m.player.commander.artCropUrl}
                  alt=""
                  onClick={(e) => { e.stopPropagation(); setCmdPreviewName(m.player.commander.name); }}
                  sx={{ height: 28, width: 'auto', borderRadius: 0.5, flexShrink: 0, cursor: 'pointer', '&:hover': { opacity: 0.85 } }}
                />
              )}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography noWrap sx={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>{m.player.playerName}</Typography>
                <Typography noWrap sx={{ fontSize: 11, color: 'text.secondary', lineHeight: 1.2 }}>
                  <Box
                    component="span"
                    onClick={(e) => { e.stopPropagation(); setCmdPreviewName(m.player.commander.name); }}
                    sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                  >
                    {m.player.commander.name}
                  </Box>
                  {m.player.partner && (
                    <>
                      {' / '}
                      <Box
                        component="span"
                        onClick={(e) => { e.stopPropagation(); setCmdPreviewName(m.player.partner!.name); }}
                        sx={{ cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                      >
                        {m.player.partner.name}
                      </Box>
                    </>
                  )}
                </Typography>
              </Box>
            </Stack>
            {/* Per-player counters: commander tax + (individual) energy + XP.
                Tax stays per-commander; energy and experience are per-player and
                route to this teammate's real seat idx, not the shared primary. */}
            <Stack direction="row" alignItems="center" useFlexGap flexWrap="wrap" spacing={1} sx={{ mt: 0.25 }}>
              <Stack direction="row" alignItems="center" spacing={0.25}>
                <Typography sx={{ fontSize: 9, color: 'text.secondary' }}>Tax</Typography>
                <StatButton onClick={() => onCommanderTaxChange(m.idx, -1)}><RemoveIcon sx={{ fontSize: 12 }} /></StatButton>
                <Typography sx={{ fontSize: 12, fontWeight: 700, minWidth: 14, textAlign: 'center' }}>{m.player.commanderTax}</Typography>
                <StatButton onClick={() => onCommanderTaxChange(m.idx, 1)}><AddIcon sx={{ fontSize: 12 }} /></StatButton>
              </Stack>
              <MiniCounter
                glyph="⚡"
                glyphColor="#4FC8FF"
                label="Energy"
                value={m.player.energy}
                active={m.player.energy > 0}
                onDec={() => onEnergyChange(m.idx, -1)}
                onInc={() => onEnergyChange(m.idx, 1)}
              />
              <MiniCounter
                glyph="✦"
                glyphColor="#DAA520"
                label="XP"
                value={m.player.experience}
                active={m.player.experience > 0}
                onDec={() => onExperienceChange(m.idx, -1)}
                onInc={() => onExperienceChange(m.idx, 1)}
              />
            </Stack>
            {/* Per-player ability toggles (individual, not shared). */}
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.25 }}>
              <AbilityToggle active={m.player.isMonarch} color="#DAA520" title="Monarch" onToggle={() => onToggleMonarch(m.idx)}>
                <CrownIcon sx={{ fontSize: 14 }} />
              </AbilityToggle>
              <AbilityToggle active={m.player.hasInitiative} color="#4FC3F7" title="Initiative" onToggle={() => onToggleInitiative(m.idx)}>
                <InitiativeIcon sx={{ fontSize: 14 }} />
              </AbilityToggle>
              <AbilityToggle active={m.player.hasCitysBlessing} color="#7851A9" title="City's Blessing" onToggle={() => onToggleCitysBlessing(m.idx)}>
                <CityIcon sx={{ fontSize: 14 }} />
              </AbilityToggle>
            </Stack>
          </Box>
        ))}
      </Stack>

      {/* Section B: shared life (centered + prominent) and poison */}
      <Stack sx={{ flex: 1.2, minWidth: 0, alignItems: 'center', justifyContent: 'center' }} spacing={0.5}>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5}>
          <StatButton onClick={() => onLifeChange(primary.idx, -1)}><RemoveIcon sx={{ fontSize: 30 }} /></StatButton>
          <Typography
            key={lifeFlashKey}
            sx={{ fontWeight: 900, fontSize: 'clamp(52px, 11dvh, 120px)', lineHeight: 1, color: lifeColor, minWidth: 96, textAlign: 'center', ...(lifeFlashKey > 0 && { animation: `${damageFlashAnim} 0.6s ease-out forwards` }) }}
          >
            {life}
          </Typography>
          <StatButton onClick={() => onLifeChange(primary.idx, 1)}><AddIcon sx={{ fontSize: 30 }} /></StatButton>
        </Stack>
        <Typography sx={{ fontSize: 10, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>
          Shared Life
        </Typography>
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} sx={{ mt: 0.5 }}>
          <Typography sx={{ fontSize: 12, color: 'text.secondary' }}>Poison</Typography>
          <StatButton onClick={() => onPoisonChange(primary.idx, -1)}><RemoveIcon sx={{ fontSize: 16 }} /></StatButton>
          <Typography sx={{ fontWeight: 800, fontSize: 20, minWidth: 26, textAlign: 'center', color: poison >= 15 ? '#2E7D32' : 'text.primary', ...(poisonBoilAnim && { animation: `${poisonBoilAnim} ${poisonBoilDuration}s ease-in-out infinite` }) }}>
            {poison}
          </Typography>
          <StatButton onClick={() => onPoisonChange(primary.idx, 1)}><AddIcon sx={{ fontSize: 16 }} /></StatButton>
          <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>/ 15</Typography>
        </Stack>
      </Stack>

      {/* Section C: commander damage taken from each opposing commander.
          All damage is tracked against the team's primary seat so reconcileTeams
          sums it for the 21-damage elimination check. */}
      <Stack spacing={0.5} sx={{ flex: 1, minWidth: 0, justifyContent: 'center' }}>
        <Typography sx={{ fontSize: 10, fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Cmd Damage
        </Typography>
        {opponents.flatMap((opp) => {
          const dmg = commanderDamage[primary.idx]?.[opp.idx] ?? [0, 0];
          const rows: React.ReactNode[] = [
            <CmdDamageRow
              key={`${opp.idx}-own`}
              label={opp.player.commander.name}
              value={dmg[0]}
              onChange={(delta) => onCommanderDamageChange(primary.idx, opp.idx, false, delta)}
              onView={() => setCmdPreviewName(opp.player.commander.name)}
            />,
          ];
          if (opp.player.partner) {
            rows.push(
              <CmdDamageRow
                key={`${opp.idx}-partner`}
                label={opp.player.partner.name}
                value={dmg[1]}
                onChange={(delta) => onCommanderDamageChange(primary.idx, opp.idx, true, delta)}
                onView={() => setCmdPreviewName(opp.player.partner!.name)}
              />,
            );
          }
          return rows;
        })}
      </Stack>

      {/* Commander card preview overlay — scoped to this panel via the root
          Box's position:relative + inset:0, copied from PlayerCard. */}
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
    </Box>
  );
}

function CmdDamageRow({ label, value, onChange, onView }: { label: string; value: number; onChange: (delta: number) => void; onView: () => void }) {
  return (
    <Stack direction="row" alignItems="center" spacing={0.75}>
      <Typography
        noWrap
        onClick={(e) => { e.stopPropagation(); onView(); }}
        sx={{ flex: 1, minWidth: 0, fontSize: 12, color: value >= 21 ? '#B71C1C' : 'text.primary', fontWeight: value >= 21 ? 700 : 400, cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
      >
        {label}
      </Typography>
      <StatButton onClick={() => onChange(-1)}><RemoveIcon sx={{ fontSize: 14 }} /></StatButton>
      <Typography sx={{ fontSize: 14, fontWeight: 700, minWidth: 22, textAlign: 'center' }}>{value}</Typography>
      <StatButton onClick={() => onChange(1)}><AddIcon sx={{ fontSize: 14 }} /></StatButton>
      <Typography sx={{ fontSize: 9, color: 'text.secondary' }}>/21</Typography>
    </Stack>
  );
}
