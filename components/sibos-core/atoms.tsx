
import React from 'react';
import { MessageSquare, X, Send, Bot, User as UserIcon, ExternalLink, Image as ImageIcon } from 'lucide-react';

// --- HELPER: INLINE TEXT PARSER (Bold, Italic, Links) ---
const parseCellContent = (text: string) => {
  // Split by double asterisks (Bold) OR single asterisks (Italic)
  // Regex explanation: Match **...** OR *...*
  const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
  
  return (
    <>
      {parts.map((part, partIdx) => {
        // 1. Handle Bold (**text**)
        if (part.startsWith('**') && part.endsWith('**') && part.length >= 4) {
          return <strong key={partIdx} className="font-bold text-brand-orange">{part.slice(2, -2)}</strong>;
        }

        // 2. Handle Italic (*text*) -> Render as orange italic for emphasis
        if (part.startsWith('*') && part.endsWith('*') && part.length >= 2) {
          return <em key={partIdx} className="italic text-brand-orange/90 font-medium">{part.slice(1, -1)}</em>;
        }

        // 3. Handle URLs inside normal text
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
                     aria-label={`Link ke ${subPart}`}
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
    </>
  );
};

// --- HELPER: MARKDOWN TABLE COMPONENT ---
const MarkdownTable: React.FC<{ lines: string[] }> = ({ lines }) => {
  if (lines.length < 2) return null;

  // Header is usually the first row
  const headerLine = lines[0];
  // Separator is the second row (e.g., |---|---|)
  const separatorLine = lines[1];

  // Helper to split row by pipe, handling escaped pipes if necessary (simple version here)
  const splitRow = (row: string) => {
    return row.split('|').map(c => c.trim()).filter((c, i, arr) => {
      // Filter out empty strings at start/end often caused by | start | end |
      if (i === 0 && c === '') return false;
      if (i === arr.length - 1 && c === '') return false;
      return true;
    });
  };

  const headers = splitRow(headerLine);
  
  // Basic validation: Separator should contain dashes
  if (!separatorLine.includes('-')) {
     return (
       <div className="whitespace-pre-wrap font-mono text-xs bg-black/20 p-2 rounded mb-2">
         {lines.join('\n')}
       </div>
     );
  }

  const bodyRows = lines.slice(2);

  return (
    <div className="my-3 overflow-x-auto rounded-lg border border-white/10 shadow-sm">
      <table className="w-full text-sm text-left border-collapse min-w-max">
        <thead className="bg-white/5 text-brand-orange uppercase text-[10px] font-bold tracking-wider">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-3 py-2 border-b border-white/10 whitespace-nowrap">
                {parseCellContent(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {bodyRows.map((row, rIdx) => {
            const cells = splitRow(row);
            return (
              <tr key={rIdx} className="hover:bg-white/5 transition-colors">
                {cells.map((c, cIdx) => (
                  <td key={cIdx} className="px-3 py-2 border-r border-white/5 last:border-0 align-top text-gray-300">
                    {parseCellContent(c)}
                  </td>
                ))}
                {/* Fill empty cells if row is short */}
                {cells.length < headers.length && 
                   [...Array(headers.length - cells.length)].map((_, i) => <td key={`empty-${i}`} className="px-3 py-2 border-r border-white/5"></td>)
                }
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

// --- HELPER: MAIN RENDERER ---
const renderFormattedText = (text: string) => {
  if (!text) return null;
  
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];
  let tableBuffer: string[] = [];
  
  const flushTable = () => {
    if (tableBuffer.length > 0) {
       elements.push(<MarkdownTable key={`table-${elements.length}`} lines={tableBuffer} />);
       tableBuffer = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detect Table Row: Starts with | and has another | somewhere, or is a separator |---|
    // Simple Heuristic: Starts with | and ends with | (ignoring spaces)
    if (line.startsWith('|') && (line.endsWith('|') || line.length > 2)) {
      tableBuffer.push(line);
    } else {
      flushTable();
      
      // Render normal line (handle empty lines as spacing)
      if (lines[i].trim() === '') {
        elements.push(<div key={`line-${i}`} className="h-2"></div>);
      } else {
        elements.push(
          <div key={`line-${i}`} className="min-h-[1.2em] break-words">
            {parseCellContent(lines[i])}
          </div>
        );
      }
    }
  }
  flushTable(); // Flush any remaining table at the end

  return elements;
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
  // UPDATED: bg-brand-gradient for trigger button
  <button
    onClick={onClick}
    aria-label={isOpen ? "Tutup Chat" : "Buka Chat dengan SIBOS AI"}
    className={`fixed bottom-6 right-6 z-[9990] w-14 h-14 rounded-full shadow-action-strong flex items-center justify-center transition-all duration-300 hover:scale-110 ${
      isOpen ? 'bg-brand-dark border border-brand-orange text-brand-orange' : 'bg-brand-gradient text-white'
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
  time,
  image
}: { 
  role: 'user' | 'assistant', 
  text: string, 
  time: string,
  image?: string
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
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} min-w-0 max-w-full`}>
          <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm flex flex-col gap-2 w-full overflow-hidden ${
            isUser 
              ? 'bg-brand-orange text-white rounded-tr-none' 
              : 'bg-white/10 text-gray-200 border border-white/5 rounded-tl-none backdrop-blur-sm'
          }`}>
             {image && (
               <div className="mb-2 rounded-lg overflow-hidden border border-white/20">
                 <img src={image} alt="User upload" className="max-w-full h-auto max-h-40 object-cover" />
               </div>
             )}
             {/* Text Content */}
             <div className="w-full">
               {isUser ? text : renderFormattedText(text)}
             </div>
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

// --- 4. IMAGE PREVIEW ---
export const ImagePreview = ({ 
  image, 
  onRemove 
}: { 
  image: string, 
  onRemove: () => void 
}) => (
  <div className="mx-4 mb-2 p-2 bg-brand-dark/80 border border-white/10 rounded-lg flex items-center justify-between animate-fade-in">
    <div className="flex items-center gap-3 overflow-hidden">
      <div className="w-10 h-10 rounded bg-black border border-white/10 overflow-hidden shrink-0">
        <img src={image} alt="Preview" className="w-full h-full object-cover" />
      </div>
      <span className="text-xs text-brand-orange font-bold truncate">Gambar terlampir</span>
    </div>
    <button 
      onClick={onRemove} 
      aria-label="Hapus gambar"
      className="p-1 hover:bg-white/10 rounded-full text-gray-400 hover:text-red-500 transition-colors"
    >
      <X size={16} />
    </button>
  </div>
);
