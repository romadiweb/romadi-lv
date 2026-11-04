/** A flowing typographic field. The headline stays real, selectable HTML. */
export function initHeroAscii(): void {
  document.querySelectorAll<HTMLElement>('[data-ascii-hero]').forEach((hero) => {
    if (hero.dataset.asciiInitialized) return;
    const canvas = hero.querySelector<HTMLCanvasElement>('[data-ascii-field]');
    const context = canvas?.getContext('2d', { alpha: true });
    if (!canvas || !context) return;
    hero.dataset.asciiInitialized = 'true';

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const finePointer = window.matchMedia('(pointer: fine)');
    const controller = new AbortController();
    const { signal } = controller;
    let width = 0;
    let height = 0;
    let frame = 0;
    let lastPaint = 0;
    let elapsed = 0;
    let visible = false;
    let disposed = false;
    const pointer = { x: -1000, y: -1000, strength: 0, active: false };
    const letters = 'ROMADI';
    const symbols = '.:+/<>*';

    function draw(time: number): void {
      if (!context || !canvas || !width || !height) return;
      context.clearRect(0, 0, width, height);
      const mobile = width < 600;
      const stepX = mobile ? 10 : 11;
      const stepY = mobile ? 14 : 14;
      context.font = `${mobile ? 8 : 9}px "SFMono-Regular", Consolas, monospace`;
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      pointer.strength += ((pointer.active ? 1 : 0) - pointer.strength) * 0.12;

      for (let y = 7, row = 0; y < height; y += stepY, row++) {
        const ny = y / height;
        for (let x = 6, col = 0; x < width; x += stepX, col++) {
          const nx = x / width;
          // Two broad, irregular ribbons leave a quiet opening around the copy.
          const lower =
            0.77 + 0.1 * Math.sin(nx * 6.4 + time * 0.28) + 0.035 * Math.sin(nx * 15 - time * 0.19);
          const upper = 0.17 + 0.07 * Math.sin(nx * 8 + time * 0.22);
          const lowerBand = Math.exp(-Math.pow((ny - lower) / 0.13, 2));
          const upperBand = Math.exp(-Math.pow((ny - upper) / 0.105, 2)) * 0.65;
          const folds = 0.65 + 0.35 * Math.sin(nx * 10 + ny * 8 + time * 0.32);
          const sideWeight = 0.4 + 0.6 * Math.pow(Math.abs(nx - 0.54) * 1.7, 0.7);
          const opening =
            1 - 0.99 * Math.exp(-Math.pow((nx - 0.5) / 0.31, 4) - Math.pow((ny - 0.46) / 0.25, 4));
          const edgeFade = Math.min(1, nx * 18, (1 - nx) * 18, ny * 20, (1 - ny) * 20);
          const distance = Math.hypot(x - pointer.x, y - pointer.y);
          const influence = Math.exp(-Math.pow(distance / 125, 2)) * pointer.strength;
          const density = Math.min(
            1,
            (lowerBand + upperBand) * folds * sideWeight + influence * 0.65,
          );
          const hash = (Math.sin(col * 127.1 + row * 311.7) * 43758.5453) % 1;
          const grain = Math.abs(hash);
          if (density < 0.075 + grain * 0.1 || opening * edgeFade < 0.015) continue;

          const alpha = Math.min(
            0.85,
            (0.1 + density * 0.64 + influence * 0.28) * opening * edgeFade,
          );
          const bright = density > 0.55 || influence > 0.25;
          context.fillStyle = bright ? `rgba(231,133,157,${alpha})` : `rgba(169,49,83,${alpha})`;
          const shift = Math.floor(time * 2 + grain * 5);
          const index = (col + row * 2 + shift) % letters.length;
          const glyph =
            density > 0.4 && grain > 0.24
              ? letters[index]!
              : density > 0.19
                ? symbols[(col + row + shift) % symbols.length]!
                : '.';
          // The cursor gently bends the stream instead of moving the hero itself.
          const bend = influence * Math.sin(ny * 18 + time) * 9;
          context.fillText(glyph, x + bend, y - influence * 5);
        }
      }
    }

    function tick(now: number): void {
      frame = 0;
      if (disposed || !visible || document.hidden || motion.matches) return;
      if (now - lastPaint >= 1000 / 24) {
        elapsed += Math.min((now - lastPaint) / 1000, 0.08);
        draw(elapsed);
        lastPaint = now;
      }
      frame = window.requestAnimationFrame(tick);
    }

    function sync(): void {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
      lastPaint = performance.now();
      if (motion.matches) {
        pointer.active = false;
        pointer.strength = 0;
        draw(0);
      } else if (visible && !document.hidden && !disposed) {
        frame = requestAnimationFrame(tick);
      }
    }

    const resize = new ResizeObserver(() => {
      const bounds = hero.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      draw(motion.matches ? 0 : elapsed);
    });
    resize.observe(hero);

    const intersection = new IntersectionObserver(([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      sync();
    });
    intersection.observe(hero);
    hero.addEventListener(
      'pointermove',
      (event) => {
        if (motion.matches || !finePointer.matches) return;
        const bounds = hero.getBoundingClientRect();
        pointer.x = event.clientX - bounds.left;
        pointer.y = event.clientY - bounds.top;
        pointer.active = true;
      },
      { passive: true, signal },
    );
    const leave = (): void => {
      pointer.active = false;
    };
    hero.addEventListener('pointerleave', leave, { signal });
    window.addEventListener('blur', leave, { signal });
    document.addEventListener('visibilitychange', sync, { signal });
    motion.addEventListener('change', sync, { signal });
    document.addEventListener(
      'astro:before-swap',
      () => {
        disposed = true;
        controller.abort();
        resize.disconnect();
        intersection.disconnect();
        if (frame) cancelAnimationFrame(frame);
      },
      { once: true, signal },
    );
  });
}
