import { describe, expect, it } from "vitest";
import { getBlogPublishingDate, isBlogPostPublished, isBlogPostVisible } from "./blogPublishing";

describe("Given the blog publishing schedule", () => {
  describe("When resolving the current publishing date", () => {
    it("Then uses the Toronto calendar date before midnight during daylight time", () => {
      const sundayNight = new Date("2026-09-14T03:59:59Z");

      expect(getBlogPublishingDate(sundayNight)).toBe("2026-09-13");
    });

    it("Then advances at Toronto midnight during daylight time", () => {
      const mondayMidnight = new Date("2026-09-14T04:00:00Z");

      expect(getBlogPublishingDate(mondayMidnight)).toBe("2026-09-14");
    });

    it("Then respects Toronto standard time in winter", () => {
      const mondayMidnight = new Date("2026-12-07T05:00:00Z");

      expect(getBlogPublishingDate(mondayMidnight)).toBe("2026-12-07");
    });
  });

  describe("When deciding whether a post is published", () => {
    const mondayMorning = new Date("2026-09-14T12:00:00Z");

    it("Then includes posts scheduled for today or earlier", () => {
      expect(isBlogPostPublished("2026-09-14", mondayMorning)).toBe(true);
      expect(isBlogPostPublished("2026-08-31", mondayMorning)).toBe(true);
    });

    it("Then excludes future-dated and undated posts", () => {
      expect(isBlogPostPublished("2026-09-28", mondayMorning)).toBe(false);
      expect(isBlogPostPublished(null, mondayMorning)).toBe(false);
    });
  });

  describe("When building an authenticated preview", () => {
    const mondayMorning = new Date("2026-09-14T12:00:00Z");

    it("Then includes future-dated posts when scheduled posts are enabled", () => {
      expect(isBlogPostVisible("2026-09-28", true, mondayMorning)).toBe(true);
    });

    it("Then continues to exclude undated posts", () => {
      expect(isBlogPostVisible(null, true, mondayMorning)).toBe(false);
    });

    it("Then preserves the production publishing rule when preview is disabled", () => {
      expect(isBlogPostVisible("2026-09-28", false, mondayMorning)).toBe(false);
      expect(isBlogPostVisible("2026-09-14", false, mondayMorning)).toBe(true);
    });
  });
});
