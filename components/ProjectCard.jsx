import { motion } from 'framer-motion';
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function ProjectCard({ project }) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  // Get base path from Next.js router
  const basePath = router.basePath || '';
  const imageSrc = project.imageUrl ? `${basePath}${project.imageUrl}` : null;

  return (
    <motion.div
      className="bg-slate-800 rounded-xl overflow-hidden border border-slate-700 relative group"
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Image area — uniform height for every card */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
        {imageSrc ? (
          <img
            src={imageSrc}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-4xl opacity-30 text-primary font-bold">PROJECT</div>
          </div>
        )}

        {/* Hover overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-primary/40 to-accent/40"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>

      <div className="p-6">
        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-gray-400 mb-4">{project.tagline}</p>

        <div className="flex flex-wrap gap-2 mb-4">
          {project.tech.map((tech, index) => (
            <span key={index} className="px-3 py-1 bg-slate-700 text-primary text-sm rounded-full">
              {tech}
            </span>
          ))}
        </div>

        <ul className="space-y-2 mb-6">
          {project.impact.map((item, index) => (
            <li key={index} className="text-gray-300 text-sm flex items-start">
              <span className="text-primary mr-2">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>

        <div className="flex gap-3">
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-primary hover:bg-blue-600 text-white rounded-lg text-sm transition-colors"
            >
              Live Demo
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white rounded-lg text-sm transition-colors"
            >
              GitHub
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
