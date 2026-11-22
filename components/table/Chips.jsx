// Chips drawn in ink: a side-on stack, each chip an outlined rim band with edge spots and a striped top.
const COLORS = {
  red: ['var(--pk-red)', 'var(--pk-red-deep)'],
  ink: ['var(--pk-ink)', 'var(--pk-ink)'],
  paper: ['var(--pk-paper)', 'var(--pk-paper-deep)'],
};

// One chip seen from above: rim, edge spots, an inner ring. Used for tossed chips and the showdown burst.
export function ChipTop({ color = 'red', size = 30 }) {
  const [face] = COLORS[color] || COLORS.red;
  const spot = color === 'paper' ? 'var(--pk-red)' : 'var(--pk-paper)';
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <circle cx="20" cy="22" r="18" style={{ fill: 'rgba(0,0,0,.35)' }} />
      <circle cx="20" cy="20" r="18" style={{ fill: face, stroke: 'var(--pk-ink)', strokeWidth: 1.4 }} />
      <circle cx="20" cy="20" r="18" style={{ fill: 'none', stroke: spot, strokeWidth: 4.5, strokeDasharray: '6.3 7.8' }} />
      <circle cx="20" cy="20" r="11" style={{ fill: face, stroke: spot, strokeWidth: 1.2, strokeDasharray: '2 2' }} />
    </svg>
  );
}

export function ChipStack({ color = 'red', count = 5, width = 46 }) {
  const [face, side] = COLORS[color] || COLORS.red;
  const spot = color === 'paper' ? 'var(--pk-red)' : 'var(--pk-paper)';
  const rx = width / 2, ry = width * 0.17, band = width * 0.12, step = band + 1;
  const h = count * step + ry * 2 + 4;
  const chips = [];
  for (let i = 0; i < count; i++) {
    const cy = h - ry - 2 - i * step - band;
    chips.push(
      <g key={i}>
        <rect x="1" y={cy} width={width - 2} height={band} fill={side} stroke="var(--pk-ink)" strokeWidth="1.4" />
        {[0.14, 0.36, 0.58, 0.8].map((f) => <rect key={f} x={width * f} y={cy + 1} width={width * 0.08} height={band - 2} fill={spot} />)}
        <ellipse cx={rx} cy={cy + band} rx={rx - 1} ry={ry} fill={side} stroke="var(--pk-ink)" strokeWidth="1.4" />
        <ellipse cx={rx} cy={cy} rx={rx - 1} ry={ry} fill={face} stroke="var(--pk-ink)" strokeWidth="1.4" />
        <ellipse cx={rx} cy={cy} rx={rx - 4} ry={ry - 1.6} fill="none" stroke={spot} strokeWidth="2" strokeDasharray="5 5" />
      </g>
    );
  }
  return (
    <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      {chips}
    </svg>
  );
}
