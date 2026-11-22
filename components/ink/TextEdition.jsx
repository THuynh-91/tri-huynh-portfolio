import { useRouter } from 'next/router';
import { BOARD, CONTACT } from '../../data/hand';
import { sideProjects } from './Extras';

// Everything in the chapters, as plain text: for skimmers, screen readers and print.
export default function TextEdition() {
  const { basePath } = useRouter();
  const featured = BOARD.filter((c) => c.street === 'flop');
  const biogen = BOARD.find((c) => c.id === 'biogen');
  return (
    <section id="text" className="ink-text" aria-labelledby="ink-text-title">
      <p className="ink-text-k">Text-only edition · same story, no panels</p>
      <h2 id="ink-text-title">Tri Huynh</h2>
      <p className="ink-text-lede">
        AI and software engineer, graduating from Northeastern in May 2027 (B.S. Computer Science, concentration in AI).
        I build AI systems that hold up in production, most recently an AI agent at Biogen. Boston, open to relocating.
      </p>
      <p className="ink-text-links">
        <a href={`${basePath}${CONTACT.resume}`} target="_blank" rel="noreferrer">résumé (PDF)</a>
        <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
        <a href={CONTACT.github} target="_blank" rel="noreferrer">GitHub</a>
        <a href={CONTACT.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
      </p>

      <h3>Experience</h3>
      <div className="ink-text-entry">
        <p className="h"><b>Biogen</b> · AI Engineer Co-op <span>Jan 2026 – Jun 2026 · Cambridge, MA</span></p>
        <ul>{biogen.detail.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
      </div>
      <div className="ink-text-entry">
        <p className="h"><b>Gyu-Kaku</b> · Server <span>May 2023 – Jan 2026 · Boston, MA</span></p>
        <ul><li>Promoted to trainer, mentoring new servers while working 20–30 hours a week alongside full-time study</li></ul>
      </div>

      <h3>Projects</h3>
      {featured.map((c) => (
        <div className="ink-text-entry" key={c.id}>
          <p className="h"><b>{c.detail.title}</b> <span>{c.result} {c.resultLabel}</span></p>
          <p>{c.detail.summary}</p>
          <ul>{c.detail.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
          <p className="ink-text-links">{c.detail.links.map((l) => <a key={l.href} href={l.href} target="_blank" rel="noreferrer">{l.label}</a>)}</p>
        </div>
      ))}

      <h3>More projects</h3>
      <ul className="ink-text-more">
        {sideProjects(basePath).map((p) => (
          <li key={p.id}>
            <b>{p.title}</b> <span>{p.year}</span> · {p.tagline}
            {p.demo && <> · <a href={p.demo} target="_blank" rel="noreferrer">open</a></>}
            {p.source && <> · <a href={p.source} target="_blank" rel="noreferrer">source</a></>}
          </li>
        ))}
      </ul>

      <h3>Writing</h3>
      <div className="ink-text-entry">
        <p className="h"><b>Playing for First from Ten Times Behind</b> <span>SSRN working paper · Nov 2026</span></p>
        <p>Rank-maximising strategy and play-money price compression in a 2026 midterms prediction-market tournament.</p>
        <p className="ink-text-links"><a href={CONTACT.paper} target="_blank" rel="noreferrer">read on SSRN</a></p>
      </div>

      <h3>Skills</h3>
      <p>
        Python, TypeScript, JavaScript, Java, C, C++, Go, Rust, SQL, Bash · AI agents, tool calling, MCP, RAG, fine-tuning,
        LLM evaluation, guardrails · PyTorch, TensorFlow, scikit-learn · Next.js, React, Node.js, FastAPI, distributed systems ·
        Azure, AWS, Docker, Kubernetes, GitHub Actions · Databricks, Snowflake, Power BI, PostgreSQL
      </p>
    </section>
  );
}
