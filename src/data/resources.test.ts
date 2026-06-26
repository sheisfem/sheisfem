import { describe, expect, it } from "vitest";
import {
  getFeaturedResources,
  getResourceCta,
  getResourceIcon,
  getSectionResources,
  type PillarKey,
  pillars,
  type ResourceEntry,
  type ResourceType,
  resourceSections,
  sortResources,
} from "./resources";

const resource = (
  id: string,
  type: ResourceType,
  options: { featured?: boolean; name?: string; pillars?: PillarKey[] } = {}
) =>
  ({
    id,
    data: {
      name: options.name ?? id,
      type,
      pillars: options.pillars ?? ["builds"],
      featured: options.featured ?? false,
    },
  }) as ResourceEntry;

describe("Given resource helpers", () => {
  describe("When reading resource metadata", () => {
    it("Then keeps pillars in the intended editorial order", () => {
      expect(pillars.map((pillar) => pillar.key)).toEqual([
        "earns",
        "builds",
        "invests",
        "lives",
        "learns",
      ]);
    });

    it("Then keeps resource sections and their editorial labels in directory order", () => {
      expect(
        resourceSections.map(({ key, title, subtitle }) => ({ key, title, subtitle }))
      ).toEqual([
        {
          key: "explore",
          title: "Explore",
          subtitle: "Tools and platforms worth having in your corner.",
        },
        {
          key: "read",
          title: "Read",
          subtitle: "Books and publications to come back to.",
        },
        {
          key: "listen",
          title: "Listen",
          subtitle: "Conversations worth taking with you.",
        },
      ]);
    });
  });

  describe("When getting a resource icon", () => {
    it("Then creates single-letter resource icons", () => {
      expect(getResourceIcon("notebook")).toBe("N");
      expect(getResourceIcon("creative tool")).toBe("C");
    });
  });

  describe("When getting resource CTA copy", () => {
    it("Then matches the action to the resource type", () => {
      expect(getResourceCta("tool")).toBe("Try it");
      expect(getResourceCta("book")).toBe("Shop");
      expect(getResourceCta("podcast")).toBe("Listen");
      expect(getResourceCta("publication")).toBe("Read");
    });
  });

  describe("When sorting resources", () => {
    it("Then sorts by type order and then by id", () => {
      const sorted = sortResources([
        resource("wealthsimple", "tool"),
        resource("economist", "publication"),
        resource("millionaire-teacher", "book"),
        resource("ark-fyi", "podcast"),
      ]);

      expect(sorted.map((item) => item.id)).toEqual([
        "wealthsimple",
        "millionaire-teacher",
        "ark-fyi",
        "economist",
      ]);
    });
  });

  describe("When getting resources for a directory section", () => {
    it("Then groups books and publications together as reading", () => {
      const resources = [
        resource("economist", "publication"),
        resource("claude", "tool"),
        resource("ted-talks", "podcast"),
        resource("co-intelligence", "book"),
      ];

      expect(getSectionResources(resources, "read").map((item) => item.id)).toEqual([
        "co-intelligence",
        "economist",
      ]);
    });
  });

  describe("When getting featured resources", () => {
    it("Then returns featured resources alphabetically by name", () => {
      const resources = [
        resource("the-economist", "publication", { featured: true, name: "The Economist" }),
        resource("claude", "tool", { featured: true, name: "Claude" }),
        resource("canva", "tool", { name: "Canva" }),
        resource("morning-brew-daily", "podcast", {
          featured: true,
          name: "Morning Brew Daily",
        }),
      ];

      expect(getFeaturedResources(resources).map((item) => item.data.name)).toEqual([
        "Claude",
        "Morning Brew Daily",
        "The Economist",
      ]);
    });
  });
});
