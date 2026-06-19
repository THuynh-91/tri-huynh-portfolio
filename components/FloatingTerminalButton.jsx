import { useState } from 'react';
import { motion } from 'framer-motion';
import InteractiveTerminal from './InteractiveTerminal';

export default function FloatingTerminalButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <>
      <motion.button
        className="fixed bottom-8 right-8 bg-accent text-white p-3.5 rounded-full shadow-2xl z-50 group"
        data-cursor="hover"
        style={{ backgroundColor: 'var(--accent)' }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 1, type: 'spring' }}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>

        {showTooltip && (
          <motion.div
            className="absolute bottom-full right-0 mb-2 px-3 py-2 glass text-fg font-mono text-xs rounded-lg whitespace-nowrap"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            open terminal
          </motion.div>
        )}
      </motion.button>

      <InteractiveTerminal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
