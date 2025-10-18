import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function KonamiCode() {
  const [activated, setActivated] = useState(false);
  const [sequence, setSequence] = useState([]);

  const konamiCode = [
    'ArrowUp', 'ArrowUp',
    'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight',
    'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];

  useEffect(() => {
    const handleKeyPress = (e) => {
      const newSequence = [...sequence, e.key].slice(-10);
      setSequence(newSequence);

      if (JSON.stringify(newSequence) === JSON.stringify(konamiCode)) {
        setActivated(true);
        setSequence([]);

        // Trigger confetti or special animation
        createConfetti();

        setTimeout(() => setActivated(false), 5000);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [sequence]);

  const createConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Create confetti effect using DOM manipulation
      for (let i = 0; i < particleCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti-piece';
        confetti.style.cssText = `
          position: fixed;
          width: 10px;
          height: 10px;
          background: ${['#3B82F6', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'][Math.floor(Math.random() * 5)]};
          left: ${randomInRange(0, 100)}%;
          top: ${randomInRange(-10, -20)}%;
          animation: confetti-fall ${randomInRange(2, 4)}s linear forwards;
          z-index: 9999;
          border-radius: 50%;
        `;
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4000);
      }
    }, 250);
  };

  return (
    <>
      <style jsx global>{`
        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>

      <AnimatePresence>
        {activated && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-gradient-to-r from-primary to-accent text-white px-12 py-8 rounded-2xl shadow-2xl text-center"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', duration: 0.5 }}
            >
              <div className="text-6xl mb-4 font-bold">🎮</div>
              <h2 className="text-4xl font-bold mb-2">KONAMI CODE!</h2>
              <p className="text-xl">You found the secret! 🏆</p>
              <p className="text-lg mt-2">⬆️⬆️⬇️⬇️⬅️➡️⬅️➡️🅱️🅰️</p>
              <p className="text-sm mt-2 opacity-80">True gamers know the code</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
