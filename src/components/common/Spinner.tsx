import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// A small spinning loader icon. Purely decorative (aria-hidden) — the
// element that uses it is responsible for conveying "loading" to
// assistive tech (see LoadingState's role="status").
export function Spinner({ className }: { className?: string }) {
  return <Loader2 aria-hidden="true" className={cn('animate-spin', className)} />;
}
