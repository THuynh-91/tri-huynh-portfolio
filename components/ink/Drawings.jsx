import { COMPRESSION } from '../../data/hand';
import { rng } from './fx';

// A pile of request slips: the backlog the intake system replaced.
export function Slips({ n = 34, seed = 11 }) {
  const r = rng(seed);
  const slips = Array.from({ length: n }, (_, i) => ({
    i,
    x: r() * 88,
    y: 8 + r() * 72,
    rot: (r() - 0.5) * 50,
    lines: 2 + Math.floor(r() * 3),
    red: r() < 0.08,
  }));
  return (
    <div className="ink-slips" aria-hidden="true">
      {slips.map((s) => (
        <span key={s.i} className={`ink-slip${s.red ? ' is-red' : ''}`} style={{ left: `${s.x}%`, top: `${s.y}%`, transform: `rotate(${s.rot.toFixed(1)}deg)` }}>
          <b>REQ</b>
          {Array.from({ length: s.lines }, (_, k) => <i key={k} style={{ width: `${55 + ((s.i * 13 + k * 29) % 40)}%` }} />)}
        </span>
      ))}
    </div>
  );
}

// The agent, as the resume describes it: Teams in, Python + Claude SDK in the middle,
// tools over MCP and a Databricks sandbox on Azure, every run traced in LangSmith.
export function AgentMap() {
  const box = (x, y, w, h, label, sub, strong) => (
    <g>
      <rect x={x + 3} y={y + 3} width={w} height={h} className="sh" />
      <rect x={x} y={y} width={w} height={h} className={strong ? 'bx strong' : 'bx'} />
      <text x={x + w / 2} y={y + (sub ? h / 2 - 3 : h / 2 + 5)} textAnchor="middle" className="t">{label}</text>
      {sub && <text x={x + w / 2} y={y + h / 2 + 15} textAnchor="middle" className="ts">{sub}</text>}
    </g>
  );
  const arrow = (x1, y1, x2, y2, dashed) => (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} className={dashed ? 'ln dash' : 'ln'} markerEnd="url(#ink-arrow)" />
    </g>
  );
  return (
    <svg className="ink-map" viewBox="0 0 560 260" role="img" aria-label="Business teams ask in Microsoft Teams; the agent, in Python with the Claude SDK, calls tools over MCP and a Databricks sandbox on Azure; LangSmith traces every run.">
      <defs>
        <marker id="ink-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0,0 L10,5 L0,10 z" className="hd" />
        </marker>
      </defs>
      {box(10, 95, 120, 60, 'Teams', 'a business team asks')}
      {box(195, 80, 160, 90, 'THE AGENT', 'Python · Claude SDK', true)}
      {box(420, 18, 130, 50, 'MCP tools', null)}
      {box(420, 100, 130, 50, 'Databricks', 'sandbox')}
      {box(420, 182, 130, 50, 'Azure', null)}
      {arrow(132, 125, 192, 125)}
      {arrow(357, 110, 417, 45)}
      {arrow(357, 125, 417, 125)}
      {arrow(357, 140, 417, 205)}
      <text x="275" y="214" textAnchor="middle" className="ts">every run traced in LangSmith</text>
      <line x1="275" y1="172" x2="275" y2="198" className="ln dash" />
    </svg>
  );
}

// 10.6 times behind, drawn to scale.
export function GapBars() {
  return (
    <div className="ink-gap" role="img" aria-label="On October 15 the leader had 1,060,000; I had 100,000, about a tenth.">
      <div className="ink-gap-row"><span>the leader</span><b className="bar" style={{ width: '100%' }} /><em>1,060,000</em></div>
      <div className="ink-gap-row"><span>me</span><b className="bar is-red" style={{ width: `${(100 / 1060) * 100}%` }} /><em>100,000</em></div>
    </div>
  );
}

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

// A practice problem with the checker's stamp.
export function Checked() {
  return (
    <div className="ink-checked" aria-hidden="true">
      <div className="sheet">
        <p className="q">Practice 4</p>
        <i style={{ width: '88%' }} /><i style={{ width: '72%' }} /><i style={{ width: '80%' }} />
        <p className="a">answer key</p>
        <i style={{ width: '46%' }} />
      </div>
      <span className="stamp">RE-SOLVED<br />✓ CHECKED</span>
    </div>
  );
}
