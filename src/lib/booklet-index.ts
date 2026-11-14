/** PDF page targets (1-based) aligned with `public/migration-booklet.pdf` (REVISWED-231026). */

export type BookletIndexGroup = { en: string; ur: string };
export type BookletIndexEntry = {
  id: string;
  page: number;
  title: { en: string; ur: string };
  group: BookletIndexGroup;
};

export const BOOKLET_INDEX_GROUPS: BookletIndexGroup[] = [
  { en: "Part 1 · Preparation for work abroad", ur: "حصہ ۱ · بیرون ممالک ملازمت کی تیاری" },
  { en: "Part 2 · Employment and living abroad", ur: "حصہ ۲ · بیرون ممالک ملازمت اور رہائش" },
  { en: "Part 3 · Remittances and return", ur: "حصہ ۳ · رقوم کی منتقلی اور واپسی" },
  { en: "Reference", ur: "حوالہ جات" },
];

export const BOOKLET_INDEX: BookletIndexEntry[] = [
  { id: "preface", page: 2, group: BOOKLET_INDEX_GROUPS[0], title: { en: "Preface", ur: "پیش لفظ" } },
  { id: "migration-trends", page: 5, group: BOOKLET_INDEX_GROUPS[0], title: { en: "Labour migration trends", ur: "بیرون ممالک ملازمت کے رجحانات" } },
  { id: "unsafe-migration", page: 6, group: BOOKLET_INDEX_GROUPS[0], title: { en: "Risks of illegal migration", ur: "غیر قانونی ہجرت کے خطرات" } },
  { id: "planning", page: 9, group: BOOKLET_INDEX_GROUPS[0], title: { en: "Planning and documents", ur: "منصوبہ بندی اور دستاویزات" } },
  { id: "legal-channels", page: 12, group: BOOKLET_INDEX_GROUPS[0], title: { en: "Choosing legal channels (BEOE/OEP)", ur: "قانونی چینل کا انتخاب" } },
  { id: "women-safety", page: 14, group: BOOKLET_INDEX_GROUPS[0], title: { en: "Safety guidance for women migrants", ur: "خواتین مائیگرینٹس — حفاظتی ہدایات" } },
  { id: "pre-departure", page: 17, group: BOOKLET_INDEX_GROUPS[1], title: { en: "Pre-departure checklist", ur: "روانگی سے پہلے کلیرنس اور چیک لسٹ" } },
  { id: "travel", page: 18, group: BOOKLET_INDEX_GROUPS[1], title: { en: "Safe travel guidance", ur: "محفوظ سفر" } },
  { id: "arrival", page: 20, group: BOOKLET_INDEX_GROUPS[1], title: { en: "Arrival and living abroad", ur: "بیرون ملک آمد اور قیام" } },
  { id: "rights", page: 24, group: BOOKLET_INDEX_GROUPS[1], title: { en: "Worker rights and sponsor duties", ur: "کارکنان کے حقوق اور ذمہ داریاں" } },
  { id: "remittance", page: 33, group: BOOKLET_INDEX_GROUPS[2], title: { en: "Formal remittance channels", ur: "قانونی ترسیلات زر کے چینلز" } },
  { id: "return", page: 36, group: BOOKLET_INDEX_GROUPS[2], title: { en: "Return and reintegration roadmap", ur: "واپسی اور دوبارہ انضمام" } },
  { id: "annex-centers", page: 43, group: BOOKLET_INDEX_GROUPS[3], title: { en: "Annex · Rehnumai centers", ur: "ضمیمہ · رہنمائی مراکز" } },
  { id: "annex-complaints", page: 50, group: BOOKLET_INDEX_GROUPS[3], title: { en: "Annex · Complaint mechanisms", ur: "ضمیمہ · شکایت کے طریقے" } },
];

/** Set when the user closes the mobile contents overlay (legacy; no longer auto-opens on visit). */
export const BOOKLET_INDEX_SESSION_KEY = "rehnumai_booklet_index_intro";
