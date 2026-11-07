# Rehnumai UI/UX redesign review

**Review date:** 6 November 2026  
**Basis:** current route/component source, brand assets, PRD, UX specification, and external design guidance. This is a source-based review. No browser screenshot or interaction capture was available in this session, so visual appearance, responsive behavior, keyboard flow, and contrast still need live verification.

## Executive assessment

Rehnumai has a credible base palette and a useful staff workflow concept. The interface feels assembled from common UI patterns because nearly every section gets the same rounded card, tiny uppercase label, colored icon tile, supporting paragraph, and secondary reassurance. These devices compete with the actual work: starting an intake, finding a record, seeing what needs action, and documenting a decision. The strongest redesign is a **calm editorial identity for public and sign-in surfaces**, paired with a **precise, dense, task-led workspace** for staff. Keep one visual family across both.

The highest risk is not decorative. The public home page offers an intake route, whereas the approved PRD excludes applicant accounts and self-service submissions. The intake UI saves personal information to localStorage and presents a fixed reference as a successful submission. Search, filters, export, review actions, notifications, settings, and sign-out are shown as active affordances without corresponding behavior. Resolve these trust gaps before treating the visual work as complete.

## 1. Product architecture and navigation

**Current:** `/` mixes a public booklet with “Start entry”; `/login` is staff entry; `/portal`, `/portal/submissions`, `/intake`, and case detail use a staff shell. The PRD defines staff-led intake and a wider role-scoped case/referral system.

**Change:**

- Decide the service boundary in favor of the approved MVP: make the public page an information and staff-access entry, and place “New intake” only after staff authentication. If public self-service becomes a product decision, revise consent, threat model, and requirements first.
- Use one short staff navigation: **Overview, Cases, New intake**. Add **Drafts** and **Referrals** only when functional; make **Settings/Security** a real account menu. “Search & review” duplicates Cases.
- Replace decorative organization/region text in the top bar with the active scope only when it affects records. Remove the repeated bilingual slogan from every portal page.
- Respect role and scope: hide or disable actions based on permission with clear explanation, not merely by route naming. Keep sensitive record access explicit.

## 2. Visual system: distinctive, restrained, operational

**Keep:** deep navy, teal, warm white, existing Rehnumai mark, and authentic institutional logos. They give continuity with the migration booklet.

**Change:**

- Establish a 4/8 px spacing scale; 16 px body text for form content; 18–20 px section titles; 28–32 px page titles. Reserve 44–48 px for the public hero only. Current 10–12 px labels and metadata are overused.
- Reduce radii: about 12 px for controls, 16 px for major panels, and limited 20–24 px for the sign-in/public feature surface. Avoid a 22 px card around every operational group.
- Make white the main workspace surface, use soft stone or cool gray for page background, and apply navy/teal as deliberate accents. Remove repeated decorative rings, glass blur, hover lifts, oversized shadows, and pill-shaped controls from routine staff screens.
- Use the brand’s identity through typography, a slim navy navigation rail, authentic photography in non-operational surfaces, and a small recurring line motif drawn from the booklet. Do not use a stock illustration on case records.
- Create components for page title, toolbar, data table, status, form field, validation, notice, empty state, and confirmation. Specify hover, focus, disabled, loading, and error states for each.
- Use one status system: semantic text plus restrained icon/shape, with separate meanings for preparation gaps, safeguarding attention, service status, and system errors. “Approved” must always mean program review, never immigration or employment approval.

## 3. Public start page (`/`)

**Current:** headline, introduction, two large action cards, three trust cards, a trust sentence, repeated branding, and a strip of partner logos. It looks like a marketing landing page despite the staff-led service model.

**Redesign:** a compact editorial introduction, one primary **Read the migration booklet** action and a quieter **Staff sign in** action. A single “What this service does” explanation can stay if validated; put partner marks in a calm footer with proper institutional attribution. Remove the time/bilingual/human-review trust-card row unless user research shows it helps people choose a next action. Do not claim confidentiality more broadly than the approved privacy notice allows.

**Copy cut:** remove “SAFE MIGRATION GUIDANCE” above a title that already says what the page is for; avoid repeating “start entry” in card title and button. The public route must not imply a person can file a case independently in this MVP.

## 4. Staff sign-in (`/login`)

**Current:** a large navy text panel repeats the value proposition and contains two miniature feature cards; the form repeats another eyebrow, heading, and paragraph. A failed request is swallowed with no visible error. “Forgot password?” opens a `mailto:` address, and the privacy link points to `#privacy`.

**Redesign:** a 55/45 split on desktop with the form on a quiet white panel. Use a **single documentary-style photograph** on the left: a real-feeling migration-resource consultation in a Pakistani service setting, with consented or generated non-identifiable people, natural light, subtle navy overlay, and no passport/visa imagery implying official approval. Keep one short caption on the image if it adds context. Avoid showing identifying paperwork or a vulnerable person as a visual prop. On mobile, prioritize the form; show only a shallow image crop or omit it.

**Form:** one H1, “Sign in to Rehnumai”; email, password, show-password, primary sign-in, genuine recovery link, and concise support/privacy links. Use an inline generic error tied to the form and announce it to assistive technology. Preserve entered email after failure. Fix the password lookup so showing the password cannot accidentally read the email field. Make language choice apply to all visible content, including the image caption and errors.

## 5. Portal shell and overview (`/portal`)

**Current:** fixed navy sidebar, top bar, page subtitle, Urdu tagline, KPI cards, review queue, “Today’s focus,” and safeguarding reminder. Several surfaces repeat the same notion of “work to do.” Some numbers and rows are hardcoded.

**Redesign:** organize the page by decisions. Header: **Overview** and a single New intake action. First row: actionable **Assigned to me, Awaiting review, Corrections, Follow-ups due**; each count opens the matching scoped list. Below: a compact **Needs action** table sorted by due date/priority and a small **Recent activity** area only if useful. Keep safeguarding guidance in a persistent help location and surface it contextually when a signal occurs. Remove “Today’s focus / Your work, at a glance” when the KPI row already supplies the focus.

**Visual:** fewer standalone cards; use a more integrated dashboard surface with subtle dividers. Avoid decorative icons on every metric. Show a true empty/loading/error state and timestamp for data freshness. Do not display invented counts as live operations.

## 6. Cases list (`/portal/submissions`)

**Current:** searchable-looking input, Filter/Columns/Export buttons, filter pills, table, and pagination, but the controls do not change the list. The table is horizontally scrollable on mobile and omits assignee/attention, two key review fields in the UX spec.

**Redesign:** call this **Cases** consistently. Put search and the most used filters in one toolbar; show active filters as removable chips only when selected. Add sortable columns: reference/name, stage/destination, status, attention, assignee, updated/due. Make the primary row target obvious and keep a stable reference in a readable monospaced style. Offer saved views such as “My queue” only after they are real. Put export in a permission-gated overflow action with a purpose/field preview.

**Mobile:** use record cards with name/reference, status, attention, assignee, and updated date; open filters in a full-screen sheet. Distinguish “no cases,” “no matches,” and “could not load.” Pagination must show accurate totals and work.

## 7. Intake: all six current steps (`/intake`)

**Shell:** remove the second form title, generic right-side “Helpful context” paragraph, “Protected by design” card, and bottom Urdu slogan. Keep **New intake**, a clear step title, compact “Step N of M,” save state, Save and exit, and Back/Continue. Move essential help beside the relevant question. Use an honest server-confirmed save state; never label browser-only storage “Saved.” Validate before moving forward, and maintain progress across language changes.

| Step | Needed changes |
| --- | --- |
| Consent | Show the approved notice in the selected language with an optional read-aloud path. Separate service, safe-contact, and referral-discussion consent. If service consent is declined, stop personal data collection and show the approved non-digital help route. Remove duplicative bilingual paragraphs when a language is selected. |
| Profile | Capture safe contact preference before phone number and make it conditional. Fix age band, which currently displays a fixed selection and ignores changes. Keep identifier minimization as a small contextual note, not a development-policy paragraph in the form. |
| Migration plan | Branch by exploring, preparing, overseas, and returned. Make destination optional when undecided. Use a single-choice radio group for recruitment route, with the selected state exposed to assistive technology. Explain OEP on first use. |
| Readiness | Fix the data model: the current checklist changes `offer` for the first row and `passport` for every other row. Use distinct values for each item, grouped by topic, with Not applicable/Not sure where valid. Display only items relevant to the route. |
| Safety & support | Use neutral, individual questions with Yes/No/Prefer not to say, not a single list of checked problem labels. Add a clear staff procedure when immediate danger is indicated. Mark restricted notes and avoid placing them in general list views. |
| Review | Show all applicable answers grouped by section, missing items, contact/consent, and edit links. Require explicit officer attestation. Submit to the server, then display the returned reference and a next action. A hardcoded reference is unacceptable. |

**Content:** form labels and instructions should be task language; avoid tiny uppercase labels, repeated “safer journey” copy, and policy statements placed beside every input. Keep legal/privacy text where the person needs it and where the approved notice requires it.

## 8. Submission confirmation

**Current:** success view states the case entered the review queue and shows `MIG-26-004826` even though submit only writes the local draft. This is a serious false confirmation.

**Redesign:** show success only after the create-case API returns a reference. Use a simple receipt: **Case submitted**, actual reference, status, who will review it, and one primary action to open the case or start another intake. On failure, retain the draft and show a retry path. Do not add decorative reassurance or repeat the same message in two languages unless language choice is unknown.

## 9. Case review (`/portal/submissions/[reference]`)

**Current:** the URL reference changes, but the visible applicant, readiness, status, and timeline are fixed sample data. “Start a review note,” “Request correction,” “Create referral,” “Put on hold,” and more-actions have no behavior. The right rail repeats attention, next action, and protected-fields messaging.

**Redesign:** use a compact sticky record header with reference, applicant name, program status, assignee, and updated time. Main area: **Overview, Review, Referrals, Activity** tabs or sections that map to actual work. Put the one recommended next action in a focused side panel, and move less common actions to a menu. Show evidence for each attention signal and explain its review meaning. Collapse sensitive details until authorized access, with a clear audit-aware reveal action. Capture rationale and consequences in action dialogs. Keep one timeline, ordered and timestamped from server events. Avoid status-color-only interpretations.

## 10. Booklet (`/booklet`)

**Current:** a long intro and an embedded PDF with separate Download/Open actions. The booklet is useful, but the page gives little navigation beyond browser PDF controls.

**Redesign:** concise title and one-sentence purpose, then a choice to **Read online** or **Download PDF**. Add a short, accessible topic index linked to key sections or pages if the PDF supports stable destinations. Provide document language, page count, file size, and last verified date when known. Do not force the PDF in a 560 px minimum iframe on a narrow phone; allow an external viewer/download fallback. Keep the original document intact and visibly attribute the partners without crowding the reading header.

## 11. Language, accessibility, and content standards

- The requirements call for Urdu first run, but pages initialize in English and the portal/intake remain predominantly English. Use a shared language preference, real `lang`/`dir` semantics, and translated validation/system states. Audit mixed-direction references, numbers, email, and dates with bidi isolation.
- Add a skip link, semantic headings/landmarks, visible keyboard focus, 16 px form text, label/help/error ID associations, and error summary with focus and links to invalid fields. Test at 320 px and 200% zoom, plus keyboard and screen reader flows.
- Use native checkbox/radio inputs or equivalent correctly exposed state for consent, recruitment, readiness, and support; current button-based selections do not state checked/selected semantics.
- Replace the always-visible privacy assurances with a short, accurate notice at consent/reveal/export points and a persistent privacy link.
- Establish a content rule: one purpose statement per screen, one instructional sentence per complex step, and helper text only where it changes the answer. Remove section eyebrows and subheadings that paraphrase the adjacent title.

## Suggested copy simplification

| Location | Current pattern | Suggested direction |
| --- | --- | --- |
| Login | Eyebrow + “Welcome” + mission paragraph + two feature cards | “Sign in to Rehnumai” and a short staff-access note |
| Portal header | “Migration support workspace” + organization/region + page subtitle + Urdu slogan | Page title and actionable scope only |
| Intake header | “New migration intake” + promise subtitle + “Migration readiness record” + draft label | “New intake” + Step N of M + save status |
| Intake right rail | “Helpful context” + generic process paragraph + “Protected by design” | Contextual help beside the question; privacy link in shell |
| Case detail | “Case review” + instruction subtitle + applicant name + multiple sidebar action cards | Applicant/reference/status header + one next action |
| Booklet | Eyebrow + title + long topic list | “Migration booklet” + brief description + read/download |

## Priority and delivery order

1. **P0 — truthful flows:** align public/staff entry with PRD; connect intake save/submit; remove false success; make login errors visible; remove or disable non-working actions; correct fixed demo data and future-dated records.
2. **P1 — workflow redesign:** role-scoped navigation, overview queue, functional cases table, conditional intake, case review actions, proper receipt.
3. **P1 — design system:** tokens, typography, status semantics, table/form/action components, English/Urdu variants, responsive behavior.
4. **P2 — identity and polish:** commissioned/generated login photograph, public editorial layout, booklet topic navigation, restrained motion and micro-interactions.
5. **Validation:** test with data-entry officers, reviewers, and Urdu-speaking staff; measure intake completion time, draft recovery, case-finding speed, action error rate, and comprehension of status/consent. Run keyboard, screen reader, 320 px, 200% zoom, and contrast checks on live screens.

## Research used

- [GOV.UK Design System: question pages](https://design-system.service.gov.uk/patterns/question-pages/) — focused form steps and progress.
- [GOV.UK Design System: check answers](https://design-system.service.gov.uk/patterns/check-answers/) — relevant summaries and edit links.
- [GOV.UK Design System: error summary](https://design-system.service.gov.uk/components/error-summary/) — actionable, focused validation feedback.
- [W3C WCAG 2.2 target size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum) — control sizing and spacing.
- [W3C structural direction guidance](https://www.w3.org/International/questions/qa-html-dir.en.html) — Urdu RTL structure and mixed-direction content.
- [Nielsen Norman Group: progressive disclosure](https://www.nngroup.com/articles/progressive-disclosure/) — reveal detail when it is needed.

## Evidence limits

This report identifies source-visible content, structure, route behavior, and implementation gaps. It does not claim that the current rendered screens were visually inspected. No browser capture tool was exposed for this session; screenshots, contrast measurements, responsive breakpoints, keyboard order, and actual PDF reading behavior remain to be checked in a live run.
