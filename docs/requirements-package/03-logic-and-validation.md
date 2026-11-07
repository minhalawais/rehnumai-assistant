# Conditional Logic and Validation Rules

## 1. Execution rules

- The browser may guide and validate, but the server is authoritative.
- Rules execute against a declared `formVersion`; submitted revisions never silently adopt a later definition.
- Hidden fields are removed from the submitted payload unless a rule explicitly says to retain them for a previously submitted revision.
- A draft may be incomplete after valid service consent. Submission requires every applicable `Y`/`C` field.
- Safety signals change review priority and show the organizational SOP; they never determine a legal status or send information externally.

## 2. Form visibility and requiredness

| Rule | When | Then | Server requirement |
| --- | --- | --- | --- |
| CL-001 | `serviceConsent != true` | Do not display intake sections | Reject creation of answer-bearing case |
| CL-002 | `contactConsent = false` | Set contact method to `no_contact`; hide phone/email requiredness | Phone/email must not be required for follow-up |
| CL-003 | `preferredContactMethod = phone_call/sms/whatsapp` | Show primary phone | Valid primary phone required |
| CL-004 | `preferredContactMethod = email` | Show email | Valid email required |
| CL-005 | `preferredContactMethod = no_contact` | Show safe warning that follow-up may be limited | `contactConsent` must be false or user explicitly selected no contact |
| CL-006 | `preferredCommunicationLanguage = other` | Show language description | `communicationLanguageOther` required |
| CL-007 | `gender = non_binary_or_self_described` | Show self-description | Optional, never required to receive service |
| CL-008 | `emergencyContactProvided = true` | Show emergency-contact section | Name, relationship, phone, permission confirmation required |
| CL-009 | `migrationPurpose = other` | Show other purpose | Required short text |
| CL-010 | `migrationStage = exploring` and `migrationPurpose = undecided` | Destination optional | No false error for missing destination |
| CL-011 | stage is `preparing`, `offer_received`, `pre_departure`, or `overseas` | Destination country visible | Country required unless applicant declines under approved exception |
| CL-012 | purpose is `employment` or `returning_to_job` | Show employment/recruitment/readiness fields | Target occupation and sector required |
| CL-013 | target sector is `other` | Show other sector | Required short text |
| CL-014 | `hasJobOffer = yes` | Show employer, job title, contract fields | Employer name/country and job title required when known; unknown reason captured |
| CL-015 | `hasJobOffer != yes` | Hide employer details and contract-understood question | Clear unsubmitted hidden values |
| CL-016 | channel is `registered_oep` or `unregistered_agent` | Show agent/OEP fields | Agent name required when applicant knows it |
| CL-017 | `oepLicenceProvided = yes` | Show licence reference | Licence reference required |
| CL-018 | licence check status not `not_checked` | Show verification source | Source and verification timestamp required; reviewer-only |
| CL-019 | payment requested is `yes` | Show receipt status | Receipt status required |
| CL-020 | contract checklist status is `available` | Show `contractUnderstood` | Response required for employment route |
| CL-021 | stage is `pre_departure` | Show travel-readiness items | Passport, visa/permit, itinerary, copies, family details, emergency contacts all require an explicit status |
| CL-022 | stage is `overseas` | Show overseas safety section | Arrival status, passport control, contract match (employment), mission contact required |
| CL-023 | stage is `returned` | Show return/reintegration section | Return period, type, and reintegration needs required |
| CL-024 | reintegration needs contains `other` | Show other need | Required short text |
| CL-025 | support needs contains `other` | Show other support | Required short text |
| CL-026 | support needs contains `none` | Disable other support selections | Server rejects `none` plus another value |
| CL-027 | reintegration needs contains `none` | Disable other reintegration selections | Server rejects `none` plus another value |
| CL-028 | any attention rule AT-001..AT-008 triggers | Show safe contact and staff SOP acknowledgement | `safeToContact` and action acknowledgement required before submission |
| CL-029 | `threatOrImmediateDanger = yes` | Show immediate organizational emergency/safeguarding SOP, not general form advice | Staff must acknowledge SOP action; case priority `immediate_sop` |
| CL-030 | referral category is `other` | Show other destination | Required short text |
| CL-031 | `disclosureAuthorized = true` | Show allowed disclosure fields | Non-empty field allowlist required; P3 fields require privacy/safeguarding approval per policy |
| CL-032 | `disclosureAuthorized = false` | Hide disclosure field selection | No case answers may be included in referral export/action |
| CL-033 | referral is active | Show owner and due date | Owner and due date required |
| CL-034 | status transition is `needs_correction` | Show rationale and affected fields | Both required |
| CL-035 | status transition is `on_hold` | Show hold reason, rationale, review date | Required unless approved indefinite legal hold |
| CL-036 | status transition is `closed` | Show closure outcome | Outcome required; notes required for `other` |

## 3. Attention-signal rules

Signals use descriptive codes. The portal must say **“Attention required”**, not “high-risk person,” “illegal migrant,” “fraud,” or “trafficking victim.”

| Signal | Trigger | Priority | Required operational response |
| --- | --- | --- | --- |
| AT-001 `work_visit_visa` | `workOnVisitVisaProposed = yes` | priority | case-manager review; offer official guidance/referral |
| AT-002 `unverified_recruitment` | channel `unregistered_agent`, `social_media`, or `unknown` | priority | review recruiter/agent verification needs |
| AT-003 `payment_no_receipt` | payment requested yes and receipt `not_available`/`unknown` | priority | provide safe-payment/official-channel guidance |
| AT-004 `document_concern` | documents withheld yes or false documents suggested yes | priority | safeguarding-trained review; safe contact required |
| AT-005 `irregular_route_concern` | irregular route suggested yes | priority | safe-migration support/referral; no accusation |
| AT-006 `pressure_or_coercion` | pressure to travel/pay yes | priority | safeguarding-trained review |
| AT-007 `immediate_danger` | immediate danger yes | immediate_sop | display and follow approved emergency SOP immediately |
| AT-008 `minor` | age band under 18 | immediate_sop or configured child-safeguarding priority | apply child-safeguarding protocol; restrict access |
| AT-009 `overseas_document_control` | overseas and passport not in own control | priority | safe contact + mission/welfare/legal referral discussion |
| AT-010 `work_contract_mismatch` | overseas employment and contract matches work no | priority | case-manager review and appropriate referral |

The system must store triggered codes and rule version, not a numeric composite score.

## 4. Field validation rules

### Text

- Names: 1-120 Unicode characters; trim outer whitespace; preserve internal Urdu/English characters; reject control characters and HTML.
- Short text: maximum 200 characters unless explicitly 120; long text: maximum 2,000 characters.
- Notes must be plain text; render escaped; never permit HTML/Markdown execution.
- Do not reject Urdu diacritics, Arabic presentation characters, hyphens, apostrophes, or spaces solely due to a Latin-only regex.

### Phone and email

- Store phone in E.164 where possible plus original display input only if needed; Pakistan default country calling code is a UI convenience, not an assumption about nationality.
- Phone maximum 20 characters before normalization; allow `+`, digits, spaces, parentheses, and hyphens in input.
- Email is trimmed and normalized for lookup, but preserve original display casing where desired; maximum 254 characters.

### Dates and times

- Store instants in UTC; display in configured timezone, default `Asia/Karachi`.
- Planned departure/return should use month or range precision, not fabricated day-level precision.
- Follow-up date cannot be before the current local date unless recording an overdue historical referral with privileged reason.
- `submittedAt >= createdAt`; revision timestamps must be monotonic.

### Identifiers and references

- Case reference is server-generated and unique; reject client-provided references on creation.
- CNIC last four is exactly four digits if supplied. Do not accept a full CNIC in this field; detect 13-digit values and show a minimization warning.
- OEP licence reference: 1-50 plain-text characters; never treat it as verified until a reviewer records a source and result.
- Country values use ISO 3166-1 alpha-2 codes plus explicit `unknown` where approved.

### Readiness checklist

- Each applicable item is exactly one `readinessStatus` plus optional note.
- `not_applicable` is rejected when the item is mandatory for the selected route/stage according to approved policy.
- A status of `available` records claimed availability, not authenticity.

### Arrays

- Multi-selects contain unique allowlisted values only.
- Maximum 20 values unless a smaller allowlist applies.
- Field-key arrays may only reference fields in the record's form version and within the actor's disclosure/read scope.

## 5. Cross-field consistency checks

| Rule | Invalid combination | Resolution |
| --- | --- | --- |
| CV-001 | contact consent false but contact method is not `no_contact` | block submission and explain |
| CV-002 | destination differs from employer country without explanation when offer exists | warning; allow with note |
| CV-003 | job offer no but contract checklist available | warning; ask staff to confirm |
| CV-004 | OEP channel but licence provided no/unknown | attention signal; allow submission |
| CV-005 | payment not requested but receipt is available/not available | reset receipt to `not_paid` or correct answer |
| CV-006 | pre-departure but destination unknown | block unless privileged documented exception |
| CV-007 | overseas stage but planned departure in future | warning/correction |
| CV-008 | returned stage but return period absent | block submission |
| CV-009 | no support needed but narrative/referral is entered | warning; require consistent selection |
| CV-010 | external disclosure true with blanket `all_fields` | reject; require explicit minimum field keys |
| CV-011 | immediate-danger yes and no SOP action recorded | block routine submission; require acknowledgement/escalation route |
| CV-012 | minor and emergency contact/guardian handling absent | invoke child-safeguarding SOP; do not improvise consent in software |

## 6. Draft, submit, and revision behavior

- Create draft only after `serviceConsent = true` and notice metadata are captured.
- Autosave uses `If-Match`/version number; stale writes return `409 CASE_VERSION_CONFLICT` with safe recovery UI.
- Submit endpoint accepts an idempotency key. Repeated identical requests return the original success result.
- On submission, create an immutable `caseRevision` snapshot, validation result, applicable rule version, and audit event.
- `needs_correction` creates a new working revision cloned from the last submission. It never mutates the prior submitted snapshot.
- Cancelled/discarded drafts are soft-deleted, retained briefly for recovery according to retention policy, then purged.

## 7. Allowed state transitions

| From | To | Who | Required data |
| --- | --- | --- | --- |
| draft | submitted | creator/in-scope data entry | valid form, attestation |
| draft | archived/discarded | creator/admin | discard confirmation |
| submitted | under_review | case manager/admin | assignment |
| under_review | approved | case manager | review outcome/attestation |
| under_review | needs_correction | case manager | rationale + field keys |
| under_review | on_hold | case manager | reason + next review date |
| under_review | referred | case manager | referral record |
| needs_correction | submitted | permitted editor | new valid revision |
| on_hold | under_review | case manager | resume reason |
| approved | referred | case manager | referral record |
| approved/referred/under_review | closed | case manager | closure outcome |
| closed | under_review | admin/case manager with permission | reopen reason |
| closed | archived | retention job/admin | policy reason |

No client may set `status` directly.

## 8. Search, filter, and export validation

- Search strings: trim, maximum 100 characters, escape regex/meta characters, and never pass raw operators to MongoDB.
- Filter values must be allowlisted and scoped before query execution.
- Pagination: default 20, maximum 100 rows per page.
- Sort: allowlisted indexed fields only; stable secondary sort on `_id`/reference.
- Export: maximum size/configuration enforced; larger work becomes a background job.
- CSV cells beginning with `=`, `+`, `-`, `@`, tab, or carriage return are neutralized.
- Export field profile is role-based and explicit; no “export entire document” endpoint.

## 9. Error codes

| Code | HTTP | Meaning |
| --- | --- | --- |
| `VALIDATION_FAILED` | 422 | field/cross-field errors with safe field keys |
| `CONSENT_REQUIRED` | 422 | service consent not present |
| `AUTHENTICATION_REQUIRED` | 401 | no valid session |
| `PERMISSION_DENIED` | 403 | authenticated but unauthorized |
| `CASE_NOT_FOUND` | 404 | missing or intentionally concealed out-of-scope record |
| `CASE_VERSION_CONFLICT` | 409 | stale revision/update |
| `INVALID_TRANSITION` | 409 | workflow transition not permitted |
| `RATE_LIMITED` | 429 | retry later; safe retry metadata |
| `IDEMPOTENCY_CONFLICT` | 409 | key reused with a different payload |

Error responses must not expose stack traces, database details, tokens, other users, or whether an out-of-scope case exists.
