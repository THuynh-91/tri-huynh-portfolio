import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useRouter } from 'next/router';
import { useEffect, useRef } from 'react';

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
  // A demo — hosted, embedded, or (in dev) local — is the card's PRIMARY action.
  const hasPrimaryAction = !!(embedHref || project.demoUrl || localHref);
  // The card itself only ever shows the tagline, five tech chips and two impact bullets. The
  // full write-up — description, every impact bullet, the whole stack — lives in the modal, so
  // the modal has to stay reachable for EVERY project. It used to be suppressed whenever a card
  // had a primary action, which hid the details of exactly the projects that are live.
  // A screenshot-only project keeps its original accent "view →" wording (a screenshot is
  // useless in a new tab, so the modal IS its primary action); when a demo is the primary
  // action the details button takes the secondary muted treatment already used by "source ↗",
  // so the live link and the details button read as clearly different things.
  const canPreview = !hasPrimaryAction && !!project.previewImage;
  const detailsLabel = canPreview ? 'view →' : 'details →';
  const detailsClass = hasPrimaryAction
    ? 'text-muted hover:text-fg transition-colors'
    : 'text-accent hover:underline';

  // 3D tilt
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 200, damping: 20 });
  // cursor-following glow position (%)
  /**
   * The glow was a radial-gradient whose `at x y` was rebuilt every frame. A moving
   * gradient cannot be composited, so the browser re-rasterised and repainted the
   * whole card on every pointer sample. It is a fixed gradient that gets translated
   * now, which the compositor handles without a repaint.
   *
   * getBoundingClientRect() per mousemove is also a forced synchronous layout, and
   * mousemove fires at pointer polling rate rather than frame rate. The rect is read
   * on enter and the updates are coalesced to one per frame.
   */
  const GLOW = 280;
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const glowX = useTransform(px, (v) => v - GLOW);
  const glowY = useTransform(py, (v) => v - GLOW);

  const rectRef = useRef(null);
  const frameRef = useRef(0);
  const pendingRef = useRef(null);

  const handleEnter = (e) => {
    rectRef.current = e.currentTarget.getBoundingClientRect();
  };

  const handleMove = (e) => {
    if (!rectRef.current) rectRef.current = e.currentTarget.getBoundingClientRect();
    pendingRef.current = { cx: e.clientX, cy: e.clientY };
    if (frameRef.current) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0;
      const rect = rectRef.current;
      const pt = pendingRef.current;
      if (!rect || !pt) return;
      const lx = pt.cx - rect.left;
      const ly = pt.cy - rect.top;
      px.set(lx);
      py.set(ly);
      mx.set(lx / rect.width);
      my.set(ly / rect.height);
    });
  };

  const reset = () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    frameRef.current = 0;
    rectRef.current = null;
    mx.set(0.5);
    my.set(0.5);
  };

  useEffect(() => () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
  }, []);

  return (
    <motion.article
      className="tilt-card h-full group"
      style={{ rotateX, rotateY, transformPerspective: 900, willChange: 'transform' }}
      onMouseEnter={handleEnter}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 22 }}
    >
      {/* cursor glow: a static gradient that is moved, not a gradient that is rebuilt */}
      <div className="pointer-events-none absolute -inset-px overflow-hidden rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <motion.div
          className="absolute left-0 top-0"
          style={{
            width: GLOW * 2,
            height: GLOW * 2,
            x: glowX,
            y: glowY,
            willChange: 'transform',
            background: 'radial-gradient(circle closest-side, var(--accent-soft), transparent 65%)',
          }}
        />
      </div>

      {/* media */}
      <div className="relative h-44 overflow-hidden border-b border-line">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={`${project.title} cover art`}
            width={1200}
            height={600}
            loading="lazy"
            decoding="async"
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
            <span className="rounded-full glass-flat px-2.5 py-1 text-muted">{project.year}</span>
          )}
        </div>
        {project.wip && (
          <div className="absolute right-3 top-3 font-mono text-[11px]">
            <span className="rounded-full bg-amber-400/90 px-2.5 py-1 font-semibold text-black shadow-sm">
              ⚠ work in progress
            </span>
          </div>
        )}
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

        {project.metrics?.length > 0 && (
          <dl
            aria-label={`${project.title} key numbers`}
            className="mt-5 flex flex-wrap gap-x-6 gap-y-3 border-t border-line pt-4"
          >
            {project.metrics.slice(0, 3).map((m) => (
              <div key={m.label} className="flex min-w-[5rem] flex-col-reverse">
                <dt className="mt-0.5 text-[11px] leading-snug text-muted">{m.label}</dt>
                <dd className="font-mono text-base font-semibold leading-tight tabular-nums text-accent">
                  {m.value}
                </dd>
              </div>
            ))}
          </dl>
        )}

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
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-accent hover:underline"
              data-cursor="hover"
            >
              {`${project.demoLabel || 'live demo'} ↗`}
            </a>
          )}
          {/* Always present: the only route to the full write-up. Sits after the primary
              action so the live demo stays the first thing in the tab order. */}
          <button
            type="button"
            onClick={() => onView?.(project)}
            aria-label={`View full details for ${project.title}`}
            className={`inline-flex items-center gap-1 ${detailsClass}`}
            data-cursor="hover"
          >
            {detailsLabel}
          </button>
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
