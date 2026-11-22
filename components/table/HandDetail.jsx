import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import projects from '../../data/projects.json';
import { InkChart } from '../ink/Drawings';
import { SuitIcon } from './CardArt';

const FEATURED = new Set([15, 16, 17]);
// Demos that live in this site (public/demos) rather than at an outside URL.
const LOCAL_DEMOS = { 12: '/demos/pendulum/index.html', 14: '/demos/roulette/index.html' };

export function sideProjects(basePath = '') {
  return projects
    .filter((p) => !FEATURED.has(p.id))
    .map((p) => ({
      id: p.id,
      title: p.title,
      tagline: p.tagline,
      year: p.year,
      tech: (p.technologies ?? p.tech ?? p.stack ?? []).slice(0, 4),
      demo: p.demoUrl || (LOCAL_DEMOS[p.id] ? `${basePath}${LOCAL_DEMOS[p.id]}` : null),
      source: p.githubUrl,
      here: Boolean(LOCAL_DEMOS[p.id]),
    }));
}

export function SideList({ basePath }) {
  return (
    <ul className="pk-side">
      {sideProjects(basePath).map((p) => (
        <li key={p.id}>
          <p className="pk-side-y">{p.year}{p.here ? ' · plays on this site' : ''}</p>
          <h4>{p.title}</h4>
          <p>{p.tagline}</p>
          {p.tech.length > 0 && <p className="pk-side-tech">{p.tech.join(' · ')}</p>}
          <p className="pk-side-links">
            {p.demo && <a href={p.demo} target="_blank" rel="noreferrer">{p.here ? 'play' : 'open'} →</a>}
            {p.source && <a href={p.source} target="_blank" rel="noreferrer">source</a>}
          </p>
        </li>
      ))}
    </ul>
  );
}

// The sheet that slides up when a face-up card is clicked: what the project is, how it works, what it is built with.
export default function HandDetail({ card, onClose }) {
  const closeRef = useRef(null);
  const { basePath } = useRouter();
  useEffect(() => {
    if (!card) return undefined;
    closeRef.current?.focus();
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [card, onClose]);

  return (
    <AnimatePresence>
      {card && (
        <motion.div className="pk-sheet-wrap" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
          <motion.article
            className="pk-sheet"
            role="dialog"
            aria-modal="true"
            aria-labelledby="pk-sheet-title"
            initial={{ y: 50, rotate: -2, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="pk-sheet-head">
              <span className="pk-sheet-kicker"><SuitIcon suit={card.suit} size={14} /> {card.detail.kicker}</span>
              <button ref={closeRef} className="pk-sheet-close" onClick={onClose} aria-label="Close">Fold ✕</button>
            </header>
            <h2 id="pk-sheet-title">{card.detail.title}</h2>
            <p>{card.detail.what}</p>
            {card.detail.how && <p><b>How it works.</b> {card.detail.how}</p>}
            {card.detail.image && <img className="pk-sheet-img" src={`${basePath}${card.detail.image.src}`} alt={card.detail.image.alt} />}
            {card.detail.chart && <InkChart />}
            {card.detail.more && <SideList basePath={basePath} />}
            {card.detail.stack.length > 0 && <p className="pk-tags">{card.detail.stack.map((t) => <span key={t}>{t}</span>)}</p>}
            {card.detail.links.length > 0 && (
              <p className="pk-row">
                {card.detail.links.map((l, i) => <a key={l.href} className={`pk-btn${i ? ' ghost' : ''}`} href={l.href} target="_blank" rel="noreferrer">{l.label} →</a>)}
              </p>
            )}
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
