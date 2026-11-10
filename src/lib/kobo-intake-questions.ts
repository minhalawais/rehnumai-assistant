import {
  currentStatusOptions,
  genderOptions,
  helpTopicOptions,
  isKoboFieldVisible,
  maritalStatusOptions,
  migrantCategoryOptions,
  qualificationOptions,
  reasonForReturningOptions,
  religionOptions,
} from "@/lib/kobo-intake-form";
import { intakeQuestionCopy } from "@/lib/intake-question-copy";
import type { IntakeAnswers } from "@/lib/intake-ui";

export type KoboQuestionKey = keyof IntakeAnswers;

export type KoboQuestionDef = {
  id: string;
  section: number;
  en: string;
  ur: string;
  kind: "text" | "single" | "multi" | "review";
  key: KoboQuestionKey;
  optional?: boolean;
  inputMode?: "tel" | "text" | "numeric" | "email";
  options?: readonly (readonly [string, string, string])[];
  inputType?: string;
};

function q(copy: { en: string; ur: string }): Pick<KoboQuestionDef, "en" | "ur"> {
  return { en: copy.en, ur: copy.ur };
}

export function buildKoboIntakeQuestions(form: IntakeAnswers): KoboQuestionDef[] {
  const items: KoboQuestionDef[] = [
    { id: "migrant-category", section: 0, ...q(intakeQuestionCopy.migrantCategory), kind: "single", key: "migrantCategory", options: migrantCategoryOptions },
    { id: "full-name", section: 1, ...q(intakeQuestionCopy.fullName), kind: "text", key: "fullName" },
    { id: "phone", section: 1, ...q(intakeQuestionCopy.primaryPhone), kind: "text", key: "primaryPhone", inputMode: "tel" },
    { id: "email", section: 1, ...q(intakeQuestionCopy.email), kind: "text", key: "email", optional: true, inputType: "email" },
    { id: "city", section: 1, ...q(intakeQuestionCopy.city), kind: "text", key: "city", optional: true },
    { id: "address", section: 1, ...q(intakeQuestionCopy.address), kind: "text", key: "address", optional: true },
    { id: "father-husband", section: 2, ...q(intakeQuestionCopy.fatherHusbandName), kind: "text", key: "fatherHusbandName", optional: true },
    { id: "gender", section: 2, ...q(intakeQuestionCopy.gender), kind: "single", key: "gender", options: genderOptions, optional: true },
    { id: "marital", section: 2, ...q(intakeQuestionCopy.maritalStatus), kind: "single", key: "maritalStatus", options: maritalStatusOptions, optional: true },
    { id: "religion", section: 2, ...q(intakeQuestionCopy.religion), kind: "single", key: "religion", options: religionOptions, optional: true },
    { id: "cnic", section: 3, ...q(intakeQuestionCopy.cnic), kind: "text", key: "cnic", optional: true, inputMode: "numeric" },
    { id: "passport-7", section: 3, ...q(intakeQuestionCopy.passportNo), kind: "text", key: "passportNo", optional: true },
    { id: "passport-8", section: 3, ...q(intakeQuestionCopy.passportNoAlt), kind: "text", key: "passportNoAlt", optional: true },
    { id: "qualification", section: 4, ...q(intakeQuestionCopy.qualification), kind: "single", key: "qualification", options: qualificationOptions, optional: true },
    { id: "trade", section: 4, ...q(intakeQuestionCopy.tradeSkill), kind: "text", key: "tradeSkill", optional: true },
    { id: "country-return", section: 5, ...q(intakeQuestionCopy.countryReturnFrom), kind: "text", key: "countryReturnFrom", optional: true },
    { id: "reason-return", section: 5, ...q(intakeQuestionCopy.reasonForReturning), kind: "single", key: "reasonForReturning", options: reasonForReturningOptions, optional: true },
    { id: "date-return", section: 5, ...q(intakeQuestionCopy.dateOfReturn), kind: "text", key: "dateOfReturn", optional: true, inputType: "date" },
    { id: "current-status", section: 5, ...q(intakeQuestionCopy.currentStatus), kind: "single", key: "currentStatus", options: currentStatusOptions, optional: true },
    { id: "help-topics", section: 6, ...q(intakeQuestionCopy.helpTopics), kind: "multi", key: "helpTopics", options: helpTopicOptions },
    { id: "review", section: 7, ...q(intakeQuestionCopy.review), kind: "review", key: "migrantCategory" },
  ];

  return items.filter(item => item.kind === "review" || isKoboFieldVisible(item.key, form.migrantCategory));
}
