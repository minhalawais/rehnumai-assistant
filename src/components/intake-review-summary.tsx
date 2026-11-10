"use client";

import { copy, type Language } from "@/components/locale";
import {
  currentStatusOptions,
  genderOptions,
  helpTopicOptions,
  maritalStatusOptions,
  qualificationOptions,
  reasonForReturningOptions,
  religionOptions,
} from "@/lib/kobo-intake-form";
import { isKoboFieldVisible, RETURN_BLOCK_KEYS } from "@/lib/kobo-intake-rules";
import { intakeQuestionCopy } from "@/lib/intake-question-copy";
import { intakeSteps, localizedChoice, localizedMigrantCategory, type IntakeAnswers } from "@/lib/intake-ui";

type Row = { key: keyof IntakeAnswers; labelEn: string; labelUr: string; value: string };

const FIELD_GROUPS: { step: number; keys: (keyof IntakeAnswers)[] }[] = [
  { step: 0, keys: ["migrantCategory"] },
  { step: 1, keys: ["fullName", "primaryPhone", "email", "city", "address"] },
  { step: 2, keys: ["fatherHusbandName", "gender", "maritalStatus", "religion"] },
  { step: 3, keys: ["cnic", "passportNo", "passportNoAlt"] },
  { step: 4, keys: ["qualification", "tradeSkill"] },
  { step: 5, keys: [...RETURN_BLOCK_KEYS] },
  { step: 6, keys: ["helpTopics"] },
];

function displayValue(key: keyof IntakeAnswers, form: IntakeAnswers, language: Language): string {
  const raw = form[key];
  if (key === "helpTopics") {
    if (!form.helpTopics.length) return "—";
    const joiner = language === "ur" ? "، " : ", ";
    return form.helpTopics.map(value => localizedChoice(value, helpTopicOptions, language)).join(joiner);
  }
  if (!raw || (typeof raw === "string" && !raw.trim())) return "—";
  if (key === "migrantCategory") return localizedMigrantCategory(String(raw), language);
  const optionMaps: Partial<Record<keyof IntakeAnswers, readonly (readonly [string, string, string])[]>> = {
    gender: genderOptions,
    maritalStatus: maritalStatusOptions,
    religion: religionOptions,
    qualification: qualificationOptions,
    reasonForReturning: reasonForReturningOptions,
    currentStatus: currentStatusOptions,
  };
  const options = optionMaps[key];
  if (options) return localizedChoice(String(raw), options, language);
  return String(raw);
}

function rowsForForm(form: IntakeAnswers, language: Language): { step: number; title: string; rows: Row[] }[] {
  const category = form.migrantCategory;
  return FIELD_GROUPS.map(group => {
    const title = intakeSteps[group.step][language === "ur" ? 1 : 0];
    const rows: Row[] = [];
    for (const key of group.keys) {
      if (!isKoboFieldVisible(key, category)) continue;
      const copyKey = key as keyof typeof intakeQuestionCopy;
      if (!(copyKey in intakeQuestionCopy)) continue;
      rows.push({
        key,
        labelEn: intakeQuestionCopy[copyKey].en,
        labelUr: intakeQuestionCopy[copyKey].ur,
        value: displayValue(key, form, language),
      });
    }
    return { step: group.step, title, rows };
  }).filter(section => section.rows.length > 0);
}

type Props = {
  form: IntakeAnswers;
  language: Language;
  variant: "mobile" | "desktop";
  onEditStep?: (step: number) => void;
  onEditQuestionId?: (questionId: string) => void;
};

const QUESTION_ID_BY_KEY: Partial<Record<keyof IntakeAnswers, string>> = {
  migrantCategory: "migrant-category",
  fullName: "full-name",
  primaryPhone: "phone",
  email: "email",
  city: "city",
  address: "address",
  fatherHusbandName: "father-husband",
  gender: "gender",
  maritalStatus: "marital",
  religion: "religion",
  cnic: "cnic",
  passportNo: "passport-7",
  passportNoAlt: "passport-8",
  qualification: "qualification",
  tradeSkill: "trade",
  countryReturnFrom: "country-return",
  reasonForReturning: "reason-return",
  dateOfReturn: "date-return",
  currentStatus: "current-status",
  helpTopics: "help-topics",
};

export function IntakeReviewSummary({ form, language, variant, onEditStep, onEditQuestionId }: Props) {
  const sections = rowsForForm(form, language);

  if (variant === "mobile") {
    return (
      <div className="space-y-4">
        {sections.map(section => (
          <div key={section.title} className="rounded-[12px] border border-[var(--line)] bg-white p-4">
            <h3 className="text-xs font-semibold text-[var(--ink-700)]">{section.title}</h3>
            <dl className="mt-3 space-y-3">
              {section.rows.map(row => (
                <div key={row.key} className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <dt className="text-xs text-[var(--ink-700)]">{copy(language, row.labelEn, row.labelUr)}</dt>
                    <dd className="mt-0.5 text-sm font-semibold text-[var(--ink-950)] break-words">{row.value}</dd>
                  </div>
                  {onEditQuestionId && QUESTION_ID_BY_KEY[row.key] ? (
                    <button
                      type="button"
                      className="shrink-0 text-xs font-semibold text-[var(--teal-700)]"
                      onClick={() => onEditQuestionId(QUESTION_ID_BY_KEY[row.key]!)}
                    >
                      {copy(language, "Edit", "بدلیں")}
                    </button>
                  ) : null}
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {sections.map(section => (
        <ReviewGroup
          key={section.title}
          title={section.title}
          editLabel={copy(language, "Edit", "بدلیں")}
          onEdit={onEditStep ? () => onEditStep(section.step) : undefined}
          rows={section.rows.map(row => [copy(language, row.labelEn, row.labelUr), row.value])}
        />
      ))}
    </div>
  );
}

function ReviewGroup({
  title,
  rows,
  onEdit,
  editLabel,
}: {
  title: string;
  rows: [string, string][];
  onEdit?: () => void;
  editLabel: string;
}) {
  return (
    <div className="rounded-[12px] border border-[var(--line)] p-4">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-sm font-semibold text-[var(--navy-950)]">{title}</h3>
        {onEdit ? (
          <button type="button" className="text-xs font-semibold text-[var(--teal-700)]" onClick={onEdit}>
            {editLabel}
          </button>
        ) : null}
      </div>
      <dl className="mt-3 space-y-2">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-0.5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] sm:gap-4">
            <dt className="text-xs text-[var(--ink-700)]">{label}</dt>
            <dd className="text-sm font-semibold text-[var(--ink-950)] break-words">{value || "—"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
