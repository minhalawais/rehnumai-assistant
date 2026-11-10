"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { copy, useLocale } from "@/components/locale";
import { apiGet, type CaseDetail, shortDate } from "@/lib/client-api";
import {
  bankAccountModeOptions,
  bankRelationOptions,
  currentStatusOptions,
  genderOptions,
  localizedChoice,
  localizedMigrantCategory,
  maritalStatusOptions,
  qualificationOptions,
  reasonForReturningOptions,
  religionOptions,
} from "@/lib/intake-ui";

type Submission = CaseDetail & { answers?: Record<string, unknown> };

function stringValue(value: unknown) {
  return typeof value === "string" && value.trim() ? value : "—";
}

export default function SubmissionPage() {
  const params = useParams<{ reference: string }>();
  const { language } = useLocale();
  const [record, setRecord] = useState<Submission | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    void apiGet<Submission>(`/api/cases/${encodeURIComponent(params.reference)}`)
      .then(result => setRecord(result.data))
      .catch((cause: Error) => setError(cause.message));
  }, [params.reference]);

  const answers = record?.answers ?? {};

  return (
    <AppShell title={copy(language, "Submitted form", "جمع شدہ فارم")}>
      <Link href="/portal/submissions" className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--teal-700)]">
        <ArrowLeft size={16} className="rtl:rotate-180" />
        {copy(language, "Back to submissions", "فہرست پر واپس")}
      </Link>
      {error ? (
        <div role="alert" className="panel p-6 text-[var(--red-700)]">
          {error}{" "}
          <button className="ms-2 underline" onClick={() => window.location.reload()}>{copy(language, "Retry", "دوبارہ کوشش کریں")}</button>
        </div>
      ) : !record ? (
        <div role="status" className="panel p-6 text-[var(--ink-700)]">{copy(language, "Loading form…", "لوڈ ہو رہا ہے…")}</div>
      ) : (
        <div className="mx-auto max-w-[1000px] space-y-5">
          <section className="panel p-5 sm:p-8">
            <p className="font-mono text-xs text-[var(--ink-500)]" dir="ltr">{record.caseReference}</p>
            <h2 className="mt-2 text-[25px] font-semibold text-[var(--navy-950)]">{record.applicantSummary?.displayName || "—"}</h2>
            <p className="mt-2 text-sm text-[var(--ink-700)]">
              {copy(language, "Submitted", "جمع کیا")}: <span dir="auto">{shortDate(record.submittedAt, language)}</span>
            </p>
          </section>
          <Section title={copy(language, "Group and contact", "گروپ اور رابطہ")}>
            <Info label={copy(language, "Group", "گروپ")} value={localizedMigrantCategory(stringValue(answers.migrantCategory), language)} />
            <Info label={copy(language, "Name", "نام")} value={stringValue(answers.fullName)} />
            <Info label={copy(language, "Mobile number", "موبائل نمبر")} value={stringValue(answers.primaryPhone)} />
            <Info label={copy(language, "Email", "ای میل")} value={stringValue(answers.email)} />
            <Info label={copy(language, "City", "شہر")} value={stringValue(answers.city)} />
            <Info label={copy(language, "Home address", "گھر کا پتہ")} value={stringValue(answers.address)} />
          </Section>
          <Section title={copy(language, "Personal details", "ذاتی معلومات")}>
            <Info label={copy(language, "Father or husband name", "والد یا شوہر کا نام")} value={stringValue(answers.fatherHusbandName)} />
            <Info label={copy(language, "Gender", "جنس")} value={localizedChoice(stringValue(answers.gender), genderOptions, language)} />
            <Info label={copy(language, "Marital status", "شادی شدہ ہیں یا نہیں؟")} value={localizedChoice(stringValue(answers.maritalStatus), maritalStatusOptions, language)} />
            <Info label={copy(language, "Religion", "مذہب")} value={localizedChoice(stringValue(answers.religion), religionOptions, language)} />
            <Info label={copy(language, "CNIC number", "شناختی کارڈ نمبر")} value={stringValue(answers.cnic)} dir="ltr" />
            <Info label={copy(language, "Passport number", "پاسپورٹ نمبر")} value={stringValue(answers.passportNo)} dir="ltr" />
            <Info label={copy(language, "Second passport number", "دوسرا پاسپورٹ نمبر")} value={stringValue(answers.passportNoAlt)} dir="ltr" />
          </Section>
          <Section title={copy(language, "Education and return", "تعلیم اور واپسی")}>
            <Info label={copy(language, "Education", "تعلیم")} value={localizedChoice(stringValue(answers.qualification), qualificationOptions, language)} />
            <Info label={copy(language, "Trade or skill", "پیشہ یا ہنر")} value={stringValue(answers.tradeSkill)} />
            <Info label={copy(language, "Country returned from", "کس ملک سے واپس آئے؟")} value={stringValue(answers.countryReturnFrom)} />
            <Info label={copy(language, "Reason for return", "واپسی کی وجہ")} value={localizedChoice(stringValue(answers.reasonForReturning), reasonForReturningOptions, language)} />
            <Info label={copy(language, "Date of return", "واپسی کی تاریخ")} value={stringValue(answers.dateOfReturn)} />
            <Info label={copy(language, "Current activity", "ابھی کیا کر رہے ہیں؟")} value={localizedChoice(stringValue(answers.currentStatus), currentStatusOptions, language)} />
          </Section>
          <Section title={copy(language, "Bank details", "بینک کی معلومات")}>
            <Info label={copy(language, "Bank account", "بینک اکاؤنٹ")} value={localizedChoice(stringValue(answers.bankAccountMode), bankAccountModeOptions, language)} />
            <Info label={copy(language, "Relation to account holder", "اکاؤنٹ ہولڈر سے رشتہ")} value={localizedChoice(stringValue(answers.bankRelation), bankRelationOptions, language)} />
            <Info label={copy(language, "Bank name", "بینک کا نام")} value={stringValue(answers.bankName)} />
            <Info label={copy(language, "Name on account", "اکاؤنٹ پر لکھا نام")} value={stringValue(answers.accountTitle)} />
            <Info label={copy(language, "IBAN", "آئی بین نمبر")} value={stringValue(answers.iban)} dir="ltr" />
          </Section>
        </div>
      )}
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="panel p-5 sm:p-8">
      <h3 className="text-lg font-semibold text-[var(--navy-950)]">{title}</h3>
      <div className="mt-5 grid gap-x-7 gap-y-5 border-t border-[var(--line)] pt-5 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function Info({ label, value, dir }: { label: string; value: string; dir?: "ltr" }) {
  return (
    <div className="min-w-0">
      <span className="block text-xs font-medium text-[var(--ink-700)]">{label}</span>
      <span className="mt-1 block break-words text-sm font-semibold text-[var(--ink-950)]" dir={dir}>{value}</span>
    </div>
  );
}
