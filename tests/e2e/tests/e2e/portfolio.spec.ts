import { expect, test } from '@playwright/test';
import { getPortfolioPlacement } from '../../../../src/lib/portfolio-layout';

test.describe('ROMADI portfolio', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });
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
    await expect(projectCards).toHaveCount(5);
    await expect(page.locator('[data-showcase-visual]')).toHaveCount(3);
    await expect(page.locator('[data-showcase-tab]')).toHaveCount(3);

    await projectCards.first().locator('[data-open-project]').click();
    await expect(page.locator('[data-project-dialog][open]')).toContainText('Diana Hunt');
  });

  test('shows LR Events with a reusable empty-image preview and opens its overview', async ({
    page,
  }) => {
    await page.goto('/portfolio');
    const card = page
      .locator('.project-card')
      .filter({ has: page.locator('[data-project-slug="lr-events"]') });
    await expect(card).toHaveClass(/project-card--compact/);
    await expect(card.locator('.project-card__media')).toHaveClass(/project-card__media--logo/);
    await expect(card.locator('.project-status-badge')).toContainText('Izstrādē');
    await expect(page.locator('[data-portfolio-pagination]')).toHaveCount(0);
    await card.locator('[data-open-project]').click();
    const dialog = page.locator('[data-project-dialog][open]');
    await expect(dialog).toContainText('LR Events');
    await expect(dialog).toContainText('Izstrādē');
    await expect(dialog.getByRole('link', { name: /Apmeklēt vietni/ })).toHaveAttribute(
      'href',
      'https://lrevents-lv.vercel.app/',
    );
  });

  test('keeps the four-three-four pattern and pages additional projects', async ({ page }) => {
    await page.goto('/portfolio');
    await page.evaluate(
      (placements) => {
        const grid = document.querySelector('[data-portfolio-grid]')!;
        const template = grid.firstElementChild!;
        grid.replaceChildren(
          ...placements.map((placement, index) => {
            const card = template.cloneNode(true) as HTMLElement;
            card.querySelector('dialog')?.remove();
            card.querySelector('[data-open-project]')?.remove();
            card.dataset.portfolioPage = String(placement.page);
            card.hidden = placement.page > 0;
            card.classList.toggle('project-card--compact', placement.compact);
            card.querySelector('h3')!.textContent = `Projekts ${index + 1}`;
            return card;
          }),
        );
        const nav = document.createElement('nav');
        nav.dataset.portfolioPagination = '';
        nav.innerHTML =
          '<button data-portfolio-page-button="0" aria-current="page">1</button><button data-portfolio-page-button="1">2</button><span data-portfolio-page-status></span>';
        grid.after(nav);
        document.dispatchEvent(new Event('astro:page-load'));
      },
      Array.from({ length: 12 }, (_, index) => getPortfolioPlacement(index)),
    );
    await expect(page.locator('.project-card:visible')).toHaveCount(11);
    if (page.viewportSize()!.width > 900) {
      const rects = await page.locator('.project-card:visible').evaluateAll((cards) =>
        cards.map((card) => {
          const rect = card.getBoundingClientRect();
          return { top: rect.top, width: rect.width };
        }),
      );
      expect(rects[0]!.top).toBe(rects[1]!.top);
      expect(rects[2]!.top).toBe(rects[3]!.top);
      expect(rects[4]!.top).toBe(rects[5]!.top);
      expect(rects[5]!.top).toBe(rects[6]!.top);
      expect(rects[4]!.width).toBeLessThan(rects[0]!.width);
      expect(rects[7]!.width).toBe(rects[0]!.width);
      expect(rects[9]!.top).toBe(rects[10]!.top);
    }
    await page.locator('[data-portfolio-page-button="1"]').click();
    await expect(page.locator('.project-card:visible')).toHaveCount(1);
    await expect(page.locator('.project-card:visible')).toContainText('Projekts 12');
    await expect(page.locator('[data-portfolio-page-status]')).toHaveText('2. lapa no 2');
    await page.locator('[data-portfolio-page-button="0"]').click();
    await expect(page.locator('.project-card:visible')).toHaveCount(11);
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
