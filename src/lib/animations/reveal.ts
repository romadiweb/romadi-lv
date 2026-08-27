const revealSelector = '[data-reveal]';

const revealObserverOptions: IntersectionObserverInit = {
  rootMargin: '0px 0px -8% 0px',
  threshold: 0.12,
};

function revealElement(element: HTMLElement, compactViewport: boolean): void {
  element.dataset.revealState = 'revealed';

  // Web Animations keeps this path dependency-free and compositor-only. The
  // resting HTML is always visible, so delayed JS or a fast scroll can never
  // leave a section blank.
  element.animate(
    [
      {
        opacity: compactViewport ? 0.58 : 0.42,
        transform: `translate3d(0, ${compactViewport ? 16 : 22}px, 0)`,
      },
      {
        opacity: 1,
        transform: 'translate3d(0, 0, 0)',
      },
    ],
    {
      duration: compactViewport ? 520 : 680,
      easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
      fill: 'none',
    },
  );
}

export function initRevealAnimations(): void {
  const elements = document.querySelectorAll<HTMLElement>(revealSelector);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const compactViewport = window.matchMedia('(max-width: 700px)').matches;

  if (reducedMotion || !('IntersectionObserver' in window)) {
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
      revealElement(element, compactViewport);
    });
  }, revealObserverOptions);

  elements.forEach((element) => {
    if (element.dataset.revealInitialized === 'true') return;

    element.dataset.revealInitialized = 'true';
    observer.observe(element);
  });
}
