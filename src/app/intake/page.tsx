"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PublicIntakeShell } from "@/components/public-intake-shell";
import { PublicIntakeForm } from "@/components/public-intake-form";
import { copy, useLocale } from "@/components/locale";
import { hasPublicIntakeSubmitted } from "@/lib/public-intake-storage";

export default function IntakePage() {
  const { language } = useLocale();
  const router = useRouter();

  useEffect(() => {
    if (hasPublicIntakeSubmitted()) router.replace("/");
  }, [router]);

  return (
    <PublicIntakeShell title={copy(language, "Migration form", "مائیگریشن فارم")}>
      <PublicIntakeForm surface="page" />
    </PublicIntakeShell>
  );
}
