const countUpSelector = '[data-count-up]';

function animateCount(element: HTMLElement): void {
  const start = Number(element.dataset.countStart ?? 0);
  const end = Number(element.dataset.countEnd ?? element.textContent ?? 0);
  const duration = Number(element.dataset.countDuration ?? 1500);

  if (!Number.isFinite(start) || !Number.isFinite(end) || !Number.isFinite(duration)) {
    return;
  }

  const startedAt = performance.now();

  const tick = (timestamp: number): void => {
    const elapsed = timestamp - startedAt;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(start + (end - start) * easedProgress);

    element.textContent = String(value);

    if (progress < 1) {
      requestAnimationFrame(tick);
      return;
    }

    element.textContent = String(end);
  };

  element.textContent = String(start);
  requestAnimationFrame(tick);
}

export function initCountUp(): void {
  const elements = document.querySelectorAll<HTMLElement>(countUpSelector);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  elements.forEach((element) => {
    if (element.dataset.countInitialized === 'true') {
      return;
    }

    element.dataset.countInitialized = 'true';

    if (reducedMotion) {
      element.textContent = element.dataset.countEnd ?? element.textContent;
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          animateCount(element);
          observer.disconnect();
        });
      },
      {
        threshold: 0.5,
      },
    );

    observer.observe(element);
  });
}
