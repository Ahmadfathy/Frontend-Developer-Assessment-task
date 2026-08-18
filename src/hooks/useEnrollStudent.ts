'use client';

import { useCallback, useState } from 'react';
import { getErrorMessage } from '@/lib/errors';
import { enrollStudent } from '@/lib/services/classes.service';

// Shape returned by useEnrollStudent: an `enroll` action plus its own
// loading/error state (separate from any read hook's state), and a
// `reset` to clear a stale error/message before a new attempt.
export interface UseEnrollStudentResult {
  enroll: (classId: string, studentId: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

// Wraps POST /classes/:id/students (enroll an existing student into a
// class) in loading/error state. Returns true/false instead of throwing so
// callers (e.g. the enroll dialog) can branch on success without try/catch.
export function useEnrollStudent(): UseEnrollStudentResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const enroll = useCallback(async (classId: string, studentId: string) => {
    setLoading(true);
    setError(null);

    try {
      await enrollStudent(classId, studentId);
      return true;
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to enroll student'));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clears any previous error, e.g. when reopening the enroll dialog.
  const reset = useCallback(() => {
    setError(null);
  }, []);

  return { enroll, loading, error, reset };
}
