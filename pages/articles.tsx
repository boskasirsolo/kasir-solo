
import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Article } from '../types';
import { SectionHeader, Card } from '../components/ui';

export const ArticlesPage = ({ articles }: { articles: Article[] }) => (
  <div className="container mx-auto px-4 py-10 animate-fade-in">
    <SectionHeader title="Artikel &" highlight="Wawasan" subtitle="Edukasi pengelolaan bisnis modern dan tips teknologi" />
    <div className="space-y-10 max-w-4xl mx-auto">
      {articles.map((article) => (
        <Card key={article.id} className="flex flex-col md:flex-row rounded-3xl" hoverEffect={true}>
          <div className="md:w-2/5 h-64 md:h-auto overflow-hidden relative">
            <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div className="absolute inset-0 bg-brand-orange/10 mix-blend-overlay group-hover:bg-transparent transition-colors"></div>
          </div>
          <div className="p-10 md:w-3/5 flex flex-col justify-center">
            <div className="text-brand-orange text-xs font-bold tracking-widest mb-3 uppercase flex items-center gap-2">
               <div className="w-8 h-[2px] bg-brand-orange"></div> {article.date}
            </div>
            <h3 className="text-3xl font-bold text-white mb-4 leading-tight">{article.title}</h3>
            <p className="text-gray-400 mb-8 leading-relaxed">{article.excerpt}</p>
            <button className="text-white text-sm font-bold flex items-center gap-2 hover:gap-4 transition-all uppercase tracking-wider group/btn">
              BACA ARTIKEL <ArrowRight size={18} className="text-brand-orange group-hover/btn:drop-shadow-neon" />
            </button>
          </div>
        </Card>
      ))}
    </div>
  </div>
);
