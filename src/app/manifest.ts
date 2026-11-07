import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-metadata";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.applicationName,
    short_name: siteConfig.applicationName,
    description: siteConfig.manifestDescription,
    start_url: "/",
    display: "standalone",
    background_color: siteConfig.backgroundColor,
    theme_color: siteConfig.themeColor,
    lang: "ur",
    dir: "rtl",
    icons: [
      { src: "/brand/rehnumai-mark-96.png", sizes: "96x96", type: "image/png" },
      { src: "/brand/rehnumai-app-icon-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/brand/rehnumai-app-icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
