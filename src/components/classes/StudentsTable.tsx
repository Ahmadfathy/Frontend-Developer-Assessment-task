'use client';

import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/common/Spinner';
import { StatusBadge } from '@/components/common/StatusBadge';
import { calculateAge, capitalize, fullName } from '@/lib/format';
import type { Student } from '@/types/api';

// Table of a class's enrolled students: identity, demographics, status,
// and a per-row Remove action. `removingId` marks the row currently being
// removed — it shows a spinner and every Remove button is disabled while
// any removal is in flight, so a slow mutation can't be triggered twice.
// The Table ui component already wraps itself in an overflow-x container,
// so this scrolls horizontally on narrow screens instead of squashing.
export function StudentsTable({
  students,
  onRemove,
  removingId = null,
}: {
  students: Student[];
  onRemove: (student: Student) => void;
  removingId?: string | null;
}) {
  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-foreground/10">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Full name</TableHead>
            <TableHead>Student ID</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Age</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((student) => {
            const isRemoving = student.id === removingId;

            return (
              <TableRow key={student.id}>
                <TableCell>
                  <Link
                    href={`/students/${student.id}`}
                    className="font-medium text-foreground hover:underline"
                  >
                    {fullName(student)}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">{student.id}</TableCell>
                <TableCell>{capitalize(student.gender)}</TableCell>
                <TableCell>{calculateAge(student.dateOfBirth)}</TableCell>
                <TableCell>
                  <StatusBadge status={student.status} />
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={removingId !== null}
                    onClick={() => onRemove(student)}
                  >
                    {isRemoving ? <Spinner className="size-4" /> : <Trash2 />}
                    {isRemoving ? 'Removing...' : 'Remove'}
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
