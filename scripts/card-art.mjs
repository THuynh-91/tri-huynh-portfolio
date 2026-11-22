// Generates data/card-art.json: the card drawings as fixed SVG paths (roughjs, seeded), so the server and
// every browser serve the same lines and the page ships no drawing library.
// usage: node scripts/card-art.mjs
import fs from 'node:fs';
import rough from 'roughjs';

// Card faces drawn the way a pen draws them: wobbly strokes and hatched fills (roughjs, seeded, so the
// server and the browser draw exactly the same lines). Ink and card red come from CSS variables.
const INK = 'var(--card-ink)';
const RED = 'var(--card-red)';
const gen = rough.generator();
const BASE = { roughness: 1.35, bowing: 1.2, strokeWidth: 1.7, hachureGap: 4.2, fillWeight: 1.1, stroke: INK };

function draw(seed, shapes) {
  return shapes.flatMap(([fn, args, opts = {}], i) => gen.toPaths(gen[fn](...args, { ...BASE, seed: seed + i * 7, ...opts })));
}

const sig = (z) => 1 / (1 + Math.exp(-z));
const squeeze = (() => {
  const pts = [];
  for (let p = 0.05; p <= 0.951; p += 0.05) pts.push([18 + p * 86, 88 - sig(0.0127 + 0.7698 * Math.log(p / (1 - p))) * 76]);
  return pts;
})();

const ART = {
  // A♠ the co-op: an agent at the hub, wired to its tools
  agent: draw(11, [
    ['line', [60, 50, 22, 20]], ['line', [60, 50, 98, 20]], ['line', [60, 50, 20, 80]], ['line', [60, 50, 100, 80]],
    ['rectangle', [12, 11, 20, 18], { fill: INK, fillStyle: 'hachure' }],
    ['rectangle', [88, 11, 20, 18], { fill: RED, fillStyle: 'cross-hatch', stroke: RED }],
    ['rectangle', [10, 71, 20, 18], { fill: INK, fillStyle: 'hachure' }],
    ['rectangle', [90, 71, 20, 18], { fill: INK, fillStyle: 'hachure' }],
    ['circle', [60, 50, 36], { fill: INK, fillStyle: 'solid', strokeWidth: 2 }],
  ]),
  // K♠ the school: a mortarboard with its tassel
  cap: draw(23, [
    ['path', ['M38 50 L38 70 Q60 82 82 70 L82 50'], { fill: INK, fillStyle: 'hachure' }],
    ['polygon', [[[14, 42], [60, 20], [106, 42], [60, 62]]], { fill: INK, fillStyle: 'solid', strokeWidth: 2 }],
    ['line', [60, 41, 94, 48], { stroke: RED, strokeWidth: 2 }],
    ['line', [94, 48, 94, 72], { stroke: RED, strokeWidth: 2 }],
    ['ellipse', [94, 76, 9, 12], { fill: RED, fillStyle: 'solid', stroke: RED }],
  ]),
  // Q♠ CruxPack: lecture pages becoming a card
  pages: draw(37, [
    ['polygon', [[[22, 26], [62, 18], [72, 78], [32, 86]]]],
    ['polygon', [[[34, 18], [76, 18], [76, 80], [34, 80]]], { fill: 'var(--card-face)', fillStyle: 'solid' }],
    ['line', [42, 30, 68, 30]], ['line', [42, 40, 68, 40]], ['line', [42, 50, 62, 50]], ['line', [42, 60, 66, 60]],
    ['rectangle', [70, 46, 36, 26], { fill: RED, fillStyle: 'hachure', stroke: RED, strokeWidth: 2 }],
  ]),
  // J♠ Predictions Cup: the paper's squeeze, prices bent toward 50%
  chart: draw(53, [
    ['line', [18, 88, 106, 88]], ['line', [18, 88, 18, 10]],
    ['line', [18, 88, 104, 12], { strokeLineDash: [4, 5], strokeWidth: 1.2, roughness: 0.8 }],
    ['curve', [squeeze], { stroke: RED, strokeWidth: 2.6 }],
    ['circle', [28, 77, 7], { fill: INK, fillStyle: 'solid' }], ['circle', [50, 55, 7], { fill: INK, fillStyle: 'solid' }],
    ['circle', [74, 37, 7], { fill: INK, fillStyle: 'solid' }], ['circle', [96, 18, 7], { fill: INK, fillStyle: 'solid' }],
  ]),
  // 10♠ GitTimeline: a main line, a branch that splits off and merges back
  commits: draw(71, [
    ['line', [8, 62, 112, 62], { strokeWidth: 2.2 }],
    ['path', ['M30 62 C 40 30, 48 28, 58 28 L 74 28 C 86 28, 90 40, 96 62'], { stroke: RED, strokeWidth: 2 }],
    ...[14, 30, 46, 96, 108].map((x) => ['circle', [x, 62, 9], { fill: INK, fillStyle: 'solid' }]),
    ...[[58, 28], [74, 28]].map(([x, y]) => ['circle', [x, y, 9], { fill: RED, fillStyle: 'solid', stroke: RED }]),
    ['circle', [96, 62, 13], { strokeWidth: 1.4 }],
  ]),
  // 6♦ Games: a roulette wheel
  wheel: draw(89, [
    ['circle', [60, 50, 84], { strokeWidth: 2 }],
    ...Array.from({ length: 12 }, (_, i) => {
      const a = (i / 12) * Math.PI * 2;
      return ['line', [60 + Math.cos(a) * 15, 50 + Math.sin(a) * 15, 60 + Math.cos(a) * 41, 50 + Math.sin(a) * 41], { strokeWidth: 1.3 }];
    }),
    ['circle', [60, 50, 64], { strokeWidth: 1.2 }],
    ['circle', [60, 50, 28], { fill: INK, fillStyle: 'cross-hatch' }],
    ['circle', [86, 24, 9], { fill: RED, fillStyle: 'solid', stroke: RED }],
  ]),
  // 3♣ More builds: a chip
  chip: draw(97, [
    ...[38, 50, 62, 74].flatMap((v) => [['line', [v + 4, 14, v + 4, 26]], ['line', [v + 4, 74, v + 4, 86]], ['line', [24, v - 4, 36, v - 4]], ['line', [84, v - 4, 96, v - 4]]]),
    ['rectangle', [36, 26, 48, 48], { fill: INK, fillStyle: 'hachure', strokeWidth: 2 }],
    ['rectangle', [48, 38, 24, 24], { fill: RED, fillStyle: 'solid', stroke: RED }],
  ]),
};


const round = (d) => d.replace(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi, (n) => String(Math.round(parseFloat(n) * 100) / 100));
const out = Object.fromEntries(Object.entries(ART).map(([k, paths]) => [k, paths.map((p) => ({ d: round(p.d), s: p.stroke, w: p.strokeWidth, f: p.fill && p.fill !== 'none' ? p.fill : undefined }))]));
fs.writeFileSync('data/card-art.json', `${JSON.stringify(out)}\n`);
console.log('card-art.json:', Object.keys(out).length, 'drawings,', Object.values(out).reduce((n, a) => n + a.length, 0), 'paths,', fs.statSync('data/card-art.json').size, 'bytes');
