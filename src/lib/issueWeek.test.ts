import { describe, expect, it } from "vitest";
import { formatCalendarIssueWeek, getCalendarIssueWeek, getCurrentYear } from "./issueWeek";

describe("Given issue week helpers", () => {
  describe("When calculating calendar-year week numbers", () => {
    it("Then treats each seven-day period from January 1 as a week", () => {
      expect(getCalendarIssueWeek(new Date("2026-06-08T12:00:00Z"))).toEqual({
        week: 23,
        year: 2026,
      });
    });

    it("Then always assigns January 1 to week one of the new year", () => {
      expect(getCalendarIssueWeek(new Date("2021-01-01T12:00:00Z"))).toEqual({
        week: 1,
        year: 2021,
      });
    });

    it("Then keeps late December dates in the current calendar year", () => {
      expect(getCalendarIssueWeek(new Date("2018-12-31T12:00:00Z"))).toEqual({
        week: 53,
        year: 2018,
      });
    });
  });

  describe("When formatting issue labels", () => {
    it("Then formats with a two-digit week number", () => {
      expect(formatCalendarIssueWeek({ week: 4, year: 2026 })).toBe("Issue No.04 · 2026");
      expect(formatCalendarIssueWeek({ week: 14, year: 2026 })).toBe("Issue No.14 · 2026");
    });
  });

  describe("When getting the current year", () => {
    it("Then returns the calendar year for a given date", () => {
      expect(getCurrentYear(new Date("2026-12-31T23:59:59Z"))).toBe(2026);
    });
  });
});
