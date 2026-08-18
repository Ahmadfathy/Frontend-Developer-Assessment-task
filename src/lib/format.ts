import type { Student } from '@/types/api';

// Builds a student's display name from their first/last name fields.
// `Student` has no `fullName` field in the API, so every UI spot that
// needs one derives it here instead of concatenating inline.
export function fullName(student: Pick<Student, 'firstName' | 'lastName'>): string {
  return `${student.firstName} ${student.lastName}`.trim();
}

// Computes a whole-number age in years from an ISO date-of-birth string.
// Returns 0 for an invalid/unparseable date rather than throwing or NaN,
// so callers can render it directly without their own guard.
export function calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth);

  if (Number.isNaN(dob.getTime())) {
    return 0;
  }

  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();

  const hasHadBirthdayThisYear =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());

  if (!hasHadBirthdayThisYear) {
    age -= 1;
  }

  return Math.max(age, 0);
}

// Formats an ISO date string for display, e.g. "15 Sep 2025".
// Falls back to the raw input string if it isn't a parseable date, so
// a bad value degrades gracefully instead of showing "Invalid Date".
export function formatDate(iso: string): string {
  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) {
    return iso;
  }

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

// Formats an enrolled-student count with correct pluralization, e.g.
// "1 student" / "4 students". Shared wherever a class shows how many
// students it has (class cards, class detail header, ...).
export function studentCountLabel(count: number): string {
  return `${count} ${count === 1 ? 'student' : 'students'}`;
}
