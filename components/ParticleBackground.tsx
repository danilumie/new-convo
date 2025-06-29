'use client';

import React, { memo } from 'react';
import { motion } from 'framer-motion';
import type { ParticipantType } from './ConversationView';

interface ParticleBackgroundProps {
  currentSpeaker: ParticipantType;
}

// Memoize the component to prevent unnecessary re-renders
const ParticleBackground = memo(function ParticleBackground({ currentSpeaker }: ParticleBackgroundProps) {
  // Use a completely fixed color that never changes
  const particleColor = '#3b82f6';

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Main geometric shapes */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`geo-${i}`}
          className="absolute opacity-5"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${60 + Math.random() * 120}px`,
            height: `${60 + Math.random() * 120}px`,
            background: `linear-gradient(45deg, ${particleColor}20, transparent)`,
            borderRadius: i % 2 === 0 ? '50%' : '20%',
          }}
          animate={{
            x: [0, Math.random() * 100 - 50, 0],
            y: [0, Math.random() * 100 - 50, 0],
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Floating particles */}
      {[...Array(15)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-1 h-1 rounded-full opacity-30"
          style={{
            backgroundColor: particleColor,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [0, -200, 0],
            x: [0, Math.random() * 100 - 50, 0],
            opacity: [0, 1, 0],
            scale: [0.5, 1.5, 0.5],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* Gradient orbs */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`orb-${i}`}
          className="absolute rounded-full opacity-10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${200 + Math.random() * 200}px`,
            height: `${200 + Math.random() * 200}px`,
            background: `radial-gradient(circle, ${particleColor}40, transparent 70%)`,
            filter: 'blur(40px)',
          }}
          animate={{
            x: [0, Math.random() * 200 - 100, 0],
            y: [0, Math.random() * 200 - 100, 0],
            scale: [0.8, 1.2, 0.8],
            opacity: [0.05, 0.15, 0.05],
          }}
          transition={{
            duration: 15 + Math.random() * 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: Math.random() * 5,
          }}
        />
      ))}

      {/* Static mesh gradient */}
      <motion.div
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            radial-gradient(circle at 20% 80%, ${particleColor}20 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, ${particleColor}15 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, ${particleColor}10 0%, transparent 50%)
          `,
        }}
        animate={{
          opacity: [0.1, 0.3, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </div>
  );
});

export default ParticleBackground;