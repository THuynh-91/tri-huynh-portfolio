import SectionHeader from './SectionHeader';
import Reveal from './Reveal';
import Magnetic from './Magnetic';

export default function Contact() {
  const links = [
    { label: 'email', value: 'triqhuynh91@gmail.com', href: 'mailto:triqhuynh91@gmail.com' },
    { label: 'linkedin', value: '/in/tri-huynh', href: 'https://www.linkedin.com/in/tri-huynh-81735326a' },
    { label: 'github', value: '@THuynh-91', href: 'https://github.com/THuynh-91' },
  ];

  return (
    <section id="contact" className="section-padding">
      <div className="mx-auto max-w-wide">
        <SectionHeader
          index="06"
          eyebrow="contact"
          title="Let's build"
          accent="something."
          note="Open to AI / ML roles, collaborations, and interesting problems. The fastest way to reach me is email."
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-5">
          {/* big CTA */}
          <Reveal className="lg:col-span-3 rounded-2xl border border-line bg-surface p-8 md:p-10 flex flex-col justify-between">
            <div>
              <p className="eyebrow">open to what's next</p>
              <h3 className="mt-4 font-display text-3xl md:text-4xl font-semibold leading-tight">
                Have a role, a project, or just want to{' '}
                <span className="text-accent">say hi?</span>
              </h3>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <Magnetic>
                <a href="mailto:triqhuynh91@gmail.com" className="btn-primary" data-cursor="hover">
                  Email me ↗
                </a>
              </Magnetic>
              <Magnetic>
                <a
                  href="https://www.linkedin.com/in/tri-huynh-81735326a"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary"
                  data-cursor="hover"
                >
                  Connect on LinkedIn
                </a>
              </Magnetic>
            </div>
          </Reveal>

          {/* contact rows */}
          <Reveal delay={0.08} className="lg:col-span-2 rounded-2xl border border-line bg-surface p-2 font-mono">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                target={l.href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="group flex items-center justify-between rounded-xl px-5 py-5 transition-colors hover:bg-surface-2"
                data-cursor="hover"
              >
                <span className="text-xs uppercase tracking-widest text-muted">{l.label}</span>
                <span className="text-sm text-fg transition-colors group-hover:text-accent">
                  {l.value} <span className="text-accent">↗</span>
                </span>
              </a>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
