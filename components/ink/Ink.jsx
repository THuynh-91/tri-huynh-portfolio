import { rng } from './fx';

// Focus lines (集中線): ink wedges from the edges toward a clear centre. Used behind the showdown.
export function Focus({ seed = 7, count = 120, w = 160, h = 100, cx = 0.5, cy = 0.5, rx = 0.3, ry = 0.3, red = 0 }) {
  const r = rng(seed);
  const X = cx * w, Y = cy * h, R = Math.hypot(w, h);
  const wedges = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + r() * 0.05;
    const dw = 0.004 + r() * 0.016;
    const k = 1 + r() * 0.55;
    const tipX = X + Math.cos(a) * rx * w * k;
    const tipY = Y + Math.sin(a) * ry * h * k;
    const p1 = [X + Math.cos(a - dw) * R, Y + Math.sin(a - dw) * R];
    const p2 = [X + Math.cos(a + dw) * R, Y + Math.sin(a + dw) * R];
    wedges.push({ d: `M${tipX.toFixed(2)},${tipY.toFixed(2)}L${p1[0].toFixed(2)},${p1[1].toFixed(2)}L${p2[0].toFixed(2)},${p2[1].toFixed(2)}Z`, red: r() < red });
  }
  return (
    <svg className="ink-focus" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      {wedges.map((p, i) => <path key={i} d={p.d} className={p.red ? 'r' : undefined} />)}
    </svg>
  );
}
