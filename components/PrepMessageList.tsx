'use client';

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import PrepMessage from './PrepMessage';
import PrepTypingIndicator from './PrepTypingIndicator';
import type { PrepMessage as PrepMessageType, PrepPhase } from './PrepPhaseView';

interface PrepMessageListProps {
  messages: PrepMessageType[];
  thinking: boolean;
  currentPhase: PrepPhase;
}

const PrepMessageList = forwardRef<HTMLDivElement, PrepMessageListProps>(function PrepMessageList({ 
  messages, 
  thinking,
  currentPhase
}, ref) {
  return (
    <div 
      ref={ref}
      className="h-full overflow-y-auto scroll-smooth px-6 py-8"
      style={{
        scrollBehavior: 'smooth',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      <div className="space-y-6 max-w-3xl mx-auto">
        {messages.map((message, index) => (
          <PrepMessage
            key={message.id}
            message={message}
            isRecent={index >= messages.length - 2}
          />
        ))}
        
        {thinking && (
          <PrepTypingIndicator />
        )}
        
        {/* Extra bottom padding */}
        <div className="h-12" />
      </div>
    </div>
  );
});

export default PrepMessageList;