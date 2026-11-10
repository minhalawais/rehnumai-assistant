"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PublicIntakeShell } from "@/components/public-intake-shell";
import { PublicIntakeForm } from "@/components/public-intake-form";
import { copy, useLocale } from "@/components/locale";
import { getPublicIntakeReference, hasPublicIntakeSubmitted } from "@/lib/public-intake-storage";

export default function IntakePage() {
  const { language } = useLocale();
  const [reference, setReference] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    queueMicrotask(() => {
      if (hasPublicIntakeSubmitted()) setReference(getPublicIntakeReference());
      setChecked(true);
    });
  }, []);

  if (!checked) {
    return (
      <PublicIntakeShell title={copy(language, "Migration form", "مائیگریشن فارم")}>
        <p className="text-sm text-[var(--ink-700)]" role="status">{copy(language, "Loading…", "لوڈ ہو رہا ہے…")}</p>
      </PublicIntakeShell>
    );
  }

  if (reference) {
    return (
      <PublicIntakeShell title={copy(language, "Form submitted", "فارم جمع ہو چکا")}>
        <div className="panel mx-auto max-w-[650px] p-6 sm:p-10">
          <h2 className="text-lg font-semibold text-[var(--navy-950)]">
            {copy(language, "Your form has been submitted for review.", "آپ کا فارم جمع ہو گیا ہے۔ ٹیم اسے دیکھے گی۔")}
          </h2>
          <p className="mt-2 text-sm text-[var(--ink-700)]">
            {copy(language, "Reference number", "حوالہ نمبر")}: <b dir="ltr">{reference}</b>
          </p>
          <p className="mt-2 text-sm text-[var(--ink-700)]">
            {copy(language, "Keep this number for follow-up with the team.", "ٹیم سے رابطے کے لیے یہ نمبر محفوظ رکھیں۔")}
          </p>
          <div className="mt-6">
            <Link href="/" className="btn-primary">{copy(language, "Read the booklet", "کتابچہ پڑھیں")}</Link>
          </div>
        </div>
      </PublicIntakeShell>
    );
  }

  return (
    <PublicIntakeShell title={copy(language, "Migration form", "مائیگریشن فارم")}>
      <PublicIntakeForm surface="page" />
    </PublicIntakeShell>
  );
}
