import { motion } from 'framer-motion';
import TypingEffect from './TypingEffect';
import Magnetic from './Magnetic';

export default function Hero() {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
    }
  };

  const roles = [
    'Applied AI Engineer',
    'Forward Deployed Engineer',
    'Machine Learning Engineer',
    'AI Agent Developer',
    'Backend Developer',
  ];

  const ease = [0.22, 1, 0.36, 1];

  return (
    <section
      id="home"
      className="relative min-h-[82vh] flex items-center px-6 pt-28 pb-4 overflow-hidden"
    >
      <div className="mx-auto w-full max-w-wide">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* left - headline */}
          <div className="lg:col-span-8">
            <motion.h1
              className="font-display font-semibold tracking-tightest leading-[0.95] text-[3.25rem] sm:text-7xl lg:text-8xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.05 }}
            >
              Tri Huynh
            </motion.h1>

            <motion.div
              className="mt-4 font-display text-2xl sm:text-3xl lg:text-4xl text-muted"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease, delay: 0.15 }}
            >
              <TypingEffect
                texts={roles}
                typingSpeed={70}
                deletingSpeed={35}
                pauseTime={1800}
              />
            </motion.div>

            <motion.p
              className="mt-8 max-w-xl text-base sm:text-lg text-muted leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease, delay: 0.25 }}
            >
              CS student at Northeastern's Khoury College concentrating in AI.
              I most recently built production AI agents at Biogen with the Claude
              SDK, Azure, and Databricks, and I turn messy data into things people
              actually use.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-wrap items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease, delay: 0.35 }}
            >
              <Magnetic>
                <button
                  onClick={() => scrollToSection('projects')}
                  className="btn-primary"
                  data-cursor="hover"
                >
                  View work
                  <span aria-hidden>↓</span>
                </button>
              </Magnetic>
              <Magnetic>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="btn-secondary"
                  data-cursor="hover"
                >
                  Get in touch
                </button>
              </Magnetic>
            </motion.div>
          </div>

          {/* right - mono status card */}
          <motion.aside
            className="lg:col-span-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease, delay: 0.3 }}
          >
            <div className="glass rounded-2xl p-6 font-mono text-sm">
              <div className="flex items-center gap-2 pb-4 border-b border-line">
                <span className="h-3 w-3 rounded-full bg-red-400/70" />
                <span className="h-3 w-3 rounded-full bg-yellow-400/70" />
                <span className="h-3 w-3 rounded-full bg-accent" />
                <span className="ml-2 text-muted">whoami</span>
              </div>
              <dl className="mt-4 space-y-3">
                {[
                  ['location', 'Boston, MA'],
                  ['school', 'Northeastern → 2027'],
                  ['focus', 'Agentic AI · ML · Backend'],
                  ['recent', 'AI agents @ Biogen'],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4">
                    <dt className="text-accent">{k}</dt>
                    <dd className="text-fg text-right">{v}</dd>
                  </div>
                ))}
              </dl>
              <div className="mt-5 pt-4 border-t border-line text-muted">
                <span className="text-accent">$</span> ./hire-me.sh
                <span className="ml-1 inline-block w-2 h-4 align-middle bg-accent animate-pulse" />
              </div>
            </div>
          </motion.aside>
        </div>
      </div>
    </section>
  );
}
