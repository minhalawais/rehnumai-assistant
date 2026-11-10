import type { MigrantCategory } from "@/lib/kobo-intake-form";
import type { CaseDraftInput } from "@/lib/intake-schema";
import type { IntakeAnswers } from "@/lib/intake-ui";

export const RETURN_BLOCK_KEYS = [
  "countryReturnFrom",
  "reasonForReturning",
  "dateOfReturn",
  "currentStatus",
] as const satisfies readonly (keyof IntakeAnswers)[];

export type ReturnBlockKey = (typeof RETURN_BLOCK_KEYS)[number];

const ALL_ANSWER_KEYS: (keyof IntakeAnswers)[] = [
  "migrantCategory",
  "fullName",
  "primaryPhone",
  "email",
  "city",
  "address",
  "fatherHusbandName",
  "gender",
  "maritalStatus",
  "religion",
  "cnic",
  "passportNo",
  "passportNoAlt",
  "qualification",
  "tradeSkill",
  ...RETURN_BLOCK_KEYS,
  "helpTopics",
  "bankAccountMode",
  "bankRelation",
  "bankName",
  "accountTitle",
  "iban",
];

export function isKoboFieldVisible(fieldKey: keyof IntakeAnswers, category: MigrantCategory | ""): boolean {
  if (category === "potential_migrants") {
    return !(RETURN_BLOCK_KEYS as readonly string[]).includes(fieldKey);
  }
  return true;
}

export function applicableFieldKeys(category: MigrantCategory): string[] {
  return ALL_ANSWER_KEYS.filter(key => isKoboFieldVisible(key, category));
}

export function stripHiddenAnswers(answers: IntakeAnswers): IntakeAnswers;
export function stripHiddenAnswers(answers: CaseDraftInput): CaseDraftInput;
export function stripHiddenAnswers(answers: IntakeAnswers | CaseDraftInput): IntakeAnswers | CaseDraftInput {
  if (answers.migrantCategory !== "potential_migrants") return { ...answers };
  const next = { ...answers };
  for (const key of RETURN_BLOCK_KEYS) {
    next[key] = "";
  }
  return next;
}

export type CategoryValidationResult = { ok: true } | { ok: false; field: ReturnBlockKey };

export function validatePublicAnswersForCategory(answers: IntakeAnswers | CaseDraftInput): CategoryValidationResult {
  if (answers.migrantCategory !== "potential_migrants") return { ok: true };
  for (const key of RETURN_BLOCK_KEYS) {
    const value = String(answers[key] ?? "").trim();
    if (value) return { ok: false, field: key };
  }
  return { ok: true };
}
