'use client';

import { useEffect, useRef, useState } from 'react';

export function MSWProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);
  // Guards against React Strict Mode's double-invoked mount effect in dev,
  // which would otherwise call worker.start() twice and throw ("cannot
  // configure an already enabled network") on the second call.
  const startedRef = useRef(false);

  useEffect(() => {
    async function enableMocking() {
      if (startedRef.current) {
        // Strict Mode's phantom re-invocation of this effect. The first
        // invocation's worker.start() call (below) is still in flight and
        // will call setReady(true) itself once it genuinely resolves —
        // bail out here rather than marking ready early, otherwise
        // children (and their fetches) could mount before the mock
        // worker has actually registered and start racing it.
        return;
      }
      startedRef.current = true;

      const { worker } = await import('@/mocks/browser');

      await worker.start({
        onUnhandledRequest: 'bypass',
      });

      setReady(true);
    }

    enableMocking();
  }, []);

  if (!ready) {
    return null;
  }

  return <>{children}</>;
}