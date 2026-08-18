'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Controlled search input with a leading search icon. Purely
// presentational — callers own the value and any debouncing (see
// useDebouncedValue) before acting on it, e.g. passing it to a
// server-side search endpoint.
export function StudentSearch({
  value,
  onChange,
  placeholder = 'Search students...',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground"
      />
      <Input
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label="Search students"
        className="pl-8"
      />
    </div>
  );
}
