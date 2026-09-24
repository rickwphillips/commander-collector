import { describe, it, expect, vi, afterEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useNow } from '@/lib/useNow';

afterEach(() => vi.useRealTimers());

describe('useNow', () => {
  it('returns the current second and ticks every second', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-09-24T12:00:00.400Z'));
    const { result } = renderHook(() => useNow());
    expect(result.current).toBe(Date.parse('2026-09-24T12:00:00.000Z'));
    act(() => { vi.advanceTimersByTime(1000); });
    expect(result.current).toBe(Date.parse('2026-09-24T12:00:01.000Z'));
  });
});
