import articles from "@/lib/guide-articles.json";

export type GuideBlock =
  | { type: "p"; text: string }
  | { type: "h"; text: string }
  | { type: "list"; items: string[] };

export const GUIDE_ARTICLES = articles as Record<string, GuideBlock[]>;
