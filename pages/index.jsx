import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Cover from '../components/ink/Cover';
import ScrollLines from '../components/ink/ScrollLines';
import Extras from '../components/ink/Extras';
import TextEdition from '../components/ink/TextEdition';
import { Panel, Narr, Bubble, Sfx, TN, PageNo, Focus, Speed, ChapterTitle } from '../components/ink/Ink';
import { Slips, AgentMap, GapBars, InkChart, Checked } from '../components/ink/Drawings';
import { getSound, setSound, onSound, loadSound } from '../components/ink/fx';
import EggHunt from '../components/EggHunt';
import FloatingTerminalButton from '../components/FloatingTerminalButton';
import { CONTACT } from '../data/hand';

const URL = 'https://thuynh-91.github.io/tri-huynh-portfolio/';
const DESC = "Tri Huynh: AI and software engineer, Northeastern '27. A portfolio told as a manga: four chapters, real numbers, side stories you can play.";

function SoundToggle() {
  const [on, setOn] = useState(false);
  useEffect(() => { const off = onSound(setOn); loadSound(); setOn(getSound()); return off; }, []);
  return (
    <button type="button" className="ink-sfx-toggle" aria-pressed={on} onClick={() => setSound(!on)}>
      SFX {on ? 'on' : 'off'}
    </button>
  );
}

export default function Home() {
  const { basePath } = useRouter();
  useEffect(() => { document.documentElement.classList.add('ink-js'); }, []);
  return (
    <>
      <Head>
        <title>Tri Huynh · Vol. 2027</title>
        <meta name="description" content={DESC} />
        <link rel="canonical" href={URL} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={URL} />
        <meta property="og:title" content="Tri Huynh · Vol. 2027" />
        <meta property="og:description" content={DESC} />
        <meta property="og:image" content={`${URL}images/ink/impact-beam.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="theme-color" content="#f7f6ef" />
        {/* hide the sound effects before first paint, so they can land when their panel scrolls in */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('ink-js')" }} />
        <link
          href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Shantell+Sans:ital,wght@0,400;0,600;0,800;1,400&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </Head>

      <div className="ink-page">
        <ScrollLines />
        <header className="ink-top">
          <a className="ink-mark" href="#top">TRI HUYNH</a>
          <nav aria-label="Site">
            <a href={`${basePath}${CONTACT.resume}`} target="_blank" rel="noreferrer">résumé</a>
            <a href={`mailto:${CONTACT.email}`}>email</a>
            <a href={CONTACT.github} target="_blank" rel="noreferrer">github</a>
            <a href="#text">text-only</a>
            <SoundToggle />
          </nav>
        </header>

        <main id="top">
          <Cover />
          <PageNo n={1} />

          {/* ---------------------------------------------------------------- CH 1 */}
          <ChapterTitle id="ch1" n="1" title="The Agent" sub="Biogen · AI Engineer Co-op · Cambridge, MA · January to June 2026" stack={['Python', 'Claude SDK', 'MCP', 'Azure', 'Databricks', 'LangSmith', 'Power BI']} />
          <div className="ink-grid">
            <Panel span={7} className="h-l" tone="fade" label="The backlog">
              <Slips />
              <Narr>AI requests at Biogen waited months, in a backlog nobody could read.</Narr>
              <Sfx size="l" tilt={-6} className="at-br">200+</Sfx>
            </Panel>
            <Panel span={5} className="h-l" cut="l">
              <div className="ink-stack">
                <Bubble tail="bl">So I built a documented intake system. From scratch.</Bubble>
                <Narr pos="none">Then I presented it to VPs and cross-functional stakeholders, and moved the whole backlog into it.</Narr>
              </div>
            </Panel>
            <Panel span={12} className="h-m ink-center" impact label="Result">
              <Focus seed={101} rx={0.34} ry={0.3} red={0.06} />
              <p className="ink-big"><Sfx size="xl" tilt={-3}>MONTHS</Sfx><Sfx size="l" tilt={0} red className="arrow">→</Sfx><Sfx size="xl" tilt={-3} red>1 WEEK</Sfx></p>
              <p className="ink-under">the wait for an answer on an AI request</p>
            </Panel>
          </div>
          <PageNo n={4} />
          <div className="ink-grid">
            <Panel span={8} className="h-l" label="The agent">
              <div className="ink-stack">
                <Narr pos="none">Meanwhile, I built the core of Biogen&apos;s production AI agent. Business teams run workflows with it on request, from Microsoft Teams.</Narr>
                <AgentMap />
              </div>
            </Panel>
            <Panel span={4} className="h-l" cut="r" tone="dots">
              <div className="ink-stack">
                <Narr pos="none" dark>And the plumbing under it:</Narr>
                <ul className="ink-list">
                  <li>SharePoint → Power BI → Smartsheet data pipeline</li>
                  <li>A Power BI dashboard</li>
                  <li>4 recurring workflows automated across Azure AI Services, Databricks, Snowflake and Power Automate</li>
                </ul>
              </div>
            </Panel>
          </div>
          <TN>MCP is the Model Context Protocol, the standard way to plug tools into a model. LangSmith records every step an agent takes.</TN>
          <PageNo n={5} />

          {/* ---------------------------------------------------------------- CH 2 */}
          <ChapterTitle id="ch2" n="2" title="The Pack" sub="CruxPack · cruxpack.io · in production" stack={['TypeScript', 'Next.js', 'SQLite', 'Fly.io', 'Gemini', 'Stripe']} />
          <div className="ink-grid">
            <Panel span={4} className="h-l ink-center">
              <Speed seed={44} count={40} />
              <Sfx size="xl" tilt={-8}>PDF</Sfx>
              <Narr pos="bl">A lecture PDF goes in.</Narr>
            </Panel>
            <Panel span={8} className="h-l ink-shot" cut="l" label="CruxPack's landing page">
              <img src={`${basePath}/images/ink/cruxpack-dots.png`} alt="CruxPack's landing page: it turns lectures into flashcards that link back to the slide they came from" loading="lazy" />
              <Narr pos="br" dark>Source-cited notes, flashcards, practice problems and Q&amp;A come out. Every card links back to its slide.</Narr>
            </Panel>
            <Panel span={12} className="h-m ink-center" impact label="Accuracy">
              <Focus seed={202} rx={0.3} ry={0.32} />
              <p className="ink-big"><Sfx size="xxl" tilt={-4} red>98.7%</Sfx></p>
              <p className="ink-under">correct, on 770 claims from 20 sources</p>
            </Panel>
          </div>
          <TN>an LLM-as-judge evaluation: a second model checks each generated claim against the source it cites.</TN>
          <PageNo n={7} />
          <div className="ink-grid">
            <Panel span={6} className="h-m">
              <Checked />
              <Narr pos="bl">Every practice problem is re-solved by an independent checker before it ships.</Narr>
            </Panel>
            <Panel span={6} className="h-m ink-center" cut="r" impact>
              <p className="ink-big tight"><Sfx size="l" tilt={-3}>20.5 MB</Sfx><Sfx size="m" tilt={0} className="arrow">→</Sfx><Sfx size="l" tilt={-3} red>3.9 MB</Sfx></p>
              <Narr pos="bl">PDF export, after tracing 95% of the bytes to images. Also 5.3 s → 3.6 s.</Narr>
            </Panel>
          </div>
          <p className="ink-go"><a className="ink-stamp" href="https://cruxpack.io" target="_blank" rel="noreferrer">try cruxpack.io →</a></p>
          <PageNo n={8} />

          {/* ---------------------------------------------------------------- CH 3 */}
          <ChapterTitle id="ch3" n="3" title="Ten Times Behind" sub="Predictions Cup · Susquehanna's play-money 2026 midterms market · October to November 2026" stack={['Python', 'asyncio', 'WebSockets', 'NumPy', 'Monte Carlo']} />
          <div className="ink-grid">
            <Panel span={12} className="h-m" impact label="The gap">
              <Narr>October 15, 2026. A prediction-market contest; only the top three win prizes.</Narr>
              <GapBars />
              <Sfx size="xl" tilt={-7} red className="at-r">×10.6</Sfx>
            </Panel>
            <Panel span={6} className="h-l">
              <div className="ink-stack">
                <Bubble tail="bl" shout>Playing for profit can&apos;t close a 10× gap.</Bubble>
                <Bubble tail="br" className="push-r">So I optimized for one number: the odds of finishing first.</Bubble>
              </div>
            </Panel>
            <Panel span={6} className="h-l" cut="l" tone="dots">
              <div className="ink-stack">
                <Narr pos="none" dark>Then I built it to trade live:</Narr>
                <ul className="ink-list">
                  <li>real-time feeds from 3 venues</li>
                  <li>risk caps and monitoring</li>
                  <li>a kill switch</li>
                </ul>
              </div>
            </Panel>
          </div>
          <TN>Monte Carlo: simulate the whole contest thousands of times and count how often a strategy finishes first.</TN>
          <PageNo n={10} />
          <div className="ink-grid">
            <Panel span={7} className="ink-chart-panel" label="The squeeze">
              <InkChart />
            </Panel>
            <Panel span={5} className="h-auto" cut="r">
              <div className="ink-stack">
                <Narr pos="none">And the market itself was bent: its prices were squeezed toward 50% against Kalshi&apos;s.</Narr>
                <Bubble tail="tl">Cheap contracts were too expensive. Expensive ones were too cheap.</Bubble>
                <Narr pos="none" dark>I wrote it up as a working paper.</Narr>
                <a className="ink-stamp" href={CONTACT.paper} target="_blank" rel="noreferrer">read it on SSRN →</a>
              </div>
            </Panel>
          </div>
          <TN>hover a dot for its prices. A slope of 1.0 would mean no squeeze; Oct 15 measured 0.77.</TN>
          <PageNo n={11} />

          {/* ---------------------------------------------------------------- CH 4 */}
          <ChapterTitle id="ch4" n="4" title="1.48 Million Commits" sub="GitTimeline · open source · 2026" stack={['TypeScript', 'Preact', 'Canvas2D', 'Web Workers', 'Playwright']} />
          <div className="ink-grid">
            <Panel span={12} className="ink-shot wide" label="GitTimeline replaying Linux">
              <img src={`${basePath}/images/ink/gittimeline-linux.png`} alt="GitTimeline replaying the Linux kernel's history: branches as lines, merges as dots" loading="lazy" />
              <Narr>Linux&apos;s entire history, replayed in a browser tab. No GitHub token, no API call: histories are pre-built.</Narr>
            </Panel>
            <Panel span={4} className="h-m ink-center">
              <Narr pos="tl">But the frames were slow.</Narr>
              <Sfx size="xl" tilt={-5}>50 ms</Sfx>
              <p className="ink-under small">p95 frame time</p>
            </Panel>
            <Panel span={8} className="h-m ink-center" cut="l" impact>
              <Focus seed={404} rx={0.28} ry={0.34} red={0.05} />
              <Narr pos="tl">I profiled it. 20.9 ms of every frame went to</Narr>
              <p className="ink-big"><Sfx size="xxl" tilt={-4} red>ONE CALL</Sfx></p>
              <p className="ink-under">a single canvas filter</p>
            </Panel>
          </div>
          <PageNo n={13} />
          <div className="ink-grid">
            <Panel span={7} className="h-m ink-center">
              <Speed seed={77} count={50} />
              <Narr pos="tl">Swapped it for a mip-chain bloom.</Narr>
              <p className="ink-big"><Sfx size="xl" tilt={-3}>50</Sfx><Sfx size="m" tilt={0} className="arrow">→</Sfx><Sfx size="xxl" tilt={-5} red>33 ms</Sfx></p>
            </Panel>
            <Panel span={5} className="h-m" cut="r">
              <div className="ink-stack">
                <Bubble tail="bl">Try it with any public repo.</Bubble>
                <p className="ink-row">
                  <a className="ink-stamp" href="https://thuynh-91.github.io/gittimeline/" target="_blank" rel="noreferrer">open it →</a>
                  <a className="ink-stamp ghost" href="https://github.com/THuynh-91/gittimeline" target="_blank" rel="noreferrer">source</a>
                </p>
              </div>
            </Panel>
          </div>
          <TN>p95 frame time: 95% of frames draw faster than this. A mip-chain bloom blurs smaller and smaller copies of the frame instead of one huge blur.</TN>
          <PageNo n={14} />

          {/* ---------------------------------------------------------------- EXTRAS */}
          <ChapterTitle id="extras" n="★" kicker="Extras" title="Side Stories" sub="What I build for fun. Two of them play right here." />
          <Extras />
          <PageNo n={16} />

          {/* ---------------------------------------------------------------- NEXT */}
          <ChapterTitle id="next" n="5" title="Next Chapter" sub="Graduating May 2027 · B.S. Computer Science, AI concentration" />
          <div className="ink-grid">
            <Panel span={12} className="h-l ink-center ink-next" impact>
              <Focus seed={505} rx={0.36} ry={0.36} red={0.04} />
              <div className="ink-next-in">
                <Bubble tail="bl" shout>Looking for full-time AI and software engineering roles, from May 2027.</Bubble>
                <Sfx size="l" tilt={-4} red>YOUR TEAM?</Sfx>
                <p className="ink-row">
                  <a className="ink-stamp" href={`${basePath}${CONTACT.resume}`} target="_blank" rel="noreferrer">résumé</a>
                  <a className="ink-stamp" href={`mailto:${CONTACT.email}`}>email</a>
                  <a className="ink-stamp ghost" href={CONTACT.github} target="_blank" rel="noreferrer">github</a>
                  <a className="ink-stamp ghost" href={CONTACT.linkedin} target="_blank" rel="noreferrer">linkedin</a>
                </p>
                <p className="ink-addr">{CONTACT.email}</p>
              </div>
            </Panel>
          </div>
          <PageNo n={18} />

          <TextEdition />
        </main>

        <footer className="ink-foot">
          <p className="ink-end">END OF VOL. 2027</p>
          <p>© 2026 Tri Huynh · drawn in code · psst: someone is peeking from the left edge, and there&apos;s a terminal bottom right.</p>
        </footer>
      </div>

      <EggHunt />
      <FloatingTerminalButton />
    </>
  );
}
