import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import PlayingCard from './PlayingCard';
import { CardBack } from './CardArt';
import { ChipStack, ChipTop } from './Chips';
import HandDetail from './HandDetail';
import { HOLE, BOARD, CONTACT, HISTORY, EQUITY } from '../../data/hand';

// One hand of no-limit hold'em on a table you look down at, dealt the way a dealer deals it. The hole cards
// (A♠ the co-op, K♠ the school) come first. Each street burns a card to the muck; the flop lands as a face-down
// pile of three, is turned over in one motion and spread; the turn and the river come one card each. At
// showdown the five spades slide into one row, A K Q J 10. Under the table a hand history is written as you
// deal, and the equity meter shows what A♠K♠ is worth against one random hand (67%, then 100% from the flop).
// A lamp follows the pointer, the table leans with it, cards lift off the felt when hovered, and a click on the
// felt tosses a chip.
const SHOWN = [0, 3, 4, 5, 5];
const ACTION = ['Deal the flop', 'Deal the turn', 'Deal the river', 'Showdown', 'Open my résumé'];
const STREET_NAME = ['Pre-flop', 'The flop', 'The turn', 'The river', 'Showdown'];
const ROYAL_ORDER = ['biogen', 'northeastern', 'cruxpack', 'predictions', 'gittimeline'];
const ROYAL = new Set(ROYAL_ORDER);
const RED = /[♦♥]/;

const LAYOUT = {
  wide: {
    deck: [14, 30], muck: [14, 58], pot: [50, 17], potEnd: [50, 84],
    board: [[25, 43], [37.5, 43], [50, 43], [62.5, 43], [75, 43]],
    holes: [[43.6, 79], [56.4, 79]],
    tilt: [-1.5, 1, -0.6, 1.4, -1], holeTilt: [-6, 6],
    // showdown: the royal flush in one row, the side cards pushed aside
    row: [[25.6, 47], [37.8, 47], [50, 47], [62.2, 47], [74.4, 47]],
    aside: { games: [12.5, 72], builds: [87.5, 72] },
  },
  tall: {
    deck: [14, 8], muck: [86, 8], pot: [50, 16], potEnd: [50, 92],
    board: [[21, 33.5], [50, 33.5], [79, 33.5], [35, 56], [65, 56]],
    holes: [[36, 78.5], [64, 78.5]],
    tilt: [-2, 1, -1, 1.5, -1.5], holeTilt: [-7, 7],
    row: [[21, 35], [50, 35], [79, 35], [35, 58], [65, 58]],
    aside: { games: [27, 79], builds: [73, 79] },
  },
};

const pct = ([x, y]) => ({ left: `${x}%`, top: `${y}%` });

function DealtCard({ card, at, from, tilt, delay, faceUp, glow, out, onOpen, compact, peek, z }) {
  return (
    <motion.div
      className={`pk-slot${peek ? ' is-peek' : ''}${out ? ' is-out' : ''}`}
      initial={{ ...pct(from), rotate: -40, opacity: 0 }}
      animate={{ ...pct(at), rotate: tilt, opacity: 1 }}
      transition={{ delay, type: 'spring', stiffness: 170, damping: 18, mass: 0.9, opacity: { duration: 0.15, delay } }}
      style={{ zIndex: glow ? 6 : z ?? 3, x: '-50%', y: '-50%', transformStyle: 'preserve-3d' }}
    >
      <PlayingCard card={card} faceUp={faceUp} glow={glow} onOpen={onOpen} compact={compact} />
    </motion.div>
  );
}

function LogLine({ line }) {
  const [act, cards, note] = line;
  return (
    <>
      <span className="pk-log-act">{act}</span>
      {cards && (
        <span className="pk-log-cards">
          [{cards.split(' ').map((c, i) => <span key={c} className={RED.test(c) ? 'r' : undefined}>{i ? ' ' : ''}{c}</span>)}]
        </span>
      )}
      {note && <span className="pk-log-note">{note}</span>}
    </>
  );
}

export default function PokerTable() {
  const [tall, setTall] = useState(false);
  const [ready, setReady] = useState(false);
  const [live, setLive] = useState(false);
  const [touch, setTouch] = useState(false);
  const roomRef = useRef(null);
  const [street, setStreet] = useState(0);
  const [up, setUp] = useState({});
  const [spread, setSpread] = useState(false);
  const [round, setRound] = useState(0);
  const [open, setOpen] = useState(null);
  const [idle, setIdle] = useState(false);
  const [tossed, setTossed] = useState([]);
  const timers = useRef([]);
  const dealt = useRef(0);
  const opener = useRef(null);
  const actionRef = useRef(null);
  const stageRef = useRef(null);
  const logRef = useRef(null);
  const { basePath } = useRouter();

  // the layout is known only in the browser; cards are mounted after it is, so none is dealt from the wrong deck
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)');
    const set = () => setTall(mq.matches);
    set();
    setTouch(window.matchMedia('(hover: none)').matches);
    setReady(true);
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
  }, []);

  // the dealer starts when the table is on screen, so the deal is seen rather than done off-screen
  useEffect(() => {
    const el = roomRef.current;
    if (!ready || !el) return undefined;
    if (typeof IntersectionObserver === 'undefined') { setLive(true); return undefined; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setLive(true); io.disconnect(); } }, { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [ready]);

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

  // deal and turn up the hole cards on every new round. The first time the table is seen the dealer goes on
  // to the flop by itself (the three projects), so the felt is never just two cards; after a reshuffle the
  // visitor deals every street.
  useEffect(() => {
    if (!live) return;
    later(1000, () => setUp((u) => ({ ...u, biogen: true, northeastern: true })));
    if (round === 0) later(2400, () => setStreet((s) => (s === 0 ? 1 : s)));
    else later(3400, () => setIdle(true));
  }, [round, live, later]);

  // each street: deal its cards. The flop lands as a pile, turns over as one, then spreads; the turn and the
  // river turn over where they land.
  useEffect(() => {
    if (street === 0 || street === 4) return;
    const from = SHOWN[street - 1], to = SHOWN[street];
    if (street === 1) {
      later(900, () => setUp((u) => ({ ...u, ...Object.fromEntries(BOARD.slice(0, 3).map((c) => [c.id, true])) })));
      later(1650, () => setSpread(true));
      later(3000, () => setIdle(true));
      return;
    }
    for (let i = from; i < to; i++) later(720, () => setUp((u) => ({ ...u, [BOARD[i].id]: true })));
    later(2300, () => setIdle(true));
  }, [street, later]);

  // cards already on the board keep their place; only newly dealt ones animate in, staggered
  useEffect(() => { dealt.current = SHOWN[street]; }, [street]);

  // keep the newest line of the hand history in view
  useEffect(() => { const el = logRef.current; if (el) el.scrollTop = el.scrollHeight; }, [street]);

  const act = () => {
    setIdle(false);
    if (street < 4) { setStreet(street + 1); return; }
    window.open(`${basePath}${CONTACT.resume}`, '_blank', 'noreferrer');
  };
  const showdown = () => {
    setIdle(false);
    setUp(Object.fromEntries([...HOLE, ...BOARD].map((c) => [c.id, true])));
    setSpread(true);
    setStreet(4);
    // the skip button leaves with this street; keep keyboard focus on the table's main action
    requestAnimationFrame(() => actionRef.current?.focus());
  };
  const reshuffle = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    dealt.current = 0;
    setOpen(null); setUp({}); setStreet(0); setSpread(false); setIdle(false); setTossed([]); setRound((r) => r + 1);
  };
  const openCard = useCallback((card, el) => { opener.current = el; setOpen(card); }, []);
  const closeCard = useCallback(() => { setOpen(null); requestAnimationFrame(() => opener.current?.focus()); }, []);

  // a click on bare felt tosses a chip that lands where you clicked. offsetX/offsetY are in the felt's own
  // (untilted) coordinates, so the chip lands under the cursor however the table leans.
  const toss = (e) => {
    if (e.target !== e.currentTarget) return;
    const el = e.currentTarget;
    const w = el.offsetWidth, h = el.offsetHeight;
    const px = e.nativeEvent.offsetX, py = e.nativeEvent.offsetY;
    // inside the cloth: near enough the table's long axis (it runs across a wide table, down a tall one)
    const rad = Math.min(w, h) / 2;
    const cx = Math.min(Math.max(px, rad), w - rad), cy = Math.min(Math.max(py, rad), h - rad);
    if (Math.hypot(px - cx, py - cy) > rad * 0.92) return;
    setTossed((t) => [...t.slice(-11), { id: `${Date.now()}-${t.length}`, x: (px / w) * 100, y: (py / h) * 100, c: ['red', 'paper', 'red', 'ink'][t.length % 4], rot: Math.round((px * 7 + py * 3) % 360) }]);
  };

  const L = tall ? LAYOUT.tall : LAYOUT.wide;
  const potCount = [2, 4, 5, 7, 8][street];
  const done = street === 4;
  const burned = Math.min(street, 3);
  const placeOf = (id, normal) => {
    if (!done) return normal;
    const i = ROYAL_ORDER.indexOf(id);
    return i >= 0 ? L.row[i] : L.aside[id] ?? normal;
  };
  // until the flop is spread, its three cards sit in one pile on the first spot
  const boardSpot = (i) => (i < 3 && !spread ? [L.board[0][0] + i * 0.25, L.board[0][1] - i * 0.35] : L.board[i]);
  const equity = EQUITY[street];

  return (
    <section ref={roomRef} className={`pk-room${tall ? ' is-tall' : ''}`} aria-label="The hand">
      <div className="pk-stage" ref={stageRef}>
        <div className="pk-table">
          <div className={`pk-felt${done ? ' is-showdown' : ''}`} onClick={toss}>
            <div className="pk-lamp" aria-hidden="true" />
            <p className="pk-print" aria-hidden="true">TRI HUYNH · SEAT 1 · NO LIMIT HOLD&apos;EM</p>

            <div className="pk-deck" style={pct(L.deck)} aria-hidden="true"><span /><span /><span /></div>
            <span className="pk-dealer" style={{ left: `${L.deck[0] + (tall ? 15 : 8.5)}%`, top: `${L.deck[1] + (tall ? 0 : 2)}%` }} aria-hidden="true">D</span>

            {ready && live && Array.from({ length: burned }, (_, i) => (
              <motion.span key={`burn${round}-${i}`} className="pk-burn" aria-hidden="true"
                style={{ x: '-50%', y: '-50%' }}
                initial={{ ...pct(L.deck), rotate: -14, opacity: 0 }}
                animate={{ left: `${L.muck[0] + i * 0.6}%`, top: `${L.muck[1] - i * 0.8}%`, rotate: [-14, 8, -5, 11][i], opacity: done ? 0 : 1 }}
                transition={{ type: 'spring', stiffness: 160, damping: 20, opacity: { duration: 0.2 } }}>
                <CardBack />
              </motion.span>
            ))}

            {tossed.map((t) => (
              <motion.span key={t.id} className="pk-tossed" style={{ left: `${t.x}%`, top: `${t.y}%`, x: '-50%', y: '-50%' }}
                initial={{ scale: 1.9, opacity: 0, rotate: t.rot - 120 }} animate={{ scale: 1, opacity: 1, rotate: t.rot }}
                transition={{ type: 'spring', stiffness: 420, damping: 14 }} aria-hidden="true">
                <ChipTop color={t.c} />
              </motion.span>
            ))}

            <motion.div key={`pot${round}`} className="pk-pot" style={{ ...pct(L.pot), x: '-50%', y: '-50%' }} animate={done ? { left: `${L.potEnd[0]}%`, top: `${L.potEnd[1]}%`, scale: tall ? 0.7 : 0.9 } : pct(L.pot)} transition={{ duration: 0.9, ease: 'easeInOut', delay: 0.4 }}>
              <div className="pk-pot-chips">
                <ChipStack color="paper" count={Math.ceil(potCount / 2)} width={34} />
                <ChipStack color="red" count={potCount} width={34} />
                <ChipStack color="ink" count={Math.max(1, potCount - 2)} width={34} />
              </div>
            </motion.div>

            {ready && live && (
              <div key={`r${round}`} className="pk-cards">
                {HOLE.map((c, i) => (
                  <DealtCard key={c.id} card={c} at={placeOf(c.id, L.holes[i])} from={L.deck} tilt={done ? 0 : L.holeTilt[i]} delay={done ? 0.05 * i : 0.15 + i * 0.2}
                    faceUp={!!up[c.id]} glow={done} onOpen={openCard} compact={tall} peek={street === 0 && i === 1} />
                ))}
                {BOARD.slice(0, SHOWN[street]).map((c, i) => (
                  <DealtCard key={c.id} card={c} at={placeOf(c.id, boardSpot(i))} from={L.deck} tilt={done ? 0 : L.tilt[i]}
                    delay={done ? 0.05 * (i + 2) : (i < 3 && spread ? i * 0.07 : 0.3 + Math.max(0, i - dealt.current) * 0.13)}
                    z={3 + i} faceUp={!!up[c.id]} glow={done && ROYAL.has(c.id)} out={done && !ROYAL.has(c.id)} onOpen={openCard} compact={tall} />
                ))}
              </div>
            )}

            <AnimatePresence>
              {done && (
                <div className="pk-showdown-pos">
                  <motion.div className="pk-showdown" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0, transition: { delay: 0.7, duration: 0.5, ease: 'easeOut' } }} exit={{ opacity: 0, transition: { duration: 0.12 } }}>
                    <span className="pk-showdown-k">Showdown</span>
                    <strong>Royal flush</strong>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      <div className="pk-bar">
        <div className="pk-log" ref={logRef} aria-live="polite" aria-label="Hand history">
          {HISTORY.slice(0, street + 1).map((block, s) => block.map((line, j) => (
            <motion.p key={`${round}-${s}-${j}`} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (s === street ? 0.35 : 0) + j * 0.45, duration: 0.3 }}>
              <LogLine line={line} />
            </motion.p>
          )))}
          <span className="pk-log-caret" aria-hidden="true" />
        </div>
        <div className="pk-panel">
          <div className="pk-street">
            <span className="pk-street-k">{STREET_NAME[street]}</span>
            <span className="pk-street-hint">{done ? 'Every card opens. The two off-suit cards hold the side projects.' : touch ? 'Tap any face-up card to read it.' : 'Hover to pick a card up, click to read it.'}</span>
          </div>
          <div className="pk-equity" role="img" aria-label={`Equity against one random hand: ${equity}%`}>
            <span className="pk-equity-k">Equity vs. one random hand</span>
            <span className="pk-meter"><i style={{ width: `${equity}%` }} /></span>
            <b>{equity}%{equity === 100 ? <em> the nuts</em> : null}</b>
          </div>
          <div className="pk-actions">
            <button className="pk-btn ghost" onClick={reshuffle}>Reshuffle</button>
            {street < 3 && <button className="pk-btn ghost" onClick={showdown}>Skip to showdown</button>}
            <button ref={actionRef} className={`pk-btn${idle ? ' is-idle' : ''}`} onClick={act}>{ACTION[street]}</button>
          </div>
        </div>
      </div>

      <HandDetail card={open} onClose={closeCard} />
    </section>
  );
}
