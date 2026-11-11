export type ContactLink = { text: string; href: string };

export type ContactFact = {
  labelUr: string;
  labelEn: string;
  value?: string;
  href?: string;
  links?: ContactLink[];
};

export type ContactEntry = {
  id: string;
  titleUr: string;
  titleEn: string;
  office: string;
  note?: string;
  facts: ContactFact[];
  more?: { titleUr: string; titleEn: string; facts: ContactFact[] };
};

const tel = (value: string) => `tel:${value.replace(/[^\d+]/g, "")}`;
const web = (value: string) => (value.startsWith("http") ? value : `https://${value}`);
const mail = (value: string) => `mailto:${value}`;

/** Complaint contacts from booklet annex 4. English values stay in source order. */
export const CONTACT_ENTRIES: ContactEntry[] = [
  {
    id: "beoe",
    titleUr: "رجسٹرڈ ایجنٹ یا آجر کے خلاف شکایت",
    titleEn: "Complaint against registered agents or employers",
    office: "Bureau of Emigration and Overseas Employment (BEOE)",
    facts: [
      { labelUr: "فون", labelEn: "Tel", value: "+92-51-910-7267", href: tel("+92-51-910-7267") },
      { labelUr: "واٹس ایپ", labelEn: "WhatsApp", value: "+92-332-9107265", href: tel("+92-332-9107265") },
      { labelUr: "ای میل", labelEn: "Email", value: "complaints@beoe.gov.pk", href: mail("complaints@beoe.gov.pk") },
      { labelUr: "پتہ", labelEn: "Address", value: "Bureau of Emigration & Overseas Employment, Emigration Tower, Plot No. 10, Mauve Area, G-8/1, Islamabad, Pakistan" },
      { labelUr: "آن لائن شکایت", labelEn: "Online complaint", value: "beoe.gov.pk/feedback-complaints", href: web("https://beoe.gov.pk/feedback-complaints") },
    ],
  },
  {
    id: "ombudsman",
    titleUr: "وفاقی وزارتوں یا محکموں کے خلاف شکایت",
    titleEn: "Complaints against Federal Ministries or Departments",
    office: "Grievance Commissioner for Overseas Pakistanis, Federal Ombudsman",
    facts: [
      { labelUr: "فون", labelEn: "Tel", value: "+92 51 9217243", href: tel("+92 51 9217243") },
      { labelUr: "فیکس", labelEn: "Fax", value: "+92 51 9217256", href: tel("+92 51 9217256") },
      { labelUr: "پتہ", labelEn: "Address", value: "Federal (Wafaqi Mohtasib) Ombudsman Secretariat, 36-Constitution Avenue, G-5/2, Islamabad, Pakistan." },
      { labelUr: "آن لائن شکایت", labelEn: "Online complaint", value: "mohtasib.gov.pk", href: web("https://www.mohtasib.gov.pk/Detail/NWRkZDJmMTYtZmRiOC00MTAyLTk2ZDItZGVlNTkxMTdmNTEz") },
      { labelUr: "ویب سائٹ", labelEn: "Website", value: "ombudsman.gov.pk", href: web("www.ombudsman.gov.pk") },
      { labelUr: "فوکل پرسنز", labelEn: "Focal persons", value: "mohtasib.gov.pk", href: web("https://www.mohtasib.gov.pk/Detail/OTU2NTEzNTItNDNlNi00MTIxLTliNzgtMGQ3ZDc1NjdmM2Fm") },
    ],
  },
  {
    id: "fia",
    titleUr: "غیر رجسٹرڈ ایجنٹ کے خلاف شکایت",
    titleEn: "Complaint against unregistered agents",
    office: "Federal Investigation Agency (FIA)",
    facts: [
      { labelUr: "فون", labelEn: "Tel", value: "+92 051 111 345 786", href: tel("+92 051 111 345 786") },
      { labelUr: "پتہ", labelEn: "Headquarter", value: "FIA Headquarters, Muhammad Tufail Niazi Rd, G 9/4, Islamabad, PK" },
      { labelUr: "علاقائی رابطہ", labelEn: "Regional contact", value: "fia.gov.pk/contact", href: web("https://www.fia.gov.pk/contact") },
      { labelUr: "مقامی شکایت", labelEn: "Local complaints", value: "fia.gov.pk/complaints", href: web("https://www.fia.gov.pk/complaints_dept") },
      { labelUr: "بیرون ملک شکایت", labelEn: "Overseas complaints", value: "fia.gov.pk/overseas", href: web("https://www.fia.gov.pk/overseas") },
      { labelUr: "ای میل", labelEn: "Email", value: "complaints@fia.gov.pk", href: mail("complaints@fia.gov.pk") },
      { labelUr: "ویب سائٹ", labelEn: "Website", value: "fia.gov.pk", href: web("www.fia.gov.pk") },
    ],
  },
  {
    id: "mophrd",
    titleUr: "شکایت کے حل کا نظام",
    titleEn: "Complaint resolution system",
    office: "Ministry of Overseas Pakistanis and Human Resource Development (MOPHRD)",
    facts: [
      {
        labelUr: "ای میل",
        labelEn: "Email",
        links: [
          { text: "ac.complaint@ophrd.gov.pk", href: mail("ac.complaint@ophrd.gov.pk") },
          { text: "ds.complaint@ophrd.gov.pk", href: mail("ds.complaint@ophrd.gov.pk") },
        ],
      },
      { labelUr: "فون", labelEn: "Tel", value: "051-9208581", href: tel("051-9208581") },
      { labelUr: "ڈپٹی سیکرٹری", labelEn: "Deputy Secretary", value: "051-9201097", href: tel("051-9201097") },
      { labelUr: "شکایت سیکشن", labelEn: "Complaint section", value: "051-9201096", href: tel("051-9201096") },
      { labelUr: "پتہ", labelEn: "In person", value: "Assistant Chief (Complaint Cell), 9th Floor, Kohsar Complex, Islamabad." },
      { labelUr: "پورٹل", labelEn: "Citizen portal", value: "citizenportal.gov.pk", href: web("https://web.citizenportal.gov.pk/") },
    ],
  },
  {
    id: "opf",
    titleUr: "خلیجی ممالک سے ملازمت کی شکایت",
    titleEn: "Employment complaints from the Gulf",
    office: "OPF Complaint Cell",
    note: "Open since June 2001 for overseas Pakistanis, especially workers in Gulf countries. Complaints come from government offices, Pakistani missions, and people themselves. Available 24/7.",
    facts: [
      { labelUr: "ای میل", labelEn: "Email", value: "complaints@opf.org.pk", href: mail("complaints@opf.org.pk") },
      { labelUr: "فون", labelEn: "UAN", value: "+92-51-111-040-040", href: tel("+92-51-111-040-040") },
      {
        labelUr: "واٹس ایپ",
        labelEn: "WhatsApp",
        links: [
          { text: "+92-301-9872195", href: tel("+92-301-9872195") },
          { text: "+92-306-0329901", href: tel("+92-306-0329901") },
        ],
      },
      { labelUr: "آن لائن شکایت", labelEn: "Online complaint", value: "opf.pitb.gov.pk", href: web("https://opf.pitb.gov.pk/index.php/") },
    ],
    more: {
      titleUr: "انشورنس اور موت کا کلیم",
      titleEn: "Insurance and death claim",
      facts: [
        { labelUr: "فون", labelEn: "Tel", value: "+92 51 9203267", href: tel("+92 51 9203267") },
        { labelUr: "پتہ", labelEn: "Address", value: "OPF, Head Office Building Shahrah-e-Jamhuriat, Sector G-5/2, Islamabad, Pakistan" },
        { labelUr: "ای میل", labelEn: "Email", value: "info@opf.org.pk", href: mail("info@opf.org.pk") },
        { labelUr: "ویب سائٹ", labelEn: "Website", value: "opf.org.pk", href: web("www.opf.org.pk") },
      ],
    },
  },
];
