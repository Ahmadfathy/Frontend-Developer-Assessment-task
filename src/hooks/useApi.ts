'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getErrorMessage } from '@/lib/errors';

// Shape returned by useApi: the fetched data (or null before/if it fails),
// loading/error state, and a refetch function for Retry buttons.
export interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Generic read hook — the backbone every resource hook (useClasses,
// useStudent, ...) is built on. It calls `fetcher`, tracks loading/error/
// data, re-runs whenever `deps` change, and exposes `refetch` for manual
// re-runs (e.g. a Retry button after an error). `options.enabled` lets a
// caller skip fetching entirely (e.g. no id yet).
export function useApi<T>(
  fetcher: () => Promise<T>,
  deps: unknown[] = [],
  options: { enabled?: boolean } = {}
): UseApiResult<T> {
  const { enabled = true } = options;

  const [data, setData] = useState<T | null>(null);
  // Tracks the fetch-in-flight state; the publicly exposed `loading` below
  // is derived from this AND `enabled` so a disabled hook always reports
  // not-loading without needing its own setState call (see effect below).
  const [internalLoading, setInternalLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  // Bumped by refetch() to force the fetch effect below to re-run.
  const [refetchToken, setRefetchToken] = useState(0);

  // Stash the latest fetcher in a ref so the fetch effect can call it
  // without depending on it directly — fetchers are usually fresh arrow
  // functions each render and would otherwise cause a refetch loop.
  // Updated in its own effect (never during render) so React doesn't
  // treat this as an unsafe render-time ref mutation.
  const fetcherRef = useRef(fetcher);
  useEffect(() => {
    fetcherRef.current = fetcher;
  });

  useEffect(() => {
    if (!enabled) {
      return;
    }

    let cancelled = false;
    // The classic data-fetching effect pattern (see react.dev's own
    // "Fetching Data" example): mark loading before the async call starts,
    // then resolve it from the promise's .then/.catch/.finally below.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setInternalLoading(true);
    setError(null);

    fetcherRef
      .current()
      .then((result) => {
        if (!cancelled) setData(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(getErrorMessage(err));
      })
      .finally(() => {
        if (!cancelled) setInternalLoading(false);
      });

    // Avoids a stale response overwriting fresher state if deps change
    // again (or the component unmounts) before this request resolves.
    return () => {
      cancelled = true;
    };
    // deps is caller-controlled and intentionally spread as the trigger list.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, refetchToken, ...deps]);

  // Re-runs the fetch on demand, e.g. from a Retry button.
  const refetch = useCallback(() => {
    setRefetchToken((token) => token + 1);
  }, []);

  return { data, loading: enabled && internalLoading, error, refetch };
}
