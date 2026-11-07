# Phase 2: End-to-End Build and UI/UX Implementation

## Goal

Deliver a secure, polished MVP based only on the approved Phase 1 specification. The result is a staff-operated migration intake form, login experience, and submissions portal with a complete audit trail.

## Delivery sequence

### 1. Establish the foundation

- Initialize a strict TypeScript Next.js App Router project.
- Configure ESLint, Prettier, import ordering, pre-commit linting, environment validation, and dependency update policy.
- Add `.env.example`; never commit credentials, database URLs, cookie secrets, or production identifiers.
- Configure Docker for consistent local/CI/runtime builds.
- Create development, staging, and production environment configurations.

### 2. Build the design system

- Implement CSS custom properties for every approved color, radius, shadow, spacing, type scale, and status color.
- Build accessible primitives: button, text field, textarea, select, checkbox, radio group, combobox, date input, dialog, dropdown menu, toast, badge, tooltip, skeleton, empty state, pagination, and data table.
- Add RTL-aware logical CSS properties (`margin-inline`, `padding-inline`, `inset-inline`) and test direction switching for every component.
- Create form components with consistent label, hint, required marker, error message, and success state.
- Add responsive breakpoints: mobile first; portal table uses an alternate stacked/summary presentation at narrow widths.

### 3. Implement staff identity and authorization

- Create user provisioning, active/inactive account state, password reset, reset expiry, password change, session list/revocation, and logout.
- Store password hashes using Argon2id. Store only a hash of each opaque session token.
- Implement CSRF protection for state-changing cookie-authenticated requests.
- Add login throttling by IP and normalized email; avoid user-enumeration messages.
- Implement a typed authorization policy module. Each action must map to a permission, for example:

| Action | Super admin | Admin | Case manager | Data entry | Viewer |
| --- | --- | --- | --- | --- | --- |
| Create draft/submit | Yes | Yes | Yes | Yes | No |
| View all cases | Yes | Yes | Assigned/all per policy | Own/assigned only | Read-only scope |
| Review/approve | Yes | Yes | Yes | No | No |
| Manage users | Yes | Yes | No | No | No |
| Export PII | Yes | Approved policy | Approved policy | No | No |

### 4. Implement the form engine and new-entry experience

- Maintain form definitions in version-controlled source for the MVP, while storing the deployed version in `formDefinitions` for traceability.
- Use shared Zod schemas for browser and server validation.
- Save drafts explicitly and automatically using a debounced request. Display last-saved time and recover safely after a refresh.
- Keep all progression and submission validation on the server as the final authority.
- Implement the approved pages: consent, profile, migration plan, legal route/documents, risk screen, referrals/review.
- Render only applicable conditional questions; clear or retain hidden answers according to the approved data rule, and record that behavior in tests.
- Generate a non-sequential case reference such as `MIG-YYYY-XXXXXX`; do not expose MongoDB object IDs as the user-facing reference.
- Present a reviewed confirmation screen and receipt after successful submission.

### 5. Implement case workflow and portal

#### Dashboard

- Display only metrics relevant to the signed-in user’s permission scope.
- Include assigned-to-me, awaiting-review, on-hold, referred, and recent-submission summaries.
- Use accessible text summaries alongside charts; omit charts that do not support an operational action.

#### Submissions table

- Use server-side pagination, sorting, and filtering; never load the full case dataset into the browser.
- Add full-text-safe/field-specific search, status, owner, date range, destination, stage, risk indicator, and referral-status filters.
- Provide column visibility preferences stored per user without affecting other users.
- Provide export only after a server-side authorization and field-mask decision.

#### Record detail

- Show form answers grouped by section, using the form version that collected the record.
- Provide an immutable activity timeline: created, saved, submitted, assigned, reviewed, status changed, referral created/updated, export event.
- Provide protected reviewer controls: assign, mark under review, approve, hold, request correction, refer, archive.
- Require reason text for rejection/on-hold/request-correction/referral where specified.

### 6. Implement data and APIs

- Use Route Handlers under `app/api` as the HTTP boundary.
- Validate request input with Zod at every mutation/query boundary.
- Use service functions for business behavior and authorization; repositories handle MongoDB collection access only.
- Return typed, stable problem responses: `401`, `403`, `404`, `409`, `422`, `429`, `500`.
- Add optimistic concurrency/version checks on reviewer mutations to prevent a silent overwrite.
- Add MongoDB indexes before enabling high-volume portal queries.

### 7. Build operational controls

- Structured JSON logs with correlation/request IDs; redact passwords, tokens, PII, and form answers by default.
- Add error monitoring with scrubbed context.
- Add `/api/health` plus a readiness check that verifies required configuration and database connectivity without exposing secrets.
- Create MongoDB backup/restore runbook and test it in staging.
- Capture deployment version in audit/diagnostic events.

## API surface

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Authenticate and create session |
| `POST` | `/api/auth/logout` | Revoke current session |
| `POST` | `/api/auth/password-reset` | Start reset without account disclosure |
| `GET` | `/api/cases` | Permission-scoped paginated case query |
| `POST` | `/api/cases` | Create a draft |
| `GET` | `/api/cases/:reference` | View one permitted case |
| `PATCH` | `/api/cases/:reference` | Save permitted draft/update |
| `POST` | `/api/cases/:reference/submit` | Validate and submit a draft |
| `POST` | `/api/cases/:reference/transitions` | Perform a reviewed workflow action |
| `POST` | `/api/cases/:reference/referrals` | Add/update referral action |
| `GET` | `/api/exports/cases` | Produce permission-scoped export |

## File pattern

```text
features/intake/
  intake.schema.ts         # Zod input/output contracts
  intake.definition.ts     # versioned form definition
  intake.service.ts        # workflow and business rules
  intake.repository.ts     # database queries only
  intake.policy.ts         # permission checks
  components/
  tests/
app/(protected)/entries/new/page.tsx
app/(protected)/entries/[reference]/page.tsx
app/api/cases/route.ts
app/api/cases/[reference]/route.ts
```

## UI quality bar

- No raw browser controls in the finished experience.
- Every input has a persistent visible label; placeholder text is not a label.
- Errors are tied to fields, announced accessibly, understandable in Urdu and English, and do not erase user input.
- Keyboard focus is obvious, logical, and never trapped.
- Touch controls are at least 44x44 CSS pixels where practical.
- Status always uses a text label and icon/shape in addition to color.
- Sensitive values are masked in list views by default; reveal actions are permissioned and auditable.
- Use no fake data in production screens and no silent success states.

## Build acceptance criteria

- A data-entry user can sign in, create, save, resume, validate, and submit an Urdu RTL entry from a mobile device.
- A reviewer can find an entry, inspect its answers, assign it, change its status with a rationale, and create a referral.
- A viewer cannot mutate records or obtain unauthorized PII through UI, API, export, guessed URLs, or browser state.
- Each submitted record has a case reference, form version, actor, timestamps, workflow status, and audit history.
- Portal queries stay server-paginated and preserve permission scope.
- The app builds in CI, starts from Docker, validates environment variables, and exposes no secrets in source or client bundles.

## Implementation prompt

```text
Implement the approved migration intake MVP in this repository using Next.js App Router, TypeScript, MongoDB, Tailwind CSS, accessible Radix/shadcn-style primitives, React Hook Form, Zod, and TanStack Table. Follow Phase 1 exactly. Use feature-first modules, server-side permission enforcement, Argon2id password hashes, opaque hashed MongoDB sessions, audit events, Urdu-first RTL/English support, and the specified navy/teal design system. Build the login, multi-step draftable intake form, submission receipt, dashboard, filtered case portal, record review workflow, referral tracking, permissioned export, Docker configuration, environment validation, and README. Do not implement public signup, a generic form builder, or unapproved external integrations.
```
