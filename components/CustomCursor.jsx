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

    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);
      const interactive = e.target.closest(
        'a, button, [data-cursor="hover"], input, textarea'
      );
      setHovering(Boolean(interactive));
    };
    const leave = () => setHidden(true);

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
