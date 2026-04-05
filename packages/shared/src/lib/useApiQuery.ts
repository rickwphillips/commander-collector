'use client';

import { useState, useEffect, useCallback, type DependencyList } from 'react';

interface UseApiQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  setData: React.Dispatch<React.SetStateAction<T | null>>;
}

/**
 * Hook for fetching API data with standardized loading/error state.
 *
 * Replaces the common pattern:
 *   const [data, setData] = useState(null);
 *   const [loading, setLoading] = useState(true);
 *   const [error, setError] = useState(null);
 *   useEffect(() => { fetch().then(setData).catch(...).finally(...) }, []);
 *
 * Usage:
 *   const { data, loading, error, refetch } = useApiQuery(() => api.getDecks());
 *   const { data, loading, error } = useApiQuery(() => api.getDeck(id), [id]);
 */
export function useApiQuery<T>(
  fetcher: () => Promise<T>,
  deps: DependencyList = [],
): UseApiQueryResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setData(await fetcher());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed');
    } finally {
      setLoading(false);
    }
    // deps from the caller drive when refetch identity changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return { data, loading, error, refetch, setData };
}
