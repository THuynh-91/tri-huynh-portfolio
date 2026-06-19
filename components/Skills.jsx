import TechIcon from './TechIcon';
import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import Marquee from './Marquee';
import skillsData from '../data/skills.json';

export default function Skills() {
  const categories = [
    { title: 'AI & Agents', items: skillsData.ai, featured: true, badge: 'most used' },
    { title: 'Data & Cloud', items: skillsData.platforms, featured: true, badge: 'enterprise stack' },
    { title: 'Languages', items: skillsData.languages },
    { title: 'Frameworks', items: skillsData.frameworks },
    { title: 'ML & Data', items: skillsData.libraries },
    { title: 'Databases', items: skillsData.databases },
    { title: 'Tools', items: skillsData.tools },
    { title: 'Cloud & Infra', items: skillsData.cloud },
  ];

  const marqueeItems = [
    'Claude SDK', 'Claude Code', 'Codex', 'Copilot Studio', 'Agentic AI', 'RAG',
    'Azure', 'Databricks', 'Snowflake', 'PyTorch', 'FastAPI', 'Next.js',
  ];

  return (
    <section id="skills" className="section-padding">
      <div className="mx-auto max-w-wide">
        <SectionHeader
          index="04"
          eyebrow="toolkit"
          title="The stack I"
          accent="reach for."
          note="A working toolkit across ML, backend, and full-stack, picked up by shipping real projects, not just coursework."
        />
      </div>

      {/* full-bleed marquee */}
      <Reveal className="my-12 border-y border-line py-6">
        <Marquee items={marqueeItems} />
      </Reveal>

      <div className="mx-auto max-w-wide">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category, idx) => (
            <Reveal
              key={category.title}
              delay={idx * 0.05}
              className={`relative overflow-hidden rounded-2xl border bg-surface p-6 transition-colors ${
                category.featured
                  ? 'border-accent/40 md:col-span-2 lg:col-span-3'
                  : 'border-line hover:border-line-strong'
              }`}
            >
              {category.featured && (
                <div
                  className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full blur-3xl"
                  style={{ background: 'var(--accent-soft)' }}
                />
              )}
              <div className="relative mb-5 flex items-center gap-3">
                <span className="font-mono text-xs text-accent-text">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display text-lg font-semibold">{category.title}</h3>
                {category.featured && category.badge && (
                  <span className="rounded-full bg-accent-soft px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-accent-text">
                    {category.badge}
                  </span>
                )}
                <span className="ml-auto font-mono text-xs text-muted">
                  {category.items.length}
                </span>
              </div>
              <div className="relative flex flex-wrap gap-2.5">
                {category.items.map((skill) => (
                  <TechIcon
                    key={skill}
                    name={skill}
                    size="sm"
                    label={category.featured}
                  />
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
