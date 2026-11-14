"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ContentImage } from "@/components/content-image";
import { copy, useLocale } from "@/components/locale";
import { ManzilMenuFrame } from "@/components/manzil-main-menu";
import { getManzilMenuSection } from "@/lib/manzil-menu-items";

export function ManzilSectionMenu({ sectionId }: { sectionId: string }) {
  const { language } = useLocale();
  const section = getManzilMenuSection(sectionId);
  if (!section) notFound();

  return (
    <ManzilMenuFrame>
      <div className="manzil-menu__section-page">
        <header className={`manzil-index__hero manzil-index__hero--${section.id}`}>
          <ContentImage src={section.icon} alt="" preset="cover" sizes="(max-width: 959px) 100vw, 920px" />
          <Link href="/" className="manzil-menu__back manzil-index__back focus-ring">
            {language === "ur" ? <ArrowRight size={16} aria-hidden /> : <ArrowLeft size={16} aria-hidden />}
            <span className="urdu">{copy(language, "Back", "واپس")}</span>
          </Link>
          <h1 className="manzil-menu__section-heading urdu">{copy(language, section.titleEn, section.titleUr)}</h1>
        </header>
        <div className="manzil-index">
          {section.groups.map((group) => {
            const groupTitle = copy(language, group.titleEn, group.titleUr);
            const showLabel = groupTitle !== copy(language, section.titleEn, section.titleUr);
            return (
              <section key={group.id} className="manzil-index__group" aria-labelledby={`manzil-index-${group.id}`}>
                {showLabel ? (
                  <h2 id={`manzil-index-${group.id}`} className="manzil-index__label urdu">{groupTitle}</h2>
                ) : (
                  <h2 id={`manzil-index-${group.id}`} className="sr-only">{groupTitle}</h2>
                )}
                <ul className="manzil-index__list">
                  {group.items.map((item) => (
                    <li key={item.id}>
                      <Link href={`/guide/${item.id}`} className="manzil-index__link focus-ring">
                        <span className="manzil-index__bullet" aria-hidden />
                        <span className="manzil-index__title urdu">{copy(language, item.titleEn, item.titleUr)}</span>
                        {language === "ur" ? <ChevronLeft size={16} className="manzil-index__go" aria-hidden /> : <ChevronRight size={16} className="manzil-index__go" aria-hidden />}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </ManzilMenuFrame>
  );
}
