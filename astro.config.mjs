import { renameSync, rmdirSync, writeFileSync } from 'node:fs';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import { LOCALES } from './src/i18n/locales';

// Published as /build.txt so the IndexNow workflow can tell when a push is actually
// live. Each host names the commit in its own variable: Cloudflare Workers Builds, then
// Vercel, kept so a deploy from either still reports itself.
const commit = process.env.WORKERS_CI_COMMIT_SHA ?? process.env.VERCEL_GIT_COMMIT_SHA ?? '';

export default defineConfig({
  site: 'https://www.manyxlabs.com',
  // The CSS is a few KB, so a separate request would only hold up the first paint.
  build: { inlineStylesheets: 'always' },
  integrations: [
    sitemap({
      filter: (page) => !page.endsWith('/404/'),
      i18n: { defaultLocale: 'en', locales: Object.fromEntries(LOCALES.map((l) => [l, l])) },
      // The free tools' pages, built by their own Worker (manyxlabs/photo-resizer). An index may not
      // name another index, so this names its one sitemap file; it holds far under the 45,000 URLs
      // that would split it.
      customSitemaps: ['https://www.manyxlabs.com/sitemap-resizer-0.xml'],
    }),
    { name: 'build-id', hooks: { 'astro:build:done': ({ dir }) => writeFileSync(new URL('build.txt', dir), commit) } },
    {
      // Cloudflare answers a missing page with the nearest 404.html up the path, so each language's
      // 404 goes where /<l>/no-such-page/ finds it; Astro builds only English's at /404.html.
      name: 'localized-404',
      hooks: {
        'astro:build:done': ({ dir }) => {
          for (const l of LOCALES.filter((l) => l !== 'en')) {
            renameSync(new URL(`${l}/404/index.html`, dir), new URL(`${l}/404.html`, dir));
            rmdirSync(new URL(`${l}/404/`, dir));
          }
        },
      },
    },
  ],
});
