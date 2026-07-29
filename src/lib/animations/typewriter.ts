const typewriterSelector = '[data-typewriter]';

function typeText(element: HTMLElement): void {
  const text = element.dataset.typewriterText ?? element.textContent ?? '';
  const speed = Number(element.dataset.typewriterSpeed ?? 24);
  let index = 0;

  element.textContent = '';
  element.dataset.typewriterActive = 'true';

  const tick = (): void => {
    index += 1;
    element.textContent = text.slice(0, index);

    if (index < text.length) {
      window.setTimeout(tick, speed);
    }
  };

  tick();
}

export function initTypewriters(): void {
  const elements = document.querySelectorAll<HTMLElement>(typewriterSelector);
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  elements.forEach((element) => {
    if (element.dataset.typewriterInitialized === 'true') {
      return;
    }

    element.dataset.typewriterInitialized = 'true';

    if (reducedMotion) {
      element.textContent = element.dataset.typewriterText ?? element.textContent;
      element.dataset.typewriterActive = 'true';
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          typeText(element);
          observer.disconnect();
        });
      },
      {
        threshold: 0.7,
      },
    );

    observer.observe(element);
  });
}
