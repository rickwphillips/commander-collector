'use client';

/**
 * Simplified Game Setup.
 *
 * Collects only table-wide options (player count, starting life, turn timer,
 * game type). Per-seat player/deck/commander selection now happens in-game
 * during the 'seating' phase via SeatPickerModal opened from each PlayerPanel.
 */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Stack,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  MenuItem,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import type { GameType } from '@/lib/types';

export interface GameSetupSubmit {
  playerCount: number;
  startingLife: number;
  turnTimerSeconds: number;
  gameType: GameType;
}

interface GameSetupProps {
  onStart: (payload: GameSetupSubmit) => void;
  /** Optional initial values, useful for restart-game prefill. */
  initial?: Partial<GameSetupSubmit>;
}

const LIFE_PRESETS = [20, 30, 40];

export function GameSetup({ onStart, initial }: GameSetupProps) {
  const router = useRouter();
  const [playerCount, setPlayerCount] = useState<number>(initial?.playerCount ?? 4);
  const [startingLife, setStartingLife] = useState<number>(initial?.startingLife ?? 40);
  const [customLife, setCustomLife] = useState<string>('');
  const [isCustomLife, setIsCustomLife] = useState(false);
  const [turnTimerSeconds, setTurnTimerSeconds] = useState<number>(initial?.turnTimerSeconds ?? 300);
  const [gameType, setGameType] = useState<GameType>(initial?.gameType ?? 'standard');

  // Two-Headed Giant is always four players (two teams of two) and starts each
  // team at 30 life per the official rules. Player count is forced to 4 in the
  // game-type change handler below; this effect keeps the life default in sync.
  useEffect(() => {
    if (!isCustomLife) {
      if (gameType === '2hg') setStartingLife(30);
      else setStartingLife(playerCount === 2 ? 30 : 40);
    }
  }, [playerCount, isCustomLife, gameType]);

  const handleGameTypeChange = (val: GameType) => {
    setGameType(val);
    if (val === '2hg') setPlayerCount(4);
  };

  const handleLifePreset = (_: React.MouseEvent<HTMLElement>, val: number | null) => {
    if (val === null) return;
    setStartingLife(val);
    setIsCustomLife(false);
    setCustomLife('');
  };

  const handleCustomLife = (val: string) => {
    setCustomLife(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      setStartingLife(num);
      setIsCustomLife(true);
    }
  };

  const handlePlayerCountChange = (_: React.MouseEvent<HTMLElement>, val: number | null) => {
    if (val === null) return;
    setPlayerCount(val);
  };

  const handleStart = () => {
    onStart({ playerCount, startingLife, turnTimerSeconds, gameType });
  };

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        px: 2,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#1A1410' : '#FFF8F0'),
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 560 }}>
        <Stack direction="row" alignItems="center" sx={{ mb: 3 }}>
          <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/games')} sx={{ mr: 1 }}>
            Back
          </Button>
          <Typography variant="h4" sx={{ fontWeight: 700, flex: 1, textAlign: 'center' }}>
            New Game
          </Typography>
        </Stack>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Stack spacing={3}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Players
                </Typography>
                <ToggleButtonGroup value={playerCount} exclusive onChange={handlePlayerCountChange} size="small">
                  <ToggleButton value={2} disabled={gameType === '2hg'}>2</ToggleButton>
                  <ToggleButton value={3} disabled={gameType === '2hg'}>3</ToggleButton>
                  <ToggleButton value={4}>4</ToggleButton>
                </ToggleButtonGroup>
                {gameType === '2hg' && (
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                    Two-Headed Giant is always 4 players (two teams of two).
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Starting Life
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                  <ToggleButtonGroup value={isCustomLife ? null : startingLife} exclusive onChange={handleLifePreset} size="small">
                    {LIFE_PRESETS.map((v) => (
                      <ToggleButton key={v} value={v}>
                        {v}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                  <TextField
                    label="Custom"
                    value={customLife}
                    onChange={(e) => handleCustomLife(e.target.value)}
                    size="small"
                    type="number"
                    inputProps={{ min: 1 }}
                    sx={{ width: 100 }}
                    placeholder="e.g. 30"
                  />
                </Stack>
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Turn Timer
                </Typography>
                <TextField
                  label="Seconds"
                  type="number"
                  size="small"
                  value={turnTimerSeconds}
                  onChange={(e) => setTurnTimerSeconds(Math.max(0, Number(e.target.value)))}
                  inputProps={{ min: 0 }}
                  sx={{ width: 180 }}
                />
              </Box>

              <Box>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                  Game Type
                </Typography>
                <TextField
                  select
                  size="small"
                  value={gameType}
                  onChange={(e) => handleGameTypeChange(e.target.value as GameType)}
                  sx={{ width: 200 }}
                >
                  <MenuItem value="standard">Standard</MenuItem>
                  <MenuItem value="2hg">Two-Headed Giant</MenuItem>
                </TextField>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Button variant="contained" size="large" fullWidth onClick={handleStart}>
          Continue to Seating
        </Button>
      </Box>
    </Box>
  );
}
