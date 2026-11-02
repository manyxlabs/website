import { expect, test } from '@playwright/test';

test('a product opens in a new tab and leaves the landing page open', async ({ page }) => {
  await page.goto('/');
  const [tab] = await Promise.all([page.waitForEvent('popup'), page.getByRole('link', { name: 'Open resizer →' }).click()]);
  // The resizer is its own Worker; this page only reaches it through the website's forwarding.
  await expect(tab).toHaveURL(/\/tools\/photo-resizer\/$/);
  await expect(tab.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page).toHaveURL(/\/$/);

  for (const name of ['Form Photo & Signature Resizer', 'Mutual Fund Screener']) {
    const source = page.getByRole('link', { name: `${name} source code on GitHub` });
    await expect(source).toHaveAttribute('target', '_blank');
    await expect(source).toHaveAttribute('href', /^https:\/\/github\.com\/manyxlabs\//);
  }
});
