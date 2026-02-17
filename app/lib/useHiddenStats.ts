import { useState, useCallback, useEffect } from 'react';
import type { StatsSectionId } from './statsSections';

const HIDDEN_SECTIONS_KEY = 'commander_hidden_stats';
const HIDDEN_PANELS_KEY = 'commander_hidden_shared_panels';

function loadSet<T extends string | number>(key: string): Set<T> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as T[]);
  } catch {
    return new Set();
  }
}

function saveSet<T extends string | number>(key: string, set: Set<T>) {
  localStorage.setItem(key, JSON.stringify([...set]));
}

export function useHiddenStats() {
  const [hiddenSections, setHiddenSections] = useState<Set<StatsSectionId>>(new Set());
  const [hiddenPanelIds, setHiddenPanelIds] = useState<Set<number>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- same pattern as ThemeProvider: must read localStorage on mount
    setHiddenSections(loadSet<StatsSectionId>(HIDDEN_SECTIONS_KEY));
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHiddenPanelIds(loadSet<number>(HIDDEN_PANELS_KEY));
    setLoaded(true);
  }, []);

  const toggleSection = useCallback((id: StatsSectionId) => {
    setHiddenSections(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      saveSet(HIDDEN_SECTIONS_KEY, next);
      return next;
    });
  }, []);

  const showAll = useCallback(() => {
    const empty = new Set<StatsSectionId>();
    setHiddenSections(empty);
    saveSet(HIDDEN_SECTIONS_KEY, empty);
  }, []);

  const hideAll = useCallback((ids: StatsSectionId[]) => {
    const all = new Set<StatsSectionId>(ids);
    setHiddenSections(all);
    saveSet(HIDDEN_SECTIONS_KEY, all);
  }, []);

  const togglePanelVisibility = useCallback((panelId: number) => {
    setHiddenPanelIds(prev => {
      const next = new Set(prev);
      if (next.has(panelId)) next.delete(panelId);
      else next.add(panelId);
      saveSet(HIDDEN_PANELS_KEY, next);
      return next;
    });
  }, []);

  return { hiddenSections, toggleSection, showAll, hideAll, hiddenPanelIds, togglePanelVisibility, loaded };
}
