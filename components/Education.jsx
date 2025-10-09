import { motion } from 'framer-motion';

export default function Education() {
  const coursework = [
    "Algorithms & Data Structures",
    "Artificial Intelligence",
    "Data Science",
    "Theory of Computation",
    "Object-Oriented Design",
    "Discrete Mathematics",
    "Computer Systems",
    "Computer Organization & Architecture"
  ];

  return (
    <section id="education" className="py-16 px-6 bg-slate-800">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            <span className="text-gradient">Education</span>
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            Building a strong foundation in computer science and artificial intelligence
          </p>
        </motion.div>

        <motion.div
          className="bg-slate-900 rounded-xl p-8 border border-slate-700"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                Northeastern University
              </h3>
              <p className="text-primary text-lg mb-1">
                Khoury College of Computer Sciences
              </p>
              <p className="text-gray-300 text-lg">
                B.S. in Computer Science
              </p>
              <p className="text-accent font-medium mt-1">
                Concentration in Artificial Intelligence
              </p>
            </div>
            <div className="text-gray-400 mt-4 md:mt-0 md:text-right">
              <p className="text-lg font-semibold">Boston, Massachusetts</p>
              <p className="text-primary">Expected April 2027</p>
            </div>
          </div>

          <div className="border-t border-slate-700 pt-6">
            <h4 className="text-lg font-semibold text-white mb-4">Relevant Coursework:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {coursework.map((course, index) => (
                <motion.div
                  key={index}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.05 }}
                >
                  <span className="text-primary">▸</span>
                  <span className="text-gray-300">{course}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
