import { expect, test } from '@playwright/test';

test.describe('ROMADI portal security boundary', () => {
  test('renders a private login surface without public registration', async ({ page }) => {
    const response = await page.goto('/portal/login');

    expect(response?.status()).toBe(200);
    await expect(page).toHaveTitle(/Portāla pieteikšanās \| ROMADI/);
    await expect(page.getByRole('heading', { name: 'ROMADI portāla pieteikšanās' })).toBeAttached();
    await expect(page.getByLabel('E-pasta adrese')).toBeVisible();
    await expect(page.getByLabel('Parole')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Pieslēgties portālam' })).toBeVisible();
    await expect(page.getByText(/Nepilnvarota piekļuve nav atļauta/)).toBeVisible();
    await expect(page.getByText(/Pārvaldi projektus/)).toHaveCount(0);
    await expect(page.getByRole('link', { name: /reģistr/i })).toHaveCount(0);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      'content',
      'noindex, nofollow, noarchive',
    );
    expect(response?.headers()['content-security-policy']).toContain("frame-ancestors 'none'");
    expect(response?.headers()['cache-control']).toContain('no-store');
  });

  test('keeps the login card inside a mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/portal/login');

    const panel = page.locator('.portal-login-panel');
    await expect(panel).toBeVisible();
    expect(
      await panel.evaluate((element) => element.getBoundingClientRect().width),
    ).toBeLessThanOrEqual(358);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  });

  test('redirects an unauthenticated dashboard request to login', async ({ page }) => {
    await page.goto('/portal/dashboard');
    await expect(page).toHaveURL(/\/portal\/login\?reason=session$/);
  });

  test('rejects unauthenticated CMS API reads and writes', async ({ request, baseURL }) => {
    const read = await request.get('/api/portal/content/projects');
    expect(read.status()).toBe(401);

    const write = await request.post('/api/portal/content/projects', {
      headers: { origin: baseURL ?? 'http://127.0.0.1:4321' },
      data: {},
    });
    expect(write.status()).toBe(401);
  });

  test('rejects unauthenticated shared template access', async ({ request, baseURL }) => {
    const read = await request.get('/api/portal/text-templates');
    expect(read.status()).toBe(401);

    const write = await request.post('/api/portal/text-templates', {
      headers: { origin: baseURL ?? 'http://127.0.0.1:4321' },
      data: {},
    });
    expect(write.status()).toBe(401);
  });
});
