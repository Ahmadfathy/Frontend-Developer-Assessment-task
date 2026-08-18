'use client';

import { useEffect, useState } from 'react';

// Returns a debounced copy of `value` that only updates after `delay`ms
// of no further changes. Used to delay server-side search requests until
// the user pauses typing, instead of firing one request per keystroke.
export function useDebouncedValue<T>(value: T, delay = 350): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
