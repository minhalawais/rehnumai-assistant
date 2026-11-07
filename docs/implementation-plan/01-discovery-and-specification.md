# Phase 1: Discovery, Research, and Specification

## Purpose

Define the migration-intake platform precisely enough that implementation can begin without guessing about form fields, privacy, ownership, or workflow. This phase converts the Migration Booklet into a structured, safe-migration case-intake and referral product; it does **not** attempt to digitize every page of guidance.

## Product boundary

### In scope for the MVP

- Authenticated staff users enter and save migration intake records.
- Urdu-first, English-supported case intake and readiness assessment.
- Legal-migration readiness checklist, risk screening, review, referral, and follow-up.
- A secure portal to search, filter, review, and export permitted submission data.

### Explicitly out of scope for the MVP

- Public self-registration and anonymous public data entry.
- A no-code form-builder.
- Direct integrations with BEOE, OEC, FIA, OPF, embassies, SMS, WhatsApp, or email providers.
- Automated legal advice, eligibility decisions, or verification of third-party claims.
- Offline-first synchronization across multiple devices.

## Source-to-product interpretation

The booklet focuses on safe and legal migration, preparation for overseas employment, document readiness, recruiter/agent verification, safe travel, worker protections, remittances, return/reintegration, and official support channels. The product will operationalize these concepts through the following modules:

| Booklet concept | MVP product capability |
| --- | --- |
| Safe/legal migration | Legal route and agent/employer verification questions |
| Readiness checklist | Versioned document and preparation checklist |
| Avoiding illegal routes and fraud | Risk flags, reviewer queue, referral outcome |
| Women migrant safety | Optional safety-specific guidance/referral fields; never infer risk automatically |
| Official support mechanisms | Referral directory and case referral history |
| Return/reintegration | Migration stage and return/reintegration support needs |

## Required workshops and decisions

Run the workshops below before finalizing the form schema. Capture decisions in `docs/implementation-plan/decision-log.md`.

1. **Operations workflow workshop**
   - Identify data-entry staff, reviewers, supervisors, and system administrators.
   - Confirm case ownership, maximum review time, escalation path, and follow-up cadence.
   - Decide whether one person can submit multiple cases and whether amendments require approval.

2. **Data-protection workshop**
   - Confirm the legal basis, consent wording, data controller, retention period, and deletion/anonymization protocol.
   - Decide which fields are mandatory, optional, or prohibited.
   - Confirm who may export data and which fields must be masked outside the portal.

3. **Form-content workshop**
   - Validate every label and answer option in Urdu and English.
   - Confirm referral organizations and contact details from an official, maintained source.
   - Approve risk indicators and ensure they guide human review rather than make automated legal or welfare decisions.

4. **Reporting workshop**
   - Approve dashboards, monthly reports, required columns, and export formats.
   - Define “submitted,” “reviewed,” “approved,” “on hold,” and “referred” precisely.

## Approved MVP workflow

```text
Draft -> Submitted -> Under review -> Approved
                             |             |
                             v             v
                         On hold        Referred -> Follow-up complete
                             |
                             v
                      Needs correction -> Submitted
```

- Only `draft` records are editable by the author without a review action.
- A reviewer may transition a submitted record to `under_review`, `on_hold`, `needs_correction`, `approved`, or `referred`.
- Every transition requires an authenticated actor, timestamp, and optional/required rationale as defined by workflow.
- Records are archived rather than hard-deleted. Anonymization is a privileged, auditable operation.

## Proposed intake form definition

The final field dictionary must be approved in a spreadsheet or JSON document. The following is the concrete starting structure.

### Page 1 - Consent and intake context

- Consent to collect and process case information; required checkbox.
- Consent date/time, captured server-side.
- Data-entry staff identity, captured server-side.
- Entry source: walk-in, phone, outreach, referral, other.
- Preferred language: Urdu, English, other.

### Page 2 - Applicant profile

- Full name, preferred name, CNIC/passport reference only if operationally necessary.
- Phone number, optional email, province/district/city, preferred contact method.
- Age band; do not collect date of birth unless approved as essential.
- Gender: self-described/optional/prefer not to say.
- Emergency contact only with explicit explanation and consent.

### Page 3 - Migration plan

- Current migration stage: exploring, preparing, job offer received, pre-departure, overseas, returned.
- Intended purpose: employment, education, family, visit, other.
- Destination country and city where known.
- Target occupation/sector, intended departure window, language readiness.
- Employer details and job-offer/contract availability when applicable.

### Page 4 - Legal route and document readiness

- Recruitment path: direct employer, registered OEP, OEC, family/contact, unknown, other.
- OEP licence/reference number where supplied; do not claim automatic validation in the MVP.
- Readiness checklist: job offer/contract, valid passport, education proof, technical certificates, CV/cover letter, work experience, insurance, language proof, police clearance, itinerary, translations.
- Each checklist item has `status` (`available`, `in_progress`, `not_available`, `not_applicable`) and optional note.

### Page 5 - Safety and risk screen

- Agent/employer information available and independently checked.
- Written contract available and understood.
- Payment requested and receipt available.
- Visit-visa-for-work intent, false-document concern, undocumented route concern, pressure/coercion concern, passport retention concern.
- User-requested assistance category and free-text notes.
- The UI must state that answers lead to support/referral, not an automated decision.

### Page 6 - Referral, follow-up, and review

- Suggested/manual referral destination: MRC/PGFRC, BEOE, OEC, OPF, FIA, Pakistani mission/CWA, legal support, psychosocial support, other.
- Referral reason, status, responsible staff member, planned follow-up date.
- Internal notes are role-protected and never included in standard data-entry exports.
- Review outcome, reviewer rationale, and next action.

## UX and visual-design specification

### Experience principles

- Trustworthy, calm, and authoritative.
- Make complex migration processes easier without offering legal guarantees.
- Prioritize clarity, privacy, and error prevention over visual novelty.
- Support low digital literacy and mobile entry.

### Visual tokens

| Token | Value | Use |
| --- | --- | --- |
| Primary navy | `#073B5C` | navigation, headings, primary actions |
| Teal | `#0D766E` | positive action, active progress, approved states |
| Amber | `#C48117` | attention and on-hold states |
| Critical red | `#B42318` | error and high-risk indicator only |
| Ink | `#14212B` | primary text |
| Muted ink | `#52606D` | supporting text |
| Canvas | `#F5F8FA` | page background |
| Surface | `#FFFFFF` | cards and inputs |

### Typography and direction

- Use **Noto Sans Arabic** for Urdu labels and prose, with `dir="rtl"` at the relevant language root.
- Use **Inter** for English and numeric/data-dense interface areas.
- Use tabular numerals in the portal, including case references and dates.
- Do not use Nasta'liq as the UI font; it harms form readability, alignment, and dense-table scanning.
- Design RTL as a first-class layout, not as text placed into LTR components.

### Key screens

- Login: restrained split layout, service identity, only essential help text, no public-registration link.
- New entry: one clear task per page; visible progress; persistent save-draft action; plain language; contextual safety guidance.
- Portal: compact left navigation, KPIs, review queue, filterable table, clear validation-status chips, no decorative charts without a decision purpose.
- Record detail: answers grouped by section, status timeline, referral panel, reviewer actions in a protected action area.

## Architecture decisions to approve

### Stack

- Next.js App Router and TypeScript.
- MongoDB Atlas and official MongoDB Node.js driver.
- Tailwind CSS plus accessible, composable primitives based on Radix/shadcn conventions.
- React Hook Form and Zod for client/server shared validation schemas.
- TanStack Table for server-paginated portal tables.
- Playwright, Vitest, and Testing Library for verification.

### Application structure

```text
app/
  (public)/login/
  (protected)/dashboard/
  (protected)/entries/new/
  (protected)/entries/[id]/
  api/
features/
  auth/ intake/ submissions/ referrals/ audit/
components/
  ui/ form/ portal/
lib/
  db/ auth/ validation/ security/
```

Use feature modules with a `schema`, `service`, `repository`, `policy`, and UI layer. Route handlers must call services; UI components must never access MongoDB directly.

### Authentication and security

- Provisioned staff accounts only; no self-service signup.
- Argon2id password hashes, opaque random session tokens stored as hashes in MongoDB, and `Secure`, `HttpOnly`, `SameSite=Lax` cookies.
- Node runtime for auth/database routes; never depend on MongoDB in Edge middleware.
- Roles: `super_admin`, `admin`, `case_manager`, `data_entry`, `viewer`.
- Check authorization in every service operation, not merely in navigation or middleware.
- Rate-limit login/reset endpoints; rotate sessions after password changes; log authentication and authorization events.

## Data model baseline

| Collection | Responsibility | Essential indexes |
| --- | --- | --- |
| `users` | staff accounts, role, status | unique normalized email; role/status |
| `sessions` | hashed opaque sessions, expiry, revocation | unique token hash; TTL expiry; userId |
| `cases` | intake identity, workflow status, searchable summary | caseReference; status/updatedAt; destination; assignedTo |
| `caseAnswers` | versioned structured answers | unique caseId/formVersion |
| `referrals` | referral lifecycle and follow-up | caseId/status/followUpAt |
| `auditEvents` | immutable actor/action/target trail | targetId/createdAt; actorId/createdAt |
| `formDefinitions` | approved versioned form schema | unique version/status |

## Phase exit criteria

- Product owner signs off on the scope, data dictionary, Urdu/English copy, workflow, RBAC matrix, and reporting needs.
- Privacy owner signs off on consent, sensitive-field minimization, retention, access, export, and incident requirements.
- Technical owner signs off on architecture, API contract, data model, environments, and operational controls.
- All open decisions have an owner and a due date; no implementation begins with unknown mandatory fields.

## Implementation prompt

```text
Act as a senior product manager, UX architect, data-protection specialist, and solution architect. Analyze the Migration Booklet and turn this approved Phase 1 plan into a complete implementation specification. Produce a bilingual field dictionary, form JSON schema, conditional logic matrix, RBAC matrix, acceptance criteria, MongoDB model, API contract, privacy/retention policy, and clickable-screen specification. Preserve the stated MVP boundaries. Do not add public registration, automated legal decisions, or an unapproved third-party integration.
```
