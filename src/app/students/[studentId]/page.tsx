'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { StudentDetails } from '@/components/students/StudentDetails';
import { useStudent } from '@/hooks/useStudent';
import { useClasses } from '@/hooks/useClasses';

// Student detail page — the '/students/[studentId]' route from CLAUDE.md's
// routing table. Must work on a direct URL / page refresh, so params are
// read client-side (useParams) and all data comes from client hooks
// rather than anything resolved server-side.
export default function StudentDetailPage() {
  const { studentId } = useParams<{ studentId: string }>();
  const router = useRouter();

  const studentQuery = useStudent(studentId);
  const classesQuery = useClasses();

  // A Student has no classId of its own — derive which class (if any) it
  // belongs to by finding the class whose studentIds includes this id,
  // per CLAUDE.md's "Derived data" rules. A student may be in none.
  const studentClass = (classesQuery.data ?? []).find((schoolClass) =>
    schoolClass.studentIds.includes(studentId)
  );

  // Returns to wherever the admin came from (typically a class's roster).
  function handleBack() {
    router.back();
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" size="sm" onClick={handleBack}>
        <ArrowLeft />
        Back
      </Button>

      {studentQuery.loading ? (
        <LoadingState label="Loading student..." />
      ) : studentQuery.error ? (
        <div className="space-y-4">
          <ErrorState message={studentQuery.error} onRetry={studentQuery.refetch} />
          <div className="text-center">
            <Button variant="outline" size="sm" nativeButton={false} render={<Link href="/classes" />}>
              Back to classes
            </Button>
          </div>
        </div>
      ) : (
        studentQuery.data && (
          <StudentDetails student={studentQuery.data} className={studentClass?.name} />
        )
      )}
    </div>
  );
}
