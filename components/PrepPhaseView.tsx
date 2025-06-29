'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import PrepMessageList from './PrepMessageList';
import InputArea from './InputArea';
import InvitationPreview from './InvitationPreview';
import PrepProgressIndicator from './PrepProgressIndicator';

const DynamicParticleBackground = dynamic(() => import('./ParticleBackground'), { 
  ssr: false,
  loading: () => null
});

export type PrepPhase = 'understanding' | 'framing' | 'ready';

export interface PrepMessage {
  id: string;
  sender: 'user' | 'ai';
  content: string;
  timestamp: Date;
  phase: PrepPhase;
  isTyping?: boolean;
}

const getInitialMessage = (): PrepMessage => ({
  id: 'initial',
  sender: 'ai',
  content: "Hi! I'm here to help you prepare for a productive conversation with someone important to you. This is a private prep session - nothing is saved and it will auto-delete when we're done.\n\nTake your time and share what's on your mind. What situation would you like to discuss with them?",
  timestamp: new Date(),
  phase: 'understanding'
});

const aiResponses = {
  understanding: [
    "I hear you're feeling frustrated. Tell me what's making this situation difficult?",
    "That sounds challenging. Can you help me understand what's most important to you here?",
    "I can sense this matters to you. What would you most want the other person to understand?",
    "It sounds like there are different perspectives at play. What's your main concern?",
    "Help me understand - what's making this feel stuck for you?"
  ],
  framing: [
    "What would a good outcome look like for both of you?",
    "If this conversation went really well, what would change?",
    "What do you think they might be feeling about this situation?",
    "What's the most important thing for them to hear from you?",
    "How would you want to feel after this conversation?"
  ],
  ready: [
    "I think I understand the situation now. Let me help you frame this constructively.",
    "You've shared some important insights. Here's how we might approach this together.",
    "Based on what you've told me, I can help create a good foundation for this conversation."
  ]
};

// Create participants object that matches the main chat format
const participants = {
  user: { name: 'You', color: '#3b82f6', theme: 'blue' },
  other: { name: 'Other', color: '#8b5cf6', theme: 'purple' },
  ai: { name: 'AI', color: '#14b8a6', theme: 'teal' }
};

export default function PrepPhaseView() {
  const [messages, setMessages] = useState<PrepMessage[]>([getInitialMessage()]);
  const [currentPhase, setCurrentPhase] = useState<PrepPhase>('understanding');
  const [thinking, setThinking] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [showInvitation, setShowInvitation] = useState(false);
  const [conversationSummary, setConversationSummary] = useState('');
  const [isClient, setIsClient] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);

  // Handle client-side mounting and reset data on page load
  useEffect(() => {
    setIsClient(true);
    // Reset all data when component mounts (page refresh)
    setMessages([getInitialMessage()]);
    setCurrentPhase('understanding');
    setThinking(false);
    setInputValue('');
    setShowInvitation(false);
    setConversationSummary('');
  }, []);

  // Auto-scroll function
  const scrollToBottom = (behavior: 'smooth' | 'instant' = 'smooth', delay = 0) => {
    const scroll = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior, block: 'end' });
      }
      if (messageListRef.current) {
        messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      }
    };

    if (delay > 0) {
      setTimeout(scroll, delay);
    } else {
      scroll();
    }
  };

  // Auto-scroll when messages change
  useEffect(() => {
    if (isClient) {
      scrollToBottom('smooth', 100);
    }
  }, [messages, isClient]);

  // Auto-scroll when thinking state changes
  useEffect(() => {
    if (thinking && isClient) {
      scrollToBottom('smooth', 200);
    }
  }, [thinking, isClient]);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    const newMessage: PrepMessage = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'user',
      content,
      timestamp: new Date(),
      phase: currentPhase
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');

    // Determine next phase based on message count and content
    const userMessages = messages.filter(m => m.sender === 'user').length + 1;
    let nextPhase = currentPhase;
    
    if (currentPhase === 'understanding' && userMessages >= 3) {
      nextPhase = 'framing';
    } else if (currentPhase === 'framing' && userMessages >= 5) {
      nextPhase = 'ready';
    }

    // AI responds
    setTimeout(() => {
      setThinking(true);
      if (isClient) {
        scrollToBottom('smooth', 100);
      }

      setTimeout(() => {
        let aiResponse = '';
        
        if (nextPhase === 'ready' && !showInvitation) {
          aiResponse = "Based on what you've shared, I think I understand the situation. You're looking for rest and relaxation, while your partner wants adventure and activities. You both care about the vacation but have different ways of recharging. Let me help you frame this constructively for your conversation.";
          setShowInvitation(true);
          setConversationSummary("You and your partner have different vacation preferences - you need rest and relaxation to recharge from work stress, while they're excited about adventure and activities. You both want the vacation to be meaningful but approach it differently.");
        } else {
          const responses = aiResponses[nextPhase];
          aiResponse = responses[Math.floor(Math.random() * responses.length)];
        }

        const aiMessage: PrepMessage = {
          id: Math.random().toString(36).substr(2, 9),
          sender: 'ai',
          content: aiResponse,
          timestamp: new Date(),
          phase: nextPhase
        };

        setMessages(prev => [...prev, aiMessage]);
        setThinking(false);
        setCurrentPhase(nextPhase);
      }, 2500);
    }, 1000);
  };

  const handlePassTurn = () => {
    // In prep mode, passing turn doesn't make sense, so we'll just clear the input
    setInputValue('');
  };

  const handleStartOver = () => {
    setMessages([getInitialMessage()]);
    setCurrentPhase('understanding');
    setShowInvitation(false);
    setInputValue('');
    setConversationSummary('');
  };

  if (!isClient) {
    return (
      <div className="h-screen w-full relative overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 40%, #16213e 100%)'
          }}
        />
      </div>
    );
  }

  return (
    <div className="h-screen w-full relative overflow-hidden">
      {/* Background */}
      <motion.div 
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 40%, #16213e 100%)'
        }}
      />

      {/* Subtle animated overlay */}
      <motion.div
        className="absolute inset-0 opacity-20"
        initial={{
          background: 'radial-gradient(circle at 20% 20%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)'
        }}
        animate={{
          background: [
            'radial-gradient(circle at 20% 20%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 80%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 20%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)'
          ]
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Particle background */}
      <DynamicParticleBackground currentSpeaker="user" />

      {/* Main container */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Simple header */}
        <motion.div 
          className="flex-shrink-0 p-4 glass-morphism-dark border-b border-white/10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <motion.div 
                className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-400 to-blue-500"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div>
                <h1 className="text-lg font-semibold text-white">Lumunus</h1>
                <p className="text-sm text-gray-300">Prep Session</p>
              </div>
            </div>
            
            {/* Progress indicator */}
            <PrepProgressIndicator currentPhase={currentPhase} />
          </div>
        </motion.div>

        {/* Messages area */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <PrepMessageList 
            ref={messageListRef}
            messages={messages}
            thinking={thinking}
            currentPhase={currentPhase}
          />
          <div ref={messagesEndRef} />
        </div>

        {/* Invitation preview */}
        <AnimatePresence>
          {showInvitation && (
            <InvitationPreview 
              summary={conversationSummary}
              onEdit={() => setShowInvitation(false)}
              onProceed={() => {}}
            />
          )}
        </AnimatePresence>

        {/* Input area - using the same component as main chat */}
        <div className="flex-shrink-0">
          <InputArea
            currentTurn="user"
            participants={participants}
            aiTakeover={false}
            inputValue={inputValue}
            setInputValue={setInputValue}
            onSendMessage={handleSendMessage}
            onPassTurn={handlePassTurn}
          />
        </div>
      </div>
    </div>
  );
}