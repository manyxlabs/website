# manyxlabs.com

The Manyx Labs website, built with Astro as a static site.

```bash
npm install
npm run dev       # http://localhost:4321
npm run check     # type-check
npm run build     # static output in dist/
npm run test:e2e  # builds both Workers, serves them together and drives the site in a real browser
```

Products are listed in `src/data/tools.ts`, and their copy is in the catalogues described below.
A product marked `live` must have an `href`, and the type rejects one without it.
Contact links live in `src/site.ts`.
Search metadata (sitemap, `robots.txt`, schema.org data) is built from `src/seo.ts` and `astro.config.mjs`.
The share image `public/og.png` is rendered from `og/og.html`: `chromium --headless --hide-scrollbars --force-device-scale-factor=1 --window-size=1200,630 --screenshot=public/og.png og/og.html`.
Each push to `main` waits for the build to go live (`/build.txt` holds its commit), then submits the sitemap to IndexNow (`.github/workflows/indexnow.yml`, key in `public/indexnow-key.txt`).

## Languages

The site is published in English, Hindi, Bengali, Marathi, Telugu, Tamil, Gujarati, Kannada and Malayalam.
English keeps the unprefixed URLs (`/`), and every other language mirrors them under its code: `/hi/`, `/bn/`, `/mr/`, `/te/`, `/ta/`, `/gu/`, `/kn/`, `/ml/`.
The pages live in `src/pages/[...lang]/`, whose `lang` param is empty for English.
Every page names its language, a canonical URL and hreflang alternates for all nine plus `x-default`, and the sitemap lists every language.
`src/i18n/locales.ts` holds the languages; it is a copy of the resizer's, so change both together.

All copy is in one catalogue per language, `src/i18n/<code>.ts`, typed against the English one in `src/i18n/en.ts`.
A key missing in any language fails the type check, and a string whose `{placeholders}` differ from English's, or a list of another length, fails the build.
`language`, `header` and the footer's shared keys use the resizer's wording, since both sites share the header.
Each script gets a self-hosted Noto Sans face (`src/i18n/fonts.ts`), declared and preloaded only on pages in that language.
Each language's 404 is moved to `dist/<code>/404.html` after the build, where Cloudflare's nearest-404 lookup finds it.

## Design

The look follows the founder's portfolio at [www.manishonai.in](https://www.manishonai.in/) (`src/index.css` in its repo): its colour tokens, glass, buttons, chips and motion are copied as plain CSS into `src/layouts/Base.astro`.
That block is identical in this repo and the tools (manyxlabs/photo-resizer), and so is `src/components/Header.astro`, because both are served on www.manyxlabs.com; change them in both.
Colour stays neutral: the emerald accent marks only eyebrows, links, status dots, focus rings and the scroll bar, and light-theme accent text uses a deeper emerald so it meets WCAG AA.
The `dark` class on `<html>` picks the theme, saved in `localStorage` under `theme` and otherwise taken from the system, and a head script applies it before first paint.
Text is Geist and Geist Mono, self-hosted from `@fontsource-variable`, with each language's Noto Sans after them.
The home page uses all of it: the halo and dot grid, glass cards that reveal on scroll and follow the pointer, and the heading sheen.

## The photo resizer

The resizer and its size guides live in their own repo and Cloudflare Worker, [manyxlabs/photo-resizer](https://github.com/manyxlabs/photo-resizer), but keep their URLs here.
`wrangler.jsonc` runs `worker.ts` only for `/tools*`, `/photo-size*`, `/_resizer/*` and `/sitemap-resizer-*`, plus `/<code>/tools*` and `/<code>/photo-size*` for each language, and it hands those to the resizer through a service binding.
The language paths are listed one by one, so that no page of this site's own under `/<code>/` is ever forwarded; a new language needs its two entries there.
Everything else is served straight from `dist/`.
`robots.txt` lists both sitemaps.
The header, footer and layout are copied in both repos; change them together.

The E2E suite runs both Workers with `wrangler dev`, joined as in production, so it needs a resizer checkout: `../photo-resizer` by default, or `RESIZER_DIR`.
`BASE_URL` runs it against a deployed site instead.
E2E runs leave a screenshot per case in `test-results/artifacts/`.
Where Playwright's own browser is unavailable, point it at a system one with `CHROMIUM=/usr/bin/chromium`.

## License

MIT, see [LICENSE](LICENSE).
