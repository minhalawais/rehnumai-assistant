export type ReadinessStatus = "available" | "in_progress" | "not_available" | "not_applicable" | "unknown";
export type IntakeAnswers = {
  serviceConsent: boolean; contactConsent: boolean; referralConsent: boolean; fullName: string; primaryPhone: string;
  safeContactMethod: "none" | "phone" | "message"; ageBand: string; migrationStage: string; migrationPurpose: string;
  destinationCountry: string; targetOccupation: string; recruitmentChannel: string; readiness: Record<string, ReadinessStatus>;
  safetyAnswers: Record<string, "yes" | "no" | "skip">; attentionSignalCodes: string[]; supportNeeded: string[]; notes: string;
};
export const initialIntake: IntakeAnswers = { serviceConsent: false, contactConsent: false, referralConsent: false, fullName: "", primaryPhone: "", safeContactMethod: "none", ageBand: "", migrationStage: "", migrationPurpose: "", destinationCountry: "", targetOccupation: "", recruitmentChannel: "", readiness: {}, safetyAnswers: {}, attentionSignalCodes: [], supportNeeded: [], notes: "" };
export const intakeSteps = [["Consent", "رضامندی"], ["Profile", "ذاتی معلومات"], ["Migration plan", "بیرون ملک جانے کا منصوبہ"], ["Preparation checklist", "تیاری کی چیک لسٹ"], ["Safety & support", "تحفظ اور مدد"], ["Review", "جائزہ"]] as const;
export const readinessItems = [
  ["offer", "Job offer or employment contract", "ملازمت کی پیشکش یا معاہدہ"],
  ["passport", "Valid passport", "درست پاسپورٹ"],
  ["visa", "Visa or work permit", "ویزا یا ورک پرمٹ"],
  ["education", "Educational certificates", "تعلیمی اسناد"],
  ["skills", "Technical certificates", "تکنیکی سرٹیفکیٹ"],
  ["experience", "Experience certificates", "تجربے کے سرٹیفکیٹ"],
  ["cv", "Curriculum vitae (CV)", "سی وی"],
  ["language", "Language preparation", "زبان کی تیاری"],
  ["insurance", "Health insurance", "ہیلتھ انشورنس"],
  ["character", "Character certificate", "کیریکٹر سرٹیفکیٹ"],
  ["translation", "Document translations", "دستاویزات کا ترجمہ"],
  ["travel", "Pre-departure travel checklist", "روانگی کی چیک لسٹ"],
] as const;
export const employmentReadinessKeys = new Set(["offer", "education", "skills", "experience", "cv", "language", "insurance", "character", "translation"]);
// Preserve submission compatibility for forms opened before the booklet checklist was expanded.
export const requiredReadinessKeys = new Set(["offer", "passport", "visa", "skills", "experience", "language", "travel"]);
export const safetySignals = [["AT-001", "Pressure to travel or pay", "سفر یا رقم ادا کرنے کے لیے دباؤ"], ["AT-002", "False documents suggested", "جعلی دستاویزات بنانے کا مشورہ"], ["AT-003", "Unsafe or undocumented route suggested", "غیر محفوظ یا غیر قانونی راستے کا مشورہ"], ["AT-004", "Passport or document concern", "پاسپورٹ یا دستاویزات سے متعلق تشویش"], ["AT-005", "Work on a visit visa suggested", "وزٹ ویزے پر کام کرنے کا مشورہ"], ["AT-007", "Immediate danger reported", "فوری خطرے کی اطلاع"]] as const;
export const safetyQuestions: Record<string, readonly [string, string]> = {
  "AT-001": ["Has anyone pressured you to travel or pay money?", "کیا کسی نے آپ پر سفر کرنے یا رقم ادا کرنے کے لیے دباؤ ڈالا ہے؟"],
  "AT-002": ["Has anyone suggested using false documents?", "کیا کسی نے جعلی دستاویزات استعمال کرنے کا مشورہ دیا ہے؟"],
  "AT-003": ["Has anyone suggested an unsafe or undocumented route?", "کیا کسی نے غیر محفوظ یا غیر قانونی راستہ اختیار کرنے کا مشورہ دیا ہے؟"],
  "AT-004": ["Do you have concerns about your passport or other documents?", "کیا آپ کو اپنے پاسپورٹ یا دیگر دستاویزات کے بارے میں کوئی تشویش ہے؟"],
  "AT-005": ["Has anyone suggested working on a visit visa?", "کیا کسی نے وزٹ ویزے پر کام کرنے کا مشورہ دیا ہے؟"],
  "AT-007": ["Is anyone in immediate danger?", "کیا کسی کو فوری خطرہ ہے؟"],
};
export const supportOptions = [["Information", "Migration information", "ہجرت سے متعلق معلومات"], ["Document readiness", "Documents and preparation", "دستاویزات اور تیاری"], ["Recruitment advice", "Recruitment route guidance", "بھرتی کے طریقے سے متعلق رہنمائی"], ["Safe travel", "Safe departure and travel", "محفوظ روانگی اور سفر"], ["Support abroad", "Support while abroad", "بیرون ملک مدد"], ["Remittance guidance", "Formal remittance guidance", "قانونی ترسیلات زر سے متعلق رہنمائی"], ["Complaint guidance", "Rights and complaint channels", "حقوق اور شکایت کے طریقے"], ["Return support", "Return and reintegration", "وطن واپسی اور دوبارہ انضمام"]] as const;
export const stageOptions = [["exploring", "Exploring", "غور کر رہے ہیں"], ["preparing", "Preparing", "تیاری"], ["offer_received", "Offer received", "پیشکش ملی ہے"], ["pre_departure", "Pre-departure", "روانگی سے پہلے"], ["overseas", "Overseas", "بیرون ملک"], ["returned", "Returned", "واپس آ گئے ہیں"]] as const;
export const ageBandOptions = [["under_18", "Under 18", "18 سال سے کم"], ["18_24", "18–24", "18–24"], ["25_34", "25–34", "25–34"], ["35_44", "35–44", "35–44"], ["45_plus", "45 or older", "45 یا اس سے زیادہ"], ["prefer_not", "Prefer not to say", "بتانا نہیں چاہتے"]] as const;
export const contactMethodOptions = [["none", "No follow-up contact", "بعد میں رابطہ نہیں"], ["phone", "Phone call", "فون کال"], ["message", "Text message", "پیغام"]] as const;
export const purposeOptions = [["undecided", "Undecided", "ابھی طے نہیں"], ["employment", "Employment", "ملازمت"], ["education", "Education", "تعلیم"], ["family", "Family", "خاندان"], ["visit", "Visit", "دورہ"], ["returning_to_job", "Return to overseas job", "بیرون ملک ملازمت پر واپسی"], ["other", "Other", "دیگر"]] as const;
export const recruitmentOptions = [["Direct employer", "Direct employer", "براہ راست آجر"], ["Registered OEP", "Overseas Employment Promoter (OEP), registration not yet checked", "اوورسیز ایمپلائمنٹ پروموٹر (او ای پی)، رجسٹریشن کی تصدیق باقی ہے"], ["OEC", "Overseas Employment Corporation (OEC)", "اوورسیز ایمپلائمنٹ کارپوریشن (او ای سی)"], ["Family or friend", "Family or friend", "خاندان یا دوست"], ["Online", "Online job offer", "آن لائن ملازمت کی پیشکش"], ["Other", "Other / unknown", "دیگر / نامعلوم"]] as const;
export const readinessStatuses = [["available", "Available", "دستیاب"], ["in_progress", "In progress", "زیر عمل"], ["not_available", "Not available", "دستیاب نہیں"], ["not_applicable", "Not applicable", "لاگو نہیں"], ["unknown", "Not sure", "معلوم نہیں"]] as const;
export function localizedChoice(value: string | undefined, options: readonly (readonly [string, string, string])[], language: "ur" | "en") {
  if (!value) return "—";
  const choice = options.find(([key]) => key === value);
  return choice ? choice[language === "ur" ? 2 : 1] : value;
}
