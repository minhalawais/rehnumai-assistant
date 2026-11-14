"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ManzilMenuFrame } from "@/components/manzil-main-menu";
import { copy, useLocale } from "@/components/locale";
import { ContentImage } from "@/components/content-image";
import { GuideSheet } from "@/components/guide-sheet";
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
      <article
        className={`guide${id === "self-check" ? " guide--self-check" : ""}${id === "departure-requirements" ? " guide--departure-requirements" : ""}${id === "checklist" ? " guide--packing-checklist" : ""}${id === "airport" ? " guide--airport" : ""}${id === "employer" ? " guide--employer" : ""}${id === "arrival-airport" ? " guide--arrival-airport" : ""}${id === "job-search" ? " guide--job-search" : ""}${id === "respect-laws" ? " guide--respect-laws" : ""}${id === "rights" ? " guide--rights" : ""}${id === "workplace-rights" ? " guide--workplace-rights" : ""}${id === "smartphone" ? " guide--smartphone" : ""}${id === "remittance-channels" ? " guide--remittance" : ""}${id === "formal-informal" ? " guide--formal-informal" : ""}${id === "private-companies" ? " guide--private-companies" : ""}${id === "reintegration" ? " guide--reintegration" : ""}${id === "return-support" ? " guide--return-support" : ""}`}
      >
        <Link href={`/menu/${entry.section.id}`} className="manzil-menu__back focus-ring">
          {language === "ur" ? <ArrowRight size={16} aria-hidden /> : <ArrowLeft size={16} aria-hidden />}
          <span className="urdu">{copy(language, entry.section.titleEn, entry.section.titleUr)}</span>
        </Link>
        <div className={`guide__intro${id === "women" ? " guide__intro--text-only" : ""}`}>
          <div className="guide__intro-copy">
            <h1 className="guide__title urdu">{copy(language, entry.item.titleEn, entry.item.titleUr)}</h1>
          </div>
          {id !== "women" ? <ContentImage src={`/menu-icons/guide/${id}-photo.jpg`} alt="" preset="icon" className="guide__icon" /> : null}
        </div>
        <GuideSheet blocks={blocks} />
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
