import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppLaunchGate } from "@/components/app-launch-gate";
import { LocaleProvider } from "@/components/locale";
import { resolveMetadataBase, siteConfig } from "@/lib/site-metadata";

export const metadata: Metadata = {
  metadataBase: resolveMetadataBase(),
  applicationName: siteConfig.applicationName,
  title: {
    default: siteConfig.defaultTitle,
    template: siteConfig.titleTemplate,
  },
  description: siteConfig.defaultDescription,
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/brand/manzil-mark-16.png", sizes: "16x16", type: "image/png" },
      { url: "/brand/manzil-mark-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/manzil-mark-48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [
      { url: "/brand/manzil-mark-180.png", sizes: "180x180", type: "image/png" },
      { url: "/brand/manzil-app-icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  appleWebApp: {
    capable: true,
    title: siteConfig.applicationName,
    statusBarStyle: "default",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: siteConfig.applicationName,
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
    images: [{ url: "/brand/manzil-lockup.png", width: 1200, height: 630, alt: siteConfig.applicationName }],
    locale: "ur_PK",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.defaultTitle,
    description: siteConfig.defaultDescription,
    images: ["/brand/manzil-lockup.png"],
  },
};

export const viewport: Viewport = {
  themeColor: siteConfig.themeColor,
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ur" dir="rtl">
      <body>
        <LocaleProvider>
          <AppLaunchGate>
            <a className="skip-link" href="#main-content">
              Skip to content / مواد پر جائیں
            </a>
            {children}
          </AppLaunchGate>
        </LocaleProvider>
      </body>
    </html>
  );
}
