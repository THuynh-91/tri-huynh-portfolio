// Small hand-drawn illustrations for each card face, drawn in the suit's ink with a gold accent.
const GOLD = '#c9a24a';

export function SuitIcon({ suit, size = 16, color }) {
  const fill = color || (suit === 'heart' || suit === 'diamond' ? 'var(--pk-red)' : 'var(--pk-ink)');
  const paths = {
    spade: 'M50 5C30 30 5 45 5 62c0 16 17 24 31 18 6-3 10-8 11-12-1 12-7 22-15 27h36c-8-5-14-15-15-27 1 4 5 9 11 12 14 6 31-2 31-18 0-17-25-32-45-57z',
    heart: 'M50 92C20 70 4 52 4 32 4 16 16 6 30 6c10 0 17 6 20 14 3-8 10-14 20-14 14 0 26 10 26 26 0 20-16 38-46 60z',
    diamond: 'M50 4l38 46-38 46-38-46z',
    club: 'M50 10a18 18 0 0 1 14 29 18 18 0 1 1-10 30c1 11 6 19 14 26H32c8-7 13-15 14-26a18 18 0 1 1-10-30A18 18 0 0 1 50 10z',
  };
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true" style={{ display: 'block' }}>
      <path d={paths[suit]} fill={fill} />
    </svg>
  );
}

export default function CardArt({ art, red }) {
  const ink = red ? 'var(--pk-red)' : 'var(--pk-ink)';
  const common = { viewBox: '0 0 120 100', width: '100%', height: '100%', 'aria-hidden': true };
  switch (art) {
    case 'neural': {
      const L = [[22, [28, 50, 72]], [60, [18, 40, 60, 82]], [98, [36, 64]]];
      const lines = [];
      for (let a = 0; a < L.length - 1; a++) for (const y1 of L[a][1]) for (const y2 of L[a + 1][1]) lines.push(<line key={`${a}-${y1}-${y2}`} x1={L[a][0]} y1={y1} x2={L[a + 1][0]} y2={y2} stroke={ink} strokeOpacity=".28" strokeWidth="1" />);
      return (
        <svg {...common}>
          {lines}
          {L.map(([x, ys]) => ys.map((y) => <circle key={`${x}-${y}`} cx={x} cy={y} r="5.5" fill={x === 60 ? GOLD : ink} />))}
        </svg>
      );
    }
    case 'crown':
      return (
        <svg {...common}>
          <path d="M18 74 L24 30 L44 52 L60 22 L76 52 L96 30 L102 74 Z" fill="none" stroke={ink} strokeWidth="3.2" strokeLinejoin="round" />
          {[24, 60, 96].map((x, i) => <circle key={x} cx={x} cy={i === 1 ? 22 : 30} r="4.5" fill={GOLD} />)}
          <rect x="18" y="74" width="84" height="9" rx="2" fill={ink} />
          <text x="60" y="66" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontWeight="600" fontSize="17" fill={ink}>{'</>'}</text>
        </svg>
      );
    case 'pages':
      return (
        <svg {...common}>
          <rect x="30" y="20" width="46" height="60" rx="3" fill="#fff" stroke={ink} strokeOpacity=".35" transform="rotate(-10 53 50)" />
          <rect x="40" y="16" width="46" height="60" rx="3" fill="#fff" stroke={ink} strokeOpacity=".5" transform="rotate(4 63 46)" />
          <rect x="46" y="22" width="46" height="60" rx="3" fill="#fffdf8" stroke={ink} strokeWidth="1.6" />
          {[34, 42, 50, 58].map((y, i) => <line key={y} x1="53" x2={i === 3 ? 72 : 85} y1={y} y2={y} stroke={ink} strokeOpacity=".55" strokeWidth="2" strokeLinecap="round" />)}
          <rect x="53" y="64" width="18" height="11" rx="2" fill={GOLD} />
          <path d="M100 12 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3z" fill={GOLD} />
        </svg>
      );
    case 'chart': {
      const sig = (z) => 1 / (1 + Math.exp(-z));
      const lg = (p) => Math.log(p / (1 - p));
      const pts = [];
      for (let p = 0.04; p <= 0.961; p += 0.04) pts.push(`${14 + p * 92},${90 - sig(0.0127 + 0.7698 * lg(p)) * 80}`);
      return (
        <svg {...common}>
          <line x1="14" y1="90" x2="106" y2="90" stroke={ink} strokeOpacity=".35" />
          <line x1="14" y1="90" x2="14" y2="8" stroke={ink} strokeOpacity=".35" />
          <line x1="14" y1="90" x2="106" y2="10" stroke={ink} strokeOpacity=".5" strokeDasharray="3 4" />
          <polyline points={pts.join(' ')} fill="none" stroke={GOLD} strokeWidth="3.5" strokeLinecap="round" />
          {[[0.06, 0.11], [0.26, 0.3], [0.6, 0.59], [0.94, 0.89]].map(([k, c]) => <circle key={k} cx={14 + k * 92} cy={90 - c * 80} r="4" fill={ink} />)}
        </svg>
      );
    }
    case 'commits': {
      // ten commits: the ten pips of the 10 of spades, as a branch that merges back
      const main = [10, 24, 38, 52, 66, 80, 94];
      return (
        <svg {...common}>
          <line x1="12" y1="50" x2="108" y2="50" stroke={ink} strokeWidth="2.4" />
          <path d="M38 50 C 46 22, 52 22, 58 22 L 74 22 C 82 22, 86 30, 94 50" fill="none" stroke={GOLD} strokeWidth="2.4" />
          {main.map((x) => <circle key={x} cx={x + 2} cy="50" r="5" fill={ink} />)}
          {[56, 70, 84].map((x, i) => <circle key={x} cx={x - (i === 2 ? 2 : 0)} cy={i === 2 ? 30 : 22} r="5" fill={GOLD} />)}
          <text x="60" y="84" textAnchor="middle" fontFamily="IBM Plex Mono, monospace" fontSize="10" fill={ink} fillOpacity=".6">1.48M commits</text>
        </svg>
      );
    }
    case 'agent': {
      const spokes = [[22, 22], [98, 22], [16, 64], [104, 64], [60, 94]];
      return (
        <svg {...common}>
          {spokes.map(([x, y]) => <line key={`${x}${y}`} x1="60" y1="50" x2={x} y2={y} stroke={ink} strokeOpacity=".4" strokeWidth="1.6" />)}
          {spokes.map(([x, y], i) => <rect key={i} x={x - 7} y={y - 7} width="14" height="14" rx="3" fill={i % 2 ? GOLD : ink} />)}
          <circle cx="60" cy="50" r="15" fill={ink} />
          <path d="M52 47 h16 M52 53 h10" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );
    }
    case 'wheel': {
      const segs = [];
      const N = 18;
      for (let i = 0; i < N; i++) {
        const a0 = (i / N) * Math.PI * 2, a1 = ((i + 1) / N) * Math.PI * 2;
        const r = 38, cx = 60, cy = 50;
        segs.push(<path key={i} d={`M${cx},${cy} L${cx + r * Math.cos(a0)},${cy + r * Math.sin(a0)} A${r},${r} 0 0 1 ${cx + r * Math.cos(a1)},${cy + r * Math.sin(a1)} Z`} fill={i === 0 ? '#2f8a4e' : i % 2 ? 'var(--pk-red)' : 'var(--pk-ink)'} />);
      }
      return (
        <svg {...common}>
          <circle cx="60" cy="50" r="44" fill={GOLD} />
          {segs}
          <circle cx="60" cy="50" r="17" fill="#3a2414" />
          <circle cx="60" cy="50" r="5" fill={GOLD} />
          <circle cx="86" cy="30" r="4" fill="#fff" />
        </svg>
      );
    }
    default:
      return null;
  }
}

// The back: a gold commit graph on card-room red (a nod to GitTimeline), with a TH medallion.
export function CardBack() {
  return (
    <svg viewBox="0 0 100 140" width="100%" height="100%" aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <pattern id="pk-commits" width="20" height="28" patternUnits="userSpaceOnUse">
          <line x1="5" y1="0" x2="5" y2="28" stroke={GOLD} strokeOpacity=".55" strokeWidth=".9" />
          <path d="M5 6 C 5 11, 15 11, 15 16 L 15 22 C 15 25, 5 25, 5 28" fill="none" stroke={GOLD} strokeOpacity=".45" strokeWidth=".9" />
          <circle cx="5" cy="4" r="1.6" fill={GOLD} fillOpacity=".8" />
          <circle cx="15" cy="17" r="1.6" fill={GOLD} fillOpacity=".8" />
        </pattern>
      </defs>
      <rect width="100" height="140" fill="#7a1517" />
      <rect x="0" y="0" width="100" height="140" fill="url(#pk-commits)" />
      <rect x="6" y="6" width="88" height="128" rx="5" fill="none" stroke={GOLD} strokeOpacity=".8" strokeWidth="1.2" />
      <circle cx="50" cy="70" r="17" fill="#7a1517" stroke={GOLD} strokeWidth="1.4" />
      <text x="50" y="76" textAnchor="middle" fontFamily="Fraunces, Georgia, serif" fontWeight="900" fontSize="16" fill="#f3e6c4">TH</text>
    </svg>
  );
}
