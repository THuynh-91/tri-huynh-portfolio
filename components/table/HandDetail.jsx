import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import projects from '../../data/projects.json';
import { SIDE } from '../../data/hand';
import { InkChart } from '../ink/Drawings';
import { SuitIcon } from './CardArt';
import CruxScene from './CruxScene';
import CupChart from './CupChart';

// Demos that live in this site (public/demos) rather than at an outside URL.
const LOCAL_DEMOS = { 12: '/demos/pendulum/index.html', 14: '/demos/roulette/index.html' };

export function sideProjects(basePath = '', group) {
  const ids = group ? SIDE[group] : [...SIDE.games, ...SIDE.builds];
  return ids.map((id) => projects.find((p) => p.id === id)).filter(Boolean).map((p) => ({
    id: p.id,
    title: p.title,
    tagline: p.tagline,
    year: p.year,
    tech: (p.tech ?? []).slice(0, 4),
    demo: p.demoUrl || (LOCAL_DEMOS[p.id] ? `${basePath}${LOCAL_DEMOS[p.id]}` : null),
    source: p.githubUrl,
    here: Boolean(LOCAL_DEMOS[p.id]),
  }));
}

export function SideList({ basePath, group }) {
  return (
    <ul className="pk-side">
      {sideProjects(basePath, group).map((p) => (
        <li key={p.id}>
          <p className="pk-side-y">{p.year}{p.here ? ' · plays on this site' : ''}</p>
          <h3>{p.title}</h3>
          <p>{p.tagline}</p>
          {p.tech.length > 0 && <p className="pk-side-tech">{p.tech.join(' · ')}</p>}
          <p className="pk-side-links">
            {p.demo && <a href={p.demo} target="_blank" rel="noreferrer">{p.here ? 'Play' : 'Open'} →</a>}
            {p.source && <a href={p.source} target="_blank" rel="noreferrer">Source</a>}
          </p>
        </li>
      ))}
    </ul>
  );
}

// A project's picture: a real screenshot, a looping screen recording (a still frame for reduced motion),
// or the paper's chart; framed like a panel with one caption box.
export function ProjectMedia({ media, basePath }) {
  const vid = useRef(null);
  useEffect(() => {
    const v = vid.current;
    if (!v) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { v.removeAttribute('autoplay'); v.pause(); return undefined; }
    if (typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { threshold: 0.25 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  if (!media) return null;
  if (media.kind === 'cup') return <CupChart basePath={basePath} />;
  if (media.kind === 'cruxpack') {
    return (
      <figure className="pk-media is-cruxpack" aria-label={media.alt}>
        <CruxScene media={media} basePath={basePath} />
      </figure>
    );
  }
  return (
    <figure className={`pk-media is-${media.kind}`}>
      {media.kind === 'image' && <img src={`${basePath}${media.src}`} alt={media.alt} loading="lazy" />}
      {media.kind === 'video' && (
        <video ref={vid} src={`${basePath}${media.src}`} poster={`${basePath}${media.poster}`} muted loop playsInline preload="metadata" aria-label={media.alt} />
      )}
      {media.kind === 'chart' && <InkChart />}
      {media.caption && <figcaption>{media.caption}</figcaption>}
    </figure>
  );
}

// The sheet that slides up when a face-up card is clicked. Focus moves in, stays in, and Escape closes it.
// It is rendered at the end of <body>, so nothing on the page can paint over it, and the page behind it holds
// still while it is open (the wheel or a swipe scrolls the sheet, never the page under it).
export default function HandDetail({ card, onClose }) {
  const closeRef = useRef(null);
  const sheetRef = useRef(null);
  const closeFn = useRef(onClose);
  closeFn.current = onClose;
  const { basePath } = useRouter();
  const [host, setHost] = useState(null);
  useEffect(() => setHost(document.body), []);

  // hold the page still under the sheet; the scrollbar's width is kept as padding so nothing shifts sideways
  useEffect(() => {
    if (!card) return undefined;
    const html = document.documentElement;
    const gap = window.innerWidth - html.clientWidth;
    const prev = [html.style.overflow, html.style.paddingRight];
    html.style.overflow = 'hidden';
    if (gap > 0) html.style.paddingRight = `${gap}px`;
    return () => { [html.style.overflow, html.style.paddingRight] = prev; };
  }, [card]);
  // runs only when the card changes, so a parent re-render never pulls focus back to Close
  useEffect(() => {
    if (!card) return undefined;
    closeRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') { closeFn.current(); return; }
      if (e.key !== 'Tab' || !sheetRef.current) return;
      const f = [...sheetRef.current.querySelectorAll('a[href], button, video, [tabindex]:not([tabindex="-1"])')];
      if (!f.length) return;
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [card]);

  if (!host) return null;
  return createPortal(
    <AnimatePresence>
      {card && (
        <motion.div className="pk-sheet-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1, pointerEvents: 'auto' }} exit={{ opacity: 0, pointerEvents: 'none', transition: { duration: 0.14 } }} onClick={onClose}>
          <motion.div
            ref={sheetRef}
            className="pk-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pk-sheet-title"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 12, opacity: 0, transition: { duration: 0.14 } }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="pk-sheet-head">
              <span className="pk-sheet-kicker"><SuitIcon suit={card.suit} size={14} color="currentColor" /> {card.detail.kicker}</span>
              <button ref={closeRef} className="pk-sheet-close" onClick={onClose} aria-label="Close">Close ✕</button>
            </header>
            <h2 id="pk-sheet-title">{card.detail.title}</h2>
            <p>{card.detail.what}</p>
            {card.detail.how && <p><b>How it works.</b> {card.detail.how}</p>}
            <ProjectMedia media={card.detail.media} basePath={basePath} />
            {card.detail.more && <SideList basePath={basePath} group={card.detail.more} />}
            {card.detail.stack.length > 0 && <p className="pk-stackline">{card.detail.stack.join(' · ')}</p>}
            {card.detail.links.length > 0 && (
              <p className="pk-row">
                {card.detail.links.map((l, i) => <a key={l.href} className={`pk-btn${i ? ' ghost' : ''}`} href={l.href} target="_blank" rel="noreferrer">{l.label} →</a>)}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    host,
  );
}
