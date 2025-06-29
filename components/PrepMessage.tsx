'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Bot, User, HelpCircle } from 'lucide-react';
import type { PrepMessage as PrepMessageType } from './PrepPhaseView';

interface PrepMessageProps {
  message: PrepMessageType;
  isRecent: boolean;
}

export default function PrepMessage({ message, isRecent }: PrepMessageProps) {
  const isAI = message.sender === 'ai';
  const isUser = message.sender === 'user';
  
  const messageVariants = {
    hidden: { 
      opacity: 0, 
      y: 30,
      scale: 0.95
    },
    visible: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 150,
        damping: 25,
        duration: 0.8
      }
    }
  };

  const getMessageAlignment = () => {
    return isAI ? 'justify-center' : 'justify-start';
  };

  const getMessageStyle = () => {
    if (isAI) {
      return 'glass-morphism-dark border-teal-400/30 max-w-2xl mx-auto rounded-3xl';
    }
    return 'glass-morphism border-blue-400/40 max-w-xl rounded-3xl';
  };

  const getAvatarColor = () => {
    return isAI ? '#14b8a6' : '#3b82f6';
  };

  return (
    <motion.div
      className={`flex ${getMessageAlignment()}`}
      variants={messageVariants}
      initial="hidden"
      animate="visible"
    >
      <div className={getMessageStyle()}>
        {/* Avatar and name */}
        <div className="flex items-center gap-3 p-4 pb-2">
          <motion.div 
            className="w-8 h-8 rounded-full flex items-center justify-center"
            style={{ backgroundColor: getAvatarColor() }}
            whileHover={{ scale: 1.1 }}
            animate={isAI ? {
              boxShadow: [
                '0 0 20px rgba(20, 184, 166, 0.3)',
                '0 0 30px rgba(20, 184, 166, 0.5)',
                '0 0 20px rgba(20, 184, 166, 0.3)'
              ]
            } : {}}
            transition={isAI ? {
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut'
            } : {}}
          >
            {isAI ? (
              <Bot size={16} className="text-white" />
            ) : (
              <User size={16} className="text-white" />
            )}
          </motion.div>
          <span 
            className="text-sm font-medium"
            style={{ color: getAvatarColor() }}
          >
            {isAI ? 'AI Guide' : 'You'}
          </span>
          <span className="text-xs text-gray-400 ml-auto">
            {message.timestamp.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
          
          {/* Help tooltip for AI questions */}
          {isAI && message.content.includes('?') && (
            <motion.div
              className="ml-2 cursor-help"
              whileHover={{ scale: 1.1 }}
              title="I ask questions to better understand your situation"
            >
              <HelpCircle size={14} className="text-gray-400 hover:text-teal-400 transition-colors" />
            </motion.div>
          )}
        </div>
        
        {/* Message content */}
        <div className="px-4 pb-4">
          <motion.p 
            className="text-white leading-relaxed text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {message.content}
          </motion.p>
        </div>
      </div>
    </motion.div>
  );
}