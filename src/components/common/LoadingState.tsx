import { Spinner } from '@/components/common/Spinner';

// Centered spinner + label for the "loading" state of any async data view.
// role="status"/aria-live="polite" announces the loading state to
// assistive tech without stealing focus. Reused wherever a hook's
// `loading` flag is true instead of building a one-off spinner per page.
export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-2 py-12 text-muted-foreground"
    >
      <Spinner className="size-6" />
      <p className="text-sm">{label}</p>
    </div>
  );
}
