import { motion, AnimatePresence } from 'framer-motion';
import { useMemo, useState } from 'react';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import SectionHeader from './SectionHeader';
import projectsData from '../data/projects.json';

export default function Projects() {
  const [filter, setFilter] = useState('All');
  const [showAll, setShowAll] = useState(false);
  const [activeProject, setActiveProject] = useState(null);

  const tags = useMemo(
    () => ['All', ...Array.from(new Set(projectsData.map((p) => p.tag)))],
    []
  );

  const filtered = useMemo(() => {
    let list = filter === 'All' ? projectsData : projectsData.filter((p) => p.tag === filter);
    if (!showAll && filter === 'All') list = list.filter((p) => p.featured).slice(0, 3);
    return list;
  }, [filter, showAll]);

  return (
    <section id="projects" className="section-padding">
      <div className="mx-auto max-w-wide">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            index="03"
            eyebrow="selected work"
            title="Things I've"
            accent="built."
            note="A mix of AI products, ML experiments, and full-stack apps — with live demos and source where available."
          />

          {/* filter pills */}
          <div className="flex flex-wrap gap-2 font-mono text-sm">
            {tags.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setFilter(t);
                  if (t !== 'All') setShowAll(true);
                }}
                data-cursor="hover"
                className={`rounded-full px-4 py-1.5 border transition-colors ${
                  filter === t
                    ? 'bg-accent text-white border-accent'
                    : 'border-line text-muted hover:text-fg hover:border-line-strong'
                }`}
              >
                {t.toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <motion.div layout className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProjectCard project={project} onView={setActiveProject} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filter === 'All' && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              data-cursor="hover"
              className="btn-secondary"
            >
              {showAll ? 'Show featured only' : `View all ${projectsData.length} projects`}
            </button>
          </div>
        )}
      </div>

      <ProjectModal project={activeProject} onClose={() => setActiveProject(null)} />
    </section>
  );
}
