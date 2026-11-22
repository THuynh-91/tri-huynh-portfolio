import { useEffect, useRef } from 'react';

// The room's air: two warm lamp glows fixed behind the page, and dust motes drifting up through them. Motes
// near each other are joined by faint threads, and the pointer pulls threads to the motes around it (the
// classic site's constellation, in lamplight). A quarter of the pixels, 30 updates a second, paused when the
// tab is hidden; with reduced motion the motes are drawn once and stay put.
export default function Ambience() {
  const ref = useRef(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext('2d');
    const scale = 0.6;
    let w = 0, h = 0, raf = 0, last = 0;
    const resize = () => {
      w = window.innerWidth; h = window.innerHeight;
      canvas.width = Math.round(w * scale); canvas.height = Math.round(h * scale);
      ctx.setTransform(scale, 0, 0, scale, 0, 0);
    };
    resize();
    const count = Math.max(18, Math.min(60, Math.floor((w * h) / 26000)));
    const motes = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.16, vy: -0.05 - Math.random() * 0.17,
      r: 0.6 + Math.random() * 1.7, a: 0.18 + Math.random() * 0.4,
    }));
    const mouse = { x: -9999, y: -9999 };
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const onMove = (e) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    const onOut = (e) => { if (!e.relatedTarget) { mouse.x = -9999; mouse.y = -9999; } };
    if (fine) { window.addEventListener('pointermove', onMove, { passive: true }); window.addEventListener('pointerout', onOut); }
    window.addEventListener('resize', resize);

    const LINK = 120, LINK2 = LINK * LINK, PULL = 190, PULL2 = PULL * PULL;
    const draw = (move) => {
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        if (move) {
          m.x += m.vx; m.y += m.vy;
          if (m.y < -10) { m.y = h + 10; m.x = Math.random() * w; }
          if (m.x < -10) m.x = w + 10; else if (m.x > w + 10) m.x = -10;
        }
      }
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < motes.length; i++) {
        for (let j = i + 1; j < motes.length; j++) {
          const dx = motes[i].x - motes[j].x, dy = motes[i].y - motes[j].y;
          if (dx * dx + dy * dy < LINK2) { ctx.moveTo(motes[i].x, motes[i].y); ctx.lineTo(motes[j].x, motes[j].y); }
        }
      }
      ctx.strokeStyle = 'rgba(255, 214, 170, 0.05)';
      ctx.stroke();
      ctx.beginPath();
      for (const m of motes) {
        const dx = m.x - mouse.x, dy = m.y - mouse.y;
        if (dx * dx + dy * dy < PULL2) { ctx.moveTo(m.x, m.y); ctx.lineTo(mouse.x, mouse.y); }
      }
      ctx.strokeStyle = 'rgba(255, 190, 140, 0.14)';
      ctx.stroke();
      for (const m of motes) {
        ctx.fillStyle = `rgba(255, 220, 180, ${m.a})`;
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const loop = (t) => {
      if (t - last >= 33) { last = t; draw(true); }
      raf = requestAnimationFrame(loop);
    };
    const start = () => { if (!raf && !reduce) raf = requestAnimationFrame(loop); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    const vis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', vis);
    draw(false);
    start();
    return () => {
      stop();
      document.removeEventListener('visibilitychange', vis);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerout', onOut);
      window.removeEventListener('resize', resize);
    };
  }, []);
  return (
    <div className="pk-air" aria-hidden="true">
      <span className="pk-air-glow a" />
      <span className="pk-air-glow b" />
      <canvas ref={ref} className="pk-air-motes" />
    </div>
  );
}
