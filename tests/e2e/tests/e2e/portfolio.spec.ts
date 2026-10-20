import { expect, test } from '@playwright/test';

test.describe('ROMADI portfolio', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        'romadi_cookie_consent_v1',
        JSON.stringify({ choice: 'denied', updatedAt: Date.now() }),
      );
    });
  });

  test('keeps published projects available when Supabase is unreachable', async ({ page }) => {
    await page.goto('/portfolio');

    await expect(
      page.getByRole('heading', { level: 1, name: /digitāli darbi ar skaidru mērķi/i }),
    ).toBeVisible();

    const projectCards = page.locator('.project-card');
    await expect(projectCards).toHaveCount(3);
    await expect(page.locator('[data-showcase-visual]')).toHaveCount(3);
    await expect(page.locator('[data-showcase-tab]')).toHaveCount(3);

    await projectCards.first().locator('[data-open-project]').click();
    await expect(page.locator('[data-project-dialog][open]')).toContainText('Diana Hunt');
  });

  test('provides case-study details, website buttons, and current social links', async ({
    page,
  }) => {
    await page.goto('/portfolio');
    for (const [index, url, feature] of [
      [1, 'https://liepajasteltis.lv', 'Nomas saraksts'],
      [2, 'https://ljk.lv', 'Studiju programmu pārskats'],
    ] as const) {
      await page.locator('.project-card').nth(index).locator('[data-open-project]').click();
      const dialog = page.locator('[data-project-dialog][open]');
      await expect(dialog).toContainText(feature);
      await expect(dialog.getByRole('link', { name: /Apmeklēt vietni/ })).toHaveAttribute(
        'href',
        url,
      );
      await page.keyboard.press('Escape');
    }
    await expect(
      page.locator('footer').getByRole('link', { name: 'Instagram', exact: true }),
    ).toHaveAttribute('href', 'https://www.instagram.com/romadi.lv');
    await expect(
      page.locator('footer').getByRole('link', { name: 'TikTok', exact: true }),
    ).toHaveAttribute('href', 'https://www.tiktok.com/@romadilv');
  });
});
