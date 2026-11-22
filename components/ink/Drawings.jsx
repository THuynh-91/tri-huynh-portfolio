import { COMPRESSION } from '../../data/hand';

// The working paper's compression figure, from its real binned data.
export function InkChart() {
  const L = 52, B = 262, W = 300, H = 236;
  const X = (p) => L + p * W, Y = (p) => B - p * H;
  const sig = (z) => 1 / (1 + Math.exp(-z));
  const lg = (p) => Math.log(p / (1 - p));
  const fit = [];
  for (let p = 0.02; p <= 0.981; p += 0.01) fit.push(`${X(p).toFixed(1)},${Y(sig(COMPRESSION.intercept + COMPRESSION.slope * lg(p))).toFixed(1)}`);
  const pct = (v) => `${Math.round(v * 100)}%`;
  return (
    <figure className="ink-chart">
      <svg viewBox="0 0 380 300" role="img" aria-label="Contest price against Kalshi price. Cheap contracts sat above the fair line and expensive ones below it: prices were squeezed toward 50 percent.">
        <rect x={L} y={B - H} width={W} height={H} className="frame" />
        <path d={`M${X(0)},${Y(0)} L${X(0.5)},${Y(0.5)} L${X(0)},${Y(0.5)} Z`} className="zone" />
        <path d={`M${X(1)},${Y(1)} L${X(0.5)},${Y(0.5)} L${X(1)},${Y(0.5)} Z`} className="zone" />
        <line x1={X(0)} y1={Y(0)} x2={X(1)} y2={Y(1)} className="fair" />
        <text x={X(0.83)} y={Y(0.93)} className="lab">fair</text>
        <polyline points={fit.join(' ')} className="fit" />
        {COMPRESSION.oct27.map(([k, c]) => (
          <circle key={`b${k}`} cx={X(k)} cy={Y(c)} r="5" className="p27"><title>{`Oct 27: Kalshi ${pct(k)}, contest ${pct(c)}`}</title></circle>
        ))}
        {COMPRESSION.oct15.map(([k, c]) => (
          <circle key={`a${k}`} cx={X(k)} cy={Y(c)} r="6" className="p15"><title>{`Oct 15: Kalshi ${pct(k)}, contest ${pct(c)}`}</title></circle>
        ))}
        {[0, 0.5, 1].map((t) => <text key={`x${t}`} x={X(t)} y={B + 18} textAnchor="middle" className="tick">{pct(t)}</text>)}
        {[0, 0.5, 1].map((t) => <text key={`y${t}`} x={L - 8} y={Y(t) + 4} textAnchor="end" className="tick">{pct(t)}</text>)}
        <text x={L + W / 2} y={B + 36} textAnchor="middle" className="lab">Kalshi price</text>
        <text x="13" y={B - H / 2} textAnchor="middle" transform={`rotate(-90 13 ${B - H / 2})`} className="lab">contest price</text>
      </svg>
      <figcaption>
        <span><i className="k15" /> Oct 15</span> <span><i className="k27" /> Oct 27</span>
        <span>red curve: fitted logit slope {COMPRESSION.slope.toFixed(2)} (1.0 = no squeeze)</span>
      </figcaption>
    </figure>
  );
}
