'use client';

import Link from 'next/link';
import { ArrowRight, History } from 'lucide-react';
import { useLastVisitedClass } from '@/hooks/useLastVisitedClass';

// A small "continue where you left off" banner linking back to the class
// the admin most recently opened. Used on the Dashboard and Classes list
// so either can offer to resume. Renders nothing while that's being
// looked up, and nothing at all if there isn't one (no class visited
// yet) or the stored id no longer resolves — resuming is a convenience,
// never something that should show as broken.
export function ResumeClassBanner() {
  const { lastClass, loading } = useLastVisitedClass();

  if (loading || !lastClass) {
    return null;
  }

  return (
    <Link
      href={`/classes/${lastClass.id}`}
      className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <History aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
      <span className="flex-1">
        Continue where you left off: <span className="font-medium">{lastClass.name}</span>
      </span>
      <ArrowRight aria-hidden="true" className="size-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}
