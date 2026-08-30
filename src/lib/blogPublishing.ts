export const BLOG_PUBLISHING_TIME_ZONE = "America/Toronto";

export const getBlogPublishingDate = (now = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: BLOG_PUBLISHING_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const datePart = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return `${datePart("year")}-${datePart("month")}-${datePart("day")}`;
};

export const isBlogPostPublished = (publishedDate: string | null, now = new Date()) =>
  Boolean(publishedDate && publishedDate <= getBlogPublishingDate(now));
