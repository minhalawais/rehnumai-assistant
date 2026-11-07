import type { MetadataRoute } from "next";
import { resolveMetadataBase } from "@/lib/site-metadata";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = resolveMetadataBase();
  const now = new Date();
  const publicPaths = ["/", "/intake", "/login", "/privacy", "/staff-privacy", "/account-help"] as const;
  return publicPaths.map((path) => ({
    url: new URL(path, base).toString(),
    lastModified: now,
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : 0.6,
  }));
}
