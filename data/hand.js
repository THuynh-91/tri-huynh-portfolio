// The hand the homepage deals: Tri's two hole cards, then the board (flop, turn, river).
// The five spades (A K Q J 10) make a royal flush at showdown. Every number here is one the
// resume also states (outcomes only, no user counts).

export const HOLE = [
  {
    id: 'ai', rank: 'A', suit: 'spade', art: 'neural',
    title: 'AI engineer',
    line: 'Agents, RAG, evaluation, guardrails.',
    detail: {
      kicker: 'Hole card · A♠',
      title: 'AI engineer',
      summary: 'I build AI systems that hold up in production: agents that call tools, retrieval that cites its sources, and checks that catch a model when it is wrong.',
      bullets: [
        'Production AI agent at Biogen (Claude SDK, tool calling, MCP, Azure, Databricks)',
        'LLM-as-judge evaluation and an independent answer checker in CruxPack',
        'RAG, fine-tuning, NLP, prompt engineering, LangSmith tracing',
      ],
      stack: ['Python', 'Claude SDK', 'MCP', 'RAG', 'PyTorch', 'TensorFlow'],
      links: [],
    },
  },
  {
    id: 'swe', rank: 'K', suit: 'spade', art: 'crown',
    title: 'Software engineer',
    line: 'Full-stack, distributed systems, infra.',
    detail: {
      kicker: 'Hole card · K♠',
      title: 'Software engineer',
      summary: 'I ship the whole thing, not just the notebook: backends, frontends, deploys and the tests that keep them honest.',
      bullets: [
        'Full-stack web apps in production (Next.js, Node, SQLite, Fly.io)',
        'Real-time systems in Python (asyncio, WebSockets) with risk limits and a kill switch',
        'Profiling and performance work in the browser (Canvas2D, Web Workers)',
      ],
      stack: ['TypeScript', 'Python', 'Go', 'Rust', 'Docker', 'Kubernetes'],
      links: [],
    },
  },
];

export const BOARD = [
  {
    id: 'cruxpack', street: 'flop', rank: 'Q', suit: 'spade', art: 'pages',
    title: 'CruxPack',
    result: '98.7%', resultLabel: 'correct on 770 claims',
    line: 'Lecture PDF in, source-cited study pack out.',
    detail: {
      kicker: 'The flop · Q♠',
      title: 'CruxPack',
      summary: 'A full-stack generative-AI platform, in production, that turns a lecture PDF into source-cited notes, flashcards, practice problems and RAG-grounded Q&A.',
      bullets: [
        'Ran an LLM-as-judge evaluation of its Gemini pipeline on 770 claims from 20 sources: 98.7% correct',
        'Cut its PDF export from 20.5 MB to 3.9 MB and 5.3 s to 3.6 s after tracing 95% of the bytes to images',
        'Every practice problem is re-solved by an independent checker before it ships',
      ],
      stack: ['TypeScript', 'Next.js', 'SQLite/Drizzle', 'Fly.io', 'Gemini', 'Stripe'],
      links: [{ label: 'cruxpack.io', href: 'https://cruxpack.io' }],
    },
  },
  {
    id: 'predictions', street: 'flop', rank: 'J', suit: 'spade', art: 'chart',
    title: 'Predictions Cup',
    result: '0.77', resultLabel: 'price squeeze vs Kalshi',
    line: 'Live trading system and a working paper.',
    detail: {
      kicker: 'The flop · J♠',
      title: 'Predictions Cup trading system',
      summary: "A live trading system for Susquehanna's play-money 2026 midterms contest, and a working paper on what it found: the contest's prices were squeezed toward 50% against Kalshi's.",
      bullets: [
        'Real-time feeds from 3 venues, risk caps, monitoring and a kill switch; built by directing AI coding agents',
        'Logit slope of 0.71 to 0.87 against Kalshi over 3 weeks (1.0 means no squeeze)',
        'Optimized by Monte Carlo simulation for the odds of finishing first, not expected profit; traded it live',
      ],
      chart: true,
      stack: ['Python', 'asyncio', 'WebSockets', 'NumPy', 'Monte Carlo'],
      links: [{ label: 'working paper (SSRN)', href: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7682417' }],
    },
  },
  {
    id: 'gittimeline', street: 'flop', rank: '10', suit: 'spade', art: 'commits',
    title: 'GitTimeline',
    result: '50→33ms', resultLabel: 'p95 frame time',
    line: "Replays Linux's 1.48M-commit history in your browser.",
    detail: {
      kicker: 'The flop · 10♠',
      title: 'GitTimeline',
      summary: "An open-source browser app that replays a repository's commit history, and scales to Linux's full 1.48M-commit history with no GitHub token or API call.",
      bullets: [
        'Reduced p95 frame time from 50 ms to 33 ms: profiled and debugged the renderer',
        'Traced 20.9 ms per frame to one Canvas filter call and replaced it with a mip-chain bloom',
        'Histories are pre-built, so visitors replay them instantly',
      ],
      stack: ['TypeScript', 'Preact', 'Canvas2D', 'Web Workers', 'Playwright'],
      links: [
        { label: 'open it', href: 'https://thuynh-91.github.io/gittimeline/' },
        { label: 'source', href: 'https://github.com/THuynh-91/gittimeline' },
      ],
    },
  },
  {
    id: 'biogen', street: 'turn', rank: '9', suit: 'heart', art: 'agent',
    title: 'Biogen co-op',
    result: 'months→1wk', resultLabel: 'wait for an answer',
    line: 'Production AI agent and an intake system I built.',
    detail: {
      kicker: 'The turn · 9♥',
      title: 'Biogen · AI Engineer Co-op',
      summary: 'January to June 2026 in Cambridge, MA. I built the core of a production AI agent and the intake system that got AI requests answered.',
      bullets: [
        "Built the core of Biogen's production AI agent in Python (Claude SDK with tool calling and MCP on Azure, Databricks sandbox, LangSmith tracing), which business teams use from Microsoft Teams",
        'Cut the wait for an answer on AI requests from months to about a week: built and owned a documented intake system, presented it to VPs and cross-functional stakeholders, and moved a 200+ request backlog into it',
        'Built its data pipeline (SharePoint to Power BI to Smartsheet) and Power BI dashboard; automated 4 recurring workflows',
      ],
      stack: ['Python', 'Claude SDK', 'Azure', 'Databricks', 'Snowflake', 'Power BI'],
      links: [],
    },
  },
  {
    id: 'river', street: 'river', rank: '7', suit: 'diamond', art: 'wheel',
    title: 'The river',
    result: '+14', resultLabel: 'more projects',
    line: 'A casino, a roulette table, AI games and more.',
    detail: {
      kicker: 'The river · 7♦',
      title: 'Side projects',
      summary: 'What I build for fun. A few you can play right now.',
      bullets: [],
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
