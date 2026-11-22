import { useEffect, useRef } from 'react';
import PlayingCard from './PlayingCard';
import Pct from './SixSeven';
import { HOLE, EQUITY } from '../../data/hand';

// The two hole cards in the hero. They lean toward the pointer, a highlight slides across the face under it,
// and each opens its sheet like the cards on the table. Pointer effects only with a mouse and full motion.
export default function HeroHand({ onOpen }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const host = el.closest('section') || el;
    const cards = [...el.querySelectorAll('.pk-card')];
    let raf = 0, last = null;
    const apply = () => {
      raf = 0;
      for (const c of cards) {
        if (!last) { c.style.removeProperty('--rx'); c.style.removeProperty('--ry'); continue; }
        const r = c.getBoundingClientRect();
        const dx = Math.max(-1, Math.min(1, (last.clientX - (r.left + r.width / 2)) / (r.width * 2.2)));
        const dy = Math.max(-1, Math.min(1, (last.clientY - (r.top + r.height / 2)) / (r.height * 2.2)));
        c.style.setProperty('--ry', `${(dx * 14).toFixed(2)}deg`);
        c.style.setProperty('--rx', `${(-dy * 11).toFixed(2)}deg`);
        c.style.setProperty('--gx', `${(((last.clientX - r.left) / r.width) * 100).toFixed(1)}%`);
        c.style.setProperty('--gy', `${(((last.clientY - r.top) / r.height) * 100).toFixed(1)}%`);
      }
    };
    const move = (e) => { last = e; if (!raf) raf = requestAnimationFrame(apply); };
    const leave = () => { last = null; if (!raf) raf = requestAnimationFrame(apply); };
    host.addEventListener('pointermove', move);
    host.addEventListener('pointerleave', leave);
    return () => { host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave); cancelAnimationFrame(raf); };
  }, []);
  return (
    <div className="pk-hero-cards" ref={ref}>
      <div className="pk-fan a"><PlayingCard card={HOLE[0]} faceUp hero onOpen={onOpen} /></div>
      <div className="pk-fan b"><PlayingCard card={HOLE[1]} faceUp hero onOpen={onOpen} /></div>
      <p className="pk-hero-note"><span>A♠ K♠ suited</span> <Pct value={EQUITY[0]} /> against one random hand</p>
    </div>
  );
}
