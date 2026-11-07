import type { Metadata } from "next";
import { pageTitles, siteConfig } from "@/lib/site-metadata";

export function buildPageMetadata(title: string, options?: { description?: string; robotsIndex?: boolean }): Metadata {
  return {
    title,
    description: options?.description ?? siteConfig.defaultDescription,
    robots: options?.robotsIndex === false ? { index: false, follow: false } : undefined,
  };
}

export const loginMetadata = buildPageMetadata(pageTitles.login);
export const intakeMetadata = buildPageMetadata(pageTitles.intake);
export const portalMetadata = buildPageMetadata(pageTitles.portal, { robotsIndex: false });
export const privacyMetadata = buildPageMetadata(pageTitles.privacy);
export const staffPrivacyMetadata = buildPageMetadata(pageTitles.staffPrivacy);
export const accountHelpMetadata = buildPageMetadata(pageTitles.accountHelp);
