import CardArt, { CardBack, SuitIcon } from './CardArt';

// One playing card: a commit-graph back, and a face with real corner indices, the project's
// illustration, its name and its result. `faceUp` flips it; `glow` lights it at showdown.
export default function PlayingCard({ card, faceUp, glow, onOpen, compact }) {
  const red = card.suit === 'heart' || card.suit === 'diamond';
  const label = faceUp ? `${card.rank} of ${card.suit}s: ${card.title}. Open details.` : 'Face-down card';
  return (
    <button
      type="button"
      className={`pk-card${faceUp ? ' is-up' : ''}${glow ? ' is-glow' : ''}${compact ? ' is-compact' : ''}`}
      onClick={() => faceUp && onOpen && onOpen(card)}
      aria-label={label}
      tabIndex={faceUp ? 0 : -1}
    >
      <span className="pk-card-inner">
        <span className="pk-back"><CardBack /></span>
        <span className={`pk-face${red ? ' is-red' : ''}`}>
          <span className="pk-corner tl"><b>{card.rank}</b><SuitIcon suit={card.suit} size={12} /></span>
          <span className="pk-corner br"><b>{card.rank}</b><SuitIcon suit={card.suit} size={12} /></span>
          <span className="pk-art"><CardArt art={card.art} red={red} /></span>
          <span className="pk-title">{card.title}</span>
          {card.result ? (
            <span className="pk-result">{card.result}<small>{card.resultLabel}</small></span>
          ) : (
            <span className="pk-result is-line"><small>{card.line}</small></span>
          )}
        </span>
      </span>
    </button>
  );
}
