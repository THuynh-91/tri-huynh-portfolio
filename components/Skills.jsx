import { motion } from 'framer-motion';
import TechIcon from './TechIcon';
import skillsData from '../data/skills.json';

export default function Skills() {
  const skillCategories = [
    { title: 'Languages', items: skillsData.languages, icon: '💻' },
    { title: 'Frameworks', items: skillsData.frameworks, icon: '🔧' },
    { title: 'Libraries', items: skillsData.libraries, icon: '📚' },
    { title: 'Databases', items: skillsData.databases, icon: '🗄️' },
    { title: 'Tools', items: skillsData.tools, icon: '⚙️' },
    { title: 'Cloud & Infrastructure', items: skillsData.cloud, icon: '☁️' },
  ];

  return (
    <section id="skills" className="section-padding bg-slate-800">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Technical <span className="text-gradient">Skills</span>
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            A comprehensive toolkit for building modern, scalable applications
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {skillCategories.map((category, idx) => (
            <motion.div
              key={idx}
              className="bg-slate-900 rounded-xl p-6 border border-slate-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span>{category.icon}</span>
                <span className="text-white">{category.title}</span>
              </h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {category.items.map((skill, index) => (
                  <TechIcon key={index} name={skill} size="md" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
