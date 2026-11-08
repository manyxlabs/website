import { mkdirSync } from 'node:fs';
import { expect, test, type Page } from '@playwright/test';
import { catalogues } from '../src/i18n';
import en from '../src/i18n/en';
import { LOCALES, NAMES, type Locale } from '../src/i18n/locales';

const ARTIFACTS = 'test-results/artifacts';
mkdirSync(ARTIFACTS, { recursive: true });

const SITE = 'https://www.manyxlabs.com';
const OTHERS = LOCALES.filter((l) => l !== 'en');
const prefixed = (l: Locale, path: string) => (l === 'en' ? path : `/${l}${path}`);

const strings = (o: unknown): string[] =>
  typeof o === 'string' ? [o] : Array.isArray(o) ? o.flatMap(strings) : Object.values(o as object).flatMap(strings);

/**
 * English text that should be gone from a page in `l`: each catalogue string translated there, cut at its
 * {placeholders}. Single words are left out, since one can stand in a translation on purpose (AI, GitHub).
 */
function english(l: Locale) {
  const theirs = strings(catalogues[l]);
  const found = new Set<string>();
  strings(en).forEach((s, i) => {
    if (s === theirs[i]) return;
    for (const piece of s.split(/\{\w+\}/)) {
      const words = piece.trim().replace(/^[^\p{L}]+|[^\p{L}]+$/gu, '');
      if (words.split(/\s+/).length >= 2) found.add(words);
    }
  });
  return [...found];
}

/** The page's visible and hidden text, titles and labels. */
const pageText = (page: Page) =>
  page.evaluate(() => {
    const out = [document.title, document.querySelector('meta[name=description]')!.getAttribute('content')!];
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n = walk.nextNode(); n; n = walk.nextNode()) if (!n.parentElement!.closest('script, style')) out.push(n.textContent!);
    for (const el of document.body.querySelectorAll('[aria-label], [title], [alt]'))
      for (const a of ['aria-label', 'title', 'alt']) out.push(el.getAttribute(a) ?? '');
    return out.join('\n').replace(/\s+/g, ' ');
  });

/** Elements whose text spills out of their own box, or past the screen's edge. */
const overflowing = (page: Page) =>
  page.evaluate(() =>
    [...document.querySelectorAll<HTMLElement>('header .bar, header nav > *, h1, h2, h3, p, button, .btn, .badge, .category, summary, .lang a, footer a')]
      .filter((el) => el.checkVisibility() && getComputedStyle(el).display !== 'inline')
      .filter((el) => el.scrollWidth > el.clientWidth + 1 || el.getBoundingClientRect().right > innerWidth + 0.5)
      .map((el) => `${el.tagName.toLowerCase()}.${el.className}: ${el.textContent!.trim().slice(0, 40)}`),
  );

/** Each language the header's menu offers, and where it leads. */
const menu = (page: Page) =>
  page.locator('.lang ul a').evaluateAll((links) => links.map((a) => [a.textContent, new URL((a as HTMLAnchorElement).href).pathname]));

for (const l of OTHERS) {
  test.describe(`${NAMES[l]} (${l})`, () => {
    test('the home page names its language, its alternates and its canonical URL', async ({ request }) => {
      const html = await (await request.get(prefixed(l, '/'))).text();
      expect(/<html lang="([^"]+)"/.exec(html)?.[1]).toBe(l);
      expect(/<link rel="canonical" href="([^"]+)"/.exec(html)?.[1]).toBe(SITE + prefixed(l, '/'));
      expect(/<meta property="og:locale" content="([^"]+)"/.exec(html)?.[1]).toBe(`${l}_IN`);
      const alternates = Object.fromEntries([...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)].map((m) => [m[1], m[2]]));
      expect(alternates).toEqual({ ...Object.fromEntries(LOCALES.map((o) => [o, SITE + prefixed(o, '/')])), 'x-default': `${SITE}/` });
      for (const url of Object.values(alternates)) expect((await request.get(url.replace(SITE, ''))).status(), url).toBe(200);
      const ld = [...html.matchAll(/<script type="application\/ld\+json">(.+?)<\/script>/g)].map((m) => JSON.parse(m[1]!));
      expect(ld.find((o) => o['@type'] === 'WebSite').inLanguage).toBe(l);
      expect(ld.find((o) => o['@type'] === 'ItemList').itemListElement[0].item.url).toBe(`${SITE}/${l}/tools/`);
    });

    test('the tools answer under the prefix, and the language menu crosses between the sites', async ({ page }) => {
      const t = catalogues[l];
      await page.goto(prefixed(l, '/'));
      // This site's own page, not swallowed by the forwarding to the tools.
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(t.home.heading);
      const ours = await menu(page);
      expect(ours).toEqual(LOCALES.map((o) => [NAMES[o], prefixed(o, '/')]));

      // The tools have no page of this site's at these paths, so a 200 in this language is theirs.
      for (const path of ['/tools/', '/photo-size/']) {
        expect((await page.goto(prefixed(l, path)))?.status(), path).toBe(200);
        await expect(page.locator('html'), path).toHaveAttribute('lang', l);
        await expect(page.locator('link[rel=canonical]'), path).toHaveAttribute('href', SITE + prefixed(l, path));
        expect(await menu(page), path).toEqual(LOCALES.map((o) => [NAMES[o], prefixed(o, path)]));
      }

      // Back across: the tools' header leads to this site in the same language.
      await page.locator('header nav a').first().click();
      await expect(page).toHaveURL(`${prefixed(l, '/')}#products`);
      const [tab] = await Promise.all([page.waitForEvent('popup'), page.getByRole('link', { name: `${t.tools.tools.open} →` }).click()]);
      await expect(tab).toHaveURL(prefixed(l, '/tools/'));
      await expect(tab.locator('html')).toHaveAttribute('lang', l);
      await tab.close();

      await page.locator('.lang summary').click();
      await page.getByRole('link', { name: 'English', exact: true }).click();
      await expect(page).toHaveURL('/');
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(en.home.heading);
    });

    test('the home page fits a phone, leaves no English behind and loads only its own script', async ({ page }) => {
      const fonts: string[] = [];
      page.on('request', (r) => r.resourceType() === 'font' && fonts.push(new URL(r.url()).pathname));
      await page.setViewportSize({ width: 360, height: 780 });
      await page.goto(prefixed(l, '/'));
      await page.evaluate(() => document.fonts.ready);
      const text = await pageText(page);
      expect(english(l).filter((s) => text.includes(s)), 'still in English').toEqual([]);
      expect(await page.evaluate(() => document.documentElement.scrollWidth - innerWidth), 'scrolls sideways').toBeLessThanOrEqual(0);
      expect(await overflowing(page)).toEqual([]);
      await page.locator('.lang summary').click();
      expect(await overflowing(page), 'with the menu open').toEqual([]);

      const family = await page.evaluate(() => getComputedStyle(document.documentElement).getPropertyValue('--script'));
      const script = /Noto Sans (\w+)/.exec(family)![1]!.toLowerCase();
      expect(fonts.some((f) => f.includes(`noto-sans-${script}`))).toBe(true);
      for (const f of fonts) expect(f, 'an unexpected font').toMatch(new RegExp(`/(geist-[\\w-]+|noto-sans-${script}-${script}-wght-normal)\\.[\\w-]+\\.woff2$`));
    });

    test("a missing page is a 404 in the language, on this site's side and the tools'", async ({ page }) => {
      expect((await page.goto(prefixed(l, '/no-such-page/')))?.status()).toBe(404);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(catalogues[l].notFound.heading);
      await expect(page.getByRole('link', { name: `${catalogues[l].notFound.back} →` })).toHaveAttribute('href', prefixed(l, '/'));

      expect((await page.goto(prefixed(l, '/tools/no-such-tool/')))?.status()).toBe(404);
      await expect(page.locator('html')).toHaveAttribute('lang', l);
      await expect(page.getByRole('heading', { level: 1 })).not.toHaveText(en.notFound.heading);
    });

    test('the home page looks right on a phone and a desktop, light and dark', async ({ page }) => {
      for (const [device, size] of [
        ['phone', { width: 360, height: 780 }],
        ['desktop', { width: 1280, height: 800 }],
      ] as const)
        for (const scheme of ['light', 'dark'] as const) {
          await page.setViewportSize(size);
          await page.emulateMedia({ colorScheme: scheme });
          await page.goto(prefixed(l, '/'));
          await page.evaluate(() => document.fonts.ready);
          await page.screenshot({ path: `${ARTIFACTS}/i18n-${l}-home-${device}-${scheme}.png`, fullPage: true });
        }
    });
  });
}

test('the language menu works from the keyboard', async ({ page }) => {
  await page.goto('/hi/');
  const summary = page.locator('.lang summary');
  await summary.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('.lang')).toHaveAttribute('open', '');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'English', exact: true })).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(page.locator('.lang')).not.toHaveAttribute('open');
  await expect(summary).toBeFocused();
  await page.keyboard.press('Enter');
  for (let i = 0; i < LOCALES.indexOf('ml') + 1; i++) await page.keyboard.press('Tab');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/ml/');
});
