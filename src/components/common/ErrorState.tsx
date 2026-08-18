import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Centered error message for the "error" state of any async data view,
// with an optional Retry button wired to a hook's `refetch`. role="alert"
// announces it immediately to assistive tech. Reused wherever a hook's
// `error` is set instead of building a one-off error block per page.
export function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex flex-col items-center justify-center gap-3 py-12 text-center"
    >
      <AlertCircle aria-hidden="true" className="size-6 text-destructive" />
      <p className="max-w-sm text-sm text-muted-foreground">{message}</p>
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          <RefreshCw />
          Retry
        </Button>
      )}
    </div>
  );
}
