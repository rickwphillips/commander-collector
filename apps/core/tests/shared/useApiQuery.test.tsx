import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useApiQuery } from '../../../../packages/shared/src/lib/useApiQuery';

describe('useApiQuery', () => {
  it('starts in loading state', () => {
    const { result } = renderHook(() => useApiQuery(() => Promise.resolve('data')));
    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('resolves data and clears loading', async () => {
    const { result } = renderHook(() => useApiQuery(() => Promise.resolve({ items: [1, 2, 3] })));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toEqual({ items: [1, 2, 3] });
    expect(result.current.error).toBeNull();
  });

  it('sets error on rejection', async () => {
    const { result } = renderHook(() =>
      useApiQuery(() => Promise.reject(new Error('Network error')))
    );
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toBeNull();
    expect(result.current.error).toBe('Network error');
  });

  it('sets generic error for non-Error rejections', async () => {
    const { result } = renderHook(() =>
      useApiQuery(() => Promise.reject('some string'))
    );
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toBe('Request failed');
  });

  it('refetch re-calls the fetcher', async () => {
    let callCount = 0;
    const fetcher = vi.fn(() => Promise.resolve(++callCount));
    const { result } = renderHook(() => useApiQuery(fetcher));

    await waitFor(() => expect(result.current.data).toBe(1));
    expect(fetcher).toHaveBeenCalledTimes(1);

    await act(() => result.current.refetch());
    expect(result.current.data).toBe(2);
    expect(fetcher).toHaveBeenCalledTimes(2);
  });

  it('refetch clears previous error', async () => {
    let shouldFail = true;
    const fetcher = () => shouldFail ? Promise.reject(new Error('fail')) : Promise.resolve('ok');
    const { result } = renderHook(() => useApiQuery(fetcher));

    await waitFor(() => expect(result.current.error).toBe('fail'));

    shouldFail = false;
    await act(() => result.current.refetch());
    expect(result.current.error).toBeNull();
    expect(result.current.data).toBe('ok');
  });

  it('setData allows optimistic updates', async () => {
    const { result } = renderHook(() => useApiQuery(() => Promise.resolve([1, 2, 3])));
    await waitFor(() => expect(result.current.data).toEqual([1, 2, 3]));

    act(() => result.current.setData([1, 2]));
    expect(result.current.data).toEqual([1, 2]);
  });

  it('re-fetches when deps change', async () => {
    let id = 1;
    const fetcher = vi.fn(() => Promise.resolve(`item-${id}`));
    const { result, rerender } = renderHook(
      ({ depId }) => useApiQuery(() => fetcher(), [depId]),
      { initialProps: { depId: 1 } }
    );

    await waitFor(() => expect(result.current.data).toBe('item-1'));

    id = 2;
    rerender({ depId: 2 });
    await waitFor(() => expect(fetcher).toHaveBeenCalledTimes(2));
  });
});
