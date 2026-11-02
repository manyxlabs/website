import { expect, test } from '@playwright/test';

const ARTIFACTS = 'test-results/artifacts';
const background = (page: import('@playwright/test').Page) =>
  page.evaluate(() => getComputedStyle(document.body).backgroundColor);

test('the theme toggle overrides the system theme and survives a reload', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const dark = await background(page);
  const toggle = page.getByRole('button', { name: 'Switch to light theme' });

  await toggle.click();
  const light = await background(page);
  expect(light).not.toBe(dark);
  await expect(page.getByRole('button', { name: 'Switch to dark theme' })).toBeVisible();
  await page.screenshot({ path: `${ARTIFACTS}/home-light-on-dark-system.png`, fullPage: true });

  // Another page, after a reload: the choice holds even though the system is still dark.
  await page.goto('/tools/photo-resizer/');
  expect(await background(page)).toBe(light);

  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  expect(await background(page)).toBe(dark);
});
