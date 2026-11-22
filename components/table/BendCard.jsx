import { RANKS, rankOf, suitOf } from '../../lib/holdem';

// Playing cards for the table, printed like a real deck (corner indices, the standard pip layouts, framed
// court cards), and turned over the way a card really turns: it is cut into eight hinged strips, so while it
// flips it bends, the lifted edge leading and the rest following, then lies flat again.
//
// Each face and the back are drawn once as an SVG <symbol> (CardDefs); every strip of every card shows its
// slice of the symbol through its own viewBox. Card units: 250 x 350.

const W = 250, H = 350, N = 8, SW = W / N;
const INK = 'var(--card-ink)', RED = 'var(--card-red)';
const SUIT_PATHS = [
  'M50 5C30 30 5 45 5 62c0 16 17 24 31 18 6-3 10-8 11-12-1 12-7 22-15 27h36c-8-5-14-15-15-27 1 4 5 9 11 12 14 6 31-2 31-18 0-17-25-32-45-57z',
  'M50 92C20 70 4 52 4 32 4 16 16 6 30 6c10 0 17 6 20 14 3-8 10-14 20-14 14 0 26 10 26 26 0 20-16 38-46 60z',
  'M50 4l38 46-38 46-38-46z',
  'M50 10a18 18 0 0 1 14 29 18 18 0 1 1-10 30c1 11 6 19 14 26H32c8-7 13-15 14-26a18 18 0 1 1-10-30A18 18 0 0 1 50 10z',
];
const L = 80, M = 125, R = 170;
// the pip layouts of a standard deck, [x, y, upside-down]
const PIPS = {
  2: [[M, 80], [M, 270, 1]],
  3: [[M, 80], [M, 175], [M, 270, 1]],
  4: [[L, 80], [R, 80], [L, 270, 1], [R, 270, 1]],
  5: [[L, 80], [R, 80], [M, 175], [L, 270, 1], [R, 270, 1]],
  6: [[L, 80], [R, 80], [L, 175], [R, 175], [L, 270, 1], [R, 270, 1]],
  7: [[L, 80], [R, 80], [M, 128], [L, 175], [R, 175], [L, 270, 1], [R, 270, 1]],
  8: [[L, 80], [R, 80], [M, 128], [L, 175], [R, 175], [M, 222, 1], [L, 270, 1], [R, 270, 1]],
  9: [[L, 80], [R, 80], [L, 143], [R, 143], [M, 175], [L, 207, 1], [R, 207, 1], [L, 270, 1], [R, 270, 1]],
  10: [[L, 80], [R, 80], [M, 112], [L, 143], [R, 143], [L, 207, 1], [R, 207, 1], [M, 238, 1], [L, 270, 1], [R, 270, 1]],
};
const INDEX_FONT = "'Libre Caslon Text', Georgia, 'Times New Roman', serif";

function Pip({ suit, x, y, size, flip, color }) {
  const u = <use href={`#bcx-su${suit}`} x={x - size / 2} y={y - size / 2} width={size} height={size} style={{ fill: color }} />;
  return flip ? <g transform={`rotate(180 ${x} ${y})`}>{u}</g> : u;
}

function Face({ c }) {
  const r = rankOf(c), s = suitOf(c), label = RANKS[r];
  const color = s === 1 || s === 2 ? RED : INK;
  const corner = (
    <g>
      <text x="30" y="58" textAnchor="middle" style={{ font: `700 ${label === '10' ? 38 : 46}px ${INDEX_FONT}`, fill: color, letterSpacing: label === '10' ? '-3px' : 0 }}>{label}</text>
      <Pip suit={s} x={30} y={84} size={26} color={color} />
    </g>
  );
  let middle;
  if (r === 12) middle = <Pip suit={s} x={125} y={175} size={s === 0 ? 130 : 108} color={color} />;
  else if (r >= 9) {
    middle = (
      <g>
        <rect x="56" y="48" width="138" height="254" rx="10" style={{ fill: color, fillOpacity: 0.07, stroke: color, strokeWidth: 2.5 }} />
        <rect x="63" y="55" width="124" height="240" rx="6" style={{ fill: 'none', stroke: color, strokeOpacity: 0.45, strokeWidth: 1 }} />
        <Pip suit={s} x={125} y={92} size={38} color={color} />
        <text x="125" y="211" textAnchor="middle" style={{ font: `700 104px ${INDEX_FONT}`, fill: color }}>{label}</text>
        <Pip suit={s} x={125} y={258} size={38} color={color} flip />
      </g>
    );
  } else middle = <g>{PIPS[r + 2].map(([x, y, f], i) => <Pip key={i} suit={s} x={x} y={y} size={44} flip={!!f} color={color} />)}</g>;
  return (
    <symbol id={`bcx-${c}`} viewBox={`0 0 ${W} ${H}`}>
      <rect x="1.5" y="1.5" width="247" height="347" rx="17" style={{ fill: 'var(--card-face)', stroke: 'rgba(23, 21, 15, .32)', strokeWidth: 2 }} />
      {corner}
      <g transform={`rotate(180 ${W / 2} ${H / 2})`}>{corner}</g>
      {middle}
    </symbol>
  );
}

// The suits, the back and the faces of the cards on the table, defined once for every card to show.
export function CardDefs({ cards }) {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        {SUIT_PATHS.map((d, i) => <symbol key={i} id={`bcx-su${i}`} viewBox="0 0 100 100"><path d={d} /></symbol>)}
        <pattern id="bcx-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="9" style={{ stroke: '#2b0a0f', strokeWidth: 2.2 }} />
        </pattern>
        <symbol id="bcx-back" viewBox={`0 0 ${W} ${H}`}>
          <rect x="1.5" y="1.5" width="247" height="347" rx="17" style={{ fill: 'var(--card-face)', stroke: 'rgba(23, 21, 15, .32)', strokeWidth: 2 }} />
          <rect x="13" y="13" width="224" height="324" rx="9" style={{ fill: 'var(--back)' }} />
          <rect x="13" y="13" width="224" height="324" rx="9" style={{ fill: 'url(#bcx-hatch)', opacity: 0.6 }} />
          <rect x="24" y="24" width="202" height="302" rx="5" style={{ fill: 'none', stroke: 'var(--card-face)', strokeOpacity: 0.4, strokeWidth: 1.5 }} />
          <path d="M125 128 L161 175 L125 222 L89 175 Z" style={{ fill: 'var(--back)', stroke: 'var(--card-face)', strokeOpacity: 0.75, strokeWidth: 2 }} />
          <use href="#bcx-su0" x="108" y="158" width="34" height="34" style={{ fill: 'var(--card-face)', opacity: 0.85 }} />
        </symbol>
        {[...new Set(cards)].map((c) => <Face key={c} c={c} />)}
      </defs>
    </svg>
  );
}

function Strip({ i, c }) {
  return (
    <span className="bc-s">
      <svg className="bc-b" viewBox={`${i * SW} 0 ${SW} ${H}`} preserveAspectRatio="none" aria-hidden="true"><use href="#bcx-back" width={W} height={H} /></svg>
      <svg className="bc-f" viewBox={`${(N - 1 - i) * SW} 0 ${SW} ${H}`} preserveAspectRatio="none" aria-hidden="true"><use href={`#bcx-${c}`} width={W} height={H} /></svg>
      {i < N - 1 && <Strip i={i + 1} c={c} />}
    </span>
  );
}

// One card on the felt. `up` turns it face up (with the bend); `win` and `dim` mark it at showdown.
export default function BendCard({ c, up, win, dim, label }) {
  return (
    <span className={`bc${up ? ' is-up' : ''}${win ? ' is-win' : ''}${dim ? ' is-dim' : ''}`} role="img" aria-label={up ? label : 'A card, face down'}>
      <span className="bc-shade" aria-hidden="true" />
      <span className="bc-turn"><Strip i={0} c={c} /></span>
    </span>
  );
}
