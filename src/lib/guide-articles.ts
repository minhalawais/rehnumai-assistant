import articles from "@/lib/guide-articles.json";

export type GuideBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "list"; items: string[] }
  | { type: "img"; src: string; alt: string }
  | { type: "table"; rows: string[][] };

export const GUIDE_ARTICLES = articles as Record<string, GuideBlock[]>;
