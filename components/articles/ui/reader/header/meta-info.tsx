
import React from 'react';
import { Calendar, Clock } from 'lucide-react';
import { GodModeBadge } from './god-mode-badge';

const getPureCategory = (category: string) => {
  if (!category) return "General";
  return category.split(',').map(c => c.split('>').pop()?.trim()).filter(Boolean).join(', ');
};

interface MetaInfoProps {
    article: {
        category: string;
        date: string;
        readTime: string;
    };
    adminStats: number | null;
}

export const MetaInfo = ({ article, adminStats }: MetaInfoProps) => {
    return (
        <div className="flex flex-wrap gap-3 mb-4">
            <span className="px-3 py-1 bg-brand-orange text-white text-xs font-bold rounded-full shadow-neon">
                {getPureCategory(article.category)}
            </span>
            <span className="flex items-center gap-2 text-gray-200 text-xs font-bold bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                <Calendar size={12} /> {article.date}
            </span>
            <span className="flex items-center gap-2 text-gray-200 text-xs font-bold bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                <Clock size={12} /> {article.readTime}
            </span>
            <GodModeBadge views={adminStats} />
        </div>
    );
};
