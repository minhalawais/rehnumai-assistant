export type ManzilMenuIndex = {
  id: string;
  page: number;
  titleEn: string;
  titleUr: string;
};

export type ManzilMenuGroup = {
  id: string;
  titleEn: string;
  titleUr: string;
  items: ManzilMenuIndex[];
};

export type ManzilMenuSection = {
  id: string;
  icon: string;
  titleEn: string;
  titleUr: string;
  groups: ManzilMenuGroup[];
};

export const MANZIL_MENU_SECTIONS: ManzilMenuSection[] = [
  {
    id: "prepare",
    icon: "/menu-icons/section-prepare.jpg",
    titleEn: "Prepare for work abroad",
    titleUr: "بیرون ممالک ملازمت کی تیاری",
    groups: [
      {
        id: "trends",
        titleEn: "Trends in work abroad",
        titleUr: "بیرون ممالک ملازمت کے رجحانات",
        items: [
          { id: "legal-vs-illegal", page: 5, titleEn: "Benefits and costs of legal and illegal routes", titleUr: "قانونی اور غیر قانونی طریقے سے بیرون ممالک ملازمت کے فوائد اور نقصان" },
          { id: "dunki", page: 6, titleEn: "The reality and costs of illegal routes (dunki)", titleUr: "غیر قانونی طریقے (ڈنکی کے ذریعے) سے بیرون ممالک جانے کی حقیقت اور نقصانات" },
          { id: "psychological", page: 7, titleEn: "Psychological effects on people who migrate illegally", titleUr: "غیر قانونی تارکین وطن کو متاثر کرنے والے نفسیاتی عوامل" },
        ],
      },
      {
        id: "planning",
        titleEn: "Labour migration planning",
        titleUr: "لیبر مائیگریشن (Labour Migration)۔ بیرون ملک جانے کی پلاننگ",
        items: [
          { id: "documents", page: 9, titleEn: "Documents needed for work abroad", titleUr: "بیرون ممالک ملازمت کیلئے ضروری دستاویزات" },
          { id: "skills-review", page: 9, titleEn: "Review of your skills and education", titleUr: "ذاتی مہارتوں اور تعلیم کا جائزہ" },
          { id: "cv", page: 10, titleEn: "Writing a CV", titleUr: "سی وی بنانا" },
          { id: "cv-mistakes", page: 10, titleEn: "12 mistakes repeated in a CV", titleUr: "سی وی (CV) میں دہرائی جانے والی ۱۲ غلطیاں" },
          { id: "cv-europe", page: 11, titleEn: "CV for Europe and Germany", titleUr: "یورپ اور جرمنی کیلئے سی وی بنانا" },
          { id: "language", page: 11, titleEn: "Language skills", titleUr: "زبان کی مہارتیں" },
          { id: "job-search", page: 12, titleEn: "Searching for work abroad", titleUr: "بیرون ممالک ملازمت کی تلاش" },
          { id: "beoe", page: 12, titleEn: "BEOE", titleUr: "بی ای او ای (BEOE)" },
          { id: "oep", page: 12, titleEn: "Choosing OEPs and private employment agencies", titleUr: "اوورسیز ایمپلائمنٹ پروموٹرز (OEPs) اور پرائیویٹ ایمپلائمنٹ ایجنسیز کا انتخاب" },
          { id: "oec", page: 13, titleEn: "Overseas Employment Corporation", titleUr: "اوورسیز ایمپلائمنٹ کارپوریشن" },
          { id: "visit-visa", page: 13, titleEn: "Never buy a visit visa", titleUr: "وزٹ ویزہ کبھی نہ خریدیں" },
          { id: "women", page: 14, titleEn: "Women seeking work abroad", titleUr: "بیرون ممالک ملازمت کے خواہشمند خواتین" },
          { id: "destination", page: 15, titleEn: "Information about the destination", titleUr: "منزل مقصود کے بارے میں معلومات" },
          { id: "obstacles", page: 16, titleEn: "Items that can block your journey", titleUr: "سفر میں رکاوٹ بننے والی اشیاء" },
        ],
      },
      {
        id: "departure",
        titleEn: "Departure",
        titleUr: "بیرون ملک روانگی",
        items: [
          { id: "self-check", page: 17, titleEn: "Personal check before work abroad", titleUr: "بیرون ملک ملازمت کیلئے ذاتی جانچ" },
          { id: "departure-requirements", page: 17, titleEn: "Required steps before departure", titleUr: "روانگی کے لازمی تقاضے" },
          { id: "checklist", page: 17, titleEn: "Departure checklist", titleUr: "روانگی کی چیک لسٹ" },
          { id: "airport", page: 18, titleEn: "Airport precautions on departure", titleUr: "بیرون ملک روانگی۔ ایئر پورٹ کی احتیاطیں" },
        ],
      },
    ],
  },
  {
    id: "work",
    icon: "/menu-icons/section-work.jpg",
    titleEn: "Arrival and stay abroad",
    titleUr: "بیرون ملک آمد اور قیام",
    groups: [
      {
        id: "arrival",
        titleEn: "Arrival and airport precautions",
        titleUr: "بیرون ملک آمد۔ ایئر پورٹ کی احتیاطیں",
        items: [
          { id: "employer", page: 20, titleEn: "Who is the employer?", titleUr: "آجر کون؟" },
          { id: "culture", page: 21, titleEn: "Cultural and ethical values", titleUr: "ثقافتی اور اخلاقی اقدار" },
          { id: "respect-laws", page: 22, titleEn: "Why respect for local culture and law matters", titleUr: "غیر ملکی ثقافت، قوانین کا احترام کیوں ضروری ہے۔ ایک تلخ تجربہ" },
          { id: "rights", page: 24, titleEn: "Workers' rights and responsibilities", titleUr: "کارکنان کے حقوق اور ذمہ داریاں" },
          { id: "workplace-rights", page: 24, titleEn: "Rights at work and the employer's duties", titleUr: "کام کے دوران کارکنان کے حقوق اور آجر کی ذمہ داریاں" },
          { id: "authorities", page: 25, titleEn: "Cooperating with law-enforcement bodies", titleUr: "قانون نافذ کرنے والے اداروں سے تعاون" },
          { id: "reminders", page: 26, titleEn: "Important reminders", titleUr: "اہم یاد دہانیاں" },
          { id: "health", page: 27, titleEn: "Your life comes first", titleUr: "جان ہے تو جہان ہے" },
          { id: "digital", page: 28, titleEn: "Digital literacy", titleUr: "ڈیجیٹل خواندگی" },
          { id: "smartphone", page: 30, titleEn: "Smartphones and workers abroad", titleUr: "سمارٹ فون (Smart Phone) اور بیرون ملک کارکنان" },
          { id: "residency", page: 31, titleEn: "Permanent residence or nationality", titleUr: "مستقل رہائش یا نیشنلٹی" },
        ],
      },
      {
        id: "remittance",
        titleEn: "Ways to send money (remittances)",
        titleUr: "رقوم کی منتقلی کے ذرائع (Remittances)",
        items: [
          { id: "formal-informal", page: 33, titleEn: "Benefits and costs of formal and informal transfers", titleUr: "رسمی اور غیر رسمی طریقوں سے رقم بھیجنے کے فوائد و نقصانات" },
          { id: "private-companies", page: 34, titleEn: "Private companies", titleUr: "نجی کمپنیاں" },
        ],
      },
    ],
  },
  {
    id: "return",
    icon: "/menu-icons/section-return.jpg",
    titleEn: "Roadmap for return to Pakistan",
    titleUr: "پاکستان واپسی کا روڈمیپ",
    groups: [
      {
        id: "return-roadmap",
        titleEn: "Roadmap for return to Pakistan",
        titleUr: "پاکستان واپسی کا روڈمیپ",
        items: [
          { id: "return-prep", page: 36, titleEn: "Preparing to return to Pakistan", titleUr: "پاکستان واپسی کی تیاری" },
          { id: "reintegration", page: 37, titleEn: "Return and reintegration", titleUr: "وطن واپسی اور انضمام" },
          { id: "return-support", page: 38, titleEn: "Help and facilities on return", titleUr: "وطن واپسی پر مدد اور سہولت" },
        ],
      },
    ],
  },
];

export function getManzilMenuSection(id: string) {
  return MANZIL_MENU_SECTIONS.find((section) => section.id === id);
}

export function findManzilIndex(id: string) {
  for (const section of MANZIL_MENU_SECTIONS) {
    const items = section.groups.flatMap((group) => group.items.map((item) => ({ group, item })));
    const index = items.findIndex((entry) => entry.item.id === id);
    if (index >= 0) {
      return {
        section,
        group: items[index].group,
        item: items[index].item,
        prev: items[index - 1]?.item,
        next: items[index + 1]?.item,
      };
    }
  }
}

export const MANZIL_MENU_DOCK = [
  { id: "home", href: "/", icon: "home" as const, labelEn: "Home", labelUr: "ہوم" },
  { id: "booklet", href: "/booklet", icon: "book" as const, labelEn: "Full booklet", labelUr: "مکمل کتابچہ" },
  { id: "support", href: "/support", icon: "offices" as const, labelEn: "Official bodies", labelUr: "مددگار سرکاری ادارے" },
  { id: "faq", href: "/faq", icon: "faq" as const, labelEn: "FAQs", labelUr: "FAQs" },
  { id: "contact", href: "/contact", icon: "contact" as const, labelEn: "Complaints", labelUr: "شکایات" },
] as const;
