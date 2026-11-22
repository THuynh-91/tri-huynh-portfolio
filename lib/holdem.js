// Heads-up Texas hold'em, small and exact: a deck, a 7-card hand evaluator that also returns the five cards
// that make the hand, and the odds of each player winning from any street (exact from the flop on, a large
// random sample before it).
//
// A card is an integer 0..51: rank = c % 13 (0 is a two, 12 an ace), suit = (c / 13) | 0 (0 spades, 1 hearts,
// 2 diamonds, 3 clubs).

export const RANKS = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
export const SUITS = ['♠', '♥', '♦', '♣'];
export const SUIT_NAMES = ['spade', 'heart', 'diamond', 'club'];
const WORD = ['two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'jack', 'queen', 'king', 'ace'];
const PLURAL = ['twos', 'threes', 'fours', 'fives', 'sixes', 'sevens', 'eights', 'nines', 'tens', 'jacks', 'queens', 'kings', 'aces'];

export const rankOf = (c) => c % 13;
export const suitOf = (c) => (c / 13) | 0;
export const cardText = (c) => `${RANKS[rankOf(c)]}${SUITS[suitOf(c)]}`;
export const card = (text) => {
  const r = RANKS.indexOf(text.slice(0, -1));
  const s = SUITS.indexOf(text.slice(-1));
  if (r < 0 || s < 0) throw new Error(`bad card ${text}`);
  return s * 13 + r;
};

// A fair shuffle of every card not in `out`, from the browser's (or Node's) cryptographic random source.
export function shuffled(out = []) {
  const skip = new Set(out);
  const d = [];
  for (let c = 0; c < 52; c++) if (!skip.has(c)) d.push(c);
  const rnd = new Uint32Array(d.length);
  globalThis.crypto.getRandomValues(rnd);
  for (let i = d.length - 1; i > 0; i--) {
    const j = rnd[i] % (i + 1);
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

// the highest straight in a 13-bit rank mask (bit r set = rank r present), as its top rank, or -1. A-2-3-4-5
// counts, with the five as its top card.
function straightTop(mask) {
  for (let top = 12; top >= 4; top--) {
    const need = 0b11111 << (top - 4);
    if ((mask & need) === need) return top;
  }
  return (mask & 0b1000000001111) === 0b1000000001111 ? 3 : -1;
}

const CAT = ['High card', 'Pair', 'Two pair', 'Three of a kind', 'Straight', 'Flush', 'Full house', 'Four of a kind', 'Straight flush'];

// Best five of up to seven cards. Returns { score, cat, ranks, five }: a larger score is a better hand; `ranks`
// are the ranks that decide it, in order; `five` are the cards that make it.
export function evaluate(cards) {
  const byRank = Array.from({ length: 13 }, () => []);
  const bySuit = [[], [], [], []];
  let mask = 0;
  for (const c of cards) {
    byRank[rankOf(c)].push(c);
    bySuit[suitOf(c)].push(c);
    mask |= 1 << rankOf(c);
  }
  const pack = (cat, ranks, five) => {
    let score = cat;
    for (let i = 0; i < 5; i++) score = score * 13 + (ranks[i] ?? 0);
    return { score, cat, ranks, five };
  };
  const desc = (list) => [...list].sort((a, b) => rankOf(b) - rankOf(a));
  const run = (top, pool) => {
    const ranks = top === 3 ? [3, 2, 1, 0, 12] : [top, top - 1, top - 2, top - 3, top - 4];
    return ranks.map((r) => pool.find((c) => rankOf(c) === r));
  };

  // straight flush, flush
  const fs = bySuit.find((s) => s.length >= 5);
  if (fs) {
    let fmask = 0;
    for (const c of fs) fmask |= 1 << rankOf(c);
    const top = straightTop(fmask);
    if (top >= 0) return pack(8, [top], run(top, fs));
  }
  const groups = byRank.map((list, r) => ({ r, n: list.length })).filter((g) => g.n).sort((a, b) => b.n - a.n || b.r - a.r);
  const kick = (used, k) => desc(cards.filter((c) => !used.includes(rankOf(c)))).slice(0, k);
  if (groups[0].n === 4) {
    const k = kick([groups[0].r], 1);
    return pack(7, [groups[0].r, rankOf(k[0])], [...byRank[groups[0].r], ...k]);
  }
  if (groups[0].n === 3 && groups[1] && groups[1].n >= 2) {
    return pack(6, [groups[0].r, groups[1].r], [...byRank[groups[0].r], ...byRank[groups[1].r].slice(0, 2)]);
  }
  if (fs) {
    const five = desc(fs).slice(0, 5);
    return pack(5, five.map(rankOf), five);
  }
  const top = straightTop(mask);
  if (top >= 0) return pack(4, [top], run(top, cards));
  if (groups[0].n === 3) {
    const k = kick([groups[0].r], 2);
    return pack(3, [groups[0].r, ...k.map(rankOf)], [...byRank[groups[0].r], ...k]);
  }
  if (groups[0].n === 2 && groups[1] && groups[1].n === 2) {
    const k = kick([groups[0].r, groups[1].r], 1);
    return pack(2, [groups[0].r, groups[1].r, rankOf(k[0])], [...byRank[groups[0].r], ...byRank[groups[1].r], ...k]);
  }
  if (groups[0].n === 2) {
    const k = kick([groups[0].r], 3);
    return pack(1, [groups[0].r, ...k.map(rankOf)], [...byRank[groups[0].r], ...k]);
  }
  const five = desc(cards).slice(0, 5);
  return pack(0, five.map(rankOf), five);
}

// The hand in words, the way a dealer says it.
export function handName(h) {
  const [a, b] = h.ranks;
  switch (h.cat) {
    case 8: return a === 12 ? 'a royal flush' : `a straight flush, ${WORD[a]} high`;
    case 7: return `four ${PLURAL[a]}`;
    case 6: return `a full house, ${PLURAL[a]} full of ${PLURAL[b]}`;
    case 5: return `a flush, ${WORD[a]} high`;
    case 4: return `a straight, ${WORD[a]} high`;
    case 3: return `three ${PLURAL[a]}`;
    case 2: return `two pair, ${PLURAL[a]} and ${PLURAL[b]}`;
    case 1: return `a pair of ${PLURAL[a]}`;
    default: return `${WORD[a]} high`;
  }
}
export const categoryName = (h) => CAT[h.cat];

// Who wins each way the board can still come out: { a, b, tie } as fractions. Exact when two or fewer board
// cards are still to come (at most 990 boards); before the flop, `samples` random boards.
export function odds(holeA, holeB, board, samples = 15000) {
  const known = [...holeA, ...holeB, ...board];
  const rest = shuffled(known);
  const need = 5 - board.length;
  let a = 0, b = 0, t = 0, n = 0;
  const score = (extra) => {
    const sa = evaluate([...holeA, ...board, ...extra]).score;
    const sb = evaluate([...holeB, ...board, ...extra]).score;
    if (sa > sb) a++; else if (sb > sa) b++; else t++;
    n++;
  };
  if (need === 0) score([]);
  else if (need === 1) for (const x of rest) score([x]);
  else if (need === 2) for (let i = 0; i < rest.length; i++) for (let j = i + 1; j < rest.length; j++) score([rest[i], rest[j]]);
  else {
    // a fast generator for the sampling (xorshift32, seeded from the crypto source); the deal itself is crypto
    const seed = new Uint32Array(1);
    globalThis.crypto.getRandomValues(seed);
    let x = seed[0] || 0x9e3779b9;
    const next = () => { x ^= x << 13; x >>>= 0; x ^= x >>> 17; x ^= x << 5; x >>>= 0; return x; };
    const pick = new Array(need);
    for (let s = 0; s < samples; s++) {
      // a partial shuffle of `rest` draws `need` distinct cards
      for (let k = 0; k < need; k++) {
        const j = k + (next() % (rest.length - k));
        [rest[k], rest[j]] = [rest[j], rest[k]];
        pick[k] = rest[k];
      }
      score(pick);
    }
  }
  return { a: a / n, b: b / n, tie: t / n, n };
}
