import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { MSWProvider } from '@/components/MSWProvider';
import { AppShell } from '@/components/layout/AppShell';

// Self-hosted (no runtime request to Google) via next/font. Exposed as
// the `--font-sans` CSS variable, which globals.css's `font-sans` /
// `font-heading` tokens already reference — until this was wired up,
// that variable was never defined anywhere, so the app was silently
// falling back to the browser's default (serif) font.
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

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
    <html lang="en" className={inter.variable}>
      <body>
        <MSWProvider>
          <AppShell>{children}</AppShell>
        </MSWProvider>
      </body>
    </html>
  );
}