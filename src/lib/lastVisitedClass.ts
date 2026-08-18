// Key the last-visited class id is stored under in localStorage.
const STORAGE_KEY = 'student-dashboard:last-visited-class-id';

// Reads the last-visited class id. Returns null if nothing is stored,
// localStorage isn't available (e.g. disabled by browser policy), or
// reading it throws (private-browsing modes can throw on access) —
// callers treat null exactly like "no last-visited class", never as an
// error, so "resume" is purely a convenience that can silently no-op.
export function getLastVisitedClassId(): string | null {
  if (typeof window === 'undefined') return null;

  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

// Remembers the given class id as the most recently visited one.
export function setLastVisitedClassId(classId: string): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.setItem(STORAGE_KEY, classId);
  } catch {
    // Ignore — remembering a class to resume later is a nice-to-have,
    // not worth surfacing a storage error over.
  }
}

// Forgets the stored class id, e.g. once it's confirmed to no longer
// resolve to a real class, so future visits don't keep re-attempting it.
export function clearLastVisitedClassId(): void {
  if (typeof window === 'undefined') return;

  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore, same as above.
  }
}
