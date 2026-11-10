# Booklet Traceability, Assumptions, Open Decisions, and Sign-off

## 1. Traceability to the Migration Booklet

| Booklet topic | Product requirement | Fields/workflow |
| --- | --- | --- |
| Legal vs irregular migration and “Dunki” dangers | supportive route/safety screening and trained review | `irregularRouteSuggested`, `falseDocumentsSuggested`, AT-004/005; no automatic legal label |
| Benefits of legal/documented migration | readiness and official-channel workflow | migration plan, recruitment channel, readiness checklist |
| Overseas employment preparation | stage-specific intake | stage/purpose/destination/occupation/language readiness |
| Required documents checklist | structured status per item | job offer, passport, qualifications, technical certificates, CV, experience, insurance, language, police clearance, itinerary, translations |
| Skills, CV, language preparation | preparation gaps and support | readiness items, support needs |
| BEOE/OEC and agent/OEP verification | record claimed route and manual verification status | recruitment channel, OEP reference, reviewer verification metadata |
| Warning signs of fake/unsafe recruitment | attention signals and referral discussion | payment/receipt, work on visit visa, unclear route/employer, pressure, documents withheld |
| Women migrant safety guidance | safe contact and safeguarding-sensitive handling | contact preference, safe instructions, emergency contact opt-in, restricted safety questions; no gender-based assumption |
| Destination and pre-departure preparation | stage-specific checklist | copies, itinerary, family details, mission contacts |
| Arrival, employer/contract, laws and rights abroad | overseas support screen | arrival status, passport control, contract match, mission/CWA awareness |
| Digital literacy and safe communication | accessible bilingual digital intake | Urdu-first responsive form, assisted/read-aloud notice, safe contact |
| Legal remittance channels | awareness/guidance need only | remittance-channel awareness; no financial data |
| Return and reintegration | returned-migrant support route | return type/date, reintegration needs, referral category |
| Government/international support institutions | versioned referral directory | referral categories/destination/source/verification date |
| Complaint mechanisms | complaint/legal/official referral categories | BEOE/OEP, FIA/unregistered agent, OPF, mission/CWA categories |

## 2. Deliberate interpretation decisions

- **2026-11-10 — Kobo-aligned public intake:** Consent screens removed. Migrant category is `potential_migrants` | `return_migrants`. Return block fields (`countryReturnFrom`, `reasonForReturning`, `dateOfReturn`, `currentStatus`) are hidden and stripped on submit for potential migrants only.
- **2026-11-07 — Public entry model:** The product owner selected public self-submission for the main menu. Visitors can submit an entry without an account and receive a reference; staff review submissions in the protected workspace. This supersedes the original staff-only intake assumption A-01 and the related exclusion in the initial PRD. Privacy, safeguarding, abuse prevention, and public support copy need review for this model before production sign-off.
- The booklet is guidance material, not an intake instrument. The platform operationalizes only data needed to provide readiness guidance, review, referral, and follow-up.
- The booklet contains contact and institutional information that may become stale. The app uses a separately verified, versioned referral directory rather than hard-coding booklet contacts.
- Gender does not automatically show invasive safety questions; the core safety screen applies respectfully to everyone, while support can be tailored by trained staff.
- “Approved” is a program workflow state only. It is never displayed as visa, job, OEP, government, or legal approval.
- A claimed document or licence is not verified merely because its status is `available`.
- Numeric risk scoring is excluded because it could imply unjustified precision and harmful classification.

## 3. Assumptions

| ID | Assumption | Validation owner |
| --- | --- | --- |
| A-01 | Superseded by the 2026-11-07 public self-submission decision above | Product/operations |
| A-02 | One organization operates the initial tenant, with multiple teams/locations | Product/technical |
| A-03 | Staff connectivity is sufficient for online operation; drafts recover from ordinary interruption | Operations |
| A-04 | No document upload is required for MVP service delivery | Operations/privacy |
| A-05 | Manual official-site verification is acceptable for OEP/licence claims | Operations |
| A-06 | Referral information is recorded but not transmitted automatically | Operations/privacy |
| A-07 | Applicants can receive service even if optional demographics are declined | Product/privacy |
| A-08 | Pakistan time is the default UI timezone; records store UTC | Technical |

## 4. Open decisions blocking implementation

| ID | Decision | Options/impact | Owner | Due before |
| --- | --- | --- | --- | --- |
| D-01 | Data controller and privacy contact | required in notice and request flow | Executive/privacy | form build |
| D-02 | Lawful basis by purpose and safeguarding exception | determines consent/withdrawal/disclosure behavior | Legal/privacy | form build |
| D-03 | Minor intake/guardian/safeguarding protocol | cannot be invented in UI | Safeguarding/legal | safety step |
| D-04 | Final case retention and backup expiry | affects storage, notices, jobs | Legal/privacy/operations | production data model |
| D-05 | Hosting region and processor list | cross-border/security review | Security/privacy | infrastructure |
| D-06 | Whether father/spouse name is operationally necessary | remove if not necessary | Operations/privacy | schema approval |
| D-07 | Whether CNIC last four is necessary | remove if case reference is sufficient | Operations/privacy | schema approval |
| D-08 | Exact team/location scopes and reassignment policy | affects authorization/query design | Operations/security | IAM implementation |
| D-09 | Export profiles, thresholds, and approvers | affects step-up/two-person design | Program/privacy | export implementation |
| D-10 | Review/assignment/follow-up SLAs | affects queues and alerts | Operations | dashboard |
| D-11 | Official referral directory and review frequency | stale contacts can harm users | Operations | referral implementation |
| D-12 | Emergency SOP availability by location/time | UI must show real action, not a dead end | Safeguarding | safety implementation |
| D-13 | RPO/RTO and availability target approval | affects infrastructure cost | Executive/technical | production |
| D-14 | Password recovery delivery channel/identity provider | requires safe email/IdP design | Security/technical | auth implementation |
| D-15 | Urdu terminology and accessible plain-language review | policy equivalence and comprehension | Content/operations | UAT |

## 5. Decision record template

```text
Decision ID:
Title:
Date/status:
Owner/approvers:
Context:
Options considered:
Decision and rationale:
Privacy/security/safeguarding impact:
Requirements/files affected:
Review date:
```

## 6. Requirements traceability template

| Requirement ID | Source | Design/component | API/service | Automated test | UAT case | Evidence/status |
| --- | --- | --- | --- | --- | --- | --- |
| US-INT-01 | PRD/draft need | Intake shell | PATCH draft | `draft-save.spec` | UAT-01 | pending |
| US-REV-02 | review workflow | Correction mode | transition/revision | `correction-flow.spec` | UAT-04 | pending |
| US-EXP-01 | privacy/RBAC | Export screen | export jobs | `export-policy.spec` | UAT-08 | pending |

The delivery team must complete this matrix for every `must`, user story, API permission, conditional rule, and P0 backlog item before release.

## 7. Required sign-off

| Area | Accountable approver | Confirms |
| --- | --- | --- |
| Product | Product owner | scope, stories, status semantics, success measures |
| Operations | Program/operations owner | form, workflow, SLAs, referral directory, staffing |
| Urdu/English content | Content/domain owner | bilingual equivalence, plain language, terminology |
| Privacy/legal | Appointed owner/counsel | notice, basis, fields, disclosure, requests, retention, hosting |
| Safeguarding | Safeguarding owner | attention rules, minor/emergency SOP, staff training/access |
| Security | Information-security owner | threat model, RBAC, ASVS target, testing, incident response |
| Technical | Engineering/architecture owner | model, API, performance, backup/recovery, delivery plan |

## 8. Package acceptance checklist

- [ ] All D-01..D-15 decisions resolved or explicitly deferred with safe fallback.
- [ ] No field exists without a purpose, owner, privacy class, validation rule, and retention treatment.
- [ ] Urdu and English notice/form copy have equivalent meaning and domain review.
- [ ] Every attention signal maps to a real staffed SOP or referral action.
- [ ] Every portal action has a server-side permission and audit event.
- [ ] Export profiles and P3 access are explicit rather than inherited from broad admin access.
- [ ] Every P0 backlog item has acceptance evidence and an owner.
