import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import BendCard, { CardDefs } from './BendCard';
import { CardBack } from './CardArt';
import { ChipStack, ChipTop } from './Chips';
import { card as C, cardText, evaluate, handName, odds as calcOdds, shuffled, rankOf, suitOf } from '../../lib/holdem';

// A real hand of heads-up hold'em against Tri, who holds A♠ K♠ every hand (it is his table). The visitor gets
// two random cards and deals the board; the odds of each seat winning are worked out on every street (exact
// from the flop, a 15,000-board sample before it) and shown as on a broadcast; at showdown the better five
// cards are lit and the pot slides to the winner. Reshuffle sweeps the cards back, riffles the deck and deals
// a new random hand. While cards are moving every button waits, so nothing can be dealt twice.
const TRI = [C('A♠'), C('K♠')];
const SHOWN = [0, 3, 4, 5, 5];
const STREET = ['Pre-flop', 'The flop', 'The turn', 'The river', 'Showdown'];
const ACTION = ['Deal the flop', 'Deal the turn', 'Deal the river', 'Show down', 'Deal again'];
const WORD = ['two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king', 'ace'];
const PLURAL = ['twos', 'threes', 'fours', 'fives', 'sixes', 'sevens', 'eights', 'nines', 'tens', 'jacks', 'queens', 'kings', 'aces'];
const RED = /[♦♥]/;

const LAYOUT = {
  wide: {
    deck: [10.5, 50], muck: [89.5, 50], dealer: [10.5, 70], pot: [75, 21], potWin: { you: [70, 79], tri: [70, 21], split: [75, 21] },
    tri: [[44.7, 21], [55.3, 21]], you: [[44.7, 79], [55.3, 79]],
    board: [[28, 50], [39, 50], [50, 50], [61, 50], [72, 50]],
    tag: { tri: [38.6, 21], you: [38.6, 79] },
    act: [76, 79],
    tilt: [-1.5, 1, -0.6, 1.4, -1], holeTilt: [-4, 4],
  },
  tall: {
    deck: [12, 23], muck: [88, 23], dealer: [26, 29], pot: [88, 50], potWin: { you: [86, 86], tri: [86, 13], split: [88, 50] },
    tri: [[40, 13.5], [60, 13.5]], you: [[40, 86.5], [60, 86.5]],
    board: [[21, 40], [50, 40], [79, 40], [35, 60], [65, 60]],
    tag: { tri: [28.5, 13.5], you: [28.5, 86.5] },
    act: [50, 73.2],
    tilt: [-2, 1, -1, 1.5, -1.5], holeTilt: [-5, 5],
  },
};
const pct = ([x, y]) => ({ left: `${x}%`, top: `${y}%` });
const cards = (list) => list.map(cardText).join(' ');

function newDeal() {
  const d = shuffled(TRI);
  return { you: [d[0], d[1]], board: d.slice(2, 7) };
}
function startingHand([a, b]) {
  const [hi, lo] = rankOf(a) >= rankOf(b) ? [a, b] : [b, a];
  if (rankOf(hi) === rankOf(lo)) return `a pair of ${PLURAL[rankOf(hi)]}`;
  return `${WORD[rankOf(hi)]}-${WORD[rankOf(lo)]} ${suitOf(hi) === suitOf(lo) ? 'suited' : 'offsuit'}`;
}
function settle(deal) {
  const you = evaluate([...deal.you, ...deal.board]);
  const tri = evaluate([...TRI, ...deal.board]);
  const winner = you.score > tri.score ? 'you' : tri.score > you.score ? 'tri' : 'split';
  return { you, tri, winner };
}
const label = (c) => `${cardText(c)}`;

// `home`: being swept back into the deck for a reshuffle (face down, quick, no bounce)
function DealtCard({ c, at, from, tilt, delay, up, home, win, dim, z }) {
  return (
    <motion.div
      className="pk-slot"
      initial={{ ...pct(from), rotate: -40, opacity: 0 }}
      animate={{ ...pct(home ? from : at), rotate: home ? -14 : tilt, opacity: 1 }}
      transition={home
        ? { delay, type: 'spring', stiffness: 260, damping: 30 }
        : { delay, type: 'spring', stiffness: 170, damping: 18, mass: 0.9, opacity: { duration: 0.15, delay } }}
      style={{ zIndex: win ? 6 : z ?? 3, x: '-50%', y: '-50%', transformStyle: 'preserve-3d' }}
    >
      <BendCard c={c} up={up && !home} win={win} dim={dim} label={label(c)} />
    </motion.div>
  );
}

function LogLine({ line }) {
  const [act, cs, note] = line;
  return (
    <>
      <span className="pk-log-act">{act}</span>
      {cs && (
        <span className="pk-log-cards">
          [{cs.split(' ').map((c, i) => <span key={c} className={RED.test(c) ? 'r' : undefined}>{i ? ' ' : ''}{c}</span>)}]
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
  const [deal, setDeal] = useState(null);
  const [hand, setHand] = useState(2027);
  const [street, setStreet] = useState(0);
  const [up, setUp] = useState({});
  const [spread, setSpread] = useState(false);
  const [busy, setBusy] = useState(true);
  // 'gather' sweeps every card back to the deck face down, 'shuffle' riffles it, then a new hand is dealt
  const [phase, setPhase] = useState('play');
  const [joker, setJoker] = useState(0);
  const [tossed, setTossed] = useState([]);
  const [odds, setOdds] = useState({});
  const [score, setScore] = useState({ you: 0, tri: 0, split: 0 });
  const roomRef = useRef(null);
  const stageRef = useRef(null);
  const logRef = useRef(null);
  const timers = useRef([]);
  const dealt = useRef(0);
  const { basePath } = useRouter();

  // the layout and the first deal exist only in the browser (the deal is random), so nothing is dealt twice
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 760px)');
    const set = () => setTall(mq.matches);
    set();
    setDeal(newDeal());
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

  // the lamp follows the cursor (mouse only); the table itself never moves
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
    };
    const move = (e) => { last = e; if (!raf) raf = requestAnimationFrame(apply); };
    const leave = () => { last = null; ['--lx', '--ly'].forEach((p) => el.style.removeProperty(p)); };
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); cancelAnimationFrame(raf); };
  }, []);

  const later = useCallback((ms, fn) => { timers.current.push(setTimeout(fn, ms)); }, []);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  // each hand: four cards dealt face down, one at a time; Tri's turn up, then yours
  useEffect(() => {
    if (!live || !deal) return;
    setBusy(true);
    later(1250, () => setUp((u) => ({ ...u, [TRI[0]]: true, [TRI[1]]: true })));
    later(1800, () => setUp((u) => ({ ...u, [deal.you[0]]: true, [deal.you[1]]: true })));
    later(2700, () => setBusy(false));
  }, [live, deal, later]);

  // each street: the flop lands as a pile, turns over as one and spreads; the turn and the river turn over
  // where they land. The buttons wait until the cards are still.
  useEffect(() => {
    if (!deal || street === 0) return;
    if (street === 4) { later(1500, () => setBusy(false)); return; }
    const b = deal.board;
    if (street === 1) {
      later(900, () => setUp((u) => ({ ...u, [b[0]]: true, [b[1]]: true, [b[2]]: true })));
      later(1850, () => setSpread(true));
      later(2700, () => setBusy(false));
      return;
    }
    const c = b[SHOWN[street] - 1];
    later(750, () => setUp((u) => ({ ...u, [c]: true })));
    later(1800, () => setBusy(false));
  }, [street, deal, later]);

  // cards already on the board keep their place; only newly dealt ones animate in, staggered
  useEffect(() => { dealt.current = SHOWN[street]; }, [street]);
  useEffect(() => { const el = logRef.current; if (el) el.scrollTop = el.scrollHeight; }, [street, busy]);

  // the odds on this street (computed once per street, after a frame, so the deal never stutters)
  const key = `${hand}-${street}`;
  useEffect(() => {
    if (!deal || odds[key]) return undefined;
    const t = setTimeout(() => {
      setOdds((o) => ({ ...o, [key]: calcOdds(deal.you, TRI, deal.board.slice(0, SHOWN[street]), 15000) }));
    }, 40);
    return () => clearTimeout(t);
  }, [deal, key, street, odds]);

  const result = useMemo(() => (deal ? settle(deal) : null), [deal]);

  const act = () => {
    if (busy || phase !== 'play' || !deal) return;
    if (street === 4) { reshuffle(); return; }
    setBusy(true);
    if (street === 3) setScore((s) => ({ ...s, [result.winner]: s[result.winner] + 1 }));
    setStreet(street + 1);
  };
  const skip = () => {
    if (busy || phase !== 'play' || !deal || street >= 3) return;
    setBusy(true);
    setUp(Object.fromEntries([...TRI, ...deal.you, ...deal.board].map((c) => [c, true])));
    setSpread(true);
    setScore((s) => ({ ...s, [result.winner]: s[result.winner] + 1 }));
    setStreet(4);
  };
  function reshuffle() {
    if (phase !== 'play') return;
    timers.current.forEach(clearTimeout);
    timers.current = [];
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setBusy(true); setJoker(0); setTossed([]);
    setPhase('gather');
    later(still ? 0 : 800, () => setPhase('shuffle'));
    // one shuffle in five, the joker falls out of the riffle (it is not in this game, so it goes back)
    if (!still && Math.random() < 0.2) { later(1000, () => setJoker((j) => j + 1)); later(2900, () => setJoker(0)); }
    later(still ? 10 : 1750, () => {
      dealt.current = 0;
      setUp({}); setStreet(0); setSpread(false); setOdds({});
      setHand((h) => h + 1); setDeal(newDeal()); setPhase('play');
    });
  }

  // a click on bare felt tosses a chip that lands where you clicked (offsetX/Y are in the felt's own, untilted
  // coordinates, so the chip lands under the cursor however the table leans)
  const toss = (e) => {
    if (e.target !== e.currentTarget) return;
    const el = e.currentTarget;
    const w = el.offsetWidth, h = el.offsetHeight;
    const px = e.nativeEvent.offsetX, py = e.nativeEvent.offsetY;
    const rad = Math.min(w, h) / 2;
    const cx = Math.min(Math.max(px, rad), w - rad), cy = Math.min(Math.max(py, rad), h - rad);
    if (Math.hypot(px - cx, py - cy) > rad * 0.92) return;
    setTossed((t) => [...t.slice(-11), { id: `${Date.now()}-${t.length}`, x: (px / w) * 100, y: (py / h) * 100, c: ['red', 'paper', 'red', 'ink'][t.length % 4], rot: Math.round((px * 7 + py * 3) % 360) }]);
  };

  const L = tall ? LAYOUT.tall : LAYOUT.wide;
  const home = phase !== 'play';
  const done = street === 4 && !home;
  const shown = deal ? deal.board.slice(0, SHOWN[street]) : [];
  const o = odds[key];
  const showOdds = o && !busy && !home;
  const potCount = [2, 4, 5, 7, 8][street];
  const burned = Math.min(street, 3);
  // at showdown the winner's five cards are lit and the rest dimmed (a split lights both hands' five)
  const lit = useMemo(() => {
    if (!done || !result) return null;
    const five = result.winner === 'tri' ? result.tri.five : result.winner === 'you' ? result.you.five : [...result.you.five, ...result.tri.five];
    return new Set(five);
  }, [done, result]);
  const boardSpot = (i) => (i < 3 && !spread ? [L.board[0][0] + i * 0.25, L.board[0][1] - i * 0.35] : L.board[i]);

  // what each seat holds right now, in words
  const made = (hole) => (shown.length ? handName(evaluate([...hole, ...shown])) : startingHand(hole));
  const pctOf = (x) => `${Math.round(x * 100)}%`;

  // the hand history, written as the hand is dealt
  const history = useMemo(() => {
    if (!deal) return [];
    const b = deal.board;
    const blocks = [
      [[`Hand #${hand} · Heads-up hold'em · Boston, MA`], ['Tri holds', cards(TRI)], ['Dealt to you', cards(deal.you)]],
      [['*** FLOP ***', cards(b.slice(0, 3))]],
      [['*** TURN ***', cards([b[3]])]],
      [['*** RIVER ***', cards([b[4]])]],
    ];
    if (result) {
      blocks.push([
        ['*** SHOWDOWN ***'],
        ['Tri shows', cards(TRI), handName(result.tri)],
        ['You show', cards(deal.you), handName(result.you)],
        [result.winner === 'you' ? 'You win the pot.' : result.winner === 'tri' ? 'Tri wins the pot.' : 'Split pot.'],
      ]);
    }
    return blocks.slice(0, street + 1);
  }, [deal, hand, street, result]);

  const winText = result && (result.winner === 'you' ? 'You win' : result.winner === 'tri' ? 'Tri wins' : 'Split pot');
  const hint = home ? 'Every card goes back in the deck.'
    : done ? `${handName(result.winner === 'tri' ? result.tri : result.you)[0].toUpperCase()}${handName(result.winner === 'tri' ? result.tri : result.you).slice(1)}${result.winner === 'split' ? ' each.' : ` beats ${handName(result.winner === 'tri' ? result.you : result.tri)}.`}`
      : street === 0 ? 'Tri holds A♠ K♠ every hand. You get two random cards. Click the deck to shuffle.'
        : 'The odds are worked out exactly from every card still to come.';
  const played = score.you + score.tri + score.split;
  const tableCards = deal ? [...TRI, ...deal.you, ...deal.board] : [];

  return (
    <section ref={roomRef} className={`pk-room${tall ? ' is-tall' : ''}`} aria-label="A hand against Tri">
      {deal && <CardDefs cards={tableCards} />}
      <div className="pk-stage" ref={stageRef}>
        <div className="pk-table">
          <div className={`pk-felt${done ? ' is-showdown' : ''}`} onClick={toss}>
            <div className="pk-lamp" aria-hidden="true" />

            <button type="button" className={`pk-deck${phase === 'shuffle' ? ' is-shuffling' : ''}`} style={pct(L.deck)} onClick={reshuffle} disabled={home} aria-label="Shuffle and deal a new hand">
              <span /><span /><span />
              <em className="pk-deck-k" aria-hidden="true">Shuffle</em>
            </button>
            <span className="pk-dealer" style={pct(L.dealer)} aria-hidden="true">D</span>
            <AnimatePresence>
              {joker > 0 && (
                <motion.img key={`joker${joker}`} className="pk-joker" src={`${basePath}/images/joker.svg`} alt="A joker" draggable="false"
                  style={{ ...pct(L.deck), x: '-50%', y: '-50%' }}
                  initial={{ rotate: -14, scale: 0.8, opacity: 0 }}
                  animate={{ left: `${L.deck[0] + (tall ? 10 : 6)}%`, top: `${L.deck[1] + (tall ? 6 : -14)}%`, rotate: [-14, 16, 8], scale: 1.3, opacity: 1 }}
                  exit={{ ...pct(L.deck), rotate: -14, scale: 0.8, opacity: 0, transition: { duration: 0.3 } }}
                  transition={{ type: 'spring', stiffness: 220, damping: 14 }} />
              )}
            </AnimatePresence>

            {ready && live && Array.from({ length: burned }, (_, i) => (
              <motion.span key={`burn${hand}-${i}`} className="pk-burn" aria-hidden="true" style={{ x: '-50%', y: '-50%' }}
                initial={{ ...pct(L.deck), rotate: -14, opacity: 0 }}
                animate={home ? { ...pct(L.deck), rotate: -14, opacity: 1 } : { left: `${L.muck[0] + i * 0.6}%`, top: `${L.muck[1] - i * 0.8}%`, rotate: [-14, 8, -5, 11][i], opacity: 1 }}
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

            <motion.div key={`pot${hand}`} className="pk-pot" style={{ ...pct(L.pot), x: '-50%', y: '-50%' }}
              animate={done ? { ...pct(L.potWin[result.winner]), scale: 0.95 } : pct(L.pot)} transition={{ duration: 0.9, ease: 'easeInOut', delay: 0.5 }}>
              <div className="pk-pot-chips">
                <ChipStack color="paper" count={Math.ceil(potCount / 2)} width={30} />
                <ChipStack color="red" count={potCount} width={30} />
                <ChipStack color="ink" count={Math.max(1, potCount - 2)} width={30} />
              </div>
            </motion.div>

            {ready && live && deal && (
              <div key={`h${hand}`} className="pk-cards">
                {[0, 1].flatMap((i) => [
                  <DealtCard key={`y${deal.you[i]}`} c={deal.you[i]} at={L.you[i]} from={L.deck} tilt={done ? 0 : L.holeTilt[i]} home={home}
                    delay={home ? 0.04 * i : 0.1 + i * 0.4} up={!!up[deal.you[i]]} win={lit?.has(deal.you[i])} dim={lit && !lit.has(deal.you[i])} />,
                  <DealtCard key={`t${TRI[i]}`} c={TRI[i]} at={L.tri[i]} from={L.deck} tilt={done ? 0 : L.holeTilt[i]} home={home}
                    delay={home ? 0.04 * i + 0.08 : 0.3 + i * 0.4} up={!!up[TRI[i]]} win={lit?.has(TRI[i])} dim={lit && !lit.has(TRI[i])} />,
                ])}
                {shown.map((c, i) => (
                  <DealtCard key={`b${c}`} c={c} at={boardSpot(i)} from={L.deck} tilt={done ? 0 : L.tilt[i]} home={home}
                    delay={home ? 0.04 * (i + 2) : (i < 3 && spread ? i * 0.07 : 0.3 + Math.max(0, i - dealt.current) * 0.13)}
                    z={3 + i} up={!!up[c]} win={lit?.has(c)} dim={lit && !lit.has(c)} />
                ))}
              </div>
            )}

            {/* the dealer's actions, on the felt by your seat */}
            {ready && live && deal && (
              <div className="pk-felt-act" style={pct(L.act)}>
                <button type="button" className="pk-chipbtn" onClick={act} disabled={busy || home}>{ACTION[street]}</button>
                {street < 3 && <button type="button" className="pk-chipbtn is-small" onClick={skip} disabled={busy || home}>Skip to showdown</button>}
              </div>
            )}

            {/* the seats, broadcast style: who, their odds, what they hold */}
            {ready && live && deal && !home && ['tri', 'you'].map((seat) => (
              <div key={seat} className={`pk-tag${done && result.winner === seat ? ' is-win' : ''}`} style={pct(L.tag[seat])}>
                <b>{seat === 'tri' ? 'Tri' : 'You'}</b>
                <span className="pk-tag-odds">{done ? (result.winner === seat ? 'Winner' : result.winner === 'split' ? 'Split' : '–') : showOdds ? pctOf(seat === 'tri' ? o.b : o.a) : '…'}</span>
                {(up[seat === 'tri' ? TRI[0] : deal.you[0]] || done) && <em>{made(seat === 'tri' ? TRI : deal.you)}</em>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="pk-bar">
        <div className="pk-log" ref={logRef} aria-live="polite" aria-label="Hand history">
          {history.map((block, s) => block.map((line, j) => (
            <motion.p key={`${hand}-${s}-${j}`} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: (s === street ? 0.35 : 0) + j * 0.4, duration: 0.3 }}>
              <LogLine line={line} />
            </motion.p>
          )))}
        </div>
        <div className="pk-panel">
          <div className="pk-street">
            <span className="pk-street-k">{home ? 'Shuffling' : done ? winText : STREET[street]}</span>
            <span className="pk-street-hint">{hint}</span>
          </div>
          <div className="pk-odds" role="img" aria-label={showOdds ? `Odds: you ${pctOf(o.a)}, Tri ${pctOf(o.b)}, tie ${pctOf(o.tie)}` : 'Working out the odds'}>
            <span className="pk-odds-bar">
              <i className="you" style={{ width: showOdds ? `${o.a * 100}%` : '50%' }} />
              <i className="tie" style={{ width: showOdds ? `${o.tie * 100}%` : '0%' }} />
              <i className="tri" style={{ width: showOdds ? `${o.b * 100}%` : '50%' }} />
            </span>
            <span className="pk-odds-k">
              <span>You {showOdds ? pctOf(o.a) : '…'}</span>
              {showOdds && o.tie >= 0.005 && <span>Tie {pctOf(o.tie)}</span>}
              <span>Tri {showOdds ? pctOf(o.b) : '…'}</span>
            </span>
          </div>
          {played > 0 && <p className="pk-score">Hands won: you {score.you}, Tri {score.tri}{score.split ? `, split ${score.split}` : ''}</p>}
        </div>
      </div>
    </section>
  );
}
