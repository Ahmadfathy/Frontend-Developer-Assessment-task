'use client';

import { useCallback, useState } from 'react';
import { getErrorMessage } from '@/lib/errors';
import { removeStudent } from '@/lib/services/classes.service';

// Shape returned by useRemoveStudent: a `remove` action plus its own
// loading/error state, and a `reset` to clear a stale error before a new
// attempt (e.g. reopening the confirmation dialog).
export interface UseRemoveStudentResult {
  remove: (classId: string, studentId: string) => Promise<boolean>;
  loading: boolean;
  error: string | null;
  reset: () => void;
}

// Wraps DELETE /classes/:id/students/:studentId (remove a student from a
// class) in loading/error state. Returns true/false instead of throwing so
// the confirmation dialog can branch on success without try/catch.
export function useRemoveStudent(): UseRemoveStudentResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const remove = useCallback(async (classId: string, studentId: string) => {
    setLoading(true);
    setError(null);

    try {
      await removeStudent(classId, studentId);
      return true;
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to remove student'));
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clears any previous error, e.g. when reopening the confirmation dialog.
  const reset = useCallback(() => {
    setError(null);
  }, []);

  return { remove, loading, error, reset };
}
