"use client";

import { useEffect, useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { ManzilMenuFrame } from "@/components/manzil-main-menu";
import { copy, useLocale, type Language } from "@/components/locale";
import { MANZIL_FAQ_SOURCES, MANZIL_FAQS, type ManzilFaq } from "@/lib/manzil-faqs";

const WIDE_QUERY = "(min-width: 960px)";

type FaqTopic = "all" | "travel" | "rights" | "complaints";

const FAQ_TOPICS: Array<{ id: FaqTopic; labelEn: string; labelUr: string }> = [
  { id: "all", labelEn: "All", labelUr: "تمام" },
  { id: "travel", labelEn: "Safe travel", labelUr: "محفوظ سفر" },
  { id: "rights", labelEn: "Rights", labelUr: "حقوق" },
  { id: "complaints", labelEn: "Complaints", labelUr: "شکایات" },
];

const FAQ_TOPIC_ITEMS: Record<Exclude<FaqTopic, "all">, string[]> = {
  travel: ["safer-departure", "training-enrolment", "rules-info"],
  rights: ["worker-rights", "return-support", "exploitation", "financial-help"],
  complaints: ["exploitation", "complain-pakistan", "complain-abroad"],
};

function useWideLayout() {
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const query = window.matchMedia(WIDE_QUERY);
    const apply = () => setWide(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  return wide;
}

function FaqAnswer({ item, language, restated }: { item: ManzilFaq; language: Language; restated?: boolean }) {
  const question = copy(language, item.questionEn, item.questionUr);
  const paragraphs = language === "ur" ? item.paragraphsUr : item.paragraphsEn;
  const bullets = language === "ur" ? item.bulletsUr : item.bulletsEn;

  return (
    <>
      {restated ? <p className="faq-item__restated urdu">{question}</p> : null}
      {paragraphs.map((paragraph) => (
        <p key={paragraph} className="faq-item__p urdu">{paragraph}</p>
      ))}
      {bullets?.length ? (
        <ul className="faq-item__points">
          {bullets.map((bullet) => (
            <li key={bullet} className="faq-item__point urdu">
              <span className="faq-item__mark" aria-hidden />
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

export function FaqPage() {
  const { language } = useLocale();
  const wide = useWideLayout();
  const [openId, setOpenId] = useState(MANZIL_FAQS[0]?.id ?? "");
  const [activeTopic, setActiveTopic] = useState<FaqTopic>("all");

  const choose = (id: string) => {
    setOpenId((current) => (wide || current !== id ? id : ""));
  };
  const visibleFaqs = activeTopic === "all"
    ? MANZIL_FAQS
    : MANZIL_FAQS.filter((item) => FAQ_TOPIC_ITEMS[activeTopic].includes(item.id));
  const selectedFaq = visibleFaqs.find((item) => item.id === openId);

  const chooseTopic = (topic: FaqTopic) => {
    const nextFaqs = topic === "all"
      ? MANZIL_FAQS
      : MANZIL_FAQS.filter((item) => FAQ_TOPIC_ITEMS[topic].includes(item.id));
    setActiveTopic(topic);
    if (!nextFaqs.some((item) => item.id === openId)) setOpenId(nextFaqs[0]?.id ?? "");
  };

  return (
    <ManzilMenuFrame>
      <div className="faq-page">
        <header className="faq-page__head">
          <h1 className="faq-page__title urdu">{copy(language, "Questions and answers", "سوالات اور جوابات")}</h1>
          <p className="faq-page__lead urdu">
            {copy(
              language,
              "Twelve answers on MRCs, safer travel, worker rights, and complaints.",
              "ایم آر سی، محفوظ سفر، کارکن کے حقوق اور شکایات پر بارہ جواب۔",
            )}
          </p>
        </header>

        <div className="faq-page__topics" role="toolbar" aria-label={copy(language, "FAQ topics", "سوالات کے موضوعات")}>
          {FAQ_TOPICS.map((topic) => (
            <button
              key={topic.id}
              type="button"
              className={`faq-topic focus-ring${activeTopic === topic.id ? " faq-topic--active" : ""}`}
              aria-pressed={activeTopic === topic.id}
              onClick={() => chooseTopic(topic.id)}
            >
              <span className="urdu">{copy(language, topic.labelEn, topic.labelUr)}</span>
            </button>
          ))}
        </div>

        <div className="faq-page__layout">
          <div className="faq-page__index">
            {visibleFaqs.map((item) => {
              const open = item.id === openId;
              const panelId = `faq-panel-${item.id}`;
              const buttonId = `faq-button-${item.id}`;
              return (
                <section key={item.id} className={`faq-item${open ? " faq-item--open" : ""}`}>
                  <h2 className="faq-item__heading">
                    <button
                      type="button"
                      id={buttonId}
                      className="faq-item__trigger focus-ring"
                      aria-expanded={open}
                      aria-controls={wide ? "faq-stage" : panelId}
                      onClick={() => choose(item.id)}
                    >
                      <span className="faq-item__q urdu">{copy(language, item.questionEn, item.questionUr)}</span>
                      <ChevronDown className="faq-item__chevron" size={18} aria-hidden />
                    </button>
                  </h2>
                  <div id={panelId} role="region" className="faq-item__panel" aria-labelledby={buttonId} hidden={!open}>
                    <FaqAnswer item={item} language={language} />
                  </div>
                </section>
              );
            })}
          </div>
          <article id="faq-stage" className="faq-page__stage" aria-live="polite" hidden={!selectedFaq}>
            {selectedFaq ? <FaqAnswer item={selectedFaq} language={language} restated /> : null}
          </article>
        </div>

        <section className="faq-sources" aria-labelledby="faq-sources-title">
          <h2 id="faq-sources-title" className="faq-sources__title urdu">{copy(language, "Further information", "دیگر معلوماتی مواد")}</h2>
          <div className="faq-sources__list">
            {MANZIL_FAQ_SOURCES.map((source) => (
              <article key={source.id} className="faq-source">
                <h3 className="faq-source__name urdu">{copy(language, source.nameEn, source.nameUr)}</h3>
                <ul className="faq-source__links">
                  {source.links.map((link) => (
                    <li key={link.href}>
                      <a className="faq-source__link focus-ring" href={link.href} target="_blank" rel="noopener noreferrer">
                        <span className="faq-source__copy">
                          <span className="faq-source__label urdu">{copy(language, link.labelEn, link.labelUr)}</span>
                          <span className="faq-source__url" dir="ltr">{link.host}</span>
                        </span>
                        <ExternalLink size={16} aria-hidden />
                      </a>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      </div>
    </ManzilMenuFrame>
  );
}
