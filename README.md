# SheisFEM

SheisFEM is an Astro site for personal finance, career growth, resources, and field-note style blog posts for women earning more.

## Stack

- **Astro 6** — site framework
- **Tailwind CSS v4** — loaded through Vite and used alongside custom CSS in `src/styles/global.css`
- **Keystatic** — CMS/editor for posts and resources
- **React** — used for the comments island
- **Cusdis** — blog comments, enabled with `PUBLIC_CUSDIS_APP_ID`
- **Vercel** — production adapter and hosting target

## Requirements

- Node `>=22.12.0`
- npm

## Commands

| Command | Action |
| :-- | :-- |
| `npm run dev` | Start the Astro dev server |
| `npm run build` | Build the production site to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run type-check` | Run `astro check` |
| `npm run lint` | Run Biome lint and write fixes |
| `npm run lint:check` | Run Biome lint without writing fixes |
| `npm run format` | Format files with Biome |
| `npm run format:check` | Check formatting without writing fixes |

## Project Structure

| Path | Purpose |
| :-- | :-- |
| `src/pages/` | Astro routes for home, about, resources, and blog |
| `src/pages/blog/index.astro` | Blog index page |
| `src/pages/blog/[slug].astro` | Individual blog post template |
| `src/content/posts/` | Keystatic blog posts, stored as `.mdoc` |
| `src/content/resources/` | Resource directory entries, stored as `.yaml` |
| `src/components/` | Shared Astro and React components |
| `src/styles/global.css` | Design tokens, base styles, typography, and shared utilities |
| `src/styles/blog-index.css` | Blog index styling |
| `src/styles/blog-post.css` | Individual blog post styling |
| `src/styles/comments.css` | Comment form and comment list styling |
| `src/styles/*.css` | Page and component-scoped styles imported where they are used |
| `src/content.config.ts` | Astro content collection schemas |
| `keystatic.config.ts` | Keystatic CMS configuration |

## Content Editing

Keystatic is available at `/keystatic` when the dev server is running. The current storage target is GitHub repo `sheisfem/sheisfem`.

### Blog Posts

Posts live in `src/content/posts/` as `.mdoc` files. Each post includes:

- `title`
- `pillar`: one of `earns`, `builds`, `invests`, `lives`, `learns`
- `publishedDate`
- `excerpt` — renders above the post body as a styled lede with a handwritten orange "the gist" label (via `.post-lede`)
- Markdoc body content

The blog post template automatically applies the diary styling to every post. Normal Markdown works as expected. Use the optional authoring markers below when a post needs extra editorial texture.

### Blog Styling Markers

Use these markers inside a post body:

<img width="205" height="38" alt="Screenshot 2026-06-08 at 9 06 40 PM" src="https://github.com/user-attachments/assets/50757365-87d5-4056-9a98-668f2efeb332" />

```md
==This text gets the orange squiggly underline.==
```


<img width="446" height="76" alt="Screenshot 2026-06-08 at 9 08 22 PM" src="https://github.com/user-attachments/assets/46191ae0-9cee-4a18-87d3-0466cc346a83" />

```md
[[note: This becomes a handwritten margin note.]]
```

<img width="794" height="171" alt="Screenshot 2026-06-08 at 9 09 07 PM" src="https://github.com/user-attachments/assets/1c20b897-cb49-4f49-ba72-b043cd000a98" />

Consecutive numbered bold paragraphs become a paper-style field notes block:

```md
**1. First takeaway.** Supporting detail here.

**2. Second takeaway.** Supporting detail here.

**3. Third takeaway.** Supporting detail here.
```


<img width="752" height="73" alt="Screenshot 2026-06-08 at 9 10 03 PM" src="https://github.com/user-attachments/assets/41dba0c9-c245-4b54-909e-986ac8cbab8c" />

Use a signoff marker after a horizontal rule for the styled closing note:

```md
---

[[signoff: That's this week's entry. Add your closing note here.]]
```

These markers are transformed in `src/pages/blog/[slug].astro` by `enhancePostHtml`.

### Resources

Resources live in `src/content/resources/` as `.yaml` files. Each resource includes:

- `name`
- `pillar`
- `url`
- `description`
- `featured`

Featured resources appear on the homepage shortlist.

### Homepage Singleton

`keystatic.config.ts` defines a homepage singleton at `src/content/homepage`, but the current homepage template in `src/pages/index.astro` is mostly hard-coded. If homepage content should become fully CMS-managed, wire that singleton into the page before relying on it editorially.

## Comments

Blog comments are rendered by `src/components/CommentsSection.tsx` and only appear when this environment variable is set:

```sh
PUBLIC_CUSDIS_APP_ID=your-cusdis-app-id
```

Without that variable, blog posts render without the comments section.

## Five Pillars

- She Earns More
- She Builds More
- She Invests More
- She Lives More
- She Learns More

The code values are:

- `earns`
- `builds`
- `invests`
- `lives`
- `learns`

## Notes

- The site uses a static output build with the Vercel adapter.
- Shared visual styling is in `src/styles/global.css`. Page and component styles live in smaller files under `src/styles/` and are imported by the route or component that uses them.
- Run `npm run build` before shipping changes.
