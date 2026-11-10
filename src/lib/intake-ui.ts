import {
  bankAccountModeOptions,
  bankRelationOptions,
  currentStatusOptions,
  genderOptions,
  maritalStatusOptions,
  migrantCategoryOptions,
  qualificationOptions,
  reasonForReturningOptions,
  religionOptions,
  type MigrantCategory,
} from "@/lib/kobo-intake-form";

export type { MigrantCategory };
export {
  migrantCategoryOptions,
  genderOptions,
  maritalStatusOptions,
  religionOptions,
  qualificationOptions,
  reasonForReturningOptions,
  currentStatusOptions,
  bankAccountModeOptions,
  bankRelationOptions,
  localizedMigrantCategory,
  isKoboFieldVisible,
  KoboSourceUrl,
} from "@/lib/kobo-intake-form";

export type IntakeAnswers = {
  migrantCategory: MigrantCategory | "";
  fullName: string;
  primaryPhone: string;
  email: string;
  city: string;
  address: string;
  fatherHusbandName: string;
  gender: string;
  maritalStatus: string;
  religion: string;
  cnic: string;
  passportNo: string;
  passportNoAlt: string;
  qualification: string;
  tradeSkill: string;
  countryReturnFrom: string;
  reasonForReturning: string;
  dateOfReturn: string;
  currentStatus: string;
  bankAccountMode: string;
  bankRelation: string;
  bankName: string;
  accountTitle: string;
  iban: string;
};

export const initialIntake: IntakeAnswers = {
  migrantCategory: "",
  fullName: "",
  primaryPhone: "",
  email: "",
  city: "",
  address: "",
  fatherHusbandName: "",
  gender: "",
  maritalStatus: "",
  religion: "",
  cnic: "",
  passportNo: "",
  passportNoAlt: "",
  qualification: "",
  tradeSkill: "",
  countryReturnFrom: "",
  reasonForReturning: "",
  dateOfReturn: "",
  currentStatus: "",
  bankAccountMode: "",
  bankRelation: "",
  bankName: "",
  accountTitle: "",
  iban: "",
};

export const intakeSteps = [
  ["Your group", "آپ کا گروپ"],
  ["Contact", "رابطہ"],
  ["Personal", "ذاتی معلومات"],
  ["ID documents", "شناختی دستاویزات"],
  ["Education & skill", "تعلیم اور ہنر"],
  ["Abroad / return", "بیرون ملک / واپسی"],
  ["Bank", "بینک"],
  ["Review", "جوابات دیکھیں"],
] as const;

export function localizedChoice(value: string | undefined, options: readonly (readonly [string, string, string])[], language: "ur" | "en") {
  if (!value) return "—";
  const choice = options.find(([key]) => key === value);
  return choice ? choice[language === "ur" ? 2 : 1] : value;
}
