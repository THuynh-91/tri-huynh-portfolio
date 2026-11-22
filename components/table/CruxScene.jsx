import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// CruxPack, shown with its own public sample deck: real captures of each card's question and answer, and of the
// slide the card cites. A card is read, turns over, slides aside, and its source slide grows out of the card's
// "Source · p. N" chip, the two labels joined by a line: the product's one idea, that every card leads back to
// its page. Nothing is drawn over the captures but the outline of the two labels and the line between them.
//
// Geometry is in fractions of the scene's width (x) and height (y), per layout. Card captures are 714x480 and
// slides 1196x956; chip positions below are measured on those captures.
const CARD_AR = 480 / 714;
const SLIDE_AR = 956 / 1196;
const CHIP_A = { x0: 0.712, x1: 0.934, y0: 0.106, y1: 0.19 }; // "Source · p. N" on the answer face
const SLIDE_CHIP = { x0: 0.052, x1: 0.458, y0: 0.031, y1: 0.081 }; // "Lec 04 · Slide N — ..." in the slide header
const SLIDE_PAGE = { x0: 0.895, x1: 0.965, y0: 0.955, y1: 0.995 }; // the slide's own "p. N" mark

const LAYOUTS = {
  // the full-width stage on a desktop
  wide: { ar: 2.35, a: { x: 0.31, w: 0.38 }, b: { card: { x: 0.04, w: 0.37 }, slide: { x: 0.5, w: 0.43 } }, target: 'chip' },
  // tablets and the sheet
  mid: { ar: 1.5, a: { x: 0.17, w: 0.66 }, b: { card: { x: 0.0, w: 0.48 }, slide: { x: 0.52, w: 0.48 } }, target: 'chip' },
  // phones: the slide comes up above the card
  narrow: { ar: 0.74, a: { x: 0.04, w: 0.92 }, b: { card: { x: 0.12, w: 0.84 }, slide: { x: 0.03, w: 0.94 } }, target: 'page', stacked: true },
};

function geometry(W, kind) {
  const L = LAYOUTS[kind];
  const H = W / L.ar;
  const cardA = { x: L.a.x * W, w: L.a.w * W };
  cardA.h = cardA.w * CARD_AR;
  cardA.y = (H - cardA.h) / 2;
  const cardB = { x: L.b.card.x * W, w: L.b.card.w * W };
  cardB.h = cardB.w * CARD_AR;
  const slide = { x: L.b.slide.x * W, w: L.b.slide.w * W };
  slide.h = slide.w * SLIDE_AR;
  if (L.stacked) {
    const gap = 0.05 * W;
    const total = slide.h + gap + cardB.h;
    slide.y = (H - total) / 2;
    cardB.y = slide.y + slide.h + gap;
  } else {
    cardB.y = (H - cardB.h) / 2 + 0.06 * H;
    slide.y = (H - slide.h) / 2;
  }
  const rect = (box, r) => ({ x: box.x + r.x0 * box.w, y: box.y + r.y0 * box.h, w: (r.x1 - r.x0) * box.w, h: (r.y1 - r.y0) * box.h });
  const chip = rect(cardB, CHIP_A);
  const target = rect(slide, L.target === 'chip' ? SLIDE_CHIP : SLIDE_PAGE);
  let path;
  if (L.stacked) {
    // up from the top of the card's chip to the slide's page mark just above it
    const p0 = { x: chip.x + chip.w / 2, y: chip.y - 3 }, p1 = { x: target.x + target.w / 2, y: target.y + target.h + 3 };
    path = `M${p0.x},${p0.y} C${p0.x},${p0.y - 0.35 * (p0.y - p1.y)} ${p1.x},${p1.y + 0.35 * (p0.y - p1.y)} ${p1.x},${p1.y}`;
  } else {
    // from the right end of the card's chip, across the gap, into the left end of the slide's chip
    const p0 = { x: chip.x + chip.w + 3, y: chip.y + chip.h / 2 }, p1 = { x: target.x - 3, y: target.y + target.h / 2 };
    const dx = p1.x - p0.x;
    path = `M${p0.x},${p0.y} C${p0.x + dx * 0.55},${p0.y} ${p1.x - dx * 0.55},${p1.y} ${p1.x},${p1.y}`;
  }
  return { W, H, cardA, cardB, slide, chip, target, path };
}

// question, answer, source; then the next card is dealt while this one leaves
const STEPS = ['q', 'a', 'src'];
const HOLD = { q: 2300, a: 2100, src: 4200 };

export default function CruxScene({ cards, alt, basePath = '' }) {
  const root = useRef(null);
  const [W, setW] = useState(0);
  const [i, setI] = useState(0);
  const [step, setStep] = useState('src');
  const [running, setRunning] = useState(false);
  const [still, setStill] = useState(false);
  const hover = useRef(false);
  const visible = useRef(false);

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(([e]) => setW(Math.round(e.contentRect.width)));
    ro.observe(el);
    setW(Math.round(el.getBoundingClientRect().width));
    return () => ro.disconnect();
  }, []);

  // play only while on screen, not while hovered, and never with reduced motion (the scene then holds one card,
  // turned over, with its slide open)
  useEffect(() => {
    const el = root.current;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches) { setStill(true); return undefined; }
    setStep('q');
    const sync = () => setRunning(visible.current && !hover.current && !document.hidden);
    const io = new IntersectionObserver(([e]) => { visible.current = e.isIntersecting; sync(); }, { threshold: 0.35 });
    io.observe(el);
    const enter = () => { hover.current = true; sync(); };
    const leave = () => { hover.current = false; sync(); };
    el.addEventListener('pointerenter', enter);
    el.addEventListener('pointerleave', leave);
    el.addEventListener('focusin', enter);
    el.addEventListener('focusout', leave);
    document.addEventListener('visibilitychange', sync);
    return () => {
      io.disconnect();
      el.removeEventListener('pointerenter', enter);
      el.removeEventListener('pointerleave', leave);
      el.removeEventListener('focusin', enter);
      el.removeEventListener('focusout', leave);
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);

  useEffect(() => {
    if (!running || still) return undefined;
    const t = setTimeout(() => {
      if (step === 'src') { setI((n) => (n + 1) % cards.length); setStep('q'); return; }
      setStep(STEPS[STEPS.indexOf(step) + 1]);
    }, HOLD[step]);
    return () => clearTimeout(t);
  }, [running, step, still, cards.length]);

  const kind = W >= 880 ? 'wide' : W >= 520 ? 'mid' : 'narrow';
  const g = W ? geometry(W, kind) : null;
  const card = cards[i];
  const atB = step === 'src';
  const turned = step !== 'q';
  const showSlide = step === 'src';
  const ease = [0.22, 1, 0.36, 1];

  // the card sits in its A box; state B is a translate and scale of that box from its top-left corner
  const cardPose = g && (atB
    ? { x: g.cardB.x - g.cardA.x, y: g.cardB.y - g.cardA.y, scale: g.cardB.w / g.cardA.w }
    : { x: 0, y: 0, scale: 1 });
  // the slide starts as a speck on the card's chip and grows to its place
  const slideFrom = g && { x: g.chip.x + g.chip.w / 2 - g.slide.x, y: g.chip.y + g.chip.h / 2 - g.slide.y, scale: 0.03, opacity: 0 };

  return (
    <div ref={root} className={`cx-scene is-${kind}`} role="img" aria-label={alt} style={g ? { height: g.H } : undefined}>
      {g && (
        <>
          <div className="cx-glow" aria-hidden="true" />
          <AnimatePresence>
            {(showSlide || still) && (
              <motion.img
                key={`s${card.page}`}
                className="cx-slide"
                src={`${basePath}${card.slide}`}
                alt=""
                draggable="false"
                style={{ left: g.slide.x, top: g.slide.y, width: g.slide.w, height: g.slide.h, originX: 0, originY: 0 }}
                initial={still ? false : slideFrom}
                animate={{ x: 0, y: 0, scale: 1, opacity: 1, transition: { duration: 0.75, ease, delay: 0.55 } }}
                exit={{ ...slideFrom, transition: { duration: 0.4, ease: 'easeIn' } }}
              />
            )}
          </AnimatePresence>

          <motion.div
            className="cx-deck"
            aria-hidden="true"
            style={{ left: g.cardA.x, top: g.cardA.y, width: g.cardA.w, height: g.cardA.h, originX: 0, originY: 0 }}
            initial={false}
            animate={still ? { x: g.cardB.x - g.cardA.x, y: g.cardB.y - g.cardA.y, scale: g.cardB.w / g.cardA.w } : cardPose}
            transition={{ duration: 0.7, ease }}
          >
            <span className="cx-under b" />
            <span className="cx-under a" />
            <AnimatePresence initial={false}>
              <motion.div
                key={`c${card.page}`}
                className="cx-card"
                initial={{ x: 7, y: 7, opacity: 1, zIndex: 1 }}
                animate={{ x: 0, y: 0, opacity: 1, rotate: 0, zIndex: 1, transition: { duration: 0.5, ease, delay: 0.15 } }}
                exit={{ x: '-34%', y: '10%', rotate: -10, opacity: 0, zIndex: 2, transition: { duration: 0.6, ease: 'easeIn' } }}
              >
                <motion.div className="cx-flip" initial={false} animate={{ rotateY: turned || still ? 180 : 0 }} transition={{ duration: 0.75, ease: [0.3, 0.7, 0.2, 1] }}>
                  <img className="cx-face q" src={`${basePath}${card.q}`} alt="" draggable="false" />
                  <img className="cx-face a" src={`${basePath}${card.a}`} alt="" draggable="false" />
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          <svg className="cx-link" viewBox={`0 0 ${g.W} ${g.H}`} width={g.W} height={g.H} aria-hidden="true">
            <AnimatePresence>
              {(showSlide || still) && (
                <motion.g key={`l${card.page}`} initial={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.25 } }}>
                  <motion.rect x={g.chip.x - 3} y={g.chip.y - 3} width={g.chip.w + 6} height={g.chip.h + 6} rx={(g.chip.h + 6) / 2}
                    initial={still ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.25 }} />
                  <motion.path d={g.path} initial={still ? false : { pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.55, ease, delay: 1.2 }} />
                  <motion.rect x={g.target.x - 3} y={g.target.y - 3} width={g.target.w + 6} height={g.target.h + 6} rx={(g.target.h + 6) / 2}
                    initial={still ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 1.65 }} />
                </motion.g>
              )}
            </AnimatePresence>
          </svg>
        </>
      )}
    </div>
  );
}
