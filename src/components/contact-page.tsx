"use client";

import { ManzilMenuFrame } from "@/components/manzil-main-menu";
import { copy, useLocale, type Language } from "@/components/locale";
import { CONTACT_ENTRIES, type ContactFact } from "@/lib/contact-directory";

function FactValue({ fact }: { fact: ContactFact }) {
  if (fact.links?.length) {
    return (
      <span className="contact-row__value" dir="ltr">
        {fact.links.map((link, index) => (
          <span key={link.href}>
            {index > 0 ? <span className="contact-row__sep"> · </span> : null}
            <a className="guide__link" href={link.href} target={link.href.startsWith("tel:") ? undefined : "_blank"} rel="noopener noreferrer">{link.text}</a>
          </span>
        ))}
      </span>
    );
  }
  if (fact.href && fact.value) {
    return (
      <a className="guide__link contact-row__value" dir="ltr" href={fact.href} target={fact.href.startsWith("tel:") ? undefined : "_blank"} rel="noopener noreferrer">
        {fact.value}
      </a>
    );
  }
  return <span className="contact-row__value" dir="ltr">{fact.value}</span>;
}

function FactList({ facts, language }: { facts: ContactFact[]; language: Language }) {
  return (
    <dl className="contact-rows">
      {facts.map((fact) => (
        <div key={`${fact.labelEn}-${fact.value ?? fact.links?.[0]?.href}`} className="contact-row">
          <dt className="contact-row__label urdu">{copy(language, fact.labelEn, fact.labelUr)}</dt>
          <dd><FactValue fact={fact} /></dd>
        </div>
      ))}
    </dl>
  );
}

export function ContactPage() {
  const { language } = useLocale();

  return (
    <ManzilMenuFrame>
      <div className="support-page contact-page">
        <header className="contact-page__head">
          <h1 className="guide__title urdu">{copy(language, "Contact us", "رابطہ کریں")}</h1>
          <p className="contact-page__lead urdu">
            {copy(language, "Official complaint and help contacts from the migration booklet.", "مائیگریشن کتابچے میں درج سرکاری شکایت اور مدد کے رابطے۔")}
          </p>
        </header>
        <div className="contact-list">
          {CONTACT_ENTRIES.map((entry) => (
            <article key={entry.id} className="contact-card">
              <header className="contact-card__head">
                <h2 className="contact-card__title urdu">{copy(language, entry.titleEn, entry.titleUr)}</h2>
                <p className="contact-card__office" dir="ltr">{entry.office}</p>
              </header>
              {entry.note ? <p className="contact-note" dir="ltr">{entry.note}</p> : null}
              <FactList facts={entry.facts} language={language} />
              {entry.more ? (
                <div className="contact-more">
                  <h3 className="contact-more__title urdu">{copy(language, entry.more.titleEn, entry.more.titleUr)}</h3>
                  <FactList facts={entry.more.facts} language={language} />
                </div>
              ) : null}
            </article>
          ))}
        </div>
      </div>
    </ManzilMenuFrame>
  );
}
