import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion';

// A pack made with CruxPack and shared on cruxpack.io, played here the way it plays there: click the card (or
// press Space) to turn it over, step through with Prev / Next, the dots or the arrow keys, and where a card
// cites a page, "Source p.N" opens that page the way the pack's "Verify against source" preview does. Every
// face and page is a capture of the real pack; nothing moves by itself.
const ease = [0.22, 1, 0.36, 1];

export default function CruxScene({ media, basePath = '' }) {
  const { cards, title, total, share } = media;
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [flips, setFlips] = useState(0);
  const [src, setSrc] = useState(false);
  const [still, setStill] = useState(false);
  const lift = useAnimationControls();
  const srcBtn = useRef(null);
  const closeBtn = useRef(null);
  const stage = useRef(null);
  const [width, setWidth] = useState(0);
  const card = cards[i];
  const turned = flips % 2 === 1;

  useEffect(() => { setStill(window.matchMedia('(prefers-reduced-motion: reduce)').matches); }, []);
  // the stage takes each card's own height (cards are as tall as their text), easing between them
  useEffect(() => {
    const el = stage.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([e]) => setWidth(e.contentRect.width));
    ro.observe(el);
    setWidth(el.getBoundingClientRect().width);
    return () => ro.disconnect();
  }, []);

  const go = useCallback((to, d) => {
    setSrc(false);
    setFlips(0);
    setDir(d);
    setI((to + cards.length) % cards.length);
  }, [cards.length]);

  // a card turned over in the hand: it comes up toward you, turns, and settles
  const flip = () => {
    setFlips((f) => f + 1);
    if (!still) lift.start({ y: [0, -12, 0], scale: [1, 1.03, 1], transition: { duration: 0.6, times: [0, 0.42, 1], ease: 'easeInOut' } });
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

  return (
    <div className="cx-deck" onKeyDown={onKey}>
      <div className="cx-bar">
        <span className="cx-file">{title} · {total} cards</span>
        <span className="cx-count">Card {i + 1} / {cards.length}</span>
      </div>

      <div ref={stage} className="cx-stage" style={width ? { height: width / card.ratio, transition: still ? 'none' : 'height .35s cubic-bezier(.22, 1, .36, 1)' } : { aspectRatio: card.ratio }}>
        <AnimatePresence initial={false} mode="popLayout" custom={dir}>
          <motion.div
            key={card.n}
            className="cx-card"
            initial={still ? false : { x: dir * 50, rotate: dir * 2, opacity: 0 }}
            animate={{ x: 0, rotate: 0, opacity: 1 }}
            exit={still ? { opacity: 0 } : { x: dir * -50, rotate: dir * -2, opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }}
            transition={{ duration: 0.38, ease }}
          >
            <motion.div className="cx-lift" animate={lift}>
              <button type="button" className="cx-turn" onClick={flip} aria-label={turned ? `Card ${i + 1}, answer shown. Turn it back to the question.` : `Card ${i + 1}, question shown. Turn it over for the answer.`}>
                <motion.span className="cx-flip" animate={{ rotateX: flips * 180 }} initial={false}
                  transition={still ? { duration: 0 } : { duration: 0.6, ease: [0.45, 0.05, 0.25, 1] }}>
                  <img className="cx-face q" src={`${basePath}${card.q}`} alt={`Card ${i + 1}, question`} draggable="false" />
                  <img className="cx-face a" src={`${basePath}${card.a}`} alt={`Card ${i + 1}, answer`} draggable="false" />
                </motion.span>
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="cx-controls">
        <button type="button" className="cx-nav" onClick={() => go(i - 1, -1)} aria-label="Previous card">← Prev</button>
        <span className="cx-dots">
          {cards.map((c, k) => (
            <button key={c.n} type="button" className={k === i ? 'is-on' : undefined} aria-label={`Card ${k + 1}`} aria-current={k === i ? 'true' : undefined}
              onClick={() => k !== i && go(k, k > i ? 1 : -1)} />
          ))}
        </span>
        <button type="button" className="cx-nav" onClick={() => go(i + 1, 1)} aria-label="Next card">Next →</button>
      </div>
      <div className="cx-foot">
        {card.source
          ? <button ref={srcBtn} type="button" className="cx-src" onClick={openSource}>Source p.{card.source.page}</button>
          : <span className="cx-nosrc">Tap the card or press Space to flip</span>}
        <a href={share} target="_blank" rel="noreferrer">All {total} cards on cruxpack.io →</a>
      </div>

      <AnimatePresence>
        {src && card.source && (
          <motion.div className="cx-preview" role="dialog" aria-label={`Source page ${card.source.page}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }}>
            <div className="cx-preview-bar">
              <span>{card.source.file} · p.{card.source.page}</span>
              <button ref={closeBtn} type="button" onClick={closeSource}>Close ✕</button>
            </div>
            <div className="cx-preview-page">
              <motion.img src={`${basePath}${card.source.img}`} alt={`Page ${card.source.page} of the source, the page this card cites`}
                initial={still ? false : { y: 14, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.3, ease }} draggable="false" />
            </div>
            <p className="cx-credit">Source material: {card.source.credit}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
