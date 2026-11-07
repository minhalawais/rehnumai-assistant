# Migration Intake and Case Review - Requirements Package

**Status:** Product baseline for stakeholder review  
**Version:** 1.0  
**Prepared:** 2026-11-06  
**Source:** `docs/00 Migration Booklet (REVISWED-231026).pdf`

## Purpose

This package defines an Urdu-first, English-supported staff platform that turns the booklet's safe-migration guidance into an operational intake, readiness, review, and referral workflow. It is deliberately not a generic survey platform and not a legal-decision engine.

## Package contents

| File | Deliverable |
| --- | --- |
| [01-PRD.md](./01-PRD.md) | Product requirements, scope, personas, stories, acceptance criteria, NFRs |
| [02-data-dictionary.md](./02-data-dictionary.md) | Bilingual field-level data dictionary |
| [03-logic-and-validation.md](./03-logic-and-validation.md) | Conditional logic, validation, state rules, derived signals |
| [04-privacy-consent-threat-model.md](./04-privacy-consent-threat-model.md) | Privacy classification, bilingual consent, retention, threat model |
| [05-RBAC.md](./05-RBAC.md) | Roles, scopes, permissions, segregation of duties |
| [06-UX-specification.md](./06-UX-specification.md) | Sitemap and screen-by-screen responsive/RTL UX specification |
| [07-architecture-api.md](./07-architecture-api.md) | MongoDB model, indexes, audit model, API contract |
| [08-release-backlog.md](./08-release-backlog.md) | Ordered backlog, dependencies, release gates |
| [09-traceability-and-decisions.md](./09-traceability-and-decisions.md) | Booklet traceability, assumptions, open decisions, sign-off |

## Product decisions

- **Operating model:** staff-only intake; no public self-registration in the MVP.
- **Workflow:** `draft -> submitted -> under_review -> approved/on_hold/needs_correction/referred -> closed/archived`.
- **Languages:** Urdu-first UI with a complete English alternative. A record stores the language used for collection.
- **Risk handling:** signals inform trained human review and referral. They must not produce automatic legal eligibility, fraud, trafficking, or welfare determinations.
- **Sensitive data:** data minimization, field-level access policy, private exports, immutable audit events, and no PII in URLs or application logs.
- **Form model:** a versioned, code-owned intake definition for the MVP, with stable field keys and bilingual labels.
- **Technology:** Next.js App Router, TypeScript, MongoDB, React Hook Form, Zod, server-side sessions, and server-side authorization.

## Approval required before build

The accountable product, operations, privacy/legal, safeguarding, and technical owners must approve:

1. Every required field and bilingual label.
2. Consent and privacy notice, contact details, and lawful basis.
3. Case retention, anonymization, legal-hold, and backup-retention periods.
4. Risk/referral protocol and emergency/escalation operating procedure.
5. Role assignment, export permissions, and record visibility scope.
6. The official referral directory and its maintenance owner.

## Normative language

“Must” is mandatory for MVP acceptance. “Should” is recommended and requires an explicit recorded decision to omit. “May” is optional.

## Reference standards and legal note

- The Pakistan Ministry of IT and Telecommunication currently lists the Personal Data Protection Bill May 2023 as a **draft**, so this package uses its notice, security, purpose-limitation, and language-access principles as design guidance rather than representing it as enacted law: <https://www.moitt.gov.pk/Legislations>.
- Pakistan's Prevention of Electronic Crimes Act and subsequent amendments must be reviewed by Pakistani counsel for the deployed operating model: <https://na.gov.pk/en/print_act.php>.
- Security requirements target OWASP ASVS 5.0 Level 2 because the application processes sensitive personal data: <https://asvs.owasp.org/>.

This is a product and technical specification, not legal advice.
