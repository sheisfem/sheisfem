import { describe, expect, it } from "vitest";
import {
  getFeaturedResources,
  getPillarResources,
  getResourceCta,
  getResourceIcon,
  type PillarKey,
  pillars,
  type ResourceEntry,
  sortResources,
} from "./resources";

const resource = (
  id: string,
  pillar: PillarKey,
  options: { featured?: boolean; name?: string } = {}
) =>
  ({
    id,
    data: {
      name: options.name ?? id,
      pillar,
      featured: options.featured ?? false,
    },
  }) as ResourceEntry;

describe("Given resource helpers", () => {
  describe("When reading pillar metadata", () => {
    it("Then keeps pillars in the intended editorial order", () => {
      expect(pillars.map((pillar) => pillar.key)).toEqual([
        "earns",
        "builds",
        "invests",
        "lives",
        "learns",
      ]);
    });
  });

  describe("When getting a resource icon", () => {
    it("Then creates single-letter resource icons", () => {
      expect(getResourceIcon("notion")).toBe("N");
      expect(getResourceIcon("Canva")).toBe("C");
    });
  });

  describe("When getting resource CTA copy", () => {
    it("Then uses Amazon-specific copy and a default for other resources", () => {
      expect(getResourceCta("Amazon — Money Books")).toBe("Shop");
      expect(getResourceCta("Wealthsimple")).toBe("Try it");
    });
  });

  describe("When sorting resources", () => {
    it("Then sorts by pillar order and then by id", () => {
      const sorted = sortResources([
        resource("wealthsimple", "invests"),
        resource("canva-b", "builds"),
        resource("neo", "earns"),
        resource("amazon-b", "builds"),
      ]);

      expect(sorted.map((item) => item.id)).toEqual(["neo", "amazon-b", "canva-b", "wealthsimple"]);
    });
  });

  describe("When filtering resources for a pillar", () => {
    it("Then filters and sorts resources for a pillar", () => {
      const resources = [
        resource("z-builds", "builds"),
        resource("earns", "earns"),
        resource("a-builds", "builds"),
      ];

      expect(getPillarResources(resources, "builds").map((item) => item.id)).toEqual([
        "a-builds",
        "z-builds",
      ]);
    });
  });

  describe("When getting featured resources", () => {
    it("Then returns featured resources sorted by pillar priority", () => {
      const resources = [
        resource("investing", "invests", { featured: true }),
        resource("building", "builds", { featured: true }),
        resource("learning", "learns"),
        resource("earning", "earns", { featured: true }),
      ];

      expect(getFeaturedResources(resources).map((item) => item.id)).toEqual([
        "earning",
        "building",
        "investing",
      ]);
    });
  });
});
