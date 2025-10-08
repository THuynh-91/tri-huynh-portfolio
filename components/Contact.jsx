import { motion } from 'framer-motion';
import CopyToClipboard from './CopyToClipboard';

export default function Contact() {
  return (
    <section id="contact" className="section-padding bg-slate-900">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Get In <span className="text-gradient">Touch</span>
          </h2>
          <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
            I'm always open to new opportunities, collaborations, and conversations about
            technology. Feel free to reach out!
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <motion.div
            className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-primary transition-colors group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <div className="w-12 h-12 mb-4 flex items-center justify-center">
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg"
                alt="Gmail"
                className="w-full h-full"
              />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Email</h3>
            <CopyToClipboard text="triqhuynh91@gmail.com">
              <p className="text-gray-400 group-hover:text-primary transition-colors text-sm cursor-pointer">
                triqhuynh91@gmail.com
              </p>
            </CopyToClipboard>
          </motion.div>

          <motion.a
            href="https://www.linkedin.com/in/tri-huynh-81735326a"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-primary transition-colors group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-12 h-12 mb-4 flex items-center justify-center">
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg"
                alt="LinkedIn"
                className="w-full h-full"
              />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">LinkedIn</h3>
            <p className="text-gray-400 group-hover:text-primary transition-colors">
              Connect with me
            </p>
          </motion.a>

          <motion.a
            href="https://github.com/THuynh-91"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-primary transition-colors group"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <div className="w-12 h-12 mb-4 flex items-center justify-center">
              <img
                src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg"
                alt="GitHub"
                className="w-full h-full filter brightness-0 invert"
              />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">GitHub</h3>
            <p className="text-gray-400 group-hover:text-primary transition-colors">
              Check out my code
            </p>
          </motion.a>
        </div>

        <motion.div
          className="bg-gradient-to-br from-primary to-accent p-1 rounded-2xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <div className="bg-slate-800 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Let's Connect!
            </h3>
            <p className="text-gray-400 mb-6">
              Open to internships, co-ops, and exciting project collaborations
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:triqhuynh91@gmail.com"
                className="btn-primary"
              >
                Send me an email
              </a>
              <a
                href="/resume.pdf"
                download
                className="btn-secondary"
              >
                Download Resume
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
