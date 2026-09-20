import { motion } from 'framer-motion';
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

  /**
   * Which cards are on screen. Every project is still RENDERED -- hiding is done in
   * CSS -- so the static export contains all of them and a crawler or a no-JS reader
   * sees the whole body of work, not just the three featured ones.
   */
  const visibleIds = useMemo(() => {
    let list = filter === 'All' ? projectsData : projectsData.filter((p) => p.tag === filter);
    if (!showAll && filter === 'All') list = list.filter((p) => p.featured);
    return new Set(list.map((p) => p.id));
  }, [filter, showAll]);

  return (
    <section id="projects" className="section-padding">
      <div className="mx-auto max-w-wide">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            index="04"
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
          {projectsData.map((project) => {
            /**
             * Only the cards actually on screen get a motion wrapper. Wrapping all 16
             * put 32 tilt springs and 16 layout-projected nodes on the frame budget and
             * took frames-over-33ms from 6.4% to 13.2% under a 4x CPU throttle.
             */
            if (!visibleIds.has(project.id)) return null;
            return (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProjectCard project={project} onView={setActiveProject} />
              </motion.div>
            );
          })}
        </motion.div>

        {/*
          Crawlers and no-JS readers only ever saw the three featured cards, because the
          rest were unmounted. This inert list keeps every project in the static HTML at
          no animation cost.
        */}
        <ul className="hidden" aria-hidden="true">
          {projectsData.map((project) => (
            <li key={project.id}>
              <h3>{project.title}</h3>
              <p>{project.tagline}</p>
              <p>{project.tech.join(', ')}</p>
            </li>
          ))}
        </ul>

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
