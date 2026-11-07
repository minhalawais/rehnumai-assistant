"use client";

import Link from "next/link";
import { BrandLockup } from "@/components/brand";
import { LanguageSwitch, copy, useLocale } from "@/components/locale";

export default function StaffPrivacyPage() {
  const { language } = useLocale();

  return <main id="main-content" className="information-page mx-auto max-w-2xl px-5 py-10 sm:py-16">
    <div className="flex items-center justify-between gap-4"><Link href="/" aria-label={copy(language, "Rehnumai home", "رہنمائی کا صفحۂ آغاز")}><BrandLockup compact /></Link><LanguageSwitch /></div>
    <Link href="/login" className="mt-12 inline-block text-sm font-semibold text-[var(--teal-700)]">{copy(language, "Back to staff sign in", "عملے کے لاگ اِن پر واپس")}</Link>
    <h1 className="mt-8 text-3xl font-semibold text-[var(--navy-950)]">{copy(language, "Staff data and privacy", "عملے کا ڈیٹا اور رازداری")}</h1>
    <p className="mt-5 leading-8 text-[var(--ink-700)]">{copy(language, "Rehnumai uses staff accounts to limit access to submitted forms. Authorized staff can review information within their assigned access. The service records sign-in attempts and uses a session cookie to keep you signed in.", "رہنمائی جمع شدہ فارموں تک رسائی محدود کرنے کے لیے عملے کے اکاؤنٹس استعمال کرتی ہے۔ مجاز عملہ اپنی مقررہ رسائی کے اندر معلومات کا جائزہ لے سکتا ہے۔ سروس لاگ اِن کی کوششیں درج کرتی ہے اور آپ کو لاگ اِن رکھنے کے لیے سیشن کوکی استعمال کرتی ہے۔")}</p>
    <p className="mt-5 leading-8 text-[var(--ink-700)]">{copy(language, "Use your own account only for your assigned work. Do not share your password or copy applicant information into personal email or messaging apps. Sign out when you finish using a shared device.", "اپنا اکاؤنٹ صرف مقررہ کام کے لیے استعمال کریں۔ اپنا پاس ورڈ شیئر نہ کریں اور درخواست گزار کی معلومات ذاتی ای میل یا پیغام رسانی کی ایپس میں نقل نہ کریں۔ مشترکہ ڈیوائس پر کام مکمل ہونے کے بعد لاگ آؤٹ کریں۔")}</p>
    <p className="mt-5 leading-8 text-[var(--ink-700)]">{copy(language, "For questions about staff account data or a privacy request, follow your organization's approved privacy process. This page is a service summary and does not replace your organization's approved privacy notice.", "عملے کے اکاؤنٹ کے ڈیٹا یا رازداری کی درخواست سے متعلق سوال کے لیے اپنے ادارے کے منظور شدہ رازداری کے طریقے پر عمل کریں۔ یہ صفحہ سروس کا خلاصہ ہے اور ادارے کے منظور شدہ رازداری نوٹس کی جگہ نہیں لیتا۔")}</p>
  </main>;
}
