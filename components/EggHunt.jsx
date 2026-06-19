import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/router';

// The hidden character's image. Swap this for any image you drop in
// /public/images to change the mascot.
const CHARACTER_SRC = '/images/mascot.svg';

// A hidden mascot that peeks from the LEFT edge and stays pinned to the page as
// you scroll. After 10s a "click!" arrow points it out; clicking it reveals a
// little "nice eye" celebration.
export default function EggHunt() {
  const router = useRouter();
  const basePath = router.basePath || '';
  const [found, setFound] = useState(false);
  const [hint, setHint] = useState(false);
  const [celebrate, setCelebrate] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('eggHuntFound') === '1') {
      setFound(true);
      return;
    }
    const t = setTimeout(() => setHint(true), 10000);
    // eslint-disable-next-line no-console
    console.log(
      "%c🕵️  someone is peeking from the left edge… click them.",
      'color:#8b5cf6;font-weight:bold;font-size:13px'
    );
    return () => clearTimeout(t);
  }, []);

  const collect = () => {
    setFound(true);
    setHint(false);
    setCelebrate(true);
    localStorage.setItem('eggHuntFound', '1');
    setTimeout(() => setCelebrate(false), 6000);
  };

  return (
    <>
      {!found && (
        <div className="fixed -left-[12.5px] top-[42%] z-40 flex items-center">
          <motion.button
            onClick={collect}
            data-cursor="hover"
            aria-label="Find the hidden character"
            className="block leading-none drop-shadow-xl"
            // slide out from behind the left edge once, then keep a gentle bob
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1, y: [0, -5, 0] }}
            transition={{
              x: { duration: 0.6, ease: 'easeOut' },
              opacity: { duration: 0.6 },
              y: { duration: 2.2, repeat: Infinity, ease: 'easeInOut' },
            }}
            whileHover={{ scale: 1.2, x: 12 }}
          >
            <img
              src={`${basePath}${CHARACTER_SRC}`}
              alt="Find me!"
              className="h-16 w-auto select-none"
              draggable="false"
            />
          </motion.button>

          <AnimatePresence>
            {hint && (
              <motion.div
                className="ml-2 flex items-center gap-1 whitespace-nowrap"
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
              >
                <span className="font-mono text-sm text-accent-text">←</span>
                <span className="rounded-full bg-accent px-2.5 py-1 font-mono text-xs font-medium text-white shadow-lg">
                  click!
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* celebration */}
      <AnimatePresence>
        {celebrate && (
          <motion.div
            className="fixed inset-0 z-[70] flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {Array.from({ length: 36 }).map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-lg"
                style={{ color: i % 2 ? 'var(--accent)' : 'var(--accent-2)' }}
                initial={{ x: 0, y: 0, opacity: 1 }}
                animate={{
                  x: ((i % 6) - 2.5) * 120 + ((i * 7) % 60),
                  y: (Math.floor(i / 6) - 2.5) * 120 - ((i * 5) % 50),
                  opacity: 0,
                  rotate: i * 40,
                }}
                transition={{ duration: 1.8, ease: 'easeOut' }}
              >
                ✦
              </motion.span>
            ))}
            <motion.div
              className="rounded-2xl glass px-8 py-6 text-center shadow-2xl"
              initial={{ scale: 0.7 }}
              animate={{ scale: 1 }}
            >
              <p className="font-display text-2xl font-semibold">Found me 👀</p>
              <p className="mt-1 font-mono text-sm text-muted">
                nice eye, now go hire this person.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
