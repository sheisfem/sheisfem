import { createReader } from "@keystatic/core/reader";
import keystaticConfig from "../../keystatic.config";

declare const process: { cwd(): string };

const site = "https://www.sheisfem.com";
const staticPages = ["", "about", "resources", "blog"];

type SitemapEntry = {
  loc: string;
  lastmod?: string;
  priority: string;
};

const escapeXml = (value: string) =>
  value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");

const pageUrl = (path: string) => `${site}/${path}${path ? "/" : ""}`;

export async function GET() {
  const reader = createReader(process.cwd(), keystaticConfig);
  const posts = await reader.collections.posts.all();

  const urls: SitemapEntry[] = [
    ...staticPages.map((path) => ({
      loc: pageUrl(path),
      priority: path === "" ? "1.0" : path === "blog" ? "0.9" : "0.8",
    })),
    ...posts.map(({ slug, entry }) => ({
      loc: pageUrl(`blog/${slug}`),
      lastmod: entry.publishedDate,
      priority: "0.7",
    })),
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
${url.lastmod ? `    <lastmod>${escapeXml(url.lastmod)}</lastmod>\n` : ""}    <priority>${url.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
