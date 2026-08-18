'use client';

import { useCallback } from 'react';
import { useApi, type UseApiResult } from '@/hooks/useApi';
import { getStudent } from '@/lib/services/students.service';
import type { Student } from '@/types/api';

// Loads a single student by id, for the student detail page. Skips
// fetching until an id is available (e.g. still resolving from the route).
export function useStudent(studentId: string | undefined): UseApiResult<Student> {
  const fetcher = useCallback(() => getStudent(studentId as string), [studentId]);
  return useApi(fetcher, [studentId], { enabled: Boolean(studentId) });
}
