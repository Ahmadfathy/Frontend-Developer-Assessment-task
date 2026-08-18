# CLAUDE.md — Student Management Dashboard

Persistent rules for this repository. Read this before making any change.

## Project

A **Student Management Dashboard** for a school administrator, built **on top of the
provided starter**. The administrator can: see a school overview, browse classes,
open a class and view its students, search students, open a student's details,
enroll an existing student into a class, and remove a student from a class.

Stack (already in the starter): **Next.js (App Router) · TypeScript · Tailwind CSS v4 ·
Axios · MSW mock API · shadcn/ui built on Base UI · lucide-react**.

## Golden rules

1. **Never hardcode** student or class data. Always go through the API via the service layer.
2. **Comment everything**: every function, method, React component, hook, and type-heavy
   block gets a short comment above it saying what it does (and *why*, when not obvious).
3. **Three layers, kept separate** (this is graded):
   - `lib/services/*` — the only place that talks to Axios / the API.
   - `hooks/*` — wrap services in React state (loading/error/refetch).
   - `components/*` & `app/*` — UI only; they consume hooks, never call Axios.
4. **Reuse shared state components** (`LoadingState`, `ErrorState`, `EmptyState`) anywhere
   async data is shown. Don't reinvent them per page.
5. **TypeScript strict**: no `any`. Type every API response.
6. Don't over-abstract. Small, readable components over clever indirection.

## Critical constraint — MSW runs in the browser only

The mock API is a Mock Service Worker. It intercepts `fetch`/XHR **in the browser only**.
It does **not** intercept requests on the server. Therefore:

- **All data fetching must happen in Client Components** (`'use client'`) or client hooks.
- **Never** fetch `/api/...` from a Server Component, `generateStaticParams`, or a server action.
- Pages under `app/` that fetch data should be client components (or delegate to client child
  components). This is by design for this assessment.

## API contract (all paths under `/api`, ~500ms simulated delay)

| Method | Path | Success | Errors |
|--------|------|---------|--------|
| GET | `/classes` | `{ data: Class[] }` | — |
| GET | `/classes/:id` | `Class` (raw object) | 404 `{ message }` |
| GET | `/classes/:id/students?search=<term>` | `{ data: Student[], total }` | 404 `{ message }` |
| GET | `/students` | `{ data: Student[], total }` | — |
| GET | `/students/:id` | `Student` (raw object) | 404 `{ message }` |
| POST | `/classes/:id/students` body `{ studentId }` | 201 `{ message, data: Student }` | 400 (no id) · 404 (class/student) · 409 (already enrolled) |
| DELETE | `/classes/:id/students/:studentId` | 200 `{ message }` | 400 · 404 (not enrolled) |

Note the **inconsistent envelopes**: collection endpoints wrap data in `{ data }`, but
single-resource endpoints (`GET /classes/:id`, `GET /students/:id`) return the object directly.
The service layer must normalize this so hooks/components always get clean typed data.

Server-side search: `GET /classes/:id/students?search=` filters by full name **or** student id.
Always pass the term to the API — never download all students and filter on the client.

## Types (already in `src/types/api.ts`)

```ts
interface Student {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female';
  dateOfBirth: string;    // ISO date
  email: string;
  phone: string;
  enrollmentDate: string; // ISO date
  status: 'active' | 'inactive';
}
interface Class {
  id: string;
  name: string;
  studentIds: string[];
}
```

## Derived data (important — `Student` has NO `classId`)

- **Full name** = `firstName + ' ' + lastName`.
- **Age** = computed from `dateOfBirth`.
- **A student's class** = the class whose `studentIds` includes that student id
  (derive by searching the classes list; a student may be in none).
- **Enrolled count** of a class = `class.studentIds.length`.
- **Active students** (dashboard) = count of `/students` where `status === 'active'`.

## UI kit — shadcn on **Base UI** (NOT Radix)

- Components live in `src/components/ui/`: `button, card, badge, dialog, input, select, table`.
- **Dialog** is controlled: put `open` and `onOpenChange` on `<Dialog>`; `<DialogContent>` is the popup.
- **Do NOT use the Base UI `<Select>` for the enroll picker.** Use a searchable list of students
  instead — cleaner UX for picking from many students and avoids Base UI Select API pitfalls.
- Icons: `lucide-react`. Class merging: `cn()` from `@/lib/utils`.
- Button variants: `default | outline | secondary | ghost | destructive | link`.
  Badge variants: `default | secondary | destructive | outline`.
- Design tokens available: `primary, secondary, muted(-foreground), destructive, border,
  sidebar(-primary/-accent/...)`, etc.

## Routing

| Route | Page |
|-------|------|
| `/` | Dashboard (overview + stats + quick access to classes) |
| `/classes` | Classes list |
| `/classes/[classId]` | Class overview + students table + search + enroll + remove |
| `/students/[studentId]` | Student details (must work on **direct URL / refresh**) |

## States to always handle

`loading` · `error` (with a **Retry** action) · `empty` (no students / no search matches /
no data) · **disabled** buttons during any in-flight mutation · success & error feedback for
enroll and remove · a **confirmation dialog** before removing (destructive).

## Git

Make one meaningful commit per completed slice, with a clear message
(e.g. `feat: class detail page with search, enroll and remove`).
