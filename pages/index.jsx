import Head from 'next/head';
import { useRouter } from 'next/router';
import PokerTable from '../components/table/PokerTable';
import PlayingCard from '../components/table/PlayingCard';
import { SideList, ProjectMedia } from '../components/table/HandDetail';
import { SuitIcon } from '../components/table/CardArt';
import EggHunt from '../components/EggHunt';
import FloatingTerminalButton from '../components/FloatingTerminalButton';
import { HOLE, BOARD, CONTACT, PROFILE, STACK } from '../data/hand';

const URL = 'https://thuynh-91.github.io/tri-huynh-portfolio/';
const DESC = 'Tri Huynh: AI and software engineer, Northeastern University, graduating May 2027. Projects in AI, full-stack and trading systems.';

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

function Project({ card, basePath, flip }) {
  const d = card.detail;
  return (
    <article className={`pk-project${flip ? ' is-flip' : ''}`} id={card.id}>
      <ProjectMedia media={d.media} basePath={basePath} />
      <div className="pk-project-text">
        <p className="pk-kicker"><SuitIcon suit={card.suit} size={13} color="currentColor" /> {card.rank} · {card.line}</p>
        <h3>{d.title}</h3>
        <p>{d.what}</p>
        <p><b>How it works.</b> {d.how}</p>
        <p className="pk-stackline">{d.stack.join(' · ')}</p>
        <p className="pk-row">
          {d.links.map((l, i) => <a key={l.href} className={`pk-btn${i ? ' ghost' : ''}`} href={l.href} target="_blank" rel="noreferrer">{l.label} →</a>)}
        </p>
      </div>
    </article>
  );
}

export default function Home() {
  const { basePath } = useRouter();
  const featured = BOARD.filter((c) => c.street === 'flop');
  const coop = HOLE[0];
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
          <nav aria-label="Site">
            <a href="#projects">Projects</a>
            <a href="#experience">Experience</a>
            <a href="#hand">The hand</a>
            <a href={`${basePath}${CONTACT.resume}`} target="_blank" rel="noreferrer">Résumé</a>
          </nav>
        </header>

        <main id="top">
          <section className="pk-hero" aria-labelledby="pk-name">
            <div className="pk-hero-text">
              <h1 id="pk-name">Tri Huynh</h1>
              <p className="pk-role">{PROFILE.role}</p>
              <dl className="pk-facts">
                <div><dt>School</dt><dd><b>{PROFILE.school}</b> · {PROFILE.degree}<br />Graduating {PROFILE.grad} · {PROFILE.standing}</dd></div>
                <div><dt>Most recently</dt><dd>AI Engineer Co-op at <b>Biogen</b>, January to June 2026</dd></div>
                <div><dt>Looking for</dt><dd>{PROFILE.seeking}</dd></div>
                <div><dt>Based in</dt><dd>{PROFILE.place}</dd></div>
              </dl>
              <Links basePath={basePath} />
            </div>
            <div className="pk-hero-cards" aria-hidden="true">
              <div className="pk-fan a"><PlayingCard card={HOLE[0]} faceUp still /></div>
              <div className="pk-fan b"><PlayingCard card={HOLE[1]} faceUp still /></div>
            </div>
          </section>

          <section className="pk-stack" aria-labelledby="pk-stack-h">
            <h2 id="pk-stack-h">Tech stack</h2>
            <div className="pk-stack-grid">
              {STACK.map(([group, items]) => (
                <div key={group}>
                  <h3>{group}</h3>
                  <p>{items.join(' · ')}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="projects" className="pk-section" aria-labelledby="pk-projects-h">
            <h2 id="pk-projects-h">Projects</h2>
            {featured.map((c, i) => <Project key={c.id} card={c} basePath={basePath} flip={i % 2 === 1} />)}
          </section>

          <section id="experience" className="pk-section" aria-labelledby="pk-exp-h">
            <h2 id="pk-exp-h">Experience &amp; education</h2>
            <div className="pk-timeline">
              <article>
                <p className="pk-when">Jan – Jun 2026 · Cambridge, MA</p>
                <h3>AI Engineer Co-op · Biogen</h3>
                <p>{coop.detail.brief}</p>
                <p className="pk-stackline">{coop.detail.stack.join(' · ')}</p>
              </article>
              <article>
                <p className="pk-when">Expected May 2027 · Boston, MA</p>
                <h3>{PROFILE.school}</h3>
                <p>{PROFILE.degree} · {PROFILE.standing}. Courses include {PROFILE.courses.join(', ')}.</p>
              </article>
              <p className="pk-also">Also: server, then trainer, at Gyu-Kaku in Boston (May 2023 – Jan 2026), 20–30 hours a week alongside full-time study.</p>
            </div>
          </section>

          <section id="hand" className="pk-section" aria-labelledby="pk-hand-h">
            <h2 id="pk-hand-h">Play the hand</h2>
            <p className="pk-lede">The same work, dealt as one hand of hold&apos;em: the co-op and the school in the hole, the three projects on the flop, side projects on the turn and the river. Deal it street by street and click any face-up card.</p>
            <PokerTable />
          </section>

          <section id="more" className="pk-section" aria-labelledby="pk-more-h">
            <h2 id="pk-more-h">More projects</h2>
            <p className="pk-lede">Games and smaller AI tools, each with something to open. Everything else is on <a href={CONTACT.github} target="_blank" rel="noreferrer">GitHub</a>.</p>
            <SideList basePath={basePath} />
          </section>

          <section id="contact" className="pk-contact" aria-labelledby="pk-contact-h">
            <h2 id="pk-contact-h">Deal me in.</h2>
            <p>{PROFILE.seeking}. Email is the fastest way to reach me:</p>
            <p className="pk-addr">{CONTACT.email}</p>
            <Links basePath={basePath} />
          </section>
        </main>

        <footer className="pk-foot">© 2026 Tri Huynh</footer>
      </div>

      <EggHunt />
      <FloatingTerminalButton />
    </>
  );
}
