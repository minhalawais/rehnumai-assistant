"use client";

import {
  BookOpen,
  Building2,
  Clock,
  Coins,
  FileCheck2,
  Scale,
} from "lucide-react";
import { copy, useLocale } from "@/components/locale";

type BookletComingSoonProps = {
  variant?: "embedded" | "fullscreen";
};

export function BookletComingSoon({ variant = "embedded" }: BookletComingSoonProps) {
  const { language } = useLocale();
  const isUrdu = language === "ur";

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
      dir={isUrdu ? "rtl" : "ltr"}
      className={`booklet-coming-soon ${isUrdu ? "booklet-coming-soon--rtl" : "booklet-coming-soon--ltr"} ${
        variant === "fullscreen" ? "booklet-coming-soon--fullscreen" : ""
      }`}
      role="region"
      aria-label={copy(language, "Booklet Digital Edition Coming Soon", "مکمل کتابچہ جلد دستیاب ہوگا")}
    >
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
            "The official 53-page comprehensive migration guide is currently being finalized for digital release. It covers overseas employment, legal pathways, worker rights, and pre-departure checklists.",
            "بیرون ملک محفوظ ملازمت اور قانونی سفر کی جامع رہنمائی پر مشتمل 53 صفحات کا باضابطہ کتابچہ جلد ڈیجیٹل شکل میں پیش کیا جا رہا ہے۔",
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
    </div>
  );
}
