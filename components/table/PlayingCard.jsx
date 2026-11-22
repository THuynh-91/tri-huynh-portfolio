import CardArt, { CardBack, SuitIcon } from './CardArt';

// One playing card: an oxblood back, and a cream face with real corner indices, an inner frame line,
// a pen drawing and the name. `faceUp` flips it; `glow` lifts it at showdown; `still` makes it decoration.
export default function PlayingCard({ card, faceUp, glow, onOpen, compact, still }) {
  const red = card.suit === 'heart' || card.suit === 'diamond';
  const label = faceUp ? `${card.rank} of ${card.suit}s: ${card.title}. Open details.` : 'Face-down card';
  const Tag = still ? 'span' : 'button';
  return (
    <Tag
      type={still ? undefined : 'button'}
      className={`pk-card${faceUp ? ' is-up' : ''}${glow ? ' is-glow' : ''}${compact ? ' is-compact' : ''}${still ? ' is-still' : ''}`}
      onClick={still ? undefined : (e) => faceUp && onOpen && onOpen(card, e.currentTarget)}
      aria-label={still ? undefined : label}
      aria-hidden={still ? true : undefined}
      tabIndex={still ? undefined : faceUp ? 0 : -1}
    >
      <span className="pk-card-inner">
        <span className="pk-back"><CardBack /></span>
        <span className={`pk-face${red ? ' is-red' : ''}`}>
          <span className="pk-corner tl"><b>{card.rank}</b><SuitIcon suit={card.suit} size={12} /></span>
          <span className="pk-corner br"><b>{card.rank}</b><SuitIcon suit={card.suit} size={12} /></span>
          <span className="pk-art"><CardArt art={card.art} /></span>
          <span className="pk-title">{card.title}</span>
        </span>
      </span>
    </Tag>
  );
}
