/** Public URL for the booklet PDF (copy of `docs/00 Migration Booklet (REVISWED-231026).pdf`). */
export const BOOKLET_PDF_PATH = "/migration-booklet.pdf";

/** Total pages in REVISWED-231026 booklet (used when native PDF viewer skips PDF.js). */
export const BOOKLET_PAGE_COUNT = 53;

/** Source filename in `docs/` for traceability (not shown in the public UI). */
export const BOOKLET_SOURCE_FILENAME = "00 Migration Booklet (REVISWED-231026).pdf";

/** Cover copy aligned with page 1 of the official booklet. */
export const BOOKLET_COVER = {
  tag: { en: "Employment abroad", ur: "بیرون ملک ملازمت" },
  title: { en: "Safe journey, bright future", ur: "محفوظ سفر روشن مستقبل" },
  subtitle: {
    en: "Information booklet for people wishing to work abroad",
    ur: "بیرون ملک ملازمت کے خواہشمند افراد کیلئے معلوماتی کتابچہ",
  },
} as const;
