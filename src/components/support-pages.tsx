"use client";

import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { ManzilMenuFrame } from "@/components/manzil-main-menu";
import { LinkText } from "@/components/guide-sheet";
import { copy, useLocale } from "@/components/locale";
import { getSupportGroup, SUPPORT_GROUPS } from "@/lib/support-agencies";

function readableParagraphs(text: string): string[] {
  const trimmed = text.replace(/\s+/g, " ").trim();
  if (trimmed.length < 280) return [trimmed];
  const parts = trimmed.split(/(?<=۔)\s*/).map((part) => part.trim()).filter(Boolean);
  if (parts.length < 2) return [trimmed];
  const chunks: string[] = [];
  let buffer = "";
  for (const part of parts) {
    const next = buffer ? `${buffer} ${part}` : part;
    if (buffer && next.length > 240) {
      chunks.push(buffer);
      buffer = part;
    } else {
      buffer = next;
    }
  }
  if (buffer) chunks.push(buffer);
  return chunks;
}

const HUB_COUNT = { government: ["9 bodies", "۹ ادارے"], international: ["2 bodies", "۲ ادارے"] } as const;
const HUB_ART = { government: "/menu-icons/support-government.jpg", international: "/menu-icons/support-international.jpg" } as const;

export function SupportHub() {
  const { language } = useLocale();

  return (
    <ManzilMenuFrame>
      <div className="support-page support-hub">
        <h1 className="guide__title urdu">{copy(language, "Helpful official bodies", "مددگار سرکاری ادارے")}</h1>
        <div className="support-hub__cards">
          {SUPPORT_GROUPS.map((group) => {
            const count = HUB_COUNT[group.id as keyof typeof HUB_COUNT];
            const art = HUB_ART[group.id as keyof typeof HUB_ART];
            return (
              <Link key={group.id} href={`/support/${group.id}`} className={`support-hub__card support-hub__card--${group.id} focus-ring`}>
                <span className="support-hub__frame">
                  <img src={art} alt="" className="support-hub__scene" />
                </span>
                <span className="support-hub__copy">
                  <span className="support-hub__text">
                    <span className="support-hub__title urdu">{copy(language, group.titleEn, group.titleUr)}</span>
                    <span className="support-hub__count urdu">{copy(language, count[0], count[1])}</span>
                  </span>
                  {language === "ur" ? <ChevronLeft size={22} aria-hidden /> : <ChevronRight size={22} aria-hidden />}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </ManzilMenuFrame>
  );
}

export function SupportGroupPage({ groupId }: { groupId: string }) {
  const { language } = useLocale();
  const group = getSupportGroup(groupId);
  if (!group) notFound();

  return (
    <ManzilMenuFrame>
      <div className="support-page">
        <Link href="/support" className="manzil-menu__back focus-ring">
          {language === "ur" ? <ArrowRight size={16} aria-hidden /> : <ArrowLeft size={16} aria-hidden />}
          <span className="urdu">{copy(language, "Helpful official bodies", "مددگار سرکاری ادارے")}</span>
        </Link>
        <h1 className="guide__title urdu">{copy(language, group.titleEn, group.titleUr)}</h1>
        <div className="agency-list">
          {group.agencies.map((agency) => {
            const names = new Set(agency.nameUr.map((name) => name.trim()));
            const paragraphs = agency.paragraphs.filter((paragraph) => !names.has(paragraph.trim()));
            const title = copy(language, agency.nameEn, agency.nameUr.join(" "));
            return (
              <article key={agency.id} className="agency">
                <div className="agency__body">
                  {paragraphs.flatMap((paragraph) => readableParagraphs(paragraph)).map((paragraph, index) => (
                    <p key={index} className="agency__p urdu"><LinkText text={paragraph} /></p>
                  ))}
                </div>
                <aside className="agency__mark">
                  {agency.logo ? <img src={agency.logo} alt="" className="agency__logo" /> : null}
                  <h2 className="agency__name urdu">{title}</h2>
                  {agency.website ? (
                    <a className="guide__link" href={agency.website.startsWith("http") ? agency.website : `https://${agency.website}`} target="_blank" rel="noopener noreferrer">
                      {agency.website}
                    </a>
                  ) : null}
                  {agency.qr ? <img src={agency.qr} alt="" className="agency__qr" /> : null}
                </aside>
              </article>
            );
          })}
        </div>
      </div>
    </ManzilMenuFrame>
  );
}
