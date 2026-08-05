import { describe, expect, it } from "vitest";
import { getHaradaSuccessCta } from "./haradaReferral";

describe("Given a Harada funnel referral", () => {
  it("Then sends blog-origin subscribers somewhere new", () => {
    expect(getHaradaSuccessCta("blogpost")).toEqual({
      href: "/",
      label: "Explore SheisFEM →",
    });
  });

  it("Then sends other subscribers to the Harada story", () => {
    expect(getHaradaSuccessCta(null)).toEqual({
      href: "/blog/the-harada-method-one-goal-eight-spokes-a-whole-life?ref=subscribed",
      label: "Read the full story behind the method →",
    });
  });
});
