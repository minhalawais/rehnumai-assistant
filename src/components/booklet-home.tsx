"use client";

import { BookletViewer } from "@/components/booklet-viewer";
import { copy, useLocale } from "@/components/locale";
import { ManzilMenuFrame } from "@/components/manzil-main-menu";
import { BOOKLET_COVER } from "@/lib/booklet";

export function BookletHome() {
  const { language } = useLocale();

  return (
    <ManzilMenuFrame>
      <div className="booklet-page booklet-page--home">
        <header className="booklet-page__intro">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-[var(--teal-700)] border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--teal-700)] animate-pulse" />
              {copy(language, "Official Publication • Digital Preview", "سرکاری اشاعت • ڈیجیٹل پریویو")}
            </span>
            <span className="text-xs text-[var(--ink-500)] font-medium">
              {copy(language, "2 Pages (Cover + Details)", "2 صفحات (سرورق + تفصیلات)")}
            </span>
          </div>
          <h1 className="booklet-page__title urdu">
            {copy(language, BOOKLET_COVER.subtitle.en, BOOKLET_COVER.subtitle.ur)}
          </h1>
        </header>
        <div className="booklet-page__reader">
          <BookletViewer variant="home" />
        </div>
      </div>
    </ManzilMenuFrame>
  );
}
