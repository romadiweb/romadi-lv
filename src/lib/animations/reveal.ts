const revealSelector = '[data-reveal]';

const revealObserverOptions: IntersectionObserverInit = {
  rootMargin: '0px 0px 100px 0px',
  threshold: 0,
};

function revealElement(element: HTMLElement): void {
  element.dataset.revealState = 'revealed';

  const animation = element.animate(
    [
      {
        opacity: 0.8,
      },
      {
        opacity: 1,
      },
    ],
    {
      duration: 300,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      fill: 'none',
    },
  );

  // Finished WAAPI effects can retain compositor resources in WebKit. Explicitly
  // cancel after completion so long pages release each temporary layer.
  void animation.finished.then(() => animation.cancel()).catch(() => undefined);
}

export function initRevealAnimations(): void {
  const elements = document.querySelectorAll<HTMLElement>(revealSelector);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const compactViewport = window.matchMedia('(max-width: 700px)').matches;

  // Mobile Safari is particularly sensitive to large transformed descendants,
  // filters and blend modes being promoted together. Keep mobile content fully
  // painted and reserve motion for each component's lightweight interactions.
  if (
    document.body.dataset.pageReveals === 'false' ||
    reducedMotion ||
    compactViewport ||
    !('IntersectionObserver' in window)
  ) {
    elements.forEach((element) => {
      element.dataset.revealInitialized = 'true';
      element.dataset.revealState = 'revealed';
    });
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const element = entry.target as HTMLElement;
      observer.unobserve(element);
      revealElement(element);
    });
  }, revealObserverOptions);

  elements.forEach((element) => {
    if (element.dataset.revealInitialized === 'true') return;

    element.dataset.revealInitialized = 'true';
    observer.observe(element);
  });
}
