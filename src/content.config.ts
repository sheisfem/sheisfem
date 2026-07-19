import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({ pattern: "**/*.mdoc", base: "./src/content/posts" }),
  schema: z.object({
    title: z.string(),
    pillars: z.array(z.enum(["earns", "builds", "invests", "lives", "learns"])).min(1),
    publishedDate: z.string(),
    excerpt: z.string().optional(),
  }),
});

const resources = defineCollection({
  loader: glob({ pattern: "**/*.yaml", base: "./src/content/resources" }),
  schema: z.object({
    name: z.string(),
    type: z.enum(["tool", "book", "podcast", "publication"]),
    pillars: z.array(z.enum(["earns", "builds", "invests", "lives", "learns"])).min(1),
    url: z.url(),
    description: z.string(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { posts, resources };
