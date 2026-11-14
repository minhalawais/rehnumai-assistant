import articles from "@/lib/guide-articles.json";

export type GuidePortal = { name: string; url: string; logo: string };

export type GuideOrgCard = { logo: string; text?: string; name?: string; href: string; website?: string; phone?: string };

export type GuideBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "list"; items: string[]; variant?: "warning" | "info" }
  | { type: "portals"; items: GuidePortal[] }
  | { type: "callout"; title: string; url: string }
  | { type: "org-cards"; title?: string; compact?: boolean; items: GuideOrgCard[] }
  | { type: "img"; src: string; alt: string; display?: "content" | "compact" }
  | { type: "table"; rows: string[][] }
  | { type: "dual-checklist"; leftTitle: string; rightTitle: string; left: string[]; right: string[] }
  | {
      type: "airport-guide";
      banner: string;
      precautions: string[];
      photo: string;
      warnings: string[];
      warningIcon: string;
    }
  | { type: "arrival-airport-guide"; banner: string; steps: string[]; photo?: string }
  | {
      type: "employer-sponsor";
      sponsorIntro: string[];
      sponsorPhoto: string;
      sponsorNote: string;
      grid: { text: string; icon: string }[][];
    }
  | {
      type: "respect-laws-guide";
      intro: string;
      images: string[];
      tableTitle: string;
      columns: { title: string; text: string }[];
    }
  | {
      type: "worker-rights-guide";
      intro: string;
      image: string;
      rightsTitle: string;
      rights: string[];
      dutiesTitle: string;
      duties: string[];
    }
  | {
      type: "workplace-rights-guide";
      workersTitle: string;
      workers: { text: string; icon: string }[];
      employersTitle: string;
      employers: { text: string; icon: string }[];
    }
  | {
      type: "smartphone-guide";
      sectionTitle: string;
      apps: { name: string; logo: string; purpose: string; benefits: string[] }[];
      warning: { title: string; body: string };
    }
  | {
      type: "remittance-channels-guide";
      image: string;
      alt: string;
      footer: string;
    }
  | {
      type: "private-companies-guide";
      intro: string;
      officePhoto: string;
      westernUnionUrl: string;
      followUp: string;
      transferPhoto: string;
      brandsImage?: string;
    }
  | {
      type: "reintegration-guide";
      intro: string;
      roadmapImage: string;
      steps: { num: string; title: string; detail: string }[];
    };

export const GUIDE_ARTICLES = articles as Record<string, GuideBlock[]>;
