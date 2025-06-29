'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User } from 'lucide-react';
import type { Message as MessageType, ParticipantType } from './ConversationView';

interface MessageProps {
  message: MessageType;
  participants: Record<ParticipantType, { name: string; color: string; theme: string }>;
  isRecent: boolean;
  aiTakeover: boolean;
  thinking: ParticipantType | null;
}

export default function Message({ message, participants, isRecent, aiTakeover, thinking }: MessageProps) {
  const participant = participants[message.sender];
  const isAI = message.sender === 'ai';
  const isUser = message.sender === 'user';
  const isOther = message.sender === 'other';
  const isAIActivelyThinking = thinking === 'ai';
  
  const messageVariants = {
    hidden: { 
      opacity: 0, 
      x: isAI ? 0 : isUser ? -50 : 50,
      scale: isAI ? 0.8 : 1,
      y: 20
    },
    visible: { 
      opacity: 1, 
      x: 0,
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 20,
        duration: 0.6
      }
    }
  };

  const getMessageAlignment = () => {
    if (isAI) return 'justify-center';
    if (isUser) return 'justify-start';
    if (isOther) return 'justify-end';
    return 'justify-center';
  };

  const getMessageStyle = () => {
    if (isAI) {
      // Only show glow when AI is actively thinking or during takeover
      const glowClass = (isAIActivelyThinking || aiTakeover) ? 'ai-glow' : '';
      return `glass-morphism-dark border-teal-400/30 max-w-2xl mx-auto rounded-2xl ${glowClass}`;
    }
    
    const baseStyle = 'glass-morphism max-w-xs rounded-2xl';
    const colorStyle = isUser 
      ? 'border-blue-400/40' 
      : 'border-purple-400/40';
    
    return `${baseStyle} ${colorStyle}`;
  };

  return (
    <motion.div
      className={`flex ${getMessageAlignment()}`}
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      style={{
        opacity: aiTakeover ? 0.4 : (isRecent ? 1 : 0.9)
      }}
    >
      <div className={getMessageStyle()}>
        {/* Avatar and name */}
        <div className="flex items-center gap-2 p-3 pb-2">
          <motion.div 
            className="w-6 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: participant.color }}
            whileHover={{ scale: 1.1 }}
          >
            {isAI ? (
              <Bot size={14} className="text-white" />
            ) : (
              <User size={14} className="text-white" />
            )}
          </motion.div>
          <span 
            className="text-sm font-medium"
            style={{ color: participant.color }}
          >
            {participant.name}
          </span>
          <span className="text-xs text-gray-400 ml-auto">
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        </div>
        
        {/* Message content */}
        <div className="px-3 pb-3">
          <motion.p 
            className="text-white leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            {message.content}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}