import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import ProjectCard from './ProjectCard';
import projectsData from '../data/projects.json';

export default function Projects() {
  const [showAllProjects, setShowAllProjects] = useState(false);
  const featuredProjects = projectsData.filter(p => p.featured);
  const otherProjects = projectsData.filter(p => !p.featured);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section id="projects" className="section-padding bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Featured <span className="text-gradient">Projects</span>
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Here are some of my recent projects that showcase my skills in AI, full-stack development, and system architecture.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
        >
          {featuredProjects.map((project) => (
            <motion.div key={project.id} variants={item}>
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <button
            onClick={() => setShowAllProjects(!showAllProjects)}
            className="inline-block px-8 py-3 border-2 border-primary text-primary hover:bg-primary hover:text-white rounded-lg font-medium transition-all duration-200"
          >
            {showAllProjects ? 'Show Less' : `View All Projects (${projectsData.length})`}
          </button>
        </motion.div>

        {/* All Projects Section */}
        <AnimatePresence>
          {showAllProjects && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5 }}
              className="overflow-hidden mt-12"
            >
              <div className="border-t border-slate-700 pt-12">
                <h3 className="text-3xl font-bold text-center mb-8">
                  More <span className="text-gradient">Projects</span>
                </h3>
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  variants={container}
                  initial="hidden"
                  animate="show"
                >
                  {otherProjects.map((project) => (
                    <motion.div key={project.id} variants={item}>
                      <ProjectCard project={project} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
