'use client';

/**
 * CommanderDamageRow — one opponent's commander-damage row, shared by BOTH the
 * standard PlayerCard's cmd-damage column and the 2HG TeamPanel's opposing-team
 * section, so the two never diverge.
 *
 * Per source it renders a StepperControl (plus a second row for a partner
 * commander): the label is the opponent's name + the ⚔ damage YOU/your team have
 * dealt them + the shared PlayerStatusBadges status row; the value is the cmd
 * damage that source has dealt YOU/your team. On remote the value is a compact
 * tappable readout (cmd damage /21 + the opponent's life) that opens the focus
 * modal; on the host board it is the inline ± stepper. Tapping the name calls
 * `onTapName` so each panel can open its own snapshot / card preview.
 */
import { Box, Stack, Tooltip, Typography } from '@mui/material';
import { StepperControl, type StepperSize } from './StepperControl';
import { CommanderArt } from './CommanderArt';
import { PlayerStatusBadges } from './PlayerStatusBadges';
import { lifeColor } from '@/game-manager/lifeColor';
import type { PlayerState } from '../types';

export interface CommanderDamageRowProps {
  source: PlayerState;
  /** [commander, partner] cmd damage this source has dealt you/your team (edited here). */
  damage: readonly number[];
  /** [commander, partner] cmd damage you/your team have dealt this source (⚔ readout). */
  dealt: readonly number[];
  remoteMode: boolean;
  /** Show the player name instead of the commander name (host toggle). */
  showPlayerName?: boolean;
  /** This source is the active turn player (dot + highlight). */
  isActive?: boolean;
  startingLife: number;
  glass: boolean;
  fsName: number | string;
  fsStatBadge: number | string;
  fsValue: number | string;
  stepperSize: StepperSize;
  tooltipSlotProps?: object;
  /** Unique-ish key base so sibling rows' long-press tooltips don't collide. */
  keyPrefix: string;
  onChange: (isPartner: boolean, delta: number) => void;
  /** Tap the name — each panel opens its own snapshot / card preview. */
  onTapName: (isPartner: boolean) => void;
  /** Status-row visibility (2HG suppresses the team-shared poison). */
  statusShowTax?: boolean;
  statusShowPoison?: boolean;
  /** Append the opponent's ♥ life to the remote value (off for 2HG, where the
   *  team's shared life is shown once at the team level). */
  showLifeInValue?: boolean;
}

export function CommanderDamageRow({
  source,
  damage,
  dealt,
  remoteMode,
  showPlayerName = false,
  isActive = false,
  startingLife,
  glass,
  fsName,
  fsStatBadge,
  fsValue,
  stepperSize,
  tooltipSlotProps,
  keyPrefix,
  onChange,
  onTapName,
  statusShowTax = true,
  statusShowPoison = true,
  showLifeInValue = true,
}: CommanderDamageRowProps) {
  const eliminated = source.isEliminated;
  const dealtTotal = dealt[0] + dealt[1];
  const nameColor = eliminated ? 'text.disabled' : isActive ? 'primary.main' : 'text.secondary';

  return (
    <>
      <StepperControl
        label={`CMD Dmg — ${showPlayerName ? source.playerName : source.commander.name}`}
        labelNode={
          <Box sx={{ flex: 1, minWidth: 0, pt: 0 }}>
            <Stack direction="row" alignItems="center" spacing={0.5} sx={{ cursor: 'pointer', minWidth: 0 }} onClick={(e) => { e.stopPropagation(); onTapName(false); }}>
              {isActive && (
                <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: 'primary.main', flexShrink: 0, boxShadow: '0 0 4px 1px rgba(var(--mui-palette-primary-mainChannel) / 0.7)' }} />
              )}
              {remoteMode ? (
                <>
                  {/* Landscape: the column is narrow, so swap the name text for a
                      compact commander thumbnail (CMD view) or the player's first
                      initial (Player view). */}
                  <Box sx={{ display: 'none', flexShrink: 0, '@media (orientation: landscape)': { display: 'inline-flex', alignItems: 'center' } }}>
                    {showPlayerName ? (
                      <Typography sx={{ fontSize: 'clamp(22px, 3.8dvmax, 40px)', lineHeight: 1, fontWeight: 800, color: nameColor, textDecoration: eliminated ? 'line-through' : 'none' }}>
                        {source.playerName.charAt(0).toUpperCase()}
                      </Typography>
                    ) : (
                      <CommanderArt name={source.commander.name} title={source.commander.name} sx={{ height: 'clamp(18px, 3dvmax, 34px)', width: 'auto', borderRadius: 0.5, flexShrink: 0, opacity: eliminated ? 0.5 : 1 }} />
                    )}
                  </Box>
                  {/* Portrait: full name text. */}
                  <Typography sx={{ fontSize: fsName, color: nameColor, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: eliminated ? 'line-through' : 'none', fontWeight: isActive ? 700 : 400, flex: '0 1 auto', minWidth: 0, '@media (orientation: landscape)': { display: 'none' } }}>
                    {showPlayerName ? source.playerName : source.commander.name}
                  </Typography>
                </>
              ) : (
                <Typography sx={{ fontSize: fsName, color: nameColor, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: eliminated ? 'line-through' : 'none', fontWeight: isActive ? 700 : 400, flex: '0 1 auto', minWidth: 0 }}>
                  {showPlayerName ? source.playerName : source.commander.name}
                </Typography>
              )}
              <Tooltip title={`Dealt ${source.partner ? `${dealt[0]}/${dealt[1]}` : dealtTotal} commander damage to ${source.playerName}`} placement="top" slotProps={tooltipSlotProps} arrow><Typography sx={{ fontSize: fsName, fontWeight: 900, color: dealtTotal >= 21 ? 'error.main' : dealtTotal > 0 ? '#e67e22' : 'text.disabled', lineHeight: 1, flexShrink: 0 }}>⚔{source.partner ? `${dealt[0]}/${dealt[1]}` : dealtTotal}</Typography></Tooltip>
              {/* Spacer keeps name + sword left-aligned. */}
              <Box sx={{ flex: 1, minWidth: 0 }} />
            </Stack>
            <PlayerStatusBadges
              player={source}
              size={fsStatBadge}
              alwaysShow={remoteMode}
              showLife={!remoteMode}
              startingLife={startingLife}
              showTax={statusShowTax}
              showPoison={statusShowPoison}
              tooltipSlotProps={tooltipSlotProps}
              sx={{ mt: 0.15 }}
            />
          </Box>
        }
        glass={glass}
        value={damage[0]}
        max={remoteMode ? undefined : 21}
        maxFont={fsName}
        color={damage[0] >= 21 ? 'error.main' : eliminated ? 'text.disabled' : 'text.primary'}
        valueOnly={remoteMode}
        valueNode={remoteMode ? (
          <Stack direction="row" alignItems="baseline" spacing={0.75} sx={{ whiteSpace: 'nowrap' }}>
            {/* Cmd damage this source dealt you/your team (what the modal edits),
                then the opponent's live life total. */}
            <Typography sx={{ fontWeight: 800, fontSize: fsValue, lineHeight: 1, color: damage[0] >= 21 ? 'error.main' : eliminated ? 'text.disabled' : 'text.primary' }}>
              {damage[0]}<Box component="span" sx={{ fontSize: fsStatBadge, color: 'text.disabled' }}>/21</Box>
            </Typography>
            {showLifeInValue && (
              <Typography sx={{ fontWeight: 800, fontSize: fsName, lineHeight: 1, color: eliminated ? 'text.disabled' : lifeColor(source.life, startingLife) || 'primary.main' }}>
                ♥{source.life}
              </Typography>
            )}
          </Stack>
        ) : undefined}
        disableDec={eliminated}
        onDec={() => onChange(false, -1)}
        onInc={() => onChange(false, 1)}
        onDec5={() => onChange(false, -5)}
        onInc5={() => onChange(false, 5)}
        rowSpacing={remoteMode ? 0 : 0.5}
        size={stepperSize}
        tooltipSlotProps={tooltipSlotProps}
        lpKeyPrefix={keyPrefix}
      />
      {source.partner && (
        <StepperControl
          label={`CMD Dmg — ${source.partner.name}`}
          labelNode={
            <Typography onClick={(e) => { e.stopPropagation(); onTapName(true); }} sx={{ flex: 1, minWidth: 0, fontSize: fsName, color: eliminated ? 'text.disabled' : 'text.secondary', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textDecoration: eliminated ? 'line-through' : 'none', cursor: 'pointer' }}>
              {source.partner.name}
            </Typography>
          }
          glass={glass}
          value={damage[1]}
          max={21}
          maxFont={fsName}
          color={damage[1] >= 21 ? 'error.main' : eliminated ? 'text.disabled' : 'text.primary'}
          valueOnly={remoteMode}
          disableDec={eliminated}
          onDec={() => onChange(true, -1)}
          onInc={() => onChange(true, 1)}
          onDec5={() => onChange(true, -5)}
          onInc5={() => onChange(true, 5)}
          rowSpacing={remoteMode ? 0 : 0.5}
          size={stepperSize}
          tooltipSlotProps={tooltipSlotProps}
          lpKeyPrefix={`${keyPrefix}-p`}
        />
      )}
    </>
  );
}
