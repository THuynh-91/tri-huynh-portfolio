import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';

// CruxPack's public sample deck, played here the way it plays on cruxpack.io: click the card (or press Space)
// to turn it over, step through the cards with Prev / Next, the dots or the arrow keys, and open the slide a
// card cites with its Source button (or the source chip printed on the card), which shows the slide the way
// cruxpack.io's own source preview does. Every face and slide is a capture of the real deck; nothing here
// moves by itself.
//
// Where the source chip sits on each captured face (fractions of the 714x480 capture).
const CHIP = {
  q: { x0: 0.672, x1: 0.931, y0: 0.106, y1: 0.185 },
  a: { x0: 0.712, x1: 0.934, y0: 0.106, y1: 0.19 },
};
const ease = [0.22, 1, 0.36, 1];

export default function CruxScene({ cards, file, basePath = '' }) {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [flips, setFlips] = useState(0);
  const [src, setSrc] = useState(false);
  const [still, setStill] = useState(false);
  const lift = useAnimationControls();
  const shade = useAnimationControls();
  const srcBtn = useRef(null);
  const closeBtn = useRef(null);
  const card = cards[i];
  const turned = flips % 2 === 1;
  const slide = `${basePath}${card.slide}`;

  useEffect(() => { setStill(window.matchMedia('(prefers-reduced-motion: reduce)').matches); }, []);

  const go = useCallback((to, d) => {
    setSrc(false);
    setFlips(0);
    setDir(d);
    setI((to + cards.length) % cards.length);
  }, [cards.length]);

  // a card turned over in the hand: it comes up off the table, turns, and settles
  const flip = () => {
    setFlips((f) => f + 1);
    if (still) return;
    lift.start({ y: [0, -16, 0], scale: [1, 1.035, 1], transition: { duration: 0.62, times: [0, 0.42, 1], ease: 'easeInOut' } });
    shade.start({ opacity: [0.55, 0.28, 0.55], scale: [1, 0.9, 1], y: [0, 10, 0], transition: { duration: 0.62, times: [0, 0.42, 1], ease: 'easeInOut' } });
  };

  const openSource = () => setSrc(true);
  const closeSource = () => { setSrc(false); requestAnimationFrame(() => srcBtn.current?.focus()); };
  useEffect(() => { if (src) closeBtn.current?.focus(); }, [src]);

  const onKey = (e) => {
    if (e.key === 'Escape' && src) { e.stopPropagation(); closeSource(); return; }
    if (src) return;
    if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1, 1); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1, -1); }
  };

  const chip = CHIP[turned ? 'a' : 'q'];
  return (
    <div className="cx-deck" onKeyDown={onKey}>
      <div className="cx-bar">
        <span className="cx-file">{file}</span>
        <span className="cx-count">Card {i + 1} / {cards.length}</span>
      </div>

      <div className="cx-stage">
        <motion.span className="cx-shade" animate={shade} initial={{ opacity: 0.55 }} aria-hidden="true" />
        <AnimatePresence initial={false} mode="popLayout" custom={dir}>
          <motion.div
            key={card.page}
            className="cx-card"
            initial={still ? false : { x: dir * 60, rotate: dir * 3, opacity: 0 }}
            animate={{ x: 0, rotate: 0, opacity: 1 }}
            exit={still ? { opacity: 0 } : { x: dir * -60, rotate: dir * -3, opacity: 0, transition: { duration: 0.22, ease: 'easeIn' } }}
            transition={{ duration: 0.4, ease }}
          >
            <motion.div className="cx-lift" animate={lift}>
              <button type="button" className="cx-turn" onClick={flip} aria-label={turned ? 'Answer shown. Turn the card back to the question.' : 'Question shown. Turn the card over for the answer.'}>
                <motion.span className="cx-flip" animate={{ rotateY: flips * 180 }} initial={false}
                  transition={still ? { duration: 0 } : { duration: 0.62, ease: [0.45, 0.05, 0.25, 1] }}>
                  <img className="cx-face q" src={`${basePath}${card.q}`} alt={`Question, card ${i + 1}`} draggable="false" />
                  <img className="cx-face a" src={`${basePath}${card.a}`} alt={`Answer, card ${i + 1}`} draggable="false" />
                </motion.span>
              </button>
              {/* the source chip printed on the card opens the slide too */}
              <button type="button" className="cx-chip" onClick={openSource} tabIndex={-1} aria-hidden="true"
                style={{ left: `${chip.x0 * 100}%`, top: `${chip.y0 * 100}%`, width: `${(chip.x1 - chip.x0) * 100}%`, height: `${(chip.y1 - chip.y0) * 100}%` }} />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="cx-controls">
        <button type="button" className="cx-nav" onClick={() => go(i - 1, -1)} aria-label="Previous card">← Prev</button>
        <span className="cx-dots">
          {cards.map((c, k) => (
            <button key={c.page} type="button" className={k === i ? 'is-on' : undefined} aria-label={`Card ${k + 1}`} aria-current={k === i ? 'true' : undefined}
              onClick={() => k !== i && go(k, k > i ? 1 : -1)} />
          ))}
        </span>
        <button type="button" className="cx-nav" onClick={() => go(i + 1, 1)} aria-label="Next card">Next →</button>
      </div>
      <div className="cx-foot">
        <button ref={srcBtn} type="button" className="cx-src" onClick={openSource}>Source p.{card.page}</button>
        <a href="https://cruxpack.io" target="_blank" rel="noreferrer">The full deck on cruxpack.io →</a>
      </div>

      <AnimatePresence>
        {src && (
          <motion.div className="cx-preview" role="dialog" aria-label={`Source page ${card.page}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }}
            onClick={closeSource}>
            <div className="cx-preview-bar" onClick={(e) => e.stopPropagation()}>
              <span>Source page {card.page}</span>
              <a href={slide} target="_blank" rel="noreferrer">Open full size ↗</a>
              <button ref={closeBtn} type="button" onClick={closeSource}>Close ✕</button>
            </div>
            <motion.img className="cx-preview-slide" src={slide} alt={`Lecture 4, slide ${card.page}, the page this card cites`}
              initial={still ? false : { scale: 0.92, y: 12 }} animate={{ scale: 1, y: 0 }} transition={{ duration: 0.3, ease }}
              onClick={(e) => e.stopPropagation()} draggable="false" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
