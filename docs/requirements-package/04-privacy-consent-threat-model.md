# Privacy, Consent, Retention, and Threat Model

## 1. Legal and governance position

This specification is not legal advice. At the time of preparation, Pakistan's Ministry of IT and Telecommunication lists the Personal Data Protection Bill May 2023 as a draft. The platform should nevertheless implement purpose limitation, clear notice, language choice, data minimization, access control, security, correction handling, and accountable disclosure as baseline safeguards. Pakistani counsel must validate the actual legal basis, sector obligations, hosting location, cross-border transfer, law-enforcement handling, breach duties, and retention before production.

Primary references:

- MoITT legislation status: <https://www.moitt.gov.pk/Legislations>
- Personal Data Protection Bill May 2023 draft: <https://www.moitt.gov.pk/SiteImage/Misc/files/Final%20Draft%20Personal%20Data%20Protection%20Bill%20May%202023.pdf>
- National Assembly acts, including PECA amendments and migration-related 2025 amendments: <https://na.gov.pk/en/print_act.php>
- OWASP ASVS 5.0: <https://asvs.owasp.org/>

## 2. Data-controller decisions required

Before launch, the organization must name:

- Data controller and public contact.
- Privacy owner and safeguarding owner.
- Approved processors/subprocessors, hosting region, and contracts.
- Lawful basis for each processing purpose; consent must not be used where it is not freely withdrawable or not the actual basis.
- Approved external disclosure destinations and procedures.
- Data-subject request authentication and response procedure.
- Incident classification, notification, and escalation owners.

## 3. Purpose register

| Purpose | Data used | Access | Prohibited secondary use |
| --- | --- | --- | --- |
| Provide migration-readiness guidance | profile, plan, readiness | assigned service team | marketing, profiling for unrelated services |
| Review safety/legal-route support needs | route and attention fields | trained case managers | automatic accusations or legal determinations |
| Coordinate requested referral | minimum authorized referral data | referral owner | blanket data sharing |
| Follow up service delivery | safe contact, status, due dates | assigned team | unsolicited campaigning |
| Program reporting | de-identified/aggregated fields | managers/analysts | publishing identifiable small groups |
| Security and accountability | user/activity audit metadata | security/privacy auditors | routine staff performance surveillance beyond approved purpose |

## 4. Privacy classification and handling

| Class | Examples | Display | Export | Logging | Retention |
| --- | --- | --- | --- | --- | --- |
| P0 Public/configuration | form version, label, directory category | standard | allowed if useful | allowed | configuration lifecycle |
| P1 Personal | migration stage, district, destination, occupation | authorized case roles | controlled/de-identified where possible | identifiers prohibited | case schedule |
| P2 Sensitive/high-impact | name, phone, contact, employer, readiness | scoped roles; mask lists | explicit role/profile | never raw | case schedule; minimize |
| P3 Restricted | safety narrative, allegations/concerns, minor status, internal review, disclosure authorization | trained/approved roles only | default excluded; exceptional approval | never raw; access event only | shortest approved period |

### Additional controls

- P2/P3 list views show only minimum values; P3 requires record-detail access.
- Search may query approved P2 identifiers, but search terms are not logged.
- P3 free text must not be included in routine exports or analytics.
- Sensitive record-view and export events are audited with field profile, not field values.
- Backups inherit the highest classification and must be encrypted and access-controlled.

## 5. Bilingual privacy notice and consent copy

The placeholders must be replaced and legally approved before production.

### Urdu notice

**آپ کی معلومات اور رازداری**

`[ادارے کا نام]` آپ کی فراہم کردہ معلومات کو محفوظ اور قانونی ہجرت سے متعلق رہنمائی، آپ کی تیاری کا جائزہ، کیس کی پیروی، اور آپ کی اجازت سے مناسب ادارے تک حوالہ دینے کے لیے استعمال کرے گا۔ ہم صرف وہ معلومات جمع کرنے کی کوشش کرتے ہیں جو اس خدمت کے لیے ضروری ہوں۔

آپ کے جوابات ویزا، ملازمت، سرکاری منظوری یا قانونی حیثیت کی ضمانت یا خودکار فیصلہ نہیں ہیں۔ حفاظتی خدشات کی صورت میں تربیت یافتہ عملہ معلومات کا جائزہ لے گا اور ممکنہ مدد پر آپ سے بات کرے گا۔

آپ کی معلومات صرف مجاز عملہ دیکھ سکے گا۔ کسی بیرونی ادارے کو کیس کی معلومات دینے سے پہلے ہم واضح کریں گے کہ کون سی معلومات، کس ادارے کو اور کس مقصد سے دی جائیں گی، اور جہاں ضروری ہو آپ کی الگ اجازت لیں گے۔ قانون یا فوری حفاظت کی کسی مجاز استثنائی صورت میں ادارہ اپنی منظور شدہ پالیسی کے مطابق کارروائی کرے گا۔

آپ غیر ضروری سوالات کا جواب نہ دینے، اپنی معلومات درست کرانے، رابطہ بند کرنے، یا رازداری سے متعلق درخواست/شکایت کرنے کے لیے `[رابطہ]` سے رابطہ کر سکتے ہیں۔ بعض معلومات کو قانونی، حفاظتی یا احتسابی ضرورت کے تحت محدود مدت تک رکھنا ضروری ہو سکتا ہے۔ مکمل مدت اور طریقہ `[رازداری پالیسی کا لنک/مقام]` پر دستیاب ہے۔

**رضامندی:** “میں نے یہ نوٹس پڑھ لیا ہے یا مجھے سمجھ آنے والی زبان میں پڑھ کر سنایا گیا ہے۔ مجھے سوال پوچھنے کا موقع ملا۔ میں اس خدمت کے لیے اپنی معلومات جمع اور استعمال کرنے پر رضامند ہوں۔”

Separate prompts:

- “میں کیس کی پیروی کے لیے طے شدہ محفوظ طریقے سے رابطے کی اجازت دیتا/دیتی ہوں۔”
- “اگر حوالہ ضروری ہو تو مجھے پہلے بتایا جائے گا۔ منتخب ادارے کو مخصوص معلومات دینے کی اجازت ہر حوالہ کے وقت الگ درج کی جائے گی۔”

### English notice

**Your information and privacy**

`[Organization name]` will use the information you provide to offer safe and legal migration guidance, assess preparation needs, follow up your case, and - with appropriate authorization - coordinate a referral to a suitable organization. We aim to collect only information necessary for this service.

Your answers do not guarantee a visa, job, government approval, or legal status and do not create an automated decision. Where a safety concern is identified, trained staff will review the information and discuss possible support with you.

Only authorized staff may access your information. Before case information is given to an external organization, we will explain what information would be shared, with whom, and why, and will record separate authorization where required. Any lawful or immediate-safety exception will be handled under the organization's approved policy.

You may decline non-essential questions and may request correction, stop follow-up contact, or make a privacy request/complaint through `[contact]`. Some information may need to be retained for a limited period for legal, safeguarding, or accountability reasons. The complete schedule is available at `[privacy-policy location]`.

**Consent:** “I have read this notice or it has been read to me in a language I understand. I had an opportunity to ask questions. I consent to the collection and use of my information for this service.”

Separate prompts:

- “I allow follow-up contact through the agreed safe method.”
- “If a referral may help, it will be discussed with me first. Authorization to give specified information to a selected organization will be recorded separately for each referral.”

## 6. Consent and refusal behavior

- The notice version, language, delivery mode, staff actor, and server time are recorded.
- Refusal must not create an answer-bearing case. If management needs service-demand counts, record only a non-identifying daily aggregate after privacy approval.
- Withdrawal stops optional future processing/contact; it does not automatically erase information that must be retained under an approved legal/safeguarding/audit basis.
- External disclosure consent is granular by referral and field allowlist. No pre-checked boxes or blanket “share with partners” clause.
- For minors or people unable to provide informed consent, the system must invoke an approved safeguarding/legal SOP; software must not invent guardian authority rules.

## 7. Retention recommendation

These are design recommendations pending legal and operational approval.

| Data | Proposed active retention | Proposed disposal | Reason/condition |
| --- | --- | --- | --- |
| Unsubmitted draft | 30 days after last activity | hard purge + audit event without answers | short recovery window |
| Duplicate/accidental draft | 7 days after confirmation | hard purge | correction window |
| Closed routine case | 24 months after closure | anonymize analytics fields; purge direct identifiers and narratives | follow-up/accountability balance |
| Closed case with referral/safeguarding need | 36 months after closure | review before anonymization/purge | continuity and safeguarding; approve legally |
| P3 free-text safety notes | shortest of case period or 24 months unless active need/legal hold | purge separately | higher harm if exposed |
| Referral record | 24-36 months after completion | anonymize/purge with case | service accountability |
| Export file | 24 hours; maximum 7 days if explicitly approved | automatic object deletion | minimize copies |
| Authentication/security audit | 24 months | purge/aggregate | incident investigation |
| Case activity audit | case life + 36 months | pseudonymize/purge per approved schedule | accountability |
| Backup | 35 days rolling; monthly copy up to 12 months only if approved | cryptographic/managed expiry | recovery; must not defeat deletion indefinitely |

### Retention controls

- A scheduled job identifies candidates; deletion/anonymization is two-person-approved for production batches.
- Legal/safeguarding hold has reason, owner, start, review date, and expiry; it cannot be indefinite without review.
- Anonymization removes names, phones, emails, identifier fragments, free text, exact dates, and rare combinations; small-cell aggregate reporting is suppressed.
- Backup expiry is documented; an erased record may temporarily remain in inaccessible backups until normal expiry and must not re-enter production after restore without reapplying tombstones.

## 8. Data-subject request workflow

1. Receive request through approved channel; create restricted request record.
2. Verify identity proportionately without collecting excessive new evidence.
3. Search live data, exports, and relevant processors; do not expose another person's information.
4. Privacy owner decides access/correction/restriction/anonymization based on approved legal basis.
5. Execute through controlled service; create audit evidence and notify requester safely.
6. If denied/limited, record reason and complaint/escalation channel.

## 9. Threat model

### Assets

- Applicant identity/contact, migration intent, employer/agent information, safety concerns, minors' data.
- Staff credentials/sessions, permissions, exports, referral records, audit evidence, backups, secrets.

### Trust boundaries

- Staff browser <-> Next.js edge/web tier.
- Next.js server <-> MongoDB.
- Application <-> export object storage/monitoring/backup systems.
- Administrator <-> identity/user-management functions.
- Organization <-> referral recipient (manual in MVP).

### Threats and required mitigations

| ID | Threat | STRIDE | Impact | Mandatory mitigations |
| --- | --- | --- | --- | --- |
| TM-01 | Credential stuffing/brute force | Spoofing | account takeover | Argon2id, generic errors, rate limit, breach-password check where approved, MFA-ready, alerting |
| TM-02 | Session theft/fixation | Spoofing/Elevation | case access | opaque random token, token hash at rest, secure cookie, rotation, inactivity/absolute expiry, revoke on role/password change |
| TM-03 | IDOR/record enumeration | Elevation/Disclosure | cross-case leak | server policy on every operation, non-sequential references, scope-before-query, deny-as-404 where appropriate, tests |
| TM-04 | Role escalation/admin misuse | Elevation | broad compromise | deny-by-default RBAC, step-up for role/export, segregation of duties, reason + audit, periodic access review |
| TM-05 | NoSQL injection/query abuse | Tampering/Disclosure | data leak/change | Zod schemas, allowlisted operators/filters/sorts, no raw client query objects, least-privilege DB account |
| TM-06 | Stored XSS through Urdu/free text | Tampering | session/action compromise | plain-text storage, output encoding, CSP, no unsafe HTML, component tests |
| TM-07 | CSRF on state changes | Tampering | unauthorized action | SameSite cookies, CSRF token/origin validation, POST/PATCH/DELETE only, re-auth for critical actions |
| TM-08 | CSV injection/export leakage | Tampering/Disclosure | workstation compromise/PII leak | neutralize formula prefixes, allowlisted columns, short expiry, authorization, watermark/metadata, audit |
| TM-09 | Sensitive data in logs/telemetry | Disclosure | uncontrolled copies | structured allowlist logging, server/client redaction, no query terms/answers, monitoring processor review |
| TM-10 | Malicious/curious insider | Disclosure/Repudiation | targeted exposure | least scope, P3 restrictions, sensitive-view audit, export controls, anomaly review, disciplinary SOP |
| TM-11 | Audit tampering | Tampering/Repudiation | loss of accountability | append-only service path, restricted DB permission, integrity monitoring, external protected log sink |
| TM-12 | Concurrent overwrite/replay | Tampering | lost/corrupt case data | optimistic concurrency, idempotency keys, immutable revisions, transition validation |
| TM-13 | Denial of service/expensive query | DoS | unavailable intake | rate/size limits, indexed allowlisted query, pagination caps, timeouts, queue exports, monitoring |
| TM-14 | Backup/snapshot exposure | Disclosure | mass leak | encryption, separate credentials, limited operators, restore logging, retention/expiry, periodic access review |
| TM-15 | Misconfigured cloud/database | Disclosure | mass leak | IaC/review, private connectivity/IP rules, no public DB, secret rotation, configuration scan |
| TM-16 | Referral over-disclosure | Disclosure | harm to applicant | per-referral field allowlist, recorded authority, preview, no automatic transmission in MVP, trained staff |
| TM-17 | Unsafe contact reveals case | Disclosure/Safety | personal harm | safe-contact instructions, masked notifications, no case subject in messages, contact consent, P3 scope |
| TM-18 | Stale/incorrect official contact | Tampering | misdirected referral | versioned directory, verification date/owner, expiry warning, no automatic send |
| TM-19 | Dependency/supply-chain compromise | Tampering | application compromise | lockfile, provenance/scan, minimal dependencies, patch SLA, protected CI secrets |
| TM-20 | Production data copied to test | Disclosure | uncontrolled leak | synthetic fixtures only, environment access separation, DLP/review, prohibited restore to dev |

## 10. Security acceptance baseline

- OWASP ASVS 5.0 Level 2 verification mapped in testing.
- Independent penetration test before production and after material auth/access/export changes.
- Zero critical/high unresolved findings affecting confidentiality, authorization, session security, injection, or audit integrity.
- Quarterly permission review and backup restore; annual privacy/threat-model review or after material change.
- Incident runbook covers account takeover, mass export, lost device, unsafe disclosure, database exposure, and referral misdirection.
