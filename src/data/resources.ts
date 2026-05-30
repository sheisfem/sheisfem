import type { CollectionEntry } from "astro:content";

export const pillars = [
  {
    num: "01",
    key: "earns",
    chip: "She Earns More",
    name: "She Earns More",
    title: "Income & cash flow",
    desc: "Income, side hustles, negotiating, monetizing the skills you already have.",
  },
  {
    num: "02",
    key: "builds",
    chip: "She Builds More",
    name: "She Builds More",
    title: "Brands, assets & systems",
    desc: "Businesses, brands, assets & systems that keep working when you step away.",
  },
  {
    num: "03",
    key: "invests",
    chip: "She Invests More",
    name: "She Invests More",
    title: "Long-term wealth",
    desc: "Investing, compounding, and long-term wealth — explained without jargon or shame.",
  },
  {
    num: "04",
    key: "lives",
    chip: "She Lives More",
    name: "She Lives More",
    title: "Intentional living",
    desc: "Intentional living, freedom, joy & the wellbeing that makes the rest sustainable.",
  },
  {
    num: "05",
    key: "learns",
    chip: "She Learns More",
    name: "She Learns More",
    title: "Mindset & money education",
    desc: "Books, courses, and the money education most of us never got.",
  },
] as const;

export type PillarKey = (typeof pillars)[number]["key"];
export type ResourceEntry = CollectionEntry<"resources">;

const pillarOrder = new Map<PillarKey, number>(pillars.map((pillar, index) => [pillar.key, index]));

export const getResourceIcon = (name: string) => name.charAt(0).toUpperCase();

export const getResourceCta = (name: string) =>
  name.toLowerCase().includes("amazon") ? "Shop" : "Try it";

export const sortResources = (resources: ResourceEntry[]) =>
  [...resources].sort((a, b) => {
    const pillarDelta =
      (pillarOrder.get(a.data.pillar) ?? Number.MAX_SAFE_INTEGER) -
      (pillarOrder.get(b.data.pillar) ?? Number.MAX_SAFE_INTEGER);

    if (pillarDelta !== 0) {
      return pillarDelta;
    }

    return a.id.localeCompare(b.id);
  });

export const getPillarResources = (resources: ResourceEntry[], pillar: PillarKey) =>
  sortResources(resources.filter((resource) => resource.data.pillar === pillar));

export const getFeaturedResources = (resources: ResourceEntry[]) =>
  sortResources(resources.filter((resource) => resource.data.featured));
