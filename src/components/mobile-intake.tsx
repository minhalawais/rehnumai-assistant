"use client";

import { ArrowLeft, ArrowRight, Check, Save } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { copy, type Language } from "@/components/locale";
import { IntakeReviewSummary } from "@/components/intake-review-summary";
import { buildKoboIntakeQuestions, type KoboQuestionDef } from "@/lib/kobo-intake-questions";
import { intakeSteps, type IntakeAnswers } from "@/lib/intake-ui";

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
  onExit: () => void;
  publicMode?: boolean;
};

export function MobileIntake({ form, update, language, saveState, error, correctionReason, attested, setAttested, onSave, onExit, publicMode = false }: Props) {
  const [index, setIndex] = useState(0);
  const [questionError, setQuestionError] = useState("");
  const titleRef = useRef<HTMLHeadingElement>(null);
  const pendingQuestionId = useRef<string | undefined>(undefined);

  const questions = useMemo(() => buildKoboIntakeQuestions(form), [form]);
  const currentIndex = Math.min(index, Math.max(0, questions.length - 1));
  const question = questions[currentIndex] ?? questions[0];

  useEffect(() => {
    if (pendingQuestionId.current === undefined) pendingQuestionId.current = new URLSearchParams(window.location.search).get("question") ?? "";
    const found = questions.findIndex(item => item.id === pendingQuestionId.current);
    if (found >= 0) {
      pendingQuestionId.current = "";
      queueMicrotask(() => setIndex(found));
    }
  }, [questions]);

  useEffect(() => {
    if (pendingQuestionId.current) return;
    if (!question) return;
    const url = new URL(window.location.href);
    url.searchParams.set("question", question.id);
    window.history.replaceState(null, "", `${url.pathname}${url.search}`);
    titleRef.current?.focus();
  }, [question]);

  function move(next: number) {
    setQuestionError("");
    setIndex(Math.max(0, Math.min(next, questions.length - 1)));
    window.scrollTo({ top: 0, behavior: "instant" });
  }

  function hasAnswer(item: KoboQuestionDef) {
    if (item.kind === "text") {
      if (item.key === "primaryPhone") return form.primaryPhone.replace(/\D/g, "").length >= 7;
      return item.optional || Boolean(String(form[item.key]).trim());
    }
    if (item.kind === "single") return item.optional || Boolean(form[item.key]);
    return true;
  }

  async function continueFlow() {
    if (!question) return;
    if (!hasAnswer(question)) {
      setQuestionError(copy(language, "Answer this question to continue.", "آگے جانے کے لیے اس کا جواب دیں۔"));
      return;
    }
    if (question.kind === "review") {
      const missing = questions.findIndex(item => item.kind !== "review" && !hasAnswer(item));
      if (missing >= 0) {
        move(missing);
        setQuestionError(copy(language, "Answer this question before submitting.", "جمع کرنے سے پہلے اس سوال کا جواب لازمی ہے۔"));
        return;
      }
      if (!attested) {
        setQuestionError(copy(language, "Confirm the review before submitting.", "جمع کرنے سے پہلے نیچے والا خانہ نشان لگائیں۔"));
        return;
      }
      await onSave(true);
      return;
    }
    move(currentIndex + 1);
  }

  async function saveAndExit() {
    if (await onSave(false)) onExit();
  }

  if (!question) return null;

  const section = intakeSteps[question.section];
  const progress = Math.round(((currentIndex + 1) / questions.length) * 100);

  return (
    <div className="mobile-intake lg:hidden">
      <div className="mobile-intake__top">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold text-[var(--teal-700)]">{copy(language, section[0], section[1])}</span>
          <span className="text-xs font-semibold text-[var(--ink-700)]" dir="ltr" aria-live="polite">
            {currentIndex + 1} / {questions.length}
          </span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--line)]" role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={questions.length}>
          <div className="h-full rounded-full bg-[var(--teal-700)] transition-[width]" style={{ width: `${progress}%` }} />
        </div>
        {!publicMode && (
          <div className="mt-3 flex items-center justify-between gap-3">
            <span className="text-xs text-[var(--ink-700)]" aria-live="polite">
              {saveState === "saved" ? copy(language, "Saved", "محفوظ") : saveState === "saving" ? copy(language, "Saving…", "محفوظ ہو رہا ہے…") : saveState === "dirty" ? copy(language, "Unsaved changes", "غیر محفوظ تبدیلیاں") : saveState === "error" ? copy(language, "Not saved", "محفوظ نہیں ہوا") : copy(language, "Not saved yet", "ابھی محفوظ نہیں")}
            </span>
            <button type="button" className="inline-flex min-h-11 items-center gap-2 text-xs font-semibold text-[var(--navy-900)]" onClick={() => void saveAndExit()} disabled={saveState === "saving"}>
              <Save size={16} />
              {copy(language, "Save & exit", "محفوظ کر کے جائیں")}
            </button>
          </div>
        )}
      </div>
      <div className="mobile-intake__body">
        {correctionReason && <div className="mb-5 rounded-[12px] border border-[#e4c879] bg-[var(--amber-100)] p-4 text-sm text-[var(--amber-700)]"><strong>{copy(language, "Correction requested", "اصلاح کی درخواست")}</strong><p className="mt-1">{correctionReason}</p></div>}
        <h2 ref={titleRef} tabIndex={-1} id="mobile-question-title" className="mobile-intake__question">{copy(language, question.en, question.ur)}</h2>
        {questionError || error ? <div role="alert" className="mt-5 rounded-[10px] border border-[var(--red-700)] bg-[var(--red-100)] p-3 text-sm text-[var(--red-700)]">{questionError || error}</div> : null}
        {question.kind === "text" && (
          <div className="mt-7">
            <label htmlFor={`mobile-${question.id}`} className="sr-only">{copy(language, question.en, question.ur)}</label>
            <input id={`mobile-${question.id}`} className="field h-14 text-base" type={question.inputType ?? (question.inputMode === "tel" ? "tel" : "text")} inputMode={question.inputMode} autoComplete={question.key === "fullName" ? "name" : question.key === "primaryPhone" ? "tel" : "off"} value={String(form[question.key])} onChange={event => { update(question.key, event.target.value as IntakeAnswers[typeof question.key]); setQuestionError(""); }} />
            {question.optional && <p className="field-help">{copy(language, "Optional — leave blank if unknown.", "اختیاری — نہ معلوم ہو تو خالی چھوڑ دیں۔")}</p>}
          </div>
        )}
        {question.kind === "single" && question.options && (
          <fieldset aria-labelledby="mobile-question-title" className="mt-7 space-y-2">
            {question.options.map(([value, en, ur]) => (
              <Choice key={value} name={question.id} checked={form[question.key] === value} label={copy(language, en, ur)} onChange={() => { update(question.key, value as IntakeAnswers[typeof question.key]); setQuestionError(""); }} />
            ))}
            {question.optional && <p className="field-help">{copy(language, "Optional — continue if not known.", "اختیاری — پتہ نہ ہو تو آگے بڑھ سکتے ہیں۔")}</p>}
          </fieldset>
        )}
        {question.kind === "review" && (
          <div className="mt-7 space-y-4">
            <IntakeReviewSummary
              form={form}
              language={language}
              variant="mobile"
              onEditQuestionId={id => {
                const found = questions.findIndex(item => item.id === id);
                if (found >= 0) move(found);
              }}
            />
            <label className="mt-6 flex min-h-14 items-start gap-3 rounded-[12px] border border-[var(--line)] p-4 text-sm leading-7">
              <input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-[var(--teal-700)]" checked={attested} onChange={event => setAttested(event.target.checked)} />
              <span>{copy(language, "I have checked my answers and understand they will be reviewed by staff.", "میرے لکھے ہوئے جوابات درست ہیں اور میں جانتا/جانتی ہوں کہ ٹیم انہیں دیکھے گی۔")}</span>
            </label>
          </div>
        )}
      </div>
      <div className="mobile-intake__footer">
        <button type="button" className="mobile-intake__back" onClick={() => move(currentIndex - 1)} disabled={currentIndex === 0} aria-label={copy(language, "Previous question", "پچھلا")}><ArrowLeft size={20} className="rtl:rotate-180" /></button>
        <button type="button" className="btn-primary mobile-intake__next" onClick={() => void continueFlow()} disabled={saveState === "saving"}>
          {question.kind === "review" ? copy(language, "Submit form", "جمع کریں") : copy(language, "Continue", "آگے")}
          {question.kind === "review" ? <Check size={18} /> : <ArrowRight size={18} className="rtl:rotate-180" />}
        </button>
      </div>
    </div>
  );
}

function Choice({ checked, label, onChange, name }: { checked: boolean; label: string; onChange: () => void; name?: string }) {
  return (
    <label className={`mobile-choice ${checked ? "mobile-choice--selected" : ""}`}>
      <input className="mobile-choice__input" type="radio" checked={checked} onChange={onChange} name={name} />
      <span className="mobile-choice__label flex-1">{label}</span>
    </label>
  );
}

