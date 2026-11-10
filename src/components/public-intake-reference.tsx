"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { copy, useLocale } from "@/components/locale";
import { getPublicIntakeReference } from "@/lib/public-intake-storage";

export function PublicIntakeReferenceLink({ className }: { className?: string }) {
  const { language } = useLocale();
  const [reference, setReference] = useState<string | null>(null);

  useEffect(() => {
    queueMicrotask(() => setReference(getPublicIntakeReference()));
  }, []);

  if (!reference) return null;

  return (
    <Link href="/intake" className={className ?? "text-xs font-semibold text-[var(--teal-700)]"} dir="ltr">
      {copy(language, "Your reference", "آپ کا حوالہ")}: {reference}
    </Link>
  );
}
