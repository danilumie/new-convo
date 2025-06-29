'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dynamic from 'next/dynamic';
import MessageList from './MessageList';
import InputArea from './InputArea';
import TurnIndicator from './TurnIndicator';
import AITakeoverOverlay from './AITakeoverOverlay';

const DynamicParticleBackground = dynamic(() => import('./ParticleBackground'), { 
  ssr: false,
  loading: () => null
});

export type ParticipantType = 'user' | 'other' | 'ai';

export interface Message {
  id: string;
  sender: ParticipantType;
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

const participants = {
  user: { name: 'You', color: '#3b82f6', theme: 'blue' },
  other: { name: 'Mike', color: '#8b5cf6', theme: 'purple' },
  ai: { name: 'AI', color: '#14b8a6', theme: 'teal' }
};

const sampleMessages: Message[] = [
  {
    id: '1',
    sender: 'ai',
    content: "Welcome! I'm here to help you both discuss the vacation planning. Would you like to start by sharing your thoughts?",
    timestamp: new Date(Date.now() - 180000)
  },
  {
    id: '2',
    sender: 'user',
    content: "I really think we should go somewhere warm. I'm tired of cold weather.",
    timestamp: new Date(Date.now() - 120000)
  },
  {
    id: '3',
    sender: 'other',
    content: "But skiing would be so fun! Plus warm places are expensive in winter",
    timestamp: new Date(Date.now() - 60000)
  }
];

// AI responses for different conversation stages
const aiResponses = [
  "I'm noticing you both have different preferences for climate. Let's explore what's most important to each of you about this vacation. What would make this trip feel most meaningful to you both?",
  "That's a great point about budget considerations. How do you feel about Mike's concern regarding costs? Are there ways we could find warm destinations that work within your budget?",
  "I hear both of your perspectives. It sounds like you value relaxation and warmth, while Mike is excited about activities and being mindful of expenses. What if we explored options that could satisfy both needs?",
  "This is productive! You're both sharing your core values around this trip. Let's dig deeper - what does the perfect vacation day look like for each of you?",
  "I'm sensing some common ground emerging. Both of you seem to value quality time together. How might we build on that shared priority?",
  "Excellent discussion! You're both being very thoughtful about each other's needs. What compromises feel most comfortable to you both?",
  "I can see you're both working hard to understand each other's perspective. That's wonderful! What questions do you have for each other about your vacation preferences?",
  "This conversation is really evolving nicely. You're both showing great flexibility. What feels like the most important thing to get right about this trip?",
  "I'm impressed by how well you're both listening to each other. What aspects of this vacation planning feel most exciting to you both now?",
  "Great progress! You're finding ways to honor both of your needs. What would help you feel most confident about moving forward with a decision?"
];

// Mock responses from the other participant
const otherResponses = [
  "Actually, you make a good point about the weather. Maybe we could find somewhere that has both warm weather and some activities?",
  "I've been thinking about what you said, and I realize I might be too focused on the budget. What if we look for deals?",
  "You know what, I'm starting to see your perspective. Relaxation does sound really nice after this stressful year.",
  "I found some places that might work for both of us - they have warm weather but also hiking and outdoor activities.",
  "Maybe we could do a mix? A few days of relaxation and a few days of more active stuff?",
  "I'm sorry if I seemed too focused on costs. This trip is important and we should make it special.",
  "What if we each pick our top 3 destinations and see if there's any overlap?",
  "I'm really excited about planning this together. Thanks for being patient with my concerns.",
  "You're right that we both want quality time. That's what matters most to me too.",
  "I think we're getting closer to something we'll both love. Should we start looking at specific places?"
];

interface ConversationViewProps {
  sessionId?: string;
}

export default function ConversationView({ sessionId }: ConversationViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentTurn, setCurrentTurn] = useState<ParticipantType>('user');
  const [aiTakeover, setAiTakeover] = useState(false);
  const [thinking, setThinking] = useState<ParticipantType | null>(null);
  const [inputValue, setInputValue] = useState('');
  const [aiResponseIndex, setAiResponseIndex] = useState(0);
  const [otherResponseIndex, setOtherResponseIndex] = useState(0);
  const [backgroundState, setBackgroundState] = useState<'normal' | 'ai-takeover' | 'submit'>('normal');
  const [isClient, setIsClient] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messageListRef = useRef<HTMLDivElement>(null);

  // Handle client-side mounting and initialize fresh session
  useEffect(() => {
    setIsClient(true);
    // Always start with fresh data for each session
    setMessages(sampleMessages);
    setCurrentTurn('user');
    setAiTakeover(false);
    setThinking(null);
    setInputValue('');
    setAiResponseIndex(0);
    setOtherResponseIndex(0);
    setBackgroundState('normal');
  }, [sessionId]); // Reset when sessionId changes

  // Robust scroll function that ensures scrolling happens
  const scrollToBottom = (behavior: 'smooth' | 'instant' = 'smooth', delay = 0) => {
    const scroll = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior, block: 'end' });
      }
      // Fallback: scroll the message list container directly
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

  // Auto-scroll when AI takeover starts
  useEffect(() => {
    if (aiTakeover && isClient) {
      scrollToBottom('smooth', 150);
    }
  }, [aiTakeover, isClient]);

  // Auto-scroll when turn changes (to show new turn indicator)
  useEffect(() => {
    if (isClient) {
      scrollToBottom('smooth', 100);
    }
  }, [currentTurn, isClient]);

  // Update background state only when AI takeover changes
  useEffect(() => {
    setBackgroundState(aiTakeover ? 'ai-takeover' : 'normal');
  }, [aiTakeover]);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    // Trigger submit animation
    setBackgroundState('submit');
    
    const newMessage: Message = {
      id: Math.random().toString(36).substr(2, 9),
      sender: 'user',
      content,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    
    // Clear input immediately and switch turn
    setInputValue('');
    setCurrentTurn('other');

    // Reset background after submit animation
    setTimeout(() => {
      setBackgroundState('normal');
    }, 800);

    // Simulate other participant responding
    setTimeout(() => {
      setThinking('other');
      // Ensure scroll when other starts thinking
      if (isClient) {
        scrollToBottom('smooth', 100);
      }
      
      setTimeout(() => {
        const otherMessage: Message = {
          id: Math.random().toString(36).substr(2, 9),
          sender: 'other',
          content: otherResponses[otherResponseIndex % otherResponses.length],
          timestamp: new Date()
        };

        setMessages(prev => [...prev, otherMessage]);
        setThinking(null);
        setOtherResponseIndex(prev => prev + 1);

        // Then AI responds
        setTimeout(() => {
          setCurrentTurn('ai');
          setAiTakeover(true);
          setThinking('ai');
          // Ensure scroll when AI starts thinking
          if (isClient) {
            scrollToBottom('smooth', 100);
          }

          setTimeout(() => {
            const aiMessage: Message = {
              id: Math.random().toString(36).substr(2, 9),
              sender: 'ai',
              content: aiResponses[aiResponseIndex % aiResponses.length],
              timestamp: new Date()
            };

            setMessages(prev => [...prev, aiMessage]);
            setThinking(null);
            setAiResponseIndex(prev => prev + 1);

            // Return turn to user after AI finishes
            setTimeout(() => {
              setAiTakeover(false);
              setCurrentTurn('user');
            }, 1000);
          }, 2500);
        }, 1500);
      }, 2000);
    }, 1000);
  };

  const handlePassTurn = () => {
    // Clear input and switch turn
    setInputValue('');
    setCurrentTurn('other');
    
    // In single-person mode, passing just triggers the other participant
    setThinking('other');
    // Ensure scroll when other starts thinking
    if (isClient) {
      scrollToBottom('smooth', 100);
    }
    
    setTimeout(() => {
      const otherMessage: Message = {
        id: Math.random().toString(36).substr(2, 9),
        sender: 'other',
        content: otherResponses[otherResponseIndex % otherResponses.length],
        timestamp: new Date()
      };

      setMessages(prev => [...prev, otherMessage]);
      setThinking(null);
      setOtherResponseIndex(prev => prev + 1);
      
      // Return turn to user after other participant responds
      setTimeout(() => {
        setCurrentTurn('user');
      }, 1000);
    }, 2000);
  };

  const getBackgroundGradient = () => {
    switch (backgroundState) {
      case 'ai-takeover':
        return 'linear-gradient(180deg, #1e1b4b 0%, #312e81 30%, #1e293b 100%)';
      case 'submit':
        return 'linear-gradient(180deg, #0f172a 0%, #1e293b 40%, #0f172a 100%)';
      default:
        return 'linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 40%, #16213e 100%)';
    }
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
      {/* Dynamic background with submit animation */}
      <motion.div 
        className="absolute inset-0"
        animate={{
          background: getBackgroundGradient()
        }}
        transition={{ duration: backgroundState === 'submit' ? 0.3 : 1.5, ease: 'easeInOut' }}
      />

      {/* Submit pulse overlay */}
      <AnimatePresence>
        {backgroundState === 'submit' && (
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ 
              opacity: [0, 0.3, 0],
              background: [
                'radial-gradient(circle at center, rgba(59, 130, 246, 0) 0%, transparent 100%)',
                'radial-gradient(circle at center, rgba(59, 130, 246, 0.2) 30%, transparent 70%)',
                'radial-gradient(circle at center, rgba(59, 130, 246, 0) 0%, transparent 100%)'
              ]
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
        )}
      </AnimatePresence>

      {/* Subtle animated overlay that doesn't change with input */}
      <motion.div
        className="absolute inset-0 opacity-30"
        initial={{
          background: 'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
        }}
        animate={{
          background: [
            'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)'
          ]
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Particle background - static speaker for consistent animation */}
      <DynamicParticleBackground currentSpeaker="user" />

      {/* AI Takeover Overlay */}
      <AITakeoverOverlay show={aiTakeover} />

      {/* Main conversation container with proper flex layout */}
      <div className="relative z-10 h-full flex flex-col">
        {/* Header - Fixed height */}
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
                <p className="text-sm text-gray-300">Safe Space</p>
              </div>
            </div>
            <TurnIndicator currentTurn={currentTurn} participants={participants} />
          </div>
        </motion.div>

        {/* Messages area - Takes remaining space, properly scrollable */}
        <div className="flex-1 min-h-0 overflow-hidden">
          <MessageList 
            ref={messageListRef}
            messages={messages}
            participants={participants}
            currentTurn={currentTurn}
            thinking={thinking}
            aiTakeover={aiTakeover}
          />
          <div ref={messagesEndRef} />
        </div>

        {/* Input area - Fixed at bottom */}
        <div className="flex-shrink-0">
          <InputArea
            currentTurn={currentTurn}
            participants={participants}
            aiTakeover={aiTakeover}
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