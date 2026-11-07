"use client";

import { ArrowLeft, ArrowRight, Check, Save } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { copy, type Language } from "@/components/locale";
import { ageBandOptions, contactMethodOptions, employmentReadinessKeys, intakeSteps, localizedChoice, purposeOptions, readinessItems, readinessStatuses, recruitmentOptions, safetyQuestions, safetySignals, stageOptions, supportOptions, type IntakeAnswers, type ReadinessStatus } from "@/lib/intake-ui";

type FieldKey = "fullName" | "primaryPhone" | "destinationCountry" | "targetOccupation" | "notes";
type SingleKey = "ageBand" | "migrationStage" | "migrationPurpose" | "safeContactMethod" | "recruitmentChannel";
type ConsentKey = "serviceConsent" | "contactConsent" | "referralConsent";
type Question =
  | { id: string; section: number; en: string; ur: string; kind: "consent"; key: ConsentKey }
  | { id: string; section: number; en: string; ur: string; kind: "text"; key: FieldKey; optional?: boolean; inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"] }
  | { id: string; section: number; en: string; ur: string; kind: "single"; key: SingleKey; options: readonly (readonly [string, string, string])[]; optional?: boolean }
  | { id: string; section: number; en: string; ur: string; kind: "readiness"; key: string }
  | { id: string; section: number; en: string; ur: string; kind: "safety"; key: string }
  | { id: string; section: number; en: string; ur: string; kind: "support" | "review" };

type Props = {
  form: IntakeAnswers;
  update: <K extends keyof IntakeAnswers>(key: K, value: IntakeAnswers[K]) => void;
  language: Language;
  canWriteRestricted: boolean;
  saveState: "new" | "dirty" | "saving" | "saved" | "error";
  error: string;
  correctionReason: string;
  attested: boolean;
  setAttested: (value: boolean) => void;
  onSave: (submit?: boolean) => Promise<boolean>;
  onDecline: () => void;
  onExit: () => void;
  publicMode?: boolean;
};

const yesNoOptions = [["yes", "Yes", "ہاں"], ["no", "No", "نہیں"], ["skip", "Prefer not to say", "بتانا نہیں چاہتے"]] as const;

export function MobileIntake({ form, update, language, canWriteRestricted, saveState, error, correctionReason, attested, setAttested, onSave, onDecline, onExit, publicMode = false }: Props) {
  const [index, setIndex] = useState(0);
  const [questionError, setQuestionError] = useState("");
  const [emergencyAcknowledged, setEmergencyAcknowledged] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const pendingQuestionId = useRef<string | undefined>(undefined);
  const questions = useMemo<Question[]>(() => {
    const base: Question[] = [
      { id: "service-consent", section: 0, en: "Do you agree to create a support record?", ur: "کیا آپ مدد کا ریکارڈ بنانے پر رضامند ہیں؟", kind: "consent", key: "serviceConsent" },
      { id: "contact-consent", section: 0, en: "May we contact you later?", ur: "کیا ہم بعد میں آپ سے رابطہ کر سکتے ہیں؟", kind: "consent", key: "contactConsent" },
      { id: "referral-consent", section: 0, en: "May we discuss a possible referral with you?", ur: "کیا ہم آپ سے ممکنہ حوالہ پر بات کر سکتے ہیں؟", kind: "consent", key: "referralConsent" },
      { id: "full-name", section: 1, en: "What is your full name?", ur: "آپ کا مکمل نام کیا ہے؟", kind: "text", key: "fullName" },
      { id: "phone", section: 1, en: "What is your mobile number?", ur: "آپ کا موبائل نمبر کیا ہے؟", kind: "text", key: "primaryPhone", inputMode: "tel" },
      { id: "age-band", section: 1, en: "Which age band applies?", ur: "عمر کا کون سا زمرہ لاگو ہوتا ہے؟", kind: "single", key: "ageBand", options: ageBandOptions, optional: true },
    ];
    if (form.contactConsent) {
      base.push({ id: "safe-contact", section: 1, en: "How may we safely contact you?", ur: "ہم آپ سے محفوظ طریقے سے کیسے رابطہ کریں؟", kind: "single", key: "safeContactMethod", options: contactMethodOptions });
    }
    base.push(
      { id: "stage", section: 2, en: "What stage of migration are you at?", ur: "آپ ہجرت کے کس مرحلے میں ہیں؟", kind: "single", key: "migrationStage", options: stageOptions },
      { id: "purpose", section: 2, en: "What is your main reason for travelling?", ur: "آپ کے سفر کا بنیادی مقصد کیا ہے؟", kind: "single", key: "migrationPurpose", options: purposeOptions },
      { id: "destination", section: 2, en: "Which country are you considering?", ur: "آپ کس ملک کے بارے میں سوچ رہے ہیں؟", kind: "text", key: "destinationCountry", optional: true },
    );
    if (form.migrationPurpose === "employment") base.push(
      { id: "occupation", section: 2, en: "What work are you planning to do?", ur: "آپ کون سا کام کرنے کا ارادہ رکھتے ہیں؟", kind: "text", key: "targetOccupation", optional: true },
      { id: "recruitment", section: 2, en: "How were you offered or told about this job?", ur: "آپ کو اس ملازمت کی پیشکش یا اطلاع کس ذریعے سے ملی؟", kind: "single", key: "recruitmentChannel", options: recruitmentOptions, optional: true },
    );
    for (const [key, en, ur] of readinessItems) if (form.migrationPurpose === "employment" || !employmentReadinessKeys.has(key)) base.push({ id: `readiness-${key}`, section: 3, en: `What is the status of your ${en.toLowerCase()}?`, ur: `${ur} کی کیا حیثیت ہے؟`, kind: "readiness", key });
    for (const [key] of safetySignals) base.push({ id: `safety-${key}`, section: 4, en: safetyQuestions[key][0], ur: safetyQuestions[key][1], kind: "safety", key });
    base.push({ id: "support", section: 4, en: "What support would help you?", ur: "آپ کو کس مدد سے فائدہ ہو گا؟", kind: "support" });
    if (canWriteRestricted) base.push({ id: "staff-note", section: 4, en: "Is a restricted staff note needed?", ur: "کیا محدود عملے کا نوٹ ضروری ہے؟", kind: "text", key: "notes", optional: true });
    base.push({ id: "review", section: 5, en: "Review your answers", ur: "اپنے جوابات کا جائزہ لیں", kind: "review" });
    return base;
  }, [form.contactConsent, form.safeContactMethod, form.migrationPurpose, canWriteRestricted]);
  const currentIndex = Math.min(index, questions.length - 1);
  const question = questions[currentIndex];

  useEffect(() => {
    if (pendingQuestionId.current === undefined) pendingQuestionId.current = new URLSearchParams(window.location.search).get("question") ?? "";
    const found = questions.findIndex(item => item.id === pendingQuestionId.current);
    if (found >= 0) { pendingQuestionId.current = ""; queueMicrotask(() => setIndex(found)); }
  }, [questions]);
  useEffect(() => {
    if (pendingQuestionId.current) return;
    const url = new URL(window.location.href);
    url.searchParams.set("question", question.id);
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
    titleRef.current?.focus();
  }, [question.id]);

  function move(next: number) { setQuestionError(""); setIndex(Math.max(0, Math.min(next, questions.length - 1))); window.scrollTo({ top: 0, behavior: "instant" }); }
  function selectSafety(key: string, value: "yes" | "no" | "skip") {
    update("safetyAnswers", { ...form.safetyAnswers, [key]: value });
    update("attentionSignalCodes", value === "yes" ? [...form.attentionSignalCodes.filter(item => item !== key), key] : form.attentionSignalCodes.filter(item => item !== key));
  }
  function hasAnswer(item: Question) {
    if (item.kind === "consent") return item.key !== "serviceConsent" || form.serviceConsent;
    if (item.kind === "text") {
      if (item.key === "primaryPhone") return form.primaryPhone.replace(/\D/g, "").length >= 7;
      return item.optional || Boolean(form[item.key].trim());
    }
    if (item.kind === "single") return item.optional || Boolean(form[item.key]);
    if (item.kind === "readiness") return Boolean(form.readiness[item.key]);
    if (item.kind === "safety") return Boolean(form.safetyAnswers[item.key]);
    return true;
  }
  async function continueFlow() {
    if (!hasAnswer(question)) { setQuestionError(copy(language, "Answer this question to continue.", "آگے بڑھنے کے لیے اس سوال کا جواب دیں۔")); return; }
    if (!publicMode && question.kind === "safety" && question.key === "AT-007" && form.safetyAnswers[question.key] === "yes" && !emergencyAcknowledged) { setQuestionError(copy(language, "Confirm that you contacted the safeguarding lead.", "تصدیق کریں کہ آپ نے حفاظتی ذمہ دار سے رابطہ کیا ہے۔")); return; }
    if (question.kind === "review") {
      const missing = questions.findIndex(item => item.kind !== "review" && !hasAnswer(item));
      if (missing >= 0) { move(missing); setQuestionError(copy(language, "Answer this question before submitting.", "جمع کرانے سے پہلے اس سوال کا جواب دیں۔")); return; }
      if (!attested) { setQuestionError(copy(language, "Confirm the review before submitting.", "جمع کرانے سے پہلے جائزے کی تصدیق کریں۔")); return; }
      await onSave(true); return;
    }
    move(currentIndex + 1);
  }
  async function saveAndExit() { if (await onSave(false)) onExit(); }
  const section = intakeSteps[question.section];
  const progress = Math.round(((currentIndex + 1) / questions.length) * 100);
  return <div className="mobile-intake lg:hidden">
    <div className="mobile-intake__top"><div className="flex items-center justify-between gap-3"><span className="text-xs font-bold text-[var(--teal-700)]">{copy(language, section[0], section[1])}</span><span className="text-xs font-semibold text-[var(--ink-700)]" aria-live="polite">{currentIndex + 1} / {questions.length}</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--line)]" role="progressbar" aria-label={copy(language, "Intake progress", "اندراج کی پیش رفت")} aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={questions.length}><div className="h-full rounded-full bg-[var(--teal-700)] transition-[width]" style={{ width: `${progress}%` }} /></div>{!publicMode && <div className="mt-3 flex items-center justify-between gap-3"><span className="text-xs text-[var(--ink-700)]" aria-live="polite">{saveState === "saved" ? copy(language, "Saved", "محفوظ") : saveState === "saving" ? copy(language, "Saving…", "محفوظ ہو رہا ہے…") : saveState === "dirty" ? copy(language, "Unsaved changes", "غیر محفوظ تبدیلیاں") : saveState === "error" ? copy(language, "Not saved", "محفوظ نہیں ہوا") : copy(language, "Not saved yet", "ابھی محفوظ نہیں")}</span><button type="button" className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-[var(--navy-900)]" onClick={() => void saveAndExit()} disabled={saveState === "saving" || !form.serviceConsent}><Save size={16} />{copy(language, "Save & exit", "محفوظ کر کے جائیں")}</button></div>}</div>
    <div className="mobile-intake__body">{correctionReason && <div className="mb-5 rounded-[12px] border border-[#e4c879] bg-[var(--amber-100)] p-4 text-sm text-[var(--amber-700)]"><strong>{copy(language, "Correction requested", "اصلاح کی درخواست")}</strong><p className="mt-1">{correctionReason}</p></div>}<h2 ref={titleRef} tabIndex={-1} id="mobile-question-title" className="mobile-intake__question">{copy(language, question.en, question.ur)}</h2>{questionError || error ? <div role="alert" className="mt-5 rounded-[10px] border border-[var(--red-700)] bg-[var(--red-100)] p-3 text-sm text-[var(--red-700)]">{questionError || error}</div> : null}
      {question.kind === "consent" && <div className="mt-7 space-y-3">{question.key === "serviceConsent" && <p className="mb-6 text-sm leading-7 text-[var(--ink-700)]">{copy(language, "Rehnumai records your preparation and support needs. Submitting this form does not guarantee a job, visa, or government approval.", "رہنمائی آپ کی تیاری اور مدد کی ضروریات درج کرتی ہے۔ یہ فارم ملازمت، ویزا یا حکومتی منظوری کی ضمانت نہیں دیتا۔")}</p>}{question.key === "serviceConsent" && <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm font-semibold text-[var(--teal-700)] underline">{copy(language, "Read the privacy notice", "رازداری کا نوٹس پڑھیں")}</Link>}{question.key === "referralConsent" && <p className="mb-6 text-sm leading-7 text-[var(--ink-700)]">{copy(language, "Choosing yes allows a discussion only. It does not share information with another organization.", "ہاں منتخب کرنے سے صرف بات چیت کی اجازت ملتی ہے۔ معلومات کسی دوسرے ادارے کو شیئر نہیں ہوتیں۔")}</p>}<Choice name={question.id} checked={form[question.key]} label={copy(language, "Yes, I agree", "ہاں، میں رضامند ہوں")} onChange={() => { update(question.key, true); setQuestionError(""); }} />{question.key !== "serviceConsent" && <Choice name={question.id} checked={!form[question.key]} label={copy(language, "No", "نہیں")} onChange={() => { update(question.key, false); setQuestionError(""); }} />}{question.key === "serviceConsent" && <button type="button" className="mt-3 min-h-11 text-sm font-semibold text-[var(--ink-700)] underline" onClick={onDecline}>{copy(language, "I do not consent", "میں رضامند نہیں")}</button>}</div>}
      {question.kind === "text" && <div className="mt-7"><label htmlFor={`mobile-${question.id}`} className="sr-only">{copy(language, question.en, question.ur)}</label>{question.key === "notes" ? <textarea id={`mobile-${question.id}`} className="field min-h-[140px] text-base" rows={5} maxLength={2000} value={form.notes} onChange={event => { update("notes", event.target.value); setQuestionError(""); }} placeholder={copy(language, "Record only what a reviewer needs to know", "صرف جائزہ لینے والے کے لیے ضروری بات درج کریں")} /> : <input id={`mobile-${question.id}`} className="field h-14 text-base" type={question.inputMode === "tel" ? "tel" : "text"} inputMode={question.inputMode} autoComplete={question.key === "fullName" ? "name" : question.key === "primaryPhone" ? "tel" : "off"} value={form[question.key]} onChange={event => { update(question.key, event.target.value); setQuestionError(""); }} />}{question.optional && <p className="field-help">{copy(language, "Optional — leave blank if unknown.", "اختیاری — معلوم نہ ہو تو خالی چھوڑ دیں۔")}</p>}{question.key === "primaryPhone" && <p className="field-help">{copy(language, "Use only a number that is safe for us to contact you.", "صرف وہ نمبر دیں جس پر آپ سے رابطہ کرنا محفوظ ہو۔")}</p>}</div>}
      {question.kind === "single" && <fieldset aria-labelledby="mobile-question-title" className="mt-7 space-y-2">{question.options.map(([value, en, ur]) => <Choice key={value} name={question.id} checked={form[question.key] === value} label={copy(language, en, ur)} onChange={() => { update(question.key, value as IntakeAnswers[typeof question.key]); setQuestionError(""); }} />)}{question.optional && <p className="field-help">{copy(language, "Optional — continue if not known.", "اختیاری — معلوم نہ ہو تو آگے بڑھیں۔")}</p>}{question.key === "recruitmentChannel" && <p className="field-help">{copy(language, "Selecting an OEP here does not verify its registration. Check official BEOE records before relying on a recruitment offer.", "یہاں او ای پی منتخب کرنے سے اس کی رجسٹریشن کی تصدیق نہیں ہوتی۔ بھرتی کی پیشکش پر بھروسا کرنے سے پہلے بیورو آف امیگریشن اینڈ اوورسیز ایمپلائمنٹ (بی ای او ای) کے سرکاری ریکارڈ سے جانچ کریں۔")}</p>}</fieldset>}
      {question.kind === "readiness" && <fieldset aria-labelledby="mobile-question-title" className="mt-7 space-y-2"><p className="mb-4 text-sm leading-7 text-[var(--ink-700)]">{copy(language, "Requirements vary by destination and work. Choose Not applicable or Not sure if needed.", "ضروریات منزل کے ملک اور کام کے مطابق مختلف ہوتی ہیں۔ ضرورت ہو تو لاگو نہیں یا معلوم نہیں منتخب کریں۔")}</p>{readinessStatuses.map(([value, en, ur]) => <Choice key={value} name={question.id} checked={form.readiness[question.key] === value} label={copy(language, en, ur)} onChange={() => { update("readiness", { ...form.readiness, [question.key]: value as ReadinessStatus }); setQuestionError(""); }} />)}</fieldset>}
      {question.kind === "safety" && <fieldset aria-labelledby="mobile-question-title" className="mt-7 space-y-2">{yesNoOptions.map(([value, en, ur]) => <Choice key={value} name={question.id} checked={form.safetyAnswers[question.key] === value} label={copy(language, en, ur)} onChange={() => { selectSafety(question.key, value); setQuestionError(""); }} />)}{question.key === "AT-007" && form.safetyAnswers[question.key] === "yes" && <div className="mt-5 rounded-[12px] border border-[var(--red-700)] bg-[var(--red-100)] p-4 text-sm leading-7 text-[var(--red-700)]">{copy(language, "If anyone is in immediate danger, contact local emergency services or a trusted support organization now. This form is not an emergency service.", "اگر کسی کو فوری خطرہ ہے تو ابھی مقامی ہنگامی خدمات یا کسی قابلِ اعتماد امدادی ادارے سے رابطہ کریں۔ یہ فارم ہنگامی خدمت نہیں ہے۔")}</div>}{!publicMode && question.key === "AT-007" && form.safetyAnswers[question.key] === "yes" && <label className="mt-4 flex min-h-14 items-start gap-3 rounded-[12px] border border-[var(--line)] p-4 text-sm leading-6"><input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-[var(--teal-700)]" checked={emergencyAcknowledged} onChange={event => { setEmergencyAcknowledged(event.target.checked); setQuestionError(""); }} /><span>{copy(language, "I contacted the safeguarding lead through the approved emergency channel.", "میں نے منظور شدہ ہنگامی ذریعے سے حفاظتی ذمہ دار سے رابطہ کیا ہے۔")}</span></label>}</fieldset>}
      {question.kind === "support" && <fieldset aria-labelledby="mobile-question-title" className="mt-7 space-y-2">{supportOptions.map(([value, en, ur]) => <Choice key={value} multi checked={form.supportNeeded.includes(value)} label={copy(language, en, ur)} onChange={() => { update("supportNeeded", form.supportNeeded.includes(value) ? form.supportNeeded.filter(item => item !== value) : [...form.supportNeeded, value]); setQuestionError(""); }} />)}<p className="field-help">{copy(language, "Choose all that apply, or continue if none.", "جو لاگو ہوں منتخب کریں، یا کوئی نہ ہو تو آگے بڑھیں۔")}</p></fieldset>}
      {question.kind === "review" && <div className="mt-7 space-y-4"><ReviewBlock title={copy(language, "Your name", "آپ کا نام")} value={form.fullName || "—"} onEdit={() => move(questions.findIndex(item => item.id === "full-name"))} language={language} /><ReviewBlock title={copy(language, "Migration stage", "ہجرت کا مرحلہ")} value={[localizedChoice(form.migrationStage, stageOptions, language), form.destinationCountry].filter(Boolean).join(" · ")} onEdit={() => move(questions.findIndex(item => item.id === "stage"))} language={language} /><ReviewBlock title={copy(language, "Preparation checklist", "تیاری کی چیک لسٹ")} value={copy(language, `${Object.keys(form.readiness).length} items answered`, `${Object.keys(form.readiness).length} جوابات`)} onEdit={() => move(questions.findIndex(item => item.id.startsWith("readiness-")))} language={language} /><ReviewBlock title={copy(language, "Safety concerns", "حفاظتی خدشات")} value={form.attentionSignalCodes.length ? copy(language, `${form.attentionSignalCodes.length} reported`, `${form.attentionSignalCodes.length} درج`) : copy(language, "None reported", "کوئی اطلاع نہیں")} onEdit={() => move(questions.findIndex(item => item.id.startsWith("safety-")))} language={language} /><ReviewBlock title={copy(language, "Support", "مدد")} value={form.supportNeeded.map(value => localizedChoice(value, supportOptions, language)).join(", ") || "—"} onEdit={() => move(questions.findIndex(item => item.id === "support"))} language={language} /><label className="mt-6 flex min-h-14 items-start gap-3 rounded-[12px] border border-[var(--line)] p-4 text-sm leading-7"><input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-[var(--teal-700)]" checked={attested} onChange={event => setAttested(event.target.checked)} /><span>{copy(language, "I have checked my answers and understand they will be reviewed by staff.", "میں نے اپنے جوابات چیک کر لیے ہیں اور سمجھتا/سمجھتی ہوں کہ عملہ ان کا جائزہ لے گا۔")}</span></label></div>}
    </div>
    <div className="mobile-intake__footer"><button type="button" className="mobile-intake__back" onClick={() => move(currentIndex - 1)} disabled={currentIndex === 0} aria-label={copy(language, "Previous question", "پچھلا سوال")}><ArrowLeft size={20} className="rtl:rotate-180" /></button><button type="button" className="btn-primary mobile-intake__next" onClick={() => void continueFlow()} disabled={saveState === "saving"}>{question.kind === "review" ? copy(language, "Submit form", "فارم جمع کریں") : copy(language, "Continue", "آگے بڑھیں")}{question.kind === "review" ? <Check size={18} /> : <ArrowRight size={18} className="rtl:rotate-180" />}</button></div>
  </div>;
}

function Choice({ checked, label, onChange, multi = false, name }: { checked: boolean; label: string; onChange: () => void; multi?: boolean; name?: string }) { return <label className={`mobile-choice ${checked ? "mobile-choice--selected" : ""}`}><span className="flex-1">{label}</span><input className="mobile-choice__input" type={multi ? "checkbox" : "radio"} checked={checked} onChange={onChange} name={name} /></label>; }
function ReviewBlock({ title, value, onEdit, language }: { title: string; value: string; onEdit: () => void; language: Language }) { return <div className="rounded-[12px] border border-[var(--line)] bg-white p-4"><div className="flex items-center justify-between gap-3"><span className="text-xs font-semibold text-[var(--ink-700)]">{title}</span><button type="button" className="min-h-11 text-xs font-semibold text-[var(--teal-700)]" onClick={onEdit}>{copy(language, "Edit", "ترمیم")}</button></div><p className="mt-1 text-sm font-semibold text-[var(--ink-950)]">{value}</p></div>; }
