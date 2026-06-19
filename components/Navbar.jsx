import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const router = useRouter();
  const basePath = router.basePath || '';

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Dark is the default; only go light if explicitly saved.
    const dark = localStorage.getItem('theme') !== 'light';
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  const navLinks = [
    { name: 'about', href: '#about' },
    { name: 'experience', href: '#experience' },
    { name: 'work', href: '#projects' },
    { name: 'skills', href: '#skills' },
    { name: 'contact', href: '#contact' },
  ];

  const scrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      const offset = element.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo({ top: offset, behavior: 'smooth' });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <motion.nav
      className="fixed top-4 inset-x-0 z-50 flex justify-end px-4"
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div
        className={`flex max-w-full items-center gap-1.5 rounded-full px-2.5 py-2 transition-all duration-300 ${
          isScrolled ? 'glass shadow-lg' : 'glass'
        }`}
      >
        {/* desktop links */}
        <div className="hidden md:flex items-center gap-0.5 font-mono text-sm">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(link.href);
              }}
              className="rounded-full px-3 py-1.5 text-muted transition-colors hover:bg-surface-2 hover:text-fg"
              data-cursor="hover"
            >
              {link.name}
            </a>
          ))}
          <span className="mx-1 h-5 w-px bg-line" />
        </div>

        {/* theme toggle */}
        <button
          onClick={toggleTheme}
          className="rounded-full p-2 transition-colors hover:bg-surface-2"
          data-cursor="hover"
          aria-label="Toggle theme"
          title={isDark ? 'Switch to light' : 'Switch to dark'}
        >
          {isDark ? (
            <svg className="h-5 w-5 text-accent-text" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="h-5 w-5 text-fg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
        </button>

        {/* résumé */}
        <a
          href={`${basePath}/Resume_Tri_Huynh.pdf`}
          download
          className="hidden sm:inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-accent px-4 py-1.5 text-sm font-medium text-white transition hover:brightness-110"
          data-cursor="hover"
        >
          résumé ↗
        </a>

        {/* mobile toggle */}
        <button
          className="rounded-full p-2 hover:bg-surface-2 md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            {isMobileMenuOpen ? <path d="M6 18L18 6M6 6l12 12" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {/* mobile menu */}
      {isMobileMenuOpen && (
        <motion.div
          className="absolute right-4 top-full mt-2 w-[min(20rem,calc(100%-2rem))] rounded-2xl glass p-4 font-mono md:hidden"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => {
                e.preventDefault();
                scrollToSection(link.href);
              }}
              className="block rounded-lg px-3 py-2 text-muted transition-colors hover:bg-surface-2 hover:text-fg"
            >
              {link.name}
            </a>
          ))}
          <a
            href={`${basePath}/Resume_Tri_Huynh.pdf`}
            download
            className="mt-2 block rounded-lg bg-accent px-4 py-2 text-center font-medium text-white"
          >
            download résumé
          </a>
        </motion.div>
      )}
    </motion.nav>
  );
}
