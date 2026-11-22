// The suits, drawn as one path each, and the card back. Ink and card red come from CSS variables.
export function SuitIcon({ suit, size = 16, color }) {
  const fill = color || (suit === 'heart' || suit === 'diamond' ? 'var(--card-red)' : 'var(--card-ink)');
  const paths = {
    spade: 'M50 5C30 30 5 45 5 62c0 16 17 24 31 18 6-3 10-8 11-12-1 12-7 22-15 27h36c-8-5-14-15-15-27 1 4 5 9 11 12 14 6 31-2 31-18 0-17-25-32-45-57z',
    heart: 'M50 92C20 70 4 52 4 32 4 16 16 6 30 6c10 0 17 6 20 14 3-8 10-14 20-14 14 0 26 10 26 26 0 20-16 38-46 60z',
    diamond: 'M50 4l38 46-38 46-38-46z',
    club: 'M50 10a18 18 0 0 1 14 29 18 18 0 1 1-10 30c1 11 6 19 14 26H32c8-7 13-15 14-26a18 18 0 1 1-10-30A18 18 0 0 1 50 10z',
  };
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} aria-hidden="true" style={{ display: 'block' }}>
      <path d={paths[suit]} style={{ fill }} />
    </svg>
  );
}

// The back: oxblood, cross-hatched like a printed card, with a vermilion seal.
export function CardBack() {
  return (
    <svg viewBox="0 0 100 140" width="100%" height="100%" aria-hidden="true" preserveAspectRatio="none">
      <defs>
        <pattern id="pk-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" style={{ stroke: '#2b0a0f', strokeWidth: 1.4 }} />
        </pattern>
      </defs>
      <rect width="100" height="140" style={{ fill: 'var(--back)' }} />
      <rect x="7" y="7" width="86" height="126" style={{ fill: 'url(#pk-hatch)', opacity: 0.55 }} />
      <rect x="7" y="7" width="86" height="126" style={{ fill: 'none', stroke: 'var(--card-face)', strokeOpacity: 0.45, strokeWidth: 1 }} />
      <g transform="rotate(-6 50 70)">
        <rect x="34" y="54" width="32" height="32" rx="3" style={{ fill: 'var(--card-face)', stroke: 'var(--seal)', strokeWidth: 3 }} />
        <text x="50" y="76" textAnchor="middle" style={{ font: "400 15px 'Dela Gothic One', sans-serif", fill: 'var(--seal)' }}>TH</text>
      </g>
    </svg>
  );
}
