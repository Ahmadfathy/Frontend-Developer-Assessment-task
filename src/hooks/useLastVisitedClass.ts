'use client';

import { useEffect, useState } from 'react';
import { useClass } from '@/hooks/useClass';
import { clearLastVisitedClassId, getLastVisitedClassId } from '@/lib/lastVisitedClass';
import type { Class } from '@/types/api';

// Result shape for useLastVisitedClass: the class to offer as "resume"
// (or null if there isn't one, or it's no longer valid) and whether
// that's still being resolved.
export interface UseLastVisitedClassResult {
  lastClass: Class | null;
  loading: boolean;
}

// Looks up the class the admin most recently opened, so the Dashboard /
// Classes list can offer a "resume" shortcut back to it. Resilient by
// design: nothing stored, a malformed id, or an id that no longer
// resolves to a real class (e.g. it was removed from the mock data) all
// collapse to `lastClass: null` rather than an error — this is a
// convenience, never something that should block or break either page.
export function useLastVisitedClass(): UseLastVisitedClassResult {
  // Lazy-initialized so localStorage is read exactly once, on mount.
  // Safe to read directly here rather than in an effect: every page in
  // this app is gated behind MSWProvider's client-side "ready" state
  // (see components/MSWProvider.tsx), so hooks like this one never run
  // during server rendering in the first place.
  const [storedId] = useState(() => getLastVisitedClassId());

  // Re-uses the existing single-class hook to both fetch the class (for
  // its display name) and, for free, find out whether the stored id is
  // still valid — a 404 here means it isn't.
  const classQuery = useClass(storedId ?? undefined);

  // Self-heals a stale stored id: once we've confirmed it no longer
  // resolves, forget it so future visits don't keep re-attempting the
  // same dead lookup. (The mock API only ever fails this call with a 404
  // "not found" — there's no other error case to distinguish here, so
  // any error is treated the same way.)
  useEffect(() => {
    if (storedId && classQuery.error) {
      clearLastVisitedClassId();
    }
  }, [storedId, classQuery.error]);

  return {
    lastClass: classQuery.error ? null : classQuery.data,
    loading: Boolean(storedId) && classQuery.loading,
  };
}
