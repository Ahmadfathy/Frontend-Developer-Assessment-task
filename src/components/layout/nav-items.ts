import { GraduationCap, LayoutDashboard, type LucideIcon } from 'lucide-react';

// The app's display name, shared by the desktop sidebar header and the
// mobile top bar so the brand only needs to change in one place.
export const APP_NAME = 'Student Dashboard';

// One entry in the primary navigation: what it's called, where it goes,
// and which icon represents it.
export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

// The app's top-level navigation, rendered by Sidebar on both desktop
// (fixed rail) and mobile (drawer).
export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Classes', href: '/classes', icon: GraduationCap },
];

// Determines whether a nav link should render as "active" for the given
// pathname. The root link ('/') only matches the exact path — otherwise
// it would stay active on every route. Every other link also matches its
// own sub-routes, so e.g. '/classes' stays active on '/classes/CLS-001'.
export function isNavItemActive(href: string, pathname: string): boolean {
  if (href === '/') {
    return pathname === '/';
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
