"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, CircleHelp, Home, Landmark, MessageSquareWarning } from "lucide-react";
import { copy, LanguageSwitch, useLocale } from "@/components/locale";
import { PartnerLogos } from "@/components/partner-logos";
import { MANZIL_MENU_DOCK, MANZIL_MENU_SECTIONS } from "@/lib/manzil-menu-items";
import { MANZIL_APP_TAGLINE_EN } from "@/lib/manzil-intro-copy";

const dockIcons = { home: Home, book: BookOpen, offices: Landmark, faq: CircleHelp, contact: MessageSquareWarning } as const;

export function ManzilMenuFrame({ children }: { children: React.ReactNode }) {
  const { language } = useLocale();
  const pathname = usePathname();

  return (
    <div className="manzil-menu">
      <header className="manzil-menu__top">
        <div className="manzil-menu__top-inner">
          <PartnerLogos variant="intro" />
          <LanguageSwitch />
        </div>
      </header>

      <main id="main-content" className="manzil-menu__main">
        {children}
      </main>

      <nav className="manzil-menu__dock" aria-label={copy(language, "Main navigation", "\u0645\u0631\u06a9\u0632\u06cc \u0646\u06cc\u0648\u06cc\u06af\u06cc\u0634\u0646")}>
        {MANZIL_MENU_DOCK.map((item) => {
          const DockIcon = dockIcons[item.icon];
          const active = item.href === "/" ? pathname === "/" || pathname.startsWith("/menu") || pathname.startsWith("/guide") : pathname.startsWith(item.href);
          return <Link key={item.id} href={item.href} aria-current={active ? "page" : undefined} className={`manzil-menu__dock-link focus-ring${active ? " manzil-menu__dock-link--active" : ""}`}>
            <DockIcon size={19} aria-hidden strokeWidth={2} /><span className={item.id === "faq" ? "manzil-menu__dock-latin" : "urdu"} dir={item.id === "faq" ? "ltr" : undefined}>{copy(language, item.labelEn, item.labelUr)}</span>
          </Link>;
        })}
      </nav>
    </div>
  );
}

export function ManzilMainMenu() {
  const { language } = useLocale();

  return (
    <ManzilMenuFrame>
        <section className="manzil-menu__welcome" aria-labelledby="manzil-menu-title">
          <div className="manzil-menu__welcome-scene">
            <img src="/menu-icons/header-bg.jpg" alt="" />
          </div>
          <div className="manzil-menu__welcome-copy">
            <h1 id="manzil-menu-title" className="manzil-menu__welcome-title">Manzil</h1>
            <p className="manzil-menu__welcome-sub">{MANZIL_APP_TAGLINE_EN}</p>
            <p className={`manzil-menu__welcome-tag${language === "ur" ? " urdu" : ""}`} lang={language}>
              {copy(language, "A clearer path to a safer journey.", "\u0645\u062d\u0641\u0648\u0638 \u0633\u0641\u0631 \u06a9\u06cc \u0637\u0631\u0641 \u0627\u06cc\u06a9 \u0648\u0627\u0636\u062d \u0631\u0627\u0633\u062a\u06c1\u06d4")}
            </p>
          </div>
        </section>

        <nav className="manzil-menu__sections" aria-label={copy(language, "Migration topics", "\u0645\u0627\u0626\u06cc\u06af\u0631\u06cc\u0634\u0646 \u06a9\u06d2 \u0645\u0648\u0636\u0648\u0639\u0627\u062a")}>
          {MANZIL_MENU_SECTIONS.map((section) => (
            <Link key={section.id} href={`/menu/${section.id}`} className="manzil-menu__section-link focus-ring">
              <span className="manzil-menu__section-art">
                <img src={section.icon} alt="" className="manzil-menu__section-icon" />
              </span>
              <span className="manzil-menu__section-label urdu">{copy(language, section.titleEn, section.titleUr)}</span>
            </Link>
          ))}
        </nav>
    </ManzilMenuFrame>
  );
}
