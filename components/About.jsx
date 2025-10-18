import { motion } from 'framer-motion';

export default function About() {
  return (
    <section id="about" className="section-padding bg-slate-800">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            About <span className="text-gradient">Me</span>
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            CS student at Northeastern focusing on AI and backend systems
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="space-y-4 text-gray-300">
              <p>
                I'm a sophomore at Northeastern University's Khoury College, majoring in Computer Science
                with a concentration in Artificial Intelligence. I'm drawn to problems that combine machine
                learning with practical software engineering—building systems that are both intelligent and
                reliable.
              </p>
              <p>
                My projects range from an ML-powered Rock Paper Scissors game that attracted 1,000+ players,
                to a full-stack music recommendation system with Redis caching and API integrations. I'm
                experienced with Python, Java, AWS, and modern web frameworks. I enjoy the entire development
                lifecycle—from designing data pipelines to deploying production-ready applications.
              </p>
              <p>
                Outside of tech, I work part-time at Gyu-Kaku Japanese BBQ, which has taught me how to stay
                calm under pressure and work effectively with diverse teams. I'm AWS Certified and completed
                Stanford's Machine Learning Specialization. Expected graduation: April 2027.
              </p>
            </div>

            <motion.div
              className="mt-8 grid grid-cols-3 gap-4"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                <p className="text-3xl font-bold text-primary">2027</p>
                <p className="text-gray-400 text-sm">Expected Graduation</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                <p className="text-3xl font-bold text-primary">15+</p>
                <p className="text-gray-400 text-sm">Technologies</p>
              </div>
              <div className="bg-slate-900 p-4 rounded-lg border border-slate-700">
                <p className="text-3xl font-bold text-primary">2</p>
                <p className="text-gray-400 text-sm">Certifications</p>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="relative"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-1">
              <div className="bg-slate-900 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-white mb-4">Quick Facts</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span className="text-gray-300">CS student at Northeastern University</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span className="text-gray-300">Specializing in Artificial Intelligence</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span className="text-gray-300">AWS Certified Cloud Practitioner</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span className="text-gray-300">Based in Boston, MA</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">•</span>
                    <span className="text-gray-300">Seeking Summer/Fall 2026 opportunities</span>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
