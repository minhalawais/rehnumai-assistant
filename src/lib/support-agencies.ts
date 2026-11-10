import groups from "@/lib/support-agencies.json";

export type SupportAgency = {
  id: string;
  nameUr: string[];
  nameEn: string;
  website: string;
  logo: string;
  qr: string;
  paragraphs: string[];
};

export type SupportGroup = {
  id: string;
  titleUr: string;
  titleEn: string;
  agencies: SupportAgency[];
};

export const SUPPORT_GROUPS = groups as SupportGroup[];

export function getSupportGroup(id: string) {
  return SUPPORT_GROUPS.find((group) => group.id === id);
}
