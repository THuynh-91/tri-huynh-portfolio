import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function Floating3DElement() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Calculate mouse position relative to viewport center
      const x = (e.clientX - window.innerWidth / 2) / 50;
      const y = (e.clientY - window.innerHeight / 2) / 50;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed top-32 left-12 z-10 pointer-events-none hidden lg:block">
      {/* 3D Cube */}
      <motion.div
        className="relative w-40 h-40"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1200px',
        }}
        animate={{
          rotateX: 15 + mousePosition.y * 3,
          rotateY: 15 + mousePosition.x * 3,
          rotateZ: [0, 360],
        }}
        transition={{
          rotateZ: {
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          },
          rotateX: {
            type: 'spring',
            stiffness: 50,
            damping: 10,
          },
          rotateY: {
            type: 'spring',
            stiffness: 50,
            damping: 10,
          },
        }}
      >
        {/* Cube faces */}
        <div className="absolute w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 backdrop-blur-sm border border-primary/50 rounded-lg"
          style={{ transform: 'translateZ(64px)' }} />
        <div className="absolute w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 backdrop-blur-sm border border-primary/50 rounded-lg"
          style={{ transform: 'translateZ(-64px) rotateY(180deg)' }} />
        <div className="absolute w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 backdrop-blur-sm border border-primary/50 rounded-lg"
          style={{ transform: 'rotateY(-90deg) translateZ(64px)' }} />
        <div className="absolute w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 backdrop-blur-sm border border-primary/50 rounded-lg"
          style={{ transform: 'rotateY(90deg) translateZ(64px)' }} />
        <div className="absolute w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 backdrop-blur-sm border border-primary/50 rounded-lg"
          style={{ transform: 'rotateX(90deg) translateZ(64px)' }} />
        <div className="absolute w-full h-full bg-gradient-to-br from-primary/30 to-accent/30 backdrop-blur-sm border border-primary/50 rounded-lg"
          style={{ transform: 'rotateX(-90deg) translateZ(64px)' }} />
      </motion.div>

      {/* Floating Orbs */}
      <div className="absolute -top-20 -left-20">
        <motion.div
          className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="absolute -bottom-10 -right-10">
        <motion.div
          className="w-32 h-32 rounded-full bg-gradient-to-br from-accent/20 to-transparent blur-xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </div>
    </div>
  );
}
