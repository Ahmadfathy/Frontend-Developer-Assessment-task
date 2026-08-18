import type { ComponentType, ReactNode } from 'react';
import { cn } from '@/lib/utils';

// Centered "nothing here" placeholder for the "empty" state of any async
// data view (no students, no search matches, no classes, ...). Reused
// instead of a one-off empty block per page so empty states look and
// behave the same everywhere.
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-2 py-12 text-center',
        className
      )}
    >
      <Icon aria-hidden="true" className="size-6 text-muted-foreground" />
      <p className="text-sm font-medium">{title}</p>
      {description && <p className="max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
