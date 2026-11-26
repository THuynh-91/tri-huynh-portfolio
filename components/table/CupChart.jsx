import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

// What the trading system watched: every race in the Predictions Cup, hour by hour from Oct 16 to the evening
// of Nov 3 (it stops before the polls closed: after that the contest froze while Kalshi settled), the
// contest's price against Kalshi's real-money price for the same outcome (both as the chance the Democrat
// wins). Each dot is a race: across, Kalshi's price; up or down, how far the contest's price sat from it, in
// points. Long shots sit above the line and favourites below it: the contest's prices were squeezed toward
// 50%, the gap the system traded. Recorded by the system itself (public/data/cup-vs-kalshi.json).
// Press play to run the three weeks; drag to any hour; hover a dot for the race.
const S = 400, H = 330, PAD = { l: 44, r: 14, t: 14, b: 40 }, G = 150; // G: the gap axis runs -15..+15 points (tenths)
const X = (p) => PAD.l + (p / 1000) * (S - PAD.l - PAD.r);
const Y = (gap) => PAD.t + ((G - Math.max(-G, Math.min(G, gap))) / (2 * G)) * (H - PAD.t - PAD.b);
const fmtWhen = (t) => new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', month: 'short', day: 'numeric', hour: 'numeric' }).format(new Date(t * 1000)).replace(',', ' ·') + ' ET';
const pctText = (v) => `${Math.round(v / 10)}%`;

export default function CupChart({ basePath = '' }) {
  const box = useRef(null);
  const [data, setData] = useState(null);
  const [pos, setPos] = useState(null); // fractional frame
  const [playing, setPlaying] = useState(false);
  const [hover, setHover] = useState(null);
  const raf = useRef(0);

  // fetched when it comes near the screen, so the page never waits for it
  useEffect(() => {
    const el = box.current;
    if (!el) return undefined;
    let done = false;
    const load = () => {
      if (done) return;
      done = true;
      fetch(`${basePath}/data/cup-vs-kalshi.json`).then((r) => r.json()).then((d) => {
        setData(d);
        // open on the first recorded hour, so Play runs the whole three weeks
        setPos(0);
      }).catch(() => {});
    };
    if (typeof IntersectionObserver === 'undefined') { load(); return undefined; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { load(); io.disconnect(); } }, { rootMargin: '400px' });
    io.observe(el);
    return () => io.disconnect();
  }, [basePath]);

  const last = data ? data.t.length - 1 : 0;
  // play: about 14 seconds for the three weeks
  useEffect(() => {
    if (!playing || !data) return undefined;
    let prev = performance.now();
    const step = (now) => {
      // A frame's timestamp can be a little earlier than the performance.now() taken before it, so the first step
      // could go backwards: from hour 0 (Replay) that made the position negative and the chart read hour -1.
      const dt = Math.max(0, now - prev); prev = Math.max(prev, now);
      setPos((p) => Math.max(0, Math.min(last, (p ?? 0) + dt / 120)));
      raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf.current);
  }, [playing, data, last]);

  // stop at the end (outside the position's updater, which React may call twice)
  useEffect(() => {
    if (playing && data && pos !== null && pos >= last) setPlaying(false);
  }, [playing, data, pos, last]);

  const play = () => {
    if (!data) return;
    if (playing) { setPlaying(false); return; }
    if ((pos ?? 0) >= last) setPos(0);
    setPlaying(true);
  };

  // the races at this (fractional) hour, eased between the recorded hours
  const races = useMemo(() => {
    if (!data || pos === null) return [];
    // every frame index stays inside the recorded hours, whatever the position
    const p = Math.max(0, Math.min(last, Number(pos) || 0));
    const a = Math.floor(p), b = Math.min(last, a + 1), f = p - a;
    const at = (arr, i) => (arr[a][i] === null || arr[b][i] === null ? arr[a][i] : arr[a][i] + (arr[b][i] - arr[a][i]) * f);
    return data.names.map((name, i) => ({ i, name, cup: at(data.cup, i), kal: at(data.kalshi, i) })).filter((r) => r.cup !== null && r.kal !== null);
  }, [data, pos, last]);
  const widest = useMemo(() => races.reduce((m, r) => (!m || Math.abs(r.cup - r.kal) > Math.abs(m.cup - m.kal) ? r : m), null), [races]);
  const meanGap = races.length ? races.reduce((s, r) => s + Math.abs(r.cup - r.kal), 0) / races.length / 10 : 0;
  const shown = hover !== null ? races.find((r) => r.i === hover) : null;
  const when = data && pos !== null ? fmtWhen(data.t[Math.max(0, Math.min(last, Math.round(Number(pos) || 0)))]) : '';

  const scrub = useCallback((e) => { setPlaying(false); setPos(Number(e.target.value)); }, []);

  return (
    <figure className="pk-media is-cup" ref={box} aria-label="The contest's price against Kalshi's for every race, Oct 16 to Nov 3, 2026">
      <div className="cup-head">
        <span>{data ? `${data.names.length} races` : 'The races'} · contest price vs. real money</span>
        <span className="cup-when">{when}</span>
      </div>
      <svg className="cup-plot" viewBox={`0 0 ${S} ${H}`} role="img" aria-label={widest ? `At ${when}, the widest gap is ${widest.name}: contest ${pctText(widest.cup)}, Kalshi ${pctText(widest.kal)}.` : 'Loading the recorded prices'}>
        {[0, 250, 500, 750, 1000].map((v) => (
          <g key={`x${v}`}>
            <line className="cup-grid" x1={X(v)} x2={X(v)} y1={Y(G)} y2={Y(-G)} />
            <text className="cup-tick" x={X(v)} y={Y(-G) + 17} textAnchor="middle">{v / 10}%</text>
          </g>
        ))}
        {[-100, -50, 50, 100].map((v) => (
          <g key={`y${v}`}>
            <line className="cup-grid" x1={X(0)} x2={X(1000)} y1={Y(v)} y2={Y(v)} />
            <text className="cup-tick" x={X(0) - 8} y={Y(v) + 4} textAnchor="end">{v > 0 ? '+' : '−'}{Math.abs(v / 10)}</text>
          </g>
        ))}
        <line className="cup-same" x1={X(0)} y1={Y(0)} x2={X(1000)} y2={Y(0)} />
        <text className="cup-tick" x={X(0) - 8} y={Y(0) + 4} textAnchor="end">0</text>
        <text className="cup-same-k" x={X(1000)} y={Y(G) + 12} textAnchor="end">contest dearer</text>
        <text className="cup-same-k" x={X(1000)} y={Y(-G) - 6} textAnchor="end">contest cheaper</text>
        <text className="cup-axis" x={(X(0) + X(1000)) / 2} y={H - 6} textAnchor="middle">Kalshi, real money (chance the Democrat wins)</text>
        <text className="cup-axis" transform={`translate(11 ${(Y(G) + Y(-G)) / 2}) rotate(-90)`} textAnchor="middle">contest minus Kalshi, points</text>
        {races.map((r) => (
          <g key={r.i} className={`cup-race${hover === r.i ? ' is-on' : ''}${widest && widest.i === r.i ? ' is-wide' : ''}`}
            onPointerEnter={() => setHover(r.i)} onPointerLeave={() => setHover((h) => (h === r.i ? null : h))}>
            <line className="cup-gap" x1={X(r.kal)} y1={Y(0)} x2={X(r.kal)} y2={Y(r.cup - r.kal)} />
            <circle className="cup-dot" cx={X(r.kal)} cy={Y(r.cup - r.kal)} r={hover === r.i ? 6 : 3.6} />
            <circle className="cup-hit" cx={X(r.kal)} cy={Y(r.cup - r.kal)} r="9" />
          </g>
        ))}
      </svg>
      <div className="cup-ctrl">
        <button type="button" className="cup-play" onClick={play} disabled={!data} aria-label={playing ? 'Pause' : 'Play the three weeks'}>{playing ? 'Pause' : (pos ?? 0) >= last ? 'Replay' : 'Play'}</button>
        <input type="range" min="0" max={last} step="0.01" value={pos ?? 0} onChange={scrub} disabled={!data} aria-label="Hour" />
      </div>
      <p className="cup-read">
        {shown
          ? <><b>{shown.name}</b>: contest {pctText(shown.cup)}, Kalshi {pctText(shown.kal)}, a {Math.abs(Math.round((shown.cup - shown.kal) / 10))}-point gap.</>
          : widest
            ? <>Widest gap now: <b>{widest.name}</b>, contest {pctText(widest.cup)} vs. Kalshi {pctText(widest.kal)}. Average gap {meanGap.toFixed(1)} points.</>
            : 'Loading the recorded prices…'}
      </p>
    </figure>
  );
}
