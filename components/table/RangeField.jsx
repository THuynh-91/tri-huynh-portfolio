import { useEffect, useRef } from 'react';
import RANGE from '../../data/range.json';

// Behind the hero: the 13x13 chart every poker player knows, one cell per starting hand (pairs on the diagonal,
// suited hands above it). It sits nearly invisible until the pointer moves over the hero; then the cells near
// the pointer light up, hotter the stronger the hand (the real preflop equity of each, from data/range.json).
// A-K suited, the hand dealt on this page, stays lit. Decoration only: hidden from assistive tech, and still
// (no light) on touch screens and with reduced motion.
const LO = 32.5, HI = 84.9;

function Cells({ you }) {
  return RANGE.grid.flat().map(([label, eq]) => (
    <span key={label} className={label === you ? 'is-you' : undefined} style={{ '--h': ((eq - LO) / (HI - LO)).toFixed(3) }}>{label}</span>
  ));
}

export default function RangeField({ you = 'AKs' }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return undefined;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let raf = 0, last = null;
    const apply = () => {
      raf = 0;
      if (!last) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${(last.clientX - r.left).toFixed(0)}px`);
      el.style.setProperty('--my', `${(last.clientY - r.top).toFixed(0)}px`);
      el.classList.add('is-lit');
    };
    const move = (e) => { last = e; if (!raf) raf = requestAnimationFrame(apply); };
    const leave = () => { last = null; el.classList.remove('is-lit'); };
    host.addEventListener('pointermove', move);
    host.addEventListener('pointerleave', leave);
    return () => { host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div className="pk-range" ref={ref} aria-hidden="true">
      <div className="pk-range-grid base"><Cells you={you} /></div>
      <div className="pk-range-grid lit"><Cells you={you} /></div>
    </div>
  );
}
