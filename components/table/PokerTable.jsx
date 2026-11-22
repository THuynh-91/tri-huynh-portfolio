import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import PlayingCard from './PlayingCard';
import { ChipStack } from './Chips';
import HandDetail from './HandDetail';
import { Focus } from '../ink/Ink';
import { HOLE, BOARD, CONTACT } from '../../data/hand';

// One hand of no-limit hold'em. The hole cards (A♠ the co-op, K♠ the school) are dealt first; "Deal" runs
// the flop (three projects), the turn and the river (side projects). At showdown the five spades make a
// royal flush.
const SHOWN = [0, 3, 4, 5, 5];
const ACTION = ['Deal the flop', 'Deal the turn', 'Deal the river', 'Showdown', 'Open my résumé'];
const STREET_NAME = ['Pre-flop', 'The flop', 'The turn', 'The river', 'Showdown'];
const ROYAL = new Set(['biogen', 'northeastern', 'cruxpack', 'predictions', 'gittimeline']);
const TITLE = 'ROYAL FLUSH';
// a hand-lettered wobble for each letter (fixed, so every render matches)
const WOBBLE = [[-4, 2], [3, -3], [-2, 1], [5, -2], [-3, 3], [0, 0], [2, -4], [-5, 1], [4, 2], [-2, -2], [3, 3]];

const LAYOUT = {
  wide: {
    deck: [14, 30], pot: [50, 17],
    board: [[25, 43], [37.5, 43], [50, 43], [62.5, 43], [75, 43]],
    holes: [[43.6, 79], [56.4, 79]],
    tilt: [-1.5, 1, -0.6, 1.4, -1], holeTilt: [-6, 6],
  },
  tall: {
    deck: [14, 8], pot: [50, 16],
    board: [[21, 33.5], [50, 33.5], [79, 33.5], [35, 56], [65, 56]],
    holes: [[36, 78.5], [64, 78.5]],
    tilt: [-2, 1, -1, 1.5, -1.5], holeTilt: [-7, 7],
  },
};

const pct = ([x, y]) => ({ left: `${x}%`, top: `${y}%` });

function DealtCard({ card, at, from, tilt, delay, faceUp, glow, onOpen, compact, peek }) {
  return (
    <motion.div
      className={`pk-slot${peek ? ' is-peek' : ''}`}
      initial={{ ...pct(from), rotate: -40, opacity: 0 }}
      animate={{ ...pct(at), rotate: tilt, opacity: 1 }}
      transition={{ delay, type: 'spring', stiffness: 170, damping: 17, mass: 0.9, opacity: { duration: 0.15, delay } }}
      style={{ zIndex: glow ? 6 : 3, x: '-50%', y: '-50%' }}
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
  const timers = useRef([]);
  const dealt = useRef(0);
  const opener = useRef(null);
  const actionRef = useRef(null);
  const { basePath } = useRouter();

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)');
    const set = () => setTall(mq.matches);
    set();
    mq.addEventListener('change', set);
    return () => mq.removeEventListener('change', set);
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
    setOpen(null); setUp({}); setStreet(0); setIdle(false); setRound((r) => r + 1);
  };
  const openCard = useCallback((card, el) => { opener.current = el; setOpen(card); }, []);
  const closeCard = useCallback(() => { setOpen(null); requestAnimationFrame(() => opener.current?.focus()); }, []);

  const L = tall ? LAYOUT.tall : LAYOUT.wide;
  const potCount = [2, 4, 5, 7, 8][street];

  return (
    <section className={`pk-room${tall ? ' is-tall' : ''}`} aria-label="The hand">
      <div className="pk-table">
        <div className={`pk-felt${street === 4 ? ' is-showdown' : ''}`}>
          <p className="pk-print" aria-hidden="true">TRI HUYNH · SEAT 1 · NO LIMIT HOLD&apos;EM</p>
          {street === 4 && <div className="pk-focus"><Focus seed={21} count={110} rx={0.36} ry={0.4} red={0.06} /></div>}

          <div className="pk-deck" style={pct(L.deck)} aria-hidden="true"><span /><span /><span /></div>
          <span className="pk-dealer" style={{ left: `${L.deck[0] + (tall ? 15 : 8.5)}%`, top: `${L.deck[1] + (tall ? 0 : 2)}%` }} aria-hidden="true">D</span>

          <motion.div className="pk-pot" style={{ ...pct(L.pot), x: '-50%', y: '-50%' }} animate={street === 4 ? { left: tall ? '50%' : '75%', top: tall ? '94%' : '80%', scale: tall ? 0.7 : 0.95 } : pct(L.pot)} transition={{ duration: 0.9, ease: 'easeInOut', delay: 0.5 }}>
            <div className="pk-pot-chips">
              <ChipStack color="paper" count={Math.ceil(potCount / 2)} width={34} />
              <ChipStack color="red" count={potCount} width={34} />
              <ChipStack color="ink" count={Math.max(1, potCount - 2)} width={34} />
            </div>
          </motion.div>

          <div key={`r${round}`}>
            {HOLE.map((c, i) => (
              <DealtCard key={c.id} card={c} at={L.holes[i]} from={L.deck} tilt={L.holeTilt[i]} delay={0.15 + i * 0.2}
                faceUp={!!up[c.id]} glow={street === 4} onOpen={openCard} compact={tall} peek={street === 0 && i === 1} />
            ))}
            {BOARD.slice(0, SHOWN[street]).map((c, i) => (
              <DealtCard key={c.id} card={c} at={L.board[i]} from={L.deck} tilt={L.tilt[i]} delay={0.05 + Math.max(0, i - dealt.current) * 0.13}
                faceUp={!!up[c.id]} glow={street === 4 && ROYAL.has(c.id)} onOpen={openCard} compact={tall} />
            ))}
          </div>

          <AnimatePresence>
            {street === 4 && (
              <div className="pk-showdown-pos">
                <motion.div className="pk-showdown" initial={{ opacity: 0, scale: 1.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.15, type: 'spring', stiffness: 360, damping: 15 }}>
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

      <div className="pk-bar">
        <div className="pk-street">
          <span className="pk-street-k">{STREET_NAME[street]}</span>
          <span className="pk-street-hint">{street === 0 ? 'Your hole cards are up. Click any face-up card to read it.' : 'Click any face-up card to read it.'}</span>
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
