'use client';

import { useCallback } from 'react';
import { useApi, type UseApiResult } from '@/hooks/useApi';
import { getClassStudents } from '@/lib/services/classes.service';
import type { Student } from '@/types/api';

// Loads the students enrolled in a class, refetching whenever the class id
// or search term changes. Search is always sent to the API (server-side
// filtering) rather than filtering a locally-cached list.
export function useClassStudents(
  classId: string | undefined,
  search: string
): UseApiResult<Student[]> {
  const fetcher = useCallback(
    () => getClassStudents(classId as string, search),
    [classId, search]
  );
  return useApi(fetcher, [classId, search], { enabled: Boolean(classId) });
}
