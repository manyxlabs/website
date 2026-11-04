import { expect, test } from '@playwright/test';

const SITE = 'https://www.manyxlabs.com';

test('every page in the sitemap is indexable, described and canonical', async ({ page, request }) => {
  // The website and the photo resizer (its own Worker, forwarded here) each publish one.
  // The rest name the products' own hosts, which list only their own pages.
  const robots = await (await request.get('/robots.txt')).text();
  const indexes = [...robots.matchAll(/^Sitemap: (\S+)$/gm)]
    .map((m) => m[1]!)
    .filter((u) => u.startsWith(`${SITE}/`))
    .map((u) => u.replace(SITE, ''));
  expect(indexes).toEqual(['/sitemap-index.xml', '/sitemap-resizer-index.xml']);
  const maps: string[] = [];
  for (const index of indexes) {
    const xml = await (await request.get(index)).text();
    maps.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!.replace(SITE, '')));
  }
  // The resizer's sitemap is in both indexes, so its pages are counted once.
  const found = new Set<string>();
  for (const map of maps) {
    const xml = await (await request.get(map)).text();
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) found.add(m[1]!);
  }
  const urls = [...found];
  // The pages a search engine should find, at least; the 404 must not be among them.
  for (const path of ['/', '/tools/photo-resizer/', '/photo-size/', '/photo-size/ssc/']) expect(urls).toContain(SITE + path);
  expect(urls.some((u) => u.includes('404'))).toBe(false);

  const titles = new Set<string>();
  for (const url of urls) {
    const path = url.replace(SITE, '');
    expect((await page.goto(path))?.status(), path).toBe(200);
    await expect(page.locator('h1'), path).toHaveCount(1);
    expect(await page.locator('link[rel=canonical]').getAttribute('href'), path).toBe(url);
    expect((await page.locator('meta[name=description]').getAttribute('content'))!.length, path).toBeGreaterThan(50);
    await expect(page.locator('meta[name=robots]'), path).toHaveCount(0);
    titles.add(await page.title());
    const image = await request.get(new URL((await page.locator('meta[property="og:image"]').getAttribute('content'))!).pathname);
    expect(image.headers()['content-type'], path).toMatch(/^image\//);
    for (const ld of await page.locator('script[type="application/ld+json"]').allTextContents()) {
      expect(JSON.parse(ld)['@context'], path).toBe('https://schema.org');
    }
  }
  expect(titles.size, 'every title is unique').toBe(urls.length);
});

test('a missing page is a 404 that asks not to be indexed', async ({ page }) => {
  expect((await page.goto('/no-such-page/'))?.status()).toBe(404);
  await expect(page.locator('meta[name=robots]')).toHaveAttribute('content', 'noindex');
  // It is served at any missing URL, so it has no address of its own to claim.
  await expect(page.locator('link[rel=canonical]')).toHaveCount(0);
});
