'use client';

import { Box, IconButton, Tooltip } from '@mui/material';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import LogoutIcon from '@mui/icons-material/Logout';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import SettingsIcon from '@mui/icons-material/Settings';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useThemeMode } from './ThemeProvider';
import { useAuth } from './AuthGuard';

const HANDLE_W = 48;
const BUTTON_W = 48; // per button
const AUTO_CLOSE_MS = 3000;

export function SettingsTab() {
  const { mode, toggleTheme } = useThemeMode();
  const { user, logout } = useAuth();
  const router = useRouter();
  const isAdmin = user?.role === 'admin';
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scheduleClose = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setOpen(false), AUTO_CLOSE_MS);
  };

  const handleToggle = () => {
    if (open) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setOpen(false);
    } else {
      setOpen(true);
      scheduleClose();
    }
  };

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const buttonCount = (user ? 2 : 1) + (isAdmin ? 1 : 0);
  const expandedW = HANDLE_W + buttonCount * BUTTON_W;

  return (
    <Box
      onMouseEnter={() => { if (open) scheduleClose(); }}
      sx={{
        position: 'fixed',
        top: 16,
        right: 0,
        zIndex: 1200,
        // Grows leftward: right edge stays pinned, width expands left
        width: open ? expandedW : HANDLE_W,
        overflow: 'hidden',
        transition: 'width 0.25s cubic-bezier(0.4,0,0.2,1)',
        backgroundColor: 'background.paper',
        borderRadius: '10px 0 0 10px',
        boxShadow: 4,
        // row-reverse: handle sits at the RIGHT, buttons fill in to the LEFT
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center',
      }}
    >
      {/* Handle — always the rightmost element */}
      <IconButton
        onClick={handleToggle}
        color="inherit"
        aria-label="toggle settings"
        sx={{
          flexShrink: 0,
          width: HANDLE_W,
          height: HANDLE_W,
          borderRadius: 0,
        }}
      >
        <SettingsIcon
          sx={{
            transition: 'transform 0.3s',
            transform: open ? 'rotate(45deg)' : 'rotate(0deg)',
          }}
        />
      </IconButton>

      {/* Buttons — revealed to the left of the handle as width expands */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'row-reverse',
          alignItems: 'center',
          opacity: open ? 1 : 0,
          transition: 'opacity 0.15s',
          pointerEvents: open ? 'auto' : 'none',
        }}
      >
        <Tooltip title={mode === 'light' ? 'Dark mode' : 'Light mode'} placement="left">
          <IconButton
            onClick={() => { toggleTheme(); scheduleClose(); }}
            color="inherit"
            aria-label="toggle dark mode"
            sx={{ flexShrink: 0, width: BUTTON_W, height: HANDLE_W, borderRadius: 0 }}
          >
            {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </Tooltip>

        {user && (
          <Tooltip title={`Sign out (${user.display_name})`} placement="left">
            <IconButton
              onClick={logout}
              color="inherit"
              aria-label="sign out"
              sx={{ flexShrink: 0, width: BUTTON_W, height: HANDLE_W, borderRadius: 0 }}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        )}

        {isAdmin && (
          <Tooltip title="Admin" placement="left">
            <IconButton
              onClick={() => { router.push('/admin'); scheduleClose(); }}
              color="inherit"
              aria-label="admin"
              sx={{ flexShrink: 0, width: BUTTON_W, height: HANDLE_W, borderRadius: 0 }}
            >
              <AdminPanelSettingsIcon />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}
