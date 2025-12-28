
import React, { useRef, useEffect } from 'react';
import { Send, Eraser, Terminal, Bot } from 'lucide-react';
import { ChatBubble, TypingIndicator } from './atoms';
import { Message } from './logic';

// --- 1. CHAT HEADER ---
export const ChatHeader = ({ 
  onClear, 
  isAdmin = false 
}: { 
  onClear: () => void, 
  isAdmin?: boolean 
}) => (
  <div className={`h-16 backdrop-blur-md border-b flex items-center justify-between px-4 shrink-0 rounded-t-2xl transition-colors ${
    isAdmin 
      ? 'bg-red-950/90 border-red-500/30' 
      : 'bg-brand-dark/95 border-white/10'
  }`}>
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg ${
          isAdmin 
            ? 'bg-gradient-to-tr from-red-600 to-orange-600' 
            : 'bg-gradient-to-tr from-teal-500 to-blue-600'
        }`}>
          {isAdmin ? <Terminal className="text-white w-5 h-5" /> : <Bot className="text-white w-6 h-6" />}
        </div>
        <div className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 border-2 border-brand-dark rounded-full ${
          isAdmin ? 'bg-blue-400 animate-pulse' : 'bg-green-500'
        }`}></div>
      </div>
      <div>
        <h3 className="font-display font-bold text-white text-base flex items-center gap-2">
          {isAdmin ? 'SIBOS ADMIN' : 'SIBOS AI'} 
          <span className={`text-[9px] px-1.5 py-0.5 rounded border ${
            isAdmin 
              ? 'bg-red-500/20 text-red-200 border-red-500/40' 
              : 'bg-green-500/20 text-green-400 border-green-500/30'
          }`}>
            ONLINE
          </span>
        </h3>
        <p className="text-[10px] text-gray-400">
          {isAdmin ? 'Database Control Center' : 'Virtual Assistant'}
        </p>
      </div>
    </div>
    <button 
      onClick={onClear}
      className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-full transition-colors"
      title="Hapus Chat"
    >
      <Eraser size={18} />
    </button>
  </div>
);

// --- 2. MESSAGE LIST AREA ---
export const MessageList = ({ 
  messages, 
  isTyping 
}: { 
  messages: Message[], 
  isTyping: boolean 
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-brand-card/50">
      {/* Intro Timestamp */}
      <div className="text-center my-4">
        <span className="text-[10px] text-gray-500 bg-white/5 px-2 py-1 rounded-full">Hari ini</span>
      </div>

      {messages.map((msg) => (
        <React.Fragment key={msg.id}>
          <ChatBubble 
            role={msg.role} 
            text={msg.text} 
            time={msg.time} 
          />
        </React.Fragment>
      ))}

      {isTyping && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  );
};

// --- 3. INPUT AREA (Simplified - No Image) ---
export const ChatInputArea = ({ 
  input, 
  setInput, 
  onSend,
  disabled
}: { 
  input: string, 
  setInput: (v: string) => void, 
  onSend: () => void,
  disabled: boolean
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="pb-3 pt-1 bg-brand-dark border-t border-white/10 shrink-0 rounded-b-2xl">
      <div className="px-3 flex items-end gap-2">
        {/* Text Area */}
        <div className="flex-1 relative bg-black/40 border border-white/10 rounded-xl focus-within:border-brand-orange/50 transition-colors flex items-end">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ketik pesan..."
            disabled={disabled}
            className="w-full bg-transparent text-sm text-white placeholder-gray-500 resize-none outline-none max-h-24 py-3 px-3 custom-scrollbar disabled:opacity-50"
            rows={1}
            style={{ minHeight: '44px' }}
          />
        </div>

        {/* Send Button */}
        <button 
          onClick={onSend}
          disabled={!input.trim() || disabled}
          // UPDATED: bg-brand-action (Orange) for Send button
          className="p-3 bg-brand-action text-white rounded-xl hover:bg-brand-actionGlow disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-action"
        >
          <Send size={20} />
        </button>
      </div>
      
      <div className="text-center mt-2">
        <p className="text-[9px] text-gray-600">Powered by Gemini AI • PT Mesin Kasir Solo</p>
      </div>
    </div>
  );
};
