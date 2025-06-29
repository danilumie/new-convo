'use client';

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import Message from './Message';
import TypingIndicator from './TypingIndicator';
import type { Message as MessageType, ParticipantType } from './ConversationView';

interface MessageListProps {
  messages: MessageType[];
  participants: Record<ParticipantType, { name: string; color: string; theme: string }>;
  currentTurn: ParticipantType;
  thinking: ParticipantType | null;
  aiTakeover: boolean;
}

const MessageList = forwardRef<HTMLDivElement, MessageListProps>(function MessageList({ 
  messages, 
  participants, 
  currentTurn, 
  thinking,
  aiTakeover 
}, ref) {
  return (
    <div 
      ref={ref}
      className="h-full overflow-y-auto scroll-smooth"
      style={{
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <div className="px-4 py-6 space-y-4">
        {messages.map((message, index) => (
          <Message
            key={message.id}
            message={message}
            participants={participants}
            isRecent={index >= messages.length - 3}
            aiTakeover={aiTakeover}
            thinking={thinking}
          />
        ))}
        
        {thinking && (
          <TypingIndicator 
            participant={thinking}
            participants={participants}
          />
        )}
        
        {/* Bottom padding to ensure last message is never cut off */}
        <div className="h-8" />
      </div>
    </div>
  );
});

export default MessageList;