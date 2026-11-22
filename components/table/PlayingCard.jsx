import { CardBack, SuitIcon } from './CardArt';

// One playing card: an oxblood back, and a cream face printed like a real card: corner indices, a thin inner
// frame, one large suit pip, the name and a one-line subtitle. `faceUp` flips it; `glow` lifts it at showdown;
// `still` makes it decoration; `hero` is the large card in the page's opening, which leans toward the pointer
// and catches the light.
export default function PlayingCard({ card, faceUp, glow, onOpen, compact, still, hero }) {
  const red = card.suit === 'heart' || card.suit === 'diamond';
  const label = faceUp ? `${card.rank} of ${card.suit}s: ${card.title}. Open details.` : 'Face-down card';
  const Tag = still ? 'span' : 'button';
  return (
    <Tag
      type={still ? undefined : 'button'}
      className={`pk-card${faceUp ? ' is-up' : ''}${glow ? ' is-glow' : ''}${compact ? ' is-compact' : ''}${still ? ' is-still' : ''}${hero ? ' is-hero' : ''}`}
      onClick={still ? undefined : (e) => faceUp && onOpen && onOpen(card, e.currentTarget)}
      aria-label={still ? undefined : label}
      aria-hidden={still ? true : undefined}
      tabIndex={still ? undefined : faceUp ? 0 : -1}
    >
      <span className="pk-card-inner">
        <span className="pk-back"><CardBack /></span>
        <span className={`pk-face${red ? ' is-red' : ''}${card.rank === 'A' ? ' is-ace' : ''}`}>
          <span className="pk-corner tl"><b>{card.rank}</b><SuitIcon suit={card.suit} size={12} /></span>
          <span className="pk-corner br"><b>{card.rank}</b><SuitIcon suit={card.suit} size={12} /></span>
          <span className="pk-pip"><SuitIcon suit={card.suit} size={100} /></span>
          <span className="pk-title">{card.title}</span>
          {card.sub && <span className="pk-sub">{card.sub}</span>}
          {hero && <span className="pk-glare" />}
        </span>
      </span>
    </Tag>
  );
}
