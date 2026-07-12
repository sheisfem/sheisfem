import { describe, expect, it } from "vitest";
import { filterLabels, formatBlogDate, formatEntryDate, pillarLabels } from "./blogIndex";

describe("Given blog index helpers", () => {
  describe("When formatting blog dates", () => {
    it("Then formats a full display date", () => {
      expect(formatBlogDate("2026-07-06")).toBe("July 6, 2026");
    });

    it("Then formats the entry date rail parts", () => {
      expect(formatEntryDate("2026-07-06")).toEqual({
        monthDay: "July 6",
        year: "2026",
      });
    });

    it("Then returns empty date parts when no date is available", () => {
      expect(formatBlogDate(null)).toBe("");
      expect(formatEntryDate(null)).toEqual({ monthDay: "", year: "" });
    });
  });

  describe("When reading blog index metadata", () => {
    it("Then keeps filter labels in the intended order", () => {
      expect(filterLabels).toEqual([
        { pillar: "all", label: "All" },
        { pillar: "earns", label: "Earns" },
        { pillar: "builds", label: "Builds" },
        { pillar: "invests", label: "Invests" },
        { pillar: "lives", label: "Lives" },
        { pillar: "learns", label: "Learns" },
      ]);
    });

    it("Then maps each pillar to its editorial label", () => {
      expect(pillarLabels).toEqual({
        earns: "She Earns More",
        builds: "She Builds More",
        invests: "She Invests More",
        lives: "She Lives More",
        learns: "She Learns More",
      });
    });
  });
});
