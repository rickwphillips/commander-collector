'use client';

import { useState } from 'react';
import {
  Button,
  Menu,
  MenuItem,
  ListItemText,
  ListSubheader,
  Divider,
  Typography,
} from '@mui/material';
import ViewListIcon from '@mui/icons-material/ViewList';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import type { StatPanel } from '../lib/types';

interface ViewSelectorProps {
  activeView: 'default' | number;
  onViewChange: (view: 'default' | number) => void;
  ownPanels: StatPanel[];
  sharedPanels: StatPanel[];
}

export function ViewSelector({
  activeView,
  onViewChange,
  ownPanels,
  sharedPanels,
}: ViewSelectorProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const allPanels = [...ownPanels, ...sharedPanels];
  const activePanel = activeView !== 'default' ? allPanels.find((p) => p.id === activeView) : null;
  const label = activePanel ? activePanel.name : 'Default View';

  return (
    <>
      <Button
        variant="outlined"
        size="small"
        startIcon={<ViewListIcon />}
        endIcon={<KeyboardArrowDownIcon />}
        onClick={(e) => setAnchorEl(e.currentTarget)}
        sx={{ textTransform: 'none', minWidth: 140 }}
      >
        <Typography variant="body2" noWrap sx={{ maxWidth: 120 }}>
          {label}
        </Typography>
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        slotProps={{ paper: { sx: { minWidth: 200, maxHeight: 400 } } }}
      >
        <MenuItem
          selected={activeView === 'default'}
          onClick={() => {
            onViewChange('default');
            setAnchorEl(null);
          }}
        >
          <ListItemText primary="Default View" secondary="All sections" />
        </MenuItem>

        {ownPanels.length > 0 && [
          <Divider key="own-divider" />,
          <ListSubheader key="own-header">My Panels</ListSubheader>,
          ...ownPanels.map((panel) => (
            <MenuItem
              key={panel.id}
              selected={activeView === panel.id}
              onClick={() => {
                onViewChange(panel.id);
                setAnchorEl(null);
              }}
            >
              <ListItemText primary={panel.name} secondary={`${panel.sections.length} sections`} />
            </MenuItem>
          )),
        ]}

        {sharedPanels.length > 0 && [
          <Divider key="shared-divider" />,
          <ListSubheader key="shared-header">Shared</ListSubheader>,
          ...sharedPanels.map((panel) => (
            <MenuItem
              key={panel.id}
              selected={activeView === panel.id}
              onClick={() => {
                onViewChange(panel.id);
                setAnchorEl(null);
              }}
            >
              <ListItemText
                primary={panel.name}
                secondary={
                  panel.owner_name ? `by ${panel.owner_name}` : `${panel.sections.length} sections`
                }
              />
            </MenuItem>
          )),
        ]}
      </Menu>
    </>
  );
}
