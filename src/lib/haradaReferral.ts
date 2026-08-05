const HARADA_POST_PATH = "/blog/the-harada-method-one-goal-eight-spokes-a-whole-life";

export const getHaradaSuccessCta = (ref: string | null) =>
  ref === "blogpost"
    ? {
        href: "/",
        label: "Explore SheisFEM →",
      }
    : {
        href: `${HARADA_POST_PATH}?ref=subscribed`,
        label: "Read the full story behind the method →",
      };
