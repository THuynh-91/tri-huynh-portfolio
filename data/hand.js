// The hand the homepage deals: two hole cards (what Tri does), then the board (flop, turn, river).
// The five spades (A K Q J 10) make a royal flush at showdown. Each card describes a project the way a
// portfolio should: what it is, how it works, what it is built with, and where to try it. Resume bullets
// stay on the resume.

export const PROFILE = {
  name: 'Tri Huynh',
  role: 'AI & software engineer',
  school: 'Northeastern University',
  degree: 'B.S. Computer Science, concentration in AI',
  grad: 'May 2027',
  place: 'Boston, MA · open to relocating',
  seeking: 'Full-time AI and software engineering roles from May 2027',
  courses: ['Machine Learning', 'Distributed Systems', 'Engineering LLM-Integrated Systems', 'Algorithms & Data'],
};

export const STACK = [
  ['Languages', ['Python', 'TypeScript', 'JavaScript', 'Java', 'C++', 'C', 'Go', 'Rust', 'SQL']],
  ['AI & ML', ['LLM agents', 'Claude SDK', 'MCP', 'RAG', 'Gemini', 'PyTorch', 'TensorFlow', 'scikit-learn']],
  ['Web & backend', ['Next.js', 'React', 'Node.js', 'FastAPI', 'Flask', 'PostgreSQL', 'SQLite', 'Redis']],
  ['Cloud & data', ['Azure', 'AWS', 'Docker', 'Kubernetes', 'Fly.io', 'Databricks', 'Snowflake', 'GitHub Actions']],
];

export const HOLE = [
  {
    id: 'ai', rank: 'A', suit: 'spade', art: 'neural',
    title: 'AI engineer',
    line: 'Agents, retrieval, evaluation',
    detail: {
      kicker: 'Hole card · A♠',
      title: 'AI engineering',
      what: 'Most of what I build is LLM software that has to do real work: agents that call tools, retrieval that answers from a given set of documents, and checks that catch a model when it is wrong.',
      how: 'I work mostly in Python and TypeScript, with the Claude SDK and MCP for agents and Gemini for generation, and PyTorch, TensorFlow and scikit-learn for models of my own.',
      stack: ['Claude SDK', 'MCP', 'RAG', 'Gemini', 'PyTorch', 'TensorFlow'],
      links: [],
    },
  },
  {
    id: 'swe', rank: 'K', suit: 'spade', art: 'crown',
    title: 'Software engineer',
    line: 'Full-stack, backends, systems',
    detail: {
      kicker: 'Hole card · K♠',
      title: 'Software engineering',
      what: 'I build the whole product, not just the model call: the backend, the interface, the deploy and the tests that keep it working.',
      how: 'Next.js, React and Node.js on the web; FastAPI and Flask in Python; SQLite and PostgreSQL for data; Docker, Fly.io, AWS and Azure to run it; Playwright and Vitest to test it.',
      stack: ['TypeScript', 'Python', 'Go', 'Rust', 'Docker', 'Kubernetes'],
      links: [],
    },
  },
];

export const BOARD = [
  {
    id: 'cruxpack', street: 'flop', rank: 'Q', suit: 'spade', art: 'pages',
    title: 'CruxPack',
    line: 'Lecture PDF in, study pack out',
    detail: {
      kicker: 'The flop · Q♠',
      title: 'CruxPack',
      what: 'A study tool, live at cruxpack.io. Upload a lecture PDF and it builds notes, flashcards, practice problems and a chat that answers from your own slides. Every flashcard links back to the slide it came from.',
      how: 'A Next.js app with SQLite on Fly.io. A pipeline of Gemini calls plans the topics, writes each part in parallel and audits the draft against the source; a second model re-solves every practice problem before the pack is shown. Stripe runs the paid plan.',
      image: { src: '/images/ink/cruxpack-dots.png', alt: "CruxPack's landing page" },
      stack: ['TypeScript', 'Next.js', 'SQLite', 'Gemini', 'Stripe', 'Fly.io'],
      links: [{ label: 'cruxpack.io', href: 'https://cruxpack.io' }],
    },
  },
  {
    id: 'predictions', street: 'flop', rank: 'J', suit: 'spade', art: 'chart',
    title: 'Predictions Cup',
    line: 'Live trading system + paper',
    detail: {
      kicker: 'The flop · J♠',
      title: 'Predictions Cup trading system',
      what: "Susquehanna ran a play-money prediction market on the 2026 US midterms. I built a system to trade it live, and wrote a working paper on what the data showed: the contest's prices were squeezed toward 50% compared with Kalshi's real-money prices.",
      how: 'Python with asyncio streams prices from three venues over WebSockets and compares the contest with real-money markets. Trades are planned with a Monte Carlo simulation of the whole contest, scored on the chance of finishing first rather than on profit, behind risk caps and a kill switch.',
      chart: true,
      stack: ['Python', 'asyncio', 'WebSockets', 'NumPy'],
      links: [{ label: 'working paper (SSRN)', href: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7682417' }],
    },
  },
  {
    id: 'gittimeline', street: 'flop', rank: '10', suit: 'spade', art: 'commits',
    title: 'GitTimeline',
    line: "A repo's history, played back",
    detail: {
      kicker: 'The flop · 10♠',
      title: 'GitTimeline',
      what: "Paste a public GitHub repository and its commit history plays like a performance: branches split off and merge back while contributors move along their work. Big projects, Linux's full history included, are pre-built, so they play instantly with no GitHub token.",
      how: 'TypeScript and Preact. A Web Worker turns the commit graph into lanes and a timeline, and Canvas2D draws every frame; the renderer was profiled until Linux played smoothly. Playwright tests check real playback in a browser.',
      image: { src: '/images/ink/gittimeline-linux.png', alt: "GitTimeline replaying the Linux kernel's history" },
      stack: ['TypeScript', 'Preact', 'Canvas2D', 'Web Workers', 'Playwright'],
      links: [
        { label: 'open it', href: 'https://thuynh-91.github.io/gittimeline/' },
        { label: 'source', href: 'https://github.com/THuynh-91/gittimeline' },
      ],
    },
  },
  {
    id: 'biogen', street: 'turn', rank: '9', suit: 'heart', art: 'agent',
    title: 'Biogen',
    line: 'AI Engineer Co-op · 2026',
    detail: {
      kicker: 'The turn · 9♥',
      title: 'Biogen · AI Engineer Co-op',
      what: "January to June 2026 in Cambridge, MA, on Biogen's AI team. I worked on the company's internal AI agent, which business teams use from Microsoft Teams, and on how teams across the company request AI work.",
      how: 'Python and the Claude SDK, with tools connected over MCP, on Azure with a Databricks sandbox and LangSmith tracing; reporting in Power BI.',
      brief: "On Biogen's AI team. I worked on the company's internal AI agent, which business teams use from Microsoft Teams, and on how teams across the company request AI work.",
      stack: ['Python', 'Claude SDK', 'MCP', 'Azure', 'Databricks', 'Power BI'],
      links: [],
    },
  },
  {
    id: 'river', street: 'river', rank: '7', suit: 'diamond', art: 'wheel',
    title: 'Side projects',
    line: 'Games, AI tools, more',
    detail: {
      kicker: 'The river · 7♦',
      title: 'Side projects',
      what: 'What I build for fun. A few you can play right now.',
      more: true,
      stack: [],
      links: [],
    },
  },
];

export const CONTACT = {
  email: 'triqhuynh91@gmail.com',
  github: 'https://github.com/THuynh-91',
  linkedin: 'https://linkedin.com/in/tri-huynh-ai',
  resume: '/Resume_Tri_Huynh.pdf',
  paper: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7682417',
};

// The paper's figure data (contest price vs Kalshi price, binned), from its compression figure.
export const COMPRESSION = {
  oct15: [[0.0605, 0.1104], [0.1381, 0.1854], [0.262, 0.2987], [0.399, 0.4235], [0.6036, 0.5932], [0.745, 0.708], [0.8557, 0.823], [0.9428, 0.8947]],
  oct27: [[0.0508, 0.0732], [0.1408, 0.1624], [0.2752, 0.2945], [0.4125, 0.4237], [0.59, 0.5825], [0.7273, 0.7105], [0.8585, 0.8393], [0.9504, 0.9301]],
  slope: 0.7698,
  intercept: 0.0127,
};
