import { useEffect, useRef } from 'react';
import { rng } from './fx';

// Manga speed lines that streak down the screen while you scroll fast, and fade when you stop.
export default function ScrollLines() {
  const ref = useRef(null);
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const g = cv.getContext('2d');
    const r = rng(5);
    const lines = Array.from({ length: 70 }, () => ({ x: r(), w: 0.4 + r() * 2.2, len: 0.25 + r() * 0.6, off: r() }));
    let lastY = window.scrollY, lastT = performance.now(), vel = 0, alpha = 0, raf = 0, phase = 0;
    const size = () => {
      const d = Math.min(2, window.devicePixelRatio || 1);
      cv.width = window.innerWidth * d; cv.height = window.innerHeight * d;
      g.setTransform(d, 0, 0, d, 0, 0);
    };
    const draw = () => {
      const W = window.innerWidth, H = window.innerHeight;
      g.clearRect(0, 0, W, H);
      alpha *= 0.9;
      if (alpha < 0.01) { raf = 0; cv.style.opacity = '0'; return; }
      cv.style.opacity = String(Math.min(0.55, alpha));
      phase += vel * 0.02;
      g.fillStyle = '#1d1c1e';
      for (const l of lines) {
        if (l.x > 0.12 && l.x < 0.88 && l.w > 1.2) continue; // keep the reading column mostly clear
        const x = l.x * W;
        const y = (((l.off + phase * 0.001) % 1) + 1) % 1 * H * 1.6 - H * 0.3;
        const len = l.len * H;
        g.beginPath();
        g.moveTo(x - l.w / 2, y);
        g.lineTo(x + l.w / 2, y);
        g.lineTo(x, y + len);
        g.closePath();
        g.fill();
      }
      raf = requestAnimationFrame(draw);
    };
    const onScroll = () => {
      const t = performance.now();
      const dy = window.scrollY - lastY;
      vel = (dy / Math.max(1, t - lastT)) * 1000; // px/s
      lastY = window.scrollY; lastT = t;
      const a = Math.min(1, Math.max(0, (Math.abs(vel) - 1800) / 3000));
      if (a > alpha) alpha = a;
      if (alpha > 0.02 && !raf) raf = requestAnimationFrame(draw);
    };
    size();
    window.addEventListener('resize', size);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('resize', size); window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf); };
  }, []);
  return <canvas ref={ref} className="ink-scrolllines" aria-hidden="true" />;
}
