import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useHiddenStats } from '@/app/lib/useHiddenStats';

const HIDDEN_SECTIONS_KEY = 'commander_hidden_stats';
const HIDDEN_PANELS_KEY = 'commander_hidden_shared_panels';

describe('useHiddenStats', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with empty hiddenSections', async () => {
    const { result } = renderHook(() => useHiddenStats());
    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.hiddenSections.size).toBe(0);
  });

  it('starts with empty hiddenPanelIds', async () => {
    const { result } = renderHook(() => useHiddenStats());
    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.hiddenPanelIds.size).toBe(0);
  });

  it('loaded is true after mount', async () => {
    const { result } = renderHook(() => useHiddenStats());
    await waitFor(() => expect(result.current.loaded).toBe(true));
  });

  it('toggleSection hides a visible section', async () => {
    const { result } = renderHook(() => useHiddenStats());
    await waitFor(() => expect(result.current.loaded).toBe(true));
    act(() => { result.current.toggleSection('overall'); });
    expect(result.current.hiddenSections.has('overall')).toBe(true);
  });

  it('toggleSection shows a previously hidden section', async () => {
    const { result } = renderHook(() => useHiddenStats());
    await waitFor(() => expect(result.current.loaded).toBe(true));
    act(() => { result.current.toggleSection('overall'); });
    act(() => { result.current.toggleSection('overall'); });
    expect(result.current.hiddenSections.has('overall')).toBe(false);
  });

  it('toggleSection persists to localStorage', async () => {
    const { result } = renderHook(() => useHiddenStats());
    await waitFor(() => expect(result.current.loaded).toBe(true));
    act(() => { result.current.toggleSection('topPlayers'); });
    const stored = JSON.parse(localStorage.getItem(HIDDEN_SECTIONS_KEY)!);
    expect(stored).toContain('topPlayers');
  });

  it('showAll clears hiddenSections', async () => {
    const { result } = renderHook(() => useHiddenStats());
    await waitFor(() => expect(result.current.loaded).toBe(true));
    act(() => { result.current.toggleSection('overall'); });
    act(() => { result.current.toggleSection('h2h'); });
    act(() => { result.current.showAll(); });
    expect(result.current.hiddenSections.size).toBe(0);
  });

  it('showAll persists empty set to localStorage', async () => {
    const { result } = renderHook(() => useHiddenStats());
    await waitFor(() => expect(result.current.loaded).toBe(true));
    act(() => { result.current.toggleSection('overall'); });
    act(() => { result.current.showAll(); });
    expect(localStorage.getItem(HIDDEN_SECTIONS_KEY)).toBe('[]');
  });

  it('hideAll hides specified sections', async () => {
    const { result } = renderHook(() => useHiddenStats());
    await waitFor(() => expect(result.current.loaded).toBe(true));
    act(() => { result.current.hideAll(['overall', 'h2h', 'colorMeta']); });
    expect(result.current.hiddenSections.has('overall')).toBe(true);
    expect(result.current.hiddenSections.has('h2h')).toBe(true);
    expect(result.current.hiddenSections.has('colorMeta')).toBe(true);
    expect(result.current.hiddenSections.size).toBe(3);
  });

  it('togglePanelVisibility hides a panel', async () => {
    const { result } = renderHook(() => useHiddenStats());
    await waitFor(() => expect(result.current.loaded).toBe(true));
    act(() => { result.current.togglePanelVisibility(42); });
    expect(result.current.hiddenPanelIds.has(42)).toBe(true);
  });

  it('togglePanelVisibility shows a hidden panel when toggled again', async () => {
    const { result } = renderHook(() => useHiddenStats());
    await waitFor(() => expect(result.current.loaded).toBe(true));
    act(() => { result.current.togglePanelVisibility(42); });
    act(() => { result.current.togglePanelVisibility(42); });
    expect(result.current.hiddenPanelIds.has(42)).toBe(false);
  });

  it('togglePanelVisibility persists to localStorage', async () => {
    const { result } = renderHook(() => useHiddenStats());
    await waitFor(() => expect(result.current.loaded).toBe(true));
    act(() => { result.current.togglePanelVisibility(7); });
    const stored = JSON.parse(localStorage.getItem(HIDDEN_PANELS_KEY)!);
    expect(stored).toContain(7);
  });

  it('restores hiddenSections from localStorage on mount', async () => {
    localStorage.setItem(HIDDEN_SECTIONS_KEY, JSON.stringify(['overall', 'twoHg']));
    const { result } = renderHook(() => useHiddenStats());
    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.hiddenSections.has('overall')).toBe(true);
    expect(result.current.hiddenSections.has('twoHg')).toBe(true);
  });

  it('restores hiddenPanelIds from localStorage on mount', async () => {
    localStorage.setItem(HIDDEN_PANELS_KEY, JSON.stringify([3, 14]));
    const { result } = renderHook(() => useHiddenStats());
    await waitFor(() => expect(result.current.loaded).toBe(true));
    expect(result.current.hiddenPanelIds.has(3)).toBe(true);
    expect(result.current.hiddenPanelIds.has(14)).toBe(true);
  });
});
