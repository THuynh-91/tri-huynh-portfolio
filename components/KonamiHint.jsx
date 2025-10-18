import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function KonamiHint() {
  const [showHint, setShowHint] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show hint after 3 seconds on first visit
    const timer = setTimeout(() => {
      const hasSeenHint = localStorage.getItem('konamiHintDismissed');
      if (!hasSeenHint) {
        setShowHint(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    setShowHint(false);
    localStorage.setItem('konamiHintDismissed', 'true');
  };

  const handleTryIt = () => {
    setShowHint(false);
    // The user will need to type the code themselves
  };

  return (
    <AnimatePresence>
      {showHint && !dismissed && (
        <motion.div
          className="fixed bottom-24 right-8 z-30 max-w-xs"
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.8 }}
          transition={{ type: 'spring', duration: 0.5 }}
        >
          <div className="bg-gradient-to-r from-primary to-accent p-1 rounded-xl shadow-2xl">
            <div className="bg-slate-800 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <h3 className="text-white font-semibold mb-1 text-sm">
                    Secret Easter Egg!
                  </h3>
                  <p className="text-gray-300 text-xs mb-3">
                    Try the classic Konami Code:
                  </p>
                  <div className="bg-slate-900 rounded px-2 py-1 mb-3 font-mono text-xs text-center">
                    <span className="text-primary">↑ ↑ ↓ ↓ ← → ← → B A</span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleTryIt}
                      className="flex-1 bg-primary hover:bg-blue-600 text-white text-xs py-1.5 px-3 rounded-lg transition-colors"
                    >
                      Got it!
                    </button>
                    <button
                      onClick={handleDismiss}
                      className="text-gray-400 hover:text-white text-xs px-2 transition-colors"
                    >
                      X
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
