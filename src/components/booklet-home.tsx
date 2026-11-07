"use client";

import Link from "next/link";
import { BookletViewer } from "@/components/booklet-viewer";
import { PublicSiteHeader } from "@/components/public-site-header";
import { copy, useLocale } from "@/components/locale";
import { BOOKLET_COVER } from "@/lib/booklet";

export function BookletHome() {
  const { language } = useLocale();

  return (
    <div className="public-page booklet-page booklet-page--home bg-[var(--canvas)]">
      <PublicSiteHeader maxWidth="booklet" />

      <main id="main-content" className="booklet-page__main mx-auto w-full max-w-[1280px] px-4 py-3 sm:px-8 sm:py-6">
        <div className="booklet-page__content">
          <header className="booklet-page__intro text-center sm:text-start">
            <h1 className="booklet-page__title">
              {copy(language, BOOKLET_COVER.subtitle.en, BOOKLET_COVER.subtitle.ur)}
            </h1>
          </header>

          <div className="booklet-page__reader">
            <BookletViewer variant="home" />
          </div>
        </div>
      </main>

      <footer className="public-page__footer border-t border-[var(--line)] bg-white py-4">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-5 text-sm text-[var(--ink-700)] sm:px-8">
          <span>© Rehnumai</span>
          <Link href="/privacy" className="font-semibold text-[var(--navy-900)]">{copy(language, "Privacy", "رازداری")}</Link>
        </div>
      </footer>
    </div>
  );
}
