/**
 * Public intake aligned to Kobo form https://ee.kobotoolbox.org/x/qwfnBGI6
 * — training yes/no removed; category = potential_migrants | return_migrants.
 */
export const KoboSourceUrl = "https://ee.kobotoolbox.org/x/qwfnBGI6";

export const migrantCategoryOptions = [
  ["potential_migrants", "Going abroad", "بیرون ملک جانے والے"],
  ["return_migrants", "Returned from abroad", "بیرون ملک سے واپس آنے والے"],
] as const;

export type MigrantCategory = (typeof migrantCategoryOptions)[number][0];

export const genderOptions = [
  ["male", "Male", "مرد"],
  ["female", "Female", "عورت"],
  ["other", "Other", "دیگر"],
] as const;

export const maritalStatusOptions = [
  ["single", "Single", "غیر شادی شدہ"],
  ["married", "Married", "شادی شدہ"],
  ["divorced", "Divorced", "طلاق یافتہ"],
  ["widow", "Widow", "بیوہ"],
] as const;

export const religionOptions = [
  ["muslim", "Muslim", "مسلم"],
  ["christian", "Christian", "عیسائی"],
  ["hindu", "Hindu", "ہندو"],
  ["sikh", "Sikh", "سکھ"],
  ["other", "Other", "دیگر"],
] as const;

export const qualificationOptions = [
  ["illiterate", "Illiterate", "ان پڑھ"],
  ["primary", "Primary", "پرائمری"],
  ["matric", "Matric", "میٹرک"],
  ["intermediate", "Intermediate", "انٹرمیڈیٹ"],
  ["graduate", "Graduate", "بی اے / گریجویٹ"],
  ["master_above", "Master & above", "ماسٹر یا اس سے اوپر"],
] as const;

export const reasonForReturningOptions = [
  ["volunteer", "Volunteer", "خود واپس آئے"],
  ["deported", "Deported", "ڈپورٹ ہوئے"],
  ["job_completed", "Job completed", "ملازمت ختم ہو گئی"],
  ["company_closed", "Company closed", "کمپنی بند ہو گئی"],
  ["visa_cancelled", "Visa cancelled", "ویزا منسوخ ہوا"],
  ["contract_completed", "Contract completed", "معاہدہ پورا ہو گیا"],
  ["issue_with_employer", "Issue with employer", "آجر / مالک سے مسئلہ"],
  ["job_not_as_per_contract", "Job not as per contract", "کام معاہدے کے مطابق نہیں تھا"],
  ["other_reasons", "Other reasons", "کوئی اور وجہ"],
] as const;

export const currentStatusOptions = [
  ["unemployed", "Un-employed", "ابھی کام نہیں"],
  ["job", "Job", "ملازمت پر ہوں"],
  ["temporary_job", "Temporary job", "عارضی کام"],
  ["own_business", "Own business", "اپنا کاروبار"],
  ["other", "Other", "کچھ اور"],
] as const;

export const bankAccountModeOptions = [
  ["own", "Yes — my own bank account", "جی ہاں، میرا اپنا اکاؤنٹ"],
  ["other", "No — another person's account", "نہیں، کسی اور کا اکاؤنٹ"],
] as const;

export const bankRelationOptions = [
  ["parents", "Parents", "والدین"],
  ["siblings", "Siblings (brother / sister)", "بھائی یا بہن"],
  ["friends", "Friends", "دوست"],
  ["other_relatives", "Other relatives", "رشتہ دار"],
] as const;

export { applicableFieldKeys, isKoboFieldVisible, RETURN_BLOCK_KEYS, stripHiddenAnswers, validatePublicAnswersForCategory } from "@/lib/kobo-intake-rules";

export function localizedMigrantCategory(value: string | undefined, language: "ur" | "en"): string {
  const row = migrantCategoryOptions.find(([key]) => key === value);
  if (!row) return value || "—";
  return language === "ur" ? row[2] : row[1];
}
