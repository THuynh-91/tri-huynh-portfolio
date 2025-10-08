import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function AnimatedCounter({ value, duration = 2, suffix = '', prefix = '' }) {
  const [hasAnimated, setHasAnimated] = useState(false);
  const count = useMotionValue(0);
  const rounded = useTransform(count, Math.round);

  useEffect(() => {
    if (hasAnimated) return;

    const controls = animate(count, value, {
      duration,
      onComplete: () => setHasAnimated(true)
    });

    return controls.stop;
  }, [count, value, duration, hasAnimated]);

  return (
    <motion.span>
      {prefix}
      <motion.span>{rounded}</motion.span>
      {suffix}
    </motion.span>
  );
}
