'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import type { ParticipantType } from './ConversationView';

interface TurnIndicatorProps {
  currentTurn: ParticipantType;
  participants: Record<ParticipantType, { name: string; color: string; theme: string }>;
}

export default function TurnIndicator({ currentTurn, participants }: TurnIndicatorProps) {
  return (
    <div className="flex items-center gap-4">
      {Object.entries(participants).map(([key, participant]) => {
        const isActive = key === currentTurn;
        const participantKey = key as ParticipantType;
        const isParticipantAI = participantKey === 'ai';
        
        return (
          <motion.div
            key={key}
            className="flex items-center gap-2"
            animate={{
              scale: isActive ? 1.1 : 0.9,
              opacity: isActive ? 1 : 0.6,
            }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <motion.div
              className="relative w-8 h-8 rounded-full flex items-center justify-center"
              style={{ 
                backgroundColor: isActive ? participant.color : `${participant.color}40`,
              }}
              animate={{
                boxShadow: isActive 
                  ? `0 0 20px ${participant.color}60, 0 0 40px ${participant.color}30`
                  : 'none',
              }}
              transition={{ duration: 0.3 }}
            >
              {isParticipantAI ? (
                <Bot size={16} className="text-white" />
              ) : (
                <User size={16} className="text-white" />
              )}
              
              {/* Active pulse ring */}
              {isActive && (
                <motion.div
                  className="absolute inset-0 rounded-full border-2"
                  style={{ borderColor: participant.color }}
                  animate={{
                    scale: [1, 1.5, 1],
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
            
            <div className="hidden sm:block">
              <motion.p
                className="text-sm font-medium"
                style={{ color: isActive ? participant.color : '#9CA3AF' }}
                animate={{
                  y: isActive ? [0, -2, 0] : 0,
                }}
                transition={{
                  duration: 2,
                  repeat: isActive ? Infinity : 0,
                  ease: 'easeInOut',
                }}
              >
                {participant.name}
              </motion.p>
              {isActive && (
                <motion.p
                  className="text-xs text-gray-400"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Speaking...
                </motion.p>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}