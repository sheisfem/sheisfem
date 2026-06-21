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
export type ResourceType = ResourceEntry["data"]["type"];
export type ResourceSectionKey = "explore" | "read" | "listen";

export const resourceSections = [
  {
    key: "explore",
    num: "01",
    title: "Explore",
    subtitle: "Tools and platforms worth having in your corner.",
    types: ["tool"],
  },
  {
    key: "read",
    num: "02",
    title: "Read",
    subtitle: "Books and publications to come back to.",
    types: ["book", "publication"],
  },
  {
    key: "listen",
    num: "03",
    title: "Listen",
    subtitle: "Conversations worth taking with you.",
    types: ["podcast"],
  },
] as const satisfies ReadonlyArray<{
  key: ResourceSectionKey;
  num: string;
  title: string;
  subtitle: string;
  types: readonly ResourceType[];
}>;

const typeOrder = new Map<ResourceType, number>([
  ["tool", 0],
  ["book", 1],
  ["podcast", 2],
  ["publication", 3],
]);

export const getResourceIcon = (name: string) => name.charAt(0).toUpperCase();

export const getResourceCta = (type: ResourceType) => {
  if (type === "book") return "Shop";
  if (type === "podcast") return "Listen";
  if (type === "publication") return "Read";

  return "Try it";
};

export const sortResources = (resources: ResourceEntry[]) =>
  [...resources].sort((a, b) => {
    const typeDelta =
      (typeOrder.get(a.data.type) ?? Number.MAX_SAFE_INTEGER) -
      (typeOrder.get(b.data.type) ?? Number.MAX_SAFE_INTEGER);

    if (typeDelta !== 0) {
      return typeDelta;
    }

    return a.id.localeCompare(b.id);
  });

export const getSectionResources = (resources: ResourceEntry[], section: ResourceSectionKey) => {
  const types = (resourceSections.find((item) => item.key === section)?.types ??
    []) as readonly ResourceType[];

  return sortResources(resources.filter((resource) => types.includes(resource.data.type)));
};

export const getFeaturedResources = (resources: ResourceEntry[]) =>
  sortResources(resources.filter((resource) => resource.data.featured));
