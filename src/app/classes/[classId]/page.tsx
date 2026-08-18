'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { UserPlus, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { Toast } from '@/components/common/Toast';
import { StudentSearch } from '@/components/classes/StudentSearch';
import { StudentsTable } from '@/components/classes/StudentsTable';
import { Pagination } from '@/components/classes/Pagination';
import { EnrollStudentDialog } from '@/components/classes/EnrollStudentDialog';
import { RemoveStudentConfirm } from '@/components/classes/RemoveStudentConfirm';
import { useClass } from '@/hooks/useClass';
import { useClassStudents } from '@/hooks/useClassStudents';
import { useRemoveStudent } from '@/hooks/useRemoveStudent';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { studentCountLabel } from '@/lib/format';
import type { Student } from '@/types/api';

// How many students the roster table shows per page. The API has no
// page param (only `?search=`), so this is purely a client-side slice of
// the already-fetched (and already server-search-filtered) result.
const STUDENTS_PER_PAGE = 10;

// Class detail page — the '/classes/[classId]' route from CLAUDE.md's
// routing table. Shows the class header, a searchable, paginated table
// of its enrolled students, and the enroll/remove flows.
export default function ClassDetailPage() {
  const { classId } = useParams<{ classId: string }>();

  // Search: debounced before it's sent to the server-side search
  // endpoint, so typing doesn't fire a request per keystroke.
  const [searchInput, setSearchInput] = useState('');
  const debouncedSearch = useDebouncedValue(searchInput);

  // Pagination: which page of the (search-filtered) roster is showing.
  const [page, setPage] = useState(1);

  // A new search should always start back at page 1 — otherwise a query
  // that only matches a couple of students could leave the admin looking
  // at an empty page 3 with no obvious explanation. Adjusted directly
  // during render (react.dev's "adjusting state when a prop changes"
  // pattern, same as AppShell's drawer-close-on-route-change) rather
  // than in an effect, so there's no stray extra render.
  const [prevSearch, setPrevSearch] = useState(debouncedSearch);
  if (debouncedSearch !== prevSearch) {
    setPrevSearch(debouncedSearch);
    setPage(1);
  }

  // Dialog state.
  const [enrollOpen, setEnrollOpen] = useState(false);
  const [studentToRemove, setStudentToRemove] = useState<Student | null>(null);

  // A transient success message shown after a successful enroll.
  const [enrollMessage, setEnrollMessage] = useState<string | null>(null);

  // Auto-dismisses the enroll success toast after a few seconds.
  useEffect(() => {
    if (!enrollMessage) return;
    const timer = setTimeout(() => setEnrollMessage(null), 4000);
    return () => clearTimeout(timer);
  }, [enrollMessage]);

  const classQuery = useClass(classId);
  const studentsQuery = useClassStudents(classId, debouncedSearch);
  const { remove, loading: removing, error: removeError, reset: resetRemove } = useRemoveStudent();

  const students = studentsQuery.data ?? [];
  const enrolledIds = classQuery.data?.studentIds ?? [];

  // Derived (not stored) pagination values, recomputed every render from
  // `students` and `page` — this is what keeps pagination correct after
  // e.g. a remove shrinks the list out from under the current page,
  // without needing a separate effect to "fix up" `page` after the fact.
  const totalPages = Math.max(1, Math.ceil(students.length / STUDENTS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const pageStudents = students.slice(
    (currentPage - 1) * STUDENTS_PER_PAGE,
    currentPage * STUDENTS_PER_PAGE
  );

  // Re-fetches both the class header (so the enrolled count updates) and
  // the students table. Called after any successful enroll/remove.
  function refetchAll() {
    classQuery.refetch();
    studentsQuery.refetch();
  }

  // Called by EnrollStudentDialog once a student has actually been
  // enrolled: refresh the data and show a success toast.
  function handleEnrolled() {
    refetchAll();
    setEnrollMessage('Student enrolled successfully.');
  }

  // Opens the remove-confirmation dialog for a given student, clearing
  // any stale error from a previous attempt first.
  function handleRemoveClick(student: Student) {
    resetRemove();
    setStudentToRemove(student);
  }

  // Confirms the pending removal. On success, closes the dialog and
  // refreshes the data; on failure, leaves the dialog open so the admin
  // can see the error (surfaced live via `removeError` below) and retry.
  async function handleConfirmRemove() {
    if (!studentToRemove) return;
    const success = await remove(classId, studentToRemove.id);
    if (success) {
      setStudentToRemove(null);
      refetchAll();
    }
  }

  return (
    <div className="space-y-6">
      {/* Class header */}
      {classQuery.loading ? (
        <LoadingState label="Loading class..." />
      ) : classQuery.error ? (
        <ErrorState message={classQuery.error} onRetry={classQuery.refetch} />
      ) : (
        classQuery.data && (
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">{classQuery.data.name}</h1>
              <p className="text-sm text-muted-foreground">
                {classQuery.data.id} · {studentCountLabel(classQuery.data.studentIds.length)}
              </p>
            </div>
            <Button onClick={() => setEnrollOpen(true)}>
              <UserPlus />
              Enroll student
            </Button>
          </div>
        )
      )}

      {/* Toolbar + roster, once the class itself is loaded */}
      {classQuery.data && (
        <div className="space-y-4">
          <StudentSearch
            value={searchInput}
            onChange={setSearchInput}
            placeholder="Search by name or ID..."
            ariaLabel="Search enrolled students by name or ID"
          />

          {studentsQuery.loading ? (
            <LoadingState label="Loading students..." />
          ) : studentsQuery.error ? (
            <ErrorState message={studentsQuery.error} onRetry={studentsQuery.refetch} />
          ) : students.length === 0 ? (
            debouncedSearch ? (
              <EmptyState icon={Users} title={`No students match "${debouncedSearch}"`} />
            ) : (
              <EmptyState
                icon={Users}
                title="This class has no students yet"
                action={
                  <Button size="sm" onClick={() => setEnrollOpen(true)}>
                    Enroll a student
                  </Button>
                }
              />
            )
          ) : (
            <div className="space-y-3">
              <StudentsTable
                students={pageStudents}
                onRemove={handleRemoveClick}
                removingId={removing ? studentToRemove?.id : null}
              />
              <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
            </div>
          )}
        </div>
      )}

      {/* Enroll dialog — only meaningful once we know the class's current roster */}
      {classQuery.data && (
        <EnrollStudentDialog
          classId={classId}
          enrolledIds={enrolledIds}
          open={enrollOpen}
          onOpenChange={setEnrollOpen}
          onEnrolled={handleEnrolled}
        />
      )}

      {/* Remove confirmation dialog */}
      <RemoveStudentConfirm
        student={studentToRemove}
        open={studentToRemove !== null}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            setStudentToRemove(null);
            resetRemove();
          }
        }}
        onConfirm={handleConfirmRemove}
        loading={removing}
      />

      {enrollMessage && <Toast variant="success" message={enrollMessage} />}
      {removeError && <Toast variant="error" message={removeError} />}
    </div>
  );
}
