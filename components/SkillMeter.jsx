import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function SkillMeter({ skill, level, delay = 0 }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="mb-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-300">{skill}</span>
        <motion.span
          className="text-sm font-bold text-primary"
          animate={{ scale: isHovered ? 1.1 : 1 }}
        >
          {level}%
        </motion.span>
      </div>
      <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true }}
          transition={{ delay: delay + 0.2, duration: 1, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-primary to-accent rounded-full relative"
          animate={{
            boxShadow: isHovered
              ? '0 0 20px var(--color-primary)'
              : '0 0 0px var(--color-primary)'
          }}
        >
          <motion.div
            className="absolute inset-0 bg-white opacity-20"
            animate={{
              x: isHovered ? [0, 100, 0] : 0
            }}
            transition={{
              duration: 1,
              repeat: isHovered ? Infinity : 0,
              ease: "linear"
            }}
            style={{
              width: '50%',
              filter: 'blur(10px)'
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
