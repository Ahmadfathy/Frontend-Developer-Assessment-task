# Student Management Dashboard

A school administrator dashboard — overview stats, browse classes, search/enroll/remove students within a class, and view student details — built on top of a Next.js + MSW starter kit.

## Setup

Requires **Node.js 20.9+** (Next.js 16's minimum) and npm.

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The mock API starts automatically in the
browser (Mock Service Worker) — check the browser console for `[MSW] Mocking enabled.` to confirm.

Other scripts: `npm run build` (production build), `npm run start` (serve the build),
`npm run lint` (ESLint).

## Technologies

- **Next.js (App Router)** — the starter's framework; used here purely as a client-rendered
  router (see [Assumptions & decisions](#assumptions--decisions)) for its file-based routing and
  dynamic segments (`/classes/[classId]`, `/students/[studentId]`).
- **TypeScript (strict)** — every API response, hook, and component prop is typed; no `any`
  anywhere in the app code.
- **Tailwind CSS v4** — utility-first styling on top of the shadcn design tokens (`primary`,
  `muted`, `sidebar-*`, etc.), including light/dark tokens and responsive variants.
- **Axios** — the HTTP client, confined entirely to `lib/services/*` so nothing else in the app
  touches it directly.
- **MSW (Mock Service Worker)** — intercepts `fetch`/XHR in the browser to simulate the given
  API contract (with its ~500ms delay and inconsistent envelopes) without a real backend.
- **shadcn/ui on Base UI** — accessible, unstyled component primitives (Button, Dialog, Card,
  Table, Input, Badge) styled with Tailwind; Base UI's `render` prop is what lets e.g. a `Button`
  render as a `next/link` while keeping button styling.
- **lucide-react** — the icon set used throughout (nav, stat cards, table actions, empty/error
  states, spinners).

## Implementation

Three layers, kept strictly separate:

```
lib/services/*   →   hooks/*              →   components/* & app/*
(axios calls,        (React state:            (UI only — render
 envelope             loading/error/data,       hook output, never
 normalization)       refetch)                  call axios directly)
```

- **`lib/services/classes.service.ts` / `students.service.ts`** — the only modules that import
  the axios instance (`lib/api.ts`). They normalize the API's inconsistent envelopes: collection
  endpoints (`GET /classes`, `GET /students`, `GET /classes/:id/students`) wrap results in
  `{ data }`, but single-resource endpoints (`GET /classes/:id`, `GET /students/:id`) return the
  object directly — the service layer absorbs that inconsistency so every caller just gets clean,
  typed data.
- **`hooks/useApi.ts`** — the generic backbone every read hook is built on. Given a fetcher
  function, it manages `{ data, loading, error, refetch }`, re-runs whenever its `deps` array
  changes, respects an `enabled` flag (so e.g. `useStudent` skips fetching until an id exists),
  and stores the fetcher in a ref so a fresh inline function each render doesn't retrigger the
  effect. Errors are normalized through `lib/errors.ts#getErrorMessage`, which prefers the API's
  own `{ message }` body over the raw Axios error. Thin hooks (`useClasses`, `useClass`,
  `useClassStudents`, `useStudents`, `useStudent`) are just `useApi` plus a service call.
  Two mutation hooks (`useEnrollStudent`, `useRemoveStudent`) follow a matching but separate
  shape: their own `loading`/`error` state, returning a `boolean` success instead of throwing,
  so callers can branch without `try/catch`.
- **Shared state components** (`components/common/`) — `LoadingState`, `ErrorState` (with an
  optional `onRetry`), `EmptyState`, `Spinner`, `StatusBadge`, `Toast` — reused on every page and
  dialog that shows async data instead of being rebuilt per screen.
- **Data flow, read path**: a page calls a hook → the hook calls a service → the service calls
  axios and unwraps the envelope → the hook stores `{data, loading, error}` → the component
  renders `LoadingState` / `ErrorState` / `EmptyState` / the real content based on that state.
- **Data flow, write path**: a dialog calls a mutation hook's action (`enroll(...)` /
  `remove(...)`) → on success the dialog closes and calls a page-supplied callback that refetches
  the affected read hooks (so the roster and the enrolled count both update) and shows a `Toast`;
  on failure the error is shown inline and the dialog stays open.

## Assumptions & decisions

- **All data fetching is client-side.** The MSW mock only intercepts requests made in the
  browser, not on the server, so every page that fetches data is a Client Component
  (`'use client'`) and `MSWProvider` gates rendering of the whole app until the worker has
  actually finished starting — otherwise the first request(s) could race past it and hit a real,
  unhandled network 404.
- **A student's class is derived, not stored.** `Student` has no `classId` field. A student's
  class (on the student detail page) is found by searching the fetched `classes` list for the one
  whose `studentIds` includes that student's id — a student may belong to none, shown as
  "Not enrolled".
- **Age is computed from `dateOfBirth`**, not stored, via `lib/format.ts#calculateAge` (a plain
  whole-years calculation that accounts for whether the birthday has occurred yet this year).
- **The enroll picker is a custom searchable list, not the Base UI `<Select>`.** Choosing one
  student out of dozens works better as a filterable list of rows than a native-style dropdown,
  and it lets already-enrolled students be filtered out of the candidate list up front (via the
  class's `studentIds`) so a duplicate enrollment is impossible to attempt rather than just
  rejected after the fact.
- **Search is server-side on the class roster, client-side in the enroll dialog — deliberately
  different.** The class detail page's student search sends the (debounced) term to the API's
  `GET /classes/:id/students?search=` param, per the contract, rather than downloading the whole
  roster and filtering locally. The enroll dialog's search is a plain client-side filter instead,
  because by that point the full student list is already loaded in memory (via `useStudents`) for
  the "already enrolled" exclusion above — filtering it again server-side would just be a slower
  way to do the same thing.

## Completed features

- [x] **Dashboard** (`/`) — total students, total classes, active students (all derived from the
      fetched lists, never hardcoded), plus a quick-access grid of classes.
- [x] **Classes list** (`/classes`) — every class as a card (name, id, enrolled count) linking to
      its detail page.
- [x] **Class detail** (`/classes/[classId]`) — header (name, id, enrolled count) and a students
      table (name, id, gender, age, status, actions).
- [x] **Student details** (`/students/[studentId]`) — full profile, including the derived class
      and age; works on a direct URL / page refresh.
- [x] **Search students within a class** — debounced, server-side via `?search=`, filtering by
      name or id.
- [x] **Enroll an existing student into a class** — searchable picker dialog, duplicates
      prevented up front, inline error handling (incl. 409 already-enrolled).
- [x] **Remove a student from a class** — confirmation dialog naming the student before the
      destructive action.
- [x] **Pagination on the class roster** — 10 students per page, "Page X of Y", Prev/Next,
      client-side (the API has no page param) and correct alongside search: a new search resets
      to page 1, and the page number self-clamps if a remove shrinks the list out from under it.
- [x] **Loading / error (with Retry) / empty / disabled-while-submitting / success & error
      feedback** — present and independently correct for every page and dialog (see
      [Implementation](#implementation)).
- [x] **Confirmation dialog before removing** — `RemoveStudentConfirm`, with the destructive
      button spinner-disabled while the request is in flight.
- [x] **Resume the last-visited class** — visiting a class's detail page remembers it
      (`localStorage`); the Dashboard and Classes list then offer a "Continue where you left
      off" shortcut back to it. Resilient by design: nothing shows if no class has been visited,
      and a stored id that no longer resolves (e.g. deleted data) is silently forgotten rather
      than offering a dead link.

## Limitations

- **No automated tests.** Everything was verified manually / with ad-hoc headless-browser scripts
  during development, not with a committed test suite (no Jest/Playwright/Vitest config in the
  repo).
- **Mutations refetch rather than update optimistically.** After a successful enroll/remove, the
  affected lists are refetched from the mock API instead of being patched locally, so there's a
  brief spinner rather than an instant UI update.
- **Toasts are page-local, not a shared system.** `components/common/Toast.tsx` is a small
  reusable presentational piece, but each page owns its own show/auto-dismiss state rather than
  there being one global toast queue/provider.
- **Dark mode tokens exist but aren't wired up.** `globals.css` already defines a full `.dark`
  token set (inherited from the shadcn starter), but nothing in the app toggles the `.dark` class
  or reads `prefers-color-scheme`, so the app only ever renders in light mode today.

## Further improvements

- **TanStack Query** (or similar) in place of the hand-rolled `useApi` — would add request
  caching/deduplication, background refetch, and cheap optimistic updates for free.
- **Optimistic updates** for enroll/remove, rolling back on failure instead of waiting on a
  refetch.
- **Automated tests** — unit tests for `lib/format.ts` / `lib/errors.ts` (pure functions, easy
  wins) and component/e2e tests for the enroll/remove flows.
- **A real toast/notification system** — a single provider + queue instead of each page managing
  its own transient message state.
- **Dark mode toggle** — wire up the `.dark` class (or `prefers-color-scheme`) that the design
  tokens already support.
