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
});
