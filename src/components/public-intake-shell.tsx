"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PublicSiteHeader } from "@/components/public-site-header";
import { copy, useLocale } from "@/components/locale";

export function PublicIntakeShell({ children, title }: { children: React.ReactNode; title: string }) {
  const { language } = useLocale();
  return (
    <div className="public-page public-intake-shell min-h-screen bg-[var(--canvas)]">
      <PublicSiteHeader
        maxWidth="form"
        trailing={(
          <Link href="/" className="hidden min-h-9 items-center gap-2 text-sm font-semibold text-[var(--navy-900)] sm:inline-flex">
            <ArrowLeft size={17} className="rtl:rotate-180" />
            {copy(language, "Booklet", "کتابچہ")}
          </Link>
        )}
      />
      <main id="main-content" className="public-intake-shell__main mx-auto max-w-[1100px] px-5 py-6 sm:px-8 sm:py-8">
        <h1 className="public-page__title mb-6 text-2xl font-semibold tracking-[-.035em] text-[var(--navy-950)]">{title}</h1>
        {children}
      </main>
    </div>
  );
}
