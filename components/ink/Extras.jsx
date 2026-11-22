import { useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import projects from '../../data/projects.json';
import { Panel, Narr, TN, Speed } from './Ink';

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
      demo: p.demoUrl || (LOCAL_DEMOS[p.id] ? `${basePath}${LOCAL_DEMOS[p.id]}` : null),
      source: p.githubUrl,
      local: Boolean(LOCAL_DEMOS[p.id]),
    }));
}

// Plays the fight-shot loop only while it is on screen.
function Loop({ src, poster }) {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || typeof IntersectionObserver === 'undefined') return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }, { threshold: 0.3 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return <video ref={ref} src={src} poster={poster} muted loop playsInline preload="none" aria-label="An anime fight shot animated in Blender from Python" />;
}

export default function Extras() {
  const { basePath } = useRouter();
  const side = sideProjects(basePath);
  const playable = side.filter((p) => p.local);
  const rest = side.filter((p) => !p.local);
  return (
    <>
      <div className="ink-grid">
        <Panel span={7} className="ink-fight" label="Bonus: a fight shot">
          <Loop src={`${basePath}/media/dash-punch.mp4`} poster={`${basePath}/images/ink/impact-punch.png`} />
          <Narr pos="bl">Bonus: anime fight shots, animated entirely from Python in Blender. The fight is a list of poses; hitstop, impact frames and speed lines are code.</Narr>
        </Panel>
        {playable.map((p, i) => (
          <Panel key={p.id} span={i === 0 ? 5 : 5} className="ink-play-panel" cut={i === 0 ? 'l' : undefined}>
            <Speed seed={20 + p.id} count={30} />
            <div className="ink-side-body">
              <p className="ink-side-y">{p.year} · plays right here</p>
              <h3>{p.title}</h3>
              <p>{p.tagline}</p>
              <a className="ink-stamp" href={p.demo} target="_blank" rel="noreferrer">▶ play</a>
            </div>
          </Panel>
        ))}
        <Panel span={7} className="ink-side-note" tone="fade">
          <Narr pos="tl" dark>More side stories: games, AI tools and models, most of them live.</Narr>
        </Panel>
      </div>
      <ul className="ink-side">
        {rest.map((p) => (
          <li key={p.id} className="ink-side-item">
            <p className="ink-side-y">{p.year}</p>
            <h3>{p.title}</h3>
            <p>{p.tagline}</p>
            <p className="ink-side-links">
              {p.demo && <a href={p.demo} target="_blank" rel="noreferrer">open →</a>}
              {p.source && <a href={p.source} target="_blank" rel="noreferrer">source</a>}
            </p>
          </li>
        ))}
      </ul>
      <TN>&ldquo;open&rdquo; links go to live deployments; a few sleep on free hosting and take a moment to wake.</TN>
    </>
  );
}
