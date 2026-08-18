import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// A single dashboard metric tile: an icon, a large value, and a label.
// While `loading` is true the value is replaced with a skeleton bar
// instead of a stale/zero number, so the layout doesn't jump once the
// real value arrives.
export function StatCard({
  label,
  value,
  icon: Icon,
  loading = false,
}: {
  label: string;
  value: string | number;
  icon: LucideIcon;
  loading?: boolean;
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon aria-hidden="true" className="size-5" />
        </div>
        <div className="min-w-0">
          {loading ? (
            <div
              aria-hidden="true"
              className="h-7 w-14 animate-pulse rounded-md bg-muted"
            />
          ) : (
            <p className="text-2xl leading-tight font-semibold">{value}</p>
          )}
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
