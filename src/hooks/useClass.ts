'use client';

import { useCallback } from 'react';
import { useApi, type UseApiResult } from '@/hooks/useApi';
import { getClass } from '@/lib/services/classes.service';
import type { Class } from '@/types/api';

// Loads a single class by id, for the class detail page. Skips fetching
// until an id is available (e.g. still resolving from the route).
export function useClass(classId: string | undefined): UseApiResult<Class> {
  const fetcher = useCallback(() => getClass(classId as string), [classId]);
  return useApi(fetcher, [classId], { enabled: Boolean(classId) });
}
