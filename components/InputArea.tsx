'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, SkipForward } from 'lucide-react';
import type { ParticipantType } from './ConversationView';

interface InputAreaProps {
  currentTurn: ParticipantType;
  participants: Record<ParticipantType, { name: string; color: string; theme: string }>;
  aiTakeover: boolean;
  inputValue: string;
  setInputValue: (value: string) => void;
  onSendMessage: (content: string) => void;
  onPassTurn: () => void;
}

export default function InputArea({
  currentTurn,
  participants,
  aiTakeover,
  inputValue,
  setInputValue,
  onSendMessage,
  onPassTurn
}: InputAreaProps) {
  const [showPassTurn, setShowPassTurn] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isUserTurn = currentTurn === 'user' && !aiTakeover;
  const currentParticipant = participants['user']; // Always show user's color

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to auto to get the correct scrollHeight
      textarea.style.height = 'auto';
      
      // Calculate new height based on content
      const newHeight = Math.min(textarea.scrollHeight, 120); // Max height of 120px (about 5 lines)
      textarea.style.height = `${newHeight}px`;
    }
  }, [inputValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && isUserTurn) {
      onSendMessage(inputValue);
      setShowPassTurn(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    setShowPassTurn(e.target.value.length > 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.shiftKey) {
        // Shift+Enter: Insert new line (default behavior, don't prevent)
        return;
      } else {
        // Regular Enter: Submit message
        e.preventDefault();
        if (inputValue.trim() && isUserTurn) {
          onSendMessage(inputValue);
          setShowPassTurn(false);
        }
      }
    }
  };

  const getTurnMessage = () => {
    if (aiTakeover) return "AI is facilitating...";
    
    switch (currentTurn) {
      case 'user':
        return "Your turn to speak";
      case 'other':
        return "Mike is responding...";
      case 'ai':
        return "AI is thinking...";
      default:
        return "Waiting...";
    }
  };

  const getTurnColor = () => {
    if (aiTakeover) return participants.ai.color;
    return participants[currentTurn].color;
  };

  // Only show input area when it's the user's turn AND not during AI takeover
  const showInputArea = isUserTurn;

  return (
    <AnimatePresence>
      {showInputArea && (
        <motion.div
          className="bg-black/20 backdrop-blur-sm border-t border-white/10"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
          <div className="p-4">
            {/* Turn indicator */}
            <motion.div 
              className="mb-3 text-center"
            >
              <motion.p 
                className="text-sm font-medium"
                style={{ color: currentParticipant.color }}
                animate={{ 
                  scale: [1, 1.05, 1]
                }}
                transition={{ 
                  scale: { duration: 2, repeat: Infinity }
                }}
              >
                Your turn to speak
              </motion.p>
            </motion.div>

            {/* Input form */}
            <form onSubmit={handleSubmit} className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <motion.textarea
                  ref={textareaRef}
                  value={inputValue}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Share your thoughts... (Shift+Enter for new line)"
                  className="w-full px-4 py-3 rounded-2xl glass-morphism-dark text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring-color)] resize-none min-h-[48px] overflow-y-auto leading-relaxed"
                  style={{
                    '--focus-ring-color': currentParticipant.color,
                    height: '48px', // Initial height
                    maxHeight: '120px', // Max height for about 5 lines
                    scrollbarWidth: 'thin',
                    scrollbarColor: `${currentParticipant.color}40 transparent`
                  } as React.CSSProperties}
                />
                
                {/* Focus glow effect */}
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 focus-within:opacity-100"
                  style={{
                    boxShadow: `0 0 20px ${currentParticipant.color}40`
                  }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 items-end">
                <AnimatePresence>
                  {showPassTurn && (
                    <motion.button
                      type="button"
                      onClick={onPassTurn}
                      className="px-4 py-3 rounded-2xl glass-morphism-dark text-gray-300 hover:text-white transition-colors flex items-center gap-2 min-w-[44px] h-[48px]"
                      initial={{ opacity: 0, scale: 0.8, x: 20 }}
                      animate={{ opacity: 1, scale: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.8, x: 20 }}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <SkipForward size={18} />
                      <span className="text-sm">Pass</span>
                    </motion.button>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={!inputValue.trim()}
                  className="px-4 py-3 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[44px] h-[48px]"
                  style={{
                    backgroundColor: currentParticipant.color
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    boxShadow: inputValue 
                      ? `0 0 20px ${currentParticipant.color}60` 
                      : 'none'
                  }}
                >
                  <Send size={18} className="text-white" />
                </motion.button>
              </div>
            </form>

            {/* Keyboard shortcut hint */}
            <motion.p
              className="text-xs text-gray-500 mt-2 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.5 }}
            >
              This conversation will auto-delete at the end of the session.
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}