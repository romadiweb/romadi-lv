const HERO_SELECTOR = '[data-pointer-hero]';

interface PointerState {
  x: number;
  y: number;
  opacity: number;
}

function setupPointerHero(hero: HTMLElement): void {
  if (hero.dataset.pointerInitialized === 'true') {
    return;
  }

  hero.dataset.pointerInitialized = 'true';

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches;

  const supportsFinePointer = window.matchMedia(
    '(pointer: fine)',
  ).matches;

  let bounds = hero.getBoundingClientRect();

  const current: PointerState = {
    x: bounds.width * 0.5,
    y: bounds.height * 0.45,
    opacity: 0,
  };

  const target: PointerState = {
    ...current,
  };

  let animationFrameId: number | null = null;

  const updateBounds = (): void => {
    bounds = hero.getBoundingClientRect();
  };

  const render = (): void => {
    /*
     * Lower values create smoother, heavier movement.
     * Opacity reacts slightly faster than position.
     */
    current.x += (target.x - current.x) * 0.11;
    current.y += (target.y - current.y) * 0.11;
    current.opacity += (target.opacity - current.opacity) * 0.16;

    hero.style.setProperty('--pointer-x', `${current.x}px`);
    hero.style.setProperty('--pointer-y', `${current.y}px`);
    hero.style.setProperty(
      '--pointer-opacity',
      current.opacity.toFixed(3),
    );

    const positionDifference =
      Math.abs(target.x - current.x) +
      Math.abs(target.y - current.y);

    const opacityDifference = Math.abs(
      target.opacity - current.opacity,
    );

    if (
      positionDifference > 0.08 ||
      opacityDifference > 0.002
    ) {
      animationFrameId = window.requestAnimationFrame(render);
      return;
    }

    animationFrameId = null;
  };

  const scheduleRender = (): void => {
    if (animationFrameId !== null) {
      return;
    }

    animationFrameId = window.requestAnimationFrame(render);
  };

  const fadeOutPointer = (): void => {
    /*
     * Keep the pointer at its last position while it fades out.
     * Moving it back to the center during the fade causes a visible streak.
     */
    target.opacity = 0;

    scheduleRender();
  };

  const handlePointerMove = (
    event: PointerEvent,
  ): void => {
    const isInsideHero =
      event.clientX >= bounds.left &&
      event.clientX <= bounds.right &&
      event.clientY >= bounds.top &&
      event.clientY <= bounds.bottom;

    if (!isInsideHero) {
      fadeOutPointer();
      return;
    }

    target.x = event.clientX - bounds.left;
    target.y = event.clientY - bounds.top;
    target.opacity = 1;

    scheduleRender();
  };

  if (prefersReducedMotion || !supportsFinePointer) {
    /*
     * Keep a subtle static glow on touch devices.
     */
    hero.style.setProperty('--pointer-x', '50%');
    hero.style.setProperty('--pointer-y', '45%');
    hero.style.setProperty('--pointer-opacity', '0.24');

    return;
  }

  const controller = new AbortController();
  const resizeObserver = new ResizeObserver(updateBounds);

  resizeObserver.observe(hero);

  window.addEventListener(
    'pointermove',
    handlePointerMove,
    {
      passive: true,
      signal: controller.signal,
    },
  );

  window.addEventListener(
    'blur',
    fadeOutPointer,
    {
      signal: controller.signal,
    },
  );

  document.addEventListener(
    'astro:before-swap',
    () => {
      controller.abort();
      resizeObserver.disconnect();

      if (animationFrameId !== null) {
        window.cancelAnimationFrame(animationFrameId);
      }
    },
    {
      once: true,
    },
  );
}

export function initHeroPointer(): void {
  document
    .querySelectorAll<HTMLElement>(HERO_SELECTOR)
    .forEach(setupPointerHero);
}
