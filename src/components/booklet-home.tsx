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
