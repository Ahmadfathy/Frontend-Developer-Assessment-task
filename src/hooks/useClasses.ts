'use client';

import { useCallback } from 'react';
import { useApi, type UseApiResult } from '@/hooks/useApi';
import { getClasses } from '@/lib/services/classes.service';
import type { Class } from '@/types/api';

// Loads the full list of classes for the classes list page / dashboard stats.
export function useClasses(): UseApiResult<Class[]> {
  const fetcher = useCallback(() => getClasses(), []);
  return useApi(fetcher, []);
}
