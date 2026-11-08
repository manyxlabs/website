import { expect, test } from '@playwright/test';

const ARTIFACTS = 'test-results/artifacts';
// The page colour (--ink) of each theme; the body fades between them, so assertions retry.
const LIGHT = 'rgb(245, 245, 247)';
const DARK = 'rgb(5, 5, 6)';

test('the theme toggle overrides the system theme and survives a reload', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');
  const body = page.locator('body');
  await expect(body).toHaveCSS('background-color', DARK);

  await page.getByRole('button', { name: 'Switch to light theme' }).click();
  await expect(body).toHaveCSS('background-color', LIGHT);
  await expect(page.getByRole('button', { name: 'Switch to dark theme' })).toBeVisible();
  await page.screenshot({ path: `${ARTIFACTS}/home-light-on-dark-system.png`, fullPage: true });

  // Another page, after a reload: the choice holds even though the system is still dark.
  await page.goto('/tools/photo-resizer/');
  await expect(body).toHaveCSS('background-color', LIGHT);
  await expect(page.locator('html')).not.toHaveClass(/\bdark\b/);

  await page.getByRole('button', { name: 'Switch to dark theme' }).click();
  await expect(body).toHaveCSS('background-color', DARK);
});
