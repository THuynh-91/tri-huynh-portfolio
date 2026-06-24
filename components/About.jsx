import { motion } from 'framer-motion';
import SectionHeader from './SectionHeader';
import AnimatedCounter from './AnimatedCounter';
import Reveal from './Reveal';
import projectsData from '../data/projects.json';

const card =
  'rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-line-strong';

export default function About() {
  return (
    <section id="about" className="px-6 pb-10 pt-2 md:pb-14 md:pt-4">
      <div className="mx-auto max-w-wide">
        <SectionHeader
          index="01"
          eyebrow="about"
          title="A builder who likes the"
          accent="hard parts."
          note="I care about the seam where models meet real software, and shipping the whole thing, not just the notebook."
        />

        <div className="mt-14 grid gap-4 md:grid-cols-3 auto-rows-[minmax(0,1fr)]">
          {/* bio - large */}
          <Reveal className={`${card} md:col-span-2 md:row-span-2 flex flex-col justify-between`}>
            <div className="space-y-4 text-muted leading-relaxed">
              <p>
                I'm a Computer Science student at{' '}
                <span className="text-fg">Northeastern University's Khoury College</span>,
                concentrating in Artificial Intelligence. I care about the seam
                where messy real-world data meets clean, usable software.
              </p>
              <p>
                Right now I'm an <span className="text-accent">AI Engineer Co-op at Biogen</span>,
                building a persistent enterprise AI agent on the Claude SDK, Azure, and
                Databricks: contextual conversations, data retrieval, and workflow
                automation across business units.
              </p>
              <p>
                On my own time I've shipped an ML-driven Rock-Paper-Scissors game that drew{' '}
                <span className="text-accent">1,000+ players</span>, a RAG study assistant
                grounded in your own notes, and an explainable Spotify recommender built
                on vector search. I like the full arc: model, backend, and the product on top.
              </p>
            </div>
            <div className="mt-6 flex flex-wrap gap-2 font-mono text-xs">
              {['#agentic-ai', '#claude-sdk', '#ml', '#backend', '#azure'].map((t) => (
                <span key={t} className="rounded-full border border-line px-3 py-1 text-muted">
                  {t}
                </span>
              ))}
            </div>
          </Reveal>

          {/* stat - projects */}
          <Reveal delay={0.05} className={`${card} flex flex-col justify-center`}>
            <div className="font-display text-5xl font-semibold text-accent">
              <AnimatedCounter value={projectsData.length} suffix="+" />
            </div>
            <p className="mt-2 text-sm text-muted">projects designed & shipped</p>
          </Reveal>

          {/* stat - graduation */}
          <Reveal delay={0.1} className={`${card} flex flex-col justify-center`}>
            <div className="font-display text-5xl font-semibold text-accent">2027</div>
            <p className="mt-2 text-sm text-muted">expected B.S. graduation</p>
          </Reveal>

          {/* quick facts */}
          <Reveal delay={0.05} className={`${card} md:col-span-2`}>
            <p className="eyebrow mb-4">quick facts</p>
            <ul className="grid sm:grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {[
                'AI Engineer Co-op @ Biogen',
                'Based in Boston, MA',
                'Concentration in AI',
                'Always shipping side projects',
              ].map((f) => (
                <li key={f} className="flex items-start gap-2 text-muted">
                  <span className="text-accent mt-0.5">▸</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          {/* currently */}
          <Reveal delay={0.1} className={`${card} flex flex-col justify-center`}>
            <p className="eyebrow mb-3">currently</p>
            <p className="text-fg text-sm leading-relaxed">
              Shipping <span className="text-accent">enterprise AI agents</span> with the
              Claude SDK, Azure & Databricks.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
