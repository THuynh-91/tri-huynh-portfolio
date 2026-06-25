import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRouter } from 'next/router';

const initials = (title) =>
  title
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

// A localhost "Open app" link is only useful to the person running the apps on
// their own machine — it is DEAD for public visitors on GitHub Pages. We show it
// only in local development. Two guards, belt-and-suspenders:
//   1. Build-time: `process.env.NODE_ENV` is inlined by Next at export; the Pages
//      build runs with NODE_ENV=production, so this whole branch is dropped.
//   2. Run-time: even in a prod bundle opened on localhost (rare), we re-check the
//      hostname, so a locally-served production build still behaves correctly.
const IS_DEV_BUILD = process.env.NODE_ENV !== 'production';
function showLocalLinks() {
  if (!IS_DEV_BUILD) return false;
  if (typeof window === 'undefined') return IS_DEV_BUILD; // SSR/export: trust the build flag
  const h = window.location.hostname;
  return h === 'localhost' || h === '127.0.0.1' || h === '[::1]' || h === '';
}

export default function ProjectCard({ project, onView }) {
  const router = useRouter();
  const basePath = router.basePath || '';
  const imageSrc = project.imageUrl ? `${basePath}${project.imageUrl}` : null;
  // Interactive embedded demos open in a new tab (basePath-aware URL).
  const embedHref = project.embedUrl ? `${basePath}${project.embedUrl}` : null;
  // Only surface a localhost "Open app" link in local dev (never on the published site).
  const localHref = showLocalLinks() && project.localUrl ? project.localUrl : null;
  // Screenshot previews still open in the in-page modal (a screenshot is useless in a new tab).
  // Suppressed when a live demo, an embedded demo, OR a shown local link is the primary action.
  const canPreview = !embedHref && !project.demoUrl && !localHref && !!project.previewImage;

  // 3D tilt
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 });
  // cursor-following glow position (%)
  const glowX = useTransform(mx, (v) => `${v * 100}%`);
  const glowY = useTransform(my, (v) => `${v * 100}%`);

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - rect.left) / rect.width);
    my.set((e.clientY - rect.top) / rect.height);
  };
  const reset = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <motion.article
      className="tilt-card h-full group"
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      {/* cursor glow */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: useTransform(
            [glowX, glowY],
            ([gx, gy]) => `radial-gradient(280px circle at ${gx} ${gy}, var(--accent-soft), transparent 65%)`
          ),
        }}
      />

      {/* media */}
      <div className="relative h-44 overflow-hidden border-b border-line">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={project.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="relative flex h-full w-full items-center justify-center bg-surface-2">
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, var(--accent-soft) 0%, transparent 55%)',
              }}
            />
            <span className="font-display text-6xl font-bold text-fg/15 select-none">
              {initials(project.title)}
            </span>
          </div>
        )}
        <div className="absolute left-3 top-3 flex gap-2 font-mono text-[11px]">
          <span className="rounded-full bg-accent px-2.5 py-1 text-white font-medium">
            {project.tag}
          </span>
          {project.year && (
            <span className="rounded-full glass px-2.5 py-1 text-muted">{project.year}</span>
          )}
        </div>
      </div>

      {/* body */}
      <div className="p-6">
        <h3 className="font-display text-xl font-semibold transition-colors group-hover:text-accent">
          {project.title}
        </h3>
        <p className="mt-2 text-sm text-muted leading-relaxed">{project.tagline}</p>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {project.tech.slice(0, 5).map((t) => (
            <span
              key={t}
              className="rounded-md border border-line px-2 py-0.5 font-mono text-[11px] text-muted"
            >
              {t}
            </span>
          ))}
          {project.tech.length > 5 && (
            <span className="rounded-md px-2 py-0.5 font-mono text-[11px] text-muted">
              +{project.tech.length - 5}
            </span>
          )}
        </div>

        <ul className="mt-4 space-y-1.5">
          {project.impact.slice(0, 2).map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-muted">
              <span className="mt-0.5 text-accent">▸</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap gap-3 font-mono text-sm">
          {localHref && (
            <a
              href={localHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-medium text-accent hover:underline"
              data-cursor="hover"
            >
              Open app ↗
            </a>
          )}
          {embedHref && (
            <a
              href={embedHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-accent hover:underline"
              data-cursor="hover"
            >
              open demo ↗
            </a>
          )}
          {canPreview && (
            <button
              type="button"
              onClick={() => onView?.(project)}
              className="inline-flex items-center gap-1 text-accent hover:underline"
              data-cursor="hover"
            >
              view →
            </button>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-accent hover:underline"
              data-cursor="hover"
            >
              live demo ↗
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-muted hover:text-fg transition-colors"
              data-cursor="hover"
            >
              source ↗
            </a>
          )}
        </div>
      </div>
    </motion.article>
  );
}
