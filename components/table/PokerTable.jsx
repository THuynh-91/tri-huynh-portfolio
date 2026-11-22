import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import PlayingCard from './PlayingCard';
import { ChipStack, ChipTop } from './Chips';
import HandDetail from './HandDetail';
import { Focus } from '../ink/Ink';
import { rng } from '../ink/fx';
import { HOLE, BOARD, CONTACT } from '../../data/hand';

// One hand of no-limit hold'em on a table you look down at. The hole cards (A♠ the co-op, K♠ the school)
// are dealt first; "Deal" runs the flop (three projects), the turn and the river (side projects). At
// showdown the five spades slide into one row, A K Q J 10, and the pot bursts. A lamp follows the
// cursor, the table leans with it, cards lift off the felt when hovered, and a click on the felt tosses
// a chip.
const SHOWN = [0, 3, 4, 5, 5];
const ACTION = ['Deal the flop', 'Deal the turn', 'Deal the river', 'Showdown', 'Open my résumé'];
const STREET_NAME = ['Pre-flop', 'The flop', 'The turn', 'The river', 'Showdown'];
const ROYAL_ORDER = ['biogen', 'northeastern', 'cruxpack', 'predictions', 'gittimeline'];
const ROYAL = new Set(ROYAL_ORDER);
const TITLE = 'ROYAL FLUSH';
// a hand-lettered wobble for each letter (fixed, so every render matches)
const WOBBLE = [[-4, 2], [3, -3], [-2, 1], [5, -2], [-3, 3], [0, 0], [2, -4], [-5, 1], [4, 2], [-2, -2], [3, 3]];

const LAYOUT = {
  wide: {
    deck: [14, 30], pot: [50, 17], potEnd: [50, 84],
    board: [[25, 43], [37.5, 43], [50, 43], [62.5, 43], [75, 43]],
    holes: [[43.6, 79], [56.4, 79]],
    tilt: [-1.5, 1, -0.6, 1.4, -1], holeTilt: [-6, 6],
    // showdown: the royal flush in one row, the side cards pushed aside
    row: [[25.6, 47], [37.8, 47], [50, 47], [62.2, 47], [74.4, 47]],
    aside: { games: [12.5, 72], builds: [87.5, 72] },
  },
  tall: {
    deck: [14, 8], pot: [50, 16], potEnd: [50, 92],
    board: [[21, 33.5], [50, 33.5], [79, 33.5], [35, 56], [65, 56]],
    holes: [[36, 78.5], [64, 78.5]],
    tilt: [-2, 1, -1, 1.5, -1.5], holeTilt: [-7, 7],
    row: [[21, 35], [50, 35], [79, 35], [35, 58], [65, 58]],
    aside: { games: [27, 79], builds: [73, 79] },
  },
};

const pct = ([x, y]) => ({ left: `${x}%`, top: `${y}%` });

// the burst at showdown: chips thrown from the pot, fixed so every render matches
const BURST = (() => {
  const r = rng(77);
  return Array.from({ length: 22 }, (_, i) => ({ i, dx: (r() - 0.5) * 70, dy: -(3 + r() * 9), land: (r() - 0.5) * 30, rot: (r() - 0.5) * 720, c: ['red', 'paper', 'ink'][i % 3], d: r() * 0.25 }));
})();

function DealtCard({ card, at, from, tilt, delay, faceUp, glow, out, onOpen, compact, peek }) {
  return (
    <motion.div
      className={`pk-slot${peek ? ' is-peek' : ''}${out ? ' is-out' : ''}`}
      initial={{ ...pct(from), rotate: -40, opacity: 0 }}
      animate={{ ...pct(at), rotate: tilt, opacity: 1 }}
      transition={{ delay, type: 'spring', stiffness: 170, damping: 17, mass: 0.9, opacity: { duration: 0.15, delay } }}
      style={{ zIndex: glow ? 6 : 3, x: '-50%', y: '-50%', transformStyle: 'preserve-3d' }}
    >
      <PlayingCard card={card} faceUp={faceUp} glow={glow} onOpen={onOpen} compact={compact} />
    </motion.div>
  );
}

export default function PokerTable() {
  const [tall, setTall] = useState(false);
  const [street, setStreet] = useState(0);
  const [up, setUp] = useState({});
  const [round, setRound] = useState(0);
  const [open, setOpen] = useState(null);
  const [idle, setIdle] = useState(false);
  const [tossed, setTossed] = useState([]);
  const timers = useRef([]);
  const dealt = useRef(0);
  const opener = useRef(null);
  const actionRef = useRef(null);
  const stageRef = useRef(null);
  const { basePath } = useRouter();

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)');
    const set = () => setTall(mq.matches);
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, []);

  // the lamp follows the cursor, and the table leans a little with it (mouse only, never on touch)
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let raf = 0, last = null;
    const apply = () => {
      raf = 0;
      if (!last) return;
      const r = el.getBoundingClientRect();
      const x = Math.min(1, Math.max(0, (last.clientX - r.left) / r.width));
      const y = Math.min(1, Math.max(0, (last.clientY - r.top) / r.height));
      el.style.setProperty('--lx', `${(x * 100).toFixed(1)}%`);
      el.style.setProperty('--ly', `${(y * 100).toFixed(1)}%`);
      el.style.setProperty('--ry', `${((x - 0.5) * 5).toFixed(2)}deg`);
      el.style.setProperty('--rxd', `${((0.5 - y) * 3).toFixed(2)}deg`);
    };
    const move = (e) => { last = e; if (!raf) raf = requestAnimationFrame(apply); };
    const leave = () => { last = null; el.style.removeProperty('--ry'); el.style.removeProperty('--rxd'); el.style.removeProperty('--lx'); el.style.removeProperty('--ly'); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); cancelAnimationFrame(raf); };
  }, []);

  const later = useCallback((ms, fn) => { timers.current.push(setTimeout(fn, ms)); }, []);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // deal and turn up the hole cards on every new round
  useEffect(() => {
    later(1000, () => setUp((u) => ({ ...u, biogen: true, northeastern: true })));
    later(3400, () => setIdle(true));
  }, [round, later]);

  // each street: deal its cards, then turn them over in one sweep
  useEffect(() => {
    if (street === 0 || street === 4) return;
    const from = SHOWN[street - 1], to = SHOWN[street];
    for (let i = from; i < to; i++) later(620 + (i - from) * 110, () => setUp((u) => ({ ...u, [BOARD[i].id]: true })));
    later(2300, () => setIdle(true));
  }, [street, later]);

  // cards already on the board keep their place; only newly dealt ones animate in, staggered
  useEffect(() => { dealt.current = SHOWN[street]; }, [street]);

  const act = () => {
    setIdle(false);
    if (street < 4) { setStreet(street + 1); return; }
    window.open(`${basePath}${CONTACT.resume}`, '_blank', 'noreferrer');
  };
  const showdown = () => {
    setIdle(false);
    setUp(Object.fromEntries([...HOLE, ...BOARD].map((c) => [c.id, true])));
    setStreet(4);
    // the skip button leaves with this street; keep keyboard focus on the table's main action
    requestAnimationFrame(() => actionRef.current?.focus());
  };
  const reshuffle = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    dealt.current = 0;
    setOpen(null); setUp({}); setStreet(0); setIdle(false); setTossed([]); setRound((r) => r + 1);
  };
  const openCard = useCallback((card, el) => { opener.current = el; setOpen(card); }, []);
  const closeCard = useCallback(() => { setOpen(null); requestAnimationFrame(() => opener.current?.focus()); }, []);

  // a click on bare felt tosses a chip that lands where you clicked (inside the felt's rounded shape)
  const toss = (e) => {
    if (e.target !== e.currentTarget) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
    const rad = Math.min(r.width, r.height) / 2;
    const px = e.clientX - r.left, py = e.clientY - r.top;
    const cx = Math.min(Math.max(px, rad), r.width - rad), cy = r.height / 2;
    if (Math.hypot(px - cx, py - cy) > rad * 0.94) return;
    setTossed((t) => [...t.slice(-29), { id: `${Date.now()}-${t.length}`, x: x * 100, y: y * 100, c: ['red', 'paper', 'ink'][t.length % 3], rot: Math.round((x * 997 + y * 389) % 360) }]);
  };

  const L = tall ? LAYOUT.tall : LAYOUT.wide;
  const potCount = [2, 4, 5, 7, 8][street];
  const done = street === 4;
  const placeOf = (id, normal) => {
    if (!done) return normal;
    const i = ROYAL_ORDER.indexOf(id);
    return i >= 0 ? L.row[i] : L.aside[id] ?? normal;
  };

  return (
    <section className={`pk-room${tall ? ' is-tall' : ''}`} aria-label="The hand">
      <div className="pk-stage" ref={stageRef}>
        <div className="pk-table">
          <div className={`pk-felt${done ? ' is-showdown' : ''}`} onClick={toss}>
            <div className="pk-lamp" aria-hidden="true" />
            <p className="pk-print" aria-hidden="true">TRI HUYNH · SEAT 1 · NO LIMIT HOLD&apos;EM</p>
            {done && <div className="pk-focus"><Focus seed={21} count={110} rx={0.36} ry={0.4} red={0.06} /></div>}

            <div className="pk-deck" style={pct(L.deck)} aria-hidden="true"><span /><span /><span /></div>
            <span className="pk-dealer" style={{ left: `${L.deck[0] + (tall ? 15 : 8.5)}%`, top: `${L.deck[1] + (tall ? 0 : 2)}%` }} aria-hidden="true">D</span>

            {tossed.map((t) => (
              <motion.span key={t.id} className="pk-tossed" style={{ left: `${t.x}%`, top: `${t.y}%`, x: '-50%', y: '-50%' }}
                initial={{ scale: 1.9, opacity: 0, rotate: t.rot - 120 }} animate={{ scale: 1, opacity: 1, rotate: t.rot }}
                transition={{ type: 'spring', stiffness: 420, damping: 14 }} aria-hidden="true">
                <ChipTop color={t.c} />
              </motion.span>
            ))}

            <motion.div className="pk-pot" style={{ ...pct(L.pot), x: '-50%', y: '-50%' }} animate={done ? { left: `${L.potEnd[0]}%`, top: `${L.potEnd[1]}%`, scale: tall ? 0.7 : 0.9 } : pct(L.pot)} transition={{ duration: 0.9, ease: 'easeInOut', delay: 0.4 }}>
              <div className="pk-pot-chips">
                <ChipStack color="paper" count={Math.ceil(potCount / 2)} width={34} />
                <ChipStack color="red" count={potCount} width={34} />
                <ChipStack color="ink" count={Math.max(1, potCount - 2)} width={34} />
              </div>
            </motion.div>

            {done && BURST.slice(0, tall ? 10 : BURST.length).map((b) => (
              <motion.span key={`b${b.i}-${round}`} className="pk-burst" style={{ ...pct(L.pot), x: '-50%', y: '-50%' }} aria-hidden="true"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: [0, 1, 1, 0.95], scale: 1, left: [`${L.pot[0]}%`, `${L.pot[0] + b.dx * (tall ? 0.25 : 0.6)}%`, `${L.pot[0] + b.dx * (tall ? 0.4 : 1)}%`], top: [`${L.pot[1]}%`, `${L.pot[1] + b.dy}%`, `${L.potEnd[1] - (tall ? 3 : 8) + b.land * (tall ? 0.1 : 0.3)}%`], rotate: b.rot }}
                transition={{ duration: 1.25, delay: 0.55 + b.d, ease: [0.2, 0.7, 0.3, 1], times: [0, 0.45, 1] }}>
                <ChipTop color={b.c} />
              </motion.span>
            ))}

            <div key={`r${round}`} className="pk-cards">
              {HOLE.map((c, i) => (
                <DealtCard key={c.id} card={c} at={placeOf(c.id, L.holes[i])} from={L.deck} tilt={done ? 0 : L.holeTilt[i]} delay={done ? 0.05 * i : 0.15 + i * 0.2}
                  faceUp={!!up[c.id]} glow={done} onOpen={openCard} compact={tall} peek={street === 0 && i === 1} />
              ))}
              {BOARD.slice(0, SHOWN[street]).map((c, i) => (
                <DealtCard key={c.id} card={c} at={placeOf(c.id, L.board[i])} from={L.deck} tilt={done ? 0 : L.tilt[i]}
                  delay={done ? 0.05 * (i + 2) : 0.05 + Math.max(0, i - dealt.current) * 0.13}
                  faceUp={!!up[c.id]} glow={done && ROYAL.has(c.id)} out={done && !ROYAL.has(c.id)} onOpen={openCard} compact={tall} />
              ))}
            </div>

            <AnimatePresence>
              {done && (
                <div className="pk-showdown-pos">
                  <motion.div className="pk-showdown" initial={{ opacity: 0, scale: 1.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.45, type: 'spring', stiffness: 360, damping: 15 }}>
                    <strong aria-label="Royal flush">
                      {TITLE.split('').map((ch, i) => (
                        <span key={i} aria-hidden="true" style={{ transform: `translateY(${WOBBLE[i][1]}%) rotate(${WOBBLE[i][0]}deg)` }}>{ch === ' ' ? ' ' : ch}</span>
                      ))}
                    </strong>
                    <span className="pk-showdown-line">A K Q J 10, all spades</span>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="pk-bar">
        <div className="pk-street">
          <span className="pk-street-k">{STREET_NAME[street]}</span>
          <span className="pk-street-hint">{street === 0 ? 'Your hole cards are up. Hover to pick a card up, click to read it.' : done ? 'Every card opens. The two off-suit cards hold the side projects.' : 'Hover to pick a card up, click to read it.'}</span>
        </div>
        <div className="pk-actions">
          <button className="pk-btn ghost" onClick={reshuffle}>Reshuffle</button>
          {street < 3 && <button className="pk-btn ghost" onClick={showdown}>Skip to showdown</button>}
          <button ref={actionRef} className={`pk-btn${idle ? ' is-idle' : ''}`} onClick={act}>{ACTION[street]}</button>
        </div>
      </div>

      <HandDetail card={open} onClose={closeCard} />
    </section>
  );
}
