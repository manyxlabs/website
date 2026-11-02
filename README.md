# manyxlabs.com

The Manyx Labs website, built with Astro as a static site.

```bash
npm install
npm run dev       # http://localhost:4321
npm run check     # type-check
npm run build     # static output in dist/
npm run test:e2e  # builds both Workers, serves them together and drives the site in a real browser
```

Products are listed in `src/data/tools.ts`.
A product marked `live` must have an `href`, and the type rejects one without it.
Contact links live in `src/site.ts`.
Search metadata (sitemap, `robots.txt`, schema.org data) is built from `src/seo.ts` and `astro.config.mjs`.
Each push to `main` waits for the build to go live (`/build.txt` holds its commit), then submits the sitemap to IndexNow (`.github/workflows/indexnow.yml`, key in `public/indexnow-key.txt`).

## The photo resizer

The resizer and its size guides live in their own repo and Cloudflare Worker, [manyxlabs/photo-resizer](https://github.com/manyxlabs/photo-resizer), but keep their URLs here.
`wrangler.jsonc` runs `worker.ts` only for `/tools*`, `/photo-size*`, `/_resizer/*` and `/sitemap-resizer-*`, and it hands those to the resizer through a service binding.
Everything else is served straight from `dist/`.
`robots.txt` lists both sitemaps.
The header, footer and layout are copied in both repos; change them together.

The E2E suite runs both Workers with `wrangler dev`, joined as in production, so it needs a resizer checkout: `../photo-resizer` by default, or `RESIZER_DIR`.
`BASE_URL` runs it against a deployed site instead.
E2E runs leave a screenshot per case in `test-results/artifacts/`.
Where Playwright's own browser is unavailable, point it at a system one with `CHROMIUM=/usr/bin/chromium`.

## License

MIT, see [LICENSE](LICENSE).
