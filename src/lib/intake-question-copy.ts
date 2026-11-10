/** Full-sentence intake prompts (EN / Urdu) — single source for mobile and desktop. */
export type IntakeQuestionCopy = { en: string; ur: string };

export const intakeQuestionCopy = {
  migrantCategory: {
    en: "Are you planning to work abroad, or have you returned from abroad?",
    ur: "کیا آپ بیرون ملک کام کرنے کا ارادہ رکھتے ہیں، یا بیرون ملک سے واپس آ چکے ہیں؟",
  },
  fullName: {
    en: "What is your full name?",
    ur: "آپ کا پورا نام کیا ہے؟",
  },
  primaryPhone: {
    en: "What is your mobile number?",
    ur: "آپ کا موبائل نمبر کیا ہے؟",
  },
  email: {
    en: "What is your email address?",
    ur: "آپ کا ای میل پتہ کیا ہے؟",
  },
  city: {
    en: "Which city do you live in?",
    ur: "آپ کس شہر میں رہتے ہیں؟",
  },
  address: {
    en: "What is your home address?",
    ur: "آپ کے گھر کا پتہ کیا ہے؟",
  },
  fatherHusbandName: {
    en: "What is your father's or husband's name?",
    ur: "آپ کے والد یا شوہر کا نام کیا ہے؟",
  },
  gender: {
    en: "What is your gender?",
    ur: "آپ کی جنس کیا ہے؟",
  },
  maritalStatus: {
    en: "What is your marital status?",
    ur: "آپ کی ازدواجی حیثیت کیا ہے؟",
  },
  religion: {
    en: "What is your religion?",
    ur: "آپ کا مذہب کیا ہے؟",
  },
  cnic: {
    en: "What is your CNIC number?",
    ur: "آپ کا شناختی کارڈ نمبر کیا ہے؟",
  },
  passportNo: {
    en: "What is your passport number?",
    ur: "آپ کا پاسپورٹ نمبر کیا ہے؟",
  },
  passportNoAlt: {
    en: "Do you have a second passport? If yes, what is its number?",
    ur: "کیا آپ کے پاس کوئی دوسرا پاسپورٹ ہے؟ اگر ہے تو اس کا نمبر کیا ہے؟",
  },
  qualification: {
    en: "What is your highest level of education?",
    ur: "آپ کی سب سے زیادہ تعلیم کیا ہے؟",
  },
  tradeSkill: {
    en: "What trade or skill do you have?",
    ur: "آپ کا پیشہ یا ہنر کیا ہے؟",
  },
  countryReturnFrom: {
    en: "Which country did you return from?",
    ur: "آپ کس ملک سے واپس آئے ہیں؟",
  },
  reasonForReturning: {
    en: "Why did you return to Pakistan?",
    ur: "آپ پاکستان کیوں واپس آئے؟",
  },
  dateOfReturn: {
    en: "When did you return to Pakistan?",
    ur: "آپ کب پاکستان واپس آئے؟",
  },
  currentStatus: {
    en: "What are you doing now?",
    ur: "ابھی آپ کیا کر رہے ہیں؟",
  },
  bankAccountMode: {
    en: "Do you have a bank account in your own name?",
    ur: "کیا آپ کے اپنے نام پر بینک اکاؤنٹ ہے؟",
  },
  bankRelation: {
    en: "Whose account is it, and how are you related to that person?",
    ur: "اکاؤنٹ کس کے نام پر ہے، اور آپ کا اس شخص سے کیا رشتہ ہے؟",
  },
  bankName: {
    en: "Which bank is the account with?",
    ur: "یہ اکاؤنٹ کس بینک میں ہے؟",
  },
  accountTitle: {
    en: "Whose name appears on the bank account?",
    ur: "بینک اکاؤنٹ پر کس کا نام درج ہے؟",
  },
  iban: {
    en: "What is the account IBAN? (24 digits)",
    ur: "اس اکاؤنٹ کا آئی بین نمبر کیا ہے؟ (24 ہندسے)",
  },
  review: {
    en: "Please review your answers before you submit.",
    ur: "جمع کرانے سے پہلے اپنے جوابات ایک بار پڑھ لیں۔",
  },
} as const satisfies Record<string, IntakeQuestionCopy>;
