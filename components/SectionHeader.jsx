import Reveal from './Reveal';

// Shared section header: mono eyebrow with index + big display title + optional note.
export default function SectionHeader({ index, eyebrow, title, accent, note, align = 'left' }) {
  const alignment = align === 'center' ? 'items-center text-center' : 'items-start text-left';
  return (
    <Reveal className={`flex flex-col gap-4 ${alignment}`}>
      <div className="flex items-center gap-3">
        {index && <span className="font-mono text-xs text-accent">{index}</span>}
        <span className="eyebrow">{eyebrow}</span>
        <span className="h-px w-12 bg-line-strong" />
      </div>
      <h2 className="font-display text-4xl md:text-6xl font-semibold tracking-tightest leading-[1.05]">
        {title} {accent && <span className="text-grad">{accent}</span>}
      </h2>
      {note && <p className="text-muted max-w-xl text-base md:text-lg">{note}</p>}
    </Reveal>
  );
}
