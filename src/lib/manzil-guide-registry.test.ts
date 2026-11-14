import { describe, expect, it } from "vitest";
import { GUIDE_ARTICLES } from "@/lib/guide-articles";
import { MANZIL_MENU_SECTIONS } from "@/lib/manzil-menu-items";

describe("Manzil guide registry", () => {
  it("provides content for every guide link in the menu", () => {
    const guideIds = MANZIL_MENU_SECTIONS.flatMap((section) =>
      section.groups.flatMap((group) => group.items.map((item) => item.id)),
    );

    const missing = guideIds.filter((id) => !GUIDE_ARTICLES[id]?.length);

    expect(missing).toEqual([]);
  });

  it("keeps recovered guide pages connected to their specialized layouts", () => {
    const expectedTypes: Record<string, string> = {
      checklist: "dual-checklist",
      airport: "airport-guide",
      "arrival-airport": "arrival-airport-guide",
      employer: "employer-sponsor",
      "respect-laws": "respect-laws-guide",
      rights: "worker-rights-guide",
      "workplace-rights": "workplace-rights-guide",
      smartphone: "smartphone-guide",
      "remittance-channels": "remittance-channels-guide",
      "private-companies": "private-companies-guide",
      reintegration: "reintegration-guide",
    };

    for (const [id, type] of Object.entries(expectedTypes)) {
      expect(GUIDE_ARTICLES[id]?.some((block) => block.type === type), `${id} should use ${type}`).toBe(true);
    }
  });

  it("keeps job search portals structured, unique, and locally branded", () => {
    const portals = GUIDE_ARTICLES["job-search"]?.find((block) => block.type === "portals");

    expect(portals?.type).toBe("portals");
    if (!portals || portals.type !== "portals") return;

    expect(portals.items).toHaveLength(10);
    expect(new Set(portals.items.map((item) => item.url)).size).toBe(portals.items.length);
    expect(portals.items.every((item) => item.logo.startsWith("/guide/job-portals/"))).toBe(true);
  });
});
