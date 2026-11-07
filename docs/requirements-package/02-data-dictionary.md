# Bilingual Field-Level Data Dictionary

## Conventions

- Field keys are permanent API/database identifiers and must not be translated or reused for a different meaning.
- `Req` values: `Y` required at submission, `C` conditionally required, `N` optional, `S` system-generated.
- Privacy classes: `P0` non-personal configuration/aggregate; `P1` ordinary personal; `P2` sensitive or high-impact; `P3` restricted safeguarding/security/internal data.
- Drafts may be incomplete after consent. “Required” means required for final submission when the field applies.
- “Prefer not to say” must remain a valid answer for non-operational demographic questions.
- No field authorizes automatic legal, visa, employment, fraud, trafficking, or protection decisions.

## Enumerations

Every stored enumeration uses the stable value shown below; labels are localized.

| Enum | Values |
| --- | --- |
| `language` | `ur`, `en`, `other` |
| `yesNoUnknown` | `yes`, `no`, `unknown` |
| `yesNoDecline` | `yes`, `no`, `prefer_not_to_say` |
| `readinessStatus` | `available`, `in_progress`, `not_available`, `not_applicable`, `unknown` |
| `migrationStage` | `exploring`, `preparing`, `offer_received`, `pre_departure`, `overseas`, `returned` |
| `contactMethod` | `phone_call`, `sms`, `whatsapp`, `email`, `no_contact`, `other` |
| `caseStatus` | `draft`, `submitted`, `under_review`, `needs_correction`, `on_hold`, `approved`, `referred`, `closed`, `archived` |
| `referralStatus` | `proposed`, `authorized`, `provided`, `accepted`, `in_progress`, `completed`, `declined`, `unable_to_contact`, `cancelled` |

## A. System and provenance fields

| Key | Urdu label | English label | Type | Req | Class | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `caseReference` | کیس حوالہ نمبر | Case reference | string | S | P1 | Non-sequential `MIG-YYYY-XXXXXX`; searchable |
| `formVersion` | فارم ورژن | Form version | string | S | P0 | Immutable for a submitted revision |
| `revisionNumber` | ترمیم نمبر | Revision number | integer | S | P0 | Starts at 1; increments on correction/resubmission |
| `recordLanguage` | فارم کی زبان | Form language | enum:language | Y | P0 | `ur` default |
| `status` | کیس کی حیثیت | Case status | enum:caseStatus | S | P1 | Derived from transition service only |
| `createdAt` | بنانے کی تاریخ و وقت | Created at | datetime | S | P1 | UTC storage |
| `createdBy` | ریکارڈ بنانے والا | Created by | user reference | S | P2 | Staff reference |
| `updatedAt` | آخری تبدیلی | Last updated | datetime | S | P1 | UTC storage |
| `submittedAt` | جمع کرانے کی تاریخ و وقت | Submitted at | datetime | S | P1 | Null until first submission |
| `assignedTeamId` | ذمہ دار ٹیم | Assigned team | team reference | C | P2 | Required for review routing |
| `assignedUserId` | ذمہ دار افسر | Assigned officer | user reference | N | P2 | Must be within permitted team/scope |
| `sourceChannel` | اندراج کا ذریعہ | Intake source | enum | Y | P1 | `walk_in`, `phone`, `outreach`, `internal_referral`, `external_referral`, `other` |
| `sourceChannelOther` | دیگر ذریعہ | Other intake source | short text | C | P1 | Applies when source is `other` |
| `sourceOrganization` | حوالہ دینے والا ادارہ | Referring organization | short text | N | P1 | No personal contact name unless necessary |
| `officeLocationId` | اندراج کا دفتر/مقام | Intake office/location | location reference | Y | P1 | Approved organization location list |

## B. Privacy notice and consent

| Key | Urdu label | English label | Type | Req | Class | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `noticeVersion` | رازداری نوٹس کا ورژن | Privacy notice version | string | S | P0 | Exact version displayed/read |
| `noticeLanguage` | نوٹس کی زبان | Notice language | enum:language | Y | P0 | Must be understood by applicant |
| `noticeDeliveryMode` | نوٹس کیسے فراہم کیا گیا؟ | How was the notice provided? | enum | Y | P1 | `read_by_applicant`, `read_aloud_by_staff`, `assisted`, `other` |
| `serviceConsent` | کیا آپ اس خدمت کے لیے اپنی معلومات جمع اور استعمال کرنے پر رضامند ہیں؟ | Do you consent to collection and use of your information for this service? | boolean | Y | P2 | Must be true to create answer-bearing case |
| `consentCapturedAt` | رضامندی کا وقت | Consent captured at | datetime | S | P2 | Server timestamp |
| `consentCapturedBy` | رضامندی درج کرنے والا | Consent captured by | user reference | S | P2 | Staff reference |
| `contactConsent` | کیا ہم کیس کی پیروی کے لیے آپ سے رابطہ کر سکتے ہیں؟ | May we contact you for case follow-up? | boolean | Y | P2 | If false, contact method becomes `no_contact` |
| `referralDiscussionConsent` | کیا ضرورت پڑنے پر آپ سے ممکنہ حوالہ کے بارے میں بات کی جا سکتی ہے؟ | May we discuss a possible referral with you if needed? | boolean | Y | P2 | Not permission to disclose data externally |
| `externalDisclosureConsent` | کیا آپ منتخب ادارے کو متعین معلومات فراہم کرنے کی اجازت دیتے ہیں؟ | Do you authorize sharing specified information with the selected organization? | boolean | C | P3 | Captured per referral, not blanket consent |
| `consentNotes` | رضامندی سے متعلق وضاحت | Consent clarification | short text | N | P3 | Staff explanation only; avoid unnecessary detail |

## C. Applicant profile and contact

| Key | Urdu label | English label | Type | Req | Class | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `fullName` | پورا نام | Full name | short text | Y | P2 | As provided; Unicode; not forced to ID spelling |
| `preferredName` | پسندیدہ نام | Preferred name | short text | N | P1 | Used in service interaction |
| `fatherOrSpouseName` | والد/شریکِ حیات کا نام | Father/spouse name | short text | N | P2 | Collect only if operations approve necessity |
| `ageBand` | عمر کا گروپ | Age band | enum | Y | P1 | `under_18`, `18_24`, `25_34`, `35_44`, `45_54`, `55_plus`, `prefer_not_to_say` |
| `isMinor` | کیا درخواست گزار 18 سال سے کم ہے؟ | Is the applicant under 18? | boolean | S | P2 | Derived from age band; triggers safeguarding SOP |
| `gender` | صنف | Gender | enum | N | P2 | `woman`, `man`, `non_binary_or_self_described`, `prefer_not_to_say` |
| `genderSelfDescription` | اپنی صنف کی وضاحت | Self-described gender | short text | C | P2 | Only when self-described option selected |
| `nationality` | قومیت | Nationality | country code | Y | P1 | Default `PK`, editable |
| `cnicStatus` | شناختی کارڈ کی حیثیت | CNIC status | enum | C | P2 | `available`, `applied`, `not_available`, `not_applicable`, `declined` |
| `cnicLast4` | شناختی کارڈ کے آخری چار ہندسے | Last four digits of CNIC | string | N | P3 | Do not collect full CNIC in MVP unless separately approved |
| `primaryPhone` | بنیادی فون نمبر | Primary phone number | phone | C | P2 | Required only when contact consent and phone-based contact |
| `alternatePhone` | متبادل فون نمبر | Alternate phone number | phone | N | P2 | Confirm applicant permission |
| `email` | ای میل | Email address | email | C | P2 | Required only when email is preferred method |
| `preferredContactMethod` | رابطے کا پسندیدہ طریقہ | Preferred contact method | enum:contactMethod | Y | P2 | `no_contact` if contact consent is false |
| `safeContactInstructions` | محفوظ رابطے کی ہدایات | Safe contact instructions | short text | N | P3 | E.g. safe time; hide from basic list view |
| `provinceOrTerritory` | صوبہ/علاقہ | Province/territory | enum | Y | P1 | Approved Pakistan administrative list + outside Pakistan |
| `district` | ضلع | District | controlled text | C | P1 | Required for Pakistan resident when supported list exists |
| `cityOrLocality` | شہر/علاقہ | City/locality | short text | N | P1 | Avoid full street address by default |
| `preferredCommunicationLanguage` | رابطے کی پسندیدہ زبان | Preferred communication language | enum:language | Y | P1 | Other requires description |
| `communicationLanguageOther` | دیگر زبان | Other communication language | short text | C | P1 | Applies when `other` |

## D. Optional emergency contact

| Key | Urdu label | English label | Type | Req | Class | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `emergencyContactProvided` | کیا آپ ہنگامی رابطہ دینا چاہتے ہیں؟ | Do you want to provide an emergency contact? | boolean | Y | P2 | Optional section opt-in |
| `emergencyContactName` | ہنگامی رابطے کا نام | Emergency contact name | short text | C | P3 | Required if opted in |
| `emergencyContactRelationship` | رشتہ | Relationship | short text | C | P3 | Required if opted in |
| `emergencyContactPhone` | ہنگامی رابطے کا فون | Emergency contact phone | phone | C | P3 | Required if opted in |
| `emergencyContactPermissionConfirmed` | کیا اس شخص کی معلومات دینے کی اجازت/مناسب توقع کی تصدیق ہے؟ | Is permission or reasonable expectation to provide this contact confirmed? | boolean | C | P3 | Required true if contact recorded |

## E. Migration stage and plan

| Key | Urdu label | English label | Type | Req | Class | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `migrationStage` | ہجرت/سفر کی موجودہ تیاری | Current migration stage | enum:migrationStage | Y | P1 | Drives section visibility |
| `migrationPurpose` | بیرون ملک جانے کا مقصد | Purpose of migration/travel | enum | Y | P1 | `employment`, `education`, `family`, `visit`, `returning_to_job`, `other`, `undecided` |
| `migrationPurposeOther` | دیگر مقصد | Other purpose | short text | C | P1 | Required when other |
| `destinationCountry` | منزل کا ملک | Destination country | country code | C | P1 | Not required while exploring/undecided |
| `destinationCity` | منزل کا شہر | Destination city | short text | N | P1 | If known |
| `plannedDeparturePeriod` | متوقع روانگی | Planned departure period | month or enum | N | P1 | Month precision or `within_1_month`, `1_3_months`, etc. |
| `intendedDuration` | متوقع قیام | Intended duration | enum | N | P1 | `under_3_months`, `3_12_months`, `1_3_years`, `over_3_years`, `permanent_or_unknown` |
| `targetOccupation` | مطلوبہ پیشہ | Target occupation | short text | C | P1 | Applies to employment/returning to job |
| `targetSector` | مطلوبہ شعبہ | Target sector | enum | C | P1 | Approved sector taxonomy + other |
| `targetSectorOther` | دیگر شعبہ | Other sector | short text | C | P1 | When other |
| `languageReadiness` | منزل کی زبان کی تیاری | Destination-language readiness | enum | N | P1 | `none`, `basic`, `working`, `certified`, `not_required`, `unknown` |
| `migrationPlanNotes` | منصوبے کی اضافی وضاحت | Additional migration-plan notes | long text | N | P2 | Avoid unsupported allegations |

## F. Employment, employer, and recruitment route

| Key | Urdu label | English label | Type | Req | Class | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `hasJobOffer` | کیا ملازمت کی پیشکش موجود ہے؟ | Is there a job offer? | enum:yesNoUnknown | C | P1 | Employment purpose only |
| `employerName` | آجر/کمپنی کا نام | Employer/company name | short text | C | P2 | Required when offer exists and known |
| `employerCountry` | آجر کا ملک | Employer country | country code | C | P1 | When offer exists |
| `employerContactAvailable` | کیا آجر کی قابلِ تصدیق رابطہ معلومات موجود ہیں؟ | Are verifiable employer contact details available? | enum:yesNoUnknown | C | P2 | Do not store unnecessary contact detail in MVP |
| `jobTitleOffered` | پیش کردہ عہدہ | Offered job title | short text | C | P1 | When offer exists |
| `recruitmentChannel` | بھرتی کا ذریعہ | Recruitment channel | enum | C | P2 | `direct_employer`, `registered_oep`, `oec`, `online_portal`, `family_or_friend`, `social_media`, `unregistered_agent`, `unknown`, `other` |
| `recruitmentChannelOther` | بھرتی کا دیگر ذریعہ | Other recruitment channel | short text | C | P2 | When other |
| `agentOrOepName` | ایجنٹ/OEP کا نام | Agent/OEP name | short text | C | P3 | Applies to agent/OEP channels |
| `oepLicenceProvided` | کیا OEP لائسنس نمبر دیا گیا ہے؟ | Was an OEP licence number provided? | enum:yesNoUnknown | C | P2 | No claim of validity |
| `oepLicenceReference` | OEP لائسنس حوالہ | OEP licence reference | short text | C | P3 | Required if provided; manually verify outside MVP |
| `licenceVerificationStatus` | لائسنس کی جانچ کی حیثیت | Licence verification status | enum | N | P3 | `not_checked`, `pending`, `verified_by_staff`, `not_found`, `inconclusive`; reviewer-only |
| `licenceVerificationSource` | جانچ کا ذریعہ | Verification source | short text/URL reference | C | P3 | Required when check performed; no clickable untrusted URL |
| `contractUnderstood` | کیا ملازمت کا معاہدہ سمجھ میں آیا؟ | Is the employment contract understood? | enum:yesNoUnknown | C | P2 | Applies if contract available |
| `feesOrPaymentsRequested` | کیا فیس یا رقم مانگی گئی ہے؟ | Have fees or payments been requested? | enum:yesNoUnknown | C | P2 | Employment/recruitment route |
| `paymentReceiptStatus` | ادائیگی کی رسید کی حیثیت | Payment receipt status | enum | C | P2 | `available`, `not_available`, `not_paid`, `unknown` |
| `workOnVisitVisaProposed` | کیا وزٹ ویزا پر کام کرنے کی تجویز دی گئی ہے؟ | Has work on a visit visa been proposed? | enum:yesNoUnknown | C | P3 | Attention signal, not legal finding |

## G. Readiness checklist

Each readiness item is stored as `{status, note}`. Notes are optional and class `P2`; item status is class `P1/P2` as shown.

| Key | Urdu label | English label | Req | Class | Applies |
| --- | --- | --- | --- | --- | --- |
| `readiness.jobOfferOrContract` | ملازمت کا معاہدہ یا جاب آفر | Job offer or employment contract | C | P2 | Employment |
| `readiness.passport` | درست پاسپورٹ | Valid passport | C | P2 | Known planned international travel |
| `readiness.visaOrPermit` | ویزا/ورک پرمٹ | Visa/work permit | C | P2 | Offer/pre-departure/overseas |
| `readiness.educationProof` | تعلیمی اسناد | Educational credentials | N | P1 | When relevant |
| `readiness.technicalCertificates` | پیشہ ورانہ/تکنیکی سرٹیفکیٹ | Professional/technical certificates | N | P1 | When relevant |
| `readiness.cvAndCoverLetter` | سی وی اور کور لیٹر | CV and cover letter | N | P1 | Employment preparation |
| `readiness.experienceProof` | کام کے تجربے کا ثبوت | Proof of work experience | N | P1 | Employment |
| `readiness.healthInsurance` | ہیلتھ انشورنس | Health insurance | N | P2 | Offer/pre-departure/overseas |
| `readiness.languageProof` | زبان کی اہلیت/سرٹیفکیٹ | Language competence/certificate | N | P1 | Destination/role dependent |
| `readiness.policeClearance` | پولیس/فوجداری ریکارڈ کلیئرنس | Police/criminal-record clearance | N | P3 | Only status, no offence details |
| `readiness.travelItinerary` | سفری شیڈول | Travel itinerary | N | P2 | Pre-departure |
| `readiness.documentTranslations` | دستاویزات کے تراجم | Document translations | N | P1 | Destination dependent |
| `readiness.protectorRegistration` | پروٹیکٹر/متعلقہ سرکاری رجسٹریشن | Protector/relevant government registration | N | P2 | Employment/pre-departure as applicable |
| `readiness.emergencyCopies` | دستاویزات کی محفوظ نقول | Secure copies of important documents | N | P2 | Pre-departure/overseas |
| `readiness.familyTravelDetails` | گھر والوں کو سفر کی تفصیل | Family/trusted contact has travel details | N | P2 | Pre-departure |
| `readiness.emergencyContacts` | سفارتخانے/مدد کے رابطے | Embassy/support contact details | N | P1 | Pre-departure/overseas |

## H. Safety, exploitation, and support screen

These fields require safeguarding training and P3 access controls where noted. The UI must use supportive language and must not accuse a named person or organization.

| Key | Urdu label | English label | Type | Req | Class | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `pressureToTravelOrPay` | کیا آپ پر سفر یا ادائیگی کے لیے دباؤ ہے؟ | Are you being pressured to travel or pay? | enum:yesNoDecline | Y | P3 | Attention signal |
| `documentsWithheldConcern` | کیا کسی کے پاس آپ کی اصل دستاویزات ہیں اور واپسی میں مسئلہ ہے؟ | Is someone holding your original documents and making return difficult? | enum:yesNoDecline | Y | P3 | Attention signal |
| `falseDocumentsSuggested` | کیا جعلی یا غلط دستاویزات استعمال کرنے کا مشورہ دیا گیا ہے؟ | Have false or misleading documents been suggested? | enum:yesNoDecline | Y | P3 | Attention signal |
| `irregularRouteSuggested` | کیا غیر قانونی/غیر دستاویزی راستہ تجویز کیا گیا ہے؟ | Has an irregular or undocumented route been suggested? | enum:yesNoDecline | Y | P3 | Attention signal |
| `routeOrDestinationUnclear` | کیا راستہ، آجر یا منزل واضح نہیں؟ | Is the route, employer, or destination unclear? | enum:yesNoDecline | Y | P3 | Attention signal |
| `threatOrImmediateDanger` | کیا فوری خطرہ یا دھمکی موجود ہے؟ | Is there an immediate danger or threat? | enum:yesNoDecline | Y | P3 | Shows emergency SOP; not stored in routine list |
| `supportNeeded` | کس قسم کی مدد درکار ہے؟ | What support is needed? | multi-select | Y | P2 | `information`, `document_readiness`, `agent_verification`, `contract_guidance`, `safe_travel`, `complaint`, `legal_referral`, `psychosocial_referral`, `return_reintegration`, `other`, `none` |
| `supportNeededOther` | دیگر مدد | Other support needed | short text | C | P3 | When other |
| `safetyNarrative` | حفاظتی خدشے کی مختصر وضاحت | Brief description of safety concern | long text | N | P3 | Restricted; factual, minimal, applicant's words where possible |
| `safeToContact` | کیا طے شدہ طریقے سے رابطہ محفوظ ہے؟ | Is contact safe using the agreed method? | enum:yesNoUnknown | C | P3 | Required if any attention signal is positive |
| `safeguardingActionTaken` | فوری حفاظتی کارروائی | Immediate safeguarding action | enum | C | P3 | `sop_followed`, `supervisor_contacted`, `emergency_referral_proposed`, `no_immediate_action`, `other`; reviewer/officer per SOP |

## I. Overseas and safe-travel fields

| Key | Urdu label | English label | Type | Req | Class | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `arrivalStatus` | بیرون ملک آمد/قیام کی حیثیت | Arrival/residency status | enum | C | P3 | Overseas only; `documented`, `renewal_pending`, `uncertain`, `prefer_not_to_say` |
| `passportInOwnControl` | کیا پاسپورٹ آپ کے اپنے کنٹرول میں ہے؟ | Is your passport under your control? | enum:yesNoDecline | C | P3 | Overseas only |
| `contractMatchesWork` | کیا کام معاہدے کے مطابق ہے؟ | Does the work match the contract? | enum:yesNoUnknown | C | P3 | Overseas employment |
| `knowsEmbassyOrCwaContact` | کیا پاکستانی سفارتخانے/CWA کا رابطہ معلوم ہے؟ | Do you know the Pakistani mission/CWA contact? | enum:yesNoUnknown | C | P2 | Overseas/pre-departure |
| `remittanceChannelAwareness` | کیا قانونی/محفوظ ترسیلات زر کے ذرائع معلوم ہیں؟ | Are safe/legal remittance channels understood? | enum:yesNoUnknown | N | P1 | Guidance need only; no financial account details |
| `safeTravelSupportNotes` | محفوظ سفر/قیام سے متعلق مدد | Safe travel/stay support notes | long text | N | P3 | Restricted if safety details included |

## J. Return and reintegration

| Key | Urdu label | English label | Type | Req | Class | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `returnDatePeriod` | پاکستان واپسی کا وقت | Return period | month/enum | C | P2 | Returned stage only; month precision preferred |
| `returnType` | واپسی کی نوعیت | Type of return | enum | C | P3 | `planned`, `contract_complete`, `voluntary_early`, `deported_or_removed`, `emergency`, `other`, `prefer_not_to_say` |
| `reintegrationNeeds` | دوبارہ انضمام کی ضرورت | Reintegration support needed | multi-select | C | P2 | `employment`, `skills`, `business`, `financial_guidance`, `health`, `psychosocial`, `housing`, `documentation`, `legal`, `other`, `none` |
| `reintegrationNeedOther` | دیگر دوبارہ انضمام کی ضرورت | Other reintegration need | short text | C | P3 | When other |
| `returnSupportNotes` | واپسی سے متعلق مختصر وضاحت | Return support notes | long text | N | P3 | Minimize health/legal details |

## K. Review, assignment, and closure

| Key | Urdu label | English label | Type | Req | Class | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `attentionSignals` | توجہ طلب اشاریے | Attention signals | array | S | P3 | Derived codes; never “risk score” |
| `reviewPriority` | جائزے کی ترجیح | Review priority | enum | S/C | P3 | `routine`, `priority`, `immediate_sop`; derived then reviewer-confirmed |
| `reviewOutcome` | جائزے کا نتیجہ | Review outcome | enum | C | P3 | `complete`, `correction_required`, `hold`, `referral_required`, `close_no_action` |
| `reviewRationale` | جائزے کی وجہ/وضاحت | Review rationale | long text | C | P3 | Required for non-routine transitions |
| `correctionFieldKeys` | درستگی کے مطلوبہ خانے | Fields requiring correction | field-key array | C | P3 | Only valid keys from case form version |
| `holdReason` | مؤخر رکھنے کی وجہ | Hold reason | enum + note | C | P3 | Required for on hold |
| `nextReviewAt` | اگلے جائزے کی تاریخ | Next review date | date | C | P2 | Required for time-bound hold |
| `closureOutcome` | کیس بند کرنے کا نتیجہ | Closure outcome | enum | C | P3 | `information_provided`, `referral_completed`, `applicant_declined`, `unable_to_contact`, `no_further_action`, `duplicate`, `other` |
| `closureNotes` | کیس بند کرنے کی وضاحت | Closure notes | long text | C | P3 | Required for other/exception |

## L. Referral fields (one case may have multiple referrals)

| Key | Urdu label | English label | Type | Req | Class | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `referralId` | حوالہ شناخت | Referral ID | UUID | S | P2 | Internal stable ID |
| `referralCategory` | حوالہ کی قسم | Referral category | enum | Y | P2 | `migration_information`, `beoe_oep`, `oec_employment`, `opf_welfare`, `fia_unregistered_agent`, `embassy_cwa`, `legal`, `psychosocial`, `return_reintegration`, `emergency`, `other` |
| `referralDirectoryEntryId` | متعلقہ ادارہ | Destination organization | directory reference | C | P2 | Required unless other |
| `referralDestinationOther` | دیگر ادارہ | Other destination organization | short text | C | P2 | When other |
| `referralReasonCodes` | حوالہ کی وجہ | Referral reason | multi-select | Y | P3 | Approved reason codes; may map to readiness/support need |
| `referralReasonNote` | حوالہ کی مختصر وضاحت | Referral reason note | long text | N | P3 | Minimal necessary |
| `disclosureAuthorized` | معلومات فراہم کرنے کی اجازت | Disclosure authorized | boolean | Y | P3 | False is allowed; then give contact information only |
| `disclosureFields` | فراہم کی جانے والی معلومات | Information authorized for disclosure | field-key array | C | P3 | Required if disclosure authorized |
| `referralOwnerId` | حوالہ کا ذمہ دار | Referral owner | user reference | Y | P2 | In-scope user |
| `referralStatus` | حوالہ کی حیثیت | Referral status | enum:referralStatus | S/Y | P2 | Transition service controls |
| `referralDueAt` | پیروی کی تاریخ | Follow-up due date | date | C | P2 | Required for active referral |
| `referralOutcome` | حوالہ کا نتیجہ | Referral outcome | enum | C | P3 | Required for completion/decline/cancel |
| `referralOutcomeNote` | نتیجے کی وضاحت | Outcome note | long text | N | P3 | Minimal necessary |

## M. Data-subject/privacy request fields

| Key | Urdu label | English label | Type | Req | Class | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `privacyRequestType` | رازداری درخواست کی قسم | Privacy request type | enum | Y | P3 | `access`, `correction`, `withdrawal`, `restriction`, `deletion_or_anonymization`, `complaint`, `other` |
| `requestReceivedAt` | درخواست موصول ہونے کا وقت | Request received at | datetime | S | P3 | Separate restricted collection |
| `requestIdentityVerified` | شناخت کی تصدیق | Identity verified | boolean | C | P3 | Per approved SOP; do not store verification secrets |
| `requestDecision` | درخواست پر فیصلہ | Request decision | enum | C | P3 | `approved`, `partially_approved`, `denied`, `pending` |
| `requestDecisionReason` | فیصلے کی وجہ | Decision reason | long text | C | P3 | Legal/privacy owner only |
| `requestCompletedAt` | درخواست مکمل ہونے کا وقت | Request completed at | datetime | C | P3 | Audit-linked |

## Prohibited data for MVP

- Full CNIC, full passport number, passport scan, biometric data, live location, financial account/card details, bank credentials, passwords, medical diagnoses, criminal-offence narrative, political/religious affiliation, intimate/sexual history, or unrestricted document uploads.
- If a later approved use case requires any prohibited field, it requires a privacy impact assessment, legal/safeguarding approval, revised notice/consent, stricter access, encryption/key-management decision, retention rule, and updated threat model before implementation.

## Bilingual choice-label catalog

Choice values are API constants. The Urdu/English labels below are part of the approved form copy. Country, province, and district names must come from a separately versioned bilingual reference catalog.

### Common choices

| Enum/value | Urdu label | English label |
| --- | --- | --- |
| `language.ur` | اردو | Urdu |
| `language.en` | انگریزی | English |
| `language.other` | دیگر | Other |
| `yesNoUnknown.yes` | ہاں | Yes |
| `yesNoUnknown.no` | نہیں | No |
| `yesNoUnknown.unknown` | معلوم نہیں | Unknown |
| `yesNoDecline.yes` | ہاں | Yes |
| `yesNoDecline.no` | نہیں | No |
| `yesNoDecline.prefer_not_to_say` | جواب نہیں دینا چاہتا/چاہتی | Prefer not to say |
| `readinessStatus.available` | دستیاب | Available |
| `readinessStatus.in_progress` | تیاری/درخواست جاری ہے | In progress |
| `readinessStatus.not_available` | دستیاب نہیں | Not available |
| `readinessStatus.not_applicable` | لاگو نہیں | Not applicable |
| `readinessStatus.unknown` | معلوم نہیں | Unknown |

### Intake, contact, and profile

| Enum/value | Urdu label | English label |
| --- | --- | --- |
| `sourceChannel.walk_in` | دفتر میں براہِ راست آمد | Walk-in |
| `sourceChannel.phone` | فون | Phone |
| `sourceChannel.outreach` | آگاہی/فیلڈ سرگرمی | Outreach |
| `sourceChannel.internal_referral` | ادارے کے اندر سے حوالہ | Internal referral |
| `sourceChannel.external_referral` | بیرونی ادارے سے حوالہ | External referral |
| `sourceChannel.other` | دیگر | Other |
| `noticeDeliveryMode.read_by_applicant` | درخواست گزار نے خود پڑھا | Read by applicant |
| `noticeDeliveryMode.read_aloud_by_staff` | عملے نے پڑھ کر سنایا | Read aloud by staff |
| `noticeDeliveryMode.assisted` | معاونت کے ساتھ سمجھایا گیا | Explained with assistance |
| `noticeDeliveryMode.other` | دیگر | Other |
| `contactMethod.phone_call` | فون کال | Phone call |
| `contactMethod.sms` | ایس ایم ایس | SMS |
| `contactMethod.whatsapp` | واٹس ایپ | WhatsApp |
| `contactMethod.email` | ای میل | Email |
| `contactMethod.no_contact` | رابطہ نہ کیا جائے | Do not contact |
| `contactMethod.other` | دیگر | Other |
| `ageBand.under_18` | 18 سال سے کم | Under 18 |
| `ageBand.18_24` | 18 تا 24 سال | 18-24 years |
| `ageBand.25_34` | 25 تا 34 سال | 25-34 years |
| `ageBand.35_44` | 35 تا 44 سال | 35-44 years |
| `ageBand.45_54` | 45 تا 54 سال | 45-54 years |
| `ageBand.55_plus` | 55 سال یا زیادہ | 55 years or older |
| `ageBand.prefer_not_to_say` | جواب نہیں دینا چاہتا/چاہتی | Prefer not to say |
| `gender.woman` | خاتون | Woman |
| `gender.man` | مرد | Man |
| `gender.non_binary_or_self_described` | اپنی وضاحت | Non-binary or self-described |
| `gender.prefer_not_to_say` | جواب نہیں دینا چاہتا/چاہتی | Prefer not to say |

### Migration plan

| Enum/value | Urdu label | English label |
| --- | --- | --- |
| `migrationStage.exploring` | ابتدائی معلومات حاصل کر رہا/رہی ہوں | Exploring options |
| `migrationStage.preparing` | تیاری کر رہا/رہی ہوں | Preparing |
| `migrationStage.offer_received` | ملازمت/داخلے کی پیشکش مل چکی ہے | Offer received |
| `migrationStage.pre_departure` | روانگی سے پہلے کا مرحلہ | Pre-departure |
| `migrationStage.overseas` | اس وقت بیرون ملک ہوں | Currently overseas |
| `migrationStage.returned` | پاکستان واپس آ چکا/چکی ہوں | Returned to Pakistan |
| `migrationPurpose.employment` | ملازمت | Employment |
| `migrationPurpose.education` | تعلیم | Education |
| `migrationPurpose.family` | خاندان سے ملنا/ساتھ رہنا | Family |
| `migrationPurpose.visit` | دورہ/سیاحت | Visit |
| `migrationPurpose.returning_to_job` | بیرون ملک موجود ملازمت پر واپسی | Returning to an overseas job |
| `migrationPurpose.other` | دیگر | Other |
| `migrationPurpose.undecided` | ابھی فیصلہ نہیں کیا | Undecided |
| `intendedDuration.under_3_months` | 3 ماہ سے کم | Under 3 months |
| `intendedDuration.3_12_months` | 3 تا 12 ماہ | 3-12 months |
| `intendedDuration.1_3_years` | 1 تا 3 سال | 1-3 years |
| `intendedDuration.over_3_years` | 3 سال سے زیادہ | Over 3 years |
| `intendedDuration.permanent_or_unknown` | مستقل یا مدت معلوم نہیں | Permanent or unknown |
| `languageReadiness.none` | تیاری نہیں | None |
| `languageReadiness.basic` | ابتدائی | Basic |
| `languageReadiness.working` | کام کے لیے قابلِ استعمال | Working proficiency |
| `languageReadiness.certified` | سرٹیفکیٹ موجود ہے | Certified |
| `languageReadiness.not_required` | ضروری نہیں | Not required |
| `languageReadiness.unknown` | معلوم نہیں | Unknown |

Initial `targetSector` catalog:

| Value | Urdu label | English label |
| --- | --- | --- |
| `construction` | تعمیرات | Construction |
| `driving_transport` | ڈرائیونگ/نقل و حمل | Driving and transport |
| `security` | سیکیورٹی | Security |
| `domestic_work` | گھریلو کام | Domestic work |
| `hospitality` | ہوٹل/مہمان نوازی | Hospitality |
| `healthcare` | صحت | Healthcare |
| `engineering_technical` | انجینئرنگ/تکنیکی شعبہ | Engineering and technical trades |
| `information_technology` | انفارمیشن ٹیکنالوجی | Information technology |
| `agriculture` | زراعت | Agriculture |
| `manufacturing` | صنعت/مینوفیکچرنگ | Manufacturing |
| `education_research` | تعلیم/تحقیق | Education and research |
| `other` | دیگر | Other |
| `undecided` | ابھی فیصلہ نہیں کیا | Undecided |

### Recruitment and document status

| Enum/value | Urdu label | English label |
| --- | --- | --- |
| `recruitmentChannel.direct_employer` | آجر سے براہِ راست | Direct employer |
| `recruitmentChannel.registered_oep` | رجسٹرڈ اوورسیز ایمپلائمنٹ پروموٹر | Registered OEP |
| `recruitmentChannel.oec` | اوورسیز ایمپلائمنٹ کارپوریشن | OEC |
| `recruitmentChannel.online_portal` | آن لائن جاب پورٹل | Online job portal |
| `recruitmentChannel.family_or_friend` | خاندان/دوست کے ذریعے | Family or friend |
| `recruitmentChannel.social_media` | سوشل میڈیا | Social media |
| `recruitmentChannel.unregistered_agent` | غیر رجسٹرڈ ایجنٹ | Unregistered agent |
| `recruitmentChannel.unknown` | معلوم نہیں | Unknown |
| `recruitmentChannel.other` | دیگر | Other |
| `licenceVerificationStatus.not_checked` | جانچ نہیں کی گئی | Not checked |
| `licenceVerificationStatus.pending` | جانچ جاری ہے | Pending |
| `licenceVerificationStatus.verified_by_staff` | عملے نے سرکاری ذریعے سے تصدیق کی | Verified by staff using official source |
| `licenceVerificationStatus.not_found` | سرکاری ذریعے میں نہیں ملا | Not found in official source |
| `licenceVerificationStatus.inconclusive` | نتیجہ واضح نہیں | Inconclusive |
| `paymentReceiptStatus.available` | رسید دستیاب ہے | Receipt available |
| `paymentReceiptStatus.not_available` | رسید دستیاب نہیں | Receipt not available |
| `paymentReceiptStatus.not_paid` | ادائیگی نہیں کی | Not paid |
| `paymentReceiptStatus.unknown` | معلوم نہیں | Unknown |

### Support and reintegration

| Value | Urdu label | English label |
| --- | --- | --- |
| `information` | عمومی معلومات/رہنمائی | General information and guidance |
| `document_readiness` | دستاویزات کی تیاری | Document readiness |
| `agent_verification` | ایجنٹ/OEP کی جانچ | Agent/OEP verification |
| `contract_guidance` | معاہدے سے متعلق رہنمائی | Contract guidance |
| `safe_travel` | محفوظ سفر/روانگی | Safe travel and departure |
| `complaint` | شکایت درج کرانے میں رہنمائی | Complaint guidance |
| `legal_referral` | قانونی مدد کا حوالہ | Legal referral |
| `psychosocial_referral` | نفسیاتی/سماجی مدد کا حوالہ | Psychosocial referral |
| `return_reintegration` | واپسی/دوبارہ انضمام | Return and reintegration |
| `employment` | ملازمت | Employment |
| `skills` | ہنر/تربیت | Skills and training |
| `business` | کاروبار/سٹارٹ اپ | Business or startup |
| `financial_guidance` | مالی رہنمائی | Financial guidance |
| `health` | صحت سے متعلق مدد | Health support |
| `housing` | رہائش | Housing |
| `documentation` | شناختی/سرکاری دستاویزات | Identity/official documentation |
| `legal` | قانونی مدد | Legal support |
| `other` | دیگر | Other |
| `none` | فی الحال کوئی مدد نہیں | No support currently needed |

### Return, referral, and workflow

| Enum/value | Urdu label | English label |
| --- | --- | --- |
| `returnType.planned` | منصوبہ بند واپسی | Planned return |
| `returnType.contract_complete` | معاہدہ مکمل ہونے پر واپسی | Contract completed |
| `returnType.voluntary_early` | رضاکارانہ قبل از وقت واپسی | Voluntary early return |
| `returnType.deported_or_removed` | ملک بدری/واپسی | Deported or removed |
| `returnType.emergency` | ہنگامی واپسی | Emergency return |
| `returnType.other` | دیگر | Other |
| `returnType.prefer_not_to_say` | جواب نہیں دینا چاہتا/چاہتی | Prefer not to say |
| `referralCategory.migration_information` | محفوظ و قانونی ہجرت کی معلومات | Safe/legal migration information |
| `referralCategory.beoe_oep` | BEOE/OEP سے متعلق | BEOE/OEP support |
| `referralCategory.oec_employment` | OEC/بیرون ملک ملازمت | OEC/overseas employment |
| `referralCategory.opf_welfare` | OPF/فلاحی مدد | OPF/welfare support |
| `referralCategory.fia_unregistered_agent` | FIA/غیر رجسٹرڈ ایجنٹ شکایت | FIA/unregistered-agent complaint |
| `referralCategory.embassy_cwa` | پاکستانی سفارتخانہ/CWA | Pakistani mission/CWA |
| `referralCategory.legal` | قانونی مدد | Legal support |
| `referralCategory.psychosocial` | نفسیاتی/سماجی مدد | Psychosocial support |
| `referralCategory.return_reintegration` | واپسی/دوبارہ انضمام | Return/reintegration support |
| `referralCategory.emergency` | ہنگامی مدد | Emergency support |
| `referralCategory.other` | دیگر | Other |
| `caseStatus.draft` | مسودہ | Draft |
| `caseStatus.submitted` | جمع ہو چکا | Submitted |
| `caseStatus.under_review` | زیرِ جائزہ | Under review |
| `caseStatus.needs_correction` | درستگی درکار | Needs correction |
| `caseStatus.on_hold` | عارضی طور پر مؤخر | On hold |
| `caseStatus.approved` | پروگرام جائزے کے لیے مکمل | Complete for program review |
| `caseStatus.referred` | حوالہ دیا گیا | Referred |
| `caseStatus.closed` | بند | Closed |
| `caseStatus.archived` | محفوظ شدہ/آرکائیو | Archived |
| `referralStatus.proposed` | تجویز کردہ | Proposed |
| `referralStatus.authorized` | اجازت دی گئی | Authorized |
| `referralStatus.provided` | حوالہ فراہم کیا گیا | Referral provided |
| `referralStatus.accepted` | قبول کیا گیا | Accepted |
| `referralStatus.in_progress` | کارروائی جاری ہے | In progress |
| `referralStatus.completed` | مکمل | Completed |
| `referralStatus.declined` | درخواست گزار نے انکار کیا | Declined |
| `referralStatus.unable_to_contact` | رابطہ نہ ہو سکا | Unable to contact |
| `referralStatus.cancelled` | منسوخ | Cancelled |
