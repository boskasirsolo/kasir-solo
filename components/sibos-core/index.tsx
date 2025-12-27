
import React from 'react';
import { SibosTrigger } from './atoms';
import { ChatHeader, MessageList, ChatInputArea } from './molecules';
import { useSibosChat } from './logic';
import { Product } from '../../types';

export const SibosWidget = ({ 
  products, 
  isAdmin = false 
}: { 
  products: Product[], 
  isAdmin?: boolean 
}) => {
  const {
    isOpen,
    toggleChat,
    unreadCount,
    messages,
    isTyping,
    inputValue,
    setInputValue,
    handleSendMessage,
    clearChat
  } = useSibosChat(products, isAdmin);

  return (
    <>
      {/* 1. CHAT WINDOW (Fixed Position) */}
      <div 
        className={`fixed bottom-24 right-4 md:right-6 w-[90vw] md:w-[380px] h-[500px] max-h-[70vh] flex flex-col bg-brand-card rounded-2xl shadow-2xl z-[9990] transition-all duration-300 origin-bottom-right ${
          isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-10 pointer-events-none'
        } ${isAdmin ? 'border-2 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]' : 'border border-brand-orange/30'}`}
      >
        <ChatHeader onClear={clearChat} isAdmin={isAdmin} />
        <MessageList messages={messages} isTyping={isTyping} />
        <ChatInputArea 
          input={inputValue} 
          setInput={setInputValue} 
          onSend={handleSendMessage} 
          disabled={isTyping}
        />
      </div>

      {/* 2. TRIGGER BUTTON */}
      <SibosTrigger 
        onClick={toggleChat} 
        isOpen={isOpen} 
        unreadCount={unreadCount} 
      />
    </>
  );
};
