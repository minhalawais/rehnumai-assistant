"use client";

import Link from "next/link";
import { BrandLockup } from "@/components/brand";
import { LanguageSwitch, copy, useLocale } from "@/components/locale";

export default function StaffPrivacyPage() {
  const { language } = useLocale();

  return <main id="main-content" className="information-page mx-auto max-w-2xl px-5 py-10 sm:py-16">
    <div className="flex items-center justify-between gap-4"><Link href="/" aria-label={copy(language, "Rehnumai home", "رہنمائی کا صفحۂ آغاز")}><BrandLockup compact /></Link><LanguageSwitch /></div>
    <Link href="/login" className="mt-12 inline-block text-sm font-semibold text-[var(--teal-700)]">{copy(language, "Back to login", "لاگ اِن کے صفحے پر واپس")}</Link>
    <h1 className="mt-8 text-3xl font-semibold text-[var(--navy-950)]">{copy(language, "Staff data and privacy", "عملے کی معلومات اور رازداری")}</h1>
    <p className="mt-5 leading-8 text-[var(--ink-700)]">{copy(language, "Rehnumai uses staff accounts to limit access to submitted forms. Authorized staff can review information within their assigned access. The service records sign-in attempts and uses a session cookie to keep you signed in.", "جمع شدہ فارمز صرف عملے کے اکاؤنٹ سے کھلتے ہیں۔ جس عملے کو اجازت ہو وہی لوگوں کی معلومات دیکھ سکتا ہے۔ غلط لاگ اِن کی کوششیں نوٹ ہوتی ہیں؛ لاگ اِن رہنے کے لیے براؤزر میں ایک محفوظ کوکی لگتی ہے۔")}</p>
    <p className="mt-5 leading-8 text-[var(--ink-700)]">{copy(language, "Use your own account only for your assigned work. Do not share your password or copy applicant information into personal email or messaging apps. Sign out when you finish using a shared device.", "اپنا اکاؤنٹ صرف کام کے لیے استعمال کریں۔ پاس ورڈ کسی کو نہ دیں اور لوگوں کی معلومات اپنی ذاتی ای میل یا چیٹ میں نہ رکھیں۔ مشترکہ کمپیوٹر پر کام ختم ہونے کے بعد باہر نکل جائیں۔")}</p>
    <p className="mt-5 leading-8 text-[var(--ink-700)]">{copy(language, "For questions about staff account data or a privacy request, follow your organization's approved privacy process. This page is a service summary and does not replace your organization's approved privacy notice.", "اکاؤنٹ یا رازداری کے سوال کے لیے اپنے ادارے کے مقررہ طریقے پر عمل کریں۔ یہ صفحہ خلاصہ ہے؛ ادارے کے باقاعدہ رازداری نوٹس کی جگہ نہیں لے سکتا۔")}</p>
  </main>;
}
