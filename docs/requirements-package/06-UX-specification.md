# UX Sitemap and Screen Specifications

## 1. Experience architecture

### Public/authentication area

```text
/
/intake
/booklet
/login
/forgot-password
/reset-password
/privacy
/accessibility
```

The public home page offers self-submission and the Migration Booklet. Public intake explains consent, the information requested, staff review, and the receipt reference before submission. Staff sign-in is a separate path.

### Protected portal

```text
/dashboard
/cases
  /new
  /drafts
  /[caseReference]
    /overview
    /review
    /referrals
    /activity
/referrals
/exports
/privacy-requests        (restricted)
/administration/users    (admin)
/administration/teams    (admin)
/administration/directory
/administration/audit
/account/security
```

## 2. Global UX requirements

- Default language is Urdu for first-run/unset organization preference; a visible language switch is available without losing progress.
- Set `lang="ur" dir="rtl"` or `lang="en" dir="ltr"` on the correct root/container.
- Use Noto Sans Arabic for Urdu and Inter for English/numeric table content.
- Use CSS logical properties so navigation, icons, progress, padding, and back/next semantics mirror correctly.
- Desktop portal: persistent side navigation; mobile: accessible drawer. Form remains a focused single-column flow.
- All pages include skip link, semantic landmarks, one H1, visible keyboard focus, programmatic field errors, and polite save/status announcements.
- Destructive/privileged actions state consequence, require confirmation/reason where applicable, and return focus predictably.
- No case identifiers or PII in page titles sent to analytics, URL query text, or error-monitoring breadcrumbs.

## 3. Visual design

| Token | Value | Purpose |
| --- | --- | --- |
| Navy 700 | `#073B5C` | primary navigation and headings |
| Teal 600 | `#0D766E` | primary action and completed state |
| Amber 600 | `#C48117` | attention/on-hold |
| Red 700 | `#B42318` | error/immediate attention only |
| Ink 900 | `#14212B` | primary text |
| Ink 600 | `#52606D` | supporting text |
| Canvas | `#F5F8FA` | background |
| Surface | `#FFFFFF` | cards/forms |
| Border | `#D8E1E8` | boundaries |

- Avoid decorative gradients, glass effects, oversized hero content, or playful illustration in operational screens.
- Status chips contain text and an icon/shape; meaning is never color-only.
- Minimum body size: 16px on forms; line height 1.6 for Urdu form prose.

## 4. Screen specifications

### UX-01 Login

**Purpose:** secure entry for provisioned staff.

**Content:** organization/service identity, email, password, show-password control, sign-in, forgot password, language switch, privacy link, support contact.

**Behavior:** generic error; loading prevents double submit; password managers supported; no public sign-up; inactive/unknown account indistinguishable.

**Responsive:** centered card on mobile; restrained two-column context panel on wide screens, but form stays dominant.

**Acceptance:** keyboard completion, errors announced, no credentials in URL/log/analytics, return-to only accepts safe internal paths.

### UX-02 Forgot/reset password

**Purpose:** safe account recovery.

**Behavior:** always show neutral acknowledgement; reset token single-use/short-lived; password rules shown before submission; successful reset revokes prior sessions.

### UX-03 Dashboard

**Purpose:** show actionable workload within user scope.

**Content:** new entry button (authorized roles), assigned to me, awaiting review, correction, on hold, active referrals, overdue follow-up, recent cases.

**Behavior:** metrics link to pre-filtered case/referral views; no PII in cards; counts use same server scope as lists.

**Empty state:** role-specific next action, never misleading zero if data failed to load.

### UX-04 Cases list

**Purpose:** find and manage records.

**Columns:** reference, applicant display name (masked if required), stage, destination, status, attention label, assignee, updated date. Default excludes phone, CNIC fragment, narrative, agent details.

**Controls:** scoped search, status/stage/destination/assignee/date/referral filters, sort, column chooser, saved personal view, export if permitted.

**Mobile:** cards show reference/status/name/stage/assignee; filters open full-screen sheet; preserve applied-filter summary.

**States:** skeleton, no records, no filter matches, permission denied, failed query with retry.

### UX-05 Drafts

**Purpose:** resume or discard incomplete own/assigned work.

**Content:** reference, applicant preferred/full name, completed step, last server save, creator, expiry warning.

**Behavior:** resume returns to first incomplete/applicable page; discard explains recovery window; expiring drafts receive non-PII notice.

### UX-06 New intake shell

**Persistent elements:** service title, language switch, page progress, save state, save and exit, help/privacy, case reference after draft creation.

**Page pattern:** section title, one-sentence purpose, grouped questions, contextual help, previous/next. Avoid more than 8-10 cognitively substantial inputs on a page.

**Autosave:** `Saving...`, `Saved at HH:MM`, `Not saved - Retry`; never show saved before server acknowledgement.

**Exit:** warn only when unsaved local changes exist.

### UX-07 Intake step 1 - Notice and consent

**Content:** bilingual notice in selected language; read/read-aloud mode; service consent; contact consent; referral-discussion consent.

**Behavior:** if service consent declined, explain the service cannot create a personal case and show approved non-digital help route. Do not collect subsequent answers.

### UX-08 Intake step 2 - Applicant and safe contact

**Content:** identity-minimized profile, age band, optional demographics, safe contact preference, broad location, optional emergency contact.

**Safeguards:** explain why contact is requested; full CNIC not accepted; safe instructions hidden from list views.

### UX-09 Intake step 3 - Migration plan

**Content:** stage, purpose, destination, departure period, duration, occupation/sector, language readiness.

**Behavior:** exploring/undecided path remains short; returned/overseas paths adapt without showing irrelevant pre-departure questions.

### UX-10 Intake step 4 - Employment and legal route

**Content:** offer/employer, recruitment channel, OEP/agent, licence claim/check status (reviewer-only), contract understanding, payment/receipt, visit-visa-for-work question.

**Copy:** explicitly say that recording a licence number or “available” document does not verify authenticity.

### UX-11 Intake step 5 - Readiness checklist

**Content:** each applicable booklet-derived item as a four/five-state segmented radio/select with short optional note.

**Interaction:** group into identity/travel, employment/skills, safety/pre-departure; show section completion; `not applicable` only where allowed.

### UX-12 Intake step 6 - Safety and support

**Content:** supportive yes/no/prefer-not-to-say questions, support-needs selection, restricted narrative, safe-contact confirmation.

**Behavior:** positive attention answer shows calm help text and staff SOP panel. Immediate danger shows the approved emergency procedure; the UI must not suggest merely finishing the form.

**Privacy:** visually mark restricted notes as internal and explain who can read them.

### UX-13 Intake step 7 - Overseas or return (conditional)

**Overseas:** arrival/residency status, passport control, contract match, mission/CWA awareness, remittance guidance need.

**Returned:** return period/type and reintegration needs (employment, skills, business, health, psychosocial, documentation, legal).

### UX-14 Review and submit

**Content:** section summaries, missing/inconsistent items, attention panel, consent/contact summary, edit-section links, officer attestation.

**Behavior:** submission validates server-side; focus moves to error summary with links; idempotent retry; success displays case reference and next operational step.

### UX-15 Case overview

**Header:** reference, unambiguous program status, stage, assignee, updated time, permitted actions.

**Body:** snapshot sections; sensitive areas collapsed with access label; readiness summary; referrals; next action.

**Never:** describe `approved` as visa/employment/government approval.

### UX-16 Review workspace

**Purpose:** structured human review.

**Layout:** answers/readiness on main pane; attention signals, assignment, checklist, and actions in side panel on desktop; stacked on mobile/tablet.

**Actions:** begin review, approve for program purposes, request correction, hold, refer, close. Each shows exact required rationale/fields and resulting status.

**Concurrency:** warn when record version changed; offer reload/diff, never silent overwrite.

### UX-17 Correction mode

**Content:** reviewer rationale and affected sections pinned at top; prior submitted value available to authorized user; only permitted fields editable.

**Submit:** shows changes summary; creates new revision; prior snapshot remains read-only.

### UX-18 Referrals list and detail

**List:** case reference, category, destination, status, owner, due date/overdue.

**Create/detail:** reason, approved directory entry, owner, due date, disclosure authorization, explicit field list, outcome timeline.

**Privacy preview:** before recording an authorized disclosure, show exactly which values would be shared. MVP does not transmit automatically.

### UX-19 Activity/audit timeline

**Content:** human-readable action, actor display, timestamp, outcome, safe reason; filter by status/referral/access/export.

**Privacy:** values/tokens excluded; only permitted auditors see technical security metadata.

### UX-20 Exports

**Content:** export profile, active filters, permitted columns, estimated row count, purpose/reason, expiry, previous own jobs.

**Behavior:** step-up auth where required; create job; download link short-lived and single-user; audit success/failure/download.

### UX-21 User/team administration

**Content:** users, active state, role assignments, teams/locations, P3 training flag, last sign-in, session revoke.

**Behavior:** no self-elevation; warn about scope impact; session revoke on role/state change; do not display password hashes/reset tokens.

### UX-22 Referral directory administration

**Content:** organization/category/country, official contact display, source, verified date, verifier, expiry/review date, active state.

**Behavior:** stale entries warn and cannot be used for automatic disclosure; maker-checker approval recommended.

### UX-23 Privacy requests

**Restricted content:** request type, identity-verification status, scope, decision, actions, completion. Case teams see only minimal status necessary to cooperate.

## 5. Content design rules

- Use “آپ کی فراہم کردہ معلومات” / “information you provided,” not accusatory labels.
- Use “توجہ درکار” / “attention required,” not “illegal,” “fraudster,” or “victim” as a system determination.
- Use “پروگرام کے جائزے کے لیے مکمل” for approved status in Urdu copy; pair with an explanation that it is not legal/government approval.
- Explain acronyms at first use: Overseas Employment Promoter (OEP), Community Welfare Attaché (CWA), etc.
- Error messages say what happened and how to fix it; never blame the applicant.
- Never promise confidentiality without explaining approved exceptions and access.

## 6. Responsive and accessibility acceptance

- Fully usable at 320 CSS px without horizontal page scrolling; data tables may use card transformation or controlled internal scroll with labels.
- At 200% zoom, actions and errors remain available without overlap.
- All form controls have visible labels and descriptions connected by IDs.
- Error summary receives focus and links to invalid controls.
- Save/status messages use appropriate live regions without excessive announcements.
- Dialogs trap focus only while open and restore focus on close.
- RTL arrow icons, progress direction, breadcrumbs, and previous/next placement are tested with Urdu users, not mechanically mirrored without semantics.
