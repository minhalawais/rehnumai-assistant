# Ordered Release Backlog

## Backlog rules

- `P0` is required for secure MVP release.
- `P1` is required unless product/security owner records a release exception.
- `P2` is post-MVP or optional optimization.
- Dependencies are hard unless explicitly waived by the accountable owner.
- The order below is the recommended implementation sequence, not merely a thematic grouping.

## Milestone 0 - Governance and signed-off inputs

| ID | Pri | Item | Depends on | Done when |
| --- | --- | --- | --- | --- |
| GOV-001 | P0 | Name product, operations, privacy, safeguarding, security, and technical owners | - | owners and escalation contacts recorded |
| GOV-002 | P0 | Approve bilingual field dictionary and form rules | GOV-001 | each field/rule signed off; disputes resolved |
| GOV-003 | P0 | Approve privacy notice, lawful basis, consent/refusal workflow | GOV-001 | counsel/privacy approval recorded |
| GOV-004 | P0 | Approve retention, legal-hold, deletion/anonymization schedule | GOV-003 | schedule and accountable operator approved |
| GOV-005 | P0 | Approve safeguarding/emergency SOP including minors | GOV-001 | staff action, escalation, contact, and availability documented |
| GOV-006 | P0 | Verify referral directory from current official sources | GOV-001 | entry owner/source/verified/review date recorded |
| GOV-007 | P0 | Approve RBAC, teams, locations, export profiles | GOV-001 | role/scope/field access signed off |
| GOV-008 | P0 | Decide hosting region/processors and complete privacy/security review | GOV-003 | approved architecture and processor register |

## Milestone 1 - Engineering foundation

| ID | Pri | Item | Depends on | Done when |
| --- | --- | --- | --- | --- |
| ENG-001 | P0 | Initialize strict TypeScript Next.js App Router project | GOV-002 | build/lint/typecheck pass |
| ENG-002 | P0 | Configure environment schema and secret handling | ENG-001, GOV-008 | missing/invalid config fails safely; no secrets committed |
| ENG-003 | P0 | Implement MongoDB client, repositories, transactions, index scripts | ENG-001, GOV-008 | integration connectivity/index tests pass |
| ENG-004 | P0 | Implement error envelope, request IDs, redacted logging | ENG-001 | safe structured error/log tests pass |
| ENG-005 | P0 | Configure CI quality/security gates | ENG-001 | PR pipeline typecheck/lint/test/build/secret/dependency scan |
| ENG-006 | P1 | Docker development/runtime build | ENG-001, ENG-002 | deterministic health-checked container |
| ENG-007 | P0 | Create dev/staging synthetic fixtures policy | GOV-003, ENG-003 | no production PII; repeatable seed data |

## Milestone 2 - Design system, i18n, and application shell

| ID | Pri | Item | Depends on | Done when |
| --- | --- | --- | --- | --- |
| UX-001 | P0 | Implement tokens, fonts, responsive shell | ENG-001 | matches approved navy/teal system and breakpoints |
| UX-002 | P0 | Implement Urdu RTL/English LTR routing/context | UX-001, GOV-002 | direction/language persists; no data loss on switch |
| UX-003 | P0 | Build accessible form primitives and error summary | UX-001 | keyboard/screen-reader component tests pass |
| UX-004 | P0 | Build portal navigation, mobile drawer, page states | UX-001 | role-ready shell with loading/empty/error/denied states |
| UX-005 | P1 | Component documentation/story fixtures | UX-003 | core states documented in both directions |

## Milestone 3 - Authentication and authorization

| ID | Pri | Item | Depends on | Done when |
| --- | --- | --- | --- | --- |
| IAM-001 | P0 | User/session collections and Argon2id credential service | ENG-002, ENG-003 | hash/session unit + integration tests pass |
| IAM-002 | P0 | Login/logout/session expiry/revocation | IAM-001, UX-003 | secure cookie flow and generic errors verified |
| IAM-003 | P0 | Forgot/reset password with single-use expiry | IAM-001 | no enumeration; reset revokes sessions |
| IAM-004 | P0 | Role/scope/field policy engine | GOV-007, IAM-001 | exhaustive allow/deny policy tests |
| IAM-005 | P0 | Server authorization enforcement pattern | IAM-004, ENG-003 | services require actor; repositories inaccessible from routes/UI |
| IAM-006 | P0 | CSRF/origin defense and login/reset rate limits | IAM-002 | abuse tests pass |
| IAM-007 | P1 | Step-up/MFA-ready abstraction for privileged actions | IAM-002 | export/role change can require recent auth |
| IAM-008 | P0 | Admin user provisioning, disablement, roles/scopes, session revoke | IAM-004, UX-004 | no self-elevation; changes audited and immediate |

## Milestone 4 - Form definition and intake

| ID | Pri | Item | Depends on | Done when |
| --- | --- | --- | --- | --- |
| FORM-001 | P0 | Encode approved bilingual form definition/version | GOV-002, UX-002 | schema hash/version snapshot tests pass |
| FORM-002 | P0 | Encode conditional, validation, consistency, attention rules | FORM-001 | rule matrix has automated tests |
| FORM-003 | P0 | Notice/consent screen and refusal behavior | GOV-003, FORM-001 | no answer-bearing case without consent |
| FORM-004 | P0 | Draft creation, autosave, manual save, version conflict | FORM-001, IAM-005, ENG-003 | refresh/retry/concurrent-write E2E passes |
| FORM-005 | P0 | Applicant/safe-contact step | FORM-003, FORM-004 | field minimization and conditional rules pass |
| FORM-006 | P0 | Migration plan step | FORM-004 | stage/purpose/destination rules pass |
| FORM-007 | P0 | Employment/legal-route step | FORM-004 | agent/OEP/payment/contract rules pass |
| FORM-008 | P0 | Booklet-derived readiness checklist | FORM-004 | all applicable readiness items captured |
| FORM-009 | P0 | Safety/support step and SOP presentation | GOV-005, FORM-002, FORM-004 | safe language, P3 access, SOP acknowledgement verified |
| FORM-010 | P0 | Overseas/return conditional steps | FORM-002, FORM-004 | stage-specific E2E tests pass |
| FORM-011 | P0 | Review, server validation, idempotent submit, receipt | FORM-005..010 | immutable revision and case reference created once |
| FORM-012 | P1 | Draft expiry warning and discard recovery window | FORM-004, GOV-004 | policy-aligned purge behavior tested |

## Milestone 5 - Portal and case review

| ID | Pri | Item | Depends on | Done when |
| --- | --- | --- | --- | --- |
| CASE-001 | P0 | Scoped case list with cursor pagination | IAM-005, FORM-011 | scope-before-query and index tests pass |
| CASE-002 | P0 | Search/filter/sort and mobile list/cards | CASE-001 | approved filters only; no raw operator injection |
| CASE-003 | P0 | Case detail by historical form version | CASE-001, FORM-011 | permissions/masking and revision rendering pass |
| CASE-004 | P0 | Assignment/claim workflow | CASE-001, GOV-007 | only eligible assignees; audit complete |
| CASE-005 | P0 | Review actions and transition service | CASE-003, CASE-004 | transition matrix and concurrency tests pass |
| CASE-006 | P0 | Correction request and new working revision | CASE-005 | prior snapshot immutable; affected fields/rationale shown |
| CASE-007 | P0 | Hold, resume, approve-for-program, close, reopen | CASE-005 | rationale/dates/outcomes enforced |
| CASE-008 | P0 | Case activity timeline | CASE-005, AUD-001 | safe human-readable events match source audit |
| CASE-009 | P1 | Scoped dashboard workload metrics | CASE-001, CASE-005 | counts reconcile with scoped lists |
| CASE-010 | P1 | Saved personal table view/column preferences | CASE-002 | no effect on other users or server scope |

## Milestone 6 - Referrals

| ID | Pri | Item | Depends on | Done when |
| --- | --- | --- | --- | --- |
| REF-001 | P0 | Versioned referral directory and stale-entry handling | GOV-006, IAM-005 | source/verification/review lifecycle works |
| REF-002 | P0 | Create referral with category/reason/owner/due date | REF-001, CASE-005 | minimum fields and scope enforced |
| REF-003 | P0 | Per-referral disclosure authorization and field allowlist | GOV-003, REF-002 | no blanket/all-fields; preview exact values |
| REF-004 | P0 | Referral status/outcome/follow-up timeline | REF-002 | allowed transitions and overdue queries pass |
| REF-005 | P1 | Referral workload list/dashboard | REF-004 | owner/team scope and overdue counts reconcile |

## Milestone 7 - Audit, privacy, retention, and exports

| ID | Pri | Item | Depends on | Done when |
| --- | --- | --- | --- | --- |
| AUD-001 | P0 | Append-only audit service/outbox | ENG-003, ENG-004 | required events persist atomically; no prohibited values |
| AUD-002 | P0 | Authentication/authorization/admin audit coverage | AUD-001, IAM-008 | event tests and denial logging pass |
| AUD-003 | P0 | Case/referral/P3 view audit coverage | AUD-001, CASE-008, REF-004 | coverage matrix complete |
| AUD-004 | P1 | Restricted audit search/review UI | AUD-001, IAM-005 | privacy/admin scopes and safe metadata pass |
| EXP-001 | P0 | Export profiles, server filter/field authorization | GOV-007, CASE-002, AUD-001 | masked allowlist and CSV injection tests pass |
| EXP-002 | P0 | Background export generation and temporary storage | EXP-001, ENG-002 | encrypted/private object, expiry, checksum, retry |
| EXP-003 | P0 | Step-up/approval/download/expiry workflow | EXP-002, IAM-007 | owner-only short-lived download; all actions audited |
| PRI-001 | P0 | Restricted privacy-request workflow | GOV-003, IAM-005, AUD-001 | access/correction/withdrawal decision trail works |
| RET-001 | P0 | Retention classification and candidate job | GOV-004, AUD-001 | dry run produces reviewable candidates only |
| RET-002 | P0 | Two-person hold/anonymize/purge workflow | RET-001, IAM-007 | restore-safe tombstone and audit verified |
| RET-003 | P1 | Backup expiry/restore deletion-reapplication process | RET-002 | restored staging data reapplies deletions/holds correctly |

## Milestone 8 - Verification and launch

| ID | Pri | Item | Depends on | Done when |
| --- | --- | --- | --- | --- |
| QA-001 | P0 | Requirements-to-test traceability matrix | all P0 design | every must requirement has evidence owner/test |
| QA-002 | P0 | Unit/component/integration suite | implementation | validation, policy, service, API coverage passes |
| QA-003 | P0 | Playwright critical journeys in Urdu/English | implementation | intake/review/correction/referral/export/admin pass |
| QA-004 | P0 | Manual WCAG 2.2 AA and RTL review | UX/FORM/CASE | no critical/high accessibility issue |
| QA-005 | P0 | ASVS Level 2 review and penetration test | complete staging | no critical/high unresolved security issue |
| QA-006 | P0 | Performance, load, poor-network, idempotency tests | staging data/indexes | agreed SLOs and recovery behavior pass |
| OPS-001 | P0 | Monitoring, alerting, runbooks, support ownership | ENG-004, full staging | actionable alerts without PII; on-call tested |
| OPS-002 | P0 | Backup/restore and rollback rehearsal | GOV-004, staging | RPO/RTO evidence and rollback sign-off |
| UAT-001 | P0 | Staff UAT with anonymized scenarios | QA-003 | operational owners sign off or defects resolved |
| TRAIN-001 | P0 | Staff privacy, safeguarding, referral, and system training | GOV-005, UAT-001 | attendance/competence recorded before access |
| LAUNCH-001 | P0 | Limited pilot and go/no-go review | all P0 | signed release checklist and rollback window |

## Post-MVP backlog

| ID | Pri | Item | Depends on | Rationale |
| --- | --- | --- | --- | --- |
| FUT-001 | P0 | Public intake production review and hardening (moved into scope 2026-11-07) | privacy, safeguarding, abuse, and accessibility review | public self-submission is now the selected entry model; its release controls need approval |
| FUT-002 | P2 | Offline-first encrypted device queue | device/security model | complex synchronization and lost-device risk |
| FUT-003 | P2 | Approved document uploads | malware/private-storage design | significant attack surface and retention burden |
| FUT-004 | P2 | External BEOE/OEC verification integration | official API/agreement | avoid unreliable scraping/false verification |
| FUT-005 | P2 | Email/SMS/WhatsApp notifications | processor + safe-contact approval | disclosure and message-content risks |
| FUT-006 | P2 | Configurable form-builder | stable operational need | premature complexity for MVP |
| FUT-007 | P2 | De-identified analytics warehouse | anonymization governance | only after reporting thresholds are understood |

## Critical path

```text
Governance approvals
  -> engineering/data foundation
  -> authentication + policy engine
  -> versioned form + drafts + submit
  -> case review + referral
  -> audit + export + retention
  -> security/accessibility/UAT/restore
  -> limited pilot
```

No team should begin production form implementation before GOV-002/003/005/007 are approved; otherwise field, consent, safety, and authorization rework is likely and could create unsafe behavior.
