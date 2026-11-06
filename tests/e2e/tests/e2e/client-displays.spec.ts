import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      'romadi_cookie_consent_v1',
      JSON.stringify({ choice: 'denied', updatedAt: Date.now() }),
    );
  });
});

test('shows five flat white partner logos with stable homepage content', async ({ page }) => {
  await page.goto('/');
  const partners = page.locator('.home-partners__logo-item:not([aria-hidden])');
  await expect(partners).toHaveCount(5);
  const logos = partners.locator('img');
  expect(
    await logos.evaluateAll((images) =>
      images.every((image) => image.getAttribute('src')?.startsWith('/images/clients/')),
    ),
  ).toBe(true);
  await expect(page.locator('[data-client-logo="lr-events"]').first()).toHaveCSS(
    'filter',
    'grayscale(1)',
  );

  if (page.viewportSize()!.width > 900) {
    const tops = await partners.evaluateAll((items) =>
      items.map((item) => item.getBoundingClientRect().top),
    );
    expect(new Set(tops).size).toBe(1);
  }

  for (const selector of [
    '.home-services__intro',
    '.home-support__statement',
    '.template-offer__panel',
  ]) {
    const section = page.locator(selector);
    await section.scrollIntoViewIfNeeded();
    await expect(section).toHaveAttribute('data-reveal-state', 'revealed');
    await expect(section).toHaveCSS('opacity', '1');
    await expect(section).toHaveCSS('transform', 'none');
    expect(await section.evaluate((element) => element.getAnimations().length)).toBe(0);
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
});

test('counts and renders only completed clients with metallic logos', async ({ page }) => {
  await page.goto('/pakalpojumi/majaslapu-izstrade');
  const proof = page.locator('[data-website-proof]');
  await expect(proof.locator('[data-project-count]')).toHaveText('3');
  await expect(proof.locator('.website-proof__mark')).toHaveCount(3);
  const marks = await proof
    .locator('img')
    .evaluateAll((images) => images.map((image) => image.getAttribute('src')));
  expect(marks.every((src) => src?.includes('-metallic.webp'))).toBe(true);
  await expect(proof).not.toContainText('LR Events');
  await expect(proof).not.toContainText('LaLu');
});
