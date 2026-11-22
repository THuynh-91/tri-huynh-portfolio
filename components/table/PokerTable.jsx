import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import PlayingCard from './PlayingCard';
import { ChipStack } from './Chips';
import HandDetail from './HandDetail';
import { Focus } from '../ink/Ink';
import { HOLE, BOARD, CONTACT } from '../../data/hand';

// The homepage plays one hand of no-limit hold'em. Tri's hole cards (A♠ K♠) are dealt first;
// "Deal" runs the flop (three projects), the turn (the co-op) and the river (side projects);
// at showdown the five spades make a royal flush.
const SHOWN = [0, 3, 4, 5, 5];
const ACTION = ['Deal the flop', 'Deal the turn', 'Deal the river', 'Showdown', 'Take the pot: my résumé'];
const STREET_NAME = ['Pre-flop', 'The flop', 'The turn', 'The river', 'Showdown'];
const ROYAL = new Set(['ai', 'swe', 'cruxpack', 'predictions', 'gittimeline']);

const LAYOUT = {
  wide: {
    deck: [17, 26], pot: [50, 18],
    board: [[29.5, 47], [39.75, 47], [50, 47], [60.25, 47], [70.5, 47]],
    holes: [[44.6, 79], [55.4, 79]],
    tilt: [-1.5, 1, -0.6, 1.4, -1], holeTilt: [-7, 7],
  },
  tall: {
    deck: [15, 8], pot: [50, 16.5],
    board: [[22, 36.5], [50, 36.5], [78, 36.5], [36, 57], [64, 57]],
    holes: [[38.5, 79], [61.5, 79]],
    tilt: [-2, 1, -1, 1.5, -1.5], holeTilt: [-8, 8],
  },
};

const pct = ([x, y]) => ({ left: `${x}%`, top: `${y}%` });

function DealtCard({ card, at, from, tilt, delay, faceUp, glow, onOpen, compact }) {
  return (
    <motion.div
      className="pk-slot"
      initial={{ ...pct(from), rotate: -28, opacity: 0 }}
      animate={{ ...pct(at), rotate: tilt, opacity: 1 }}
      transition={{ delay, duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
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

  // deal and peek at the hole cards on every new round
  useEffect(() => {
    later(1050, () => setUp((u) => ({ ...u, ai: true, swe: true })));
    later(3600, () => setIdle(true));
  }, [round, later]);

  // each street: deal its cards, then turn them over
  useEffect(() => {
    if (street === 0 || street === 4) return;
    const from = SHOWN[street - 1], to = SHOWN[street];
    for (let i = from; i < to; i++) later(650 + (i - from) * 170, () => setUp((u) => ({ ...u, [BOARD[i].id]: true })));
    later(2400, () => setIdle(true));
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
  };
  const reshuffle = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
    dealt.current = 0;
    setOpen(null); setUp({}); setStreet(0); setIdle(false); setRound((r) => r + 1);
  };

  const L = tall ? LAYOUT.tall : LAYOUT.wide;
  const potCount = [2, 4, 5, 7, 8][street];

  return (
    <section className={`pk-room${tall ? ' is-tall' : ''}`} aria-label="The hand">
      <div className="pk-table">
        <div className={`pk-felt${street === 4 ? ' is-showdown' : ''}`}>
          {street === 4 && <div className="pk-focus"><Focus seed={21} count={150} rx={0.32} ry={0.34} red={0.08} /></div>}

          {L.board.map((p, i) => <div key={`o${i}`} className="pk-outline" style={pct(p)} aria-hidden="true" />)}

          <div className="pk-deck" style={pct(L.deck)} aria-hidden="true"><span /><span /><span /></div>
          <button className="pk-dealer" style={{ left: `${L.deck[0] + (tall ? 15 : 8)}%`, top: `${L.deck[1] + (tall ? 0 : 1)}%` }} aria-label="Dealer button">
            D<span className="pk-tell">tell spotted: you poked the dealer button</span>
          </button>

          <motion.div className="pk-pot" style={{ ...pct(L.pot), x: '-50%', y: '-50%' }} animate={street === 4 ? { left: tall ? '50%' : '72%', top: tall ? '94%' : '82%', scale: tall ? 0.7 : 0.9 } : pct(L.pot)} transition={{ duration: 0.9, ease: 'easeInOut', delay: 0.5 }}>
            <div className="pk-pot-chips">
              <ChipStack color="paper" count={Math.ceil(potCount / 2)} width={36} />
              <ChipStack color="red" count={potCount} width={36} />
              <ChipStack color="ink" count={Math.max(1, potCount - 2)} width={36} />
            </div>
          </motion.div>

          <div key={`r${round}`}>
            {HOLE.map((c, i) => (
              <DealtCard key={c.id} card={c} at={L.holes[i]} from={L.deck} tilt={L.holeTilt[i]} delay={0.15 + i * 0.22}
                faceUp={!!up[c.id]} glow={street === 4} onOpen={setOpen} compact={tall} />
            ))}
            {BOARD.slice(0, SHOWN[street]).map((c, i) => (
              <DealtCard key={c.id} card={c} at={L.board[i]} from={L.deck} tilt={L.tilt[i]} delay={0.05 + Math.max(0, i - dealt.current) * 0.17}
                faceUp={!!up[c.id]} glow={street === 4 && ROYAL.has(c.id)} onOpen={setOpen} compact={tall} />
            ))}
          </div>

          {!tall && (
            <div className="pk-seat" aria-hidden="true">
              <span className="pk-seat-name">TRI</span>
              <span className="pk-seat-sub">seat 1</span>
            </div>
          )}

          <AnimatePresence>
            {street === 4 && (
              <div className="pk-showdown-pos">
                <motion.div className="pk-showdown" initial={{ opacity: 0, scale: 1.6, rotate: -6 }} animate={{ opacity: 1, scale: 1, rotate: -3 }} exit={{ opacity: 0 }} transition={{ delay: 0.15, type: 'spring', stiffness: 380, damping: 16 }}>
                  <strong>ROYAL FLUSH</strong>
                  <span className="pk-showdown-line">A K Q J 10, all spades. Hire accordingly.</span>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="pk-bar">
        <div className="pk-street">
          <span className="pk-street-k">{STREET_NAME[street]}</span>
          <span className="pk-street-hint">{street === 0 ? 'Your two hole cards are dealt. Click any face-up card to read it.' : 'Click any face-up card to read it.'}</span>
        </div>
        <div className="pk-actions">
          <button className="pk-btn ghost" onClick={reshuffle}>↻ Reshuffle</button>
          {street < 3 && <button className="pk-btn ghost" onClick={showdown}>Skip to showdown</button>}
          <button className={`pk-btn${idle ? ' is-idle' : ''}`} onClick={act}>{ACTION[street]}</button>
        </div>
      </div>

      <HandDetail card={open} onClose={() => setOpen(null)} />
    </section>
  );
}
