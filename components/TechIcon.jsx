import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

// Tech stack icon URLs from Simple Icons CDN
const techIcons = {
  // Languages
  'Python': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  'Java': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg',
  'JavaScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg',
  'TypeScript': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg',
  'SQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  'R': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg',
  'HTML/CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg',
  'Racket': 'https://racket-lang.org/img/racket-logo.svg',
  'LISP': 'https://upload.wikimedia.org/wikipedia/commons/4/48/Lisp_logo.svg',

  // Frameworks
  'FastAPI': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg',
  'Next.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg',
  'React': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg',
  'Express.js': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg',
  'Flask': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg',
  'Tailwind CSS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg',

  // Libraries
  'TensorFlow': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg',
  'PyTorch': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg',
  'Keras': 'https://upload.wikimedia.org/wikipedia/commons/a/ae/Keras_logo.svg',
  'scikit-learn': 'https://upload.wikimedia.org/wikipedia/commons/0/05/Scikit_learn_logo_small.svg',
  'NumPy': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg',
  'Pandas': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg',
  'Matplotlib': 'https://upload.wikimedia.org/wikipedia/commons/8/84/Matplotlib_icon.svg',

  // Databases
  'PostgreSQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg',
  'Redis': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg',
  'MongoDB': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg',
  'MySQL': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg',
  'SQLite': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg',
  // Fly.io, Gemini, Stripe and Drizzle have no devicon path (that CDN 403s for all four),
  // so they follow the existing "served locally" pattern above: the Simple Icons glyph with
  // an explicit fill. Brand colour where it reads on BOTH themes (surface-2 is #d7d7d4 light
  // / #1e2130 dark); neutral #6B7280 where the official hex does not — same call already
  // made for ollama.svg. Litestream has no Simple Icon, so it keeps the letter tile.
  'Drizzle ORM': '/images/icons/drizzle.svg',

  // Tools
  'Git': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg',
  'GitHub': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg',
  'Docker': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg',
  'VS Code': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg',
  'Linux (Ubuntu)': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg',
  'Jupyter Notebook': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg',
  'PyCharm': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pycharm/pycharm-original.svg',
  'Puppeteer': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/puppeteer/puppeteer-original.svg',
  'Stripe': '/images/icons/stripe.svg',

  // Cloud
  'AWS (Certified Cloud Practitioner)': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg',
  'Vercel': '/images/vercel-icon.svg',

  // Additional Tools
  'Vite': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vitejs/vitejs-original.svg',
  'Eclipse': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/eclipse/eclipse-original.svg',
  'GitHub Actions': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg',
  'Bash': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg',
  'Bash/Shell': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg',
  'GitHub Actions (CI/CD)': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg',

  // Libraries (missing ones)
  'librosa': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  // devicon has no spotify icon (that path 403s), and spotipy is a Python library, so it
  // uses the same Python mark as librosa and FAISS above.
  'spotipy': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  'FAISS': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',

  // Platforms
  'Render': 'https://avatars.githubusercontent.com/u/36424661?s=200&v=4',
  'Fly.io': '/images/icons/flyio.svg',

  // AI / agents - served locally (the simpleicons CDN was flaky / bot-blocked)
  'Claude': '/images/icons/claude.svg',
  'Claude SDK': '/images/icons/claude.svg',
  'Claude Code': '/images/icons/claude.svg',
  'Codex': '/images/icons/codex.svg',
  'Copilot Studio': '/images/icons/copilot.svg',
  'Ollama': '/images/icons/ollama.svg',
  'Gemini': '/images/icons/gemini.svg',
  'LangSmith': '/images/icons/langsmith.svg',

  // data / cloud - Databricks/Snowflake served locally; Azure via devicon
  'Databricks': '/images/icons/databricks.svg',
  'Snowflake': '/images/icons/snowflake.svg',
  'Azure': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg',
  'Azure AI Services': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg',
  'Streamlit': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/streamlit/streamlit-original.svg',
  'Sentence-Transformers': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg',
  'Jira': 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jira/jira-original.svg',
};

export default function TechIcon({ name, size = 'md', label = false }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const router = useRouter();
  const basePath = router.basePath || '';

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  let iconUrl = techIcons[name];

  // Add basePath to local images
  if (iconUrl && iconUrl.startsWith('/')) {
    iconUrl = `${basePath}${iconUrl}`;
  }

  // Labelled pill: icon + name, so each tool is unmistakable (used in
  // the highlighted AI & Agents / Data & Cloud cards).
  if (label) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5">
        {iconUrl ? (
          <img src={iconUrl} alt={name} className="h-4 w-4 object-contain" />
        ) : (
          <span className="grid h-4 w-4 place-items-center rounded bg-accent-soft text-[9px] font-bold text-accent-text">
            {name.charAt(0)}
          </span>
        )}
        <span className="font-mono text-xs text-fg">{name}</span>
      </span>
    );
  }

  // Fallback to first letter if no icon found
  if (!iconUrl) {
    return (
      <div className="relative inline-block">
        {/* No icon: the tile shows one letter, so it needs an accessible name of its own --
            otherwise a screen reader (and any non-hover device) gets "L" and nothing else. */}
        <div
          role="img"
          aria-label={name}
          className={`${sizeClasses[size]} bg-surface-2 border border-line rounded-lg flex items-center justify-center text-accent font-bold cursor-help`}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {name.charAt(0)}
        </div>
        <AnimatePresence>
          {showTooltip && (
            <motion.div
              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 bg-slate-900 text-white text-sm rounded-lg whitespace-nowrap z-50 shadow-xl border border-primary/30"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 5 }}
            >
              {name}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-900"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="relative inline-block group">
      <motion.div
        className={`${sizeClasses[size]} p-2 bg-surface-2 border border-line hover:border-line-strong rounded-lg transition-all cursor-help shadow-sm`}
        whileHover={{ scale: 1.1, rotate: 5 }}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <img
          src={iconUrl}
          alt={name}
          className="w-full h-full object-contain filter brightness-100 group-hover:brightness-110"
        />
      </motion.div>

      <AnimatePresence>
        {showTooltip && (
          <motion.div
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 glass text-fg font-mono text-xs rounded-lg whitespace-nowrap z-50 shadow-xl"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
          >
            {name}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
