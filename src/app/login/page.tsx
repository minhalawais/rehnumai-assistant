"use client";

import { Eye, EyeOff, LockKeyhole } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BrandLockup } from "@/components/brand";
import { LanguageSwitch, copy, useLocale } from "@/components/locale";
import { PartnerLogos } from "@/components/partner-logos";

type SignInError = "credentials" | "input" | "security" | "rate" | "service";

function errorForStatus(status: number): SignInError {
  if (status === 401) return "credentials";
  if (status === 422) return "input";
  if (status === 403) return "security";
  if (status === 429) return "rate";
  return "service";
}

export default function LoginPage() {
  const { language } = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<SignInError | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (error) errorRef.current?.focus(); }, [error]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setLoading(true); setError(null);
    try {
      const csrfResponse = await fetch("/api/auth/csrf", { cache: "no-store" });
      if (!csrfResponse.ok) throw new Error("service");
      const csrf = (await csrfResponse.json()).data?.token ?? "";
      const response = await fetch("/api/auth/login", { method: "POST", headers: { "content-type": "application/json", "x-csrf-token": csrf }, body: JSON.stringify({ email, password }) });
      if (!response.ok) throw new Error(errorForStatus(response.status));
      router.replace("/portal/submissions"); router.refresh();
    } catch (cause) {
      const reason = cause instanceof Error ? cause.message : "service";
      setError(reason === "credentials" || reason === "input" || reason === "security" || reason === "rate" ? reason : "service");
      setLoading(false);
    }
  }

  const errorText = error === "credentials"
    ? copy(language, "We could not sign you in with those details. Check your email and password.", "ان معلومات سے لاگ اِن نہیں ہو سکا۔ اپنا ای میل اور پاس ورڈ چیک کریں۔")
    : error === "input"
      ? copy(language, "Enter a valid organization email and password.", "ادارے کا درست ای میل اور پاس ورڈ درج کریں۔")
      : error === "security"
        ? copy(language, "The security check failed. Refresh the page and try again.", "حفاظتی جانچ ناکام ہوئی۔ صفحہ دوبارہ کھول کر کوشش کریں۔")
        : error === "rate"
          ? copy(language, "Too many attempts. Wait 15 minutes before trying again.", "بہت زیادہ کوششیں ہو چکی ہیں۔ دوبارہ کوشش سے پہلے ۱۵ منٹ انتظار کریں۔")
          : copy(language, "Sign in is unavailable. Ask your system administrator to check the service, or try again later.", "لاگ اِن دستیاب نہیں۔ اپنے سسٹم ایڈمنسٹریٹر سے سروس کی جانچ کروائیں یا بعد میں دوبارہ کوشش کریں۔");

  return <main id="main-content" className="login-page bg-[var(--navy-950)]"><div data-error={error ? "true" : undefined} className="login-card mx-auto w-full rounded-[18px] border-t-4 border-[#79cdbb] bg-white shadow-2xl">
    <section className="login-form-pane flex flex-col"><div className="login-form__top flex items-center justify-between gap-3"><Link href="/" aria-label={copy(language, "Rehnumai home", "رہنمائی کا صفحۂ آغاز")}><BrandLockup compact /></Link><LanguageSwitch /></div><div className="login-form-body mx-auto w-full"><div className="login-form__icon" aria-hidden="true"><LockKeyhole size={18} /></div><h1 className="login-form__title">{copy(language, "Staff sign in", "عملے کا لاگ اِن")}</h1><p className="login-form__lede">{copy(language, "Access submitted forms and your team's workspace.", "جمع شدہ فارم اور اپنی ٹیم کے ورک اسپیس تک رسائی حاصل کریں۔")}</p>
      {error && <div ref={errorRef} tabIndex={-1} role="alert" className="mt-7 rounded-[10px] border border-[var(--red-700)] bg-[var(--red-100)] px-4 py-3 text-sm leading-6 text-[var(--red-700)]">{errorText}{(error === "service" || error === "security") && <Link href="/account-help" className="mt-1 block font-semibold underline underline-offset-2">{copy(language, "Get sign-in help", "لاگ اِن کے لیے مدد حاصل کریں")}</Link>}</div>}
      <form onSubmit={submit} className="login-form space-y-5"><div><label htmlFor="email" className="field-label">{copy(language, "Organization email", "ادارے کا ای میل")}</label><input id="email" className="field" type="email" autoComplete="username" required value={email} onChange={event => { setEmail(event.target.value); setError(null); }} /></div><div><label htmlFor="password" className="field-label">{copy(language, "Password", "پاس ورڈ")}</label><div className="relative"><input id="password" className="field pe-12" type={showPassword ? "text" : "password"} autoComplete="current-password" required minLength={8} value={password} onChange={event => { setPassword(event.target.value); setError(null); }} /><button type="button" className="absolute inset-y-0 end-1 grid w-11 place-items-center text-[var(--ink-700)]" onClick={() => setShowPassword(value => !value)} aria-label={copy(language, showPassword ? "Hide password" : "Show password", showPassword ? "پاس ورڈ چھپائیں" : "پاس ورڈ دکھائیں")}>{showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}</button></div></div><button type="submit" disabled={loading} className="btn-primary w-full">{copy(language, loading ? "Signing in…" : "Sign in", loading ? "لاگ اِن ہو رہا ہے…" : "لاگ اِن کریں")}</button></form>
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 text-sm"><Link href="/account-help" className="font-semibold text-[var(--teal-700)] underline-offset-4 hover:underline">{copy(language, "Sign-in or password help", "لاگ اِن یا پاس ورڈ میں مدد")}</Link><Link href="/staff-privacy" className="text-[var(--ink-700)] underline-offset-4 hover:underline">{copy(language, "Staff privacy", "عملے کی رازداری")}</Link></div>
      <div className="login-partner-bar mt-8 border-t border-[var(--line)] pt-6">
        <PartnerLogos variant="login" />
      </div>
    </div></section></div></main>;
}
