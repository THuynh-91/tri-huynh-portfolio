import { useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { Bubble, TN } from './Ink';
import { thump } from './fx';

const TOC = [
  ['1', 'The Agent', 'Biogen', '#ch1', 3],
  ['2', 'The Pack', 'CruxPack', '#ch2', 6],
  ['3', 'Ten Times Behind', 'Predictions Cup', '#ch3', 9],
  ['4', '1.48 Million Commits', 'GitTimeline', '#ch4', 12],
  ['★', 'Side Stories', '14 more', '#extras', 15],
];

// The cover: a frame from the owner's own Blender fight shot (it is already paper, ink and red).
// Clicking it plays the shot.
export default function Cover() {
  const { basePath } = useRouter();
  const vid = useRef(null);
  const [playing, setPlaying] = useState(false);
  const play = () => {
    const v = vid.current;
    if (!v) return;
    if (playing) { v.pause(); v.currentTime = 0; setPlaying(false); return; }
    v.currentTime = 0;
    v.play().then(() => { setPlaying(true); thump(1); }).catch(() => setPlaying(false));
  };
  return (
    <section className="ink-cover" aria-labelledby="ink-name">
      <div className="ink-cover-art">
        <video
          ref={vid}
          src={`${basePath}/media/charge-blast.mp4`}
          poster={`${basePath}/images/ink/impact-beam.png`}
          muted
          playsInline
          preload="none"
          onEnded={() => setPlaying(false)}
          aria-label="Cover art: an anime fight shot animated in Blender from Python"
        />
        <div className="ink-cover-title">
          <p className="ink-vol">Vol. 2027</p>
          <h1 id="ink-name"><span>TRI</span><span>HUYNH</span></h1>
          <p className="ink-role">AI &amp; Software Engineer</p>
        </div>
        <Bubble tail="tr" className="ink-cover-bubble">I build AI that holds up in production.</Bubble>
        <button type="button" className="ink-play" onClick={play}>{playing ? '■ stop' : '▶ play the cover'}</button>
      </div>

      <nav className="ink-toc" aria-label="Chapters">
        <p className="ink-toc-h">Contents</p>
        <ol>
          {TOC.map(([n, t, s, href, p]) => (
            <li key={n}>
              <a href={href}>
                <span className="n">{n}</span>
                <span className="t">{t}<small>{s}</small></span>
                <span className="dots" aria-hidden="true" />
                <span className="p">{p}</span>
              </a>
            </li>
          ))}
        </ol>
        <p className="ink-toc-who">Northeastern &apos;27 · B.S. Computer Science, AI concentration · Boston, open to relocating</p>
        <TN>the cover is frame 57 of a fight shot I animate in Blender, entirely from Python. Hit play.</TN>
        <TN>this manga reads left to right.</TN>
      </nav>
    </section>
  );
}
