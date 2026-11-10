"use client";

import Link from "next/link";
import { BrandLockup } from "@/components/brand";
import { LanguageSwitch, copy, useLocale } from "@/components/locale";

export default function AccountHelpPage() {
  const { language } = useLocale();

  return <main id="main-content" className="information-page mx-auto max-w-2xl px-5 py-10 sm:py-16">
    <div className="flex items-center justify-between gap-4"><Link href="/" aria-label={copy(language, "Manzil home", "منزل کا صفحۂ آغاز")}><BrandLockup compact /></Link><LanguageSwitch /></div>
    <Link href="/login" className="mt-12 inline-block text-sm font-semibold text-[var(--teal-700)]">{copy(language, "Back to login", "لاگ اِن کے صفحے پر واپس")}</Link>
    <h1 className="mt-8 text-3xl font-semibold text-[var(--navy-950)]">{copy(language, "Sign-in and password help", "لاگ اِن اور پاس ورڈ میں مدد")}</h1>
    <p className="mt-5 leading-8 text-[var(--ink-700)]">{copy(language, "Staff accounts are managed by your organization. There is no online password reset in Rehnumai yet.", "عملے کے اکاؤنٹ آپ کے ادارے کے پاس ہیں۔ ابھی یہاں سے پاس ورڈ آن لائن تبدیل نہیں ہو سکتا۔")}</p>
    <div className="panel mt-7 p-5 sm:p-6">
      <h2 className="text-lg font-semibold text-[var(--navy-950)]">{copy(language, "What to do", "آپ کیا کریں")}</h2>
      <ol className="mt-4 list-decimal space-y-3 ps-5 leading-7 text-[var(--ink-700)]">
        <li>{copy(language, "If you forgot your password or need an account, ask your team lead or your organization's IT desk to connect you with the Rehnumai system administrator.", "پاس ورڈ یاد نہ ہو یا نیا اکاؤنٹ چاہیے تو ٹیم لیڈ یا ادارے کے آئی ٹی سٹاف سے کہیں — وہ رہنمائی کے ایڈمن سے رابطہ کرائیں گے۔")}</li>
        <li>{copy(language, "If sign in says the service is unavailable, ask the administrator to check the service and database connection.", "اگر لکھا آئے کہ سروس دستیاب نہیں تو ایڈمن سے کہیں سروس اور ڈیٹا بیس چیک کرے۔")}</li>
        <li>{copy(language, "Use only your organization's approved staff channel. Do not send passwords or applicant information by email or chat.", "صرف ادارے کے باقاعدہ ذریعے سے رابطہ کریں۔ پاس ورڈ یا لوگوں کی معلومات ای میل یا چیٹ پر نہ بھیجیں۔")}</li>
      </ol>
    </div>
    <p className="mt-5 text-sm leading-7 text-[var(--ink-700)]">{copy(language, "An official support address has not been configured for this service.", "اس سروس کے لیے ابھی کوئی سرکاری مدد کا پتہ مقرر نہیں ہے۔")}</p>
  </main>;
}
