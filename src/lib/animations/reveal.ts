import { animate, inView } from 'motion';

const revealSelector = '[data-reveal]';

export function initRevealAnimations(): void {
  const elements = document.querySelectorAll<HTMLElement>(revealSelector);

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const compactViewport = window.matchMedia('(max-width: 700px)').matches;

  elements.forEach((element) => {
    if (element.dataset.revealInitialized === 'true') {
      return;
    }

    element.dataset.revealInitialized = 'true';

    // Content is visible by default. Compact viewports intentionally skip scroll
    // reveals so fast scrolling and browser back/forward restoration never expose
    // an empty section while the main thread catches up.
    if (reducedMotion || compactViewport) {
      element.style.opacity = '1';
      element.style.transform = 'none';
      return;
    }

    element.style.opacity = '0';
    element.style.transform = 'translateY(24px)';

    inView(
      element,
      () => {
        animate(
          element,
          {
            opacity: 1,
            transform: 'translateY(0px)',
          },
          {
            duration: 0.7,
            ease: [0.16, 1, 0.3, 1],
          },
        );
      },
      {
        amount: 0.2,
        margin: '0px 0px -10% 0px',
      },
    );
  });
}
