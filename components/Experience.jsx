import { useRouter } from 'next/router';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import experience from '../data/experience.json';

export default function Experience() {
  const router = useRouter();
  const basePath = router.basePath || '';
  const job = experience[0];

  return (
    <section id="experience" className="section-padding">
      <div className="mx-auto max-w-wide">
        <SectionHeader
          index="02"
          eyebrow="experience"
          title="Where I built"
          accent="real AI."
          note="My most recent chapter: production AI agents and internal tools inside a Fortune-500 biotech."
        />

        <Reveal className="mt-12">
          <article className="relative overflow-hidden rounded-2xl border border-accent/30 bg-surface p-7 md:p-10">
            <div
              className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full blur-3xl"
              style={{ background: 'var(--accent-soft)' }}
            />
            <div
              className="pointer-events-none absolute -left-28 bottom-0 h-52 w-52 rounded-full blur-3xl"
              style={{ background: 'var(--accent-2-soft)' }}
            />

            <div className="relative flex flex-col gap-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-4">
                    <span className="inline-flex items-center rounded-xl bg-white px-3 py-2.5 ring-1 ring-line">
                      <img
                        src={`${basePath}/images/biogen.svg`}
                        alt="Biogen"
                        className="h-6 w-auto"
                      />
                    </span>
                    <div>
                      <h3 className="font-display text-2xl font-semibold leading-tight">
                        {job.role}
                      </h3>
                      <p className="text-accent-text">{job.company}</p>
                    </div>
                  </div>
                  <p className="mt-4 max-w-2xl text-muted">{job.summary}</p>
                </div>
                <div className="font-mono text-sm md:text-right">
                  <p className="text-fg">{job.period}</p>
                  <p className="text-muted">{job.location}</p>
                </div>
              </div>

              <ul className="grid gap-3 md:grid-cols-2">
                {job.achievements.map((a, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-sm text-muted">
                    <span className="mt-1 text-accent-text">▸</span>
                    <span>{a}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-2 pt-1">
                {job.stack.map((s) => (
                  <span
                    key={s}
                    className="rounded-md bg-accent-soft px-2.5 py-1 font-mono text-[11px] text-accent-text"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </article>
        </Reveal>
      </div>
    </section>
  );
}
