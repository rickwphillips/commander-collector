import { describe, it, expect, beforeEach, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import type { ReactNode } from 'react';
import { ThemeProvider, useThemeMode } from '@/components/ThemeProvider';

const wrapper = ({ children }: { children: ReactNode }) => <ThemeProvider>{children}</ThemeProvider>;

function prefersDark(dark: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: dark, media: query, addEventListener: vi.fn(), removeEventListener: vi.fn(),
  }));
}

beforeEach(() => {
  localStorage.clear();
  vi.unstubAllGlobals();
  prefersDark(false);
});

describe('ThemeProvider', () => {
  it('uses the saved mode', () => {
    localStorage.setItem('themeMode', 'dark');
    const { result } = renderHook(() => useThemeMode(), { wrapper });
    expect(result.current.mode).toBe('dark');
  });

  it('falls back to the OS scheme when nothing valid is saved', () => {
    prefersDark(true);
    localStorage.setItem('themeMode', 'sepia');
    const { result } = renderHook(() => useThemeMode(), { wrapper });
    expect(result.current.mode).toBe('dark');
  });

  it('toggleTheme switches and persists the mode', () => {
    const { result } = renderHook(() => useThemeMode(), { wrapper });
    act(() => result.current.toggleTheme());
    expect(result.current.mode).toBe('dark');
    expect(localStorage.getItem('themeMode')).toBe('dark');
  });
});
