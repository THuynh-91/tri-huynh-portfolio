import { useEffect, useRef, useState } from 'react';

// An easter egg: wherever the page prints 67%, the 6 and the 7 go up and down in turn, like the hands in the
// "six seven" meme. Hover, focus or tap a 67 to set it off; on the table, odds that land on 67% do it once
// by themselves. Any other number prints as it is.
export function SixSeven({ auto = false }) {
  const [go, setGo] = useState(0);
  const still = useRef(false);
  useEffect(() => {
    still.current = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (auto && !still.current) setGo(1);
  }, [auto]);
  const play = () => { if (!still.current) setGo((n) => n + 1); };
  return (
    <span className={`pk-67${go ? ' is-go' : ''}`} onPointerEnter={play} onClick={play} onFocus={play} aria-label="67">
      <i key={`a${go}`} aria-hidden="true">6</i><i key={`b${go}`} aria-hidden="true">7</i>
    </span>
  );
}

// a percentage, with the 67 egg when it is 67
export default function Pct({ value, auto = false }) {
  const v = Math.round(value);
  return v === 67 ? <><SixSeven auto={auto} />%</> : <>{v}%</>;
}
