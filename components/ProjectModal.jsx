import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

/**
 * Project preview modal / lightbox.
 *
 * Used only for SCREENSHOT-PREVIEW projects (no real hosted/embedded demo):
 *   - previewImage → renders a real screenshot + a "run locally" note
 *   - (none)       → falls back to the cover image + description
 *
 * Real interactive/live demos open in a new tab from the card instead.
 *
 * Accessible: focus trap, Escape to close, restores focus on close,
 * locks body scroll while open. Uses the existing design tokens only.
 */
export default function ProjectModal({ project, onClose }) {
  const router = useRouter();
  const basePath = router.basePath || '';
  const panelRef = useRef(null);
  const closeRef = useRef(null);
  const lastFocused = useRef(null);

  const isOpen = !!project;
  const previewSrc = project?.previewImage ? `${basePath}${project.previewImage}` : null;
  const coverSrc = project?.imageUrl ? `${basePath}${project.imageUrl}` : null;

  // Body scroll lock + focus management
  useEffect(() => {
    if (!isOpen) return;
    lastFocused.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Focus the close button once mounted
    const t = setTimeout(() => closeRef.current?.focus(), 0);
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prevOverflow;
      if (lastFocused.current && lastFocused.current.focus) lastFocused.current.focus();
    };
  }, [isOpen]);

  // Esc to close + focus trap
  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== 'Tab') return;
    const focusables = panelRef.current?.querySelectorAll(
      'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'
    );
    if (!focusables || focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/55 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          onKeyDown={onKeyDown}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} — preview`}
        >
          <motion.div
            ref={panelRef}
            className="relative flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
            initial={{ scale: 0.96, y: 16, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.96, y: 16, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* header */}
            <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
              <div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="rounded-full bg-accent px-2.5 py-1 font-medium text-white">
                    {project.tag}
                  </span>
                  {previewSrc && (
                    <span className="rounded-full glass px-2.5 py-1 text-muted">preview</span>
                  )}
                </div>
                <h3 className="mt-2 font-display text-xl font-semibold">{project.title}</h3>
              </div>
              <button
                ref={closeRef}
                onClick={onClose}
                data-cursor="hover"
                aria-label="Close preview"
                className="shrink-0 rounded-lg border border-line px-3 py-1.5 font-mono text-sm text-muted transition-colors hover:border-line-strong hover:text-fg"
              >
                esc ✕
              </button>
            </div>

            {/* body */}
            <div className="flex-1 overflow-y-auto">
              {previewSrc ? (
                <div className="bg-surface-2 p-3 sm:p-4">
                  <img
                    src={previewSrc}
                    alt={`Screenshot of ${project.title}`}
                    className="mx-auto w-full rounded-lg border border-line"
                  />
                </div>
              ) : coverSrc ? (
                <div className="bg-surface-2 p-3 sm:p-4">
                  <img
                    src={coverSrc}
                    alt={project.title}
                    className="mx-auto w-full rounded-lg border border-line"
                  />
                </div>
              ) : null}

              {/* description + run-locally note */}
              <div className="px-5 py-4">
                <p className="text-sm leading-relaxed text-muted">{project.description}</p>
                {project.runLocally && (
                  <p className="mt-3 flex items-start gap-2 font-mono text-[13px] text-muted">
                    <span className="mt-0.5 text-accent">▸</span>
                    <span>{project.runLocally}</span>
                  </p>
                )}
              </div>
            </div>

            {/* footer links */}
            <div className="flex flex-wrap items-center gap-4 border-t border-line px-5 py-4 font-mono text-sm">
              {project.demoUrl && (
                <a
                  href={project.demoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  className="inline-flex items-center gap-1 text-accent hover:underline"
                >
                  open live demo ↗
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  className="inline-flex items-center gap-1 text-muted transition-colors hover:text-fg"
                >
                  source ↗
                </a>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
