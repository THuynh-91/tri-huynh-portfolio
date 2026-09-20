import { useEffect, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';

// An accent ring that tracks the pointer 1:1 (no lag). Desktop only.
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [hidden, setHidden] = useState(true);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches;
    if (!finePointer) return;

    setEnabled(true);
    document.documentElement.classList.add('cursor-enabled');

    // mousemove fires at pointer polling rate, so nothing in here may do work that
    // is not strictly needed: no setState unless the value actually changed, and the
    // closest() walk only when the element under the pointer is a different one.
    let lastTarget = null;
    let lastHovering = null;
    let lastHidden = null;
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (lastHidden !== false) {
        lastHidden = false;
        setHidden(false);
      }
      if (e.target !== lastTarget) {
        lastTarget = e.target;
        const interactive = Boolean(
          e.target.closest('a, button, [data-cursor="hover"], input, textarea')
        );
        if (interactive !== lastHovering) {
          lastHovering = interactive;
          setHovering(interactive);
        }
      }
    };
    const leave = () => {
      lastHidden = true;
      setHidden(true);
    };

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseleave', leave);
    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', leave);
      document.documentElement.classList.remove('cursor-enabled');
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      className="cursor-ring"
      style={{
        x,
        y,
        opacity: hidden ? 0 : 1,
        width: hovering ? 48 : 26,
        height: hovering ? 48 : 26,
        backgroundColor: hovering ? 'var(--accent-soft)' : 'transparent',
        borderColor: 'var(--accent)',
      }}
      // Keep the ring centred on the real pointer position. Framer's x/y
      // transform would otherwise overwrite the CSS translate(-50%, -50%),
      // leaving the ring's top-left on the cursor (so clicks land off-centre).
      transformTemplate={(_, generated) => `translate(-50%, -50%) ${generated}`}
      transition={{ width: { duration: 0.15 }, height: { duration: 0.15 } }}
    />
  );
}
