# Product Requirements Document

## 1. Product summary

### Product name

Working name: **Safe Migration Intake and Case Review Platform**.

### Problem

The Migration Booklet provides broad, practical guidance on legal migration, overseas job preparation, required documents, recruiter verification, safe departure, protection abroad, remittances, return/reintegration, and complaint channels. Staff need a consistent way to translate that guidance into an applicant-specific intake, identify preparation gaps and safety concerns, review cases, refer people to appropriate official/support organizations, and track follow-up without exposing sensitive data.

### Product outcome

A case worker can collect a structured, bilingual migration-readiness record; a reviewer can determine the operational next action; authorized staff can refer and follow up; managers can monitor workload and aggregate service delivery; every sensitive action is permissioned and audited.

### Product principles

1. **Support, not adjudication:** the platform records needs and coordinates assistance; it does not determine visa eligibility or make legal findings.
2. **Legal and safe migration first:** the form prioritizes documented routes, contract/recruiter verification, preparation, and appropriate referral.
3. **Minimum necessary data:** collect only what is needed for service delivery and reporting.
4. **Human-reviewed signals:** potential safety/fraud/irregular-route answers create review tasks, not automatic labels.
5. **Urdu is first-class:** Urdu copy, RTL layout, error handling, and print/export rendering are designed rather than translated at the end.
6. **Traceable case work:** status, assignment, referrals, corrections, exports, and sensitive access are attributable.

## 2. Goals and success measures

### Goals

- Standardize intake across migration-resource and outreach staff.
- Reduce incomplete or inconsistent readiness assessments.
- Surface cases requiring trained review or referral promptly.
- Provide a permission-scoped source of truth for case status and follow-up.
- Enable useful operational reporting without indiscriminate PII export.

### Initial success measures

| Measure | MVP target | Measurement |
| --- | --- | --- |
| Required-field completeness at submission | 98%+ | server validation results |
| Draft recovery success | 99.5%+ | recovery telemetry, excluding user deletion |
| Median routine intake time | <= 15 minutes after training | consented aggregate event timing |
| Submitted cases assigned within SLA | >= 90% | audit timestamps; SLA configured by operations |
| Referral follow-up completed by due date | baseline then agreed target | referral status/follow-up dates |
| Unauthorized-access test failures | 0 | CI, penetration test, audit review |
| Critical WCAG 2.2 AA failures | 0 | automated and manual accessibility testing |

Timing analytics must not contain answers, names, phone numbers, CNIC/passport values, or free text.

## 3. Scope

### MVP in scope

- Public self-submission without an applicant account, with consent, server validation, a receipt reference, and staff review.
- Staff login, logout, password reset, session expiry, account disablement.
- Role- and scope-based portal access.
- Urdu-first/English-supported multi-step intake.
- Manual save, autosave, resume, discard, and submit.
- Conditional questions and server-authoritative validation.
- Migration stage, plan, legal-channel, document-readiness, safe-travel, and support/referral needs.
- Review queue, assignment, statuses, rationale, correction cycle, and close/archive.
- Referral creation, ownership, outcome, due date, and follow-up notes.
- Permission-scoped filtering, sorting, search, pagination, and CSV export.
- Record detail, status timeline, and audit history.
- User administration, role assignment, session revocation, and audit review.
- Responsive mobile/tablet/desktop and RTL/LTR support.

### Exclusions

- Public or applicant accounts and self-service case tracking.
- Dynamic no-code form creation.
- Automatic BEOE/OEC/visa/employer verification.
- Direct submission to authorities or external agencies.
- Automated trafficking/fraud/visa/legal classifications.
- In-app messaging, WhatsApp, SMS, email campaigns, or call recording.
- Document uploads in the first release; record presence/status and a reference note only.
- Offline-first multi-device synchronization.
- Biometric data, facial images, fingerprint data, GPS tracking, continuous location, or call/SMS access.
- Case-management billing, grants, remittance execution, or job placement.

## 4. Personas

### Data-entry officer

- Conducts walk-in, phone, or outreach intake.
- Needs simple Urdu-first questions, safe draft recovery, clear required fields, and minimal portal complexity.
- Must not approve cases, manage users, or export bulk PII.

### Case manager/reviewer

- Reviews submitted information, resolves gaps, determines operational status, creates referrals, and monitors follow-up.
- Needs complete record context, safety signals, assignment queues, rationale capture, and a reliable audit trail.

### Program manager

- Oversees teams, service levels, aggregate trends, workload, quality, and referral completion.
- Needs scope-limited dashboards, de-identified aggregates, controlled exports, and audit visibility.

### System administrator

- Provisions/blocks staff, assigns approved roles/scopes, handles session revocation, and supports configuration.
- Must not silently change case answers or erase audit events.

### Privacy/security auditor

- Reviews access, exports, high-risk events, retention actions, and incidents.
- Needs read-only access to audit evidence and configuration, not blanket visibility of case content.

### Applicant/data subject

- Can submit an entry without an account or provide information through a trained staff member; receives a reference after successful public submission.
- Needs a clear bilingual notice, voluntary answers where appropriate, safe contact preferences, correction/withdrawal route, and no promises beyond the service's authority.

## 5. Core user journeys

### Intake

Public self-submission path:

1. Visitor chooses Urdu or English, reads the privacy notice, and decides whether to consent.
2. Visitor answers applicable questions, checks the answers, and submits without an account.
3. The service validates the answers, creates a case for staff review, and shows a reference number.

Staff-assisted path:

1. Officer signs in and starts a case.
2. Officer selects Urdu/English and reads the privacy/consent notice.
3. Applicant consents or declines. Decline creates no case answers; at most a non-identifying service-count event may be recorded if approved.
4. Officer completes applicable sections; draft autosaves.
5. The review page shows missing, inconsistent, and safety-attention items.
6. Officer confirms answers and submits.
7. System creates a case reference and review queue item.

### Review and referral

1. Reviewer opens permission-scoped queue and claims/receives assignment.
2. Reviewer compares record, readiness gaps, and attention signals.
3. Reviewer approves, places on hold, requests correction, or creates a referral.
4. Referral has reason, destination, owner, due date, disclosure status, and outcome.
5. Follow-up is recorded; case is closed when no action remains.

### Correction

1. Reviewer requests correction with structured field references and staff-facing rationale.
2. Original submitted snapshot remains traceable.
3. Authorized officer edits only allowed fields and resubmits.
4. New revision and audit events link to the same stable case.

## 6. User stories and acceptance criteria

### Authentication and account control

**US-AUTH-01:** As a staff member, I can securely sign in so that I can access only my authorized work.

- Valid active credentials create an opaque server-side session and redirect to the permitted landing page.
- Invalid/inactive/unknown accounts receive the same generic error.
- Login is rate-limited; success and failure are audited without storing passwords.
- Cookies are `HttpOnly`, `Secure` in production, `SameSite=Lax` or stricter, path-scoped, and never placed in URLs.

**US-AUTH-02:** As an administrator, I can disable an account and revoke its sessions immediately.

- Disabled users cannot create new sessions.
- Existing sessions stop authorizing protected requests after revocation.
- Actor, target user, reason, and timestamp are audited.

### Intake and drafts

**US-INT-01:** As an officer, I can save an incomplete intake and resume later.

- Draft may save with incomplete required fields after consent.
- UI shows saving/saved/error state and server timestamp.
- Refresh/sign-out does not lose the last confirmed server version.
- Concurrent update returns a conflict and never silently overwrites newer data.

**US-INT-02:** As an officer, I see only questions relevant to the applicant's migration stage and route.

- Visibility matches the approved rule matrix.
- Hidden data is not submitted unless explicitly retained by an approved rule.
- Server rejects a required applicable field even if browser logic is bypassed.

**US-INT-03:** As an officer, I can submit a reviewed record.

- Submission is blocked until consent, applicable required fields, and consistency checks pass.
- Submission creates an immutable revision, case reference, status event, and review-queue item.
- Browser retries are idempotent and do not create duplicates.

### Review, status, and referral

**US-REV-01:** As a case manager, I can claim or receive a submitted case.

- Only authorized in-scope users appear as assignees.
- Reassignment is audited and respects segregation-of-duties rules.
- The queue immediately reflects the current assignment/version.

**US-REV-02:** As a case manager, I can request correction without destroying the prior submission.

- Rationale and at least one affected section/field are required.
- A new editable revision is created; prior revision is read-only.
- Resubmission returns the case to review.

**US-REF-01:** As a case manager, I can create and track an appropriate referral.

- Referral destination comes from an approved directory or is explicitly “other.”
- External disclosure requires separately recorded authorization/consent or another approved basis.
- Referral status, owner, due date, outcome, and timeline are queryable.
- The platform does not transmit data externally in the MVP.

### Portal, search, and export

**US-PORT-01:** As an authorized user, I can find cases in my scope.

- Server applies permission scope before search, filter, sort, and pagination.
- Supported filters include reference, status, assigned user, date range, migration stage, destination country, attention signal, and referral status.
- Empty, loading, error, and no-access states are explicit.

**US-EXP-01:** As an export-authorized manager, I can export the filtered dataset permitted to me.

- Export repeats server-side authorization and filter application.
- Columns are selected from an allowlist; restricted fields are masked/omitted.
- CSV formula injection is neutralized.
- Export actor, filters, column profile, row count, and outcome are audited; generated files expire.

### Audit and privacy

**US-AUD-01:** As an auditor, I can inspect attributable security and case events.

- Audit events are append-only to application roles.
- Events record actor, action, target, outcome, request correlation, and safe metadata.
- Audit logs exclude session tokens, passwords, secrets, and raw sensitive answers.

**US-PRI-01:** As an applicant, I can ask for correction or withdrawal through the stated channel.

- Staff can record the request, authenticate the requester using the approved operating procedure, and route it to the privacy owner.
- The system distinguishes service withdrawal, restriction, anonymization, and legally required retention.
- Every decision and execution step is audited.

## 7. Workflow and status definitions

| Status | Meaning | Entry rule | Exit rule |
| --- | --- | --- | --- |
| `draft` | incomplete, not ready for review | created after consent | submit or discard |
| `submitted` | officer attests it is ready | all applicable validations pass | reviewer claims/assignment |
| `under_review` | active review | authorized reviewer assigned | approve, hold, correction, refer |
| `needs_correction` | identified data gap | rationale + field/section references | authorized correction/resubmit |
| `on_hold` | action blocked/pending | reason + review date | resume review, correct, refer, close |
| `approved` | intake is complete for program purposes | reviewer attestation | refer or close; not visa/legal approval |
| `referred` | one or more active referrals | referral record created | follow-up/close or return to review |
| `closed` | no active operational action | closure outcome required | reopen with privilege and reason |
| `archived` | removed from active operations | retention/administrative policy | privileged restore/anonymize |

UI wording must never present `approved` as government, visa, employment, or legal approval.

## 8. Functional requirements

- **FR-001:** Stable, non-sequential case reference; internal IDs never form public identifiers.
- **FR-002:** Each case references an immutable form version and answer revision.
- **FR-003:** Draft autosave is debounced and displays last server-confirmed save time.
- **FR-004:** Server validation is authoritative for all fields and transitions.
- **FR-005:** All reads and writes enforce role plus record scope.
- **FR-006:** Sensitive values are masked in lists and hidden from roles without field access.
- **FR-007:** Case search must not log search terms because they may contain PII.
- **FR-008:** Referral directory entries are versioned with verification date and owner.
- **FR-009:** Exports use background generation if estimated workload exceeds synchronous limits.
- **FR-010:** All timestamps are stored in UTC and displayed in user-configured Pakistan time by default.
- **FR-011:** All state-changing endpoints support CSRF protection and idempotency where retry is likely.
- **FR-012:** Audit records cover login, access denial, sensitive view, write, transition, assignment, referral, export, retention, user/role, and configuration events.

## 9. Non-functional requirements

### Security and privacy

- Target OWASP ASVS 5.0 Level 2.
- TLS in transit and managed encryption at rest; secrets in a dedicated secret store.
- Argon2id password hashing and cryptographically random opaque sessions stored only as token hashes.
- Inactivity and absolute session timeouts configured by security owner; step-up authentication for bulk export/user-role changes should be supported.
- No PII, tokens, answers, or free text in URLs, analytics, routine logs, or client error telemetry.
- Production access uses least privilege and separate operator/database roles.

### Availability and recoverability

- Initial target: 99.5% monthly availability excluding agreed maintenance.
- Automated database backups; encrypted, access-controlled, geographically appropriate storage.
- Proposed RPO <= 24 hours and RTO <= 8 hours for MVP, subject to business approval.
- Quarterly restore test and documented incident/rollback process.

### Performance

- p95 authenticated page navigation <= 2.5 seconds on representative broadband after initial load.
- p95 draft save and routine API read <= 800 ms excluding degraded external infrastructure.
- First 20 server-filtered results <= 2 seconds for 100,000 cases on production-like indexed data.
- Submission is idempotent and gives clear retry state on network interruption.

### Accessibility and localization

- WCAG 2.2 AA; keyboard, visible focus, programmatic labels/errors, status announcements, reflow at 200% zoom.
- Urdu and English have equivalent functionality and policy meaning.
- RTL/LTR is set at the language container; use CSS logical properties.
- Noto Sans Arabic for Urdu, Inter for English/numeric portal content, with tested fallbacks.

### Maintainability and observability

- Strict TypeScript, documented API schemas, feature-level ownership, automated migrations/index scripts.
- Structured logs with request IDs and redaction; metrics for latency, errors, queue age, save/submit failures.
- Alerts must identify system failure without embedding applicant data.

## 10. Assumptions and constraints

- Staff have organizational accounts and receive safeguarding/privacy training.
- Applicants may submit publicly without an account or receive staff-assisted intake.
- Official referral contacts require periodic human verification; the booklet may become outdated.
- The organization will appoint product, privacy, safeguarding, and information-security owners.
- Final legal basis, retention, cross-border hosting, and disclosure language require Pakistani legal review.

## 11. Definition of MVP done

- All P0 backlog items and required P1 release gates pass.
- Approved bilingual field dictionary and conditional rules are implemented exactly.
- End-to-end intake, review, correction, referral, close, search, and controlled export work for each role.
- Privacy notice/consent and retention schedule are signed off.
- No critical/high security or accessibility defects remain.
- Backup restore, account revocation, audit review, and incident runbook are exercised in staging.
