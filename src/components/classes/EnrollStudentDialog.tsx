'use client';

import { useMemo, useState } from 'react';
import { CheckCircle2, Circle, UserX } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { StudentSearch } from '@/components/classes/StudentSearch';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { Spinner } from '@/components/common/Spinner';
import { useStudents } from '@/hooks/useStudents';
import { useEnrollStudent } from '@/hooks/useEnrollStudent';
import { fullName } from '@/lib/format';
import { cn } from '@/lib/utils';

// Dialog for enrolling an existing student into a class. Loads the full
// student list once, filters out anyone already enrolled (so duplicates
// are impossible up front — enrolledIds comes from the class itself) and
// anyone not matching the in-dialog search, then lets the admin pick
// exactly one candidate to enroll.
export function EnrollStudentDialog({
  classId,
  enrolledIds,
  open,
  onOpenChange,
  onEnrolled,
}: {
  classId: string;
  enrolledIds: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEnrolled: () => void;
}) {
  const studentsQuery = useStudents();
  const { enroll, loading: enrolling, error, reset } = useEnrollStudent();

  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Students not already enrolled in this class — the only ones eligible
  // to be picked here.
  const candidates = useMemo(() => {
    const enrolledSet = new Set(enrolledIds);
    return (studentsQuery.data ?? []).filter((student) => !enrolledSet.has(student.id));
  }, [studentsQuery.data, enrolledIds]);

  // Client-side filter over `candidates` by name or id. Fine to do here
  // (unlike the class roster table) since this is the already-fetched
  // global students list, not a server-searched endpoint.
  const visibleCandidates = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return candidates;
    return candidates.filter(
      (student) =>
        fullName(student).toLowerCase().includes(term) ||
        student.id.toLowerCase().includes(term)
    );
  }, [candidates, search]);

  // Resets all local dialog state and forwards the open change. Called
  // whenever the dialog closes, by any means (Cancel, backdrop, Escape,
  // or a successful submit), so the next open always starts fresh.
  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setSearch('');
      setSelectedId(null);
      reset();
    }
    onOpenChange(nextOpen);
  }

  // Submits the enrollment for the selected student.
  async function handleSubmit() {
    if (!selectedId) return;
    const success = await enroll(classId, selectedId);
    if (success) {
      handleOpenChange(false);
      onEnrolled();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Enroll a student</DialogTitle>
          <DialogDescription>Pick an existing student to add to this class.</DialogDescription>
        </DialogHeader>

        <StudentSearch value={search} onChange={setSearch} placeholder="Search by name or ID..." />

        <div className="max-h-72 overflow-y-auto rounded-lg border border-border">
          {studentsQuery.loading ? (
            <LoadingState label="Loading students..." />
          ) : studentsQuery.error ? (
            <ErrorState message={studentsQuery.error} onRetry={studentsQuery.refetch} />
          ) : candidates.length === 0 ? (
            <EmptyState icon={UserX} title="All students are already enrolled" className="py-8" />
          ) : visibleCandidates.length === 0 ? (
            <EmptyState icon={UserX} title={`No students match "${search}"`} className="py-8" />
          ) : (
            <div
              role="radiogroup"
              aria-label="Select a student to enroll"
              className="divide-y divide-border"
            >
              {visibleCandidates.map((student) => {
                const selected = student.id === selectedId;

                return (
                  <button
                    key={student.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    onClick={() => setSelectedId(student.id)}
                    className={cn(
                      'flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition-colors hover:bg-muted',
                      selected && 'bg-primary/5'
                    )}
                  >
                    {selected ? (
                      <CheckCircle2 aria-hidden="true" className="size-4 shrink-0 text-primary" />
                    ) : (
                      <Circle aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
                    )}
                    <span className="min-w-0 flex-1 truncate font-medium">{fullName(student)}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">{student.id}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {error && (
          <p role="alert" className="text-sm text-destructive">
            {error}
          </p>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={enrolling}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selectedId || enrolling}>
            {enrolling && <Spinner className="size-4" />}
            Enroll
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
