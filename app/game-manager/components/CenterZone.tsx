'use client';

import { useState, useRef } from 'react';
import {
  Box,
  Stack,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Tooltip,
} from '@mui/material';
import CasinoIcon from '@mui/icons-material/Casino';
import CloseIcon from '@mui/icons-material/Close';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import NotesIcon from '@mui/icons-material/Notes';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import type { PlayerState } from '../types';

type RollPhase = 'idle' | 'rolling' | 'done';

interface CenterZoneProps {
  turnNumber: number;
  currentPlayerIdx: number;
  players: PlayerState[];
  rollPhase: RollPhase;
  rolledPlayerName?: string;
  firstPlayerSet: boolean;
  onNextTurn: () => void;
  onPrevTurn: () => void;
  onEndGame: () => void;
  onRollForFirst: () => void;
  onAcceptFirstPlayer: () => void;
  onChooseFirstPlayer: (idx: number) => void;
  onRollAgain: () => void;
  onRestartGame: () => void;
  turnTimerSeconds: number;
  onTimerChange: (seconds: number) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  notes: string;
  onNotesChange: (notes: string) => void;
  textSizeMode: 0 | 1 | 2;
  onCycleTextSizeMode: () => void;
}

function rollDie(sides: number): number {
  return Math.floor(Math.random() * sides) + 1;
}

export function CenterZone({
  turnNumber,
  currentPlayerIdx,
  players,
  rollPhase,
  rolledPlayerName,
  firstPlayerSet,
  onNextTurn,
  onPrevTurn,
  onEndGame,
  onRollForFirst,
  onAcceptFirstPlayer,
  onChooseFirstPlayer,
  onRollAgain,
  onRestartGame,
  turnTimerSeconds,
  onTimerChange,
  isFullscreen,
  onToggleFullscreen,
  notes,
  onNotesChange,
  textSizeMode,
  onCycleTextSizeMode,
}: CenterZoneProps) {
  type RollEntry = { label: string; rolls: (number | string)[]; total: number | null; color: string };
  const [history, setHistory] = useState<RollEntry[]>([]);
  const [resultKey, setResultKey] = useState(0);
  const [diceCount, setDiceCount] = useState(1);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [confirmRestart, setConfirmRestart] = useState(false);
  const [diceOpen, setDiceOpen] = useState(false);
  const [notesOpen, setNotesOpen] = useState(false);
  const [notesDraft, setNotesDraft] = useState('');
  const [prevTurnTooltip, setPrevTurnTooltip] = useState(false);
  const [choosingFirst, setChoosingFirst] = useState(false);
  const lpTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lpFired = useRef(false);

  const addRoll = (label: string, sides: number | null) => {
    if (sides === null) {
      const rolls = Array.from({ length: diceCount }, () => Math.random() < 0.5 ? 'Heads' : 'Tails');
      setHistory((prev) => [...prev, { label: diceCount === 1 ? 'Coin Flip' : `${diceCount}× Coin`, rolls, total: null, color: 'primary.main' }]);
    } else {
      const rolls = Array.from({ length: diceCount }, () => rollDie(sides));
      const total = rolls.reduce((a, b) => (a as number) + (b as number), 0) as number;
      const color = sides === 20 && diceCount === 1 ? (rolls[0] === 20 ? '#DAA520' : rolls[0] === 1 ? 'error.main' : 'primary.main') : 'primary.main';
      setHistory((prev) => [...prev, { label: diceCount === 1 ? `d${sides}` : `${diceCount}d${sides}`, rolls, total: diceCount > 1 ? total : null, color }]);
    }
    setResultKey((k) => k + 1);
  };

  const lastEntry = history.length > 0 ? history[history.length - 1] : null;

  const currentPlayer = players[currentPlayerIdx];

  return (
    <>
      <Card
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#1A1410' : '#FFF8F0',
          border: (theme) => `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
          transition: 'none',
          '&:hover': { transform: 'none', boxShadow: 'none' },
        }}
      >
        {/* Main content */}
        <CardContent sx={{ flex: 1, p: 1.5, '&:last-child': { pb: 1.5 }, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 1 }}>

          {/* Turn tracker */}
          {firstPlayerSet && (
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%', px: 1 }}>
              {/* Left side — rotated for left-panel player */}
              <Box sx={{ transform: 'rotate(90deg)', textAlign: 'center', whiteSpace: 'normal', overflowWrap: 'break-word', maxWidth: 120 }}>
                <Typography sx={{ fontWeight: 900, fontSize: 36, color: 'primary.main', lineHeight: 1 }}>
                  Turn {turnNumber}
                </Typography>
                <Typography sx={{ fontSize: 16, fontWeight: 600, color: 'text.primary', lineHeight: 1.2 }}>
                  {currentPlayer?.commander.name ?? '—'}
                </Typography>
                <Typography sx={{ fontSize: 13, color: 'text.secondary', lineHeight: 1.3 }}>
                  {currentPlayer?.playerName ?? '—'}
                </Typography>
              </Box>

              <Tooltip open={prevTurnTooltip} title="Previous Turn" placement="top" disableFocusListener disableHoverListener disableTouchListener>
                <Button
                  variant="contained"
                  onClick={() => { if (lpFired.current) { lpFired.current = false; return; } onNextTurn(); }}
                  onPointerDown={() => {
                    lpFired.current = false;
                    lpTimer.current = setTimeout(() => {
                      lpFired.current = true;
                      onPrevTurn();
                      setPrevTurnTooltip(true);
                      setTimeout(() => setPrevTurnTooltip(false), 700);
                    }, 500);
                  }}
                  onPointerUp={() => { if (lpTimer.current) { clearTimeout(lpTimer.current); lpTimer.current = null; } }}
                  onPointerLeave={() => { if (lpTimer.current) { clearTimeout(lpTimer.current); lpTimer.current = null; } }}
                  onPointerCancel={() => { if (lpTimer.current) { clearTimeout(lpTimer.current); lpTimer.current = null; } }}
                  sx={{ width: 150, height: 150, fontSize: 24, fontWeight: 700, borderRadius: 2, lineHeight: 1.2, flexShrink: 0 }}
                >
                  Next<br />Turn
                </Button>
              </Tooltip>

              {/* Right side — rotated for right-panel player */}
              <Box sx={{ transform: 'rotate(-90deg)', textAlign: 'center', whiteSpace: 'normal', overflowWrap: 'break-word', maxWidth: 120 }}>
                <Typography sx={{ fontWeight: 900, fontSize: 36, color: 'primary.main', lineHeight: 1 }}>
                  Turn {turnNumber}
                </Typography>
                <Typography sx={{ fontSize: 16, fontWeight: 600, color: 'text.primary', lineHeight: 1.2 }}>
                  {currentPlayer?.commander.name ?? '—'}
                </Typography>
                <Typography sx={{ fontSize: 13, color: 'text.secondary', lineHeight: 1.3 }}>
                  {currentPlayer?.playerName ?? '—'}
                </Typography>
              </Box>
            </Stack>
          )}

          {/* Roll for first player */}
          {!firstPlayerSet && <Box sx={{ textAlign: 'center', width: '100%' }}>
            {(rollPhase === 'rolling') && rolledPlayerName && (
              <Typography variant="caption" sx={{ fontWeight: 600, color: '#DAA520', display: 'block', mb: 0.75, fontSize: 13 }}>
                <Box key={rolledPlayerName} component="span" sx={{ display: 'inline-block', fontSize: 22, fontWeight: 900, fontStyle: 'italic', letterSpacing: 0.5, animation: 'nameFlash 0.18s cubic-bezier(0.34,1.56,0.64,1)', '@keyframes nameFlash': { '0%': { opacity: 0, transform: 'scale(0.7) translateY(-6px)' }, '100%': { opacity: 1, transform: 'scale(1) translateY(0)' } } }}>
                  {rolledPlayerName}
                </Box>
                <Box component="span" sx={{ color: 'text.primary', fontStyle: 'normal', fontWeight: 300, fontSize: 18 }}>{' goes first!'}</Box>
              </Typography>
            )}
            {(rollPhase === 'idle' || rollPhase === 'rolling') && !choosingFirst && (
              <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="flex-end">
                <Button
                  variant="contained"
                  onClick={onRollForFirst}
                  disabled={rollPhase === 'rolling'}
                  sx={{ width: 110, height: 110, flexDirection: 'column', gap: 0.75, fontSize: 13, fontWeight: 700, borderRadius: 2, flexShrink: 0 }}
                >
                  <svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor">
                    <path d="M12 2L2 19h20L12 2zm0 4l7 13H5l7-13zm-1 5v4h2v-4h-2zm0 5v2h2v-2h-2z" />
                  </svg>
                  {rollPhase === 'rolling' ? 'Rolling…' : 'Roll'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => setChoosingFirst(true)}
                  disabled={rollPhase === 'rolling'}
                  sx={{ width: 80, height: 80, flexDirection: 'column', fontSize: 11, fontWeight: 600, borderRadius: 2, flexShrink: 0 }}
                >
                  Choose
                </Button>
              </Stack>
            )}
            {(rollPhase === 'idle' || rollPhase === 'rolling') && choosingFirst && (
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.secondary', display: 'block', mb: 1 }}>
                  Who goes first?
                </Typography>
                <Stack spacing={0.5}>
                  {players.map((p, idx) => (
                    <Button key={idx} variant="outlined" onClick={() => { onChooseFirstPlayer(idx); setChoosingFirst(false); }} sx={{ fontSize: 12, py: 0.75 }}>
                      {p.playerName}
                    </Button>
                  ))}
                </Stack>
                <Button size="small" onClick={() => setChoosingFirst(false)} sx={{ mt: 1, fontSize: 10, color: 'text.disabled' }}>
                  Cancel
                </Button>
              </Box>
            )}
            {rollPhase === 'done' && (
              <Box>
                <Typography variant="caption" sx={{ fontWeight: 600, color: '#DAA520', display: 'block', mb: 0.75, fontSize: 13 }}>
                  <Box component="span" sx={{
                    display: 'inline-block',
                    fontSize: 22, fontWeight: 900, fontStyle: 'italic', letterSpacing: 0.5,
                    animation: 'nameSizzle 0.5s cubic-bezier(0.34,1.56,0.64,1), nameGlow 2s ease-in-out 0.5s infinite alternate',
                    '@keyframes nameSizzle': {
                      '0%':   { opacity: 0, transform: 'scale(1.5)', textShadow: '0 0 32px rgba(255,215,0,1)' },
                      '70%':  { transform: 'scale(0.95)',             textShadow: '0 0 8px rgba(255,215,0,0.6)' },
                      '100%': { opacity: 1, transform: 'scale(1)',    textShadow: '0 0 14px rgba(255,215,0,0.8)' },
                    },
                    '@keyframes nameGlow': {
                      '0%':   { textShadow: '0 0 6px rgba(255,215,0,0.5)' },
                      '100%': { textShadow: '0 0 18px rgba(255,215,0,1), 0 0 32px rgba(255,165,0,0.6)' },
                    },
                  }}>
                    {rolledPlayerName}
                  </Box>
                  <Box component="span" sx={{ color: 'text.primary', fontStyle: 'normal', fontWeight: 300, fontSize: 18 }}>{' goes first!'}</Box>
                </Typography>
                <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="flex-end">
                  <Button variant="contained" onClick={onAcceptFirstPlayer} sx={{ width: 110, height: 110, fontSize: 13, fontWeight: 700, borderRadius: 2 }}>Accept</Button>
                  <Button variant="outlined" onClick={onRollAgain} sx={{ width: 80, height: 80, fontSize: 11, fontWeight: 600, borderRadius: 2 }}>Roll Again</Button>
                </Stack>
              </Box>
            )}
          </Box>}

          {/* Fullscreen toggle */}
          <IconButton
            onClick={onToggleFullscreen}
            sx={{ position: 'absolute', bottom: 6, left: 6, color: 'text.secondary' }}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <FullscreenExitIcon sx={{ fontSize: 20 }} /> : <FullscreenIcon sx={{ fontSize: 20 }} />}
          </IconButton>

          {/* Notes button */}
          <IconButton
            onClick={() => { setNotesDraft(notes); setNotesOpen(true); }}
            sx={{ position: 'absolute', bottom: 6, left: 34, color: notes.trim() ? 'primary.main' : 'text.secondary' }}
            title="Game Notes"
          >
            <NotesIcon sx={{ fontSize: 20 }} />
          </IconButton>

          {/* Text size cycle toggle (0=normal, 1=large, 2=xl) */}
          <Tooltip title={textSizeMode === 0 ? 'Normal Text' : textSizeMode === 1 ? 'Large Text' : 'Extra-Large Text'} placement="top">
            <IconButton
              onClick={onCycleTextSizeMode}
              sx={{
                position: 'absolute', bottom: 6, left: 62,
                color: textSizeMode === 2 ? 'warning.main' : textSizeMode === 1 ? 'primary.main' : 'text.secondary',
              }}
            >
              <TextFieldsIcon sx={{ fontSize: textSizeMode === 2 ? 24 : textSizeMode === 1 ? 22 : 20 }} />
            </IconButton>
          </Tooltip>

          {/* Dice & More toggle */}
          <IconButton
            onClick={() => setDiceOpen(true)}
            sx={{ position: 'absolute', bottom: 6, right: 6, color: 'text.secondary' }}
            title="Dice & More"
          >
            <CasinoIcon sx={{ fontSize: 20 }} />
          </IconButton>
        </CardContent>

        {/* Dice & More overlay */}
        {diceOpen && (
          <Box sx={{
            position: 'absolute',
            inset: 0,
            bgcolor: (theme) => theme.palette.mode === 'dark' ? '#1A1410EE' : '#FFF8F0EE',
            zIndex: 10,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            p: 1.5,
          }}>
            {/* Header */}
            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ width: '100%' }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                Dice / Flips
              </Typography>
              <IconButton size="small" onClick={() => setDiceOpen(false)} sx={{ p: 0.25 }}>
                <CloseIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Stack>

            {/* Latest result — big display */}
            <Box sx={{ minHeight: 80, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {lastEntry ? (
                <Box key={resultKey} sx={{
                  position: 'relative', width: '100%', textAlign: 'center',
                  animation: 'diceResultPop 0.35s cubic-bezier(0.34,1.56,0.64,1)',
                  '@keyframes diceResultPop': {
                    '0%':   { opacity: 0, transform: 'scale(0.4) translateY(12px)' },
                    '100%': { opacity: 1, transform: 'scale(1)   translateY(0)'    },
                  },
                }}>
                  {lastEntry.rolls.length === 1 ? (
                    <Typography sx={{ fontWeight: 900, fontSize: 48, lineHeight: 1, color: lastEntry.color }}>
                      {lastEntry.rolls[0]}
                    </Typography>
                  ) : (
                    <>
                      <Stack direction="row" flexWrap="wrap" justifyContent="center" gap={1}>
                        {lastEntry.rolls.map((r, i) => (
                          <Box key={i} sx={{ textAlign: 'center' }}>
                            <Typography sx={{ fontSize: 9, color: 'text.disabled' }}>{i + 1}</Typography>
                            <Typography sx={{ fontWeight: 900, fontSize: 32, lineHeight: 1, color: lastEntry.color }}>{r}</Typography>
                          </Box>
                        ))}
                      </Stack>
                      {lastEntry.total !== null && (
                        <Typography sx={{ fontSize: 11, color: 'text.secondary', mt: 0.5 }}>
                          total: {lastEntry.total}
                        </Typography>
                      )}
                    </>
                  )}
                  <Typography sx={{ fontSize: 10, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1, mt: 1.5 }}>
                    {lastEntry.label}
                  </Typography>
                </Box>
              ) : (
                <Typography sx={{ fontSize: 11, color: 'text.disabled' }}>—</Typography>
              )}
            </Box>


            {/* Buttons */}
            <Box sx={{ width: '100%' }}>
              <Stack direction="row" spacing={0.5} justifyContent="center" sx={{ mb: 0.75 }}>
                <Button variant="outlined" size="small" onClick={() => addRoll('d6', 6)} sx={{ fontSize: 11, px: 1.5 }}>d6</Button>
                <Button variant="outlined" size="small" onClick={() => addRoll('d20', 20)} sx={{ fontSize: 11, px: 1.5 }}>d20</Button>
                <Button variant="outlined" size="small" onClick={() => addRoll('coin', null)} sx={{ fontSize: 11, px: 1.5 }}>Flip Coin</Button>
              </Stack>
              <Stack direction="row" alignItems="center" justifyContent="space-between">
                {/* Dice count — bottom left */}
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Button size="small" variant="outlined" onClick={() => setDiceCount((c) => Math.max(1, c - 1))} sx={{ minWidth: 24, px: 0, fontSize: 14 }}>−</Button>
                  <Typography sx={{ fontWeight: 700, fontSize: 13, minWidth: 20, textAlign: 'center' }}>{diceCount}</Typography>
                  <Button size="small" variant="outlined" onClick={() => setDiceCount((c) => Math.min(20, c + 1))} sx={{ minWidth: 24, px: 0, fontSize: 14 }}>+</Button>
                  <Typography sx={{ fontSize: 10, color: 'text.secondary' }}>dice</Typography>
                </Stack>
                {/* Game actions — bottom right */}
                <Stack direction="row" spacing={0.5} alignItems="center">
                  {history.length > 0 && <Button variant="text" size="small" onClick={() => setHistory([])} sx={{ fontSize: 10, px: 0.5, color: 'text.disabled' }}>Clear</Button>}
                  <Button variant="outlined" color="error" size="small" onClick={() => setConfirmEnd(true)} sx={{ fontSize: 11, px: 1 }}>End Game</Button>
                  <Button variant="outlined" size="small" onClick={() => setConfirmRestart(true)} sx={{ fontSize: 11, px: 1 }}>Restart</Button>
                </Stack>
              </Stack>
            </Box>
          </Box>
        )}
      </Card>

      <Dialog open={confirmRestart} onClose={() => setConfirmRestart(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Restart Game?</DialogTitle>
        <DialogContent>
          <Typography>This will clear the current game and return to setup.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmRestart(false)}>Cancel</Button>
          <Button onClick={() => { setConfirmRestart(false); onRestartGame(); }} variant="contained">
            Restart
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={confirmEnd} onClose={() => setConfirmEnd(false)} maxWidth="xs" fullWidth>
        <DialogTitle>End Game?</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to end the current game?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmEnd(false)}>Cancel</Button>
          <Button
            onClick={() => {
              setConfirmEnd(false);
              onEndGame();
            }}
            color="error"
            variant="contained"
          >
            End Game
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={notesOpen} onClose={() => setNotesOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Game Notes</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            fullWidth
            minRows={5}
            maxRows={12}
            value={notesDraft}
            onChange={(e) => setNotesDraft(e.target.value)}
            placeholder="Add notes about this game..."
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotesOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={() => { onNotesChange(notesDraft); setNotesOpen(false); }}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
