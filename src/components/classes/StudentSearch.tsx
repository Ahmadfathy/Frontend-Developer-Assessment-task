'use client';

import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

// Controlled search input with a leading search icon. Purely
// presentational — callers own the value and any debouncing (see
// useDebouncedValue) before acting on it, e.g. passing it to a
// server-side search endpoint.
//
// `ariaLabel` defaults to the placeholder rather than a fixed generic
// string: the class detail page's roster search and the enroll dialog's
// candidate search can both be on screen at once, and two controls
// sharing the exact same accessible name is ambiguous for screen reader
// and voice-control users. Callers with a generic placeholder can still
// pass an explicit, more specific `ariaLabel`.
export function StudentSearch({
  value,
  onChange,
  placeholder = 'Search students...',
  ariaLabel = placeholder,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel?: string;
  disabled?: boolean;
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
        aria-label={ariaLabel}
        disabled={disabled}
        className="pl-8"
      />
    </div>
  );
}
