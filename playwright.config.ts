import { defineConfig } from '@playwright/test';

const resizer = process.env.RESIZER_DIR ?? '../photo-resizer';
// PORT lets several checkouts run their suites side by side.
const port = Number(process.env.PORT ?? 4330);

export default defineConfig({
  testDir: 'e2e',
  outputDir: 'test-results/playwright',
  use: {
    baseURL: process.env.BASE_URL ?? `http://localhost:${port}`,
    // Set CHROMIUM to a system browser where Playwright's own download is unavailable.
    launchOptions: { executablePath: process.env.CHROMIUM || undefined },
  },
  // Both Workers, joined by their service binding as in production, so the resizer's
  // forwarded paths are tested too. RESIZER_DIR is a checkout of manyxlabs/photo-resizer.
  // BASE_URL runs the suite against a deployed site instead.
  webServer: process.env.BASE_URL
    ? undefined
    : {
        command: `npm run build && npm --prefix ${resizer} run build && npx -y wrangler@4.152.0 dev -c wrangler.jsonc -c ${resizer}/wrangler.jsonc --port ${port}`,
        port,
        reuseExistingServer: false,
        timeout: 180_000,
      },
});
