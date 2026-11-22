// The hand the homepage deals. Hole cards: the co-op (A♠) and the school (K♠). Board: the three featured
// projects (Q♠ J♠ 10♠), then two off-suit cards for the side projects. The five spades make a royal flush,
// so every card in the winning hand is real work. Each card says what the thing is, how it works, what it
// is built with and where to see it; the resume's achievement bullets stay on the resume.

export const PROFILE = {
  name: 'Tri Huynh',
  role: 'AI & software engineer',
  school: 'Northeastern University',
  degree: 'B.S. Computer Science, concentration in AI',
  grad: 'May 2027',
  standing: 'GPA 3.7 · Dean’s List',
  place: 'Boston, MA · open to relocating · U.S. citizen',
  seeking: 'Full-time AI and software engineering roles from May 2027',
  courses: ['Engineering LLM-Integrated Systems', 'Machine Learning', 'Distributed Systems', 'Algorithms & Data'],
};

// Tools the projects on this page actually show come first in each group.
export const STACK = [
  ['Languages', ['Python', 'TypeScript', 'JavaScript', 'SQL', 'Java', 'C++', 'C', 'Go', 'Rust']],
  ['AI & ML', ['Claude SDK', 'MCP', 'RAG', 'Gemini', 'LLM evaluation', 'PyTorch', 'TensorFlow', 'scikit-learn']],
  ['Web & backend', ['Next.js', 'React', 'Node.js', 'Preact', 'FastAPI', 'SQLite', 'PostgreSQL', 'Flask']],
  ['Cloud & tooling', ['Fly.io', 'Azure', 'Databricks', 'Docker', 'GitHub Actions', 'Playwright', 'AWS', 'Kubernetes']],
];

export const HOLE = [
  {
    id: 'biogen', rank: 'A', suit: 'spade', art: 'agent',
    title: 'Biogen',
    detail: {
      kicker: 'Hole card · A♠ · AI Engineer Co-op',
      title: 'Biogen · AI Engineer Co-op',
      what: "January to June 2026 in Cambridge, MA. I built the core of Biogen's production AI agent, which business teams use from Microsoft Teams to run workflows on request, and I built and owned the intake system teams across the company use to request AI work.",
      how: 'Python and the Claude SDK, with tools connected over MCP, on Azure with a Databricks sandbox and LangSmith tracing. The intake runs on SharePoint, Power BI and Smartsheet.',
      brief: "I built the core of Biogen's production AI agent (Python, Claude SDK, MCP on Azure), which business teams use from Microsoft Teams to run workflows on request. I also built and owned the intake system teams across the company use to request AI work, with its data pipeline and Power BI dashboard.",
      stack: ['Python', 'Claude SDK', 'MCP', 'Azure', 'Databricks', 'LangSmith', 'Power BI'],
      links: [],
    },
  },
  {
    id: 'northeastern', rank: 'K', suit: 'spade', art: 'cap',
    title: 'Northeastern',
    detail: {
      kicker: 'Hole card · K♠ · Class of 2027',
      title: 'Northeastern University',
      what: 'B.S. in Computer Science with a concentration in AI, graduating in May 2027. GPA 3.7, Dean’s List.',
      how: 'Courses include Engineering LLM-Integrated Systems, Machine Learning, Distributed Systems, and Algorithms & Data.',
      stack: [],
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
      what: 'A study tool, live at cruxpack.io. Upload a lecture PDF and it builds notes, flashcards, practice problems and a chat that answers from your own slides. Every card and note links back to the slide it came from.',
      how: 'A Next.js app with SQLite on Fly.io. A pipeline of Gemini calls plans the topics, writes each part in parallel and audits the draft against the source; a second model re-solves every practice problem before the pack is shown. Stripe runs the paid plan.',
      media: { kind: 'image', src: '/images/shots/cruxpack-card.png', alt: "A CruxPack flashcard from its sample deck, with a link to the lecture page it came from (Lec 04, p. 3)" },
      stack: ['TypeScript', 'Next.js', 'SQLite', 'Gemini', 'Stripe', 'Fly.io'],
      links: [{ label: 'Try cruxpack.io', href: 'https://cruxpack.io' }],
    },
  },
  {
    id: 'predictions', street: 'flop', rank: 'J', suit: 'spade', art: 'chart',
    title: 'Predictions Cup',
    line: 'Live trading system and paper',
    detail: {
      kicker: 'The flop · J♠',
      title: 'Predictions Cup trading system',
      what: "Susquehanna ran a play-money prediction market on the 2026 US midterms. I designed a system to trade it live and directed AI coding agents to build it, then wrote a working paper on what the data showed: the contest's prices were squeezed toward 50% compared with Kalshi's real-money prices.",
      how: 'Python with asyncio streams prices from three venues over WebSockets and compares the contest with real-money markets. Trades are planned with a Monte Carlo simulation of the whole contest, scored on the chance of finishing first rather than on profit, behind risk caps and a kill switch.',
      media: { kind: 'chart', caption: 'From the paper: contest prices against Kalshi prices' },
      stack: ['Python', 'asyncio', 'WebSockets', 'NumPy'],
      links: [{ label: 'Read the paper (SSRN)', href: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7682417' }],
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
      media: { kind: 'video', src: '/media/gittimeline-linux.mp4', poster: '/images/shots/gittimeline-linux.jpg', alt: "GitTimeline playing the Linux kernel's history" },
      stack: ['TypeScript', 'Preact', 'Canvas2D', 'Web Workers', 'Playwright'],
      links: [
        { label: 'Open GitTimeline', href: 'https://thuynh-91.github.io/gittimeline/' },
        { label: 'Source', href: 'https://github.com/THuynh-91/gittimeline' },
      ],
    },
  },
  {
    id: 'games', street: 'turn', rank: '6', suit: 'diamond', art: 'wheel',
    title: 'Games',
    line: 'Casino, roulette, physics',
    detail: {
      kicker: 'The turn · 6♦',
      title: 'Games you can play',
      what: 'Things I build for fun. The roulette table and the pendulum lab run right on this site.',
      more: 'games',
      stack: [],
      links: [],
    },
  },
  {
    id: 'builds', street: 'river', rank: '3', suit: 'club', art: 'chip',
    title: 'More builds',
    line: 'AI tools and models',
    detail: {
      kicker: 'The river · 3♣',
      title: 'More builds',
      what: 'Smaller AI tools and models, most of them live.',
      more: 'builds',
      stack: [],
      links: [],
    },
  },
];

// Side projects shown on the page (the strongest, with something to open). Ids from data/projects.json.
export const SIDE = {
  games: [11, 14, 12],
  builds: [4, 5, 3, 7],
};

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
