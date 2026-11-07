"use client";

import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { copy, useLocale } from "@/components/locale";
import { apiWrite } from "@/lib/client-api";
import {
  ageBandOptions,
  contactMethodOptions,
  employmentReadinessKeys,
  initialIntake as initial,
  intakeSteps as stepNames,
  localizedChoice,
  purposeOptions,
  readinessItems,
  readinessStatuses,
  recruitmentOptions,
  safetyQuestions,
  safetySignals as signals,
  stageOptions,
  supportOptions,
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

export function PublicIntakeForm({ surface, onSubmitted, onDeclined, onDismiss }: PublicIntakeFormProps) {
  const { language } = useLocale();
  const [form, setForm] = useState<Answers>(initial);
  const [step, setStep] = useState(0);
  const [reference, setReference] = useState("");
  const [saveState, setSaveState] = useState<"new" | "dirty" | "saving" | "saved" | "error">("new");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [declined, setDeclined] = useState(false);
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

  function toggleArray(key: "attentionSignalCodes" | "supportNeeded", value: string) {
    update(key, form[key].includes(value) ? form[key].filter(item => item !== value) : [...form[key], value]);
  }

  function payload() {
    const answers: Record<string, unknown> = {
      ...form,
      language,
      primaryPhone: form.primaryPhone.trim(),
      safeContactMethod: form.contactConsent ? form.safeContactMethod : "none",
    };
    delete answers.notes;
    delete answers.attentionSignalCodes;
    return answers;
  }

  async function save(submit = false) {
    if (!submit || busy.current) return false;
    if (!form.serviceConsent || !attested) {
      setError(copy(language, "Confirm consent and review before submitting.", "جمع کرانے سے پہلے رضامندی اور جوابات کی تصدیق کریں۔"));
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
    if (step === 0 && !form.serviceConsent) {
      setError(copy(language, "Confirm service consent to continue.", "آگے بڑھنے کے لیے خدمت کی رضامندی کی تصدیق کریں۔"));
      return;
    }
    if (step === 1 && !form.fullName.trim()) {
      setError(copy(language, "Enter the applicant’s name.", "درخواست گزار کا نام درج کریں۔"));
      return;
    }
    if (step === 1 && !form.primaryPhone.trim()) {
      setError(copy(language, "Enter your mobile number.", "اپنا موبائل نمبر درج کریں۔"));
      return;
    }
    if (step === 1 && form.primaryPhone.replace(/\D/g, "").length < 7) {
      setError(copy(language, "Enter a valid mobile number.", "درست موبائل نمبر درج کریں۔"));
      return;
    }
    if (step === 2 && (!form.migrationStage || !form.migrationPurpose)) {
      setError(copy(language, "Choose the migration stage and purpose.", "سفر کا مرحلہ اور مقصد منتخب کریں۔"));
      return;
    }
    if (
      step === 3
      && readinessItems
        .filter(item => form.migrationPurpose === "employment" || !employmentReadinessKeys.has(item[0]))
        .some(item => !form.readiness[item[0]])
    ) {
      setError(copy(language, "Choose a status for every applicable readiness item.", "تیاری کی ہر متعلقہ چیز کی حیثیت منتخب کریں۔"));
      return;
    }
    if (step === 4 && signals.some(([code]) => !form.safetyAnswers[code])) {
      setError(copy(language, "Answer every safety question, or choose prefer not to say.", "تحفظ کا ہر سوال جواب دیں یا بتانا نہیں چاہتے منتخب کریں۔"));
      return;
    }
    setError("");
    setStep(current => Math.min(current + 1, 5));
    if (!modalOnly) window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleDecline() {
    setDeclined(true);
    onDeclined?.();
  }

  if (done) {
    return (
      <div className={`intake-receipt ${modalOnly ? "intake-receipt--modal" : ""} panel mx-auto max-w-[650px] p-6 sm:p-10`}>
        <div className="grid h-11 w-11 place-items-center rounded-full bg-[var(--teal-100)] text-[var(--teal-700)]"><Check size={22} /></div>
        <h2 className="mt-5 text-lg font-semibold text-[var(--navy-950)] sm:text-xl">
          {copy(language, "Your form has been submitted for review.", "آپ کا فارم جائزے کے لیے جمع ہو گیا ہے۔")}
        </h2>
        <p className="mt-2 text-sm text-[var(--ink-700)]">
          {copy(language, "Reference number", "حوالہ نمبر")}: <b dir="ltr">{reference}</b>
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {modalOnly ? (
            <button type="button" className="btn-primary" onClick={onDismiss}>{copy(language, "Continue reading", "پڑھنا جاری رکھیں")}</button>
          ) : (
            <>
              <Link href="/" className="btn-primary">{copy(language, "Continue reading", "پڑھنا جاری رکھیں")}</Link>
            </>
          )}
        </div>
      </div>
    );
  }

  if (declined) {
    return (
      <div className={`intake-declined ${modalOnly ? "intake-declined--modal" : ""} panel max-w-2xl p-6 sm:p-8`}>
        <p className="text-sm leading-7 text-[var(--ink-700)]">
          {copy(
            language,
            "Do not enter personal information. Continue with the Migration Booklet or ask trained staff about other approved support routes.",
            "ذاتی معلومات درج نہ کریں۔ مائیگریشن کتابچہ پڑھنا جاری رکھیں یا تربیت یافتہ عملے سے مدد کے دیگر منظور شدہ طریقوں کے بارے میں پوچھیں۔",
          )}
        </p>
        {modalOnly ? (
          <button type="button" className="btn-primary mt-5" onClick={onDismiss}>{copy(language, "Continue reading", "پڑھنا جاری رکھیں")}</button>
        ) : (
          <Link href="/" className="btn-primary mt-5">{copy(language, "Continue reading", "پڑھنا جاری رکھیں")}</Link>
        )}
      </div>
    );
  }

  const stepLabel = stepNames[step][language === "ur" ? 1 : 0];

  return (
    <>
      {!modalOnly && (
        <MobileIntake
          form={form}
          update={update}
          language={language}
          canWriteRestricted={false}
          publicMode
          saveState={saveState}
          error={error}
          correctionReason=""
          attested={attested}
          setAttested={setAttested}
          onSave={save}
          onDecline={handleDecline}
          onExit={() => undefined}
        />
      )}
      <div className={`desktop-intake intake-wizard ${modalOnly ? "intake-wizard--modal" : ""} mx-auto max-w-[900px]`}>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-xs font-semibold text-[var(--teal-700)]">{copy(language, `Step ${step + 1} of 6`, `مرحلہ ${step + 1} از 6`)}</p>
            <h2 className="mt-1 text-xl font-semibold text-[var(--navy-950)] sm:text-2xl">{stepLabel}</h2>
          </div>
        </div>
        <div className="mb-4 flex gap-1" aria-label={copy(language, "Intake progress", "اندراج کی پیش رفت")}>
          {stepNames.map((item, index) => (
            <div key={item[0]} className={`h-1 flex-1 rounded-full ${index <= step ? "bg-[var(--teal-700)]" : "bg-[var(--line)]"}`} />
          ))}
        </div>
        <section className={`intake-wizard__panel panel ${modalOnly ? "p-4 sm:p-5" : "p-5 sm:p-8"}`}>
          <div className="max-w-[740px]">
            {error && (
              <div ref={errorRef} tabIndex={-1} role="alert" className="mb-5 rounded-[10px] border border-[var(--red-700)] bg-[var(--red-100)] p-3 text-sm text-[var(--red-700)]">{error}</div>
            )}
            {step === 0 && (
              <div className="space-y-5">
                <p className="text-sm leading-7 text-[var(--ink-700)]">
                  {copy(
                    language,
                    "Rehnumai records your migration preparation and support needs. Submitting this form does not guarantee a job, visa, or government approval. Read the privacy notice before continuing.",
                    "رہنمائی آپ کی سفر کی تیاری اور مدد کی ضروریات درج کرتی ہے۔ یہ فارم ملازمت، ویزا یا حکومتی منظوری کی ضمانت نہیں دیتا۔ آگے بڑھنے سے پہلے رازداری کا نوٹس پڑھیں۔",
                  )}
                </p>
                <Link href="/privacy" target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center text-sm font-semibold text-[var(--teal-700)] underline">
                  {copy(language, "Read the privacy notice", "رازداری کا نوٹس پڑھیں")}
                </Link>
                <CheckField checked={form.serviceConsent} onChange={value => update("serviceConsent", value)} label={copy(language, "I have read the privacy notice and agree to submit this form.", "میں نے رازداری کا نوٹس پڑھ لیا ہے اور یہ فارم جمع کرانے پر رضامند ہوں۔")} />
                <CheckField checked={form.contactConsent} onChange={value => update("contactConsent", value)} label={copy(language, "I agree to safe follow-up contact.", "میں محفوظ طریقے سے بعد میں رابطے پر رضامند ہوں۔")} />
                <CheckField checked={form.referralConsent} onChange={value => update("referralConsent", value)} label={copy(language, "I agree to discuss a possible referral. This does not share my information.", "میں ممکنہ حوالہ پر بات کرنے پر رضامند ہوں۔ اس سے میری معلومات شیئر نہیں ہوتیں۔")} />
                <button type="button" className="text-sm font-semibold text-[var(--ink-700)] underline" onClick={handleDecline}>{copy(language, "I do not consent", "میں رضامند نہیں")}</button>
              </div>
            )}
            {step === 1 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <TextField label={copy(language, "Full name", "مکمل نام")} value={form.fullName} onChange={value => update("fullName", value)} required />
                <TextField label={copy(language, "Mobile number", "موبائل نمبر")} value={form.primaryPhone} onChange={value => update("primaryPhone", value)} type="tel" required help={copy(language, "Enter a number we can use to reach you about this form.", "وہ نمبر درج کریں جس پر ہم آپ سے اس فارم کے بارے میں رابطہ کر سکیں۔")} />
                <SelectField label={copy(language, "Age band", "عمر کا زمرہ")} value={form.ageBand} onChange={value => update("ageBand", value)} options={ageBandOptions} language={language} />
                {form.contactConsent && (
                  <SelectField label={copy(language, "Safe contact method", "محفوظ رابطے کا طریقہ")} value={form.safeContactMethod} onChange={value => update("safeContactMethod", value as Answers["safeContactMethod"])} options={contactMethodOptions} language={language} />
                )}
              </div>
            )}
            {step === 2 && (
              <div className="grid gap-5 sm:grid-cols-2">
                <SelectField label={copy(language, "Current stage", "موجودہ مرحلہ")} value={form.migrationStage} onChange={value => update("migrationStage", value)} options={stageOptions} language={language} />
                <SelectField label={copy(language, "Purpose", "مقصد")} value={form.migrationPurpose} onChange={value => update("migrationPurpose", value)} options={purposeOptions} language={language} />
                <TextField label={copy(language, "Destination country", "منزل کا ملک")} value={form.destinationCountry} onChange={value => update("destinationCountry", value)} help={copy(language, "Leave blank if undecided.", "اگر ابھی طے نہیں تو خالی چھوڑ دیں۔")} />
                <TextField label={copy(language, "Target occupation", "متوقع پیشہ")} value={form.targetOccupation} onChange={value => update("targetOccupation", value)} />
                {form.migrationPurpose === "employment" && (
                  <div className="sm:col-span-2">
                    <SelectField label={copy(language, "Recruitment route", "بھرتی کا طریقہ")} value={form.recruitmentChannel} onChange={value => update("recruitmentChannel", value)} options={recruitmentOptions} language={language} />
                    <p className="field-help">{copy(language, "Selecting an OEP here does not verify its registration. Check official BEOE records before relying on a recruitment offer.", "یہاں او ای پی منتخب کرنے سے اس کی رجسٹریشن کی تصدیق نہیں ہوتی۔ بھرتی کی پیشکش پر بھروسا کرنے سے پہلے بیورو آف امیگریشن اینڈ اوورسیز ایمپلائمنٹ (بی ای او ای) کے سرکاری ریکارڈ سے جانچ کریں۔")}</p>
                  </div>
                )}
              </div>
            )}
            {step === 3 && (
              <div className="space-y-4">
                <p className="text-sm leading-7 text-[var(--ink-700)]">
                  {copy(language, "The documents you need depend on your destination and work. Choose Not applicable or Not sure where appropriate.", "ضروری دستاویزات منزل کے ملک اور کام کے مطابق مختلف ہو سکتی ہیں۔ جہاں مناسب ہو، لاگو نہیں یا معلوم نہیں منتخب کریں۔")}
                </p>
                {readinessItems.filter(item => form.migrationPurpose === "employment" || !employmentReadinessKeys.has(item[0])).map(([key, en, ur]) => (
                  <fieldset key={key} className="border-b border-[var(--line)] pb-4 last:border-0">
                    <legend className="mb-2 text-sm font-semibold">{copy(language, en, ur)}</legend>
                    <div className="flex flex-wrap gap-2">
                      {readinessStatuses.map(([value, english, urdu]) => (
                        <label key={value} className={`inline-flex min-h-10 cursor-pointer items-center rounded-[9px] border px-3 text-xs sm:text-sm ${form.readiness[key] === value ? "border-[var(--teal-700)] bg-[var(--teal-100)] text-[var(--navy-950)]" : "border-[var(--line)] bg-white"}`}>
                          <input type="radio" name={`readiness-${key}`} className="sr-only" checked={form.readiness[key] === value} onChange={() => update("readiness", { ...form.readiness, [key]: value })} />
                          {copy(language, english, urdu)}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ))}
              </div>
            )}
            {step === 4 && (
              <div className="space-y-6">
                <p className="text-sm leading-7 text-[var(--ink-700)]">{copy(language, "These answers help the review team identify safety concerns. You may choose prefer not to say.", "یہ جواب جائزہ لینے والی ٹیم کو حفاظتی خدشات سمجھنے میں مدد دیتے ہیں۔ آپ کسی بھی سوال پر بتانا نہیں چاہتے منتخب کر سکتے ہیں۔")}</p>
                {signals.map(([code]) => (
                  <fieldset key={code} className="border-b border-[var(--line)] pb-4">
                    <legend className="mb-2 text-sm font-semibold">{copy(language, safetyQuestions[code][0], safetyQuestions[code][1])}</legend>
                    <div className="flex flex-wrap gap-3">
                      {([["yes", "Yes", "ہاں"], ["no", "No", "نہیں"], ["skip", "Prefer not to say", "بتانا نہیں چاہتے"]] as const).map(([value, english, urdu]) => (
                        <label key={value} className="inline-flex min-h-10 items-center gap-2 text-sm">
                          <input type="radio" name={`signal-${code}`} checked={form.safetyAnswers[code] === value} onChange={() => {
                            update("safetyAnswers", { ...form.safetyAnswers, [code]: value });
                            setForm(current => ({
                              ...current,
                              attentionSignalCodes: value === "yes" ? [...current.attentionSignalCodes.filter(item => item !== code), code] : current.attentionSignalCodes.filter(item => item !== code),
                            }));
                          }} />
                          {copy(language, english, urdu)}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ))}
                {form.attentionSignalCodes.includes("AT-007") && (
                  <div className="rounded-[10px] border border-[#e4c879] bg-[var(--amber-100)] p-3 text-sm leading-7 text-[var(--amber-700)]">
                    {copy(language, "If anyone is in immediate danger, contact local emergency services or a trusted support organization now. This form is not an emergency service.", "اگر کسی کو فوری خطرہ ہے تو ابھی مقامی ہنگامی خدمات یا کسی قابلِ اعتماد امدادی ادارے سے رابطہ کریں۔ یہ فارم ہنگامی خدمت نہیں ہے۔")}
                  </div>
                )}
                <fieldset>
                  <legend className="mb-2 text-sm font-semibold">{copy(language, "Support needed", "درکار مدد")}</legend>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {supportOptions.map(([value, en, ur]) => (
                      <CheckField key={value} checked={form.supportNeeded.includes(value)} onChange={() => toggleArray("supportNeeded", value)} label={copy(language, en, ur)} />
                    ))}
                  </div>
                </fieldset>
              </div>
            )}
            {step === 5 && (
              <div className="space-y-5">
                <p className="text-sm text-[var(--ink-700)]">{copy(language, "Check your answers before submitting.", "جمع کرانے سے پہلے اپنے جوابات چیک کریں۔")}</p>
                <ReviewGroup title={copy(language, "Consent and contact", "رضامندی اور رابطہ")} onEdit={() => setStep(0)} rows={[[copy(language, "Service consent", "خدمت کی رضامندی"), form.serviceConsent ? copy(language, "Yes", "ہاں") : copy(language, "No", "نہیں")], [copy(language, "Contact consent", "رابطے کی رضامندی"), form.contactConsent ? copy(language, "Yes", "ہاں") : copy(language, "No", "نہیں")], [copy(language, "Referral discussion", "حوالہ پر بات"), form.referralConsent ? copy(language, "Yes", "ہاں") : copy(language, "No", "نہیں")]]} editLabel={copy(language, "Edit", "ترمیم")} />
                <ReviewGroup title={copy(language, "Profile", "ذاتی معلومات")} onEdit={() => setStep(1)} rows={[[copy(language, "Name", "نام"), form.fullName || "—"], [copy(language, "Mobile number", "موبائل نمبر"), form.primaryPhone || "—"], [copy(language, "Age band", "عمر کا زمرہ"), localizedChoice(form.ageBand, ageBandOptions, language)], [copy(language, "Contact method", "رابطے کا طریقہ"), form.contactConsent ? localizedChoice(form.safeContactMethod, contactMethodOptions, language) : copy(language, "No follow-up", "بعد میں رابطہ نہیں")]]} editLabel={copy(language, "Edit", "ترمیم")} />
                <ReviewGroup title={copy(language, "Migration plan", "بیرون ملک جانے کا منصوبہ")} onEdit={() => setStep(2)} rows={[[copy(language, "Stage", "مرحلہ"), localizedChoice(form.migrationStage, stageOptions, language)], [copy(language, "Purpose", "مقصد"), localizedChoice(form.migrationPurpose, purposeOptions, language)], [copy(language, "Destination", "منزل"), form.destinationCountry || "—"], [copy(language, "Occupation", "پیشہ"), form.targetOccupation || "—"], [copy(language, "Recruitment", "بھرتی"), localizedChoice(form.recruitmentChannel, recruitmentOptions, language)]]} editLabel={copy(language, "Edit", "ترمیم")} />
                <ReviewGroup title={copy(language, "Preparation checklist", "تیاری کی چیک لسٹ")} onEdit={() => setStep(3)} rows={readinessItems.filter(item => form.readiness[item[0]]).map(([key, en, ur]) => [copy(language, en, ur), localizedChoice(form.readiness[key], readinessStatuses, language)])} editLabel={copy(language, "Edit", "ترمیم")} />
                <ReviewGroup title={copy(language, "Safety and support", "تحفظ اور مدد")} onEdit={() => setStep(4)} rows={[[copy(language, "Attention signals", "توجہ کے اشارے"), form.attentionSignalCodes.map(code => { const item = signals.find(([key]) => key === code); return item ? copy(language, item[1], item[2]) : code; }).join(", ") || copy(language, "None reported", "کوئی اطلاع نہیں")], [copy(language, "Support needs", "مدد کی ضروریات"), form.supportNeeded.map(value => localizedChoice(value, supportOptions, language)).join(", ") || "—"]]} editLabel={copy(language, "Edit", "ترمیم")} />
                <CheckField checked={attested} onChange={setAttested} label={copy(language, "I have checked my answers and understand they will be reviewed by staff.", "میں نے اپنے جوابات چیک کر لیے ہیں اور سمجھتا/سمجھتی ہوں کہ عملہ ان کا جائزہ لے گا۔")} />
              </div>
            )}
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] pt-5">
            <div className="flex gap-2">
              <button type="button" className="btn-quiet" disabled={step === 0} onClick={() => { setStep(current => current - 1); setError(""); }}>
                <ArrowLeft size={16} className="rtl:rotate-180" />
                {copy(language, "Back", "واپس")}
              </button>
              {step < 5 ? (
                <button type="button" className="btn-primary" onClick={next}>
                  {copy(language, "Continue", "آگے بڑھیں")}
                  <ArrowRight size={16} className="rtl:rotate-180" />
                </button>
              ) : (
                <button type="button" className="btn-primary" disabled={saveState === "saving"} onClick={() => {
                  if (!attested) {
                    setError(copy(language, "Confirm your answers before submitting.", "جمع کرانے سے پہلے اپنے جوابات کی تصدیق کریں۔"));
                    return;
                  }
                  void save(true);
                }}>
                  {copy(language, "Submit form", "فارم جمع کریں")}
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

function TextField({ label, value, onChange, required, help, type = "text" }: { label: string; value: string; onChange: (value: string) => void; required?: boolean; help?: string; type?: string }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="field-label">{label}{required ? " *" : ""}</label>
      <input id={id} className="field" value={value} onChange={event => onChange(event.target.value)} required={required} type={type} aria-describedby={help ? `${id}-help` : undefined} />
      {help && <p id={`${id}-help`} className="field-help">{help}</p>}
    </div>
  );
}

function SelectField({ label, value, onChange, options, language }: { label: string; value: string; onChange: (value: string) => void; options: readonly (readonly [string, string, string])[]; language: "ur" | "en" }) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="field-label">{label}</label>
      <select id={id} className="field" value={value} onChange={event => onChange(event.target.value)}>
        {!options.some(([key]) => key === "") && <option value="">{copy(language, "Select an option", "ایک انتخاب کریں")}</option>}
        {options.map(([key, en, ur]) => <option key={key} value={key}>{copy(language, en, ur)}</option>)}
      </select>
    </div>
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
