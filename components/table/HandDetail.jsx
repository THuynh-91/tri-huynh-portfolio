import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';
import projects from '../../data/projects.json';
import CompressionChart from './CompressionChart';
import { SuitIcon } from './CardArt';

const FEATURED = new Set([15, 16, 17]);
// Demos that live in this site (public/demos) rather than at an outside URL.
const LOCAL_DEMOS = { 12: '/demos/pendulum/', 14: '/demos/roulette/' };

export function sideProjects(basePath = '') {
  return projects
    .filter((p) => !FEATURED.has(p.id))
    .map((p) => ({
      id: p.id,
      title: p.title,
      tagline: p.tagline,
      year: p.year,
      demo: p.demoUrl || (LOCAL_DEMOS[p.id] ? `${basePath}${LOCAL_DEMOS[p.id]}` : null),
      source: p.githubUrl,
    }));
}

// The slip that slides up when a face-up card is clicked: a hand-history ticket for that card.
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
            initial={{ y: 60, rotate: -1.5, opacity: 0 }}
            animate={{ y: 0, rotate: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            <header className="pk-sheet-head">
              <span className="pk-sheet-kicker">
                <SuitIcon suit={card.suit} size={13} /> {card.detail.kicker}
              </span>
              <button ref={closeRef} className="pk-sheet-close" onClick={onClose} aria-label="Close">fold ✕</button>
            </header>
            <h2 id="pk-sheet-title">{card.detail.title}</h2>
            <p className="pk-sheet-sum">{card.detail.summary}</p>
            {card.result && (
              <p className="pk-sheet-result"><b>{card.result}</b> <span>{card.resultLabel}</span></p>
            )}
            {card.detail.bullets.length > 0 && (
              <ul className="pk-sheet-list">
                {card.detail.bullets.map((b) => <li key={b}>{b}</li>)}
              </ul>
            )}
            {card.detail.chart && <CompressionChart />}
            {card.detail.more && (
              <ul className="pk-more">
                {sideProjects(basePath).map((p) => (
                  <li key={p.id}>
                    <div><b>{p.title}</b> <span className="pk-year">{p.year}</span><br /><span>{p.tagline}</span></div>
                    <span className="pk-more-links">
                      {p.demo && <a href={p.demo} target="_blank" rel="noreferrer">play / open</a>}
                      {p.source && <a href={p.source} target="_blank" rel="noreferrer">source</a>}
                    </span>
                  </li>
                ))}
              </ul>
            )}
            {card.detail.stack.length > 0 && (
              <p className="pk-tags">{card.detail.stack.map((t) => <span key={t}>{t}</span>)}</p>
            )}
            {card.detail.links.length > 0 && (
              <p className="pk-sheet-links">
                {card.detail.links.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noreferrer">{l.label} →</a>)}
              </p>
            )}
            <footer className="pk-sheet-foot">hand #{String(card.rank).padStart(2, '0')}-{card.id} · tri&apos;s table</footer>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
