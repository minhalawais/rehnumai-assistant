"use client";

import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { copy, useLocale } from "@/components/locale";
import { apiWrite } from "@/lib/client-api";
import {
  bankAccountModeOptions,
  bankRelationOptions,
  currentStatusOptions,
  genderOptions,
  initialIntake as initial,
  intakeSteps as stepNames,
  localizedChoice,
  localizedMigrantCategory,
  maritalStatusOptions,
  migrantCategoryOptions,
  qualificationOptions,
  reasonForReturningOptions,
  religionOptions,
  type IntakeAnswers as Answers,
} from "@/lib/intake-ui";
import { markPublicIntakeSubmitted } from "@/lib/public-intake-storage";
import { MobileIntake } from "@/components/mobile-intake";

export type PublicIntakeFormProps = {
  surface: "page" | "modal";
  onSubmitted?: (reference: string) => void;
  onDeclined?: () => void;
  onDismiss?: () => void;
};

const LAST_STEP = stepNames.length - 1;

export function PublicIntakeForm({ surface, onSubmitted, onDismiss }: PublicIntakeFormProps) {
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

  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);

  function update<K extends keyof Answers>(key: K, value: Answers[K]) {
    setForm(current => ({ ...current, [key]: value }));
    setSaveState("dirty");
    setError("");
  }

  function payload() {
    return { ...form, language, primaryPhone: form.primaryPhone.trim() };
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
      if (!requestKey.current) requestKey.current = crypto.randomUUID();
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
      onSubmitted?.(ref);
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
    setError("");
    setStep(current => Math.min(current + 1, LAST_STEP));
    if (!modalOnly) window.scrollTo({ top: 0, behavior: "smooth" });
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
        <div className="mt-6 flex flex-wrap gap-2">
          {modalOnly ? (
            <button type="button" className="btn-primary" onClick={onDismiss}>{copy(language, "Back to booklet", "کتابچہ پر واپس جائیں")}</button>
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
      <MobileIntake form={form} update={update} language={language} canWriteRestricted={false} publicMode saveState={saveState} error={error} correctionReason="" attested={attested} setAttested={setAttested} onSave={save} onExit={() => undefined} />
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
              <RadioField label={copy(language, "Which group are you in?", "آپ کس گروپ میں آتے ہیں؟")} value={form.migrantCategory} onChange={value => update("migrantCategory", value as Answers["migrantCategory"])} options={migrantCategoryOptions} language={language} required />
            )}
            {step === 1 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField label={copy(language, "1. Full name", "1. پورا نام")} value={form.fullName} onChange={value => update("fullName", value)} required />
                <TextField label={copy(language, "1a. Mobile number", "1a. موبائل نمبر")} value={form.primaryPhone} onChange={value => update("primaryPhone", value)} type="tel" required />
                <TextField label={copy(language, "1b. Email", "1b. ای میل")} value={form.email} onChange={value => update("email", value)} type="email" />
                <TextField label={copy(language, "1c. City", "1c. شہر")} value={form.city} onChange={value => update("city", value)} />
                <TextField label={copy(language, "1d. Home address", "1d. گھر کا پتہ")} value={form.address} onChange={value => update("address", value)} className="sm:col-span-2" />
              </div>
            )}
            {step === 2 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField label={copy(language, "2. Father or husband name", "2. والد یا شوہر کا نام")} value={form.fatherHusbandName} onChange={value => update("fatherHusbandName", value)} />
                <SelectField label={copy(language, "3. Gender", "3. جنس")} value={form.gender} onChange={value => update("gender", value)} options={genderOptions} language={language} />
                <SelectField label={copy(language, "4. Marital status", "4. شادی شدہ ہیں یا نہیں؟")} value={form.maritalStatus} onChange={value => update("maritalStatus", value)} options={maritalStatusOptions} language={language} />
                <SelectField label={copy(language, "5. Religion", "5. مذہب")} value={form.religion} onChange={value => update("religion", value)} options={religionOptions} language={language} />
              </div>
            )}
            {step === 3 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField label={copy(language, "6. CNIC number", "6. شناختی کارڈ نمبر")} value={form.cnic} onChange={value => update("cnic", value)} />
                <TextField label={copy(language, "7. Passport no.", "7. پاسپورٹ نمبر")} value={form.passportNo} onChange={value => update("passportNo", value)} />
                <TextField label={copy(language, "8. Second passport number (if any)", "8. دوسرا پاسپورٹ نمبر (اگر ہو)")} value={form.passportNoAlt} onChange={value => update("passportNoAlt", value)} />
              </div>
            )}
            {step === 4 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField label={copy(language, "9. Education", "9. تعلیم")} value={form.qualification} onChange={value => update("qualification", value)} options={qualificationOptions} language={language} />
                <TextField label={copy(language, "10. Trade or skill", "10. پیشہ یا ہنر")} value={form.tradeSkill} onChange={value => update("tradeSkill", value)} />
              </div>
            )}
            {step === 5 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField label={copy(language, "11. Country you returned from", "11. کس ملک سے واپس آئے؟")} value={form.countryReturnFrom} onChange={value => update("countryReturnFrom", value)} />
                <SelectField label={copy(language, "12. Reason for return", "12. واپسی کی وجہ")} value={form.reasonForReturning} onChange={value => update("reasonForReturning", value)} options={reasonForReturningOptions} language={language} />
                <TextField label={copy(language, "13. Date of return", "13. واپسی کی تاریخ")} value={form.dateOfReturn} onChange={value => update("dateOfReturn", value)} type="date" />
                <SelectField label={copy(language, "14. What are you doing now?", "14. ابھی آپ کیا کر رہے ہیں؟")} value={form.currentStatus} onChange={value => update("currentStatus", value)} options={currentStatusOptions} language={language} />
              </div>
            )}
            {step === 6 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField label={copy(language, "Do you have your own bank account?", "کیا آپ کا اپنا بینک اکاؤنٹ ہے؟")} value={form.bankAccountMode} onChange={value => update("bankAccountMode", value)} options={bankAccountModeOptions} language={language} />
                <SelectField label={copy(language, "Relation to account holder", "اکاؤنٹ کس کا ہے — آپ کا ان سے کیا رشتہ ہے؟")} value={form.bankRelation} onChange={value => update("bankRelation", value)} options={bankRelationOptions} language={language} />
                <TextField label={copy(language, "Bank name", "بینک کا نام")} value={form.bankName} onChange={value => update("bankName", value)} />
                <TextField label={copy(language, "Name on account", "اکاؤنٹ پر لکھا نام")} value={form.accountTitle} onChange={value => update("accountTitle", value)} />
                <TextField label={copy(language, "IBAN (24 digits)", "آئی بین نمبر (24 ہندسے)")} value={form.iban} onChange={value => update("iban", value)} className="sm:col-span-2" />
              </div>
            )}
            {step === 7 && (
              <div className="space-y-5">
                <p className="text-sm text-[var(--ink-700)]">{copy(language, "Check your answers before submitting.", "جمع کرنے سے پہلے جوابات ایک بار پڑھ لیں۔")}</p>
                <ReviewGroup title={copy(language, "Your group", "آپ کا گروپ")} onEdit={() => setStep(0)} editLabel={copy(language, "Edit", "بدلیں")} rows={[[copy(language, "Group", "گروپ"), localizedMigrantCategory(form.migrantCategory, language)]]} />
                <ReviewGroup title={copy(language, "Contact", "رابطہ")} onEdit={() => setStep(1)} editLabel={copy(language, "Edit", "بدلیں")} rows={[[copy(language, "Name", "نام"), form.fullName], [copy(language, "Mobile", "موبائل"), form.primaryPhone], [copy(language, "Email", "ای میل"), form.email || "—"]]} />
                <ReviewGroup title={copy(language, "Personal", "ذاتی معلومات")} onEdit={() => setStep(2)} editLabel={copy(language, "Edit", "بدلیں")} rows={[[copy(language, "Gender", "جنس"), localizedChoice(form.gender, genderOptions, language)], [copy(language, "CNIC", "شناختی کارڈ"), form.cnic || "—"]]} />
                <ReviewGroup title={copy(language, "Abroad / return", "بیرون ملک / واپسی")} onEdit={() => setStep(5)} editLabel={copy(language, "Edit", "بدلیں")} rows={[[copy(language, "Country", "ملک"), form.countryReturnFrom || "—"], [copy(language, "Reason", "وجہ"), localizedChoice(form.reasonForReturning, reasonForReturningOptions, language)]]} />
                <CheckField checked={attested} onChange={setAttested} label={copy(language, "I have checked my answers and understand they will be reviewed by staff.", "میرے لکھے ہوئے جوابات درست ہیں اور میں جانتا/جانتی ہوں کہ ٹیم انہیں دیکھے گی۔")} />
              </div>
            )}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-5">
            <div className="flex gap-2">
              <button type="button" className="btn-quiet" disabled={step === 0} onClick={() => { setStep(current => current - 1); setError(""); }}>
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

function ReviewGroup({ title, rows, onEdit, editLabel }: { title: string; rows: string[][]; onEdit: () => void; editLabel: string }) {
  return (
    <section className="rounded-[10px] border border-[var(--line)]">
      <div className="flex items-center justify-between border-b border-[var(--line)] px-3 py-2 sm:px-4">
        <h3 className="text-sm font-semibold">{title}</h3>
        <button type="button" className="text-xs font-semibold text-[var(--teal-700)] underline" onClick={onEdit}>{editLabel}</button>
      </div>
      <dl className="divide-y divide-[var(--line)]">
        {rows.map(([key, value]) => (
          <div key={key} className="grid gap-1 px-3 py-2 sm:grid-cols-[160px_1fr] sm:px-4 sm:py-3">
            <dt className="text-xs text-[var(--ink-700)] sm:text-sm">{key}</dt>
            <dd className="text-sm font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
