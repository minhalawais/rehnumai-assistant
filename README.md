# Rehnumai - Safe Migration Intake

Rehnumai is an Urdu-first, English-supported migration readiness and case-review workspace. Visitors can submit an entry without an account; staff review submissions in a protected workspace.

## Current implementation

- `/` - Migration Booklet reader (main entry) with a first-visit intake modal; staff sign-in in the header. After a successful public submission, the modal does not reappear on later visits (browser storage).
- `/login` - bilingual staff sign-in with visible errors.
- `/portal` - redirects authenticated staff to the submissions page.
- `/portal/submissions` - staff landing page with submission count, search, stage filter, and pagination.
- `/portal/submissions/[reference]` - scoped case detail, protected-field handling, case actions, and activity.
- `/intake` - one-question-at-a-time mobile intake and the existing six-step desktop form, with server-backed drafts, correction revisions, review, and submission receipt.
- `/booklet` - redirects to `/`.
- `/api/health` - safe deployment health response.
- `/api/auth/csrf` - double-submit CSRF token issuance.
- `/api/auth/login` and `/api/auth/logout` - Argon2id credential verification and opaque MongoDB session lifecycle.
- `/api/cases` and `/api/cases/[reference]` - permission-gated case list/create/detail boundaries.

Protected pages and case APIs require MongoDB and an active staff session. They do not show sample cases when the service is unavailable. The public page offers applicant self-submission without an account. This later product decision supersedes the original staff-only MVP assumption; see the decision record in `docs/requirements-package/09-traceability-and-decisions.md`.

## Requirements source

The implementation follows the approved package in [`docs/requirements-package`](./docs/requirements-package/README.md), especially the PRD, bilingual field dictionary, conditional rules, privacy/threat model, RBAC matrix, UX specification, MongoDB/API contract, and release backlog.

Mobile layout and flow decisions are recorded in [`docs/mobile-ux-decisions.md`](./docs/mobile-ux-decisions.md).
Booklet terminology and topic coverage are recorded in [`docs/booklet-content-alignment.md`](./docs/booklet-content-alignment.md).

## Local setup

### Prerequisites

- Node.js 22+.
- MongoDB 7/8 locally or MongoDB Atlas.

### Install and run

```bash
npm install
copy .env.example .env.local
npm run dev
```

Open `http://localhost:3000`.

### Configure MongoDB

The app uses the official Node driver and a single connection string (`MONGODB_URI`). That works for **local MongoDB** and **MongoDB Atlas** (cloud).

#### Local MongoDB

```env
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB=rehnumai
SESSION_COOKIE_NAME=rehnumai_session
SESSION_SECRET=at-least-32-random-characters
```

Start MongoDB locally, then:

```bash
npm run db:ping
npm run db:indexes
npm run db:seed
```

#### MongoDB Atlas (recommended for shared / production)

1. In [MongoDB Atlas](https://cloud.mongodb.com), create a **free M0 cluster** (or your org’s tier).
2. **Database Access** → add a database user (username + password). Do not commit credentials.
3. **Network Access** → allow your IP for development, or the hosting provider’s egress IPs for production (avoid `0.0.0.0/0` in production if you can).
4. **Database** → **Connect** → **Drivers** → copy the `mongodb+srv://…` URI.
5. Put it in `.env.local` (encode special characters in the password):

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=rehnumai
SESSION_SECRET=at-least-32-random-characters
```

6. Apply indexes (required once per cluster/database):

```bash
npm run db:ping
npm run db:indexes
```

7. Create staff users via your operational process. **`npm run db:seed` is blocked when `NODE_ENV=production`** and should only be used on dev/staging with a local or disposable database.

`/api/health` returns `mongo: "connected"` when Atlas is reachable, or **503** with `mongo: "unreachable"` when it is not.

Optional: tune `MONGODB_MAX_POOL_SIZE` (default `20`) for serverless or multi-instance hosts.

The database scripts read `.env.local` via `node --env-file=.env.local`.

The seed account is `demo@rehnumai.local` with password `ChangeMe-For-Local-Only-2026!`. These credentials work only after a development database is configured and `npm run db:seed` succeeds. Change the password immediately; never run the seed command in production.

## Security model

- Argon2id password hashes.
- Opaque random session tokens; only token hashes are stored in MongoDB.
- Secure, HTTP-only, SameSite cookies in production.
- Double-submit CSRF token and same-origin verification on state-changing routes.
- Server-side Zod validation and session authorization at service/API boundaries.
- In-memory login throttling is included as a local baseline. Replace it with a shared Redis/edge limiter before multi-instance production deployment.
- Redacted structured errors and audit event inserts for authentication/case creation.
- Security headers in `next.config.ts`.

## Deploy to Vercel

1. Push this repository to GitHub and import it in [Vercel](https://vercel.com/new).
2. **Framework preset:** Next.js (default). Build command `npm run build`, output directory default.
3. **Environment variables** (Production and Preview):

| Variable | Required | Notes |
|----------|----------|--------|
| `MONGODB_URI` | Yes | Atlas `mongodb+srv://…` connection string |
| `MONGODB_DB` | Yes | e.g. `migration-assistant` |
| `SESSION_SECRET` | Yes | 32+ random characters |
| `SESSION_COOKIE_NAME` | No | Default `rehnumai_session` |
| `PUBLIC_INTAKE_TENANT_ID` | No | Default `demo-tenant` |
| `NODE_ENV` | Set by Vercel | `production` on Production |

4. After first deploy, run **`npm run db:indexes`** locally against the same `MONGODB_URI` (or use Atlas UI). Create staff users through your ops process; do not run `db:seed` on production.
5. Confirm **`/api/health`** returns `"mongo": "connected"`.

MongoDB Atlas **Network Access** must allow Vercel (often `0.0.0.0/0` for serverless egress, or Vercel's integration IP list if you restrict).

## Build and deploy

```bash
npm run lint
npm run build
npm run start
```

For a containerized local stack:

```bash
docker compose up --build
```

The Docker image uses Next.js standalone output and a non-root runtime user.

## Production hardening still required before launch

The approved release backlog remains the source of truth. Before production, complete:

- Shared distributed rate limiting and MFA/step-up implementation.
- Full RBAC policy enforcement on every case/referral/export operation.
- MongoDB transaction/outbox audit implementation and immutable audit storage.
- Referral workflows, controlled export jobs, and retention jobs.
- Password reset delivery and approved privacy/support contact details.
- Transactional audit/outbox handling for multi-document case changes.
- Accessibility, security, load, backup-restore, and UAT gates from Phase 3.
- Legal/privacy/safeguarding approval of notice, retention, referral disclosure, and minor/emergency procedures.

## Repository structure

```text
src/app/                Next.js routes and API route handlers
src/components/         shared app shell and UI primitives
src/lib/                env, MongoDB, auth, security, CSRF, schemas
scripts/                index creation and development-only seed
docs/requirements-package/ approved product and technical requirements
```
