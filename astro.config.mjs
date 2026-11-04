import { writeFileSync } from 'node:fs';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

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
      // The free tools' pages, built by their own Worker (manyxlabs/photo-resizer). An index may not
      // name another index, so this names its one sitemap file; it holds far under the 45,000 URLs
      // that would split it.
      customSitemaps: ['https://www.manyxlabs.com/sitemap-resizer-0.xml'],
    }),
    { name: 'build-id', hooks: { 'astro:build:done': ({ dir }) => writeFileSync(new URL('build.txt', dir), commit) } },
  ],
});
