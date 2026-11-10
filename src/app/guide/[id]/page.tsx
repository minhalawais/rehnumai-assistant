"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ManzilMenuFrame } from "@/components/manzil-main-menu";
import { copy, useLocale } from "@/components/locale";
import { GUIDE_ARTICLES } from "@/lib/guide-articles";
import { findManzilIndex } from "@/lib/manzil-menu-items";

export default function GuidePage() {
  const { language } = useLocale();
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const entry = findManzilIndex(id);
  const blocks = GUIDE_ARTICLES[id];
  if (!entry || !blocks?.length) notFound();

  return (
    <ManzilMenuFrame>
      <article className="guide">
        <Link href={`/menu/${entry.section.id}`} className="manzil-menu__back focus-ring">
          {language === "ur" ? <ArrowRight size={16} aria-hidden /> : <ArrowLeft size={16} aria-hidden />}
          <span className="urdu">{copy(language, entry.section.titleEn, entry.section.titleUr)}</span>
        </Link>
        <p className="guide__kicker urdu">{copy(language, entry.group.titleEn, entry.group.titleUr)}</p>
        <h1 className="guide__title urdu">{copy(language, entry.item.titleEn, entry.item.titleUr)}</h1>
        <div className="guide__sheet" lang="ur" dir="rtl">
          {blocks.map((block, index) => {
            if (block.type === "h") return <h2 key={index} className="guide__h urdu">{block.text}</h2>;
            if (block.type === "list") {
              return (
                <ul key={index} className="guide__list">
                  {block.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="guide__item urdu">
                      <span className="manzil-index__bullet" aria-hidden />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              );
            }
            return <p key={index} className="guide__p urdu">{block.text}</p>;
          })}
        </div>
        {entry.next ? (
          <Link href={`/guide/${entry.next.id}`} className="guide__next btn-primary focus-ring">
            <span className="urdu">{copy(language, entry.next.titleEn, entry.next.titleUr)}</span>
            {language === "ur" ? <ArrowLeft size={16} aria-hidden /> : <ArrowRight size={16} aria-hidden />}
          </Link>
        ) : null}
      </article>
    </ManzilMenuFrame>
  );
}
