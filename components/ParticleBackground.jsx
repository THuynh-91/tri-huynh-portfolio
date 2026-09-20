import { useEffect, useRef } from 'react';

// Animated particle field with connecting lines that also link to the cursor.
// Colour is read from the --particle CSS var so it tracks the active theme.
export default function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let raf;
    let w = 0;
    let h = 0;
    const dpr = 1; // soft dots and hairlines; 1.5x cost 2.25x the pixels for no visible gain

    const rgb = () =>
      getComputedStyle(document.documentElement).getPropertyValue('--particle').trim() ||
      '99, 102, 241';

    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const count = Math.min(50, Math.floor((w * h) / 28000));
    const parts = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      r: Math.random() * 2 + 1,
    }));

    const mouse = { x: -9999, y: -9999 };
    const onMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const onLeave = () => {
      mouse.x = -9999;
      mouse.y = -9999;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseout', onLeave);
    window.addEventListener('resize', resize);

    const LINK = 140;
    const MOUSE_LINK = 200;
    const LINK2 = LINK * LINK;
    const MOUSE_LINK2 = MOUSE_LINK * MOUSE_LINK;

    // The theme only changes when <html> gains or loses `.dark`, so read the CSS
    // variable then, instead of calling getComputedStyle inside the frame loop.
    let colour = rgb();
    const themeObserver = new MutationObserver(() => {
      colour = rgb();
      buildStyles();
    });
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    /**
     * Drawing is batched, because it used to cost a draw call per link. With ~50
     * particles that is up to 1,275 beginPath/strokeStyle/stroke triples and as many
     * rgba() strings allocated every frame. Profiling showed this canvas, not the
     * JavaScript around it, was what pushed p50 frame time from 16.7ms to 33.3ms
     * while the pointer moved: hiding it alone restored 60fps.
     *
     * Now every dot is one path, and links are bucketed by opacity so each bucket is
     * a single path with one stroke. Same picture, ~11 draw calls instead of ~1,275.
     */
    const BUCKETS = 5;
    const TAU = Math.PI * 2;
    const linkBuckets = Array.from({ length: BUCKETS }, () => []);
    const mouseBuckets = Array.from({ length: BUCKETS }, () => []);
    let dotStyle = '';
    let linkStyles = [];
    let mouseStyles = [];
    const buildStyles = () => {
      dotStyle = `rgba(${colour}, 0.55)`;
      linkStyles = Array.from({ length: BUCKETS }, (_, k) =>
        `rgba(${colour}, ${(((k + 0.5) / BUCKETS) * 0.22).toFixed(3)})`);
      mouseStyles = Array.from({ length: BUCKETS }, (_, k) =>
        `rgba(${colour}, ${(((k + 0.5) / BUCKETS) * 0.5).toFixed(3)})`);
    };
    buildStyles();
    themeObserver.disconnect();
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (let k = 0; k < BUCKETS; k++) {
        linkBuckets[k].length = 0;
        mouseBuckets[k].length = 0;
      }

      // Move every particle, collect its dot into one path, and bucket its cursor link.
      ctx.fillStyle = dotStyle;
      ctx.beginPath();
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        ctx.moveTo(p.x + p.r, p.y);
        ctx.arc(p.x, p.y, p.r, 0, TAU);

        const mdx = p.x - mouse.x;
        const mdy = p.y - mouse.y;
        const md2 = mdx * mdx + mdy * mdy;
        if (md2 < MOUSE_LINK2) {
          const t = 1 - Math.sqrt(md2) / MOUSE_LINK;
          const k = Math.min(BUCKETS - 1, (t * BUCKETS) | 0);
          mouseBuckets[k].push(p.x, p.y);
        }
      }
      ctx.fill();

      for (let i = 0; i < parts.length; i++) {
        for (let j = i + 1; j < parts.length; j++) {
          const dx = parts[i].x - parts[j].x;
          const dy = parts[i].y - parts[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK2) {
            const t = 1 - Math.sqrt(d2) / LINK;
            const k = Math.min(BUCKETS - 1, (t * BUCKETS) | 0);
            linkBuckets[k].push(parts[i].x, parts[i].y, parts[j].x, parts[j].y);
          }
        }
      }

      ctx.lineWidth = 1;
      for (let k = 0; k < BUCKETS; k++) {
        const seg = linkBuckets[k];
        if (seg.length) {
          ctx.strokeStyle = linkStyles[k];
          ctx.beginPath();
          for (let n = 0; n < seg.length; n += 4) {
            ctx.moveTo(seg[n], seg[n + 1]);
            ctx.lineTo(seg[n + 2], seg[n + 3]);
          }
          ctx.stroke();
        }
        const ms = mouseBuckets[k];
        if (ms.length) {
          ctx.strokeStyle = mouseStyles[k];
          ctx.beginPath();
          for (let n = 0; n < ms.length; n += 2) {
            ctx.moveTo(ms[n], ms[n + 1]);
            ctx.lineTo(mouse.x, mouse.y);
          }
          ctx.stroke();
        }
      }
    };

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    /**
     * The field is a full-viewport canvas, so every redraw is a full-viewport repaint
     * and it was the largest remaining cost while the pointer moves. Particles drift
     * 0.45px per frame; at 30Hz they move 0.9px per update, which is not a difference
     * anyone can see, and it halves the paint work.
     */
    const MIN_FRAME_MS = 1000 / 30;
    let lastDraw = 0;
    const loop = (t) => {
      if (t - lastDraw >= MIN_FRAME_MS) {
        lastDraw = t;
        draw();
      }
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (!raf && !reduce.matches) raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    };
    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVisibility);

    // Reduced motion still gets the field, just not the movement.
    draw();
    start();

    return () => {
      stop();
      themeObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseout', onLeave);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 -z-10"
      style={{ opacity: 0.7, willChange: 'transform', transform: 'translateZ(0)' }}
      aria-hidden="true"
    />
  );
}
