'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit3, Copy, MessageSquare, Phone, Check, Sparkles, ExternalLink } from 'lucide-react';

interface InvitationPreviewProps {
  summary: string;
  onEdit: () => void;
  onProceed: () => void;
}

export default function InvitationPreview({ summary, onEdit, onProceed }: InvitationPreviewProps) {
  const [showInviteOptions, setShowInviteOptions] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [copied, setCopied] = useState(false);

  // Use hardcoded test URL
  const inviteLink = `${window.location.origin}/test`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(inviteLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link');
    }
  };

  const handleSendSMS = () => {
    const message = encodeURIComponent(`I'd like to have a conversation with you about our vacation planning. Join me here: ${inviteLink}`);
    window.open(`sms:${phoneNumber}?body=${message}`);
  };

  const handleStartConversation = () => {
    // Navigate to the test page
    window.open('/test', '_blank');
  };

  return (
    <motion.div
      className="bg-black/30 backdrop-blur-sm border-t border-white/10"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
    >
      <div className="p-6 max-w-3xl mx-auto">
        {/* Celebration particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`,
              }}
              initial={{ scale: 0, rotate: 0 }}
              animate={{
                scale: [0, 1, 0],
                rotate: [0, 180, 360],
                opacity: [0, 0.6, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'easeInOut',
              }}
            >
              <Sparkles className="w-4 h-4 text-teal-300" />
            </motion.div>
          ))}
        </div>

        <motion.div
          className="glass-morphism-dark rounded-3xl p-6 border-teal-400/30"
          animate={{
            boxShadow: [
              '0 0 30px rgba(20, 184, 166, 0.2)',
              '0 0 40px rgba(20, 184, 166, 0.3)',
              '0 0 30px rgba(20, 184, 166, 0.2)',
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="text-center mb-6">
            <motion.h3 
              className="text-xl font-semibold text-white mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              Here's how I'll introduce this to your partner:
            </motion.h3>
          </div>

          {/* Summary preview */}
          <motion.div
            className="glass-morphism rounded-2xl p-4 mb-6 border-l-4 border-teal-400"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-gray-200 leading-relaxed italic">
              "{summary}"
            </p>
          </motion.div>

          {/* Action buttons */}
          <div className="flex gap-4 justify-center mb-6">
            <motion.button
              onClick={onEdit}
              className="px-6 py-3 rounded-2xl glass-morphism-dark text-gray-300 hover:text-white transition-colors flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Edit3 size={18} />
              <span>Let me revise</span>
            </motion.button>

            <motion.button
              onClick={() => setShowInviteOptions(true)}
              className="px-8 py-3 rounded-2xl bg-teal-500 text-white flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: '0 0 30px rgba(20, 184, 166, 0.4)'
              }}
            >
              <Check size={18} />
              <span>Looks good</span>
            </motion.button>
          </div>

          {/* Invitation options */}
          <AnimatePresence>
            {showInviteOptions && (
              <motion.div
                className="border-t border-white/10 pt-6"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <h4 className="text-lg font-medium text-white mb-4 text-center">
                  How would you like to invite them?
                </h4>

                <div className="space-y-4">
                  {/* Start conversation directly */}
                  <motion.button
                    onClick={handleStartConversation}
                    className="w-full p-4 rounded-2xl bg-gradient-to-r from-teal-500 to-blue-500 hover:from-teal-600 hover:to-blue-600 transition-colors flex items-center gap-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ExternalLink size={20} className="text-white" />
                    <div className="flex-1 text-left">
                      <p className="text-white font-medium">Start the conversation now</p>
                      <p className="text-blue-100 text-sm">Opens in a new window - share your screen or send the link</p>
                    </div>
                  </motion.button>

                  {/* Copy link */}
                  <motion.button
                    onClick={handleCopyLink}
                    className="w-full p-4 rounded-2xl glass-morphism-dark hover:bg-white/10 transition-colors flex items-center gap-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Copy size={20} className="text-teal-400" />
                    <div className="flex-1 text-left">
                      <p className="text-white font-medium">Copy invitation link</p>
                      <p className="text-gray-400 text-sm">Share the link however you prefer</p>
                    </div>
                    {copied && (
                      <motion.span
                        className="text-green-400 text-sm"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                      >
                        Copied!
                      </motion.span>
                    )}
                  </motion.button>

                  {/* SMS option */}
                  <div className="p-4 rounded-2xl glass-morphism-dark">
                    <div className="flex items-center gap-3 mb-3">
                      <Phone size={20} className="text-teal-400" />
                      <div className="flex-1">
                        <p className="text-white font-medium">Send via text message</p>
                        <p className="text-gray-400 text-sm">We'll open your messaging app</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="Enter phone number"
                        className="flex-1 px-3 py-2 rounded-xl bg-black/30 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-400/50"
                      />
                      <motion.button
                        onClick={handleSendSMS}
                        disabled={!phoneNumber}
                        className="px-4 py-2 rounded-xl bg-teal-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: phoneNumber ? 1.05 : 1 }}
                        whileTap={{ scale: phoneNumber ? 0.95 : 1 }}
                      >
                        Send
                      </motion.button>
                    </div>
                  </div>
                </div>

                {/* What happens next */}
                <motion.div
                  className="mt-6 p-4 rounded-2xl bg-teal-500/10 border border-teal-400/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <h5 className="text-teal-400 font-medium mb-2 flex items-center gap-2">
                    <MessageSquare size={16} />
                    What happens next?
                  </h5>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    When they join, I'll introduce the topic based on our conversation and help facilitate a productive discussion. 
                    You'll both have equal time to share your perspectives in a structured, supportive environment.
                  </p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
}