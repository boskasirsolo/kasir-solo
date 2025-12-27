
import React from 'react';
import { MessageSquare, X, Send, Bot, User as UserIcon, ExternalLink } from 'lucide-react';

// --- HELPER: MARKDOWN & LINK RENDERER ---
const renderFormattedText = (text: string) => {
  // 1. Split by newlines
  return text.split('\n').map((line, lineIdx) => {
    // 2. Split by bold markers (**)
    const parts = line.split(/(\*\*.*?\*\*)/g);
    
    return (
      <div key={lineIdx} className={`${line.trim() === '' ? 'h-2' : 'min-h-[1.2em]'}`}>
        {parts.map((part, partIdx) => {
          // Handle Bold
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={partIdx} className="font-bold text-brand-orange">{part.slice(2, -2)}</strong>;
          }

          // Handle URLs inside normal text
          // Regex menangkap http/https/www
          const urlRegex = /((?:https?:\/\/|www\.)[^\s]+)/g;
          const subParts = part.split(urlRegex);

          return (
            <span key={partIdx}>
              {subParts.map((subPart, subIdx) => {
                if (urlRegex.test(subPart)) {
                   const href = subPart.startsWith('www.') ? `http://${subPart}` : subPart;
                   return (
                     <a 
                       key={subIdx} 
                       href={href} 
                       target="_blank" 
                       rel="noreferrer" 
                       className="text-blue-400 hover:text-blue-300 underline underline-offset-2 break-all inline-flex items-center gap-0.5"
                     >
                       {subPart} <ExternalLink size={10} />
                     </a>
                   );
                }
                return subPart;
              })}
            </span>
          );
        })}
      </div>
    );
  });
};

// --- 1. FLOATING TRIGGER BUTTON ---
export const SibosTrigger = ({ 
  onClick, 
  isOpen, 
  unreadCount 
}: { 
  onClick: () => void, 
  isOpen: boolean, 
  unreadCount: number 
}) => (
  <button
    onClick={onClick}
    className={`fixed bottom-6 right-6 z-[9990] w-14 h-14 rounded-full shadow-neon-strong flex items-center justify-center transition-all duration-300 hover:scale-110 ${
      isOpen ? 'bg-brand-dark border border-brand-orange text-brand-orange' : 'bg-brand-orange text-white'
    }`}
  >
    {isOpen ? <X size={24} /> : <Bot size={28} />}
    
    {/* Notification Badge */}
    {!isOpen && unreadCount > 0 && (
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-brand-black animate-bounce">
        {unreadCount}
      </span>
    )}
  </button>
);

// --- 2. CHAT BUBBLE ---
export const ChatBubble = ({ 
  role, 
  text, 
  time 
}: { 
  role: 'user' | 'assistant', 
  text: string, 
  time: string 
}) => {
  const isUser = role === 'user';
  
  return (
    <div className={`flex w-full mb-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] md:max-w-[75%] gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
          isUser ? 'bg-brand-orange/20 border-brand-orange/50 text-brand-orange' : 'bg-teal-500/20 border-teal-500/50 text-teal-500'
        }`}>
          {isUser ? <UserIcon size={14} /> : <Bot size={16} />}
        </div>

        {/* Bubble Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
            isUser 
              ? 'bg-brand-orange text-white rounded-tr-none' 
              : 'bg-white/10 text-gray-200 border border-white/5 rounded-tl-none backdrop-blur-sm'
          }`}>
             {isUser ? text : renderFormattedText(text)}
          </div>
          <span className="text-[10px] text-gray-500 mt-1 px-1">{time}</span>
        </div>

      </div>
    </div>
  );
};

// --- 3. TYPING INDICATOR ---
export const TypingIndicator = () => (
  <div className="flex w-full mb-4 justify-start animate-fade-in">
    <div className="flex max-w-[85%] gap-2">
      <div className="w-8 h-8 rounded-full bg-teal-500/20 border border-teal-500/50 text-teal-500 flex items-center justify-center shrink-0">
        <Bot size={16} />
      </div>
      <div className="px-4 py-3 rounded-2xl rounded-tl-none bg-white/10 border border-white/5 flex items-center gap-1">
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  </div>
);
