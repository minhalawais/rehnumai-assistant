# Phase 3: Testing, Security Validation, and Release Readiness

## Goal

Prove that the platform safely handles sensitive migration-intake data, behaves correctly for each role and workflow, remains usable in Urdu RTL and English LTR, and can be released and recovered operationally.

## Test strategy

Adopt a layered test pyramid:

| Layer | Primary tools | Purpose |
| --- | --- | --- |
| Static checks | TypeScript, ESLint, dependency/secret scan | catch defects before execution |
| Unit | Vitest | validation, business rules, utilities |
| Component | Testing Library | interactive accessibility and rendering behavior |
| Integration | Vitest + isolated MongoDB test database | APIs, services, authorization, persistence |
| E2E | Playwright | complete user journeys in real browsers |
| Security/performance | OWASP checks, k6/Artillery, manual review | abuse resistance and capacity |
| UAT | scripted staff sessions | confirm operational fit |

## 1. Static and quality gates

- Enforce `tsc --noEmit`, ESLint, formatting, and production build on each pull request.
- Fail CI on committed secrets, known critical dependency vulnerabilities, or unused environment variables.
- Require migration/index changes to include tests and rollback notes.
- Require pull-request review for auth, permissions, PII, export, audit, and workflow changes.

## 2. Unit-test matrix

### Authentication and session controls

- Argon2id hashing/verification success and failure.
- Password policy and normalization.
- Session token hashing, expiry, revocation, rotation after password reset, and global sign-out.
- Login lockout/throttle behavior without revealing whether an account exists.

### Form and data rules

- Each required field, answer format, maximum length, option value, and bilingual label mapping.
- Every conditional rule: question visibility, requiredness, answer clearing/retention, and server-side enforcement.
- Consent required before draft submission.
- Correct document-checklist status validation.
- Reference generation uniqueness and format.
- Sensitive-field masking transformations.

### Workflow and referral rules

- Valid and invalid status transitions.
- Required rationale for on hold, needs correction, rejection, and referrals.
- Assignment and reviewer ownership constraints.
- Archive versus anonymization behavior.
- Audit event generation for every material state change.

### Authorization

- Permission decision for every role/action/resource relationship.
- Own-case versus assigned-case versus all-case scope.
- Export field mask behavior.
- Attempts to access another case by reference fail correctly.

## 3. Integration-test matrix

Run with an isolated MongoDB database per test run.

- Login, logout, password reset, session expiry, revoked session, and concurrent session behavior.
- API invalid JSON, malformed types, missing CSRF token, missing session, expired session, unauthorized role, and conflict/version mismatch.
- Create/save/submit lifecycle, with a server-confirmed audit trail.
- Case search/filter/sort/pagination correctness and query index coverage.
- Reviewer transition and referral history persistence.
- CSV export authorization, masking, CSV-injection neutralization, and audit event.
- Database connection failure produces safe, observable errors without leaking implementation details.
- TTL/session cleanup and backup restore smoke test.

## 4. End-to-end Playwright scenarios

| Scenario | Required assertion |
| --- | --- |
| Staff login | successful login lands on permitted dashboard; invalid login is safe |
| New Urdu entry | RTL layout, page progression, errors, required consent, submit receipt |
| Draft recovery | saved draft resumes after refresh/sign out/in; no answer loss |
| Conditional logic | route/documents/risk answers show exactly the approved follow-ups |
| Mobile entry | works at 360px viewport with usable touch controls |
| Review queue | reviewer filters, opens, assigns, holds, and records rationale |
| Referral | reviewer creates follow-up and visible timeline event |
| RBAC | data entry cannot review/export; viewer cannot mutate; guessed route/API is denied |
| Export | privileged user obtains scoped/masked export; unauthorized user cannot |
| Accessibility smoke | keyboard-only completion, focus order, dialog behavior, error announcement |

Run Chromium, Firefox, and WebKit for the release candidate. Include at least one physical Android/iOS device test before launch.

## 5. Accessibility and localization verification

- Test to WCAG 2.2 AA: contrast, semantic landmarks, headings, labels, error identification, status messages, keyboard operability, focus visibility/order, and target sizes.
- Verify logical start/end layout behaves correctly in both directions.
- Check Urdu copy for truncation, awkward wrapping, mixed-script numbers, and punctuation direction.
- Validate screen reader behavior using NVDA + Chrome/Firefox and at least one mobile screen reader check.
- Test zoom at 200% and browser text enlargement; no information should be lost or clipped.

## 6. Security verification

Use OWASP ASVS as the review baseline appropriate to the organization’s risk level.

### Required automated checks

- SAST, dependency scanning, secret scanning, and container image scanning in CI.
- Dynamic tests for authentication, authorization, CSRF, validation, rate limiting, headers, and error leakage.
- Test inputs for stored/reflected XSS, NoSQL injection, prototype pollution, path traversal, CSV formula injection, and oversized payloads.

### Required manual review

- Broken object-level authorization/IDOR using both UI and raw API requests.
- Role escalation, session fixation, cookie security, reset-link expiry, audit-event completeness, PII in logs, PII in error monitoring, and PII in cached responses.
- File upload attack surface if attachments are introduced; do not enable arbitrary uploads without malware scanning, type validation, size limits, private storage, and authorization checks.
- Verify security headers: CSP, HSTS in production, `X-Content-Type-Options`, frame protection, referrer policy, and restrictive permissions policy.

### Security release blockers

- Any exploitable broken access control, PII disclosure, credential/session flaw, injection, or unlogged privileged action.
- Any unencrypted production transport or unverified encrypted backup process.
- Any ability to export PII without explicit authorization and audit evidence.

## 7. Performance and resilience

- Establish baselines for login, draft save, form submit, case list/search, record view, and export creation.
- Load-test realistic simultaneous staff activity; include database connection-pool saturation and rate-limit verification.
- Verify portal queries use pagination and indexes with `explain()` in staging.
- Test poor networks: delayed draft save, timeout, duplicate submit retry, browser refresh during save, and recovery messaging.
- Set initial service objectives: successful submission rate, API error rate, p95 latency, recovery time objective, and recovery point objective. Final thresholds need business-owner approval.

## 8. UAT procedure

Use anonymized, representative cases. Never use production personal data in test environments.

1. A data-entry staff member completes three cases: routine, incomplete documentation, and high-risk/referral.
2. A reviewer processes each case through approved/on-hold/correction/referral paths.
3. An administrator provisions and disables a user, performs a permitted export, and verifies audit history.
4. Operations verifies dashboard counts, role scope, data masking, expected reports, and retention behavior.
5. Record defects with severity, reproduction steps, expected/actual behavior, owner, target release, and retest evidence.

## 9. Release checklist

- [ ] Phase 1 approvals recorded and current.
- [ ] Production environment values validated; secrets held only in approved secret storage.
- [ ] Database indexes and backup schedule applied.
- [ ] Restore test completed successfully in staging.
- [ ] All unit, integration, E2E, accessibility, security, and performance gates pass.
- [ ] No critical or high-severity release defects remain open.
- [ ] UAT completed and signed off by operational owner.
- [ ] Privacy, security, and operational owners approve release.
- [ ] Monitoring, alert routing, dashboard, support contacts, incident runbook, and rollback plan are tested.
- [ ] A limited pilot launch plan and post-launch review date are scheduled.

## Defect severity policy

| Severity | Meaning | Release decision |
| --- | --- | --- |
| Critical | PII exposure, privilege bypass, data loss, unavailable core workflow | Block release |
| High | material workflow/security/accessibility failure without workaround | Block release unless formally accepted by accountable owner |
| Medium | important failure with documented workaround | Fix or explicitly defer with target date |
| Low | cosmetic or non-blocking inconvenience | Prioritize in backlog |

## Phase exit criteria

- Traceability matrix links every approved requirement to one or more automated or UAT tests.
- The full release checklist is complete with evidence links.
- Penetration/security review findings are resolved or formally risk-accepted by the accountable owner.
- Backup restoration, rollback, and incident notification processes are rehearsed.
- Pilot users successfully complete the critical workflows without facilitator intervention.

## Implementation prompt

```text
Create and execute the full production-readiness test program for the approved migration intake platform. Add Vitest unit and integration tests, Testing Library component tests, Playwright end-to-end coverage, accessibility tests to WCAG 2.2 AA, OWASP ASVS-informed security checks, load/resilience tests, CI quality gates, test data fixtures, and a requirements-to-test traceability matrix. Test all roles, Urdu RTL, English LTR, drafts, conditional logic, sensitive-data masking, reviewer workflows, referrals, exports, audit trails, session security, and unauthorized API access. Produce a release report with evidence, unresolved risks, severity, owners, and a go/no-go recommendation. Do not certify release readiness while any critical or high-severity defect remains unresolved.
```
