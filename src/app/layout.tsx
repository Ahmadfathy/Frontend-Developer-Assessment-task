import type { Metadata } from 'next';
import './globals.css';
import { MSWProvider } from '@/components/MSWProvider';
import { AppShell } from '@/components/layout/AppShell';

export const metadata: Metadata = {
  title: 'Student Management Dashboard',
  description: 'Frontend Developer Assessment',
};

// Root layout: MSWProvider stays the outermost boundary so the mock
// worker is ready before any page/hook fetches, and AppShell wraps every
// page so the nav (sidebar on desktop, drawer on mobile) is always present.
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MSWProvider>
          <AppShell>{children}</AppShell>
        </MSWProvider>
      </body>
    </html>
  );
}