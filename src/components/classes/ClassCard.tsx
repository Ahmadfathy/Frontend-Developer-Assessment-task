import Link from 'next/link';
import { GraduationCap, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { studentCountLabel } from '@/lib/format';
import type { Class } from '@/types/api';

// A clickable card for one class: name, id, and enrolled count. Wrapped
// in a Link so the whole card navigates to that class's detail page.
export function ClassCard({ schoolClass }: { schoolClass: Class }) {
  return (
    <Link
      href={`/classes/${schoolClass.id}`}
      className="block rounded-xl outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <Card className="transition-colors hover:bg-muted/50">
        <CardContent className="flex items-center gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <GraduationCap aria-hidden="true" className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-medium">{schoolClass.name}</p>
            <p className="text-xs text-muted-foreground">{schoolClass.id}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1.5 text-sm text-muted-foreground">
            <Users aria-hidden="true" className="size-4" />
            {studentCountLabel(schoolClass.studentIds.length)}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
