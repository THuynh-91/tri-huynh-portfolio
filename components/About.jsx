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
            A passionate developer on a mission to build impactful solutions
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
                I'm a Computer Science student at Northeastern University's Khoury College,
                concentrating in Artificial Intelligence. My passion lies in creating intelligent
                systems that bridge the gap between complex machine learning algorithms and
                practical, user-friendly applications.
              </p>
              <p>
                Currently pursuing my B.S. with an expected graduation in April 2027, I've built
                a strong foundation in algorithms, data structures, and AI while gaining hands-on
                experience through personal projects. From developing an ML-driven Rock Paper Scissors
                game with 1,000+ visitors to building scalable backend systems for music recommendations,
                I love turning theoretical knowledge into real-world solutions.
              </p>
              <p>
                As an AWS Certified Cloud Practitioner and Machine Learning Specialization graduate,
                I'm constantly expanding my technical toolkit. When I'm not coding or studying, you'll
                find me working part-time at Gyu-Kaku Japanese BBQ, where I've learned the value of
                teamwork, time management, and delivering excellence under pressure.
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
                    <span className="text-primary mr-2">🎓</span>
                    <span className="text-gray-300">CS student at Northeastern University</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">🤖</span>
                    <span className="text-gray-300">Specializing in Artificial Intelligence</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">☁️</span>
                    <span className="text-gray-300">AWS Certified Cloud Practitioner</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">📍</span>
                    <span className="text-gray-300">Based in Boston, MA</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-primary mr-2">🚀</span>
                    <span className="text-gray-300">Always building and learning new tech</span>
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
