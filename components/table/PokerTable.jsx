import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import PlayingCard from './PlayingCard';
import { ChipStack, ResultStack } from './Chips';
import HandDetail from './HandDetail';
import { SuitIcon } from './CardArt';
import { HOLE, BOARD, CONTACT } from '../../data/hand';
import { cardSound, chipSound, setSound, soundOn } from './sound';

// The homepage plays one hand of no-limit hold'em. Tri's hole cards (A♠ K♠) are dealt first;
// "Deal" runs the flop (three projects), the turn (the co-op) and the river (side projects);
// at showdown the five spades make a royal flush.
const SHOWN = [0, 3, 4, 5, 5];
const ACTION = ['Deal the flop', 'Deal the turn', 'Deal the river', 'Showdown', 'Collect the pot → résumé'];
const STREET_NAME = ['Pre-flop', 'The flop', 'The turn', 'The river', 'Showdown'];
const ROYAL = new Set(['ai', 'swe', 'cruxpack', 'predictions', 'gittimeline']);

const LAYOUT = {
  wide: {
    deck: [19, 24], pot: [50, 20],
    board: [[29.5, 48], [39.75, 48], [50, 48], [60.25, 48], [70.5, 48]],
    holes: [[46.4, 80], [53.6, 80]],
    tilt: [-1.5, 1, -0.6, 1.4, -1], holeTilt: [-7, 7],
  },
  tall: {
    deck: [15, 8], pot: [50, 16.5],
    board: [[22, 36.5], [50, 36.5], [78, 36.5], [36, 57], [64, 57]],
    holes: [[42, 79], [58, 79]],
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
      transition={{ delay, duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
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
  const [sound, setSoundState] = useState(false);
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
    HOLE.forEach((_, i) => later(150 + i * 220, cardSound));
    later(1150, () => setUp((u) => ({ ...u, ai: true, swe: true })));
    later(4200, () => setIdle(true));
  }, [round, later]);

  // each street: deal its cards, then turn them over
  useEffect(() => {
    if (street === 0 || street === 4) return;
    const from = SHOWN[street - 1], to = SHOWN[street];
    for (let i = from; i < to; i++) {
      const k = i - from;
      later(k * 180, cardSound);
      later(700 + k * 180, () => setUp((u) => ({ ...u, [BOARD[i].id]: true })));
    }
    later(2600, () => setIdle(true));
  }, [street, later]);

  useEffect(() => { if (street === 4) { chipSound(); later(250, chipSound); } }, [street, later]);
  // cards already on the board keep their place; only newly dealt ones animate in, staggered
  useEffect(() => { dealt.current = SHOWN[street]; }, [street]);

  const act = () => {
    setIdle(false);
    if (street < 4) { setStreet(street + 1); if (street === 3) chipSound(); return; }
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
  const toggleSound = () => { const on = !soundOn(); setSound(on); setSoundState(on); if (on) chipSound(); };

  const L = tall ? LAYOUT.tall : LAYOUT.wide;
  const potCount = [2, 4, 5, 7, 8][street];

  return (
    <section className={`pk-room${tall ? ' is-tall' : ''}`} aria-label="Tri's table">
      <div className="pk-table">
        <div className={`pk-felt${street === 4 ? ' is-showdown' : ''}`}>
          <div className="pk-lamp" aria-hidden="true" />

          {L.board.map((p, i) => <div key={`o${i}`} className="pk-outline" style={pct(p)} aria-hidden="true" />)}

          <div className="pk-deck" style={pct(L.deck)} aria-hidden="true"><span /><span /><span /></div>
          <button className="pk-dealer" style={{ left: `${L.deck[0] + (tall ? 15 : 8)}%`, top: `${L.deck[1] + (tall ? 0 : 1)}%` }} aria-label="Dealer button">
            D<span className="pk-tell">tell spotted: you poked the dealer button</span>
          </button>

          <motion.div className="pk-pot" style={{ ...pct(L.pot), x: '-50%', y: '-50%' }} animate={street === 4 ? { left: tall ? '74%' : '70%', top: tall ? '87%' : '82%', scale: 0.9 } : pct(L.pot)} transition={{ duration: 0.9, ease: 'easeInOut', delay: 0.5 }}>
            <div className="pk-pot-chips">
              <ChipStack color="gold" count={Math.ceil(potCount / 2)} width={38} />
              <ChipStack color="red" count={potCount} width={38} />
              <ChipStack color="black" count={Math.max(1, potCount - 2)} width={38} />
            </div>
            <span>pot · {SHOWN[street]} {SHOWN[street] === 1 ? 'card' : 'cards'} on the board</span>
          </motion.div>

          <div key={`r${round}`}>
            {HOLE.map((c, i) => (
              <DealtCard key={c.id} card={c} at={L.holes[i]} from={L.deck} tilt={L.holeTilt[i]} delay={0.15 + i * 0.22}
                faceUp={!!up[c.id]} glow={street === 4} onOpen={setOpen} compact={tall} />
            ))}
            {BOARD.slice(0, SHOWN[street]).map((c, i) => (
              <DealtCard key={c.id} card={c} at={L.board[i]} from={L.deck} tilt={L.tilt[i]} delay={0.05 + Math.max(0, i - dealt.current) * 0.18}
                faceUp={!!up[c.id]} glow={street === 4 && ROYAL.has(c.id)} onOpen={setOpen} compact={tall} />
            ))}
          </div>

          {!tall && (
            <div className="pk-seat">
              <span className="pk-seat-name">TRI</span>
              <span className="pk-seat-sub">seat 1 · AI &amp; software engineer</span>
            </div>
          )}

          <AnimatePresence>
            {street === 4 && (
              <div className="pk-showdown-pos"><motion.div className="pk-showdown" initial={{ opacity: 0, y: -12, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ delay: 0.25, duration: 0.5 }}>
                <span className="pk-showdown-k">showdown</span>
                <strong>Royal flush</strong>
                <span className="pk-showdown-cards">
                  {['A', 'K', 'Q', 'J', '10'].map((r) => <span key={r}>{r}<SuitIcon suit="spade" size={11} color="currentColor" /></span>)}
                </span>
                <span className="pk-showdown-line">The best possible hand. Hire accordingly.</span>
              </motion.div></div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="pk-bar">
        <div className="pk-street">
          <span className="pk-street-k">{STREET_NAME[street]}</span>
          <span className="pk-street-hint">{street < 4 ? 'click any face-up card for the full story' : 'every card is clickable'}</span>
        </div>
        <div className="pk-actions">
          <button className="pk-pill" onClick={reshuffle}>↻ reshuffle</button>
          {street < 3 && <button className="pk-pill" onClick={showdown}>skip to showdown</button>}
          <button className="pk-pill" onClick={toggleSound} aria-pressed={sound}>{sound ? '♪ sound on' : '♪ sound off'}</button>
          <button className={`pk-action${idle ? ' is-idle' : ''}`} onClick={act}>{ACTION[street]}</button>
        </div>
      </div>

      <div className="pk-stacks">
        <ResultStack color="red" count={6} value="98.7%" label="correct · CruxPack" title="Share of 770 generated claims an LLM judge rated correct" />
        <ResultStack color="blue" count={4} value="50→33ms" label="p95 frame · GitTimeline" title="Renderer p95 frame time before and after" />
        <ResultStack color="black" count={5} value="0.77" label="price squeeze · Cup" title="Logit slope of contest prices on Kalshi prices; 1.0 means no squeeze" />
        <ResultStack color="green" count={3} value="months→1wk" label="to an answer · Biogen" title="Wait for an answer on AI requests, before and after the intake system" />
      </div>

      <HandDetail card={open} onClose={() => setOpen(null)} />
    </section>
  );
}
