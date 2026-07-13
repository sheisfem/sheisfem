const site = "https://www.sheisfem.com";

export function GET() {
  return new Response(
    ["User-agent: *", "Allow: /", "", `Sitemap: ${site}/sitemap.xml`, ""].join("\n"),
    {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    }
  );
}
