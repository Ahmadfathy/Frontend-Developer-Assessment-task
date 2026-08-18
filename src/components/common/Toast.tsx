import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// A fixed-position (bottom-right) notification banner for success/error
// feedback after a mutation. Purely presentational — the caller owns
// showing/hiding it (e.g. a piece of state cleared by a timer, or simply
// bound to a hook's live error state). Sits above dialogs (z-[60] vs
// their z-50) so it stays visible even while one is still open.
export function Toast({
  message,
  variant = 'success',
}: {
  message: string;
  variant?: 'success' | 'error';
}) {
  const Icon = variant === 'success' ? CheckCircle2 : AlertCircle;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed right-4 bottom-4 z-[60] flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm text-white shadow-lg',
        variant === 'success' ? 'bg-foreground' : 'bg-destructive'
      )}
    >
      <Icon aria-hidden="true" className="size-4 shrink-0" />
      {message}
    </div>
  );
}
