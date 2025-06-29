'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Search, Target, CheckCircle } from 'lucide-react';
import type { PrepPhase } from './PrepPhaseView';

interface PrepProgressIndicatorProps {
  currentPhase: PrepPhase;
}

const phases = [
  { key: 'understanding', label: 'Understanding', icon: Search },
  { key: 'framing', label: 'Framing', icon: Target },
  { key: 'ready', label: 'Ready to Invite', icon: CheckCircle }
];

export default function PrepProgressIndicator({ currentPhase }: PrepProgressIndicatorProps) {
  const currentIndex = phases.findIndex(phase => phase.key === currentPhase);

  return (
    <div className="flex items-center justify-center gap-8">
      {phases.map((phase, index) => {
        const isActive = index === currentIndex;
        const isCompleted = index < currentIndex;
        const Icon = phase.icon;
        
        return (
          <div key={phase.key} className="flex items-center gap-2">
            <motion.div
              className="relative flex items-center gap-3"
              animate={{
                scale: isActive ? 1.05 : 1,
                opacity: isActive ? 1 : isCompleted ? 0.8 : 0.5,
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: isActive ? '#14b8a6' : isCompleted ? '#059669' : '#374151',
                }}
                animate={{
                  boxShadow: isActive 
                    ? '0 0 20px rgba(20, 184, 166, 0.5)'
                    : 'none',
                }}
              >
                <Icon size={18} className="text-white" />
              </motion.div>
              
              <span 
                className="text-sm font-medium"
                style={{ 
                  color: isActive ? '#14b8a6' : isCompleted ? '#10b981' : '#9ca3af' 
                }}
              >
                {phase.label}
              </span>

              {/* Active pulse ring */}
              {isActive && (
                <motion.div
                  className="absolute left-0 w-10 h-10 rounded-full border-2 border-teal-400"
                  animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.8, 0, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              )}
            </motion.div>

            {/* Connector line */}
            {index < phases.length - 1 && (
              <motion.div
                className="w-12 h-0.5 mx-2"
                style={{
                  backgroundColor: index < currentIndex ? '#10b981' : '#374151',
                }}
                animate={{
                  backgroundColor: index < currentIndex ? '#10b981' : '#374151',
                }}
                transition={{ duration: 0.5 }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}