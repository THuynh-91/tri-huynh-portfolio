import Head from 'next/head';
import { useRouter } from 'next/router';
import PokerTable from '../components/table/PokerTable';
import HandHistory from '../components/table/HandHistory';
import SpotifyPlayer from '../components/SpotifyPlayer';
import EggHunt from '../components/EggHunt';
import FloatingTerminalButton from '../components/FloatingTerminalButton';
import { SuitIcon } from '../components/table/CardArt';
import { CONTACT } from '../data/hand';

const URL = 'https://thuynh-91.github.io/tri-huynh-portfolio/';
const DESC = "Tri Huynh: AI and software engineer, Northeastern '27. Pull up a chair: the projects are dealt as one hand of hold'em.";

export default function Home() {
  const { basePath } = useRouter();
  return (
    <>
      <Head>
        <title>Tri Huynh · take a seat</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={URL} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={URL} />
        <meta property="og:title" content="Tri Huynh · take a seat" />
        <meta property="og:description" content={DESC} />
        <meta property="og:image" content={`${URL}images/og.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#0d0b09" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700;9..144,900&family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="pk-page">
        <header className="pk-top">
          <a className="pk-mark" href="#top"><SuitIcon suit="spade" size={14} color="#d9b45a" /> tri huynh</a>
          <nav className="pk-nav" aria-label="Site">
            <a href="#plain">plain version ↓</a>
            <a href={`${basePath}${CONTACT.resume}`} target="_blank" rel="noreferrer">résumé</a>
            <a href={`mailto:${CONTACT.email}`}>email</a>
            <a href={CONTACT.github} target="_blank" rel="noreferrer">github</a>
          </nav>
        </header>

        <main id="top">
          <div className="pk-intro">
            <h1>Tri Huynh</h1>
            <p>AI &amp; software engineer · Northeastern &apos;27 · Boston. I build AI systems that hold up in production. You&apos;re dealt my hand below: play it, or skip to the <a href="#plain">plain version</a>.</p>
          </div>
          <PokerTable />
          <HandHistory />
        </main>

        <footer className="pk-foot">
          <span>© 2026 Tri Huynh</span>
          <span>psst: there&apos;s a terminal (bottom right) and someone peeking at your cards</span>
        </footer>
      </div>

      <SpotifyPlayer />
      <EggHunt />
      <FloatingTerminalButton />
    </>
  );
}
