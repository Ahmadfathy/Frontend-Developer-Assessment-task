'use client';

import type { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/common/StatusBadge';
import { calculateAge, capitalize, formatDate, fullName } from '@/lib/format';
import type { Student } from '@/types/api';

// One label/value row inside the details card. A small local helper so
// every field renders with identical spacing/typography without
// repeating that markup for each field below.
function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-3 last:border-b-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium">{value}</span>
    </div>
  );
}

// Read-only detail card for one student: identity, contact info, class
// membership, and enrollment status.
//
// NOTE: `className` here is the *school class's name* (e.g. "SS1A"), not
// a CSS class list — Student has no classId of its own, so the page
// derives which class (if any) a student belongs to and passes its name
// in under this prop, per this component's specified shape.
export function StudentDetails({
  student,
  className,
}: {
  student: Student;
  className?: string;
}) {
  return (
    <Card>
      <CardContent>
        <DetailRow label="Full name" value={fullName(student)} />
        <DetailRow label="Student ID" value={student.id} />
        <DetailRow
          label="Date of birth"
          value={`${formatDate(student.dateOfBirth)} (age ${calculateAge(student.dateOfBirth)})`}
        />
        <DetailRow label="Gender" value={capitalize(student.gender)} />
        <DetailRow label="Email" value={student.email} />
        <DetailRow label="Phone" value={student.phone} />
        <DetailRow label="Class" value={className ?? 'Not enrolled'} />
        <DetailRow label="Enrollment date" value={formatDate(student.enrollmentDate)} />
        <DetailRow label="Enrollment status" value={<StatusBadge status={student.status} />} />
      </CardContent>
    </Card>
  );
}
