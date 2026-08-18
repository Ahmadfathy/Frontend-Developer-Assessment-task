'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { GraduationCap, Menu, X } from 'lucide-react';
import { Sidebar } from '@/components/layout/Sidebar';
import { APP_NAME } from '@/components/layout/nav-items';

// Page shell every route renders inside: a fixed sidebar rail on desktop,
// a top bar + slide-out drawer on mobile, and the page content itself.
// This is what makes the nav appear on every page without each page
// having to render it.
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Whether the mobile nav drawer is open. Desktop ignores this entirely
  // (the sidebar rail is always visible there).
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close the drawer whenever the route changes, e.g. after tapping a link.
  // Adjusted directly during render (react.dev's "adjusting state when a
  // prop changes" pattern) rather than in an effect, so the drawer never
  // has a chance to flash open on the new page before an effect catches up.
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setDrawerOpen(false);
  }

  // Close the drawer on Escape while it's open.
  useEffect(() => {
    if (!drawerOpen) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setDrawerOpen(false);
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [drawerOpen]);

  // Prevent the page behind the drawer from scrolling while it's open.
  useEffect(() => {
    if (!drawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [drawerOpen]);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop: fixed sidebar rail, always visible at md+ */}
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-40 md:block md:w-64">
        <Sidebar />
      </div>

      {/* Mobile: top bar with brand + hamburger, hidden at md+ */}
      <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-background px-4 md:hidden">
        <button
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={drawerOpen}
          aria-controls="mobile-nav-drawer"
          onClick={() => setDrawerOpen(true)}
          className="-ml-1.5 inline-flex size-9 items-center justify-center rounded-lg text-foreground hover:bg-muted"
        >
          <Menu aria-hidden="true" className="size-5" />
        </button>
        <span className="flex items-center gap-2 font-semibold">
          <GraduationCap aria-hidden="true" className="size-5" />
          {APP_NAME}
        </span>
      </header>

      {/* Mobile: drawer + backdrop, only mounted while open */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop — click to dismiss */}
          <button
            type="button"
            aria-label="Close navigation menu"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-black/50"
          />
          <div id="mobile-nav-drawer" className="relative h-full w-64 max-w-[80vw] shadow-xl">
            <Sidebar onNavigate={() => setDrawerOpen(false)} />
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={() => setDrawerOpen(false)}
              className="absolute top-2.5 right-2.5 inline-flex size-9 items-center justify-center rounded-lg text-sidebar-foreground hover:bg-sidebar-accent"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          </div>
        </div>
      )}

      {/* Page content, offset past the sidebar rail on desktop */}
      <main className="md:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">{children}</div>
      </main>
    </div>
  );
}
