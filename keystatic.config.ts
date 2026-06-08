import { collection, config, fields, singleton } from "@keystatic/core";

export default config({
  storage: {
    kind: "github",
    repo: "sheisfem/sheisfem",
  },
  collections: {
    posts: collection({
      label: "Blog Posts",
      slugField: "title",
      path: "src/content/posts/*",
      format: { contentField: "content" },
      schema: {
        title: fields.slug({ name: { label: "Title" } }),
        pillar: fields.select({
          label: "Pillar",
          options: [
            { label: "She Earns More", value: "earns" },
            { label: "She Builds More", value: "builds" },
            { label: "She Invests More", value: "invests" },
            { label: "She Lives More", value: "lives" },
            { label: "She Learns More", value: "learns" },
          ],
          defaultValue: "earns",
        }),
        publishedDate: fields.date({ label: "Published Date" }),
        excerpt: fields.text({ label: "Excerpt", multiline: true }),
        content: fields.markdoc({ label: "Content" }),
      },
    }),
    resources: collection({
      label: "Resources",
      slugField: "name",
      path: "src/content/resources/*",
      schema: {
        name: fields.slug({ name: { label: "Resource Name" } }),
        pillar: fields.select({
          label: "Pillar",
          options: [
            { label: "She Earns More", value: "earns" },
            { label: "She Builds More", value: "builds" },
            { label: "She Invests More", value: "invests" },
            { label: "She Lives More", value: "lives" },
            { label: "She Learns More", value: "learns" },
          ],
          defaultValue: "earns",
        }),
        url: fields.url({ label: "Affiliate URL" }),
        description: fields.text({ label: "Description", multiline: true }),
        featured: fields.checkbox({ label: "Feature on homepage", defaultValue: false }),
      },
    }),
  },
  singletons: {
    homepage: singleton({
      label: "Homepage",
      path: "src/content/homepage",
      schema: {
        headline: fields.text({ label: "Headline" }),
        subheadline: fields.text({ label: "Subheadline", multiline: true }),
        pinterestUrl: fields.url({ label: "Pinterest URL" }),
        instagramUrl: fields.url({ label: "Instagram URL" }),
      },
    }),
  },
});
