"use client";

import { ArrowLeft, ArrowRight, Check, Copy } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { copy, type Language, useLocale } from "@/components/locale";
import { apiWrite } from "@/lib/client-api";
import {
  currentStatusOptions,
  genderOptions,
  helpTopicOptions,
  initialIntake as initial,
  intakeSteps as stepNames,
  maritalStatusOptions,
  migrantCategoryOptions,
  qualificationOptions,
  reasonForReturningOptions,
  religionOptions,
  type IntakeAnswers as Answers,
} from "@/lib/intake-ui";
import { IntakeReviewSummary } from "@/components/intake-review-summary";
import { RETURN_BLOCK_KEYS, stripHiddenAnswers } from "@/lib/kobo-intake-rules";
import { intakeQuestionCopy } from "@/lib/intake-question-copy";
import {
  getPersistedClientRequestId,
  markPublicIntakeSubmitted,
  persistClientRequestId,
} from "@/lib/public-intake-storage";
import { MobileIntake } from "@/components/mobile-intake";

function questionLabel(language: Language, key: keyof typeof intakeQuestionCopy) {
  const q = intakeQuestionCopy[key];
  return copy(language, q.en, q.ur);
}

export type PublicIntakeFormProps = {
  surface: "page" | "modal" | "launch";
  onSubmitted?: (reference: string) => void;
  onDeclined?: () => void;
  onDismiss?: () => void;
  onProgressChange?: (state: { dirty: boolean; submitted: boolean }) => void;
  doneLabel?: { en: string; ur: string };
};

const LAST_STEP = stepNames.length - 1;

export function PublicIntakeForm({ surface, onSubmitted, onDismiss, onProgressChange, doneLabel }: PublicIntakeFormProps) {
  const { language } = useLocale();
  const [form, setForm] = useState<Answers>(initial);
  const [step, setStep] = useState(0);
  const [reference, setReference] = useState("");
  const [saveState, setSaveState] = useState<"new" | "dirty" | "saving" | "saved" | "error">("new");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [attested, setAttested] = useState(false);
  const busy = useRef(false);
  const requestKey = useRef("");
  const errorRef = useRef<HTMLDivElement>(null);
  const modalOnly = surface === "modal";
  const launch = surface === "launch";

  const [copyHint, setCopyHint] = useState("");

  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);

  useEffect(() => {
    const existing = getPersistedClientRequestId();
    if (existing) requestKey.current = existing;
    else if (!requestKey.current) {
      requestKey.current = crypto.randomUUID();
      persistClientRequestId(requestKey.current);
    }
  }, []);

  useEffect(() => {
    const dirty = saveState === "dirty" || saveState === "saving" || JSON.stringify(form) !== JSON.stringify(initial);
    onProgressChange?.({ dirty, submitted: done });
  }, [form, saveState, done, onProgressChange]);

  function update<K extends keyof Answers>(key: K, value: Answers[K]) {
    setForm(current => {
      const next = { ...current, [key]: value };
      if (key === "migrantCategory" && value === "potential_migrants") {
        for (const field of RETURN_BLOCK_KEYS) {
          next[field] = "";
        }
      }
      return next;
    });
    setSaveState("dirty");
    setError("");
  }

  function payload() {
    const answers = stripHiddenAnswers(form);
    return { ...answers, language, primaryPhone: form.primaryPhone.trim() };
  }

  async function copyReference() {
    if (!reference) return;
    try {
      await navigator.clipboard.writeText(reference);
      setCopyHint(copy(language, "Copied", "کاپی ہو گیا"));
    } catch {
      setCopyHint(copy(language, "Copy the number above", "اوپر والا نمبر خود محفوظ کریں"));
    }
  }

  async function save(submit = false) {
    if (!submit || busy.current) return false;
    if (!attested) {
      setError(copy(language, "Confirm your answers before submitting.", "جمع کرنے سے پہلے نیچے والا خانہ نشان لگائیں۔"));
      return false;
    }
    busy.current = true;
    setSaveState("saving");
    setError("");
    try {
      if (!requestKey.current) {
        requestKey.current = crypto.randomUUID();
        persistClientRequestId(requestKey.current);
      }
      const result = await apiWrite<{ caseReference: string }>("/api/public/intake", "POST", {
        clientRequestId: requestKey.current,
        confirmed: true,
        website: "",
        answers: payload(),
      });
      const ref = result.data.caseReference;
      setReference(ref);
      setSaveState("saved");
      setDone(true);
      markPublicIntakeSubmitted(ref);
      if (!modalOnly) onSubmitted?.(ref);
      return true;
    } catch (cause) {
      setSaveState("error");
      setError(cause instanceof Error ? cause.message : "Unable to submit.");
      return false;
    } finally {
      busy.current = false;
    }
  }

  function next() {
    if (step === 0 && !form.migrantCategory) {
      setError(copy(language, "Choose a group.", "پہلے بتائیں بیرون ملک جانے والے ہیں یا واپس آنے والے۔"));
      return;
    }
    if (step === 1) {
      if (!form.fullName.trim()) { setError(copy(language, "Enter your full name.", "اپنا پورا نام لکھیں۔")); return; }
      if (!form.primaryPhone.trim() || form.primaryPhone.replace(/\D/g, "").length < 7) {
        setError(copy(language, "Enter a valid mobile number.", "صحیح موبائل نمبر لکھیں۔"));
        return;
      }
    }
    if (step === 6 && form.helpTopics.length === 0) {
      setError(copy(language, "Choose at least one kind of information.", "کم از کم ایک قسم کی معلومات چنیں۔"));
      return;
    }
    setError("");
    setStep(current => {
      let n = Math.min(current + 1, LAST_STEP);
      if (form.migrantCategory === "potential_migrants" && n === 5) n = 6;
      return n;
    });
    if (surface === "page") window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function prevStep() {
    setStep(current => {
      let n = Math.max(current - 1, 0);
      if (form.migrantCategory === "potential_migrants" && n === 5) n = 4;
      return n;
    });
    setError("");
  }

  if (done) {
    return (
      <div className={`intake-receipt ${modalOnly ? "intake-receipt--modal" : ""} panel mx-auto max-w-[650px] p-6 sm:p-10`}>
        <div className="grid h-11 w-11 place-items-center rounded-full bg-[var(--teal-100)] text-[var(--teal-700)]"><Check size={22} /></div>
        <h2 className="mt-5 text-lg font-semibold text-[var(--navy-950)] sm:text-xl">
          {copy(language, "Your form has been submitted for review.", "آپ کا فارم جمع ہو گیا ہے۔ ٹیم اسے دیکھے گی۔")}
        </h2>
        <p className="mt-2 text-sm text-[var(--ink-700)]">
          {copy(language, "Reference number", "حوالہ نمبر")}: <b dir="ltr">{reference}</b>
        </p>
        <p className="mt-2 text-sm text-[var(--ink-700)]">
          {copy(language, "Keep this number for follow-up with the team.", "ٹیم سے رابطے کے لیے یہ نمبر محفوظ رکھیں۔")}
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button type="button" className="btn-secondary" onClick={() => void copyReference()}>
            <Copy size={16} aria-hidden />
            {copy(language, "Copy reference", "حوالہ کاپی کریں")}
          </button>
          {copyHint ? <span className="text-xs text-[var(--teal-700)]" role="status">{copyHint}</span> : null}
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {modalOnly || launch ? (
            <button type="button" className="btn-primary" onClick={onDismiss}>{doneLabel ? copy(language, doneLabel.en, doneLabel.ur) : copy(language, "Back to booklet", "کتابچہ پر واپس جائیں")}</button>
          ) : (
            <Link href="/" className="btn-primary">{copy(language, "Read the booklet", "کتابچہ پڑھیں")}</Link>
          )}
        </div>
      </div>
    );
  }

  const stepLabel = stepNames[step][language === "ur" ? 1 : 0];

  return (
    <>
      <MobileIntake form={form} update={update} language={language} canWriteRestricted={false} publicMode fillPage={launch} saveState={saveState} error={error} correctionReason="" attested={attested} setAttested={setAttested} onSave={save} onExit={() => undefined} />
      {!launch && (
      <div className={`desktop-intake intake-wizard ${modalOnly ? "intake-wizard--modal hidden lg:block" : ""} mx-auto max-w-[900px]`}>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs font-semibold text-[var(--teal-700)]">{copy(language, `Step ${step + 1} of ${stepNames.length}`, `مرحلہ ${step + 1} از ${stepNames.length}`)}</p>
            <h2 className="mt-1 text-xl font-semibold text-[var(--navy-950)] sm:text-2xl">{stepLabel}</h2>
          </div>
        </div>
        <div className="mb-4 flex gap-1" aria-label={copy(language, "Intake progress", "فارم کی پیش رفت")}>
          {stepNames.map((item, index) => (
            <div key={item[0]} className={`h-1 flex-1 rounded-full ${index <= step ? "bg-[var(--teal-700)]" : "bg-[var(--line)]"}`} />
          ))}
        </div>
        <section className={`intake-wizard__panel panel ${modalOnly ? "p-4 sm:p-5" : "p-5 sm:p-8"}`}>
          <div className="max-w-[740px]">
            {error && <div ref={errorRef} tabIndex={-1} role="alert" className="mb-5 rounded-[10px] border border-[var(--red-700)] bg-[var(--red-100)] p-3 text-sm text-[var(--red-700)]">{error}</div>}
            {step === 0 && (
              <RadioField label={questionLabel(language, "migrantCategory")} value={form.migrantCategory} onChange={value => update("migrantCategory", value as Answers["migrantCategory"])} options={migrantCategoryOptions} language={language} required />
            )}
            {step === 1 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField label={questionLabel(language, "fullName")} value={form.fullName} onChange={value => update("fullName", value)} required />
                <TextField label={questionLabel(language, "primaryPhone")} value={form.primaryPhone} onChange={value => update("primaryPhone", value)} type="tel" required />
                <TextField label={questionLabel(language, "email")} value={form.email} onChange={value => update("email", value)} type="email" />
                <TextField label={questionLabel(language, "city")} value={form.city} onChange={value => update("city", value)} />
                <TextField label={questionLabel(language, "address")} value={form.address} onChange={value => update("address", value)} className="sm:col-span-2" />
              </div>
            )}
            {step === 2 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField label={questionLabel(language, "fatherHusbandName")} value={form.fatherHusbandName} onChange={value => update("fatherHusbandName", value)} />
                <SelectField label={questionLabel(language, "gender")} value={form.gender} onChange={value => update("gender", value)} options={genderOptions} language={language} />
                <SelectField label={questionLabel(language, "maritalStatus")} value={form.maritalStatus} onChange={value => update("maritalStatus", value)} options={maritalStatusOptions} language={language} />
                <SelectField label={questionLabel(language, "religion")} value={form.religion} onChange={value => update("religion", value)} options={religionOptions} language={language} />
              </div>
            )}
            {step === 3 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField label={questionLabel(language, "cnic")} value={form.cnic} onChange={value => update("cnic", value)} />
                <TextField label={questionLabel(language, "passportNo")} value={form.passportNo} onChange={value => update("passportNo", value)} />
                <TextField label={questionLabel(language, "passportNoAlt")} value={form.passportNoAlt} onChange={value => update("passportNoAlt", value)} />
              </div>
            )}
            {step === 4 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField label={questionLabel(language, "qualification")} value={form.qualification} onChange={value => update("qualification", value)} options={qualificationOptions} language={language} />
                <TextField label={questionLabel(language, "tradeSkill")} value={form.tradeSkill} onChange={value => update("tradeSkill", value)} />
              </div>
            )}
            {step === 5 && (
              form.migrantCategory === "potential_migrants" ? (
                <p className="text-sm text-[var(--ink-700)]">
                  {copy(language, "This section applies to people who have returned from abroad. You can continue to the next step.", "یہ حصہ اُن لوگوں کے لیے ہے جو بیرون ملک سے واپس آئے ہیں۔ آپ اگلے مرحلے پر جا سکتے ہیں۔")}
                </p>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField label={questionLabel(language, "countryReturnFrom")} value={form.countryReturnFrom} onChange={value => update("countryReturnFrom", value)} />
                  <SelectField label={questionLabel(language, "reasonForReturning")} value={form.reasonForReturning} onChange={value => update("reasonForReturning", value)} options={reasonForReturningOptions} language={language} />
                  <TextField label={questionLabel(language, "dateOfReturn")} value={form.dateOfReturn} onChange={value => update("dateOfReturn", value)} type="date" />
                  <SelectField label={questionLabel(language, "currentStatus")} value={form.currentStatus} onChange={value => update("currentStatus", value)} options={currentStatusOptions} language={language} />
                </div>
              )
            )}
            {step === 6 && (
              <fieldset>
                <legend className="field-label mb-3">{questionLabel(language, "helpTopics")}</legend>
                <p className="field-help mb-3">{copy(language, "Choose one or more.", "ایک سے زیادہ چن سکتے ہیں۔")}</p>
                <div className="space-y-2">
                  {helpTopicOptions.map(([key, en, ur]) => (
                    <label key={key} className={`flex min-h-10 cursor-pointer items-center gap-3 rounded-[9px] border px-3 text-sm ${form.helpTopics.includes(key) ? "border-[var(--teal-700)] bg-[var(--teal-100)]" : "border-[var(--line)] bg-white"}`}>
                      <input
                        type="checkbox"
                        className="accent-[var(--teal-700)]"
                        checked={form.helpTopics.includes(key)}
                        onChange={() => {
                          const next = form.helpTopics.includes(key) ? form.helpTopics.filter(item => item !== key) : [...form.helpTopics, key];
                          update("helpTopics", next);
                        }}
                      />
                      {copy(language, en, ur)}
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
            {step === 7 && (
              <div className="space-y-5">
                <p className="text-sm text-[var(--ink-700)]">{questionLabel(language, "review")}</p>
                <IntakeReviewSummary form={form} language={language} variant="desktop" onEditStep={setStep} />
                <CheckField checked={attested} onChange={setAttested} label={copy(language, "I have checked my answers and understand they will be reviewed by staff.", "میرے لکھے ہوئے جوابات درست ہیں اور میں جانتا/جانتی ہوں کہ ٹیم انہیں دیکھے گی۔")} />
              </div>
            )}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-5">
            <div className="flex gap-2">
              <button type="button" className="btn-quiet" disabled={step === 0} onClick={prevStep}>
                <ArrowLeft size={16} className="rtl:rotate-180" />
                {copy(language, "Back", "پیچھے")}
              </button>
              {step < LAST_STEP ? (
                <button type="button" className="btn-primary" onClick={next}>
                  {copy(language, "Continue", "آگے")}
                  <ArrowRight size={16} className="rtl:rotate-180" />
                </button>
              ) : (
                <button type="button" className="btn-primary" disabled={saveState === "saving"} onClick={() => {
                  if (!attested) { setError(copy(language, "Confirm your answers before submitting.", "جمع کرنے سے پہلے نیچے والا خانہ نشان لگائیں۔")); return; }
                  void save(true);
                }}>
                  {copy(language, "Submit form", "جمع کریں")}
                </button>
              )}
            </div>
          </div>
        </section>
      </div>
      )}
    </>
  );
}

function CheckField({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) {
  return (
    <label className="flex min-h-10 cursor-pointer items-start gap-3 text-sm leading-7">
      <input type="checkbox" className="mt-1 h-5 w-5 shrink-0 accent-[var(--teal-700)]" checked={checked} onChange={event => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

function TextField({ label, value, onChange, required, type = "text", className }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; type?: string; className?: string }) {
  const id = useId();
  return (
    <div className={className}>
      <label htmlFor={id} className="field-label">{label}{required ? " *" : ""}</label>
      <input id={id} className="field" value={value} onChange={event => onChange(event.target.value)} required={required} type={type} />
    </div>
  );
}

function SelectField({ label, value, onChange, options, language }: { label: string; value: string; onChange: (value: string) => void; options: readonly (readonly [string, string, string])[]; language: "ur" | "en" }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="field-label">{label}</label>
      <select id={id} className="field" value={value} onChange={event => onChange(event.target.value)}>
        <option value="">{copy(language, "Select an option", "منتخب کریں")}</option>
        {options.map(([key, en, ur]) => <option key={key} value={key}>{copy(language, en, ur)}</option>)}
      </select>
    </div>
  );
}

function RadioField({ label, value, onChange, options, language, required }: { label: string; value: string; onChange: (value: string) => void; options: readonly (readonly [string, string, string])[]; language: "ur" | "en"; required?: boolean }) {
  return (
    <fieldset>
      <legend className="field-label mb-3">{label}{required ? " *" : ""}</legend>
      <div className="space-y-2">
        {options.map(([key, en, ur]) => (
          <label key={key} className={`flex min-h-10 cursor-pointer items-center gap-3 rounded-[9px] border px-3 text-sm ${value === key ? "border-[var(--teal-700)] bg-[var(--teal-100)]" : "border-[var(--line)] bg-white"}`}>
            <input type="radio" className="accent-[var(--teal-700)]" checked={value === key} onChange={() => onChange(key)} name="migrant-category" />
            {copy(language, en, ur)}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

