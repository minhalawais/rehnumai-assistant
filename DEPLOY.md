# Pre-deploy checklist (Vercel + MongoDB Atlas)

Use this list before pointing a production domain at Rehnumai.

## 1. Repository and build

- [ ] Latest `main` pushed to [GitHub](https://github.com/minhalawais/rehnumai-assistant).
- [ ] `npm run lint` passes locally.
- [ ] `npm run build` succeeds locally.
- [ ] No `.env.local` or secrets committed (only `.env.example`).

## 2. Vercel project

- [ ] Import the GitHub repo in [Vercel](https://vercel.com/new) (Framework: **Next.js**).
- [ ] Production branch: `main`.
- [ ] Set **Environment variables** for **Production** (and Preview if needed):

| Variable | Required | Example / notes |
|----------|----------|------------------|
| `MONGODB_URI` | Yes | `mongodb+srv://…` from Atlas |
| `MONGODB_DB` | Yes | e.g. `migration-assistant` |
| `SESSION_SECRET` | Yes | 32+ cryptographically random characters |
| `NEXT_PUBLIC_APP_URL` | Yes (prod) | `https://your-domain.vercel.app` or custom domain |
| `PUBLIC_INTAKE_TENANT_ID` | No | Default `demo-tenant` |
| `SESSION_COOKIE_NAME` | No | Default `rehnumai_session` |

- [ ] After first deploy, set `NEXT_PUBLIC_APP_URL` to the **canonical** HTTPS URL and redeploy (fixes Open Graph links and sitemap).

## 3. MongoDB Atlas

- [ ] Cluster running; **Database user** created (least privilege).
- [ ] **Network Access** allows Vercel (serverless: often `0.0.0.0/0` unless you use fixed egress).
- [ ] From your machine (with prod URI in a temp env or `.env.local`):

```bash
npm run db:ping
npm run db:indexes
```

- [ ] Staff users created (do **not** run `db:seed` against production unless policy allows).

## 4. Smoke tests (production URL)

- [ ] `GET /api/health` → `"mongo": "connected"`.
- [ ] Home `/` loads booklet; tab title and favicon show Rehnumai mark.
- [ ] Public intake submits; row appears in `/portal/submissions` after staff login.
- [ ] Staff login, logout, CSRF-protected actions work over **HTTPS**.
- [ ] `/robots.txt` disallows `/portal/` and `/api/`.
- [ ] `/manifest.webmanifest` returns icons and theme color `#062e43`.

## 5. Security before launch

- [ ] `SESSION_SECRET` unique per environment.
- [ ] Atlas credentials rotated if ever exposed.
- [ ] Demo seed password not used in production.
- [ ] Review `docs/requirements-package/08-release-backlog.md` for remaining launch items (rate limiting, MFA, etc.).

## 6. Optional domain

- [ ] Custom domain added in Vercel → DNS verified.
- [ ] Update `NEXT_PUBLIC_APP_URL` to custom domain → redeploy.
- [ ] Atlas IP allowlist still valid if restricted.

## Quick commands

```bash
npm run lint
npm run build
npm run db:ping
npm run db:indexes
```
