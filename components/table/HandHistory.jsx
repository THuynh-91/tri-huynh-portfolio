import { useRouter } from 'next/router';
import { BOARD, CONTACT } from '../../data/hand';
import { sideProjects } from './HandDetail';
import { SuitIcon } from './CardArt';

// Everything on the table, as a printed hand-history slip: readable without playing.
export default function HandHistory() {
  const { basePath } = useRouter();
  const featured = BOARD.filter((c) => c.street === 'flop');
  const biogen = BOARD.find((c) => c.id === 'biogen');
  return (
    <section id="plain" className="pk-history" aria-labelledby="pk-history-title">
      <div className="pk-slip">
        <p className="pk-slip-k">HAND HISTORY · PLAIN VERSION</p>
        <h2 id="pk-history-title">Tri Huynh</h2>
        <p className="pk-slip-lede">
          AI and software engineer, graduating from Northeastern in May 2027 (B.S. Computer Science, concentration in AI).
          I build AI systems that hold up in production, most recently an AI agent at Biogen, and I build games of chance and
          skill for fun. Boston, open to relocating.
        </p>
        <p className="pk-slip-links">
          <a href={`${basePath}${CONTACT.resume}`} target="_blank" rel="noreferrer">résumé (PDF)</a>
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          <a href={CONTACT.github} target="_blank" rel="noreferrer">GitHub</a>
          <a href={CONTACT.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
        </p>

        <h3><SuitIcon suit="heart" size={12} /> Experience</h3>
        <div className="pk-entry">
          <p className="pk-entry-h"><b>Biogen</b> · AI Engineer Co-op <span>Jan 2026 – Jun 2026 · Cambridge, MA</span></p>
          <ul>{biogen.detail.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
        </div>
        <div className="pk-entry">
          <p className="pk-entry-h"><b>Gyu-Kaku</b> · Server <span>May 2023 – Jan 2026 · Boston, MA</span></p>
          <ul><li>Promoted to trainer, mentoring new servers while working 20–30 hours a week alongside full-time study</li></ul>
        </div>

        <h3><SuitIcon suit="spade" size={12} /> Projects</h3>
        {featured.map((c) => (
          <div className="pk-entry" key={c.id}>
            <p className="pk-entry-h"><b>{c.detail.title}</b> <span>{c.result} {c.resultLabel}</span></p>
            <p>{c.detail.summary}</p>
            <ul>{c.detail.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
            <p className="pk-slip-links">{c.detail.links.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>)}</p>
          </div>
        ))}

        <h3><SuitIcon suit="diamond" size={12} /> More projects</h3>
        <ul className="pk-more pk-more-plain">
          {sideProjects(basePath).map((p) => (
            <li key={p.id}>
              <div><b>{p.title}</b> <span className="pk-year">{p.year}</span><br /><span>{p.tagline}</span></div>
              <span className="pk-more-links">
                {p.demo && <a href={p.demo} target="_blank" rel="noreferrer">open</a>}
                {p.source && <a href={p.source} target="_blank" rel="noreferrer">source</a>}
              </span>
            </li>
          ))}
        </ul>

        <h3><SuitIcon suit="club" size={12} /> Writing</h3>
        <div className="pk-entry">
          <p className="pk-entry-h"><b>Playing for First from Ten Times Behind</b> <span>SSRN working paper · Nov 2026</span></p>
          <p>Rank-maximising strategy and play-money price compression in a 2026 midterms prediction-market tournament.</p>
          <p className="pk-slip-links"><a href={CONTACT.paper} target="_blank" rel="noreferrer">read on SSRN</a></p>
        </div>

        <h3><SuitIcon suit="spade" size={12} /> Skills</h3>
        <p className="pk-skills">
          Python, TypeScript, JavaScript, Java, C, C++, Go, Rust, SQL, Bash · AI agents, tool calling, MCP, RAG, fine-tuning,
          LLM evaluation, guardrails · PyTorch, TensorFlow, scikit-learn · Next.js, React, Node.js, FastAPI, distributed systems ·
          Azure, AWS, Docker, Kubernetes, GitHub Actions · Databricks, Snowflake, Power BI, PostgreSQL
        </p>
        <p className="pk-slip-foot">— end of hand · thanks for sitting in —</p>
      </div>
    </section>
  );
}
