"use client";

import Link from "next/link";
import { BrandLockup } from "@/components/brand";
import { LanguageSwitch, copy, useLocale } from "@/components/locale";

export default function PrivacyPage() {
  const { language } = useLocale();
  return <main id="main-content" className="information-page mx-auto max-w-2xl px-5 py-10 sm:py-16"><div className="flex items-center justify-between gap-4"><Link href="/"><BrandLockup compact /></Link><LanguageSwitch /></div><h1 className="mt-8 text-3xl font-semibold text-[var(--navy-950)]">{copy(language, "Privacy and use", "رازداری اور استعمال")}</h1>
    <p className="mt-5 leading-8 text-[var(--ink-700)]">{copy(language, "Rehnumai lets you submit information about your migration plans, preparation, and support needs. The form asks for your name, answers about your journey and safety, and a contact number only if you agree to follow-up contact. Authorized reviewers can view submitted forms; your answers are not shown publicly.", "رہنمائی آپ کو اپنے سفر کے منصوبے، تیاری اور مدد کی ضروریات سے متعلق معلومات جمع کرانے دیتی ہے۔ فارم میں آپ کا نام، سفر اور تحفظ سے متعلق جوابات، اور صرف بعد میں رابطے کی اجازت دینے پر رابطہ نمبر پوچھا جاتا ہے۔ مجاز جائزہ لینے والے جمع شدہ فارم دیکھ سکتے ہیں؛ آپ کے جوابات عوام کو نہیں دکھائے جاتے۔")}</p>
    <p className="mt-5 leading-8 text-[var(--ink-700)]">{copy(language, "You can decline contact or a referral discussion and still submit the form. Agreeing to discuss a referral does not authorize sharing your information with another organization. Submitting a form does not guarantee a job, visa, or government decision.", "آپ رابطے یا حوالہ پر بات سے انکار کر کے بھی فارم جمع کرا سکتے ہیں۔ حوالہ پر بات کی اجازت سے کسی دوسرے ادارے کو آپ کی معلومات دینے کی اجازت نہیں ملتی۔ فارم جمع کرانے سے ملازمت، ویزا یا حکومتی فیصلے کی ضمانت نہیں ملتی۔")}</p>
    <p className="mt-5 leading-8 text-[var(--ink-700)]">{copy(language, "This summary does not replace the organization’s approved privacy notice. For a privacy request or to correct submitted information, contact the service team through its official channel and quote your reference number.", "یہ خلاصہ ادارے کے منظور شدہ رازداری نوٹس کی جگہ نہیں لیتا۔ رازداری کی درخواست یا جمع شدہ معلومات کی اصلاح کے لیے سرکاری ذریعے سے سروس ٹیم سے رابطہ کریں اور اپنا حوالہ نمبر بتائیں۔")}</p>
  </main>;
}
