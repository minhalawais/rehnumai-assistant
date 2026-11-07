import type { MetadataRoute } from "next";
import { resolveMetadataBase } from "@/lib/site-metadata";

export default function robots(): MetadataRoute.Robots {
  const base = resolveMetadataBase();
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/portal/", "/api/"],
      },
    ],
    sitemap: new URL("/sitemap.xml", base).toString(),
  };
}
