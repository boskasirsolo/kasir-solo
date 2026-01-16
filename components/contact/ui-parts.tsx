
import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { sanitizeHtml } from '../../utils';

export const ContactItem = ({ icon: Icon, title, value, sub, action }: { icon: any, title: string, value: string, sub?: string, action?: () => void }) => (
  <div onClick={action} className={`flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 transition-all ${action ? 'cursor-pointer group hover:border-brand-orange/30' : ''}`}>
    <div className="w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center text-brand-orange border border-white/10 group-hover:scale-110 transition-transform">
      <Icon size={20} />
    </div>
    <div>
      <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{title}</h4>
      <p className="text-white font-bold text-base md:text-lg leading-tight truncate max-w-[250px]">{value}</p>
      {sub && <p className="text-gray-500 text-xs mt-1">{sub}</p>}
    </div>
  </div>
);

export const FaqAccordion = ({ q, a }: { q: string, a: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border-b border-white/10 last:border-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-4 flex justify-between items-center gap-4 text-gray-300 hover:text-brand-orange transition-colors"
      >
        <span className="font-bold text-sm md:text-base italic">"{q}"</span>
        <ArrowRight size={16} className={`transition-transform duration-300 ${isOpen ? 'rotate-90 text-brand-orange' : 'text-gray-600'}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-40 opacity-100 pb-4' : 'max-h-0 opacity-0'}`}>
        <p className="text-gray-400 text-sm leading-relaxed pl-4 border-l-2 border-brand-orange/20">
          <strong className="text-brand-orange">Jawab:</strong> {a}
        </p>
      </div>
    </div>
  );
};

export const MapEmbed = ({ embedCode, title, fallbackImage }: { embedCode?: string, title: string, fallbackImage: string }) => {
    if (!embedCode || embedCode.length < 10) {
        return <img src={fallbackImage} className="w-full h-full object-cover opacity-40 group-hover:opacity-30 transition-opacity" alt={title} />;
    }

    // SECURITY: Strictly filter the embed code. 
    // We only allow iframes that point to google.com/maps
    if (!embedCode.includes('google.com/maps')) {
        return <div className="w-full h-full flex items-center justify-center bg-red-900/20 text-red-500 text-[10px] font-bold p-4 text-center">INVALID MAP SOURCE</div>;
    }

    const safeEmbed = sanitizeHtml(embedCode);

    const cleanEmbed = safeEmbed
        .replace(/width="[^"]*"/g, 'width="100%"')
        .replace(/height="[^"]*"/g, 'height="100%"')
        .replace(/style="[^"]*"/g, 'style="border:0;"');

    return (
        <div 
            className="w-full h-full opacity-60 group-hover:opacity-100 transition-opacity iframe-map-container"
            dangerouslySetInnerHTML={{ __html: cleanEmbed }} 
        />
    );
};
