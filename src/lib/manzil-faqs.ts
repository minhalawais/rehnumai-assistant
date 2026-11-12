export type ManzilFaq = {
  id: string;
  questionEn: string;
  questionUr: string;
  paragraphsEn: string[];
  paragraphsUr: string[];
  bulletsEn?: string[];
  bulletsUr?: string[];
};

export const MANZIL_FAQ_SOURCES = [
  {
    id: "mrc",
    nameEn: "Migrant Resource Centre (MRC)",
    nameUr: "مائیگرینٹ ریسورس سینٹر (MRC)",
    links: [
      { href: "https://www.mrc.org.pk/en/", labelEn: "Centre website", labelUr: "ویب سائٹ", host: "mrc.org.pk/en" },
      { href: "https://www.mrc.org.pk/en/resources", labelEn: "Resources", labelUr: "معلوماتی مواد", host: "mrc.org.pk/en/resources" },
      { href: "https://www.mrc.org.pk/en/faq", labelEn: "More questions", labelUr: "مزید سوالات", host: "mrc.org.pk/en/faq" },
    ],
  },
  {
    id: "pgfrc",
    nameEn: "Pakistani-German Facilitation and Reintegration Centre (PGFRC)",
    nameUr: "پاکستانی جرمن سہولت اور انضمام مرکز (PGFRC)",
    links: [
      { href: "https://www.facebook.com/PGFRC/videos/", labelEn: "Videos", labelUr: "ویڈیوز", host: "facebook.com/PGFRC/videos" },
    ],
  },
] as const;

export const MANZIL_FAQS: ManzilFaq[] = [
  {
    id: "what-is-mrc",
    questionEn: "What is a guidance or resource centre (P/MRC)?",
    questionUr: "رہنمائی یا ریسورس سینٹر (P/MRC) کیا ہے؟",
    paragraphsEn: [
      "Migrant Resource and Guidance Centres (MRCs) give workers leaving Pakistan for work abroad, and workers coming back, the information and services they need. They help people understand the process, reach legal support, and use safer ways to travel.",
    ],
    paragraphsUr: [
      "مائیگرنٹ ریسورس اور رہنمائی سینٹر (MRCs) پاکستان سے بیرون ممالک جانے اور واپس آنے والے کارکنان کو اہم معلومات اور خدمات فراہم کرتے ہیں۔ یہ افراد کو بیرون ممالک جانے کے عمل کو سمجھنے، قانونی حمایت تک رسائی حاصل کرنے، اور محفوظ سفر کے طریقے یقینی بنانے میں مدد کرتے ہیں۔",
    ],
  },
  {
    id: "find-mrc",
    questionEn: "How can I find the nearest guidance or resource centre (MRC)?",
    questionUr: "نزدیک ترین رہنمائی یا ریسورس سینٹر (MRC) کیسے تلاش کر سکتا ہوں؟",
    paragraphsEn: [
      "A list of MRCs and PMRCs is included in this app for your help. You can also look up the same information on the internet with Google.",
    ],
    paragraphsUr: [
      "اس ایپ کے آخر میں آپ کی مدد کے لیے تمام MRCs اور PMRCs کی ایک فہرست فراہم کی گئی ہے۔ آپ اس معلومات کو Google کا استعمال کرتے ہوئے بھی انٹرنیٹ پر تلاش کر سکتے ہیں۔",
    ],
  },
  {
    id: "mrc-services",
    questionEn: "What services do MRCs provide?",
    questionUr: "MRCs کون سی خدمات فراہم کرتے ہیں؟",
    paragraphsEn: [],
    paragraphsUr: [],
    bulletsEn: [
      "Information on jobs abroad, safer ways to go, and legal requirements",
      "Legal help with documents and immigration matters",
      "Vocational training and skills development",
      "Counselling and psychological support for people who return",
      "Information on jobs and programmes for finding work again in your own country",
    ],
    bulletsUr: [
      "بیرون ملک ملازمت، محفوظ طریقوں اور قانونی ضروریات کے بارے میں معلومات",
      "دستاویزات اور امیگریشن کے مسائل کے لیے قانونی مدد",
      "پیشہ ورانہ تربیت اور مہارت کی ترقی کے وسائل",
      "واپس آنے والوں کے لیے مشاورت اور نفسیاتی مدد",
      "ملازمت کے مواقع اور دوبارہ اپنے ملک میں ملازمت حاصل کرنے کے پروگراموں کے بارے میں معلومات",
    ],
  },
  {
    id: "safer-departure",
    questionEn: "What can I do to keep the process of going abroad safe?",
    questionUr: "بیرون ممالک جانے کے عمل کو محفوظ بنانے کے لیے کیا اقدامات کیے جا سکتے ہیں؟",
    paragraphsEn: [
      "Research possible employers and destinations carefully, get help from a P/MRC, and make sure every required document is complete. Join the training programmes P/MRCs offer on a safer way to go abroad.",
    ],
    paragraphsUr: [
      "بیرون ممالک جانے کے عمل کو محفوظ بنانے کے لیے ممکنہ ملازمت دہندگان اور مقامات کی اچھی طرح تحقیق کریں، P/MRCs سے مدد حاصل کریں، اور یقینی بنائیں کہ تمام ضروری دستاویزات مکمل ہیں۔ P/MRCs کی پیش کردہ تربیتی پروگراموں میں حصہ لیں جو محفوظ بیرون ممالک جانے کے عمل پر توجہ مرکوز کرتے ہیں۔",
    ],
  },
  {
    id: "worker-rights",
    questionEn: "What rights do I have as a worker going abroad?",
    questionUr: "بطور بیرون ممالک جانے والے مزدور میرے پاس کیا حقوق ہیں؟",
    paragraphsEn: [
      "You have the right to fair treatment, proper working conditions, and access to legal help. Before you travel, learn your rights and the laws of the country you are going to.",
    ],
    paragraphsUr: [
      "بطور بیرون ممالک جانے والے کارکنان، آپ کو منصفانہ سلوک، مناسب کام کرنے کی شرائط، اور قانونی مدد تک رسائی کا حق حاصل ہے۔ سفر کرنے سے پہلے اپنے حقوق سے واقف ہونا ضروری ہے، اور میزبان ملک کے قوانین کے بارے میں آگاہ رہنا چاہیے۔",
    ],
  },
  {
    id: "return-support",
    questionEn: "What support is available for workers returning from abroad?",
    questionUr: "بیرون ممالک سے واپس آنے والے کارکنان کے لیے کون سی سہولت دستیاب ہے؟",
    paragraphsEn: [
      "Returning workers can use P/MRC services such as vocational training, help finding work, and reintegration programmes that support them as they settle back into their communities.",
    ],
    paragraphsUr: [
      "واپس آنے والے کارکنان P/MRCs کے ذریعے مختلف خدمات تک رسائی حاصل کر سکتے ہیں، بشمول پیشہ ورانہ تربیت، ملازمت کی مدد، اور دوبارہ شامل ہونے کے پروگرام جو انہیں اپنی کمیونٹیز میں ایڈجسٹ کرنے میں مدد دیتے ہیں۔",
    ],
  },
  {
    id: "exploitation",
    questionEn: "What should I do if I face exploitation while working abroad?",
    questionUr: "اگر میں نے غیر ملکی ملازمت کے دوران استحصال کا سامنا کیا تو مجھے کیا کرنا چاہیے؟",
    paragraphsEn: [
      "If you face exploitation or abuse while working abroad, contact your country’s embassy or consulate immediately. When you return, contact your local P/MRC so they can help with your situation.",
    ],
    paragraphsUr: [
      "اگر آپ نے غیر ملکی ملازمت کے دوران استحصال یا زیادتی کا سامنا کیا تو فوری طور پر اپنے ملک کے سفارت خانے یا قونصل خانے سے مدد حاصل کریں۔ اپنی واپسی پر اپنی مقامی P/MRC سے رابطہ کریں تاکہ آپ کی صورتحال کو حل کرنے میں مدد ملے۔",
    ],
  },
  {
    id: "financial-help",
    questionEn: "Is financial help available through P/MRCs?",
    questionUr: "کیا P/MRCs کے ذریعے مالی مدد دستیاب ہے؟",
    paragraphsEn: [
      "P/MRCs do not usually give money directly. They can connect you with programmes that do help, including skills training that can improve your chances of finding work.",
    ],
    paragraphsUr: [
      "P/MRCs عام طور پر براہ راست مالی مدد فراہم نہیں کرتے، لیکن وہ آپ کو ایسے پروگراموں اور وسائل سے جوڑ سکتے ہیں جو مدد فراہم کر سکتے ہیں، جیسے مہارت کی تربیت کے پروگرام جو آپ کے ملازمت کے امکانات کو بہتر بنا سکتے ہیں۔",
    ],
  },
  {
    id: "training-enrolment",
    questionEn: "How do I join a vocational training programme offered by a P/MRC?",
    questionUr: "P/MRCs کی پیش کردہ پیشہ ورانہ تربیت میں داخلہ کیسے لیا جا سکتا ہے؟",
    paragraphsEn: [
      "Visit your nearest P/MRC and ask about the courses on offer, how to register, and whether the training has a cost.",
    ],
    paragraphsUr: [
      "پیشہ ورانہ تربیت کے پروگراموں میں داخلہ لینے کے لیے اپنے قریب ترین P/MRC کا دورہ کریں۔ وہاں دستیاب کورسز، رجسٹریشن کا طریقہ، اور تربیت کے ممکنہ اخراجات کے بارے میں معلومات حاصل کریں۔",
    ],
  },
  {
    id: "rules-info",
    questionEn: "Where can I find more detail on working abroad and travel rules?",
    questionUr: "بیرون ممالک ملازمت اور سفری قوانین کے بارے میں مزید تفصیل کہاں ملے گی؟",
    paragraphsEn: [
      "Use the official websites of the government bodies responsible for these rules, including Pakistan’s BEOE and OEC. P/MRC staff can also explain the current policy.",
    ],
    paragraphsUr: [
      "ان قوانین کے بارے میں تفصیلی معلومات کے لیے متعلقہ حکومتی اداروں کی سرکاری ویب سائٹس دیکھیں، جیسے پاکستان کا BEOE اور OEC۔ P/MRC کا عملہ بھی موجودہ پالیسیوں پر تازہ ترین معلومات اور رہنمائی دے سکتا ہے۔",
    ],
  },
  {
    id: "complain-pakistan",
    questionEn: "How do I complain about an agent’s irregularities in Pakistan?",
    questionUr: "میں پاکستان میں کسی ایجنٹ کے خلاف بے ضابطگی کی شکایت کیسے درج کراؤں؟",
    paragraphsEn: [
      "File the complaint on the BEOE website, under Contact. It should be answered promptly. You can also file it on the MOPHRD website, or contact an MRC about the complaint.",
    ],
    paragraphsUr: [
      "شکایت BEOE کی ویب سائٹ پر، رابطہ کے تحت، درج کی جا سکتی ہے، اور اس کا فوری جواب دیا جاتا ہے۔ شکایت MOPHRD کی ویب سائٹ پر بھی درج کی جا سکتی ہے، اور MRCs سے بھی شکایات کے لیے رابطہ کیا جا سکتا ہے۔",
    ],
  },
  {
    id: "complain-abroad",
    questionEn: "How do I file that complaint from outside Pakistan?",
    questionUr: "میں پاکستان سے باہر یہ شکایت کیسے درج کراؤں؟",
    paragraphsEn: [
      "MOPHRD has named Community Welfare Attachés (CWAs) in different countries to hear workers’ complaints and respond. The list of CWAs is in the Complaints section of this app, including the contact number of the officer for your country.",
    ],
    paragraphsUr: [
      "MOPHRD نے مختلف ممالک میں کارکنوں کی شکایات سننے اور جواب دینے کے لیے CWAs کو نامزد کیا ہے۔ CWAs کی فہرست اس ایپ کے شکایات والے حصے میں موجود ہے، جہاں سے اپنے متعلقہ افسر کا رابطہ نمبر لیا جا سکتا ہے۔",
    ],
  },
];
