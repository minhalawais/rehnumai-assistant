"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  ClipboardPen,
  Clock,
  Coins,
  FileCheck2,
  RotateCcw,
  Scale,
  Sparkles,
} from "lucide-react";
import { copy, useLocale } from "@/components/locale";

type BookletComingSoonProps = {
  variant?: "embedded" | "fullscreen";
  onBackToCover?: () => void;
};

export function BookletComingSoon({ variant = "embedded", onBackToCover }: BookletComingSoonProps) {
  const { language } = useLocale();
  const isUrdu = language === "ur";
  const BackIcon = isUrdu ? ArrowRight : ArrowLeft;
  const ForwardIcon = isUrdu ? ArrowLeft : ArrowRight;

  const features = [
    {
      id: "legal",
      icon: Scale,
      titleEn: "Legal vs. Irregular Pathways",
      titleUr: "قانونی بمقابلہ غیر قانونی طریقہ",
      descEn: "Severe risks of irregular 'Dunki' routes and protections of legal migration.",
      descUr: "ڈنکی کے جان لیوا نقصانات اور قانونی ویزا و ملازمت کے فوائد۔",
    },
    {
      id: "prep",
      icon: FileCheck2,
      titleEn: "Pre-Departure Checklist & CV",
      titleUr: "روانگی کی چیک لسٹ اور سی وی",
      descEn: "12 common CV mistakes, required documents, and airport procedures.",
      descUr: "سی وی میں عام غلطیاں، لازمی دستاویزات اور ایئرپورٹ کی احتیاطیں۔",
    },
    {
      id: "agencies",
      icon: Building2,
      titleEn: "Verified Overseas Promoters",
      titleUr: "تصدیق شدہ ایجنسیاں اور بیورو",
      descEn: "How to verify licensed OEPs via BEOE and OEC before paying fees.",
      descUr: "بی ای او ای اور او ای سی کے ذریعے لائسنس یافتہ ایجنسیوں کی جانچ۔",
    },
    {
      id: "rights",
      icon: Coins,
      titleEn: "Worker Rights & Remittances",
      titleUr: "مزدوروں کے حقوق اور ترسیلِ زر",
      descEn: "Fair wages, workplace rights abroad, safe banking, and return support.",
      descUr: "بیرون ملک تحفظ، قانونی بینکنگ چینلز اور وطن واپسی پر رہنمائی۔",
    },
  ];

  return (
    <div
      className={`booklet-coming-soon ${variant === "fullscreen" ? "booklet-coming-soon--fullscreen" : ""}`}
      role="region"
      aria-label={copy(language, "Booklet Digital Edition Coming Soon", "مکمل کتابچہ جلد دستیاب ہوگا")}
    >
      {/* Top Banner / Badge */}
      <div className="booklet-coming-soon__badge-row">
        <span className="booklet-coming-soon__badge">
          <Sparkles size={14} className="text-amber-500 animate-pulse" aria-hidden="true" />
          <span className="font-semibold tracking-wide uppercase text-[11px]">
            {copy(language, "Digital Edition 2.0 • In Preparation", "ڈیجیٹل ایڈیشن 2.0 • تیاری کے مراحل میں")}
          </span>
        </span>

        {onBackToCover && (
          <button
            type="button"
            onClick={onBackToCover}
            className="booklet-coming-soon__back-btn focus-ring"
            aria-label={copy(language, "Back to Cover (Page 1)", "سرورق پر واپس جائیں (صفحہ 1)")}
          >
            <RotateCcw size={14} aria-hidden="true" />
            <span>{copy(language, "Page 1: Cover", "صفحہ 1: سرورق")}</span>
          </button>
        )}
      </div>

      {/* Hero Headline & Lead */}
      <div className="booklet-coming-soon__hero">
        <div className="booklet-coming-soon__icon-bubble" aria-hidden="true">
          <BookOpen size={28} className="text-[var(--navy-900)]" />
          <span className="booklet-coming-soon__icon-indicator">
            <Clock size={12} className="text-white" />
          </span>
        </div>

        <h2 className="booklet-coming-soon__title urdu">
          {copy(language, "Complete Migration Booklet Coming Soon", "مکمل رہنمائی کتابچہ جلد دستیاب ہوگا")}
        </h2>

        <p className="booklet-coming-soon__lead urdu">
          {copy(
            language,
            "The official 53-page comprehensive migration guide is currently being finalized for digital release. While the full booklet is prepared, all topics and official resources are available through the interactive tools below.",
            "بیرون ملک محفوظ ملازمت اور قانونی سفر کی جامع رہنمائی پر مشتمل 53 صفحات کا باضابطہ کتابچہ جلد ڈیجیٹل شکل میں پیش کیا جا رہا ہے۔ فی الوقت تمام اہم موضوعات اور سرکاری معلومات نیچے دیے گئے ذرائع پر دستیاب ہیں۔",
          )}
        </p>
      </div>

      {/* Feature Preview Cards */}
      <div className="booklet-coming-soon__preview-section">
        <h3 className="booklet-coming-soon__section-title urdu">
          {copy(language, "What's inside the upcoming 53-page booklet:", "مکمل کتابچے میں شامل اہم موضوعات:")}
        </h3>

        <div className="booklet-coming-soon__grid">
          {features.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.id} className="booklet-coming-soon__card">
                <div className="booklet-coming-soon__card-icon" aria-hidden="true">
                  <Icon size={18} />
                </div>
                <div className="booklet-coming-soon__card-content">
                  <h4 className="booklet-coming-soon__card-title urdu">
                    {copy(language, item.titleEn, item.titleUr)}
                  </h4>
                  <p className="booklet-coming-soon__card-desc urdu">
                    {copy(language, item.descEn, item.descUr)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Interactive Alternatives - Instant Value */}
      <div className="booklet-coming-soon__actions-box">
        <div className="booklet-coming-soon__actions-header">
          <CheckCircle2 size={18} className="text-[var(--teal-700)] flex-none" aria-hidden="true" />
          <div className="min-w-0">
            <h4 className="font-semibold text-sm text-[var(--navy-950)] urdu">
              {copy(language, "Explore the guidance online right now:", "ویب سائٹ پر ابھی رہنمائی حاصل کریں:")}
            </h4>
            <p className="text-xs text-[var(--ink-700)] urdu mt-0.5">
              {copy(
                language,
                "The core chapters from the booklet are live in bite-sized interactive web modules.",
                "کتابچے کے تمام بنیادی اسباق آن لائن گائیڈز کی شکل میں موجود ہیں۔",
              )}
            </p>
          </div>
        </div>

        <div className="booklet-coming-soon__action-buttons">
          <Link href="/" className="btn-primary booklet-coming-soon__btn focus-ring">
            <BookOpen size={16} aria-hidden="true" />
            <span className="urdu">{copy(language, "Interactive Topic Guides", "مائیگریشن گائیڈز دیکھیں")}</span>
            <ForwardIcon size={16} aria-hidden="true" />
          </Link>

          <Link href="/support" className="btn-secondary booklet-coming-soon__btn focus-ring">
            <Building2 size={16} aria-hidden="true" />
            <span className="urdu">{copy(language, "Official Bodies & Contacts", "مددگار سرکاری ادارے")}</span>
          </Link>

          <Link href="/intake" className="btn-secondary booklet-coming-soon__btn focus-ring">
            <ClipboardPen size={16} aria-hidden="true" />
            <span className="urdu">{copy(language, "Submit Intake Form", "رہنمائی فارم جمع کریں")}</span>
          </Link>
        </div>
      </div>

      {/* Footer Navigation Back to Cover */}
      {onBackToCover && (
        <div className="booklet-coming-soon__footer">
          <button
            type="button"
            onClick={onBackToCover}
            className="booklet-coming-soon__bottom-return btn-quiet focus-ring"
          >
            <BackIcon size={16} aria-hidden="true" />
            <span className="urdu">{copy(language, "Return to Booklet Cover (Page 1)", "واپس کتابچے کے سرورق پر جائیں (صفحہ 1)")}</span>
          </button>
        </div>
      )}
    </div>
  );
}
