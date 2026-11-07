"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { copy, useLocale } from "@/components/locale";
import { apiGet, type CaseDetail, localizedStage, shortDate } from "@/lib/client-api";
import { ageBandOptions, contactMethodOptions, localizedChoice, readinessItems, recruitmentOptions, safetySignals, supportOptions } from "@/lib/intake-ui";

type Submission = CaseDetail & { answers?: Record<string, unknown> };
function stringValue(value: unknown) { return typeof value === "string" && value.trim() ? value : "—"; }
function answerMap(value: unknown): Record<string, string> { return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, string> : {}; }
function answerList(value: unknown): string[] { return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : []; }

export default function SubmissionPage() {
  const params = useParams<{ reference: string }>();
  const { language } = useLocale();
  const [record, setRecord] = useState<Submission | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { apiGet<Submission>(`/api/cases/${encodeURIComponent(params.reference)}`).then(result => setRecord(result.data)).catch((cause: Error) => setError(cause.message)); }, [params.reference]);

  const answers = record?.answers ?? {};
  const readiness = answerMap(answers.readiness);
  const safety = answerMap(answers.safetyAnswers);
  const support = answerList(answers.supportNeeded);
  const yesNo = (value: unknown) => value === true ? copy(language, "Yes", "ہاں") : copy(language, "No", "نہیں");
  const safetyAnswer = (value: string | undefined) => value === "yes" ? copy(language, "Yes", "ہاں") : value === "no" ? copy(language, "No", "نہیں") : value === "skip" ? copy(language, "Prefer not to say", "بتانا نہیں چاہتے") : "—";
  const readinessAnswer = (value: string | undefined) => ({ available: copy(language, "Available", "دستیاب"), in_progress: copy(language, "In progress", "زیر عمل"), not_available: copy(language, "Not available", "دستیاب نہیں"), not_applicable: copy(language, "Not applicable", "لاگو نہیں"), unknown: copy(language, "Not sure", "معلوم نہیں") } as Record<string, string>)[value ?? ""] ?? "—";

  return <AppShell title={copy(language, "Submitted form", "جمع شدہ فارم")}>
    <Link href="/portal/submissions" className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--teal-700)]"><ArrowLeft size={16} className="rtl:rotate-180" />{copy(language, "Back to submissions", "جمع شدہ فارموں پر واپس")}</Link>
    {error ? <div role="alert" className="panel p-6 text-[var(--red-700)]">{error} <button className="ms-2 underline" onClick={() => window.location.reload()}>{copy(language, "Retry", "دوبارہ کوشش")}</button></div> : !record ? <div role="status" className="panel p-6 text-[var(--ink-700)]">{copy(language, "Loading form…", "فارم لوڈ ہو رہا ہے…")}</div> : <div className="mx-auto max-w-[1000px] space-y-5">
      <section className="panel p-5 sm:p-8"><p className="font-mono text-xs text-[var(--ink-500)]" dir="ltr">{record.caseReference}</p><h2 className="mt-2 text-[25px] font-semibold text-[var(--navy-950)]">{record.applicantSummary?.displayName || "—"}</h2><p className="mt-2 text-sm text-[var(--ink-700)]">{copy(language, "Submitted", "جمع ہوا")}: <span dir="auto">{shortDate(record.submittedAt, language)}</span></p></section>
      <Section title={copy(language, "Consent and contact", "رضامندی اور رابطہ")}><Info label={copy(language, "Service consent", "خدمت کی رضامندی")} value={yesNo(answers.serviceConsent)} /><Info label={copy(language, "Follow-up contact", "بعد میں رابطہ")} value={yesNo(answers.contactConsent)} /><Info label={copy(language, "Referral discussion", "حوالہ پر بات")} value={yesNo(answers.referralConsent)} /><Info label={copy(language, "Safe contact method", "محفوظ رابطے کا طریقہ")} value={answers.contactConsent ? localizedChoice(stringValue(answers.safeContactMethod), contactMethodOptions, language) : copy(language, "No contact", "کوئی رابطہ نہیں")} />{Boolean(answers.primaryPhone) && <Info label={copy(language, "Mobile number", "موبائل نمبر")} value={stringValue(answers.primaryPhone)} />}</Section>
      <Section title={copy(language, "Profile and migration plan", "ذاتی معلومات اور بیرون ملک جانے کا منصوبہ")}><Info label={copy(language, "Age band", "عمر کا زمرہ")} value={localizedChoice(stringValue(answers.ageBand), ageBandOptions, language)} /><Info label={copy(language, "Stage", "مرحلہ")} value={localizedStage(record.migrationSummary?.stage, language)} /><Info label={copy(language, "Purpose", "مقصد")} value={localizedStage(record.migrationSummary?.purpose, language)} /><Info label={copy(language, "Destination", "منزل")} value={stringValue(record.migrationSummary?.destinationCountry)} /><Info label={copy(language, "Target occupation", "متوقع پیشہ")} value={stringValue(answers.targetOccupation)} /><Info label={copy(language, "Recruitment route", "بھرتی کا طریقہ")} value={localizedChoice(stringValue(answers.recruitmentChannel), recruitmentOptions, language)} /></Section>
      <Section title={copy(language, "Preparation checklist", "تیاری کی چیک لسٹ")}>{readinessItems.filter(([key]) => readiness[key]).map(([key, en, ur]) => <Info key={key} label={copy(language, en, ur)} value={readinessAnswer(readiness[key])} />)}</Section>
      <Section title={copy(language, "Safety and support", "تحفظ اور مدد")}>{safetySignals.map(([key, en, ur]) => <Info key={key} label={copy(language, en, ur)} value={safetyAnswer(safety[key])} />)}<div className="sm:col-span-2"><Info label={copy(language, "Support requested", "درکار مدد")} value={support.map(value => localizedChoice(value, supportOptions, language)).join(", ") || "—"} /></div></Section>
    </div>}
  </AppShell>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) { return <section className="panel p-5 sm:p-8"><h3 className="text-lg font-semibold text-[var(--navy-950)]">{title}</h3><div className="mt-5 grid gap-x-7 gap-y-5 border-t border-[var(--line)] pt-5 sm:grid-cols-2">{children}</div></section>; }
function Info({ label, value }: { label: string; value: string }) { return <div className="min-w-0"><span className="block text-xs font-medium text-[var(--ink-700)]">{label}</span><span className="mt-1 block break-words text-sm font-semibold text-[var(--ink-950)]">{value}</span></div>; }
