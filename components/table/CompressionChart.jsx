import { COMPRESSION } from '../../data/hand';

// The working paper's compression figure, from its real data: contest price against Kalshi price,
// binned. Low prices sit above the fair line and high prices below it: the contest squeezed
// prices toward 50%. The curve is the fitted logit slope for Oct 15.
export default function CompressionChart() {
  const L = 44, B = 250, W = 300, H = 230;
  const X = (p) => L + p * W, Y = (p) => B - p * H;
  const sig = (z) => 1 / (1 + Math.exp(-z));
  const lg = (p) => Math.log(p / (1 - p));
  const fit = [];
  for (let p = 0.02; p <= 0.981; p += 0.01) fit.push(`${X(p).toFixed(1)},${Y(sig(COMPRESSION.intercept + COMPRESSION.slope * lg(p))).toFixed(1)}`);
  return (
    <figure className="pk-chart">
      <svg viewBox="0 0 360 290" role="img" aria-label="Contest price against Kalshi price. Points above the fair line at low prices and below it at high prices show prices squeezed toward 50 percent.">
        <line x1={L} y1={B} x2={L + W} y2={B} stroke="currentColor" strokeOpacity=".25" />
        <line x1={L} y1={B} x2={L} y2={B - H} stroke="currentColor" strokeOpacity=".25" />
        <line x1={X(0)} y1={Y(0)} x2={X(1)} y2={Y(1)} stroke="currentColor" strokeOpacity=".45" strokeDasharray="4 5" />
        <text x={X(0.78)} y={Y(0.9)} className="pk-chart-t">fair</text>
        <polyline points={fit.join(' ')} fill="none" stroke="#b8282a" strokeWidth="3" strokeLinecap="round" />
        {COMPRESSION.oct15.map(([k, c]) => <circle key={`a${k}`} cx={X(k)} cy={Y(c)} r="5" fill="#b8282a" />)}
        {COMPRESSION.oct27.map(([k, c]) => <circle key={`b${k}`} cx={X(k)} cy={Y(c)} r="4.2" fill="none" stroke="currentColor" strokeWidth="1.3" />)}
        <text x={L + W / 2} y={B + 30} textAnchor="middle" className="pk-chart-t">Kalshi price</text>
        <text x="14" y={B - H / 2} textAnchor="middle" transform={`rotate(-90 14 ${B - H / 2})`} className="pk-chart-t">contest price</text>
        <circle cx={L + 12} cy={B - H + 8} r="5" fill="#b8282a" /><text x={L + 22} y={B - H + 12} className="pk-chart-t">Oct 15</text>
        <circle cx={L + 82} cy={B - H + 8} r="4.2" fill="none" stroke="currentColor" strokeWidth="1.3" /><text x={L + 92} y={B - H + 12} className="pk-chart-t">Oct 27</text>
      </svg>
      <figcaption>Real data from the working paper: binned prices, Oct 15 and Oct 27. Logit slope 0.77 on Oct 15 (1.0 would mean no squeeze).</figcaption>
    </figure>
  );
}
