import { describe, expect, it } from "vitest";
import { enhancePostHtml, formatDateline, getReadMinutes } from "./blogPost";

describe("Given blog post helpers", () => {
  describe("When formatting a dateline", () => {
    it("Then formats with weekday, month, ordinal day, and year", () => {
      expect(formatDateline("2026-06-01")).toBe("Monday — June 1st, 2026");
      expect(formatDateline("2026-06-02")).toBe("Tuesday — June 2nd, 2026");
      expect(formatDateline("2026-06-03")).toBe("Wednesday — June 3rd, 2026");
      expect(formatDateline("2026-06-11")).toBe("Thursday — June 11th, 2026");
    });

    it("Then returns an empty string when no date is available", () => {
      expect(formatDateline(null)).toBe("");
    });
  });

  describe("When enhancing post HTML", () => {
    it("Then converts highlighted marker text into an annotation span", () => {
      expect(enhancePostHtml("<p>Make ==the ask== visible.</p>")).toBe(
        '<p>Make <span class="annot">the ask</span> visible.</p>'
      );
    });

    it("Then converts margin note markers into margin note paragraphs", () => {
      expect(enhancePostHtml("<p>[[note: Keep receipts for your wins.]]</p>")).toBe(
        '<p class="margin-note">Keep receipts for your wins.</p>'
      );
    });

    it("Then converts consecutive numbered bold paragraphs into field notes", () => {
      const html = [
        "<p><strong>1. Name the result.</strong> Attach a metric.</p>",
        "<p><strong>2. Show the pattern.</strong> Connect it to scope.</p>",
      ].join("");

      const enhanced = enhancePostHtml(html);

      expect(enhanced).toContain('<div class="fieldnotes">');
      expect(enhanced).toContain("<li><strong>Name the result.</strong> Attach a metric.</li>");
      expect(enhanced).toContain(
        "<li><strong>Show the pattern.</strong> Connect it to scope.</li>"
      );
    });

    it("Then leaves a single numbered bold paragraph unchanged", () => {
      const html = "<p><strong>1. Name the result.</strong> Attach a metric.</p>";

      expect(enhancePostHtml(html)).toBe(html);
    });

    it("Then converts signoff markers following a rule into a signoff block", () => {
      const enhanced = enhancePostHtml(
        "<hr><p>[[signoff: You have more leverage than you think.]]</p>"
      );

      expect(enhanced).toContain('<div class="signoff">');
      expect(enhanced).toContain("<p>You have more leverage than you think.</p>");
      expect(enhanced).toContain('<span class="xo">Until next time,</span>');
      expect(enhanced).toContain('<div class="sig">xo, Tomi</div>');
    });
  });

  describe("When calculating read time", () => {
    it("Then calculates from text content and ignores tags", () => {
      expect(getReadMinutes("<p>Short post.</p>")).toBe(1);
      expect(getReadMinutes(`<p>${Array.from({ length: 440 }, () => "word").join(" ")}</p>`)).toBe(
        2
      );
    });
  });
});
