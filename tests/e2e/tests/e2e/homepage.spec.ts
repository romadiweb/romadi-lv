import { expect, test } from '@playwright/test';

test.describe('ROMADI homepage', () => {
  test('displays the main homepage content', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/ROMADI — mājaslapu izstrāde un digitālā izaugsme/i);

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: /digitālus risinājumus/i,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole('link', {
        name: /pieteikt projektu/i,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole('link', {
        name: /apskatīt darbus/i,
      }),
    ).toBeVisible();
  });

  test('contains correct SEO metadata', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /ROMADI izstrādā mūsdienīgas mājaslapas/i,
    );

    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://romadi.lv/',
    );

    await expect(page.locator('meta[property="og:site_name"]')).toHaveAttribute(
      'content',
      'ROMADI',
    );

    await expect(page.locator('html')).toHaveAttribute('lang', 'lv');
  });

  test('primary navigation links have valid destinations', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('link', {
        name: /pieteikt projektu/i,
      }),
    ).toHaveAttribute('href', '/kontakti');

    await expect(
      page.getByRole('link', {
        name: /apskatīt darbus/i,
      }),
    ).toHaveAttribute('href', '/portfolio');
  });

  test('homepage works on mobile', async ({ page }) => {
    await page.setViewportSize({
      width: 390,
      height: 844,
    });

    await page.goto('/');

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: /digitālus risinājumus/i,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole('link', {
        name: /pieteikt projektu/i,
      }),
    ).toBeVisible();
  });
});
