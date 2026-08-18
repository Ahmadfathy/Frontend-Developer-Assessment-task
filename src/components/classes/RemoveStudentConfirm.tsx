'use client';

import { Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/common/Spinner';
import { fullName } from '@/lib/format';
import type { Student } from '@/types/api';

// Confirmation dialog before removing a student from a class — a
// destructive, hard-to-undo-by-accident action. `student` is the one
// pending removal (null when none is pending, e.g. before the dialog has
// ever been opened); naming them explicitly avoids a vague "are you
// sure?" prompt.
export function RemoveStudentConfirm({
  student,
  open,
  onOpenChange,
  onConfirm,
  loading,
}: {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  loading: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Remove student?</DialogTitle>
          <DialogDescription>
            {student
              ? `${fullName(student)} (${student.id}) will be removed from this class.`
              : 'This student will be removed from this class.'}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} disabled={loading}>
            {loading ? <Spinner className="size-4" /> : <Trash2 />}
            Remove
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
