'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

export default function PrepTypingIndicator() {
  return (
    <motion.div
      className="flex justify-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <div className="glass-morphism-dark border-teal-400/30 rounded-3xl p-4 max-w-xs">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-8 h-8 rounded-full flex items-center justify-center bg-teal-500"
            animate={{
              scale: [1, 1.1, 1],
              boxShadow: [
                '0 0 20px rgba(20, 184, 166, 0.4)',
                '0 0 30px rgba(20, 184, 166, 0.7)',
                '0 0 20px rgba(20, 184, 166, 0.4)',
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Brain size={16} className="text-white" />
          </motion.div>

          <div className="flex flex-col">
            <span className="text-sm font-medium text-teal-400">
              AI Guide
            </span>
            
            <div className="flex items-center gap-1 mt-1">
              <motion.div
                className="w-2 h-2 bg-teal-400 rounded-full"
                animate={{
                  scale: [0.8, 1.4, 0.8],
                  opacity: [0.4, 1, 0.4],
                }}
                transition={{
                  duration: 1.8,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              
              <span className="text-xs text-gray-400 ml-2">
                thinking deeply...
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}