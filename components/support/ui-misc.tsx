
import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { FAQ } from '../../types';

export const FaqItem = ({ item }: { item: FAQ }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-white/5 rounded-lg bg-brand-card/30 overflow-hidden mb-2">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left p-3 flex justify-between items-center text-xs font-bold text-gray-300 hover:text-white hover:bg-white/5 transition-all"
      >
        <span className="line-clamp-2 flex-1 pr-2">{item.question}</span>
        <ChevronRight size={14} className={`transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-90 text-brand-orange' : 'text-gray-600'}`} />
      </button>
      <div className={`bg-black/20 px-3 text-[10px] text-gray-400 leading-relaxed border-t border-white/5 transition-all duration-300 ${isOpen ? 'max-h-40 py-3 opacity-100' : 'max-h-0 py-0 opacity-0'}`}>
        {item.answer}
      </div>
    </div>
  );
};

export const SimplePagination = ({ page, totalPages, setPage }: { page: number, totalPages: number, setPage: (p: number) => void }) => {
    if (totalPages <= 1) return null;
    return (
        <div className="flex justify-center gap-2 mt-4">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30"><ChevronLeft size={14} className="text-white"/></button>
            <span className="text-[10px] text-gray-400 py-1">{page}/{totalPages}</span>
            <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="p-1 rounded bg-white/5 hover:bg-white/10 disabled:opacity-30"><ChevronRight size={14} className="text-white"/></button>
        </div>
    );
};

export const CategoryTabs = ({ activeTab, onChange }: { activeTab: string, onChange: (t: string) => void }) => (
    <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1 sm:pb-0">
        {['all', 'driver', 'software', 'manual', 'tools'].map(tab => (
            <button
                key={tab}
                onClick={() => onChange(tab)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all whitespace-nowrap border ${
                    activeTab === tab
                    ? 'bg-brand-orange text-white border-brand-orange shadow-neon-text'
                    : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                }`}
            >
                {tab === 'all' ? 'Semua' : tab}
            </button>
        ))}
    </div>
);
