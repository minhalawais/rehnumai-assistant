import type { Metadata } from "next";
import "./globals.css";
import { LocaleProvider } from "@/components/locale";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: "Rehnumai | Safe Migration Intake",
  description: "Guidance on safe and legal migration, preparation, and support.",
  icons: {
    icon: [
      { url: "/brand/rehnumai-mark-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/rehnumai-mark-16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/brand/rehnumai-app-icon-192.png",
  },
  openGraph: {
    title: "Rehnumai | Safe Migration Intake",
    description: "Prepare for safe and legal migration with practical guidance.",
    images: ["/brand/rehnumai-lockup.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ur" dir="rtl"><body><LocaleProvider><a className="skip-link" href="#main-content">Skip to content / مواد پر جائیں</a>{children}</LocaleProvider></body></html>;
}
