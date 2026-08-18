import { Badge } from '@/components/ui/badge';
import type { Student } from '@/types/api';

// Renders a student's status as a Badge — "default" (filled) for active,
// "secondary" (muted) for inactive — with a capitalized label. Centralizes
// the status-to-variant mapping so it isn't repeated in every table/detail view.
export function StatusBadge({ status }: { status: Student['status'] }) {
  return (
    <Badge variant={status === 'active' ? 'default' : 'secondary'}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </Badge>
  );
}
