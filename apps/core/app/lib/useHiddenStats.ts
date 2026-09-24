import { useCallback, useMemo, useSyncExternalStore } from 'react';
import type { StatsSectionId } from './statsSections';

const HIDDEN_SECTIONS_KEY = 'commander_hidden_stats';
const HIDDEN_PANELS_KEY = 'commander_hidden_shared_panels';
/** Fired on this tab when a hidden set is saved; other tabs get `storage`. */
const CHANGE_EVENT = 'commander-hidden-stats-change';

// The hidden sets live in localStorage, an external store read with
// useSyncExternalStore. Snapshots are the raw stored strings (compared by
// value); the server snapshot is null, so nothing is hidden until the client
// value is read.
function subscribe(onChange: () => void): () => void {
  window.addEventListener(CHANGE_EVENT, onChange);
  window.addEventListener('storage', onChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, onChange);
    window.removeEventListener('storage', onChange);
  };
}

function readRaw(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function parseSet<T extends string | number>(raw: string | null): Set<T> {
  if (!raw) return new Set();
  try {
    return new Set(JSON.parse(raw) as T[]);
  } catch {
    return new Set();
  }
}

function saveSet<T extends string | number>(key: string, set: Set<T>) {
  localStorage.setItem(key, JSON.stringify([...set]));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

/** Toggle one id in the stored set, reading the store so it never acts on stale state. */
function toggleStored<T extends string | number>(key: string, id: T) {
  const next = parseSet<T>(readRaw(key));
  if (next.has(id)) next.delete(id);
  else next.add(id);
  saveSet(key, next);
}

const readSections = () => readRaw(HIDDEN_SECTIONS_KEY);
const readPanels = () => readRaw(HIDDEN_PANELS_KEY);
const readNothing = () => null;
const subscribeNothing = () => () => {};
const onClient = () => true;
const onServer = () => false;

export function useHiddenStats() {
  const sectionsRaw = useSyncExternalStore(subscribe, readSections, readNothing);
  const panelsRaw = useSyncExternalStore(subscribe, readPanels, readNothing);
  const hiddenSections = useMemo(() => parseSet<StatsSectionId>(sectionsRaw), [sectionsRaw]);
  const hiddenPanelIds = useMemo(() => parseSet<string>(panelsRaw), [panelsRaw]);
  /** True once the stored preferences have been read (on the client). */
  const loaded = useSyncExternalStore(subscribeNothing, onClient, onServer);

  const toggleSection = useCallback((id: StatsSectionId) => {
    toggleStored(HIDDEN_SECTIONS_KEY, id);
  }, []);

  const showAll = useCallback(() => {
    saveSet(HIDDEN_SECTIONS_KEY, new Set<StatsSectionId>());
  }, []);

  const hideAll = useCallback((ids: StatsSectionId[]) => {
    saveSet(HIDDEN_SECTIONS_KEY, new Set<StatsSectionId>(ids));
  }, []);

  const togglePanelVisibility = useCallback((panelId: string) => {
    toggleStored(HIDDEN_PANELS_KEY, panelId);
  }, []);

  return {
    hiddenSections,
    toggleSection,
    showAll,
    hideAll,
    hiddenPanelIds,
    togglePanelVisibility,
    loaded,
  };
}
