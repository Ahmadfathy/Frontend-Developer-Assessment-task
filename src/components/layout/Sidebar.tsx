'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { APP_NAME, NAV_ITEMS, isNavItemActive } from '@/components/layout/nav-items';

// The app's primary navigation surface: a brand header followed by the
// top-level nav links. Rendered as both the fixed desktop rail and the
// content of the mobile drawer (see AppShell), so it doesn't know or care
// which container it's in. `onNavigate` lets a wrapping drawer close
// itself when a link is clicked.
export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  // Used to highlight whichever nav link matches the current route.
  const pathname = usePathname();

  return (
    // <aside> (rather than a plain <div>) gives this its own landmark, so
    // screen reader users can jump straight to the nav instead of having
    // to read through it as undifferentiated content.
    <aside
      aria-label="Primary navigation"
      className="flex h-full flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
    >
      {/* Brand header */}
      <div className="flex h-14 items-center gap-2 border-b border-sidebar-border px-4">
        <GraduationCap aria-hidden="true" className="size-5 text-sidebar-primary" />
        <span className="font-semibold">{APP_NAME}</span>
      </div>

      {/* Primary navigation links */}
      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => {
          const active = isNavItemActive(item.href, pathname);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-sidebar-ring',
                active
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                  : 'text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
