'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Brain } from 'lucide-react';
import type { ParticipantType } from './ConversationView';

interface TypingIndicatorProps {
  participant: ParticipantType;
  participants: Record<ParticipantType, { name: string; color: string; theme: string }>;
}

export default function TypingIndicator({ participant, participants }: TypingIndicatorProps) {
  const participantData = participants[participant];
  const isAI = participant === 'ai';
  const isUser = participant === 'user';
  const isOther = participant === 'other';

  const getAlignment = () => {
    if (isAI) return 'justify-center';
    if (isUser) return 'justify-start';
    if (isOther) return 'justify-end';
    return 'justify-center';
  };

  const getContainerStyle = () => {
    if (isAI) {
      return 'glass-morphism-dark border-teal-400/30 ai-glow max-w-xs';
    }
    
    const baseStyle = 'glass-morphism max-w-xs';
    const colorStyle = isUser 
      ? 'border-blue-400/40' 
      : 'border-purple-400/40';
    
    return `${baseStyle} ${colorStyle}`;
  };

  return (
    <motion.div
      className={`flex ${getAlignment()}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <div className={`${getContainerStyle()} rounded-2xl p-4`}>
        <div className="flex items-center gap-3">
          <motion.div
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: participantData.color }}
            animate={isAI ? {
              scale: [1, 1.2, 1],
              boxShadow: [
                `0 0 10px ${participantData.color}40`,
                `0 0 20px ${participantData.color}60`,
                `0 0 10px ${participantData.color}40`,
              ],
            } : {}}
            transition={isAI ? {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            } : {}}
          >
            {isAI ? (
              <Brain size={14} className="text-white" />
            ) : (
              <User size={14} className="text-white" />
            )}
          </motion.div>

          <div className="flex flex-col">
            <span className="text-sm font-medium" style={{ color: participantData.color }}>
              {participantData.name}
            </span>
            
            <div className="flex items-center gap-1 mt-1">
              {isAI ? (
                <motion.div
                  className="w-2 h-2 bg-teal-400 rounded-full"
                  animate={{
                    scale: [0.8, 1.4, 0.8],
                    opacity: [0.4, 1, 0.4],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                />
              ) : (
                <>
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: participantData.color }}
                      animate={{
                        scale: [0.8, 1.2, 0.8],
                        opacity: [0.3, 1, 0.3],
                      }}
                      transition={{
                        duration: 1.4,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: 'easeInOut',
                      }}
                    />
                  ))}
                </>
              )}
              
              <span className="text-xs text-gray-400 ml-2">
                {isAI ? 'thinking...' : 'typing...'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}