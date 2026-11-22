import { useCallback, useRef, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PokerTable from '../components/table/PokerTable';
import PlayingCard from '../components/table/PlayingCard';
import HandDetail, { SideList, ProjectMedia } from '../components/table/HandDetail';
import HeroHand from '../components/table/HeroHand';
import BoardBar from '../components/table/BoardBar';
import { SuitIcon } from '../components/table/CardArt';
import FloatingTerminalButton from '../components/FloatingTerminalButton';
import { HOLE, BOARD, CONTACT, PROFILE, STACK } from '../data/hand';

const URL = 'https://thuynh-91.github.io/tri-huynh-portfolio/';
const DESC = 'Tri Huynh: AI and software engineer, Northeastern University, graduating May 2027. Projects in AI, full-stack and trading systems.';
const RED = /[♦♥]/;

function Links({ basePath }) {
  return (
    <p className="pk-row">
      <a className="pk-btn" href={`${basePath}${CONTACT.resume}`} target="_blank" rel="noreferrer">Résumé (PDF)</a>
      <a className="pk-btn ghost" href={`mailto:${CONTACT.email}`}>Email</a>
      <a className="pk-btn ghost" href={CONTACT.github} target="_blank" rel="noreferrer">GitHub</a>
      <a className="pk-btn ghost" href={CONTACT.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
    </p>
  );
}

// Each section is a street of the hand: its name and the cards it deals, above the section's title.
function Street({ name, cards }) {
  return (
    <p className="pk-eyebrow">
      <span>{name}</span>
      {cards && <span className="pk-eyebrow-cards">{cards.split(' ').map((c) => <span key={c} className={RED.test(c) ? 'r' : undefined}>{c}</span>)}</span>}
    </p>
  );
}

// a card's corner, as printed: the rank over the suit
function Index({ card }) {
  return (
    <span className={`pk-index${card.suit === 'heart' || card.suit === 'diamond' ? ' is-red' : ''}`} aria-hidden="true">
      <b>{card.rank}</b><SuitIcon suit={card.suit} size={12} />
    </span>
  );
}

function Project({ card, basePath, flip, stage }) {
  const d = card.detail;
  const links = (
    <p className="pk-row">
      {d.links.map((l, i) => <a key={l.href} className={`pk-btn${i ? ' ghost' : ''}`} href={l.href} target="_blank" rel="noreferrer">{l.label} →</a>)}
    </p>
  );
  return (
    <article className={`pk-project${flip ? ' is-flip' : ''}${stage ? ' is-stage' : ''}`} id={card.id}>
      <ProjectMedia media={d.media} basePath={basePath} />
      <div className="pk-project-text">
        <div className="pk-project-head">
          <p className="pk-kicker"><Index card={card} /> {card.line}</p>
          <h3>{d.title}</h3>
          {stage && links}
        </div>
        <div className="pk-project-body">
          <p>{d.what}</p>
          <p><b>How it works.</b> {d.how}</p>
          <p className="pk-stackline">{d.stack.join(' · ')}</p>
          {!stage && links}
        </div>
      </div>
    </article>
  );
}

export default function Home() {
  const { basePath } = useRouter();
  const featured = BOARD.filter((c) => c.street === 'flop');
  const [coop, school] = HOLE;
  const [heroOpen, setHeroOpen] = useState(null);
  const heroOpener = useRef(null);
  const openHero = useCallback((card, el) => { heroOpener.current = el; setHeroOpen(card); }, []);
  const closeHero = useCallback(() => { setHeroOpen(null); requestAnimationFrame(() => heroOpener.current?.focus()); }, []);
  return (
    <>
      <Head>
        <title>Tri Huynh · AI &amp; software engineer</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={URL} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={URL} />
        <meta property="og:title" content="Tri Huynh · AI & software engineer" />
        <meta property="og:description" content={DESC} />
        <meta property="og:image" content={`${URL}images/og.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#131211" />
      </Head>

      <div className="pk-page">
        <a className="pk-skip" href="#projects">Skip to projects</a>
        <header className="pk-top">
          <a className="pk-mark" href="#top"><SuitIcon suit="spade" size={14} color="currentColor" /> Tri Huynh</a>
          <BoardBar />
          <nav className="pk-nav" aria-label="Site">
            <a href="#projects">Projects</a>
            <a href="#hand">The hand</a>
            <a href="#experience">Experience</a>
            <a href={`${basePath}${CONTACT.resume}`} target="_blank" rel="noreferrer">Résumé</a>
          </nav>
        </header>

        <main id="top">
          <section className="pk-hero" aria-labelledby="pk-name">
            <div className="pk-hero-text">
              <h1 id="pk-name">Tri Huynh</h1>
              <p className="pk-role">{PROFILE.role}</p>
              <dl className="pk-facts">
                <div><dt>school</dt><dd><b>{PROFILE.school}</b><br />{PROFILE.degree}</dd></div>
                <div><dt>graduating</dt><dd><b>{PROFILE.grad}</b> · {PROFILE.standing}</dd></div>
                <div><dt>most recently</dt><dd>AI Engineer Co-op at <b>Biogen</b>, January to June 2026</dd></div>
                <div><dt>looking for</dt><dd>{PROFILE.seeking}</dd></div>
                <div><dt>based in</dt><dd>{PROFILE.place}</dd></div>
              </dl>
              <Links basePath={basePath} />
            </div>
            <HeroHand onOpen={openHero} />
          </section>

          <section className="pk-stack" aria-labelledby="pk-stack-h">
            <h2 id="pk-stack-h">Tech stack</h2>
            <div className="pk-stack-grid">
              {STACK.map(([group, items]) => (
                <div key={group}>
                  <h3>{group}</h3>
                  <p>{items.flatMap((t, i) => [i ? ' ' : null, <span key={t}>{t}</span>])}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="projects" className="pk-section" aria-labelledby="pk-projects-h">
            <Street name="The flop" cards="Q♠ J♠ 10♠" />
            <h2 id="pk-projects-h">Projects</h2>
            {featured.map((c, i) => <Project key={c.id} card={c} basePath={basePath} flip={i === 1} />)}
          </section>

          <section id="hand" className="pk-section pk-hand-band" aria-labelledby="pk-hand-h">
            <Street name="Your deal" />
            <h2 id="pk-hand-h">Play the hand</h2>
            <p className="pk-lede">The same work, dealt as one hand of hold&apos;em: the co-op and the school in the hole, the three projects on the flop, side projects on the turn and the river. Deal the rest of it and open any face-up card.</p>
            <PokerTable />
          </section>

          <section id="experience" className="pk-section" aria-labelledby="pk-exp-h">
            <Street name="The hole cards" cards="A♠ K♠" />
            <h2 id="pk-exp-h">Experience &amp; education</h2>
            <div className="pk-hole">
              <article className="pk-hole-card">
                <div className="pk-hole-top">
                  <span className="pk-hole-mini"><PlayingCard card={coop} faceUp still /></span>
                  <div>
                    <p className="pk-when">Jan – Jun 2026 · Cambridge, MA</p>
                    <h3>AI Engineer Co-op · Biogen</h3>
                  </div>
                </div>
                <p>{coop.detail.brief}</p>
                <p className="pk-stackline">{coop.detail.stack.join(' · ')}</p>
              </article>
              <article className="pk-hole-card">
                <div className="pk-hole-top">
                  <span className="pk-hole-mini"><PlayingCard card={school} faceUp still /></span>
                  <div>
                    <p className="pk-when">Graduating May 2027 · Boston, MA</p>
                    <h3>{PROFILE.school}</h3>
                  </div>
                </div>
                <p>{PROFILE.degree} · {PROFILE.standing}.</p>
                <p>Courses include {PROFILE.courses.join(', ')}.</p>
              </article>
            </div>
            <p className="pk-also">Also: server, then trainer, at Gyu-Kaku in Boston (May 2023 – Jan 2026), 20–30 hours a week alongside full-time study.</p>
          </section>

          <section id="more" className="pk-section" aria-labelledby="pk-more-h">
            <Street name="The turn and the river" cards="6♦ 3♣" />
            <h2 id="pk-more-h">More projects</h2>
            <p className="pk-lede">Games and smaller AI tools, each with something to open. Everything else is on <a href={CONTACT.github} target="_blank" rel="noreferrer">GitHub</a>.</p>
            <SideList basePath={basePath} />
          </section>

          <section id="contact" className="pk-contact" aria-labelledby="pk-contact-h">
            <div className="pk-contact-text">
              <Street name="Showdown" />
              <h2 id="pk-contact-h">Deal me in.</h2>
              <p>{PROFILE.seeking}. Email is the fastest way to reach me:</p>
              <p className="pk-addr">{CONTACT.email}</p>
              <Links basePath={basePath} />
            </div>
            {/* the hand, laid down: the royal flush */}
            <div className="pk-flush" aria-hidden="true">
              {[...HOLE, ...featured].map((c) => <span key={c.id} className="pk-flush-card"><PlayingCard card={c} faceUp still /></span>)}
            </div>
          </section>
        </main>

        <footer className="pk-foot">© 2026 Tri Huynh</footer>
        <HandDetail card={heroOpen} onClose={closeHero} />
      </div>

      <FloatingTerminalButton />
    </>
  );
}
