# Tri Huynh — Portfolio

A personal site built as a dark card room: the work is dealt as a hand of hold'em, and the centrepiece is a
real heads-up hand you can play. Next.js 15, React 19 and Framer Motion, exported statically to GitHub Pages.

**Live:** https://thuynh-91.github.io/tri-huynh-portfolio/

## What's on the page

- **The opening:** school, graduation, most recent role and what I'm looking for, with my two hole cards
  (A♠ Northeastern, K♠ Biogen).
- **Play a hand:** heads-up against me. I hold A♠ K♠ every hand; you get two random cards and deal the
  board. Each seat's chance of winning is worked out on every street (exact from the flop on, a
  15,000-board sample before it) and shown broadcast style. Cards bend as they turn over; at showdown the
  winning five are lit and the score is kept. Click the deck to shuffle.
- **Projects:** CruxPack, with real cards from a shared pack to flip and their cited source page; the
  Predictions Cup trading system, with the price feed it recorded (every race, contest price against
  Kalshi's, hour by hour); GitTimeline, with a recording of Linux's history playing.
- **Tech stack, experience, more projects, contact.**
- A top bar that turns over a card for each section as you read.

## Tech stack

| Layer       | Tools                                                     |
| ----------- | --------------------------------------------------------- |
| Framework   | Next.js 15 (static export)                                |
| UI          | React 19                                                  |
| Animation   | Framer Motion 11, CSS 3D (registered custom properties)   |
| Poker       | `lib/holdem.js`: deck, 7-card evaluator, exact/sampled odds |
| Fonts       | Dela Gothic One · Zen Kaku Gothic New · Libre Caslon Text |
| Deployment  | GitHub Pages                                              |

## Getting started

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # static export to ./out
```

## Editing content

- **The hand, profile, stack and contact** — `data/hand.js`
- **Project details and side projects** — `data/projects.json`
- **The trading system's price feed** — `public/data/cup-vs-kalshi.json`
- **Resume** — `public/Resume_Tri_Huynh.pdf`

## Project structure

```
components/table/  # the table, cards (BendCard, PlayingCard), CruxPack deck, price chart, top bar
lib/               # holdem.js
pages/             # _app, _document, index (the site), classic (the previous design)
data/              # hand.js, projects.json
public/            # images, card captures, price feed, resume, favicon
styles/            # poker.css (the site), globals.css
```

## Author

**Tri Huynh** — Computer Science at Northeastern (Khoury), graduating May 2027
[GitHub](https://github.com/THuynh-91) · [LinkedIn](https://www.linkedin.com/in/tri-huynh-ai) · triqhuynh91@gmail.com
