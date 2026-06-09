import { describe, expect, it } from "vitest";
import { formatIsoIssueWeek, getCurrentYear, getIsoIssueWeek } from "./issueWeek";

describe("Given issue week helpers", () => {
  describe("When calculating ISO week numbers", () => {
    it("Then calculates ISO weeks inside a normal calendar year", () => {
      expect(getIsoIssueWeek(new Date("2026-06-08T12:00:00Z"))).toEqual({
        week: 24,
        year: 2026,
      });
    });

    it("Then assigns early January dates to the previous ISO week-year when appropriate", () => {
      expect(getIsoIssueWeek(new Date("2021-01-01T12:00:00Z"))).toEqual({
        week: 53,
        year: 2020,
      });
    });

    it("Then assigns late December dates to the next ISO week-year when appropriate", () => {
      expect(getIsoIssueWeek(new Date("2018-12-31T12:00:00Z"))).toEqual({
        week: 1,
        year: 2019,
      });
    });
  });

  describe("When formatting issue labels", () => {
    it("Then formats with a two-digit week number", () => {
      expect(formatIsoIssueWeek({ week: 4, year: 2026 })).toBe("Issue No.04 · 2026");
      expect(formatIsoIssueWeek({ week: 14, year: 2026 })).toBe("Issue No.14 · 2026");
    });
  });

  describe("When getting the current year", () => {
    it("Then returns the calendar year for a given date", () => {
      expect(getCurrentYear(new Date("2026-12-31T23:59:59Z"))).toBe(2026);
    });
  });
});
