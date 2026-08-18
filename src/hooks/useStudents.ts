'use client';

import { useCallback } from 'react';
import { useApi, type UseApiResult } from '@/hooks/useApi';
import { getStudents } from '@/lib/services/students.service';
import type { Student } from '@/types/api';

// Loads the full list of students, e.g. for the enroll picker's searchable
// list or a global students view.
export function useStudents(): UseApiResult<Student[]> {
  const fetcher = useCallback(() => getStudents(), []);
  return useApi(fetcher, []);
}
