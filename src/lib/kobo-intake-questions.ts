import {
  bankAccountModeOptions,
  bankRelationOptions,
  currentStatusOptions,
  genderOptions,
  isKoboFieldVisible,
  maritalStatusOptions,
  migrantCategoryOptions,
  qualificationOptions,
  reasonForReturningOptions,
  religionOptions,
} from "@/lib/kobo-intake-form";
import type { IntakeAnswers } from "@/lib/intake-ui";

export type KoboQuestionKey = keyof IntakeAnswers;

export type KoboQuestionDef = {
  id: string;
  section: number;
  en: string;
  ur: string;
  kind: "text" | "single" | "review";
  key: KoboQuestionKey;
  optional?: boolean;
  inputMode?: "tel" | "text" | "numeric" | "email";
  options?: readonly (readonly [string, string, string])[];
  inputType?: string;
};

export function buildKoboIntakeQuestions(form: IntakeAnswers): KoboQuestionDef[] {
  const items: KoboQuestionDef[] = [
    { id: "migrant-category", section: 0, en: "Which group are you in?", ur: "آپ کس گروپ میں آتے ہیں؟", kind: "single", key: "migrantCategory", options: migrantCategoryOptions },
    { id: "full-name", section: 1, en: "1. Full name", ur: "1. پورا نام", kind: "text", key: "fullName" },
    { id: "phone", section: 1, en: "1a. Mobile number", ur: "1a. موبائل نمبر", kind: "text", key: "primaryPhone", inputMode: "tel" },
    { id: "email", section: 1, en: "1b. Email", ur: "1b. ای میل (اختیاری)", kind: "text", key: "email", optional: true, inputType: "email" },
    { id: "city", section: 1, en: "1c. City", ur: "1c. شہر", kind: "text", key: "city", optional: true },
    { id: "address", section: 1, en: "1d. Home address", ur: "1d. گھر کا پتہ", kind: "text", key: "address", optional: true },
    { id: "father-husband", section: 2, en: "2. Father or husband name", ur: "2. والد یا شوہر کا نام", kind: "text", key: "fatherHusbandName", optional: true },
    { id: "gender", section: 2, en: "3. Gender", ur: "3. جنس", kind: "single", key: "gender", options: genderOptions, optional: true },
    { id: "marital", section: 2, en: "4. Marital status", ur: "4. شادی شدہ ہیں یا نہیں؟", kind: "single", key: "maritalStatus", options: maritalStatusOptions, optional: true },
    { id: "religion", section: 2, en: "5. Religion", ur: "5. مذہب", kind: "single", key: "religion", options: religionOptions, optional: true },
    { id: "cnic", section: 3, en: "6. CNIC number", ur: "6. شناختی کارڈ نمبر", kind: "text", key: "cnic", optional: true, inputMode: "numeric" },
    { id: "passport-7", section: 3, en: "7. Passport number", ur: "7. پاسپورٹ نمبر", kind: "text", key: "passportNo", optional: true },
    { id: "passport-8", section: 3, en: "8. Second passport number (if any)", ur: "8. دوسرا پاسپورٹ نمبر (اگر ہو)", kind: "text", key: "passportNoAlt", optional: true },
    { id: "qualification", section: 4, en: "9. Education", ur: "9. تعلیم", kind: "single", key: "qualification", options: qualificationOptions, optional: true },
    { id: "trade", section: 4, en: "10. Trade or skill", ur: "10. پیشہ یا ہنر", kind: "text", key: "tradeSkill", optional: true },
    { id: "country-return", section: 5, en: "11. Country you returned from", ur: "11. کس ملک سے واپس آئے؟", kind: "text", key: "countryReturnFrom", optional: true },
    { id: "reason-return", section: 5, en: "12. Reason for return", ur: "12. واپسی کی وجہ", kind: "single", key: "reasonForReturning", options: reasonForReturningOptions, optional: true },
    { id: "date-return", section: 5, en: "13. Date of return", ur: "13. واپسی کی تاریخ", kind: "text", key: "dateOfReturn", optional: true, inputType: "date" },
    { id: "current-status", section: 5, en: "14. What are you doing now?", ur: "14. ابھی آپ کیا کر رہے ہیں؟", kind: "single", key: "currentStatus", options: currentStatusOptions, optional: true },
    { id: "bank-mode", section: 6, en: "Do you have your own bank account?", ur: "کیا آپ کا اپنا بینک اکاؤنٹ ہے؟", kind: "single", key: "bankAccountMode", options: bankAccountModeOptions, optional: true },
    { id: "bank-relation", section: 6, en: "Relation to account holder", ur: "اکاؤنٹ کس کا ہے — آپ کا ان سے کیا رشتہ ہے؟", kind: "single", key: "bankRelation", options: bankRelationOptions, optional: true },
    { id: "bank-name", section: 6, en: "Bank name", ur: "بینک کا نام", kind: "text", key: "bankName", optional: true },
    { id: "account-title", section: 6, en: "Name on account", ur: "اکاؤنٹ پر لکھا نام", kind: "text", key: "accountTitle", optional: true },
    { id: "iban", section: 6, en: "IBAN (24 digits)", ur: "آئی بین نمبر (24 ہندسے)", kind: "text", key: "iban", optional: true },
    { id: "review", section: 7, en: "Check your answers", ur: "جوابات ایک بار پڑھ لیں", kind: "review", key: "migrantCategory" },
  ];

  return items.filter(q => q.kind === "review" || isKoboFieldVisible(q.key, form.migrantCategory));
}
