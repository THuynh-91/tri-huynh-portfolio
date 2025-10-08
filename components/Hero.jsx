import { motion } from 'framer-motion';
import TypingEffect from './TypingEffect';

export default function Hero() {
  const scrollToSection = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const roles = [
    'Backend Developer',
    'Machine Learning Engineer',
    'AWS Certified Cloud Practitioner',
    'Software Engineer'
  ];

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center section-padding bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
      <div className="max-w-6xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.p
            className="text-primary text-sm md:text-base font-medium mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            👋 Hi, I'm
          </motion.p>
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-gradient">Tri Huynh</span>
          </h1>
          <p className="text-2xl md:text-3xl text-gray-300 mb-2">
            Computer Science Student @ Northeastern
          </p>
          <p className="text-xl md:text-2xl mb-4 min-h-[2rem]">
            <TypingEffect texts={roles} typingSpeed={80} deletingSpeed={40} pauseTime={2000} />
          </p>
          <motion.p
            className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            I build ML-powered applications and scalable backends. Currently seeking internships and co-op opportunities for Summer/Fall 2026.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-3 justify-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <span className="px-3 py-1 bg-slate-800 text-gray-300 rounded-full text-sm border border-slate-700">
              AWS Certified
            </span>
            <span className="px-3 py-1 bg-slate-800 text-gray-300 rounded-full text-sm border border-slate-700">
              Machine Learning
            </span>
            <span className="px-3 py-1 bg-slate-800 text-gray-300 rounded-full text-sm border border-slate-700">
              Backend Dev
            </span>
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-4 justify-center mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <button
              onClick={() => scrollToSection('projects')}
              className="btn-primary"
            >
              View Projects
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="btn-secondary"
            >
              Get In Touch
            </button>
          </motion.div>
        </motion.div>

        <motion.div
          className="mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="animate-bounce">
            <svg
              className="w-6 h-6 mx-auto text-primary cursor-pointer"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
              onClick={() => scrollToSection('projects')}
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
