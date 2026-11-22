import { useEffect, useState } from 'react';
import { SuitIcon } from './CardArt';
import { HOLE, BOARD } from '../../data/hand';

// The hand, in the top bar, dealt as you read. The hole cards are up from the start; each board card turns
// over when its section scrolls into view, and the readout names the hand so far: ace-king suited, then a
// royal flush draw, then the royal flush once the 10♠ (the third project) is seen. Each card is a link to
// its section, and the one for the section on screen is raised.
const SLOTS = [
  ...HOLE.map((c) => ({ card: c, target: 'experience' })),
  ...BOARD.map((c) => ({ card: c, target: c.street === 'flop' ? c.id : 'more' })),
];

function readout(seen) {
  const n = ['cruxpack', 'predictions', 'gittimeline'].filter((id) => seen.has(id)).length;
  if (n === 3) return 'Royal flush';
  if (n === 2) return 'Royal flush draw';
  if (n === 1) return 'Ace high, three to a royal';
  return 'Ace-king suited';
}

export default function BoardBar() {
  const [seen, setSeen] = useState(() => new Set());
  const [here, setHere] = useState(null);
  useEffect(() => {
    let raf = 0;
    const check = () => {
      raf = 0;
      const vh = window.innerHeight;
      const next = new Set();
      let current = null;
      for (const s of SLOTS) {
        const el = document.getElementById(s.target);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.top < vh * 0.62) next.add(s.card.id);
        if (r.top < vh * 0.5 && r.bottom > vh * 0.3) current = s.target;
      }
      setSeen((prev) => {
        const merged = new Set([...prev, ...next]);
        return merged.size === prev.size ? prev : merged;
      });
      setHere(current);
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(check); };
    check();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf); };
  }, []);

  const go = (e, target) => {
    const el = document.getElementById(target);
    if (!el) return;
    e.preventDefault();
    const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    history.replaceState(null, '', `#${target}`);
  };

  return (
    <nav className="pk-board" aria-label="The hand, card by card">
      <ol>
        {SLOTS.map(({ card, target }, i) => {
          const up = HOLE.includes(card) || seen.has(card.id);
          const red = card.suit === 'heart' || card.suit === 'diamond';
          return (
            <li key={card.id} className={i === 2 ? 'is-gap' : undefined}>
              <a href={`#${target}`} onClick={(e) => go(e, target)}
                className={`pk-mini${up ? ' is-up' : ''}${red ? ' is-red' : ''}${here === target ? ' is-here' : ''}`}
                aria-label={`${card.rank} of ${card.suit}s: ${card.title}`}>
                <span className="pk-mini-in">
                  <span className="pk-mini-back" />
                  <span className="pk-mini-face"><b>{card.rank}</b><SuitIcon suit={card.suit} size={9} /></span>
                </span>
              </a>
            </li>
          );
        })}
      </ol>
      <span className="pk-board-read" aria-live="polite">{readout(seen)}</span>
    </nav>
  );
}
