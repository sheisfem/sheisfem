import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.mdoc", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    pillar: z.enum(["earns", "builds", "invests", "lives", "learns"]),
    publishedDate: z.string(),
    excerpt: z.string().optional(),
  }),
});

const resources = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/resources" }),
  schema: z.object({
    name: z.string(),
    pillar: z.enum(["earns", "builds", "invests", "lives", "learns"]),
    url: z.string().url(),
    description: z.string(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { posts, resources };
