import { useImpact, rng } from './fx';

// The manga primitives: panels, narration boxes, speech bubbles, sound effects,
// focus lines, translator's notes and page numbers.

export function Panel({ span = 12, cut, tone, className = '', impact = false, children, label, style }) {
  const ref = useImpact();
  const cls = ['ink-panel', `s-${span}`, cut ? `cut-${cut}` : '', tone ? `tone-${tone}` : '', impact ? 'has-impact' : '', className].filter(Boolean).join(' ');
  return (
    <div className={cls} ref={impact ? ref : undefined} aria-label={label} style={style}>
      <div className="ink-panel-in">{children}</div>
    </div>
  );
}

export function Narr({ children, dark = false, pos = 'tl', className = '' }) {
  return <p className={`ink-narr pos-${pos}${dark ? ' is-dark' : ''} ${className}`}>{children}</p>;
}

export function Bubble({ children, tail = 'bl', shout = false, className = '' }) {
  return <p className={`ink-bubble tail-${tail}${shout ? ' is-shout' : ''} ${className}`}>{children}</p>;
}

// A sound effect sized to fit its panel: the size is a cap, and the panel's width
// divided by the word's length is the limit, so long words never overflow narrow panels.
export function Sfx({ children, red = false, size = 'l', tilt = -4, className = '' }) {
  const chars = typeof children === 'string' ? Math.max(2, children.length) : 2;
  return (
    <span className={`ink-sfx sz-${size}${red ? ' is-red' : ''} ${className}`} style={{ '--tilt': `${tilt}deg`, '--chars': chars }}>
      {children}
    </span>
  );
}

// Translator's note, as scanlations print them: small, in the gutter, explaining a term of art.
export function TN({ children }) {
  return <p className="ink-tn"><b>T/N:</b> {children}</p>;
}

export function PageNo({ n }) {
  return <p className="ink-pageno" aria-hidden="true">— {n} —</p>;
}

// Focus lines (集中線): ink wedges from the edges toward a clear centre.
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

// Parallel speed lines, for panels that move sideways.
export function Speed({ seed = 3, count = 46, w = 160, h = 100 }) {
  const r = rng(seed);
  const lines = [];
  for (let i = 0; i < count; i++) {
    const y = r() * h;
    const x0 = r() * w * 0.5;
    const len = w * (0.3 + r() * 0.7);
    const t = 0.15 + r() * 0.7;
    lines.push(`M${x0.toFixed(1)},${(y - t / 2).toFixed(2)}L${(x0 + len).toFixed(1)},${y.toFixed(2)}L${x0.toFixed(1)},${(y + t / 2).toFixed(2)}Z`);
  }
  return (
    <svg className="ink-focus" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" aria-hidden="true">
      {lines.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}

export function ChapterTitle({ n, title, sub, stack, id, kicker }) {
  return (
    <header className="ink-chapter" id={id}>
      <span className="ink-chapter-n" aria-hidden="true">{n}</span>
      <div className="ink-chapter-t">
        <p className="ink-chapter-k">{kicker || `Chapter ${n}`}</p>
        <h2>{title}</h2>
        <p className="ink-chapter-sub">{sub}</p>
      </div>
      {stack && <p className="ink-chapter-stack">{stack.map((t) => t.replace(/ /g, '\u00a0')).join(' · ')}</p>}
    </header>
  );
}
