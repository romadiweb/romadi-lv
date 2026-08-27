import { expect, test } from '@playwright/test';

test.describe('ROMADI homepage', () => {
  test('displays the main homepage content', async ({ page }) => {
    await page.goto('/');

    await expect(page).toHaveTitle(/ROMADI — mājaslapu izstrāde un digitālā izaugsme/i);

    await expect(
      page.getByRole('heading', {
        level: 1,
        name: /vairāk nekā tikai mājaslapa/i,
      }),
    ).toBeVisible();

    await expect(
      page
        .getByRole('link', {
          name: /pieteikt projektu/i,
        })
        .last(),
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
      page
        .getByRole('link', {
          name: /pieteikt projektu/i,
        })
        .last(),
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
        name: /vairāk nekā tikai mājaslapa/i,
      }),
    ).toBeVisible();

    await expect(
      page.getByRole('link', {
        name: /pieteikt projektu/i,
      }),
    ).toBeVisible();
  });

  test('mobile navigation opens with a real transition', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() => {
      localStorage.setItem(
        'romadi_cookie_consent_v1',
        JSON.stringify({ choice: 'denied', updatedAt: Date.now() }),
      );
    });
    await page.goto('/');

    const menu = page.locator('.site-header__mobile-menu');
    const trigger = menu.locator('summary');
    const panel = menu.locator('.site-header__mobile-panel');

    await expect(menu).not.toHaveAttribute('open', '');
    await expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await panel.evaluate((element) => {
      const testWindow = window as Window & { __romadiMenuTransitionRan?: boolean };
      testWindow.__romadiMenuTransitionRan = false;
      element.addEventListener('transitionrun', (event) => {
        if ((event as TransitionEvent).propertyName === 'transform') {
          testWindow.__romadiMenuTransitionRan = true;
        }
      });
    });
    await trigger.click();
    await expect(menu).toHaveAttribute('open', '');
    await expect(menu).toHaveAttribute('data-mobile-open', 'true');

    await expect
      .poll(() =>
        page.evaluate(
          () =>
            (window as Window & { __romadiMenuTransitionRan?: boolean }).__romadiMenuTransitionRan,
        ),
      )
      .toBe(true);

    await expect(panel).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 0)', { timeout: 800 });

    await trigger.click();
    await expect(menu).toHaveAttribute('data-mobile-open', 'false');
    await expect(menu).not.toHaveAttribute('open', '', { timeout: 800 });
  });

  test('mobile service artwork is ready before carousel interaction', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() => {
      localStorage.setItem(
        'romadi_cookie_consent_v1',
        JSON.stringify({ choice: 'denied', updatedAt: Date.now() }),
      );
    });
    await page.goto('/');

    const services = page.locator('.home-services');
    const intro = services.locator('.home-services__intro');
    const icons = services.locator('.home-services__service-icon');

    await expect(icons).toHaveCount(7);
    await expect(icons.first()).toHaveAttribute('loading', 'eager');
    await intro.scrollIntoViewIfNeeded();
    await expect(intro).toHaveAttribute('data-reveal-state', 'revealed');
    await expect(intro).toHaveCSS('opacity', '1');
    await expect(intro).toHaveCSS('transform', 'none');
    await expect
      .poll(() =>
        icons.evaluateAll((images) =>
          images.every((image) => {
            const serviceIcon = image as HTMLImageElement;
            return serviceIcon.complete && serviceIcon.naturalWidth > 0;
          }),
        ),
      )
      .toBe(true);

    await services.getByRole('button', { name: /nākamais pakalpojums/i }).click();
    await expect(services.locator('[data-services-carousel-index]')).toHaveText('2');
    await expect(icons.nth(1)).toBeVisible();
  });

  test('mobile sections and hero stay painted after a full-page scroll', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.addInitScript(() => {
      localStorage.setItem(
        'romadi_cookie_consent_v1',
        JSON.stringify({ choice: 'denied', updatedAt: Date.now() }),
      );
    });
    await page.goto('/');

    const hero = page.locator('.home-hero');
    const heroImage = hero.locator('.home-hero__image img');
    const mobileMenu = page.locator('.site-header__mobile-menu');

    await page.evaluate(() => {
      document.documentElement.style.scrollBehavior = 'auto';
      window.scrollTo(0, document.documentElement.scrollHeight);
    });
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(1_000);

    await hero.scrollIntoViewIfNeeded();
    await expect(hero).toBeInViewport();
    await expect(heroImage).toBeVisible();
    await expect(heroImage).toHaveCSS('will-change', 'auto');
    await expect(mobileMenu).not.toHaveAttribute('open', '');

    const paintState = await page.evaluate(() => {
      const revealElements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
      const genericRevealAnimations = document.getAnimations().filter((animation) => {
        const effect = animation.effect as KeyframeEffect | null;
        if (!(effect?.target instanceof HTMLElement) || !effect.target.matches('[data-reveal]')) {
          return false;
        }

        return effect
          .getKeyframes()
          .some(
            (frame) => String(frame.opacity) === '0.42' && String(frame.transform).includes('22px'),
          );
      });
      const image = document.querySelector<HTMLImageElement>('.home-hero__image img');

      return {
        allRevealed: revealElements.every(
          (element) =>
            element.dataset.revealState === 'revealed' && getComputedStyle(element).opacity === '1',
        ),
        heroImageDecoded: Boolean(image?.complete && image.naturalWidth > 0),
        genericRevealAnimationCount: genericRevealAnimations.length,
      };
    });

    expect(paintState).toEqual({
      allRevealed: true,
      heroImageDecoded: true,
      genericRevealAnimationCount: 0,
    });
  });
});
