import { expect, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const localPage = '/pakalpojumi/majas-lapu-izstrade-liepaja';
const canonicalUrl = `https://romadi.lv${localPage}`;

test.describe('Liepāja website development landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem(
        'romadi_cookie_consent_v1',
        JSON.stringify({ choice: 'denied', updatedAt: Date.now() }),
      );
    });
  });

  test('has indexable local-service metadata and structured data', async ({ page }) => {
    await page.goto(localPage);

    await expect(page).toHaveTitle('Mājaslapu izstrāde Liepājā | ROMADI');
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Mājaslapu izstrāde Liepājā',
    );
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content',
      /Profesionāla mājaslapu izstrāde Liepājā uzņēmumiem/i,
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', canonicalUrl);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content',
      'https://romadi.lv/images/social/majaslapu-izstrade-liepaja-share-v1.png',
    );
    await expect(page.locator('html')).toHaveAttribute('lang', 'lv');

    const structuredData = await page
      .locator('script[type="application/ld+json"]')
      .evaluate((script) => JSON.parse(script.textContent ?? '{}'));
    expect(structuredData['@graph']).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ '@type': 'WebPage', url: canonicalUrl }),
        expect.objectContaining({
          '@type': 'Service',
          name: 'Mājaslapu izstrāde Liepājā',
          areaServed: expect.arrayContaining([
            expect.objectContaining({ '@type': 'City', name: 'Liepāja' }),
          ]),
        }),
        expect.objectContaining({ '@type': 'BreadcrumbList' }),
        expect.objectContaining({
          '@type': 'FAQPage',
          mainEntity: expect.arrayContaining([expect.objectContaining({ '@type': 'Question' })]),
        }),
      ]),
    );
  });

  test('is connected to the main service page without appearing in the service catalogue', async ({
    page,
  }) => {
    await page.goto(localPage);
    await expect(
      page.getByRole('link', { name: 'Pilns mājaslapu izstrādes pakalpojums' }),
    ).toHaveAttribute('href', '/pakalpojumi/majaslapu-izstrade');

    await page.goto('/pakalpojumi/majaslapu-izstrade');
    await expect(page.getByRole('link', { name: 'Mājaslapu izstrāde Liepājā' })).toHaveAttribute(
      'href',
      localPage,
    );

    await page.goto('/pakalpojumi');
    await expect(page.getByRole('link', { name: 'Mājaslapu izstrāde Liepājā' })).toHaveCount(0);
  });

  test('remains usable on a narrow mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(localPage);

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    await expect(page.getByRole('link', { name: /pārrunāt mājaslapu/i })).toBeVisible();
    await expect(page.locator('.liepaja-hero__proof')).toBeVisible();

    const selectedScope = page.locator('[data-scope-tab][aria-selected="true"]');
    await expect(selectedScope).toHaveText('Landing lapa');
    await page.waitForTimeout(5_400);
    await expect(selectedScope).toHaveText('Landing lapa');
  });

  test('uses the compact hero, local region proof, and interactive scope switcher', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(localPage);

    const heading = page.getByRole('heading', { level: 1 });
    const headingSize = await heading.evaluate((element) =>
      Number.parseFloat(getComputedStyle(element).fontSize),
    );
    expect(headingSize).toBeLessThanOrEqual(60);
    await expect(page.locator('.liepaja-hero__copy > p')).toHaveCSS(
      'font-family',
      /Manrope Variable/i,
    );
    await expect(page.locator('.liepaja-hero__actions a')).toHaveCount(1);
    const heroBox = await page.locator('.liepaja-hero').boundingBox();
    const viewportHeight = await page.evaluate(() => window.innerHeight);
    expect(heroBox?.y ?? 100).toBeLessThanOrEqual(32);
    expect(
      Math.abs((heroBox?.height ?? 0) + (heroBox?.y ?? 0) - (viewportHeight - (heroBox?.y ?? 0))),
    ).toBeLessThanOrEqual(1);
    const headingBox = await heading.boundingBox();
    expect(
      Math.abs(
        (headingBox?.x ?? 0) +
          (headingBox?.width ?? 0) / 2 -
          (heroBox?.width ?? 0) / 2 -
          (heroBox?.x ?? 0),
      ),
    ).toBeLessThanOrEqual(2);
    await expect(page.locator('.liepaja-hero__project')).toHaveCount(0);

    await expect(
      page.getByRole('heading', { level: 2, name: 'Liepājā radīts. Pasaulei gatavs.' }),
    ).toBeVisible();
    await expect(page.locator('.liepaja-region__facts article')).toHaveCount(3);
    await expect(page.locator('[data-romadi-globe]')).toBeVisible();
    await expect(page.locator('.liepaja-system')).toHaveCount(0);
    const globeCallouts = page.locator('[data-callout]');
    await expect(globeCallouts).toHaveCount(3);
    const visibleCalloutCount = await page.locator('[data-callout].is-visible').count();
    expect(visibleCalloutCount).toBeGreaterThanOrEqual(1);
    expect(visibleCalloutCount).toBeLessThanOrEqual(3);
    expect(await page.locator('[data-callout].is-visible [data-callout-leader]').count()).toBe(
      visibleCalloutCount,
    );
    const calloutPositionsStart = await page.locator('[data-callout-card]').evaluateAll((cards) =>
      cards.map((card) => ({
        x: (card as HTMLElement).offsetLeft,
        y: (card as HTMLElement).offsetTop,
      })),
    );
    await page.waitForTimeout(700);
    const calloutPositionsEnd = await page.locator('[data-callout-card]').evaluateAll((cards) =>
      cards.map((card) => ({
        x: (card as HTMLElement).offsetLeft,
        y: (card as HTMLElement).offsetTop,
      })),
    );
    expect(calloutPositionsEnd).toEqual(calloutPositionsStart);
    await expect(
      page.getByText('Viena komanda no pirmās idejas līdz gatavai vietnei.'),
    ).toHaveCount(0);

    const businessTab = page.getByRole('tab', { name: 'Biznesa mājaslapa' });
    await businessTab.click();
    await expect(businessTab).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('[data-scope-phrase]')).toHaveText('vajadzīgo apjomu');
    await expect(page.getByRole('tabpanel', { name: 'Biznesa mājaslapa' })).toContainText(
      'no 1 100 €',
    );

    const closingCta = await page.locator('.liepaja-cta__field').boundingBox();
    const footer = await page.locator('.site-footer__panel').boundingBox();
    expect(Math.abs((closingCta?.x ?? 0) - (footer?.x ?? 0))).toBeLessThanOrEqual(1);
    expect(Math.abs((closingCta?.width ?? 0) - (footer?.width ?? 0))).toBeLessThanOrEqual(1);
    expect(
      Math.abs((closingCta?.y ?? 0) + (closingCta?.height ?? 0) - (footer?.y ?? 0)),
    ).toBeLessThanOrEqual(1);
  });

  test('has no serious or critical accessibility violations', async ({ page }) => {
    await page.goto(localPage);

    const results = await new AxeBuilder({ page }).analyze();
    const blockers = results.violations.filter(({ impact }) =>
      ['serious', 'critical'].includes(impact ?? ''),
    );

    expect(blockers).toEqual([]);
  });
});

test.describe('Cookie consent', () => {
  test('uses the compact ROMADI consent bar and persists a rejection', async ({ page }) => {
    await page.goto('/');

    const consent = page.locator('[data-cookie-consent]');
    await expect(consent).toBeVisible();
    await expect(consent).toContainText(
      'Mēs izmantojam sīkdatnes, lai nodrošinātu vietnes darbību un anonīmi analizētu apmeklējumu.',
    );
    await expect(consent.getByRole('link', { name: 'Uzzināt vairāk' })).toHaveAttribute(
      'href',
      '/sikdatnu-politika',
    );
    await expect(consent.getByRole('button', { name: 'Noraidīt' })).toBeVisible();
    await expect(consent.getByRole('button', { name: 'Piekrist' })).toBeVisible();

    const box = await consent.boundingBox();
    expect(box?.width).toBeLessThanOrEqual(1120);

    await consent.getByRole('button', { name: 'Noraidīt' }).click();
    await expect(consent).toBeHidden();
    await expect
      .poll(() =>
        page.evaluate(() => JSON.parse(localStorage.getItem('romadi_cookie_consent_v1') ?? '{}')),
      )
      .toMatchObject({ choice: 'denied' });
  });

  test('stays compact on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const consent = page.locator('[data-cookie-consent]');
    await expect(consent).toBeVisible();
    const box = await consent.boundingBox();
    expect(box?.width).toBeLessThanOrEqual(320);
    await expect(consent.getByRole('button', { name: 'Noraidīt' })).toBeVisible();
    await expect(consent.getByRole('button', { name: 'Piekrist' })).toBeVisible();
  });
});
