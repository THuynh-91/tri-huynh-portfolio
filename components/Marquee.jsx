// Infinite horizontal marquee. Duplicates children so the loop is seamless.
export default function Marquee({ items, separator = '/', reverse = false, className = '' }) {
  const row = (
    <div className="flex shrink-0 items-center gap-8 pr-8" aria-hidden="true">
      {items.map((item, i) => (
        <span key={i} className="flex items-center gap-8">
          <span className="font-display text-2xl md:text-4xl font-medium text-fg/80 whitespace-nowrap">
            {item}
          </span>
          <span className="text-accent text-2xl md:text-4xl">{separator}</span>
        </span>
      ))}
    </div>
  );

  return (
    <div className={`group relative flex overflow-hidden ${className}`}>
      <div
        className="flex animate-marquee group-hover:[animation-play-state:paused]"
        style={reverse ? { animationDirection: 'reverse' } : undefined}
      >
        {row}
        {row}
      </div>
    </div>
  );
}
