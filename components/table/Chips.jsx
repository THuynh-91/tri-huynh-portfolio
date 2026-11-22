// Casino chips drawn as a side-on stack: each chip a rim band with edge spots and a striped top.
const COLORS = {
  red: ['#b8282a', '#8c1c1e'],
  blue: ['#2251a8', '#173a7d'],
  black: ['#26231e', '#141210'],
  green: ['#2e8a4f', '#1f6638'],
  gold: ['#d9b45a', '#a9852f'],
};

export function ChipStack({ color = 'red', count = 5, width = 46 }) {
  const [face, side] = COLORS[color] || COLORS.red;
  const rx = width / 2, ry = width * 0.17, band = width * 0.12, step = band + 1;
  const h = count * step + ry * 2 + 2;
  const chips = [];
  for (let i = 0; i < count; i++) {
    const cy = h - ry - 1 - i * step - band;
    chips.push(
      <g key={i}>
        <rect x="0" y={cy} width={width} height={band} fill={side} />
        {[0.12, 0.34, 0.56, 0.78].map((f) => <rect key={f} x={width * f} y={cy} width={width * 0.08} height={band} fill="#f4ecd8" opacity=".9" />)}
        <ellipse cx={rx} cy={cy + band} rx={rx} ry={ry} fill={side} />
        <ellipse cx={rx} cy={cy} rx={rx} ry={ry} fill={face} />
        <ellipse cx={rx} cy={cy} rx={rx - 2.5} ry={ry - 1} fill="none" stroke="#f4ecd8" strokeWidth="2.2" strokeDasharray="5 6" opacity=".9" />
        <ellipse cx={rx} cy={cy} rx={rx * 0.55} ry={ry * 0.55} fill={face} stroke="#000" strokeOpacity=".15" />
      </g>
    );
  }
  return (
    <svg width={width} height={h} viewBox={`0 0 ${width} ${h}`} aria-hidden="true" style={{ display: 'block', overflow: 'visible' }}>
      <ellipse cx={rx} cy={h - ry + 2} rx={rx + 3} ry={ry + 2} fill="#000" opacity=".28" />
      {chips}
    </svg>
  );
}

export function ResultStack({ color, count, value, label, title }) {
  return (
    <div className="pk-stack" title={title}>
      <ChipStack color={color} count={count} />
      <b>{value}</b>
      <small>{label}</small>
    </div>
  );
}
