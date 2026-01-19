
import React from 'react';
import { Link } from 'react-router-dom';
import { Network, Target, TrendingUp } from 'lucide-react';
import { Article, Product } from '../../../../../types';
import { slugify } from '../../../../../utils';
import { SidebarProductCard } from '../../cards';

interface RightSidebarProps {
    relatedArticles: Article[];
    relatedTitle: string;
    recommendedProducts: Product[];
    recTitle: string;
    RecIcon: any;
    waNumber: string;
}

export const RightSidebar = ({ 
    relatedArticles, 
    relatedTitle, 
    recommendedProducts, 
    recTitle, 
    RecIcon, 
    waNumber 
}: RightSidebarProps) => {
    return (
        <div className="sticky top-28 space-y-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {/* Related Articles */}
            {relatedArticles.length > 0 && (
                <div className="bg-brand-card border border-white/5 rounded-xl p-5 shadow-lg">
                    <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
                        <Network size={16} className="text-brand-orange" />
                        <h5 className="text-xs font-bold text-white uppercase tracking-widest">{relatedTitle}</h5>
                    </div>
                    <div className="space-y-4">
                        {relatedArticles.map(a => (
                            <Link to={`/articles/${slugify(a.title)}`} key={a.id} className="block group">
                                <h6 className="text-xs font-bold text-gray-300 group-hover:text-brand-orange transition-colors line-clamp-2 mb-1">
                                    {a.title}
                                </h6>
                                <div className="flex items-center gap-2 text-[10px] text-gray-600">
                                    <span>{a.date}</span><span>•</span><span>{a.readTime}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {/* Recommended Products */}
            <div>
                <div className="flex items-center gap-2 border-b border-white/10 pb-3 mb-4">
                    <RecIcon size={16} className="text-brand-orange" />
                    <h5 className="text-xs font-bold text-white uppercase tracking-widest">{recTitle}</h5>
                </div>
                <div className="space-y-4">
                    {recommendedProducts.map((p: Product) => (
                        <SidebarProductCard 
                            key={p.id}
                            product={p} 
                            onDetail={() => window.open(`https://wa.me/${waNumber}?text=Halo, saya tertarik dengan produk ${p.name} yang ada di artikel ${window.location.href}`, '_blank')} 
                            waNumber={waNumber} 
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};
