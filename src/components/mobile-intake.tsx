"use client";

import { ArrowLeft, ArrowRight, Check, Save } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { copy, type Language } from "@/components/locale";
import { IntakeReviewSummary } from "@/components/intake-review-summary";
import { buildKoboIntakeQuestions, type KoboQuestionDef } from "@/lib/kobo-intake-questions";
import { intakeScreenForSection, intakeScreenSteps, type IntakeAnswers } from "@/lib/intake-ui";

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
  fillPage?: boolean;
};

export function MobileIntake({ form, update, language, saveState, error, correctionReason, attested, setAttested, onSave, onExit, publicMode = false, fillPage = false }: Props) {
  const [screenIndex, setScreenIndex] = useState(0);
  const [questionError, setQuestionError] = useState("");
  const titleRef = useRef<HTMLHeadingElement>(null);
  const pendingQuestionId = useRef<string | undefined>(undefined);

  const questions = useMemo(() => buildKoboIntakeQuestions(form), [form.migrantCategory]);
  const screens = useMemo(
    () => intakeScreenSteps.map((_, screen) => questions.filter(question => intakeScreenForSection(question.section) === screen)).filter(group => group.length > 0),
    [questions],
  );
  const currentIndex = Math.min(screenIndex, Math.max(0, screens.length - 1));
  const currentQuestions = screens[currentIndex] ?? [];
  const currentQuestionId = currentQuestions[0]?.id ?? "";

  useEffect(() => {
    if (fillPage) return;
    if (pendingQuestionId.current === undefined) pendingQuestionId.current = new URLSearchParams(window.location.search).get("question") ?? "";
    const found = screens.findIndex(group => group.some(item => item.id === pendingQuestionId.current));
    if (found >= 0) {
      pendingQuestionId.current = "";
      queueMicrotask(() => setScreenIndex(found));
    }
  }, [screens, fillPage]);

  useEffect(() => {
    if (!currentQuestionId) return;
    if (!fillPage) {
      if (pendingQuestionId.current) return;
      const url = new URL(window.location.href);
      if (url.searchParams.get("question") !== currentQuestionId) {
        url.searchParams.set("question", currentQuestionId);
        window.history.replaceState(null, "", `${url.pathname}${url.search}`);
      }
    }
    const active = document.activeElement;
    const typing = active instanceof HTMLInputElement || active instanceof HTMLTextAreaElement || active instanceof HTMLSelectElement;
    if (!typing) titleRef.current?.focus({ preventScroll: true });
  }, [currentQuestionId, fillPage]);

  function move(next: number) {
    setQuestionError("");
    setScreenIndex(Math.max(0, Math.min(next, screens.length - 1)));
    if (fillPage) titleRef.current?.parentElement?.scrollTo({ top: 0 });
    else window.scrollTo({ top: 0, behavior: "instant" });
  }

  function hasAnswer(item: KoboQuestionDef) {
    if (item.kind === "text") {
      if (item.key === "primaryPhone") return form.primaryPhone.replace(/\D/g, "").length >= 7;
      return item.optional || Boolean(String(form[item.key]).trim());
    }
    if (item.kind === "single") return item.optional || Boolean(form[item.key]);
    if (item.kind === "multi") return item.optional || form.helpTopics.length > 0;
    return true;
  }

  async function continueFlow() {
    if (!currentQuestions.length) return;
    const review = currentQuestions[0]?.kind === "review";
    const missing = currentQuestions.find(item => item.kind !== "review" && !hasAnswer(item));
    if (missing) {
      setQuestionError(copy(language, "Answer this question to continue.", "آگے جانے کے لیے اس کا جواب دیں۔"));
      return;
    }
    if (review) {
      const missing = questions.findIndex(item => item.kind !== "review" && !hasAnswer(item));
      if (missing >= 0) {
        const missingScreen = screens.findIndex(group => group.some(item => item.id === questions[missing]?.id));
        move(missingScreen);
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

  if (!currentQuestions.length) return null;

  const screen = intakeScreenSteps[currentIndex] ?? intakeScreenSteps[0];
  const review = currentQuestions[0]?.kind === "review";
  const progress = Math.round(((currentIndex + 1) / screens.length) * 100);

  return (
    <div className={fillPage ? "mobile-intake mobile-intake--page" : "mobile-intake lg:hidden"}>
      <div className="mobile-intake__top">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-bold text-[var(--teal-700)]">{copy(language, screen.en, screen.ur)}</span>
          <span className="text-xs font-semibold text-[var(--ink-700)]" dir="ltr" aria-live="polite">
            {currentIndex + 1} / {screens.length}
          </span>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-[var(--line)]" role="progressbar" aria-valuenow={currentIndex + 1} aria-valuemin={1} aria-valuemax={screens.length}>
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
        <h2 ref={titleRef} tabIndex={-1} id="mobile-question-title" className="mobile-intake__question">{copy(language, screen.en, screen.ur)}</h2>
        {questionError || error ? <div role="alert" className="mt-5 rounded-[10px] border border-[var(--red-700)] bg-[var(--red-100)] p-3 text-sm text-[var(--red-700)]">{questionError || error}</div> : null}
        {!review && <div className="mt-7 space-y-7">{currentQuestions.map(question => <QuestionField key={question.id} question={question} form={form} language={language} update={update} setQuestionError={setQuestionError} />)}</div>}
        {review && (
          <div className="mt-7 space-y-4">
            <IntakeReviewSummary
              form={form}
              language={language}
              variant="mobile"
              onEditQuestionId={id => {
                const found = screens.findIndex(group => group.some(item => item.id === id));
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
          {review ? copy(language, "Submit form", "جمع کریں") : copy(language, "Continue", "آگے")}
          {review ? <Check size={18} /> : <ArrowRight size={18} className="rtl:rotate-180" />}
        </button>
      </div>
    </div>
  );
}

function QuestionField({ question, form, language, update, setQuestionError }: { question: KoboQuestionDef; form: IntakeAnswers; language: Language; update: Props["update"]; setQuestionError: (value: string) => void }) {
  const label = copy(language, question.en, question.ur);
  const required = !question.optional;

  if (question.kind === "text") {
    return (
      <div>
        <label htmlFor={`mobile-${question.id}`} className="field-label">{label}{required ? " *" : ""}</label>
        <input id={`mobile-${question.id}`} className="field h-14 text-base" type={question.inputType ?? (question.inputMode === "tel" ? "tel" : "text")} inputMode={question.inputMode} autoComplete={question.key === "fullName" ? "name" : question.key === "primaryPhone" ? "tel" : "off"} value={String(form[question.key])} onChange={event => { update(question.key, event.target.value as IntakeAnswers[typeof question.key]); setQuestionError(""); }} />
        {question.optional && <p className="field-help">{copy(language, "Optional — leave blank if unknown.", "اختیاری — نہ معلوم ہو تو خالی چھوڑ دیں۔")}</p>}
      </div>
    );
  }

  if (question.kind === "single" && question.options) {
    return (
      <fieldset aria-labelledby="mobile-question-title" className="space-y-2">
        <legend className="field-label mb-3">{label}{required ? " *" : ""}</legend>
        {question.options.map(([value, en, ur]) => (
          <Choice key={value} name={question.id} checked={form[question.key] === value} label={copy(language, en, ur)} onChange={() => { update(question.key, value as IntakeAnswers[typeof question.key]); setQuestionError(""); }} />
        ))}
        {question.optional && <p className="field-help">{copy(language, "Optional — continue if not known.", "اختیاری — پتہ نہ ہو تو آگے بڑھ سکتے ہیں۔")}</p>}
      </fieldset>
    );
  }

  if (question.kind === "multi" && question.options) {
    return (
      <fieldset aria-labelledby="mobile-question-title" className="space-y-2">
        <legend className="field-label mb-3">{label}{required ? " *" : ""}</legend>
        <p className="field-help">{copy(language, "Choose one or more.", "ایک سے زیادہ چن سکتے ہیں۔")}</p>
        {question.options.map(([value, en, ur]) => (
          <Choice key={value} multiple checked={form.helpTopics.includes(value)} label={copy(language, en, ur)} onChange={() => { const next = form.helpTopics.includes(value) ? form.helpTopics.filter(item => item !== value) : [...form.helpTopics, value]; update("helpTopics", next); setQuestionError(""); }} />
        ))}
      </fieldset>
    );
  }

  return null;
}

function Choice({ checked, label, onChange, name, multiple = false }: { checked: boolean; label: string; onChange: () => void; name?: string; multiple?: boolean }) {
  return (
    <label className={`mobile-choice ${checked ? "mobile-choice--selected" : ""}`}>
      <input className={`mobile-choice__input${multiple ? " mobile-choice__input--check" : ""}`} type={multiple ? "checkbox" : "radio"} checked={checked} onChange={onChange} name={name} />
      <span className="mobile-choice__label flex-1">{label}</span>
    </label>
  );
}

