# SheisFEM

Personal finance and empowerment site for women. Built with Astro, Tailwind CSS, and Keystatic CMS.

## Stack

- **Astro** — static site framework
- **Tailwind CSS v4** — styling
- **Keystatic** — browser-based CMS for managing blog posts, resources, and homepage content
- **Vercel** — hosting and deploys

## Commands

| Command               | Action                                      |
| :-------------------- | :------------------------------------------ |
| `npm run dev`         | Start local dev server at `localhost:4321`  |
| `npm run build`       | Build production site to `./dist/`          |
| `npm run preview`     | Preview production build locally            |
| `npm run type-check`  | TypeScript check via `astro check`          |
| `npm run lint`        | Lint and auto-fix with Biome                |
| `npm run lint:check`  | Lint without writing changes                |
| `npm run format`      | Format with Biome                           |
| `npm run format:check`| Check formatting without writing changes    |

## Content

Content is managed via Keystatic at `/keystatic` (requires GitHub login).

| Collection   | Path                      | Format  |
| :----------- | :------------------------ | :------ |
| Blog Posts   | `src/content/posts/`      | `.mdoc` |
| Resources    | `src/content/resources/`  | `.yaml` |
| Homepage     | `src/content/homepage/`   | singleton |

## Five Pillars

- She Earns More
- She Builds More
- She Invests More
- She Lives More
- She Learns More
