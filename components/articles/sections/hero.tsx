import React from 'react';
import { ArrowRight, Clock } from 'lucide-react';
import { Article } from '../../types';
import { optimizeImage } from '../../../utils';

const getPureCategory = (category: string) => {
  if (!category) return "Featured";
  return category.split(',').map(c => c.split('>').pop()?.trim()).filter(Boolean).join(', ');
};

export const FeaturedArticleHero = ({ article, onClick }: { article: Article, onClick: () => void }) => (
  <div onClick={onClick} className="group relative w-full h-[500px] rounded-3xl overflow-hidden cursor-pointer border border-white/5 hover:border-brand-orange/50 transition-all shadow-2xl mb-16">
    <img 
        src={optimizeImage(article.image, 1200)} 
        alt={article.title} 
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
        loading="eager" 
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>
    <div className="absolute top-8 right-8">
        <div className="bg-red-600 text-white font-bold px-4 py-2 rounded-lg shadow-neon animate-pulse text-xs uppercase tracking-widest border border-red-400">Wajib Baca Bos</div>
    </div>
    <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full md:w-2/3">
      <div className="flex items-center gap-3 mb-4"><span className="px-3 py-1 bg-brand-orange text-white text-xs font-bold rounded-full uppercase tracking-wider">{getPureCategory(article.category)}</span><span className="flex items-center gap-1 text-gray-300 text-xs font-bold"><Clock size={12} /> {article.readTime || "3 min read"}</span></div>
      <h2 className="text-3xl md:text-5xl font-display font-bold text-white mb-4 leading-tight group-hover:text-brand-orange transition-colors">{article.title}</h2>
      <p className="text-gray-300 text-lg line-clamp-2 mb-6 opacity-90">{article.excerpt}</p>
      <div className="flex items-center gap-2 text-white font-bold uppercase tracking-widest text-sm group-hover:gap-4 transition-all bg-brand-orange/20 w-fit px-4 py-2 rounded-lg border border-brand-orange/30 group-hover:bg-brand-orange group-hover:text-white">Bongkar Isinya <ArrowRight size={16} /></div>
    </div>
  </div>
);